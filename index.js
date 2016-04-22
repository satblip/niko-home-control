var Promise = require('bluebird');
var tcpClient = require('tcp-client');

var client = null;

var init = function (options) {
  client = tcpClient.createClient(options);
};

var command = function (command) {
  return new Promise(function (resolve, reject) {
    client.request('{"cmd": "startevents"}', function (error, message) {
      if (error) {
        reject(error);
      }

      client
        .request(command, function (error, response) {
          if (error) {
            reject(error);
          }

          resolve(response);
        });
    });
  });
};

var listActions = function () {
  return command('{"cmd": "listactions"}');
};

var listEnergy = function () {
  return command('{"cmd": "listenergy"}');
};

var systemInfo = function () {
  return command('{"cmd": "systeminfo"}');
};

var executeActions = function (id, value) {
  return command('{"cmd": "executeactions", "id":' + id + ', "value1": ' + value + '}');
};

module.exports = {
  init: init,
  command: command,
  listActions: listActions,
  listEnergy: listEnergy,
  systemInfo: systemInfo,
  executeActions: executeActions
};
