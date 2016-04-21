var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { IS_DART, isBlank, evalExpression } from 'angular2/src/facade/lang';
import { BaseException } from 'angular2/src/facade/exceptions';
import { ListWrapper, SetWrapper, StringMapWrapper } from 'angular2/src/facade/collection';
import { PromiseWrapper } from 'angular2/src/facade/async';
import { createHostComponentMeta, CompileDirectiveMetadata } from './directive_metadata';
import { templateVisitAll } from './template_ast';
import { Injectable } from 'angular2/src/core/di';
import { SourceModule, moduleRef, SourceExpression } from './source_module';
import { ChangeDetectionCompiler, CHANGE_DETECTION_JIT_IMPORTS } from './change_detector_compiler';
import { StyleCompiler } from './style_compiler';
import { ViewCompiler, VIEW_JIT_IMPORTS } from './view_compiler';
import { ProtoViewCompiler, APP_VIEW_MODULE_REF, PROTO_VIEW_JIT_IMPORTS } from './proto_view_compiler';
import { TemplateParser, PipeCollector } from './template_parser';
import { TemplateNormalizer } from './template_normalizer';
import { RuntimeMetadataResolver } from './runtime_metadata';
import { HostViewFactory } from 'angular2/src/core/linker/view';
import { ChangeDetectorGenConfig } from 'angular2/src/core/change_detection/change_detection';
import { ResolvedMetadataCache } from 'angular2/src/core/linker/resolved_metadata_cache';
import { codeGenExportVariable, MODULE_SUFFIX, addAll, Expression } from './util';
export var METADATA_CACHE_MODULE_REF = moduleRef('package:angular2/src/core/linker/resolved_metadata_cache' + MODULE_SUFFIX);
/**
 * An internal module of the Angular compiler that begins with component types,
 * extracts templates, and eventually produces a compiled version of the component
 * ready for linking into an application.
 */
