(function() {
  var Container;

  Container = (function() {
    function Container() {
      this.bindings = {};
      this.instances = {};
    }

    Container.prototype.bind = function(name, concrete, shared) {
      if (shared == null) {
        shared = false;
      }
      return this.bindings[name] = {
        concrete: concrete,
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
      var concrete, instance;
      if (this.instances[name]) {
        return this.instances[name];
      }
      concrete = this.getConcrete(name);
      instance = this.build(concrete, parameters);
      if (this.isShared(name)) {
        this.instances[name] = instance;
      }
      return instance;
    };

    Container.prototype.getConcrete = function(name) {
      return this.bindings[name]['concrete'];
    };

    Container.prototype.isShared = function(name) {
      return this.bindings[name]['shared'];
    };

    Container.prototype.build = function(concrete, parameters) {
      return concrete(this, parameters);
    };

    return Container;

  })();

  if (typeof exports === "undefined" || exports === null) {
    this.Container = Container;
  }

  if (typeof exports !== "undefined" && exports !== null) {
    exports.Container = Container;
  }

  if (typeof module !== "undefined" && module !== null) {
    module.exports = Container;
  }

}).call(this);

//# sourceMappingURL=./container.js.map