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
var build_component_1 = require("./build/build.component");
var result_component_1 = require("./result/result.component");
var run_component_1 = require("./run/run.component");
var editorHook_1 = require("./shared/editorHook");
var appbase_service_1 = require("./shared/appbase.service");
var AppComponent = (function () {
    function AppComponent(appbaseService) {
        this.appbaseService = appbaseService;
        this.mapping = {
            types: [],
            mapping: null,
            resultQuery: {
                'type': '',
                'result': [],
                'final': "{}"
            },
            output: {},
            queryId: 1
        };
        this.detectChange = null;
        this.config = {
            url: "",
            appname: "",
            username: "",
            password: ""
        };
        this.editorHookHelp = new editorHook_1.editorHook({ editorId: 'editor' });
        this.responseHookHelp = new editorHook_1.editorHook({ editorId: 'responseBlock' });
    }
    AppComponent.prototype.ngOnInit = function () {
        this.getLocalConfig();
    };
    AppComponent.prototype.ngOnChanges = function (changes) {
        console.log(changes);
    };
    //Get config from localstorage 
    AppComponent.prototype.getLocalConfig = function () {
        var url = window.localStorage.getItem('url');
        var appname = window.localStorage.getItem('appname');
        if (url != null) {
            this.config.url = url;
            this.config.appname = appname;
            this.connect();
        }
    };
    //Set config from localstorage
    AppComponent.prototype.setLocalConfig = function (url, appname) {
        window.localStorage.setItem('url', url);
        window.localStorage.setItem('appname', appname);
    };
    // Connect with config url and appname
    // do mapping request  
    AppComponent.prototype.connect = function () {
        var APPNAME = this.config.appname;
        var URL = this.config.url;
        var urlsplit = URL.split(':');
        var pwsplit = urlsplit[2].split('@');
        this.config.username = urlsplit[1].replace('//', '');
        this.config.password = pwsplit[0];
        var self = this;
        this.appbaseService.setAppbase(this.config);
        this.appbaseService.get('/_mapping').then(function (res) {
            var data = res.json();
            self.mapping.mapping = data;
            self.mapping.types = self.seprateType(data);
            self.setLocalConfig(self.config.url, self.config.appname);
            self.detectChange = "done";
        }).catch(self.appbaseService.handleError);
    };
    // Seprate the types from mapping	
    AppComponent.prototype.seprateType = function (mappingObj) {
        var mapObj = mappingObj[this.config.appname].mappings;
        var types = [];
        for (var type in mapObj) {
            types.push(type);
        }
        return types;
    };
    AppComponent = __decorate([
        core_1.Component({
            selector: 'my-app',
            templateUrl: './app/app.component.html',
            directives: [build_component_1.BuildComponent, result_component_1.ResultComponent, run_component_1.RunComponent],
            providers: [appbase_service_1.AppbaseService]
        }), 
        __metadata('design:paramtypes', [appbase_service_1.AppbaseService])
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.component.js.map