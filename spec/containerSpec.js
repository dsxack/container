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
    it('make instance', function() {
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
      return expect(homer.eat()).toEqual('Amm...am..am from plate');
    });
    it('make instance with dependency injection', function() {
      var homer;
      container.bind('Homer', function(container) {
        var Homer;
        return new (Homer = (function() {
          function Homer() {}

          Homer.prototype.child = function() {
            return container.make('HomerChild');
          };

          Homer.prototype.getName = function() {
            return 'Homer';
          };

          return Homer;

        })());
      });
      container.bind('HomerChild', function() {
        var Bart;
        return new (Bart = (function() {
          function Bart() {}

          Bart.prototype.getName = function() {
            return 'Bart';
          };

          return Bart;

        })());
      });
      homer = container.make('Homer');
      return expect(homer.child().getName()).toEqual('Bart');
    });
    it('make instance with dependency replacement', function() {
      var homer;
      container.bind('Homer', function(container) {
        var Homer;
        return new (Homer = (function() {
          function Homer() {}

          Homer.prototype.child = function() {
            return container.make('HomerChild');
          };

          Homer.prototype.getName = function() {
            return 'Homer';
          };

          return Homer;

        })());
      });
      container.bind('HomerChild', function() {
        var Bart;
        return new (Bart = (function() {
          function Bart() {}

          Bart.prototype.getName = function() {
            return 'Bart';
          };

          return Bart;

        })());
      });
      homer = container.make('Homer');
      expect(homer.child().getName()).toEqual('Bart');
      container.bind('Lisa', function() {
        var Lisa;
        return new (Lisa = (function() {
          function Lisa() {}

          Lisa.prototype.getName = function() {
            return 'Lisa';
          };

          return Lisa;

        })());
      });
      container.when('Homer').needs('HomerChild').give('Lisa');
      expect(homer.child().getName()).toEqual('Lisa');
      container.when('Homer').needs('HomerChild').give(function() {
        var Maggie;
        return new (Maggie = (function() {
          function Maggie() {}

          Maggie.prototype.getName = function() {
            return 'Maggie';
          };

          return Maggie;

        })());
      });
      return expect(homer.child().getName()).toEqual('Maggie');
    });
    return it('instance building', function() {});
  });

}).call(this);

//# sourceMappingURL=./containerSpec.js.map