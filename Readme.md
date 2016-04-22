# Connectore for the Niko Home Control API

## Init

```js
niko.init({
  ip: 'xxx.xxx.xxx.xxx',
  port: 8000,
  timeout: 5000
});
```

## Usage

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
