class Container
  constructor: (@parentContainer) ->
    @bindings = {}
    @instances = {}
    @contexts = {}

  factory: (name, factory) ->
    @bind name, factory

  sharedFactory: (name, factory) ->
    @bind name, factory, true

  alias: (name, alias) ->
    @bind alias, name

  bind: (name, concrete, shared = false) ->
    @bindings[name] =
      concrete: concrete
      shared: shared

  bound: (name) ->
    return true if @bindings[name]?

    return @parentContainer.bound name if @parentContainer?

    return false

  set: (name, instance) ->
    @instances[name] = instance

  get: (name, parameters) ->
    if @instances[name]
      return @instances[name]

    factory = @getFactory name
    context = @getContextContainer name

    instance = factory(context, parameters)

    if @isShared(name)
      @instances[name] = instance

    return instance

  isAlias: (name) ->
    return typeof @getConcrete(name) is "string"

  getConcrete: (name) ->
    return @bindings[name].concrete if @bindings[name]?

    return @parentContainer.getConcrete(name) if @parentContainer

    throw new Error "Is not set concrete for: #{ name }"

  getFactory: (name) ->
    name = @getConcrete name if @isAlias name

    return @getConcrete name

  isShared: (name) ->
    return true if @instances[name]?

    return @getConcrete(name).shared

  build: (name) ->
    return new InstanceBuilder(this, name)

  when: (name) ->
    return new BindingBuilder(this, name)

  addContextualBinding: (name, needs, concrete) ->
    context = @getContextContainer name

    return context.bind(needs, concrete)

  getContextContainer: (name) ->
    @contexts[name] = new Container this if not @contexts[name]?

    return @contexts[name]

  global: ->
    return @parentContainer.global() if @parentContainer?

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
