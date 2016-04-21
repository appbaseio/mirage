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
var source_module_1 = require('./source_module');
var view_1 = require('angular2/src/core/metadata/view');
var xhr_1 = require('angular2/src/compiler/xhr');
var lang_1 = require('angular2/src/facade/lang');
var async_1 = require('angular2/src/facade/async');
var shadow_css_1 = require('angular2/src/compiler/shadow_css');
var url_resolver_1 = require('angular2/src/compiler/url_resolver');
var style_url_resolver_1 = require('./style_url_resolver');
var util_1 = require('./util');
var di_1 = require('angular2/src/core/di');
var COMPONENT_VARIABLE = '%COMP%';
var HOST_ATTR = "_nghost-" + COMPONENT_VARIABLE;
var CONTENT_ATTR = "_ngcontent-" + COMPONENT_VARIABLE;
var StyleCompiler = (function () {
    function StyleCompiler(_xhr, _urlResolver) {
        this._xhr = _xhr;
        this._urlResolver = _urlResolver;
        this._styleCache = new Map();
        this._shadowCss = new shadow_css_1.ShadowCss();
    }
    StyleCompiler.prototype.compileComponentRuntime = function (template) {
        var styles = template.styles;
        var styleAbsUrls = template.styleUrls;
        return this._loadStyles(styles, styleAbsUrls, template.encapsulation === view_1.ViewEncapsulation.Emulated);
    };
    StyleCompiler.prototype.compileComponentCodeGen = function (template) {
        var shim = template.encapsulation === view_1.ViewEncapsulation.Emulated;
        return this._styleCodeGen(template.styles, template.styleUrls, shim);
    };
    StyleCompiler.prototype.compileStylesheetCodeGen = function (stylesheetUrl, cssText) {
        var styleWithImports = style_url_resolver_1.extractStyleUrls(this._urlResolver, stylesheetUrl, cssText);
        return [
            this._styleModule(stylesheetUrl, false, this._styleCodeGen([styleWithImports.style], styleWithImports.styleUrls, false)),
            this._styleModule(stylesheetUrl, true, this._styleCodeGen([styleWithImports.style], styleWithImports.styleUrls, true))
        ];
    };
    StyleCompiler.prototype.clearCache = function () { this._styleCache.clear(); };
    StyleCompiler.prototype._loadStyles = function (plainStyles, absUrls, encapsulate) {
        var _this = this;
        var promises = absUrls.map(function (absUrl) {
            var cacheKey = "" + absUrl + (encapsulate ? '.shim' : '');
            var result = _this._styleCache.get(cacheKey);
            if (lang_1.isBlank(result)) {
                result = _this._xhr.get(absUrl).then(function (style) {
                    var styleWithImports = style_url_resolver_1.extractStyleUrls(_this._urlResolver, absUrl, style);
                    return _this._loadStyles([styleWithImports.style], styleWithImports.styleUrls, encapsulate);
                });
                _this._styleCache.set(cacheKey, result);
            }
            return result;
        });
        return async_1.PromiseWrapper.all(promises).then(function (nestedStyles) {
            var result = plainStyles.map(function (plainStyle) { return _this._shimIfNeeded(plainStyle, encapsulate); });
            nestedStyles.forEach(function (styles) { return result.push(styles); });
            return result;
        });
    };
    StyleCompiler.prototype._styleCodeGen = function (plainStyles, absUrls, shim) {
        var _this = this;
        var arrayPrefix = lang_1.IS_DART ? "const" : '';
        var styleExpressions = plainStyles.map(function (plainStyle) { return util_1.escapeSingleQuoteString(_this._shimIfNeeded(plainStyle, shim)); });
        for (var i = 0; i < absUrls.length; i++) {
            var moduleUrl = this._createModuleUrl(absUrls[i], shim);
            styleExpressions.push(source_module_1.moduleRef(moduleUrl) + "STYLES");
        }
        var expressionSource = arrayPrefix + " [" + styleExpressions.join(',') + "]";
        return new source_module_1.SourceExpression([], expressionSource);
    };
    StyleCompiler.prototype._styleModule = function (stylesheetUrl, shim, expression) {
        var moduleSource = "\n      " + expression.declarations.join('\n') + "\n      " + util_1.codeGenExportVariable('STYLES') + expression.expression + ";\n    ";
        return new source_module_1.SourceModule(this._createModuleUrl(stylesheetUrl, shim), moduleSource);
    };
    StyleCompiler.prototype._shimIfNeeded = function (style, shim) {
        return shim ? this._shadowCss.shimCssText(style, CONTENT_ATTR, HOST_ATTR) : style;
    };
    StyleCompiler.prototype._createModuleUrl = function (stylesheetUrl, shim) {
        return shim ? stylesheetUrl + ".shim" + util_1.MODULE_SUFFIX : "" + stylesheetUrl + util_1.MODULE_SUFFIX;
    };
    StyleCompiler = __decorate([
        di_1.Injectable(), 
        __metadata('design:paramtypes', [xhr_1.XHR, url_resolver_1.UrlResolver])
    ], StyleCompiler);
    return StyleCompiler;
}());
exports.StyleCompiler = StyleCompiler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3R5bGVfY29tcGlsZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJkaWZmaW5nX3BsdWdpbl93cmFwcGVyLW91dHB1dF9wYXRoLWpha1huTW1MLnRtcC9hbmd1bGFyMi9zcmMvY29tcGlsZXIvc3R5bGVfY29tcGlsZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUNBLDhCQUF3RCxpQkFBaUIsQ0FBQyxDQUFBO0FBQzFFLHFCQUFnQyxpQ0FBaUMsQ0FBQyxDQUFBO0FBQ2xFLG9CQUFrQiwyQkFBMkIsQ0FBQyxDQUFBO0FBQzlDLHFCQUE4QywwQkFBMEIsQ0FBQyxDQUFBO0FBQ3pFLHNCQUE2QiwyQkFBMkIsQ0FBQyxDQUFBO0FBQ3pELDJCQUF3QixrQ0FBa0MsQ0FBQyxDQUFBO0FBQzNELDZCQUEwQixvQ0FBb0MsQ0FBQyxDQUFBO0FBQy9ELG1DQUErQixzQkFBc0IsQ0FBQyxDQUFBO0FBQ3RELHFCQUtPLFFBQVEsQ0FBQyxDQUFBO0FBQ2hCLG1CQUF5QixzQkFBc0IsQ0FBQyxDQUFBO0FBRWhELElBQU0sa0JBQWtCLEdBQUcsUUFBUSxDQUFDO0FBQ3BDLElBQU0sU0FBUyxHQUFHLGFBQVcsa0JBQW9CLENBQUM7QUFDbEQsSUFBTSxZQUFZLEdBQUcsZ0JBQWMsa0JBQW9CLENBQUM7QUFHeEQ7SUFJRSx1QkFBb0IsSUFBUyxFQUFVLFlBQXlCO1FBQTVDLFNBQUksR0FBSixJQUFJLENBQUs7UUFBVSxpQkFBWSxHQUFaLFlBQVksQ0FBYTtRQUh4RCxnQkFBVyxHQUFtQyxJQUFJLEdBQUcsRUFBNkIsQ0FBQztRQUNuRixlQUFVLEdBQWMsSUFBSSxzQkFBUyxFQUFFLENBQUM7SUFFbUIsQ0FBQztJQUVwRSwrQ0FBdUIsR0FBdkIsVUFBd0IsUUFBaUM7UUFDdkQsSUFBSSxNQUFNLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQztRQUM3QixJQUFJLFlBQVksR0FBRyxRQUFRLENBQUMsU0FBUyxDQUFDO1FBQ3RDLE1BQU0sQ0FBQyxJ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Q0FBQyxJQUFJLDRCQUFZLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsRUFBRSxZQUFZLENBQUMsQ0FBQztJQUNwRixDQUFDO0lBRU8scUNBQWEsR0FBckIsVUFBc0IsS0FBYSxFQUFFLElBQWE7UUFDaEQsTUFBTSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxLQUFLLEVBQUUsWUFBWSxFQUFFLFNBQVMsQ0FBQyxHQUFHLEtBQUssQ0FBQztJQUNwRixDQUFDO0lBRU8sd0NBQWdCLEdBQXhCLFVBQXlCLGFBQXFCLEVBQUUsSUFBYTtRQUMzRCxNQUFNLENBQUMsSUFBSSxHQUFNLGFBQWEsYUFBUSxvQkFBZSxHQUFHLEtBQUcsYUFBYSxHQUFHLG9CQUFlLENBQUM7SUFDN0YsQ0FBQztJQW5GSDtRQUFDLGVBQVUsRUFBRTs7cUJBQUE7SUFvRmIsb0JBQUM7QUFBRCxDQUFDLEFBbkZELElBbUZDO0FBbkZZLHFCQUFhLGdCQW1GekIsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7Q29tcGlsZVR5cGVNZXRhZGF0YSwgQ29tcGlsZVRlbXBsYXRlTWV0YWRhdGF9IGZyb20gJy4vZGlyZWN0aXZlX21ldGFkYXRhJztcbmltcG9ydCB7U291cmNlTW9kdWxlLCBTb3VyY2VFeHByZXNzaW9uLCBtb2R1bGVSZWZ9IGZyb20gJy4vc291cmNlX21vZHVsZSc7XG5pbXBvcnQge1ZpZXdFbmNhcHN1bGF0aW9ufSBmcm9tICdhbmd1bGFyMi9zcmMvY29yZS9tZXRhZGF0YS92aWV3JztcbmltcG9ydCB7WEhSfSBmcm9tICdhbmd1bGFyMi9zcmMvY29tcGlsZXIveGhyJztcbmltcG9ydCB7SVNfREFSVCwgU3RyaW5nV3JhcHBlciwgaXNCbGFua30gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9sYW5nJztcbmltcG9ydCB7UHJvbWlzZVdyYXBwZXJ9IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvYXN5bmMnO1xuaW1wb3J0IHtTaGFkb3dDc3N9IGZyb20gJ2FuZ3VsYXIyL3NyYy9jb21waWxlci9zaGFkb3dfY3NzJztcbmltcG9ydCB7VXJsUmVzb2x2ZXJ9IGZyb20gJ2FuZ3VsYXIyL3NyYy9jb21waWxlci91cmxfcmVzb2x2ZXInO1xuaW1wb3J0IHtleHRyYWN0U3R5bGVVcmxzfSBmcm9tICcuL3N0eWxlX3VybF9yZXNvbHZlcic7XG5pbXBvcnQge1xuICBlc2NhcGVTaW5nbGVRdW90ZVN0cmluZyxcbiAgY29kZUdlbkV4cG9ydFZhcmlhYmxlLFxuICBjb2RlR2VuVG9TdHJpbmcsXG4gIE1PRFVMRV9TVUZGSVhcbn0gZnJvbSAnLi91dGlsJztcbmltcG9ydCB7SW5qZWN0YWJsZX0gZnJvbSAnYW5ndWxhcjIvc3JjL2NvcmUvZGknO1xuXG5jb25zdCBDT01QT05FTlRfVkFSSUFCTEUgPSAnJUNPTVAlJztcbmNvbnN0IEhPU1RfQVRUUiA9IGBfbmdob3N0LSR7Q09NUE9ORU5UX1ZBUklBQkxFfWA7XG5jb25zdCBDT05URU5UX0FUVFIgPSBgX25nY29udGVudC0ke0NPTVBPTkVOVF9WQVJJQUJMRX1gO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgU3R5bGVDb21waWxlciB7XG4gIHByaXZhdGUgX3N0eWxlQ2FjaGU6IE1hcDxzdHJpbmcsIFByb21pc2U8c3RyaW5nW10+PiA9IG5ldyBNYXA8c3RyaW5nLCBQcm9taXNlPHN0cmluZ1tdPj4oKTtcbiAgcHJpdmF0ZSBfc2hhZG93Q3NzOiBTaGFkb3dDc3MgPSBuZXcgU2hhZG93Q3NzKCk7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBfeGhyOiBYSFIsIHByaXZhdGUgX3VybFJlc29sdmVyOiBVcmxSZXNvbHZlcikge31cblxuICBjb21waWxlQ29tcG9uZW50UnVudGltZSh0ZW1wbGF0ZTogQ29tcGlsZVRlbXBsYXRlTWV0YWRhdGEpOiBQcm9taXNlPEFycmF5PHN0cmluZyB8IGFueVtdPj4ge1xuICAgIHZhciBzdHlsZXMgPSB0ZW1wbGF0ZS5zdHlsZXM7XG4gICAgdmFyIHN0eWxlQWJzVXJscyA9IHRlbXBsYXRlLnN0eWxlVXJscztcbiAgICByZXR1cm4gdGhpcy5fbG9hZFN0eWxlcyhzdHlsZXMsIHN0eWxlQWJzVXJscyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZS5lbmNhcHN1bGF0aW9uID09PSBWaWV3RW5jYXBzdWxhdGlvbi5FbXVsYXRlZCk7XG4gIH1cblxuICBjb21waWxlQ29tcG9uZW50Q29kZUdlbih0ZW1wbGF0ZTogQ29tcGlsZVRlbXBsYXRlTWV0YWRhdGEpOiBTb3VyY2VFeHByZXNzaW9uIHtcbiAgICB2YXIgc2hpbSA9IHRlbXBsYXRlLmVuY2Fwc3VsYXRpb24gPT09IFZpZXdFbmNhcHN1bGF0aW9uLkVtdWxhdGVkO1xuICAgIHJldHVybiB0aGlzLl9zdHlsZUNvZGVHZW4odGVtcGxhdGUuc3R5bGVzLCB0ZW1wbGF0ZS5zdHlsZVVybHMsIHNoaW0pO1xuICB9XG5cbiAgY29tcGlsZVN0eWxlc2hlZXRDb2RlR2VuKHN0eWxlc2hlZXRVcmw6IHN0cmluZywgY3NzVGV4dDogc3RyaW5nKTogU291cmNlTW9kdWxlW10ge1xuICAgIHZhciBzdHlsZVdpdGhJbXBvcnRzID0gZXh0cmFjdFN0eWxlVXJscyh0aGlzLl91cmxSZXNvbHZlciwgc3R5bGVzaGVldFVybCwgY3NzVGV4dCk7XG4gICAgcmV0dXJuIFtcbiAgICAgIHRoaXMuX3N0eWxlTW9kdWxlKFxuICAgICAgICAgIHN0eWxlc2hlZXRVcmwsIGZhbHNlLFxuICAgICAgICAgIHRoaXMuX3N0eWxlQ29kZUdlbihbc3R5bGVXaXRoSW1wb3J0cy5zdHlsZV0sIHN0eWxlV2l0aEltcG9ydHMuc3R5bGVVcmxzLCBmYWxzZSkpLFxuICAgICAgdGhpcy5fc3R5bGVNb2R1bGUoc3R5bGVzaGVldFVybCwgdHJ1ZSwgdGhpcy5fc3R5bGVDb2RlR2VuKFtzdHlsZVdpdGhJbXBvcnRzLnN0eWxlXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZVdpdGhJbXBvcnRzLnN0eWxlVXJscywgdHJ1ZSkpXG4gICAgXTtcbiAgfVxuXG4gIGNsZWFyQ2FjaGUoKSB7IHRoaXMuX3N0eWxlQ2FjaGUuY2xlYXIoKTsgfVxuXG4gIHByaXZhdGUgX2xvYWRTdHlsZXMocGxhaW5TdHlsZXM6IHN0cmluZ1tdLCBhYnNVcmxzOiBzdHJpbmdbXSxcbiAgICAgICAgICAgICAgICAgICAgICBlbmNhcHN1bGF0ZTogYm9vbGVhbik6IFByb21pc2U8QXJyYXk8c3RyaW5nIHwgYW55W10+PiB7XG4gICAgdmFyIHByb21pc2VzOiBQcm9taXNlPHN0cmluZ1tdPltdID0gYWJzVXJscy5tYXAoKGFic1VybDogc3RyaW5nKTogUHJvbWlzZTxzdHJpbmdbXT4gPT4ge1xuICAgICAgdmFyIGNhY2hlS2V5ID0gYCR7YWJzVXJsfSR7ZW5jYXBzdWxhdGUgPyAnLnNoaW0nIDogJyd9YDtcbiAgICAgIHZhciByZXN1bHQ6IFByb21pc2U8c3RyaW5nW10+ID0gdGhpcy5fc3R5bGVDYWNoZS5nZXQoY2FjaGVLZXkpO1xuICAgICAgaWYgKGlzQmxhbmsocmVzdWx0KSkge1xuICAgICAgICByZXN1bHQgPSB0aGlzLl94aHIuZ2V0KGFic1VybCkudGhlbigoc3R5bGUpID0+IHtcbiAgICAgICAgICB2YXIgc3R5bGVXaXRoSW1wb3J0cyA9IGV4dHJhY3RTdHlsZVVybHModGhpcy5fdXJsUmVzb2x2ZXIsIGFic1VybCwgc3R5bGUpO1xuICAgICAgICAgIHJldHVybiB0aGlzLl9sb2FkU3R5bGVzKFtzdHlsZVdpdGhJbXBvcnRzLnN0eWxlXSwgc3R5bGVXaXRoSW1wb3J0cy5zdHlsZVVybHMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5jYXBzdWxhdGUpO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5fc3R5bGVDYWNoZS5zZXQoY2FjaGVLZXksIHJlc3VsdCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH0pO1xuICAgIHJldHVybiBQcm9taXNlV3JhcHBlci5hbGw8c3RyaW5nW10+KHByb21pc2VzKS50aGVuKChuZXN0ZWRTdHlsZXM6IHN0cmluZ1tdW10pID0+IHtcbiAgICAgIHZhciByZXN1bHQ6IEFycmF5PHN0cmluZyB8IGFueVtdPiA9XG4gICAgICAgICAgcGxhaW5TdHlsZXMubWFwKHBsYWluU3R5bGUgPT4gdGhpcy5fc2hpbUlmTmVlZGVkKHBsYWluU3R5bGUsIGVuY2Fwc3VsYXRlKSk7XG4gICAgICBuZXN0ZWRTdHlsZXMuZm9yRWFjaChzdHlsZXMgPT4gcmVzdWx0LnB1c2goc3R5bGVzKSk7XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBfc3R5bGVDb2RlR2VuKHBsYWluU3R5bGVzOiBzdHJpbmdbXSwgYWJzVXJsczogc3RyaW5nW10sIHNoaW06IGJvb2xlYW4pOiBTb3VyY2VFeHByZXNzaW9uIHtcbiAgICB2YXIgYXJyYXlQcmVmaXggPSBJU19EQVJUID8gYGNvbnN0YCA6ICcnO1xuICAgIHZhciBzdHlsZUV4cHJlc3Npb25zID0gcGxhaW5TdHlsZXMubWFwKFxuICAgICAgICBwbGFpblN0eWxlID0+IGVzY2FwZVNpbmdsZVF1b3RlU3RyaW5nKHRoaXMuX3NoaW1JZk5lZWRlZChwbGFpblN0eWxlLCBzaGltKSkpO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhYnNVcmxzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgbW9kdWxlVXJsID0gdGhpcy5fY3JlYXRlTW9kdWxlVXJsKGFic1VybHNbaV0sIHNoaW0pO1xuICAgICAgc3R5bGVFeHByZXNzaW9ucy5wdXNoKGAke21vZHVsZVJlZihtb2R1bGVVcmwpfVNUWUxFU2ApO1xuICAgIH1cbiAgICB2YXIgZXhwcmVzc2lvblNvdXJjZSA9IGAke2FycmF5UHJlZml4fSBbJHtzdHlsZUV4cHJlc3Npb25zLmpvaW4oJywnKX1dYDtcbiAgICByZXR1cm4gbmV3IFNvdXJjZUV4cHJlc3Npb24oW10sIGV4cHJlc3Npb25Tb3VyY2UpO1xuICB9XG5cbiAgcHJpdmF0ZSBfc3R5bGVNb2R1bGUoc3R5bGVzaGVldFVybDogc3RyaW5nLCBzaGltOiBib29sZWFuLFxuICAgICAgICAgICAgICAgICAgICAgICBleHByZXNzaW9uOiBTb3VyY2VFeHByZXNzaW9uKTogU291cmNlTW9kdWxlIHtcbiAgICB2YXIgbW9kdWxlU291cmNlID0gYFxuICAgICAgJHtleHByZXNzaW9uLmRlY2xhcmF0aW9ucy5qb2luKCdcXG4nKX1cbiAgICAgICR7Y29kZUdlbkV4cG9ydFZhcmlhYmxlKCdTVFlMRVMnKX0ke2V4cHJlc3Npb24uZXhwcmVzc2lvbn07XG4gICAgYDtcbiAgICByZXR1cm4gbmV3IFNvdXJjZU1vZHVsZSh0aGlzLl9jcmVhdGVNb2R1bGVVcmwoc3R5bGVzaGVldFVybCwgc2hpbSksIG1vZHVsZVNvdXJjZSk7XG4gIH1cblxuICBwcml2YXRlIF9zaGltSWZOZWVkZWQoc3R5bGU6IHN0cmluZywgc2hpbTogYm9vbGVhbik6IHN0cmluZyB7XG4gICAgcmV0dXJuIHNoaW0gPyB0aGlzLl9zaGFkb3dDc3Muc2hpbUNzc1RleHQoc3R5bGUsIENPTlRFTlRfQVRUUiwgSE9TVF9BVFRSKSA6IHN0eWxlO1xuICB9XG5cbiAgcHJpdmF0ZSBfY3JlYXRlTW9kdWxlVXJsKHN0eWxlc2hlZXRVcmw6IHN0cmluZywgc2hpbTogYm9vbGVhbik6IHN0cmluZyB7XG4gICAgcmV0dXJuIHNoaW0gPyBgJHtzdHlsZXNoZWV0VXJsfS5zaGltJHtNT0RVTEVfU1VGRklYfWAgOiBgJHtzdHlsZXNoZWV0VXJsfSR7TU9EVUxFX1NVRkZJWH1gO1xuICB9XG59XG4iXX0=