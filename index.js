var Client = require('./lib/tcp_connector');

var tcpClient = null;

var init = function (options) {
  tcpClient = new Client(options);
};

var generateError = function (errorCode) {
  var errorMessage = null;

  switch (errorCode) {
    case 100:
      errorMessage = 'NOT_FOUND';
      break;
    case 200:
      errorMessage = 'SYNTAX_ERROR';
      break;
    default:
      errorMessage = 'ERROR';
  }

  return new Error(errorMessage);
};

var command = function (command) {
  return tcpClient.request('{"cmd": "startevents"}')
    .then(function () {
      return tcpClient.request(command);
    })
    .then(function (response) {
      var result = JSON.parse(response);

      if (result.data.error > 0) {
        throw (generateError(result.data.error));
      }

      return result;
    });
};

var listActions = function () {
  return command('{"cmd": "listactions"}');
};

var listLocations = function () {
  return command('{"cmd": "listlocations"}');
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
  listLocations: listLocations,
  listActions: listActions,
  listEnergy: listEnergy,
  systemInfo: systemInfo,
  executeActions: executeActions
};
