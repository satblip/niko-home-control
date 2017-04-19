var net = require('net');
var BPromise = require('bluebird');

var tcpServerIp = null;
var tcpServerPort = null;
var tcpServerTimeout = null;

function Client (options) {
  tcpServerIp = options.ip;
  tcpServerPort = options.port;
  tcpServerTimeout = options.timeout;
}

Client.prototype.request = function (line) {
  return new BPromise(function (resolve, reject) {
    var client = net.connect({
      host: tcpServerIp,
      port: tcpServerPort
    }, () => {
      var lineSend = line + '\r\n';
      client.write(lineSend);
    });

    var buffer = new Buffer('', 'utf-8');

    client.on('data', function (data) {
      buffer = Buffer.concat([buffer, new Buffer(data, 'utf-8')]);
      client.end();
    });

    client.on('end', function (data) {
      resolve(buffer.toString());
    });

    client.on('error', function (err) {
      reject(err);
    });

    client.setTimeout(tcpServerTimeout, function (msg) {
      reject(new Error('TCP_TIME_OUT'));
    });
  });
};

module.exports = Client;
