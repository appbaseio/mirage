System.register(["angular2/core", "./singlequery/singlequery.component", "../shared/queryList"], function(exports_1) {
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, singlequery_component_1, queryList_1;
    var BuildComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (singlequery_component_1_1) {
                singlequery_component_1 = singlequery_component_1_1;
            },
            function (queryList_1_1) {
                queryList_1 = queryList_1_1;
            }],
        execute: function() {
            BuildComponent = (function () {
                function BuildComponent() {
                    this.queryList = queryList_1.queryList;
                }
                BuildComponent.prototype.addQuery = function () {
                    var queryObj = {
                        field: '',
                        query: '',
                        input: ''
                    };
                    this.mapping.resultQuery.result.push(queryObj);
                };
                BuildComponent.prototype.buildQuery = function () {
                    var result = this.mapping.resultQuery.result;
                    var objChain = [];
                    result.forEach(function (val) {
                        var query = this.queryList.not_analyzed[val.query].apply;
                        var field = this.mapping.resultQuery.availableFields[val.field].name;
                        var input = val.input;
                        var sampleobj = {};
                        sampleobj[query] = {};
                        sampleobj[query][field] = input;
                        objChain.push(sampleobj);
                    }.bind(this));
                    var es_query = {
                        "query": {
                            "bool": {
                                "must": objChain
                            }
                        }
                    };
                    this.mapping.resultQuery.final = JSON.stringify(es_query, null, 4);
                };
                BuildComponent = __decorate([
                    core_1.Component({
                        selector: 'query-build',
                        templateUrl: './app/build/build.component.html',
                        styleUrls: ['./app/build/build.component.css'],
                        inputs: ['mapping', 'config'],
                        directives: [singlequery_component_1.SinglequeryComponent]
                    }), 
                    __metadata('design:paramtypes', [])
                ], BuildComponent);
                return BuildComponent;
            })();
            exports_1("BuildComponent", BuildComponent);
        }
    }
});
//# sourceMappingURL=build.component.js.map