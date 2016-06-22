import { ViewEncapsulation, Injectable } from '@angular/core';
import { CompileIdentifierMetadata } from './compile_metadata';
import * as o from './output/output_ast';
import { ShadowCss } from './shadow_css';
import { UrlResolver } from './url_resolver';
import { extractStyleUrls } from './style_url_resolver';
import { isPresent } from '../src/facade/lang';
const COMPONENT_VARIABLE = '%COMP%';
const HOST_ATTR = `_nghost-${COMPONENT_VARIABLE}`;
const CONTENT_ATTR = `_ngcontent-${COMPONENT_VARIABLE}`;
export class StylesCompileDependency {
    constructor(moduleUrl, isShimmed, valuePlaceholder) {
        this.moduleUrl = moduleUrl;
        this.isShimmed = isShimmed;
        this.valuePlaceholder = valuePlaceholder;
    }
}
export class StylesCompileResult {
    constructor(statements, stylesVar, dependencies) {
        this.statements = statements;
        this.stylesVar = stylesVar;
        this.dependencies = dependencies;
    }
}
export class StyleCompiler {
    constructor(_urlResolver) {
        this._urlResolver = _urlResolver;
        this._shadowCss = new ShadowCss();
    }
    compileComponent(comp) {
        var shim = comp.template.encapsulation === ViewEncapsulation.Emulated;
        return this._compileStyles(getStylesVarName(comp), comp.template.styles, comp.template.styleUrls, shim);
    }
    compileStylesheet(stylesheetUrl, cssText, isShimmed) {
        var styleWithImports = extractStyleUrls(this._urlResolver, stylesheetUrl, cssText);
        return this._compileStyles(getStylesVarName(null), [styleWithImports.style], styleWithImports.styleUrls, isShimmed);
    }
    _compileStyles(stylesVar, plainStyles, absUrls, shim) {
        var styleExpressions = plainStyles.map(plainStyle => o.literal(this._shimIfNeeded(plainStyle, shim)));
        var dependencies = [];
        for (var i = 0; i < absUrls.length; i++) {
            var identifier = new CompileIdentifierMetadata({ name: getStylesVarName(null) });
            dependencies.push(new StylesCompileDependency(absUrls[i], shim, identifier));
            styleExpressions.push(new o.ExternalExpr(identifier));
        }
        // styles variable contains plain strings and arrays of other styles arrays (recursive),
        // so we set its type to dynamic.
        var stmt = o.variable(stylesVar)
            .set(o.literalArr(styleExpressions, new o.ArrayType(o.DYNAMIC_TYPE, [o.TypeModifier.Const])))
            .toDeclStmt(null, [o.StmtModifier.Final]);
        return new StylesCompileResult([stmt], stylesVar, dependencies);
    }
    _shimIfNeeded(style, shim) {
        return shim ? this._shadowCss.shimCssText(style, CONTENT_ATTR, HOST_ATTR) : style;
    }
}
StyleCompiler.decorators = [
    { type: Injectable },
];
StyleCompiler.ctorParameters = [
    { type: UrlResolver, },
];
function getStylesVarName(component) {
    var result = `styles`;
    if (isPresent(component)) {
        result += `_${component.type.name}`;
    }
    return result;
}
//# sourceMappingURL=style_compiler.js.map