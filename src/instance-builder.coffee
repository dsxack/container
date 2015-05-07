class InstanceBuilder
  constructor: (parent, @name) ->
    @container = new Container(parent)

  needs: (@needsName) ->
    return this

  give: (implementation) ->
    @container.addContextualBinding(@name, @needsName, implementation)

    return this;

  get: (parameters) ->
    return @container.get(@name, parameters)