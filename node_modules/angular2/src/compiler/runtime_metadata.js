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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var di_1 = require('angular2/src/core/di');
var lang_1 = require('angular2/src/facade/lang');
var exceptions_1 = require('angular2/src/facade/exceptions');
var cpl = require('./directive_metadata');
var md = require('angular2/src/core/metadata/directives');
var directive_resolver_1 = require('angular2/src/core/linker/directive_resolver');
var pipe_resolver_1 = require('angular2/src/core/linker/pipe_resolver');
var view_resolver_1 = require('angular2/src/core/linker/view_resolver');
var directive_lifecycle_reflector_1 = require('angular2/src/core/linker/directive_lifecycle_reflector');
var interfaces_1 = require('angular2/src/core/linker/interfaces');
var reflection_1 = require('angular2/src/core/reflection/reflection');
var di_2 = require('angular2/src/core/di');
var platform_directives_and_pipes_1 = require('angular2/src/core/platform_directives_and_pipes');
var util_1 = require('./util');
var assertions_1 = require('./assertions');
var url_resolver_1 = require('angular2/src/compiler/url_resolver');
var RuntimeMetadataResolver = (function () {
    function RuntimeMetadataResolver(_directiveResolver, _pipeResolver, _viewResolver, _platformDirectives, _platformPipes) {
        this._directiveResolver = _directiveResolver;
        this._pipeResolver = _pipeResolver;
        this._viewResolver = _viewResolver;
        this._platformDirectives = _platformDirectives;
        this._platformPipes = _platformPipes;
        this._directiveCache = new Map();
        this._pipeCache = new Map();
        this._anonymousTypes = new Map();
        this._anonymousTypeIndex = 0;
    }
    /**
     * Wrap the stringify method to avoid naming things `function (arg1...) {`
     */
    RuntimeMetadataResolver.prototype.sanitizeName = function (obj) {
        var result = lang_1.stringify(obj);
        if (result.indexOf('(') < 0) {
            return result;
        }
        var found = this._anonymousTypes.get(obj);
        if (!found) {
            this._anonymousTypes.set(obj, this._anonymousTypeIndex++);
            found = this._anonymousTypes.get(obj);
        }
        return "anonymous_type_" + found + "_";
    };
    RuntimeMetadataResolver.prototype.getDirectiveMetadata = function (directiveType) {
        var meta = this._directiveCache.get(directiveType);
        if (lang_1.isBlank(meta)) {
            var dirMeta = this._directiveResolver.resolve(directiveType);
            var moduleUrl = null;
            var templateMeta = null;
            var changeDetectionStrategy = null;
            if (dirMeta instanceof md.ComponentMetadata) {
                assertions_1.assertArrayOfStrings('styles', dirMeta.styles);
                var cmpMeta = dirMeta;
                moduleUrl = calcModuleUrl(directiveType, cmpMeta);
                var viewMeta = this._viewResolver.resolve(directiveType);
                assertions_1.assertArrayOfStrings('styles', viewMeta.styles);
                templateMeta = new cpl.CompileTemplateMetadata({
                    encapsulation: viewMeta.encapsulation,
                    template: viewMeta.template,
                    templateUrl: viewMeta.templateUrl,
                    styles: viewMeta.styles,
                    styleUrls: viewMeta.styleUrls
                });
                changeDetectionStrategy = cmpMeta.changeDetection;
            }
            meta = cpl.CompileDirectiveMetadata.create({
                selector: dirMeta.selector,
                exportAs: dirMeta.exportAs,
                isComponent: lang_1.isPresent(templateMeta),
                dynamicLoadable: true,
                type: new cpl.CompileTypeMetadata({ name: this.sanitizeName(directiveType), moduleUrl: moduleUrl, runtime: directiveType }),
                template: templateMeta,
                changeDetection: changeDetectionStrategy,
                inputs: dirMeta.inputs,
                outputs: dirMeta.outputs,
                host: dirMeta.host,
                lifecycleHooks: interfaces_1.LIFECYCLE_HOOKS_VALUES.filter(function (hook) { return directive_lifecycle_reflector_1.hasLifecycleHook(hook, directiveType); })
            });
            this._directiveCache.set(directiveType, meta);
        }
        return meta;
    };
    RuntimeMetadataResolver.prototype.getPipeMetadata = function (pipeType) {
        var meta = this._pipeCache.get(pipeType);
        if (lang_1.isBlank(meta)) {
            var pipeMeta = this._pipeResolver.resolve(pipeType);
            var moduleUrl = reflection_1.reflector.importUri(pipeType);
            meta = new cpl.CompilePipeMetadata({
                type: new cpl.CompileTypeMetadata({ name: this.sanitizeName(pipeType), moduleUrl: moduleUrl, runtime: pipeType }),
                name: pipeMeta.name,
                pure: pipeMeta.pure
            });
            this._pipeCache.set(pipeType, meta);
        }
        return meta;
    };
    RuntimeMetadataResolver.prototype.getViewDirectivesMetadata = function (component) {
        var _this = this;
        var view = this._viewResolver.resolve(component);
        var directives = flattenDirectives(view, this._platformDirectives);
        for (var i = 0; i < directives.length; i++) {
            if (!isValidType(directives[i])) {
                throw new exceptions_1.BaseException("Unexpected directive value '" + lang_1.stringify(directives[i]) + "' on the View of component '" + lang_1.stringify(component) + "'");
            }
        }
        return directives.map(function (type) { return _this.getDirectiveMetadata(type); });
    };
    RuntimeMetadataResolver.prototype.getViewPipesMetadata = function (component) {
        var _this = this;
        var view = this._viewResolver.resolve(component);
        var pipes = flattenPipes(view, this._platformPipes);
        for (var i = 0; i < pipes.length; i++) {
            if (!isValidType(pipes[i])) {
                throw new exceptions_1.BaseException("Unexpected piped value '" + lang_1.stringify(pipes[i]) + "' on the View of component '" + lang_1.stringify(component) + "'");
            }
        }
        return pipes.map(function (type) { return _this.getPipeMetadata(type); });
    };
    RuntimeMetadataResolver = __decorate([
        di_2.Injectable(),
        __param(3, di_2.Optional()),
        __param(3, di_2.Inject(platform_directives_and_pipes_1.PLATFORM_DIRECTIVES)),
        __param(4, di_2.Optional()),
        __param(4, di_2.Inject(platform_directives_and_pipes_1.PLATFORM_PIPES)), 
        __metadata('design:paramtypes', [directive_resolver_1.DirectiveResolver, pipe_resolver_1.PipeResolver, view_resolver_1.ViewResolver, Array, Array])
    ], RuntimeMetadataResolver);
    return RuntimeMetadataResolver;
}());
exports.RuntimeMetadataResolver = RuntimeMetadataResolver;
function flattenDirectives(view, platformDirectives) {
    var directives = [];
    if (lang_1.isPresent(platformDirectives)) {
        flattenArray(platformDirectives, directives);
    }
    if (lang_1.isPresent(view.directives)) {
        flattenArray(view.directives, directives);
    }
    return directives;
}
function flattenPipes(view, platformPipes) {
    var pipes = [];
    if (lang_1.isPresent(platformPipes)) {
        flattenArray(platformPipes, pipes);
    }
    if (lang_1.isPresent(view.pipes)) {
        flattenArray(view.pipes, pipes);
    }
    return pipes;
}
function flattenArray(tree, out) {
    for (var i = 0; i < tree.length; i++) {
        var item = di_1.resolveForwardRef(tree[i]);
        if (lang_1.isArray(item)) {
            flattenArray(item, out);
        }
        else {
            out.push(item);
        }
    }
}
function isValidType(value) {
    return lang_1.isPresent(value) && (value instanceof lang_1.Type);
}
function calcModuleUrl(type, cmpMetadata) {
    var moduleId = cmpMetadata.moduleId;
    if (lang_1.isPresent(moduleId)) {
        var scheme = url_resolver_1.getUrlScheme(moduleId);
        return lang_1.isPresent(scheme) && scheme.length > 0 ? moduleId :
            "package:" + moduleId + util_1.MODULE_SUFFIX;
    }
    else {
        return reflection_1.reflector.importUri(type);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnVudGltZV9tZXRhZGF0YS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRpZmZpbmdfcGx1Z2luX3dyYXBwZXItb3V0cHV0X3BhdGgtamFrWG5NbUwudG1wL2FuZ3VsYXIyL3NyYy9jb21waWxlci9ydW50aW1lX21ldGFkYXRhLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFBQSxtQkFBZ0Msc0JBQXNCLENBQUMsQ0FBQTtBQUN2RCxxQkFPTywwQkFBMEIsQ0FBQyxDQUFBO0FBQ2xDLDJCQUE0QixnQ0FBZ0MsQ0FBQyxDQUFBO0FBQzdELElBQVksR0FBRyxXQUFNLHNCQUFzQixDQUFDLENBQUE7QUFDNUMsSUFBWSxFQUFFLFdBQU0sdUNBQXVDLENBQUMsQ0FBQTtBQUM1RCxtQ0FBZ0MsNkNBQTZDLENBQUMsQ0FBQTtBQUM5RSw4QkFBMkIsd0NBQXdDLENBQUMsQ0FBQTtBQUNwRSw4QkFBMkIsd0NBQXdDLENBQUMsQ0FBQTtBQUVwRSw4Q0FBK0Isd0RBQXdELENBQUMsQ0FBQTtBQUN4RiwyQkFBcUQscUNBQXFDLENBQUMsQ0FBQTtBQUMzRiwyQkFBd0IseUNBQXlDLENBQUMsQ0FBQTtBQUNsRSxtQkFBMkMsc0JBQXNCLENBQUMsQ0FBQTtBQUNsRSw4Q0FBa0QsaURBQWlELENBQUMsQ0FBQTtBQUNwRyxxQkFBNEIsUUFBUSxDQUFDLENBQUE7QUFDckMsMkJBQW1DLGNBQWMsQ0FBQyxDQUFBO0FBQ2xELDZCQUEyQixvQ0FBb0MsQ0FBQyxDQUFBO0FBR2hFO0lBTUUsaUNBQW9CLGtCQUFxQyxFQUFVLGFBQTJCLEVBQzFFLGFBQTJCLEVBQ2MsbUJBQTJCLEVBQ2hDLGNBQXNCO1FBSDFELHVCQUFrQixHQUFsQixrQkFBa0IsQ0FBbUI7UUFBVSxrQkFBYSxHQUFiLGFBQWEsQ0FBYztRQUMxRSxrQkFBYSxHQUFiLGFBQWEsQ0FBYztRQUNjLHdCQUFtQixHQUFuQixtQkFBbUIsQ0FBUTtRQUNoQyxtQkFBYyxHQUFkLGNBQWMsQ0FB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WSxXQUFJLENBQUMsQ0FBQztBQUNyRCxDQUFDO0FBRUQsdUJBQXVCLElBQVUsRUFBRSxXQUFpQztJQUNsRSxJQUFJLFFBQVEsR0FBRyxXQUFXLENBQUMsUUFBUSxDQUFDO0lBQ3BDLEVBQUUsQ0FBQyxDQUFDLGdCQUFTLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3hCLElBQUksTUFBTSxHQUFHLDJCQUFZLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDcEMsTUFBTSxDQUFDLGdCQUFTLENBQUMsTUFBTSxDQUFDLElBQUksTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLEdBQUcsUUFBUTtZQUNSLGFBQVcsUUFBUSxHQUFHLG9CQUFlLENBQUM7SUFDeEYsQ0FBQztJQUFDLElBQUksQ0FBQyxDQUFDO1FBQ04sTUFBTSxDQUFDLHNCQUFTLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ25DLENBQUM7QUFDSCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtyZXNvbHZlRm9yd2FyZFJlZn0gZnJvbSAnYW5ndWxhcjIvc3JjL2NvcmUvZGknO1xuaW1wb3J0IHtcbiAgVHlwZSxcbiAgaXNCbGFuayxcbiAgaXNQcmVzZW50LFxuICBpc0FycmF5LFxuICBzdHJpbmdpZnksXG4gIFJlZ0V4cFdyYXBwZXJcbn0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9sYW5nJztcbmltcG9ydCB7QmFzZUV4Y2VwdGlvbn0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9leGNlcHRpb25zJztcbmltcG9ydCAqIGFzIGNwbCBmcm9tICcuL2RpcmVjdGl2ZV9tZXRhZGF0YSc7XG5pbXBvcnQgKiBhcyBtZCBmcm9tICdhbmd1bGFyMi9zcmMvY29yZS9tZXRhZGF0YS9kaXJlY3RpdmVzJztcbmltcG9ydCB7RGlyZWN0aXZlUmVzb2x2ZXJ9IGZyb20gJ2FuZ3VsYXIyL3NyYy9jb3JlL2xpbmtlci9kaXJlY3RpdmVfcmVzb2x2ZXInO1xuaW1wb3J0IHtQaXBlUmVzb2x2ZXJ9IGZyb20gJ2FuZ3VsYXIyL3NyYy9jb3JlL2xpbmtlci9waXBlX3Jlc29sdmVyJztcbmltcG9ydCB7Vmlld1Jlc29sdmVyfSBmcm9tICdhbmd1bGFyMi9zcmMvY29yZS9saW5rZXIvdmlld19yZXNvbHZlcic7XG5pbXBvcnQge1ZpZXdNZXRhZGF0YX0gZnJvbSAnYW5ndWxhcjIvc3JjL2NvcmUvbWV0YWRhdGEvdmlldyc7XG5pbXBvcnQge2hhc0xpZmVjeWNsZUhvb2t9IGZyb20gJ2FuZ3VsYXIyL3NyYy9jb3JlL2xpbmtlci9kaXJlY3RpdmVfbGlmZWN5Y2xlX3JlZmxlY3Rvcic7XG5pbXBvcnQge0xpZmVjeWNsZUhvb2tzLCBMSUZFQ1lDTEVfSE9PS1NfVkFMVUVTfSBmcm9tICdhbmd1bGFyMi9zcmMvY29yZS9saW5rZXIvaW50ZXJmYWNlcyc7XG5pbXBvcnQge3JlZmxlY3Rvcn0gZnJvbSAnYW5ndWxhcjIvc3JjL2NvcmUvcmVmbGVjdGlvbi9yZWZsZWN0aW9uJztcbmltcG9ydCB7SW5qZWN0YWJsZSwgSW5qZWN0LCBPcHRpb25hbH0gZnJvbSAnYW5ndWxhcjIvc3JjL2NvcmUvZGknO1xuaW1wb3J0IHtQTEFURk9STV9ESVJFQ1RJVkVTLCBQTEFURk9STV9QSVBFU30gZnJvbSAnYW5ndWxhcjIvc3JjL2NvcmUvcGxhdGZvcm1fZGlyZWN0aXZlc19hbmRfcGlwZXMnO1xuaW1wb3J0IHtNT0RVTEVfU1VGRklYfSBmcm9tICcuL3V0aWwnO1xuaW1wb3J0IHthc3NlcnRBcnJheU9mU3RyaW5nc30gZnJvbSAnLi9hc3NlcnRpb25zJztcbmltcG9ydCB7Z2V0VXJsU2NoZW1lfSBmcm9tICdhbmd1bGFyMi9zcmMvY29tcGlsZXIvdXJsX3Jlc29sdmVyJztcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIFJ1bnRpbWVNZXRhZGF0YVJlc29sdmVyIHtcbiAgcHJpdmF0ZSBfZGlyZWN0aXZlQ2FjaGUgPSBuZXcgTWFwPFR5cGUsIGNwbC5Db21waWxlRGlyZWN0aXZlTWV0YWRhdGE+KCk7XG4gIHByaXZhdGUgX3BpcGVDYWNoZSA9IG5ldyBNYXA8VHlwZSwgY3BsLkNvbXBpbGVQaXBlTWV0YWRhdGE+KCk7XG4gIHByaXZhdGUgX2Fub255bW91c1R5cGVzID0gbmV3IE1hcDxPYmplY3QsIG51bWJlcj4oKTtcbiAgcHJpdmF0ZSBfYW5vbnltb3VzVHlwZUluZGV4ID0gMDtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9kaXJlY3RpdmVSZXNvbHZlcjogRGlyZWN0aXZlUmVzb2x2ZXIsIHByaXZhdGUgX3BpcGVSZXNvbHZlcjogUGlwZVJlc29sdmVyLFxuICAgICAgICAgICAgICBwcml2YXRlIF92aWV3UmVzb2x2ZXI6IFZpZXdSZXNvbHZlcixcbiAgICAgICAgICAgICAgQE9wdGlvbmFsKCkgQEluamVjdChQTEFURk9STV9ESVJFQ1RJVkVTKSBwcml2YXRlIF9wbGF0Zm9ybURpcmVjdGl2ZXM6IFR5cGVbXSxcbiAgICAgICAgICAgICAgQE9wdGlvbmFsKCkgQEluamVjdChQTEFURk9STV9QSVBFUykgcHJpdmF0ZSBfcGxhdGZvcm1QaXBlczogVHlwZVtdKSB7fVxuXG4gIC8qKlxuICAgKiBXcmFwIHRoZSBzdHJpbmdpZnkgbWV0aG9kIHRvIGF2b2lkIG5hbWluZyB0aGluZ3MgYGZ1bmN0aW9uIChhcmcxLi4uKSB7YFxuICAgKi9cbiAgcHJpdmF0ZSBzYW5pdGl6ZU5hbWUob2JqOiBhbnkpOiBzdHJpbmcge1xuICAgIGxldCByZXN1bHQgPSBzdHJpbmdpZnkob2JqKTtcbiAgICBpZiAocmVzdWx0LmluZGV4T2YoJygnKSA8IDApIHtcbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuICAgIGxldCBmb3VuZCA9IHRoaXMuX2Fub255bW91c1R5cGVzLmdldChvYmopO1xuICAgIGlmICghZm91bmQpIHtcbiAgICAgIHRoaXMuX2Fub255bW91c1R5cGVzLnNldChvYmosIHRoaXMuX2Fub255bW91c1R5cGVJbmRleCsrKTtcbiAgICAgIGZvdW5kID0gdGhpcy5fYW5vbnltb3VzVHlwZXMuZ2V0KG9iaik7XG4gICAgfVxuICAgIHJldHVybiBgYW5vbnltb3VzX3R5cGVfJHtmb3VuZH1fYDtcbiAgfVxuXG4gIGdldERpcmVjdGl2ZU1ldGFkYXRhKGRpcmVjdGl2ZVR5cGU6IFR5cGUpOiBjcGwuQ29tcGlsZURpcmVjdGl2ZU1ldGFkYXRhIHtcbiAgICB2YXIgbWV0YSA9IHRoaXMuX2RpcmVjdGl2ZUNhY2hlLmdldChkaXJlY3RpdmVUeXBlKTtcbiAgICBpZiAoaXNCbGFuayhtZXRhKSkge1xuICAgICAgdmFyIGRpck1ldGEgPSB0aGlzLl9kaXJlY3RpdmVSZXNvbHZlci5yZXNvbHZlKGRpcmVjdGl2ZVR5cGUpO1xuICAgICAgdmFyIG1vZHVsZVVybCA9IG51bGw7XG4gICAgICB2YXIgdGVtcGxhdGVNZXRhID0gbnVsbDtcbiAgICAgIHZhciBjaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSA9IG51bGw7XG5cbiAgICAgIGlmIChkaXJNZXRhIGluc3RhbmNlb2YgbWQuQ29tcG9uZW50TWV0YWRhdGEpIHtcbiAgICAgICAgYXNzZXJ0QXJyYXlPZlN0cmluZ3MoJ3N0eWxlcycsIGRpck1ldGEuc3R5bGVzKTtcbiAgICAgICAgdmFyIGNtcE1ldGEgPSA8bWQuQ29tcG9uZW50TWV0YWRhdGE+ZGlyTWV0YTtcbiAgICAgICAgbW9kdWxlVXJsID0gY2FsY01vZHVsZVVybChkaXJlY3RpdmVUeXBlLCBjbXBNZXRhKTtcbiAgICAgICAgdmFyIHZpZXdNZXRhID0gdGhpcy5fdmlld1Jlc29sdmVyLnJlc29sdmUoZGlyZWN0aXZlVHlwZSk7XG4gICAgICAgIGFzc2VydEFycmF5T2ZTdHJpbmdzKCdzdHlsZXMnLCB2aWV3TWV0YS5zdHlsZXMpO1xuICAgICAgICB0ZW1wbGF0ZU1ldGEgPSBuZXcgY3BsLkNvbXBpbGVUZW1wbGF0ZU1ldGFkYXRhKHtcbiAgICAgICAgICBlbmNhcHN1bGF0aW9uOiB2aWV3TWV0YS5lbmNhcHN1bGF0aW9uLFxuICAgICAgICAgIHRlbXBsYXRlOiB2aWV3TWV0YS50ZW1wbGF0ZSxcbiAgICAgICAgICB0ZW1wbGF0ZVVybDogdmlld01ldGEudGVtcGxhdGVVcmwsXG4gICAgICAgICAgc3R5bGVzOiB2aWV3TWV0YS5zdHlsZXMsXG4gICAgICAgICAgc3R5bGVVcmxzOiB2aWV3TWV0YS5zdHlsZVVybHNcbiAgICAgICAgfSk7XG4gICAgICAgIGNoYW5nZURldGVjdGlvblN0cmF0ZWd5ID0gY21wTWV0YS5jaGFuZ2VEZXRlY3Rpb247XG4gICAgICB9XG4gICAgICBtZXRhID0gY3BsLkNvbXBpbGVEaXJlY3RpdmVNZXRhZGF0YS5jcmVhdGUoe1xuICAgICAgICBzZWxlY3RvcjogZGlyTWV0YS5zZWxlY3RvcixcbiAgICAgICAgZXhwb3J0QXM6IGRpck1ldGEuZXhwb3J0QXMsXG4gICAgICAgIGlzQ29tcG9uZW50OiBpc1ByZXNlbnQodGVtcGxhdGVNZXRhKSxcbiAgICAgICAgZHluYW1pY0xvYWRhYmxlOiB0cnVlLFxuICAgICAgICB0eXBlOiBuZXcgY3BsLkNvbXBpbGVUeXBlTWV0YWRhdGEoXG4gICAgICAgICAgICB7bmFtZTogdGhpcy5zYW5pdGl6ZU5hbWUoZGlyZWN0aXZlVHlwZSksIG1vZHVsZVVybDogbW9kdWxlVXJsLCBydW50aW1lOiBkaXJlY3RpdmVUeXBlfSksXG4gICAgICAgIHRlbXBsYXRlOiB0ZW1wbGF0ZU1ldGEsXG4gICAgICAgIGNoYW5nZURldGVjdGlvbjogY2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gICAgICAgIGlucHV0czogZGlyTWV0YS5pbnB1dHMsXG4gICAgICAgIG91dHB1dHM6IGRpck1ldGEub3V0cHV0cyxcbiAgICAgICAgaG9zdDogZGlyTWV0YS5ob3N0LFxuICAgICAgICBsaWZlY3ljbGVIb29rczogTElGRUNZQ0xFX0hPT0tTX1ZBTFVFUy5maWx0ZXIoaG9vayA9PiBoYXNMaWZlY3ljbGVIb29rKGhvb2ssIGRpcmVjdGl2ZVR5cGUpKVxuICAgICAgfSk7XG4gICAgICB0aGlzLl9kaXJlY3RpdmVDYWNoZS5zZXQoZGlyZWN0aXZlVHlwZSwgbWV0YSk7XG4gICAgfVxuICAgIHJldHVybiBtZXRhO1xuICB9XG5cbiAgZ2V0UGlwZU1ldGFkYXRhKHBpcGVUeXBlOiBUeXBlKTogY3BsLkNvbXBpbGVQaXBlTWV0YWRhdGEge1xuICAgIHZhciBtZXRhID0gdGhpcy5fcGlwZUNhY2hlLmdldChwaXBlVHlwZSk7XG4gICAgaWYgKGlzQmxhbmsobWV0YSkpIHtcbiAgICAgIHZhciBwaXBlTWV0YSA9IHRoaXMuX3BpcGVSZXNvbHZlci5yZXNvbHZlKHBpcGVUeXBlKTtcbiAgICAgIHZhciBtb2R1bGVVcmwgPSByZWZsZWN0b3IuaW1wb3J0VXJpKHBpcGVUeXBlKTtcbiAgICAgIG1ldGEgPSBuZXcgY3BsLkNvbXBpbGVQaXBlTWV0YWRhdGEoe1xuICAgICAgICB0eXBlOiBuZXcgY3BsLkNvbXBpbGVUeXBlTWV0YWRhdGEoXG4gICAgICAgICAgICB7bmFtZTogdGhpcy5zYW5pdGl6ZU5hbWUocGlwZVR5cGUpLCBtb2R1bGVVcmw6IG1vZHVsZVVybCwgcnVudGltZTogcGlwZVR5cGV9KSxcbiAgICAgICAgbmFtZTogcGlwZU1ldGEubmFtZSxcbiAgICAgICAgcHVyZTogcGlwZU1ldGEucHVyZVxuICAgICAgfSk7XG4gICAgICB0aGlzLl9waXBlQ2FjaGUuc2V0KHBpcGVUeXBlLCBtZXRhKTtcbiAgICB9XG4gICAgcmV0dXJuIG1ldGE7XG4gIH1cblxuICBnZXRWaWV3RGlyZWN0aXZlc01ldGFkYXRhKGNvbXBvbmVudDogVHlwZSk6IGNwbC5Db21waWxlRGlyZWN0aXZlTWV0YWRhdGFbXSB7XG4gICAgdmFyIHZpZXcgPSB0aGlzLl92aWV3UmVzb2x2ZXIucmVzb2x2ZShjb21wb25lbnQpO1xuICAgIHZhciBkaXJlY3RpdmVzID0gZmxhdHRlbkRpcmVjdGl2ZXModmlldywgdGhpcy5fcGxhdGZvcm1EaXJlY3RpdmVzKTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGRpcmVjdGl2ZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmICghaXNWYWxpZFR5cGUoZGlyZWN0aXZlc1tpXSkpIHtcbiAgICAgICAgdGhyb3cgbmV3IEJhc2VFeGNlcHRpb24oXG4gICAgICAgICAgICBgVW5leHBlY3RlZCBkaXJlY3RpdmUgdmFsdWUgJyR7c3RyaW5naWZ5KGRpcmVjdGl2ZXNbaV0pfScgb24gdGhlIFZpZXcgb2YgY29tcG9uZW50ICcke3N0cmluZ2lmeShjb21wb25lbnQpfSdgKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZGlyZWN0aXZlcy5tYXAodHlwZSA9PiB0aGlzLmdldERpcmVjdGl2ZU1ldGFkYXRhKHR5cGUpKTtcbiAgfVxuXG4gIGdldFZpZXdQaXBlc01ldGFkYXRhKGNvbXBvbmVudDogVHlwZSk6IGNwbC5Db21waWxlUGlwZU1ldGFkYXRhW10ge1xuICAgIHZhciB2aWV3ID0gdGhpcy5fdmlld1Jlc29sdmVyLnJlc29sdmUoY29tcG9uZW50KTtcbiAgICB2YXIgcGlwZXMgPSBmbGF0dGVuUGlwZXModmlldywgdGhpcy5fcGxhdGZvcm1QaXBlcyk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwaXBlcy5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKCFpc1ZhbGlkVHlwZShwaXBlc1tpXSkpIHtcbiAgICAgICAgdGhyb3cgbmV3IEJhc2VFeGNlcHRpb24oXG4gICAgICAgICAgICBgVW5leHBlY3RlZCBwaXBlZCB2YWx1ZSAnJHtzdHJpbmdpZnkocGlwZXNbaV0pfScgb24gdGhlIFZpZXcgb2YgY29tcG9uZW50ICcke3N0cmluZ2lmeShjb21wb25lbnQpfSdgKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHBpcGVzLm1hcCh0eXBlID0+IHRoaXMuZ2V0UGlwZU1ldGFkYXRhKHR5cGUpKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBmbGF0dGVuRGlyZWN0aXZlcyh2aWV3OiBWaWV3TWV0YWRhdGEsIHBsYXRmb3JtRGlyZWN0aXZlczogYW55W10pOiBUeXBlW10ge1xuICBsZXQgZGlyZWN0aXZlcyA9IFtdO1xuICBpZiAoaXNQcmVzZW50KHBsYXRmb3JtRGlyZWN0aXZlcykpIHtcbiAgICBmbGF0dGVuQXJyYXkocGxhdGZvcm1EaXJlY3RpdmVzLCBkaXJlY3RpdmVzKTtcbiAgfVxuICBpZiAoaXNQcmVzZW50KHZpZXcuZGlyZWN0aXZlcykpIHtcbiAgICBmbGF0dGVuQXJyYXkodmlldy5kaXJlY3RpdmVzLCBkaXJlY3RpdmVzKTtcbiAgfVxuICByZXR1cm4gZGlyZWN0aXZlcztcbn1cblxuZnVuY3Rpb24gZmxhdHRlblBpcGVzKHZpZXc6IFZpZXdNZXRhZGF0YSwgcGxhdGZvcm1QaXBlczogYW55W10pOiBUeXBlW10ge1xuICBsZXQgcGlwZXMgPSBbXTtcbiAgaWYgKGlzUHJlc2VudChwbGF0Zm9ybVBpcGVzKSkge1xuICAgIGZsYXR0ZW5BcnJheShwbGF0Zm9ybVBpcGVzLCBwaXBlcyk7XG4gIH1cbiAgaWYgKGlzUHJlc2VudCh2aWV3LnBpcGVzKSkge1xuICAgIGZsYXR0ZW5BcnJheSh2aWV3LnBpcGVzLCBwaXBlcyk7XG4gIH1cbiAgcmV0dXJuIHBpcGVzO1xufVxuXG5mdW5jdGlvbiBmbGF0dGVuQXJyYXkodHJlZTogYW55W10sIG91dDogQXJyYXk8VHlwZSB8IGFueVtdPik6IHZvaWQge1xuICBmb3IgKHZhciBpID0gMDsgaSA8IHRyZWUubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgaXRlbSA9IHJlc29sdmVGb3J3YXJkUmVmKHRyZWVbaV0pO1xuICAgIGlmIChpc0FycmF5KGl0ZW0pKSB7XG4gICAgICBmbGF0dGVuQXJyYXkoaXRlbSwgb3V0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgb3V0LnB1c2goaXRlbSk7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIGlzVmFsaWRUeXBlKHZhbHVlOiBUeXBlKTogYm9vbGVhbiB7XG4gIHJldHVybiBpc1ByZXNlbnQodmFsdWUpICYmICh2YWx1ZSBpbnN0YW5jZW9mIFR5cGUpO1xufVxuXG5mdW5jdGlvbiBjYWxjTW9kdWxlVXJsKHR5cGU6IFR5cGUsIGNtcE1ldGFkYXRhOiBtZC5Db21wb25lbnRNZXRhZGF0YSk6IHN0cmluZyB7XG4gIHZhciBtb2R1bGVJZCA9IGNtcE1ldGFkYXRhLm1vZHVsZUlkO1xuICBpZiAoaXNQcmVzZW50KG1vZHVsZUlkKSkge1xuICAgIHZhciBzY2hlbWUgPSBnZXRVcmxTY2hlbWUobW9kdWxlSWQpO1xuICAgIHJldHVybiBpc1ByZXNlbnQoc2NoZW1lKSAmJiBzY2hlbWUubGVuZ3RoID4gMCA/IG1vZHVsZUlkIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBgcGFja2FnZToke21vZHVsZUlkfSR7TU9EVUxFX1NVRkZJWH1gO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiByZWZsZWN0b3IuaW1wb3J0VXJpKHR5cGUpO1xuICB9XG59XG4iXX0=