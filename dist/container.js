(function() {
  var BindingBuilder, Container, InstanceBuilder, global, original;

  BindingBuilder = (function() {
    function BindingBuilder(container, name1) {
      this.container = container;
      this.name = name1;
    }

    BindingBuilder.prototype.needs = function(dependency1) {
      this.dependency = dependency1;
      return this;
    };

    BindingBuilder.prototype.give = function(implementation) {
      this.container.addContextualBinding(this.name, this.dependency, implementation);
      return this;
    };

    return BindingBuilder;

  })();

  Container = (function() {
    function Container(parent1) {
      this.parent = parent1 != null ? parent1 : null;
      this.factories = {};
      this.shared = {};
      this.instances = {};
      this.aliases = {};
      this.factoryContextes = {};
    }

    Container.prototype.factory = function(name, factory) {
      return this.factories[name] = factory;
    };

    Container.prototype.sharedFactory = function(name, factory) {
      this.factory(name, factory);
      return this.setShared(name, true);
    };

    Container.prototype.alias = function(name, alias) {
      return this.aliases[name] = alias;
    };

    Container.prototype.setShared = function(name, shared) {
      name = this.resolveAlias(name);
      return this.shared[name] = shared;
    };

    Container.prototype.resolveAlias = function(name) {
      if (this.aliases[name] != null) {
        return this.aliases[name];
      }
      return name;
    };

    Container.prototype.set = function(name, instance) {
      return this.instances[name] = instance;
    };

    Container.prototype.get = function(name, parameters) {
      var factory, factoryContext, instance;
      name = this.resolveAlias(name);
      if (this.instances[name] != null) {
        return this.instances[name];
      }
      factory = this.getFactory(name);
      factoryContext = this.resolveFactoryContext(name);
      instance = factory(factoryContext, parameters);
      if (this.shared[name]) {
        this.instances[name] = instance;
      }
      return instance;
    };

    Container.prototype.getFactory = function(name) {
      name = this.resolveAlias(name);
      if (this.factories[name] != null) {
        return this.factories[name];
      }
      if (this.parent != null) {
        return this.parent.getFactory(name);
      }
      throw "Factory with name '" + name + "' isnt set";
    };

    Container.prototype.unsetFactory = function(name) {
      if (this.factories[name] != null) {
        delete this.factories[name];
      }
      if (this.parent != null) {
        return this.parent.unsetFactory(name);
      }
    };

    Container.prototype.unAlias = function(name) {
      delete this.aliases[name];
      if (this.parent != null) {
        return this.parent.unAlias(name);
      }
    };

    Container.prototype.build = function(name) {
      return new InstanceBuilder(this, name);
    };

    Container.prototype.when = function(name) {
      return new BindingBuilder(this, name);
    };

    Container.prototype.addContextualBinding = function(name, dependency, implementation) {
      var contextContainer;
      contextContainer = this.resolveFactoryContext(name);
      if (typeof implementation === "string") {
        contextContainer.unsetFactory(dependency);
        contextContainer.alias(dependency, implementation);
      }
      if (typeof implementation !== "string") {
        contextContainer.unAlias(dependency);
        return contextContainer.factory(dependency, implementation);
      }
    };

    Container.prototype.resolveFactoryContext = function(name) {
      if (this.factoryContextes[name] == null) {
        this.factoryContextes[name] = new Container(this);
      }
      return this.factoryContextes[name];
    };

    Container.prototype.global = function() {
      if (this.parent != null) {
        return this.parent.global();
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

    InstanceBuilder.prototype.needs = function(dependency1) {
      this.dependency = dependency1;
      return this;
    };

    InstanceBuilder.prototype.give = function(implementation) {
      this.container.addContextualBinding(this.name, this.dependency, implementation);
      return this;
    };

    InstanceBuilder.prototype.get = function(parameters) {
      return this.container.get(this.name, parameters);
    };

    return InstanceBuilder;

  })();

}).call(this);

//# sourceMappingURL=./container.js.map