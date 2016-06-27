System.register(["@angular/core", "../../shared/globalshare.service"], function(exports_1, context_1) {
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
    var core_1, globalshare_service_1;
    var select2Component;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (globalshare_service_1_1) {
                globalshare_service_1 = globalshare_service_1_1;
            }],
        execute: function() {
            select2Component = (function () {
                function select2Component(globalShare) {
                    this.globalShare = globalShare;
                    this.callback = new core_1.EventEmitter();
                }
                select2Component.prototype.ngOnChanges = function () { };
                select2Component.prototype.ngAfterContentInit = function () {
                    console.log(this.informationList);
                    setTimeout(function () {
                        var select2Selector = $(this.querySelector).find('.' + this.selector).find('select');
                        this.setSelect2(select2Selector, function (val) {
                            var obj = {
                                val: val,
                                selector: select2Selector
                            };
                            this.callback.emit(obj);
                        }.bind(this));
                    }.bind(this), 300);
                };
                select2Component.prototype.setSelect2 = function (field_select, callback) {
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
                                    $(item).on('shown.bs.popover', this.setLink);
                                    this.setLink();
                                }.bind(this));
                            }.bind(this), 300);
                        }.bind(this));
                    }
                };
                select2Component.prototype.getInformation = function (query) {
                    var query = this.informationList[query];
                    query['html'] = true;
                    query['trigger'] = 'click hover';
                    query['placement'] = 'right';
                    query['delay'] = { 'show': 50, 'hide': 400 };
                    return query;
                };
                select2Component.prototype.setLink = function () {
                    setTimeout(function () {
                        $('.popover a').unbind('click').on('click', function (event) {
                            event.preventDefault();
                            var link = $(this).attr('href');
                            window.open(link, '_blank');
                        });
                    }, 500);
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
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], select2Component.prototype, "informationList", void 0);
                select2Component = __decorate([
                    core_1.Component({
                        selector: 'select2',
                        templateUrl: './app/build/select2/select2.component.html',
                        inputs: ["selectModal", "selectOptions", "querySelector", "selector", "showInfoFlag", "informationList"],
                        providers: [globalshare_service_1.GlobalShare]
                    }), 
                    __metadata('design:paramtypes', [globalshare_service_1.GlobalShare])
                ], select2Component);
                return select2Component;
            }());
            exports_1("select2Component", select2Component);
        }
    }
});
//# sourceMappingURL=select2.component.js.map