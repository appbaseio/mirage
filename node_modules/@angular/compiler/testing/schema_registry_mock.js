"use strict";
var lang_1 = require('../src/facade/lang');
var core_private_1 = require('../core_private');
var MockSchemaRegistry = (function () {
    function MockSchemaRegistry(existingProperties, attrPropMapping) {
        this.existingProperties = existingProperties;
        this.attrPropMapping = attrPropMapping;
    }
    MockSchemaRegistry.prototype.hasProperty = function (tagName, property) {
        var result = this.existingProperties[property];
        return lang_1.isPresent(result) ? result : true;
    };
    MockSchemaRegistry.prototype.securityContext = function (tagName, property) {
        return core_private_1.SecurityContext.NONE;
    };
    MockSchemaRegistry.prototype.getMappedPropName = function (attrName) {
        var result = this.attrPropMapping[attrName];
        return lang_1.isPresent(result) ? result : attrName;
    };
    return MockSchemaRegistry;
}());
exports.MockSchemaRegistry = MockSchemaRegistry;
//# sourceMappingURL=schema_registry_mock.js.map