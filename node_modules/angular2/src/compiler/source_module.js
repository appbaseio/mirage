'use strict';"use strict";
var lang_1 = require('angular2/src/facade/lang');
var MODULE_REGEXP = /#MODULE\[([^\]]*)\]/g;
function moduleRef(moduleUrl) {
    return "#MODULE[" + moduleUrl + "]";
}
exports.moduleRef = moduleRef;
/**
 * Represents generated source code with module references. Internal to the Angular compiler.
 */
var SourceModule = (function () {
    function SourceModule(moduleUrl, sourceWithModuleRefs) {
        this.moduleUrl = moduleUrl;
        this.sourceWithModuleRefs = sourceWithModuleRefs;
    }
    SourceModule.getSourceWithoutImports = function (sourceWithModuleRefs) {
        return lang_1.StringWrapper.replaceAllMapped(sourceWithModuleRefs, MODULE_REGEXP, function (match) { return ''; });
    };
    SourceModule.prototype.getSourceWithImports = function () {
        var _this = this;
        var moduleAliases = {};
        var imports = [];
        var newSource = lang_1.StringWrapper.replaceAllMapped(this.sourceWithModuleRefs, MODULE_REGEXP, function (match) {
            var moduleUrl = match[1];
            var alias = moduleAliases[moduleUrl];
            if (lang_1.isBlank(alias)) {
                if (moduleUrl == _this.moduleUrl) {
                    alias = '';
                }
                else {
                    alias = "import" + imports.length;
                    imports.push([moduleUrl, alias]);
                }
                moduleAliases[moduleUrl] = alias;
            }
            return alias.length > 0 ? alias + "." : '';
        });
        return new SourceWithImports(newSource, imports);
    };
    return SourceModule;
}());
exports.SourceModule = SourceModule;
var SourceExpression = (function () {
    function SourceExpression(declarations, expression) {
        this.declarations = declarations;
        this.expression = expression;
    }
    return SourceExpression;
}());
exports.SourceExpression = SourceExpression;
var SourceExpressions = (function () {
    function SourceExpressions(declarations, expressions) {
        this.declarations = declarations;
        this.expressions = expressions;
    }
    return SourceExpressions;
}());
exports.SourceExpressions = SourceExpressions;
/**
 * Represents generated source code with imports. Internal to the Angular compiler.
 */
