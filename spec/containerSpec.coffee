Container = require '../dist/container'  if require?
Container = window.DI if window?

describe 'Container', ->
  container = null

  beforeEach ->
    container = new Container;

  it 'make instance', ->
    container.bind 'Homer', (container, from) ->
      new class Homer
        eat: ->
          'Amm...am..am from ' + from

    homer = container.make 'Homer', 'plate'

    expect(homer.eat()).toEqual 'Amm...am..am from plate'

  it 'make instance with dependency injection', ->
    container.bind 'Homer', (container) ->
      new class Homer
        child: ->
          container.make 'HomerChild'

        getName: ->
          'Homer'

    container.bind 'HomerChild', ->
      new class Bart
        getName: ->
          'Bart'

    homer = container.make 'Homer'

    expect(homer.child().getName()).toEqual 'Bart'

  it 'make instance with dependency replacement', ->
    container.bind 'Homer', (container) ->
      new class Homer
        child: ->
          container.make 'HomerChild'

        getName: ->
          'Homer'

    container.bind 'HomerChild', ->
      new class Bart
        getName: ->
          'Bart'

    homer = container.make 'Homer'

    expect(homer.child().getName()).toEqual 'Bart'

    container.bind 'Lisa', ->
      new class Lisa
        getName: ->
          'Lisa'

    container.when 'Homer'
    .needs 'HomerChild'
    .give 'Lisa'

    expect(homer.child().getName()).toEqual 'Lisa'

    container.when 'Homer'
    .needs 'HomerChild'
    .give ->
      new class Maggie
        getName: ->
          'Maggie'

    expect(homer.child().getName()).toEqual 'Maggie'

  it 'instance building', ->
