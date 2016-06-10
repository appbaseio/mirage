System.register(["@angular/core"], function(exports_1, context_1) {
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
    var core_1;
    var GtQuery;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            }],
        execute: function() {
            GtQuery = (function () {
                function GtQuery() {
                    this.getQueryFormat = new core_1.EventEmitter();
                    this.queryName = '*';
                    this.fieldName = '*';
                    this.information = {
                        title: 'gt query',
                        content: 'gt query content',
                        link: 'https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-match-query.html'
                    };
                    this.inputs = {
                        gt: {
                            placeholder: 'Greater than',
                            value: ''
                        }
                    };
                    this.queryFormat = {};
                }
                GtQuery.prototype.ngOnInit = function () {
                    try {
                        if (this.appliedQuery['range'][this.fieldName]['gt']) {
                            this.inputs.gt.value = this.appliedQuery['range'][this.fieldName]['gt'];
                        }
                    }
                    catch (e) { }
                    this.getFormat();
                };
                GtQuery.prototype.ngOnChanges = function () {
                    if (this.selectedField != '') {
                        if (this.selectedField !== this.fieldName) {
                            this.fieldName = this.selectedField;
                        }
                    }
                    if (this.selectedQuery != '') {
                        if (this.selectedQuery !== this.queryName) {
                            this.queryName = this.selectedQuery;
                            if (this.selectedQuery == 'gt') {
                                this.getFormat();
                            }
                        }
                    }
                };
                // QUERY FORMAT
                /*
                    Query Format for this query is
                    range: {
                        @fieldName: {
                            gt: @from_value
                        }
                    }
                */
                GtQuery.prototype.getFormat = function () {
                    if (this.queryName === 'gt') {
                        this.queryFormat = this.setFormat();
                        this.getQueryFormat.emit(this.queryFormat);
                    }
                };
                GtQuery.prototype.setFormat = function () {
                    var queryFormat = {
                        'range': {}
                    };
                    queryFormat['range'][this.fieldName] = {
                        gt: this.inputs.gt.value,
                    };
                    return queryFormat;
                };
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], GtQuery.prototype, "queryList", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], GtQuery.prototype, "selectedField", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], GtQuery.prototype, "appliedQuery", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], GtQuery.prototype, "selectedQuery", void 0);
                __decorate([
                    core_1.Output(), 
                    __metadata('design:type', Object)
                ], GtQuery.prototype, "getQueryFormat", void 0);
                GtQuery = __decorate([
                    core_1.Component({
                        selector: 'gt-query',
                        template: "<div class=\"form-group form-element col-xs-12\">\n\t\t\t\t\t<input type=\"text\" class=\"form-control col-xs-12\"\n\t\t\t\t\t\t[(ngModel)]=\"inputs.gt.value\" \n\t\t\t\t\t \tplaceholder=\"{{inputs.gt.placeholder}}\"\n\t\t\t\t\t \t(keyup)=\"getFormat();\" />\n\t\t\t\t</div>",
                        inputs: ['appliedQuery', 'queryList', 'selectedQuery', 'selectedField', 'getQueryFormat']
                    }), 
                    __metadata('design:paramtypes', [])
                ], GtQuery);
                return GtQuery;
            }());
            exports_1("GtQuery", GtQuery);
        }
    }
});
//# sourceMappingURL=gt.query.js.map