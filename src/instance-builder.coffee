class InstanceBuilder
  constructor: (parent, @name) ->
    @container = new Container(parent)

  needs: (@needsName) ->
    return this

  give: (implementation) ->
    @container.addContextualBinding(@name, @needsName, implementation)

    return this;

  make: (parameters) ->
    return @container.make(@name, parameters)