export let TemplateCompiler = class TemplateCompiler {
    constructor(_runtimeMetadataResolver, _templateNormalizer, _templateParser, _styleCompiler, _cdCompiler, _protoViewCompiler, _viewCompiler, _resolvedMetadataCache, _genConfig) {
        this._runtimeMetadataResolver = _runtimeMetadataResolver;
        this._templateNormalizer = _templateNormalizer;
        this._templateParser = _templateParser;
        this._styleCompiler = _styleCompiler;
        this._cdCompiler = _cdCompiler;
        this._protoViewCompiler = _protoViewCompiler;
        this._viewCompiler = _viewCompiler;
        this._resolvedMetadataCache = _resolvedMetadataCache;
        this._genConfig = _genConfig;
        this._hostCacheKeys = new Map();
        this._compiledTemplateCache = new Map();
        this._compiledTemplateDone = new Map();
    }
    normalizeDirectiveMetadata(directive) {
        if (!directive.isComponent) {
            // For non components there is nothing to be normalized yet.
            return PromiseWrapper.resolve(directive);
        }
        return this._templateNormalizer.normalizeTemplate(directive.type, directive.template)
            .then((normalizedTemplate) => new CompileDirectiveMetadata({
            type: directive.type,
            isComponent: directive.isComponent,
            dynamicLoadable: directive.dynamicLoadable,
            selector: directive.selector,
            exportAs: directive.exportAs,
            changeDetection: directive.changeDetection,
            inputs: directive.inputs,
            outputs: directive.outputs,
            hostListeners: directive.hostListeners,
            hostProperties: directive.hostProperties,
            hostAttributes: directive.hostAttributes,
            lifecycleHooks: directive.lifecycleHooks,
            providers: directive.providers,
            viewProviders: directive.viewProviders,
            queries: directive.queries,
            viewQueries: directive.viewQueries,
            template: normalizedTemplate
        }));
    }
    compileHostComponentRuntime(type) {
        var compMeta = this._runtimeMetadataResolver.getDirectiveMetadata(type);
        var hostCacheKey = this._hostCacheKeys.get(type);
        if (isBlank(hostCacheKey)) {
            hostCacheKey = new Object();
            this._hostCacheKeys.set(type, hostCacheKey);
            assertComponent(compMeta);
            var hostMeta = createHostComponentMeta(compMeta.type, compMeta.selector);
            this._compileComponentRuntime(hostCacheKey, hostMeta, [compMeta], [], []);
        }
        return this._compiledTemplateDone.get(hostCacheKey)
            .then((compiledTemplate) => new HostViewFactory(compMeta.selector, compiledTemplate.viewFactory));
    }
    clearCache() {
        this._styleCompiler.clearCache();
        this._compiledTemplateCache.clear();
        this._compiledTemplateDone.clear();
        this._hostCacheKeys.clear();
    }
    compileTemplatesCodeGen(components) {
        if (components.length === 0) {
            throw new BaseException('No components given');
        }
        var declarations = [];
        components.forEach(componentWithDirs => {
            var compMeta = componentWithDirs.component;
            assertComponent(compMeta);
            this._compileComponentCodeGen(compMeta, componentWithDirs.directives, componentWithDirs.pipes, declarations);
            if (compMeta.dynamicLoadable) {
                var hostMeta = createHostComponentMeta(compMeta.type, compMeta.selector);
                var viewFactoryExpression = this._compileComponentCodeGen(hostMeta, [compMeta], [], declarations);
                var constructionKeyword = IS_DART ? 'const' : 'new';
                var compiledTemplateExpr = `${constructionKeyword} ${APP_VIEW_MODULE_REF}HostViewFactory('${compMeta.selector}',${viewFactoryExpression})`;
                var varName = codeGenHostViewFactoryName(compMeta.type);
                declarations.push(`${codeGenExportVariable(varName)}${compiledTemplateExpr};`);
            }
        });
        var moduleUrl = components[0].component.type.moduleUrl;
        return new SourceModule(`${templateModuleUrl(moduleUrl)}`, declarations.join('\n'));
    }
    compileStylesheetCodeGen(stylesheetUrl, cssText) {
        return this._styleCompiler.compileStylesheetCodeGen(stylesheetUrl, cssText);
    }
    _compileComponentRuntime(cacheKey, compMeta, viewDirectives, pipes, compilingComponentsPath) {
        let uniqViewDirectives = removeDuplicates(viewDirectives);
        let uniqViewPipes = removeDuplicates(pipes);
        var compiledTemplate = this._compiledTemplateCache.get(cacheKey);
        var done = this._compiledTemplateDone.get(cacheKey);
        if (isBlank(compiledTemplate)) {
            compiledTemplate = new CompiledTemplate();
            this._compiledTemplateCache.set(cacheKey, compiledTemplate);
            done = PromiseWrapper
                .all([this._styleCompiler.compileComponentRuntime(compMeta.template)].concat(uniqViewDirectives.map(dirMeta => this.normalizeDirectiveMetadata(dirMeta))))
                .then((stylesAndNormalizedViewDirMetas) => {
                var normalizedViewDirMetas = stylesAndNormalizedViewDirMetas.slice(1);
                var styles = stylesAndNormalizedViewDirMetas[0];
                var parsedTemplate = this._templateParser.parse(compMeta.template.template, normalizedViewDirMetas, uniqViewPipes, compMeta.type.name);
                var childPromises = [];
                var usedDirectives = DirectiveCollector.findUsedDirectives(parsedTemplate);
                usedDirectives.components.forEach(component => this._compileNestedComponentRuntime(component, compilingComponentsPath, childPromises));
                return PromiseWrapper.all(childPromises)
                    .then((_) => {
                    var filteredPipes = filterPipes(parsedTemplate, uniqViewPipes);
                    compiledTemplate.init(this._createViewFactoryRuntime(compMeta, parsedTemplate, usedDirectives.directives, styles, filteredPipes));
                    return compiledTemplate;
                });
            });
            this._compiledTemplateDone.set(cacheKey, done);
        }
        return compiledTemplate;
    }
    _compileNestedComponentRuntime(childComponentDir, parentCompilingComponentsPath, childPromises) {
        var compilingComponentsPath = ListWrapper.clone(parentCompilingComponentsPath);
        var childCacheKey = childComponentDir.type.runtime;
        var childViewDirectives = this._runtimeMetadataResolver.getViewDirectivesMetadata(childComponentDir.type.runtime);
        var childViewPipes = this._runtimeMetadataResolver.getViewPipesMetadata(childComponentDir.type.runtime);
        var childIsRecursive = ListWrapper.contains(compilingComponentsPath, childCacheKey);
        compilingComponentsPath.push(childCacheKey);
        this._compileComponentRuntime(childCacheKey, childComponentDir, childViewDirectives, childViewPipes, compilingComponentsPath);
        if (!childIsRecursive) {
            // Only wait for a child if it is not a cycle
            childPromises.push(this._compiledTemplateDone.get(childCacheKey));
        }
    }
    _createViewFactoryRuntime(compMeta, parsedTemplate, directives, styles, pipes) {
        if (IS_DART || !this._genConfig.useJit) {
            var changeDetectorFactories = this._cdCompiler.compileComponentRuntime(compMeta.type, compMeta.changeDetection, parsedTemplate);
            var protoViews = this._protoViewCompiler.compileProtoViewRuntime(this._resolvedMetadataCache, compMeta, parsedTemplate, pipes);
            return this._viewCompiler.compileComponentRuntime(compMeta, parsedTemplate, styles, protoViews.protoViews, changeDetectorFactories, (compMeta) => this._getNestedComponentViewFactory(compMeta));
        }
        else {
            var declarations = [];
            var viewFactoryExpr = this._createViewFactoryCodeGen('resolvedMetadataCache', compMeta, new SourceExpression([], 'styles'), parsedTemplate, pipes, declarations);
            var vars = { 'exports': {}, 'styles': styles, 'resolvedMetadataCache': this._resolvedMetadataCache };
            directives.forEach(dirMeta => {
                vars[dirMeta.type.name] = dirMeta.type.runtime;
                if (dirMeta.isComponent && dirMeta.type.runtime !== compMeta.type.runtime) {
                    vars[`viewFactory_${dirMeta.type.name}0`] = this._getNestedComponentViewFactory(dirMeta);
                }
            });
            pipes.forEach(pipeMeta => vars[pipeMeta.type.name] = pipeMeta.type.runtime);
            var declarationsWithoutImports = SourceModule.getSourceWithoutImports(declarations.join('\n'));
            return evalExpression(`viewFactory_${compMeta.type.name}`, viewFactoryExpr, declarationsWithoutImports, mergeStringMaps([vars, CHANGE_DETECTION_JIT_IMPORTS, PROTO_VIEW_JIT_IMPORTS, VIEW_JIT_IMPORTS]));
        }
    }
    _getNestedComponentViewFactory(compMeta) {
        return this._compiledTemplateCache.get(compMeta.type.runtime).viewFactory;
    }
    _compileComponentCodeGen(compMeta, directives, pipes, targetDeclarations) {
        let uniqueDirectives = removeDuplicates(directives);
        let uniqPipes = removeDuplicates(pipes);
        var styleExpr = this._styleCompiler.compileComponentCodeGen(compMeta.template);
        var parsedTemplate = this._templateParser.parse(compMeta.template.template, uniqueDirectives, uniqPipes, compMeta.type.name);
        var filteredPipes = filterPipes(parsedTemplate, uniqPipes);
        return this._createViewFactoryCodeGen(`${METADATA_CACHE_MODULE_REF}CODEGEN_RESOLVED_METADATA_CACHE`, compMeta, styleExpr, parsedTemplate, filteredPipes, targetDeclarations);
    }
    _createViewFactoryCodeGen(resolvedMetadataCacheExpr, compMeta, styleExpr, parsedTemplate, pipes, targetDeclarations) {
        var changeDetectorsExprs = this._cdCompiler.compileComponentCodeGen(compMeta.type, compMeta.changeDetection, parsedTemplate);
        var protoViewExprs = this._protoViewCompiler.compileProtoViewCodeGen(new Expression(resolvedMetadataCacheExpr), compMeta, parsedTemplate, pipes);
        var viewFactoryExpr = this._viewCompiler.compileComponentCodeGen(compMeta, parsedTemplate, styleExpr, protoViewExprs.protoViews, changeDetectorsExprs, codeGenComponentViewFactoryName);
        addAll(changeDetectorsExprs.declarations, targetDeclarations);
        addAll(protoViewExprs.declarations, targetDeclarations);
        addAll(viewFactoryExpr.declarations, targetDeclarations);
        return viewFactoryExpr.expression;
    }
};
TemplateCompiler = __decorate([
    Injectable(), 
    __metadata('design:paramtypes', [RuntimeMetadataResolver, TemplateNormalizer, TemplateParser, StyleCompiler, ChangeDetectionCompiler, ProtoViewCompiler, ViewCompiler, ResolvedMetadataCache, ChangeDetectorGenConfig])
], TemplateCompiler);
export class NormalizedComponentWithViewDirectives {
    constructor(component, directives, pipes) {
        this.component = component;
        this.directives = directives;
        this.pipes = pipes;
    }
}
class CompiledTemplate {
    constructor() {
        this.viewFactory = null;
    }
    init(viewFactory) { this.viewFactory = viewFactory; }
}
function assertComponent(meta) {
    if (!meta.isComponent) {
        throw new BaseException(`Could not compile '${meta.type.name}' because it is not a component.`);
    }
}
function templateModuleUrl(moduleUrl) {
    var urlWithoutSuffix = moduleUrl.substring(0, moduleUrl.length - MODULE_SUFFIX.length);
    return `${urlWithoutSuffix}.template${MODULE_SUFFIX}`;
}
function codeGenHostViewFactoryName(type) {
    return `hostViewFactory_${type.name}`;
}
function codeGenComponentViewFactoryName(nestedCompType) {
    return `${moduleRef(templateModuleUrl(nestedCompType.type.moduleUrl))}viewFactory_${nestedCompType.type.name}0`;
}
function mergeStringMaps(maps) {
    var result = {};
    maps.forEach((map) => { StringMapWrapper.forEach(map, (value, key) => { result[key] = value; }); });
    return result;
}
function removeDuplicates(items) {
    let res = [];
    items.forEach(item => {
        let hasMatch = res.filter(r => r.type.name == item.type.name && r.type.moduleUrl == item.type.moduleUrl &&
            r.type.runtime == item.type.runtime)
            .length > 0;
        if (!hasMatch) {
            res.push(item);
        }
    });
    return res;
}
class DirectiveCollector {
    constructor() {
        this.directives = [];
        this.components = [];
    }
    static findUsedDirectives(parsedTemplate) {
        var collector = new DirectiveCollector();
        templateVisitAll(collector, parsedTemplate);
        return collector;
    }
    visitBoundText(ast, context) { return null; }
    visitText(ast, context) { return null; }
    visitNgContent(ast, context) { return null; }
    visitElement(ast, context) {
        templateVisitAll(this, ast.directives);
        templateVisitAll(this, ast.children);
        return null;
    }
    visitEmbeddedTemplate(ast, context) {
        templateVisitAll(this, ast.directives);
        templateVisitAll(this, ast.children);
        return null;
    }
    visitVariable(ast, ctx) { return null; }
    visitAttr(ast, attrNameAndValues) { return null; }
    visitDirective(ast, ctx) {
        if (ast.directive.isComponent) {
            this.components.push(ast.directive);
        }
        this.directives.push(ast.directive);
        return null;
    }
    visitEvent(ast, eventTargetAndNames) {
        return null;
    }
    visitDirectiveProperty(ast, context) { return null; }
    visitElementProperty(ast, context) { return null; }
}
function filterPipes(template, allPipes) {
    var visitor = new PipeVisitor();
    templateVisitAll(visitor, template);
    return allPipes.filter((pipeMeta) => SetWrapper.has(visitor.collector.pipes, pipeMeta.name));
}
class PipeVisitor {
    constructor() {
        this.collector = new PipeCollector();
    }
    visitBoundText(ast, context) {
        ast.value.visit(this.collector);
        return null;
    }
    visitText(ast, context) { return null; }
    visitNgContent(ast, context) { return null; }
    visitElement(ast, context) {
        templateVisitAll(this, ast.inputs);
        templateVisitAll(this, ast.outputs);
        templateVisitAll(this, ast.directives);
        templateVisitAll(this, ast.children);
        return null;
    }
    visitEmbeddedTemplate(ast, context) {
        templateVisitAll(this, ast.outputs);
        templateVisitAll(this, ast.directives);
        templateVisitAll(this, ast.children);
        return null;
    }
    visitVariable(ast, ctx) { return null; }
    visitAttr(ast, attrNameAndValues) { return null; }
    visitDirective(ast, ctx) {
        templateVisitAll(this, ast.inputs);
        templateVisitAll(this, ast.hostEvents);
        templateVisitAll(this, ast.hostProperties);
        return null;
    }
    visitEvent(ast, eventTargetAndNames) {
        ast.handler.visit(this.collector);
        return null;
    }
    visitDirectiveProperty(ast, context) {
        ast.value.visit(this.collector);
        return null;
    }
    visitElementProperty(ast, context) {
        ast.value.visit(this.collector);
        return null;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVtcGxhdGVfY29tcGlsZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJkaWZmaW5nX3BsdWdpbl93cmFwcGVyLW91dHB1dF9wYXRoLW9YRE80cDJ2LnRtcC9hbmd1bGFyMi9zcmMvY29tcGlsZXIvdGVtcGxhdGVfY29tcGlsZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O09BQU8sRUFDTCxPQUFPLEVBR1AsT0FBTyxFQUdQLGNBQWMsRUFDZixNQUFNLDBCQUEwQjtPQUMxQixFQUFDLGFBQWEsRUFBQyxNQUFNLGdDQUFnQztPQUNyRCxFQUNMLFdBQVcsRUFDWCxVQUFVLEVBRVYsZ0JBQWdCLEVBQ2pCLE1BQU0sZ0NBQWdDO09BQ2hDLEVBQUMsY0FBYyxFQUFDLE1BQU0sMkJBQTJCO09BQ2pELEVBQ0wsdUJBQXVCLEVBQ3ZCLHdCQUF3QixFQUt6QixNQUFNLHNCQUFzQjtPQUN0QixFQWNMLGdCQUFnQixFQUNqQixNQUFNLGdCQUFnQjtPQUNoQixFQUFDLFVBQVUsRUFBQyxNQUFNLHNCQUFzQjtPQUN4QyxFQUFDLFlBQVksRUFBRSxTQUFTLEVBQUUsZ0JBQWdCLEVBQUMsTUFBTSxpQkFBaUI7T0FDbEUsRUFBQyx1QkFBdUIsRUFBRSw0QkFBNEIsRUFBQyxNQUFNLDRCQUE0QjtPQUN6RixFQUFDLGFBQWEsRUFBQyxNQUFNLGtCQUFrQjtPQUN2QyxFQUFDLFlBQVksRUFBRSxnQkFBZ0IsRUFBQyxNQUFNLGlCQUFpQjtPQUN2RCxFQUNMLGlCQUFpQixFQUNqQixtQkFBbUIsRUFFbkIsc0JBQXNCLEVBQ3ZCLE1BQU0sdUJBQXVCO09BQ3ZCLEVBQUMsY0FBYyxFQUFFLGFBQWEsRUFBQyxNQUFNLG1CQUFtQjtPQUN4RCxFQUFDLGtCQUFrQixFQUFDLE1BQU0sdUJBQXVCO09BQ2pELEVBQUMsdUJBQXVCLEVBQUMsTUFBTSxvQkFBb0I7T0FDbkQsRUFBQyxlQUFlLEVBQUMsTUFBTSwrQkFBK0I7T0FDdEQsRUFBQyx1QkFBdUIsRUFBQyxN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QUMsR0FBOEIsRUFBRSxPQUFZO1FBQ2pFLEdBQUcsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUNoQyxNQUFNLENBQUMsSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUNELG9CQUFvQixDQUFDLEdBQTRCLEVBQUUsT0FBWTtRQUM3RCxHQUFHLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDaEMsTUFBTSxDQUFDLElBQUksQ0FBQztJQUNkLENBQUM7QUFDSCxDQUFDO0FBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBJU19EQVJULFxuICBUeXBlLFxuICBKc29uLFxuICBpc0JsYW5rLFxuICBpc1ByZXNlbnQsXG4gIHN0cmluZ2lmeSxcbiAgZXZhbEV4cHJlc3Npb25cbn0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9sYW5nJztcbmltcG9ydCB7QmFzZUV4Y2VwdGlvbn0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9leGNlcHRpb25zJztcbmltcG9ydCB7XG4gIExpc3RXcmFwcGVyLFxuICBTZXRXcmFwcGVyLFxuICBNYXBXcmFwcGVyLFxuICBTdHJpbmdNYXBXcmFwcGVyXG59IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvY29sbGVjdGlvbic7XG5pbXBvcnQge1Byb21pc2VXcmFwcGVyfSBmcm9tICdhbmd1bGFyMi9zcmMvZmFjYWRlL2FzeW5jJztcbmltcG9ydCB7XG4gIGNyZWF0ZUhvc3RDb21wb25lbnRNZXRhLFxuICBDb21waWxlRGlyZWN0aXZlTWV0YWRhdGEsXG4gIENvbXBpbGVUeXBlTWV0YWRhdGEsXG4gIENvbXBpbGVUZW1wbGF0ZU1ldGFkYXRhLFxuICBDb21waWxlUGlwZU1ldGFkYXRhLFxuICBDb21waWxlTWV0YWRhdGFXaXRoVHlwZVxufSBmcm9tICcuL2RpcmVjdGl2ZV9tZXRhZGF0YSc7XG5pbXBvcnQge1xuICBUZW1wbGF0ZUFzdCxcbiAgVGVtcGxhdGVBc3RWaXNpdG9yLFxuICBOZ0NvbnRlbnRBc3QsXG4gIEVtYmVkZGVkVGVtcGxhdGVBc3QsXG4gIEVsZW1lbnRBc3QsXG4gIFZhcmlhYmxlQXN0LFxuICBCb3VuZEV2ZW50QXN0LFxuICBCb3VuZEVsZW1lbnRQcm9wZXJ0eUFzdCxcbiAgQXR0ckFzdCxcbiAgQm91bmRUZXh0QXN0LFxuICBUZXh0QXN0LFxuICBEaXJlY3RpdmVBc3QsXG4gIEJvdW5kRGlyZWN0aXZlUHJvcGVydHlBc3QsXG4gIHRlbXBsYXRlVmlzaXRBbGxcbn0gZnJvbSAnLi90ZW1wbGF0ZV9hc3QnO1xuaW1wb3J0IHtJbmplY3RhYmxlfSBmcm9tICdhbmd1bGFyMi9zcmMvY29yZS9kaSc7XG5pbXBvcnQge1NvdXJjZU1vZHVsZSwgbW9kdWxlUmVmLCBTb3VyY2VFeHByZXNzaW9ufSBmcm9tICcuL3NvdXJjZV9tb2R1bGUnO1xuaW1wb3J0IHtDaGFuZ2VEZXRlY3Rpb25Db21waWxlciwgQ0hBTkdFX0RFVEVDVElPTl9KSVRfSU1QT1JUU30gZnJvbSAnLi9jaGFuZ2VfZGV0ZWN0b3JfY29tcGlsZXInO1xuaW1wb3J0IHtTdHlsZUNvbXBpbGVyfSBmcm9tICcuL3N0eWxlX2NvbXBpbGVyJztcbmltcG9ydCB7Vmlld0NvbXBpbGVyLCBWSUVXX0pJVF9JTVBPUlRTfSBmcm9tICcuL3ZpZXdfY29tcGlsZXInO1xuaW1wb3J0IHtcbiAgUHJvdG9WaWV3Q29tcGlsZXIsXG4gIEFQUF9WSUVXX01PRFVMRV9SRUYsXG4gIENvbXBpbGVQcm90b1ZpZXcsXG4gIFBST1RPX1ZJRVdfSklUX0lNUE9SVFNcbn0gZnJvbSAnLi9wcm90b192aWV3X2NvbXBpbGVyJztcbmltcG9ydCB7VGVtcGxhdGVQYXJzZXIsIFBpcGVDb2xsZWN0b3J9IGZyb20gJy4vdGVtcGxhdGVfcGFyc2VyJztcbmltcG9ydCB7VGVtcGxhdGVOb3JtYWxpemVyfSBmcm9tICcuL3RlbXBsYXRlX25vcm1hbGl6ZXInO1xuaW1wb3J0IHtSdW50aW1lTWV0YWRhdGFSZXNvbHZlcn0gZnJvbSAnLi9ydW50aW1lX21ldGFkYXRhJztcbmltcG9ydCB7SG9zdFZpZXdGYWN0b3J5fSBmcm9tICdhbmd1bGFyMi9zcmMvY29yZS9saW5rZXIvdmlldyc7XG5pbXBvcnQge0NoYW5nZURldGVjdG9yR2VuQ29uZmlnfSBmcm9tICdhbmd1bGFyMi9zcmMvY29yZS9jaGFuZ2VfZGV0ZWN0aW9uL2NoYW5nZV9kZXRlY3Rpb24nO1xuaW1wb3J0IHtSZXNvbHZlZE1ldGFkYXRhQ2FjaGV9IGZyb20gJ2FuZ3VsYXIyL3NyYy9jb3JlL2xpbmtlci9yZXNvbHZlZF9tZXRhZGF0YV9jYWNoZSc7XG5cbmltcG9ydCB7XG4gIGNvZGVHZW5FeHBvcnRWYXJpYWJsZSxcbiAgZXNjYXBlU2luZ2xlUXVvdGVTdHJpbmcsXG4gIGNvZGVHZW5WYWx1ZUZuLFxuICBNT0RVTEVfU1VGRklYLFxuICBhZGRBbGwsXG4gIEV4cHJlc3Npb25cbn0gZnJvbSAnLi91dGlsJztcblxuZXhwb3J0IHZhciBNRVRBREFUQV9DQUNIRV9NT0RVTEVfUkVGID1cbiAgICBtb2R1bGVSZWYoJ3BhY2thZ2U6YW5ndWxhcjIvc3JjL2NvcmUvbGlua2VyL3Jlc29sdmVkX21ldGFkYXRhX2NhY2hlJyArIE1PRFVMRV9TVUZGSVgpO1xuXG4vKipcbiAqIEFuIGludGVybmFsIG1vZHVsZSBvZiB0aGUgQW5ndWxhciBjb21waWxlciB0aGF0IGJlZ2lucyB3aXRoIGNvbXBvbmVudCB0eXBlcyxcbiAqIGV4dHJhY3RzIHRlbXBsYXRlcywgYW5kIGV2ZW50dWFsbHkgcHJvZHVjZXMgYSBjb21waWxlZCB2ZXJzaW9uIG9mIHRoZSBjb21wb25lbnRcbiAqIHJlYWR5IGZvciBsaW5raW5nIGludG8gYW4gYXBwbGljYXRpb24uXG4gKi9cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBUZW1wbGF0ZUNvbXBpbGVyIHtcbiAgcHJpdmF0ZSBfaG9zdENhY2hlS2V5cyA9IG5ldyBNYXA8VHlwZSwgYW55PigpO1xuICBwcml2YXRlIF9jb21waWxlZFRlbXBsYXRlQ2FjaGUgPSBuZXcgTWFwPGFueSwgQ29tcGlsZWRUZW1wbGF0ZT4oKTtcbiAgcHJpdmF0ZSBfY29tcGlsZWRUZW1wbGF0ZURvbmUgPSBuZXcgTWFwPGFueSwgUHJvbWlzZTxDb21waWxlZFRlbXBsYXRlPj4oKTtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9ydW50aW1lTWV0YWRhdGFSZXNvbHZlcjogUnVudGltZU1ldGFkYXRhUmVzb2x2ZXIsXG4gICAgICAgICAgICAgIHByaXZhdGUgX3RlbXBsYXRlTm9ybWFsaXplcjogVGVtcGxhdGVOb3JtYWxpemVyLFxuICAgICAgICAgICAgICBwcml2YXRlIF90ZW1wbGF0ZVBhcnNlcjogVGVtcGxhdGVQYXJzZXIsIHByaXZhdGUgX3N0eWxlQ29tcGlsZXI6IFN0eWxlQ29tcGlsZXIsXG4gICAgICAgICAgICAgIHByaXZhdGUgX2NkQ29tcGlsZXI6IENoYW5nZURldGVjdGlvbkNvbXBpbGVyLFxuICAgICAgICAgICAgICBwcml2YXRlIF9wcm90b1ZpZXdDb21waWxlcjogUHJvdG9WaWV3Q29tcGlsZXIsIHByaXZhdGUgX3ZpZXdDb21waWxlcjogVmlld0NvbXBpbGVyLFxuICAgICAgICAgICAgICBwcml2YXRlIF9yZXNvbHZlZE1ldGFkYXRhQ2FjaGU6IFJlc29sdmVkTWV0YWRhdGFDYWNoZSxcbiAgICAgICAgICAgICAgcHJpdmF0ZSBfZ2VuQ29uZmlnOiBDaGFuZ2VEZXRlY3RvckdlbkNvbmZpZykge31cblxuICBub3JtYWxpemVEaXJlY3RpdmVNZXRhZGF0YShkaXJlY3RpdmU6IENvbXBpbGVEaXJlY3RpdmVNZXRhZGF0YSk6XG4gICAgICBQcm9taXNlPENvbXBpbGVEaXJlY3RpdmVNZXRhZGF0YT4ge1xuICAgIGlmICghZGlyZWN0aXZlLmlzQ29tcG9uZW50KSB7XG4gICAgICAvLyBGb3Igbm9uIGNvbXBvbmVudHMgdGhlcmUgaXMgbm90aGluZyB0byBiZSBub3JtYWxpemVkIHlldC5cbiAgICAgIHJldHVybiBQcm9taXNlV3JhcHBlci5yZXNvbHZlKGRpcmVjdGl2ZSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuX3RlbXBsYXRlTm9ybWFsaXplci5ub3JtYWxpemVUZW1wbGF0ZShkaXJlY3RpdmUudHlwZSwgZGlyZWN0aXZlLnRlbXBsYXRlKVxuICAgICAgICAudGhlbigobm9ybWFsaXplZFRlbXBsYXRlOiBDb21waWxlVGVtcGxhdGVNZXRhZGF0YSkgPT4gbmV3IENvbXBpbGVEaXJlY3RpdmVNZXRhZGF0YSh7XG4gICAgICAgICAgICAgICAgdHlwZTogZGlyZWN0aXZlLnR5cGUsXG4gICAgICAgICAgICAgICAgaXNDb21wb25lbnQ6IGRpcmVjdGl2ZS5pc0NvbXBvbmVudCxcbiAgICAgICAgICAgICAgICBkeW5hbWljTG9hZGFibGU6IGRpcmVjdGl2ZS5keW5hbWljTG9hZGFibGUsXG4gICAgICAgICAgICAgICAgc2VsZWN0b3I6IGRpcmVjdGl2ZS5zZWxlY3RvcixcbiAgICAgICAgICAgICAgICBleHBvcnRBczogZGlyZWN0aXZlLmV4cG9ydEFzLFxuICAgICAgICAgICAgICAgIGNoYW5nZURldGVjdGlvbjogZGlyZWN0aXZlLmNoYW5nZURldGVjdGlvbixcbiAgICAgICAgICAgICAgICBpbnB1dHM6IGRpcmVjdGl2ZS5pbnB1dHMsXG4gICAgICAgICAgICAgICAgb3V0cHV0czogZGlyZWN0aXZlLm91dHB1dHMsXG4gICAgICAgICAgICAgICAgaG9zdExpc3RlbmVyczogZGlyZWN0aXZlLmhvc3RMaXN0ZW5lcnMsXG4gICAgICAgICAgICAgICAgaG9zdFByb3BlcnRpZXM6IGRpcmVjdGl2ZS5ob3N0UHJvcGVydGllcyxcbiAgICAgICAgICAgICAgICBob3N0QXR0cmlidXRlczogZGlyZWN0aXZlLmhvc3RBdHRyaWJ1dGVzLFxuICAgICAgICAgICAgICAgIGxpZmVjeWNsZUhvb2tzOiBkaXJlY3RpdmUubGlmZWN5Y2xlSG9va3MsXG4gICAgICAgICAgICAgICAgcHJvdmlkZXJzOiBkaXJlY3RpdmUucHJvdmlkZXJzLFxuICAgICAgICAgICAgICAgIHZpZXdQcm92aWRlcnM6IGRpcmVjdGl2ZS52aWV3UHJvdmlkZXJzLFxuICAgICAgICAgICAgICAgIHF1ZXJpZXM6IGRpcmVjdGl2ZS5xdWVyaWVzLFxuICAgICAgICAgICAgICAgIHZpZXdRdWVyaWVzOiBkaXJlY3RpdmUudmlld1F1ZXJpZXMsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGU6IG5vcm1hbGl6ZWRUZW1wbGF0ZVxuICAgICAgICAgICAgICB9KSk7XG4gIH1cblxuICBjb21waWxlSG9zdENvbXBvbmVudFJ1bnRpbWUodHlwZTogVHlwZSk6IFByb21pc2U8SG9zdFZpZXdGYWN0b3J5PiB7XG4gICAgdmFyIGNvbXBNZXRhOiBDb21waWxlRGlyZWN0aXZlTWV0YWRhdGEgPVxuICAgICAgICB0aGlzLl9ydW50aW1lTWV0YWRhdGFSZXNvbHZlci5nZXREaXJlY3RpdmVNZXRhZGF0YSh0eXBlKTtcbiAgICB2YXIgaG9zdENhY2hlS2V5ID0gdGhpcy5faG9zdENhY2hlS2V5cy5nZXQodHlwZSk7XG4gICAgaWYgKGlzQmxhbmsoaG9zdENhY2hlS2V5KSkge1xuICAgICAgaG9zdENhY2hlS2V5ID0gbmV3IE9iamVjdCgpO1xuICAgICAgdGhpcy5faG9zdENhY2hlS2V5cy5zZXQodHlwZSwgaG9zdENhY2hlS2V5KTtcbiAgICAgIGFzc2VydENvbXBvbmVudChjb21wTWV0YSk7XG4gICAgICB2YXIgaG9zdE1ldGE6IENvbXBpbGVEaXJlY3RpdmVNZXRhZGF0YSA9XG4gICAgICAgICAgY3JlYXRlSG9zdENvbXBvbmVudE1ldGEoY29tcE1ldGEudHlwZSwgY29tcE1ldGEuc2VsZWN0b3IpO1xuXG4gICAgICB0aGlzLl9jb21waWxlQ29tcG9uZW50UnVudGltZShob3N0Q2FjaGVLZXksIGhvc3RNZXRhLCBbY29tcE1ldGFdLCBbXSwgW10pO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fY29tcGlsZWRUZW1wbGF0ZURvbmUuZ2V0KGhvc3RDYWNoZUtleSlcbiAgICAgICAgLnRoZW4oKGNvbXBpbGVkVGVtcGxhdGU6IENvbXBpbGVkVGVtcGxhdGUpID0+XG4gICAgICAgICAgICAgICAgICBuZXcgSG9zdFZpZXdGYWN0b3J5KGNvbXBNZXRhLnNlbGVjdG9yLCBjb21waWxlZFRlbXBsYXRlLnZpZXdGYWN0b3J5KSk7XG4gIH1cblxuICBjbGVhckNhY2hlKCkge1xuICAgIHRoaXMuX3N0eWxlQ29tcGlsZXIuY2xlYXJDYWNoZSgpO1xuICAgIHRoaXMuX2NvbXBpbGVkVGVtcGxhdGVDYWNoZS5jbGVhcigpO1xuICAgIHRoaXMuX2NvbXBpbGVkVGVtcGxhdGVEb25lLmNsZWFyKCk7XG4gICAgdGhpcy5faG9zdENhY2hlS2V5cy5jbGVhcigpO1xuICB9XG5cbiAgY29tcGlsZVRlbXBsYXRlc0NvZGVHZW4oY29tcG9uZW50czogTm9ybWFsaXplZENvbXBvbmVudFdpdGhWaWV3RGlyZWN0aXZlc1tdKTogU291cmNlTW9kdWxlIHtcbiAgICBpZiAoY29tcG9uZW50cy5sZW5ndGggPT09IDApIHtcbiAgICAgIHRocm93IG5ldyBCYXNlRXhjZXB0aW9uKCdObyBjb21wb25lbnRzIGdpdmVuJyk7XG4gICAgfVxuICAgIHZhciBkZWNsYXJhdGlvbnMgPSBbXTtcbiAgICBjb21wb25lbnRzLmZvckVhY2goY29tcG9uZW50V2l0aERpcnMgPT4ge1xuICAgICAgdmFyIGNvbXBNZXRhID0gPENvbXBpbGVEaXJlY3RpdmVNZXRhZGF0YT5jb21wb25lbnRXaXRoRGlycy5jb21wb25lbnQ7XG4gICAgICBhc3NlcnRDb21wb25lbnQoY29tcE1ldGEpO1xuICAgICAgdGhpcy5fY29tcGlsZUNvbXBvbmVudENvZGVHZW4oY29tcE1ldGEsIGNvbXBvbmVudFdpdGhEaXJzLmRpcmVjdGl2ZXMsIGNvbXBvbmVudFdpdGhEaXJzLnBpcGVzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVjbGFyYXRpb25zKTtcbiAgICAgIGlmIChjb21wTWV0YS5keW5hbWljTG9hZGFibGUpIHtcbiAgICAgICAgdmFyIGhvc3RNZXRhID0gY3JlYXRlSG9zdENvbXBvbmVudE1ldGEoY29tcE1ldGEudHlwZSwgY29tcE1ldGEuc2VsZWN0b3IpO1xuICAgICAgICB2YXIgdmlld0ZhY3RvcnlFeHByZXNzaW9uID1cbiAgICAgICAgICAgIHRoaXMuX2NvbXBpbGVDb21wb25lbnRDb2RlR2VuKGhvc3RNZXRhLCBbY29tcE1ldGFdLCBbXSwgZGVjbGFyYXRpb25zKTtcbiAgICAgICAgdmFyIGNvbnN0cnVjdGlvbktleXdvcmQgPSBJU19EQVJUID8gJ2NvbnN0JyA6ICduZXcnO1xuICAgICAgICB2YXIgY29tcGlsZWRUZW1wbGF0ZUV4cHIgPVxuICAgICAgICAgICAgYCR7Y29uc3RydWN0aW9uS2V5d29yZH0gJHtBUFBfVklFV19NT0RVTEVfUkVGfUhvc3RWaWV3RmFjdG9yeSgnJHtjb21wTWV0YS5zZWxlY3Rvcn0nLCR7dmlld0ZhY3RvcnlFeHByZXNzaW9ufSlgO1xuICAgICAgICB2YXIgdmFyTmFtZSA9IGNvZGVHZW5Ib3N0Vmlld0ZhY3RvcnlOYW1lKGNvbXBNZXRhLnR5cGUpO1xuICAgICAgICBkZWNsYXJhdGlvbnMucHVzaChgJHtjb2RlR2VuRXhwb3J0VmFyaWFibGUodmFyTmFtZSl9JHtjb21waWxlZFRlbXBsYXRlRXhwcn07YCk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgdmFyIG1vZHVsZVVybCA9IGNvbXBvbmVudHNbMF0uY29tcG9uZW50LnR5cGUubW9kdWxlVXJsO1xuICAgIHJldHVybiBuZXcgU291cmNlTW9kdWxlKGAke3RlbXBsYXRlTW9kdWxlVXJsKG1vZHVsZVVybCl9YCwgZGVjbGFyYXRpb25zLmpvaW4oJ1xcbicpKTtcbiAgfVxuXG4gIGNvbXBpbGVTdHlsZXNoZWV0Q29kZUdlbihzdHlsZXNoZWV0VXJsOiBzdHJpbmcsIGNzc1RleHQ6IHN0cmluZyk6IFNvdXJjZU1vZHVsZVtdIHtcbiAgICByZXR1cm4gdGhpcy5fc3R5bGVDb21waWxlci5jb21waWxlU3R5bGVzaGVldENvZGVHZW4oc3R5bGVzaGVldFVybCwgY3NzVGV4dCk7XG4gIH1cblxuXG5cbiAgcHJpdmF0ZSBfY29tcGlsZUNvbXBvbmVudFJ1bnRpbWUoY2FjaGVLZXk6IGFueSwgY29tcE1ldGE6IENvbXBpbGVEaXJlY3RpdmVNZXRhZGF0YSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmlld0RpcmVjdGl2ZXM6IENvbXBpbGVEaXJlY3RpdmVNZXRhZGF0YVtdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwaXBlczogQ29tcGlsZVBpcGVNZXRhZGF0YVtdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21waWxpbmdDb21wb25lbnRzUGF0aDogYW55W10pOiBDb21waWxlZFRlbXBsYXRlIHtcbiAgICBsZXQgdW5pcVZpZXdEaXJlY3RpdmVzID0gPENvbXBpbGVEaXJlY3RpdmVNZXRhZGF0YVtdPnJlbW92ZUR1cGxpY2F0ZXModmlld0RpcmVjdGl2ZXMpO1xuICAgIGxldCB1bmlxVmlld1BpcGVzID0gPENvbXBpbGVQaXBlTWV0YWRhdGFbXT5yZW1vdmVEdXBsaWNhdGVzKHBpcGVzKTtcbiAgICB2YXIgY29tcGlsZWRUZW1wbGF0ZSA9IHRoaXMuX2NvbXBpbGVkVGVtcGxhdGVDYWNoZS5nZXQoY2FjaGVLZXkpO1xuICAgIHZhciBkb25lID0gdGhpcy5fY29tcGlsZWRUZW1wbGF0ZURvbmUuZ2V0KGNhY2hlS2V5KTtcbiAgICBpZiAoaXNCbGFuayhjb21waWxlZFRlbXBsYXRlKSkge1xuICAgICAgY29tcGlsZWRUZW1wbGF0ZSA9IG5ldyBDb21waWxlZFRlbXBsYXRlKCk7XG4gICAgICB0aGlzLl9jb21waWxlZFRlbXBsYXRlQ2FjaGUuc2V0KGNhY2hlS2V5LCBjb21waWxlZFRlbXBsYXRlKTtcbiAgICAgIGRvbmUgPSBQcm9taXNlV3JhcHBlclxuICAgICAgICAgICAgICAgICAuYWxsKFs8YW55PnRoaXMuX3N0eWxlQ29tcGlsZXIuY29tcGlsZUNvbXBvbmVudFJ1bnRpbWUoY29tcE1ldGEudGVtcGxhdGUpXS5jb25jYXQoXG4gICAgICAgICAgICAgICAgICAgICB1bmlxVmlld0RpcmVjdGl2ZXMubWFwKGRpck1ldGEgPT4gdGhpcy5ub3JtYWxpemVEaXJlY3RpdmVNZXRhZGF0YShkaXJNZXRhKSkpKVxuICAgICAgICAgICAgICAgICAudGhlbigoc3R5bGVzQW5kTm9ybWFsaXplZFZpZXdEaXJNZXRhczogYW55W10pID0+IHtcbiAgICAgICAgICAgICAgICAgICB2YXIgbm9ybWFsaXplZFZpZXdEaXJNZXRhcyA9IHN0eWxlc0FuZE5vcm1hbGl6ZWRWaWV3RGlyTWV0YXMuc2xpY2UoMSk7XG4gICAgICAgICAgICAgICAgICAgdmFyIHN0eWxlcyA9IHN0eWxlc0FuZE5vcm1hbGl6ZWRWaWV3RGlyTWV0YXNbMF07XG4gICAgICAgICAgICAgICAgICAgdmFyIHBhcnNlZFRlbXBsYXRlID0gdGhpcy5fdGVtcGxhdGVQYXJzZXIucGFyc2UoXG4gICAgICAgICAgICAgICAgICAgICAgIGNvbXBNZXRhLnRlbXBsYXRlLnRlbXBsYXRlLCBub3JtYWxpemVkVmlld0Rpck1ldGFzLCB1bmlxVmlld1BpcGVzLFxuICAgICAgICAgICAgICAgICAgICAgICBjb21wTWV0YS50eXBlLm5hbWUpO1xuXG4gICAgICAgICAgICAgICAgICAgdmFyIGNoaWxkUHJvbWlzZXMgPSBbXTtcbiAgICAgICAgICAgICAgICAgICB2YXIgdXNlZERpcmVjdGl2ZXMgPSBEaXJlY3RpdmVDb2xsZWN0b3IuZmluZFVzZWREaXJlY3RpdmVzKHBhcnNlZFRlbXBsYXRlKTtcbiAgICAgICAgICAgICAgICAgICB1c2VkRGlyZWN0aXZlcy5jb21wb25lbnRzLmZvckVhY2goXG4gICAgICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudCA9PiB0aGlzLl9jb21waWxlTmVzdGVkQ29tcG9uZW50UnVudGltZShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudCwgY29tcGlsaW5nQ29tcG9uZW50c1BhdGgsIGNoaWxkUHJvbWlzZXMpKTtcbiAgICAgICAgICAgICAgICAgICByZXR1cm4gUHJvbWlzZVdyYXBwZXIuYWxsKGNoaWxkUHJvbWlzZXMpXG4gICAgICAgICAgICAgICAgICAgICAgIC50aGVuKChfKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGZpbHRlcmVkUGlwZXMgPSBmaWx0ZXJQaXBlcyhwYXJzZWRUZW1wbGF0ZSwgdW5pcVZpZXdQaXBlcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgY29tcGlsZWRUZW1wbGF0ZS5pbml0KHRoaXMuX2NyZWF0ZVZpZXdGYWN0b3J5UnVudGltZShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tcE1ldGEsIHBhcnNlZFRlbXBsYXRlLCB1c2VkRGlyZWN0aXZlcy5kaXJlY3RpdmVzLCBzdHlsZXMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbHRlcmVkUGlwZXMpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gY29tcGlsZWRUZW1wbGF0ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgIH0pO1xuICAgICAgdGhpcy5fY29tcGlsZWRUZW1wbGF0ZURvbmUuc2V0KGNhY2hlS2V5LCBkb25lKTtcbiAgICB9XG4gICAgcmV0dXJuIGNvbXBpbGVkVGVtcGxhdGU7XG4gIH1cblxuICBwcml2YXRlIF9jb21waWxlTmVzdGVkQ29tcG9uZW50UnVudGltZShjaGlsZENvbXBvbmVudERpcjogQ29tcGlsZURpcmVjdGl2ZU1ldGFkYXRhLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJlbnRDb21waWxpbmdDb21wb25lbnRzUGF0aDogYW55W10sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkUHJvbWlzZXM6IFByb21pc2U8YW55PltdKSB7XG4gICAgdmFyIGNvbXBpbGluZ0NvbXBvbmVudHNQYXRoID0gTGlzdFdyYXBwZXIuY2xvbmUocGFyZW50Q29tcGlsaW5nQ29tcG9uZW50c1BhdGgpO1xuXG4gICAgdmFyIGNoaWxkQ2FjaGVLZXkgPSBjaGlsZENvbXBvbmVudERpci50eXBlLnJ1bnRpbWU7XG4gICAgdmFyIGNoaWxkVmlld0RpcmVjdGl2ZXM6IENvbXBpbGVEaXJlY3RpdmVNZXRhZGF0YVtdID1cbiAgICAgICAgdGhpcy5fcnVudGltZU1ldGFkYXRhUmVzb2x2ZXIuZ2V0Vmlld0RpcmVjdGl2ZXNNZXRhZGF0YShjaGlsZENvbXBvbmVudERpci50eXBlLnJ1bnRpbWUpO1xuICAgIHZhciBjaGlsZFZpZXdQaXBlczogQ29tcGlsZVBpcGVNZXRhZGF0YVtdID1cbiAgICAgICAgdGhpcy5fcnVudGltZU1ldGFkYXRhUmVzb2x2ZXIuZ2V0Vmlld1BpcGVzTWV0YWRhdGEoY2hpbGRDb21wb25lbnREaXIudHlwZS5ydW50aW1lKTtcbiAgICB2YXIgY2hpbGRJc1JlY3Vyc2l2ZSA9IExpc3RXcmFwcGVyLmNvbnRhaW5zKGNvbXBpbGluZ0NvbXBvbmVudHNQYXRoLCBjaGlsZENhY2hlS2V5KTtcbiAgICBjb21waWxpbmdDb21wb25lbnRzUGF0aC5wdXNoKGNoaWxkQ2FjaGVLZXkpO1xuICAgIHRoaXMuX2NvbXBpbGVDb21wb25lbnRSdW50aW1lKGNoaWxkQ2FjaGVLZXksIGNoaWxkQ29tcG9uZW50RGlyLCBjaGlsZFZpZXdEaXJlY3RpdmVzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkVmlld1BpcGVzLCBjb21waWxpbmdDb21wb25lbnRzUGF0aCk7XG4gICAgaWYgKCFjaGlsZElzUmVjdXJzaXZlKSB7XG4gICAgICAvLyBPbmx5IHdhaXQgZm9yIGEgY2hpbGQgaWYgaXQgaXMgbm90IGEgY3ljbGVcbiAgICAgIGNoaWxkUHJvbWlzZXMucHVzaCh0aGlzLl9jb21waWxlZFRlbXBsYXRlRG9uZS5nZXQoY2hpbGRDYWNoZUtleSkpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX2NyZWF0ZVZpZXdGYWN0b3J5UnVudGltZShjb21wTWV0YTogQ29tcGlsZURpcmVjdGl2ZU1ldGFkYXRhLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFyc2VkVGVtcGxhdGU6IFRlbXBsYXRlQXN0W10sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkaXJlY3RpdmVzOiBDb21waWxlRGlyZWN0aXZlTWV0YWRhdGFbXSwgc3R5bGVzOiBzdHJpbmdbXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBpcGVzOiBDb21waWxlUGlwZU1ldGFkYXRhW10pOiBGdW5jdGlvbiB7XG4gICAgaWYgKElTX0RBUlQgfHwgIXRoaXMuX2dlbkNvbmZpZy51c2VKaXQpIHtcbiAgICAgIHZhciBjaGFuZ2VEZXRlY3RvckZhY3RvcmllcyA9IHRoaXMuX2NkQ29tcGlsZXIuY29tcGlsZUNvbXBvbmVudFJ1bnRpbWUoXG4gICAgICAgICAgY29tcE1ldGEudHlwZSwgY29tcE1ldGEuY2hhbmdlRGV0ZWN0aW9uLCBwYXJzZWRUZW1wbGF0ZSk7XG4gICAgICB2YXIgcHJvdG9WaWV3cyA9IHRoaXMuX3Byb3RvVmlld0NvbXBpbGVyLmNvbXBpbGVQcm90b1ZpZXdSdW50aW1lKFxuICAgICAgICAgIHRoaXMuX3Jlc29sdmVkTWV0YWRhdGFDYWNoZSwgY29tcE1ldGEsIHBhcnNlZFRlbXBsYXRlLCBwaXBlcyk7XG4gICAgICByZXR1cm4gdGhpcy5fdmlld0NvbXBpbGVyLmNvbXBpbGVDb21wb25lbnRSdW50aW1lKFxuICAgICAgICAgIGNvbXBNZXRhLCBwYXJzZWRUZW1wbGF0ZSwgc3R5bGVzLCBwcm90b1ZpZXdzLnByb3RvVmlld3MsIGNoYW5nZURldGVjdG9yRmFjdG9yaWVzLFxuICAgICAgICAgIChjb21wTWV0YSkgPT4gdGhpcy5fZ2V0TmVzdGVkQ29tcG9uZW50Vmlld0ZhY3RvcnkoY29tcE1ldGEpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIGRlY2xhcmF0aW9ucyA9IFtdO1xuICAgICAgdmFyIHZpZXdGYWN0b3J5RXhwciA9IHRoaXMuX2NyZWF0ZVZpZXdGYWN0b3J5Q29kZUdlbigncmVzb2x2ZWRNZXRhZGF0YUNhY2hlJywgY29tcE1ldGEsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBTb3VyY2VFeHByZXNzaW9uKFtdLCAnc3R5bGVzJyksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcnNlZFRlbXBsYXRlLCBwaXBlcywgZGVjbGFyYXRpb25zKTtcbiAgICAgIHZhciB2YXJzOiB7W2tleTogc3RyaW5nXTogYW55fSA9XG4gICAgICAgICAgeydleHBvcnRzJzoge30sICdzdHlsZXMnOiBzdHlsZXMsICdyZXNvbHZlZE1ldGFkYXRhQ2FjaGUnOiB0aGlzLl9yZXNvbHZlZE1ldGFkYXRhQ2FjaGV9O1xuICAgICAgZGlyZWN0aXZlcy5mb3JFYWNoKGRpck1ldGEgPT4ge1xuICAgICAgICB2YXJzW2Rpck1ldGEudHlwZS5uYW1lXSA9IGRpck1ldGEudHlwZS5ydW50aW1lO1xuICAgICAgICBpZiAoZGlyTWV0YS5pc0NvbXBvbmVudCAmJiBkaXJNZXRhLnR5cGUucnVudGltZSAhPT0gY29tcE1ldGEudHlwZS5ydW50aW1lKSB7XG4gICAgICAgICAgdmFyc1tgdmlld0ZhY3RvcnlfJHtkaXJNZXRhLnR5cGUubmFtZX0wYF0gPSB0aGlzLl9nZXROZXN0ZWRDb21wb25lbnRWaWV3RmFjdG9yeShkaXJNZXRhKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBwaXBlcy5mb3JFYWNoKHBpcGVNZXRhID0+IHZhcnNbcGlwZU1ldGEudHlwZS5uYW1lXSA9IHBpcGVNZXRhLnR5cGUucnVudGltZSk7XG4gICAgICB2YXIgZGVjbGFyYXRpb25zV2l0aG91dEltcG9ydHMgPVxuICAgICAgICAgIFNvdXJjZU1vZHVsZS5nZXRTb3VyY2VXaXRob3V0SW1wb3J0cyhkZWNsYXJhdGlvbnMuam9pbignXFxuJykpO1xuICAgICAgcmV0dXJuIGV2YWxFeHByZXNzaW9uKFxuICAgICAgICAgIGB2aWV3RmFjdG9yeV8ke2NvbXBNZXRhLnR5cGUubmFtZX1gLCB2aWV3RmFjdG9yeUV4cHIsIGRlY2xhcmF0aW9uc1dpdGhvdXRJbXBvcnRzLFxuICAgICAgICAgIG1lcmdlU3RyaW5nTWFwcyhcbiAgICAgICAgICAgICAgW3ZhcnMsIENIQU5HRV9ERVRFQ1RJT05fSklUX0lNUE9SVFMsIFBST1RPX1ZJRVdfSklUX0lNUE9SVFMsIFZJRVdfSklUX0lNUE9SVFNdKSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfZ2V0TmVzdGVkQ29tcG9uZW50Vmlld0ZhY3RvcnkoY29tcE1ldGE6IENvbXBpbGVEaXJlY3RpdmVNZXRhZGF0YSk6IEZ1bmN0aW9uIHtcbiAgICByZXR1cm4gdGhpcy5fY29tcGlsZWRUZW1wbGF0ZUNhY2hlLmdldChjb21wTWV0YS50eXBlLnJ1bnRpbWUpLnZpZXdGYWN0b3J5O1xuICB9XG5cbiAgcHJpdmF0ZSBfY29tcGlsZUNvbXBvbmVudENvZGVHZW4oY29tcE1ldGE6IENvbXBpbGVEaXJlY3RpdmVNZXRhZGF0YSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGlyZWN0aXZlczogQ29tcGlsZURpcmVjdGl2ZU1ldGFkYXRhW10sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBpcGVzOiBDb21waWxlUGlwZU1ldGFkYXRhW10sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldERlY2xhcmF0aW9uczogc3RyaW5nW10pOiBzdHJpbmcge1xuICAgIGxldCB1bmlxdWVEaXJlY3RpdmVzID0gPENvbXBpbGVEaXJlY3RpdmVNZXRhZGF0YVtdPnJlbW92ZUR1cGxpY2F0ZXMoZGlyZWN0aXZlcyk7XG4gICAgbGV0IHVuaXFQaXBlcyA9IDxDb21waWxlUGlwZU1ldGFkYXRhW10+cmVtb3ZlRHVwbGljYXRlcyhwaXBlcyk7XG4gICAgdmFyIHN0eWxlRXhwciA9IHRoaXMuX3N0eWxlQ29tcGlsZXIuY29tcGlsZUNvbXBvbmVudENvZGVHZW4oY29tcE1ldGEudGVtcGxhdGUpO1xuICAgIHZhciBwYXJzZWRUZW1wbGF0ZSA9IHRoaXMuX3RlbXBsYXRlUGFyc2VyLnBhcnNlKGNvbXBNZXRhLnRlbXBsYXRlLnRlbXBsYXRlLCB1bmlxdWVEaXJlY3RpdmVzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVuaXFQaXBlcywgY29tcE1ldGEudHlwZS5uYW1lKTtcbiAgICB2YXIgZmlsdGVyZWRQaXBlcyA9IGZpbHRlclBpcGVzKHBhcnNlZFRlbXBsYXRlLCB1bmlxUGlwZXMpO1xuICAgIHJldHVybiB0aGlzLl9jcmVhdGVWaWV3RmFjdG9yeUNvZGVHZW4oXG4gICAgICAgIGAke01FVEFEQVRBX0NBQ0hFX01PRFVMRV9SRUZ9Q09ERUdFTl9SRVNPTFZFRF9NRVRBREFUQV9DQUNIRWAsIGNvbXBNZXRhLCBzdHlsZUV4cHIsXG4gICAgICAgIHBhcnNlZFRlbXBsYXRlLCBmaWx0ZXJlZFBpcGVzLCB0YXJnZXREZWNsYXJhdGlvbnMpO1xuICB9XG5cbiAgcHJpdmF0ZSBfY3JlYXRlVmlld0ZhY3RvcnlDb2RlR2VuKHJlc29sdmVkTWV0YWRhdGFDYWNoZUV4cHI6IHN0cmluZyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBNZXRhOiBDb21waWxlRGlyZWN0aXZlTWV0YWRhdGEsIHN0eWxlRXhwcjogU291cmNlRXhwcmVzc2lvbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcnNlZFRlbXBsYXRlOiBUZW1wbGF0ZUFzdFtdLCBwaXBlczogQ29tcGlsZVBpcGVNZXRhZGF0YVtdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0RGVjbGFyYXRpb25zOiBzdHJpbmdbXSk6IHN0cmluZyB7XG4gICAgdmFyIGNoYW5nZURldGVjdG9yc0V4cHJzID0gdGhpcy5fY2RDb21waWxlci5jb21waWxlQ29tcG9uZW50Q29kZUdlbihcbiAgICAgICAgY29tcE1ldGEudHlwZSwgY29tcE1ldGEuY2hhbmdlRGV0ZWN0aW9uLCBwYXJzZWRUZW1wbGF0ZSk7XG4gICAgdmFyIHByb3RvVmlld0V4cHJzID0gdGhpcy5fcHJvdG9WaWV3Q29tcGlsZXIuY29tcGlsZVByb3RvVmlld0NvZGVHZW4oXG4gICAgICAgIG5ldyBFeHByZXNzaW9uKHJlc29sdmVkTWV0YWRhdGFDYWNoZUV4cHIpLCBjb21wTWV0YSwgcGFyc2VkVGVtcGxhdGUsIHBpcGVzKTtcbiAgICB2YXIgdmlld0ZhY3RvcnlFeHByID0gdGhpcy5fdmlld0NvbXBpbGVyLmNvbXBpbGVDb21wb25lbnRDb2RlR2VuKFxuICAgICAgICBjb21wTWV0YSwgcGFyc2VkVGVtcGxhdGUsIHN0eWxlRXhwciwgcHJvdG9WaWV3RXhwcnMucHJvdG9WaWV3cywgY2hhbmdlRGV0ZWN0b3JzRXhwcnMsXG4gICAgICAgIGNvZGVHZW5Db21wb25lbnRWaWV3RmFjdG9yeU5hbWUpO1xuXG4gICAgYWRkQWxsKGNoYW5nZURldGVjdG9yc0V4cHJzLmRlY2xhcmF0aW9ucywgdGFyZ2V0RGVjbGFyYXRpb25zKTtcbiAgICBhZGRBbGwocHJvdG9WaWV3RXhwcnMuZGVjbGFyYXRpb25zLCB0YXJnZXREZWNsYXJhdGlvbnMpO1xuICAgIGFkZEFsbCh2aWV3RmFjdG9yeUV4cHIuZGVjbGFyYXRpb25zLCB0YXJnZXREZWNsYXJhdGlvbnMpO1xuXG4gICAgcmV0dXJuIHZpZXdGYWN0b3J5RXhwci5leHByZXNzaW9uO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBOb3JtYWxpemVkQ29tcG9uZW50V2l0aFZpZXdEaXJlY3RpdmVzIHtcbiAgY29uc3RydWN0b3IocHVibGljIGNvbXBvbmVudDogQ29tcGlsZURpcmVjdGl2ZU1ldGFkYXRhLFxuICAgICAgICAgICAgICBwdWJsaWMgZGlyZWN0aXZlczogQ29tcGlsZURpcmVjdGl2ZU1ldGFkYXRhW10sIHB1YmxpYyBwaXBlczogQ29tcGlsZVBpcGVNZXRhZGF0YVtdKSB7fVxufVxuXG5jbGFzcyBDb21waWxlZFRlbXBsYXRlIHtcbiAgdmlld0ZhY3Rvcnk6IEZ1bmN0aW9uID0gbnVsbDtcbiAgaW5pdCh2aWV3RmFjdG9yeTogRnVuY3Rpb24pIHsgdGhpcy52aWV3RmFjdG9yeSA9IHZpZXdGYWN0b3J5OyB9XG59XG5cbmZ1bmN0aW9uIGFzc2VydENvbXBvbmVudChtZXRhOiBDb21waWxlRGlyZWN0aXZlTWV0YWRhdGEpIHtcbiAgaWYgKCFtZXRhLmlzQ29tcG9uZW50KSB7XG4gICAgdGhyb3cgbmV3IEJhc2VFeGNlcHRpb24oYENvdWxkIG5vdCBjb21waWxlICcke21ldGEudHlwZS5uYW1lfScgYmVjYXVzZSBpdCBpcyBub3QgYSBjb21wb25lbnQuYCk7XG4gIH1cbn1cblxuZnVuY3Rpb24gdGVtcGxhdGVNb2R1bGVVcmwobW9kdWxlVXJsOiBzdHJpbmcpOiBzdHJpbmcge1xuICB2YXIgdXJsV2l0aG91dFN1ZmZpeCA9IG1vZHVsZVVybC5zdWJzdHJpbmcoMCwgbW9kdWxlVXJsLmxlbmd0aCAtIE1PRFVMRV9TVUZGSVgubGVuZ3RoKTtcbiAgcmV0dXJuIGAke3VybFdpdGhvdXRTdWZmaXh9LnRlbXBsYXRlJHtNT0RVTEVfU1VGRklYfWA7XG59XG5cblxuZnVuY3Rpb24gY29kZUdlbkhvc3RWaWV3RmFjdG9yeU5hbWUodHlwZTogQ29tcGlsZVR5cGVNZXRhZGF0YSk6IHN0cmluZyB7XG4gIHJldHVybiBgaG9zdFZpZXdGYWN0b3J5XyR7dHlwZS5uYW1lfWA7XG59XG5cbmZ1bmN0aW9uIGNvZGVHZW5Db21wb25lbnRWaWV3RmFjdG9yeU5hbWUobmVzdGVkQ29tcFR5cGU6IENvbXBpbGVEaXJlY3RpdmVNZXRhZGF0YSk6IHN0cmluZyB7XG4gIHJldHVybiBgJHttb2R1bGVSZWYodGVtcGxhdGVNb2R1bGVVcmwobmVzdGVkQ29tcFR5cGUudHlwZS5tb2R1bGVVcmwpKX12aWV3RmFjdG9yeV8ke25lc3RlZENvbXBUeXBlLnR5cGUubmFtZX0wYDtcbn1cblxuZnVuY3Rpb24gbWVyZ2VTdHJpbmdNYXBzKG1hcHM6IEFycmF5PHtba2V5OiBzdHJpbmddOiBhbnl9Pik6IHtba2V5OiBzdHJpbmddOiBhbnl9IHtcbiAgdmFyIHJlc3VsdCA9IHt9O1xuICBtYXBzLmZvckVhY2goXG4gICAgICAobWFwKSA9PiB7IFN0cmluZ01hcFdyYXBwZXIuZm9yRWFjaChtYXAsICh2YWx1ZSwga2V5KSA9PiB7IHJlc3VsdFtrZXldID0gdmFsdWU7IH0pOyB9KTtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuZnVuY3Rpb24gcmVtb3ZlRHVwbGljYXRlcyhpdGVtczogQ29tcGlsZU1ldGFkYXRhV2l0aFR5cGVbXSk6IENvbXBpbGVNZXRhZGF0YVdpdGhUeXBlW10ge1xuICBsZXQgcmVzID0gW107XG4gIGl0ZW1zLmZvckVhY2goaXRlbSA9PiB7XG4gICAgbGV0IGhhc01hdGNoID1cbiAgICAgICAgcmVzLmZpbHRlcihyID0+IHIudHlwZS5uYW1lID09IGl0ZW0udHlwZS5uYW1lICYmIHIudHlwZS5tb2R1bGVVcmwgPT0gaXRlbS50eXBlLm1vZHVsZVVybCAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgci50eXBlLnJ1bnRpbWUgPT0gaXRlbS50eXBlLnJ1bnRpbWUpXG4gICAgICAgICAgICAubGVuZ3RoID4gMDtcbiAgICBpZiAoIWhhc01hdGNoKSB7XG4gICAgICByZXMucHVzaChpdGVtKTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gcmVzO1xufVxuXG5jbGFzcyBEaXJlY3RpdmVDb2xsZWN0b3IgaW1wbGVtZW50cyBUZW1wbGF0ZUFzdFZpc2l0b3Ige1xuICBzdGF0aWMgZmluZFVzZWREaXJlY3RpdmVzKHBhcnNlZFRlbXBsYXRlOiBUZW1wbGF0ZUFzdFtdKTogRGlyZWN0aXZlQ29sbGVjdG9yIHtcbiAgICB2YXIgY29sbGVjdG9yID0gbmV3IERpcmVjdGl2ZUNvbGxlY3RvcigpO1xuICAgIHRlbXBsYXRlVmlzaXRBbGwoY29sbGVjdG9yLCBwYXJzZWRUZW1wbGF0ZSk7XG4gICAgcmV0dXJuIGNvbGxlY3RvcjtcbiAgfVxuXG4gIGRpcmVjdGl2ZXM6IENvbXBpbGVEaXJlY3RpdmVNZXRhZGF0YVtdID0gW107XG4gIGNvbXBvbmVudHM6IENvbXBpbGVEaXJlY3RpdmVNZXRhZGF0YVtdID0gW107XG5cbiAgdmlzaXRCb3VuZFRleHQoYXN0OiBCb3VuZFRleHRBc3QsIGNvbnRleHQ6IGFueSk6IGFueSB7IHJldHVybiBudWxsOyB9XG4gIHZpc2l0VGV4dChhc3Q6IFRleHRBc3QsIGNvbnRleHQ6IGFueSk6IGFueSB7IHJldHVybiBudWxsOyB9XG5cbiAgdmlzaXROZ0NvbnRlbnQoYXN0OiBOZ0NvbnRlbnRBc3QsIGNvbnRleHQ6IGFueSk6IGFueSB7IHJldHVybiBudWxsOyB9XG5cbiAgdmlzaXRFbGVtZW50KGFzdDogRWxlbWVudEFzdCwgY29udGV4dDogYW55KTogYW55IHtcbiAgICB0ZW1wbGF0ZVZpc2l0QWxsKHRoaXMsIGFzdC5kaXJlY3RpdmVzKTtcbiAgICB0ZW1wbGF0ZVZpc2l0QWxsKHRoaXMsIGFzdC5jaGlsZHJlbik7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICB2aXNpdEVtYmVkZGVkVGVtcGxhdGUoYXN0OiBFbWJlZGRlZFRlbXBsYXRlQXN0LCBjb250ZXh0OiBhbnkpOiBhbnkge1xuICAgIHRlbXBsYXRlVmlzaXRBbGwodGhpcywgYXN0LmRpcmVjdGl2ZXMpO1xuICAgIHRlbXBsYXRlVmlzaXRBbGwodGhpcywgYXN0LmNoaWxkcmVuKTtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICB2aXNpdFZhcmlhYmxlKGFzdDogVmFyaWFibGVBc3QsIGN0eDogYW55KTogYW55IHsgcmV0dXJuIG51bGw7IH1cbiAgdmlzaXRBdHRyKGFzdDogQXR0ckFzdCwgYXR0ck5hbWVBbmRWYWx1ZXM6IHtba2V5OiBzdHJpbmddOiBzdHJpbmd9KTogYW55IHsgcmV0dXJuIG51bGw7IH1cbiAgdmlzaXREaXJlY3RpdmUoYXN0OiBEaXJlY3RpdmVBc3QsIGN0eDogYW55KTogYW55IHtcbiAgICBpZiAoYXN0LmRpcmVjdGl2ZS5pc0NvbXBvbmVudCkge1xuICAgICAgdGhpcy5jb21wb25lbnRzLnB1c2goYXN0LmRpcmVjdGl2ZSk7XG4gICAgfVxuICAgIHRoaXMuZGlyZWN0aXZlcy5wdXNoKGFzdC5kaXJlY3RpdmUpO1xuICAgIHJldHVybiBudWxsO1xuICB9XG4gIHZpc2l0RXZlbnQoYXN0OiBCb3VuZEV2ZW50QXN0LCBldmVudFRhcmdldEFuZE5hbWVzOiBNYXA8c3RyaW5nLCBCb3VuZEV2ZW50QXN0Pik6IGFueSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgdmlzaXREaXJlY3RpdmVQcm9wZXJ0eShhc3Q6IEJvdW5kRGlyZWN0aXZlUHJvcGVydHlBc3QsIGNvbnRleHQ6IGFueSk6IGFueSB7IHJldHVybiBudWxsOyB9XG4gIHZpc2l0RWxlbWVudFByb3BlcnR5KGFzdDogQm91bmRFbGVtZW50UHJvcGVydHlBc3QsIGNvbnRleHQ6IGFueSk6IGFueSB7IHJldHVybiBudWxsOyB9XG59XG5cblxuZnVuY3Rpb24gZmlsdGVyUGlwZXModGVtcGxhdGU6IFRlbXBsYXRlQXN0W10sXG4gICAgICAgICAgICAgICAgICAgICBhbGxQaXBlczogQ29tcGlsZVBpcGVNZXRhZGF0YVtdKTogQ29tcGlsZVBpcGVNZXRhZGF0YVtdIHtcbiAgdmFyIHZpc2l0b3IgPSBuZXcgUGlwZVZpc2l0b3IoKTtcbiAgdGVtcGxhdGVWaXNpdEFsbCh2aXNpdG9yLCB0ZW1wbGF0ZSk7XG4gIHJldHVybiBhbGxQaXBlcy5maWx0ZXIoKHBpcGVNZXRhKSA9PiBTZXRXcmFwcGVyLmhhcyh2aXNpdG9yLmNvbGxlY3Rvci5waXBlcywgcGlwZU1ldGEubmFtZSkpO1xufVxuXG5jbGFzcyBQaXBlVmlzaXRvciBpbXBsZW1lbnRzIFRlbXBsYXRlQXN0VmlzaXRvciB7XG4gIGNvbGxlY3RvcjogUGlwZUNvbGxlY3RvciA9IG5ldyBQaXBlQ29sbGVjdG9yKCk7XG5cbiAgdmlzaXRCb3VuZFRleHQoYXN0OiBCb3VuZFRleHRBc3QsIGNvbnRleHQ6IGFueSk6IGFueSB7XG4gICAgYXN0LnZhbHVlLnZpc2l0KHRoaXMuY29sbGVjdG9yKTtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICB2aXNpdFRleHQoYXN0OiBUZXh0QXN0LCBjb250ZXh0OiBhbnkpOiBhbnkgeyByZXR1cm4gbnVsbDsgfVxuXG4gIHZpc2l0TmdDb250ZW50KGFzdDogTmdDb250ZW50QXN0LCBjb250ZXh0OiBhbnkpOiBhbnkgeyByZXR1cm4gbnVsbDsgfVxuXG4gIHZpc2l0RWxlbWVudChhc3Q6IEVsZW1lbnRBc3QsIGNvbnRleHQ6IGFueSk6IGFueSB7XG4gICAgdGVtcGxhdGVWaXNpdEFsbCh0aGlzLCBhc3QuaW5wdXRzKTtcbiAgICB0ZW1wbGF0ZVZpc2l0QWxsKHRoaXMsIGFzdC5vdXRwdXRzKTtcbiAgICB0ZW1wbGF0ZVZpc2l0QWxsKHRoaXMsIGFzdC5kaXJlY3RpdmVzKTtcbiAgICB0ZW1wbGF0ZVZpc2l0QWxsKHRoaXMsIGFzdC5jaGlsZHJlbik7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICB2aXNpdEVtYmVkZGVkVGVtcGxhdGUoYXN0OiBFbWJlZGRlZFRlbXBsYXRlQXN0LCBjb250ZXh0OiBhbnkpOiBhbnkge1xuICAgIHRlbXBsYXRlVmlzaXRBbGwodGhpcywgYXN0Lm91dHB1dHMpO1xuICAgIHRlbXBsYXRlVmlzaXRBbGwodGhpcywgYXN0LmRpcmVjdGl2ZXMpO1xuICAgIHRlbXBsYXRlVmlzaXRBbGwodGhpcywgYXN0LmNoaWxkcmVuKTtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICB2aXNpdFZhcmlhYmxlKGFzdDogVmFyaWFibGVBc3QsIGN0eDogYW55KTogYW55IHsgcmV0dXJuIG51bGw7IH1cbiAgdmlzaXRBdHRyKGFzdDogQXR0ckFzdCwgYXR0ck5hbWVBbmRWYWx1ZXM6IHtba2V5OiBzdHJpbmddOiBzdHJpbmd9KTogYW55IHsgcmV0dXJuIG51bGw7IH1cbiAgdmlzaXREaXJlY3RpdmUoYXN0OiBEaXJlY3RpdmVBc3QsIGN0eDogYW55KTogYW55IHtcbiAgICB0ZW1wbGF0ZVZpc2l0QWxsKHRoaXMsIGFzdC5pbnB1dHMpO1xuICAgIHRlbXBsYXRlVmlzaXRBbGwodGhpcywgYXN0Lmhvc3RFdmVudHMpO1xuICAgIHRlbXBsYXRlVmlzaXRBbGwodGhpcywgYXN0Lmhvc3RQcm9wZXJ0aWVzKTtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICB2aXNpdEV2ZW50KGFzdDogQm91bmRFdmVudEFzdCwgZXZlbnRUYXJnZXRBbmROYW1lczogTWFwPHN0cmluZywgQm91bmRFdmVudEFzdD4pOiBhbnkge1xuICAgIGFzdC5oYW5kbGVyLnZpc2l0KHRoaXMuY29sbGVjdG9yKTtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICB2aXNpdERpcmVjdGl2ZVByb3BlcnR5KGFzdDogQm91bmREaXJlY3RpdmVQcm9wZXJ0eUFzdCwgY29udGV4dDogYW55KTogYW55IHtcbiAgICBhc3QudmFsdWUudmlzaXQodGhpcy5jb2xsZWN0b3IpO1xuICAgIHJldHVybiBudWxsO1xuICB9XG4gIHZpc2l0RWxlbWVudFByb3BlcnR5KGFzdDogQm91bmRFbGVtZW50UHJvcGVydHlBc3QsIGNvbnRleHQ6IGFueSk6IGFueSB7XG4gICAgYXN0LnZhbHVlLnZpc2l0KHRoaXMuY29sbGVjdG9yKTtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxufVxuIl19