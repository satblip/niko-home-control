const tcp = require('./lib/tcp_connector');

var tcpClient = null;

const init = (options) => {
  tcpClient = new tcp.Client(options);
};

const generateError = (errorCode) => {
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

const command = (command) => {
  return tcpClient.request(command)
    .then(function (response) {
      const result = JSON.parse(response);

      if (result.data.error > 0) {
        throw (generateError(result.data.error));
      }

      return result;
    });
};

const listActions = () => {
  return command('{"cmd": "listactions"}');
};

const listLocations = () => {
  return command('{"cmd": "listlocations"}');
};

const listEnergy = () => {
  return command('{"cmd": "listenergy"}');
};

const systemInfo = () => {
  return command('{"cmd": "systeminfo"}');
};

const executeActions = (id, value) => {
  return command('{"cmd": "executeactions", "id":' + id + ', "value1": ' + value + '}');
};

module.exports = {
  init: init,
  command: command,
  listLocations: listLocations,
  listActions: listActions,
  listEnergy: listEnergy,
  systemInfo: systemInfo,
  executeActions: executeActions,
  events: tcp.eventsBus
};
