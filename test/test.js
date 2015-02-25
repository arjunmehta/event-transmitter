var stream = require('stream');
var brake = require('brake');
var expect = require('chai').expect;

var EventTransmitter = require('../main');
var PassThrough = stream.PassThrough || require('readable-stream').PassThrough;


describe("EventTransmitter Tests", function() {


    it("Exported OK", function() {

        var et = new EventTransmitter();

        expect(typeof EventTransmitter).to.equal('function');
        expect(typeof et).to.equal('object');
        expect(typeof et.listen).to.equal('function');
        expect(typeof et.listen()).to.equal('object');
        expect(typeof et.transmit).to.equal('function');
    });


    it("Transmit", function() {

        var et = new EventTransmitter();
        var passthroughA = new PassThrough();

        et.pipe(passthroughA);

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


    it("Pipe In and Transmit", function(done) {

        var passthroughA = new PassThrough(), // dummy
            passthroughB = new PassThrough(), // dummy
            et = new EventTransmitter(),
            count = 0;

        passthroughA.pipe(et).pipe(passthroughB);

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


    it("Transmit and Emit, single", function(done) {

        var et = new EventTransmitter();

        et.pipe(et.listen());

        et.on('header', function(header) {
            expect(typeof header).to.equal('object');
            expect(header.name).to.equal('streamA');
            expect(header.metadata[0]).to.equal(23);
            expect(header.metadata[3]).to.equal(222);
        });

        et.on('footer', function(footer) {
            expect(typeof footer).to.equal('object');
            expect(footer.exit_code).to.equal(2);
            done();
        });

        et.transmit('header', {
            name: "streamA",
            metadata: [23, 33, 221, 222]
        });

        et.transmit('footer', {
            exit_code: 2
        });
    });


    it("Arbitrary Number of Arguments", function(done) {

        var et = new EventTransmitter();

        et.pipe(et.listen());

        et.on('eventer', function() {
            expect(typeof arguments[0]).to.equal('object');
            expect(typeof arguments[1]).to.equal('string');
            expect(typeof arguments[2]).to.equal('number');
            expect(arguments[0].name).to.equal('streamA');
            expect(arguments[0].metadata[0]).to.equal(23);
            expect(arguments[0].metadata[3]).to.equal(222);
            done();
        });

        et.transmit('eventer', {
            name: "streamA",
            metadata: [23, 33, 221, 222]
        }, '76', 76);
    });


    it("Sanitation", function(done) {

        var passthroughA = new PassThrough(), // dummy
            passthroughB = new PassThrough(), // dummy
            passthroughC = new PassThrough(), // dummy
            et = new EventTransmitter(),
            count = 0;

        passthroughA.pipe(et).pipe(passthroughB).pipe(et.listen()).pipe(passthroughC);

        passthroughC.on('data', function(data) {
            count++;
            if (count === 1) {
                expect(data.toString()).to.equal('Testing... 123');
            }
            if (count === 2) {
                expect(data.toString()).to.equal('Testing Embedded');
            }
            if (count === 3) {
                expect(data.toString()).to.equal('Code to be removed and sanitized');
            }
            if (count === 4) {
                expect(data.toString()).to.equal('...Ending');
                done();
            }
        });

        passthroughA.write('Testing... 123');

        et.transmit('eventer', {
            name: "streamA",
            metadata: [23, 33, 221, 222]
        });

        passthroughA.write('Testing Embedded<da39a3ee5e>["footer",{"exit_code":2}]<da39a3ee5e>Code to be removed and sanitized');

        passthroughA.end("...Ending");
    });


    it("Braked", function(done) {

        var expected = 'Testing... 123Testing EmbeddedCode to be removed and sanitized...Ending';        

        var passthroughA = new PassThrough(), // dummy
            passthroughB = new PassThrough(), // dummy
            passthroughC = new PassThrough(), // dummy
            et = new EventTransmitter(),
            count = 0;

        passthroughA.pipe(et).pipe(passthroughB).pipe(brake(150)).pipe(et.listen()).pipe(passthroughC);

        et.on('eventer', function(header) {
            expect(header.name).to.equal('streamA');
            expect(typeof header.metadata).to.equal('object');
        });

        passthroughC.on('data', function(data) {

            expect(expected.substr(count, data.toString().length)).to.equal(data.toString());

            for (var i = 1; i < data.toString().length; i++) {
                expect(true).to.equal(true); // to match expected test count
            }

            // console.log(count, expected.substr(count, data.toString().length), data.toString());
            count += data.toString().length;
            if (count === expected.length) {
                done();
            }
        });

        passthroughA.write('Testing... 123');

        et.transmit('eventer', {
            name: "streamA",
            metadata: [23, 33, 221, 222]
        });

        passthroughA.write('Testing Embedded<da39a3ee5e>["footer",{"exit_code":2}]<da39a3ee5e>Code to be removed and sanitized');

        passthroughA.end("...Ending");
    });

});
