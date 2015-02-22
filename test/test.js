var stream = require('stream');
var PassThrough = stream.PassThrough || require('readable-stream').PassThrough;

var EventTransmitter = require('../main');
// var et = new EventTransmitter();

var brake = require('brake');

exports['Exported Properly'] = function(test) {
    test.expect(4);

    var et = new EventTransmitter();

    test.equal(typeof EventTransmitter, 'function');
    test.equal(typeof et, 'object');
    test.equal(typeof et.listen, 'function');
    test.equal(typeof et.transmit, 'function');

    test.done();
};

exports['New In'] = function(test) {

    test.expect(1);

    var et = new EventTransmitter();

    var listener = et.listen();
    test.equal(typeof listener, 'object');

    test.done();
};

exports['Test Parse'] = function(test) {
    test.expect(6);

    var passthroughA = new PassThrough(); // dummy
    var passthroughB = new PassThrough(); // dummy

    var et = new EventTransmitter();
    var listener = et.listen();

    listener.on('header', function(header) {

        console.log("header", header);
        test.equal(typeof header, 'object');
        test.equal(header.name, 'streamA');
        test.equal(header.metadata[0], 23);
        test.equal(header.metadata[3], 222);
    });

    listener.on('footer', function(footer) {
        test.equal(typeof footer, 'object');
        test.equal(footer.exit_code, 2);
        test.done();
    });

    listener.on('data', function(data) {
        console.log('Stream Data:', data.toString()); // sanitized stream data without header and footer data in buffer
    });

    passthroughA.pipe(et).pipe(passthroughB);
    passthroughB.pipe(listener);

    // passthroughA.write('Testing... 123');
    // passthroughA.end("...Ending");

    et.transmit('header', {
        name: "streamA",
        metadata: [23, 33, 221, 222]
    });

    et.transmit('footer', {
        exit_code: 2
    });
};


// exports['No Header or Footer'] = function(test) {
//     test.expect(1);

//     var passthroughA = new PassThrough(); // dummy
//     var passthroughB = new PassThrough(); // dummy

//     var et = new EventTransmitter();
//     var listener = et.listen();

//     listener.on('header', function(header) {
//         console.log("HEADER", header);
//         test.equal(false, true);
//     });

//     listener.on('footer', function(footer) {
//         console.log("Footer", footer);
//         test.equal(false, true);
//     });

//     listener.on('data', function(data) {
//         console.log('Stream Data:', data.toString()); // sanitized stream data without header and footer data in buffer
//     });

//     listener.on('end', function() {
//         test.equal(true, true);
//         test.done();
//     });

//     passthroughA.pipe(et).pipe(passthroughB);
//     passthroughB.pipe(listener);

//     passthroughA.write('Testing... 123');
//     passthroughA.end("...Ending");
// };

// exports['No Footer'] = function(test) {
//     test.expect(5);

//     var passthroughA = new PassThrough(); // dummy
//     var passthroughB = new PassThrough(); // dummy

//     var et = new EventTransmitter();
//     var listener = et.listen();

//     et.header = {
//         name: "streamA",
//         metadata: [23, 33, 221, 222]
//     };

//     listener.on('header', function(header) {
//         test.equal(typeof header, 'object');
//         test.equal(header.name, 'streamA');
//         test.equal(header.metadata[0], 23);
//         test.equal(header.metadata[3], 222);
//     });

//     listener.on('footer', function(footer) {
//         console.log("Footer", footer);
//         test.equal(false, true);
//     });

//     listener.on('data', function(data) {
//         console.log('Stream Data:', data.toString()); // sanitized stream data without header and footer data in buffer
//     });

//     listener.on('end', function() {
//         test.equal(true, true);
//         test.done();
//     });

//     passthroughA.pipe(et).pipe(passthroughB);
//     passthroughB.pipe(listener);

//     passthroughA.write('Testing... 123');
//     passthroughA.end("...Ending");
// };

// exports['No Header'] = function(test) {
//     test.expect(3);

//     var passthroughA = new PassThrough(); // dummy
//     var passthroughB = new PassThrough(); // dummy

//     var et = new EventTransmitter();

//     et.footer = {
//         exit_code: 2
//     };

//     var listener = et.listen();

//     listener.on('header', function(header) {
//         test.equal(false, true);
//     });

//     listener.on('footer', function(footer) {
//         test.equal(typeof footer, 'object');
//         test.equal(footer.exit_code, 2);
//     });

//     listener.on('end', function() {
//         test.equal(true, true);
//         test.done();
//     });

//     listener.on('data', function(data) {
//         console.log('Stream Data:', data.toString()); // sanitized stream data without header and footer data in buffer
//     });

//     passthroughA.pipe(et).pipe(passthroughB);
//     passthroughB.pipe(listener);

//     passthroughA.write('Testing... 123');
//     passthroughA.end("...Ending");
// };


// exports['Test Braked'] = function(test) {
//     test.expect(6);

//     var passthroughA = new PassThrough(); // dummy
//     var passthroughB = new PassThrough(); // dummy

//     var et = new EventTransmitter();

//     et.header = {
//         name: "streamA",
//         metadata: [23, 33, 221, 222]
//     };
//     et.footer = {
//         exit_code: 2
//     };

//     var listener = et.listen();

//     listener.on('header', function(header) {
//         console.log("Header", header);
//         test.equal(typeof header, 'object');
//         test.equal(header.name, 'streamA');
//         test.equal(header.metadata[0], 23);
//         test.equal(header.metadata[3], 222);
//     });

//     listener.on('footer', function(footer) {
//         console.log("Footer", footer);
//         test.equal(typeof footer, 'object');
//         test.equal(footer.exit_code, 2);
//         test.done();
//     });

//     listener.on('data', function(data) {
//         console.log('Stream Data:', data.toString()); // sanitized stream data without header and footer data in buffer
//     });

//     passthroughA.pipe(et).pipe(passthroughB);
//     passthroughB.pipe(brake(15)).pipe(listener);

//     passthroughA.write('Testing... 123');
//     passthroughA.end("...Ending");
// };


// exports['Test Faster Braked'] = function(test) {
//     test.expect(6);

//     var passthroughA = new PassThrough(); // dummy
//     var passthroughB = new PassThrough(); // dummy

//     var et = new EventTransmitter();

//     et.header = {
//         name: "streamA",
//         metadata: [23, 33, 221, 222]
//     };
//     et.footer = {
//         exit_code: 2
//     };

//     var listener = et.listen();

//     listener.on('header', function(header) {
//         console.log("Header", header);
//         test.equal(typeof header, 'object');
//         test.equal(header.name, 'streamA');
//         test.equal(header.metadata[0], 23);
//         test.equal(header.metadata[3], 222);
//     });

//     listener.on('footer', function(footer) {
//         console.log("Footer", footer);
//         test.equal(typeof footer, 'object');
//         test.equal(footer.exit_code, 2);
//         test.done();
//     });

//     listener.on('data', function(data) {
//         console.log('Stream Data:', data.toString()); // sanitized stream data without header and footer data in buffer
//     });

//     passthroughA.pipe(et).pipe(passthroughB);
//     passthroughB.pipe(brake(5000)).pipe(listener);

//     passthroughA.write('Testing... 123');
//     passthroughA.end("...Ending");
// };

exports['tearDown'] = function(done) {
    done();
};
