(function() {
  var BindingBuilder, Container, InstanceBuilder, global, original;

  BindingBuilder = (function() {
    function BindingBuilder(container, factoryName) {
      this.container = container;
      this.factoryName = factoryName;
    }

    BindingBuilder.prototype.needs = function(needsName) {
      this.needsName = needsName;
      return this;
    };

    BindingBuilder.prototype.give = function(implementation) {
      this.container.addContextualBinding(this.factoryName, this.needsName, implementation);
      return this;
    };

    return BindingBuilder;

  })();

  Container = (function() {
    function Container(parentContainer) {
      this.parentContainer = parentContainer;
      this.bindings = {};
      this.instances = {};
      this.contexts = {};
    }

    Container.prototype.factory = function(name, factory) {
      return this.bind(name, factory);
    };

    Container.prototype.sharedFactory = function(name, factory) {
      return this.bind(name, factory, true);
    };

    Container.prototype.alias = function(name, alias) {
      return this.bind(alias, name);
    };

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
      if (this.bindings[name] != null) {
        return true;
      }
      if (this.parentContainer != null) {
        return this.parentContainer.bound(name);
      }
      return false;
    };

    Container.prototype.set = function(name, instance) {
      return this.instances[name] = instance;
    };

    Container.prototype.get = function(name, parameters) {
      var context, factory, instance;
      if (this.instances[name]) {
        return this.instances[name];
      }
      factory = this.getFactory(name);
      context = this.getContextContainer(name);
      instance = factory(context, parameters);
      if (this.isShared(name)) {
        this.instances[name] = instance;
      }
      return instance;
    };

    Container.prototype.isAlias = function(name) {
      return typeof this.getConcrete(name) === "string";
    };

    Container.prototype.getConcrete = function(name) {
      if (this.bindings[name] != null) {
        return this.bindings[name].concrete;
      }
      if (this.parentContainer) {
        return this.parentContainer.getConcrete(name);
      }
      throw new Error("Is not set concrete for: " + name);
    };

    Container.prototype.getFactory = function(name) {
      if (this.isAlias(name)) {
        name = this.getConcrete(name);
      }
      return this.getConcrete(name);
    };

    Container.prototype.isShared = function(name) {
      if (this.instances[name] != null) {
        return true;
      }
      return this.getConcrete(name).shared;
    };

    Container.prototype.build = function(name) {
      return new InstanceBuilder(this, name);
    };

    Container.prototype.when = function(name) {
      return new BindingBuilder(this, name);
    };

    Container.prototype.addContextualBinding = function(name, needs, concrete) {
      var context;
      context = this.getContextContainer(name);
      return context.bind(needs, concrete);
    };

    Container.prototype.getContextContainer = function(name) {
      if (this.contexts[name] == null) {
        this.contexts[name] = new Container(this);
      }
      return this.contexts[name];
    };

    Container.prototype.global = function() {
      if (this.parentContainer != null) {
        return this.parentContainer.global();
      }
      return this;
    };

    return Container;

  })();

  if (typeof exports === "undefined" || exports === null) {
    global = this;
    original = global.Container;
    global.Container = Container;
    Container.noConflict = function() {
      global.Container = original;
      return Container;
    };
  }

  if (typeof exports !== "undefined" && exports !== null) {
    exports.Container = Container;
  }

  if (typeof module !== "undefined" && module !== null) {
    module.exports = Container;
  }

  InstanceBuilder = (function() {
    function InstanceBuilder(parent, name1) {
      this.name = name1;
      this.container = new Container(parent);
    }

    InstanceBuilder.prototype.needs = function(needsName) {
      this.needsName = needsName;
      return this;
    };

    InstanceBuilder.prototype.give = function(implementation) {
      this.container.addContextualBinding(this.name, this.needsName, implementation);
      return this;
    };

    InstanceBuilder.prototype.get = function(parameters) {
      return this.container.get(this.name, parameters);
    };

    return InstanceBuilder;

  })();

}).call(this);

//# sourceMappingURL=./container.js.map