import { StringWrapper, isBlank } from 'angular2/src/facade/lang';
var MODULE_REGEXP = /#MODULE\[([^\]]*)\]/g;
export function moduleRef(moduleUrl) {
    return `#MODULE[${moduleUrl}]`;
}
/**
 * Represents generated source code with module references. Internal to the Angular compiler.
 */
export class SourceModule {
    constructor(moduleUrl, sourceWithModuleRefs) {
        this.moduleUrl = moduleUrl;
        this.sourceWithModuleRefs = sourceWithModuleRefs;
    }
    static getSourceWithoutImports(sourceWithModuleRefs) {
        return StringWrapper.replaceAllMapped(sourceWithModuleRefs, MODULE_REGEXP, (match) => '');
    }
    getSourceWithImports() {
        var moduleAliases = {};
        var imports = [];
        var newSource = StringWrapper.replaceAllMapped(this.sourceWithModuleRefs, MODULE_REGEXP, (match) => {
            var moduleUrl = match[1];
            var alias = moduleAliases[moduleUrl];
            if (isBlank(alias)) {
                if (moduleUrl == this.moduleUrl) {
                    alias = '';
                }
                else {
                    alias = `import${imports.length}`;
                    imports.push([moduleUrl, alias]);
                }
                moduleAliases[moduleUrl] = alias;
            }
            return alias.length > 0 ? `${alias}.` : '';
        });
        return new SourceWithImports(newSource, imports);
    }
}
export class SourceExpression {
    constructor(declarations, expression) {
        this.declarations = declarations;
        this.expression = expression;
    }
}
export class SourceExpressions {
    constructor(declarations, expressions) {
        this.declarations = declarations;
        this.expressions = expressions;
    }
}
/**
 * Represents generated source code with imports. Internal to the Angular compiler.
 */
