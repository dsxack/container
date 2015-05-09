class InstanceBuilder
  constructor: (parent, @name) ->
    @container = new Container(parent)

  needs: (@dependency) ->
    return this

  give: (implementation) ->
    @container.addContextualBinding @name, @dependency, implementation

    return this;

  get: (parameters) ->
    return @container.get(@name, parameters)