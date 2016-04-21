'use strict';"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var lang_1 = require('angular2/src/facade/lang');
var exceptions_1 = require('angular2/src/facade/exceptions');
var collection_1 = require('angular2/src/facade/collection');
var abstract_change_detector_1 = require('./abstract_change_detector');
var change_detection_util_1 = require('./change_detection_util');
var constants_1 = require('./constants');
var proto_record_1 = require('./proto_record');
var reflection_1 = require('angular2/src/core/reflection/reflection');
var async_1 = require('angular2/src/facade/async');
var DynamicChangeDetector = (function (_super) {
    __extends(DynamicChangeDetector, _super);
    function DynamicChangeDetector(id, numberOfPropertyProtoRecords, propertyBindingTargets, directiveIndices, strategy, _records, _eventBindings, _directiveRecords, _genConfig) {
        _super.call(this, id, numberOfPropertyProtoRecords, propertyBindingTargets, directiveIndices, strategy);
        this._records = _records;
        this._eventBindings = _eventBindings;
        this._directiveRecords = _directiveRecords;
        this._genConfig = _genConfig;
        var len = _records.length + 1;
        this.values = collection_1.ListWrapper.createFixedSize(len);
        this.localPipes = collection_1.ListWrapper.createFixedSize(len);
        this.prevContexts = collection_1.ListWrapper.createFixedSize(len);
        this.changes = collection_1.ListWrapper.createFixedSize(len);
        this.dehydrateDirectives(false);
    }
    DynamicChangeDetector.prototype.handleEventInternal = function (eventName, elIndex, locals) {
        var _this = this;
        var preventDefault = false;
        this._matchingEventBindings(eventName, elIndex)
            .forEach(function (rec) {
            var res = _this._processEventBinding(rec, locals);
            if (res === false) {
                preventDefault = true;
            }
        });
        return preventDefault;
    };
    /** @internal */
    DynamicChangeDetector.prototype._processEventBinding = function (eb, locals) {
        var values = collection_1.ListWrapper.createFixedSize(eb.records.length);
        values[0] = this.values[0];
        for (var protoIdx = 0; protoIdx < eb.records.length; ++protoIdx) {
            var proto = eb.records[protoIdx];
            if (proto.isSkipRecord()) {
                protoIdx += this._computeSkipLength(protoIdx, proto, values);
            }
            else {
                if (proto.lastInBinding) {
                    this._markPathAsCheckOnce(proto);
                }
                var res = this._calculateCurrValue(proto, values, locals);
                if (proto.lastInBinding) {
                    return res;
                }
                else {
                    this._writeSelf(proto, res, values);
                }
            }
        }
        throw new exceptions_1.BaseException("Cannot be reached");
    };
    DynamicChangeDetector.prototype._computeSkipLength = function (protoIndex, proto, values) {
        if (proto.mode === proto_record_1.RecordType.SkipRecords) {
            return proto.fixedArgs[0] - protoIndex - 1;
        }
        if (proto.mode === proto_record_1.RecordType.SkipRecordsIf) {
            var condition = this._readContext(proto, values);
            return condition ? proto.fixedArgs[0] - protoIndex - 1 : 0;
        }
        if (proto.mode === proto_record_1.RecordType.SkipRecordsIfNot) {
            var condition = this._readContext(proto, values);
            return condition ? 0 : proto.fixedArgs[0] - protoIndex - 1;
        }
        throw new exceptions_1.BaseException("Cannot be reached");
    };
    /** @internal */
    DynamicChangeDetector.prototype._markPathAsCheckOnce = function (proto) {
        if (!proto.bindingRecord.isDefaultChangeDetection()) {
            var dir = proto.bindingRecord.directiveRecord;
            this._getDetectorFor(dir.directiveIndex).markPathToRootAsCheckOnce();
        }
    };
    /** @internal */
    DynamicChangeDetector.prototype._matchingEventBindings = function (eventName, elIndex) {
        return this._eventBindings.filter(function (eb) { return eb.eventName == eventName && eb.elIndex === elIndex; });
    };
    DynamicChangeDetector.prototype.hydrateDirectives = function (dispatcher) {
        var _this = this;
        this.values[0] = this.context;
        this.dispatcher = dispatcher;
        this.outputSubscriptions = [];
        for (var i = 0; i < this._directiveRecords.length; ++i) {
            var r = this._directiveRecords[i];
            if (lang_1.isPresent(r.outputs)) {
                r.outputs.forEach(function (output) {
                    var eventHandler = _this._createEventHandler(r.directiveIndex.elementIndex, output[1]);
                    var directive = _this._getDirectiveFor(r.directiveIndex);
                    var getter = reflection_1.reflector.getter(output[0]);
                    _this.outputSubscriptions.push(async_1.ObservableWrapper.subscribe(getter(directive), eventHandler));
                });
            }
        }
    };
    DynamicChangeDetector.prototype._createEventHandler = function (boundElementIndex, eventName) {
        var _this = this;
        return function (event) { return _this.handleEvent(eventName, boundElementIndex, event); };
    };
    DynamicChangeDetector.prototype.dehydrateDirectives = function (destroyPipes) {
        if (destroyPipes) {
            this._destroyPipes();
            this._destroyDirectives();
        }
        this.values[0] = null;
        collection_1.ListWrapper.fill(this.values, change_detection_util_1.ChangeDetectionUtil.uninitialized, 1);
        collection_1.ListWrapper.fill(this.changes, false);
        collection_1.ListWrapper.fill(this.localPipes, null);
        collection_1.ListWrapper.fill(this.prevContexts, change_detection_util_1.ChangeDetectionUtil.uninitialized);
    };
    /** @internal */
    DynamicChangeDetector.prototype._destroyPipes = function () {
        for (var i = 0; i < this.localPipes.length; ++i) {
            if (lang_1.isPresent(this.localPipes[i])) {
                change_detection_util_1.ChangeDetectionUtil.callPipeOnDestroy(this.localPipes[i]);
            }
        }
    };
    /** @internal */
    DynamicChangeDetector.prototype._destroyDirectives = function () {
        for (var i = 0; i < this._directiveRecords.length; ++i) {
            var record = this._directiveRecords[i];
            if (record.callOnDestroy) {
                this._getDirectiveFor(record.directiveIndex).ngOnDestroy();
            }
        }
    };
    DynamicChangeDetector.prototype.checkNoChanges = function () { this.runDetectChanges(true); };
    DynamicChangeDetector.prototype.detectChangesInRecordsInternal = function (throwOnChange) {
        var protos = this._records;
        var changes = null;
        var isChanged = false;
        for (var protoIdx = 0; protoIdx < protos.length; ++protoIdx) {
            var proto = protos[protoIdx];
            var bindingRecord = proto.bindingRecord;
            var directiveRecord = bindingRecord.directiveRecord;
            if (this._firstInBinding(proto)) {
                this.propertyBindingIndex = proto.propertyBindingIndex;
            }
            if (proto.isLifeCycleRecord()) {
                if (proto.name === "DoCheck" && !throwOnChange) {
                    this._getDirectiveFor(directiveRecord.directiveIndex).ngDoCheck();
                }
                else if (proto.name === "OnInit" && !throwOnChange &&
                    this.state == constants_1.ChangeDetectorState.NeverChecked) {
                    this._getDirectiveFor(directiveRecord.directiveIndex).ngOnInit();
                }
                else if (proto.name === "OnChanges" && lang_1.isPresent(changes) && !throwOnChange) {
                    this._getDirectiveFor(directiveRecord.directiveIndex).ngOnChanges(changes);
                }
            }
            else if (proto.isSkipRecord()) {
                protoIdx += this._computeSkipLength(protoIdx, proto, this.values);
            }
            else {
                var change = this._check(proto, throwOnChange, this.values, this.locals);
                if (lang_1.isPresent(change)) {
                    this._updateDirectiveOrElement(change, bindingRecord);
                    isChanged = true;
                    changes = this._addChange(bindingRecord, change, changes);
                }
            }
            if (proto.lastInDirective) {
                changes = null;
                if (isChanged && !bindingRecord.isDefaultChangeDetection()) {
                    this._getDetectorFor(directiveRecord.directiveIndex).markAsCheckOnce();
                }
                isChanged = false;
            }
        }
    };
    /** @internal */
    DynamicChangeDetector.prototype._firstInBinding = function (r) {
        var prev = change_detection_util_1.ChangeDetectionUtil.protoByIndex(this._records, r.selfIndex - 1);
        return lang_1.isBlank(prev) || prev.bindingRecord !== r.bindingRecord;
    };
    DynamicChangeDetector.prototype.afterContentLifecycleCallbacksInternal = function () {
        var dirs = this._directiveRecords;
        for (var i = dirs.length - 1; i >= 0; --i) {
            var dir = dirs[i];
            if (dir.callAfterContentInit && this.state == constants_1.ChangeDetectorState.NeverChecked) {
                this._getDirectiveFor(dir.directiveIndex).ngAfterContentInit();
            }
            if (dir.callAfterContentChecked) {
                this._getDirectiveFor(dir.directiveIndex).ngAfterContentChecked();
            }
        }
    };
    DynamicChangeDetector.prototype.afterViewLifecycleCallbacksInternal = function () {
        var dirs = this._directiveRecords;
        for (var i = dirs.length - 1; i >= 0; --i) {
            var dir = dirs[i];
            if (dir.callAfterViewInit && this.state == constants_1.ChangeDetectorState.NeverChecked) {
                this._getDirectiveFor(dir.directiveIndex).ngAfterViewInit();
            }
            if (dir.callAfterViewChecked) {
                this._getDirectiveFor(dir.directiveIndex).ngAfterViewChecked();
            }
        }
    };
    /** @internal */
    DynamicChangeDetector.prototype._updateDirectiveOrElement = function (change, bindingRecord) {
        if (lang_1.isBlank(bindingRecord.directiveRecord)) {
            _super.prototype.notifyDispatcher.call(this, change.currentValue);
        }
        else {
            var directiveIndex = bindingRecord.directiveRecord.directiveIndex;
            bindingRecord.setter(this._getDirectiveFor(directiveIndex), change.currentValue);
        }
        if (this._genConfig.logBindingUpdate) {
            _super.prototype.logBindingUpdate.call(this, change.currentValue);
        }
    };
    /** @internal */
    DynamicChangeDetector.prototype._addChange = function (bindingRecord, change, changes) {
        if (bindingRecord.callOnChanges()) {
            return _super.prototype.addChange.call(this, changes, change.previousValue, change.currentValue);
        }
        else {
            return changes;
        }
    };
    /** @internal */
    DynamicChangeDetector.prototype._getDirectiveFor = function (directiveIndex) {
        return this.dispatcher.getDirectiveFor(directiveIndex);
    };
    /** @internal */
    DynamicChangeDetector.prototype._getDetectorFor = function (directiveIndex) {
        return this.dispatcher.getDetectorFor(directiveIndex);
    };
    /** @internal */
    DynamicChangeDetector.prototype._check = function (proto, throwOnChange, values, locals) {
        if (proto.isPipeRecord()) {
            return this._pipeCheck(proto, throwOnChange, values);
        }
        else {
            return this._referenceCheck(proto, throwOnChange, values, locals);
        }
    };
    /** @internal */
    DynamicChangeDetector.prototype._referenceCheck = function (proto, throwOnChange, values, locals) {
        if (this._pureFuncAndArgsDidNotChange(proto)) {
            this._setChanged(proto, false);
            return null;
        }
        var currValue = this._calculateCurrValue(proto, values, locals);
        if (proto.shouldBeChecked()) {
            var prevValue = this._readSelf(proto, values);
            var detectedChange = throwOnChange ?
                !change_detection_util_1.ChangeDetectionUtil.devModeEqual(prevValue, currValue) :
                change_detection_util_1.ChangeDetectionUtil.looseNotIdentical(prevValue, currValue);
            if (detectedChange) {
                if (proto.lastInBinding) {
                    var change = change_detection_util_1.ChangeDetectionUtil.simpleChange(prevValue, currValue);
                    if (throwOnChange)
                        this.throwOnChangeError(prevValue, currValue);
                    this._writeSelf(proto, currValue, values);
                    this._setChanged(proto, true);
                    return change;
                }
                else {
                    this._writeSelf(proto, currValue, values);
                    this._setChanged(proto, true);
                    return null;
                }
            }
            else {
                this._setChanged(proto, false);
                return null;
            }
        }
        else {
            this._writeSelf(proto, currValue, values);
            this._setChanged(proto, true);
            return null;
        }
    };
    DynamicChangeDetector.prototype._calculateCurrValue = function (proto, values, locals) {
        switch (proto.mode) {
            case proto_record_1.RecordType.Self:
                return this._readContext(proto, values);
            case proto_record_1.RecordType.Const:
                return proto.funcOrValue;
            case proto_record_1.RecordType.PropertyRead:
                var context = this._readContext(proto, values);
                return proto.funcOrValue(context);
            case proto_record_1.RecordType.SafeProperty:
                var context = this._readContext(proto, values);
                return lang_1.isBlank(context) ? null : proto.funcOrValue(context);
            case proto_record_1.RecordType.PropertyWrite:
                var context = this._readContext(proto, values);
                var value = this._readArgs(proto, values)[0];
                proto.funcOrValue(context, value);
                return value;
            case proto_record_1.RecordType.KeyedWrite:
                var context = this._readContext(proto, values);
                var key = this._readArgs(proto, values)[0];
                var value = this._readArgs(proto, values)[1];
                context[key] = value;
                return value;
            case proto_record_1.RecordType.Local:
                return locals.get(proto.name);
            case proto_record_1.RecordType.InvokeMethod:
                var context = this._readContext(proto, values);
                var args = this._readArgs(proto, values);
                return proto.funcOrValue(context, args);
            case proto_record_1.RecordType.SafeMethodInvoke:
                var context = this._readContext(proto, values);
                if (lang_1.isBlank(context)) {
                    return null;
                }
                var args = this._readArgs(proto, values);
                return proto.funcOrValue(context, args);
            case proto_record_1.RecordType.KeyedRead:
                var arg = this._readArgs(proto, values)[0];
                return this._readContext(proto, values)[arg];
            case proto_record_1.RecordType.Chain:
                var args = this._readArgs(proto, values);
                return args[args.length - 1];
            case proto_record_1.RecordType.InvokeClosure:
                return lang_1.FunctionWrapper.apply(this._readContext(proto, values), this._readArgs(proto, values));
            case proto_record_1.RecordType.Interpolate:
            case proto_record_1.RecordType.PrimitiveOp:
            case proto_record_1.RecordType.CollectionLiteral:
                return lang_1.FunctionWrapper.apply(proto.funcOrValue, this._readArgs(proto, values));
            default:
                throw new exceptions_1.BaseException("Unknown operation " + proto.mode);
        }
    };
    DynamicChangeDetector.prototype._pipeCheck = function (proto, throwOnChange, values) {
        var context = this._readContext(proto, values);
        var selectedPipe = this._pipeFor(proto, context);
        if (!selectedPipe.pure || this._argsOrContextChanged(proto)) {
            var args = this._readArgs(proto, values);
            var currValue = selectedPipe.pipe.transform(context, args);
            if (proto.shouldBeChecked()) {
                var prevValue = this._readSelf(proto, values);
                var detectedChange = throwOnChange ?
                    !change_detection_util_1.ChangeDetectionUtil.devModeEqual(prevValue, currValue) :
                    change_detection_util_1.ChangeDetectionUtil.looseNotIdentical(prevValue, currValue);
                if (detectedChange) {
                    currValue = change_detection_util_1.ChangeDetectionUtil.unwrapValue(currValue);
                    if (proto.lastInBinding) {
                        var change = change_detection_util_1.ChangeDetectionUtil.simpleChange(prevValue, currValue);
                        if (throwOnChange)
                            this.throwOnChangeError(prevValue, currValue);
                        this._writeSelf(proto, currValue, values);
                        this._setChanged(proto, true);
                        return change;
                    }
                    else {
                        this._writeSelf(proto, currValue, values);
                        this._setChanged(proto, true);
                        return null;
                    }
                }
                else {
                    this._setChanged(proto, false);
                    return null;
                }
            }
            else {
                this._writeSelf(proto, currValue, values);
                this._setChanged(proto, true);
                return null;
            }
        }
    };
    DynamicChangeDetector.prototype._pipeFor = function (proto, context) {
        var storedPipe = this._readPipe(proto);
        if (lang_1.isPresent(storedPipe))
            return storedPipe;
        var pipe = this.pipes.get(proto.name);
        this._writePipe(proto, pipe);
        return pipe;
    };
    DynamicChangeDetector.prototype._readContext = function (proto, values) {
        if (proto.contextIndex == -1) {
            return this._getDirectiveFor(proto.directiveIndex);
        }
        return values[proto.contextIndex];
    };
    DynamicChangeDetector.prototype._readSelf = function (proto, values) { return values[proto.selfIndex]; };
    DynamicChangeDetector.prototype._writeSelf = function (proto, value, values) { values[proto.selfIndex] = value; };
    DynamicChangeDetector.prototype._readPipe = function (proto) { return this.localPipes[proto.selfIndex]; };
    DynamicChangeDetector.prototype._writePipe = function (proto, value) { this.localPipes[proto.selfIndex] = value; };
    DynamicChangeDetector.prototype._setChanged = function (proto, value) {
        if (proto.argumentToPureFunction)
            this.changes[proto.selfIndex] = value;
    };
    DynamicChangeDetector.prototype._pureFuncAndArgsDidNotChange = function (proto) {
        return proto.isPureFunction() && !this._argsChanged(proto);
    };
    DynamicChangeDetector.prototype._argsChanged = function (proto) {
        var args = proto.args;
        for (var i = 0; i < args.length; ++i) {
            if (this.changes[args[i]]) {
                return true;
            }
        }
        return false;
    };
    DynamicChangeDetector.prototype._argsOrContextChanged = function (proto) {
        return this._argsChanged(proto) || this.changes[proto.contextIndex];
    };
    DynamicChangeDetector.prototype._readArgs = function (proto, values) {
        var res = collection_1.ListWrapper.createFixedSize(proto.args.length);
        var args = proto.args;
        for (var i = 0; i < args.length; ++i) {
            res[i] = values[args[i]];
        }
        return res;
    };
    return DynamicChangeDetector;
}(abstract_change_detector_1.AbstractChangeDetector));
exports.DynamicChangeDetector = DynamicChangeDetector;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHluYW1pY19jaGFuZ2VfZGV0ZWN0b3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJkaWZmaW5nX3BsdWdpbl93cmFwcGVyLW91dHB1dF9wYXRoLWpha1huTW1MLnRtcC9hbmd1bGFyMi9zcmMvY29yZS9jaGFuZ2VfZGV0ZWN0aW9uL2R5bmFtaWNfY2hhbmdlX2RldGVjdG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLHFCQUFpRSwwQkFBMEIsQ0FBQyxDQUFBO0FBQzVGLDJCQUE0QixnQ0FBZ0MsQ0FBQyxDQUFBO0FBQzdELDJCQUF3RCxnQ0FBZ0MsQ0FBQyxDQUFBO0FBRXpGLHlDQUFxQyw0QkFBNEIsQ0FBQyxDQUFBO0FBTWxFLHNDQUFnRCx5QkFBeUIsQ0FBQyxDQUFBO0FBQzFFLDBCQUEyRCxhQUFhLENBQUMsQ0FBQTtBQUN6RSw2QkFBc0MsZ0JBQWdCLENBQUMsQ0FBQTtBQUN2RCwyQkFBd0IseUNBQXlDLENBQUMsQ0FBQTtBQUNsRSxzQkFBZ0MsMkJBQTJCLENBQUMsQ0FBQTtBQUU1RDtJQUEyQyx5Q0FBMkI7SUFNcEUsK0JBQVksRUFBVSxFQUFFLDRCQUFvQyxFQUNoRCxzQkFBdUMsRUFBRSxnQkFBa0MsRUFDM0UsUUFBaUMsRUFBVSxRQUF1QixFQUMxRCxjQUE4QixFQUFVLGlCQUFvQyxFQUM1RSxVQUFtQztRQUNyRCxrQkFBTSxFQUFFLEVBQUUsNEJBQTRCLEVBQUUsc0JBQXNCLEVBQUUsZ0JBQWdCLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFIdkMsYUFBUSxHQUFSLFFBQVEsQ0FBZTtRQUMxRCxtQkFBYyxHQUFkLGNBQWMsQ0FBZ0I7UUFBVSxzQkFBaUIsR0FBakIsaUJBQWlCLENBQW1CO1FBQzVFLGVBQVUsR0FBVixVQUFVLENBQXlCO1FBRXJELElBQUksR0FBRyxHQUFHLFFBQVEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO1FBQzlCLElBQUksQ0FBQyxNQUFNLEdBQUcsd0JBQVcsQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDL0MsSUFBSSxDQUFDLFVBQVUsR0FBRyx3QkFBVyxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNuRCxJQUFJLENBQUMsWUFBWSxHQUFHLHdCQUFXLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3JELElBQUksQ0FBQyxPQUFPLEdBQUcsd0JBQVcsQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUFDLENBQUM7UUFFaEQsSUFBSSxDQUFDLG1CQUFtQixDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ2xDLENBQUM7SUFFRCxtREFBbUIsR0FBbkIsVUFBb0IsU0FBaUIsRUFBRSxPQUFlLEVBQUUsTUFBYztRQUF0RSxpQkFZQztRQVhDLElBQUksY0FBYyxHQUFHLEtBQUssQ0FBQztRQUUzQixJQUFJLENBQUMsc0JBQXNCLENBQUMsU0FBUyxFQUFFLE9BQU8sQ0FBQzthQUMxQyxPQUFPLENBQUMsVUFBQSxHQUFHO1lBQ1YsSUFBSSxHQUFHLEdBQUcsS0FBSSxDQUFDLG9CQUFvQixDQUFDLEdBQUcsRUFBRSxNQUFNLENBQUMsQ0FBQztZQUNqRCxFQUFFLENBQUMsQ0FBQyxHQUFHLEtBQUssS0FBSyxDQUFDLENBQUMsQ0FBQztnQkFDbEIsY0FBYyxHQUFHLElBQUksQ0FBQztZQUN4QixDQUFDO1FBQ0gsQ0FBQyxDQUFDLENBQUM7UUFFUCxNQUFNLENBQUMsY0FBYyxDQUFDO0lBQ3hCLENBQUM7SUFFRCxnQkFBZ0I7SUFDaEIsb0RBQW9CLEdBQXBCLFVBQXFCLEVBQWdCLEVBQUUsTUFBYztRQUNuRCxJQUFJLE1BQU0sR0FBRyx3QkFBVyxDQUFDLGVBQWUsQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzVELE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRTNCLEdBQUcsQ0FBQyxDQUFDLElBQUksUUFBUSxHQUFHLENBQUMsRUFBRSxRQUFRLEdBQUcsRUFBRSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsRUFBRSxRQUFRLEVBQUUsQ0FBQztZQUNoRSxJQUFJLEtBQUssR0FBRyxFQUFFLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBRWpDLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLENBQUM7Z0JBQ3pCLFFBQVEsSUFBSSxJQUFJLENBQUMsa0JBQWtCLENBQUMsUUFBUSxFQUFFLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQztZQUMvRCxDQUFDO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ04sRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUM7b0JBQ3hCLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDbkMsQ0FBQztnQkFDRCxJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsbUJBQW1CLENBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQztnQkFDMUQsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUM7b0JBQ3hCLE1BQU0sQ0FBQyxHQUFHLENBQUM7Z0JBQ2IsQ0FBQztnQkFBQyxJQUFJLENBQUMsQ0FBQztvQkFDTixJQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsTUFBTSxDQUFDLENBQUM7Z0JBQ3RDLENBQUM7WUFDSCxDQUFDO1FBQ0gsQ0FBQztRQUVELE1BQU0sSUFBSSwwQkFBYSxDQUFDLG1CQUFtQixDQUFDLENBQUM7SUFDL0MsQ0FBQztJQUVPLGtEQUFrQixHQUExQixVQUEyQixVQUFrQixFQUFFLEtBQWtCLEVBQUUsTUFBYTtRQUM5RSxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxLQUFLLHlCQUFVLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztZQUMxQyxNQUFNLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsR0FBRyxVQUFVLEdBQUcsQ0FBQyxDQUFDO1FBQzdDLENBQUM7UUFFRCxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxLQUFLLHlCQUFVLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztZQUM1QyxJQUFJLFNBQVMsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQztZQUNqRCxNQUFNLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEdBQUcsVUFBVSxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDN0QsQ0FBQztRQUVELEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLEtBQUsseUJBQVUsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUM7WUFDL0MsSUFBSSxTQUFTLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUM7WUFDakQsTUFBTSxDQUFDLFNBQVMsR0FBRyxDQUFDLEdBQUcsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsR0FBRyxVQUFVLEdBQUcsQ0FBQyxDQUFDO1FBQzdELENBQUM7UUFFRCxNQUFNLElBQUksMEJBQWEsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO0lBQy9DLENBQUM7SUFFRCxnQkFBZ0I7SUFDaEIsb0RBQW9CLEdBQXBCLFVBQXFCLEtBQWtCO1FBQ3JDLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyx3QkFBd0IsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUNwRCxJQUFJLEdBQUcsR0FBRyxLQUFLLENBQUMsYUFBYSxDQUFDLGVBQWUsQ0FBQztZQUM5QyxJQUFJLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQyx5QkFBeUIsRUFBRSxDQUFDO1FBQ3ZFLENBQUM7SUFDSCxDQUFDO0lBRUQsZ0JBQWdCO0lBQ2hCLHNEQUFzQixHQUF0QixVQUF1QixTQUFpQixFQUFFLE9BQWU7UUFDdkQsTUFBTSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLFVBQUEsRUFBRSxJQUFJLE9BQUEsRUFBRSxDQUFDLFNBQVMsSUFBSSxTQUFTLElBQUksRUFBRSxDQUFDLE9BQU8sS0FBSyxPQUFPLEVBQW5ELENBQW1ELENBQUMsQ0FBQztJQUMvRixDQUFDO0lBRUQsaURBQWlCLEdBQWpCLFVBQWtCLFVBQTRCO1FBQTlDLGlCQWtCQztRQWpCQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUM7UUFDOUIsSUFBSSxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUM7UUFFN0IsSUFBSSxDQUFDLG1CQUFtQixHQUFHLEVBQUUsQ0FBQztRQUM5QixHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQztZQUN2RCxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDbEMsRUFBRSxDQUFDLENBQUMsZ0JBQVMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN6QixDQUFDLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxVQUFBLE1BQU07b0JBQ3RCLElBQUksWUFBWSxHQUNQLEtBQUksQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLENBQUMsY0FBYyxDQUFDLFlBQVksRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDNUUsSUFBSSxTQUFTLEdBQUcsS0FBSSxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxjQUFjLENBQUMsQ0FBQztvQkFDeEQsSUFBSSxNQUFNLEdBQUcsc0JBQVMsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ3pDLEtBQUksQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQ3pCLHlCQUFpQixDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLEVBQUUsWUFBWSxDQUFDLENBQUMsQ0FBQztnQkFDcEUsQ0FBQyxDQUFDLENBQUM7WUFDTCxDQUFDO1FBQ0gsQ0FBQztJQUNILENBQUM7SUFFTyxtREFBbUIsR0FBM0IsVUFBNEIsaUJBQXlCLEVBQUUsU0FBaUI7UUFBeEUsaUJBRUM7UUFEQyxNQUFNLENBQUMsVUFBQyxLQUFLLElBQUssT0FBQSxLQUFJLENBQUMsV0FBVyxDQUFDLFNBQVMsRUFBRSxpQkFBaUIsRUFBRSxLQUFLLENBQUMsRUFBckQsQ0FBcUQsQ0FBQztJQUMxRSxDQUFDO0lBR0QsbURBQW1CLEdBQW5CLFVBQW9CLFlBQXFCO1FBQ3ZDLEVBQUUsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7WUFDakIsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO1lBQ3JCLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO1FBQzVCLENBQUM7UUFDRCxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztRQUN0Qix3QkFBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLDJDQUFtQixDQUFDLGFBQWEsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUNwRSx3QkFBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ3RDLHdCQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDeEMsd0JBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBRSwyQ0FBbUIsQ0FBQyxhQUFhLENBQUMsQ0FBQztJQUN6RSxDQUFDO0lBRUQsZ0JBQWdCO0lBQ2hCLDZDQUFhLEdBQWI7UUFDRSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUM7WUFDaEQsRUFBRSxDQUFDLENBQUMsZ0JBQVMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNsQywyQ0FBbUIsQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDNUQsQ0FBQztRQUNILENBQUM7SUFDSCxDQUFDO0lBRUQsZ0JBQWdCO0lBQ2hCLGtEQUFrQixHQUFsQjtRQUNFLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDO1lBQ3ZELElBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN2QyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztnQkFDekIsSUFBSSxDQUFDLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQztZQUM3RCxDQUFDO1FBQ0gsQ0FBQztJQUNILENBQUM7SUFFRCw4Q0FBYyxHQUFkLGNBQXlCLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFdkQsOERBQThCLEdBQTlCLFVBQStCLGFBQXNCO1FBQ25ELElBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUM7UUFFM0IsSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDO1FBQ25CLElBQUksU0FBUyxHQUFHLEtBQUssQ0FBQztRQUN0QixHQUFHLENBQUMsQ0FBQyxJQUFJLFFBQVEsR0FBRyxDQUFDLEVBQUUsUUFBUSxHQUFHLE1BQU0sQ0FBQyxNQUFNLEVBQUUsRUFBRSxRQUFRLEVBQUUsQ0FBQztZQUM1RCxJQUFJLEtBQUssR0FBZ0IsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQzFDLElBQUksYUFBYSxHQUFHLEtBQUssQ0FBQyxhQUFhLENBQUM7WUFDeEMsSUFBSSxlQUFlLEdBQUcsYUFBYSxDQUFDLGVBQWUsQ0FBQztZQUVwRCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDaEMsSUFBSSxDQUFDLG9CQUFvQixHQUFHLEtBQUssQ0FBQyxvQkFBb0IsQ0FBQztZQUN6RCxDQUFDO1lBRUQsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLGlCQUFpQixFQUFFLENBQUMsQ0FBQyxDQUFDO2dCQUM5QixFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxLQUFLLFNBQVMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUM7b0JBQy9DLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxlQUFlLENBQUMsY0FBYyxDQUFDLENBQUMsU0FBUyxFQUFFLENBQUM7Z0JBQ3BFLENBQUM7Z0JBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLEtBQUssUUFBUSxJQUFJLENBQUMsYUFBYTtvQkFDekMsSUFBSSxDQUFDLEtBQUssSUFBSSwrQkFBbUIsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO29CQUMxRCxJQUFJLENBQUMsZ0JBQWdCLENBQUMsZUFBZSxDQUFDLGNBQWMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDO2dCQUNuRSxDQUFDO2dCQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxLQUFLLFdBQVcsSUFBSSxnQkFBUyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztvQkFDOUUsSUFBSSxDQUFDLGdCQUFnQixDQUFDLGVBQWUsQ0FBQyxjQUFjLENBQUMsQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUM7Z0JBQzdFLENBQUM7WUFDSCxDQUFDO1lBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLENBQUM7Z0JBQ2hDLFFBQVEsSUFBSSxJQUFJLENBQUMsa0JBQWtCLENBQUMsUUFBUSxFQUFFLEtBQUssRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDcEUsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNOLElBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLGFBQWEsRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFDekUsRUFBRSxDQUFDLENBQUMsZ0JBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ3RCLElBQUksQ0FBQyx5QkFBeUIsQ0FBQyxNQUFNLEVBQUUsYUFBYSxDQUFDLENBQUM7b0JBQ3RELFNBQVMsR0FBRyxJQUFJLENBQUM7b0JBQ2pCLE9BQU8sR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLGFBQWEsRUFBRSxNQUFNLEVBQUUsT0FBTyxDQUFDLENBQUM7Z0JBQzVELENBQUM7WUFDSCxDQUFDO1lBRUQsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUM7Z0JBQzFCLE9BQU8sR0FBRyxJQUFJLENBQUM7Z0JBQ2YsRUFBRSxDQUFDLENBQUMsU0FBUyxJQUFJLENBQUMsYUFBYSxDQUFDLHdCQUF3QixFQUFFLENBQUMsQ0FBQyxDQUFDO29CQUMzRCxJQUFJLENBQUMsZUFBZSxDQUFDLGVBQWUsQ0FBQyxjQUFjLENBQUMsQ0FBQyxlQUFlLEVBQUUsQ0FBQztnQkFDekUsQ0FBQztnQkFFRCxTQUFTLEdBQUcsS0FBSyxDQUFDO1lBQ3BCLENBQUM7UUFDSCxDQUFDO0lBQ0gsQ0FBQztJQUVELGdCQUFnQjtJQUNoQiwrQ0FBZSxHQUFmLFVBQWdCLENBQWM7UUFDNUIsSUFBSSxJQUFJLEdBQUcsMkNBQW1CLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUM1RSxNQUFNLENBQUMsY0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxhQUFhLEtBQUssQ0FBQyxDQUFDLGFBQWEsQ0FBQztJQUNqRSxDQUFDO0lBRUQsc0VBQXNDLEdBQXRDO1FBQ0UsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDO1FBQ2xDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQztZQUMxQyxJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDbEIsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLG9CQUFvQixJQUFJLElBQUksQ0FBQyxLQUFLLElBQUksK0JBQW1CLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztnQkFDL0UsSUFBSSxDQUFDLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO1lBQ2pFLENBQUM7WUFFRCxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsdUJBQXVCLENBQUMsQ0FBQyxDQUFDO2dCQUNoQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxDQUFDLHFCQUFxQixFQUFFLENBQUM7WUFDcEUsQ0FBQztRQUNILENBQUM7SUFDSCxDQUFDO0lBRUQsbUVBQW1DLEdBQW5DO1FBQ0UsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDO1FBQ2xDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQztZQUMxQyxJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDbEIsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLGlCQUFpQixJQUFJLElBQUksQ0FBQyxLQUFLLElBQUksK0JBQW1CLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztnQkFDNUUsSUFBSSxDQUFDLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQyxlQUFlLEVBQUUsQ0FBQztZQUM5RCxDQUFDO1lBQ0QsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLG9CQUFvQixDQUFDLENBQUMsQ0FBQztnQkFDN0IsSUFBSSxDQUFDLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO1lBQ2pFLENBQUM7UUFDSCxDQUFDO0lBQ0gsQ0FBQztJQUVELGdCQUFnQjtJQUNSLHlEQUF5QixHQUFqQyxVQUFrQyxNQUFNLEVBQUUsYUFBYTtRQUNyRCxFQUFFLENBQUMsQ0FBQyxjQUFPLENBQUMsYUFBYSxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUMzQyxnQkFBSyxDQUFDLGdCQUFnQixZQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUM5QyxDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDTixJQUFJLGNBQWMsR0FBRyxhQUFhLENBQUMsZUFBZSxDQUFDLGNBQWMsQ0FBQztZQUNsRSxhQUFhLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxjQUFjLENBQUMsRUFBRSxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDbkYsQ0FBQztRQUVELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDO1lBQ3JDLGdCQUFLLENBQUMsZ0JBQWdCLFlBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBQzlDLENBQUM7SUFDSCxDQUFDO0lBRUQsZ0JBQWdCO0lBQ1IsMENBQVUsR0FBbEIsVUFBbUIsYUFBNEIsRUFBRSxNQUFNLEVBQUUsT0FBTztRQUM5RCxFQUFFLENBQUMsQ0FBQyxhQUFhLENBQUMsYUFBYSxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ2xDLE1BQU0sQ0FBQyxnQkFBSyxDQUFDLFNBQVMsWUFBQyxPQUFPLEVBQUUsTUFBTSxDQUFDLGFBQWEsRUFBRSxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDN0UsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ04sTUFBTSxDQUFDLE9BQU8sQ0FBQztRQUNqQixDQUFDO0lBQ0gsQ0FBQztJQUVELGdCQUFnQjtJQUNSLGdEQUFnQixHQUF4QixVQUF5QixjQUE4QjtRQUNyRCxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxlQUFlLENBQUMsY0FBYyxDQUFDLENBQUM7SUFDekQsQ0FBQztJQUVELGdCQUFnQjtJQUNSLCtDQUFlLEdBQXZCLFVBQXdCLGNBQThCO1FBQ3BELE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLGNBQWMsQ0FBQyxjQUFjLENBQUMsQ0FBQztJQUN4RCxDQUFDO0lBRUQsZ0JBQWdCO0lBQ1Isc0NBQU0sR0FBZCxVQUFlLEtBQWtCLEVBQUUsYUFBc0IsRUFBRSxNQUFhLEVBQ3pELE1BQWM7UUFDM0IsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLFlBQVksRUFBRSxDQUFDLENBQUMsQ0FBQztZQUN6QixNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLEVBQUUsYUFBYSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ3ZELENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNOLE1BQU0sQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLEtBQUssRUFBRSxhQUFhLEVBQUUsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ3BFLENBQUM7SUFDSCxDQUFDO0lBRUQsZ0JBQWdCO0lBQ1IsK0NBQWUsR0FBdkIsVUFBd0IsS0FBa0IsRUFBRSxhQUFzQixFQUFFLE1BQWEsRUFDekQsTUFBYztRQUNwQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsNEJBQTRCLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzdDLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQy9CLE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFDZCxDQUFDO1FBRUQsSUFBSSxTQUFTLEdBQUcsSUFBSSxDQUFDLG1CQUFtQixDQUFDLEtBQUssRUFBRSxNQUFNLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFFaEUsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLGVBQWUsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUM1QixJQUFJLFNBQVMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQztZQUM5QyxJQUFJLGNBQWMsR0FBRyxhQUFhO2dCQUNULENBQUMsMkNBQW1CLENBQUMsWUFBWSxDQUFDLFNBQVMsRUFBRSxTQUFTLENBQUM7Z0JBQ3ZELDJDQUFtQixDQUFDLGlCQUFpQixDQUFDLFNBQVMsRUFBRSxTQUFTLENBQUMsQ0FBQztZQUNyRixFQUFFLENBQUMsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDO2dCQUNuQixFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztvQkFDeEIsSUFBSSxNQUFNLEdBQUcsMkNBQW1CLENBQUMsWUFBWSxDQUFDLFNBQVMsRUFBRSxTQUFTLENBQUMsQ0FBQztvQkFDcEUsRUFBRSxDQUFDLENBQUMsYUFBYSxDQUFDO3dCQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxTQUFTLEVBQUUsU0FBUyxDQUFDLENBQUM7b0JBRWpFLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxFQUFFLFNBQVMsRUFBRSxNQUFNLENBQUMsQ0FBQztvQkFDMUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7b0JBQzlCLE1BQU0sQ0FBQyxNQUFNLENBQUM7Z0JBQ2hCLENBQUM7Z0JBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ04sSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLEVBQUUsU0FBUyxFQUFFLE1BQU0sQ0FBQyxDQUFDO29CQUMxQyxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztvQkFDOUIsTUFBTSxDQUFDLElBQUksQ0FBQztnQkFDZCxDQUFDO1lBQ0gsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNOLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO2dCQUMvQixNQUFNLENBQUMsSUFBSSxDQUFDO1lBQ2QsQ0FBQztRQUVILENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNOLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxFQUFFLFNBQVMsRUFBRSxNQUFNLENBQUMsQ0FBQztZQUMxQyxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztZQUM5QixNQUFNLENBQUMsSUFBSSxDQUFDO1FBQ2QsQ0FBQztJQUNILENBQUM7SUFFTyxtREFBbUIsR0FBM0IsVUFBNEIsS0FBa0IsRUFBRSxNQUFhLEVBQUUsTUFBYztRQUMzRSxNQUFNLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUNuQixLQUFLLHlCQUFVLENBQUMsSUFBSTtnQkFDbEIsTUFBTSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1lBRTFDLEtBQUsseUJBQVUsQ0FBQyxLQUFLO2dCQUNuQixNQUFNLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQztZQUUzQixLQUFLLHlCQUFVLENBQUMsWUFBWTtnQkFDMUIsSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUM7Z0JBQy9DLE1BQU0sQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBRXBDLEtBQUsseUJBQVUsQ0FBQyxZQUFZO2dCQUMxQixJQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQztnQkFDL0MsTUFBTSxDQUFDLGNBQU8sQ0FBQyxPQUFPLENBQUMsR0FBRyxJQUFJLEdBQUcsS0FBSyxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUU5RCxLQUFLLHlCQUFVLENBQUMsYUFBYTtnQkFDM0IsSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUM7Z0JBQy9DLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUM3QyxLQUFLLENBQUMsV0FBVyxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQztnQkFDbEMsTUFBTSxDQUFDLEtBQUssQ0FBQztZQUVmLEtBQUsseUJBQVUsQ0FBQyxVQUFVO2dCQUN4QixJQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQztnQkFDL0MsSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzNDLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUM3QyxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsS0FBSyxDQUFDO2dCQUNyQixNQUFNLENBQUMsS0FBSyxDQUFDO1lBRWYsS0FBSyx5QkFBVSxDQUFDLEtBQUs7Z0JBQ25CLE1BQU0sQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUVoQyxLQUFLLHlCQUFVLENBQUMsWUFBWTtnQkFDMUIsSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUM7Z0JBQy9DLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDO2dCQUN6QyxNQUFNLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFFMUMsS0FBSyx5QkFBVSxDQUFDLGdCQUFnQjtnQkFDOUIsSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUM7Z0JBQy9DLEVBQUUsQ0FBQyxDQUFDLGNBQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ3JCLE1BQU0sQ0FBQyxJQUFJLENBQUM7Z0JBQ2QsQ0FBQztnQkFDRCxJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQztnQkFDekMsTUFBTSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDO1lBRTFDLEtBQUsseUJBQVUsQ0FBQyxTQUFTO2dCQUN2QixJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDM0MsTUFBTSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBRS9DLEtBQUsseUJBQVUsQ0FBQyxLQUFLO2dCQUNuQixJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQztnQkFDekMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBRS9CLEtBQUsseUJBQVUsQ0FBQyxhQUFhO2dCQUMzQixNQUFNLENBQUMsc0JBQWUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLEVBQ2hDLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFFOUQsS0FBSyx5QkFBVSxDQUFDLFdBQVcsQ0FBQztZQUM1QixLQUFLLHlCQUFVLENBQUMsV0FBVyxDQUFDO1lBQzVCLEtBQUsseUJBQVUsQ0FBQyxpQkFBaUI7Z0JBQy9CLE1BQU0sQ0FBQyxzQkFBZSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFFakY7Z0JBQ0UsTUFBTSxJQUFJLDBCQUFhLENBQUMsdUJBQXFCLEtBQUssQ0FBQyxJQUFNLENBQUMsQ0FBQztRQUMvRCxDQUFDO0lBQ0gsQ0FBQztJQUVPLDBDQUFVLEdBQWxCLFVBQW1CLEtBQWtCLEVBQUUsYUFBc0IsRUFBRSxNQUFhO1FBQzFFLElBQUksT0FBTyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQy9DLElBQUksWUFBWSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQ2pELEVBQUUsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMscUJBQXFCLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzVELElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1lBQ3pDLElBQUksU0FBUyxHQUFHLFlBQVksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQztZQUUzRCxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsZUFBZSxFQUFFLENBQUMsQ0FBQyxDQUFDO2dCQUM1QixJQUFJLFNBQVMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQztnQkFDOUMsSUFBSSxjQUFjLEdBQUcsYUFBYTtvQkFDVCxDQUFDLDJDQUFtQixDQUFDLFlBQVksQ0FBQyxTQUFTLEVBQUUsU0FBUyxDQUFDO29CQUN2RCwyQ0FBbUIsQ0FBQyxpQkFBaUIsQ0FBQyxTQUFTLEVBQUUsU0FBUyxDQUFDLENBQUM7Z0JBQ3JGLEVBQUUsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7b0JBQ25CLFNBQVMsR0FBRywyQ0FBbUIsQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLENBQUM7b0JBRXZELEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDO3dCQUN4QixJQUFJLE1BQU0sR0FBRywyQ0FBbUIsQ0FBQyxZQUFZLENBQUMsU0FBUyxFQUFFLFNBQVMsQ0FBQyxDQUFDO3dCQUNwRSxFQUFFLENBQUMsQ0FBQyxhQUFhLENBQUM7NEJBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLFNBQVMsRUFBRSxTQUFTLENBQUMsQ0FBQzt3QkFFakUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLEVBQUUsU0FBUyxFQUFFLE1BQU0sQ0FBQyxDQUFDO3dCQUMxQyxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQzt3QkFFOUIsTUFBTSxDQUFDLE1BQU0sQ0FBQztvQkFFaEIsQ0FBQztvQkFBQyxJQUFJLENBQUMsQ0FBQzt3QkFDTixJQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssRUFBRSxTQUFTLEVBQUUsTUFBTSxDQUFDLENBQUM7d0JBQzFDLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDO3dCQUM5QixNQUFNLENBQUMsSUFBSSxDQUFDO29CQUNkLENBQUM7Z0JBQ0gsQ0FBQztnQkFBQyxJQUFJLENBQUMsQ0FBQztvQkFDTixJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztvQkFDL0IsTUFBTSxDQUFDLElBQUksQ0FBQztnQkFDZCxDQUFDO1lBQ0gsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNOLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxFQUFFLFNBQVMsRUFBRSxNQUFNLENBQUMsQ0FBQztnQkFDMUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7Z0JBQzlCLE1BQU0sQ0FBQyxJQUFJLENBQUM7WUFDZCxDQUFDO1FBQ0gsQ0FBQztJQUNILENBQUM7SUFFTyx3Q0FBUSxHQUFoQixVQUFpQixLQUFrQixFQUFFLE9BQU87UUFDMUMsSUFBSSxVQUFVLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUN2QyxFQUFFLENBQUMsQ0FBQyxnQkFBUyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQztRQUU3QyxJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDdEMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDN0IsTUFBTSxDQUFDLElBQUksQ0FBQztJQUNkLENBQUM7SUFFTyw0Q0FBWSxHQUFwQixVQUFxQixLQUFrQixFQUFFLE1BQWE7UUFDcEQsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLFlBQVksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDN0IsTUFBTSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDckQsQ0FBQztRQUNELE1BQU0sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxDQUFDO0lBQ3BDLENBQUM7SUFFTyx5Q0FBUyxHQUFqQixVQUFrQixLQUFrQixFQUFFLE1BQWEsSUFBSSxNQUFNLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFaEYsMENBQVUsR0FBbEIsVUFBbUIsS0FBa0IsRUFBRSxLQUFLLEVBQUUsTUFBYSxJQUFJLE1BQU0sQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQztJQUV6Rix5Q0FBUyxHQUFqQixVQUFrQixLQUFrQixJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFMUUsMENBQVUsR0FBbEIsVUFBbUIsS0FBa0IsRUFBRSxLQUFLLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQztJQUVuRiwyQ0FBVyxHQUFuQixVQUFvQixLQUFrQixFQUFFLEtBQWM7UUFDcEQsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLHNCQUFzQixDQUFDO1lBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLEdBQUcsS0FBSyxDQUFDO0lBQzFFLENBQUM7SUFFTyw0REFBNEIsR0FBcEMsVUFBcUMsS0FBa0I7UUFDckQsTUFBTSxDQUFDLEtBQUssQ0FBQyxjQUFjLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDN0QsQ0FBQztJQUVPLDRDQUFZLEdBQXBCLFVBQXFCLEtBQWtCO1FBQ3JDLElBQUksSUFBSSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUM7UUFDdEIsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUM7WUFDckMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzFCLE1BQU0sQ0FBQyxJQUFJLENBQUM7WUFDZCxDQUFDO1FBQ0gsQ0FBQztRQUNELE1BQU0sQ0FBQyxLQUFLLENBQUM7SUFDZixDQUFDO0lBRU8scURBQXFCLEdBQTdCLFVBQThCLEtBQWtCO1FBQzlDLE1BQU0sQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxDQUFDO0lBQ3RFLENBQUM7SUFFTyx5Q0FBUyxHQUFqQixVQUFrQixLQUFrQixFQUFFLE1BQWE7UUFDakQsSUFBSSxHQUFHLEdBQUcsd0JBQVcsQ0FBQyxlQUFlLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN6RCxJQUFJLElBQUksR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDO1FBQ3RCLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDO1lBQ3JDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDM0IsQ0FBQztRQUNELE1BQU0sQ0FBQyxHQUFHLENBQUM7SUFDYixDQUFDO0lBQ0gsNEJBQUM7QUFBRCxDQUFDLEFBemRELENBQTJDLGlEQUFzQixHQXlkaEU7QUF6ZFksNkJBQXFCLHdCQXlkakMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7aXNQcmVzZW50LCBpc0JsYW5rLCBGdW5jdGlvbldyYXBwZXIsIFN0cmluZ1dyYXBwZXJ9IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvbGFuZyc7XG5pbXBvcnQge0Jhc2VFeGNlcHRpb259IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvZXhjZXB0aW9ucyc7XG5pbXBvcnQge0xpc3RXcmFwcGVyLCBNYXBXcmFwcGVyLCBTdHJpbmdNYXBXcmFwcGVyfSBmcm9tICdhbmd1bGFyMi9zcmMvZmFjYWRlL2NvbGxlY3Rpb24nO1xuXG5pbXBvcnQge0Fic3RyYWN0Q2hhbmdlRGV0ZWN0b3J9IGZyb20gJy4vYWJzdHJhY3RfY2hhbmdlX2RldGVjdG9yJztcbmltcG9ydCB7RXZlbnRCaW5kaW5nfSBmcm9tICcuL2V2ZW50X2JpbmRpbmcnO1xuaW1wb3J0IHtCaW5kaW5nUmVjb3JkLCBCaW5kaW5nVGFyZ2V0fSBmcm9tICcuL2JpbmRpbmdfcmVjb3JkJztcbmltcG9ydCB7RGlyZWN0aXZlUmVjb3JkLCBEaXJlY3RpdmVJbmRleH0gZnJvbSAnLi9kaXJlY3RpdmVfcmVjb3JkJztcbmltcG9ydCB7TG9jYWxzfSBmcm9tICcuL3BhcnNlci9sb2NhbHMnO1xuaW1wb3J0IHtDaGFuZ2VEaXNwYXRjaGVyLCBDaGFuZ2VEZXRlY3RvckdlbkNvbmZpZ30gZnJvbSAnLi9pbnRlcmZhY2VzJztcbmltcG9ydCB7Q2hhbmdlRGV0ZWN0aW9uVXRpbCwgU2ltcGxlQ2hhbmdlfSBmcm9tICcuL2NoYW5nZV9kZXRlY3Rpb25fdXRpbCc7XG5pbXBvcnQge0NoYW5nZURldGVjdGlvblN0cmF0ZWd5LCBDaGFuZ2VEZXRlY3RvclN0YXRlfSBmcm9tICcuL2NvbnN0YW50cyc7XG5pbXBvcnQge1Byb3RvUmVjb3JkLCBSZWNvcmRUeXBlfSBmcm9tICcuL3Byb3RvX3JlY29yZCc7XG5pbXBvcnQge3JlZmxlY3Rvcn0gZnJvbSAnYW5ndWxhcjIvc3JjL2NvcmUvcmVmbGVjdGlvbi9yZWZsZWN0aW9uJztcbmltcG9ydCB7T2JzZXJ2YWJsZVdyYXBwZXJ9IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvYXN5bmMnO1xuXG5leHBvcnQgY2xhc3MgRHluYW1pY0NoYW5nZURldGVjdG9yIGV4dGVuZHMgQWJzdHJhY3RDaGFuZ2VEZXRlY3Rvcjxhbnk+IHtcbiAgdmFsdWVzOiBhbnlbXTtcbiAgY2hhbmdlczogYW55W107XG4gIGxvY2FsUGlwZXM6IGFueVtdO1xuICBwcmV2Q29udGV4dHM6IGFueVtdO1xuXG4gIGNvbnN0cnVjdG9yKGlkOiBzdHJpbmcsIG51bWJlck9mUHJvcGVydHlQcm90b1JlY29yZHM6IG51bWJlcixcbiAgICAgICAgICAgICAgcHJvcGVydHlCaW5kaW5nVGFyZ2V0czogQmluZGluZ1RhcmdldFtdLCBkaXJlY3RpdmVJbmRpY2VzOiBEaXJlY3RpdmVJbmRleFtdLFxuICAgICAgICAgICAgICBzdHJhdGVneTogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksIHByaXZhdGUgX3JlY29yZHM6IFByb3RvUmVjb3JkW10sXG4gICAgICAgICAgICAgIHByaXZhdGUgX2V2ZW50QmluZGluZ3M6IEV2ZW50QmluZGluZ1tdLCBwcml2YXRlIF9kaXJlY3RpdmVSZWNvcmRzOiBEaXJlY3RpdmVSZWNvcmRbXSxcbiAgICAgICAgICAgICAgcHJpdmF0ZSBfZ2VuQ29uZmlnOiBDaGFuZ2VEZXRlY3RvckdlbkNvbmZpZykge1xuICAgIHN1cGVyKGlkLCBudW1iZXJPZlByb3BlcnR5UHJvdG9SZWNvcmRzLCBwcm9wZXJ0eUJpbmRpbmdUYXJnZXRzLCBkaXJlY3RpdmVJbmRpY2VzLCBzdHJhdGVneSk7XG4gICAgdmFyIGxlbiA9IF9yZWNvcmRzLmxlbmd0aCArIDE7XG4gICAgdGhpcy52YWx1ZXMgPSBMaXN0V3JhcHBlci5jcmVhdGVGaXhlZFNpemUobGVuKTtcbiAgICB0aGlzLmxvY2FsUGlwZXMgPSBMaXN0V3JhcHBlci5jcmVhdGVGaXhlZFNpemUobGVuKTtcbiAgICB0aGlzLnByZXZDb250ZXh0cyA9IExpc3RXcmFwcGVyLmNyZWF0ZUZpeGVkU2l6ZShsZW4pO1xuICAgIHRoaXMuY2hhbmdlcyA9IExpc3RXcmFwcGVyLmNyZWF0ZUZpeGVkU2l6ZShsZW4pO1xuXG4gICAgdGhpcy5kZWh5ZHJhdGVEaXJlY3RpdmVzKGZhbHNlKTtcbiAgfVxuXG4gIGhhbmRsZUV2ZW50SW50ZXJuYWwoZXZlbnROYW1lOiBzdHJpbmcsIGVsSW5kZXg6IG51bWJlciwgbG9jYWxzOiBMb2NhbHMpOiBib29sZWFuIHtcbiAgICB2YXIgcHJldmVudERlZmF1bHQgPSBmYWxzZTtcblxuICAgIHRoaXMuX21hdGNoaW5nRXZlbnRCaW5kaW5ncyhldmVudE5hbWUsIGVsSW5kZXgpXG4gICAgICAgIC5mb3JFYWNoKHJlYyA9PiB7XG4gICAgICAgICAgdmFyIHJlcyA9IHRoaXMuX3Byb2Nlc3NFdmVudEJpbmRpbmcocmVjLCBsb2NhbHMpO1xuICAgICAgICAgIGlmIChyZXMgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICBwcmV2ZW50RGVmYXVsdCA9IHRydWU7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgIHJldHVybiBwcmV2ZW50RGVmYXVsdDtcbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX3Byb2Nlc3NFdmVudEJpbmRpbmcoZWI6IEV2ZW50QmluZGluZywgbG9jYWxzOiBMb2NhbHMpOiBhbnkge1xuICAgIHZhciB2YWx1ZXMgPSBMaXN0V3JhcHBlci5jcmVhdGVGaXhlZFNpemUoZWIucmVjb3Jkcy5sZW5ndGgpO1xuICAgIHZhbHVlc1swXSA9IHRoaXMudmFsdWVzWzBdO1xuXG4gICAgZm9yICh2YXIgcHJvdG9JZHggPSAwOyBwcm90b0lkeCA8IGViLnJlY29yZHMubGVuZ3RoOyArK3Byb3RvSWR4KSB7XG4gICAgICB2YXIgcHJvdG8gPSBlYi5yZWNvcmRzW3Byb3RvSWR4XTtcblxuICAgICAgaWYgKHByb3RvLmlzU2tpcFJlY29yZCgpKSB7XG4gICAgICAgIHByb3RvSWR4ICs9IHRoaXMuX2NvbXB1dGVTa2lwTGVuZ3RoKHByb3RvSWR4LCBwcm90bywgdmFsdWVzKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChwcm90by5sYXN0SW5CaW5kaW5nKSB7XG4gICAgICAgICAgdGhpcy5fbWFya1BhdGhBc0NoZWNrT25jZShwcm90byk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHJlcyA9IHRoaXMuX2NhbGN1bGF0ZUN1cnJWYWx1ZShwcm90bywgdmFsdWVzLCBsb2NhbHMpO1xuICAgICAgICBpZiAocHJvdG8ubGFzdEluQmluZGluZykge1xuICAgICAgICAgIHJldHVybiByZXM7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5fd3JpdGVTZWxmKHByb3RvLCByZXMsIHZhbHVlcyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aHJvdyBuZXcgQmFzZUV4Y2VwdGlvbihcIkNhbm5vdCBiZSByZWFjaGVkXCIpO1xuICB9XG5cbiAgcHJpdmF0ZSBfY29tcHV0ZVNraXBMZW5ndGgocHJvdG9JbmRleDogbnVtYmVyLCBwcm90bzogUHJvdG9SZWNvcmQsIHZhbHVlczogYW55W10pOiBudW1iZXIge1xuICAgIGlmIChwcm90by5tb2RlID09PSBSZWNvcmRUeXBlLlNraXBSZWNvcmRzKSB7XG4gICAgICByZXR1cm4gcHJvdG8uZml4ZWRBcmdzWzBdIC0gcHJvdG9JbmRleCAtIDE7XG4gICAgfVxuXG4gICAgaWYgKHByb3RvLm1vZGUgPT09IFJlY29yZFR5cGUuU2tpcFJlY29yZHNJZikge1xuICAgICAgbGV0IGNvbmRpdGlvbiA9IHRoaXMuX3JlYWRDb250ZXh0KHByb3RvLCB2YWx1ZXMpO1xuICAgICAgcmV0dXJuIGNvbmRpdGlvbiA/IHByb3RvLmZpeGVkQXJnc1swXSAtIHByb3RvSW5kZXggLSAxIDogMDtcbiAgICB9XG5cbiAgICBpZiAocHJvdG8ubW9kZSA9PT0gUmVjb3JkVHlwZS5Ta2lwUmVjb3Jkc0lmTm90KSB7XG4gICAgICBsZXQgY29uZGl0aW9uID0gdGhpcy5fcmVhZENvbnRleHQocHJvdG8sIHZhbHVlcyk7XG4gICAgICByZXR1cm4gY29uZGl0aW9uID8gMCA6IHByb3RvLmZpeGVkQXJnc1swXSAtIHByb3RvSW5kZXggLSAxO1xuICAgIH1cblxuICAgIHRocm93IG5ldyBCYXNlRXhjZXB0aW9uKFwiQ2Fubm90IGJlIHJlYWNoZWRcIik7XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIF9tYXJrUGF0aEFzQ2hlY2tPbmNlKHByb3RvOiBQcm90b1JlY29yZCk6IHZvaWQge1xuICAgIGlmICghcHJvdG8uYmluZGluZ1JlY29yZC5pc0RlZmF1bHRDaGFuZ2VEZXRlY3Rpb24oKSkge1xuICAgICAgdmFyIGRpciA9IHByb3RvLmJpbmRpbmdSZWNvcmQuZGlyZWN0aXZlUmVjb3JkO1xuICAgICAgdGhpcy5fZ2V0RGV0ZWN0b3JGb3IoZGlyLmRpcmVjdGl2ZUluZGV4KS5tYXJrUGF0aFRvUm9vdEFzQ2hlY2tPbmNlKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfbWF0Y2hpbmdFdmVudEJpbmRpbmdzKGV2ZW50TmFtZTogc3RyaW5nLCBlbEluZGV4OiBudW1iZXIpOiBFdmVudEJpbmRpbmdbXSB7XG4gICAgcmV0dXJuIHRoaXMuX2V2ZW50QmluZGluZ3MuZmlsdGVyKGViID0+IGViLmV2ZW50TmFtZSA9PSBldmVudE5hbWUgJiYgZWIuZWxJbmRleCA9PT0gZWxJbmRleCk7XG4gIH1cblxuICBoeWRyYXRlRGlyZWN0aXZlcyhkaXNwYXRjaGVyOiBDaGFuZ2VEaXNwYXRjaGVyKTogdm9pZCB7XG4gICAgdGhpcy52YWx1ZXNbMF0gPSB0aGlzLmNvbnRleHQ7XG4gICAgdGhpcy5kaXNwYXRjaGVyID0gZGlzcGF0Y2hlcjtcblxuICAgIHRoaXMub3V0cHV0U3Vic2NyaXB0aW9ucyA9IFtdO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5fZGlyZWN0aXZlUmVjb3Jkcy5sZW5ndGg7ICsraSkge1xuICAgICAgdmFyIHIgPSB0aGlzLl9kaXJlY3RpdmVSZWNvcmRzW2ldO1xuICAgICAgaWYgKGlzUHJlc2VudChyLm91dHB1dHMpKSB7XG4gICAgICAgIHIub3V0cHV0cy5mb3JFYWNoKG91dHB1dCA9PiB7XG4gICAgICAgICAgdmFyIGV2ZW50SGFuZGxlciA9XG4gICAgICAgICAgICAgIDxhbnk+dGhpcy5fY3JlYXRlRXZlbnRIYW5kbGVyKHIuZGlyZWN0aXZlSW5kZXguZWxlbWVudEluZGV4LCBvdXRwdXRbMV0pO1xuICAgICAgICAgIHZhciBkaXJlY3RpdmUgPSB0aGlzLl9nZXREaXJlY3RpdmVGb3Ioci5kaXJlY3RpdmVJbmRleCk7XG4gICAgICAgICAgdmFyIGdldHRlciA9IHJlZmxlY3Rvci5nZXR0ZXIob3V0cHV0WzBdKTtcbiAgICAgICAgICB0aGlzLm91dHB1dFN1YnNjcmlwdGlvbnMucHVzaChcbiAgICAgICAgICAgICAgT2JzZXJ2YWJsZVdyYXBwZXIuc3Vic2NyaWJlKGdldHRlcihkaXJlY3RpdmUpLCBldmVudEhhbmRsZXIpKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfY3JlYXRlRXZlbnRIYW5kbGVyKGJvdW5kRWxlbWVudEluZGV4OiBudW1iZXIsIGV2ZW50TmFtZTogc3RyaW5nKTogRnVuY3Rpb24ge1xuICAgIHJldHVybiAoZXZlbnQpID0+IHRoaXMuaGFuZGxlRXZlbnQoZXZlbnROYW1lLCBib3VuZEVsZW1lbnRJbmRleCwgZXZlbnQpO1xuICB9XG5cblxuICBkZWh5ZHJhdGVEaXJlY3RpdmVzKGRlc3Ryb3lQaXBlczogYm9vbGVhbikge1xuICAgIGlmIChkZXN0cm95UGlwZXMpIHtcbiAgICAgIHRoaXMuX2Rlc3Ryb3lQaXBlcygpO1xuICAgICAgdGhpcy5fZGVzdHJveURpcmVjdGl2ZXMoKTtcbiAgICB9XG4gICAgdGhpcy52YWx1ZXNbMF0gPSBudWxsO1xuICAgIExpc3RXcmFwcGVyLmZpbGwodGhpcy52YWx1ZXMsIENoYW5nZURldGVjdGlvblV0aWwudW5pbml0aWFsaXplZCwgMSk7XG4gICAgTGlzdFdyYXBwZXIuZmlsbCh0aGlzLmNoYW5nZXMsIGZhbHNlKTtcbiAgICBMaXN0V3JhcHBlci5maWxsKHRoaXMubG9jYWxQaXBlcywgbnVsbCk7XG4gICAgTGlzdFdyYXBwZXIuZmlsbCh0aGlzLnByZXZDb250ZXh0cywgQ2hhbmdlRGV0ZWN0aW9uVXRpbC51bmluaXRpYWxpemVkKTtcbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX2Rlc3Ryb3lQaXBlcygpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMubG9jYWxQaXBlcy5sZW5ndGg7ICsraSkge1xuICAgICAgaWYgKGlzUHJlc2VudCh0aGlzLmxvY2FsUGlwZXNbaV0pKSB7XG4gICAgICAgIENoYW5nZURldGVjdGlvblV0aWwuY2FsbFBpcGVPbkRlc3Ryb3kodGhpcy5sb2NhbFBpcGVzW2ldKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIF9kZXN0cm95RGlyZWN0aXZlcygpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuX2RpcmVjdGl2ZVJlY29yZHMubGVuZ3RoOyArK2kpIHtcbiAgICAgIHZhciByZWNvcmQgPSB0aGlzLl9kaXJlY3RpdmVSZWNvcmRzW2ldO1xuICAgICAgaWYgKHJlY29yZC5jYWxsT25EZXN0cm95KSB7XG4gICAgICAgIHRoaXMuX2dldERpcmVjdGl2ZUZvcihyZWNvcmQuZGlyZWN0aXZlSW5kZXgpLm5nT25EZXN0cm95KCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgY2hlY2tOb0NoYW5nZXMoKTogdm9pZCB7IHRoaXMucnVuRGV0ZWN0Q2hhbmdlcyh0cnVlKTsgfVxuXG4gIGRldGVjdENoYW5nZXNJblJlY29yZHNJbnRlcm5hbCh0aHJvd09uQ2hhbmdlOiBib29sZWFuKSB7XG4gICAgdmFyIHByb3RvcyA9IHRoaXMuX3JlY29yZHM7XG5cbiAgICB2YXIgY2hhbmdlcyA9IG51bGw7XG4gICAgdmFyIGlzQ2hhbmdlZCA9IGZhbHNlO1xuICAgIGZvciAodmFyIHByb3RvSWR4ID0gMDsgcHJvdG9JZHggPCBwcm90b3MubGVuZ3RoOyArK3Byb3RvSWR4KSB7XG4gICAgICB2YXIgcHJvdG86IFByb3RvUmVjb3JkID0gcHJvdG9zW3Byb3RvSWR4XTtcbiAgICAgIHZhciBiaW5kaW5nUmVjb3JkID0gcHJvdG8uYmluZGluZ1JlY29yZDtcbiAgICAgIHZhciBkaXJlY3RpdmVSZWNvcmQgPSBiaW5kaW5nUmVjb3JkLmRpcmVjdGl2ZVJlY29yZDtcblxuICAgICAgaWYgKHRoaXMuX2ZpcnN0SW5CaW5kaW5nKHByb3RvKSkge1xuICAgICAgICB0aGlzLnByb3BlcnR5QmluZGluZ0luZGV4ID0gcHJvdG8ucHJvcGVydHlCaW5kaW5nSW5kZXg7XG4gICAgICB9XG5cbiAgICAgIGlmIChwcm90by5pc0xpZmVDeWNsZVJlY29yZCgpKSB7XG4gICAgICAgIGlmIChwcm90by5uYW1lID09PSBcIkRvQ2hlY2tcIiAmJiAhdGhyb3dPbkNoYW5nZSkge1xuICAgICAgICAgIHRoaXMuX2dldERpcmVjdGl2ZUZvcihkaXJlY3RpdmVSZWNvcmQuZGlyZWN0aXZlSW5kZXgpLm5nRG9DaGVjaygpO1xuICAgICAgICB9IGVsc2UgaWYgKHByb3RvLm5hbWUgPT09IFwiT25Jbml0XCIgJiYgIXRocm93T25DaGFuZ2UgJiZcbiAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXRlID09IENoYW5nZURldGVjdG9yU3RhdGUuTmV2ZXJDaGVja2VkKSB7XG4gICAgICAgICAgdGhpcy5fZ2V0RGlyZWN0aXZlRm9yKGRpcmVjdGl2ZVJlY29yZC5kaXJlY3RpdmVJbmRleCkubmdPbkluaXQoKTtcbiAgICAgICAgfSBlbHNlIGlmIChwcm90by5uYW1lID09PSBcIk9uQ2hhbmdlc1wiICYmIGlzUHJlc2VudChjaGFuZ2VzKSAmJiAhdGhyb3dPbkNoYW5nZSkge1xuICAgICAgICAgIHRoaXMuX2dldERpcmVjdGl2ZUZvcihkaXJlY3RpdmVSZWNvcmQuZGlyZWN0aXZlSW5kZXgpLm5nT25DaGFuZ2VzKGNoYW5nZXMpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKHByb3RvLmlzU2tpcFJlY29yZCgpKSB7XG4gICAgICAgIHByb3RvSWR4ICs9IHRoaXMuX2NvbXB1dGVTa2lwTGVuZ3RoKHByb3RvSWR4LCBwcm90bywgdGhpcy52YWx1ZXMpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIGNoYW5nZSA9IHRoaXMuX2NoZWNrKHByb3RvLCB0aHJvd09uQ2hhbmdlLCB0aGlzLnZhbHVlcywgdGhpcy5sb2NhbHMpO1xuICAgICAgICBpZiAoaXNQcmVzZW50KGNoYW5nZSkpIHtcbiAgICAgICAgICB0aGlzLl91cGRhdGVEaXJlY3RpdmVPckVsZW1lbnQoY2hhbmdlLCBiaW5kaW5nUmVjb3JkKTtcbiAgICAgICAgICBpc0NoYW5nZWQgPSB0cnVlO1xuICAgICAgICAgIGNoYW5nZXMgPSB0aGlzLl9hZGRDaGFuZ2UoYmluZGluZ1JlY29yZCwgY2hhbmdlLCBjaGFuZ2VzKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAocHJvdG8ubGFzdEluRGlyZWN0aXZlKSB7XG4gICAgICAgIGNoYW5nZXMgPSBudWxsO1xuICAgICAgICBpZiAoaXNDaGFuZ2VkICYmICFiaW5kaW5nUmVjb3JkLmlzRGVmYXVsdENoYW5nZURldGVjdGlvbigpKSB7XG4gICAgICAgICAgdGhpcy5fZ2V0RGV0ZWN0b3JGb3IoZGlyZWN0aXZlUmVjb3JkLmRpcmVjdGl2ZUluZGV4KS5tYXJrQXNDaGVja09uY2UoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlzQ2hhbmdlZCA9IGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX2ZpcnN0SW5CaW5kaW5nKHI6IFByb3RvUmVjb3JkKTogYm9vbGVhbiB7XG4gICAgdmFyIHByZXYgPSBDaGFuZ2VEZXRlY3Rpb25VdGlsLnByb3RvQnlJbmRleCh0aGlzLl9yZWNvcmRzLCByLnNlbGZJbmRleCAtIDEpO1xuICAgIHJldHVybiBpc0JsYW5rKHByZXYpIHx8IHByZXYuYmluZGluZ1JlY29yZCAhPT0gci5iaW5kaW5nUmVjb3JkO1xuICB9XG5cbiAgYWZ0ZXJDb250ZW50TGlmZWN5Y2xlQ2FsbGJhY2tzSW50ZXJuYWwoKSB7XG4gICAgdmFyIGRpcnMgPSB0aGlzLl9kaXJlY3RpdmVSZWNvcmRzO1xuICAgIGZvciAodmFyIGkgPSBkaXJzLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICB2YXIgZGlyID0gZGlyc1tpXTtcbiAgICAgIGlmIChkaXIuY2FsbEFmdGVyQ29udGVudEluaXQgJiYgdGhpcy5zdGF0ZSA9PSBDaGFuZ2VEZXRlY3RvclN0YXRlLk5ldmVyQ2hlY2tlZCkge1xuICAgICAgICB0aGlzLl9nZXREaXJlY3RpdmVGb3IoZGlyLmRpcmVjdGl2ZUluZGV4KS5uZ0FmdGVyQ29udGVudEluaXQoKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGRpci5jYWxsQWZ0ZXJDb250ZW50Q2hlY2tlZCkge1xuICAgICAgICB0aGlzLl9nZXREaXJlY3RpdmVGb3IoZGlyLmRpcmVjdGl2ZUluZGV4KS5uZ0FmdGVyQ29udGVudENoZWNrZWQoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBhZnRlclZpZXdMaWZlY3ljbGVDYWxsYmFja3NJbnRlcm5hbCgpIHtcbiAgICB2YXIgZGlycyA9IHRoaXMuX2RpcmVjdGl2ZVJlY29yZHM7XG4gICAgZm9yICh2YXIgaSA9IGRpcnMubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIHtcbiAgICAgIHZhciBkaXIgPSBkaXJzW2ldO1xuICAgICAgaWYgKGRpci5jYWxsQWZ0ZXJWaWV3SW5pdCAmJiB0aGlzLnN0YXRlID09IENoYW5nZURldGVjdG9yU3RhdGUuTmV2ZXJDaGVja2VkKSB7XG4gICAgICAgIHRoaXMuX2dldERpcmVjdGl2ZUZvcihkaXIuZGlyZWN0aXZlSW5kZXgpLm5nQWZ0ZXJWaWV3SW5pdCgpO1xuICAgICAgfVxuICAgICAgaWYgKGRpci5jYWxsQWZ0ZXJWaWV3Q2hlY2tlZCkge1xuICAgICAgICB0aGlzLl9nZXREaXJlY3RpdmVGb3IoZGlyLmRpcmVjdGl2ZUluZGV4KS5uZ0FmdGVyVmlld0NoZWNrZWQoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIHByaXZhdGUgX3VwZGF0ZURpcmVjdGl2ZU9yRWxlbWVudChjaGFuZ2UsIGJpbmRpbmdSZWNvcmQpIHtcbiAgICBpZiAoaXNCbGFuayhiaW5kaW5nUmVjb3JkLmRpcmVjdGl2ZVJlY29yZCkpIHtcbiAgICAgIHN1cGVyLm5vdGlmeURpc3BhdGNoZXIoY2hhbmdlLmN1cnJlbnRWYWx1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBkaXJlY3RpdmVJbmRleCA9IGJpbmRpbmdSZWNvcmQuZGlyZWN0aXZlUmVjb3JkLmRpcmVjdGl2ZUluZGV4O1xuICAgICAgYmluZGluZ1JlY29yZC5zZXR0ZXIodGhpcy5fZ2V0RGlyZWN0aXZlRm9yKGRpcmVjdGl2ZUluZGV4KSwgY2hhbmdlLmN1cnJlbnRWYWx1ZSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX2dlbkNvbmZpZy5sb2dCaW5kaW5nVXBkYXRlKSB7XG4gICAgICBzdXBlci5sb2dCaW5kaW5nVXBkYXRlKGNoYW5nZS5jdXJyZW50VmFsdWUpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgcHJpdmF0ZSBfYWRkQ2hhbmdlKGJpbmRpbmdSZWNvcmQ6IEJpbmRpbmdSZWNvcmQsIGNoYW5nZSwgY2hhbmdlcykge1xuICAgIGlmIChiaW5kaW5nUmVjb3JkLmNhbGxPbkNoYW5nZXMoKSkge1xuICAgICAgcmV0dXJuIHN1cGVyLmFkZENoYW5nZShjaGFuZ2VzLCBjaGFuZ2UucHJldmlvdXNWYWx1ZSwgY2hhbmdlLmN1cnJlbnRWYWx1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBjaGFuZ2VzO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgcHJpdmF0ZSBfZ2V0RGlyZWN0aXZlRm9yKGRpcmVjdGl2ZUluZGV4OiBEaXJlY3RpdmVJbmRleCkge1xuICAgIHJldHVybiB0aGlzLmRpc3BhdGNoZXIuZ2V0RGlyZWN0aXZlRm9yKGRpcmVjdGl2ZUluZGV4KTtcbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgcHJpdmF0ZSBfZ2V0RGV0ZWN0b3JGb3IoZGlyZWN0aXZlSW5kZXg6IERpcmVjdGl2ZUluZGV4KSB7XG4gICAgcmV0dXJuIHRoaXMuZGlzcGF0Y2hlci5nZXREZXRlY3RvckZvcihkaXJlY3RpdmVJbmRleCk7XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIHByaXZhdGUgX2NoZWNrKHByb3RvOiBQcm90b1JlY29yZCwgdGhyb3dPbkNoYW5nZTogYm9vbGVhbiwgdmFsdWVzOiBhbnlbXSxcbiAgICAgICAgICAgICAgICAgbG9jYWxzOiBMb2NhbHMpOiBTaW1wbGVDaGFuZ2Uge1xuICAgIGlmIChwcm90by5pc1BpcGVSZWNvcmQoKSkge1xuICAgICAgcmV0dXJuIHRoaXMuX3BpcGVDaGVjayhwcm90bywgdGhyb3dPbkNoYW5nZSwgdmFsdWVzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMuX3JlZmVyZW5jZUNoZWNrKHByb3RvLCB0aHJvd09uQ2hhbmdlLCB2YWx1ZXMsIGxvY2Fscyk7XG4gICAgfVxuICB9XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBwcml2YXRlIF9yZWZlcmVuY2VDaGVjayhwcm90bzogUHJvdG9SZWNvcmQsIHRocm93T25DaGFuZ2U6IGJvb2xlYW4sIHZhbHVlczogYW55W10sXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGxvY2FsczogTG9jYWxzKSB7XG4gICAgaWYgKHRoaXMuX3B1cmVGdW5jQW5kQXJnc0RpZE5vdENoYW5nZShwcm90bykpIHtcbiAgICAgIHRoaXMuX3NldENoYW5nZWQocHJvdG8sIGZhbHNlKTtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHZhciBjdXJyVmFsdWUgPSB0aGlzLl9jYWxjdWxhdGVDdXJyVmFsdWUocHJvdG8sIHZhbHVlcywgbG9jYWxzKTtcblxuICAgIGlmIChwcm90by5zaG91bGRCZUNoZWNrZWQoKSkge1xuICAgICAgdmFyIHByZXZWYWx1ZSA9IHRoaXMuX3JlYWRTZWxmKHByb3RvLCB2YWx1ZXMpO1xuICAgICAgdmFyIGRldGVjdGVkQ2hhbmdlID0gdGhyb3dPbkNoYW5nZSA/XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIUNoYW5nZURldGVjdGlvblV0aWwuZGV2TW9kZUVxdWFsKHByZXZWYWx1ZSwgY3VyclZhbHVlKSA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQ2hhbmdlRGV0ZWN0aW9uVXRpbC5sb29zZU5vdElkZW50aWNhbChwcmV2VmFsdWUsIGN1cnJWYWx1ZSk7XG4gICAgICBpZiAoZGV0ZWN0ZWRDaGFuZ2UpIHtcbiAgICAgICAgaWYgKHByb3RvLmxhc3RJbkJpbmRpbmcpIHtcbiAgICAgICAgICB2YXIgY2hhbmdlID0gQ2hhbmdlRGV0ZWN0aW9uVXRpbC5zaW1wbGVDaGFuZ2UocHJldlZhbHVlLCBjdXJyVmFsdWUpO1xuICAgICAgICAgIGlmICh0aHJvd09uQ2hhbmdlKSB0aGlzLnRocm93T25DaGFuZ2VFcnJvcihwcmV2VmFsdWUsIGN1cnJWYWx1ZSk7XG5cbiAgICAgICAgICB0aGlzLl93cml0ZVNlbGYocHJvdG8sIGN1cnJWYWx1ZSwgdmFsdWVzKTtcbiAgICAgICAgICB0aGlzLl9zZXRDaGFuZ2VkKHByb3RvLCB0cnVlKTtcbiAgICAgICAgICByZXR1cm4gY2hhbmdlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuX3dyaXRlU2VsZihwcm90bywgY3VyclZhbHVlLCB2YWx1ZXMpO1xuICAgICAgICAgIHRoaXMuX3NldENoYW5nZWQocHJvdG8sIHRydWUpO1xuICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9zZXRDaGFuZ2VkKHByb3RvLCBmYWxzZSk7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfVxuXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX3dyaXRlU2VsZihwcm90bywgY3VyclZhbHVlLCB2YWx1ZXMpO1xuICAgICAgdGhpcy5fc2V0Q2hhbmdlZChwcm90bywgdHJ1ZSk7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF9jYWxjdWxhdGVDdXJyVmFsdWUocHJvdG86IFByb3RvUmVjb3JkLCB2YWx1ZXM6IGFueVtdLCBsb2NhbHM6IExvY2Fscykge1xuICAgIHN3aXRjaCAocHJvdG8ubW9kZSkge1xuICAgICAgY2FzZSBSZWNvcmRUeXBlLlNlbGY6XG4gICAgICAgIHJldHVybiB0aGlzLl9yZWFkQ29udGV4dChwcm90bywgdmFsdWVzKTtcblxuICAgICAgY2FzZSBSZWNvcmRUeXBlLkNvbnN0OlxuICAgICAgICByZXR1cm4gcHJvdG8uZnVuY09yVmFsdWU7XG5cbiAgICAgIGNhc2UgUmVjb3JkVHlwZS5Qcm9wZXJ0eVJlYWQ6XG4gICAgICAgIHZhciBjb250ZXh0ID0gdGhpcy5fcmVhZENvbnRleHQocHJvdG8sIHZhbHVlcyk7XG4gICAgICAgIHJldHVybiBwcm90by5mdW5jT3JWYWx1ZShjb250ZXh0KTtcblxuICAgICAgY2FzZSBSZWNvcmRUeXBlLlNhZmVQcm9wZXJ0eTpcbiAgICAgICAgdmFyIGNvbnRleHQgPSB0aGlzLl9yZWFkQ29udGV4dChwcm90bywgdmFsdWVzKTtcbiAgICAgICAgcmV0dXJuIGlzQmxhbmsoY29udGV4dCkgPyBudWxsIDogcHJvdG8uZnVuY09yVmFsdWUoY29udGV4dCk7XG5cbiAgICAgIGNhc2UgUmVjb3JkVHlwZS5Qcm9wZXJ0eVdyaXRlOlxuICAgICAgICB2YXIgY29udGV4dCA9IHRoaXMuX3JlYWRDb250ZXh0KHByb3RvLCB2YWx1ZXMpO1xuICAgICAgICB2YXIgdmFsdWUgPSB0aGlzLl9yZWFkQXJncyhwcm90bywgdmFsdWVzKVswXTtcbiAgICAgICAgcHJvdG8uZnVuY09yVmFsdWUoY29udGV4dCwgdmFsdWUpO1xuICAgICAgICByZXR1cm4gdmFsdWU7XG5cbiAgICAgIGNhc2UgUmVjb3JkVHlwZS5LZXllZFdyaXRlOlxuICAgICAgICB2YXIgY29udGV4dCA9IHRoaXMuX3JlYWRDb250ZXh0KHByb3RvLCB2YWx1ZXMpO1xuICAgICAgICB2YXIga2V5ID0gdGhpcy5fcmVhZEFyZ3MocHJvdG8sIHZhbHVlcylbMF07XG4gICAgICAgIHZhciB2YWx1ZSA9IHRoaXMuX3JlYWRBcmdzKHByb3RvLCB2YWx1ZXMpWzFdO1xuICAgICAgICBjb250ZXh0W2tleV0gPSB2YWx1ZTtcbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuXG4gICAgICBjYXNlIFJlY29yZFR5cGUuTG9jYWw6XG4gICAgICAgIHJldHVybiBsb2NhbHMuZ2V0KHByb3RvLm5hbWUpO1xuXG4gICAgICBjYXNlIFJlY29yZFR5cGUuSW52b2tlTWV0aG9kOlxuICAgICAgICB2YXIgY29udGV4dCA9IHRoaXMuX3JlYWRDb250ZXh0KHByb3RvLCB2YWx1ZXMpO1xuICAgICAgICB2YXIgYXJncyA9IHRoaXMuX3JlYWRBcmdzKHByb3RvLCB2YWx1ZXMpO1xuICAgICAgICByZXR1cm4gcHJvdG8uZnVuY09yVmFsdWUoY29udGV4dCwgYXJncyk7XG5cbiAgICAgIGNhc2UgUmVjb3JkVHlwZS5TYWZlTWV0aG9kSW52b2tlOlxuICAgICAgICB2YXIgY29udGV4dCA9IHRoaXMuX3JlYWRDb250ZXh0KHByb3RvLCB2YWx1ZXMpO1xuICAgICAgICBpZiAoaXNCbGFuayhjb250ZXh0KSkge1xuICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIHZhciBhcmdzID0gdGhpcy5fcmVhZEFyZ3MocHJvdG8sIHZhbHVlcyk7XG4gICAgICAgIHJldHVybiBwcm90by5mdW5jT3JWYWx1ZShjb250ZXh0LCBhcmdzKTtcblxuICAgICAgY2FzZSBSZWNvcmRUeXBlLktleWVkUmVhZDpcbiAgICAgICAgdmFyIGFyZyA9IHRoaXMuX3JlYWRBcmdzKHByb3RvLCB2YWx1ZXMpWzBdO1xuICAgICAgICByZXR1cm4gdGhpcy5fcmVhZENvbnRleHQocHJvdG8sIHZhbHVlcylbYXJnXTtcblxuICAgICAgY2FzZSBSZWNvcmRUeXBlLkNoYWluOlxuICAgICAgICB2YXIgYXJncyA9IHRoaXMuX3JlYWRBcmdzKHByb3RvLCB2YWx1ZXMpO1xuICAgICAgICByZXR1cm4gYXJnc1thcmdzLmxlbmd0aCAtIDFdO1xuXG4gICAgICBjYXNlIFJlY29yZFR5cGUuSW52b2tlQ2xvc3VyZTpcbiAgICAgICAgcmV0dXJuIEZ1bmN0aW9uV3JhcHBlci5hcHBseSh0aGlzLl9yZWFkQ29udGV4dChwcm90bywgdmFsdWVzKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9yZWFkQXJncyhwcm90bywgdmFsdWVzKSk7XG5cbiAgICAgIGNhc2UgUmVjb3JkVHlwZS5JbnRlcnBvbGF0ZTpcbiAgICAgIGNhc2UgUmVjb3JkVHlwZS5QcmltaXRpdmVPcDpcbiAgICAgIGNhc2UgUmVjb3JkVHlwZS5Db2xsZWN0aW9uTGl0ZXJhbDpcbiAgICAgICAgcmV0dXJuIEZ1bmN0aW9uV3JhcHBlci5hcHBseShwcm90by5mdW5jT3JWYWx1ZSwgdGhpcy5fcmVhZEFyZ3MocHJvdG8sIHZhbHVlcykpO1xuXG4gICAgICBkZWZhdWx0OlxuICAgICAgICB0aHJvdyBuZXcgQmFzZUV4Y2VwdGlvbihgVW5rbm93biBvcGVyYXRpb24gJHtwcm90by5tb2RlfWApO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX3BpcGVDaGVjayhwcm90bzogUHJvdG9SZWNvcmQsIHRocm93T25DaGFuZ2U6IGJvb2xlYW4sIHZhbHVlczogYW55W10pIHtcbiAgICB2YXIgY29udGV4dCA9IHRoaXMuX3JlYWRDb250ZXh0KHByb3RvLCB2YWx1ZXMpO1xuICAgIHZhciBzZWxlY3RlZFBpcGUgPSB0aGlzLl9waXBlRm9yKHByb3RvLCBjb250ZXh0KTtcbiAgICBpZiAoIXNlbGVjdGVkUGlwZS5wdXJlIHx8IHRoaXMuX2FyZ3NPckNvbnRleHRDaGFuZ2VkKHByb3RvKSkge1xuICAgICAgdmFyIGFyZ3MgPSB0aGlzLl9yZWFkQXJncyhwcm90bywgdmFsdWVzKTtcbiAgICAgIHZhciBjdXJyVmFsdWUgPSBzZWxlY3RlZFBpcGUucGlwZS50cmFuc2Zvcm0oY29udGV4dCwgYXJncyk7XG5cbiAgICAgIGlmIChwcm90by5zaG91bGRCZUNoZWNrZWQoKSkge1xuICAgICAgICB2YXIgcHJldlZhbHVlID0gdGhpcy5fcmVhZFNlbGYocHJvdG8sIHZhbHVlcyk7XG4gICAgICAgIHZhciBkZXRlY3RlZENoYW5nZSA9IHRocm93T25DaGFuZ2UgP1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIUNoYW5nZURldGVjdGlvblV0aWwuZGV2TW9kZUVxdWFsKHByZXZWYWx1ZSwgY3VyclZhbHVlKSA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBDaGFuZ2VEZXRlY3Rpb25VdGlsLmxvb3NlTm90SWRlbnRpY2FsKHByZXZWYWx1ZSwgY3VyclZhbHVlKTtcbiAgICAgICAgaWYgKGRldGVjdGVkQ2hhbmdlKSB7XG4gICAgICAgICAgY3VyclZhbHVlID0gQ2hhbmdlRGV0ZWN0aW9uVXRpbC51bndyYXBWYWx1ZShjdXJyVmFsdWUpO1xuXG4gICAgICAgICAgaWYgKHByb3RvLmxhc3RJbkJpbmRpbmcpIHtcbiAgICAgICAgICAgIHZhciBjaGFuZ2UgPSBDaGFuZ2VEZXRlY3Rpb25VdGlsLnNpbXBsZUNoYW5nZShwcmV2VmFsdWUsIGN1cnJWYWx1ZSk7XG4gICAgICAgICAgICBpZiAodGhyb3dPbkNoYW5nZSkgdGhpcy50aHJvd09uQ2hhbmdlRXJyb3IocHJldlZhbHVlLCBjdXJyVmFsdWUpO1xuXG4gICAgICAgICAgICB0aGlzLl93cml0ZVNlbGYocHJvdG8sIGN1cnJWYWx1ZSwgdmFsdWVzKTtcbiAgICAgICAgICAgIHRoaXMuX3NldENoYW5nZWQocHJvdG8sIHRydWUpO1xuXG4gICAgICAgICAgICByZXR1cm4gY2hhbmdlO1xuXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX3dyaXRlU2VsZihwcm90bywgY3VyclZhbHVlLCB2YWx1ZXMpO1xuICAgICAgICAgICAgdGhpcy5fc2V0Q2hhbmdlZChwcm90bywgdHJ1ZSk7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5fc2V0Q2hhbmdlZChwcm90bywgZmFsc2UpO1xuICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl93cml0ZVNlbGYocHJvdG8sIGN1cnJWYWx1ZSwgdmFsdWVzKTtcbiAgICAgICAgdGhpcy5fc2V0Q2hhbmdlZChwcm90bywgdHJ1ZSk7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX3BpcGVGb3IocHJvdG86IFByb3RvUmVjb3JkLCBjb250ZXh0KSB7XG4gICAgdmFyIHN0b3JlZFBpcGUgPSB0aGlzLl9yZWFkUGlwZShwcm90byk7XG4gICAgaWYgKGlzUHJlc2VudChzdG9yZWRQaXBlKSkgcmV0dXJuIHN0b3JlZFBpcGU7XG5cbiAgICB2YXIgcGlwZSA9IHRoaXMucGlwZXMuZ2V0KHByb3RvLm5hbWUpO1xuICAgIHRoaXMuX3dyaXRlUGlwZShwcm90bywgcGlwZSk7XG4gICAgcmV0dXJuIHBpcGU7XG4gIH1cblxuICBwcml2YXRlIF9yZWFkQ29udGV4dChwcm90bzogUHJvdG9SZWNvcmQsIHZhbHVlczogYW55W10pIHtcbiAgICBpZiAocHJvdG8uY29udGV4dEluZGV4ID09IC0xKSB7XG4gICAgICByZXR1cm4gdGhpcy5fZ2V0RGlyZWN0aXZlRm9yKHByb3RvLmRpcmVjdGl2ZUluZGV4KTtcbiAgICB9XG4gICAgcmV0dXJuIHZhbHVlc1twcm90by5jb250ZXh0SW5kZXhdO1xuICB9XG5cbiAgcHJpdmF0ZSBfcmVhZFNlbGYocHJvdG86IFByb3RvUmVjb3JkLCB2YWx1ZXM6IGFueVtdKSB7IHJldHVybiB2YWx1ZXNbcHJvdG8uc2VsZkluZGV4XTsgfVxuXG4gIHByaXZhdGUgX3dyaXRlU2VsZihwcm90bzogUHJvdG9SZWNvcmQsIHZhbHVlLCB2YWx1ZXM6IGFueVtdKSB7IHZhbHVlc1twcm90by5zZWxmSW5kZXhdID0gdmFsdWU7IH1cblxuICBwcml2YXRlIF9yZWFkUGlwZShwcm90bzogUHJvdG9SZWNvcmQpIHsgcmV0dXJuIHRoaXMubG9jYWxQaXBlc1twcm90by5zZWxmSW5kZXhdOyB9XG5cbiAgcHJpdmF0ZSBfd3JpdGVQaXBlKHByb3RvOiBQcm90b1JlY29yZCwgdmFsdWUpIHsgdGhpcy5sb2NhbFBpcGVzW3Byb3RvLnNlbGZJbmRleF0gPSB2YWx1ZTsgfVxuXG4gIHByaXZhdGUgX3NldENoYW5nZWQocHJvdG86IFByb3RvUmVjb3JkLCB2YWx1ZTogYm9vbGVhbikge1xuICAgIGlmIChwcm90by5hcmd1bWVudFRvUHVyZUZ1bmN0aW9uKSB0aGlzLmNoYW5nZXNbcHJvdG8uc2VsZkluZGV4XSA9IHZhbHVlO1xuICB9XG5cbiAgcHJpdmF0ZSBfcHVyZUZ1bmNBbmRBcmdzRGlkTm90Q2hhbmdlKHByb3RvOiBQcm90b1JlY29yZCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiBwcm90by5pc1B1cmVGdW5jdGlvbigpICYmICF0aGlzLl9hcmdzQ2hhbmdlZChwcm90byk7XG4gIH1cblxuICBwcml2YXRlIF9hcmdzQ2hhbmdlZChwcm90bzogUHJvdG9SZWNvcmQpOiBib29sZWFuIHtcbiAgICB2YXIgYXJncyA9IHByb3RvLmFyZ3M7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcmdzLmxlbmd0aDsgKytpKSB7XG4gICAgICBpZiAodGhpcy5jaGFuZ2VzW2FyZ3NbaV1dKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBwcml2YXRlIF9hcmdzT3JDb250ZXh0Q2hhbmdlZChwcm90bzogUHJvdG9SZWNvcmQpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fYXJnc0NoYW5nZWQocHJvdG8pIHx8IHRoaXMuY2hhbmdlc1twcm90by5jb250ZXh0SW5kZXhdO1xuICB9XG5cbiAgcHJpdmF0ZSBfcmVhZEFyZ3MocHJvdG86IFByb3RvUmVjb3JkLCB2YWx1ZXM6IGFueVtdKSB7XG4gICAgdmFyIHJlcyA9IExpc3RXcmFwcGVyLmNyZWF0ZUZpeGVkU2l6ZShwcm90by5hcmdzLmxlbmd0aCk7XG4gICAgdmFyIGFyZ3MgPSBwcm90by5hcmdzO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJncy5sZW5ndGg7ICsraSkge1xuICAgICAgcmVzW2ldID0gdmFsdWVzW2FyZ3NbaV1dO1xuICAgIH1cbiAgICByZXR1cm4gcmVzO1xuICB9XG59XG4iXX0=