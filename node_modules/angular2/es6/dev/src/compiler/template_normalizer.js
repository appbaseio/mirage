var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { CompileTemplateMetadata } from './directive_metadata';
import { isPresent } from 'angular2/src/facade/lang';
import { BaseException } from 'angular2/src/facade/exceptions';
import { PromiseWrapper } from 'angular2/src/facade/async';
import { XHR } from 'angular2/src/compiler/xhr';
import { UrlResolver } from 'angular2/src/compiler/url_resolver';
import { extractStyleUrls, isStyleUrlResolvable } from './style_url_resolver';
import { Injectable } from 'angular2/src/core/di';
import { ViewEncapsulation } from 'angular2/src/core/metadata/view';
import { HtmlTextAst, htmlVisitAll } from './html_ast';
import { HtmlParser } from './html_parser';
import { preparseElement, PreparsedElementType } from './template_preparser';
export let TemplateNormalizer = class TemplateNormalizer {
    constructor(_xhr, _urlResolver, _htmlParser) {
        this._xhr = _xhr;
        this._urlResolver = _urlResolver;
        this._htmlParser = _htmlParser;
    }
    normalizeTemplate(directiveType, template) {
        if (isPresent(template.template)) {
            return PromiseWrapper.resolve(this.normalizeLoadedTemplate(directiveType, template, template.template, directiveType.moduleUrl));
        }
        else if (isPresent(template.templateUrl)) {
            var sourceAbsUrl = this._urlResolver.resolve(directiveType.moduleUrl, template.templateUrl);
            return this._xhr.get(sourceAbsUrl)
                .then(templateContent => this.normalizeLoadedTemplate(directiveType, template, templateContent, sourceAbsUrl));
        }
        else {
            throw new BaseException(`No template specified for component ${directiveType.name}`);
        }
    }
    normalizeLoadedTemplate(directiveType, templateMeta, template, templateAbsUrl) {
        var rootNodesAndErrors = this._htmlParser.parse(template, directiveType.name);
        if (rootNodesAndErrors.errors.length > 0) {
            var errorString = rootNodesAndErrors.errors.join('\n');
            throw new BaseException(`Template parse errors:\n${errorString}`);
        }
        var visitor = new TemplatePreparseVisitor();
        htmlVisitAll(visitor, rootNodesAndErrors.rootNodes);
        var allStyles = templateMeta.styles.concat(visitor.styles);
        var allStyleAbsUrls = visitor.styleUrls.filter(isStyleUrlResolvable)
            .map(url => this._urlResolver.resolve(templateAbsUrl, url))
            .concat(templateMeta.styleUrls.filter(isStyleUrlResolvable)
            .map(url => this._urlResolver.resolve(directiveType.moduleUrl, url)));
        var allResolvedStyles = allStyles.map(style => {
            var styleWithImports = extractStyleUrls(this._urlResolver, templateAbsUrl, style);
            styleWithImports.styleUrls.forEach(styleUrl => allStyleAbsUrls.push(styleUrl));
            return styleWithImports.style;
        });
        var encapsulation = templateMeta.encapsulation;
        if (encapsulation === ViewEncapsulation.Emulated && allResolvedStyles.length === 0 &&
            allStyleAbsUrls.length === 0) {
            encapsulation = ViewEncapsulation.None;
        }
        return new CompileTemplateMetadata({
            encapsulation: encapsulation,
            template: template,
            templateUrl: templateAbsUrl,
            styles: allResolvedStyles,
            styleUrls: allStyleAbsUrls,
            ngContentSelectors: visitor.ngContentSelectors
        });
    }
};
TemplateNormalizer = __decorate([
    Injectable(), 
    __metadata('design:paramtypes', [XHR, UrlResolver, HtmlParser])
], TemplateNormalizer);
class TemplatePreparseVisitor {
    constructor() {
        this.ngContentSelectors = [];
        this.styles = [];
        this.styleUrls = [];
        this.ngNonBindableStackCount = 0;
    }
    visitElement(ast, context) {
        var preparsedElement = preparseElement(ast);
        switch (preparsedElement.type) {
            case PreparsedElementType.NG_CONTENT:
                if (this.ngNonBindableStackCount === 0) {
                    this.ngContentSelectors.push(preparsedElement.selectAttr);
                }
                break;
            case PreparsedElementType.STYLE:
                var textContent = '';
                ast.children.forEach(child => {
                    if (child instanceof HtmlTextAst) {
                        textContent += child.value;
                    }
                });
                this.styles.push(textContent);
                break;
            case PreparsedElementType.STYLESHEET:
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
        htmlVisitAll(this, ast.children);
        if (preparsedElement.nonBindable) {
            this.ngNonBindableStackCount--;
        }
        return null;
    }
    visitComment(ast, context) { return null; }
    visitAttr(ast, context) { return null; }
    visitText(ast, context) { return null; }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVtcGxhdGVfbm9ybWFsaXplci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRpZmZpbmdfcGx1Z2luX3dyYXBwZXItb3V0cHV0X3BhdGgtb1hETzRwMnYudG1wL2FuZ3VsYXIyL3NyYy9jb21waWxlci90ZW1wbGF0ZV9ub3JtYWxpemVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztPQUFPLEVBR0wsdUJBQXVCLEVBQ3hCLE1BQU0sc0JBQXNCO09BQ3RCLEVBQUMsU0FBUyxFQUFVLE1BQU0sMEJBQTBCO09BQ3BELEVBQUMsYUFBYSxFQUFDLE1BQU0sZ0NBQWdDO09BQ3JELEVBQUMsY0FBYyxFQUFDLE1BQU0sMkJBQTJCO09BRWpELEVBQUMsR0FBRyxFQUFDLE1BQU0sMkJBQTJCO09BQ3RDLEVBQUMsV0FBVyxFQUFDLE1BQU0sb0NBQW9DO09BQ3ZELEVBQUMsZ0JBQWdCLEVBQUUsb0JBQW9CLEVBQUMsTUFBTSxzQkFBc0I7T0FDcEUsRUFBQyxVQUFVLEVBQUMsTUFBTSxzQkFBc0I7T0FDeEMsRUFBQyxpQkFBaUIsRUFBQyxNQUFNLGlDQUFpQztPQUcxRCxFQUdMLFdBQVcsRUFJWCxZQUFZLEVBQ2IsTUFBTSxZQUFZO09BQ1osRUFBQyxVQUFVLEVBQUMsTUFBTSxlQUFlO09BRWpDLEVBQUMsZUFBZSxFQUFvQixvQkFBb0IsRUFBQyxNQUFNLHNCQUFzQjtBQUc1RjtJQUNFLFlBQW9CLElBQVMsRUFBVSxZQUF5QixFQUM1QyxXQUF1QjtRQUR2QixTQUFJLEdBQUosSUFBSSxDQUFLO1FBQVUsaUJBQVksR0FBWixZQUFZLENBQWE7UUFDNUMsZ0JBQVcsR0FBWCxXQUFXLENBQVk7SUFBRyxDQUFDO0lBRS9DLGlCQUFpQixDQUFDLGFBQWtDLEVBQ2xDLFFBQWlDO1FBQ2pELEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2pDLE1BQU0sQ0FBQyxjQUFjLENBQUMsT0FBTyxD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QUM7d0JBQ2pDLFdBQVcsSUFBa0IsS0FBTSxDQUFDLEtBQUssQ0FBQztvQkFDNUMsQ0FBQztnQkFDSCxDQUFDLENBQUMsQ0FBQztnQkFDSCxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztnQkFDOUIsS0FBSyxDQUFDO1lBQ1IsS0FBSyxvQkFBb0IsQ0FBQyxVQUFVO2dCQUNsQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLENBQUMsQ0FBQztnQkFDL0MsS0FBSyxDQUFDO1lBQ1I7Z0JBQ0Usa0NBQWtDO2dCQUNsQyx1REFBdUQ7Z0JBQ3ZELEtBQUssQ0FBQztRQUNWLENBQUM7UUFDRCxFQUFFLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO1lBQ2pDLElBQUksQ0FBQyx1QkFBdUIsRUFBRSxDQUFDO1FBQ2pDLENBQUM7UUFDRCxZQUFZLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNqQyxFQUFFLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO1lBQ2pDLElBQUksQ0FBQyx1QkFBdUIsRUFBRSxDQUFDO1FBQ2pDLENBQUM7UUFDRCxNQUFNLENBQUMsSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUNELFlBQVksQ0FBQyxHQUFtQixFQUFFLE9BQVksSUFBUyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztJQUNyRSxTQUFTLENBQUMsR0FBZ0IsRUFBRSxPQUFZLElBQVMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7SUFDL0QsU0FBUyxDQUFDLEdBQWdCLEVBQUUsT0FBWSxJQUFTLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0FBQ2pFLENBQUM7QUFBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIENvbXBpbGVUeXBlTWV0YWRhdGEsXG4gIENvbXBpbGVEaXJlY3RpdmVNZXRhZGF0YSxcbiAgQ29tcGlsZVRlbXBsYXRlTWV0YWRhdGFcbn0gZnJvbSAnLi9kaXJlY3RpdmVfbWV0YWRhdGEnO1xuaW1wb3J0IHtpc1ByZXNlbnQsIGlzQmxhbmt9IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvbGFuZyc7XG5pbXBvcnQge0Jhc2VFeGNlcHRpb259IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvZXhjZXB0aW9ucyc7XG5pbXBvcnQge1Byb21pc2VXcmFwcGVyfSBmcm9tICdhbmd1bGFyMi9zcmMvZmFjYWRlL2FzeW5jJztcblxuaW1wb3J0IHtYSFJ9IGZyb20gJ2FuZ3VsYXIyL3NyYy9jb21waWxlci94aHInO1xuaW1wb3J0IHtVcmxSZXNvbHZlcn0gZnJvbSAnYW5ndWxhcjIvc3JjL2NvbXBpbGVyL3VybF9yZXNvbHZlcic7XG5pbXBvcnQge2V4dHJhY3RTdHlsZVVybHMsIGlzU3R5bGVVcmxSZXNvbHZhYmxlfSBmcm9tICcuL3N0eWxlX3VybF9yZXNvbHZlcic7XG5pbXBvcnQge0luamVjdGFibGV9IGZyb20gJ2FuZ3VsYXIyL3NyYy9jb3JlL2RpJztcbmltcG9ydCB7Vmlld0VuY2Fwc3VsYXRpb259IGZyb20gJ2FuZ3VsYXIyL3NyYy9jb3JlL21ldGFkYXRhL3ZpZXcnO1xuXG5cbmltcG9ydCB7XG4gIEh0bWxBc3RWaXNpdG9yLFxuICBIdG1sRWxlbWVudEFzdCxcbiAgSHRtbFRleHRBc3QsXG4gIEh0bWxBdHRyQXN0LFxuICBIdG1sQXN0LFxuICBIdG1sQ29tbWVudEFzdCxcbiAgaHRtbFZpc2l0QWxsXG59IGZyb20gJy4vaHRtbF9hc3QnO1xuaW1wb3J0IHtIdG1sUGFyc2VyfSBmcm9tICcuL2h0bWxfcGFyc2VyJztcblxuaW1wb3J0IHtwcmVwYXJzZUVsZW1lbnQsIFByZXBhcnNlZEVsZW1lbnQsIFByZXBhcnNlZEVsZW1lbnRUeXBlfSBmcm9tICcuL3RlbXBsYXRlX3ByZXBhcnNlcic7XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBUZW1wbGF0ZU5vcm1hbGl6ZXIge1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIF94aHI6IFhIUiwgcHJpdmF0ZSBfdXJsUmVzb2x2ZXI6IFVybFJlc29sdmVyLFxuICAgICAgICAgICAgICBwcml2YXRlIF9odG1sUGFyc2VyOiBIdG1sUGFyc2VyKSB7fVxuXG4gIG5vcm1hbGl6ZVRlbXBsYXRlKGRpcmVjdGl2ZVR5cGU6IENvbXBpbGVUeXBlTWV0YWRhdGEsXG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlOiBDb21waWxlVGVtcGxhdGVNZXRhZGF0YSk6IFByb21pc2U8Q29tcGlsZVRlbXBsYXRlTWV0YWRhdGE+IHtcbiAgICBpZiAoaXNQcmVzZW50KHRlbXBsYXRlLnRlbXBsYXRlKSkge1xuICAgICAgcmV0dXJuIFByb21pc2VXcmFwcGVyLnJlc29sdmUodGhpcy5ub3JtYWxpemVMb2FkZWRUZW1wbGF0ZShcbiAgICAgICAgICBkaXJlY3RpdmVUeXBlLCB0ZW1wbGF0ZSwgdGVtcGxhdGUudGVtcGxhdGUsIGRpcmVjdGl2ZVR5cGUubW9kdWxlVXJsKSk7XG4gICAgfSBlbHNlIGlmIChpc1ByZXNlbnQodGVtcGxhdGUudGVtcGxhdGVVcmwpKSB7XG4gICAgICB2YXIgc291cmNlQWJzVXJsID0gdGhpcy5fdXJsUmVzb2x2ZXIucmVzb2x2ZShkaXJlY3RpdmVUeXBlLm1vZHVsZVVybCwgdGVtcGxhdGUudGVtcGxhdGVVcmwpO1xuICAgICAgcmV0dXJuIHRoaXMuX3hoci5nZXQoc291cmNlQWJzVXJsKVxuICAgICAgICAgIC50aGVuKHRlbXBsYXRlQ29udGVudCA9PiB0aGlzLm5vcm1hbGl6ZUxvYWRlZFRlbXBsYXRlKGRpcmVjdGl2ZVR5cGUsIHRlbXBsYXRlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlQ29udGVudCwgc291cmNlQWJzVXJsKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBCYXNlRXhjZXB0aW9uKGBObyB0ZW1wbGF0ZSBzcGVjaWZpZWQgZm9yIGNvbXBvbmVudCAke2RpcmVjdGl2ZVR5cGUubmFtZX1gKTtcbiAgICB9XG4gIH1cblxuICBub3JtYWxpemVMb2FkZWRUZW1wbGF0ZShkaXJlY3RpdmVUeXBlOiBDb21waWxlVHlwZU1ldGFkYXRhLCB0ZW1wbGF0ZU1ldGE6IENvbXBpbGVUZW1wbGF0ZU1ldGFkYXRhLFxuICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZTogc3RyaW5nLCB0ZW1wbGF0ZUFic1VybDogc3RyaW5nKTogQ29tcGlsZVRlbXBsYXRlTWV0YWRhdGEge1xuICAgIHZhciByb290Tm9kZXNBbmRFcnJvcnMgPSB0aGlzLl9odG1sUGFyc2VyLnBhcnNlKHRlbXBsYXRlLCBkaXJlY3RpdmVUeXBlLm5hbWUpO1xuICAgIGlmIChyb290Tm9kZXNBbmRFcnJvcnMuZXJyb3JzLmxlbmd0aCA+IDApIHtcbiAgICAgIHZhciBlcnJvclN0cmluZyA9IHJvb3ROb2Rlc0FuZEVycm9ycy5lcnJvcnMuam9pbignXFxuJyk7XG4gICAgICB0aHJvdyBuZXcgQmFzZUV4Y2VwdGlvbihgVGVtcGxhdGUgcGFyc2UgZXJyb3JzOlxcbiR7ZXJyb3JTdHJpbmd9YCk7XG4gICAgfVxuXG4gICAgdmFyIHZpc2l0b3IgPSBuZXcgVGVtcGxhdGVQcmVwYXJzZVZpc2l0b3IoKTtcbiAgICBodG1sVmlzaXRBbGwodmlzaXRvciwgcm9vdE5vZGVzQW5kRXJyb3JzLnJvb3ROb2Rlcyk7XG4gICAgdmFyIGFsbFN0eWxlcyA9IHRlbXBsYXRlTWV0YS5zdHlsZXMuY29uY2F0KHZpc2l0b3Iuc3R5bGVzKTtcblxuICAgIHZhciBhbGxTdHlsZUFic1VybHMgPVxuICAgICAgICB2aXNpdG9yLnN0eWxlVXJscy5maWx0ZXIoaXNTdHlsZVVybFJlc29sdmFibGUpXG4gICAgICAgICAgICAubWFwKHVybCA9PiB0aGlzLl91cmxSZXNvbHZlci5yZXNvbHZlKHRlbXBsYXRlQWJzVXJsLCB1cmwpKVxuICAgICAgICAgICAgLmNvbmNhdCh0ZW1wbGF0ZU1ldGEuc3R5bGVVcmxzLmZpbHRlcihpc1N0eWxlVXJsUmVzb2x2YWJsZSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC5tYXAodXJsID0+IHRoaXMuX3VybFJlc29sdmVyLnJlc29sdmUoZGlyZWN0aXZlVHlwZS5tb2R1bGVVcmwsIHVybCkpKTtcblxuICAgIHZhciBhbGxSZXNvbHZlZFN0eWxlcyA9IGFsbFN0eWxlcy5tYXAoc3R5bGUgPT4ge1xuICAgICAgdmFyIHN0eWxlV2l0aEltcG9ydHMgPSBleHRyYWN0U3R5bGVVcmxzKHRoaXMuX3VybFJlc29sdmVyLCB0ZW1wbGF0ZUFic1VybCwgc3R5bGUpO1xuICAgICAgc3R5bGVXaXRoSW1wb3J0cy5zdHlsZVVybHMuZm9yRWFjaChzdHlsZVVybCA9PiBhbGxTdHlsZUFic1VybHMucHVzaChzdHlsZVVybCkpO1xuICAgICAgcmV0dXJuIHN0eWxlV2l0aEltcG9ydHMuc3R5bGU7XG4gICAgfSk7XG5cbiAgICB2YXIgZW5jYXBzdWxhdGlvbiA9IHRlbXBsYXRlTWV0YS5lbmNhcHN1bGF0aW9uO1xuICAgIGlmIChlbmNhcHN1bGF0aW9uID09PSBWaWV3RW5jYXBzdWxhdGlvbi5FbXVsYXRlZCAmJiBhbGxSZXNvbHZlZFN0eWxlcy5sZW5ndGggPT09IDAgJiZcbiAgICAgICAgYWxsU3R5bGVBYnNVcmxzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgZW5jYXBzdWxhdGlvbiA9IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmU7XG4gICAgfVxuICAgIHJldHVybiBuZXcgQ29tcGlsZVRlbXBsYXRlTWV0YWRhdGEoe1xuICAgICAgZW5jYXBzdWxhdGlvbjogZW5jYXBzdWxhdGlvbixcbiAgICAgIHRlbXBsYXRlOiB0ZW1wbGF0ZSxcbiAgICAgIHRlbXBsYXRlVXJsOiB0ZW1wbGF0ZUFic1VybCxcbiAgICAgIHN0eWxlczogYWxsUmVzb2x2ZWRTdHlsZXMsXG4gICAgICBzdHlsZVVybHM6IGFsbFN0eWxlQWJzVXJscyxcbiAgICAgIG5nQ29udGVudFNlbGVjdG9yczogdmlzaXRvci5uZ0NvbnRlbnRTZWxlY3RvcnNcbiAgICB9KTtcbiAgfVxufVxuXG5jbGFzcyBUZW1wbGF0ZVByZXBhcnNlVmlzaXRvciBpbXBsZW1lbnRzIEh0bWxBc3RWaXNpdG9yIHtcbiAgbmdDb250ZW50U2VsZWN0b3JzOiBzdHJpbmdbXSA9IFtdO1xuICBzdHlsZXM6IHN0cmluZ1tdID0gW107XG4gIHN0eWxlVXJsczogc3RyaW5nW10gPSBbXTtcbiAgbmdOb25CaW5kYWJsZVN0YWNrQ291bnQ6IG51bWJlciA9IDA7XG5cbiAgdmlzaXRFbGVtZW50KGFzdDogSHRtbEVsZW1lbnRBc3QsIGNvbnRleHQ6IGFueSk6IGFueSB7XG4gICAgdmFyIHByZXBhcnNlZEVsZW1lbnQgPSBwcmVwYXJzZUVsZW1lbnQoYXN0KTtcbiAgICBzd2l0Y2ggKHByZXBhcnNlZEVsZW1lbnQudHlwZSkge1xuICAgICAgY2FzZSBQcmVwYXJzZWRFbGVtZW50VHlwZS5OR19DT05URU5UOlxuICAgICAgICBpZiAodGhpcy5uZ05vbkJpbmRhYmxlU3RhY2tDb3VudCA9PT0gMCkge1xuICAgICAgICAgIHRoaXMubmdDb250ZW50U2VsZWN0b3JzLnB1c2gocHJlcGFyc2VkRWxlbWVudC5zZWxlY3RBdHRyKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgUHJlcGFyc2VkRWxlbWVudFR5cGUuU1RZTEU6XG4gICAgICAgIHZhciB0ZXh0Q29udGVudCA9ICcnO1xuICAgICAgICBhc3QuY2hpbGRyZW4uZm9yRWFjaChjaGlsZCA9PiB7XG4gICAgICAgICAgaWYgKGNoaWxkIGluc3RhbmNlb2YgSHRtbFRleHRBc3QpIHtcbiAgICAgICAgICAgIHRleHRDb250ZW50ICs9ICg8SHRtbFRleHRBc3Q+Y2hpbGQpLnZhbHVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuc3R5bGVzLnB1c2godGV4dENvbnRlbnQpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgUHJlcGFyc2VkRWxlbWVudFR5cGUuU1RZTEVTSEVFVDpcbiAgICAgICAgdGhpcy5zdHlsZVVybHMucHVzaChwcmVwYXJzZWRFbGVtZW50LmhyZWZBdHRyKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICAvLyBEREMgcmVwb3J0cyB0aGlzIGFzIGVycm9yLiBTZWU6XG4gICAgICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9kYXJ0LWxhbmcvZGV2X2NvbXBpbGVyL2lzc3Vlcy80MjhcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICAgIGlmIChwcmVwYXJzZWRFbGVtZW50Lm5vbkJpbmRhYmxlKSB7XG4gICAgICB0aGlzLm5nTm9uQmluZGFibGVTdGFja0NvdW50Kys7XG4gICAgfVxuICAgIGh0bWxWaXNpdEFsbCh0aGlzLCBhc3QuY2hpbGRyZW4pO1xuICAgIGlmIChwcmVwYXJzZWRFbGVtZW50Lm5vbkJpbmRhYmxlKSB7XG4gICAgICB0aGlzLm5nTm9uQmluZGFibGVTdGFja0NvdW50LS07XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9XG4gIHZpc2l0Q29tbWVudChhc3Q6IEh0bWxDb21tZW50QXN0LCBjb250ZXh0OiBhbnkpOiBhbnkgeyByZXR1cm4gbnVsbDsgfVxuICB2aXNpdEF0dHIoYXN0OiBIdG1sQXR0ckFzdCwgY29udGV4dDogYW55KTogYW55IHsgcmV0dXJuIG51bGw7IH1cbiAgdmlzaXRUZXh0KGFzdDogSHRtbFRleHRBc3QsIGNvbnRleHQ6IGFueSk6IGFueSB7IHJldHVybiBudWxsOyB9XG59XG4iXX0=