Container = require "../dist/container"
Simpsons = require "./helpers/simpsons"

describe "Container", ->
  container = null

  beforeEach ->
    container = new Container

  it "make instance", ->
    container.bind "Homer", Simpsons.Homer

    homer = container.make "Homer"

    expect(homer.getName())
    .toEqual "Homer Simpson"

  it "make instance with dependency injection", ->
    container.bind "Homer", Simpsons.Homer
    container.bind "Child", Simpsons.Bart

    homer = container.make "Homer"

    expect(homer.getChild().getName())
    .toEqual "Bart Simpson"

  it "make instance with dependency replacement", ->
    container.bind "Homer", Simpsons.Homer
    container.bind "Child", Simpsons.Bart

    homer = container.make "Homer"

    expect(homer.getChild().getName())
    .toEqual "Bart Simpson"

    container.bind "Lisa", Simpsons.Lisa

    container.when "Homer"
    .needs "Child"
    .give "Lisa"

    expect(homer.getChild().getName())
    .toEqual "Lisa Simpson"

    container.when "Homer"
    .needs "Child"
    .give Simpsons.Maggie

    expect(homer.getChild().getName())
    .toEqual "Maggie Simpson"

  xit "instance building", ->
    # TODO