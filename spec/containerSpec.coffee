Container = require '../dist/container'  if require?
Container = window.DI if window?

describe 'Container', ->
  container = null

  beforeEach ->
    container = new Container;

  it 'bind and build', ->
    container.bind 'Homer', (container, from) ->
      new class Homer
        eat: ->
          return 'Amm...am..am from ' + from


    homer = container.make 'Homer', 'plate'

    expect(homer.eat).toBeDefined()
    expect(homer.eat()).toEqual('Amm...am..am from plate')


  it 'dependency injection', ->


  it 'dependency replacement', ->
