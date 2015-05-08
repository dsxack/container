Container = require "../dist/container"
Simpsons = require "./helpers/simpsons"

describe "Container", ->
  container = null

  beforeEach ->
    container = new Container

  it "get instance", ->
    container.factory "Homer", Simpsons.Homer

    homer = container.get "Homer"

    expect(homer.getName())
    .toEqual "Homer Simpson"

  it "get instance with dependency injection", ->
    container.factory "Homer", Simpsons.Homer
    container.factory "Child", Simpsons.Bart

    homer = container.get "Homer"

    expect(homer.getChild().getName())
    .toEqual "Bart Simpson"

  it "get instance with dependency replacement", ->
    container.factory "Homer", Simpsons.Homer
    container.factory "Child", Simpsons.Bart

    homer = container.get "Homer"

    expect(homer.getChild().getName())
    .toEqual "Bart Simpson"

    container.factory "Lisa", Simpsons.Lisa

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

  it "build concrete instance with dependency replacement", ->
    container.factory "Homer", Simpsons.Homer
    container.factory "Child", Simpsons.Bart

    homer = container.build "Homer"
    .needs "Child"
    .give Simpsons.Lisa
    .get()

    expect(homer.getChild().getName())
    .toEqual "Lisa Simpson"

    homer = container.get "Homer"

    expect(homer.getChild().getName())
    .toEqual "Bart Simpson"

  it "get instance with many dependency replacements", ->
    container.factory "Homer", Simpsons.Homer

    container.when "Homer"
    .needs "Child"
    .give Simpsons.Bart
    .needs "Wife"
    .give Simpsons.Marge

    homer = container.get "Homer"

    expect(homer.getChild().getName())
    .toEqual "Bart Simpson"

    expect(homer.getWife().getName())
    .toEqual "Marge Simpson"

  it "configure container from factory", ->
    container.factory "Configure", (container) ->
      container.global().factory "Homer", Simpsons.Homer

      return true

    expect(container.get "Configure")
    .toBeTruthy()

    homer = container.get "Homer"

    expect(homer.getName())
    .toEqual "Homer Simpson"

  it "make shared instance", ->
    container.sharedFactory "Homer", Simpsons.Homer
    container.alias "Homer", "AnotherHomer"

    homer = container.get "Homer"

    expect(homer.getName())
    .toEqual "Homer Simpson"

    container.get("AnotherHomer").getName = -> "I am is shared Homer"

    expect(homer.getName())
    .toEqual "I am is shared Homer"