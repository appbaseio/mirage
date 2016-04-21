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
import { RouteConfig, ROUTER_DIRECTIVES, APP_BASE_HREF, RouteParams } from 'angular2/router';
// #docregion reuseCmp
let MyCmp = class MyCmp {
    constructor(params) {
        this.name = params.get('name') || 'NOBODY';
    }
    routerCanReuse(next, prev) { return true; }
    routerOnReuse(next, prev) {
        this.name = next.params['name'];
    }
};
MyCmp = __decorate([
    Component({
        selector: 'my-cmp',
        template: `
    <div>hello {{name}}!</div>
    <div>message: <input id="message"></div>
  `
    }), 
    __metadata('design:paramtypes', [RouteParams])
], MyCmp);
// #enddocregion
let AppCmp = class AppCmp {
};
AppCmp = __decorate([
    Component({
        selector: 'example-app',
        template: `
    <h1>Say hi to...</h1>
    <a [routerLink]="['/HomeCmp', {name: 'naomi'}]" id="naomi-link">Naomi</a> |
    <a [routerLink]="['/HomeCmp', {name: 'brad'}]" id="brad-link">Brad</a>
    <router-outlet></router-outlet>
  `,
        directives: [ROUTER_DIRECTIVES]
    }),
    RouteConfig([
        { path: '/', component: MyCmp, name: 'HomeCmp' },
        { path: '/:name', component: MyCmp, name: 'HomeCmp' }
    ]), 
    __metadata('design:paramtypes', [])
], AppCmp);
export function main() {
    return bootstrap(AppCmp, [provide(APP_BASE_HREF, { useValue: '/angular2/examples/router/ts/reuse' })]);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmV1c2VfZXhhbXBsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRpZmZpbmdfcGx1Z2luX3dyYXBwZXItb3V0cHV0X3BhdGgtb1hETzRwMnYudG1wL2FuZ3VsYXIyL2V4YW1wbGVzL3JvdXRlci90cy9yZXVzZS9yZXVzZV9leGFtcGxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztPQUFPLEVBQUMsU0FBUyxFQUFFLE9BQU8sRUFBQyxNQUFNLGVBQWU7T0FDekMsRUFBQyxTQUFTLEVBQUMsTUFBTSwyQkFBMkI7T0FDNUMsRUFFTCxXQUFXLEVBRVgsaUJBQWlCLEVBQ2pCLGFBQWEsRUFFYixXQUFXLEVBRVosTUFBTSxpQkFBaUI7QUFHeEIsc0JBQXNCO0FBUXRCO0lBR0UsWUFBWSxNQUFtQjtRQUFJLElBQUksQ0FBQyxJQUFJLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsSUFBSSxRQUFRLENBQUM7SUFBQyxDQUFDO0lBRWhGLGNBQWMsQ0FBQyxJQUEwQixFQUFFLElBQTBCLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7SUFFdkYsYUFBYSxDQUFDLElBQTBCLEVBQUUsSUFBMEI7UUFDbEUsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ2xDLENBQUM7QUFDSCxDQUFDO0FBakJEO0lBQUMsU0FBUyxDQUFDO1FBQ1QsUUFBUSxFQUFFLFFBQVE7UUFDbEIsUUFBUSxFQUFFOzs7R0FHVDtLQUNGLENBQUM7O1NBQUE7QUFZRixnQkFBZ0I7QUFpQmhCO0FBQ0EsQ0FBQztBQWZEO0lBQUMsU0FBUyxDQUFDO1FBQ1QsUUFBUSxFQUFFLGFBQWE7UUFDdkIsUUFBUSxFQUFFOzs7OztHQUtUO1FBQ0QsVUFBVSxFQUFFLENBQUMsaUJBQWlCLENBQUM7S0FDaEMsQ0FBQztJQUNELFdBQVcsQ0FBQztRQUNYLEVBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUM7UUFDOUMsRUFBQyxJQUFJLEVBQUUsUUFBUSxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBQztLQUNwRCxDQUFDOztVQUFBO0FBS0Y7SUFDRSxNQUFNLENBQUMsU0FBUyxDQUFDLE1BQU0sRUFDTixDQUFDLE9BQU8sQ0FBQyxhQUFhLEVBQUUsRUFBQyxRQUFRLEVBQUUsb0NBQW9DLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUMvRixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtDb21wb25lbnQsIHByb3ZpZGV9IGZyb20gJ2FuZ3VsYXIyL2NvcmUnO1xuaW1wb3J0IHtib290c3RyYXB9IGZyb20gJ2FuZ3VsYXIyL3BsYXRmb3JtL2Jyb3dzZXInO1xuaW1wb3J0IHtcbiAgQ2FuQWN0aXZhdGUsXG4gIFJvdXRlQ29uZmlnLFxuICBDb21wb25lbnRJbnN0cnVjdGlvbixcbiAgUk9VVEVSX0RJUkVDVElWRVMsXG4gIEFQUF9CQVNFX0hSRUYsXG4gIENhblJldXNlLFxuICBSb3V0ZVBhcmFtcyxcbiAgT25SZXVzZVxufSBmcm9tICdhbmd1bGFyMi9yb3V0ZXInO1xuXG5cbi8vICNkb2NyZWdpb24gcmV1c2VDbXBcbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ215LWNtcCcsXG4gIHRlbXBsYXRlOiBgXG4gICAgPGRpdj5oZWxsbyB7e25hbWV9fSE8L2Rpdj5cbiAgICA8ZGl2Pm1lc3NhZ2U6IDxpbnB1dCBpZD1cIm1lc3NhZ2VcIj48L2Rpdj5cbiAgYFxufSlcbmNsYXNzIE15Q21wIGltcGxlbWVudHMgQ2FuUmV1c2UsXG4gICAgT25SZXVzZSB7XG4gIG5hbWU6IHN0cmluZztcbiAgY29uc3RydWN0b3IocGFyYW1zOiBSb3V0ZVBhcmFtcykgeyB0aGlzLm5hbWUgPSBwYXJhbXMuZ2V0KCduYW1lJykgfHwgJ05PQk9EWSc7IH1cblxuICByb3V0ZXJDYW5SZXVzZShuZXh0OiBDb21wb25lbnRJbnN0cnVjdGlvbiwgcHJldjogQ29tcG9uZW50SW5zdHJ1Y3Rpb24pIHsgcmV0dXJuIHRydWU7IH1cblxuICByb3V0ZXJPblJldXNlKG5leHQ6IENvbXBvbmVudEluc3RydWN0aW9uLCBwcmV2OiBDb21wb25lbnRJbnN0cnVjdGlvbikge1xuICAgIHRoaXMubmFtZSA9IG5leHQucGFyYW1zWyduYW1lJ107XG4gIH1cbn1cbi8vICNlbmRkb2NyZWdpb25cblxuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdleGFtcGxlLWFwcCcsXG4gIHRlbXBsYXRlOiBgXG4gICAgPGgxPlNheSBoaSB0by4uLjwvaDE+XG4gICAgPGEgW3JvdXRlckxpbmtdPVwiWycvSG9tZUNtcCcsIHtuYW1lOiAnbmFvbWknfV1cIiBpZD1cIm5hb21pLWxpbmtcIj5OYW9taTwvYT4gfFxuICAgIDxhIFtyb3V0ZXJMaW5rXT1cIlsnL0hvbWVDbXAnLCB7bmFtZTogJ2JyYWQnfV1cIiBpZD1cImJyYWQtbGlua1wiPkJyYWQ8L2E+XG4gICAgPHJvdXRlci1vdXRsZXQ+PC9yb3V0ZXItb3V0bGV0PlxuICBgLFxuICBkaXJlY3RpdmVzOiBbUk9VVEVSX0RJUkVDVElWRVNdXG59KVxuQFJvdXRlQ29uZmlnKFtcbiAge3BhdGg6ICcvJywgY29tcG9uZW50OiBNeUNtcCwgbmFtZTogJ0hvbWVDbXAnfSxcbiAge3BhdGg6ICcvOm5hbWUnLCBjb21wb25lbnQ6IE15Q21wLCBuYW1lOiAnSG9tZUNtcCd9XG5dKVxuY2xhc3MgQXBwQ21wIHtcbn1cblxuXG5leHBvcnQgZnVuY3Rpb24gbWFpbigpIHtcbiAgcmV0dXJuIGJvb3RzdHJhcChBcHBDbXAsXG4gICAgICAgICAgICAgICAgICAgW3Byb3ZpZGUoQVBQX0JBU0VfSFJFRiwge3VzZVZhbHVlOiAnL2FuZ3VsYXIyL2V4YW1wbGVzL3JvdXRlci90cy9yZXVzZSd9KV0pO1xufVxuIl19