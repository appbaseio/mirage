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
var prettyJson_1 = require("../shared/pipes/prettyJson");
var appbase_service_1 = require("../shared/appbase.service");
var ResultComponent = (function () {
    function ResultComponent(appbaseService) {
        this.appbaseService = appbaseService;
        this.setProp = new core_1.EventEmitter();
        this.errorShow = new core_1.EventEmitter();
    }
    // Set codemirror instead of normal textarea
    ResultComponent.prototype.ngOnInit = function () {
        var self = this;
        this.editorHookHelp.applyEditor();
        $('#resultModal').modal({
            show: false,
            backdrop: 'static'
        });
        $('#resultModal').on('hide.bs.modal', function () {
            self.responseHookHelp.setValue('{}');
            var propInfo = {
                name: 'result_time_taken',
                value: null
            };
            self.setProp.emit(propInfo);
        });
    };
    // Validate using checkValidaQuery method
    // if validation success then apply search query and set result in textarea using editorhook
    // else show message
    ResultComponent.prototype.runQuery = function () {
        var self = this;
        this.appbaseService.setAppbase(this.config);
        var validate = this.checkValidQuery();
        if (validate.flag) {
            self.responseHookHelp.setValue('{"Loading": "please wait......"}');
            $('#resultModal').modal('show');
            this.appbaseService.postUrl(self.finalUrl, validate.payload).then(function (res) {
                self.result.isWatching = false;
                var propInfo = {
                    name: 'result_time_taken',
                    value: res.json().took
                };
                self.setProp.emit(propInfo);
                self.result.output = JSON.stringify(res.json(), null, 2);
                if ($('#resultModal').hasClass('in')) {
                    self.responseHookHelp.setValue(self.result.output);
                    self.responseHookHelp.focus();
                }
                else {
                    setTimeout(function () {
                        self.responseHookHelp.setValue(self.result.output);
                        self.responseHookHelp.focus();
                    }, 300);
                }
            }).catch(function (data) {
                $('#resultModal').modal('hide');
                self.result.isWatching = false;
                self.result.output = JSON.stringify(data, null, 4);
                var obj = {
                    title: 'Response Error',
                    message: self.result.output
                };
                self.errorShow.emit(obj);
            });
        }
        else {
            var obj = {
                title: 'Json validation',
                message: validate.message
            };
            this.errorShow.emit(obj);
        }
    };
    // get the textarea value using editor hook
    // Checking if all the internal queries have field and query,
    // Query should not contain '*' that we are setting on default
    // If internal query is perfect then check for valid json
    ResultComponent.prototype.checkValidQuery = function () {
        var getQuery = this.editorHookHelp.getValue();
        var returnObj = {
            flag: true,
            payload: null,
            message: null
        };
        this.result.resultQuery.result.forEach(function (result) {
            result.internal.forEach(function (query) {
                if (query.field === '' || query.query === '') {
                    returnObj.flag = false;
                }
            });
        });
        if (returnObj.flag) {
            try {
                returnObj.payload = JSON.parse(getQuery);
            }
            catch (e) {
                returnObj.message = "Json is not valid.";
            }
        }
        else {
            returnObj.message = "Please complete your query first.";
        }
        return returnObj;
    };
    ResultComponent.prototype.setPropIn = function () {
        var propInfo = {
            name: 'finalUrl',
            value: this.finalUrl
        };
        this.setProp.emit(propInfo);
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], ResultComponent.prototype, "finalUrl", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], ResultComponent.prototype, "mapping", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], ResultComponent.prototype, "types", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], ResultComponent.prototype, "selectedTypes", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], ResultComponent.prototype, "result", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], ResultComponent.prototype, "setProp", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], ResultComponent.prototype, "errorShow", void 0);
    ResultComponent = __decorate([
        core_1.Component({
            selector: 'query-result',
            templateUrl: './app/result/result.component.html',
            inputs: ['mapping', 'types', 'selectedTypes', 'result', 'config', 'editorHookHelp', 'responseHookHelp', 'finalUrl', 'setProp', 'errorShow'],
            pipes: [prettyJson_1.prettyJson],
            providers: [appbase_service_1.AppbaseService]
        }), 
        __metadata('design:paramtypes', [appbase_service_1.AppbaseService])
    ], ResultComponent);
    return ResultComponent;
}());
exports.ResultComponent = ResultComponent;
//# sourceMappingURL=result.component.js.map