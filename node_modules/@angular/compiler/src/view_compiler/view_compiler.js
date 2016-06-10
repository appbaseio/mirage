"use strict";
var core_1 = require('@angular/core');
var compile_element_1 = require('./compile_element');
var compile_view_1 = require('./compile_view');
var view_builder_1 = require('./view_builder');
var view_binder_1 = require('./view_binder');
var config_1 = require('../config');
var ViewCompileResult = (function () {
    function ViewCompileResult(statements, viewFactoryVar, dependencies) {
        this.statements = statements;
        this.viewFactoryVar = viewFactoryVar;
        this.dependencies = dependencies;
    }
    return ViewCompileResult;
}());
exports.ViewCompileResult = ViewCompileResult;
var ViewCompiler = (function () {
    function ViewCompiler(_genConfig) {
        this._genConfig = _genConfig;
    }
    ViewCompiler.prototype.compileComponent = function (component, template, styles, pipes) {
        var statements = [];
        var dependencies = [];
        var view = new compile_view_1.CompileView(component, this._genConfig, pipes, styles, 0, compile_element_1.CompileElement.createNull(), []);
        view_builder_1.buildView(view, template, dependencies);
        // Need to separate binding from creation to be able to refer to
        // variables that have been declared after usage.
        view_binder_1.bindView(view, template);
        view_builder_1.finishView(view, statements);
        return new ViewCompileResult(statements, view.viewFactory.name, dependencies);
    };
    ViewCompiler.decorators = [
        { type: core_1.Injectable },
    ];
    ViewCompiler.ctorParameters = [
        { type: config_1.CompilerConfig, },
    ];
    return ViewCompiler;
}());
exports.ViewCompiler = ViewCompiler;
//# sourceMappingURL=view_compiler.js.map