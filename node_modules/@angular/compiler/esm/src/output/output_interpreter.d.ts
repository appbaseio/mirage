import * as o from './output_ast';
export declare function interpretStatements(statements: o.Statement[], resultVar: string, instanceFactory: InstanceFactory): any;
export interface InstanceFactory {
    createInstance(superClass: any, clazz: any, constructorArgs: any[], props: Map<string, any>, getters: Map<string, Function>, methods: Map<string, Function>): DynamicInstance;
}
export declare abstract class DynamicInstance {
    readonly props: Map<string, any>;
    readonly getters: Map<string, Function>;
    readonly methods: Map<string, any>;
    readonly clazz: any;
}
