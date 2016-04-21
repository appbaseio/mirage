System.register(["angular2/core", "../shared/pipes/prettyJson", "../shared/mapping.service", '../shared/httpwrap', "./types/types.component"], function(exports_1, context_1) {
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
    var core_1, prettyJson_1, mapping_service_1, httpwrap_1, types_component_1;
    var ResultComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (prettyJson_1_1) {
                prettyJson_1 = prettyJson_1_1;
            },
            function (mapping_service_1_1) {
                mapping_service_1 = mapping_service_1_1;
            },
            function (httpwrap_1_1) {
                httpwrap_1 = httpwrap_1_1;
            },
            function (types_component_1_1) {
                types_component_1 = types_component_1_1;
            }],
        execute: function() {
            ResultComponent = (function () {
                function ResultComponent(mappingService) {
                    this.mappingService = mappingService;
                }
                ResultComponent.prototype.ngOnInit = function () {
                    var self = this;
                    this.editorHookHelp.applyEditor();
                    var resultHeight = $(window).height() - 170;
                    $('.queryRight .codemirror').css({ height: resultHeight });
                };
                ResultComponent.prototype.ngOnChanges = function (changes) {
                    console.log('result change', changes);
                };
                ResultComponent.prototype.runQuery = function () {
                    var self = this;
                    var createUrl = this.config.url + '/' + this.config.appname + '/' + this.mapping.selectedTypes + '/_search';
                    var autho = "Basic " + btoa(self.config.username + ':' + self.config.password);
                    var getQuery = this.editorHookHelp.getValue();
                    var payload = JSON.parse(getQuery);
                    // console.log(this.mapping.resultQuery);
                    httpwrap_1.$http.post(createUrl, payload, autho).then(function (res) {
                        self.mapping.output = JSON.stringify(res, null, 2);
                        self.responseHookHelp.setValue(self.mapping.output);
                    });
                };
                ResultComponent = __decorate([
                    core_1.Component({
                        selector: 'query-result',
                        templateUrl: './app/result/result.component.html',
                        styleUrls: ['./app/result/result.component.css'],
                        inputs: ['mapping', 'config', 'detectChange', 'editorHookHelp', 'responseHookHelp'],
                        pipes: [prettyJson_1.prettyJson],
                        providers: [mapping_service_1.MappingService],
                        directives: [types_component_1.TypesComponent]
                    }), 
                    __metadata('design:paramtypes', [mapping_service_1.MappingService])
                ], ResultComponent);
                return ResultComponent;
            }());
            exports_1("ResultComponent", ResultComponent);
        }
    }
});
//# sourceMappingURL=result.component.js.map