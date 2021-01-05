type Factory = (container: Container, parameters?: any) => any

export class Container {
  private factories: { [name: string]: Factory } = {}
  private shared: { [name: string]: boolean } = {}
  private instances: { [name: string]: any } = {}
  private aliases: { [name: string]: string } = {}
  private factoryContexts: { [name: string]: Container } = {}
  readonly parent?: Container

  constructor(parent?: Container) {
    this.parent = parent
  }

  factory(name: string, factory: Factory): Container {
    this.factories[name] = factory
    return this;
  }

  sharedFactory(name: string, factory: Factory): Container {
    this.factory(name, factory)
    this.setShared(name, true)
    return this;
  }

  alias(name: string, alias: string): Container {
    this.aliases[name] = alias
    return this;
  }

  setShared(name: string, isShared: boolean): Container {
    name = this.resolveAlias(name)
    this.shared[name] = isShared
    return this;
  }

  resolveAlias(name: string): string {
    if (this.aliases[name]) {
      return this.aliases[name]
    }
    return name
  }

  set(name: string, instance: any): Container {
    this.instances[name] = instance
    return this;
  }

  get(name: string, parameters?: any): any {
    name = this.resolveAlias(name)

    if (this.instances[name]) {
      return this.instances[name]
    }

    const factory = this.getFactory(name)
    const factoryContext = this.resolveFactoryContext(name)
    const instance = factory(factoryContext, parameters)

    if (this.shared[name]) {
      this.instances[name] = instance
    }

    return instance
  }

  getFactory(name: string): Factory {
    const alias = this.resolveAlias(name)

    if (this.factories[alias]) {
      return this.factories[alias]
    }

    if (this.parent) {
      return this.parent.getFactory(alias)
    }

    throw new Error("Factory with name '{ name }' isnt set")
  }

  unsetFactory(name: string): Container {
    if (this.factories[name]) {
      delete this.factories[name]
    }

    if (this.parent) {
      this.parent.unsetFactory(name)
    }

    return this;
  }

  unsetAlias(name: string): Container {
    delete this.aliases[name]

    if (this.parent) {
      this.parent.unsetAlias(name)
    }

    return this;
  }

  build(name: string): InstanceBuilder {
    return new InstanceBuilder(this, name)
  }

  when(name: string): BindingBuilder {
    return new BindingBuilder(this, name)
  }

  addContextualBinding(name: string, dependency: string, implementation: Factory | string): Container {
    const contextContainer = this.resolveFactoryContext(name)

    if (typeof implementation === "string") {
      contextContainer.unsetFactory(dependency)
      contextContainer.alias(dependency, implementation)
      return this;
    }

    contextContainer.unsetAlias(dependency)
    contextContainer.factory(dependency, implementation)
    return this;
  }

  resolveFactoryContext(name: string): Container {
    if (!this.factoryContexts[name]) {
      this.factoryContexts[name] = new Container(this)
    }

    return this.factoryContexts[name]
  }

  global(): Container {
    if (this.parent) {
      return this.parent.global()
    }

    return this
  }
}

class BindingBuilder {
  private container: Container
  private readonly name: string
  private dependency: string

  constructor(container: Container, name: string) {
    this.container = container
    this.name = name
  }

  needs(dependency: string): BindingBuilder {
    this.dependency = dependency
    return this
  }

  give(implementation: string | Factory): BindingBuilder {
    this.container.addContextualBinding(this.name, this.dependency, implementation)
    return this
  }
}

class InstanceBuilder {
  private container: Container
  private readonly name: string
  private dependency: string

  constructor(parent: Container, name: string) {
    this.name = name
    this.container = new Container(parent)
  }

  needs(dependency: string): InstanceBuilder {
    this.dependency = dependency
    return this
  }

  give(implementation: string | Factory): InstanceBuilder {
    this.container.addContextualBinding(this.name, this.dependency, implementation)
    return this;
  }

  get(parameters?: any): any {
    return this.container.get(this.name, parameters)
  }
}
