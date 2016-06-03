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
var queryList_1 = require("../../shared/queryList");
var select2Component = (function () {
    function select2Component() {
        this.callback = new core_1.EventEmitter();
        this.queryList = queryList_1.queryList;
    }
    select2Component.prototype.ngOnChanges = function () {
    };
    select2Component.prototype.ngAfterContentInit = function () {
        var select2Selector = $(this.querySelector).find('.' + this.selector).find('select');
        this.setSelect2(select2Selector, function (val) {
            console.log(select2Selector);
            var obj = {
                val: val,
                selector: select2Selector
            };
            this.callback.emit(obj);
        }.bind(this));
    };
    select2Component.prototype.setSelect2 = function (field_select, callback) {
        console.log(field_select);
        field_select.select2({
            placeholder: "Select from the option"
        });
        field_select.on("change", function (e) {
            callback(field_select.val());
        }.bind(this));
        if (this.showInfoFlag) {
            field_select.on("select2:open", function (e) {
                setTimeout(function () {
                    var selector = $('li.select2-results__option');
                    selector.each(function (i, item) {
                        var val = $(item).html();
                        var info = this.getInformation(val);
                        $(item).popover(info);
                    }.bind(this));
                }.bind(this), 300);
            }.bind(this));
        }
    };
    select2Component.prototype.getInformation = function (query) {
        console.log(this.queryList);
        var query = this.queryList['information'][query];
        query['trigger'] = 'hover';
        return query;
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], select2Component.prototype, "querySelector", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], select2Component.prototype, "selector", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], select2Component.prototype, "showInfoFlag", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], select2Component.prototype, "callback", void 0);
    select2Component = __decorate([
        core_1.Component({
            selector: 'select2',
            templateUrl: './app/build/select2/select2.component.html',
            inputs: ["selectModal", "selectOptions", "querySelector", "selector", "showInfoFlag"]
        }), 
        __metadata('design:paramtypes', [])
    ], select2Component);
    return select2Component;
}());
exports.select2Component = select2Component;
//# sourceMappingURL=select2.component.js.map