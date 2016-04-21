var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, Injectable, provide } from 'angular2/core';
import { bootstrap } from 'angular2/platform/browser';
import { RouteConfig, ROUTER_DIRECTIVES, APP_BASE_HREF } from 'angular2/router';
let LogService = class LogService {
    constructor() {
        this.logs = [];
    }
    addLog(message) { this.logs.push(message); }
};
LogService = __decorate([
    Injectable(), 
    __metadata('design:paramtypes', [])
], LogService);
// #docregion routerOnDeactivate
let MyCmp = class MyCmp {
    constructor(logService) {
        this.logService = logService;
    }
    routerOnDeactivate(next, prev) {
        this.logService.addLog(`Navigating from "${prev ? prev.urlPath : 'null'}" to "${next.urlPath}"`);
    }
};
MyCmp = __decorate([
    Component({ selector: 'my-cmp', template: `<div>hello</div>` }), 
    __metadata('design:paramtypes', [LogService])
], MyCmp);
// #enddocregion
let AppCmp = class AppCmp {
    constructor(logService) {
        this.logService = logService;
    }
};
AppCmp = __decorate([
    Component({
        selector: 'example-app',
        template: `
    <h1>My App</h1>
    <nav>
      <a [routerLink]="['/HomeCmp']" id="home-link">Navigate Home</a> |
      <a [routerLink]="['/ParamCmp', {param: 1}]" id="param-link">Navigate with a Param</a>
    </nav>
    <router-outlet></router-outlet>
    <div id="log">
      <h2>Log:</h2>
      <p *ngFor="#logItem of logService.logs">{{ logItem }}</p>
    </div>
  `,
        directives: [ROUTER_DIRECTIVES]
    }),
    RouteConfig([
        { path: '/', component: MyCmp, name: 'HomeCmp' },
        { path: '/:param', component: MyCmp, name: 'ParamCmp' }
    ]), 
    __metadata('design:paramtypes', [LogService])
], AppCmp);
export function main() {
    return bootstrap(AppCmp, [
        provide(APP_BASE_HREF, { useValue: '/angular2/examples/router/ts/on_deactivate' }),
        LogService
    ]);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib25fZGVhY3RpdmF0ZV9leGFtcGxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZGlmZmluZ19wbHVnaW5fd3JhcHBlci1vdXRwdXRfcGF0aC1vWERPNHAydi50bXAvYW5ndWxhcjIvZXhhbXBsZXMvcm91dGVyL3RzL29uX2RlYWN0aXZhdGUvb25fZGVhY3RpdmF0ZV9leGFtcGxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztPQUFPLEVBQUMsU0FBUyxFQUFFLFVBQVUsRUFBRSxPQUFPLEVBQUMsTUFBTSxlQUFlO09BQ3JELEVBQUMsU0FBUyxFQUFDLE1BQU0sMkJBQTJCO09BQzVDLEVBR0wsV0FBVyxFQUNYLGlCQUFpQixFQUNqQixhQUFhLEVBQ2QsTUFBTSxpQkFBaUI7QUFJeEI7SUFBQTtRQUNFLFNBQUksR0FBYSxFQUFFLENBQUM7SUFHdEIsQ0FBQztJQURDLE1BQU0sQ0FBQyxPQUFlLElBQVUsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzVELENBQUM7QUFMRDtJQUFDLFVBQVUsRUFBRTs7Y0FBQTtBQVFiLGdDQUFnQztBQUVoQztJQUNFLFlBQW9CLFVBQXNCO1FBQXRCLGVBQVUsR0FBVixVQUFVLENBQVk7SUFBRyxDQUFDO0lBRTlDLGtCQUFrQixDQUFDLElBQTBCLEVBQUUsSUFBMEI7UUFDdkUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQ2xCLG9CQUFvQixJQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLFNBQVMsSUFBSSxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUM7SUFDaEYsQ0FBQztBQUNILENBQUM7QUFSRDtJQUFDLFNBQVMsQ0FBQyxFQUFDLFFBQVEsRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLGtCQUFrQixFQUFDLENBQUM7O1NBQUE7QUFTOUQsZ0JBQWdCO0FBdUJoQjtJQUNFLFlBQW1CLFVBQXNCO1FBQXRCLGVBQVUsR0FBVixVQUFVLENBQVk7SUFBRyxDQUFDO0FBQy9DLENBQUM7QUF0QkQ7SUFBQyxTQUFTLENBQUM7UUFDVCxRQUFRLEVBQUUsYUFBYTtRQUN2QixRQUFRLEVBQUU7Ozs7Ozs7Ozs7O0dBV1Q7UUFDRCxVQUFVLEVBQUUsQ0FBQyxpQkFBaUIsQ0FBQztLQUNoQyxDQUFDO0lBQ0QsV0FBVyxDQUFDO1FBQ1gsRUFBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBQztRQUM5QyxFQUFDLElBQUksRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFDO0tBQ3RELENBQUM7O1VBQUE7QUFNRjtJQUNFLE1BQU0sQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFO1FBQ3ZCLE9BQU8sQ0FBQyxhQUFhLEVBQUUsRUFBQyxRQUFRLEVBQUUsNENBQTRDLEVBQUMsQ0FBQztRQUNoRixVQUFVO0tBQ1gsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7Q29tcG9uZW50LCBJbmplY3RhYmxlLCBwcm92aWRlfSBmcm9tICdhbmd1bGFyMi9jb3JlJztcbmltcG9ydCB7Ym9vdHN0cmFwfSBmcm9tICdhbmd1bGFyMi9wbGF0Zm9ybS9icm93c2VyJztcbmltcG9ydCB7XG4gIE9uRGVhY3RpdmF0ZSxcbiAgQ29tcG9uZW50SW5zdHJ1Y3Rpb24sXG4gIFJvdXRlQ29uZmlnLFxuICBST1VURVJfRElSRUNUSVZFUyxcbiAgQVBQX0JBU0VfSFJFRlxufSBmcm9tICdhbmd1bGFyMi9yb3V0ZXInO1xuXG5cbkBJbmplY3RhYmxlKClcbmNsYXNzIExvZ1NlcnZpY2Uge1xuICBsb2dzOiBzdHJpbmdbXSA9IFtdO1xuXG4gIGFkZExvZyhtZXNzYWdlOiBzdHJpbmcpOiB2b2lkIHsgdGhpcy5sb2dzLnB1c2gobWVzc2FnZSk7IH1cbn1cblxuXG4vLyAjZG9jcmVnaW9uIHJvdXRlck9uRGVhY3RpdmF0ZVxuQENvbXBvbmVudCh7c2VsZWN0b3I6ICdteS1jbXAnLCB0ZW1wbGF0ZTogYDxkaXY+aGVsbG88L2Rpdj5gfSlcbmNsYXNzIE15Q21wIGltcGxlbWVudHMgT25EZWFjdGl2YXRlIHtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBsb2dTZXJ2aWNlOiBMb2dTZXJ2aWNlKSB7fVxuXG4gIHJvdXRlck9uRGVhY3RpdmF0ZShuZXh0OiBDb21wb25lbnRJbnN0cnVjdGlvbiwgcHJldjogQ29tcG9uZW50SW5zdHJ1Y3Rpb24pIHtcbiAgICB0aGlzLmxvZ1NlcnZpY2UuYWRkTG9nKFxuICAgICAgICBgTmF2aWdhdGluZyBmcm9tIFwiJHtwcmV2ID8gcHJldi51cmxQYXRoIDogJ251bGwnfVwiIHRvIFwiJHtuZXh0LnVybFBhdGh9XCJgKTtcbiAgfVxufVxuLy8gI2VuZGRvY3JlZ2lvblxuXG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2V4YW1wbGUtYXBwJyxcbiAgdGVtcGxhdGU6IGBcbiAgICA8aDE+TXkgQXBwPC9oMT5cbiAgICA8bmF2PlxuICAgICAgPGEgW3JvdXRlckxpbmtdPVwiWycvSG9tZUNtcCddXCIgaWQ9XCJob21lLWxpbmtcIj5OYXZpZ2F0ZSBIb21lPC9hPiB8XG4gICAgICA8YSBbcm91dGVyTGlua109XCJbJy9QYXJhbUNtcCcsIHtwYXJhbTogMX1dXCIgaWQ9XCJwYXJhbS1saW5rXCI+TmF2aWdhdGUgd2l0aCBhIFBhcmFtPC9hPlxuICAgIDwvbmF2PlxuICAgIDxyb3V0ZXItb3V0bGV0Pjwvcm91dGVyLW91dGxldD5cbiAgICA8ZGl2IGlkPVwibG9nXCI+XG4gICAgICA8aDI+TG9nOjwvaDI+XG4gICAgICA8cCAqbmdGb3I9XCIjbG9nSXRlbSBvZiBsb2dTZXJ2aWNlLmxvZ3NcIj57eyBsb2dJdGVtIH19PC9wPlxuICAgIDwvZGl2PlxuICBgLFxuICBkaXJlY3RpdmVzOiBbUk9VVEVSX0RJUkVDVElWRVNdXG59KVxuQFJvdXRlQ29uZmlnKFtcbiAge3BhdGg6ICcvJywgY29tcG9uZW50OiBNeUNtcCwgbmFtZTogJ0hvbWVDbXAnfSxcbiAge3BhdGg6ICcvOnBhcmFtJywgY29tcG9uZW50OiBNeUNtcCwgbmFtZTogJ1BhcmFtQ21wJ31cbl0pXG5jbGFzcyBBcHBDbXAge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgbG9nU2VydmljZTogTG9nU2VydmljZSkge31cbn1cblxuXG5leHBvcnQgZnVuY3Rpb24gbWFpbigpIHtcbiAgcmV0dXJuIGJvb3RzdHJhcChBcHBDbXAsIFtcbiAgICBwcm92aWRlKEFQUF9CQVNFX0hSRUYsIHt1c2VWYWx1ZTogJy9hbmd1bGFyMi9leGFtcGxlcy9yb3V0ZXIvdHMvb25fZGVhY3RpdmF0ZSd9KSxcbiAgICBMb2dTZXJ2aWNlXG4gIF0pO1xufVxuIl19