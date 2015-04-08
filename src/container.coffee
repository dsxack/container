class Container
  constructor: ->
    @bindings = {}
    @instances = {}

  bind: (name, concrete, shared = false) ->
    @bindings[name] =
      concrete: concrete
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

    concrete = @getConcrete name
    instance = @build concrete, parameters

    if @isShared(name)
      @instances[name] = instance

    return instance

  getConcrete: (name) ->
    return @bindings[name]['concrete']

  isShared: (name) ->
    @bindings[name]['shared']

  build: (concrete, parameters) ->
    concrete(this, parameters)

this.Container = Container if not exports?
exports.Container = Container if exports?
module.exports = Container if module?