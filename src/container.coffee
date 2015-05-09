class Container
  constructor: (@parent = null) ->
    @factories = {}
    @shared = {}
    @instances = {}
    @aliases = {}
    @factoryContextes = {}

  factory: (name, factory) ->
    @factories[name] = factory

  sharedFactory: (name, factory) ->
    @factory name, factory
    @setShared name, true

  alias: (name, alias) ->
    @aliases[name] = alias

  setShared: (name, shared) ->
    name = @resolveAlias name

    @shared[name] = shared

  resolveAlias: (name) ->
    return @aliases[name] if @aliases[name]?

    return name

  set: (name, instance) ->
    @instances[name] = instance

  get: (name, parameters) ->
    name = @resolveAlias name

    return @instances[name] if @instances[name]?

    factory = @getFactory name
    factoryContext = @resolveFactoryContext name
    instance = factory factoryContext, parameters

    @instances[name] = instance if @shared[name]

    return instance

  getFactory: (name) ->
    name = @resolveAlias name

    return @factories[name] if @factories[name]?

    return @parent.getFactory name if @parent?

    throw "Factory with name '#{ name }' isnt set"

  unsetFactory: (name) ->
    delete @factories[name] if @factories[name]?

    @parent.unsetFactory name if @parent?

  unAlias: (name) ->
    delete @aliases[name]

    @parent.unAlias name if @parent?

  build: (name) ->
    return new InstanceBuilder this, name

  when: (name) ->
    return new BindingBuilder this, name

  addContextualBinding: (name, dependency, implementation) ->
    contextContainer = @resolveFactoryContext name

    if typeof implementation is "string"
      contextContainer.unsetFactory dependency
      contextContainer.alias dependency, implementation

    if typeof implementation isnt "string"
      contextContainer.unAlias dependency
      contextContainer.factory dependency, implementation

  resolveFactoryContext: (name) ->
    @factoryContextes[name] = new Container this if not @factoryContextes[name]?

    return @factoryContextes[name]

  global: ->
    return @parent.global() if @parent?

    return this

if not exports?
  global = this
  original = global.Container
  global.Container = Container

  Container.noConflict = ->
    global.Container = original

    return Container

exports.Container = Container if exports?
module.exports = Container if module?
