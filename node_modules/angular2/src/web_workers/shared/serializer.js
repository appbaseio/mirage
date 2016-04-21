'use strict';"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var lang_1 = require("angular2/src/facade/lang");
var exceptions_1 = require('angular2/src/facade/exceptions');
var collection_1 = require("angular2/src/facade/collection");
var api_1 = require("angular2/src/core/render/api");
var di_1 = require("angular2/src/core/di");
var render_store_1 = require('angular2/src/web_workers/shared/render_store');
var view_1 = require('angular2/src/core/metadata/view');
var serialized_types_1 = require('./serialized_types');
// PRIMITIVE is any type that does not need to be serialized (string, number, boolean)
// We set it to String so that it is considered a Type.
exports.PRIMITIVE = String;
var Serializer = (function () {
    function Serializer(_renderStore) {
        this._renderStore = _renderStore;
    }
    Serializer.prototype.serialize = function (obj, type) {
        var _this = this;
        if (!lang_1.isPresent(obj)) {
            return null;
        }
        if (lang_1.isArray(obj)) {
            return obj.map(function (v) { return _this.serialize(v, type); });
        }
        if (type == exports.PRIMITIVE) {
            return obj;
        }
        if (type == RenderStoreObject) {
            return this._renderStore.serialize(obj);
        }
        else if (type === api_1.RenderComponentType) {
            return this._serializeRenderComponentType(obj);
        }
        else if (type === view_1.ViewEncapsulation) {
            return lang_1.serializeEnum(obj);
        }
        else if (type === serialized_types_1.LocationType) {
            return this._serializeLocation(obj);
        }
        else {
            throw new exceptions_1.BaseException("No serializer for " + type.toString());
        }
    };
    Serializer.prototype.deserialize = function (map, type, data) {
        var _this = this;
        if (!lang_1.isPresent(map)) {
            return null;
        }
        if (lang_1.isArray(map)) {
            var obj = [];
            map.forEach(function (val) { return obj.push(_this.deserialize(val, type, data)); });
            return obj;
        }
        if (type == exports.PRIMITIVE) {
            return map;
        }
        if (type == RenderStoreObject) {
            return this._renderStore.deserialize(map);
        }
        else if (type === api_1.RenderComponentType) {
            return this._deserializeRenderComponentType(map);
        }
        else if (type === view_1.ViewEncapsulation) {
            return view_1.VIEW_ENCAPSULATION_VALUES[map];
        }
        else if (type === serialized_types_1.LocationType) {
            return this._deserializeLocation(map);
        }
        else {
            throw new exceptions_1.BaseException("No deserializer for " + type.toString());
        }
    };
    Serializer.prototype.mapToObject = function (map, type) {
        var _this = this;
        var object = {};
        var serialize = lang_1.isPresent(type);
        map.forEach(function (value, key) {
            if (serialize) {
                object[key] = _this.serialize(value, type);
            }
            else {
                object[key] = value;
            }
        });
        return object;
    };
    /*
     * Transforms a Javascript object (StringMap) into a Map<string, V>
     * If the values need to be deserialized pass in their type
     * and they will be deserialized before being placed in the map
     */
    Serializer.prototype.objectToMap = function (obj, type, data) {
        var _this = this;
        if (lang_1.isPresent(type)) {
            var map = new collection_1.Map();
            collection_1.StringMapWrapper.forEach(obj, function (val, key) { map.set(key, _this.deserialize(val, type, data)); });
            return map;
        }
        else {
            return collection_1.MapWrapper.createFromStringMap(obj);
        }
    };
    Serializer.prototype._serializeLocation = function (loc) {
        return {
            'href': loc.href,
            'protocol': loc.protocol,
            'host': loc.host,
            'hostname': loc.hostname,
            'port': loc.port,
            'pathname': loc.pathname,
            'search': loc.search,
            'hash': loc.hash,
            'origin': loc.origin
        };
    };
    Serializer.prototype._deserializeLocation = function (loc) {
        return new serialized_types_1.LocationType(loc['href'], loc['protocol'], loc['host'], loc['hostname'], loc['port'], loc['pathname'], loc['search'], loc['hash'], loc['origin']);
    };
    Serializer.prototype._serializeRenderComponentType = function (obj) {
        return {
            'id': obj.id,
            'encapsulation': this.serialize(obj.encapsulation, view_1.ViewEncapsulation),
            'styles': this.serialize(obj.styles, exports.PRIMITIVE)
        };
    };
    Serializer.prototype._deserializeRenderComponentType = function (map) {
        return new api_1.RenderComponentType(map['id'], this.deserialize(map['encapsulation'], view_1.ViewEncapsulation), this.deserialize(map['styles'], exports.PRIMITIVE));
    };
    Serializer = __decorate([
        di_1.Injectable(), 
        __metadata('design:paramtypes', [render_store_1.RenderStore])
    ], Serializer);
    return Serializer;
}());
exports.Serializer = Serializer;
var RenderStoreObject = (function () {
    function RenderStoreObject() {
    }
    return RenderStoreObject;
}());
exports.RenderStoreObject = RenderStoreObject;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VyaWFsaXplci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRpZmZpbmdfcGx1Z2luX3dyYXBwZXItb3V0cHV0X3BhdGgtamFrWG5NbUwudG1wL2FuZ3VsYXIyL3NyYy93ZWJfd29ya2Vycy9zaGFyZWQvc2VyaWFsaXplci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEscUJBQXVFLDBCQUEwQixDQUFDLENBQUE7QUFDbEcsMkJBQThDLGdDQUFnQyxDQUFDLENBQUE7QUFFL0UsMkJBQWdELGdDQUFnQyxDQUFDLENBQUE7QUFDakYsb0JBQWtDLDhCQUE4QixDQUFDLENBQUE7QUFDakUsbUJBQXlCLHNCQUFzQixDQUFDLENBQUE7QUFDaEQsNkJBQTBCLDhDQUE4QyxDQUFDLENBQUE7QUFDekUscUJBQTJELGlDQUFpQyxDQUFDLENBQUE7QUFDN0YsaUNBQTJCLG9CQUFvQixDQUFDLENBQUE7QUFFaEQsc0ZBQXNGO0FBQ3RGLHVEQUF1RDtBQUMxQyxpQkFBUyxHQUFTLE1BQU0sQ0FBQztBQUd0QztJQUNFLG9CQUFvQixZQUF5QjtRQUF6QixpQkFBWSxHQUFaLFlBQVksQ0FBYTtJQUFHLENBQUM7SUFFakQsOEJBQVMsR0FBVCxVQUFVLEdBQVEsRUFBRSxJQUFTO1FBQTdCLGlCQXFCQztRQXBCQyxFQUFFLENBQUMsQ0FBQyxDQUFDLGdCQUFTLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3BCLE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFDZCxDQUFDO1FBQ0QsRUFBRSxDQUFDLENBQUMsY0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNqQixNQUFNLENBQVMsR0FBSSxDQUFDLEdBQUcsQ0FBQyxVQUFBLENBQUMsSUFBSSxPQUFBLEtBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxFQUF2QixDQUF1QixDQUFDLENBQUM7UUFDeEQsQ0FBQztRQUNELEVBQUUsQ0FBQyxDQUFDLElBQUksSUFBSSxpQkFBUyxDQUFDLENBQUMsQ0FBQztZQUN0QixNQUFNLENBQUMsR0FBRyxDQUFDO1FBQ2IsQ0FBQztRQUNELEVBQUUsQ0FBQyxDQUFDLElBQUksSUFBSSxpQkFBaUIsQ0FBQyxDQUFDLENBQUM7WUFDOUIsTUFBTSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzFDLENBQUM7UUFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxLQUFLLHlCQUFtQixDQUFDLENBQUMsQ0FBQztZQUN4QyxNQUFNLENBQUMsSUFBSSxDQUFDLDZCQUE2QixDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ2pELENBQUM7UUFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxLQUFLLHdCQUFpQixDQUFDLENBQUMsQ0FBQztZQUN0QyxNQUFNLENBQUMsb0JBQWEsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUM1QixDQUFDO1FBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksS0FBSywrQkFBWSxDQUFDLENBQUMsQ0FBQztZQUNqQyxNQUFNLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3RDLENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNOLE1BQU0sSUFBSSwwQkFBYSxDQUFDLG9CQUFvQixHQUFHLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO1FBQ2xFLENBQUM7SUFDSCxDQUFDO0lBRUQsZ0NBQVcsR0FBWCxVQUFZLEdBQVEsRUFBRSxJQUFTLEVBQUUsSUFBVTtRQUEzQyxpQkF3QkM7UUF2QkMsRUFBRSxDQUFDLENBQUMsQ0FBQyxnQkFBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNwQixNQUFNLENBQUMsSUFBSSxDQUFDO1FBQ2QsQ0FBQztRQUNELEVBQUUsQ0FBQyxDQUFDLGNBQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDakIsSUFBSSxHQUFHLEdBQVUsRUFBRSxDQUFDO1lBQ1osR0FBSSxDQUFDLE9BQU8sQ0FBQyxVQUFBLEdBQUcsSUFBSSxPQUFBLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQTNDLENBQTJDLENBQUMsQ0FBQztZQUN6RSxNQUFNLENBQUMsR0FBRyxDQUFDO1FBQ2IsQ0FBQztRQUNELEVBQUUsQ0FBQyxDQUFDLElBQUksSUFBSSxpQkFBUyxDQUFDLENBQUMsQ0FBQztZQUN0QixNQUFNLENBQUMsR0FBRyxDQUFDO1FBQ2IsQ0FBQztRQUVELEVBQUUsQ0FBQyxDQUFDLElBQUksSUFBSSxpQkFBaUIsQ0FBQyxDQUFDLENBQUM7WUFDOUIsTUFBTSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzVDLENBQUM7UUFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxLQUFLLHlCQUFtQixDQUFDLENBQUMsQ0FBQztZQUN4QyxNQUFNLENBQUMsSUFBSSxDQUFDLCtCQUErQixDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ25ELENBQUM7UUFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxLQUFLLHdCQUFpQixDQUFDLENBQUMsQ0FBQztZQUN0QyxNQUFNLENBQUMsZ0NBQXlCLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDeEMsQ0FBQztRQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLEtBQUssK0JBQVksQ0FBQyxDQUFDLENBQUM7WUFDakMsTUFBTSxDQUFDLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUN4QyxDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDTixNQUFNLElBQUksMEJBQWEsQ0FBQyxzQkFBc0IsR0FBRyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztRQUNwRSxDQUFDO0lBQ0gsQ0FBQztJQUVELGdDQUFXLEdBQVgsVUFBWSxHQUFxQixFQUFFLElBQVc7UUFBOUMsaUJBWUM7UUFYQyxJQUFJLE1BQU0sR0FBRyxFQUFFLENBQUM7UUFDaEIsSUFBSSxTQUFTLEdBQUcsZ0JBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUVoQyxHQUFHLENBQUMsT0FBTyxDQUFDLFVBQUMsS0FBSyxFQUFFLEdBQUc7WUFDckIsRUFBRSxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztnQkFDZCxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsS0FBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDNUMsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNOLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxLQUFLLENBQUM7WUFDdEIsQ0FBQztRQUNILENBQUMsQ0FBQyxDQUFDO1FBQ0gsTUFBTSxDQUFDLE1BQU0sQ0FBQztJQUNoQixDQUFDO0lBRUQ7Ozs7T0FJRztJQUNILGdDQUFXLEdBQVgsVUFBWSxHQUF5QixFQUFFLElBQVcsRUFBRSxJQUFVO1FBQTlELGlCQVNDO1FBUkMsRUFBRSxDQUFDLENBQUMsZ0JBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDcEIsSUFBSSxHQUFHLEdBQUcsSUFBSSxnQkFBRyxFQUFlLENBQUM7WUFDakMsNkJBQWdCLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFDSCxVQUFDLEdBQUcsRUFBRSxHQUFHLElBQU8sR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsS0FBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM3RixNQUFNLENBQUMsR0FBRyxDQUFDO1FBQ2IsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ04sTUFBTSxDQUFDLHVCQUFVLENBQUMsbUJBQW1CLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDN0MsQ0FBQztJQUNILENBQUM7SUFFTyx1Q0FBa0IsR0FBMUIsVUFBMkIsR0FBaUI7UUFDMUMsTUFBTSxDQUFDO1lBQ0wsTUFBTSxFQUFFLEdBQUcsQ0FBQyxJQUFJO1lBQ2hCLFVBQVUsRUFBRSxHQUFHLENBQUMsUUFBUTtZQUN4QixNQUFNLEVBQUUsR0FBRyxDQUFDLElBQUk7WUFDaEIsVUFBVSxFQUFFLEdBQUcsQ0FBQyxRQUFRO1lBQ3hCLE1BQU0sRUFBRSxHQUFHLENBQUMsSUFBSTtZQUNoQixVQUFVLEVBQUUsR0FBRyxDQUFDLFFBQVE7WUFDeEIsUUFBUSxFQUFFLEdBQUcsQ0FBQyxNQUFNO1lBQ3BCLE1BQU0sRUFBRSxHQUFHLENBQUMsSUFBSTtZQUNoQixRQUFRLEVBQUUsR0FBRyxDQUFDLE1BQU07U0FDckIsQ0FBQztJQUNKLENBQUM7SUFFTyx5Q0FBb0IsR0FBNUIsVUFBNkIsR0FBeUI7UUFDcEQsTUFBTSxDQUFDLElBQUksK0JBQVksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUUsR0FBRyxDQUFDLFVBQVUsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRSxHQUFHLENBQUMsVUFBVSxDQUFDLEVBQUUsR0FBRyxDQUFDLE1BQU0sQ0FBQyxFQUN2RSxHQUFHLENBQUMsVUFBVSxDQUFDLEVBQUUsR0FBRyxDQUFDLFFBQVEsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRSxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztJQUN0RixDQUFDO0lBRU8sa0RBQTZCLEdBQXJDLFVBQXNDLEdBQXdCO1FBQzVELE1BQU0sQ0FBQztZQUNMLElBQUksRUFBRSxHQUFHLENBQUMsRUFBRTtZQUNaLGVBQWUsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxhQUFhLEVBQUUsd0JBQWlCLENBQUM7WUFDckUsUUFBUSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxpQkFBUyxDQUFDO1NBQ2hELENBQUM7SUFDSixDQUFDO0lBRU8sb0RBQStCLEdBQXZDLFVBQXdDLEdBQXlCO1FBQy9ELE1BQU0sQ0FBQyxJQUFJLHlCQUFtQixDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFDVCxJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxlQUFlLENBQUMsRUFBRSx3QkFBaUIsQ0FBQyxFQUN6RCxJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsRUFBRSxpQkFBUyxDQUFDLENBQUMsQ0FBQztJQUM3RSxDQUFDO0lBbEhIO1FBQUMsZUFBVSxFQUFFOztrQkFBQTtJQW1IYixpQkFBQztBQUFELENBQUMsQUFsSEQsSUFrSEM7QUFsSFksa0JBQVUsYUFrSHRCLENBQUE7QUFHRDtJQUFBO0lBQWdDLENBQUM7SUFBRCx3QkFBQztBQUFELENBQUMsQUFBakMsSUFBaUM7QUFBcEIseUJBQWlCLG9CQUFHLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1R5cGUsIGlzQXJyYXksIGlzUHJlc2VudCwgc2VyaWFsaXplRW51bSwgZGVzZXJpYWxpemVFbnVtfSBmcm9tIFwiYW5ndWxhcjIvc3JjL2ZhY2FkZS9sYW5nXCI7XG5pbXBvcnQge0Jhc2VFeGNlcHRpb24sIFdyYXBwZWRFeGNlcHRpb259IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvZXhjZXB0aW9ucyc7XG5cbmltcG9ydCB7TWFwLCBTdHJpbmdNYXBXcmFwcGVyLCBNYXBXcmFwcGVyfSBmcm9tIFwiYW5ndWxhcjIvc3JjL2ZhY2FkZS9jb2xsZWN0aW9uXCI7XG5pbXBvcnQge1JlbmRlckNvbXBvbmVudFR5cGV9IGZyb20gXCJhbmd1bGFyMi9zcmMvY29yZS9yZW5kZXIvYXBpXCI7XG5pbXBvcnQge0luamVjdGFibGV9IGZyb20gXCJhbmd1bGFyMi9zcmMvY29yZS9kaVwiO1xuaW1wb3J0IHtSZW5kZXJTdG9yZX0gZnJvbSAnYW5ndWxhcjIvc3JjL3dlYl93b3JrZXJzL3NoYXJlZC9yZW5kZXJfc3RvcmUnO1xuaW1wb3J0IHtWaWV3RW5jYXBzdWxhdGlvbiwgVklFV19FTkNBUFNVTEFUSU9OX1ZBTFVFU30gZnJvbSAnYW5ndWxhcjIvc3JjL2NvcmUvbWV0YWRhdGEvdmlldyc7XG5pbXBvcnQge0xvY2F0aW9uVHlwZX0gZnJvbSAnLi9zZXJpYWxpemVkX3R5cGVzJztcblxuLy8gUFJJTUlUSVZFIGlzIGFueSB0eXBlIHRoYXQgZG9lcyBub3QgbmVlZCB0byBiZSBzZXJpYWxpemVkIChzdHJpbmcsIG51bWJlciwgYm9vbGVhbilcbi8vIFdlIHNldCBpdCB0byBTdHJpbmcgc28gdGhhdCBpdCBpcyBjb25zaWRlcmVkIGEgVHlwZS5cbmV4cG9ydCBjb25zdCBQUklNSVRJVkU6IFR5cGUgPSBTdHJpbmc7XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBTZXJpYWxpemVyIHtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBfcmVuZGVyU3RvcmU6IFJlbmRlclN0b3JlKSB7fVxuXG4gIHNlcmlhbGl6ZShvYmo6IGFueSwgdHlwZTogYW55KTogT2JqZWN0IHtcbiAgICBpZiAoIWlzUHJlc2VudChvYmopKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgaWYgKGlzQXJyYXkob2JqKSkge1xuICAgICAgcmV0dXJuICg8YW55W10+b2JqKS5tYXAodiA9PiB0aGlzLnNlcmlhbGl6ZSh2LCB0eXBlKSk7XG4gICAgfVxuICAgIGlmICh0eXBlID09IFBSSU1JVElWRSkge1xuICAgICAgcmV0dXJuIG9iajtcbiAgICB9XG4gICAgaWYgKHR5cGUgPT0gUmVuZGVyU3RvcmVPYmplY3QpIHtcbiAgICAgIHJldHVybiB0aGlzLl9yZW5kZXJTdG9yZS5zZXJpYWxpemUob2JqKTtcbiAgICB9IGVsc2UgaWYgKHR5cGUgPT09IFJlbmRlckNvbXBvbmVudFR5cGUpIHtcbiAgICAgIHJldHVybiB0aGlzLl9zZXJpYWxpemVSZW5kZXJDb21wb25lbnRUeXBlKG9iaik7XG4gICAgfSBlbHNlIGlmICh0eXBlID09PSBWaWV3RW5jYXBzdWxhdGlvbikge1xuICAgICAgcmV0dXJuIHNlcmlhbGl6ZUVudW0ob2JqKTtcbiAgICB9IGVsc2UgaWYgKHR5cGUgPT09IExvY2F0aW9uVHlwZSkge1xuICAgICAgcmV0dXJuIHRoaXMuX3NlcmlhbGl6ZUxvY2F0aW9uKG9iaik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBCYXNlRXhjZXB0aW9uKFwiTm8gc2VyaWFsaXplciBmb3IgXCIgKyB0eXBlLnRvU3RyaW5nKCkpO1xuICAgIH1cbiAgfVxuXG4gIGRlc2VyaWFsaXplKG1hcDogYW55LCB0eXBlOiBhbnksIGRhdGE/OiBhbnkpOiBhbnkge1xuICAgIGlmICghaXNQcmVzZW50KG1hcCkpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBpZiAoaXNBcnJheShtYXApKSB7XG4gICAgICB2YXIgb2JqOiBhbnlbXSA9IFtdO1xuICAgICAgKDxhbnlbXT5tYXApLmZvckVhY2godmFsID0+IG9iai5wdXNoKHRoaXMuZGVzZXJpYWxpemUodmFsLCB0eXBlLCBkYXRhKSkpO1xuICAgICAgcmV0dXJuIG9iajtcbiAgICB9XG4gICAgaWYgKHR5cGUgPT0gUFJJTUlUSVZFKSB7XG4gICAgICByZXR1cm4gbWFwO1xuICAgIH1cblxuICAgIGlmICh0eXBlID09IFJlbmRlclN0b3JlT2JqZWN0KSB7XG4gICAgICByZXR1cm4gdGhpcy5fcmVuZGVyU3RvcmUuZGVzZXJpYWxpemUobWFwKTtcbiAgICB9IGVsc2UgaWYgKHR5cGUgPT09IFJlbmRlckNvbXBvbmVudFR5cGUpIHtcbiAgICAgIHJldHVybiB0aGlzLl9kZXNlcmlhbGl6ZVJlbmRlckNvbXBvbmVudFR5cGUobWFwKTtcbiAgICB9IGVsc2UgaWYgKHR5cGUgPT09IFZpZXdFbmNhcHN1bGF0aW9uKSB7XG4gICAgICByZXR1cm4gVklFV19FTkNBUFNVTEFUSU9OX1ZBTFVFU1ttYXBdO1xuICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gTG9jYXRpb25UeXBlKSB7XG4gICAgICByZXR1cm4gdGhpcy5fZGVzZXJpYWxpemVMb2NhdGlvbihtYXApO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgQmFzZUV4Y2VwdGlvbihcIk5vIGRlc2VyaWFsaXplciBmb3IgXCIgKyB0eXBlLnRvU3RyaW5nKCkpO1xuICAgIH1cbiAgfVxuXG4gIG1hcFRvT2JqZWN0KG1hcDogTWFwPHN0cmluZywgYW55PiwgdHlwZT86IFR5cGUpOiBPYmplY3Qge1xuICAgIHZhciBvYmplY3QgPSB7fTtcbiAgICB2YXIgc2VyaWFsaXplID0gaXNQcmVzZW50KHR5cGUpO1xuXG4gICAgbWFwLmZvckVhY2goKHZhbHVlLCBrZXkpID0+IHtcbiAgICAgIGlmIChzZXJpYWxpemUpIHtcbiAgICAgICAgb2JqZWN0W2tleV0gPSB0aGlzLnNlcmlhbGl6ZSh2YWx1ZSwgdHlwZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBvYmplY3Rba2V5XSA9IHZhbHVlO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBvYmplY3Q7XG4gIH1cblxuICAvKlxuICAgKiBUcmFuc2Zvcm1zIGEgSmF2YXNjcmlwdCBvYmplY3QgKFN0cmluZ01hcCkgaW50byBhIE1hcDxzdHJpbmcsIFY+XG4gICAqIElmIHRoZSB2YWx1ZXMgbmVlZCB0byBiZSBkZXNlcmlhbGl6ZWQgcGFzcyBpbiB0aGVpciB0eXBlXG4gICAqIGFuZCB0aGV5IHdpbGwgYmUgZGVzZXJpYWxpemVkIGJlZm9yZSBiZWluZyBwbGFjZWQgaW4gdGhlIG1hcFxuICAgKi9cbiAgb2JqZWN0VG9NYXAob2JqOiB7W2tleTogc3RyaW5nXTogYW55fSwgdHlwZT86IFR5cGUsIGRhdGE/OiBhbnkpOiBNYXA8c3RyaW5nLCBhbnk+IHtcbiAgICBpZiAoaXNQcmVzZW50KHR5cGUpKSB7XG4gICAgICB2YXIgbWFwID0gbmV3IE1hcDxzdHJpbmcsIGFueT4oKTtcbiAgICAgIFN0cmluZ01hcFdyYXBwZXIuZm9yRWFjaChvYmosXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKHZhbCwga2V5KSA9PiB7IG1hcC5zZXQoa2V5LCB0aGlzLmRlc2VyaWFsaXplKHZhbCwgdHlwZSwgZGF0YSkpOyB9KTtcbiAgICAgIHJldHVybiBtYXA7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBNYXBXcmFwcGVyLmNyZWF0ZUZyb21TdHJpbmdNYXAob2JqKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF9zZXJpYWxpemVMb2NhdGlvbihsb2M6IExvY2F0aW9uVHlwZSk6IE9iamVjdCB7XG4gICAgcmV0dXJuIHtcbiAgICAgICdocmVmJzogbG9jLmhyZWYsXG4gICAgICAncHJvdG9jb2wnOiBsb2MucHJvdG9jb2wsXG4gICAgICAnaG9zdCc6IGxvYy5ob3N0LFxuICAgICAgJ2hvc3RuYW1lJzogbG9jLmhvc3RuYW1lLFxuICAgICAgJ3BvcnQnOiBsb2MucG9ydCxcbiAgICAgICdwYXRobmFtZSc6IGxvYy5wYXRobmFtZSxcbiAgICAgICdzZWFyY2gnOiBsb2Muc2VhcmNoLFxuICAgICAgJ2hhc2gnOiBsb2MuaGFzaCxcbiAgICAgICdvcmlnaW4nOiBsb2Mub3JpZ2luXG4gICAgfTtcbiAgfVxuXG4gIHByaXZhdGUgX2Rlc2VyaWFsaXplTG9jYXRpb24obG9jOiB7W2tleTogc3RyaW5nXTogYW55fSk6IExvY2F0aW9uVHlwZSB7XG4gICAgcmV0dXJuIG5ldyBMb2NhdGlvblR5cGUobG9jWydocmVmJ10sIGxvY1sncHJvdG9jb2wnXSwgbG9jWydob3N0J10sIGxvY1snaG9zdG5hbWUnXSwgbG9jWydwb3J0J10sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9jWydwYXRobmFtZSddLCBsb2NbJ3NlYXJjaCddLCBsb2NbJ2hhc2gnXSwgbG9jWydvcmlnaW4nXSk7XG4gIH1cblxuICBwcml2YXRlIF9zZXJpYWxpemVSZW5kZXJDb21wb25lbnRUeXBlKG9iajogUmVuZGVyQ29tcG9uZW50VHlwZSk6IE9iamVjdCB7XG4gICAgcmV0dXJuIHtcbiAgICAgICdpZCc6IG9iai5pZCxcbiAgICAgICdlbmNhcHN1bGF0aW9uJzogdGhpcy5zZXJpYWxpemUob2JqLmVuY2Fwc3VsYXRpb24sIFZpZXdFbmNhcHN1bGF0aW9uKSxcbiAgICAgICdzdHlsZXMnOiB0aGlzLnNlcmlhbGl6ZShvYmouc3R5bGVzLCBQUklNSVRJVkUpXG4gICAgfTtcbiAgfVxuXG4gIHByaXZhdGUgX2Rlc2VyaWFsaXplUmVuZGVyQ29tcG9uZW50VHlwZShtYXA6IHtba2V5OiBzdHJpbmddOiBhbnl9KTogUmVuZGVyQ29tcG9uZW50VHlwZSB7XG4gICAgcmV0dXJuIG5ldyBSZW5kZXJDb21wb25lbnRUeXBlKG1hcFsnaWQnXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kZXNlcmlhbGl6ZShtYXBbJ2VuY2Fwc3VsYXRpb24nXSwgVmlld0VuY2Fwc3VsYXRpb24pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRlc2VyaWFsaXplKG1hcFsnc3R5bGVzJ10sIFBSSU1JVElWRSkpO1xuICB9XG59XG5cblxuZXhwb3J0IGNsYXNzIFJlbmRlclN0b3JlT2JqZWN0IHt9XG4iXX0=