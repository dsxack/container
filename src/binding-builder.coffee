class BindingBuilder
  constructor: (@container, @name) ->

  needs: (@dependency) ->
    return this

  give: (implementation) ->
    @container.addContextualBinding @name, @dependency, implementation

    return this