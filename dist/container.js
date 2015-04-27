(function() {
  var Container, global, original;

  Container = (function() {
    function Container() {
      this.bindings = {};
      this.instances = {};
    }

    Container.prototype.bind = function(name, factory, shared) {
      if (shared == null) {
        shared = false;
      }
      return this.bindings[name] = {
        factory: factory,
        shared: shared
      };
    };

    Container.prototype.bound = function(name) {
      return this.bindings[name] != null;
    };

    Container.prototype.bindShared = function(name, concrete) {
      return this.bind(name, concrete, true);
    };

    Container.prototype.instance = function(name, instance) {
      return this.instances[name] = instance;
    };

    Container.prototype.make = function(name, parameters) {
      var factory, instance;
      if (this.instances[name]) {
        return this.instances[name];
      }
      factory = this.getFactory(name);
      instance = factory(this, parameters);
      if (this.isShared(name)) {
        this.instances[name] = instance;
      }
      return instance;
    };

    Container.prototype.getFactory = function(name) {
      return this.bindings[name].factory;
    };

    Container.prototype.isShared = function(name) {
      return this.bindings[name].shared;
    };

    Container.prototype.build = function(name) {};

    Container.prototype.when = function(name) {};

    return Container;

  })();

  if (typeof exports === "undefined" || exports === null) {
    global = this;
    original = global.DI;
    global.DI = Container;
    Container.noConflict = function() {
      global.DI = original;
      return Container;
    };
  }

  if (typeof exports !== "undefined" && exports !== null) {
    exports.Container = Container;
  }

  if (typeof module !== "undefined" && module !== null) {
    module.exports = Container;
  }

}).call(this);

//# sourceMappingURL=./container.js.map