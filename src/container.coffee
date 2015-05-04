class Container
  constructor: (@parentContainer) ->
    @bindings = {}
    @instances = {}
    @contexts = {}

  bind: (name, factory, shared = false) ->
    @bindings[name] =
      factory: factory
      shared: shared

  bound: (name) ->
    return @bindings[name]?

  bindShared: (name, concrete) ->
    @bind(name, concrete, true)

  instance: (name, instance) ->
    @instances[name] = instance

  make: (name, parameters) ->
    if @instances[name]
      return @instances[name]

    factory = @getFactory name
    context = @getContext name

    instance = factory(context, parameters)

    if @isShared(name)
      @instances[name] = instance

    return instance

  getFactory: (name) ->
    if @bindings[name]?
      factory = @bindings[name].factory

      return factory if typeof factory is "function"

      return @getFactory(factory) if typeof factory is "string"

    return @parentContainer.getFactory name if @parentContainer?

    throw new Error "Can't find factory for: #{ name }"

  isShared: (name) ->
    return false if not @bindings[name]?
    return @bindings[name].shared

  build: (name) ->
    return new InstanceBuilder(this, name)

  when: (name) ->
    return new BindingBuilder(this, name)

  addContextualBinding: (factoryName, needs, implementation) ->
    context = @getContext factoryName

    return context.bind(needs, implementation)

  getContext: (name) ->
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
