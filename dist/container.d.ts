declare type Factory = (container: Container, parameters?: any) => any;
export declare class Container {
    private factories;
    private shared;
    private instances;
    private aliases;
    private factoryContexts;
    readonly parent?: Container;
    constructor(parent?: Container);
    factory(name: string, factory: Factory): Container;
    sharedFactory(name: string, factory: Factory): Container;
    alias(name: string, alias: string): Container;
    setShared(name: string, isShared: boolean): Container;
    resolveAlias(name: string): string;
    set(name: string, instance: any): Container;
    get(name: string, parameters?: any): any;
    getFactory(name: string): Factory;
    unsetFactory(name: string): Container;
    unsetAlias(name: string): Container;
    build(name: string): InstanceBuilder;
    when(name: string): BindingBuilder;
    addContextualBinding(name: string, dependency: string, implementation: Factory | string): Container;
    resolveFactoryContext(name: string): Container;
    global(): Container;
}
declare class BindingBuilder {
    private container;
    private readonly name;
    private dependency;
    constructor(container: Container, name: string);
    needs(dependency: string): BindingBuilder;
    give(implementation: string | Factory): BindingBuilder;
}
declare class InstanceBuilder {
    private container;
    private readonly name;
    private dependency;
    constructor(parent: Container, name: string);
    needs(dependency: string): InstanceBuilder;
    give(implementation: string | Factory): InstanceBuilder;
    get(parameters?: any): any;
}
export {};
