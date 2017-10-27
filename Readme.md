# Connector for the Niko Home Control API

[![Known Vulnerabilities](https://snyk.io/test/github/satblip/niko-home-control/badge.svg)](https://snyk.io/test/github/satblip/niko-home-control)

## Init

```js
const niko = require('niko-home-control');

niko.init({
  ip: 'xxx.xxx.xxx.xxx',
  port: 8000,
  timeout: 20000,
  events: true
});
```

`events` enables direct events from the controller, such as energy consumption and actions states.

## Usage

### Get the list of available locations

```js
niko
  .listLocations()
  .then(function (response) {
    console.log(response);
  });
```

### Get the list of available actions

```js
niko
  .listActions()
  .then(function (response) {
    console.log(response);
  });
```

### Perform an action

```js
niko
  .executeActions(id, value)
  .then(function (response) {
    console.log(response);
  });
```


### Get energy info

```js
niko
  .listEnergy()
  .then(function (response) {
    console.log(response);
  });
```

### Get system info

```js
niko
  .systemInfo()
  .then(function (response) {
    console.log(response);
  });
```

### Reveive energy consumption events

```js
niko.events.on('getlive', (data) => {
  console.log(data, 'live');
});
```

### Reveive actions states events

```js
niko.events.on('listactions', (data) => {
  console.log(data, 'actions');
});
```
