var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { provide, Component } from 'angular2/core';
import { bootstrap } from 'angular2/platform/browser';
import { RouteConfig, RouteParams, ROUTER_DIRECTIVES, APP_BASE_HREF } from 'angular2/router';
// #docregion routerCanDeactivate
let NoteCmp = class NoteCmp {
    constructor(params) {
        this.id = params.get('id');
    }
    routerCanDeactivate(next, prev) {
        return confirm('Are you sure you want to leave?');
    }
};
NoteCmp = __decorate([
    Component({
        selector: 'note-cmp',
        template: `
    <div>
      <h2>id: {{id}}</h2>
      <textarea cols="40" rows="10"></textarea>
    </div>`
    }), 
    __metadata('design:paramtypes', [RouteParams])
], NoteCmp);
// #enddocregion
let NoteIndexCmp = class NoteIndexCmp {
};
NoteIndexCmp = __decorate([
    Component({
        selector: 'note-index-cmp',
        template: `
    <h1>Your Notes</h1>
    <div>
      Edit <a [routerLink]="['/NoteCmp', {id: 1}]" id="note-1-link">Note 1</a> |
      Edit <a [routerLink]="['/NoteCmp', {id: 2}]" id="note-2-link">Note 2</a>
    </div>
  `,
        directives: [ROUTER_DIRECTIVES]
    }), 
    __metadata('design:paramtypes', [])
], NoteIndexCmp);
let AppCmp = class AppCmp {
};
AppCmp = __decorate([
    Component({
        selector: 'example-app',
        template: `
    <h1>My App</h1>
    <router-outlet></router-outlet>
  `,
        directives: [ROUTER_DIRECTIVES]
    }),
    RouteConfig([
        { path: '/note/:id', component: NoteCmp, name: 'NoteCmp' },
        { path: '/', component: NoteIndexCmp, name: 'NoteIndexCmp' }
    ]), 
    __metadata('design:paramtypes', [])
], AppCmp);
export function main() {
    return bootstrap(AppCmp, [provide(APP_BASE_HREF, { useValue: '/angular2/examples/router/ts/can_deactivate' })]);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FuX2RlYWN0aXZhdGVfZXhhbXBsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRpZmZpbmdfcGx1Z2luX3dyYXBwZXItb3V0cHV0X3BhdGgtb1hETzRwMnYudG1wL2FuZ3VsYXIyL2V4YW1wbGVzL3JvdXRlci90cy9jYW5fZGVhY3RpdmF0ZS9jYW5fZGVhY3RpdmF0ZV9leGFtcGxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztPQUFPLEVBQUMsT0FBTyxFQUFFLFNBQVMsRUFBQyxNQUFNLGVBQWU7T0FDekMsRUFBQyxTQUFTLEVBQUMsTUFBTSwyQkFBMkI7T0FDNUMsRUFFTCxXQUFXLEVBQ1gsV0FBVyxFQUVYLGlCQUFpQixFQUNqQixhQUFhLEVBQ2QsTUFBTSxpQkFBaUI7QUFFeEIsaUNBQWlDO0FBU2pDO0lBR0UsWUFBWSxNQUFtQjtRQUFJLElBQUksQ0FBQyxFQUFFLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUFDLENBQUM7SUFFaEUsbUJBQW1CLENBQUMsSUFBMEIsRUFBRSxJQUEwQjtRQUN4RSxNQUFNLENBQUMsT0FBTyxDQUFDLGlDQUFpQyxDQUFDLENBQUM7SUFDcEQsQ0FBQztBQUNILENBQUM7QUFoQkQ7SUFBQyxTQUFTLENBQUM7UUFDVCxRQUFRLEVBQUUsVUFBVTtRQUNwQixRQUFRLEVBQUU7Ozs7V0FJRDtLQUNWLENBQUM7O1dBQUE7QUFVRixnQkFBZ0I7QUFjaEI7QUFDQSxDQUFDO0FBWkQ7SUFBQyxTQUFTLENBQUM7UUFDVCxRQUFRLEVBQUUsZ0JBQWdCO1FBQzFCLFFBQVEsRUFBRTs7Ozs7O0dBTVQ7UUFDRCxVQUFVLEVBQUUsQ0FBQyxpQkFBaUIsQ0FBQztLQUNoQyxDQUFDOztnQkFBQTtBQWlCRjtBQUNBLENBQUM7QUFiRDtJQUFDLFNBQVMsQ0FBQztRQUNULFFBQVEsRUFBRSxhQUFhO1FBQ3ZCLFFBQVEsRUFBRTs7O0dBR1Q7UUFDRCxVQUFVLEVBQUUsQ0FBQyxpQkFBaUIsQ0FBQztLQUNoQyxDQUFDO0lBQ0QsV0FBVyxDQUFDO1FBQ1gsRUFBQyxJQUFJLEVBQUUsV0FBVyxFQUFFLFNBQVMsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBQztRQUN4RCxFQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsU0FBUyxFQUFFLFlBQVksRUFBRSxJQUFJLEVBQUUsY0FBYyxFQUFDO0tBQzNELENBQUM7O1VBQUE7QUFLRjtJQUNFLE1BQU0sQ0FBQyxTQUFTLENBQ1osTUFBTSxFQUFFLENBQUMsT0FBTyxDQUFDLGFBQWEsRUFBRSxFQUFDLFFBQVEsRUFBRSw2Q0FBNkMsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ25HLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge3Byb3ZpZGUsIENvbXBvbmVudH0gZnJvbSAnYW5ndWxhcjIvY29yZSc7XG5pbXBvcnQge2Jvb3RzdHJhcH0gZnJvbSAnYW5ndWxhcjIvcGxhdGZvcm0vYnJvd3Nlcic7XG5pbXBvcnQge1xuICBDYW5EZWFjdGl2YXRlLFxuICBSb3V0ZUNvbmZpZyxcbiAgUm91dGVQYXJhbXMsXG4gIENvbXBvbmVudEluc3RydWN0aW9uLFxuICBST1VURVJfRElSRUNUSVZFUyxcbiAgQVBQX0JBU0VfSFJFRlxufSBmcm9tICdhbmd1bGFyMi9yb3V0ZXInO1xuXG4vLyAjZG9jcmVnaW9uIHJvdXRlckNhbkRlYWN0aXZhdGVcbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ25vdGUtY21wJyxcbiAgdGVtcGxhdGU6IGBcbiAgICA8ZGl2PlxuICAgICAgPGgyPmlkOiB7e2lkfX08L2gyPlxuICAgICAgPHRleHRhcmVhIGNvbHM9XCI0MFwiIHJvd3M9XCIxMFwiPjwvdGV4dGFyZWE+XG4gICAgPC9kaXY+YFxufSlcbmNsYXNzIE5vdGVDbXAgaW1wbGVtZW50cyBDYW5EZWFjdGl2YXRlIHtcbiAgaWQ6IHN0cmluZztcblxuICBjb25zdHJ1Y3RvcihwYXJhbXM6IFJvdXRlUGFyYW1zKSB7IHRoaXMuaWQgPSBwYXJhbXMuZ2V0KCdpZCcpOyB9XG5cbiAgcm91dGVyQ2FuRGVhY3RpdmF0ZShuZXh0OiBDb21wb25lbnRJbnN0cnVjdGlvbiwgcHJldjogQ29tcG9uZW50SW5zdHJ1Y3Rpb24pIHtcbiAgICByZXR1cm4gY29uZmlybSgnQXJlIHlvdSBzdXJlIHlvdSB3YW50IHRvIGxlYXZlPycpO1xuICB9XG59XG4vLyAjZW5kZG9jcmVnaW9uXG5cblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbm90ZS1pbmRleC1jbXAnLFxuICB0ZW1wbGF0ZTogYFxuICAgIDxoMT5Zb3VyIE5vdGVzPC9oMT5cbiAgICA8ZGl2PlxuICAgICAgRWRpdCA8YSBbcm91dGVyTGlua109XCJbJy9Ob3RlQ21wJywge2lkOiAxfV1cIiBpZD1cIm5vdGUtMS1saW5rXCI+Tm90ZSAxPC9hPiB8XG4gICAgICBFZGl0IDxhIFtyb3V0ZXJMaW5rXT1cIlsnL05vdGVDbXAnLCB7aWQ6IDJ9XVwiIGlkPVwibm90ZS0yLWxpbmtcIj5Ob3RlIDI8L2E+XG4gICAgPC9kaXY+XG4gIGAsXG4gIGRpcmVjdGl2ZXM6IFtST1VURVJfRElSRUNUSVZFU11cbn0pXG5jbGFzcyBOb3RlSW5kZXhDbXAge1xufVxuXG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2V4YW1wbGUtYXBwJyxcbiAgdGVtcGxhdGU6IGBcbiAgICA8aDE+TXkgQXBwPC9oMT5cbiAgICA8cm91dGVyLW91dGxldD48L3JvdXRlci1vdXRsZXQ+XG4gIGAsXG4gIGRpcmVjdGl2ZXM6IFtST1VURVJfRElSRUNUSVZFU11cbn0pXG5AUm91dGVDb25maWcoW1xuICB7cGF0aDogJy9ub3RlLzppZCcsIGNvbXBvbmVudDogTm90ZUNtcCwgbmFtZTogJ05vdGVDbXAnfSxcbiAge3BhdGg6ICcvJywgY29tcG9uZW50OiBOb3RlSW5kZXhDbXAsIG5hbWU6ICdOb3RlSW5kZXhDbXAnfVxuXSlcbmNsYXNzIEFwcENtcCB7XG59XG5cblxuZXhwb3J0IGZ1bmN0aW9uIG1haW4oKSB7XG4gIHJldHVybiBib290c3RyYXAoXG4gICAgICBBcHBDbXAsIFtwcm92aWRlKEFQUF9CQVNFX0hSRUYsIHt1c2VWYWx1ZTogJy9hbmd1bGFyMi9leGFtcGxlcy9yb3V0ZXIvdHMvY2FuX2RlYWN0aXZhdGUnfSldKTtcbn1cbiJdfQ==