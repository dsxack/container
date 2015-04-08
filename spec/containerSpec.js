(function() {
  var Container;

  Container = require('../dist/container');

  describe('Container', function() {
    it('bind', function() {
      var container, firstInstance, secondInstance;
      container = new Container;
      container.bind('testFactory', function(container, parameters) {
        return {
          name: parameters.name
        };
      });
      firstInstance = container.make('testFactory', {
        name: 'firstInstance'
      });
      expect(firstInstance.name).toBe('firstInstance');
      secondInstance = container.make('testFactory', {
        name: 'secondInstance'
      });
      return expect(secondInstance.name).toBe('secondInstance');
    });
    return it('dependency injection', function() {
      var container, instance;
      container = new Container;
      container.bind('firstFactory', function(container, parameters) {
        var dependency;
        dependency = container.make('dependency', parameters);
        return {
          dependencyName: dependency.getName()
        };
      });
      container.bind('dependency', function(container, parameters) {
        return {
          getName: function() {
            return parameters.name;
          }
        };
      });
      instance = container.make('firstFactory', {
        name: 'dependencyName'
      });
      return expect(instance.dependencyName).toBe('dependencyName');
    });
  });

}).call(this);

//# sourceMappingURL=./containerSpec.js.map