var SourceWithImports = (function () {
    function SourceWithImports(source, imports) {
        this.source = source;
        this.imports = imports;
    }
    return SourceWithImports;
}());
exports.SourceWithImports = SourceWithImports;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic291cmNlX21vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRpZmZpbmdfcGx1Z2luX3dyYXBwZXItb3V0cHV0X3BhdGgtamFrWG5NbUwudG1wL2FuZ3VsYXIyL3NyYy9jb21waWxlci9zb3VyY2VfbW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxxQkFBcUMsMEJBQTBCLENBQUMsQ0FBQTtBQUVoRSxJQUFJLGFBQWEsR0FBRyxzQkFBc0IsQ0FBQztBQUUzQyxtQkFBMEIsU0FBUztJQUNqQyxNQUFNLENBQUMsYUFBVyxTQUFTLE1BQUcsQ0FBQztBQUNqQyxDQUFDO0FBRmUsaUJBQVMsWUFFeEIsQ0FBQTtBQUVEOztHQUVHO0FBQ0g7SUFLRSxzQkFBbUIsU0FBaUIsRUFBUyxvQkFBNEI7UUFBdEQsY0FBUyxHQUFULFNBQVMsQ0FBUTtRQUFTLHlCQUFvQixHQUFwQixvQkFBb0IsQ0FBUTtJQUFHLENBQUM7SUFKdEUsb0NBQXVCLEdBQTlCLFVBQStCLG9CQUE0QjtRQUN6RCxNQUFNLENBQUMsb0JBQWEsQ0FBQyxnQkFBZ0IsQ0FBQyxvQkFBb0IsRUFBRSxhQUFhLEVBQUUsVUFBQyxLQUFLLElBQUssT0FBQSxFQUFFLEVBQUYsQ0FBRSxDQUFDLENBQUM7SUFDNUYsQ0FBQztJQUlELDJDQUFvQixHQUFwQjtRQUFBLGlCQW1CQztRQWxCQyxJQUFJLGFBQWEsR0FBRyxFQUFFLENBQUM7UUFDdkIsSUFBSSxPQUFPLEdBQWUsRUFBRSxDQUFDO1FBQzdCLElBQUksU0FBUyxHQUNULG9CQUFhLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLG9CQUFvQixFQUFFLGFBQWEsRUFBRSxVQUFDLEtBQUs7WUFDN0UsSUFBSSxTQUFTLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3pCLElBQUksS0FBSyxHQUFHLGFBQWEsQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUNyQyxFQUFFLENBQUMsQ0FBQyxjQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNuQixFQUFFLENBQUMsQ0FBQyxTQUFTLElBQUksS0FBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7b0JBQ2hDLEtBQUssR0FBRyxFQUFFLENBQUM7Z0JBQ2IsQ0FBQztnQkFBQyxJQUFJLENBQUMsQ0FBQztvQkFDTixLQUFLLEdBQUcsV0FBUyxPQUFPLENBQUMsTUFBUSxDQUFDO29CQUNsQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsU0FBUyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUM7Z0JBQ25DLENBQUM7Z0JBQ0QsYUFBYSxDQUFDLFNBQVMsQ0FBQyxHQUFHLEtBQUssQ0FBQztZQUNuQyxDQUFDO1lBQ0QsTUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxHQUFNLEtBQUssTUFBRyxHQUFHLEVBQUUsQ0FBQztRQUM3QyxDQUFDLENBQUMsQ0FBQztRQUNQLE1BQU0sQ0FBQyxJQUFJLGlCQUFpQixDQUFDLFNBQVMsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUNuRCxDQUFDO0lBQ0gsbUJBQUM7QUFBRCxDQUFDLEFBM0JELElBMkJDO0FBM0JZLG9CQUFZLGVBMkJ4QixDQUFBO0FBRUQ7SUFDRSwwQkFBbUIsWUFBc0IsRUFBUyxVQUFrQjtRQUFqRCxpQkFBWSxHQUFaLFlBQVksQ0FBVTtRQUFTLGVBQVUsR0FBVixVQUFVLENBQVE7SUFBRyxDQUFDO0lBQzFFLHVCQUFDO0FBQUQsQ0FBQyxBQUZELElBRUM7QUFGWSx3QkFBZ0IsbUJBRTVCLENBQUE7QUFFRDtJQUNFLDJCQUFtQixZQUFzQixFQUFTLFdBQXFCO1FBQXBELGlCQUFZLEdBQVosWUFBWSxDQUFVO1FBQVMsZ0JBQVcsR0FBWCxXQUFXLENBQVU7SUFBRyxDQUFDO0lBQzdFLHdCQUFDO0FBQUQsQ0FBQyxBQUZELElBRUM7QUFGWSx5QkFBaUIsb0JBRTdCLENBQUE7QUFFRDs7R0FFRztBQUNIO0lBQ0UsMkJBQW1CLE1BQWMsRUFBUyxPQUFtQjtRQUExQyxXQUFNLEdBQU4sTUFBTSxDQUFRO1FBQVMsWUFBTyxHQUFQLE9BQU8sQ0FBWTtJQUFHLENBQUM7SUFDbkUsd0JBQUM7QUFBRCxDQUFDLEFBRkQsSUFFQztBQUZZLHlCQUFpQixvQkFFN0IsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7U3RyaW5nV3JhcHBlciwgaXNCbGFua30gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9sYW5nJztcblxudmFyIE1PRFVMRV9SRUdFWFAgPSAvI01PRFVMRVxcWyhbXlxcXV0qKVxcXS9nO1xuXG5leHBvcnQgZnVuY3Rpb24gbW9kdWxlUmVmKG1vZHVsZVVybCk6IHN0cmluZyB7XG4gIHJldHVybiBgI01PRFVMRVske21vZHVsZVVybH1dYDtcbn1cblxuLyoqXG4gKiBSZXByZXNlbnRzIGdlbmVyYXRlZCBzb3VyY2UgY29kZSB3aXRoIG1vZHVsZSByZWZlcmVuY2VzLiBJbnRlcm5hbCB0byB0aGUgQW5ndWxhciBjb21waWxlci5cbiAqL1xuZXhwb3J0IGNsYXNzIFNvdXJjZU1vZHVsZSB7XG4gIHN0YXRpYyBnZXRTb3VyY2VXaXRob3V0SW1wb3J0cyhzb3VyY2VXaXRoTW9kdWxlUmVmczogc3RyaW5nKTogc3RyaW5nIHtcbiAgICByZXR1cm4gU3RyaW5nV3JhcHBlci5yZXBsYWNlQWxsTWFwcGVkKHNvdXJjZVdpdGhNb2R1bGVSZWZzLCBNT0RVTEVfUkVHRVhQLCAobWF0Y2gpID0+ICcnKTtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBtb2R1bGVVcmw6IHN0cmluZywgcHVibGljIHNvdXJjZVdpdGhNb2R1bGVSZWZzOiBzdHJpbmcpIHt9XG5cbiAgZ2V0U291cmNlV2l0aEltcG9ydHMoKTogU291cmNlV2l0aEltcG9ydHMge1xuICAgIHZhciBtb2R1bGVBbGlhc2VzID0ge307XG4gICAgdmFyIGltcG9ydHM6IHN0cmluZ1tdW10gPSBbXTtcbiAgICB2YXIgbmV3U291cmNlID1cbiAgICAgICAgU3RyaW5nV3JhcHBlci5yZXBsYWNlQWxsTWFwcGVkKHRoaXMuc291cmNlV2l0aE1vZHVsZVJlZnMsIE1PRFVMRV9SRUdFWFAsIChtYXRjaCkgPT4ge1xuICAgICAgICAgIHZhciBtb2R1bGVVcmwgPSBtYXRjaFsxXTtcbiAgICAgICAgICB2YXIgYWxpYXMgPSBtb2R1bGVBbGlhc2VzW21vZHVsZVVybF07XG4gICAgICAgICAgaWYgKGlzQmxhbmsoYWxpYXMpKSB7XG4gICAgICAgICAgICBpZiAobW9kdWxlVXJsID09IHRoaXMubW9kdWxlVXJsKSB7XG4gICAgICAgICAgICAgIGFsaWFzID0gJyc7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBhbGlhcyA9IGBpbXBvcnQke2ltcG9ydHMubGVuZ3RofWA7XG4gICAgICAgICAgICAgIGltcG9ydHMucHVzaChbbW9kdWxlVXJsLCBhbGlhc10pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbW9kdWxlQWxpYXNlc1ttb2R1bGVVcmxdID0gYWxpYXM7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBhbGlhcy5sZW5ndGggPiAwID8gYCR7YWxpYXN9LmAgOiAnJztcbiAgICAgICAgfSk7XG4gICAgcmV0dXJuIG5ldyBTb3VyY2VXaXRoSW1wb3J0cyhuZXdTb3VyY2UsIGltcG9ydHMpO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBTb3VyY2VFeHByZXNzaW9uIHtcbiAgY29uc3RydWN0b3IocHVibGljIGRlY2xhcmF0aW9uczogc3RyaW5nW10sIHB1YmxpYyBleHByZXNzaW9uOiBzdHJpbmcpIHt9XG59XG5cbmV4cG9ydCBjbGFzcyBTb3VyY2VFeHByZXNzaW9ucyB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBkZWNsYXJhdGlvbnM6IHN0cmluZ1tdLCBwdWJsaWMgZXhwcmVzc2lvbnM6IHN0cmluZ1tdKSB7fVxufVxuXG4vKipcbiAqIFJlcHJlc2VudHMgZ2VuZXJhdGVkIHNvdXJjZSBjb2RlIHdpdGggaW1wb3J0cy4gSW50ZXJuYWwgdG8gdGhlIEFuZ3VsYXIgY29tcGlsZXIuXG4gKi9cbmV4cG9ydCBjbGFzcyBTb3VyY2VXaXRoSW1wb3J0cyB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBzb3VyY2U6IHN0cmluZywgcHVibGljIGltcG9ydHM6IHN0cmluZ1tdW10pIHt9XG59XG4iXX0=