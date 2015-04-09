# container
![TravisCI](https://travis-ci.org/DsXack/container.svg?branch=master)


### install

```sh
npm install git+https://github.com/DsXack/container.git
```

### use

```javascript
var container = new Container();

container.bind('factoryName', function (container, parameters) {
    // return instance
});

container.make('factoryName', parameters);
```

### build

```sh
npm install
gulp
```

### test

```sh
npm install
npm test
```
