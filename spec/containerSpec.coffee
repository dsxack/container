Container = require '../dist/container'

describe 'Container', ->
  it 'bind', ->
    container = new Container

    container.bind 'testFactory', (container, parameters) ->
      name: parameters.name

    firstInstance = container.make 'testFactory',
      name: 'firstInstance'

    expect(firstInstance.name).toBe('firstInstance')

    secondInstance = container.make 'testFactory',
      name: 'secondInstance'

    expect(secondInstance.name).toBe('secondInstance')

  it 'dependency injection', ->

    container = new Container

    container.bind 'firstFactory', (container, parameters) ->
      dependency = container.make 'dependency', parameters

      dependencyName: dependency.getName()

    container.bind 'dependency', (container, parameters) ->
      getName: ->
        parameters.name

    instance = container.make 'firstFactory',
      name: 'dependencyName'

    expect(instance.dependencyName).toBe('dependencyName')