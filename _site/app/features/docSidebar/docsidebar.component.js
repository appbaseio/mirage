"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("@angular/core");
var platform_browser_1 = require('@angular/platform-browser');
var DocSidebarComponent = (function () {
    function DocSidebarComponent(sanitizer) {
        this.sanitizer = sanitizer;
        this.setDocSample = new core_1.EventEmitter();
        this.open = false;
    }
    DocSidebarComponent.prototype.ngOnInit = function () { };
    DocSidebarComponent.prototype.ngOnChanges = function (changes) {
        if (changes.docLink.currentValue) {
            this.url = this.sanitizer.bypassSecurityTrustResourceUrl(changes.docLink.currentValue);
            this.open = true;
        }
    };
    DocSidebarComponent.prototype.close = function () {
        this.setDocSample.emit(null);
        this.open = false;
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], DocSidebarComponent.prototype, "docLink", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], DocSidebarComponent.prototype, "setDocSample", void 0);
    DocSidebarComponent = __decorate([
        core_1.Component({
            selector: 'doc-sidebar',
            templateUrl: './app/features/docSidebar/docsidebar.component.html',
            inputs: ['docLink', 'setDocSample']
        }), 
        __metadata('design:paramtypes', [platform_browser_1.DomSanitizationService])
    ], DocSidebarComponent);
    return DocSidebarComponent;
}());
exports.DocSidebarComponent = DocSidebarComponent;
//# sourceMappingURL=docsidebar.component.js.map