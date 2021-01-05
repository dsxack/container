# Container
[![Build Status](https://travis-ci.com/dsxack/container.svg?branch=master)](https://travis-ci.com/dsxack/container)

Dependency injection container

### Install

With npm:
```sh
npm install --save @dsxack/container
```

With yarn:
```sh
yarn add @dsxack/container
```

### Use

```javascript
var container = new Container();

container.factory('factoryName', function (container, parameters) {
    // return instance
});

container.get('factoryName', parameters);
```
