# EventTransmitter for Streams

[![Build Status](https://travis-ci.org/arjunmehta/event-transmitter.svg)](https://travis-ci.org/arjunmehta/event-transmitter)

Attach events to any stream pipeline and emit those events at receiving stream endpoints.

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
// create a new EventTransmitter instance
var et = new EventTransmitter()

// pipe the EventTransmitter to some outgoing stream
et.pipe(outgoing_stream)

// call et.transmit() to send an event down the pipeline
et.transmit('header', {name: 'Event A', codes: [222, 123, 456, 789]}, 'A String')
```

### Receive and Emit Events Locally
Listen downstream for EventTransmitter events. Just pipe the stream containing the EventTransmitter events to a new `EventTransmitter.Listener()` which will listen for and emit them locally.

```javascript
// create a new EventTransmitter instance
var etListener = new EventTransmitter.Listener()

// pipe some incoming stream containing encoded events to et.listen()
incoming_stream.pipe(etListener).pipe(process.stdout)

// set up your event handler to handle events from the pipeline
etListener.on('header', function(obj, str){
    console.log('emitting a "header" event with object:', obj, 'and string:', str)
})
```

### Important
**Note:** *EventTransmitter adds event metadata to the streams it is piped through and should be placed in the pipeline between where data will otherwise be used. Your EventTransmitter instance will sanitize stream content as it passes through its listener, removing event metadata from the stream, restoring the stream contents.*

Have a look at the few examples in the package to see how to transmit events between various types of streams, sockets and processes.

## License

The MIT License (MIT)<br/>
Copyright (c) 2017 Arjun Mehta
