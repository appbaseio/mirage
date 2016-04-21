System.register(["angular2/core", "./build/build.component", "./result/result.component", "./run/run.component", './shared/httpwrap', "./shared/editorHook"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, build_component_1, result_component_1, run_component_1, httpwrap_1, editorHook_1;
    var AppComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (build_component_1_1) {
                build_component_1 = build_component_1_1;
            },
            function (result_component_1_1) {
                result_component_1 = result_component_1_1;
            },
            function (run_component_1_1) {
                run_component_1 = run_component_1_1;
            },
            function (httpwrap_1_1) {
                httpwrap_1 = httpwrap_1_1;
            },
            function (editorHook_1_1) {
                editorHook_1 = editorHook_1_1;
            }],
        execute: function() {
            AppComponent = (function () {
                function AppComponent() {
                    this.mapping = {
                        types: [],
                        mapping: null,
                        resultQuery: { 'type': '',
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
                // For default config
                // public config: Config = {
                // 	url: "https://uHg3p7p70:155898a9-e597-430e-8e2b-61fd1914c0d0@scalr.api.appbase.io",
                // 	appname: "moviedb",
                // 	username: "",
                // 		password: "" 
                // };
                AppComponent.prototype.ngOnInit = function () {
                    this.getLocalConfig();
                };
                AppComponent.prototype.ngOnChanges = function (changes) {
                    console.log(changes);
                };
                AppComponent.prototype.changeMapResult = function () {
                    console.log('Hello there');
                    console.log(this);
                    this.mapResult = "Hello World1";
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
                    var createUrl = this.config.url + '/' + this.config.appname + '/_mapping';
                    var autho = "Basic " + btoa(self.config.username + ':' + self.config.password);
                    httpwrap_1.$http.get(createUrl, autho).then(function (res) {
                        self.mapping.mapping = res;
                        self.mapping.types = self.seprateType(res);
                        self.setLocalConfig(self.config.url, self.config.appname);
                        self.detectChange = "done";
                    });
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
                        directives: [build_component_1.BuildComponent, result_component_1.ResultComponent, run_component_1.RunComponent]
                    }), 
                    __metadata('design:paramtypes', [])
                ], AppComponent);
                return AppComponent;
            }());
            exports_1("AppComponent", AppComponent);
        }
    }
});
//# sourceMappingURL=app.component.js.map