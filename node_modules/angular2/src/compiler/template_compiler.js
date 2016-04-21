'use strict';"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var lang_1 = require('angular2/src/facade/lang');
var exceptions_1 = require('angular2/src/facade/exceptions');
var collection_1 = require('angular2/src/facade/collection');
var async_1 = require('angular2/src/facade/async');
var directive_metadata_1 = require('./directive_metadata');
var template_ast_1 = require('./template_ast');
var di_1 = require('angular2/src/core/di');
var source_module_1 = require('./source_module');
var change_detector_compiler_1 = require('./change_detector_compiler');
var style_compiler_1 = require('./style_compiler');
var view_compiler_1 = require('./view_compiler');
var proto_view_compiler_1 = require('./proto_view_compiler');
var template_parser_1 = require('./template_parser');
var template_normalizer_1 = require('./template_normalizer');
var runtime_metadata_1 = require('./runtime_metadata');
var view_1 = require('angular2/src/core/linker/view');
var change_detection_1 = require('angular2/src/core/change_detection/change_detection');
var resolved_metadata_cache_1 = require('angular2/src/core/linker/resolved_metadata_cache');
var util_1 = require('./util');
exports.METADATA_CACHE_MODULE_REF = source_module_1.moduleRef('package:angular2/src/core/linker/resolved_metadata_cache' + util_1.MODULE_SUFFIX);
/**
 * An internal module of the Angular compiler that begins with component types,
 * extracts templates, and eventually produces a compiled version of the component
 * ready for linking into an application.
 */
