Container = require '../dist/container'

describe 'Container', ->
  it 'bind', ->
    container = new Container

    container.bind 'factory', (container, parameters) ->
      name: parameters.name

    firstInstance = container.make 'factory',
      name: 'firstInstance'

    expect(firstInstance.name).toBe('firstInstance')

    secondInstance = container.make 'factory',
      name: 'secondInstance'

    expect(secondInstance.name).toBe('secondInstance')

  it 'dependency injection', ->
    container = new Container

    container.bind 'factory', (container, parameters) ->
      dependency = container.make 'dependency',
        name: parameters.dependencyName

      getDependencyName: dependency.getName

    container.bind 'dependency', (container, parameters) ->
      getName: ->
        parameters.name

    instance = container.make 'factory',
      dependencyName: 'dependencyName'

    expect(instance.getDependencyName()).toBe('dependencyName')


  it 'dependency replacement', ->
    container = new Container

    container.bind 'factory', (container, parameters) ->
      dependency = container.make 'dependency',
        name: parameters.dependencyName

      getDependencyName: dependency.getName

    container.bind 'dependency', (container, parameters) ->
      getName: ->
        parameters.name

    container.bind 'dependencyReplacement', (container, parameters) ->
      getName: ->
        parameters.name + 'Replacement'

    instance = container.for 'factory'
      .use 'dependencyReplacement'
      .as 'dependency'
      .make
        dependencyName: 'dependencyName'

    expect(instance.getDependencyName()).toBe('dependencyNameReplacement')

    instance = container.make 'factory',
      dependencyName: 'dependencyName'

    expect(instance.getDependencyName()).toBe('dependencyName')

    container.when 'factory'
      .needs 'dependency'
      .give 'dependencyReplacement'

    instance = container.make 'factory',
      dependencyName: 'dependencyName'

    expect(instance.getDependencyName()).toBe('dependencyNameReplacement')