export class SourceWithImports {
    constructor(source, imports) {
        this.source = source;
        this.imports = imports;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic291cmNlX21vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRpZmZpbmdfcGx1Z2luX3dyYXBwZXItb3V0cHV0X3BhdGgtb1hETzRwMnYudG1wL2FuZ3VsYXIyL3NyYy9jb21waWxlci9zb3VyY2VfbW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJPQUFPLEVBQUMsYUFBYSxFQUFFLE9BQU8sRUFBQyxNQUFNLDBCQUEwQjtBQUUvRCxJQUFJLGFBQWEsR0FBRyxzQkFBc0IsQ0FBQztBQUUzQywwQkFBMEIsU0FBUztJQUNqQyxNQUFNLENBQUMsV0FBVyxTQUFTLEdBQUcsQ0FBQztBQUNqQyxDQUFDO0FBRUQ7O0dBRUc7QUFDSDtJQUtFLFlBQW1CLFNBQWlCLEVBQVMsb0JBQTRCO1FBQXRELGNBQVMsR0FBVCxTQUFTLENBQVE7UUFBUyx5QkFBb0IsR0FBcEIsb0JBQW9CLENBQVE7SUFBRyxDQUFDO0lBSjdFLE9BQU8sdUJBQXVCLENBQUMsb0JBQTRCO1FBQ3pELE1BQU0sQ0FBQyxhQUFhLENBQUMsZ0JBQWdCLENBQUMsb0JBQW9CLEVBQUUsYUFBYSxFQUFFLENBQUMsS0FBSyxLQUFLLEVBQUUsQ0FBQyxDQUFDO0lBQzVGLENBQUM7SUFJRCxvQkFBb0I7UUFDbEIsSUFBSSxhQUFhLEdBQUcsRUFBRSxDQUFDO1FBQ3ZCLElBQUksT0FBTyxHQUFlLEVBQUUsQ0FBQztRQUM3QixJQUFJLFNBQVMsR0FDVCxhQUFhLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLG9CQUFvQixFQUFFLGFBQWEsRUFBRSxDQUFDLEtBQUs7WUFDN0UsSUFBSSxTQUFTLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3pCLElBQUksS0FBSyxHQUFHLGFBQWEsQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUNyQyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNuQixFQUFFLENBQUMsQ0FBQyxTQUFTLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7b0JBQ2hDLEtBQUssR0FBRyxFQUFFLENBQUM7Z0JBQ2IsQ0FBQztnQkFBQyxJQUFJLENBQUMsQ0FBQztvQkFDTixLQUFLLEdBQUcsU0FBUyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUM7b0JBQ2xDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxTQUFTLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQztnQkFDbkMsQ0FBQztnQkFDRCxhQUFhLENBQUMsU0FBUyxDQUFDLEdBQUcsS0FBSyxDQUFDO1lBQ25DLENBQUM7WUFDRCxNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLEdBQUcsR0FBRyxLQUFLLEdBQUcsR0FBRyxFQUFFLENBQUM7UUFDN0MsQ0FBQyxDQUFDLENBQUM7UUFDUCxNQUFNLENBQUMsSUFBSSxpQkFBaUIsQ0FBQyxTQUFTLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDbkQsQ0FBQztBQUNILENBQUM7QUFFRDtJQUNFLFlBQW1CLFlBQXNCLEVBQVMsVUFBa0I7UUFBakQsaUJBQVksR0FBWixZQUFZLENBQVU7UUFBUyxlQUFVLEdBQVYsVUFBVSxDQUFRO0lBQUcsQ0FBQztBQUMxRSxDQUFDO0FBRUQ7SUFDRSxZQUFtQixZQUFzQixFQUFTLFdBQXFCO1FBQXBELGlCQUFZLEdBQVosWUFBWSxDQUFVO1FBQVMsZ0JBQVcsR0FBWCxXQUFXLENBQVU7SUFBRyxDQUFDO0FBQzdFLENBQUM7QUFFRDs7R0FFRztBQUNIO0lBQ0UsWUFBbUIsTUFBYyxFQUFTLE9BQW1CO1FBQTFDLFdBQU0sR0FBTixNQUFNLENBQVE7UUFBUyxZQUFPLEdBQVAsT0FBTyxDQUFZO0lBQUcsQ0FBQztBQUNuRSxDQUFDO0FBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1N0cmluZ1dyYXBwZXIsIGlzQmxhbmt9IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvbGFuZyc7XG5cbnZhciBNT0RVTEVfUkVHRVhQID0gLyNNT0RVTEVcXFsoW15cXF1dKilcXF0vZztcblxuZXhwb3J0IGZ1bmN0aW9uIG1vZHVsZVJlZihtb2R1bGVVcmwpOiBzdHJpbmcge1xuICByZXR1cm4gYCNNT0RVTEVbJHttb2R1bGVVcmx9XWA7XG59XG5cbi8qKlxuICogUmVwcmVzZW50cyBnZW5lcmF0ZWQgc291cmNlIGNvZGUgd2l0aCBtb2R1bGUgcmVmZXJlbmNlcy4gSW50ZXJuYWwgdG8gdGhlIEFuZ3VsYXIgY29tcGlsZXIuXG4gKi9cbmV4cG9ydCBjbGFzcyBTb3VyY2VNb2R1bGUge1xuICBzdGF0aWMgZ2V0U291cmNlV2l0aG91dEltcG9ydHMoc291cmNlV2l0aE1vZHVsZVJlZnM6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgcmV0dXJuIFN0cmluZ1dyYXBwZXIucmVwbGFjZUFsbE1hcHBlZChzb3VyY2VXaXRoTW9kdWxlUmVmcywgTU9EVUxFX1JFR0VYUCwgKG1hdGNoKSA9PiAnJyk7XG4gIH1cblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgbW9kdWxlVXJsOiBzdHJpbmcsIHB1YmxpYyBzb3VyY2VXaXRoTW9kdWxlUmVmczogc3RyaW5nKSB7fVxuXG4gIGdldFNvdXJjZVdpdGhJbXBvcnRzKCk6IFNvdXJjZVdpdGhJbXBvcnRzIHtcbiAgICB2YXIgbW9kdWxlQWxpYXNlcyA9IHt9O1xuICAgIHZhciBpbXBvcnRzOiBzdHJpbmdbXVtdID0gW107XG4gICAgdmFyIG5ld1NvdXJjZSA9XG4gICAgICAgIFN0cmluZ1dyYXBwZXIucmVwbGFjZUFsbE1hcHBlZCh0aGlzLnNvdXJjZVdpdGhNb2R1bGVSZWZzLCBNT0RVTEVfUkVHRVhQLCAobWF0Y2gpID0+IHtcbiAgICAgICAgICB2YXIgbW9kdWxlVXJsID0gbWF0Y2hbMV07XG4gICAgICAgICAgdmFyIGFsaWFzID0gbW9kdWxlQWxpYXNlc1ttb2R1bGVVcmxdO1xuICAgICAgICAgIGlmIChpc0JsYW5rKGFsaWFzKSkge1xuICAgICAgICAgICAgaWYgKG1vZHVsZVVybCA9PSB0aGlzLm1vZHVsZVVybCkge1xuICAgICAgICAgICAgICBhbGlhcyA9ICcnO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgYWxpYXMgPSBgaW1wb3J0JHtpbXBvcnRzLmxlbmd0aH1gO1xuICAgICAgICAgICAgICBpbXBvcnRzLnB1c2goW21vZHVsZVVybCwgYWxpYXNdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG1vZHVsZUFsaWFzZXNbbW9kdWxlVXJsXSA9IGFsaWFzO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gYWxpYXMubGVuZ3RoID4gMCA/IGAke2FsaWFzfS5gIDogJyc7XG4gICAgICAgIH0pO1xuICAgIHJldHVybiBuZXcgU291cmNlV2l0aEltcG9ydHMobmV3U291cmNlLCBpbXBvcnRzKTtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgU291cmNlRXhwcmVzc2lvbiB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBkZWNsYXJhdGlvbnM6IHN0cmluZ1tdLCBwdWJsaWMgZXhwcmVzc2lvbjogc3RyaW5nKSB7fVxufVxuXG5leHBvcnQgY2xhc3MgU291cmNlRXhwcmVzc2lvbnMge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgZGVjbGFyYXRpb25zOiBzdHJpbmdbXSwgcHVibGljIGV4cHJlc3Npb25zOiBzdHJpbmdbXSkge31cbn1cblxuLyoqXG4gKiBSZXByZXNlbnRzIGdlbmVyYXRlZCBzb3VyY2UgY29kZSB3aXRoIGltcG9ydHMuIEludGVybmFsIHRvIHRoZSBBbmd1bGFyIGNvbXBpbGVyLlxuICovXG5leHBvcnQgY2xhc3MgU291cmNlV2l0aEltcG9ydHMge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgc291cmNlOiBzdHJpbmcsIHB1YmxpYyBpbXBvcnRzOiBzdHJpbmdbXVtdKSB7fVxufVxuIl19