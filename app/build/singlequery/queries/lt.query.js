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
var LtQuery = (function () {
    function LtQuery() {
        this.getQueryFormat = new core_1.EventEmitter();
        this.inputs = {
            lt: {
                placeholder: 'Less than',
                value: ''
            }
        };
        this.queryFormat = {};
    }
    LtQuery.prototype.ngOnInit = function () {
        this.setFormat();
    };
    // QUERY FORMAT
    /*
        Query Format for this query is
        range: {
            @fieldName: {
                lt: @from_value
            }
        }
    */
    LtQuery.prototype.setFormat = function () {
        this.queryFormat['range'] = {};
        this.queryFormat['range'][this.fieldName] = {
            lt: this.inputs.lt.value,
        };
        this.getQueryFormat.emit(this.queryFormat);
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], LtQuery.prototype, "queryName", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], LtQuery.prototype, "fieldName", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], LtQuery.prototype, "getQueryFormat", void 0);
    LtQuery = __decorate([
        core_1.Component({
            selector: 'lt-query',
            template: "<div class=\"form-group form-element col-xs-12\">\n\t\t\t\t\t<input type=\"text\" class=\"form-control col-xs-12\"\n\t\t\t\t\t\t[(ngModel)]=\"inputs.lt.value\" \n\t\t\t\t\t \tplaceholder=\"{{inputs.lt.placeholder}}\"\n\t\t\t\t\t \t(keyup)=\"setFormat();\" />\n\t\t\t\t</div>",
            inputs: ['queryName', 'fieldName', 'getQueryFormat']
        }), 
        __metadata('design:paramtypes', [])
    ], LtQuery);
    return LtQuery;
}());
exports.LtQuery = LtQuery;
//# sourceMappingURL=lt.query.js.map