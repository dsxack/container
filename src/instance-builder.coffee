class InstanceBuilder
  constructor: (parent, @name) ->
    @container = new Container(parent)

  needs: (@needs) ->
    return this

  give: (implementation) ->
    @container.addContextualBinding(@name, @needs, implementation)

    return this;

  make: (parameters) ->
    return @container.make(@name, parameters)