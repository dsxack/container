(function() {
  var Container;

  if (typeof require !== "undefined" && require !== null) {
    Container = require('../dist/container');
  }

  if (typeof window !== "undefined" && window !== null) {
    Container = window.Container;
  }

  describe('Container', function() {
    it('bind', function() {
      var container, firstInstance, secondInstance;
      container = new Container;
      container.bind('factory', function(container, parameters) {
        return {
          name: parameters.name
        };
      });
      firstInstance = container.make('factory', {
        name: 'firstInstance'
      });
      expect(firstInstance.name).toBe('firstInstance');
      secondInstance = container.make('factory', {
        name: 'secondInstance'
      });
      return expect(secondInstance.name).toBe('secondInstance');
    });
    it('dependency injection', function() {
      var container, instance;
      container = new Container;
      container.bind('factory', function(container, parameters) {
        var dependency;
        dependency = container.make('dependency', {
          name: parameters.dependencyName
        });
        return {
          getDependencyName: dependency.getName
        };
      });
      container.bind('dependency', function(container, parameters) {
        return {
          getName: function() {
            return parameters.name;
          }
        };
      });
      instance = container.make('factory', {
        dependencyName: 'dependencyName'
      });
      return expect(instance.getDependencyName()).toBe('dependencyName');
    });
    return it('dependency replacement', function() {
      var container, instance;
      container = new Container;
      container.bind('factory', function(container, parameters) {
        var dependency;
        dependency = container.make('dependency', {
          name: parameters.dependencyName
        });
        return {
          getDependencyName: dependency.getName
        };
      });
      container.bind('dependency', function(container, parameters) {
        return {
          getName: function() {
            return parameters.name;
          }
        };
      });
      container.bind('dependencyReplacement', function(container, parameters) {
        return {
          getName: function() {
            return parameters.name + 'Replacement';
          }
        };
      });
      instance = container.will().use('dependencyReplacement').as('dependency').make('factory', {
        dependencyName: 'dependencyName'
      });
      expect(instance.getDependencyName()).toBe('dependencyNameReplacement');
      instance = container.make('factory', {
        dependencyName: 'dependencyName'
      });
      expect(instance.getDependencyName()).toBe('dependencyName');
      container.when('factory').needs('dependency').give('dependencyReplacement');
      instance = container.make('factory', {
        dependencyName: 'dependencyName'
      });
      return expect(instance.getDependencyName()).toBe('dependencyNameReplacement');
    });
  });

}).call(this);

//# sourceMappingURL=./containerSpec.js.map