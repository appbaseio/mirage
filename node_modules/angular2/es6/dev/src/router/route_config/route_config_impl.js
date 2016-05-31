var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { CONST } from 'angular2/src/facade/lang';
var __make_dart_analyzer_happy = null;
/**
 * The `RouteConfig` decorator defines routes for a given component.
 *
 * It takes an array of {@link RouteDefinition}s.
 */
export let RouteConfig = class RouteConfig {
    constructor(configs) {
        this.configs = configs;
    }
};
RouteConfig = __decorate([
    CONST(), 
    __metadata('design:paramtypes', [Array])
], RouteConfig);
export let AbstractRoute = class AbstractRoute {
    constructor({ name, useAsDefault, path, regex, serializer, data }) {
        this.name = name;
        this.useAsDefault = useAsDefault;
        this.path = path;
        this.regex = regex;
        this.serializer = serializer;
        this.data = data;
    }
};
AbstractRoute = __decorate([
    CONST(), 
    __metadata('design:paramtypes', [Object])
], AbstractRoute);
/**
 * `Route` is a type of {@link RouteDefinition} used to route a path to a component.
 *
 * It has the following properties:
 * - `path` is a string that uses the route matcher DSL.
 * - `component` a component type.
 * - `name` is an optional `CamelCase` string representing the name of the route.
 * - `data` is an optional property of any type representing arbitrary route metadata for the given
 * route. It is injectable via {@link RouteData}.
 * - `useAsDefault` is a boolean value. If `true`, the child route will be navigated to if no child
 * route is specified during the navigation.
 *
 * ### Example
 * ```
 * import {RouteConfig, Route} from 'angular2/router';
 *
 * @RouteConfig([
 *   new Route({path: '/home', component: HomeCmp, name: 'HomeCmp' })
 * ])
 * class MyApp {}
 * ```
 */
export let Route = class Route extends AbstractRoute {
    constructor({ name, useAsDefault, path, regex, serializer, data, component }) {
        super({
            name: name,
            useAsDefault: useAsDefault,
            path: path,
            regex: regex,
            serializer: serializer,
            data: data
        });
        this.aux = null;
        this.component = component;
    }
};
Route = __decorate([
    CONST(), 
    __metadata('design:paramtypes', [Object])
], Route);
/**
 * `AuxRoute` is a type of {@link RouteDefinition} used to define an auxiliary route.
 *
 * It takes an object with the following properties:
 * - `path` is a string that uses the route matcher DSL.
 * - `component` a component type.
 * - `name` is an optional `CamelCase` string representing the name of the route.
 * - `data` is an optional property of any type representing arbitrary route metadata for the given
 * route. It is injectable via {@link RouteData}.
 *
 * ### Example
 * ```
 * import {RouteConfig, AuxRoute} from 'angular2/router';
 *
 * @RouteConfig([
 *   new AuxRoute({path: '/home', component: HomeCmp})
 * ])
 * class MyApp {}
 * ```
 */
export let AuxRoute = class AuxRoute extends AbstractRoute {
    constructor({ name, useAsDefault, path, regex, serializer, data, component }) {
        super({
            name: name,
            useAsDefault: useAsDefault,
            path: path,
            regex: regex,
            serializer: serializer,
            data: data
        });
        this.component = component;
    }
};
AuxRoute = __decorate([
    CONST(), 
    __metadata('design:paramtypes', [Object])
], AuxRoute);
/**
 * `AsyncRoute` is a type of {@link RouteDefinition} used to route a path to an asynchronously
 * loaded component.
 *
 * It has the following properties:
 * - `path` is a string that uses the route matcher DSL.
 * - `loader` is a function that returns a promise that resolves to a component.
 * - `name` is an optional `CamelCase` string representing the name of the route.
 * - `data` is an optional property of any type representing arbitrary route metadata for the given
 * route. It is injectable via {@link RouteData}.
 * - `useAsDefault` is a boolean value. If `true`, the child route will be navigated to if no child
 * route is specified during the navigation.
 *
 * ### Example
 * ```
 * import {RouteConfig, AsyncRoute} from 'angular2/router';
 *
 * @RouteConfig([
 *   new AsyncRoute({path: '/home', loader: () => Promise.resolve(MyLoadedCmp), name:
 * 'MyLoadedCmp'})
 * ])
 * class MyApp {}
 * ```
 */
