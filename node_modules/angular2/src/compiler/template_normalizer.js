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
var directive_metadata_1 = require('./directive_metadata');
var lang_1 = require('angular2/src/facade/lang');
var exceptions_1 = require('angular2/src/facade/exceptions');
var async_1 = require('angular2/src/facade/async');
var xhr_1 = require('angular2/src/compiler/xhr');
var url_resolver_1 = require('angular2/src/compiler/url_resolver');
var style_url_resolver_1 = require('./style_url_resolver');
var di_1 = require('angular2/src/core/di');
var view_1 = require('angular2/src/core/metadata/view');
var html_ast_1 = require('./html_ast');
var html_parser_1 = require('./html_parser');
var template_preparser_1 = require('./template_preparser');
var TemplateNormalizer = (function () {
    function TemplateNormalizer(_xhr, _urlResolver, _htmlParser) {
        this._xhr = _xhr;
        this._urlResolver = _urlResolver;
        this._htmlParser = _htmlParser;
    }
    TemplateNormalizer.prototype.normalizeTemplate = function (directiveType, template) {
        var _this = this;
        if (lang_1.isPresent(template.template)) {
            return async_1.PromiseWrapper.resolve(this.normalizeLoadedTemplate(directiveType, template, template.template, directiveType.moduleUrl));
        }
        else if (lang_1.isPresent(template.templateUrl)) {
            var sourceAbsUrl = this._urlResolver.resolve(directiveType.moduleUrl, template.templateUrl);
            return this._xhr.get(sourceAbsUrl)
                .then(function (templateContent) { return _this.normalizeLoadedTemplate(directiveType, template, templateContent, sourceAbsUrl); });
        }
        else {
            throw new exceptions_1.BaseException("No template specified for component " + directiveType.name);
        }
    };
    TemplateNormalizer.prototype.normalizeLoadedTemplate = function (directiveType, templateMeta, template, templateAbsUrl) {
        var _this = this;
        var rootNodesAndErrors = this._htmlParser.parse(template, directiveType.name);
        if (rootNodesAndErrors.errors.length > 0) {
            var errorString = rootNodesAndErrors.errors.join('\n');
            throw new exceptions_1.BaseException("Template parse errors:\n" + errorString);
        }
        var visitor = new TemplatePreparseVisitor();
        html_ast_1.htmlVisitAll(visitor, rootNodesAndErrors.rootNodes);
        var allStyles = templateMeta.styles.concat(visitor.styles);
        var allStyleAbsUrls = visitor.styleUrls.filter(style_url_resolver_1.isStyleUrlResolvable)
            .map(function (url) { return _this._urlResolver.resolve(templateAbsUrl, url); })
            .concat(templateMeta.styleUrls.filter(style_url_resolver_1.isStyleUrlResolvable)
            .map(function (url) { return _this._urlResolver.resolve(directiveType.moduleUrl, url); }));
        var allResolvedStyles = allStyles.map(function (style) {
            var styleWithImports = style_url_resolver_1.extractStyleUrls(_this._urlResolver, templateAbsUrl, style);
            styleWithImports.styleUrls.forEach(function (styleUrl) { return allStyleAbsUrls.push(styleUrl); });
            return styleWithImports.style;
        });
        var encapsulation = templateMeta.encapsulation;
        if (encapsulation === view_1.ViewEncapsulation.Emulated && allResolvedStyles.length === 0 &&
            allStyleAbsUrls.length === 0) {
            encapsulation = view_1.ViewEncapsulation.None;
        }
        return new directive_metadata_1.CompileTemplateMetadata({
            encapsulation: encapsulation,
            template: template,
            templateUrl: templateAbsUrl,
            styles: allResolvedStyles,
            styleUrls: allStyleAbsUrls,
            ngContentSelectors: visitor.ngContentSelectors
        });
    };
    TemplateNormalizer = __decorate([
        di_1.Injectable(), 
        __metadata('design:paramtypes', [xhr_1.XHR, url_resolver_1.UrlResolver, html_parser_1.HtmlParser])
    ], TemplateNormalizer);
    return TemplateNormalizer;
}());
exports.TemplateNormalizer = TemplateNormalizer;
var TemplatePreparseVisitor = (function () {
    function TemplatePreparseVisitor() {
        this.ngContentSelectors = [];
        this.styles = [];
        this.styleUrls = [];
        this.ngNonBindableStackCount = 0;
    }
    TemplatePreparseVisitor.prototype.visitElement = function (ast, context) {
        var preparsedElement = template_preparser_1.preparseElement(ast);
        switch (preparsedElement.type) {
            case template_preparser_1.PreparsedElementType.NG_CONTENT:
                if (this.ngNonBindableStackCount === 0) {
                    this.ngContentSelectors.push(preparsedElement.selectAttr);
                }
                break;
            case template_preparser_1.PreparsedElementType.STYLE:
                var textContent = '';
                ast.children.forEach(function (child) {
                    if (child instanceof html_ast_1.HtmlTextAst) {
                        textContent += child.value;
                    }
                });
                this.styles.push(textContent);
                break;
            case template_preparser_1.PreparsedElementType.STYLESHEET:
                this.styleUrls.push(preparsedElement.hrefAttr);
                break;
            default:
                // DDC reports this as error. See:
                // https://github.com/dart-lang/dev_compiler/issues/428
                break;
        }
        if (preparsedElement.nonBindable) {
            this.ngNonBindableStackCount++;
        }
        html_ast_1.htmlVisitAll(this, ast.children);
        if (preparsedElement.nonBindable) {
            this.ngNonBindableStackCount--;
        }
        return null;
    };
    TemplatePreparseVisitor.prototype.visitComment = function (ast, context) { return null; };
    TemplatePreparseVisitor.prototype.visitAttr = function (ast, context) { return null; };
    TemplatePreparseVisitor.prototype.visitText = function (ast, context) { return null; };
    return TemplatePreparseVisitor;
}());
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVtcGxhdGVfbm9ybWFsaXplci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRpZmZpbmdfcGx1Z2luX3dyYXBwZXItb3V0cHV0X3BhdGgtamFrWG5NbUwudG1wL2FuZ3VsYXIyL3NyYy9jb21waWxlci90ZW1wbGF0ZV9ub3JtYWxpemVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQSxtQ0FJTyxzQkFBc0IsQ0FBQyxDQUFBO0FBQzlCLHFCQUFpQywwQkFBMEIsQ0FBQyxDQUFBO0FBQzVELDJCQUE0QixnQ0FBZ0MsQ0FBQyxDQUFBO0FBQzdELHNCQUE2QiwyQkFBMkIsQ0FBQyxDQUFBO0FBRXpELG9CQUFrQiwyQkFBMkIsQ0FBQyxDQUFBO0FBQzlDLDZCQUEwQixvQ0FBb0MsQ0FBQyxDQUFBO0FBQy9ELG1DQUFxRCxzQkFBc0IsQ0FBQyxDQUFBO0FBQzVFLG1CQUF5QixzQkFBc0IsQ0FBQyxDQUFBO0FBQ2hELHFCQUFnQyxpQ0FBaUMsQ0FBQyxDQUFBO0FBR2xFLHlCQVFPLFlBQVksQ0FBQyxDQUFBO0FBQ3BCLDRCQUF5QixlQUFlLENBQUMsQ0FBQTtBQUV6QyxtQ0FBc0Usc0JBQXNCLENBQUMsQ0FBQTtBQUc3RjtJQUNFLDRCQUFvQixJQUFTLEVBQVUsWUFBeUIsRUFDNUMsV0FBdUI7UUFEdkIsU0FBSSxHQUFKLElBQUksQ0FBSztRQUFVLGlCQUFZLEdBQVosWUFBWSxDQUFhO1FBQzVDLGdCQUFXLEdBQVgsV0FBVyxDQUFZO0lBQUcsQ0FBQztJQUUvQyw4Q0FBaUIsR0FBakIsVUFBa0IsYUFBa0MsRUFDbEMsUUFBaUM7UUFEbkQsaUJBYUM7UUFYQyxFQUFFLENBQUMsQ0FBQyxnQkFBUyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDakMsTUFBTSxDQUFDLHNCQUFjLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyx1QkFBdUIsQ0FDdEQsYUFBYSxFQUFFLFFBQVEsRUFBRSxRQUFRLENBQUMs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QUksQ0FBQyxDQUFDLENBQUM7SUFDakUsOEJBQUM7QUFBRCxDQUFDLEFBM0NELElBMkNDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgQ29tcGlsZVR5cGVNZXRhZGF0YSxcbiAgQ29tcGlsZURpcmVjdGl2ZU1ldGFkYXRhLFxuICBDb21waWxlVGVtcGxhdGVNZXRhZGF0YVxufSBmcm9tICcuL2RpcmVjdGl2ZV9tZXRhZGF0YSc7XG5pbXBvcnQge2lzUHJlc2VudCwgaXNCbGFua30gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9sYW5nJztcbmltcG9ydCB7QmFzZUV4Y2VwdGlvbn0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9leGNlcHRpb25zJztcbmltcG9ydCB7UHJvbWlzZVdyYXBwZXJ9IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvYXN5bmMnO1xuXG5pbXBvcnQge1hIUn0gZnJvbSAnYW5ndWxhcjIvc3JjL2NvbXBpbGVyL3hocic7XG5pbXBvcnQge1VybFJlc29sdmVyfSBmcm9tICdhbmd1bGFyMi9zcmMvY29tcGlsZXIvdXJsX3Jlc29sdmVyJztcbmltcG9ydCB7ZXh0cmFjdFN0eWxlVXJscywgaXNTdHlsZVVybFJlc29sdmFibGV9IGZyb20gJy4vc3R5bGVfdXJsX3Jlc29sdmVyJztcbmltcG9ydCB7SW5qZWN0YWJsZX0gZnJvbSAnYW5ndWxhcjIvc3JjL2NvcmUvZGknO1xuaW1wb3J0IHtWaWV3RW5jYXBzdWxhdGlvbn0gZnJvbSAnYW5ndWxhcjIvc3JjL2NvcmUvbWV0YWRhdGEvdmlldyc7XG5cblxuaW1wb3J0IHtcbiAgSHRtbEFzdFZpc2l0b3IsXG4gIEh0bWxFbGVtZW50QXN0LFxuICBIdG1sVGV4dEFzdCxcbiAgSHRtbEF0dHJBc3QsXG4gIEh0bWxBc3QsXG4gIEh0bWxDb21tZW50QXN0LFxuICBodG1sVmlzaXRBbGxcbn0gZnJvbSAnLi9odG1sX2FzdCc7XG5pbXBvcnQge0h0bWxQYXJzZXJ9IGZyb20gJy4vaHRtbF9wYXJzZXInO1xuXG5pbXBvcnQge3ByZXBhcnNlRWxlbWVudCwgUHJlcGFyc2VkRWxlbWVudCwgUHJlcGFyc2VkRWxlbWVudFR5cGV9IGZyb20gJy4vdGVtcGxhdGVfcHJlcGFyc2VyJztcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIFRlbXBsYXRlTm9ybWFsaXplciB7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgX3hocjogWEhSLCBwcml2YXRlIF91cmxSZXNvbHZlcjogVXJsUmVzb2x2ZXIsXG4gICAgICAgICAgICAgIHByaXZhdGUgX2h0bWxQYXJzZXI6IEh0bWxQYXJzZXIpIHt9XG5cbiAgbm9ybWFsaXplVGVtcGxhdGUoZGlyZWN0aXZlVHlwZTogQ29tcGlsZVR5cGVNZXRhZGF0YSxcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGU6IENvbXBpbGVUZW1wbGF0ZU1ldGFkYXRhKTogUHJvbWlzZTxDb21waWxlVGVtcGxhdGVNZXRhZGF0YT4ge1xuICAgIGlmIChpc1ByZXNlbnQodGVtcGxhdGUudGVtcGxhdGUpKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZVdyYXBwZXIucmVzb2x2ZSh0aGlzLm5vcm1hbGl6ZUxvYWRlZFRlbXBsYXRlKFxuICAgICAgICAgIGRpcmVjdGl2ZVR5cGUsIHRlbXBsYXRlLCB0ZW1wbGF0ZS50ZW1wbGF0ZSwgZGlyZWN0aXZlVHlwZS5tb2R1bGVVcmwpKTtcbiAgICB9IGVsc2UgaWYgKGlzUHJlc2VudCh0ZW1wbGF0ZS50ZW1wbGF0ZVVybCkpIHtcbiAgICAgIHZhciBzb3VyY2VBYnNVcmwgPSB0aGlzLl91cmxSZXNvbHZlci5yZXNvbHZlKGRpcmVjdGl2ZVR5cGUubW9kdWxlVXJsLCB0ZW1wbGF0ZS50ZW1wbGF0ZVVybCk7XG4gICAgICByZXR1cm4gdGhpcy5feGhyLmdldChzb3VyY2VBYnNVcmwpXG4gICAgICAgICAgLnRoZW4odGVtcGxhdGVDb250ZW50ID0+IHRoaXMubm9ybWFsaXplTG9hZGVkVGVtcGxhdGUoZGlyZWN0aXZlVHlwZSwgdGVtcGxhdGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVDb250ZW50LCBzb3VyY2VBYnNVcmwpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEJhc2VFeGNlcHRpb24oYE5vIHRlbXBsYXRlIHNwZWNpZmllZCBmb3IgY29tcG9uZW50ICR7ZGlyZWN0aXZlVHlwZS5uYW1lfWApO1xuICAgIH1cbiAgfVxuXG4gIG5vcm1hbGl6ZUxvYWRlZFRlbXBsYXRlKGRpcmVjdGl2ZVR5cGU6IENvbXBpbGVUeXBlTWV0YWRhdGEsIHRlbXBsYXRlTWV0YTogQ29tcGlsZVRlbXBsYXRlTWV0YWRhdGEsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlOiBzdHJpbmcsIHRlbXBsYXRlQWJzVXJsOiBzdHJpbmcpOiBDb21waWxlVGVtcGxhdGVNZXRhZGF0YSB7XG4gICAgdmFyIHJvb3ROb2Rlc0FuZEVycm9ycyA9IHRoaXMuX2h0bWxQYXJzZXIucGFyc2UodGVtcGxhdGUsIGRpcmVjdGl2ZVR5cGUubmFtZSk7XG4gICAgaWYgKHJvb3ROb2Rlc0FuZEVycm9ycy5lcnJvcnMubGVuZ3RoID4gMCkge1xuICAgICAgdmFyIGVycm9yU3RyaW5nID0gcm9vdE5vZGVzQW5kRXJyb3JzLmVycm9ycy5qb2luKCdcXG4nKTtcbiAgICAgIHRocm93IG5ldyBCYXNlRXhjZXB0aW9uKGBUZW1wbGF0ZSBwYXJzZSBlcnJvcnM6XFxuJHtlcnJvclN0cmluZ31gKTtcbiAgICB9XG5cbiAgICB2YXIgdmlzaXRvciA9IG5ldyBUZW1wbGF0ZVByZXBhcnNlVmlzaXRvcigpO1xuICAgIGh0bWxWaXNpdEFsbCh2aXNpdG9yLCByb290Tm9kZXNBbmRFcnJvcnMucm9vdE5vZGVzKTtcbiAgICB2YXIgYWxsU3R5bGVzID0gdGVtcGxhdGVNZXRhLnN0eWxlcy5jb25jYXQodmlzaXRvci5zdHlsZXMpO1xuXG4gICAgdmFyIGFsbFN0eWxlQWJzVXJscyA9XG4gICAgICAgIHZpc2l0b3Iuc3R5bGVVcmxzLmZpbHRlcihpc1N0eWxlVXJsUmVzb2x2YWJsZSlcbiAgICAgICAgICAgIC5tYXAodXJsID0+IHRoaXMuX3VybFJlc29sdmVyLnJlc29sdmUodGVtcGxhdGVBYnNVcmwsIHVybCkpXG4gICAgICAgICAgICAuY29uY2F0KHRlbXBsYXRlTWV0YS5zdHlsZVVybHMuZmlsdGVyKGlzU3R5bGVVcmxSZXNvbHZhYmxlKVxuICAgICAgICAgICAgICAgICAgICAgICAgLm1hcCh1cmwgPT4gdGhpcy5fdXJsUmVzb2x2ZXIucmVzb2x2ZShkaXJlY3RpdmVUeXBlLm1vZHVsZVVybCwgdXJsKSkpO1xuXG4gICAgdmFyIGFsbFJlc29sdmVkU3R5bGVzID0gYWxsU3R5bGVzLm1hcChzdHlsZSA9PiB7XG4gICAgICB2YXIgc3R5bGVXaXRoSW1wb3J0cyA9IGV4dHJhY3RTdHlsZVVybHModGhpcy5fdXJsUmVzb2x2ZXIsIHRlbXBsYXRlQWJzVXJsLCBzdHlsZSk7XG4gICAgICBzdHlsZVdpdGhJbXBvcnRzLnN0eWxlVXJscy5mb3JFYWNoKHN0eWxlVXJsID0+IGFsbFN0eWxlQWJzVXJscy5wdXNoKHN0eWxlVXJsKSk7XG4gICAgICByZXR1cm4gc3R5bGVXaXRoSW1wb3J0cy5zdHlsZTtcbiAgICB9KTtcblxuICAgIHZhciBlbmNhcHN1bGF0aW9uID0gdGVtcGxhdGVNZXRhLmVuY2Fwc3VsYXRpb247XG4gICAgaWYgKGVuY2Fwc3VsYXRpb24gPT09IFZpZXdFbmNhcHN1bGF0aW9uLkVtdWxhdGVkICYmIGFsbFJlc29sdmVkU3R5bGVzLmxlbmd0aCA9PT0gMCAmJlxuICAgICAgICBhbGxTdHlsZUFic1VybHMubGVuZ3RoID09PSAwKSB7XG4gICAgICBlbmNhcHN1bGF0aW9uID0gVmlld0VuY2Fwc3VsYXRpb24uTm9uZTtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBDb21waWxlVGVtcGxhdGVNZXRhZGF0YSh7XG4gICAgICBlbmNhcHN1bGF0aW9uOiBlbmNhcHN1bGF0aW9uLFxuICAgICAgdGVtcGxhdGU6IHRlbXBsYXRlLFxuICAgICAgdGVtcGxhdGVVcmw6IHRlbXBsYXRlQWJzVXJsLFxuICAgICAgc3R5bGVzOiBhbGxSZXNvbHZlZFN0eWxlcyxcbiAgICAgIHN0eWxlVXJsczogYWxsU3R5bGVBYnNVcmxzLFxuICAgICAgbmdDb250ZW50U2VsZWN0b3JzOiB2aXNpdG9yLm5nQ29udGVudFNlbGVjdG9yc1xuICAgIH0pO1xuICB9XG59XG5cbmNsYXNzIFRlbXBsYXRlUHJlcGFyc2VWaXNpdG9yIGltcGxlbWVudHMgSHRtbEFzdFZpc2l0b3Ige1xuICBuZ0NvbnRlbnRTZWxlY3RvcnM6IHN0cmluZ1tdID0gW107XG4gIHN0eWxlczogc3RyaW5nW10gPSBbXTtcbiAgc3R5bGVVcmxzOiBzdHJpbmdbXSA9IFtdO1xuICBuZ05vbkJpbmRhYmxlU3RhY2tDb3VudDogbnVtYmVyID0gMDtcblxuICB2aXNpdEVsZW1lbnQoYXN0OiBIdG1sRWxlbWVudEFzdCwgY29udGV4dDogYW55KTogYW55IHtcbiAgICB2YXIgcHJlcGFyc2VkRWxlbWVudCA9IHByZXBhcnNlRWxlbWVudChhc3QpO1xuICAgIHN3aXRjaCAocHJlcGFyc2VkRWxlbWVudC50eXBlKSB7XG4gICAgICBjYXNlIFByZXBhcnNlZEVsZW1lbnRUeXBlLk5HX0NPTlRFTlQ6XG4gICAgICAgIGlmICh0aGlzLm5nTm9uQmluZGFibGVTdGFja0NvdW50ID09PSAwKSB7XG4gICAgICAgICAgdGhpcy5uZ0NvbnRlbnRTZWxlY3RvcnMucHVzaChwcmVwYXJzZWRFbGVtZW50LnNlbGVjdEF0dHIpO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBQcmVwYXJzZWRFbGVtZW50VHlwZS5TVFlMRTpcbiAgICAgICAgdmFyIHRleHRDb250ZW50ID0gJyc7XG4gICAgICAgIGFzdC5jaGlsZHJlbi5mb3JFYWNoKGNoaWxkID0+IHtcbiAgICAgICAgICBpZiAoY2hpbGQgaW5zdGFuY2VvZiBIdG1sVGV4dEFzdCkge1xuICAgICAgICAgICAgdGV4dENvbnRlbnQgKz0gKDxIdG1sVGV4dEFzdD5jaGlsZCkudmFsdWU7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5zdHlsZXMucHVzaCh0ZXh0Q29udGVudCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBQcmVwYXJzZWRFbGVtZW50VHlwZS5TVFlMRVNIRUVUOlxuICAgICAgICB0aGlzLnN0eWxlVXJscy5wdXNoKHByZXBhcnNlZEVsZW1lbnQuaHJlZkF0dHIpO1xuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIC8vIEREQyByZXBvcnRzIHRoaXMgYXMgZXJyb3IuIFNlZTpcbiAgICAgICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2RhcnQtbGFuZy9kZXZfY29tcGlsZXIvaXNzdWVzLzQyOFxuICAgICAgICBicmVhaztcbiAgICB9XG4gICAgaWYgKHByZXBhcnNlZEVsZW1lbnQubm9uQmluZGFibGUpIHtcbiAgICAgIHRoaXMubmdOb25CaW5kYWJsZVN0YWNrQ291bnQrKztcbiAgICB9XG4gICAgaHRtbFZpc2l0QWxsKHRoaXMsIGFzdC5jaGlsZHJlbik7XG4gICAgaWYgKHByZXBhcnNlZEVsZW1lbnQubm9uQmluZGFibGUpIHtcbiAgICAgIHRoaXMubmdOb25CaW5kYWJsZVN0YWNrQ291bnQtLTtcbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgdmlzaXRDb21tZW50KGFzdDogSHRtbENvbW1lbnRBc3QsIGNvbnRleHQ6IGFueSk6IGFueSB7IHJldHVybiBudWxsOyB9XG4gIHZpc2l0QXR0cihhc3Q6IEh0bWxBdHRyQXN0LCBjb250ZXh0OiBhbnkpOiBhbnkgeyByZXR1cm4gbnVsbDsgfVxuICB2aXNpdFRleHQoYXN0OiBIdG1sVGV4dEFzdCwgY29udGV4dDogYW55KTogYW55IHsgcmV0dXJuIG51bGw7IH1cbn1cbiJdfQ==