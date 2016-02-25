System.register(["angular2/core", "../shared/pipes/prettyJson", "../shared/mapping.service", '../shared/httpwrap'], function(exports_1) {
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, prettyJson_1, mapping_service_1, httpwrap_1;
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
            }],
        execute: function() {
            ResultComponent = (function () {
                function ResultComponent(mappingService) {
                    this.mappingService = mappingService;
                }
                ResultComponent.prototype.changeType = function () {
                    setTimeout(function () {
                        this.mapping.resultQuery.result = [];
                        var mapObj = this.mapping.mapping[this.config.appname].mappings[this.mapping.resultQuery.type].properties;
                        var availableFields = [];
                        for (var field in mapObj) {
                            var obj = {
                                name: field,
                                type: mapObj[field]['type'],
                                index: mapObj[field]['index']
                            };
                            switch (obj.type) {
                                case 'long':
                                case 'integer':
                                case 'short':
                                case 'byte':
                                case 'double':
                                case 'float':
                                    obj.type = 'numeric';
                                    break;
                            }
                            availableFields.push(obj);
                        }
                        this.mapping.resultQuery.availableFields = availableFields;
                    }.bind(this), 300);
                };
                ResultComponent.prototype.runQuery = function () {
                    var self = this;
                    var createUrl = this.config.url + '/' + this.config.appname + '/' + this.mapping.resultQuery.type + '/_search';
                    var autho = "Basic " + btoa(self.config.username + ':' + self.config.password);
                    var payload = JSON.parse(this.mapping.resultQuery.final);
                    httpwrap_1.$http.post(createUrl, payload, autho).then(function (res) {
                        self.mapping.output = JSON.stringify(res);
                    });
                };
                ResultComponent = __decorate([
                    core_1.Component({
                        selector: 'query-result',
                        templateUrl: './app/result/result.component.html',
                        styleUrls: ['./app/result/result.component.css'],
                        inputs: ['mapping', 'config'],
                        pipes: [prettyJson_1.prettyJson],
                        providers: [mapping_service_1.MappingService]
                    }), 
                    __metadata('design:paramtypes', [mapping_service_1.MappingService])
                ], ResultComponent);
                return ResultComponent;
            })();
            exports_1("ResultComponent", ResultComponent);
        }
    }
});
//# sourceMappingURL=result.component.js.map