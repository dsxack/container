Container = require '../dist/container'

describe 'Container', ->
  it 'bind', ->
    container = new Container

    container.bind 'testFactory', (container, parameters) ->
      return {
        name: parameters.name
      }

    firstInstance = container.make 'testFactory',
      name: 'firstInstance'

    expect(firstInstance.name).toBe('firstInstance')

    secondInstance = container.make 'testFactory',
      name: 'secondInstance'

    expect(secondInstance.name).toBe('secondInstance')