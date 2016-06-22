import Promise = require('any-promise');
import { Dependency, DependencyTree, Emitter } from '../interfaces';
export interface Options {
    cwd: string;
    emitter: Emitter;
    name?: string;
    dev?: boolean;
    peer?: boolean;
    ambient?: boolean;
    parent?: DependencyTree;
}
export declare function resolveAllDependencies(options: Options): Promise<DependencyTree>;
export declare function resolveDependency(dependency: Dependency, options: Options): Promise<DependencyTree>;
export declare function resolveBowerDependencies(options: Options): Promise<DependencyTree>;
export declare function resolveNpmDependencies(options: Options): Promise<DependencyTree>;
export declare function resolveTypeDependencies(options: Options): Promise<DependencyTree>;
