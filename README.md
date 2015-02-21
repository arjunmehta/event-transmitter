# EventTransmitter for Streams
Attach events to any stream channel and emit those events at a receiving stream endpoint.

EventTransmitter transmits events and their parameters along standard stream pipelines. It requires two instances: one to transmit encoded event information, and another to listen for and emit events, sanitizing the stream of event metadata in the process.

### Install
```bash
npm install --save event-transmitter
```


### Include
```javascript
var EventTransmitter = require('event-transmitter')
var et = new EventTransmitter()
```

### Transmit Events
Use EventTransmitter to transmit events (works like `ee.emit`). But first you must pipe your EventTransmitter instance to a stream that is connected to where you ultimately want to receive and handle events.

```javascript
et.pipe(outgoing_stream) // pipe EventTransmitter to some outgoing stream
et.transmit('header', {something: 'else', oo: [aaaa]}) // transmit an event through that outgoing stream
```

### Receive and Emit Events Locally
Now you can listen downstream for EventTransmitter events.

```javascript
incoming_stream.pipe(et.listen()).pipe(process.stdout)
et.on('header', function(obj){
    console.log('emitting a "header" event with object:', obj)
})
```


### Important
**Note:** *EventTransmitter should be placed in your pipeline where no data is otherwise read. Your EventTransmitter instance will sanitize stream content as it passes through its listener, removing event metadata from the stream.*

Have a look at the few examples in the package to see how to transmit events between various types of streams, sockets and even processes.

