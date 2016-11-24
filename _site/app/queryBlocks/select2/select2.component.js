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
var globalshare_service_1 = require("../../shared/globalshare.service");
var docService_1 = require("../../shared/docService");
var select2Component = (function () {
    function select2Component(globalShare, docService) {
        this.globalShare = globalShare;
        this.docService = docService;
        this.callback = new core_1.EventEmitter();
        this.setDocSample = new core_1.EventEmitter();
    }
    select2Component.prototype.ngOnChanges = function () { };
    select2Component.prototype.ngAfterContentInit = function () {
        setTimeout(function () {
            var select2Selector;
            if (this.querySelector && this.selector) {
                select2Selector = $(this.querySelector).find('.' + this.selector).find('select');
            }
            else {
                select2Selector = $('.' + this.selector).find('select');
            }
            if (typeof this.passWithCallback != 'undefined') {
                if (this.querySelector && this.selector) {
                    select2Selector = $(this.querySelector).find('.' + this.selector + '-' + this.passWithCallback).find('select');
                }
                else if (this.selector) {
                    select2Selector = $('.' + this.selector + '-' + this.passWithCallback).find('select');
                }
            }
            this.setSelect2(select2Selector, function (val) {
                var obj = {
                    val: val,
                    selector: select2Selector
                };
                if (typeof this.passWithCallback != 'undefined') {
                    obj.external = this.passWithCallback;
                }
                this.callback.emit(obj);
            }.bind(this));
        }.bind(this), 300);
    };
    select2Component.prototype.setSelect2 = function (field_select, callback) {
        var select2Option = {
            placeholder: "Select from the option"
        };
        if (this.searchOff) {
            select2Option.minimumResultsForSearch = -1;
        }
        field_select.select2(select2Option);
        field_select.on("change", function (e) {
            callback(field_select.val());
        }.bind(this));
        if (this.showInfoFlag) {
            field_select.on("select2:open", function () {
                this.setPopover.apply(this);
                $('.select2-search__field').keyup(function () {
                    this.setPopover.apply(this);
                }.bind(this));
                $('.select2-search__field').keydown(function () {
                    this.setPopover.apply(this);
                }.bind(this));
            }.bind(this));
        }
    };
    select2Component.prototype.setPopover = function () {
        setTimeout(function () {
            var selector = $('li.select2-results__option');
            selector.each(function (i, item) {
                var val = $(item).html();
                var info = this.getInformation(val);
                $(item).popover(info);
                $(item).on('shown.bs.popover', this.setLink.bind(this));
                this.setLink();
            }.bind(this));
        }.bind(this), 300);
    };
    select2Component.prototype.getInformation = function (query) {
        var query = this.informationList[query];
        query['html'] = true;
        query['trigger'] = 'click hover';
        query['placement'] = 'right';
        query['delay'] = { 'show': 50, 'hide': 50 };
        return query;
    };
    select2Component.prototype.setLink = function () {
        var self = this;
        setTimeout(function () {
            $('.popover a').unbind('click').on('click', function (event) {
                event.preventDefault();
                var link = event.target.href;
                self.setDocSample.emit(link);
                // self.docService.emitNavChangeEvent(link);
                // window.open(link, '_blank');
            });
        }.bind(this), 500);
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
        core_1.Input(), 
        __metadata('design:type', Object)
    ], select2Component.prototype, "passWithCallback", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], select2Component.prototype, "searchOff", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], select2Component.prototype, "informationList", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], select2Component.prototype, "callback", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], select2Component.prototype, "setDocSample", void 0);
    select2Component = __decorate([
        core_1.Component({
            selector: 'select2',
            templateUrl: './app/queryBlocks/select2/select2.component.html',
            inputs: ["selectModal", "selectOptions", "setDocSample"],
            providers: [globalshare_service_1.GlobalShare, docService_1.DocService]
        }), 
        __metadata('design:paramtypes', [globalshare_service_1.GlobalShare, docService_1.DocService])
    ], select2Component);
    return select2Component;
}());
exports.select2Component = select2Component;
//# sourceMappingURL=select2.component.js.map