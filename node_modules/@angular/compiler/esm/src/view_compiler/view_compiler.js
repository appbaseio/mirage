import { Injectable } from '@angular/core';
import { CompileElement } from './compile_element';
import { CompileView } from './compile_view';
import { buildView, finishView } from './view_builder';
import { bindView } from './view_binder';
import { CompilerConfig } from '../config';
export class ViewCompileResult {
    constructor(statements, viewFactoryVar, dependencies) {
        this.statements = statements;
        this.viewFactoryVar = viewFactoryVar;
        this.dependencies = dependencies;
    }
}
export class ViewCompiler {
    constructor(_genConfig) {
        this._genConfig = _genConfig;
    }
    compileComponent(component, template, styles, pipes) {
        var statements = [];
        var dependencies = [];
        var view = new CompileView(component, this._genConfig, pipes, styles, 0, CompileElement.createNull(), []);
        buildView(view, template, dependencies);
        // Need to separate binding from creation to be able to refer to
        // variables that have been declared after usage.
        bindView(view, template);
        finishView(view, statements);
        return new ViewCompileResult(statements, view.viewFactory.name, dependencies);
    }
}
ViewCompiler.decorators = [
    { type: Injectable },
];
ViewCompiler.ctorParameters = [
    { type: CompilerConfig, },
];
//# sourceMappingURL=view_compiler.js.map