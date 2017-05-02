const net = require('net');
const BPromise = require('bluebird');
const EventEmitter = require('events');

class EventsBus extends EventEmitter {}

const eventsBus = new EventsBus();

var tcpServerIp = null;
var tcpServerPort = null;
var tcpServerTimeout = null;
var tcpClientEvents = null;

const parseEvent = (event) => {
  if (event.indexOf('getlive') > 0 || event.indexOf('listactions') > 0) {
    const parsedEvent = JSON.parse(event);
    eventsBus.emit(parsedEvent.event, { data: parsedEvent.data });
  }
};

function Client (options) {
  tcpServerIp = options.ip;
  tcpServerPort = options.port;
  tcpServerTimeout = options.timeout;

  tcpClientEvents = net.connect({
    host: tcpServerIp,
    port: tcpServerPort
  }, () => {
    if (options.events) {
      tcpClientEvents.setKeepAlive(true);
      tcpClientEvents.write('{"cmd": "startevents"}');
      tcpClientEvents.on('data', (data) => {
        var eventBuffer = new Buffer('', 'utf-8');
        eventBuffer = Buffer.concat([eventBuffer, new Buffer(data, 'utf-8')]);
        parseEvent(eventBuffer.toString());
        eventBuffer = null;
      });
    }
  });
}

Client.prototype.request = (line) => {
  return new BPromise((resolve, reject) => {
    var buffer = new Buffer('', 'utf-8');
    const lineSend = line + '\r\n';

    const tcpClientActions = net.connect({
      host: tcpServerIp,
      port: tcpServerPort
    }, () => {
      tcpClientActions.write(lineSend);
    });

    // Still have to figure how to work with long responses
    tcpClientActions.on('data', (data) => {
      buffer = Buffer.concat([buffer, new Buffer(data, 'utf-8')]);
      tcpClientActions.end();
    });

    tcpClientActions.on('end', (data) => {
      resolve(buffer.toString());
    });

    tcpClientActions.on('error', (err) => {
      reject(err);
    });

    tcpClientActions.setTimeout(tcpServerTimeout, (msg) => {
      reject(new Error('TCP_TIME_OUT'));
    });
  });
};

module.exports = {
  Client,
  eventsBus
};
