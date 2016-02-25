System.register(["angular2/core", "../shared/mapping.service", "../shared/httpwrap"], function(exports_1) {
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, mapping_service_1, httpwrap_1;
    var HeaderComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (mapping_service_1_1) {
                mapping_service_1 = mapping_service_1_1;
            },
            function (httpwrap_1_1) {
                httpwrap_1 = httpwrap_1_1;
            }],
        execute: function() {
            HeaderComponent = (function () {
                function HeaderComponent(mappingService) {
                    this.mappingService = mappingService;
                    this.config = {
                        url: "https://uHg3p7p70:155898a9-e597-430e-8e2b-61fd1914c0d0@scalr.api.appbase.io",
                        appname: "moviedb",
                        username: "",
                        password: ""
                    };
                }
                HeaderComponent.prototype.connect = function () {
                    var APPNAME = this.config.appname;
                    var URL = this.config.url;
                    var urlsplit = URL.split(':');
                    var pwsplit = urlsplit[2].split('@');
                    this.config.username = urlsplit[1].replace('//', '');
                    this.config.password = pwsplit[0];
                    //this.connectConfig(this.config);
                    // var getConfig = this.mappingService.getMapping1(this.config);
                    // getConfig.subscribe(function(data){
                    // 	console.log(data);
                    // });
                    var self = this;
                    var createUrl = this.config.url + '/' + this.config.appname + '/_mapping';
                    var autho = "Basic " + btoa(self.config.username + ':' + self.config.password);
                    console.log(autho);
                    httpwrap_1.$http.get(createUrl, autho).then(function (json) {
                        //self.mapping = json;
                        self.connectConfig(self.config, json);
                    });
                    // $.ajax({
                    // 	type: 'GET',
                    // 	beforeSend: function(request) {
                    // 		request.setRequestHeader("Authorization", "Basic " + btoa(self.config.username + ':' + self.config.password));
                    // 	},
                    // 	url: createUrl,
                    // 	xhrFields: {
                    // 		withCredentials: true
                    // 	}
                    // }).done(function(data){
                    // 	self.connectConfig(self.config, data);
                    // });
                };
                HeaderComponent = __decorate([
                    core_1.Component({
                        selector: 'header-app',
                        templateUrl: './app/header/header.component.html',
                        styleUrls: ['./app/header/header.component.css'],
                        inputs: ['connectConfig', 'mapping'],
                        providers: [mapping_service_1.MappingService]
                    }), 
                    __metadata('design:paramtypes', [mapping_service_1.MappingService])
                ], HeaderComponent);
                return HeaderComponent;
            })();
            exports_1("HeaderComponent", HeaderComponent);
        }
    }
});
//# sourceMappingURL=header.component.js.map