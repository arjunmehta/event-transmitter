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