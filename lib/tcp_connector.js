const net = require('net');
const BPromise = require('bluebird');
const EventEmitter = require('events');

const eventsBus = new EventEmitter();

var tcpServerIp = null;
var tcpServerPort = null;
var tcpServerTimeout = null;
var tcpClientEvents = null;

const parseEvent = (event) => {
  if (event.indexOf('getlive') > 0 || event.indexOf('listactions') > 0) {
    event = event.replace(/\\n/g, '\\n')
      .replace(/\\'/g, "\\'")
      .replace(/\\"/g, '\\"')
      .replace(/\\&/g, '\\&')
      .replace(/\\r/g, '\\r')
      .replace(/\\t/g, '\\t')
      .replace(/\\b/g, '\\b')
      .replace(/\\f/g, '\\f');
    event = event.replace(/[\u0000-\u001F]+/g, '');
    event = '[' + event.replace(/}{/g, '},{') + ']';
    const parsed = JSON.parse(event);
    for (var index = 0, len = parsed.length; index < len; index++) {
      const parsedEvent = parsed[index];
      eventsBus.emit(parsedEvent.event, { data: parsedEvent.data });
    }
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
        var eventBuffer = Buffer.from('', 'utf-8');
        eventBuffer = Buffer.concat([eventBuffer, Buffer.from(data, 'utf-8')]);
        parseEvent(eventBuffer.toString());
        eventBuffer = null;
      });
    }
  });
}

Client.prototype.request = (line) => {
  return new BPromise((resolve, reject) => {
    var buffer = Buffer.from('', 'utf-8');
    const lineSend = line + '\r\n';

    const tcpClientActions = net.connect({
      host: tcpServerIp,
      port: tcpServerPort
    }, () => {
      tcpClientActions.write(lineSend);
    });

    // Still have to figure how to work with long responses
    tcpClientActions.on('data', (data) => {
      buffer = Buffer.concat([buffer, Buffer.from(data, 'utf-8')]);
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
