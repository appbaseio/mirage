var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, provide } from 'angular2/core';
import { bootstrap } from 'angular2/platform/browser';
import { RouteConfig, ROUTER_DIRECTIVES, APP_BASE_HREF } from 'angular2/router';
// #docregion routerOnActivate
let ChildCmp = class ChildCmp {
};
ChildCmp = __decorate([
    Component({ template: `Child` }), 
    __metadata('design:paramtypes', [])
], ChildCmp);
let ParentCmp = class ParentCmp {
    constructor() {
        this.log = '';
    }
    routerOnActivate(next, prev) {
        this.log = `Finished navigating from "${prev ? prev.urlPath : 'null'}" to "${next.urlPath}"`;
        return new Promise(resolve => {
            // The ChildCmp gets instantiated only when the Promise is resolved
            setTimeout(() => resolve(null), 1000);
        });
    }
};
ParentCmp = __decorate([
    Component({
        template: `
    <h2>Parent</h2> (<router-outlet></router-outlet>) 
    <p>{{log}}</p>`,
        directives: [ROUTER_DIRECTIVES]
    }),
    RouteConfig([{ path: '/child', name: 'Child', component: ChildCmp }]), 
    __metadata('design:paramtypes', [])
], ParentCmp);
// #enddocregion
export let AppCmp = class AppCmp {
};
AppCmp = __decorate([
    Component({
        selector: 'example-app',
        template: `
    <h1>My app</h1>
    
    <nav>
      <a [routerLink]="['Parent', 'Child']">Child</a>
    </nav>
    <router-outlet></router-outlet>
  `,
        directives: [ROUTER_DIRECTIVES]
    }),
    RouteConfig([{ path: '/parent/...', name: 'Parent', component: ParentCmp }]), 
    __metadata('design:paramtypes', [])
], AppCmp);
export function main() {
    return bootstrap(AppCmp, [provide(APP_BASE_HREF, { useValue: '/angular2/examples/router/ts/on_activate' })]);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib25fYWN0aXZhdGVfZXhhbXBsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRpZmZpbmdfcGx1Z2luX3dyYXBwZXItb3V0cHV0X3BhdGgtb1hETzRwMnYudG1wL2FuZ3VsYXIyL2V4YW1wbGVzL3JvdXRlci90cy9vbl9hY3RpdmF0ZS9vbl9hY3RpdmF0ZV9leGFtcGxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztPQUFPLEVBQUMsU0FBUyxFQUFFLE9BQU8sRUFBQyxNQUFNLGVBQWU7T0FDekMsRUFBQyxTQUFTLEVBQUMsTUFBTSwyQkFBMkI7T0FDNUMsRUFHTCxXQUFXLEVBQ1gsaUJBQWlCLEVBQ2pCLGFBQWEsRUFDZCxNQUFNLGlCQUFpQjtBQUV4Qiw4QkFBOEI7QUFFOUI7QUFDQSxDQUFDO0FBRkQ7SUFBQyxTQUFTLENBQUMsRUFBQyxRQUFRLEVBQUUsT0FBTyxFQUFDLENBQUM7O1lBQUE7QUFXL0I7SUFBQTtRQUNFLFFBQUcsR0FBVyxFQUFFLENBQUM7SUFVbkIsQ0FBQztJQVJDLGdCQUFnQixDQUFDLElBQTBCLEVBQUUsSUFBMEI7UUFDckUsSUFBSSxDQUFDLEdBQUcsR0FBRyw2QkFBNkIsSUFBSSxHQUFHLElBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxTQUFTLElBQUksQ0FBQyxPQUFPLEdBQUcsQ0FBQztRQUU3RixNQUFNLENBQUMsSUFBSSxPQUFPLENBQUMsT0FBTztZQUN4QixtRUFBbUU7WUFDbkUsVUFBVSxDQUFDLE1BQU0sT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3hDLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztBQUNILENBQUM7QUFsQkQ7SUFBQyxTQUFTLENBQUM7UUFDVCxRQUFRLEVBQUU7O21CQUVPO1FBQ2pCLFVBQVUsRUFBRSxDQUFDLGlCQUFpQixDQUFDO0tBQ2hDLENBQUM7SUFDRCxXQUFXLENBQUMsQ0FBQyxFQUFDLElBQUksRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxTQUFTLEVBQUUsUUFBUSxFQUFDLENBQUMsQ0FBQzs7YUFBQTtBQWFwRSxnQkFBZ0I7QUFnQmhCO0FBQ0EsQ0FBQztBQWREO0lBQUMsU0FBUyxDQUFDO1FBQ1QsUUFBUSxFQUFFLGFBQWE7UUFDdkIsUUFBUSxFQUFFOzs7Ozs7O0dBT1Q7UUFDRCxVQUFVLEVBQUUsQ0FBQyxpQkFBaUIsQ0FBQztLQUNoQyxDQUFDO0lBQ0QsV0FBVyxDQUFDLENBQUMsRUFBQyxJQUFJLEVBQUUsYUFBYSxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBQyxDQUFDLENBQUM7O1VBQUE7QUFJM0U7SUFDRSxNQUFNLENBQUMsU0FBUyxDQUNaLE1BQU0sRUFBRSxDQUFDLE9BQU8sQ0FBQyxhQUFhLEVBQUUsRUFBQyxRQUFRLEVBQUUsMENBQTBDLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNoRyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtDb21wb25lbnQsIHByb3ZpZGV9IGZyb20gJ2FuZ3VsYXIyL2NvcmUnO1xuaW1wb3J0IHtib290c3RyYXB9IGZyb20gJ2FuZ3VsYXIyL3BsYXRmb3JtL2Jyb3dzZXInO1xuaW1wb3J0IHtcbiAgT25BY3RpdmF0ZSxcbiAgQ29tcG9uZW50SW5zdHJ1Y3Rpb24sXG4gIFJvdXRlQ29uZmlnLFxuICBST1VURVJfRElSRUNUSVZFUyxcbiAgQVBQX0JBU0VfSFJFRlxufSBmcm9tICdhbmd1bGFyMi9yb3V0ZXInO1xuXG4vLyAjZG9jcmVnaW9uIHJvdXRlck9uQWN0aXZhdGVcbkBDb21wb25lbnQoe3RlbXBsYXRlOiBgQ2hpbGRgfSlcbmNsYXNzIENoaWxkQ21wIHtcbn1cblxuQENvbXBvbmVudCh7XG4gIHRlbXBsYXRlOiBgXG4gICAgPGgyPlBhcmVudDwvaDI+ICg8cm91dGVyLW91dGxldD48L3JvdXRlci1vdXRsZXQ+KSBcbiAgICA8cD57e2xvZ319PC9wPmAsXG4gIGRpcmVjdGl2ZXM6IFtST1VURVJfRElSRUNUSVZFU11cbn0pXG5AUm91dGVDb25maWcoW3twYXRoOiAnL2NoaWxkJywgbmFtZTogJ0NoaWxkJywgY29tcG9uZW50OiBDaGlsZENtcH1dKVxuY2xhc3MgUGFyZW50Q21wIGltcGxlbWVudHMgT25BY3RpdmF0ZSB7XG4gIGxvZzogc3RyaW5nID0gJyc7XG5cbiAgcm91dGVyT25BY3RpdmF0ZShuZXh0OiBDb21wb25lbnRJbnN0cnVjdGlvbiwgcHJldjogQ29tcG9uZW50SW5zdHJ1Y3Rpb24pIHtcbiAgICB0aGlzLmxvZyA9IGBGaW5pc2hlZCBuYXZpZ2F0aW5nIGZyb20gXCIke3ByZXYgPyBwcmV2LnVybFBhdGggOiAnbnVsbCd9XCIgdG8gXCIke25leHQudXJsUGF0aH1cImA7XG5cbiAgICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG4gICAgICAvLyBUaGUgQ2hpbGRDbXAgZ2V0cyBpbnN0YW50aWF0ZWQgb25seSB3aGVuIHRoZSBQcm9taXNlIGlzIHJlc29sdmVkXG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHJlc29sdmUobnVsbCksIDEwMDApO1xuICAgIH0pO1xuICB9XG59XG4vLyAjZW5kZG9jcmVnaW9uXG5cblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnZXhhbXBsZS1hcHAnLFxuICB0ZW1wbGF0ZTogYFxuICAgIDxoMT5NeSBhcHA8L2gxPlxuICAgIFxuICAgIDxuYXY+XG4gICAgICA8YSBbcm91dGVyTGlua109XCJbJ1BhcmVudCcsICdDaGlsZCddXCI+Q2hpbGQ8L2E+XG4gICAgPC9uYXY+XG4gICAgPHJvdXRlci1vdXRsZXQ+PC9yb3V0ZXItb3V0bGV0PlxuICBgLFxuICBkaXJlY3RpdmVzOiBbUk9VVEVSX0RJUkVDVElWRVNdXG59KVxuQFJvdXRlQ29uZmlnKFt7cGF0aDogJy9wYXJlbnQvLi4uJywgbmFtZTogJ1BhcmVudCcsIGNvbXBvbmVudDogUGFyZW50Q21wfV0pXG5leHBvcnQgY2xhc3MgQXBwQ21wIHtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG1haW4oKSB7XG4gIHJldHVybiBib290c3RyYXAoXG4gICAgICBBcHBDbXAsIFtwcm92aWRlKEFQUF9CQVNFX0hSRUYsIHt1c2VWYWx1ZTogJy9hbmd1bGFyMi9leGFtcGxlcy9yb3V0ZXIvdHMvb25fYWN0aXZhdGUnfSldKTtcbn1cbiJdfQ==