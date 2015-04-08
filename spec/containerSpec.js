(function() {
  var Container;

  Container = require('../dist/container');

  describe('Container', function() {
    return it('bind', function() {
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
  });

}).call(this);

//# sourceMappingURL=./containerSpec.js.map