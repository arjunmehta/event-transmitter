var util = require('util');
var stream = require('stream');
var crypto = require('crypto');

var PassThrough = stream.PassThrough || require('readable-stream').PassThrough;
var Listener = require('./lib/Listener');

util.inherits(EventTransmitter, PassThrough);


// main constructor

function EventTransmitter(opts) {
  PassThrough.call(this);

  opts = opts || {};

  var hash = crypto.createHash('sha1', opts.delimeter || 'jambalaya');
  hash.setEncoding('hex');
  hash.end();

  this.delimiter = '<' + hash.read().substr(0, 10) + '>';
  this.opts = opts;
}


// prototype methods

EventTransmitter.prototype.transmit = function() {
  var args = Array.prototype.slice.call(arguments);
  this.push(this.delimiter + JSON.stringify(args) + this.delimiter);
};


// class statics

EventTransmitter.Listener = function(stream) {
  return new Listener(stream, this, this.opts);
};


module.exports = exports = EventTransmitter;
