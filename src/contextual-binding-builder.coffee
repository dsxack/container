class ContextualBindingBuilder
  constructor: (@container, @factoryName) ->

  needs: (@needs) ->
    return this

  give: (implementation) ->
    @container.addContextualBinding @factoryName, @needs, implementation

    return this