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
var platform_browser_1 = require("@angular/platform-browser");
var ResultComponent = (function () {
    function ResultComponent(sanitizer) {
        this.sanitizer = sanitizer;
        this.urlAvailable = false;
        // public dejavuDomain: string = 'http://localhost:1358/';
        this.dejavuDomain = "https://dejavu.appbase.io/";
    }
    ResultComponent.prototype.ngOnInit = function () {
        this.responseHookHelp.applyEditor({ readOnly: true });
    };
    ResultComponent.prototype.ngOnChanges = function (changes) {
        if (changes && changes["result_random_token"]) {
            var prev = changes["result_random_token"].previousValue;
            var current = changes["result_random_token"].currentValue;
            if (current && prev !== current && this.editorHookHelp) {
                var getQuery = this.editorHookHelp.getValue();
                if (getQuery) {
                    console.log(this.selectedTypes);
                    getQuery = getQuery.trim();
                    getQuery = JSON.parse(getQuery);
                    var queryObj = {
                        query: getQuery,
                        type: this.selectedTypes
                    };
                    this.url = this.sanitizeUrl(this.dejavuDomain);
                    setTimeout(function () {
                        var url = this.dejavuDomain +
                            "?mode=edit&appswitcher=false&sidebar=false&oldBanner=false&appname=" +
                            this.urlShare.inputs.appname +
                            "&url=" +
                            this.urlShare.inputs.url;
                        url =
                            url +
                                "&hf=false&sidebar=false&subscribe=false&query=" +
                                JSON.stringify(queryObj);
                        this.url = this.sanitizeUrl(url);
                        console.log(this.url);
                    }.bind(this), 300);
                    this.urlAvailable = true;
                }
            }
        }
    };
    ResultComponent.prototype.sanitizeUrl = function (url) {
        return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], ResultComponent.prototype, "selectedTypes", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], ResultComponent.prototype, "responseMode", void 0);
    ResultComponent = __decorate([
        core_1.Component({
            selector: "query-result",
            templateUrl: "./app/result/result.component.html",
            inputs: [
                "mapping",
                "config",
                "editorHookHelp",
                "urlShare",
                "responseHookHelp",
                "result_time_taken",
                "result_random_token",
                "types",
                "result",
                "config",
                "responseHookHelp",
                "result_time_taken"
            ]
        }), 
        __metadata('design:paramtypes', [platform_browser_1.DomSanitizer])
    ], ResultComponent);
    return ResultComponent;
}());
exports.ResultComponent = ResultComponent;
//# sourceMappingURL=result.component.js.map