var TemplateCompiler = (function () {
    function TemplateCompiler(_runtimeMetadataResolver, _templateNormalizer, _templateParser, _styleCompiler, _cdCompiler, _protoViewCompiler, _viewCompiler, _resolvedMetadataCache, _genConfig) {
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
    TemplateCompiler.prototype.normalizeDirectiveMetadata = function (directive) {
        if (!directive.isComponent) {
            // For non components there is nothing to be normalized yet.
            return async_1.PromiseWrapper.resolve(directive);
        }
        return this._templateNormalizer.normalizeTemplate(directive.type, directive.template)
            .then(function (normalizedTemplate) { return new directive_metadata_1.CompileDirectiveMetadata({
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
        }); });
    };
    TemplateCompiler.prototype.compileHostComponentRuntime = function (type) {
        var compMeta = this._runtimeMetadataResolver.getDirectiveMetadata(type);
        var hostCacheKey = this._hostCacheKeys.get(type);
        if (lang_1.isBlank(hostCacheKey)) {
            hostCacheKey = new Object();
            this._hostCacheKeys.set(type, hostCacheKey);
            assertComponent(compMeta);
            var hostMeta = directive_metadata_1.createHostComponentMeta(compMeta.type, compMeta.selector);
            this._compileComponentRuntime(hostCacheKey, hostMeta, [compMeta], [], []);
        }
        return this._compiledTemplateDone.get(hostCacheKey)
            .then(function (compiledTemplate) {
            return new view_1.HostViewFactory(compMeta.selector, compiledTemplate.viewFactory);
        });
    };
    TemplateCompiler.prototype.clearCache = function () {
        this._styleCompiler.clearCache();
        this._compiledTemplateCache.clear();
        this._compiledTemplateDone.clear();
        this._hostCacheKeys.clear();
    };
    TemplateCompiler.prototype.compileTemplatesCodeGen = function (components) {
        var _this = this;
        if (components.length === 0) {
            throw new exceptions_1.BaseException('No components given');
        }
        var declarations = [];
        components.forEach(function (componentWithDirs) {
            var compMeta = componentWithDirs.component;
            assertComponent(compMeta);
            _this._compileComponentCodeGen(compMeta, componentWithDirs.directives, componentWithDirs.pipes, declarations);
            if (compMeta.dynamicLoadable) {
                var hostMeta = directive_metadata_1.createHostComponentMeta(compMeta.type, compMeta.selector);
                var viewFactoryExpression = _this._compileComponentCodeGen(hostMeta, [compMeta], [], declarations);
                var constructionKeyword = lang_1.IS_DART ? 'const' : 'new';
                var compiledTemplateExpr = constructionKeyword + " " + proto_view_compiler_1.APP_VIEW_MODULE_REF + "HostViewFactory('" + compMeta.selector + "'," + viewFactoryExpression + ")";
                var varName = codeGenHostViewFactoryName(compMeta.type);
                declarations.push("" + util_1.codeGenExportVariable(varName) + compiledTemplateExpr + ";");
            }
        });
        var moduleUrl = components[0].component.type.moduleUrl;
        return new source_module_1.SourceModule("" + templateModuleUrl(moduleUrl), declarations.join('\n'));
    };
    TemplateCompiler.prototype.compileStylesheetCodeGen = function (stylesheetUrl, cssText) {
        return this._styleCompiler.compileStylesheetCodeGen(stylesheetUrl, cssText);
    };
    TemplateCompiler.prototype._compileComponentRuntime = function (cacheKey, compMeta, viewDirectives, pipes, compilingComponentsPath) {
        var _this = this;
        var uniqViewDirectives = removeDuplicates(viewDirectives);
        var uniqViewPipes = removeDuplicates(pipes);
        var compiledTemplate = this._compiledTemplateCache.get(cacheKey);
        var done = this._compiledTemplateDone.get(cacheKey);
        if (lang_1.isBlank(compiledTemplate)) {
            compiledTemplate = new CompiledTemplate();
            this._compiledTemplateCache.set(cacheKey, compiledTemplate);
            done = async_1.PromiseWrapper
                .all([this._styleCompiler.compileComponentRuntime(compMeta.template)].concat(uniqViewDirectives.map(function (dirMeta) { return _this.normalizeDirectiveMetadata(dirMeta); })))
                .then(function (stylesAndNormalizedViewDirMetas) {
                var normalizedViewDirMetas = stylesAndNormalizedViewDirMetas.slice(1);
                var styles = stylesAndNormalizedViewDirMetas[0];
                var parsedTemplate = _this._templateParser.parse(compMeta.template.template, normalizedViewDirMetas, uniqViewPipes, compMeta.type.name);
                var childPromises = [];
                var usedDirectives = DirectiveCollector.findUsedDirectives(parsedTemplate);
                usedDirectives.components.forEach(function (component) { return _this._compileNestedComponentRuntime(component, compilingComponentsPath, childPromises); });
                return async_1.PromiseWrapper.all(childPromises)
                    .then(function (_) {
                    var filteredPipes = filterPipes(parsedTemplate, uniqViewPipes);
                    compiledTemplate.init(_this._createViewFactoryRuntime(compMeta, parsedTemplate, usedDirectives.directives, styles, filteredPipes));
                    return compiledTemplate;
                });
            });
            this._compiledTemplateDone.set(cacheKey, done);
        }
        return compiledTemplate;
    };
    TemplateCompiler.prototype._compileNestedComponentRuntime = function (childComponentDir, parentCompilingComponentsPath, childPromises) {
        var compilingComponentsPath = collection_1.ListWrapper.clone(parentCompilingComponentsPath);
        var childCacheKey = childComponentDir.type.runtime;
        var childViewDirectives = this._runtimeMetadataResolver.getViewDirectivesMetadata(childComponentDir.type.runtime);
        var childViewPipes = this._runtimeMetadataResolver.getViewPipesMetadata(childComponentDir.type.runtime);
        var childIsRecursive = collection_1.ListWrapper.contains(compilingComponentsPath, childCacheKey);
        compilingComponentsPath.push(childCacheKey);
        this._compileComponentRuntime(childCacheKey, childComponentDir, childViewDirectives, childViewPipes, compilingComponentsPath);
        if (!childIsRecursive) {
            // Only wait for a child if it is not a cycle
            childPromises.push(this._compiledTemplateDone.get(childCacheKey));
        }
    };
    TemplateCompiler.prototype._createViewFactoryRuntime = function (compMeta, parsedTemplate, directives, styles, pipes) {
        var _this = this;
        if (lang_1.IS_DART || !this._genConfig.useJit) {
            var changeDetectorFactories = this._cdCompiler.compileComponentRuntime(compMeta.type, compMeta.changeDetection, parsedTemplate);
            var protoViews = this._protoViewCompiler.compileProtoViewRuntime(this._resolvedMetadataCache, compMeta, parsedTemplate, pipes);
            return this._viewCompiler.compileComponentRuntime(compMeta, parsedTemplate, styles, protoViews.protoViews, changeDetectorFactories, function (compMeta) { return _this._getNestedComponentViewFactory(compMeta); });
        }
        else {
            var declarations = [];
            var viewFactoryExpr = this._createViewFactoryCodeGen('resolvedMetadataCache', compMeta, new source_module_1.SourceExpression([], 'styles'), parsedTemplate, pipes, declarations);
            var vars = { 'exports': {}, 'styles': styles, 'resolvedMetadataCache': this._resolvedMetadataCache };
            directives.forEach(function (dirMeta) {
                vars[dirMeta.type.name] = dirMeta.type.runtime;
                if (dirMeta.isComponent && dirMeta.type.runtime !== compMeta.type.runtime) {
                    vars[("viewFactory_" + dirMeta.type.name + "0")] = _this._getNestedComponentViewFactory(dirMeta);
                }
            });
            pipes.forEach(function (pipeMeta) { return vars[pipeMeta.type.name] = pipeMeta.type.runtime; });
            var declarationsWithoutImports = source_module_1.SourceModule.getSourceWithoutImports(declarations.join('\n'));
            return lang_1.evalExpression("viewFactory_" + compMeta.type.name, viewFactoryExpr, declarationsWithoutImports, mergeStringMaps([vars, change_detector_compiler_1.CHANGE_DETECTION_JIT_IMPORTS, proto_view_compiler_1.PROTO_VIEW_JIT_IMPORTS, view_compiler_1.VIEW_JIT_IMPORTS]));
        }
    };
    TemplateCompiler.prototype._getNestedComponentViewFactory = function (compMeta) {
        return this._compiledTemplateCache.get(compMeta.type.runtime).viewFactory;
    };
    TemplateCompiler.prototype._compileComponentCodeGen = function (compMeta, directives, pipes, targetDeclarations) {
        var uniqueDirectives = removeDuplicates(directives);
        var uniqPipes = removeDuplicates(pipes);
        var styleExpr = this._styleCompiler.compileComponentCodeGen(compMeta.template);
        var parsedTemplate = this._templateParser.parse(compMeta.template.template, uniqueDirectives, uniqPipes, compMeta.type.name);
        var filteredPipes = filterPipes(parsedTemplate, uniqPipes);
        return this._createViewFactoryCodeGen(exports.METADATA_CACHE_MODULE_REF + "CODEGEN_RESOLVED_METADATA_CACHE", compMeta, styleExpr, parsedTemplate, filteredPipes, targetDeclarations);
    };
    TemplateCompiler.prototype._createViewFactoryCodeGen = function (resolvedMetadataCacheExpr, compMeta, styleExpr, parsedTemplate, pipes, targetDeclarations) {
        var changeDetectorsExprs = this._cdCompiler.compileComponentCodeGen(compMeta.type, compMeta.changeDetection, parsedTemplate);
        var protoViewExprs = this._protoViewCompiler.compileProtoViewCodeGen(new util_1.Expression(resolvedMetadataCacheExpr), compMeta, parsedTemplate, pipes);
        var viewFactoryExpr = this._viewCompiler.compileComponentCodeGen(compMeta, parsedTemplate, styleExpr, protoViewExprs.protoViews, changeDetectorsExprs, codeGenComponentViewFactoryName);
        util_1.addAll(changeDetectorsExprs.declarations, targetDeclarations);
        util_1.addAll(protoViewExprs.declarations, targetDeclarations);
        util_1.addAll(viewFactoryExpr.declarations, targetDeclarations);
        return viewFactoryExpr.expression;
    };
    TemplateCompiler = __decorate([
        di_1.Injectable(), 
        __metadata('design:paramtypes', [runtime_metadata_1.RuntimeMetadataResolver, template_normalizer_1.TemplateNormalizer, template_parser_1.TemplateParser, style_compiler_1.StyleCompiler, change_detector_compiler_1.ChangeDetectionCompiler, proto_view_compiler_1.ProtoViewCompiler, view_compiler_1.ViewCompiler, resolved_metadata_cache_1.ResolvedMetadataCache, change_detection_1.ChangeDetectorGenConfig])
    ], TemplateCompiler);
    return TemplateCompiler;
}());
exports.TemplateCompiler = TemplateCompiler;
var NormalizedComponentWithViewDirectives = (function () {
    function NormalizedComponentWithViewDirectives(component, directives, pipes) {
        this.component = component;
        this.directives = directives;
        this.pipes = pipes;
    }
    return NormalizedComponentWithViewDirectives;
}());
exports.NormalizedComponentWithViewDirectives = NormalizedComponentWithViewDirectives;
var CompiledTemplate = (function () {
    function CompiledTemplate() {
        this.viewFactory = null;
    }
    CompiledTemplate.prototype.init = function (viewFactory) { this.viewFactory = viewFactory; };
    return CompiledTemplate;
}());
function assertComponent(meta) {
    if (!meta.isComponent) {
        throw new exceptions_1.BaseException("Could not compile '" + meta.type.name + "' because it is not a component.");
    }
}
function templateModuleUrl(moduleUrl) {
    var urlWithoutSuffix = moduleUrl.substring(0, moduleUrl.length - util_1.MODULE_SUFFIX.length);
    return urlWithoutSuffix + ".template" + util_1.MODULE_SUFFIX;
}
function codeGenHostViewFactoryName(type) {
    return "hostViewFactory_" + type.name;
}
function codeGenComponentViewFactoryName(nestedCompType) {
    return source_module_1.moduleRef(templateModuleUrl(nestedCompType.type.moduleUrl)) + "viewFactory_" + nestedCompType.type.name + "0";
}
function mergeStringMaps(maps) {
    var result = {};
    maps.forEach(function (map) { collection_1.StringMapWrapper.forEach(map, function (value, key) { result[key] = value; }); });
    return result;
}
function removeDuplicates(items) {
    var res = [];
    items.forEach(function (item) {
        var hasMatch = res.filter(function (r) { return r.type.name == item.type.name && r.type.moduleUrl == item.type.moduleUrl &&
            r.type.runtime == item.type.runtime; })
            .length > 0;
        if (!hasMatch) {
            res.push(item);
        }
    });
    return res;
}
var DirectiveCollector = (function () {
    function DirectiveCollector() {
        this.directives = [];
        this.components = [];
    }
    DirectiveCollector.findUsedDirectives = function (parsedTemplate) {
        var collector = new DirectiveCollector();
        template_ast_1.templateVisitAll(collector, parsedTemplate);
        return collector;
    };
    DirectiveCollector.prototype.visitBoundText = function (ast, context) { return null; };
    DirectiveCollector.prototype.visitText = function (ast, context) { return null; };
    DirectiveCollector.prototype.visitNgContent = function (ast, context) { return null; };
    DirectiveCollector.prototype.visitElement = function (ast, context) {
        template_ast_1.templateVisitAll(this, ast.directives);
        template_ast_1.templateVisitAll(this, ast.children);
        return null;
    };
    DirectiveCollector.prototype.visitEmbeddedTemplate = function (ast, context) {
        template_ast_1.templateVisitAll(this, ast.directives);
        template_ast_1.templateVisitAll(this, ast.children);
        return null;
    };
    DirectiveCollector.prototype.visitVariable = function (ast, ctx) { return null; };
    DirectiveCollector.prototype.visitAttr = function (ast, attrNameAndValues) { return null; };
    DirectiveCollector.prototype.visitDirective = function (ast, ctx) {
        if (ast.directive.isComponent) {
            this.components.push(ast.directive);
        }
        this.directives.push(ast.directive);
        return null;
    };
    DirectiveCollector.prototype.visitEvent = function (ast, eventTargetAndNames) {
        return null;
    };
    DirectiveCollector.prototype.visitDirectiveProperty = function (ast, context) { return null; };
    DirectiveCollector.prototype.visitElementProperty = function (ast, context) { return null; };
    return DirectiveCollector;
}());
function filterPipes(template, allPipes) {
    var visitor = new PipeVisitor();
    template_ast_1.templateVisitAll(visitor, template);
    return allPipes.filter(function (pipeMeta) { return collection_1.SetWrapper.has(visitor.collector.pipes, pipeMeta.name); });
}
var PipeVisitor = (function () {
    function PipeVisitor() {
        this.collector = new template_parser_1.PipeCollector();
    }
    PipeVisitor.prototype.visitBoundText = function (ast, context) {
        ast.value.visit(this.collector);
        return null;
    };
    PipeVisitor.prototype.visitText = function (ast, context) { return null; };
    PipeVisitor.prototype.visitNgContent = function (ast, context) { return null; };
    PipeVisitor.prototype.visitElement = function (ast, context) {
        template_ast_1.templateVisitAll(this, ast.inputs);
        template_ast_1.templateVisitAll(this, ast.outputs);
        template_ast_1.templateVisitAll(this, ast.directives);
        template_ast_1.templateVisitAll(this, ast.children);
        return null;
    };
    PipeVisitor.prototype.visitEmbeddedTemplate = function (ast, context) {
        template_ast_1.templateVisitAll(this, ast.outputs);
        template_ast_1.templateVisitAll(this, ast.directives);
        template_ast_1.templateVisitAll(this, ast.children);
        return null;
    };
    PipeVisitor.prototype.visitVariable = function (ast, ctx) { return null; };
    PipeVisitor.prototype.visitAttr = function (ast, attrNameAndValues) { return null; };
    PipeVisitor.prototype.visitDirective = function (ast, ctx) {
        template_ast_1.templateVisitAll(this, ast.inputs);
        template_ast_1.templateVisitAll(this, ast.hostEvents);
        template_ast_1.templateVisitAll(this, ast.hostProperties);
        return null;
    };
    PipeVisitor.prototype.visitEvent = function (ast, eventTargetAndNames) {
        ast.handler.visit(this.collector);
        return null;
    };
    PipeVisitor.prototype.visitDirectiveProperty = function (ast, context) {
        ast.value.visit(this.collector);
        return null;
    };
    PipeVisitor.prototype.visitElementProperty = function (ast, context) {
        ast.value.visit(this.collector);
        return null;
    };
    return PipeVisitor;
}());
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVtcGxhdGVfY29tcGlsZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJkaWZmaW5nX3BsdWdpbl93cmFwcGVyLW91dHB1dF9wYXRoLWpha1huTW1MLnRtcC9hbmd1bGFyMi9zcmMvY29tcGlsZXIvdGVtcGxhdGVfY29tcGlsZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLHFCQVFPLDBCQUEwQixDQUFDLENBQUE7QUFDbEMsMkJBQTRCLGdDQUFnQyxDQUFDLENBQUE7QUFDN0QsMkJBS08sZ0NBQWdDLENBQUMsQ0FBQTtBQUN4QyxzQkFBNkIsMkJBQTJCLENBQUMsQ0FBQTtBQUN6RCxtQ0FPTyxzQkFBc0IsQ0FBQyxDQUFBO0FBQzlCLDZCQWVPLGdCQUFnQixDQUFDLENBQUE7QUFDeEIsbUJBQXlCLHNCQUFzQixDQUFDLENBQUE7QUFDaEQsOEJBQXdELGlCQUFpQixDQUFDLENBQUE7QUFDMUUseUNBQW9FLDRCQUE0QixDQUFDLENBQUE7QUFDakcsK0JBQTRCLGtCQUFrQixDQUFDLENBQUE7QUFDL0MsOEJBQTZDLGlCQUFpQixDQUFDLENBQUE7QUFDL0Qsb0NBS08sdUJBQXVCLENBQUMsQ0FBQTtBQUMvQixnQ0FBNEMsbUJBQW1CLENBQUMsQ0FBQTtBQUNoRSxvQ0FBaUMsdUJBQXVCLENBQUMsQ0FBQTtBQUN6RCxpQ0FBc0Msb0JBQW9CLENBQUMsQ0FBQTtBQUMzRCxxQkFBOEIsK0JBQStCLENBQUMsQ0FBQTtBQUM5RCxpQ0FBc0MscURBQXFELENBQUMsQ0FBQTtBQUM1Rix3Q0FBb0Msa0RBQWtELENBQUMsQ0FBQTtBQUV2RixxQkFPTyxRQUFRLENBQUMsQ0FBQTtBQUVMLGlDQUF5QixHQUNoQyx5QkFBUyxDQUFDLDBEQUEwRCxHQUFHLG9CQUFhLENBQUMsQ0FBQztBQUUxRjs7OztHQUlHO0FBRUg7SUFLRSwwQkFBb0Isd0JBQWlELEVBQ2pELG1CQUF1QyxFQUN2QyxlQUErQixFQUFVLGNBQTZCLEVBQ3RFLFdBQW9D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QixDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDdkMsK0JBQWdCLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUMzQyxNQUFNLENBQUMsSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUNELGdDQUFVLEdBQVYsVUFBVyxHQUFrQixFQUFFLG1CQUErQztRQUM1RSxHQUFHLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDbEMsTUFBTSxDQUFDLElBQUksQ0FBQztJQUNkLENBQUM7SUFDRCw0Q0FBc0IsR0FBdEIsVUFBdUIsR0FBOEIsRUFBRSxPQUFZO1FBQ2pFLEdBQUcsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUNoQyxNQUFNLENBQUMsSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUNELDBDQUFvQixHQUFwQixVQUFxQixHQUE0QixFQUFFLE9BQVk7UUFDN0QsR0FBRyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ2hDLE1BQU0sQ0FBQyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBQ0gsa0JBQUM7QUFBRCxDQUFDLEFBN0NELElBNkNDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgSVNfREFSVCxcbiAgVHlwZSxcbiAgSnNvbixcbiAgaXNCbGFuayxcbiAgaXNQcmVzZW50LFxuICBzdHJpbmdpZnksXG4gIGV2YWxFeHByZXNzaW9uXG59IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvbGFuZyc7XG5pbXBvcnQge0Jhc2VFeGNlcHRpb259IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvZXhjZXB0aW9ucyc7XG5pbXBvcnQge1xuICBMaXN0V3JhcHBlcixcbiAgU2V0V3JhcHBlcixcbiAgTWFwV3JhcHBlcixcbiAgU3RyaW5nTWFwV3JhcHBlclxufSBmcm9tICdhbmd1bGFyMi9zcmMvZmFjYWRlL2NvbGxlY3Rpb24nO1xuaW1wb3J0IHtQcm9taXNlV3JhcHBlcn0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9hc3luYyc7XG5pbXBvcnQge1xuICBjcmVhdGVIb3N0Q29tcG9uZW50TWV0YSxcbiAgQ29tcGlsZURpcmVjdGl2ZU1ldGFkYXRhLFxuICBDb21waWxlVHlwZU1ldGFkYXRhLFxuICBDb21waWxlVGVtcGxhdGVNZXRhZGF0YSxcbiAgQ29tcGlsZVBpcGVNZXRhZGF0YSxcbiAgQ29tcGlsZU1ldGFkYXRhV2l0aFR5cGVcbn0gZnJvbSAnLi9kaXJlY3RpdmVfbWV0YWRhdGEnO1xuaW1wb3J0IHtcbiAgVGVtcGxhdGVBc3QsXG4gIFRlbXBsYXRlQXN0VmlzaXRvcixcbiAgTmdDb250ZW50QXN0LFxuICBFbWJlZGRlZFRlbXBsYXRlQXN0LFxuICBFbGVtZW50QXN0LFxuICBWYXJpYWJsZUFzdCxcbiAgQm91bmRFdmVudEFzdCxcbiAgQm91bmRFbGVtZW50UHJvcGVydHlBc3QsXG4gIEF0dHJBc3QsXG4gIEJvdW5kVGV4dEFzdCxcbiAgVGV4dEFzdCxcbiAgRGlyZWN0aXZlQXN0LFxuICBCb3VuZERpcmVjdGl2ZVByb3BlcnR5QXN0LFxuICB0ZW1wbGF0ZVZpc2l0QWxsXG59IGZyb20gJy4vdGVtcGxhdGVfYXN0JztcbmltcG9ydCB7SW5qZWN0YWJsZX0gZnJvbSAnYW5ndWxhcjIvc3JjL2NvcmUvZGknO1xuaW1wb3J0IHtTb3VyY2VNb2R1bGUsIG1vZHVsZVJlZiwgU291cmNlRXhwcmVzc2lvbn0gZnJvbSAnLi9zb3VyY2VfbW9kdWxlJztcbmltcG9ydCB7Q2hhbmdlRGV0ZWN0aW9uQ29tcGlsZXIsIENIQU5HRV9ERVRFQ1RJT05fSklUX0lNUE9SVFN9IGZyb20gJy4vY2hhbmdlX2RldGVjdG9yX2NvbXBpbGVyJztcbmltcG9ydCB7U3R5bGVDb21waWxlcn0gZnJvbSAnLi9zdHlsZV9jb21waWxlcic7XG5pbXBvcnQge1ZpZXdDb21waWxlciwgVklFV19KSVRfSU1QT1JUU30gZnJvbSAnLi92aWV3X2NvbXBpbGVyJztcbmltcG9ydCB7XG4gIFByb3RvVmlld0NvbXBpbGVyLFxuICBBUFBfVklFV19NT0RVTEVfUkVGLFxuICBDb21waWxlUHJvdG9WaWV3LFxuICBQUk9UT19WSUVXX0pJVF9JTVBPUlRTXG59IGZyb20gJy4vcHJvdG9fdmlld19jb21waWxlcic7XG5pbXBvcnQge1RlbXBsYXRlUGFyc2VyLCBQaXBlQ29sbGVjdG9yfSBmcm9tICcuL3RlbXBsYXRlX3BhcnNlcic7XG5pbXBvcnQge1RlbXBsYXRlTm9ybWFsaXplcn0gZnJvbSAnLi90ZW1wbGF0ZV9ub3JtYWxpemVyJztcbmltcG9ydCB7UnVudGltZU1ldGFkYXRhUmVzb2x2ZXJ9IGZyb20gJy4vcnVudGltZV9tZXRhZGF0YSc7XG5pbXBvcnQge0hvc3RWaWV3RmFjdG9yeX0gZnJvbSAnYW5ndWxhcjIvc3JjL2NvcmUvbGlua2VyL3ZpZXcnO1xuaW1wb3J0IHtDaGFuZ2VEZXRlY3RvckdlbkNvbmZpZ30gZnJvbSAnYW5ndWxhcjIvc3JjL2NvcmUvY2hhbmdlX2RldGVjdGlvbi9jaGFuZ2VfZGV0ZWN0aW9uJztcbmltcG9ydCB7UmVzb2x2ZWRNZXRhZGF0YUNhY2hlfSBmcm9tICdhbmd1bGFyMi9zcmMvY29yZS9saW5rZXIvcmVzb2x2ZWRfbWV0YWRhdGFfY2FjaGUnO1xuXG5pbXBvcnQge1xuICBjb2RlR2VuRXhwb3J0VmFyaWFibGUsXG4gIGVzY2FwZVNpbmdsZVF1b3RlU3RyaW5nLFxuICBjb2RlR2VuVmFsdWVGbixcbiAgTU9EVUxFX1NVRkZJWCxcbiAgYWRkQWxsLFxuICBFeHByZXNzaW9uXG59IGZyb20gJy4vdXRpbCc7XG5cbmV4cG9ydCB2YXIgTUVUQURBVEFfQ0FDSEVfTU9EVUxFX1JFRiA9XG4gICAgbW9kdWxlUmVmKCdwYWNrYWdlOmFuZ3VsYXIyL3NyYy9jb3JlL2xpbmtlci9yZXNvbHZlZF9tZXRhZGF0YV9jYWNoZScgKyBNT0RVTEVfU1VGRklYKTtcblxuLyoqXG4gKiBBbiBpbnRlcm5hbCBtb2R1bGUgb2YgdGhlIEFuZ3VsYXIgY29tcGlsZXIgdGhhdCBiZWdpbnMgd2l0aCBjb21wb25lbnQgdHlwZXMsXG4gKiBleHRyYWN0cyB0ZW1wbGF0ZXMsIGFuZCBldmVudHVhbGx5IHByb2R1Y2VzIGEgY29tcGlsZWQgdmVyc2lvbiBvZiB0aGUgY29tcG9uZW50XG4gKiByZWFkeSBmb3IgbGlua2luZyBpbnRvIGFuIGFwcGxpY2F0aW9uLlxuICovXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgVGVtcGxhdGVDb21waWxlciB7XG4gIHByaXZhdGUgX2hvc3RDYWNoZUtleXMgPSBuZXcgTWFwPFR5cGUsIGFueT4oKTtcbiAgcHJpdmF0ZSBfY29tcGlsZWRUZW1wbGF0ZUNhY2hlID0gbmV3IE1hcDxhbnksIENvbXBpbGVkVGVtcGxhdGU+KCk7XG4gIHByaXZhdGUgX2NvbXBpbGVkVGVtcGxhdGVEb25lID0gbmV3IE1hcDxhbnksIFByb21pc2U8Q29tcGlsZWRUZW1wbGF0ZT4+KCk7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBfcnVudGltZU1ldGFkYXRhUmVzb2x2ZXI6IFJ1bnRpbWVNZXRhZGF0YVJlc29sdmVyLFxuICAgICAgICAgICAgICBwcml2YXRlIF90ZW1wbGF0ZU5vcm1hbGl6ZXI6IFRlbXBsYXRlTm9ybWFsaXplcixcbiAgICAgICAgICAgICAgcHJpdmF0ZSBfdGVtcGxhdGVQYXJzZXI6IFRlbXBsYXRlUGFyc2VyLCBwcml2YXRlIF9zdHlsZUNvbXBpbGVyOiBTdHlsZUNvbXBpbGVyLFxuICAgICAgICAgICAgICBwcml2YXRlIF9jZENvbXBpbGVyOiBDaGFuZ2VEZXRlY3Rpb25Db21waWxlcixcbiAgICAgICAgICAgICAgcHJpdmF0ZSBfcHJvdG9WaWV3Q29tcGlsZXI6IFByb3RvVmlld0NvbXBpbGVyLCBwcml2YXRlIF92aWV3Q29tcGlsZXI6IFZpZXdDb21waWxlcixcbiAgICAgICAgICAgICAgcHJpdmF0ZSBfcmVzb2x2ZWRNZXRhZGF0YUNhY2hlOiBSZXNvbHZlZE1ldGFkYXRhQ2FjaGUsXG4gICAgICAgICAgICAgIHByaXZhdGUgX2dlbkNvbmZpZzogQ2hhbmdlRGV0ZWN0b3JHZW5Db25maWcpIHt9XG5cbiAgbm9ybWFsaXplRGlyZWN0aXZlTWV0YWRhdGEoZGlyZWN0aXZlOiBDb21waWxlRGlyZWN0aXZlTWV0YWRhdGEpOlxuICAgICAgUHJvbWlzZTxDb21waWxlRGlyZWN0aXZlTWV0YWRhdGE+IHtcbiAgICBpZiAoIWRpcmVjdGl2ZS5pc0NvbXBvbmVudCkge1xuICAgICAgLy8gRm9yIG5vbiBjb21wb25lbnRzIHRoZXJlIGlzIG5vdGhpbmcgdG8gYmUgbm9ybWFsaXplZCB5ZXQuXG4gICAgICByZXR1cm4gUHJvbWlzZVdyYXBwZXIucmVzb2x2ZShkaXJlY3RpdmUpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLl90ZW1wbGF0ZU5vcm1hbGl6ZXIubm9ybWFsaXplVGVtcGxhdGUoZGlyZWN0aXZlLnR5cGUsIGRpcmVjdGl2ZS50ZW1wbGF0ZSlcbiAgICAgICAgLnRoZW4oKG5vcm1hbGl6ZWRUZW1wbGF0ZTogQ29tcGlsZVRlbXBsYXRlTWV0YWRhdGEpID0+IG5ldyBDb21waWxlRGlyZWN0aXZlTWV0YWRhdGEoe1xuICAgICAgICAgICAgICAgIHR5cGU6IGRpcmVjdGl2ZS50eXBlLFxuICAgICAgICAgICAgICAgIGlzQ29tcG9uZW50OiBkaXJlY3RpdmUuaXNDb21wb25lbnQsXG4gICAgICAgICAgICAgICAgZHluYW1pY0xvYWRhYmxlOiBkaXJlY3RpdmUuZHluYW1pY0xvYWRhYmxlLFxuICAgICAgICAgICAgICAgIHNlbGVjdG9yOiBkaXJlY3RpdmUuc2VsZWN0b3IsXG4gICAgICAgICAgICAgICAgZXhwb3J0QXM6IGRpcmVjdGl2ZS5leHBvcnRBcyxcbiAgICAgICAgICAgICAgICBjaGFuZ2VEZXRlY3Rpb246IGRpcmVjdGl2ZS5jaGFuZ2VEZXRlY3Rpb24sXG4gICAgICAgICAgICAgICAgaW5wdXRzOiBkaXJlY3RpdmUuaW5wdXRzLFxuICAgICAgICAgICAgICAgIG91dHB1dHM6IGRpcmVjdGl2ZS5vdXRwdXRzLFxuICAgICAgICAgICAgICAgIGhvc3RMaXN0ZW5lcnM6IGRpcmVjdGl2ZS5ob3N0TGlzdGVuZXJzLFxuICAgICAgICAgICAgICAgIGhvc3RQcm9wZXJ0aWVzOiBkaXJlY3RpdmUuaG9zdFByb3BlcnRpZXMsXG4gICAgICAgICAgICAgICAgaG9zdEF0dHJpYnV0ZXM6IGRpcmVjdGl2ZS5ob3N0QXR0cmlidXRlcyxcbiAgICAgICAgICAgICAgICBsaWZlY3ljbGVIb29rczogZGlyZWN0aXZlLmxpZmVjeWNsZUhvb2tzLFxuICAgICAgICAgICAgICAgIHByb3ZpZGVyczogZGlyZWN0aXZlLnByb3ZpZGVycyxcbiAgICAgICAgICAgICAgICB2aWV3UHJvdmlkZXJzOiBkaXJlY3RpdmUudmlld1Byb3ZpZGVycyxcbiAgICAgICAgICAgICAgICBxdWVyaWVzOiBkaXJlY3RpdmUucXVlcmllcyxcbiAgICAgICAgICAgICAgICB2aWV3UXVlcmllczogZGlyZWN0aXZlLnZpZXdRdWVyaWVzLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlOiBub3JtYWxpemVkVGVtcGxhdGVcbiAgICAgICAgICAgICAgfSkpO1xuICB9XG5cbiAgY29tcGlsZUhvc3RDb21wb25lbnRSdW50aW1lKHR5cGU6IFR5cGUpOiBQcm9taXNlPEhvc3RWaWV3RmFjdG9yeT4ge1xuICAgIHZhciBjb21wTWV0YTogQ29tcGlsZURpcmVjdGl2ZU1ldGFkYXRhID1cbiAgICAgICAgdGhpcy5fcnVudGltZU1ldGFkYXRhUmVzb2x2ZXIuZ2V0RGlyZWN0aXZlTWV0YWRhdGEodHlwZSk7XG4gICAgdmFyIGhvc3RDYWNoZUtleSA9IHRoaXMuX2hvc3RDYWNoZUtleXMuZ2V0KHR5cGUpO1xuICAgIGlmIChpc0JsYW5rKGhvc3RDYWNoZUtleSkpIHtcbiAgICAgIGhvc3RDYWNoZUtleSA9IG5ldyBPYmplY3QoKTtcbiAgICAgIHRoaXMuX2hvc3RDYWNoZUtleXMuc2V0KHR5cGUsIGhvc3RDYWNoZUtleSk7XG4gICAgICBhc3NlcnRDb21wb25lbnQoY29tcE1ldGEpO1xuICAgICAgdmFyIGhvc3RNZXRhOiBDb21waWxlRGlyZWN0aXZlTWV0YWRhdGEgPVxuICAgICAgICAgIGNyZWF0ZUhvc3RDb21wb25lbnRNZXRhKGNvbXBNZXRhLnR5cGUsIGNvbXBNZXRhLnNlbGVjdG9yKTtcblxuICAgICAgdGhpcy5fY29tcGlsZUNvbXBvbmVudFJ1bnRpbWUoaG9zdENhY2hlS2V5LCBob3N0TWV0YSwgW2NvbXBNZXRhXSwgW10sIFtdKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX2NvbXBpbGVkVGVtcGxhdGVEb25lLmdldChob3N0Q2FjaGVLZXkpXG4gICAgICAgIC50aGVuKChjb21waWxlZFRlbXBsYXRlOiBDb21waWxlZFRlbXBsYXRlKSA9PlxuICAgICAgICAgICAgICAgICAgbmV3IEhvc3RWaWV3RmFjdG9yeShjb21wTWV0YS5zZWxlY3RvciwgY29tcGlsZWRUZW1wbGF0ZS52aWV3RmFjdG9yeSkpO1xuICB9XG5cbiAgY2xlYXJDYWNoZSgpIHtcbiAgICB0aGlzLl9zdHlsZUNvbXBpbGVyLmNsZWFyQ2FjaGUoKTtcbiAgICB0aGlzLl9jb21waWxlZFRlbXBsYXRlQ2FjaGUuY2xlYXIoKTtcbiAgICB0aGlzLl9jb21waWxlZFRlbXBsYXRlRG9uZS5jbGVhcigpO1xuICAgIHRoaXMuX2hvc3RDYWNoZUtleXMuY2xlYXIoKTtcbiAgfVxuXG4gIGNvbXBpbGVUZW1wbGF0ZXNDb2RlR2VuKGNvbXBvbmVudHM6IE5vcm1hbGl6ZWRDb21wb25lbnRXaXRoVmlld0RpcmVjdGl2ZXNbXSk6IFNvdXJjZU1vZHVsZSB7XG4gICAgaWYgKGNvbXBvbmVudHMubGVuZ3RoID09PSAwKSB7XG4gICAgICB0aHJvdyBuZXcgQmFzZUV4Y2VwdGlvbignTm8gY29tcG9uZW50cyBnaXZlbicpO1xuICAgIH1cbiAgICB2YXIgZGVjbGFyYXRpb25zID0gW107XG4gICAgY29tcG9uZW50cy5mb3JFYWNoKGNvbXBvbmVudFdpdGhEaXJzID0+IHtcbiAgICAgIHZhciBjb21wTWV0YSA9IDxDb21waWxlRGlyZWN0aXZlTWV0YWRhdGE+Y29tcG9uZW50V2l0aERpcnMuY29tcG9uZW50O1xuICAgICAgYXNzZXJ0Q29tcG9uZW50KGNvbXBNZXRhKTtcbiAgICAgIHRoaXMuX2NvbXBpbGVDb21wb25lbnRDb2RlR2VuKGNvbXBNZXRhLCBjb21wb25lbnRXaXRoRGlycy5kaXJlY3RpdmVzLCBjb21wb25lbnRXaXRoRGlycy5waXBlcyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlY2xhcmF0aW9ucyk7XG4gICAgICBpZiAoY29tcE1ldGEuZHluYW1pY0xvYWRhYmxlKSB7XG4gICAgICAgIHZhciBob3N0TWV0YSA9IGNyZWF0ZUhvc3RDb21wb25lbnRNZXRhKGNvbXBNZXRhLnR5cGUsIGNvbXBNZXRhLnNlbGVjdG9yKTtcbiAgICAgICAgdmFyIHZpZXdGYWN0b3J5RXhwcmVzc2lvbiA9XG4gICAgICAgICAgICB0aGlzLl9jb21waWxlQ29tcG9uZW50Q29kZUdlbihob3N0TWV0YSwgW2NvbXBNZXRhXSwgW10sIGRlY2xhcmF0aW9ucyk7XG4gICAgICAgIHZhciBjb25zdHJ1Y3Rpb25LZXl3b3JkID0gSVNfREFSVCA/ICdjb25zdCcgOiAnbmV3JztcbiAgICAgICAgdmFyIGNvbXBpbGVkVGVtcGxhdGVFeHByID1cbiAgICAgICAgICAgIGAke2NvbnN0cnVjdGlvbktleXdvcmR9ICR7QVBQX1ZJRVdfTU9EVUxFX1JFRn1Ib3N0Vmlld0ZhY3RvcnkoJyR7Y29tcE1ldGEuc2VsZWN0b3J9Jywke3ZpZXdGYWN0b3J5RXhwcmVzc2lvbn0pYDtcbiAgICAgICAgdmFyIHZhck5hbWUgPSBjb2RlR2VuSG9zdFZpZXdGYWN0b3J5TmFtZShjb21wTWV0YS50eXBlKTtcbiAgICAgICAgZGVjbGFyYXRpb25zLnB1c2goYCR7Y29kZUdlbkV4cG9ydFZhcmlhYmxlKHZhck5hbWUpfSR7Y29tcGlsZWRUZW1wbGF0ZUV4cHJ9O2ApO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHZhciBtb2R1bGVVcmwgPSBjb21wb25lbnRzWzBdLmNvbXBvbmVudC50eXBlLm1vZHVsZVVybDtcbiAgICByZXR1cm4gbmV3IFNvdXJjZU1vZHVsZShgJHt0ZW1wbGF0ZU1vZHVsZVVybChtb2R1bGVVcmwpfWAsIGRlY2xhcmF0aW9ucy5qb2luKCdcXG4nKSk7XG4gIH1cblxuICBjb21waWxlU3R5bGVzaGVldENvZGVHZW4oc3R5bGVzaGVldFVybDogc3RyaW5nLCBjc3NUZXh0OiBzdHJpbmcpOiBTb3VyY2VNb2R1bGVbXSB7XG4gICAgcmV0dXJuIHRoaXMuX3N0eWxlQ29tcGlsZXIuY29tcGlsZVN0eWxlc2hlZXRDb2RlR2VuKHN0eWxlc2hlZXRVcmwsIGNzc1RleHQpO1xuICB9XG5cblxuXG4gIHByaXZhdGUgX2NvbXBpbGVDb21wb25lbnRSdW50aW1lKGNhY2hlS2V5OiBhbnksIGNvbXBNZXRhOiBDb21waWxlRGlyZWN0aXZlTWV0YWRhdGEsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZpZXdEaXJlY3RpdmVzOiBDb21waWxlRGlyZWN0aXZlTWV0YWRhdGFbXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGlwZXM6IENvbXBpbGVQaXBlTWV0YWRhdGFbXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tcGlsaW5nQ29tcG9uZW50c1BhdGg6IGFueVtdKTogQ29tcGlsZWRUZW1wbGF0ZSB7XG4gICAgbGV0IHVuaXFWaWV3RGlyZWN0aXZlcyA9IDxDb21waWxlRGlyZWN0aXZlTWV0YWRhdGFbXT5yZW1vdmVEdXBsaWNhdGVzKHZpZXdEaXJlY3RpdmVzKTtcbiAgICBsZXQgdW5pcVZpZXdQaXBlcyA9IDxDb21waWxlUGlwZU1ldGFkYXRhW10+cmVtb3ZlRHVwbGljYXRlcyhwaXBlcyk7XG4gICAgdmFyIGNvbXBpbGVkVGVtcGxhdGUgPSB0aGlzLl9jb21waWxlZFRlbXBsYXRlQ2FjaGUuZ2V0KGNhY2hlS2V5KTtcbiAgICB2YXIgZG9uZSA9IHRoaXMuX2NvbXBpbGVkVGVtcGxhdGVEb25lLmdldChjYWNoZUtleSk7XG4gICAgaWYgKGlzQmxhbmsoY29tcGlsZWRUZW1wbGF0ZSkpIHtcbiAgICAgIGNvbXBpbGVkVGVtcGxhdGUgPSBuZXcgQ29tcGlsZWRUZW1wbGF0ZSgpO1xuICAgICAgdGhpcy5fY29tcGlsZWRUZW1wbGF0ZUNhY2hlLnNldChjYWNoZUtleSwgY29tcGlsZWRUZW1wbGF0ZSk7XG4gICAgICBkb25lID0gUHJvbWlzZVdyYXBwZXJcbiAgICAgICAgICAgICAgICAgLmFsbChbPGFueT50aGlzLl9zdHlsZUNvbXBpbGVyLmNvbXBpbGVDb21wb25lbnRSdW50aW1lKGNvbXBNZXRhLnRlbXBsYXRlKV0uY29uY2F0KFxuICAgICAgICAgICAgICAgICAgICAgdW5pcVZpZXdEaXJlY3RpdmVzLm1hcChkaXJNZXRhID0+IHRoaXMubm9ybWFsaXplRGlyZWN0aXZlTWV0YWRhdGEoZGlyTWV0YSkpKSlcbiAgICAgICAgICAgICAgICAgLnRoZW4oKHN0eWxlc0FuZE5vcm1hbGl6ZWRWaWV3RGlyTWV0YXM6IGFueVtdKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgdmFyIG5vcm1hbGl6ZWRWaWV3RGlyTWV0YXMgPSBzdHlsZXNBbmROb3JtYWxpemVkVmlld0Rpck1ldGFzLnNsaWNlKDEpO1xuICAgICAgICAgICAgICAgICAgIHZhciBzdHlsZXMgPSBzdHlsZXNBbmROb3JtYWxpemVkVmlld0Rpck1ldGFzWzBdO1xuICAgICAgICAgICAgICAgICAgIHZhciBwYXJzZWRUZW1wbGF0ZSA9IHRoaXMuX3RlbXBsYXRlUGFyc2VyLnBhcnNlKFxuICAgICAgICAgICAgICAgICAgICAgICBjb21wTWV0YS50ZW1wbGF0ZS50ZW1wbGF0ZSwgbm9ybWFsaXplZFZpZXdEaXJNZXRhcywgdW5pcVZpZXdQaXBlcyxcbiAgICAgICAgICAgICAgICAgICAgICAgY29tcE1ldGEudHlwZS5uYW1lKTtcblxuICAgICAgICAgICAgICAgICAgIHZhciBjaGlsZFByb21pc2VzID0gW107XG4gICAgICAgICAgICAgICAgICAgdmFyIHVzZWREaXJlY3RpdmVzID0gRGlyZWN0aXZlQ29sbGVjdG9yLmZpbmRVc2VkRGlyZWN0aXZlcyhwYXJzZWRUZW1wbGF0ZSk7XG4gICAgICAgICAgICAgICAgICAgdXNlZERpcmVjdGl2ZXMuY29tcG9uZW50cy5mb3JFYWNoKFxuICAgICAgICAgICAgICAgICAgICAgICBjb21wb25lbnQgPT4gdGhpcy5fY29tcGlsZU5lc3RlZENvbXBvbmVudFJ1bnRpbWUoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBjb21wb25lbnQsIGNvbXBpbGluZ0NvbXBvbmVudHNQYXRoLCBjaGlsZFByb21pc2VzKSk7XG4gICAgICAgICAgICAgICAgICAgcmV0dXJuIFByb21pc2VXcmFwcGVyLmFsbChjaGlsZFByb21pc2VzKVxuICAgICAgICAgICAgICAgICAgICAgICAudGhlbigoXykgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBmaWx0ZXJlZFBpcGVzID0gZmlsdGVyUGlwZXMocGFyc2VkVGVtcGxhdGUsIHVuaXFWaWV3UGlwZXMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBpbGVkVGVtcGxhdGUuaW5pdCh0aGlzLl9jcmVhdGVWaWV3RmFjdG9yeVJ1bnRpbWUoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBNZXRhLCBwYXJzZWRUZW1wbGF0ZSwgdXNlZERpcmVjdGl2ZXMuZGlyZWN0aXZlcywgc3R5bGVzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWx0ZXJlZFBpcGVzKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNvbXBpbGVkVGVtcGxhdGU7XG4gICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICB9KTtcbiAgICAgIHRoaXMuX2NvbXBpbGVkVGVtcGxhdGVEb25lLnNldChjYWNoZUtleSwgZG9uZSk7XG4gICAgfVxuICAgIHJldHVybiBjb21waWxlZFRlbXBsYXRlO1xuICB9XG5cbiAgcHJpdmF0ZSBfY29tcGlsZU5lc3RlZENvbXBvbmVudFJ1bnRpbWUoY2hpbGRDb21wb25lbnREaXI6IENvbXBpbGVEaXJlY3RpdmVNZXRhZGF0YSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFyZW50Q29tcGlsaW5nQ29tcG9uZW50c1BhdGg6IGFueVtdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGlsZFByb21pc2VzOiBQcm9taXNlPGFueT5bXSkge1xuICAgIHZhciBjb21waWxpbmdDb21wb25lbnRzUGF0aCA9IExpc3RXcmFwcGVyLmNsb25lKHBhcmVudENvbXBpbGluZ0NvbXBvbmVudHNQYXRoKTtcblxuICAgIHZhciBjaGlsZENhY2hlS2V5ID0gY2hpbGRDb21wb25lbnREaXIudHlwZS5ydW50aW1lO1xuICAgIHZhciBjaGlsZFZpZXdEaXJlY3RpdmVzOiBDb21waWxlRGlyZWN0aXZlTWV0YWRhdGFbXSA9XG4gICAgICAgIHRoaXMuX3J1bnRpbWVNZXRhZGF0YVJlc29sdmVyLmdldFZpZXdEaXJlY3RpdmVzTWV0YWRhdGEoY2hpbGRDb21wb25lbnREaXIudHlwZS5ydW50aW1lKTtcbiAgICB2YXIgY2hpbGRWaWV3UGlwZXM6IENvbXBpbGVQaXBlTWV0YWRhdGFbXSA9XG4gICAgICAgIHRoaXMuX3J1bnRpbWVNZXRhZGF0YVJlc29sdmVyLmdldFZpZXdQaXBlc01ldGFkYXRhKGNoaWxkQ29tcG9uZW50RGlyLnR5cGUucnVudGltZSk7XG4gICAgdmFyIGNoaWxkSXNSZWN1cnNpdmUgPSBMaXN0V3JhcHBlci5jb250YWlucyhjb21waWxpbmdDb21wb25lbnRzUGF0aCwgY2hpbGRDYWNoZUtleSk7XG4gICAgY29tcGlsaW5nQ29tcG9uZW50c1BhdGgucHVzaChjaGlsZENhY2hlS2V5KTtcbiAgICB0aGlzLl9jb21waWxlQ29tcG9uZW50UnVudGltZShjaGlsZENhY2hlS2V5LCBjaGlsZENvbXBvbmVudERpciwgY2hpbGRWaWV3RGlyZWN0aXZlcyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGlsZFZpZXdQaXBlcywgY29tcGlsaW5nQ29tcG9uZW50c1BhdGgpO1xuICAgIGlmICghY2hpbGRJc1JlY3Vyc2l2ZSkge1xuICAgICAgLy8gT25seSB3YWl0IGZvciBhIGNoaWxkIGlmIGl0IGlzIG5vdCBhIGN5Y2xlXG4gICAgICBjaGlsZFByb21pc2VzLnB1c2godGhpcy5fY29tcGlsZWRUZW1wbGF0ZURvbmUuZ2V0KGNoaWxkQ2FjaGVLZXkpKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF9jcmVhdGVWaWV3RmFjdG9yeVJ1bnRpbWUoY29tcE1ldGE6IENvbXBpbGVEaXJlY3RpdmVNZXRhZGF0YSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcnNlZFRlbXBsYXRlOiBUZW1wbGF0ZUFzdFtdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGlyZWN0aXZlczogQ29tcGlsZURpcmVjdGl2ZU1ldGFkYXRhW10sIHN0eWxlczogc3RyaW5nW10sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwaXBlczogQ29tcGlsZVBpcGVNZXRhZGF0YVtdKTogRnVuY3Rpb24ge1xuICAgIGlmIChJU19EQVJUIHx8ICF0aGlzLl9nZW5Db25maWcudXNlSml0KSB7XG4gICAgICB2YXIgY2hhbmdlRGV0ZWN0b3JGYWN0b3JpZXMgPSB0aGlzLl9jZENvbXBpbGVyLmNvbXBpbGVDb21wb25lbnRSdW50aW1lKFxuICAgICAgICAgIGNvbXBNZXRhLnR5cGUsIGNvbXBNZXRhLmNoYW5nZURldGVjdGlvbiwgcGFyc2VkVGVtcGxhdGUpO1xuICAgICAgdmFyIHByb3RvVmlld3MgPSB0aGlzLl9wcm90b1ZpZXdDb21waWxlci5jb21waWxlUHJvdG9WaWV3UnVudGltZShcbiAgICAgICAgICB0aGlzLl9yZXNvbHZlZE1ldGFkYXRhQ2FjaGUsIGNvbXBNZXRhLCBwYXJzZWRUZW1wbGF0ZSwgcGlwZXMpO1xuICAgICAgcmV0dXJuIHRoaXMuX3ZpZXdDb21waWxlci5jb21waWxlQ29tcG9uZW50UnVudGltZShcbiAgICAgICAgICBjb21wTWV0YSwgcGFyc2VkVGVtcGxhdGUsIHN0eWxlcywgcHJvdG9WaWV3cy5wcm90b1ZpZXdzLCBjaGFuZ2VEZXRlY3RvckZhY3RvcmllcyxcbiAgICAgICAgICAoY29tcE1ldGEpID0+IHRoaXMuX2dldE5lc3RlZENvbXBvbmVudFZpZXdGYWN0b3J5KGNvbXBNZXRhKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBkZWNsYXJhdGlvbnMgPSBbXTtcbiAgICAgIHZhciB2aWV3RmFjdG9yeUV4cHIgPSB0aGlzLl9jcmVhdGVWaWV3RmFjdG9yeUNvZGVHZW4oJ3Jlc29sdmVkTWV0YWRhdGFDYWNoZScsIGNvbXBNZXRhLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXcgU291cmNlRXhwcmVzc2lvbihbXSwgJ3N0eWxlcycpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJzZWRUZW1wbGF0ZSwgcGlwZXMsIGRlY2xhcmF0aW9ucyk7XG4gICAgICB2YXIgdmFyczoge1trZXk6IHN0cmluZ106IGFueX0gPVxuICAgICAgICAgIHsnZXhwb3J0cyc6IHt9LCAnc3R5bGVzJzogc3R5bGVzLCAncmVzb2x2ZWRNZXRhZGF0YUNhY2hlJzogdGhpcy5fcmVzb2x2ZWRNZXRhZGF0YUNhY2hlfTtcbiAgICAgIGRpcmVjdGl2ZXMuZm9yRWFjaChkaXJNZXRhID0+IHtcbiAgICAgICAgdmFyc1tkaXJNZXRhLnR5cGUubmFtZV0gPSBkaXJNZXRhLnR5cGUucnVudGltZTtcbiAgICAgICAgaWYgKGRpck1ldGEuaXNDb21wb25lbnQgJiYgZGlyTWV0YS50eXBlLnJ1bnRpbWUgIT09IGNvbXBNZXRhLnR5cGUucnVudGltZSkge1xuICAgICAgICAgIHZhcnNbYHZpZXdGYWN0b3J5XyR7ZGlyTWV0YS50eXBlLm5hbWV9MGBdID0gdGhpcy5fZ2V0TmVzdGVkQ29tcG9uZW50Vmlld0ZhY3RvcnkoZGlyTWV0YSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcGlwZXMuZm9yRWFjaChwaXBlTWV0YSA9PiB2YXJzW3BpcGVNZXRhLnR5cGUubmFtZV0gPSBwaXBlTWV0YS50eXBlLnJ1bnRpbWUpO1xuICAgICAgdmFyIGRlY2xhcmF0aW9uc1dpdGhvdXRJbXBvcnRzID1cbiAgICAgICAgICBTb3VyY2VNb2R1bGUuZ2V0U291cmNlV2l0aG91dEltcG9ydHMoZGVjbGFyYXRpb25zLmpvaW4oJ1xcbicpKTtcbiAgICAgIHJldHVybiBldmFsRXhwcmVzc2lvbihcbiAgICAgICAgICBgdmlld0ZhY3RvcnlfJHtjb21wTWV0YS50eXBlLm5hbWV9YCwgdmlld0ZhY3RvcnlFeHByLCBkZWNsYXJhdGlvbnNXaXRob3V0SW1wb3J0cyxcbiAgICAgICAgICBtZXJnZVN0cmluZ01hcHMoXG4gICAgICAgICAgICAgIFt2YXJzLCBDSEFOR0VfREVURUNUSU9OX0pJVF9JTVBPUlRTLCBQUk9UT19WSUVXX0pJVF9JTVBPUlRTLCBWSUVXX0pJVF9JTVBPUlRTXSkpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX2dldE5lc3RlZENvbXBvbmVudFZpZXdGYWN0b3J5KGNvbXBNZXRhOiBDb21waWxlRGlyZWN0aXZlTWV0YWRhdGEpOiBGdW5jdGlvbiB7XG4gICAgcmV0dXJuIHRoaXMuX2NvbXBpbGVkVGVtcGxhdGVDYWNoZS5nZXQoY29tcE1ldGEudHlwZS5ydW50aW1lKS52aWV3RmFjdG9yeTtcbiAgfVxuXG4gIHByaXZhdGUgX2NvbXBpbGVDb21wb25lbnRDb2RlR2VuKGNvbXBNZXRhOiBDb21waWxlRGlyZWN0aXZlTWV0YWRhdGEsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpcmVjdGl2ZXM6IENvbXBpbGVEaXJlY3RpdmVNZXRhZGF0YVtdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwaXBlczogQ29tcGlsZVBpcGVNZXRhZGF0YVtdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXREZWNsYXJhdGlvbnM6IHN0cmluZ1tdKTogc3RyaW5nIHtcbiAgICBsZXQgdW5pcXVlRGlyZWN0aXZlcyA9IDxDb21waWxlRGlyZWN0aXZlTWV0YWRhdGFbXT5yZW1vdmVEdXBsaWNhdGVzKGRpcmVjdGl2ZXMpO1xuICAgIGxldCB1bmlxUGlwZXMgPSA8Q29tcGlsZVBpcGVNZXRhZGF0YVtdPnJlbW92ZUR1cGxpY2F0ZXMocGlwZXMpO1xuICAgIHZhciBzdHlsZUV4cHIgPSB0aGlzLl9zdHlsZUNvbXBpbGVyLmNvbXBpbGVDb21wb25lbnRDb2RlR2VuKGNvbXBNZXRhLnRlbXBsYXRlKTtcbiAgICB2YXIgcGFyc2VkVGVtcGxhdGUgPSB0aGlzLl90ZW1wbGF0ZVBhcnNlci5wYXJzZShjb21wTWV0YS50ZW1wbGF0ZS50ZW1wbGF0ZSwgdW5pcXVlRGlyZWN0aXZlcyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1bmlxUGlwZXMsIGNvbXBNZXRhLnR5cGUubmFtZSk7XG4gICAgdmFyIGZpbHRlcmVkUGlwZXMgPSBmaWx0ZXJQaXBlcyhwYXJzZWRUZW1wbGF0ZSwgdW5pcVBpcGVzKTtcbiAgICByZXR1cm4gdGhpcy5fY3JlYXRlVmlld0ZhY3RvcnlDb2RlR2VuKFxuICAgICAgICBgJHtNRVRBREFUQV9DQUNIRV9NT0RVTEVfUkVGfUNPREVHRU5fUkVTT0xWRURfTUVUQURBVEFfQ0FDSEVgLCBjb21wTWV0YSwgc3R5bGVFeHByLFxuICAgICAgICBwYXJzZWRUZW1wbGF0ZSwgZmlsdGVyZWRQaXBlcywgdGFyZ2V0RGVjbGFyYXRpb25zKTtcbiAgfVxuXG4gIHByaXZhdGUgX2NyZWF0ZVZpZXdGYWN0b3J5Q29kZUdlbihyZXNvbHZlZE1ldGFkYXRhQ2FjaGVFeHByOiBzdHJpbmcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21wTWV0YTogQ29tcGlsZURpcmVjdGl2ZU1ldGFkYXRhLCBzdHlsZUV4cHI6IFNvdXJjZUV4cHJlc3Npb24sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJzZWRUZW1wbGF0ZTogVGVtcGxhdGVBc3RbXSwgcGlwZXM6IENvbXBpbGVQaXBlTWV0YWRhdGFbXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldERlY2xhcmF0aW9uczogc3RyaW5nW10pOiBzdHJpbmcge1xuICAgIHZhciBjaGFuZ2VEZXRlY3RvcnNFeHBycyA9IHRoaXMuX2NkQ29tcGlsZXIuY29tcGlsZUNvbXBvbmVudENvZGVHZW4oXG4gICAgICAgIGNvbXBNZXRhLnR5cGUsIGNvbXBNZXRhLmNoYW5nZURldGVjdGlvbiwgcGFyc2VkVGVtcGxhdGUpO1xuICAgIHZhciBwcm90b1ZpZXdFeHBycyA9IHRoaXMuX3Byb3RvVmlld0NvbXBpbGVyLmNvbXBpbGVQcm90b1ZpZXdDb2RlR2VuKFxuICAgICAgICBuZXcgRXhwcmVzc2lvbihyZXNvbHZlZE1ldGFkYXRhQ2FjaGVFeHByKSwgY29tcE1ldGEsIHBhcnNlZFRlbXBsYXRlLCBwaXBlcyk7XG4gICAgdmFyIHZpZXdGYWN0b3J5RXhwciA9IHRoaXMuX3ZpZXdDb21waWxlci5jb21waWxlQ29tcG9uZW50Q29kZUdlbihcbiAgICAgICAgY29tcE1ldGEsIHBhcnNlZFRlbXBsYXRlLCBzdHlsZUV4cHIsIHByb3RvVmlld0V4cHJzLnByb3RvVmlld3MsIGNoYW5nZURldGVjdG9yc0V4cHJzLFxuICAgICAgICBjb2RlR2VuQ29tcG9uZW50Vmlld0ZhY3RvcnlOYW1lKTtcblxuICAgIGFkZEFsbChjaGFuZ2VEZXRlY3RvcnNFeHBycy5kZWNsYXJhdGlvbnMsIHRhcmdldERlY2xhcmF0aW9ucyk7XG4gICAgYWRkQWxsKHByb3RvVmlld0V4cHJzLmRlY2xhcmF0aW9ucywgdGFyZ2V0RGVjbGFyYXRpb25zKTtcbiAgICBhZGRBbGwodmlld0ZhY3RvcnlFeHByLmRlY2xhcmF0aW9ucywgdGFyZ2V0RGVjbGFyYXRpb25zKTtcblxuICAgIHJldHVybiB2aWV3RmFjdG9yeUV4cHIuZXhwcmVzc2lvbjtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgTm9ybWFsaXplZENvbXBvbmVudFdpdGhWaWV3RGlyZWN0aXZlcyB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBjb21wb25lbnQ6IENvbXBpbGVEaXJlY3RpdmVNZXRhZGF0YSxcbiAgICAgICAgICAgICAgcHVibGljIGRpcmVjdGl2ZXM6IENvbXBpbGVEaXJlY3RpdmVNZXRhZGF0YVtdLCBwdWJsaWMgcGlwZXM6IENvbXBpbGVQaXBlTWV0YWRhdGFbXSkge31cbn1cblxuY2xhc3MgQ29tcGlsZWRUZW1wbGF0ZSB7XG4gIHZpZXdGYWN0b3J5OiBGdW5jdGlvbiA9IG51bGw7XG4gIGluaXQodmlld0ZhY3Rvcnk6IEZ1bmN0aW9uKSB7IHRoaXMudmlld0ZhY3RvcnkgPSB2aWV3RmFjdG9yeTsgfVxufVxuXG5mdW5jdGlvbiBhc3NlcnRDb21wb25lbnQobWV0YTogQ29tcGlsZURpcmVjdGl2ZU1ldGFkYXRhKSB7XG4gIGlmICghbWV0YS5pc0NvbXBvbmVudCkge1xuICAgIHRocm93IG5ldyBCYXNlRXhjZXB0aW9uKGBDb3VsZCBub3QgY29tcGlsZSAnJHttZXRhLnR5cGUubmFtZX0nIGJlY2F1c2UgaXQgaXMgbm90IGEgY29tcG9uZW50LmApO1xuICB9XG59XG5cbmZ1bmN0aW9uIHRlbXBsYXRlTW9kdWxlVXJsKG1vZHVsZVVybDogc3RyaW5nKTogc3RyaW5nIHtcbiAgdmFyIHVybFdpdGhvdXRTdWZmaXggPSBtb2R1bGVVcmwuc3Vic3RyaW5nKDAsIG1vZHVsZVVybC5sZW5ndGggLSBNT0RVTEVfU1VGRklYLmxlbmd0aCk7XG4gIHJldHVybiBgJHt1cmxXaXRob3V0U3VmZml4fS50ZW1wbGF0ZSR7TU9EVUxFX1NVRkZJWH1gO1xufVxuXG5cbmZ1bmN0aW9uIGNvZGVHZW5Ib3N0Vmlld0ZhY3RvcnlOYW1lKHR5cGU6IENvbXBpbGVUeXBlTWV0YWRhdGEpOiBzdHJpbmcge1xuICByZXR1cm4gYGhvc3RWaWV3RmFjdG9yeV8ke3R5cGUubmFtZX1gO1xufVxuXG5mdW5jdGlvbiBjb2RlR2VuQ29tcG9uZW50Vmlld0ZhY3RvcnlOYW1lKG5lc3RlZENvbXBUeXBlOiBDb21waWxlRGlyZWN0aXZlTWV0YWRhdGEpOiBzdHJpbmcge1xuICByZXR1cm4gYCR7bW9kdWxlUmVmKHRlbXBsYXRlTW9kdWxlVXJsKG5lc3RlZENvbXBUeXBlLnR5cGUubW9kdWxlVXJsKSl9dmlld0ZhY3RvcnlfJHtuZXN0ZWRDb21wVHlwZS50eXBlLm5hbWV9MGA7XG59XG5cbmZ1bmN0aW9uIG1lcmdlU3RyaW5nTWFwcyhtYXBzOiBBcnJheTx7W2tleTogc3RyaW5nXTogYW55fT4pOiB7W2tleTogc3RyaW5nXTogYW55fSB7XG4gIHZhciByZXN1bHQgPSB7fTtcbiAgbWFwcy5mb3JFYWNoKFxuICAgICAgKG1hcCkgPT4geyBTdHJpbmdNYXBXcmFwcGVyLmZvckVhY2gobWFwLCAodmFsdWUsIGtleSkgPT4geyByZXN1bHRba2V5XSA9IHZhbHVlOyB9KTsgfSk7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbmZ1bmN0aW9uIHJlbW92ZUR1cGxpY2F0ZXMoaXRlbXM6IENvbXBpbGVNZXRhZGF0YVdpdGhUeXBlW10pOiBDb21waWxlTWV0YWRhdGFXaXRoVHlwZVtdIHtcbiAgbGV0IHJlcyA9IFtdO1xuICBpdGVtcy5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgIGxldCBoYXNNYXRjaCA9XG4gICAgICAgIHJlcy5maWx0ZXIociA9PiByLnR5cGUubmFtZSA9PSBpdGVtLnR5cGUubmFtZSAmJiByLnR5cGUubW9kdWxlVXJsID09IGl0ZW0udHlwZS5tb2R1bGVVcmwgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgIHIudHlwZS5ydW50aW1lID09IGl0ZW0udHlwZS5ydW50aW1lKVxuICAgICAgICAgICAgLmxlbmd0aCA+IDA7XG4gICAgaWYgKCFoYXNNYXRjaCkge1xuICAgICAgcmVzLnB1c2goaXRlbSk7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIHJlcztcbn1cblxuY2xhc3MgRGlyZWN0aXZlQ29sbGVjdG9yIGltcGxlbWVudHMgVGVtcGxhdGVBc3RWaXNpdG9yIHtcbiAgc3RhdGljIGZpbmRVc2VkRGlyZWN0aXZlcyhwYXJzZWRUZW1wbGF0ZTogVGVtcGxhdGVBc3RbXSk6IERpcmVjdGl2ZUNvbGxlY3RvciB7XG4gICAgdmFyIGNvbGxlY3RvciA9IG5ldyBEaXJlY3RpdmVDb2xsZWN0b3IoKTtcbiAgICB0ZW1wbGF0ZVZpc2l0QWxsKGNvbGxlY3RvciwgcGFyc2VkVGVtcGxhdGUpO1xuICAgIHJldHVybiBjb2xsZWN0b3I7XG4gIH1cblxuICBkaXJlY3RpdmVzOiBDb21waWxlRGlyZWN0aXZlTWV0YWRhdGFbXSA9IFtdO1xuICBjb21wb25lbnRzOiBDb21waWxlRGlyZWN0aXZlTWV0YWRhdGFbXSA9IFtdO1xuXG4gIHZpc2l0Qm91bmRUZXh0KGFzdDogQm91bmRUZXh0QXN0LCBjb250ZXh0OiBhbnkpOiBhbnkgeyByZXR1cm4gbnVsbDsgfVxuICB2aXNpdFRleHQoYXN0OiBUZXh0QXN0LCBjb250ZXh0OiBhbnkpOiBhbnkgeyByZXR1cm4gbnVsbDsgfVxuXG4gIHZpc2l0TmdDb250ZW50KGFzdDogTmdDb250ZW50QXN0LCBjb250ZXh0OiBhbnkpOiBhbnkgeyByZXR1cm4gbnVsbDsgfVxuXG4gIHZpc2l0RWxlbWVudChhc3Q6IEVsZW1lbnRBc3QsIGNvbnRleHQ6IGFueSk6IGFueSB7XG4gICAgdGVtcGxhdGVWaXNpdEFsbCh0aGlzLCBhc3QuZGlyZWN0aXZlcyk7XG4gICAgdGVtcGxhdGVWaXNpdEFsbCh0aGlzLCBhc3QuY2hpbGRyZW4pO1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgdmlzaXRFbWJlZGRlZFRlbXBsYXRlKGFzdDogRW1iZWRkZWRUZW1wbGF0ZUFzdCwgY29udGV4dDogYW55KTogYW55IHtcbiAgICB0ZW1wbGF0ZVZpc2l0QWxsKHRoaXMsIGFzdC5kaXJlY3RpdmVzKTtcbiAgICB0ZW1wbGF0ZVZpc2l0QWxsKHRoaXMsIGFzdC5jaGlsZHJlbik7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgdmlzaXRWYXJpYWJsZShhc3Q6IFZhcmlhYmxlQXN0LCBjdHg6IGFueSk6IGFueSB7IHJldHVybiBudWxsOyB9XG4gIHZpc2l0QXR0cihhc3Q6IEF0dHJBc3QsIGF0dHJOYW1lQW5kVmFsdWVzOiB7W2tleTogc3RyaW5nXTogc3RyaW5nfSk6IGFueSB7IHJldHVybiBudWxsOyB9XG4gIHZpc2l0RGlyZWN0aXZlKGFzdDogRGlyZWN0aXZlQXN0LCBjdHg6IGFueSk6IGFueSB7XG4gICAgaWYgKGFzdC5kaXJlY3RpdmUuaXNDb21wb25lbnQpIHtcbiAgICAgIHRoaXMuY29tcG9uZW50cy5wdXNoKGFzdC5kaXJlY3RpdmUpO1xuICAgIH1cbiAgICB0aGlzLmRpcmVjdGl2ZXMucHVzaChhc3QuZGlyZWN0aXZlKTtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICB2aXNpdEV2ZW50KGFzdDogQm91bmRFdmVudEFzdCwgZXZlbnRUYXJnZXRBbmROYW1lczogTWFwPHN0cmluZywgQm91bmRFdmVudEFzdD4pOiBhbnkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG4gIHZpc2l0RGlyZWN0aXZlUHJvcGVydHkoYXN0OiBCb3VuZERpcmVjdGl2ZVByb3BlcnR5QXN0LCBjb250ZXh0OiBhbnkpOiBhbnkgeyByZXR1cm4gbnVsbDsgfVxuICB2aXNpdEVsZW1lbnRQcm9wZXJ0eShhc3Q6IEJvdW5kRWxlbWVudFByb3BlcnR5QXN0LCBjb250ZXh0OiBhbnkpOiBhbnkgeyByZXR1cm4gbnVsbDsgfVxufVxuXG5cbmZ1bmN0aW9uIGZpbHRlclBpcGVzKHRlbXBsYXRlOiBUZW1wbGF0ZUFzdFtdLFxuICAgICAgICAgICAgICAgICAgICAgYWxsUGlwZXM6IENvbXBpbGVQaXBlTWV0YWRhdGFbXSk6IENvbXBpbGVQaXBlTWV0YWRhdGFbXSB7XG4gIHZhciB2aXNpdG9yID0gbmV3IFBpcGVWaXNpdG9yKCk7XG4gIHRlbXBsYXRlVmlzaXRBbGwodmlzaXRvciwgdGVtcGxhdGUpO1xuICByZXR1cm4gYWxsUGlwZXMuZmlsdGVyKChwaXBlTWV0YSkgPT4gU2V0V3JhcHBlci5oYXModmlzaXRvci5jb2xsZWN0b3IucGlwZXMsIHBpcGVNZXRhLm5hbWUpKTtcbn1cblxuY2xhc3MgUGlwZVZpc2l0b3IgaW1wbGVtZW50cyBUZW1wbGF0ZUFzdFZpc2l0b3Ige1xuICBjb2xsZWN0b3I6IFBpcGVDb2xsZWN0b3IgPSBuZXcgUGlwZUNvbGxlY3RvcigpO1xuXG4gIHZpc2l0Qm91bmRUZXh0KGFzdDogQm91bmRUZXh0QXN0LCBjb250ZXh0OiBhbnkpOiBhbnkge1xuICAgIGFzdC52YWx1ZS52aXNpdCh0aGlzLmNvbGxlY3Rvcik7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgdmlzaXRUZXh0KGFzdDogVGV4dEFzdCwgY29udGV4dDogYW55KTogYW55IHsgcmV0dXJuIG51bGw7IH1cblxuICB2aXNpdE5nQ29udGVudChhc3Q6IE5nQ29udGVudEFzdCwgY29udGV4dDogYW55KTogYW55IHsgcmV0dXJuIG51bGw7IH1cblxuICB2aXNpdEVsZW1lbnQoYXN0OiBFbGVtZW50QXN0LCBjb250ZXh0OiBhbnkpOiBhbnkge1xuICAgIHRlbXBsYXRlVmlzaXRBbGwodGhpcywgYXN0LmlucHV0cyk7XG4gICAgdGVtcGxhdGVWaXNpdEFsbCh0aGlzLCBhc3Qub3V0cHV0cyk7XG4gICAgdGVtcGxhdGVWaXNpdEFsbCh0aGlzLCBhc3QuZGlyZWN0aXZlcyk7XG4gICAgdGVtcGxhdGVWaXNpdEFsbCh0aGlzLCBhc3QuY2hpbGRyZW4pO1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgdmlzaXRFbWJlZGRlZFRlbXBsYXRlKGFzdDogRW1iZWRkZWRUZW1wbGF0ZUFzdCwgY29udGV4dDogYW55KTogYW55IHtcbiAgICB0ZW1wbGF0ZVZpc2l0QWxsKHRoaXMsIGFzdC5vdXRwdXRzKTtcbiAgICB0ZW1wbGF0ZVZpc2l0QWxsKHRoaXMsIGFzdC5kaXJlY3RpdmVzKTtcbiAgICB0ZW1wbGF0ZVZpc2l0QWxsKHRoaXMsIGFzdC5jaGlsZHJlbik7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgdmlzaXRWYXJpYWJsZShhc3Q6IFZhcmlhYmxlQXN0LCBjdHg6IGFueSk6IGFueSB7IHJldHVybiBudWxsOyB9XG4gIHZpc2l0QXR0cihhc3Q6IEF0dHJBc3QsIGF0dHJOYW1lQW5kVmFsdWVzOiB7W2tleTogc3RyaW5nXTogc3RyaW5nfSk6IGFueSB7IHJldHVybiBudWxsOyB9XG4gIHZpc2l0RGlyZWN0aXZlKGFzdDogRGlyZWN0aXZlQXN0LCBjdHg6IGFueSk6IGFueSB7XG4gICAgdGVtcGxhdGVWaXNpdEFsbCh0aGlzLCBhc3QuaW5wdXRzKTtcbiAgICB0ZW1wbGF0ZVZpc2l0QWxsKHRoaXMsIGFzdC5ob3N0RXZlbnRzKTtcbiAgICB0ZW1wbGF0ZVZpc2l0QWxsKHRoaXMsIGFzdC5ob3N0UHJvcGVydGllcyk7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgdmlzaXRFdmVudChhc3Q6IEJvdW5kRXZlbnRBc3QsIGV2ZW50VGFyZ2V0QW5kTmFtZXM6IE1hcDxzdHJpbmcsIEJvdW5kRXZlbnRBc3Q+KTogYW55IHtcbiAgICBhc3QuaGFuZGxlci52aXNpdCh0aGlzLmNvbGxlY3Rvcik7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgdmlzaXREaXJlY3RpdmVQcm9wZXJ0eShhc3Q6IEJvdW5kRGlyZWN0aXZlUHJvcGVydHlBc3QsIGNvbnRleHQ6IGFueSk6IGFueSB7XG4gICAgYXN0LnZhbHVlLnZpc2l0KHRoaXMuY29sbGVjdG9yKTtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICB2aXNpdEVsZW1lbnRQcm9wZXJ0eShhc3Q6IEJvdW5kRWxlbWVudFByb3BlcnR5QXN0LCBjb250ZXh0OiBhbnkpOiBhbnkge1xuICAgIGFzdC52YWx1ZS52aXNpdCh0aGlzLmNvbGxlY3Rvcik7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbn1cbiJdfQ==