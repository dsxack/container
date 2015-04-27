class Container
  constructor: ->
    @bindings = {}
    @instances = {}

  bind: (name, factory, shared = false) ->
    @bindings[name] =
      factory: factory
      shared: shared

  bound: (name) ->
    @bindings[name]?

  bindShared: (name, concrete) ->
    @bind name, concrete, true

  instance: (name, instance) ->
    @instances[name] = instance

  make: (name, parameters) ->
    if @instances[name]
      return @instances[name]

    factory = @getFactory name
    instance = factory(this, parameters)

    if @isShared(name)
      @instances[name] = instance

    return instance

  getFactory: (name) ->
    return @bindings[name].factory

  isShared: (name) ->
    @bindings[name].shared

  build: (name) ->
    # TODO

  when: (name) ->
    # TODO

if not exports?
  global = this;
  original = global.DI
  global.DI = Container

  Container.noConflict = ->
    global.DI = original

    return Container

exports.Container = Container if exports?
module.exports = Container if module?