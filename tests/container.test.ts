import {Container} from "../src/container";
import Simpsons, {FamilyMember, Homer} from "./helpers/simpsons";

describe("Container", () => {
  let container: Container

  beforeEach(() => {
    container = new Container()
  })

  it("get instance", () => {
    container.factory("Homer", Simpsons.HomerFactory)

    const homer: FamilyMember = container.get("Homer")

    expect(homer.getName()).toEqual("Homer Simpson")
  })


  it("get instance with dependency injection", () => {
    container.factory("Homer", Simpsons.HomerFactory)
    container.factory("Child", Simpsons.BartFactory)

    const homer: Homer = container.get("Homer")

    expect(homer.getChild().getName()).toEqual("Bart Simpson")
  })

  it("get instance with dependency replacement", () => {
    container.factory("Homer", Simpsons.HomerFactory)
    container.factory("Child", Simpsons.BartFactory)

    const homer: Homer = container.get("Homer")

    expect(homer.getChild().getName()).toEqual("Bart Simpson")

    container.factory("Lisa", Simpsons.LisaFactory)

    container
      .when("Homer")
      .needs("Child")
      .give("Lisa")

    expect(homer.getChild().getName()).toEqual("Lisa Simpson")

    container
      .when("Homer")
      .needs("Child")
      .give(Simpsons.MaggieFactory)

    expect(homer.getChild().getName()).toEqual("Maggie Simpson")
  })

  it("build concrete instance with dependency replacement", () => {
    container.factory("Homer", Simpsons.HomerFactory)
    container.factory("Child", Simpsons.BartFactory)

    let homer: Homer = container
      .build("Homer")
      .needs("Child")
      .give(Simpsons.LisaFactory)
      .get()

    expect(homer.getChild().getName()).toEqual("Lisa Simpson")

    homer = container.get("Homer")

    expect(homer.getChild().getName()).toEqual("Bart Simpson")
  })

  it("get instance with many dependency replacements", () => {
    container.factory("Homer", Simpsons.HomerFactory)

    container
      .when("Homer")
      .needs("Child")
      .give(Simpsons.BartFactory)
      .needs("Wife")
      .give(Simpsons.MargeFactory)

    const homer: Homer = container.get("Homer")

    expect(homer.getChild().getName())
      .toEqual("Bart Simpson")

    expect(homer.getWife().getName())
      .toEqual("Marge Simpson")
  })

  it("configure container from factory", () => {
    container.factory("Configure", (container) => {
      container.global().factory("Homer", Simpsons.HomerFactory)
      return true
    })

    expect(container.get("Configure")).toBeTruthy()

    const homer = container.get("Homer")

    expect(homer.getName()).toEqual("Homer Simpson")
  })

  it("make shared instance", () => {
    container.sharedFactory("Homer", Simpsons.HomerFactory)
    container.alias("AnotherHomer", "Homer")

    const homer: Homer = container.get("Homer")

    expect(homer.getName()).toEqual("Homer Simpson")

    homer.setName("I am is shared Homer")

    expect(homer.getName()).toEqual("I am is shared Homer")

    container.get("AnotherHomer").setName("I am is shared AnotherHomer")

    expect(homer.getName()).toEqual("I am is shared AnotherHomer")
  })
})
