var stream = require('stream');
var brake = require('brake');

var EventTransmitter = require('../main');
var PassThrough = stream.PassThrough || require('readable-stream').PassThrough;

describe("EventTransmitter Tests", function() {

    var et = new EventTransmitter();
    var passthroughA = new PassThrough();

    et.pipe(passthroughA);

    it("Exported OK", function() {
        expect(typeof EventTransmitter).to.equal('function');
        expect(typeof et).to.equal('object');
        expect(typeof et.listen).to.equal('function');
        expect(typeof et.listen()).to.equal('object');
        expect(typeof et.transmit).to.equal('function');
    });

    it("Transmit", function() {
        passthroughA.on('data', function(data) {
            expect('<da39a3ee5e>["header",' + JSON.stringify({
                name: "streamA",
                metadata: [23, 33, 221, 222]
            }) + ']<da39a3ee5e>').to.equal(data.toString());
        });

        et.transmit('header', {
            name: "streamA",
            metadata: [23, 33, 221, 222]
        });
    });
});

describe("Pipe In and Transmit", function() {

    var passthroughA = new PassThrough(), // dummy
        passthroughB = new PassThrough(), // dummy
        et = new EventTransmitter(),
        count = 0;

    passthroughA.pipe(et).pipe(passthroughB);

    it("Write Through", function(done) {

        passthroughB.on('data', function(data) {
            count++;
            if (count === 1) {

                expect('Testing 123...').to.equal(data.toString());

            }
            if (count === 2) {
                expect('<da39a3ee5e>["header",' + JSON.stringify({
                    name: "streamA",
                    metadata: [23, 33, 221, 222]
                }) + ']<da39a3ee5e>').to.equal(data.toString());
            }
            if (count === 3) {
                expect('...Ending').to.equal(data.toString());
                done();
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

    });
});

// exports['Pipe In and Transmit'] = function(test) {
//     test.expect(3);

//     var passthroughA = new PassThrough(), // dummy
//         passthroughB = new PassThrough(), // dummy
//         et = new EventTransmitter(),
//         count = 0;

//     passthroughA.pipe(et).pipe(passthroughB);

//     passthroughB.on('data', function(data) {
//         count++;
//         if (count === 1) {
//             test.equal('Testing 123...', data.toString());
//         }
//         if (count === 2) {
//             test.equal('<da39a3ee5e>["header",' + JSON.stringify({
//                 name: "streamA",
//                 metadata: [23, 33, 221, 222]
//             }) + ']<da39a3ee5e>', data.toString());
//         }
//         if (count === 3) {
//             test.equal('...Ending', data.toString());
//             test.done();
//         }
//     });

//     passthroughA.write('Testing 123...');

//     setTimeout(function() {
//         et.transmit('header', {
//             name: "streamA",
//             metadata: [23, 33, 221, 222]
//         });

//         passthroughA.end('...Ending');
//     }, 200);
// };


// exports['Pipe In and Transmit'] = function(test) {
//     test.expect(3);

//     var passthroughA = new PassThrough(), // dummy
//         passthroughB = new PassThrough(), // dummy
//         et = new EventTransmitter(),
//         count = 0;

//     passthroughA.pipe(et).pipe(passthroughB);

//     passthroughB.on('data', function(data) {
//         count++;
//         if (count === 1) {
//             test.equal('Testing 123...', data.toString());
//         }
//         if (count === 2) {
//             test.equal('<da39a3ee5e>["header",' + JSON.stringify({
//                 name: "streamA",
//                 metadata: [23, 33, 221, 222]
//             }) + ']<da39a3ee5e>', data.toString());
//         }
//         if (count === 3) {
//             test.equal('...Ending', data.toString());
//             test.done();
//         }
//     });

//     passthroughA.write('Testing 123...');

//     setTimeout(function() {
//         et.transmit('header', {
//             name: "streamA",
//             metadata: [23, 33, 221, 222]
//         });

//         passthroughA.end('...Ending');
//     }, 200);
// };


// exports['Transmit and Emit, single'] = function(test) {
//     test.expect(6);

//     var et = new EventTransmitter();

//     et.pipe(et.listen());

//     et.on('header', function(header) {
//         test.equal(typeof header, 'object');
//         test.equal(header.name, 'streamA');
//         test.equal(header.metadata[0], 23);
//         test.equal(header.metadata[3], 222);
//     });

//     et.on('footer', function(footer) {
//         test.equal(typeof footer, 'object');
//         test.equal(footer.exit_code, 2);
//         test.done();
//     });

//     et.transmit('header', {
//         name: "streamA",
//         metadata: [23, 33, 221, 222]
//     });

//     et.transmit('footer', {
//         exit_code: 2
//     });
// };


// exports['Arbitrary Number of Arguments'] = function(test) {
//     test.expect(6);

//     var et = new EventTransmitter();

//     et.pipe(et.listen());

//     et.on('eventer', function() {
//         test.equal(typeof arguments[0], 'object');
//         test.equal(typeof arguments[1], 'string');
//         test.equal(typeof arguments[2], 'number');
//         test.equal(arguments[0].name, 'streamA');
//         test.equal(arguments[0].metadata[0], 23);
//         test.equal(arguments[0].metadata[3], 222);
//         test.done();
//     });

//     et.transmit('eventer', {
//         name: "streamA",
//         metadata: [23, 33, 221, 222]
//     }, '76', 76);
// };


// exports['Sanitation'] = function(test) {
//     test.expect(4);

//     var passthroughA = new PassThrough(), // dummy
//         passthroughB = new PassThrough(), // dummy
//         passthroughC = new PassThrough(), // dummy
//         et = new EventTransmitter(),
//         count = 0;

//     passthroughA.pipe(et).pipe(passthroughB).pipe(et.listen()).pipe(passthroughC);

//     passthroughC.on('data', function(data) {
//         count++;
//         if (count === 1) {
//             test.equal(data.toString(), 'Testing... 123');
//         }
//         if (count === 2) {
//             test.equal(data.toString(), 'Testing Embedded');
//         }
//         if (count === 3) {
//             test.equal(data.toString(), 'Code to be removed and sanitized');
//         }
//         if (count === 4) {
//             test.equal(data.toString(), '...Ending');
//             test.done();
//         }
//     });

//     passthroughA.write('Testing... 123');

//     et.transmit('eventer', {
//         name: "streamA",
//         metadata: [23, 33, 221, 222]
//     });

//     passthroughA.write('Testing Embedded<da39a3ee5e>["footer",{"exit_code":2}]<da39a3ee5e>Code to be removed and sanitized');

//     passthroughA.end("...Ending");
// };


// exports['Braked'] = function(test) {

//     var expected = 'Testing... 123Testing EmbeddedCode to be removed and sanitized...Ending';

//     test.expect(expected.length + 2);

//     var passthroughA = new PassThrough(), // dummy
//         passthroughB = new PassThrough(), // dummy
//         passthroughC = new PassThrough(), // dummy
//         et = new EventTransmitter(),
//         count = 0;

//     passthroughA.pipe(et).pipe(passthroughB).pipe(brake(150)).pipe(et.listen()).pipe(passthroughC);

//     et.on('eventer', function(header) {
//         test.equal(header.name, 'streamA');
//         test.equal(typeof header.metadata, 'object');
//     });

//     passthroughC.on('data', function(data) {

//         test.equal(expected.substr(count, data.toString().length), data.toString());

//         for (var i = 1; i < data.toString().length; i++) {
//             test.equal(true, true); // to match expected test count
//         }

//         console.log(count, expected.substr(count, data.toString().length), data.toString());
//         count += data.toString().length;
//         if (count === expected.length) {
//             test.done();
//         }
//     });

//     passthroughA.write('Testing... 123');

//     et.transmit('eventer', {
//         name: "streamA",
//         metadata: [23, 33, 221, 222]
//     });

//     passthroughA.write('Testing Embedded<da39a3ee5e>["footer",{"exit_code":2}]<da39a3ee5e>Code to be removed and sanitized');

//     passthroughA.end("...Ending");
// };
