import Promise = require('any-promise');
import { DependencyTree, Emitter } from '../interfaces';
export interface Options {
    cwd: string;
    name: string;
    ambient: boolean;
    meta: boolean;
    emitter: Emitter;
}
export interface CompileResult {
    cwd: string;
    name: string;
    tree: DependencyTree;
    main: string;
    browser: string;
    ambient: boolean;
}
export default function compile(tree: DependencyTree, options: Options): Promise<CompileResult>;
