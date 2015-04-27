(function() {
  var Container;

  if (typeof require !== "undefined" && require !== null) {
    Container = require('../dist/container');
  }

  if (typeof window !== "undefined" && window !== null) {
    Container = window.DI;
  }

  describe('Container', function() {
    var container;
    container = null;
    beforeEach(function() {
      return container = new Container;
    });
    it('bind and build', function() {
      var homer;
      container.bind('Homer', function(container, from) {
        var Homer;
        return new (Homer = (function() {
          function Homer() {}

          Homer.prototype.eat = function() {
            return 'Amm...am..am from ' + from;
          };

          return Homer;

        })());
      });
      homer = container.make('Homer', 'plate');
      expect(homer.eat).toBeDefined();
      return expect(homer.eat()).toEqual('Amm...am..am from plate');
    });
    it('dependency injection', function() {});
    return it('dependency replacement', function() {});
  });

}).call(this);

//# sourceMappingURL=./containerSpec.js.map