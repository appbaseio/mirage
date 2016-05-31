import { ListWrapper, StringMapWrapper } from 'angular2/src/facade/collection';
import { isArray, isPresent, isPrimitive } from 'angular2/src/facade/lang';
import { AttributeMetadata, DirectiveMetadata, ComponentMetadata, ContentChildrenMetadata, ContentChildMetadata, InputMetadata, HostBindingMetadata, HostListenerMetadata, OutputMetadata, PipeMetadata, ViewMetadata, ViewChildMetadata, ViewChildrenMetadata, ViewQueryMetadata, QueryMetadata } from 'angular2/src/core/metadata';
/**
 * A token representing the a reference to a static type.
 *
 * This token is unique for a moduleId and name and can be used as a hash table key.
 */
export class StaticType {
    constructor(moduleId, name) {
        this.moduleId = moduleId;
        this.name = name;
    }
}
/**
 * A static reflector implements enough of the Reflector API that is necessary to compile
 * templates statically.
 */
export class StaticReflector {
    constructor(host) {
        this.host = host;
        this.typeCache = new Map();
        this.annotationCache = new Map();
        this.propertyCache = new Map();
        this.parameterCache = new Map();
        this.metadataCache = new Map();
        this.conversionMap = new Map();
        this.initializeConversionMap();
    }
    /**
     * getStatictype produces a Type whose metadata is known but whose implementation is not loaded.
     * All types passed to the StaticResolver should be pseudo-types returned by this method.
     *
     * @param moduleId the module identifier as would be passed to an import statement.
     * @param name the name of the type.
     */
    getStaticType(moduleId, name) {
        let key = `"${moduleId}".${name}`;
        let result = this.typeCache.get(key);
        if (!isPresent(result)) {
            result = new StaticType(moduleId, name);
            this.typeCache.set(key, result);
        }
        return result;
    }
    annotations(type) {
        let annotations = this.annotationCache.get(type);
        if (!isPresent(annotations)) {
            let classMetadata = this.getTypeMetadata(type);
            if (isPresent(classMetadata['decorators'])) {
                annotations = classMetadata['decorators']
                    .map(decorator => this.convertKnownDecorator(type.moduleId, decorator))
                    .filter(decorator => isPresent(decorator));
            }
            this.annotationCache.set(type, annotations);
        }
        return annotations;
    }
    propMetadata(type) {
        let propMetadata = this.propertyCache.get(type);
        if (!isPresent(propMetadata)) {
            let classMetadata = this.getTypeMetadata(type);
            propMetadata = this.getPropertyMetadata(type.moduleId, classMetadata['members']);
            this.propertyCache.set(type, propMetadata);
        }
        return propMetadata;
    }
    parameters(type) {
        let parameters = this.parameterCache.get(type);
        if (!isPresent(parameters)) {
            let classMetadata = this.getTypeMetadata(type);
            let ctorData = classMetadata['members']['__ctor__'];
            if (isPresent(ctorData)) {
                let ctor = ctorData.find(a => a['__symbolic'] === 'constructor');
                parameters = this.simplify(type.moduleId, ctor['parameters']);
                this.parameterCache.set(type, parameters);
            }
        }
        return parameters;
    }
    initializeConversionMap() {
        let core_metadata = 'angular2/src/core/metadata';
        let conversionMap = this.conversionMap;
        conversionMap.set(this.getStaticType(core_metadata, 'Directive'), (moduleContext, expression) => {
            let p0 = this.getDecoratorParameter(moduleContext, expression, 0);
            if (!isPresent(p0)) {
                p0 = {};
            }
            return new DirectiveMetadata({
                selector: p0['selector'],
                inputs: p0['inputs'],
                outputs: p0['outputs'],
                events: p0['events'],
                host: p0['host'],
                bindings: p0['bindings'],
                providers: p0['providers'],
                exportAs: p0['exportAs'],
                queries: p0['queries'],
            });
        });
        conversionMap.set(this.getStaticType(core_metadata, 'Component'), (moduleContext, expression) => {
            let p0 = this.getDecoratorParameter(moduleContext, expression, 0);
            if (!isPresent(p0)) {
                p0 = {};
            }
            return new ComponentMetadata({
                selector: p0['selector'],
                inputs: p0['inputs'],
                outputs: p0['outputs'],
                properties: p0['properties'],
                events: p0['events'],
                host: p0['host'],
                exportAs: p0['exportAs'],
                moduleId: p0['moduleId'],
                bindings: p0['bindings'],
                providers: p0['providers'],
                viewBindings: p0['viewBindings'],
                viewProviders: p0['viewProviders'],
                changeDetection: p0['changeDetection'],
                queries: p0['queries'],
                templateUrl: p0['templateUrl'],
                template: p0['template'],
                styleUrls: p0['styleUrls'],
                styles: p0['styles'],
                directives: p0['directives'],
                pipes: p0['pipes'],
                encapsulation: p0['encapsulation']
            });
        });
        conversionMap.set(this.getStaticType(core_metadata, 'Input'), (moduleContext, expression) => new InputMetadata(this.getDecoratorParameter(moduleContext, expression, 0)));
        conversionMap.set(this.getStaticType(core_metadata, 'Output'), (moduleContext, expression) => new OutputMetadata(this.getDecoratorParameter(moduleContext, expression, 0)));
        conversionMap.set(this.getStaticType(core_metadata, 'View'), (moduleContext, expression) => {
            let p0 = this.getDecoratorParameter(moduleContext, expression, 0);
            if (!isPresent(p0)) {
                p0 = {};
            }
            return new ViewMetadata({
                templateUrl: p0['templateUrl'],
                template: p0['template'],
                directives: p0['directives'],
                pipes: p0['pipes'],
                encapsulation: p0['encapsulation'],
                styles: p0['styles'],
            });
        });
        conversionMap.set(this.getStaticType(core_metadata, 'Attribute'), (moduleContext, expression) => new AttributeMetadata(this.getDecoratorParameter(moduleContext, expression, 0)));
        conversionMap.set(this.getStaticType(core_metadata, 'Query'), (moduleContext, expression) => {
            let p0 = this.getDecoratorParameter(moduleContext, expression, 0);
            let p1 = this.getDecoratorParameter(moduleContext, expression, 1);
            if (!isPresent(p1)) {
                p1 = {};
            }
            return new QueryMetadata(p0, { descendants: p1.descendants, first: p1.first });
        });
        conversionMap.set(this.getStaticType(core_metadata, 'ContentChildren'), (moduleContext, expression) => new ContentChildrenMetadata(this.getDecoratorParameter(moduleContext, expression, 0)));
        conversionMap.set(this.getStaticType(core_metadata, 'ContentChild'), (moduleContext, expression) => new ContentChildMetadata(this.getDecoratorParameter(moduleContext, expression, 0)));
        conversionMap.set(this.getStaticType(core_metadata, 'ViewChildren'), (moduleContext, expression) => new ViewChildrenMetadata(this.getDecoratorParameter(moduleContext, expression, 0)));
        conversionMap.set(this.getStaticType(core_metadata, 'ViewChild'), (moduleContext, expression) => new ViewChildMetadata(this.getDecoratorParameter(moduleContext, expression, 0)));
        conversionMap.set(this.getStaticType(core_metadata, 'ViewQuery'), (moduleContext, expression) => {
            let p0 = this.getDecoratorParameter(moduleContext, expression, 0);
            let p1 = this.getDecoratorParameter(moduleContext, expression, 1);
            if (!isPresent(p1)) {
                p1 = {};
            }
            return new ViewQueryMetadata(p0, {
                descendants: p1['descendants'],
                first: p1['first'],
            });
        });
        conversionMap.set(this.getStaticType(core_metadata, 'Pipe'), (moduleContext, expression) => {
            let p0 = this.getDecoratorParameter(moduleContext, expression, 0);
            if (!isPresent(p0)) {
                p0 = {};
            }
            return new PipeMetadata({
                name: p0['name'],
                pure: p0['pure'],
            });
        });
        conversionMap.set(this.getStaticType(core_metadata, 'HostBinding'), (moduleContext, expression) => new HostBindingMetadata(this.getDecoratorParameter(moduleContext, expression, 0)));
        conversionMap.set(this.getStaticType(core_metadata, 'HostListener'), (moduleContext, expression) => new HostListenerMetadata(this.getDecoratorParameter(moduleContext, expression, 0), this.getDecoratorParameter(moduleContext, expression, 1)));
        return null;
    }
    convertKnownDecorator(moduleContext, expression) {
        let converter = this.conversionMap.get(this.getDecoratorType(moduleContext, expression));
        if (isPresent(converter))
            return converter(moduleContext, expression);
        return null;
    }
    getDecoratorType(moduleContext, expression) {
        if (isMetadataSymbolicCallExpression(expression)) {
            let target = expression['expression'];
            if (isMetadataSymbolicReferenceExpression(target)) {
                let moduleId = this.normalizeModuleName(moduleContext, target['module']);
                return this.getStaticType(moduleId, target['name']);
            }
        }
        return null;
    }
    getDecoratorParameter(moduleContext, expression, index) {
        if (isMetadataSymbolicCallExpression(expression) && isPresent(expression['arguments']) &&
            expression['arguments'].length <= index + 1) {
            return this.simplify(moduleContext, expression['arguments'][index]);
        }
        return null;
    }
    getPropertyMetadata(moduleContext, value) {
        if (isPresent(value)) {
            let result = {};
            StringMapWrapper.forEach(value, (value, name) => {
                let data = this.getMemberData(moduleContext, value);
                if (isPresent(data)) {
                    let propertyData = data.filter(d => d['kind'] == "property")
                        .map(d => d['directives'])
                        .reduce((p, c) => p.concat(c), []);
                    if (propertyData.length != 0) {
                        StringMapWrapper.set(result, name, propertyData);
                    }
                }
            });
            return result;
        }
        return null;
    }
    // clang-format off
    getMemberData(moduleContext, member) {
        // clang-format on
        let result = [];
        if (isPresent(member)) {
            for (let item of member) {
                result.push({
                    kind: item['__symbolic'],
                    directives: isPresent(item['decorators']) ?
                        item['decorators']
                            .map(decorator => this.convertKnownDecorator(moduleContext, decorator))
                            .filter(d => isPresent(d)) :
                        null
                });
            }
        }
        return result;
    }
    /** @internal */
    simplify(moduleContext, value) {
        let _this = this;
        function simplify(expression) {
            if (isPrimitive(expression)) {
                return expression;
            }
            if (isArray(expression)) {
                let result = [];
                for (let item of expression) {
                    result.push(simplify(item));
                }
                return result;
            }
            if (isPresent(expression)) {
                if (isPresent(expression['__symbolic'])) {
                    switch (expression['__symbolic']) {
                        case "binop":
                            let left = simplify(expression['left']);
                            let right = simplify(expression['right']);
                            switch (expression['operator']) {
                                case '&&':
                                    return left && right;
                                case '||':
                                    return left || right;
                                case '|':
                                    return left | right;
                                case '^':
                                    return left ^ right;
                                case '&':
                                    return left & right;
                                case '==':
                                    return left == right;
                                case '!=':
                                    return left != right;
                                case '===':
                                    return left === right;
                                case '!==':
                                    return left !== right;
                                case '<':
                                    return left < right;
                                case '>':
                                    return left > right;
                                case '<=':
                                    return left <= right;
                                case '>=':
                                    return left >= right;
                                case '<<':
                                    return left << right;
                                case '>>':
                                    return left >> right;
                                case '+':
                                    return left + right;
                                case '-':
                                    return left - right;
                                case '*':
                                    return left * right;
                                case '/':
                                    return left / right;
                                case '%':
                                    return left % right;
                            }
                            return null;
                        case "pre":
                            let operand = simplify(expression['operand']);
                            switch (expression['operator']) {
                                case '+':
                                    return operand;
                                case '-':
                                    return -operand;
                                case '!':
                                    return !operand;
                                case '~':
                                    return ~operand;
                            }
                            return null;
                        case "index":
                            let indexTarget = simplify(expression['expression']);
                            let index = simplify(expression['index']);
                            if (isPresent(indexTarget) && isPrimitive(index))
                                return indexTarget[index];
                            return null;
                        case "select":
                            let selectTarget = simplify(expression['expression']);
                            let member = simplify(expression['member']);
                            if (isPresent(selectTarget) && isPrimitive(member))
                                return selectTarget[member];
                            return null;
                        case "reference":
                            let referenceModuleName = _this.normalizeModuleName(moduleContext, expression['module']);
                            let referenceModule = _this.getModuleMetadata(referenceModuleName);
                            let referenceValue = referenceModule['metadata'][expression['name']];
                            if (isClassMetadata(referenceValue)) {
                                // Convert to a pseudo type
                                return _this.getStaticType(referenceModuleName, expression['name']);
                            }
                            return _this.simplify(referenceModuleName, referenceValue);
                        case "call":
                            return null;
                    }
                    return null;
                }
                let result = {};
                StringMapWrapper.forEach(expression, (value, name) => { result[name] = simplify(value); });
                return result;
            }
            return null;
        }
        return simplify(value);
    }
    getModuleMetadata(module) {
        let moduleMetadata = this.metadataCache.get(module);
        if (!isPresent(moduleMetadata)) {
            moduleMetadata = this.host.getMetadataFor(module);
            if (!isPresent(moduleMetadata)) {
                moduleMetadata = { __symbolic: "module", module: module, metadata: {} };
            }
            this.metadataCache.set(module, moduleMetadata);
        }
        return moduleMetadata;
    }
    getTypeMetadata(type) {
        let moduleMetadata = this.getModuleMetadata(type.moduleId);
        let result = moduleMetadata['metadata'][type.name];
        if (!isPresent(result)) {
            result = { __symbolic: "class" };
        }
        return result;
    }
    normalizeModuleName(from, to) {
        if (to.startsWith('.')) {
            return pathTo(from, to);
        }
        return to;
    }
}
function isMetadataSymbolicCallExpression(expression) {
    return !isPrimitive(expression) && !isArray(expression) && expression['__symbolic'] == 'call';
}
function isMetadataSymbolicReferenceExpression(expression) {
    return !isPrimitive(expression) && !isArray(expression) &&
        expression['__symbolic'] == 'reference';
}
function isClassMetadata(expression) {
    return !isPrimitive(expression) && !isArray(expression) && expression['__symbolic'] == 'class';
}
function splitPath(path) {
    return path.split(/\/|\\/g);
}
function resolvePath(pathParts) {
    let result = [];
    ListWrapper.forEachWithIndex(pathParts, (part, index) => {
        switch (part) {
            case '':
            case '.':
                if (index > 0)
                    return;
                break;
            case '..':
                if (index > 0 && result.length != 0)
                    result.pop();
                return;
        }
        result.push(part);
    });
    return result.join('/');
}
function pathTo(from, to) {
    let result = to;
    if (to.startsWith('.')) {
        let fromParts = splitPath(from);
        fromParts.pop(); // remove the file name.
        let toParts = splitPath(to);
        result = resolvePath(fromParts.concat(toParts));
    }
    return result;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhdGljX3JlZmxlY3Rvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRpZmZpbmdfcGx1Z2luX3dyYXBwZXItb3V0cHV0X3BhdGgtb1hETzRwMnYudG1wL2FuZ3VsYXIyL3NyYy9jb21waWxlci9zdGF0aWNfcmVmbGVjdG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJPQUFPLEVBQUMsV0FBVyxFQUFFLGdCQUFnQixFQUFDLE1BQU0sZ0NBQWdDO09BQ3JFLEVBQ0wsT0FBTyxFQUdQLFNBQVMsRUFDVCxXQUFXLEVBR1osTUFBTSwwQkFBMEI7T0FDMUIsRUFDTCxpQkFBaUIsRUFDakIsaUJBQWlCLEVBQ2pCLGlCQUFpQixFQUNqQix1QkFBdUIsRUFDdkIsb0JBQW9CLEVBQ3BCLGFBQWEsRUFDYixtQkFBbUIsRUFDbkIsb0JBQW9CLEVBQ3BCLGNBQWMsRUFDZCxZQUFZLEVBQ1osWUFBWSxFQUNaLGlCQUFpQixFQUNqQixvQkFBb0IsRUFDcEIsaUJBQWlCLEVBQ2pCLGFBQWEsRUFDZCxNQUFNLDRCQUE0QjtBQW1CbkM7Ozs7R0FJRztBQUNIO0lBQ0UsWUFBbUIsUUFBZ0IsRUFBUyxJQUFZO1FBQXJDLGFBQVEsR0FBUixRQUFRLENBQVE7UUFBUyxTQUFJLEdBQUosSUFBSSxDQUFRO0lBQUcsQ0FBQztBQUM5RCxDQUFDO0FBRUQ7OztHQUdHO0FBQ0g7SUFPRSxZQUFvQixJQUF5QjtRQUF6QixTQUFJLEdBQUosSUFBSSxDQUFxQjtRQU5yQyxjQUFTLEdBQUcsSUFBSSxHQUFHLEVBQXNCLENBQUM7UUFDMUMsb0JBQWUsR0FBRyxJQUFJLEdBQUcsRUFBcUIsQ0FBQztRQUMvQyxrQkFBYSxHQUFHLElBQUksR0FBRyxFQUFvQyxDQUFDO1FBQzVELG1CQUFjLEdBQUcsSUFBSSxHQUFHLEVBQXFCLENBQUM7UUFDOUMsa0JBQWEsR0FBRyxJQUFJLEdBQUcsRUFBZ0MsQ0FBQztRQTJEeEQsa0JBQWEsR0FBRyxJQUFJLEdBQUcsRUFBK0QsQ0FBQztRQXpEOUMsSUFBSSxDQUFDLHVCQUF1QixFQUFFLENBQUM7SUFBQyxDQUFDO0lBRWxGOzs7Ozs7T0FNRztJQUNJLGFBQWEsQ0FBQyxRQUFnQixFQUFFLElBQVk7UUFDakQsSUFBSSxHQUFHLEdBQUcsSUFBSSxRQUFRLEtBQUssSUFBSSxFQUFFLENBQUM7UUFDbEMsSUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDckMsRUFBRSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3ZCLE1BQU0sR0FBRyxJQUFJLFVBQVUsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDeEMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ2xDLENBQUM7UUFDRCxNQUFNLENBQUMsTUFBTSxDQUFDO0lBQ2hCLENBQUM7SUFFTSxXQUFXLENBQUMsSUFBZ0I7UUFDakMsSUFBSSxXQUFXLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDakQsRUFBRSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzVCLElBQUksYUFBYSxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDL0MsRUFBRSxDQUFDLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDM0MsV0FBVyxHQUFXLGFBQWEsQ0FBQyxZQUFZLENBQUU7cUJBQy9CLEdBQUcsQ0FBQyxTQUFTLElBQUksSUFBSSxDQUFDLHFCQUFxQixDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsU0FBUyxDQUFDLENBQUM7cUJBQ3RFLE1BQU0sQ0FBQyxTQUFTLElBQUksU0FBUyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7WUFDL0QsQ0FBQztZQUNELElBQUksQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxXQUFXLENBQUMsQ0FBQztRQUM5QyxDQUFDO1FBQ0QsTUFBTSxDQUFDLFdBQVcsQ0FBQztJQUNyQixDQUFDO0lBRU0sWUFBWSxDQUFDLElBQWdCO1FBQ2xDLElBQUksWUFBWSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2hELEVBQUUsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM3QixJQUFJLGFBQWEsR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQy9DLFlBQVksR0FBRyxJQUFJLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxhQUFhLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztZQUNqRixJQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsWUFBWSxDQUFDLENBQUM7UUFDN0MsQ0FBQztRQUNELE1BQU0sQ0FBQyxZQUFZLENBQUM7SUFDdEIsQ0FBQztJQUVNLFVBQVUsQ0FBQyxJQUFnQjtRQUNoQyxJQUFJLFVBQVUsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUMvQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDM0IsSUFBSSxhQUFhLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUMvQyxJQUFJLFFBQVEsR0FBRyxhQUFhLENBQUMsU0FBUyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDcEQsRUFBRSxDQUFDLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDeEIsSUFBSSxJQUFJLEdBQVcsUUFBUyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLFlBQVksQ0FBQyxLQUFLLGFBQWEsQ0FBQyxDQUFDO2dCQUMxRSxVQUFVLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO2dCQUM5RCxJQUFJLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsVUFBVSxDQUFDLENBQUM7WUFDNUMsQ0FBQztRQUNILENBQUM7UUFDRCxNQUFNLENBQUMsVUFBVSxDQUFDO0lBQ3BCLENBQUM7SUFHTyx1QkFBdUI7UUFDN0IsSUFBSSxhQUFhLEdBQUcsNEJBQTRCLENBQUM7UUFDakQsSUFBSSxhQUFhLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQztRQUN2QyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsYUFBYSxFQUFFLFdBQVcsQ0FBQyxFQUM5QyxDQUFDLGFBQWEsRUFBRSxVQUFVO1lBQ3hCLElBQUksRUFBRSxHQUFHLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxhQUFhLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ2xFLEVBQUUsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDbkIsRUFBRSxHQUFHLEVBQUUsQ0FBQztZQUNWLENBQUM7WUFDRCxNQUFNLENBQUMsSUFBSSxpQkFBaUIsQ0FBQztnQkFDM0IsUUFBUSxFQUFFLEVBQUUsQ0FBQyxVQUFVLENBQUM7Z0JBQ3hCLE1BQU0sRUFBRSxFQUFFLENBQUMsUUFBUSxDQUFDO2dCQUNwQixPQUFPLEVBQUUsRUFBRSxDQUFDLFNBQVMsQ0FBQztnQkFDdEIsTUFBTSxFQUFFLEVBQUUsQ0FBQyxRQUFRLENBQUM7Z0JBQ3BCLElBQUksRUFBRSxFQUFFLENBQUMsTUFBTSxDQUFDO2dCQUNoQixRQUFRLEVBQUUsRUFBRSxDQUFDLFVBQVUsQ0FBQztnQkFDeEIsU0FBUyxFQUFFLEVBQUUsQ0FBQyxXQUFXLENBQUM7Z0JBQzFCLFFBQVEsRUFBRSxFQUFFLENBQUMsVUFBVSxDQUFDO2dCQUN4QixPQUFPLEVBQUUsRUFBRSxDQUFDLFNBQVMsQ0FBQzthQUN2QixDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUNyQixhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsYUFBYSxFQUFFLFdBQVcsQ0FBQyxFQUM5QyxDQUFDLGFBQWEsRUFBRSxVQUFVO1lBQ3hCLElBQUksRUFBRSxHQUFHLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxhQUFhLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ2xFLEVBQUUsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDbkIsRUFBRSxHQUFHLEVBQUUsQ0FBQztZQUNWLENBQUM7WUFDRCxNQUFNLENBQUMsSUFBSSxpQkFBaUIsQ0FBQztnQkFDM0IsUUFBUSxFQUFFLEVBQUUsQ0FBQyxVQUFVLENBQUM7Z0JBQ3hCLE1BQU0sRUFBRSxFQUFFLENBQUMsUUFBUSxDQUFDO2dCQUNwQixPQUFPLEVBQUUsRUFBRSxDQUFDLFNBQVMsQ0FBQztnQkFDdEIsVUFBVSxFQUFFLEVBQUUsQ0FBQyxZQUFZLENBQUM7Z0JBQzVCLE1BQU0sRUFBRSxFQUFFLENBQUMsUUFBUSxDQUFDO2dCQUNwQixJQUFJLEVBQUUsRUFBRSxDQUFDLE1BQU0sQ0FBQztnQkFDaEIsUUFBUSxFQUFFLEVBQUUsQ0FBQyxVQUFVLENBQUM7Z0JBQ3hCLFFBQVEsRUFBRSxFQUFFLENBQUMsVUFBVSxDQUFDO2dCQUN4QixRQUFRLEVBQUUsRUFBRSxDQUFDLFVBQVUsQ0FBQztnQkFDeEIsU0FBUyxFQUFFLEVBQUUsQ0FBQyxXQUFXLENBQUM7Z0JBQzFCLFlBQVksRUFBRSxFQUFFLENBQUMsY0FBYyxDQUFDO2dCQUNoQyxhQUFhLEVBQUUsRUFBRSxDQUFDLGVBQWUsQ0FBQztnQkFDbEMsZUFBZSxFQUFFLEVBQUUsQ0FBQyxpQkFBaUIsQ0FBQztnQkFDdEMsT0FBTyxFQUFFLEVBQUUsQ0FBQyxTQUFTLENBQUM7Z0JBQ3RCLFdBQVcsRUFBRSxFQUFFLENBQUMsYUFBYSxDQUFDO2dCQUM5QixRQUFRLEVBQUUsRUFBRSxDQUFDLFVBQVUsQ0FBQztnQkFDeEIsU0FBUyxFQUFFLEVBQUUsQ0FBQyxXQUFXLENBQUM7Z0JBQzFCLE1BQU0sRUFBRSxFQUFFLENBQUMsUUFBUSxDQUFDO2dCQUNwQixVQUFVLEVBQUUsRUFBRSxDQUFDLFlBQVksQ0FBQztnQkFDNUIsS0FBSyxFQUFFLEVBQUUsQ0FBQyxPQUFPLENBQUM7Z0JBQ2xCLGFBQWEsRUFBRSxFQUFFLENBQUMsZUFBZSxDQUFDO2FBQ25DLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO1FBQ3JCLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxhQUFhLEVBQUUsT0FBTyxDQUFDLEVBQzFDLENBQUMsYUFBYSxFQUFFLFVBQVUsS0FBSyxJQUFJLGFBQWEsQ0FDNUMsSUFBSSxDQUFDLHFCQUFxQixDQUFDLGFBQWEsRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2pGLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxhQUFhLEVBQUUsUUFBUSxDQUFDLEVBQzNDLENBQUMsYUFBYSxFQUFFLFVBQVUsS0FBSyxJQUFJLGNBQWMsQ0FDN0MsSUFBSSxDQUFDLHFCQUFxQixDQUFDLGFBQWEsRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2pGLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxhQUFhLEVBQUUsTUFBTSxDQUFDLEVBQUUsQ0FBQyxhQUFhLEVBQUUsVUFBVTtZQUNyRixJQUFJLEVBQUUsR0FBRyxJQUFJLENBQUMscUJBQXFCLENBQUMsYUFBYSxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUNsRSxFQUFFLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ25CLEVBQUUsR0FBRyxFQUFFLENBQUM7WUFDVixDQUFDO1lBQ0QsTUFBTSxDQUFDLElBQUksWUFBWSxDQUFDO2dCQUN0QixXQUFXLEVBQUUsRUFBRSxDQUFDLGFBQWEsQ0FBQztnQkFDOUIsUUFBUSxFQUFFLEVBQUUsQ0FBQyxVQUFVLENBQUM7Z0JBQ3hCLFVBQVUsRUFBRSxFQUFFLENBQUMsWUFBWSxDQUFDO2dCQUM1QixLQUFLLEVBQUUsRUFBRSxDQUFDLE9BQU8sQ0FBQztnQkFDbEIsYUFBYSxFQUFFLEVBQUUsQ0FBQyxlQUFlLENBQUM7Z0JBQ2xDLE1BQU0sRUFBRSxFQUFFLENBQUMsUUFBUSxDQUFDO2FBQ3JCLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO1FBQ0gsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLGFBQWEsRUFBRSxXQUFXLENBQUMsRUFDOUMsQ0FBQyxhQUFhLEVBQUUsVUFBVSxLQUFLLElBQUksaUJBQWlCLENBQ2hELElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxhQUFhLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNqRixhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsYUFBYSxFQUFFLE9BQU8sQ0FBQyxFQUFFLENBQUMsYUFBYSxFQUFFLFVBQVU7WUFDdEYsSUFBSSxFQUFFLEdBQUcsSUFBSSxDQUFDLHFCQUFxQixDQUFDLGFBQWEsRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDbEUsSUFBSSxFQUFFLEdBQUcsSUFBSSxDQUFDLHFCQUFxQixDQUFDLGFBQWEsRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDbEUsRUFBRSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNuQixFQUFFLEdBQUcsRUFBRSxDQUFDO1lBQ1YsQ0FBQztZQUNELE1BQU0sQ0FBQyxJQUFJLGFBQWEsQ0FBQyxFQUFFLEVBQUUsRUFBQyxXQUFXLEVBQUUsRUFBRSxDQUFDLFdBQVcsRUFBRSxLQUFLLEVBQUUsRUFBRSxDQUFDLEtBQUssRUFBQyxDQUFDLENBQUM7UUFDL0UsQ0FBQyxDQUFDLENBQUM7UUFDSCxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsYUFBYSxFQUFFLGlCQUFpQixDQUFDLEVBQ3BELENBQUMsYUFBYSxFQUFFLFVBQVUsS0FBSyxJQUFJLHVCQUF1QixDQUN0RCxJQUFJLENBQUMscUJBQXFCLENBQUMsYUFBYSxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDakYsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLGFBQWEsRUFBRSxjQUFjLENBQUMsRUFDakQsQ0FBQyxhQUFhLEVBQUUsVUFBVSxLQUFLLElBQUksb0JBQW9CLENBQ25ELElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxhQUFhLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNqRixhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsYUFBYSxFQUFFLGNBQWMsQ0FBQyxFQUNqRCxDQUFDLGFBQWEsRUFBRSxVQUFVLEtBQUssSUFBSSxvQkFBb0IsQ0FDbkQsSUFBSSxDQUFDLHFCQUFxQixDQUFDLGFBQWEsRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2pGLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxhQUFhLEVBQUUsV0FBVyxDQUFDLEVBQzlDLENBQUMsYUFBYSxFQUFFLFVBQVUsS0FBSyxJQUFJLGlCQUFpQixDQUNoRCxJQUFJLENBQUMscUJBQXFCLENBQUMsYUFBYSxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDakYsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLGFBQWEsRUFBRSxXQUFXLENBQUMsRUFDOUMsQ0FBQyxhQUFhLEVBQUUsVUFBVTtZQUN4QixJQUFJLEVBQUUsR0FBRyxJQUFJLENBQUMscUJBQXFCLENBQUMsYUFBYSxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUNsRSxJQUFJLEVBQUUsR0FBRyxJQUFJLENBQUMscUJBQXFCLENBQUMsYUFBYSxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUNsRSxFQUFFLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ25CLEVBQUUsR0FBRyxFQUFFLENBQUM7WUFDVixDQUFDO1lBQ0QsTUFBTSxDQUFDLElBQUksaUJBQWlCLENBQUMsRUFBRSxFQUFFO2dCQUMvQixXQUFXLEVBQUUsRUFBRSxDQUFDLGFBQWEsQ0FBQztnQkFDOUIsS0FBSyxFQUFFLEVBQUUsQ0FBQyxPQUFPLENBQUM7YUFDbkIsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFDckIsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLGFBQWEsRUFBRSxNQUFNLENBQUMsRUFBRSxDQUFDLGFBQWEsRUFBRSxVQUFVO1lBQ3JGLElBQUksRUFBRSxHQUFHLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxhQUFhLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ2xFLEVBQUUsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDbkIsRUFBRSxHQUFHLEVBQUUsQ0FBQztZQUNWLENBQUM7WUFDRCxNQUFNLENBQUMsSUFBSSxZQUFZLENBQUM7Z0JBQ3RCLElBQUksRUFBRSxFQUFFLENBQUMsTUFBTSxDQUFDO2dCQUNoQixJQUFJLEVBQUUsRUFBRSxDQUFDLE1BQU0sQ0FBQzthQUNqQixDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUNILGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxhQUFhLEVBQUUsYUFBYSxDQUFDLEVBQ2hELENBQUMsYUFBYSxFQUFFLFVBQVUsS0FBSyxJQUFJLG1CQUFtQixDQUNsRCxJQUFJLENBQUMscUJBQXFCLENBQUMsYUFBYSxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDakYsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLGFBQWEsRUFBRSxjQUFjLENBQUMsRUFDakQsQ0FBQyxhQUFhLEVBQUUsVUFBVSxLQUFLLElBQUksb0JBQW9CLENBQ25ELElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxhQUFhLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQyxFQUN4RCxJQUFJLENBQUMscUJBQXFCLENBQUMsYUFBYSxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDakYsTUFBTSxDQUFDLElBQUksQ0FBQztJQUNkLENBQUM7SUFFTyxxQkFBcUIsQ0FBQyxhQUFxQixFQUFFLFVBQWdDO1FBQ25GLElBQUksU0FBUyxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxhQUFhLEVBQUUsVUFBVSxDQUFDLENBQUMsQ0FBQztRQUN6RixFQUFFLENBQUMsQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLENBQUM7WUFBQyxNQUFNLENBQUMsU0FBUyxDQUFDLGFBQWEsRUFBRSxVQUFVLENBQUMsQ0FBQztRQUN0RSxNQUFNLENBQUMsSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUVPLGdCQUFnQixDQUFDLGFBQXFCLEVBQUUsVUFBZ0M7UUFDOUUsRUFBRSxDQUFDLENBQUMsZ0NBQWdDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2pELElBQUksTUFBTSxHQUFHLFVBQVUsQ0FBQyxZQUFZLENBQUMsQ0FBQztZQUN0QyxFQUFFLENBQUMsQ0FBQyxxQ0FBcUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ2xELElBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxhQUFhLEVBQUUsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7Z0JBQ3pFLE1BQU0sQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsRUFBRSxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUN0RCxDQUFDO1FBQ0gsQ0FBQztRQUNELE1BQU0sQ0FBQyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBRU8scUJBQXFCLENBQUMsYUFBcUIsRUFBRSxVQUFnQyxFQUN2RCxLQUFhO1FBQ3pDLEVBQUUsQ0FBQyxDQUFDLGdDQUFnQyxDQUFDLFVBQVUsQ0FBQyxJQUFJLFNBQVMsQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDLENBQUM7WUFDMUUsVUFBVSxDQUFDLFdBQVcsQ0FBRSxDQUFDLE1BQU0sSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN6RCxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxhQUFhLEVBQVUsVUFBVSxDQUFDLFdBQVcsQ0FBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFDL0UsQ0FBQztRQUNELE1BQU0sQ0FBQyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBRU8sbUJBQW1CLENBQUMsYUFBcUIsRUFDckIsS0FBMkI7UUFDckQsRUFBRSxDQUFDLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNyQixJQUFJLE1BQU0sR0FBRyxFQUFFLENBQUM7WUFDaEIsZ0JBQWdCLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxDQUFDLEtBQUssRUFBRSxJQUFJO2dCQUMxQyxJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLGFBQWEsRUFBRSxLQUFLLENBQUMsQ0FBQztnQkFDcEQsRUFBRSxDQUFDLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDcEIsSUFBSSxZQUFZLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLFVBQVUsQ0FBQzt5QkFDcEMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUM7eUJBQ3pCLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQWEsQ0FBRSxDQUFDLE1BQU0sQ0FBUSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztvQkFDMUUsRUFBRSxDQUFDLENBQUMsWUFBWSxDQUFDLE1BQU0sSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUM3QixnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLElBQUksRUFBRSxZQUFZLENBQUMsQ0FBQztvQkFDbkQsQ0FBQztnQkFDSCxDQUFDO1lBQ0gsQ0FBQyxDQUFDLENBQUM7WUFDSCxNQUFNLENBQUMsTUFBTSxDQUFDO1FBQ2hCLENBQUM7UUFDRCxNQUFNLENBQUMsSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUVELG1CQUFtQjtJQUNYLGFBQWEsQ0FBQyxhQUFxQixFQUFFLE1BQWdDO1FBQzNFLGtCQUFrQjtRQUNsQixJQUFJLE1BQU0sR0FBRyxFQUFFLENBQUM7UUFDaEIsRUFBRSxDQUFDLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN0QixHQUFHLENBQUMsQ0FBQyxJQUFJLElBQUksSUFBSSxNQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUN4QixNQUFNLENBQUMsSUFBSSxDQUFDO29CQUNWLElBQUksRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDO29CQUN4QixVQUFVLEVBQ04sU0FBUyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQzt3QkFDakIsSUFBSSxDQUFDLFlBQVksQ0FBRTs2QkFDdEIsR0FBRyxDQUFDLFNBQVMsSUFBSSxJQUFJLENBQUMscUJBQXFCLENBQUMsYUFBYSxFQUFFLFNBQVMsQ0FBQyxDQUFDOzZCQUN0RSxNQUFNLENBQUMsQ0FBQyxJQUFJLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDOUIsSUFBSTtpQkFDYixDQUFDLENBQUM7WUFDTCxDQUFDO1FBQ0gsQ0FBQztRQUNELE1BQU0sQ0FBQyxNQUFNLENBQUM7SUFDaEIsQ0FBQztJQUVELGdCQUFnQjtJQUNULFFBQVEsQ0FBQyxhQUFxQixFQUFFLEtBQVU7UUFDL0MsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDO1FBRWpCLGtCQUFrQixVQUFlO1lBQy9CLEVBQUUsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzVCLE1BQU0sQ0FBQyxVQUFVLENBQUM7WUFDcEIsQ0FBQztZQUNELEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3hCLElBQUksTUFBTSxHQUFHLEVBQUUsQ0FBQztnQkFDaEIsR0FBRyxDQUFDLENBQUMsSUFBSSxJQUFJLElBQVMsVUFBVyxDQUFDLENBQUMsQ0FBQztvQkFDbEMsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDOUIsQ0FBQztnQkFDRCxNQUFNLENBQUMsTUFBTSxDQUFDO1lBQ2hCLENBQUM7WUFDRCxFQUFFLENBQUMsQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUMxQixFQUFFLENBQUMsQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUN4QyxNQUFNLENBQUMsQ0FBQyxVQUFVLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUNqQyxLQUFLLE9BQU87NEJBQ1YsSUFBSSxJQUFJLEdBQUcsUUFBUSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDOzRCQUN4QyxJQUFJLEtBQUssR0FBRyxRQUFRLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7NEJBQzFDLE1BQU0sQ0FBQyxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0NBQy9CLEtBQUssSUFBSTtvQ0FDUCxNQUFNLENBQUMsSUFBSSxJQUFJLEtBQUssQ0FBQztnQ0FDdkIsS0FBSyxJQUFJO29DQUNQLE1BQU0sQ0FBQyxJQUFJLElBQUksS0FBSyxDQUFDO2dDQUN2QixLQUFLLEdBQUc7b0NBQ04sTUFBTSxDQUFDLElBQUksR0FBRyxLQUFLLENBQUM7Z0NBQ3RCLEtBQUssR0FBRztvQ0FDTixNQUFNLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQztnQ0FDdEIsS0FBSyxHQUFHO29DQUNOLE1BQU0sQ0FBQyxJQUFJLEdBQUcsS0FBSyxDQUFDO2dDQUN0QixLQUFLLElBQUk7b0NBQ1AsTUFBTSxDQUFDLElBQUksSUFBSSxLQUFLLENBQUM7Z0NBQ3ZCLEtBQUssSUFBSTtvQ0FDUCxNQUFNLENBQUMsSUFBSSxJQUFJLEtBQUssQ0FBQztnQ0FDdkIsS0FBSyxLQUFLO29DQUNSLE1BQU0sQ0FBQyxJQUFJLEtBQUssS0FBSyxDQUFDO2dDQUN4QixLQUFLLEtBQUs7b0NBQ1IsTUFBTSxDQUFDLElBQUksS0FBSyxLQUFLLENBQUM7Z0NBQ3hCLEtBQUssR0FBRztvQ0FDTixNQUFNLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQztnQ0FDdEIsS0FBSyxHQUFHO29DQUNOLE1BQU0sQ0FBQyxJQUFJLEdBQUcsS0FBSyxDQUFDO2dDQUN0QixLQUFLLElBQUk7b0NBQ1AsTUFBTSxDQUFDLElBQUksSUFBSSxLQUFLLENBQUM7Z0NBQ3ZCLEtBQUssSUFBSTtvQ0FDUCxNQUFNLENBQUMsSUFBSSxJQUFJLEtBQUssQ0FBQztnQ0FDdkIsS0FBSyxJQUFJO29DQUNQLE1BQU0sQ0FBQyxJQUFJLElBQUksS0FBSyxDQUFDO2dDQUN2QixLQUFLLElBQUk7b0NBQ1AsTUFBTSxDQUFDLElBQUksSUFBSSxLQUFLLENBQUM7Z0NBQ3ZCLEtBQUssR0FBRztvQ0FDTixNQUFNLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQztnQ0FDdEIsS0FBSyxHQUFHO29DQUNOLE1BQU0sQ0FBQyxJQUFJLEdBQUcsS0FBSyxDQUFDO2dDQUN0QixLQUFLLEdBQUc7b0NBQ04sTUFBTSxDQUFDLElBQUksR0FBRyxLQUFLLENBQUM7Z0NBQ3RCLEtBQUssR0FBRztvQ0FDTixNQUFNLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQztnQ0FDdEIsS0FBSyxHQUFHO29DQUNOLE1BQU0sQ0FBQyxJQUFJLEdBQUcsS0FBSyxDQUFDOzRCQUN4QixDQUFDOzRCQUNELE1BQU0sQ0FBQyxJQUFJLENBQUM7d0JBQ2QsS0FBSyxLQUFLOzRCQUNSLElBQUksT0FBTyxHQUFHLFFBQVEsQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQzs0QkFDOUMsTUFBTSxDQUFDLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQ0FDL0IsS0FBSyxHQUFHO29DQUNOLE1BQU0sQ0FBQyxPQUFPLENBQUM7Z0NBQ2pCLEtBQUssR0FBRztvQ0FDTixNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUM7Z0NBQ2xCLEtBQUssR0FBRztvQ0FDTixNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUM7Z0NBQ2xCLEtBQUssR0FBRztvQ0FDTixNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUM7NEJBQ3BCLENBQUM7NEJBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQzt3QkFDZCxLQUFLLE9BQU87NEJBQ1YsSUFBSSxXQUFXLEdBQUcsUUFBUSxDQUFDLFVBQVUsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDOzRCQUNyRCxJQUFJLEtBQUssR0FBRyxRQUFRLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7NEJBQzFDLEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsSUFBSSxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7Z0NBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQzs0QkFDNUUsTUFBTSxDQUFDLElBQUksQ0FBQzt3QkFDZCxLQUFLLFFBQVE7NEJBQ1gsSUFBSSxZQUFZLEdBQUcsUUFBUSxDQUFDLFVBQVUsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDOzRCQUN0RCxJQUFJLE1BQU0sR0FBRyxRQUFRLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7NEJBQzVDLEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxZQUFZLENBQUMsSUFBSSxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUM7Z0NBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQzs0QkFDaEYsTUFBTSxDQUFDLElBQUksQ0FBQzt3QkFDZCxLQUFLLFdBQVc7NEJBQ2QsSUFBSSxtQkFBbUIsR0FDbkIsS0FBSyxDQUFDLG1CQUFtQixDQUFDLGFBQWEsRUFBRSxVQUFVLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQzs0QkFDbkUsSUFBSSxlQUFlLEdBQUcsS0FBSyxDQUFDLGlCQUFpQixDQUFDLG1CQUFtQixDQUFDLENBQUM7NEJBQ25FLElBQUksY0FBYyxHQUFHLGVBQWUsQ0FBQyxVQUFVLENBQUMsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQzs0QkFDckUsRUFBRSxDQUFDLENBQUMsZUFBZSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQ0FDcEMsMkJBQTJCO2dDQUMzQixNQUFNLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxtQkFBbUIsRUFBRSxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQzs0QkFDdEUsQ0FBQzs0QkFDRCxNQUFNLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxtQkFBbUIsRUFBRSxjQUFjLENBQUMsQ0FBQzt3QkFDN0QsS0FBSyxNQUFNOzRCQUNULE1BQU0sQ0FBQyxJQUFJLENBQUM7b0JBQ2hCLENBQUM7b0JBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQztnQkFDZCxDQUFDO2dCQUNELElBQUksTUFBTSxHQUFHLEVBQUUsQ0FBQztnQkFDaEIsZ0JBQWdCLENBQUMsT0FBTyxDQUFDLFVBQVUsRUFBRSxDQUFDLEtBQUssRUFBRSxJQUFJLE9BQU8sTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUMzRixNQUFNLENBQUMsTUFBTSxDQUFDO1lBQ2hCLENBQUM7WUFDRCxNQUFNLENBQUMsSUFBSSxDQUFDO1FBQ2QsQ0FBQztRQUVELE1BQU0sQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDekIsQ0FBQztJQUVPLGlCQUFpQixDQUFDLE1BQWM7UUFDdEMsSUFBSSxjQUFjLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDcEQsRUFBRSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQy9CLGNBQWMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUNsRCxFQUFFLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQy9CLGNBQWMsR0FBRyxFQUFDLFVBQVUsRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFDLENBQUM7WUFDeEUsQ0FBQztZQUNELElBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxjQUFjLENBQUMsQ0FBQztRQUNqRCxDQUFDO1FBQ0QsTUFBTSxDQUFDLGNBQWMsQ0FBQztJQUN4QixDQUFDO0lBRU8sZUFBZSxDQUFDLElBQWdCO1FBQ3RDLElBQUksY0FBYyxHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDM0QsSUFBSSxNQUFNLEdBQUcsY0FBYyxDQUFDLFVBQVUsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNuRCxFQUFFLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDdkIsTUFBTSxHQUFHLEVBQUMsVUFBVSxFQUFFLE9BQU8sRUFBQyxDQUFDO1FBQ2pDLENBQUM7UUFDRCxNQUFNLENBQUMsTUFBTSxDQUFDO0lBQ2hCLENBQUM7SUFFTyxtQkFBbUIsQ0FBQyxJQUFZLEVBQUUsRUFBVTtRQUNsRCxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN2QixNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQztRQUMxQixDQUFDO1FBQ0QsTUFBTSxDQUFDLEVBQUUsQ0FBQztJQUNaLENBQUM7QUFDSCxDQUFDO0FBRUQsMENBQTBDLFVBQWU7SUFDdkQsTUFBTSxDQUFDLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxJQUFJLFVBQVUsQ0FBQyxZQUFZLENBQUMsSUFBSSxNQUFNLENBQUM7QUFDaEcsQ0FBQztBQUVELCtDQUErQyxVQUFlO0lBQzVELE1BQU0sQ0FBQyxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUM7UUFDaEQsVUFBVSxDQUFDLFlBQVksQ0FBQyxJQUFJLFdBQVcsQ0FBQztBQUNqRCxDQUFDO0FBRUQseUJBQXlCLFVBQWU7SUFDdEMsTUFBTSxDQUFDLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxJQUFJLFVBQVUsQ0FBQyxZQUFZLENBQUMsSUFBSSxPQUFPLENBQUM7QUFDakcsQ0FBQztBQUVELG1CQUFtQixJQUFZO0lBQzdCLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQzlCLENBQUM7QUFFRCxxQkFBcUIsU0FBbUI7SUFDdEMsSUFBSSxNQUFNLEdBQUcsRUFBRSxDQUFDO0lBQ2hCLFdBQVcsQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxJQUFJLEVBQUUsS0FBSztRQUNsRCxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQ2IsS0FBSyxFQUFFLENBQUM7WUFDUixLQUFLLEdBQUc7Z0JBQ04sRUFBRSxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQztvQkFBQyxNQUFNLENBQUM7Z0JBQ3RCLEtBQUssQ0FBQztZQUNSLEtBQUssSUFBSTtnQkFDUCxFQUFFLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxJQUFJLE1BQU0sQ0FBQyxNQUFNLElBQUksQ0FBQyxDQUFDO29CQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQztnQkFDbEQsTUFBTSxDQUFDO1FBQ1gsQ0FBQztRQUNELE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDcEIsQ0FBQyxDQUFDLENBQUM7SUFDSCxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUMxQixDQUFDO0FBRUQsZ0JBQWdCLElBQVksRUFBRSxFQUFVO0lBQ3RDLElBQUksTUFBTSxHQUFHLEVBQUUsQ0FBQztJQUNoQixFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN2QixJQUFJLFNBQVMsR0FBRyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDaEMsU0FBUyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUUsd0JBQXdCO1FBQzFDLElBQUksT0FBTyxHQUFHLFNBQVMsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUM1QixNQUFNLEdBQUcsV0FBVyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztJQUNsRCxDQUFDO0lBQ0QsTUFBTSxDQUFDLE1BQU0sQ0FBQztBQUNoQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtMaXN0V3JhcHBlciwgU3RyaW5nTWFwV3JhcHBlcn0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9jb2xsZWN0aW9uJztcbmltcG9ydCB7XG4gIGlzQXJyYXksXG4gIGlzQmxhbmssXG4gIGlzTnVtYmVyLFxuICBpc1ByZXNlbnQsXG4gIGlzUHJpbWl0aXZlLFxuICBpc1N0cmluZyxcbiAgVHlwZVxufSBmcm9tICdhbmd1bGFyMi9zcmMvZmFjYWRlL2xhbmcnO1xuaW1wb3J0IHtcbiAgQXR0cmlidXRlTWV0YWRhdGEsXG4gIERpcmVjdGl2ZU1ldGFkYXRhLFxuICBDb21wb25lbnRNZXRhZGF0YSxcbiAgQ29udGVudENoaWxkcmVuTWV0YWRhdGEsXG4gIENvbnRlbnRDaGlsZE1ldGFkYXRhLFxuICBJbnB1dE1ldGFkYXRhLFxuICBIb3N0QmluZGluZ01ldGFkYXRhLFxuICBIb3N0TGlzdGVuZXJNZXRhZGF0YSxcbiAgT3V0cHV0TWV0YWRhdGEsXG4gIFBpcGVNZXRhZGF0YSxcbiAgVmlld01ldGFkYXRhLFxuICBWaWV3Q2hpbGRNZXRhZGF0YSxcbiAgVmlld0NoaWxkcmVuTWV0YWRhdGEsXG4gIFZpZXdRdWVyeU1ldGFkYXRhLFxuICBRdWVyeU1ldGFkYXRhLFxufSBmcm9tICdhbmd1bGFyMi9zcmMvY29yZS9tZXRhZGF0YSc7XG5cbi8qKlxuICogVGhlIGhvc3Qgb2YgdGhlIHN0YXRpYyByZXNvbHZlciBpcyBleHBlY3RlZCB0byBiZSBhYmxlIHRvIHByb3ZpZGUgbW9kdWxlIG1ldGFkYXRhIGluIHRoZSBmb3JtIG9mXG4gKiBNb2R1bGVNZXRhZGF0YS4gQW5ndWxhciAyIENMSSB3aWxsIHByb2R1Y2UgdGhpcyBtZXRhZGF0YSBmb3IgYSBtb2R1bGUgd2hlbmV2ZXIgYSAuZC50cyBmaWxlcyBpc1xuICogcHJvZHVjZWQgYW5kIHRoZSBtb2R1bGUgaGFzIGV4cG9ydGVkIHZhcmlhYmxlcyBvciBjbGFzc2VzIHdpdGggZGVjb3JhdG9ycy4gTW9kdWxlIG1ldGFkYXRhIGNhblxuICogYWxzbyBiZSBwcm9kdWNlZCBkaXJlY3RseSBmcm9tIFR5cGVTY3JpcHQgc291cmNlcyBieSB1c2luZyBNZXRhZGF0YUNvbGxlY3RvciBpbiB0b29scy9tZXRhZGF0YS5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBTdGF0aWNSZWZsZWN0b3JIb3N0IHtcbiAgLyoqXG4gICAqICBSZXR1cm4gYSBNb2R1bGVNZXRhZGF0YSBmb3IgdGhlIGdpdmUgbW9kdWxlLlxuICAgKlxuICAgKiBAcGFyYW0gbW9kdWxlSWQgaXMgYSBzdHJpbmcgaWRlbnRpZmllciBmb3IgYSBtb2R1bGUgaW4gdGhlIGZvcm0gdGhhdCB3b3VsZCBleHBlY3RlZCBpbiBhXG4gICAqICAgICAgICAgICAgICAgICBtb2R1bGUgaW1wb3J0IG9mIGFuIGltcG9ydCBzdGF0ZW1lbnQuXG4gICAqIEByZXR1cm5zIHRoZSBtZXRhZGF0YSBmb3IgdGhlIGdpdmVuIG1vZHVsZS5cbiAgICovXG4gIGdldE1ldGFkYXRhRm9yKG1vZHVsZUlkOiBzdHJpbmcpOiB7W2tleTogc3RyaW5nXTogYW55fTtcbn1cblxuLyoqXG4gKiBBIHRva2VuIHJlcHJlc2VudGluZyB0aGUgYSByZWZlcmVuY2UgdG8gYSBzdGF0aWMgdHlwZS5cbiAqXG4gKiBUaGlzIHRva2VuIGlzIHVuaXF1ZSBmb3IgYSBtb2R1bGVJZCBhbmQgbmFtZSBhbmQgY2FuIGJlIHVzZWQgYXMgYSBoYXNoIHRhYmxlIGtleS5cbiAqL1xuZXhwb3J0IGNsYXNzIFN0YXRpY1R5cGUge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgbW9kdWxlSWQ6IHN0cmluZywgcHVibGljIG5hbWU6IHN0cmluZykge31cbn1cblxuLyoqXG4gKiBBIHN0YXRpYyByZWZsZWN0b3IgaW1wbGVtZW50cyBlbm91Z2ggb2YgdGhlIFJlZmxlY3RvciBBUEkgdGhhdCBpcyBuZWNlc3NhcnkgdG8gY29tcGlsZVxuICogdGVtcGxhdGVzIHN0YXRpY2FsbHkuXG4gKi9cbmV4cG9ydCBjbGFzcyBTdGF0aWNSZWZsZWN0b3Ige1xuICBwcml2YXRlIHR5cGVDYWNoZSA9IG5ldyBNYXA8c3RyaW5nLCBTdGF0aWNUeXBlPigpO1xuICBwcml2YXRlIGFubm90YXRpb25DYWNoZSA9IG5ldyBNYXA8U3RhdGljVHlwZSwgYW55W10+KCk7XG4gIHByaXZhdGUgcHJvcGVydHlDYWNoZSA9IG5ldyBNYXA8U3RhdGljVHlwZSwge1trZXk6IHN0cmluZ106IGFueX0+KCk7XG4gIHByaXZhdGUgcGFyYW1ldGVyQ2FjaGUgPSBuZXcgTWFwPFN0YXRpY1R5cGUsIGFueVtdPigpO1xuICBwcml2YXRlIG1ldGFkYXRhQ2FjaGUgPSBuZXcgTWFwPHN0cmluZywge1trZXk6IHN0cmluZ106IGFueX0+KCk7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBob3N0OiBTdGF0aWNSZWZsZWN0b3JIb3N0KSB7IHRoaXMuaW5pdGlhbGl6ZUNvbnZlcnNpb25NYXAoKTsgfVxuXG4gIC8qKlxuICAgKiBnZXRTdGF0aWN0eXBlIHByb2R1Y2VzIGEgVHlwZSB3aG9zZSBtZXRhZGF0YSBpcyBrbm93biBidXQgd2hvc2UgaW1wbGVtZW50YXRpb24gaXMgbm90IGxvYWRlZC5cbiAgICogQWxsIHR5cGVzIHBhc3NlZCB0byB0aGUgU3RhdGljUmVzb2x2ZXIgc2hvdWxkIGJlIHBzZXVkby10eXBlcyByZXR1cm5lZCBieSB0aGlzIG1ldGhvZC5cbiAgICpcbiAgICogQHBhcmFtIG1vZHVsZUlkIHRoZSBtb2R1bGUgaWRlbnRpZmllciBhcyB3b3VsZCBiZSBwYXNzZWQgdG8gYW4gaW1wb3J0IHN0YXRlbWVudC5cbiAgICogQHBhcmFtIG5hbWUgdGhlIG5hbWUgb2YgdGhlIHR5cGUuXG4gICAqL1xuICBwdWJsaWMgZ2V0U3RhdGljVHlwZShtb2R1bGVJZDogc3RyaW5nLCBuYW1lOiBzdHJpbmcpOiBTdGF0aWNUeXBlIHtcbiAgICBsZXQga2V5ID0gYFwiJHttb2R1bGVJZH1cIi4ke25hbWV9YDtcbiAgICBsZXQgcmVzdWx0ID0gdGhpcy50eXBlQ2FjaGUuZ2V0KGtleSk7XG4gICAgaWYgKCFpc1ByZXNlbnQocmVzdWx0KSkge1xuICAgICAgcmVzdWx0ID0gbmV3IFN0YXRpY1R5cGUobW9kdWxlSWQsIG5hbWUpO1xuICAgICAgdGhpcy50eXBlQ2FjaGUuc2V0KGtleSwgcmVzdWx0KTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIHB1YmxpYyBhbm5vdGF0aW9ucyh0eXBlOiBTdGF0aWNUeXBlKTogYW55W10ge1xuICAgIGxldCBhbm5vdGF0aW9ucyA9IHRoaXMuYW5ub3RhdGlvbkNhY2hlLmdldCh0eXBlKTtcbiAgICBpZiAoIWlzUHJlc2VudChhbm5vdGF0aW9ucykpIHtcbiAgICAgIGxldCBjbGFzc01ldGFkYXRhID0gdGhpcy5nZXRUeXBlTWV0YWRhdGEodHlwZSk7XG4gICAgICBpZiAoaXNQcmVzZW50KGNsYXNzTWV0YWRhdGFbJ2RlY29yYXRvcnMnXSkpIHtcbiAgICAgICAgYW5ub3RhdGlvbnMgPSAoPGFueVtdPmNsYXNzTWV0YWRhdGFbJ2RlY29yYXRvcnMnXSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgLm1hcChkZWNvcmF0b3IgPT4gdGhpcy5jb252ZXJ0S25vd25EZWNvcmF0b3IodHlwZS5tb2R1bGVJZCwgZGVjb3JhdG9yKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgLmZpbHRlcihkZWNvcmF0b3IgPT4gaXNQcmVzZW50KGRlY29yYXRvcikpO1xuICAgICAgfVxuICAgICAgdGhpcy5hbm5vdGF0aW9uQ2FjaGUuc2V0KHR5cGUsIGFubm90YXRpb25zKTtcbiAgICB9XG4gICAgcmV0dXJuIGFubm90YXRpb25zO1xuICB9XG5cbiAgcHVibGljIHByb3BNZXRhZGF0YSh0eXBlOiBTdGF0aWNUeXBlKToge1trZXk6IHN0cmluZ106IGFueX0ge1xuICAgIGxldCBwcm9wTWV0YWRhdGEgPSB0aGlzLnByb3BlcnR5Q2FjaGUuZ2V0KHR5cGUpO1xuICAgIGlmICghaXNQcmVzZW50KHByb3BNZXRhZGF0YSkpIHtcbiAgICAgIGxldCBjbGFzc01ldGFkYXRhID0gdGhpcy5nZXRUeXBlTWV0YWRhdGEodHlwZSk7XG4gICAgICBwcm9wTWV0YWRhdGEgPSB0aGlzLmdldFByb3BlcnR5TWV0YWRhdGEodHlwZS5tb2R1bGVJZCwgY2xhc3NNZXRhZGF0YVsnbWVtYmVycyddKTtcbiAgICAgIHRoaXMucHJvcGVydHlDYWNoZS5zZXQodHlwZSwgcHJvcE1ldGFkYXRhKTtcbiAgICB9XG4gICAgcmV0dXJuIHByb3BNZXRhZGF0YTtcbiAgfVxuXG4gIHB1YmxpYyBwYXJhbWV0ZXJzKHR5cGU6IFN0YXRpY1R5cGUpOiBhbnlbXSB7XG4gICAgbGV0IHBhcmFtZXRlcnMgPSB0aGlzLnBhcmFtZXRlckNhY2hlLmdldCh0eXBlKTtcbiAgICBpZiAoIWlzUHJlc2VudChwYXJhbWV0ZXJzKSkge1xuICAgICAgbGV0IGNsYXNzTWV0YWRhdGEgPSB0aGlzLmdldFR5cGVNZXRhZGF0YSh0eXBlKTtcbiAgICAgIGxldCBjdG9yRGF0YSA9IGNsYXNzTWV0YWRhdGFbJ21lbWJlcnMnXVsnX19jdG9yX18nXTtcbiAgICAgIGlmIChpc1ByZXNlbnQoY3RvckRhdGEpKSB7XG4gICAgICAgIGxldCBjdG9yID0gKDxhbnlbXT5jdG9yRGF0YSkuZmluZChhID0+IGFbJ19fc3ltYm9saWMnXSA9PT0gJ2NvbnN0cnVjdG9yJyk7XG4gICAgICAgIHBhcmFtZXRlcnMgPSB0aGlzLnNpbXBsaWZ5KHR5cGUubW9kdWxlSWQsIGN0b3JbJ3BhcmFtZXRlcnMnXSk7XG4gICAgICAgIHRoaXMucGFyYW1ldGVyQ2FjaGUuc2V0KHR5cGUsIHBhcmFtZXRlcnMpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcGFyYW1ldGVycztcbiAgfVxuXG4gIHByaXZhdGUgY29udmVyc2lvbk1hcCA9IG5ldyBNYXA8U3RhdGljVHlwZSwgKG1vZHVsZUNvbnRleHQ6IHN0cmluZywgZXhwcmVzc2lvbjogYW55KSA9PiBhbnk+KCk7XG4gIHByaXZhdGUgaW5pdGlhbGl6ZUNvbnZlcnNpb25NYXAoKTogYW55IHtcbiAgICBsZXQgY29yZV9tZXRhZGF0YSA9ICdhbmd1bGFyMi9zcmMvY29yZS9tZXRhZGF0YSc7XG4gICAgbGV0IGNvbnZlcnNpb25NYXAgPSB0aGlzLmNvbnZlcnNpb25NYXA7XG4gICAgY29udmVyc2lvbk1hcC5zZXQodGhpcy5nZXRTdGF0aWNUeXBlKGNvcmVfbWV0YWRhdGEsICdEaXJlY3RpdmUnKSxcbiAgICAgICAgICAgICAgICAgICAgICAobW9kdWxlQ29udGV4dCwgZXhwcmVzc2lvbikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHAwID0gdGhpcy5nZXREZWNvcmF0b3JQYXJhbWV0ZXIobW9kdWxlQ29udGV4dCwgZXhwcmVzc2lvbiwgMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWlzUHJlc2VudChwMCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgcDAgPSB7fTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXcgRGlyZWN0aXZlTWV0YWRhdGEoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3RvcjogcDBbJ3NlbGVjdG9yJ10sXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGlucHV0czogcDBbJ2lucHV0cyddLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBvdXRwdXRzOiBwMFsnb3V0cHV0cyddLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBldmVudHM6IHAwWydldmVudHMnXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgaG9zdDogcDBbJ2hvc3QnXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgYmluZGluZ3M6IHAwWydiaW5kaW5ncyddLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBwcm92aWRlcnM6IHAwWydwcm92aWRlcnMnXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgZXhwb3J0QXM6IHAwWydleHBvcnRBcyddLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBxdWVyaWVzOiBwMFsncXVlcmllcyddLFxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgY29udmVyc2lvbk1hcC5zZXQodGhpcy5nZXRTdGF0aWNUeXBlKGNvcmVfbWV0YWRhdGEsICdDb21wb25lbnQnKSxcbiAgICAgICAgICAgICAgICAgICAgICAobW9kdWxlQ29udGV4dCwgZXhwcmVzc2lvbikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHAwID0gdGhpcy5nZXREZWNvcmF0b3JQYXJhbWV0ZXIobW9kdWxlQ29udGV4dCwgZXhwcmVzc2lvbiwgMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWlzUHJlc2VudChwMCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgcDAgPSB7fTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXcgQ29tcG9uZW50TWV0YWRhdGEoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3RvcjogcDBbJ3NlbGVjdG9yJ10sXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGlucHV0czogcDBbJ2lucHV0cyddLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBvdXRwdXRzOiBwMFsnb3V0cHV0cyddLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzOiBwMFsncHJvcGVydGllcyddLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBldmVudHM6IHAwWydldmVudHMnXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgaG9zdDogcDBbJ2hvc3QnXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgZXhwb3J0QXM6IHAwWydleHBvcnRBcyddLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBtb2R1bGVJZDogcDBbJ21vZHVsZUlkJ10sXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGJpbmRpbmdzOiBwMFsnYmluZGluZ3MnXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvdmlkZXJzOiBwMFsncHJvdmlkZXJzJ10sXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHZpZXdCaW5kaW5nczogcDBbJ3ZpZXdCaW5kaW5ncyddLFxuICAgICAgICAgICAgICAgICAgICAgICAgICB2aWV3UHJvdmlkZXJzOiBwMFsndmlld1Byb3ZpZGVycyddLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBjaGFuZ2VEZXRlY3Rpb246IHAwWydjaGFuZ2VEZXRlY3Rpb24nXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgcXVlcmllczogcDBbJ3F1ZXJpZXMnXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IHAwWyd0ZW1wbGF0ZVVybCddLFxuICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZTogcDBbJ3RlbXBsYXRlJ10sXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlVXJsczogcDBbJ3N0eWxlVXJscyddLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZXM6IHAwWydzdHlsZXMnXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgZGlyZWN0aXZlczogcDBbJ2RpcmVjdGl2ZXMnXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgcGlwZXM6IHAwWydwaXBlcyddLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBlbmNhcHN1bGF0aW9uOiBwMFsnZW5jYXBzdWxhdGlvbiddXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICBjb252ZXJzaW9uTWFwLnNldCh0aGlzLmdldFN0YXRpY1R5cGUoY29yZV9tZXRhZGF0YSwgJ0lucHV0JyksXG4gICAgICAgICAgICAgICAgICAgICAgKG1vZHVsZUNvbnRleHQsIGV4cHJlc3Npb24pID0+IG5ldyBJbnB1dE1ldGFkYXRhKFxuICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmdldERlY29yYXRvclBhcmFtZXRlcihtb2R1bGVDb250ZXh0LCBleHByZXNzaW9uLCAwKSkpO1xuICAgIGNvbnZlcnNpb25NYXAuc2V0KHRoaXMuZ2V0U3RhdGljVHlwZShjb3JlX21ldGFkYXRhLCAnT3V0cHV0JyksXG4gICAgICAgICAgICAgICAgICAgICAgKG1vZHVsZUNvbnRleHQsIGV4cHJlc3Npb24pID0+IG5ldyBPdXRwdXRNZXRhZGF0YShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5nZXREZWNvcmF0b3JQYXJhbWV0ZXIobW9kdWxlQ29udGV4dCwgZXhwcmVzc2lvbiwgMCkpKTtcbiAgICBjb252ZXJzaW9uTWFwLnNldCh0aGlzLmdldFN0YXRpY1R5cGUoY29yZV9tZXRhZGF0YSwgJ1ZpZXcnKSwgKG1vZHVsZUNvbnRleHQsIGV4cHJlc3Npb24pID0+IHtcbiAgICAgIGxldCBwMCA9IHRoaXMuZ2V0RGVjb3JhdG9yUGFyYW1ldGVyKG1vZHVsZUNvbnRleHQsIGV4cHJlc3Npb24sIDApO1xuICAgICAgaWYgKCFpc1ByZXNlbnQocDApKSB7XG4gICAgICAgIHAwID0ge307XG4gICAgICB9XG4gICAgICByZXR1cm4gbmV3IFZpZXdNZXRhZGF0YSh7XG4gICAgICAgIHRlbXBsYXRlVXJsOiBwMFsndGVtcGxhdGVVcmwnXSxcbiAgICAgICAgdGVtcGxhdGU6IHAwWyd0ZW1wbGF0ZSddLFxuICAgICAgICBkaXJlY3RpdmVzOiBwMFsnZGlyZWN0aXZlcyddLFxuICAgICAgICBwaXBlczogcDBbJ3BpcGVzJ10sXG4gICAgICAgIGVuY2Fwc3VsYXRpb246IHAwWydlbmNhcHN1bGF0aW9uJ10sXG4gICAgICAgIHN0eWxlczogcDBbJ3N0eWxlcyddLFxuICAgICAgfSk7XG4gICAgfSk7XG4gICAgY29udmVyc2lvbk1hcC5zZXQodGhpcy5nZXRTdGF0aWNUeXBlKGNvcmVfbWV0YWRhdGEsICdBdHRyaWJ1dGUnKSxcbiAgICAgICAgICAgICAgICAgICAgICAobW9kdWxlQ29udGV4dCwgZXhwcmVzc2lvbikgPT4gbmV3IEF0dHJpYnV0ZU1ldGFkYXRhKFxuICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmdldERlY29yYXRvclBhcmFtZXRlcihtb2R1bGVDb250ZXh0LCBleHByZXNzaW9uLCAwKSkpO1xuICAgIGNvbnZlcnNpb25NYXAuc2V0KHRoaXMuZ2V0U3RhdGljVHlwZShjb3JlX21ldGFkYXRhLCAnUXVlcnknKSwgKG1vZHVsZUNvbnRleHQsIGV4cHJlc3Npb24pID0+IHtcbiAgICAgIGxldCBwMCA9IHRoaXMuZ2V0RGVjb3JhdG9yUGFyYW1ldGVyKG1vZHVsZUNvbnRleHQsIGV4cHJlc3Npb24sIDApO1xuICAgICAgbGV0IHAxID0gdGhpcy5nZXREZWNvcmF0b3JQYXJhbWV0ZXIobW9kdWxlQ29udGV4dCwgZXhwcmVzc2lvbiwgMSk7XG4gICAgICBpZiAoIWlzUHJlc2VudChwMSkpIHtcbiAgICAgICAgcDEgPSB7fTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBuZXcgUXVlcnlNZXRhZGF0YShwMCwge2Rlc2NlbmRhbnRzOiBwMS5kZXNjZW5kYW50cywgZmlyc3Q6IHAxLmZpcnN0fSk7XG4gICAgfSk7XG4gICAgY29udmVyc2lvbk1hcC5zZXQodGhpcy5nZXRTdGF0aWNUeXBlKGNvcmVfbWV0YWRhdGEsICdDb250ZW50Q2hpbGRyZW4nKSxcbiAgICAgICAgICAgICAgICAgICAgICAobW9kdWxlQ29udGV4dCwgZXhwcmVzc2lvbikgPT4gbmV3IENvbnRlbnRDaGlsZHJlbk1ldGFkYXRhKFxuICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmdldERlY29yYXRvclBhcmFtZXRlcihtb2R1bGVDb250ZXh0LCBleHByZXNzaW9uLCAwKSkpO1xuICAgIGNvbnZlcnNpb25NYXAuc2V0KHRoaXMuZ2V0U3RhdGljVHlwZShjb3JlX21ldGFkYXRhLCAnQ29udGVudENoaWxkJyksXG4gICAgICAgICAgICAgICAgICAgICAgKG1vZHVsZUNvbnRleHQsIGV4cHJlc3Npb24pID0+IG5ldyBDb250ZW50Q2hpbGRNZXRhZGF0YShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5nZXREZWNvcmF0b3JQYXJhbWV0ZXIobW9kdWxlQ29udGV4dCwgZXhwcmVzc2lvbiwgMCkpKTtcbiAgICBjb252ZXJzaW9uTWFwLnNldCh0aGlzLmdldFN0YXRpY1R5cGUoY29yZV9tZXRhZGF0YSwgJ1ZpZXdDaGlsZHJlbicpLFxuICAgICAgICAgICAgICAgICAgICAgIChtb2R1bGVDb250ZXh0LCBleHByZXNzaW9uKSA9PiBuZXcgVmlld0NoaWxkcmVuTWV0YWRhdGEoXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZ2V0RGVjb3JhdG9yUGFyYW1ldGVyKG1vZHVsZUNvbnRleHQsIGV4cHJlc3Npb24sIDApKSk7XG4gICAgY29udmVyc2lvbk1hcC5zZXQodGhpcy5nZXRTdGF0aWNUeXBlKGNvcmVfbWV0YWRhdGEsICdWaWV3Q2hpbGQnKSxcbiAgICAgICAgICAgICAgICAgICAgICAobW9kdWxlQ29udGV4dCwgZXhwcmVzc2lvbikgPT4gbmV3IFZpZXdDaGlsZE1ldGFkYXRhKFxuICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmdldERlY29yYXRvclBhcmFtZXRlcihtb2R1bGVDb250ZXh0LCBleHByZXNzaW9uLCAwKSkpO1xuICAgIGNvbnZlcnNpb25NYXAuc2V0KHRoaXMuZ2V0U3RhdGljVHlwZShjb3JlX21ldGFkYXRhLCAnVmlld1F1ZXJ5JyksXG4gICAgICAgICAgICAgICAgICAgICAgKG1vZHVsZUNvbnRleHQsIGV4cHJlc3Npb24pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBwMCA9IHRoaXMuZ2V0RGVjb3JhdG9yUGFyYW1ldGVyKG1vZHVsZUNvbnRleHQsIGV4cHJlc3Npb24sIDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHAxID0gdGhpcy5nZXREZWNvcmF0b3JQYXJhbWV0ZXIobW9kdWxlQ29udGV4dCwgZXhwcmVzc2lvbiwgMSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWlzUHJlc2VudChwMSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgcDEgPSB7fTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXcgVmlld1F1ZXJ5TWV0YWRhdGEocDAsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgZGVzY2VuZGFudHM6IHAxWydkZXNjZW5kYW50cyddLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBmaXJzdDogcDFbJ2ZpcnN0J10sXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICBjb252ZXJzaW9uTWFwLnNldCh0aGlzLmdldFN0YXRpY1R5cGUoY29yZV9tZXRhZGF0YSwgJ1BpcGUnKSwgKG1vZHVsZUNvbnRleHQsIGV4cHJlc3Npb24pID0+IHtcbiAgICAgIGxldCBwMCA9IHRoaXMuZ2V0RGVjb3JhdG9yUGFyYW1ldGVyKG1vZHVsZUNvbnRleHQsIGV4cHJlc3Npb24sIDApO1xuICAgICAgaWYgKCFpc1ByZXNlbnQocDApKSB7XG4gICAgICAgIHAwID0ge307XG4gICAgICB9XG4gICAgICByZXR1cm4gbmV3IFBpcGVNZXRhZGF0YSh7XG4gICAgICAgIG5hbWU6IHAwWyduYW1lJ10sXG4gICAgICAgIHB1cmU6IHAwWydwdXJlJ10sXG4gICAgICB9KTtcbiAgICB9KTtcbiAgICBjb252ZXJzaW9uTWFwLnNldCh0aGlzLmdldFN0YXRpY1R5cGUoY29yZV9tZXRhZGF0YSwgJ0hvc3RCaW5kaW5nJyksXG4gICAgICAgICAgICAgICAgICAgICAgKG1vZHVsZUNvbnRleHQsIGV4cHJlc3Npb24pID0+IG5ldyBIb3N0QmluZGluZ01ldGFkYXRhKFxuICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmdldERlY29yYXRvclBhcmFtZXRlcihtb2R1bGVDb250ZXh0LCBleHByZXNzaW9uLCAwKSkpO1xuICAgIGNvbnZlcnNpb25NYXAuc2V0KHRoaXMuZ2V0U3RhdGljVHlwZShjb3JlX21ldGFkYXRhLCAnSG9zdExpc3RlbmVyJyksXG4gICAgICAgICAgICAgICAgICAgICAgKG1vZHVsZUNvbnRleHQsIGV4cHJlc3Npb24pID0+IG5ldyBIb3N0TGlzdGVuZXJNZXRhZGF0YShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5nZXREZWNvcmF0b3JQYXJhbWV0ZXIobW9kdWxlQ29udGV4dCwgZXhwcmVzc2lvbiwgMCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZ2V0RGVjb3JhdG9yUGFyYW1ldGVyKG1vZHVsZUNvbnRleHQsIGV4cHJlc3Npb24sIDEpKSk7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBwcml2YXRlIGNvbnZlcnRLbm93bkRlY29yYXRvcihtb2R1bGVDb250ZXh0OiBzdHJpbmcsIGV4cHJlc3Npb246IHtba2V5OiBzdHJpbmddOiBhbnl9KTogYW55IHtcbiAgICBsZXQgY29udmVydGVyID0gdGhpcy5jb252ZXJzaW9uTWFwLmdldCh0aGlzLmdldERlY29yYXRvclR5cGUobW9kdWxlQ29udGV4dCwgZXhwcmVzc2lvbikpO1xuICAgIGlmIChpc1ByZXNlbnQoY29udmVydGVyKSkgcmV0dXJuIGNvbnZlcnRlcihtb2R1bGVDb250ZXh0LCBleHByZXNzaW9uKTtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHByaXZhdGUgZ2V0RGVjb3JhdG9yVHlwZShtb2R1bGVDb250ZXh0OiBzdHJpbmcsIGV4cHJlc3Npb246IHtba2V5OiBzdHJpbmddOiBhbnl9KTogU3RhdGljVHlwZSB7XG4gICAgaWYgKGlzTWV0YWRhdGFTeW1ib2xpY0NhbGxFeHByZXNzaW9uKGV4cHJlc3Npb24pKSB7XG4gICAgICBsZXQgdGFyZ2V0ID0gZXhwcmVzc2lvblsnZXhwcmVzc2lvbiddO1xuICAgICAgaWYgKGlzTWV0YWRhdGFTeW1ib2xpY1JlZmVyZW5jZUV4cHJlc3Npb24odGFyZ2V0KSkge1xuICAgICAgICBsZXQgbW9kdWxlSWQgPSB0aGlzLm5vcm1hbGl6ZU1vZHVsZU5hbWUobW9kdWxlQ29udGV4dCwgdGFyZ2V0Wydtb2R1bGUnXSk7XG4gICAgICAgIHJldHVybiB0aGlzLmdldFN0YXRpY1R5cGUobW9kdWxlSWQsIHRhcmdldFsnbmFtZSddKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBwcml2YXRlIGdldERlY29yYXRvclBhcmFtZXRlcihtb2R1bGVDb250ZXh0OiBzdHJpbmcsIGV4cHJlc3Npb246IHtba2V5OiBzdHJpbmddOiBhbnl9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmRleDogbnVtYmVyKTogYW55IHtcbiAgICBpZiAoaXNNZXRhZGF0YVN5bWJvbGljQ2FsbEV4cHJlc3Npb24oZXhwcmVzc2lvbikgJiYgaXNQcmVzZW50KGV4cHJlc3Npb25bJ2FyZ3VtZW50cyddKSAmJlxuICAgICAgICAoPGFueVtdPmV4cHJlc3Npb25bJ2FyZ3VtZW50cyddKS5sZW5ndGggPD0gaW5kZXggKyAxKSB7XG4gICAgICByZXR1cm4gdGhpcy5zaW1wbGlmeShtb2R1bGVDb250ZXh0LCAoPGFueVtdPmV4cHJlc3Npb25bJ2FyZ3VtZW50cyddKVtpbmRleF0pO1xuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHByaXZhdGUgZ2V0UHJvcGVydHlNZXRhZGF0YShtb2R1bGVDb250ZXh0OiBzdHJpbmcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZToge1trZXk6IHN0cmluZ106IGFueX0pOiB7W2tleTogc3RyaW5nXTogYW55fSB7XG4gICAgaWYgKGlzUHJlc2VudCh2YWx1ZSkpIHtcbiAgICAgIGxldCByZXN1bHQgPSB7fTtcbiAgICAgIFN0cmluZ01hcFdyYXBwZXIuZm9yRWFjaCh2YWx1ZSwgKHZhbHVlLCBuYW1lKSA9PiB7XG4gICAgICAgIGxldCBkYXRhID0gdGhpcy5nZXRNZW1iZXJEYXRhKG1vZHVsZUNvbnRleHQsIHZhbHVlKTtcbiAgICAgICAgaWYgKGlzUHJlc2VudChkYXRhKSkge1xuICAgICAgICAgIGxldCBwcm9wZXJ0eURhdGEgPSBkYXRhLmZpbHRlcihkID0+IGRbJ2tpbmQnXSA9PSBcInByb3BlcnR5XCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAubWFwKGQgPT4gZFsnZGlyZWN0aXZlcyddKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnJlZHVjZSgocCwgYykgPT4gKDxhbnlbXT5wKS5jb25jYXQoPGFueVtdPmMpLCBbXSk7XG4gICAgICAgICAgaWYgKHByb3BlcnR5RGF0YS5sZW5ndGggIT0gMCkge1xuICAgICAgICAgICAgU3RyaW5nTWFwV3JhcHBlci5zZXQocmVzdWx0LCBuYW1lLCBwcm9wZXJ0eURhdGEpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIC8vIGNsYW5nLWZvcm1hdCBvZmZcbiAgcHJpdmF0ZSBnZXRNZW1iZXJEYXRhKG1vZHVsZUNvbnRleHQ6IHN0cmluZywgbWVtYmVyOiB7IFtrZXk6IHN0cmluZ106IGFueSB9W10pOiB7IFtrZXk6IHN0cmluZ106IGFueSB9W10ge1xuICAgIC8vIGNsYW5nLWZvcm1hdCBvblxuICAgIGxldCByZXN1bHQgPSBbXTtcbiAgICBpZiAoaXNQcmVzZW50KG1lbWJlcikpIHtcbiAgICAgIGZvciAobGV0IGl0ZW0gb2YgbWVtYmVyKSB7XG4gICAgICAgIHJlc3VsdC5wdXNoKHtcbiAgICAgICAgICBraW5kOiBpdGVtWydfX3N5bWJvbGljJ10sXG4gICAgICAgICAgZGlyZWN0aXZlczpcbiAgICAgICAgICAgICAgaXNQcmVzZW50KGl0ZW1bJ2RlY29yYXRvcnMnXSkgP1xuICAgICAgICAgICAgICAgICAgKDxhbnlbXT5pdGVtWydkZWNvcmF0b3JzJ10pXG4gICAgICAgICAgICAgICAgICAgICAgLm1hcChkZWNvcmF0b3IgPT4gdGhpcy5jb252ZXJ0S25vd25EZWNvcmF0b3IobW9kdWxlQ29udGV4dCwgZGVjb3JhdG9yKSlcbiAgICAgICAgICAgICAgICAgICAgICAuZmlsdGVyKGQgPT4gaXNQcmVzZW50KGQpKSA6XG4gICAgICAgICAgICAgICAgICBudWxsXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBwdWJsaWMgc2ltcGxpZnkobW9kdWxlQ29udGV4dDogc3RyaW5nLCB2YWx1ZTogYW55KTogYW55IHtcbiAgICBsZXQgX3RoaXMgPSB0aGlzO1xuXG4gICAgZnVuY3Rpb24gc2ltcGxpZnkoZXhwcmVzc2lvbjogYW55KTogYW55IHtcbiAgICAgIGlmIChpc1ByaW1pdGl2ZShleHByZXNzaW9uKSkge1xuICAgICAgICByZXR1cm4gZXhwcmVzc2lvbjtcbiAgICAgIH1cbiAgICAgIGlmIChpc0FycmF5KGV4cHJlc3Npb24pKSB7XG4gICAgICAgIGxldCByZXN1bHQgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgaXRlbSBvZig8YW55PmV4cHJlc3Npb24pKSB7XG4gICAgICAgICAgcmVzdWx0LnB1c2goc2ltcGxpZnkoaXRlbSkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICB9XG4gICAgICBpZiAoaXNQcmVzZW50KGV4cHJlc3Npb24pKSB7XG4gICAgICAgIGlmIChpc1ByZXNlbnQoZXhwcmVzc2lvblsnX19zeW1ib2xpYyddKSkge1xuICAgICAgICAgIHN3aXRjaCAoZXhwcmVzc2lvblsnX19zeW1ib2xpYyddKSB7XG4gICAgICAgICAgICBjYXNlIFwiYmlub3BcIjpcbiAgICAgICAgICAgICAgbGV0IGxlZnQgPSBzaW1wbGlmeShleHByZXNzaW9uWydsZWZ0J10pO1xuICAgICAgICAgICAgICBsZXQgcmlnaHQgPSBzaW1wbGlmeShleHByZXNzaW9uWydyaWdodCddKTtcbiAgICAgICAgICAgICAgc3dpdGNoIChleHByZXNzaW9uWydvcGVyYXRvciddKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAnJiYnOlxuICAgICAgICAgICAgICAgICAgcmV0dXJuIGxlZnQgJiYgcmlnaHQ7XG4gICAgICAgICAgICAgICAgY2FzZSAnfHwnOlxuICAgICAgICAgICAgICAgICAgcmV0dXJuIGxlZnQgfHwgcmlnaHQ7XG4gICAgICAgICAgICAgICAgY2FzZSAnfCc6XG4gICAgICAgICAgICAgICAgICByZXR1cm4gbGVmdCB8IHJpZ2h0O1xuICAgICAgICAgICAgICAgIGNhc2UgJ14nOlxuICAgICAgICAgICAgICAgICAgcmV0dXJuIGxlZnQgXiByaWdodDtcbiAgICAgICAgICAgICAgICBjYXNlICcmJzpcbiAgICAgICAgICAgICAgICAgIHJldHVybiBsZWZ0ICYgcmlnaHQ7XG4gICAgICAgICAgICAgICAgY2FzZSAnPT0nOlxuICAgICAgICAgICAgICAgICAgcmV0dXJuIGxlZnQgPT0gcmlnaHQ7XG4gICAgICAgICAgICAgICAgY2FzZSAnIT0nOlxuICAgICAgICAgICAgICAgICAgcmV0dXJuIGxlZnQgIT0gcmlnaHQ7XG4gICAgICAgICAgICAgICAgY2FzZSAnPT09JzpcbiAgICAgICAgICAgICAgICAgIHJldHVybiBsZWZ0ID09PSByaWdodDtcbiAgICAgICAgICAgICAgICBjYXNlICchPT0nOlxuICAgICAgICAgICAgICAgICAgcmV0dXJuIGxlZnQgIT09IHJpZ2h0O1xuICAgICAgICAgICAgICAgIGNhc2UgJzwnOlxuICAgICAgICAgICAgICAgICAgcmV0dXJuIGxlZnQgPCByaWdodDtcbiAgICAgICAgICAgICAgICBjYXNlICc+JzpcbiAgICAgICAgICAgICAgICAgIHJldHVybiBsZWZ0ID4gcmlnaHQ7XG4gICAgICAgICAgICAgICAgY2FzZSAnPD0nOlxuICAgICAgICAgICAgICAgICAgcmV0dXJuIGxlZnQgPD0gcmlnaHQ7XG4gICAgICAgICAgICAgICAgY2FzZSAnPj0nOlxuICAgICAgICAgICAgICAgICAgcmV0dXJuIGxlZnQgPj0gcmlnaHQ7XG4gICAgICAgICAgICAgICAgY2FzZSAnPDwnOlxuICAgICAgICAgICAgICAgICAgcmV0dXJuIGxlZnQgPDwgcmlnaHQ7XG4gICAgICAgICAgICAgICAgY2FzZSAnPj4nOlxuICAgICAgICAgICAgICAgICAgcmV0dXJuIGxlZnQgPj4gcmlnaHQ7XG4gICAgICAgICAgICAgICAgY2FzZSAnKyc6XG4gICAgICAgICAgICAgICAgICByZXR1cm4gbGVmdCArIHJpZ2h0O1xuICAgICAgICAgICAgICAgIGNhc2UgJy0nOlxuICAgICAgICAgICAgICAgICAgcmV0dXJuIGxlZnQgLSByaWdodDtcbiAgICAgICAgICAgICAgICBjYXNlICcqJzpcbiAgICAgICAgICAgICAgICAgIHJldHVybiBsZWZ0ICogcmlnaHQ7XG4gICAgICAgICAgICAgICAgY2FzZSAnLyc6XG4gICAgICAgICAgICAgICAgICByZXR1cm4gbGVmdCAvIHJpZ2h0O1xuICAgICAgICAgICAgICAgIGNhc2UgJyUnOlxuICAgICAgICAgICAgICAgICAgcmV0dXJuIGxlZnQgJSByaWdodDtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIGNhc2UgXCJwcmVcIjpcbiAgICAgICAgICAgICAgbGV0IG9wZXJhbmQgPSBzaW1wbGlmeShleHByZXNzaW9uWydvcGVyYW5kJ10pO1xuICAgICAgICAgICAgICBzd2l0Y2ggKGV4cHJlc3Npb25bJ29wZXJhdG9yJ10pIHtcbiAgICAgICAgICAgICAgICBjYXNlICcrJzpcbiAgICAgICAgICAgICAgICAgIHJldHVybiBvcGVyYW5kO1xuICAgICAgICAgICAgICAgIGNhc2UgJy0nOlxuICAgICAgICAgICAgICAgICAgcmV0dXJuIC1vcGVyYW5kO1xuICAgICAgICAgICAgICAgIGNhc2UgJyEnOlxuICAgICAgICAgICAgICAgICAgcmV0dXJuICFvcGVyYW5kO1xuICAgICAgICAgICAgICAgIGNhc2UgJ34nOlxuICAgICAgICAgICAgICAgICAgcmV0dXJuIH5vcGVyYW5kO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgY2FzZSBcImluZGV4XCI6XG4gICAgICAgICAgICAgIGxldCBpbmRleFRhcmdldCA9IHNpbXBsaWZ5KGV4cHJlc3Npb25bJ2V4cHJlc3Npb24nXSk7XG4gICAgICAgICAgICAgIGxldCBpbmRleCA9IHNpbXBsaWZ5KGV4cHJlc3Npb25bJ2luZGV4J10pO1xuICAgICAgICAgICAgICBpZiAoaXNQcmVzZW50KGluZGV4VGFyZ2V0KSAmJiBpc1ByaW1pdGl2ZShpbmRleCkpIHJldHVybiBpbmRleFRhcmdldFtpbmRleF07XG4gICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgY2FzZSBcInNlbGVjdFwiOlxuICAgICAgICAgICAgICBsZXQgc2VsZWN0VGFyZ2V0ID0gc2ltcGxpZnkoZXhwcmVzc2lvblsnZXhwcmVzc2lvbiddKTtcbiAgICAgICAgICAgICAgbGV0IG1lbWJlciA9IHNpbXBsaWZ5KGV4cHJlc3Npb25bJ21lbWJlciddKTtcbiAgICAgICAgICAgICAgaWYgKGlzUHJlc2VudChzZWxlY3RUYXJnZXQpICYmIGlzUHJpbWl0aXZlKG1lbWJlcikpIHJldHVybiBzZWxlY3RUYXJnZXRbbWVtYmVyXTtcbiAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICBjYXNlIFwicmVmZXJlbmNlXCI6XG4gICAgICAgICAgICAgIGxldCByZWZlcmVuY2VNb2R1bGVOYW1lID1cbiAgICAgICAgICAgICAgICAgIF90aGlzLm5vcm1hbGl6ZU1vZHVsZU5hbWUobW9kdWxlQ29udGV4dCwgZXhwcmVzc2lvblsnbW9kdWxlJ10pO1xuICAgICAgICAgICAgICBsZXQgcmVmZXJlbmNlTW9kdWxlID0gX3RoaXMuZ2V0TW9kdWxlTWV0YWRhdGEocmVmZXJlbmNlTW9kdWxlTmFtZSk7XG4gICAgICAgICAgICAgIGxldCByZWZlcmVuY2VWYWx1ZSA9IHJlZmVyZW5jZU1vZHVsZVsnbWV0YWRhdGEnXVtleHByZXNzaW9uWyduYW1lJ11dO1xuICAgICAgICAgICAgICBpZiAoaXNDbGFzc01ldGFkYXRhKHJlZmVyZW5jZVZhbHVlKSkge1xuICAgICAgICAgICAgICAgIC8vIENvbnZlcnQgdG8gYSBwc2V1ZG8gdHlwZVxuICAgICAgICAgICAgICAgIHJldHVybiBfdGhpcy5nZXRTdGF0aWNUeXBlKHJlZmVyZW5jZU1vZHVsZU5hbWUsIGV4cHJlc3Npb25bJ25hbWUnXSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgcmV0dXJuIF90aGlzLnNpbXBsaWZ5KHJlZmVyZW5jZU1vZHVsZU5hbWUsIHJlZmVyZW5jZVZhbHVlKTtcbiAgICAgICAgICAgIGNhc2UgXCJjYWxsXCI6XG4gICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBsZXQgcmVzdWx0ID0ge307XG4gICAgICAgIFN0cmluZ01hcFdyYXBwZXIuZm9yRWFjaChleHByZXNzaW9uLCAodmFsdWUsIG5hbWUpID0+IHsgcmVzdWx0W25hbWVdID0gc2ltcGxpZnkodmFsdWUpOyB9KTtcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgIH1cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHJldHVybiBzaW1wbGlmeSh2YWx1ZSk7XG4gIH1cblxuICBwcml2YXRlIGdldE1vZHVsZU1ldGFkYXRhKG1vZHVsZTogc3RyaW5nKToge1trZXk6IHN0cmluZ106IGFueX0ge1xuICAgIGxldCBtb2R1bGVNZXRhZGF0YSA9IHRoaXMubWV0YWRhdGFDYWNoZS5nZXQobW9kdWxlKTtcbiAgICBpZiAoIWlzUHJlc2VudChtb2R1bGVNZXRhZGF0YSkpIHtcbiAgICAgIG1vZHVsZU1ldGFkYXRhID0gdGhpcy5ob3N0LmdldE1ldGFkYXRhRm9yKG1vZHVsZSk7XG4gICAgICBpZiAoIWlzUHJlc2VudChtb2R1bGVNZXRhZGF0YSkpIHtcbiAgICAgICAgbW9kdWxlTWV0YWRhdGEgPSB7X19zeW1ib2xpYzogXCJtb2R1bGVcIiwgbW9kdWxlOiBtb2R1bGUsIG1ldGFkYXRhOiB7fX07XG4gICAgICB9XG4gICAgICB0aGlzLm1ldGFkYXRhQ2FjaGUuc2V0KG1vZHVsZSwgbW9kdWxlTWV0YWRhdGEpO1xuICAgIH1cbiAgICByZXR1cm4gbW9kdWxlTWV0YWRhdGE7XG4gIH1cblxuICBwcml2YXRlIGdldFR5cGVNZXRhZGF0YSh0eXBlOiBTdGF0aWNUeXBlKToge1trZXk6IHN0cmluZ106IGFueX0ge1xuICAgIGxldCBtb2R1bGVNZXRhZGF0YSA9IHRoaXMuZ2V0TW9kdWxlTWV0YWRhdGEodHlwZS5tb2R1bGVJZCk7XG4gICAgbGV0IHJlc3VsdCA9IG1vZHVsZU1ldGFkYXRhWydtZXRhZGF0YSddW3R5cGUubmFtZV07XG4gICAgaWYgKCFpc1ByZXNlbnQocmVzdWx0KSkge1xuICAgICAgcmVzdWx0ID0ge19fc3ltYm9saWM6IFwiY2xhc3NcIn07XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICBwcml2YXRlIG5vcm1hbGl6ZU1vZHVsZU5hbWUoZnJvbTogc3RyaW5nLCB0bzogc3RyaW5nKTogc3RyaW5nIHtcbiAgICBpZiAodG8uc3RhcnRzV2l0aCgnLicpKSB7XG4gICAgICByZXR1cm4gcGF0aFRvKGZyb20sIHRvKTtcbiAgICB9XG4gICAgcmV0dXJuIHRvO1xuICB9XG59XG5cbmZ1bmN0aW9uIGlzTWV0YWRhdGFTeW1ib2xpY0NhbGxFeHByZXNzaW9uKGV4cHJlc3Npb246IGFueSk6IGJvb2xlYW4ge1xuICByZXR1cm4gIWlzUHJpbWl0aXZlKGV4cHJlc3Npb24pICYmICFpc0FycmF5KGV4cHJlc3Npb24pICYmIGV4cHJlc3Npb25bJ19fc3ltYm9saWMnXSA9PSAnY2FsbCc7XG59XG5cbmZ1bmN0aW9uIGlzTWV0YWRhdGFTeW1ib2xpY1JlZmVyZW5jZUV4cHJlc3Npb24oZXhwcmVzc2lvbjogYW55KTogYm9vbGVhbiB7XG4gIHJldHVybiAhaXNQcmltaXRpdmUoZXhwcmVzc2lvbikgJiYgIWlzQXJyYXkoZXhwcmVzc2lvbikgJiZcbiAgICAgICAgIGV4cHJlc3Npb25bJ19fc3ltYm9saWMnXSA9PSAncmVmZXJlbmNlJztcbn1cblxuZnVuY3Rpb24gaXNDbGFzc01ldGFkYXRhKGV4cHJlc3Npb246IGFueSk6IGJvb2xlYW4ge1xuICByZXR1cm4gIWlzUHJpbWl0aXZlKGV4cHJlc3Npb24pICYmICFpc0FycmF5KGV4cHJlc3Npb24pICYmIGV4cHJlc3Npb25bJ19fc3ltYm9saWMnXSA9PSAnY2xhc3MnO1xufVxuXG5mdW5jdGlvbiBzcGxpdFBhdGgocGF0aDogc3RyaW5nKTogc3RyaW5nW10ge1xuICByZXR1cm4gcGF0aC5zcGxpdCgvXFwvfFxcXFwvZyk7XG59XG5cbmZ1bmN0aW9uIHJlc29sdmVQYXRoKHBhdGhQYXJ0czogc3RyaW5nW10pOiBzdHJpbmcge1xuICBsZXQgcmVzdWx0ID0gW107XG4gIExpc3RXcmFwcGVyLmZvckVhY2hXaXRoSW5kZXgocGF0aFBhcnRzLCAocGFydCwgaW5kZXgpID0+IHtcbiAgICBzd2l0Y2ggKHBhcnQpIHtcbiAgICAgIGNhc2UgJyc6XG4gICAgICBjYXNlICcuJzpcbiAgICAgICAgaWYgKGluZGV4ID4gMCkgcmV0dXJuO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJy4uJzpcbiAgICAgICAgaWYgKGluZGV4ID4gMCAmJiByZXN1bHQubGVuZ3RoICE9IDApIHJlc3VsdC5wb3AoKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICByZXN1bHQucHVzaChwYXJ0KTtcbiAgfSk7XG4gIHJldHVybiByZXN1bHQuam9pbignLycpO1xufVxuXG5mdW5jdGlvbiBwYXRoVG8oZnJvbTogc3RyaW5nLCB0bzogc3RyaW5nKTogc3RyaW5nIHtcbiAgbGV0IHJlc3VsdCA9IHRvO1xuICBpZiAodG8uc3RhcnRzV2l0aCgnLicpKSB7XG4gICAgbGV0IGZyb21QYXJ0cyA9IHNwbGl0UGF0aChmcm9tKTtcbiAgICBmcm9tUGFydHMucG9wKCk7ICAvLyByZW1vdmUgdGhlIGZpbGUgbmFtZS5cbiAgICBsZXQgdG9QYXJ0cyA9IHNwbGl0UGF0aCh0byk7XG4gICAgcmVzdWx0ID0gcmVzb2x2ZVBhdGgoZnJvbVBhcnRzLmNvbmNhdCh0b1BhcnRzKSk7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cbiJdfQ==