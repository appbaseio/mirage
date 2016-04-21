'use strict';"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
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
var collection_1 = require('angular2/src/facade/collection');
var template_ast_1 = require('./template_ast');
var source_module_1 = require('./source_module');
var view_1 = require('angular2/src/core/linker/view');
var view_type_1 = require('angular2/src/core/linker/view_type');
var element_1 = require('angular2/src/core/linker/element');
var util_1 = require('./util');
var di_1 = require('angular2/src/core/di');
exports.PROTO_VIEW_JIT_IMPORTS = lang_1.CONST_EXPR({ 'AppProtoView': view_1.AppProtoView, 'AppProtoElement': element_1.AppProtoElement, 'ViewType': view_type_1.ViewType });
// TODO: have a single file that reexports everything needed for
// codegen explicitly
// - helps understanding what codegen works against
// - less imports in codegen code
exports.APP_VIEW_MODULE_REF = source_module_1.moduleRef('package:angular2/src/core/linker/view' + util_1.MODULE_SUFFIX);
exports.VIEW_TYPE_MODULE_REF = source_module_1.moduleRef('package:angular2/src/core/linker/view_type' + util_1.MODULE_SUFFIX);
exports.APP_EL_MODULE_REF = source_module_1.moduleRef('package:angular2/src/core/linker/element' + util_1.MODULE_SUFFIX);
exports.METADATA_MODULE_REF = source_module_1.moduleRef('package:angular2/src/core/metadata/view' + util_1.MODULE_SUFFIX);
var IMPLICIT_TEMPLATE_VAR = '\$implicit';
var CLASS_ATTR = 'class';
var STYLE_ATTR = 'style';
var ProtoViewCompiler = (function () {
    function ProtoViewCompiler() {
    }
    ProtoViewCompiler.prototype.compileProtoViewRuntime = function (metadataCache, component, template, pipes) {
        var protoViewFactory = new RuntimeProtoViewFactory(metadataCache, component, pipes);
        var allProtoViews = [];
        protoViewFactory.createCompileProtoView(template, [], [], allProtoViews);
        return new CompileProtoViews([], allProtoViews);
    };
    ProtoViewCompiler.prototype.compileProtoViewCodeGen = function (resolvedMetadataCacheExpr, component, template, pipes) {
        var protoViewFactory = new CodeGenProtoViewFactory(resolvedMetadataCacheExpr, component, pipes);
        var allProtoViews = [];
        var allStatements = [];
        protoViewFactory.createCompileProtoView(template, [], allStatements, allProtoViews);
        return new CompileProtoViews(allStatements.map(function (stmt) { return stmt.statement; }), allProtoViews);
    };
    ProtoViewCompiler = __decorate([
        di_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], ProtoViewCompiler);
    return ProtoViewCompiler;
}());
exports.ProtoViewCompiler = ProtoViewCompiler;
var CompileProtoViews = (function () {
    function CompileProtoViews(declarations, protoViews) {
        this.declarations = declarations;
        this.protoViews = protoViews;
    }
    return CompileProtoViews;
}());
exports.CompileProtoViews = CompileProtoViews;
var CompileProtoView = (function () {
    function CompileProtoView(embeddedTemplateIndex, protoElements, protoView) {
        this.embeddedTemplateIndex = embeddedTemplateIndex;
        this.protoElements = protoElements;
        this.protoView = protoView;
    }
    return CompileProtoView;
}());
exports.CompileProtoView = CompileProtoView;
var CompileProtoElement = (function () {
    function CompileProtoElement(boundElementIndex, attrNameAndValues, variableNameAndValues, renderEvents, directives, embeddedTemplateIndex, appProtoEl) {
        this.boundElementIndex = boundElementIndex;
        this.attrNameAndValues = attrNameAndValues;
        this.variableNameAndValues = variableNameAndValues;
        this.renderEvents = renderEvents;
        this.directives = directives;
        this.embeddedTemplateIndex = embeddedTemplateIndex;
        this.appProtoEl = appProtoEl;
    }
    return CompileProtoElement;
}());
exports.CompileProtoElement = CompileProtoElement;
function visitAndReturnContext(visitor, asts, context) {
    template_ast_1.templateVisitAll(visitor, asts, context);
    return context;
}
var ProtoViewFactory = (function () {
    function ProtoViewFactory(component) {
        this.component = component;
    }
    ProtoViewFactory.prototype.createCompileProtoView = function (template, templateVariableBindings, targetStatements, targetProtoViews) {
        var embeddedTemplateIndex = targetProtoViews.length;
        // Note: targetProtoViews needs to be in depth first order.
        // So we "reserve" a space here that we fill after the recursion is done
        targetProtoViews.push(null);
        var builder = new ProtoViewBuilderVisitor(this, targetStatements, targetProtoViews);
        template_ast_1.templateVisitAll(builder, template);
        var viewType = getViewType(this.component, embeddedTemplateIndex);
        var appProtoView = this.createAppProtoView(embeddedTemplateIndex, viewType, templateVariableBindings, targetStatements);
        var cpv = new CompileProtoView(embeddedTemplateIndex, builder.protoElements, appProtoView);
        targetProtoViews[embeddedTemplateIndex] = cpv;
        return cpv;
    };
    return ProtoViewFactory;
}());
var CodeGenProtoViewFactory = (function (_super) {
    __extends(CodeGenProtoViewFactory, _super);
    function CodeGenProtoViewFactory(resolvedMetadataCacheExpr, component, pipes) {
        _super.call(this, component);
        this.resolvedMetadataCacheExpr = resolvedMetadataCacheExpr;
        this.pipes = pipes;
        this._nextVarId = 0;
    }
    CodeGenProtoViewFactory.prototype._nextProtoViewVar = function (embeddedTemplateIndex) {
        return "appProtoView" + this._nextVarId++ + "_" + this.component.type.name + embeddedTemplateIndex;
    };
    CodeGenProtoViewFactory.prototype.createAppProtoView = function (embeddedTemplateIndex, viewType, templateVariableBindings, targetStatements) {
        var protoViewVarName = this._nextProtoViewVar(embeddedTemplateIndex);
        var viewTypeExpr = codeGenViewType(viewType);
        var pipesExpr = embeddedTemplateIndex === 0 ?
            codeGenTypesArray(this.pipes.map(function (pipeMeta) { return pipeMeta.type; })) :
            null;
        var statement = "var " + protoViewVarName + " = " + exports.APP_VIEW_MODULE_REF + "AppProtoView.create(" + this.resolvedMetadataCacheExpr.expression + ", " + viewTypeExpr + ", " + pipesExpr + ", " + util_1.codeGenStringMap(templateVariableBindings) + ");";
        targetStatements.push(new util_1.Statement(statement));
        return new util_1.Expression(protoViewVarName);
    };
    CodeGenProtoViewFactory.prototype.createAppProtoElement = function (boundElementIndex, attrNameAndValues, variableNameAndValues, directives, targetStatements) {
        var varName = "appProtoEl" + this._nextVarId++ + "_" + this.component.type.name;
        var value = exports.APP_EL_MODULE_REF + "AppProtoElement.create(\n        " + this.resolvedMetadataCacheExpr.expression + ",\n        " + boundElementIndex + ",\n        " + util_1.codeGenStringMap(attrNameAndValues) + ",\n        " + codeGenDirectivesArray(directives) + ",\n        " + util_1.codeGenStringMap(variableNameAndValues) + "\n      )";
        var statement = "var " + varName + " = " + value + ";";
        targetStatements.push(new util_1.Statement(statement));
        return new util_1.Expression(varName);
    };
    return CodeGenProtoViewFactory;
}(ProtoViewFactory));
var RuntimeProtoViewFactory = (function (_super) {
    __extends(RuntimeProtoViewFactory, _super);
    function RuntimeProtoViewFactory(metadataCache, component, pipes) {
        _super.call(this, component);
        this.metadataCache = metadataCache;
        this.pipes = pipes;
    }
    RuntimeProtoViewFactory.prototype.createAppProtoView = function (embeddedTemplateIndex, viewType, templateVariableBindings, targetStatements) {
        var pipes = embeddedTemplateIndex === 0 ? this.pipes.map(function (pipeMeta) { return pipeMeta.type.runtime; }) : [];
        var templateVars = keyValueArrayToStringMap(templateVariableBindings);
        return view_1.AppProtoView.create(this.metadataCache, viewType, pipes, templateVars);
    };
    RuntimeProtoViewFactory.prototype.createAppProtoElement = function (boundElementIndex, attrNameAndValues, variableNameAndValues, directives, targetStatements) {
        var attrs = keyValueArrayToStringMap(attrNameAndValues);
        return element_1.AppProtoElement.create(this.metadataCache, boundElementIndex, attrs, directives.map(function (dirMeta) { return dirMeta.type.runtime; }), keyValueArrayToStringMap(variableNameAndValues));
    };
    return RuntimeProtoViewFactory;
}(ProtoViewFactory));
var ProtoViewBuilderVisitor = (function () {
    function ProtoViewBuilderVisitor(factory, allStatements, allProtoViews) {
        this.factory = factory;
        this.allStatements = allStatements;
        this.allProtoViews = allProtoViews;
        this.protoElements = [];
        this.boundElementCount = 0;
    }
    ProtoViewBuilderVisitor.prototype._readAttrNameAndValues = function (directives, attrAsts) {
        var attrs = visitAndReturnContext(this, attrAsts, {});
        directives.forEach(function (directiveMeta) {
            collection_1.StringMapWrapper.forEach(directiveMeta.hostAttributes, function (value, name) {
                var prevValue = attrs[name];
                attrs[name] = lang_1.isPresent(prevValue) ? mergeAttributeValue(name, prevValue, value) : value;
            });
        });
        return mapToKeyValueArray(attrs);
    };
    ProtoViewBuilderVisitor.prototype.visitBoundText = function (ast, context) { return null; };
    ProtoViewBuilderVisitor.prototype.visitText = function (ast, context) { return null; };
    ProtoViewBuilderVisitor.prototype.visitNgContent = function (ast, context) { return null; };
    ProtoViewBuilderVisitor.prototype.visitElement = function (ast, context) {
        var _this = this;
        var boundElementIndex = null;
        if (ast.isBound()) {
            boundElementIndex = this.boundElementCount++;
        }
        var component = ast.getComponent();
        var variableNameAndValues = [];
        if (lang_1.isBlank(component)) {
            ast.exportAsVars.forEach(function (varAst) { variableNameAndValues.push([varAst.name, null]); });
        }
        var directives = [];
        var renderEvents = visitAndReturnContext(this, ast.outputs, new Map());
        collection_1.ListWrapper.forEachWithIndex(ast.directives, function (directiveAst, index) {
            directiveAst.visit(_this, new DirectiveContext(index, boundElementIndex, renderEvents, variableNameAndValues, directives));
        });
        var renderEventArray = [];
        renderEvents.forEach(function (eventAst, _) { return renderEventArray.push(eventAst); });
        var attrNameAndValues = this._readAttrNameAndValues(directives, ast.attrs);
        this._addProtoElement(ast.isBound(), boundElementIndex, attrNameAndValues, variableNameAndValues, renderEventArray, directives, null);
        template_ast_1.templateVisitAll(this, ast.children);
        return null;
    };
    ProtoViewBuilderVisitor.prototype.visitEmbeddedTemplate = function (ast, context) {
        var _this = this;
        var boundElementIndex = this.boundElementCount++;
        var directives = [];
        collection_1.ListWrapper.forEachWithIndex(ast.directives, function (directiveAst, index) {
            directiveAst.visit(_this, new DirectiveContext(index, boundElementIndex, new Map(), [], directives));
        });
        var attrNameAndValues = this._readAttrNameAndValues(directives, ast.attrs);
        var templateVariableBindings = ast.vars.map(function (varAst) { return [varAst.value.length > 0 ? varAst.value : IMPLICIT_TEMPLATE_VAR, varAst.name]; });
        var nestedProtoView = this.factory.createCompileProtoView(ast.children, templateVariableBindings, this.allStatements, this.allProtoViews);
        this._addProtoElement(true, boundElementIndex, attrNameAndValues, [], [], directives, nestedProtoView.embeddedTemplateIndex);
        return null;
    };
    ProtoViewBuilderVisitor.prototype._addProtoElement = function (isBound, boundElementIndex, attrNameAndValues, variableNameAndValues, renderEvents, directives, embeddedTemplateIndex) {
        var appProtoEl = null;
        if (isBound) {
            appProtoEl =
                this.factory.createAppProtoElement(boundElementIndex, attrNameAndValues, variableNameAndValues, directives, this.allStatements);
        }
        var compileProtoEl = new CompileProtoElement(boundElementIndex, attrNameAndValues, variableNameAndValues, renderEvents, directives, embeddedTemplateIndex, appProtoEl);
        this.protoElements.push(compileProtoEl);
    };
    ProtoViewBuilderVisitor.prototype.visitVariable = function (ast, ctx) { return null; };
    ProtoViewBuilderVisitor.prototype.visitAttr = function (ast, attrNameAndValues) {
        attrNameAndValues[ast.name] = ast.value;
        return null;
    };
    ProtoViewBuilderVisitor.prototype.visitDirective = function (ast, ctx) {
        ctx.targetDirectives.push(ast.directive);
        template_ast_1.templateVisitAll(this, ast.hostEvents, ctx.hostEventTargetAndNames);
        ast.exportAsVars.forEach(function (varAst) { ctx.targetVariableNameAndValues.push([varAst.name, ctx.index]); });
        return null;
    };
    ProtoViewBuilderVisitor.prototype.visitEvent = function (ast, eventTargetAndNames) {
        eventTargetAndNames.set(ast.fullName, ast);
        return null;
    };
    ProtoViewBuilderVisitor.prototype.visitDirectiveProperty = function (ast, context) { return null; };
    ProtoViewBuilderVisitor.prototype.visitElementProperty = function (ast, context) { return null; };
    return ProtoViewBuilderVisitor;
}());
function mapToKeyValueArray(data) {
    var entryArray = [];
    collection_1.StringMapWrapper.forEach(data, function (value, name) { entryArray.push([name, value]); });
    // We need to sort to get a defined output order
    // for tests and for caching generated artifacts...
    collection_1.ListWrapper.sort(entryArray, function (entry1, entry2) {
        return lang_1.StringWrapper.compare(entry1[0], entry2[0]);
    });
    var keyValueArray = [];
    entryArray.forEach(function (entry) { keyValueArray.push([entry[0], entry[1]]); });
    return keyValueArray;
}
function mergeAttributeValue(attrName, attrValue1, attrValue2) {
    if (attrName == CLASS_ATTR || attrName == STYLE_ATTR) {
        return attrValue1 + " " + attrValue2;
    }
    else {
        return attrValue2;
    }
}
var DirectiveContext = (function () {
    function DirectiveContext(index, boundElementIndex, hostEventTargetAndNames, targetVariableNameAndValues, targetDirectives) {
        this.index = index;
        this.boundElementIndex = boundElementIndex;
        this.hostEventTargetAndNames = hostEventTargetAndNames;
        this.targetVariableNameAndValues = targetVariableNameAndValues;
        this.targetDirectives = targetDirectives;
    }
    return DirectiveContext;
}());
function keyValueArrayToStringMap(keyValueArray) {
    var stringMap = {};
    for (var i = 0; i < keyValueArray.length; i++) {
        var entry = keyValueArray[i];
        stringMap[entry[0]] = entry[1];
    }
    return stringMap;
}
function codeGenDirectivesArray(directives) {
    var expressions = directives.map(function (directiveType) { return typeRef(directiveType.type); });
    return "[" + expressions.join(',') + "]";
}
function codeGenTypesArray(types) {
    var expressions = types.map(typeRef);
    return "[" + expressions.join(',') + "]";
}
function codeGenViewType(value) {
    if (lang_1.IS_DART) {
        return "" + exports.VIEW_TYPE_MODULE_REF + value;
    }
    else {
        return "" + value;
    }
}
function typeRef(type) {
    return "" + source_module_1.moduleRef(type.moduleUrl) + type.name;
}
function getViewType(component, embeddedTemplateIndex) {
    if (embeddedTemplateIndex > 0) {
        return view_type_1.ViewType.EMBEDDED;
    }
    else if (component.type.isHost) {
        return view_type_1.ViewType.HOST;
    }
    else {
        return view_type_1.ViewType.COMPONENT;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvdG9fdmlld19jb21waWxlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRpZmZpbmdfcGx1Z2luX3dyYXBwZXItb3V0cHV0X3BhdGgtamFrWG5NbUwudG1wL2FuZ3VsYXIyL3NyYy9jb21waWxlci9wcm90b192aWV3X2NvbXBpbGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHFCQVFPLDBCQUEwQixDQUFDLENBQUE7QUFDbEMsMkJBS08sZ0NBQWdDLENBQUMsQ0FBQTtBQUN4Qyw2QkFlTyxnQkFBZ0IsQ0FBQyxDQUFBO0FBTXhCLDhCQUE2RCxpQkFBaUIsQ0FBQyxDQUFBO0FBQy9FLHFCQUFvQywrQkFBK0IsQ0FBQyxDQUFBO0FBQ3BFLDBCQUF1QixvQ0FBb0MsQ0FBQyxDQUFBO0FBQzVELHdCQUEwQyxrQ0FBa0MsQ0FBQyxDQUFBO0FBRTdFLHFCQVNPLFFBQVEsQ0FBQyxDQUFBO0FBQ2hCLG1CQUF5QixzQkFBc0IsQ0FBQyxDQUFBO0FBRW5DLDhCQUFzQixHQUFHLGlCQUFVLENBQzVDLEVBQUMsY0FBYyxFQUFFLG1CQUFZLEVBQUUsaUJBQWlCLEVBQUUseUJBQWUsRUFBRSxVQUFVLEVBQUUsb0JBQVEsRUFBQyxDQUFDLENBQUM7QUFFOUYsZ0VBQWdFO0FBQ2hFLHFCQUFxQjtBQUNyQixtREFBbUQ7QUFDbkQsaUNBQWlDO0FBQ3RCLDJCQUFtQixHQUFHLHlCQUFTLENBQUMsdUNBQXVDLEdBQUcsb0JBQWEsQ0FBQyxDQUFDO0FBQ3pGLDRCQUFvQixHQUMzQix5QkFBUyxDQUFDLDRDQUE0QyxHQUFHLG9CQUFhLENBQUMsQ0FBQztBQUNqRSx5QkFBaUIsR0FDeEIseUJBQVMsQ0FBQywwQ0FBMEMsR0FBRyxvQkFBYSxDQUFDLENBQUM7QUFDL0QsMkJBQW1CLEdBQzFCLHlCQUFTLENBQUMseUNBQXlDLEdBQUcsb0JBQWEsQ0FBQyxDQUFDO0FBRXpFLElBQU0scUJBQXFCLEdBQUcsWUFBWSxDQUFDO0FBQzND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biAgaXNCbGFuayxcbiAgVHlwZSxcbiAgaXNTdHJpbmcsXG4gIFN0cmluZ1dyYXBwZXIsXG4gIElTX0RBUlQsXG4gIENPTlNUX0VYUFJcbn0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9sYW5nJztcbmltcG9ydCB7XG4gIFNldFdyYXBwZXIsXG4gIFN0cmluZ01hcFdyYXBwZXIsXG4gIExpc3RXcmFwcGVyLFxuICBNYXBXcmFwcGVyXG59IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvY29sbGVjdGlvbic7XG5pbXBvcnQge1xuICBUZW1wbGF0ZUFzdCxcbiAgVGVtcGxhdGVBc3RWaXNpdG9yLFxuICBOZ0NvbnRlbnRBc3QsXG4gIEVtYmVkZGVkVGVtcGxhdGVBc3QsXG4gIEVsZW1lbnRBc3QsXG4gIFZhcmlhYmxlQXN0LFxuICBCb3VuZEV2ZW50QXN0LFxuICBCb3VuZEVsZW1lbnRQcm9wZXJ0eUFzdCxcbiAgQXR0ckFzdCxcbiAgQm91bmRUZXh0QXN0LFxuICBUZXh0QXN0LFxuICBEaXJlY3RpdmVBc3QsXG4gIEJvdW5kRGlyZWN0aXZlUHJvcGVydHlBc3QsXG4gIHRlbXBsYXRlVmlzaXRBbGxcbn0gZnJvbSAnLi90ZW1wbGF0ZV9hc3QnO1xuaW1wb3J0IHtcbiAgQ29tcGlsZVR5cGVNZXRhZGF0YSxcbiAgQ29tcGlsZURpcmVjdGl2ZU1ldGFkYXRhLFxuICBDb21waWxlUGlwZU1ldGFkYXRhXG59IGZyb20gJy4vZGlyZWN0aXZlX21ldGFkYXRhJztcbmltcG9ydCB7U291cmNlRXhwcmVzc2lvbnMsIFNvdXJjZUV4cHJlc3Npb24sIG1vZHVsZVJlZn0gZnJvbSAnLi9zb3VyY2VfbW9kdWxlJztcbmltcG9ydCB7QXBwUHJvdG9WaWV3LCBBcHBWaWV3fSBmcm9tICdhbmd1bGFyMi9zcmMvY29yZS9saW5rZXIvdmlldyc7XG5pbXBvcnQge1ZpZXdUeXBlfSBmcm9tICdhbmd1bGFyMi9zcmMvY29yZS9saW5rZXIvdmlld190eXBlJztcbmltcG9ydCB7QXBwUHJvdG9FbGVtZW50LCBBcHBFbGVtZW50fSBmcm9tICdhbmd1bGFyMi9zcmMvY29yZS9saW5rZXIvZWxlbWVudCc7XG5pbXBvcnQge1Jlc29sdmVkTWV0YWRhdGFDYWNoZX0gZnJvbSAnYW5ndWxhcjIvc3JjL2NvcmUvbGlua2VyL3Jlc29sdmVkX21ldGFkYXRhX2NhY2hlJztcbmltcG9ydCB7XG4gIGVzY2FwZVNpbmdsZVF1b3RlU3RyaW5nLFxuICBjb2RlR2VuQ29uc3RDb25zdHJ1Y3RvckNhbGwsXG4gIGNvZGVHZW5WYWx1ZUZuLFxuICBjb2RlR2VuRm5IZWFkZXIsXG4gIE1PRFVMRV9TVUZGSVgsXG4gIGNvZGVHZW5TdHJpbmdNYXAsXG4gIEV4cHJlc3Npb24sXG4gIFN0YXRlbWVudFxufSBmcm9tICcuL3V0aWwnO1xuaW1wb3J0IHtJbmplY3RhYmxlfSBmcm9tICdhbmd1bGFyMi9zcmMvY29yZS9kaSc7XG5cbmV4cG9ydCBjb25zdCBQUk9UT19WSUVXX0pJVF9JTVBPUlRTID0gQ09OU1RfRVhQUihcbiAgICB7J0FwcFByb3RvVmlldyc6IEFwcFByb3RvVmlldywgJ0FwcFByb3RvRWxlbWVudCc6IEFwcFByb3RvRWxlbWVudCwgJ1ZpZXdUeXBlJzogVmlld1R5cGV9KTtcblxuLy8gVE9ETzogaGF2ZSBhIHNpbmdsZSBmaWxlIHRoYXQgcmVleHBvcnRzIGV2ZXJ5dGhpbmcgbmVlZGVkIGZvclxuLy8gY29kZWdlbiBleHBsaWNpdGx5XG4vLyAtIGhlbHBzIHVuZGVyc3RhbmRpbmcgd2hhdCBjb2RlZ2VuIHdvcmtzIGFnYWluc3Rcbi8vIC0gbGVzcyBpbXBvcnRzIGluIGNvZGVnZW4gY29kZVxuZXhwb3J0IHZhciBBUFBfVklFV19NT0RVTEVfUkVGID0gbW9kdWxlUmVmKCdwYWNrYWdlOmFuZ3VsYXIyL3NyYy9jb3JlL2xpbmtlci92aWV3JyArIE1PRFVMRV9TVUZGSVgpO1xuZXhwb3J0IHZhciBWSUVXX1RZUEVfTU9EVUxFX1JFRiA9XG4gICAgbW9kdWxlUmVmKCdwYWNrYWdlOmFuZ3VsYXIyL3NyYy9jb3JlL2xpbmtlci92aWV3X3R5cGUnICsgTU9EVUxFX1NVRkZJWCk7XG5leHBvcnQgdmFyIEFQUF9FTF9NT0RVTEVfUkVGID1cbiAgICBtb2R1bGVSZWYoJ3BhY2thZ2U6YW5ndWxhcjIvc3JjL2NvcmUvbGlua2VyL2VsZW1lbnQnICsgTU9EVUxFX1NVRkZJWCk7XG5leHBvcnQgdmFyIE1FVEFEQVRBX01PRFVMRV9SRUYgPVxuICAgIG1vZHVsZVJlZigncGFja2FnZTphbmd1bGFyMi9zcmMvY29yZS9tZXRhZGF0YS92aWV3JyArIE1PRFVMRV9TVUZGSVgpO1xuXG5jb25zdCBJTVBMSUNJVF9URU1QTEFURV9WQVIgPSAnXFwkaW1wbGljaXQnO1xuY29uc3QgQ0xBU1NfQVRUUiA9ICdjbGFzcyc7XG5jb25zdCBTVFlMRV9BVFRSID0gJ3N0eWxlJztcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIFByb3RvVmlld0NvbXBpbGVyIHtcbiAgY29uc3RydWN0b3IoKSB7fVxuXG4gIGNvbXBpbGVQcm90b1ZpZXdSdW50aW1lKG1ldGFkYXRhQ2FjaGU6IFJlc29sdmVkTWV0YWRhdGFDYWNoZSwgY29tcG9uZW50OiBDb21waWxlRGlyZWN0aXZlTWV0YWRhdGEsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlOiBUZW1wbGF0ZUFzdFtdLCBwaXBlczogQ29tcGlsZVBpcGVNZXRhZGF0YVtdKTpcbiAgICAgIENvbXBpbGVQcm90b1ZpZXdzPEFwcFByb3RvVmlldywgQXBwUHJvdG9FbGVtZW50LCBhbnk+IHtcbiAgICB2YXIgcHJvdG9WaWV3RmFjdG9yeSA9IG5ldyBSdW50aW1lUHJvdG9WaWV3RmFjdG9yeShtZXRhZGF0YUNhY2hlLCBjb21wb25lbnQsIHBpcGVzKTtcbiAgICB2YXIgYWxsUHJvdG9WaWV3cyA9IFtdO1xuICAgIHByb3RvVmlld0ZhY3RvcnkuY3JlYXRlQ29tcGlsZVByb3RvVmlldyh0ZW1wbGF0ZSwgW10sIFtdLCBhbGxQcm90b1ZpZXdzKTtcbiAgICByZXR1cm4gbmV3IENvbXBpbGVQcm90b1ZpZXdzPEFwcFByb3RvVmlldywgQXBwUHJvdG9FbGVtZW50LCBhbnk+KFtdLCBhbGxQcm90b1ZpZXdzKTtcbiAgfVxuXG4gIGNvbXBpbGVQcm90b1ZpZXdDb2RlR2VuKHJlc29sdmVkTWV0YWRhdGFDYWNoZUV4cHI6IEV4cHJlc3Npb24sXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudDogQ29tcGlsZURpcmVjdGl2ZU1ldGFkYXRhLCB0ZW1wbGF0ZTogVGVtcGxhdGVBc3RbXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgcGlwZXM6IENvbXBpbGVQaXBlTWV0YWRhdGFbXSk6XG4gICAgICBDb21waWxlUHJvdG9WaWV3czxFeHByZXNzaW9uLCBFeHByZXNzaW9uLCBzdHJpbmc+IHtcbiAgICB2YXIgcHJvdG9WaWV3RmFjdG9yeSA9IG5ldyBDb2RlR2VuUHJvdG9WaWV3RmFjdG9yeShyZXNvbHZlZE1ldGFkYXRhQ2FjaGVFeHByLCBjb21wb25lbnQsIHBpcGVzKTtcbiAgICB2YXIgYWxsUHJvdG9WaWV3cyA9IFtdO1xuICAgIHZhciBhbGxTdGF0ZW1lbnRzID0gW107XG4gICAgcHJvdG9WaWV3RmFjdG9yeS5jcmVhdGVDb21waWxlUHJvdG9WaWV3KHRlbXBsYXRlLCBbXSwgYWxsU3RhdGVtZW50cywgYWxsUHJvdG9WaWV3cyk7XG4gICAgcmV0dXJuIG5ldyBDb21waWxlUHJvdG9WaWV3czxFeHByZXNzaW9uLCBFeHByZXNzaW9uLCBzdHJpbmc+KFxuICAgICAgICBhbGxTdGF0ZW1lbnRzLm1hcChzdG10ID0+IHN0bXQuc3RhdGVtZW50KSwgYWxsUHJvdG9WaWV3cyk7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIENvbXBpbGVQcm90b1ZpZXdzPEFQUF9QUk9UT19WSUVXLCBBUFBfUFJPVE9fRUwsIFNUQVRFTUVOVD4ge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgZGVjbGFyYXRpb25zOiBTVEFURU1FTlRbXSxcbiAgICAgICAgICAgICAgcHVibGljIHByb3RvVmlld3M6IENvbXBpbGVQcm90b1ZpZXc8QVBQX1BST1RPX1ZJRVcsIEFQUF9QUk9UT19FTD5bXSkge31cbn1cblxuXG5leHBvcnQgY2xhc3MgQ29tcGlsZVByb3RvVmlldzxBUFBfUFJPVE9fVklFVywgQVBQX1BST1RPX0VMPiB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBlbWJlZGRlZFRlbXBsYXRlSW5kZXg6IG51bWJlcixcbiAgICAgICAgICAgICAgcHVibGljIHByb3RvRWxlbWVudHM6IENvbXBpbGVQcm90b0VsZW1lbnQ8QVBQX1BST1RPX0VMPltdLFxuICAgICAgICAgICAgICBwdWJsaWMgcHJvdG9WaWV3OiBBUFBfUFJPVE9fVklFVykge31cbn1cblxuZXhwb3J0IGNsYXNzIENvbXBpbGVQcm90b0VsZW1lbnQ8QVBQX1BST1RPX0VMPiB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBib3VuZEVsZW1lbnRJbmRleCwgcHVibGljIGF0dHJOYW1lQW5kVmFsdWVzOiBzdHJpbmdbXVtdLFxuICAgICAgICAgICAgICBwdWJsaWMgdmFyaWFibGVOYW1lQW5kVmFsdWVzOiBzdHJpbmdbXVtdLCBwdWJsaWMgcmVuZGVyRXZlbnRzOiBCb3VuZEV2ZW50QXN0W10sXG4gICAgICAgICAgICAgIHB1YmxpYyBkaXJlY3RpdmVzOiBDb21waWxlRGlyZWN0aXZlTWV0YWRhdGFbXSwgcHVibGljIGVtYmVkZGVkVGVtcGxhdGVJbmRleDogbnVtYmVyLFxuICAgICAgICAgICAgICBwdWJsaWMgYXBwUHJvdG9FbDogQVBQX1BST1RPX0VMKSB7fVxufVxuXG5mdW5jdGlvbiB2aXNpdEFuZFJldHVybkNvbnRleHQodmlzaXRvcjogVGVtcGxhdGVBc3RWaXNpdG9yLCBhc3RzOiBUZW1wbGF0ZUFzdFtdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRleHQ6IGFueSk6IGFueSB7XG4gIHRlbXBsYXRlVmlzaXRBbGwodmlzaXRvciwgYXN0cywgY29udGV4dCk7XG4gIHJldHVybiBjb250ZXh0O1xufVxuXG5hYnN0cmFjdCBjbGFzcyBQcm90b1ZpZXdGYWN0b3J5PEFQUF9QUk9UT19WSUVXLCBBUFBfUFJPVE9fRUwsIFNUQVRFTUVOVD4ge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgY29tcG9uZW50OiBDb21waWxlRGlyZWN0aXZlTWV0YWRhdGEpIHt9XG5cbiAgYWJzdHJhY3QgY3JlYXRlQXBwUHJvdG9WaWV3KGVtYmVkZGVkVGVtcGxhdGVJbmRleDogbnVtYmVyLCB2aWV3VHlwZTogVmlld1R5cGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVZhcmlhYmxlQmluZGluZ3M6IHN0cmluZ1tdW10sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXRTdGF0ZW1lbnRzOiBTVEFURU1FTlRbXSk6IEFQUF9QUk9UT19WSUVXO1xuXG4gIGFic3RyYWN0IGNyZWF0ZUFwcFByb3RvRWxlbWVudChib3VuZEVsZW1lbnRJbmRleDogbnVtYmVyLCBhdHRyTmFtZUFuZFZhbHVlczogc3RyaW5nW11bXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhcmlhYmxlTmFtZUFuZFZhbHVlczogc3RyaW5nW11bXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpcmVjdGl2ZXM6IENvbXBpbGVEaXJlY3RpdmVNZXRhZGF0YVtdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0U3RhdGVtZW50czogU1RBVEVNRU5UW10pOiBBUFBfUFJPVE9fRUw7XG5cbiAgY3JlYXRlQ29tcGlsZVByb3RvVmlldyh0ZW1wbGF0ZTogVGVtcGxhdGVBc3RbXSwgdGVtcGxhdGVWYXJpYWJsZUJpbmRpbmdzOiBzdHJpbmdbXVtdLFxuICAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldFN0YXRlbWVudHM6IFNUQVRFTUVOVFtdLFxuICAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldFByb3RvVmlld3M6IENvbXBpbGVQcm90b1ZpZXc8QVBQX1BST1RPX1ZJRVcsIEFQUF9QUk9UT19FTD5bXSk6XG4gICAgICBDb21waWxlUHJvdG9WaWV3PEFQUF9QUk9UT19WSUVXLCBBUFBfUFJPVE9fRUw+IHtcbiAgICB2YXIgZW1iZWRkZWRUZW1wbGF0ZUluZGV4ID0gdGFyZ2V0UHJvdG9WaWV3cy5sZW5ndGg7XG4gICAgLy8gTm90ZTogdGFyZ2V0UHJvdG9WaWV3cyBuZWVkcyB0byBiZSBpbiBkZXB0aCBmaXJzdCBvcmRlci5cbiAgICAvLyBTbyB3ZSBcInJlc2VydmVcIiBhIHNwYWNlIGhlcmUgdGhhdCB3ZSBmaWxsIGFmdGVyIHRoZSByZWN1cnNpb24gaXMgZG9uZVxuICAgIHRhcmdldFByb3RvVmlld3MucHVzaChudWxsKTtcbiAgICB2YXIgYnVpbGRlciA9IG5ldyBQcm90b1ZpZXdCdWlsZGVyVmlzaXRvcjxBUFBfUFJPVE9fVklFVywgQVBQX1BST1RPX0VMLCBhbnk+KFxuICAgICAgICB0aGlzLCB0YXJnZXRTdGF0ZW1lbnRzLCB0YXJnZXRQcm90b1ZpZXdzKTtcbiAgICB0ZW1wbGF0ZVZpc2l0QWxsKGJ1aWxkZXIsIHRlbXBsYXRlKTtcbiAgICB2YXIgdmlld1R5cGUgPSBnZXRWaWV3VHlwZSh0aGlzLmNvbXBvbmVudCwgZW1iZWRkZWRUZW1wbGF0ZUluZGV4KTtcbiAgICB2YXIgYXBwUHJvdG9WaWV3ID0gdGhpcy5jcmVhdGVBcHBQcm90b1ZpZXcoZW1iZWRkZWRUZW1wbGF0ZUluZGV4LCB2aWV3VHlwZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVWYXJpYWJsZUJpbmRpbmdzLCB0YXJnZXRTdGF0ZW1lbnRzKTtcbiAgICB2YXIgY3B2ID0gbmV3IENvbXBpbGVQcm90b1ZpZXc8QVBQX1BST1RPX1ZJRVcsIEFQUF9QUk9UT19FTD4oXG4gICAgICAgIGVtYmVkZGVkVGVtcGxhdGVJbmRleCwgYnVpbGRlci5wcm90b0VsZW1lbnRzLCBhcHBQcm90b1ZpZXcpO1xuICAgIHRhcmdldFByb3RvVmlld3NbZW1iZWRkZWRUZW1wbGF0ZUluZGV4XSA9IGNwdjtcbiAgICByZXR1cm4gY3B2O1xuICB9XG59XG5cbmNsYXNzIENvZGVHZW5Qcm90b1ZpZXdGYWN0b3J5IGV4dGVuZHMgUHJvdG9WaWV3RmFjdG9yeTxFeHByZXNzaW9uLCBFeHByZXNzaW9uLCBTdGF0ZW1lbnQ+IHtcbiAgcHJpdmF0ZSBfbmV4dFZhcklkOiBudW1iZXIgPSAwO1xuXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyByZXNvbHZlZE1ldGFkYXRhQ2FjaGVFeHByOiBFeHByZXNzaW9uLCBjb21wb25lbnQ6IENvbXBpbGVEaXJlY3RpdmVNZXRhZGF0YSxcbiAgICAgICAgICAgICAgcHVibGljIHBpcGVzOiBDb21waWxlUGlwZU1ldGFkYXRhW10pIHtcbiAgICBzdXBlcihjb21wb25lbnQpO1xuICB9XG5cbiAgcHJpdmF0ZSBfbmV4dFByb3RvVmlld1ZhcihlbWJlZGRlZFRlbXBsYXRlSW5kZXg6IG51bWJlcik6IHN0cmluZyB7XG4gICAgcmV0dXJuIGBhcHBQcm90b1ZpZXcke3RoaXMuX25leHRWYXJJZCsrfV8ke3RoaXMuY29tcG9uZW50LnR5cGUubmFtZX0ke2VtYmVkZGVkVGVtcGxhdGVJbmRleH1gO1xuICB9XG5cbiAgY3JlYXRlQXBwUHJvdG9WaWV3KGVtYmVkZGVkVGVtcGxhdGVJbmRleDogbnVtYmVyLCB2aWV3VHlwZTogVmlld1R5cGUsXG4gICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVZhcmlhYmxlQmluZGluZ3M6IHN0cmluZ1tdW10sXG4gICAgICAgICAgICAgICAgICAgICB0YXJnZXRTdGF0ZW1lbnRzOiBTdGF0ZW1lbnRbXSk6IEV4cHJlc3Npb24ge1xuICAgIHZhciBwcm90b1ZpZXdWYXJOYW1lID0gdGhpcy5fbmV4dFByb3RvVmlld1ZhcihlbWJlZGRlZFRlbXBsYXRlSW5kZXgpO1xuICAgIHZhciB2aWV3VHlwZUV4cHIgPSBjb2RlR2VuVmlld1R5cGUodmlld1R5cGUpO1xuICAgIHZhciBwaXBlc0V4cHIgPSBlbWJlZGRlZFRlbXBsYXRlSW5kZXggPT09IDAgP1xuICAgICAgICAgICAgICAgICAgICAgICAgY29kZUdlblR5cGVzQXJyYXkodGhpcy5waXBlcy5tYXAocGlwZU1ldGEgPT4gcGlwZU1ldGEudHlwZSkpIDpcbiAgICAgICAgICAgICAgICAgICAgICAgIG51bGw7XG4gICAgdmFyIHN0YXRlbWVudCA9XG4gICAgICAgIGB2YXIgJHtwcm90b1ZpZXdWYXJOYW1lfSA9ICR7QVBQX1ZJRVdfTU9EVUxFX1JFRn1BcHBQcm90b1ZpZXcuY3JlYXRlKCR7dGhpcy5yZXNvbHZlZE1ldGFkYXRhQ2FjaGVFeHByLmV4cHJlc3Npb259LCAke3ZpZXdUeXBlRXhwcn0sICR7cGlwZXNFeHByfSwgJHtjb2RlR2VuU3RyaW5nTWFwKHRlbXBsYXRlVmFyaWFibGVCaW5kaW5ncyl9KTtgO1xuICAgIHRhcmdldFN0YXRlbWVudHMucHVzaChuZXcgU3RhdGVtZW50KHN0YXRlbWVudCkpO1xuICAgIHJldHVybiBuZXcgRXhwcmVzc2lvbihwcm90b1ZpZXdWYXJOYW1lKTtcbiAgfVxuXG4gIGNyZWF0ZUFwcFByb3RvRWxlbWVudChib3VuZEVsZW1lbnRJbmRleDogbnVtYmVyLCBhdHRyTmFtZUFuZFZhbHVlczogc3RyaW5nW11bXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhcmlhYmxlTmFtZUFuZFZhbHVlczogc3RyaW5nW11bXSwgZGlyZWN0aXZlczogQ29tcGlsZURpcmVjdGl2ZU1ldGFkYXRhW10sXG4gICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXRTdGF0ZW1lbnRzOiBTdGF0ZW1lbnRbXSk6IEV4cHJlc3Npb24ge1xuICAgIHZhciB2YXJOYW1lID0gYGFwcFByb3RvRWwke3RoaXMuX25leHRWYXJJZCsrfV8ke3RoaXMuY29tcG9uZW50LnR5cGUubmFtZX1gO1xuICAgIHZhciB2YWx1ZSA9IGAke0FQUF9FTF9NT0RVTEVfUkVGfUFwcFByb3RvRWxlbWVudC5jcmVhdGUoXG4gICAgICAgICR7dGhpcy5yZXNvbHZlZE1ldGFkYXRhQ2FjaGVFeHByLmV4cHJlc3Npb259LFxuICAgICAgICAke2JvdW5kRWxlbWVudEluZGV4fSxcbiAgICAgICAgJHtjb2RlR2VuU3RyaW5nTWFwKGF0dHJOYW1lQW5kVmFsdWVzKX0sXG4gICAgICAgICR7Y29kZUdlbkRpcmVjdGl2ZXNBcnJheShkaXJlY3RpdmVzKX0sXG4gICAgICAgICR7Y29kZUdlblN0cmluZ01hcCh2YXJpYWJsZU5hbWVBbmRWYWx1ZXMpfVxuICAgICAgKWA7XG4gICAgdmFyIHN0YXRlbWVudCA9IGB2YXIgJHt2YXJOYW1lfSA9ICR7dmFsdWV9O2A7XG4gICAgdGFyZ2V0U3RhdGVtZW50cy5wdXNoKG5ldyBTdGF0ZW1lbnQoc3RhdGVtZW50KSk7XG4gICAgcmV0dXJuIG5ldyBFeHByZXNzaW9uKHZhck5hbWUpO1xuICB9XG59XG5cbmNsYXNzIFJ1bnRpbWVQcm90b1ZpZXdGYWN0b3J5IGV4dGVuZHMgUHJvdG9WaWV3RmFjdG9yeTxBcHBQcm90b1ZpZXcsIEFwcFByb3RvRWxlbWVudCwgYW55PiB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBtZXRhZGF0YUNhY2hlOiBSZXNvbHZlZE1ldGFkYXRhQ2FjaGUsIGNvbXBvbmVudDogQ29tcGlsZURpcmVjdGl2ZU1ldGFkYXRhLFxuICAgICAgICAgICAgICBwdWJsaWMgcGlwZXM6IENvbXBpbGVQaXBlTWV0YWRhdGFbXSkge1xuICAgIHN1cGVyKGNvbXBvbmVudCk7XG4gIH1cblxuICBjcmVhdGVBcHBQcm90b1ZpZXcoZW1iZWRkZWRUZW1wbGF0ZUluZGV4OiBudW1iZXIsIHZpZXdUeXBlOiBWaWV3VHlwZSxcbiAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVmFyaWFibGVCaW5kaW5nczogc3RyaW5nW11bXSwgdGFyZ2V0U3RhdGVtZW50czogYW55W10pOiBBcHBQcm90b1ZpZXcge1xuICAgIHZhciBwaXBlcyA9XG4gICAgICAgIGVtYmVkZGVkVGVtcGxhdGVJbmRleCA9PT0gMCA/IHRoaXMucGlwZXMubWFwKHBpcGVNZXRhID0+IHBpcGVNZXRhLnR5cGUucnVudGltZSkgOiBbXTtcbiAgICB2YXIgdGVtcGxhdGVWYXJzID0ga2V5VmFsdWVBcnJheVRvU3RyaW5nTWFwKHRlbXBsYXRlVmFyaWFibGVCaW5kaW5ncyk7XG4gICAgcmV0dXJuIEFwcFByb3RvVmlldy5jcmVhdGUodGhpcy5tZXRhZGF0YUNhY2hlLCB2aWV3VHlwZSwgcGlwZXMsIHRlbXBsYXRlVmFycyk7XG4gIH1cblxuICBjcmVhdGVBcHBQcm90b0VsZW1lbnQoYm91bmRFbGVtZW50SW5kZXg6IG51bWJlciwgYXR0ck5hbWVBbmRWYWx1ZXM6IHN0cmluZ1tdW10sXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXJpYWJsZU5hbWVBbmRWYWx1ZXM6IHN0cmluZ1tdW10sIGRpcmVjdGl2ZXM6IENvbXBpbGVEaXJlY3RpdmVNZXRhZGF0YVtdLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0U3RhdGVtZW50czogYW55W10pOiBBcHBQcm90b0VsZW1lbnQge1xuICAgIHZhciBhdHRycyA9IGtleVZhbHVlQXJyYXlUb1N0cmluZ01hcChhdHRyTmFtZUFuZFZhbHVlcyk7XG4gICAgcmV0dXJuIEFwcFByb3RvRWxlbWVudC5jcmVhdGUodGhpcy5tZXRhZGF0YUNhY2hlLCBib3VuZEVsZW1lbnRJbmRleCwgYXR0cnMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGlyZWN0aXZlcy5tYXAoZGlyTWV0YSA9PiBkaXJNZXRhLnR5cGUucnVudGltZSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAga2V5VmFsdWVBcnJheVRvU3RyaW5nTWFwKHZhcmlhYmxlTmFtZUFuZFZhbHVlcykpO1xuICB9XG59XG5cbmNsYXNzIFByb3RvVmlld0J1aWxkZXJWaXNpdG9yPEFQUF9QUk9UT19WSUVXLCBBUFBfUFJPVE9fRUwsIFNUQVRFTUVOVD4gaW1wbGVtZW50c1xuICAgIFRlbXBsYXRlQXN0VmlzaXRvciB7XG4gIHByb3RvRWxlbWVudHM6IENvbXBpbGVQcm90b0VsZW1lbnQ8QVBQX1BST1RPX0VMPltdID0gW107XG4gIGJvdW5kRWxlbWVudENvdW50OiBudW1iZXIgPSAwO1xuXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBmYWN0b3J5OiBQcm90b1ZpZXdGYWN0b3J5PEFQUF9QUk9UT19WSUVXLCBBUFBfUFJPVE9fRUwsIFNUQVRFTUVOVD4sXG4gICAgICAgICAgICAgIHB1YmxpYyBhbGxTdGF0ZW1lbnRzOiBTVEFURU1FTlRbXSxcbiAgICAgICAgICAgICAgcHVibGljIGFsbFByb3RvVmlld3M6IENvbXBpbGVQcm90b1ZpZXc8QVBQX1BST1RPX1ZJRVcsIEFQUF9QUk9UT19FTD5bXSkge31cblxuICBwcml2YXRlIF9yZWFkQXR0ck5hbWVBbmRWYWx1ZXMoZGlyZWN0aXZlczogQ29tcGlsZURpcmVjdGl2ZU1ldGFkYXRhW10sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyQXN0czogVGVtcGxhdGVBc3RbXSk6IHN0cmluZ1tdW10ge1xuICAgIHZhciBhdHRycyA9IHZpc2l0QW5kUmV0dXJuQ29udGV4dCh0aGlzLCBhdHRyQXN0cywge30pO1xuICAgIGRpcmVjdGl2ZXMuZm9yRWFjaChkaXJlY3RpdmVNZXRhID0+IHtcbiAgICAgIFN0cmluZ01hcFdyYXBwZXIuZm9yRWFjaChkaXJlY3RpdmVNZXRhLmhvc3RBdHRyaWJ1dGVzLCAodmFsdWU6IHN0cmluZywgbmFtZTogc3RyaW5nKSA9PiB7XG4gICAgICAgIHZhciBwcmV2VmFsdWUgPSBhdHRyc1tuYW1lXTtcbiAgICAgICAgYXR0cnNbbmFtZV0gPSBpc1ByZXNlbnQocHJldlZhbHVlKSA/IG1lcmdlQXR0cmlidXRlVmFsdWUobmFtZSwgcHJldlZhbHVlLCB2YWx1ZSkgOiB2YWx1ZTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIHJldHVybiBtYXBUb0tleVZhbHVlQXJyYXkoYXR0cnMpO1xuICB9XG5cbiAgdmlzaXRCb3VuZFRleHQoYXN0OiBCb3VuZFRleHRBc3QsIGNvbnRleHQ6IGFueSk6IGFueSB7IHJldHVybiBudWxsOyB9XG4gIHZpc2l0VGV4dChhc3Q6IFRleHRBc3QsIGNvbnRleHQ6IGFueSk6IGFueSB7IHJldHVybiBudWxsOyB9XG5cbiAgdmlzaXROZ0NvbnRlbnQoYXN0OiBOZ0NvbnRlbnRBc3QsIGNvbnRleHQ6IGFueSk6IGFueSB7IHJldHVybiBudWxsOyB9XG5cbiAgdmlzaXRFbGVtZW50KGFzdDogRWxlbWVudEFzdCwgY29udGV4dDogYW55KTogYW55IHtcbiAgICB2YXIgYm91bmRFbGVtZW50SW5kZXggPSBudWxsO1xuICAgIGlmIChhc3QuaXNCb3VuZCgpKSB7XG4gICAgICBib3VuZEVsZW1lbnRJbmRleCA9IHRoaXMuYm91bmRFbGVtZW50Q291bnQrKztcbiAgICB9XG4gICAgdmFyIGNvbXBvbmVudCA9IGFzdC5nZXRDb21wb25lbnQoKTtcblxuICAgIHZhciB2YXJpYWJsZU5hbWVBbmRWYWx1ZXM6IHN0cmluZ1tdW10gPSBbXTtcbiAgICBpZiAoaXNCbGFuayhjb21wb25lbnQpKSB7XG4gICAgICBhc3QuZXhwb3J0QXNWYXJzLmZvckVhY2goKHZhckFzdCkgPT4geyB2YXJpYWJsZU5hbWVBbmRWYWx1ZXMucHVzaChbdmFyQXN0Lm5hbWUsIG51bGxdKTsgfSk7XG4gICAgfVxuICAgIHZhciBkaXJlY3RpdmVzID0gW107XG4gICAgdmFyIHJlbmRlckV2ZW50czogTWFwPHN0cmluZywgQm91bmRFdmVudEFzdD4gPVxuICAgICAgICB2aXNpdEFuZFJldHVybkNvbnRleHQodGhpcywgYXN0Lm91dHB1dHMsIG5ldyBNYXA8c3RyaW5nLCBCb3VuZEV2ZW50QXN0PigpKTtcbiAgICBMaXN0V3JhcHBlci5mb3JFYWNoV2l0aEluZGV4KGFzdC5kaXJlY3RpdmVzLCAoZGlyZWN0aXZlQXN0OiBEaXJlY3RpdmVBc3QsIGluZGV4OiBudW1iZXIpID0+IHtcbiAgICAgIGRpcmVjdGl2ZUFzdC52aXNpdCh0aGlzLCBuZXcgRGlyZWN0aXZlQ29udGV4dChpbmRleCwgYm91bmRFbGVtZW50SW5kZXgsIHJlbmRlckV2ZW50cyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXJpYWJsZU5hbWVBbmRWYWx1ZXMsIGRpcmVjdGl2ZXMpKTtcbiAgICB9KTtcbiAgICB2YXIgcmVuZGVyRXZlbnRBcnJheSA9IFtdO1xuICAgIHJlbmRlckV2ZW50cy5mb3JFYWNoKChldmVudEFzdCwgXykgPT4gcmVuZGVyRXZlbnRBcnJheS5wdXNoKGV2ZW50QXN0KSk7XG5cbiAgICB2YXIgYXR0ck5hbWVBbmRWYWx1ZXMgPSB0aGlzLl9yZWFkQXR0ck5hbWVBbmRWYWx1ZXMoZGlyZWN0aXZlcywgYXN0LmF0dHJzKTtcbiAgICB0aGlzLl9hZGRQcm90b0VsZW1lbnQoYXN0LmlzQm91bmQoKSwgYm91bmRFbGVtZW50SW5kZXgsIGF0dHJOYW1lQW5kVmFsdWVzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICB2YXJpYWJsZU5hbWVBbmRWYWx1ZXMsIHJlbmRlckV2ZW50QXJyYXksIGRpcmVjdGl2ZXMsIG51bGwpO1xuICAgIHRlbXBsYXRlVmlzaXRBbGwodGhpcywgYXN0LmNoaWxkcmVuKTtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHZpc2l0RW1iZWRkZWRUZW1wbGF0ZShhc3Q6IEVtYmVkZGVkVGVtcGxhdGVBc3QsIGNvbnRleHQ6IGFueSk6IGFueSB7XG4gICAgdmFyIGJvdW5kRWxlbWVudEluZGV4ID0gdGhpcy5ib3VuZEVsZW1lbnRDb3VudCsrO1xuICAgIHZhciBkaXJlY3RpdmVzOiBDb21waWxlRGlyZWN0aXZlTWV0YWRhdGFbXSA9IFtdO1xuICAgIExpc3RXcmFwcGVyLmZvckVhY2hXaXRoSW5kZXgoYXN0LmRpcmVjdGl2ZXMsIChkaXJlY3RpdmVBc3Q6IERpcmVjdGl2ZUFzdCwgaW5kZXg6IG51bWJlcikgPT4ge1xuICAgICAgZGlyZWN0aXZlQXN0LnZpc2l0KFxuICAgICAgICAgIHRoaXMsIG5ldyBEaXJlY3RpdmVDb250ZXh0KGluZGV4LCBib3VuZEVsZW1lbnRJbmRleCwgbmV3IE1hcDxzdHJpbmcsIEJvdW5kRXZlbnRBc3Q+KCksIFtdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpcmVjdGl2ZXMpKTtcbiAgICB9KTtcblxuICAgIHZhciBhdHRyTmFtZUFuZFZhbHVlcyA9IHRoaXMuX3JlYWRBdHRyTmFtZUFuZFZhbHVlcyhkaXJlY3RpdmVzLCBhc3QuYXR0cnMpO1xuICAgIHZhciB0ZW1wbGF0ZVZhcmlhYmxlQmluZGluZ3MgPSBhc3QudmFycy5tYXAoXG4gICAgICAgIHZhckFzdCA9PiBbdmFyQXN0LnZhbHVlLmxlbmd0aCA+IDAgPyB2YXJBc3QudmFsdWUgOiBJTVBMSUNJVF9URU1QTEFURV9WQVIsIHZhckFzdC5uYW1lXSk7XG4gICAgdmFyIG5lc3RlZFByb3RvVmlldyA9IHRoaXMuZmFjdG9yeS5jcmVhdGVDb21waWxlUHJvdG9WaWV3KFxuICAgICAgICBhc3QuY2hpbGRyZW4sIHRlbXBsYXRlVmFyaWFibGVCaW5kaW5ncywgdGhpcy5hbGxTdGF0ZW1lbnRzLCB0aGlzLmFsbFByb3RvVmlld3MpO1xuICAgIHRoaXMuX2FkZFByb3RvRWxlbWVudCh0cnVlLCBib3VuZEVsZW1lbnRJbmRleCwgYXR0ck5hbWVBbmRWYWx1ZXMsIFtdLCBbXSwgZGlyZWN0aXZlcyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgbmVzdGVkUHJvdG9WaWV3LmVtYmVkZGVkVGVtcGxhdGVJbmRleCk7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBwcml2YXRlIF9hZGRQcm90b0VsZW1lbnQoaXNCb3VuZDogYm9vbGVhbiwgYm91bmRFbGVtZW50SW5kZXgsIGF0dHJOYW1lQW5kVmFsdWVzOiBzdHJpbmdbXVtdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyaWFibGVOYW1lQW5kVmFsdWVzOiBzdHJpbmdbXVtdLCByZW5kZXJFdmVudHM6IEJvdW5kRXZlbnRBc3RbXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpcmVjdGl2ZXM6IENvbXBpbGVEaXJlY3RpdmVNZXRhZGF0YVtdLCBlbWJlZGRlZFRlbXBsYXRlSW5kZXg6IG51bWJlcikge1xuICAgIHZhciBhcHBQcm90b0VsID0gbnVsbDtcbiAgICBpZiAoaXNCb3VuZCkge1xuICAgICAgYXBwUHJvdG9FbCA9XG4gICAgICAgICAgdGhpcy5mYWN0b3J5LmNyZWF0ZUFwcFByb3RvRWxlbWVudChib3VuZEVsZW1lbnRJbmRleCwgYXR0ck5hbWVBbmRWYWx1ZXMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXJpYWJsZU5hbWVBbmRWYWx1ZXMsIGRpcmVjdGl2ZXMsIHRoaXMuYWxsU3RhdGVtZW50cyk7XG4gICAgfVxuICAgIHZhciBjb21waWxlUHJvdG9FbCA9IG5ldyBDb21waWxlUHJvdG9FbGVtZW50PEFQUF9QUk9UT19FTD4oXG4gICAgICAgIGJvdW5kRWxlbWVudEluZGV4LCBhdHRyTmFtZUFuZFZhbHVlcywgdmFyaWFibGVOYW1lQW5kVmFsdWVzLCByZW5kZXJFdmVudHMsIGRpcmVjdGl2ZXMsXG4gICAgICAgIGVtYmVkZGVkVGVtcGxhdGVJbmRleCwgYXBwUHJvdG9FbCk7XG4gICAgdGhpcy5wcm90b0VsZW1lbnRzLnB1c2goY29tcGlsZVByb3RvRWwpO1xuICB9XG5cbiAgdmlzaXRWYXJpYWJsZShhc3Q6IFZhcmlhYmxlQXN0LCBjdHg6IGFueSk6IGFueSB7IHJldHVybiBudWxsOyB9XG4gIHZpc2l0QXR0cihhc3Q6IEF0dHJBc3QsIGF0dHJOYW1lQW5kVmFsdWVzOiB7W2tleTogc3RyaW5nXTogc3RyaW5nfSk6IGFueSB7XG4gICAgYXR0ck5hbWVBbmRWYWx1ZXNbYXN0Lm5hbWVdID0gYXN0LnZhbHVlO1xuICAgIHJldHVybiBudWxsO1xuICB9XG4gIHZpc2l0RGlyZWN0aXZlKGFzdDogRGlyZWN0aXZlQXN0LCBjdHg6IERpcmVjdGl2ZUNvbnRleHQpOiBhbnkge1xuICAgIGN0eC50YXJnZXREaXJlY3RpdmVzLnB1c2goYXN0LmRpcmVjdGl2ZSk7XG4gICAgdGVtcGxhdGVWaXNpdEFsbCh0aGlzLCBhc3QuaG9zdEV2ZW50cywgY3R4Lmhvc3RFdmVudFRhcmdldEFuZE5hbWVzKTtcbiAgICBhc3QuZXhwb3J0QXNWYXJzLmZvckVhY2goXG4gICAgICAgIHZhckFzdCA9PiB7IGN0eC50YXJnZXRWYXJpYWJsZU5hbWVBbmRWYWx1ZXMucHVzaChbdmFyQXN0Lm5hbWUsIGN0eC5pbmRleF0pOyB9KTtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICB2aXNpdEV2ZW50KGFzdDogQm91bmRFdmVudEFzdCwgZXZlbnRUYXJnZXRBbmROYW1lczogTWFwPHN0cmluZywgQm91bmRFdmVudEFzdD4pOiBhbnkge1xuICAgIGV2ZW50VGFyZ2V0QW5kTmFtZXMuc2V0KGFzdC5mdWxsTmFtZSwgYXN0KTtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICB2aXNpdERpcmVjdGl2ZVByb3BlcnR5KGFzdDogQm91bmREaXJlY3RpdmVQcm9wZXJ0eUFzdCwgY29udGV4dDogYW55KTogYW55IHsgcmV0dXJuIG51bGw7IH1cbiAgdmlzaXRFbGVtZW50UHJvcGVydHkoYXN0OiBCb3VuZEVsZW1lbnRQcm9wZXJ0eUFzdCwgY29udGV4dDogYW55KTogYW55IHsgcmV0dXJuIG51bGw7IH1cbn1cblxuZnVuY3Rpb24gbWFwVG9LZXlWYWx1ZUFycmF5KGRhdGE6IHtba2V5OiBzdHJpbmddOiBzdHJpbmd9KTogc3RyaW5nW11bXSB7XG4gIHZhciBlbnRyeUFycmF5OiBzdHJpbmdbXVtdID0gW107XG4gIFN0cmluZ01hcFdyYXBwZXIuZm9yRWFjaChkYXRhLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgKHZhbHVlOiBzdHJpbmcsIG5hbWU6IHN0cmluZykgPT4geyBlbnRyeUFycmF5LnB1c2goW25hbWUsIHZhbHVlXSk7IH0pO1xuICAvLyBXZSBuZWVkIHRvIHNvcnQgdG8gZ2V0IGEgZGVmaW5lZCBvdXRwdXQgb3JkZXJcbiAgLy8gZm9yIHRlc3RzIGFuZCBmb3IgY2FjaGluZyBnZW5lcmF0ZWQgYXJ0aWZhY3RzLi4uXG4gIExpc3RXcmFwcGVyLnNvcnQ8c3RyaW5nW10+KGVudHJ5QXJyYXksIChlbnRyeTE6IHN0cmluZ1tdLCBlbnRyeTI6IHN0cmluZ1tdKSA9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgU3RyaW5nV3JhcHBlci5jb21wYXJlKGVudHJ5MVswXSwgZW50cnkyWzBdKSk7XG4gIHZhciBrZXlWYWx1ZUFycmF5OiBzdHJpbmdbXVtdID0gW107XG4gIGVudHJ5QXJyYXkuZm9yRWFjaCgoZW50cnkpID0+IHsga2V5VmFsdWVBcnJheS5wdXNoKFtlbnRyeVswXSwgZW50cnlbMV1dKTsgfSk7XG4gIHJldHVybiBrZXlWYWx1ZUFycmF5O1xufVxuXG5mdW5jdGlvbiBtZXJnZUF0dHJpYnV0ZVZhbHVlKGF0dHJOYW1lOiBzdHJpbmcsIGF0dHJWYWx1ZTE6IHN0cmluZywgYXR0clZhbHVlMjogc3RyaW5nKTogc3RyaW5nIHtcbiAgaWYgKGF0dHJOYW1lID09IENMQVNTX0FUVFIgfHwgYXR0ck5hbWUgPT0gU1RZTEVfQVRUUikge1xuICAgIHJldHVybiBgJHthdHRyVmFsdWUxfSAke2F0dHJWYWx1ZTJ9YDtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gYXR0clZhbHVlMjtcbiAgfVxufVxuXG5jbGFzcyBEaXJlY3RpdmVDb250ZXh0IHtcbiAgY29uc3RydWN0b3IocHVibGljIGluZGV4OiBudW1iZXIsIHB1YmxpYyBib3VuZEVsZW1lbnRJbmRleDogbnVtYmVyLFxuICAgICAgICAgICAgICBwdWJsaWMgaG9zdEV2ZW50VGFyZ2V0QW5kTmFtZXM6IE1hcDxzdHJpbmcsIEJvdW5kRXZlbnRBc3Q+LFxuICAgICAgICAgICAgICBwdWJsaWMgdGFyZ2V0VmFyaWFibGVOYW1lQW5kVmFsdWVzOiBhbnlbXVtdLFxuICAgICAgICAgICAgICBwdWJsaWMgdGFyZ2V0RGlyZWN0aXZlczogQ29tcGlsZURpcmVjdGl2ZU1ldGFkYXRhW10pIHt9XG59XG5cbmZ1bmN0aW9uIGtleVZhbHVlQXJyYXlUb1N0cmluZ01hcChrZXlWYWx1ZUFycmF5OiBhbnlbXVtdKToge1trZXk6IHN0cmluZ106IGFueX0ge1xuICB2YXIgc3RyaW5nTWFwOiB7W2tleTogc3RyaW5nXTogc3RyaW5nfSA9IHt9O1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGtleVZhbHVlQXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgZW50cnkgPSBrZXlWYWx1ZUFycmF5W2ldO1xuICAgIHN0cmluZ01hcFtlbnRyeVswXV0gPSBlbnRyeVsxXTtcbiAgfVxuICByZXR1cm4gc3RyaW5nTWFwO1xufVxuXG5mdW5jdGlvbiBjb2RlR2VuRGlyZWN0aXZlc0FycmF5KGRpcmVjdGl2ZXM6IENvbXBpbGVEaXJlY3RpdmVNZXRhZGF0YVtdKTogc3RyaW5nIHtcbiAgdmFyIGV4cHJlc3Npb25zID0gZGlyZWN0aXZlcy5tYXAoZGlyZWN0aXZlVHlwZSA9PiB0eXBlUmVmKGRpcmVjdGl2ZVR5cGUudHlwZSkpO1xuICByZXR1cm4gYFske2V4cHJlc3Npb25zLmpvaW4oJywnKX1dYDtcbn1cblxuZnVuY3Rpb24gY29kZUdlblR5cGVzQXJyYXkodHlwZXM6IENvbXBpbGVUeXBlTWV0YWRhdGFbXSk6IHN0cmluZyB7XG4gIHZhciBleHByZXNzaW9ucyA9IHR5cGVzLm1hcCh0eXBlUmVmKTtcbiAgcmV0dXJuIGBbJHtleHByZXNzaW9ucy5qb2luKCcsJyl9XWA7XG59XG5cbmZ1bmN0aW9uIGNvZGVHZW5WaWV3VHlwZSh2YWx1ZTogVmlld1R5cGUpOiBzdHJpbmcge1xuICBpZiAoSVNfREFSVCkge1xuICAgIHJldHVybiBgJHtWSUVXX1RZUEVfTU9EVUxFX1JFRn0ke3ZhbHVlfWA7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGAke3ZhbHVlfWA7XG4gIH1cbn1cblxuZnVuY3Rpb24gdHlwZVJlZih0eXBlOiBDb21waWxlVHlwZU1ldGFkYXRhKTogc3RyaW5nIHtcbiAgcmV0dXJuIGAke21vZHVsZVJlZih0eXBlLm1vZHVsZVVybCl9JHt0eXBlLm5hbWV9YDtcbn1cblxuZnVuY3Rpb24gZ2V0Vmlld1R5cGUoY29tcG9uZW50OiBDb21waWxlRGlyZWN0aXZlTWV0YWRhdGEsIGVtYmVkZGVkVGVtcGxhdGVJbmRleDogbnVtYmVyKTogVmlld1R5cGUge1xuICBpZiAoZW1iZWRkZWRUZW1wbGF0ZUluZGV4ID4gMCkge1xuICAgIHJldHVybiBWaWV3VHlwZS5FTUJFRERFRDtcbiAgfSBlbHNlIGlmIChjb21wb25lbnQudHlwZS5pc0hvc3QpIHtcbiAgICByZXR1cm4gVmlld1R5cGUuSE9TVDtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gVmlld1R5cGUuQ09NUE9ORU5UO1xuICB9XG59XG4iXX0=