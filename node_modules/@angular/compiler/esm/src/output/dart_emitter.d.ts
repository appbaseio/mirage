import * as o from './output_ast';
import { OutputEmitter } from './abstract_emitter';
import { ImportGenerator } from './path_util';
export declare function debugOutputAstAsDart(ast: o.Statement | o.Expression | o.Type | any[]): string;
export declare class DartEmitter implements OutputEmitter {
    private _importGenerator;
    constructor(_importGenerator: ImportGenerator);
    emitStatements(moduleUrl: string, stmts: o.Statement[], exportedVars: string[]): string;
}
