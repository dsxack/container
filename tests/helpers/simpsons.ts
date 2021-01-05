import {Container} from "../../src/container";

export interface FamilyMember {
  getName(): string
}

export class Homer implements FamilyMember {
  container: Container
  name: string

  constructor(container: Container) {
    this.name = "Homer Simpson"
    this.container = container
  }

  getChild(): FamilyMember {
    return this.container.get("Child")
  }

  getWife(): FamilyMember {
    return this.container.get("Wife")
  }

  getName() {
    return this.name
  }

  setName(name: string) {
    this.name = name
  }
}

export class Bart implements FamilyMember {
  getName() {
    return "Bart Simpson"
  }
}

export class Lisa implements FamilyMember {
  getName() {
    return "Lisa Simpson"
  }
}

export class Maggie implements FamilyMember {
  getName() {
    return "Maggie Simpson"
  }
}

export class Marge implements FamilyMember {
  getName() {
    return "Marge Simpson"
  }
}

export default {
  HomerFactory: (container: Container) => new Homer(container),
  BartFactory: () => new Bart(),
  LisaFactory: () => new Lisa(),
  MaggieFactory: () => new Maggie(),
  MargeFactory: () => new Marge()
}
