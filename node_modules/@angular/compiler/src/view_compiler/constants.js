"use strict";
var core_1 = require('@angular/core');
var core_private_1 = require('../../core_private');
var lang_1 = require('../../src/facade/lang');
var compile_metadata_1 = require('../compile_metadata');
var o = require('../output/output_ast');
var identifiers_1 = require('../identifiers');
function _enumExpression(classIdentifier, value) {
    if (lang_1.isBlank(value))
        return o.NULL_EXPR;
    var name = lang_1.resolveEnumToken(classIdentifier.runtime, value);
    return o.importExpr(new compile_metadata_1.CompileIdentifierMetadata({
        name: classIdentifier.name + "." + name,
        moduleUrl: classIdentifier.moduleUrl,
        runtime: value
    }));
}
var ViewTypeEnum = (function () {
    function ViewTypeEnum() {
    }
    ViewTypeEnum.fromValue = function (value) {
        return _enumExpression(identifiers_1.Identifiers.ViewType, value);
    };
    ViewTypeEnum.HOST = ViewTypeEnum.fromValue(core_private_1.ViewType.HOST);
    ViewTypeEnum.COMPONENT = ViewTypeEnum.fromValue(core_private_1.ViewType.COMPONENT);
    ViewTypeEnum.EMBEDDED = ViewTypeEnum.fromValue(core_private_1.ViewType.EMBEDDED);
    return ViewTypeEnum;
}());
exports.ViewTypeEnum = ViewTypeEnum;
var ViewEncapsulationEnum = (function () {
    function ViewEncapsulationEnum() {
    }
    ViewEncapsulationEnum.fromValue = function (value) {
        return _enumExpression(identifiers_1.Identifiers.ViewEncapsulation, value);
    };
    ViewEncapsulationEnum.Emulated = ViewEncapsulationEnum.fromValue(core_1.ViewEncapsulation.Emulated);
    ViewEncapsulationEnum.Native = ViewEncapsulationEnum.fromValue(core_1.ViewEncapsulation.Native);
    ViewEncapsulationEnum.None = ViewEncapsulationEnum.fromValue(core_1.ViewEncapsulation.None);
    return ViewEncapsulationEnum;
}());
exports.ViewEncapsulationEnum = ViewEncapsulationEnum;
var ChangeDetectorStateEnum = (function () {
    function ChangeDetectorStateEnum() {
    }
    ChangeDetectorStateEnum.fromValue = function (value) {
        return _enumExpression(identifiers_1.Identifiers.ChangeDetectorState, value);
    };
    ChangeDetectorStateEnum.NeverChecked = ChangeDetectorStateEnum.fromValue(core_private_1.ChangeDetectorState.NeverChecked);
    ChangeDetectorStateEnum.CheckedBefore = ChangeDetectorStateEnum.fromValue(core_private_1.ChangeDetectorState.CheckedBefore);
    ChangeDetectorStateEnum.Errored = ChangeDetectorStateEnum.fromValue(core_private_1.ChangeDetectorState.Errored);
    return ChangeDetectorStateEnum;
}());
exports.ChangeDetectorStateEnum = ChangeDetectorStateEnum;
var ChangeDetectionStrategyEnum = (function () {
    function ChangeDetectionStrategyEnum() {
    }
    ChangeDetectionStrategyEnum.fromValue = function (value) {
        return _enumExpression(identifiers_1.Identifiers.ChangeDetectionStrategy, value);
    };
    ChangeDetectionStrategyEnum.CheckOnce = ChangeDetectionStrategyEnum.fromValue(core_1.ChangeDetectionStrategy.CheckOnce);
    ChangeDetectionStrategyEnum.Checked = ChangeDetectionStrategyEnum.fromValue(core_1.ChangeDetectionStrategy.Checked);
    ChangeDetectionStrategyEnum.CheckAlways = ChangeDetectionStrategyEnum.fromValue(core_1.ChangeDetectionStrategy.CheckAlways);
    ChangeDetectionStrategyEnum.Detached = ChangeDetectionStrategyEnum.fromValue(core_1.ChangeDetectionStrategy.Detached);
    ChangeDetectionStrategyEnum.OnPush = ChangeDetectionStrategyEnum.fromValue(core_1.ChangeDetectionStrategy.OnPush);
    ChangeDetectionStrategyEnum.Default = ChangeDetectionStrategyEnum.fromValue(core_1.ChangeDetectionStrategy.Default);
    return ChangeDetectionStrategyEnum;
}());
exports.ChangeDetectionStrategyEnum = ChangeDetectionStrategyEnum;
var ViewConstructorVars = (function () {
    function ViewConstructorVars() {
    }
    ViewConstructorVars.viewUtils = o.variable('viewUtils');
    ViewConstructorVars.parentInjector = o.variable('parentInjector');
    ViewConstructorVars.declarationEl = o.variable('declarationEl');
    return ViewConstructorVars;
}());
exports.ViewConstructorVars = ViewConstructorVars;
var ViewProperties = (function () {
    function ViewProperties() {
    }
    ViewProperties.renderer = o.THIS_EXPR.prop('renderer');
    ViewProperties.projectableNodes = o.THIS_EXPR.prop('projectableNodes');
    ViewProperties.viewUtils = o.THIS_EXPR.prop('viewUtils');
    return ViewProperties;
}());
exports.ViewProperties = ViewProperties;
var EventHandlerVars = (function () {
    function EventHandlerVars() {
    }
    EventHandlerVars.event = o.variable('$event');
    return EventHandlerVars;
}());
exports.EventHandlerVars = EventHandlerVars;
var InjectMethodVars = (function () {
    function InjectMethodVars() {
    }
    InjectMethodVars.token = o.variable('token');
    InjectMethodVars.requestNodeIndex = o.variable('requestNodeIndex');
    InjectMethodVars.notFoundResult = o.variable('notFoundResult');
    return InjectMethodVars;
}());
exports.InjectMethodVars = InjectMethodVars;
var DetectChangesVars = (function () {
    function DetectChangesVars() {
    }
    DetectChangesVars.throwOnChange = o.variable("throwOnChange");
    DetectChangesVars.changes = o.variable("changes");
    DetectChangesVars.changed = o.variable("changed");
    DetectChangesVars.valUnwrapper = o.variable("valUnwrapper");
    return DetectChangesVars;
}());
exports.DetectChangesVars = DetectChangesVars;
//# sourceMappingURL=constants.js.map