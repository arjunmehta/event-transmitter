# EventTransmitter for Streams

[![Build Status](https://travis-ci.org/arjunmehta/event-transmitter.svg)](https://travis-ci.org/arjunmehta/event-transmitter)

Attach events to any node/io.js stream pipeline and emit those events at receiving stream endpoints.

EventTransmitter transmits events and their parameters along standard stream pipelines. It requires at least two instances: one to transmit encoded event information, and another to listen for and emit events, sanitizing the stream of event metadata in the process for further piping.

### Install
```bash
npm install --save event-transmitter
```

### Include
```javascript
var EventTransmitter = require('event-transmitter')
```


### Transmit Events
Use EventTransmitter to transmit events (works like `ee.emit`). But first you must pipe your EventTransmitter instance to a stream that is connected to where you ultimately want to receive and handle events.

```javascript
var etA = new EventTransmitter()
etA.pipe(outgoing_stream)
etA.transmit('header', {name: 'Event A', codes: [222, 123, 456, 789]}, 'A String')
```

### Receive and Emit Events Locally
Listen downstream for EventTransmitter events. Just pipe the stream containing the EventTransmitter events to `EventTransmitter.listen()` which will listen for and emit them locally.

```javascript
var etB = new EventTransmitter()
incoming_stream.pipe(etB.listen()).pipe(process.stdout)
etB.on('header', function(obj, str){
    console.log('emitting a "header" event with object:', obj, 'and string:', str)
})
```

### Important
**Note:** *EventTransmitter adds event metadata to the stream and should be placed in the pipeline between where data will otherwise be used. Your EventTransmitter instance will sanitize stream content as it passes through its listener, removing event metadata from the stream, restoring the stream contents.*

Have a look at the few examples in the package to see how to transmit events between various types of streams, sockets and processes.


## License

The MIT License (MIT)<br/>
Copyright (c) 2015 Arjun Mehta
