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
var TypesComponent = (function () {
    function TypesComponent() {
        this.setProp = new core_1.EventEmitter();
        this.buildQuery = new core_1.EventEmitter();
    }
    TypesComponent.prototype.ngOnChanges = function (changes) {
        if (changes['detectChange'] && this.types.length) {
            var setType = $('#setType');
            if (setType.attr('class').indexOf('selec2') > -1) {
                setType.select2('destroy').html('');
            }
            setType.select2({
                placeholder: "Select types to apply query",
                tags: false,
                data: this.createTokenData(this.types)
            });
            setType.on("change", function (e) {
                this.changeType(setType.val());
            }.bind(this));
        }
    };
    TypesComponent.prototype.createTokenData = function (types) {
        var data = [];
        types.forEach(function (val) {
            var obj = {
                id: val,
                text: val
            };
            data.push(obj);
        });
        return data;
    };
    TypesComponent.prototype.changeType = function (val) {
        //this.mapping.resultQuery.result = [];
        var availableFields = [];
        var propInfo;
        if (val && val.length) {
            val.forEach(function (type) {
                var mapObj = this.mapping[this.config.appname].mappings[type].properties;
                for (var field in mapObj) {
                    var index = typeof mapObj[field]['index'] != 'undefined' ? mapObj[field]['index'] : null;
                    var obj = {
                        name: field,
                        type: mapObj[field]['type'],
                        index: index
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
            }.bind(this));
            this.setUrl(val);
            propInfo = {
                name: 'selectedTypes',
                value: val
            };
            this.setProp.emit(propInfo);
        }
        else {
            propInfo = {
                name: 'selectedTypes',
                value: []
            };
            this.setProp.emit(propInfo);
            this.setUrl([]);
        }
        propInfo = {
            name: 'availableFields',
            value: availableFields
        };
        this.setProp.emit(propInfo);
    };
    TypesComponent.prototype.setUrl = function (val) {
        var selectedTypes = val;
        var finalUrl = this.finalUrl.split('/');
        var lastUrl = '';
        finalUrl[3] = this.config.appname;
        if (finalUrl.length > 4) {
            finalUrl[4] = selectedTypes.join(',');
            finalUrl[5] = '_search';
            lastUrl = finalUrl.join('/');
        }
        else {
            var typeJoin = '/' + selectedTypes.join(',');
            if (!selectedTypes.length) {
                typeJoin = '';
            }
            lastUrl = this.finalUrl + typeJoin + '/_search';
        }
        var propInfo = {
            name: 'finalUrl',
            value: lastUrl
        };
        this.setProp.emit(propInfo);
        setTimeout(function () {
            this.buildQuery.emit(null);
        }.bind(this), 300);
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], TypesComponent.prototype, "mapping", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], TypesComponent.prototype, "config", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], TypesComponent.prototype, "types", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], TypesComponent.prototype, "selectedTypes", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], TypesComponent.prototype, "result", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], TypesComponent.prototype, "finalUrl", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], TypesComponent.prototype, "urlShare", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], TypesComponent.prototype, "setProp", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], TypesComponent.prototype, "buildQuery", void 0);
    TypesComponent = __decorate([
        core_1.Component({
            selector: 'types',
            templateUrl: './app/build/types/types.component.html',
            inputs: ['mapping', 'types', 'selectedTypes', 'result', 'config', 'detectChange', 'finalUrl', 'setProp', 'urlShare', 'buildQuery']
        }), 
        __metadata('design:paramtypes', [])
    ], TypesComponent);
    return TypesComponent;
}());
exports.TypesComponent = TypesComponent;
//# sourceMappingURL=types.component.js.map