export let AsyncRoute = class AsyncRoute extends AbstractRoute {
    constructor({ name, useAsDefault, path, regex, serializer, data, loader }) {
        super({
            name: name,
            useAsDefault: useAsDefault,
            path: path,
            regex: regex,
            serializer: serializer,
            data: data
        });
        this.aux = null;
        this.loader = loader;
    }
};
AsyncRoute = __decorate([
    CONST(), 
    __metadata('design:paramtypes', [Object])
], AsyncRoute);
/**
 * `Redirect` is a type of {@link RouteDefinition} used to route a path to a canonical route.
 *
 * It has the following properties:
 * - `path` is a string that uses the route matcher DSL.
 * - `redirectTo` is an array representing the link DSL.
 *
 * Note that redirects **do not** affect how links are generated. For that, see the `useAsDefault`
 * option.
 *
 * ### Example
 * ```
 * import {RouteConfig, Route, Redirect} from 'angular2/router';
 *
 * @RouteConfig([
 *   new Redirect({path: '/', redirectTo: ['/Home'] }),
 *   new Route({path: '/home', component: HomeCmp, name: 'Home'})
 * ])
 * class MyApp {}
 * ```
 */
export let Redirect = class Redirect extends AbstractRoute {
    constructor({ name, useAsDefault, path, regex, serializer, data, redirectTo }) {
        super({
            name: name,
            useAsDefault: useAsDefault,
            path: path,
            regex: regex,
            serializer: serializer,
            data: data
        });
        this.redirectTo = redirectTo;
    }
};
Redirect = __decorate([
    CONST(), 
    __metadata('design:paramtypes', [Object])
], Redirect);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGVfY29uZmlnX2ltcGwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJkaWZmaW5nX3BsdWdpbl93cmFwcGVyLW91dHB1dF9wYXRoLW9YRE80cDJ2LnRtcC9hbmd1bGFyMi9zcmMvcm91dGVyL3JvdXRlX2NvbmZpZy9yb3V0ZV9jb25maWdfaW1wbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7T0FBTyxFQUFDLEtBQUssRUFBa0IsTUFBTSwwQkFBMEI7QUFNL0QsSUFBSSwwQkFBMEIsR0FBaUIsSUFBSSxDQUFDO0FBRXBEOzs7O0dBSUc7QUFFSDtJQUNFLFlBQW1CLE9BQTBCO1FBQTFCLFlBQU8sR0FBUCxPQUFPLENBQW1CO0lBQUcsQ0FBQztBQUNuRCxDQUFDO0FBSEQ7SUFBQyxLQUFLLEVBQUU7O2VBQUE7QUFNUjtJQVFFLFlBQVksRUFBQyxJQUFJLEVBQUUsWUFBWSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsVUFBVSxFQUFFLElBQUksRUFBa0I7UUFDOUUsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7UUFDakIsSUFBSSxDQUFDLFlBQVksR0FBRyxZQUFZLENBQUM7UUFDakMsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7UUFDakIsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7UUFDbkIsSUFBSSxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUM7UUFDN0IsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7SUFDbkIsQ0FBQztBQUNILENBQUM7QUFqQkQ7SUFBQyxLQUFLLEVBQUU7O2lCQUFBO0FBbUJSOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FxQkc7QUFFSCx1Q0FBMkIsYUFBYTtJQUl0QyxZQUFZLEVBQUMsSUFBSSxFQUFFLFlBQVksRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLFVBQVUsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFrQjtRQUN6RixNQUFNO1lBQ0osSUFBSSxFQUFFLElBQUk7WUFDVixZQUFZLEVBQUUsWUFBWTtZQUMxQixJQUFJLEVBQUUsSUFBSTtZQUNWLEtBQUssRUFBRSxLQUFLO1lBQ1osVUFBVSxFQUFFLFVBQVU7WUFDdEIsSUFBSSxFQUFFLElBQUk7U0FDWCxDQUFDLENBQUM7UUFWTCxRQUFHLEdBQVcsSUFBSSxDQUFDO1FBV2pCLElBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO0lBQzdCLENBQUM7QUFDSCxDQUFDO0FBaEJEO0lBQUMsS0FBSyxFQUFFOztTQUFBO0FBa0JSOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBbUJHO0FBRUgsNkNBQThCLGFBQWE7SUFHekMsWUFBWSxFQUFDLElBQUksRUFBRSxZQUFZLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBa0I7UUFDekYsTUFBTTtZQUNKLElBQUksRUFBRSxJQUFJO1lBQ1YsWUFBWSxFQUFFLFlBQVk7WUFDMUIsSUFBSSxFQUFFLElBQUk7WUFDVixLQUFLLEVBQUUsS0FBSztZQUNaLFVBQVUsRUFBRSxVQUFVO1lBQ3RCLElBQUksRUFBRSxJQUFJO1NBQ1gsQ0FBQyxDQUFDO1FBQ0gsSUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7SUFDN0IsQ0FBQztBQUNILENBQUM7QUFmRDtJQUFDLEtBQUssRUFBRTs7WUFBQTtBQWlCUjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0F1Qkc7QUFFSCxpREFBZ0MsYUFBYTtJQUkzQyxZQUFZLEVBQUMsSUFBSSxFQUFFLFlBQVksRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLFVBQVUsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFrQjtRQUN0RixNQUFNO1lBQ0osSUFBSSxFQUFFLElBQUk7WUFDVixZQUFZLEVBQUUsWUFBWTtZQUMxQixJQUFJLEVBQUUsSUFBSTtZQUNWLEtBQUssRUFBRSxLQUFLO1lBQ1osVUFBVSxFQUFFLFVBQVU7WUFDdEIsSUFBSSxFQUFFLElBQUk7U0FDWCxDQUFDLENBQUM7UUFWTCxRQUFHLEdBQVcsSUFBSSxDQUFDO1FBV2pCLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO0lBQ3ZCLENBQUM7QUFDSCxDQUFDO0FBaEJEO0lBQUMsS0FBSyxFQUFFOztjQUFBO0FBa0JSOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQW9CRztBQUVILDZDQUE4QixhQUFhO0lBR3pDLFlBQVksRUFBQyxJQUFJLEVBQUUsWUFBWSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsVUFBVSxFQUFFLElBQUksRUFBRSxVQUFVLEVBQWtCO1FBQzFGLE1BQU07WUFDSixJQUFJLEVBQUUsSUFBSTtZQUNWLFlBQVksRUFBRSxZQUFZO1lBQzFCLElBQUksRUFBRSxJQUFJO1lBQ1YsS0FBSyxFQUFFLEtBQUs7WUFDWixVQUFVLEVBQUUsVUFBVTtZQUN0QixJQUFJLEVBQUUsSUFBSTtTQUNYLENBQUMsQ0FBQztRQUNILElBQUksQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFDO0lBQy9CLENBQUM7QUFDSCxDQUFDO0FBZkQ7SUFBQyxLQUFLLEVBQUU7O1lBQUE7QUFlUCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7Q09OU1QsIFR5cGUsIGlzUHJlc2VudH0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9sYW5nJztcbmltcG9ydCB7Um91dGVEZWZpbml0aW9ufSBmcm9tICcuLi9yb3V0ZV9kZWZpbml0aW9uJztcbmltcG9ydCB7UmVnZXhTZXJpYWxpemVyfSBmcm9tICcuLi9ydWxlcy9yb3V0ZV9wYXRocy9yZWdleF9yb3V0ZV9wYXRoJztcblxuZXhwb3J0IHtSb3V0ZURlZmluaXRpb259IGZyb20gJy4uL3JvdXRlX2RlZmluaXRpb24nO1xuXG52YXIgX19tYWtlX2RhcnRfYW5hbHl6ZXJfaGFwcHk6IFByb21pc2U8YW55PiA9IG51bGw7XG5cbi8qKlxuICogVGhlIGBSb3V0ZUNvbmZpZ2AgZGVjb3JhdG9yIGRlZmluZXMgcm91dGVzIGZvciBhIGdpdmVuIGNvbXBvbmVudC5cbiAqXG4gKiBJdCB0YWtlcyBhbiBhcnJheSBvZiB7QGxpbmsgUm91dGVEZWZpbml0aW9ufXMuXG4gKi9cbkBDT05TVCgpXG5leHBvcnQgY2xhc3MgUm91dGVDb25maWcge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgY29uZmlnczogUm91dGVEZWZpbml0aW9uW10pIHt9XG59XG5cbkBDT05TVCgpXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgQWJzdHJhY3RSb3V0ZSBpbXBsZW1lbnRzIFJvdXRlRGVmaW5pdGlvbiB7XG4gIG5hbWU6IHN0cmluZztcbiAgdXNlQXNEZWZhdWx0OiBib29sZWFuO1xuICBwYXRoOiBzdHJpbmc7XG4gIHJlZ2V4OiBzdHJpbmc7XG4gIHNlcmlhbGl6ZXI6IFJlZ2V4U2VyaWFsaXplcjtcbiAgZGF0YToge1trZXk6IHN0cmluZ106IGFueX07XG5cbiAgY29uc3RydWN0b3Ioe25hbWUsIHVzZUFzRGVmYXVsdCwgcGF0aCwgcmVnZXgsIHNlcmlhbGl6ZXIsIGRhdGF9OiBSb3V0ZURlZmluaXRpb24pIHtcbiAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgIHRoaXMudXNlQXNEZWZhdWx0ID0gdXNlQXNEZWZhdWx0O1xuICAgIHRoaXMucGF0aCA9IHBhdGg7XG4gICAgdGhpcy5yZWdleCA9IHJlZ2V4O1xuICAgIHRoaXMuc2VyaWFsaXplciA9IHNlcmlhbGl6ZXI7XG4gICAgdGhpcy5kYXRhID0gZGF0YTtcbiAgfVxufVxuXG4vKipcbiAqIGBSb3V0ZWAgaXMgYSB0eXBlIG9mIHtAbGluayBSb3V0ZURlZmluaXRpb259IHVzZWQgdG8gcm91dGUgYSBwYXRoIHRvIGEgY29tcG9uZW50LlxuICpcbiAqIEl0IGhhcyB0aGUgZm9sbG93aW5nIHByb3BlcnRpZXM6XG4gKiAtIGBwYXRoYCBpcyBhIHN0cmluZyB0aGF0IHVzZXMgdGhlIHJvdXRlIG1hdGNoZXIgRFNMLlxuICogLSBgY29tcG9uZW50YCBhIGNvbXBvbmVudCB0eXBlLlxuICogLSBgbmFtZWAgaXMgYW4gb3B0aW9uYWwgYENhbWVsQ2FzZWAgc3RyaW5nIHJlcHJlc2VudGluZyB0aGUgbmFtZSBvZiB0aGUgcm91dGUuXG4gKiAtIGBkYXRhYCBpcyBhbiBvcHRpb25hbCBwcm9wZXJ0eSBvZiBhbnkgdHlwZSByZXByZXNlbnRpbmcgYXJiaXRyYXJ5IHJvdXRlIG1ldGFkYXRhIGZvciB0aGUgZ2l2ZW5cbiAqIHJvdXRlLiBJdCBpcyBpbmplY3RhYmxlIHZpYSB7QGxpbmsgUm91dGVEYXRhfS5cbiAqIC0gYHVzZUFzRGVmYXVsdGAgaXMgYSBib29sZWFuIHZhbHVlLiBJZiBgdHJ1ZWAsIHRoZSBjaGlsZCByb3V0ZSB3aWxsIGJlIG5hdmlnYXRlZCB0byBpZiBubyBjaGlsZFxuICogcm91dGUgaXMgc3BlY2lmaWVkIGR1cmluZyB0aGUgbmF2aWdhdGlvbi5cbiAqXG4gKiAjIyMgRXhhbXBsZVxuICogYGBgXG4gKiBpbXBvcnQge1JvdXRlQ29uZmlnLCBSb3V0ZX0gZnJvbSAnYW5ndWxhcjIvcm91dGVyJztcbiAqXG4gKiBAUm91dGVDb25maWcoW1xuICogICBuZXcgUm91dGUoe3BhdGg6ICcvaG9tZScsIGNvbXBvbmVudDogSG9tZUNtcCwgbmFtZTogJ0hvbWVDbXAnIH0pXG4gKiBdKVxuICogY2xhc3MgTXlBcHAge31cbiAqIGBgYFxuICovXG5AQ09OU1QoKVxuZXhwb3J0IGNsYXNzIFJvdXRlIGV4dGVuZHMgQWJzdHJhY3RSb3V0ZSB7XG4gIGNvbXBvbmVudDogYW55O1xuICBhdXg6IHN0cmluZyA9IG51bGw7XG5cbiAgY29uc3RydWN0b3Ioe25hbWUsIHVzZUFzRGVmYXVsdCwgcGF0aCwgcmVnZXgsIHNlcmlhbGl6ZXIsIGRhdGEsIGNvbXBvbmVudH06IFJvdXRlRGVmaW5pdGlvbikge1xuICAgIHN1cGVyKHtcbiAgICAgIG5hbWU6IG5hbWUsXG4gICAgICB1c2VBc0RlZmF1bHQ6IHVzZUFzRGVmYXVsdCxcbiAgICAgIHBhdGg6IHBhdGgsXG4gICAgICByZWdleDogcmVnZXgsXG4gICAgICBzZXJpYWxpemVyOiBzZXJpYWxpemVyLFxuICAgICAgZGF0YTogZGF0YVxuICAgIH0pO1xuICAgIHRoaXMuY29tcG9uZW50ID0gY29tcG9uZW50O1xuICB9XG59XG5cbi8qKlxuICogYEF1eFJvdXRlYCBpcyBhIHR5cGUgb2Yge0BsaW5rIFJvdXRlRGVmaW5pdGlvbn0gdXNlZCB0byBkZWZpbmUgYW4gYXV4aWxpYXJ5IHJvdXRlLlxuICpcbiAqIEl0IHRha2VzIGFuIG9iamVjdCB3aXRoIHRoZSBmb2xsb3dpbmcgcHJvcGVydGllczpcbiAqIC0gYHBhdGhgIGlzIGEgc3RyaW5nIHRoYXQgdXNlcyB0aGUgcm91dGUgbWF0Y2hlciBEU0wuXG4gKiAtIGBjb21wb25lbnRgIGEgY29tcG9uZW50IHR5cGUuXG4gKiAtIGBuYW1lYCBpcyBhbiBvcHRpb25hbCBgQ2FtZWxDYXNlYCBzdHJpbmcgcmVwcmVzZW50aW5nIHRoZSBuYW1lIG9mIHRoZSByb3V0ZS5cbiAqIC0gYGRhdGFgIGlzIGFuIG9wdGlvbmFsIHByb3BlcnR5IG9mIGFueSB0eXBlIHJlcHJlc2VudGluZyBhcmJpdHJhcnkgcm91dGUgbWV0YWRhdGEgZm9yIHRoZSBnaXZlblxuICogcm91dGUuIEl0IGlzIGluamVjdGFibGUgdmlhIHtAbGluayBSb3V0ZURhdGF9LlxuICpcbiAqICMjIyBFeGFtcGxlXG4gKiBgYGBcbiAqIGltcG9ydCB7Um91dGVDb25maWcsIEF1eFJvdXRlfSBmcm9tICdhbmd1bGFyMi9yb3V0ZXInO1xuICpcbiAqIEBSb3V0ZUNvbmZpZyhbXG4gKiAgIG5ldyBBdXhSb3V0ZSh7cGF0aDogJy9ob21lJywgY29tcG9uZW50OiBIb21lQ21wfSlcbiAqIF0pXG4gKiBjbGFzcyBNeUFwcCB7fVxuICogYGBgXG4gKi9cbkBDT05TVCgpXG5leHBvcnQgY2xhc3MgQXV4Um91dGUgZXh0ZW5kcyBBYnN0cmFjdFJvdXRlIHtcbiAgY29tcG9uZW50OiBhbnk7XG5cbiAgY29uc3RydWN0b3Ioe25hbWUsIHVzZUFzRGVmYXVsdCwgcGF0aCwgcmVnZXgsIHNlcmlhbGl6ZXIsIGRhdGEsIGNvbXBvbmVudH06IFJvdXRlRGVmaW5pdGlvbikge1xuICAgIHN1cGVyKHtcbiAgICAgIG5hbWU6IG5hbWUsXG4gICAgICB1c2VBc0RlZmF1bHQ6IHVzZUFzRGVmYXVsdCxcbiAgICAgIHBhdGg6IHBhdGgsXG4gICAgICByZWdleDogcmVnZXgsXG4gICAgICBzZXJpYWxpemVyOiBzZXJpYWxpemVyLFxuICAgICAgZGF0YTogZGF0YVxuICAgIH0pO1xuICAgIHRoaXMuY29tcG9uZW50ID0gY29tcG9uZW50O1xuICB9XG59XG5cbi8qKlxuICogYEFzeW5jUm91dGVgIGlzIGEgdHlwZSBvZiB7QGxpbmsgUm91dGVEZWZpbml0aW9ufSB1c2VkIHRvIHJvdXRlIGEgcGF0aCB0byBhbiBhc3luY2hyb25vdXNseVxuICogbG9hZGVkIGNvbXBvbmVudC5cbiAqXG4gKiBJdCBoYXMgdGhlIGZvbGxvd2luZyBwcm9wZXJ0aWVzOlxuICogLSBgcGF0aGAgaXMgYSBzdHJpbmcgdGhhdCB1c2VzIHRoZSByb3V0ZSBtYXRjaGVyIERTTC5cbiAqIC0gYGxvYWRlcmAgaXMgYSBmdW5jdGlvbiB0aGF0IHJldHVybnMgYSBwcm9taXNlIHRoYXQgcmVzb2x2ZXMgdG8gYSBjb21wb25lbnQuXG4gKiAtIGBuYW1lYCBpcyBhbiBvcHRpb25hbCBgQ2FtZWxDYXNlYCBzdHJpbmcgcmVwcmVzZW50aW5nIHRoZSBuYW1lIG9mIHRoZSByb3V0ZS5cbiAqIC0gYGRhdGFgIGlzIGFuIG9wdGlvbmFsIHByb3BlcnR5IG9mIGFueSB0eXBlIHJlcHJlc2VudGluZyBhcmJpdHJhcnkgcm91dGUgbWV0YWRhdGEgZm9yIHRoZSBnaXZlblxuICogcm91dGUuIEl0IGlzIGluamVjdGFibGUgdmlhIHtAbGluayBSb3V0ZURhdGF9LlxuICogLSBgdXNlQXNEZWZhdWx0YCBpcyBhIGJvb2xlYW4gdmFsdWUuIElmIGB0cnVlYCwgdGhlIGNoaWxkIHJvdXRlIHdpbGwgYmUgbmF2aWdhdGVkIHRvIGlmIG5vIGNoaWxkXG4gKiByb3V0ZSBpcyBzcGVjaWZpZWQgZHVyaW5nIHRoZSBuYXZpZ2F0aW9uLlxuICpcbiAqICMjIyBFeGFtcGxlXG4gKiBgYGBcbiAqIGltcG9ydCB7Um91dGVDb25maWcsIEFzeW5jUm91dGV9IGZyb20gJ2FuZ3VsYXIyL3JvdXRlcic7XG4gKlxuICogQFJvdXRlQ29uZmlnKFtcbiAqICAgbmV3IEFzeW5jUm91dGUoe3BhdGg6ICcvaG9tZScsIGxvYWRlcjogKCkgPT4gUHJvbWlzZS5yZXNvbHZlKE15TG9hZGVkQ21wKSwgbmFtZTpcbiAqICdNeUxvYWRlZENtcCd9KVxuICogXSlcbiAqIGNsYXNzIE15QXBwIHt9XG4gKiBgYGBcbiAqL1xuQENPTlNUKClcbmV4cG9ydCBjbGFzcyBBc3luY1JvdXRlIGV4dGVuZHMgQWJzdHJhY3RSb3V0ZSB7XG4gIGxvYWRlcjogKCkgPT4gUHJvbWlzZTxUeXBlPjtcbiAgYXV4OiBzdHJpbmcgPSBudWxsO1xuXG4gIGNvbnN0cnVjdG9yKHtuYW1lLCB1c2VBc0RlZmF1bHQsIHBhdGgsIHJlZ2V4LCBzZXJpYWxpemVyLCBkYXRhLCBsb2FkZXJ9OiBSb3V0ZURlZmluaXRpb24pIHtcbiAgICBzdXBlcih7XG4gICAgICBuYW1lOiBuYW1lLFxuICAgICAgdXNlQXNEZWZhdWx0OiB1c2VBc0RlZmF1bHQsXG4gICAgICBwYXRoOiBwYXRoLFxuICAgICAgcmVnZXg6IHJlZ2V4LFxuICAgICAgc2VyaWFsaXplcjogc2VyaWFsaXplcixcbiAgICAgIGRhdGE6IGRhdGFcbiAgICB9KTtcbiAgICB0aGlzLmxvYWRlciA9IGxvYWRlcjtcbiAgfVxufVxuXG4vKipcbiAqIGBSZWRpcmVjdGAgaXMgYSB0eXBlIG9mIHtAbGluayBSb3V0ZURlZmluaXRpb259IHVzZWQgdG8gcm91dGUgYSBwYXRoIHRvIGEgY2Fub25pY2FsIHJvdXRlLlxuICpcbiAqIEl0IGhhcyB0aGUgZm9sbG93aW5nIHByb3BlcnRpZXM6XG4gKiAtIGBwYXRoYCBpcyBhIHN0cmluZyB0aGF0IHVzZXMgdGhlIHJvdXRlIG1hdGNoZXIgRFNMLlxuICogLSBgcmVkaXJlY3RUb2AgaXMgYW4gYXJyYXkgcmVwcmVzZW50aW5nIHRoZSBsaW5rIERTTC5cbiAqXG4gKiBOb3RlIHRoYXQgcmVkaXJlY3RzICoqZG8gbm90KiogYWZmZWN0IGhvdyBsaW5rcyBhcmUgZ2VuZXJhdGVkLiBGb3IgdGhhdCwgc2VlIHRoZSBgdXNlQXNEZWZhdWx0YFxuICogb3B0aW9uLlxuICpcbiAqICMjIyBFeGFtcGxlXG4gKiBgYGBcbiAqIGltcG9ydCB7Um91dGVDb25maWcsIFJvdXRlLCBSZWRpcmVjdH0gZnJvbSAnYW5ndWxhcjIvcm91dGVyJztcbiAqXG4gKiBAUm91dGVDb25maWcoW1xuICogICBuZXcgUmVkaXJlY3Qoe3BhdGg6ICcvJywgcmVkaXJlY3RUbzogWycvSG9tZSddIH0pLFxuICogICBuZXcgUm91dGUoe3BhdGg6ICcvaG9tZScsIGNvbXBvbmVudDogSG9tZUNtcCwgbmFtZTogJ0hvbWUnfSlcbiAqIF0pXG4gKiBjbGFzcyBNeUFwcCB7fVxuICogYGBgXG4gKi9cbkBDT05TVCgpXG5leHBvcnQgY2xhc3MgUmVkaXJlY3QgZXh0ZW5kcyBBYnN0cmFjdFJvdXRlIHtcbiAgcmVkaXJlY3RUbzogYW55W107XG5cbiAgY29uc3RydWN0b3Ioe25hbWUsIHVzZUFzRGVmYXVsdCwgcGF0aCwgcmVnZXgsIHNlcmlhbGl6ZXIsIGRhdGEsIHJlZGlyZWN0VG99OiBSb3V0ZURlZmluaXRpb24pIHtcbiAgICBzdXBlcih7XG4gICAgICBuYW1lOiBuYW1lLFxuICAgICAgdXNlQXNEZWZhdWx0OiB1c2VBc0RlZmF1bHQsXG4gICAgICBwYXRoOiBwYXRoLFxuICAgICAgcmVnZXg6IHJlZ2V4LFxuICAgICAgc2VyaWFsaXplcjogc2VyaWFsaXplcixcbiAgICAgIGRhdGE6IGRhdGFcbiAgICB9KTtcbiAgICB0aGlzLnJlZGlyZWN0VG8gPSByZWRpcmVjdFRvO1xuICB9XG59XG4iXX0=