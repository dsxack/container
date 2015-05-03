class ContextualBindingBuilder
  constructor: (@container, @factoryName) ->

  needs: (@needsName) ->
    return this

  give: (implementation) ->
    @container.addContextualBinding @factoryName, @needsName, implementation

    return this