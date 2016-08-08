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
var storage_service_1 = require("../../shared/storage.service");
var SaveQueryComponent = (function () {
    function SaveQueryComponent(storageService) {
        this.storageService = storageService;
        this.query_info = {
            name: '',
            tag: ''
        };
    }
    SaveQueryComponent.prototype.openModal = function () {
        $('#saveQueryModal').modal('show');
    };
    SaveQueryComponent.prototype.save = function () {
        var queryData = {
            mapping: this.mapping,
            config: this.config,
            name: this.query_info.name,
            tag: this.query_info.tag
        };
        this.queryList.push(queryData);
        try {
            this.storageService.set('queryList', JSON.stringify(this.queryList));
        }
        catch (e) { }
        console.log(this.queryList);
    };
    SaveQueryComponent = __decorate([
        core_1.Component({
            selector: 'save-query',
            templateUrl: './app/features/save/save.query.component.html',
            inputs: ['config', 'mapping', 'queryList'],
            providers: [storage_service_1.StorageService]
        }), 
        __metadata('design:paramtypes', [storage_service_1.StorageService])
    ], SaveQueryComponent);
    return SaveQueryComponent;
}());
exports.SaveQueryComponent = SaveQueryComponent;
//# sourceMappingURL=save.query.component.js.map