var stream = require('stream');
var PassThrough = stream.PassThrough || require('readable-stream').PassThrough;

var EventTransmitter = require('../main');
var brake = require('brake');

exports['Exported Properly'] = function(test) {
    test.expect(5);

    var et = new EventTransmitter();

    test.equal(typeof EventTransmitter, 'function');
    test.equal(typeof et, 'object');
    test.equal(typeof et.listen, 'function');
    test.equal(typeof et.listen(), 'object');
    test.equal(typeof et.transmit, 'function');

    test.done();
};

exports['Transmit'] = function(test) {
    test.expect(1);

    var passthroughA = new PassThrough(); // dummy
    var et = new EventTransmitter();

    et.pipe(passthroughA);

    passthroughA.on('data', function(data) {
        test.equal('<da39a3ee5e>["header",' + JSON.stringify({
            name: "streamA",
            metadata: [23, 33, 221, 222]
        }) + ']<da39a3ee5e>', data.toString());
        test.done();
    });

    et.transmit('header', {
        name: "streamA",
        metadata: [23, 33, 221, 222]
    });
};

exports['Pipe In and Transmit'] = function(test) {
    test.expect(3);

    var passthroughA = new PassThrough(), // dummy
        passthroughB = new PassThrough(), // dummy
        et = new EventTransmitter(),
        count = 0;

    passthroughA.pipe(et).pipe(passthroughB);

    passthroughB.on('data', function(data) {
        count++;
        if (count === 1) {
            test.equal('Testing 123...', data.toString());
        }
        if (count === 2) {
            test.equal('<da39a3ee5e>["header",' + JSON.stringify({
                name: "streamA",
                metadata: [23, 33, 221, 222]
            }) + ']<da39a3ee5e>', data.toString());
        }
        if (count === 3) {
            test.equal('...Ending', data.toString());
            test.done();
        }
    });

    passthroughA.write('Testing 123...');

    setTimeout(function() {
        et.transmit('header', {
            name: "streamA",
            metadata: [23, 33, 221, 222]
        });

        passthroughA.end('...Ending');
    }, 200);
};


exports['Pipe In and Transmit'] = function(test) {
    test.expect(3);

    var passthroughA = new PassThrough(), // dummy
        passthroughB = new PassThrough(), // dummy
        et = new EventTransmitter(),
        count = 0;

    passthroughA.pipe(et).pipe(passthroughB);

    passthroughB.on('data', function(data) {
        count++;
        if (count === 1) {
            test.equal('Testing 123...', data.toString());
        }
        if (count === 2) {
            test.equal('<da39a3ee5e>["header",' + JSON.stringify({
                name: "streamA",
                metadata: [23, 33, 221, 222]
            }) + ']<da39a3ee5e>', data.toString());
        }
        if (count === 3) {
            test.equal('...Ending', data.toString());
            test.done();
        }
    });

    passthroughA.write('Testing 123...');

    et.transmit('header', {
        name: "streamA",
        metadata: [23, 33, 221, 222]
    });

    passthroughA.end('...Ending');
};


exports['Transmit and Emit, single'] = function(test) {
    test.expect(6);

    var et = new EventTransmitter();

    et.pipe(et.listen());

    et.on('header', function(header) {
        test.equal(typeof header, 'object');
        test.equal(header.name, 'streamA');
        test.equal(header.metadata[0], 23);
        test.equal(header.metadata[3], 222);
    });

    et.on('footer', function(footer) {
        test.equal(typeof footer, 'object');
        test.equal(footer.exit_code, 2);
        test.done();
    });

    et.transmit('header', {
        name: "streamA",
        metadata: [23, 33, 221, 222]
    });

    et.transmit('footer', {
        exit_code: 2
    });
};


exports['Arbitrary Number of Arguments'] = function(test) {
    test.expect(6);

    var et = new EventTransmitter()

    et.pipe(et.listen());

    et.on('eventer', function() {
        test.equal(typeof arguments[0], 'object');
        test.equal(typeof arguments[1], 'string');
        test.equal(typeof arguments[2], 'number');
        test.equal(arguments[0].name, 'streamA');
        test.equal(arguments[0].metadata[0], 23);
        test.equal(arguments[0].metadata[3], 222);
        test.done();
    });

    et.transmit('eventer', {
        name: "streamA",
        metadata: [23, 33, 221, 222]
    }, '76', 76);
};

exports['Sanitation'] = function(test) {
    test.expect(4);

    var passthroughA = new PassThrough(), // dummy
        passthroughB = new PassThrough(), // dummy
        passthroughC = new PassThrough(), // dummy
        et = new EventTransmitter(),
        count = 0;

    passthroughA.pipe(et).pipe(passthroughB).pipe(et.listen()).pipe(passthroughC);

    passthroughC.on('data', function(data) {
        count++;
        if (count === 1) {
            test.equal(data.toString(), 'Testing... 123');
        }
        if (count === 2) {
            test.equal(data.toString(), 'Testing Embedded');
        }
        if (count === 3) {
            test.equal(data.toString(), 'Code to be removed and sanitized');
        }
        if (count === 4) {
            test.equal(data.toString(), '...Ending');
            test.done();
        }
    });

    passthroughA.write('Testing... 123');

    et.transmit('eventer', {
        name: "streamA",
        metadata: [23, 33, 221, 222]
    });

    passthroughA.write('Testing Embedded<da39a3ee5e>["footer",{"exit_code":2}]<da39a3ee5e>Code to be removed and sanitized');

    passthroughA.end("...Ending");
};


exports['Braked'] = function(test) {

    var expected = 'Testing... 123Testing EmbeddedCode to be removed and sanitized...Ending';

    test.expect(expected.length + 2);

    var passthroughA = new PassThrough(), // dummy
        passthroughB = new PassThrough(), // dummy
        passthroughC = new PassThrough(), // dummy
        et = new EventTransmitter(),
        count = 0;

    passthroughA.pipe(et).pipe(passthroughB).pipe(brake(150)).pipe(et.listen()).pipe(passthroughC);

    et.on('eventer', function(header) {
        test.equal(header.name, 'streamA');
        test.equal(typeof header.metadata, 'object');
    });

    passthroughC.on('data', function(data) {

        test.equal(expected.substr(count, data.toString().length), data.toString());

        for (var i = 1; i < data.toString().length; i++) {
            test.equal(true, true); // to match expected test count
        }

        console.log(count, expected.substr(count, data.toString().length), data.toString());
        count += data.toString().length;
        if (count === expected.length) {
            test.done();
        }
    });

    passthroughA.write('Testing... 123');

    et.transmit('eventer', {
        name: "streamA",
        metadata: [23, 33, 221, 222]
    });

    passthroughA.write('Testing Embedded<da39a3ee5e>["footer",{"exit_code":2}]<da39a3ee5e>Code to be removed and sanitized');

    passthroughA.end("...Ending");
};

exports['tearDown'] = function(done) {
    done();
};
