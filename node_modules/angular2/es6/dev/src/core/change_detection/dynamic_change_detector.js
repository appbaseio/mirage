import { isPresent, isBlank, FunctionWrapper } from 'angular2/src/facade/lang';
import { BaseException } from 'angular2/src/facade/exceptions';
import { ListWrapper } from 'angular2/src/facade/collection';
import { AbstractChangeDetector } from './abstract_change_detector';
import { ChangeDetectionUtil } from './change_detection_util';
import { ChangeDetectorState } from './constants';
import { RecordType } from './proto_record';
import { reflector } from 'angular2/src/core/reflection/reflection';
import { ObservableWrapper } from 'angular2/src/facade/async';
export class DynamicChangeDetector extends AbstractChangeDetector {
    constructor(id, numberOfPropertyProtoRecords, propertyBindingTargets, directiveIndices, strategy, _records, _eventBindings, _directiveRecords, _genConfig) {
        super(id, numberOfPropertyProtoRecords, propertyBindingTargets, directiveIndices, strategy);
        this._records = _records;
        this._eventBindings = _eventBindings;
        this._directiveRecords = _directiveRecords;
        this._genConfig = _genConfig;
        var len = _records.length + 1;
        this.values = ListWrapper.createFixedSize(len);
        this.localPipes = ListWrapper.createFixedSize(len);
        this.prevContexts = ListWrapper.createFixedSize(len);
        this.changes = ListWrapper.createFixedSize(len);
        this.dehydrateDirectives(false);
    }
    handleEventInternal(eventName, elIndex, locals) {
        var preventDefault = false;
        this._matchingEventBindings(eventName, elIndex)
            .forEach(rec => {
            var res = this._processEventBinding(rec, locals);
            if (res === false) {
                preventDefault = true;
            }
        });
        return preventDefault;
    }
    /** @internal */
    _processEventBinding(eb, locals) {
        var values = ListWrapper.createFixedSize(eb.records.length);
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
        throw new BaseException("Cannot be reached");
    }
    _computeSkipLength(protoIndex, proto, values) {
        if (proto.mode === RecordType.SkipRecords) {
            return proto.fixedArgs[0] - protoIndex - 1;
        }
        if (proto.mode === RecordType.SkipRecordsIf) {
            let condition = this._readContext(proto, values);
            return condition ? proto.fixedArgs[0] - protoIndex - 1 : 0;
        }
        if (proto.mode === RecordType.SkipRecordsIfNot) {
            let condition = this._readContext(proto, values);
            return condition ? 0 : proto.fixedArgs[0] - protoIndex - 1;
        }
        throw new BaseException("Cannot be reached");
    }
    /** @internal */
    _markPathAsCheckOnce(proto) {
        if (!proto.bindingRecord.isDefaultChangeDetection()) {
            var dir = proto.bindingRecord.directiveRecord;
            this._getDetectorFor(dir.directiveIndex).markPathToRootAsCheckOnce();
        }
    }
    /** @internal */
    _matchingEventBindings(eventName, elIndex) {
        return this._eventBindings.filter(eb => eb.eventName == eventName && eb.elIndex === elIndex);
    }
    hydrateDirectives(dispatcher) {
        this.values[0] = this.context;
        this.dispatcher = dispatcher;
        this.outputSubscriptions = [];
        for (var i = 0; i < this._directiveRecords.length; ++i) {
            var r = this._directiveRecords[i];
            if (isPresent(r.outputs)) {
                r.outputs.forEach(output => {
                    var eventHandler = this._createEventHandler(r.directiveIndex.elementIndex, output[1]);
                    var directive = this._getDirectiveFor(r.directiveIndex);
                    var getter = reflector.getter(output[0]);
                    this.outputSubscriptions.push(ObservableWrapper.subscribe(getter(directive), eventHandler));
                });
            }
        }
    }
    _createEventHandler(boundElementIndex, eventName) {
        return (event) => this.handleEvent(eventName, boundElementIndex, event);
    }
    dehydrateDirectives(destroyPipes) {
        if (destroyPipes) {
            this._destroyPipes();
            this._destroyDirectives();
        }
        this.values[0] = null;
        ListWrapper.fill(this.values, ChangeDetectionUtil.uninitialized, 1);
        ListWrapper.fill(this.changes, false);
        ListWrapper.fill(this.localPipes, null);
        ListWrapper.fill(this.prevContexts, ChangeDetectionUtil.uninitialized);
    }
    /** @internal */
    _destroyPipes() {
        for (var i = 0; i < this.localPipes.length; ++i) {
            if (isPresent(this.localPipes[i])) {
                ChangeDetectionUtil.callPipeOnDestroy(this.localPipes[i]);
            }
        }
    }
    /** @internal */
    _destroyDirectives() {
        for (var i = 0; i < this._directiveRecords.length; ++i) {
            var record = this._directiveRecords[i];
            if (record.callOnDestroy) {
                this._getDirectiveFor(record.directiveIndex).ngOnDestroy();
            }
        }
    }
    checkNoChanges() { this.runDetectChanges(true); }
    detectChangesInRecordsInternal(throwOnChange) {
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
                    this.state == ChangeDetectorState.NeverChecked) {
                    this._getDirectiveFor(directiveRecord.directiveIndex).ngOnInit();
                }
                else if (proto.name === "OnChanges" && isPresent(changes) && !throwOnChange) {
                    this._getDirectiveFor(directiveRecord.directiveIndex).ngOnChanges(changes);
                }
            }
            else if (proto.isSkipRecord()) {
                protoIdx += this._computeSkipLength(protoIdx, proto, this.values);
            }
            else {
                var change = this._check(proto, throwOnChange, this.values, this.locals);
                if (isPresent(change)) {
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
    }
    /** @internal */
    _firstInBinding(r) {
        var prev = ChangeDetectionUtil.protoByIndex(this._records, r.selfIndex - 1);
        return isBlank(prev) || prev.bindingRecord !== r.bindingRecord;
    }
    afterContentLifecycleCallbacksInternal() {
        var dirs = this._directiveRecords;
        for (var i = dirs.length - 1; i >= 0; --i) {
            var dir = dirs[i];
            if (dir.callAfterContentInit && this.state == ChangeDetectorState.NeverChecked) {
                this._getDirectiveFor(dir.directiveIndex).ngAfterContentInit();
            }
            if (dir.callAfterContentChecked) {
                this._getDirectiveFor(dir.directiveIndex).ngAfterContentChecked();
            }
        }
    }
    afterViewLifecycleCallbacksInternal() {
        var dirs = this._directiveRecords;
        for (var i = dirs.length - 1; i >= 0; --i) {
            var dir = dirs[i];
            if (dir.callAfterViewInit && this.state == ChangeDetectorState.NeverChecked) {
                this._getDirectiveFor(dir.directiveIndex).ngAfterViewInit();
            }
            if (dir.callAfterViewChecked) {
                this._getDirectiveFor(dir.directiveIndex).ngAfterViewChecked();
            }
        }
    }
    /** @internal */
    _updateDirectiveOrElement(change, bindingRecord) {
        if (isBlank(bindingRecord.directiveRecord)) {
            super.notifyDispatcher(change.currentValue);
        }
        else {
            var directiveIndex = bindingRecord.directiveRecord.directiveIndex;
            bindingRecord.setter(this._getDirectiveFor(directiveIndex), change.currentValue);
        }
        if (this._genConfig.logBindingUpdate) {
            super.logBindingUpdate(change.currentValue);
        }
    }
    /** @internal */
    _addChange(bindingRecord, change, changes) {
        if (bindingRecord.callOnChanges()) {
            return super.addChange(changes, change.previousValue, change.currentValue);
        }
        else {
            return changes;
        }
    }
    /** @internal */
    _getDirectiveFor(directiveIndex) {
        return this.dispatcher.getDirectiveFor(directiveIndex);
    }
    /** @internal */
    _getDetectorFor(directiveIndex) {
        return this.dispatcher.getDetectorFor(directiveIndex);
    }
    /** @internal */
    _check(proto, throwOnChange, values, locals) {
        if (proto.isPipeRecord()) {
            return this._pipeCheck(proto, throwOnChange, values);
        }
        else {
            return this._referenceCheck(proto, throwOnChange, values, locals);
        }
    }
    /** @internal */
    _referenceCheck(proto, throwOnChange, values, locals) {
        if (this._pureFuncAndArgsDidNotChange(proto)) {
            this._setChanged(proto, false);
            return null;
        }
        var currValue = this._calculateCurrValue(proto, values, locals);
        if (proto.shouldBeChecked()) {
            var prevValue = this._readSelf(proto, values);
            var detectedChange = throwOnChange ?
                !ChangeDetectionUtil.devModeEqual(prevValue, currValue) :
                ChangeDetectionUtil.looseNotIdentical(prevValue, currValue);
            if (detectedChange) {
                if (proto.lastInBinding) {
                    var change = ChangeDetectionUtil.simpleChange(prevValue, currValue);
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
    _calculateCurrValue(proto, values, locals) {
        switch (proto.mode) {
            case RecordType.Self:
                return this._readContext(proto, values);
            case RecordType.Const:
                return proto.funcOrValue;
            case RecordType.PropertyRead:
                var context = this._readContext(proto, values);
                return proto.funcOrValue(context);
            case RecordType.SafeProperty:
                var context = this._readContext(proto, values);
                return isBlank(context) ? null : proto.funcOrValue(context);
            case RecordType.PropertyWrite:
                var context = this._readContext(proto, values);
                var value = this._readArgs(proto, values)[0];
                proto.funcOrValue(context, value);
                return value;
            case RecordType.KeyedWrite:
                var context = this._readContext(proto, values);
                var key = this._readArgs(proto, values)[0];
                var value = this._readArgs(proto, values)[1];
                context[key] = value;
                return value;
            case RecordType.Local:
                return locals.get(proto.name);
            case RecordType.InvokeMethod:
                var context = this._readContext(proto, values);
                var args = this._readArgs(proto, values);
                return proto.funcOrValue(context, args);
            case RecordType.SafeMethodInvoke:
                var context = this._readContext(proto, values);
                if (isBlank(context)) {
                    return null;
                }
                var args = this._readArgs(proto, values);
                return proto.funcOrValue(context, args);
            case RecordType.KeyedRead:
                var arg = this._readArgs(proto, values)[0];
                return this._readContext(proto, values)[arg];
            case RecordType.Chain:
                var args = this._readArgs(proto, values);
                return args[args.length - 1];
            case RecordType.InvokeClosure:
                return FunctionWrapper.apply(this._readContext(proto, values), this._readArgs(proto, values));
            case RecordType.Interpolate:
            case RecordType.PrimitiveOp:
            case RecordType.CollectionLiteral:
                return FunctionWrapper.apply(proto.funcOrValue, this._readArgs(proto, values));
            default:
                throw new BaseException(`Unknown operation ${proto.mode}`);
        }
    }
    _pipeCheck(proto, throwOnChange, values) {
        var context = this._readContext(proto, values);
        var selectedPipe = this._pipeFor(proto, context);
        if (!selectedPipe.pure || this._argsOrContextChanged(proto)) {
            var args = this._readArgs(proto, values);
            var currValue = selectedPipe.pipe.transform(context, args);
            if (proto.shouldBeChecked()) {
                var prevValue = this._readSelf(proto, values);
                var detectedChange = throwOnChange ?
                    !ChangeDetectionUtil.devModeEqual(prevValue, currValue) :
                    ChangeDetectionUtil.looseNotIdentical(prevValue, currValue);
                if (detectedChange) {
                    currValue = ChangeDetectionUtil.unwrapValue(currValue);
                    if (proto.lastInBinding) {
                        var change = ChangeDetectionUtil.simpleChange(prevValue, currValue);
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
    }
    _pipeFor(proto, context) {
        var storedPipe = this._readPipe(proto);
        if (isPresent(storedPipe))
            return storedPipe;
        var pipe = this.pipes.get(proto.name);
        this._writePipe(proto, pipe);
        return pipe;
    }
    _readContext(proto, values) {
        if (proto.contextIndex == -1) {
            return this._getDirectiveFor(proto.directiveIndex);
        }
        return values[proto.contextIndex];
    }
    _readSelf(proto, values) { return values[proto.selfIndex]; }
    _writeSelf(proto, value, values) { values[proto.selfIndex] = value; }
    _readPipe(proto) { return this.localPipes[proto.selfIndex]; }
    _writePipe(proto, value) { this.localPipes[proto.selfIndex] = value; }
    _setChanged(proto, value) {
        if (proto.argumentToPureFunction)
            this.changes[proto.selfIndex] = value;
    }
    _pureFuncAndArgsDidNotChange(proto) {
        return proto.isPureFunction() && !this._argsChanged(proto);
    }
    _argsChanged(proto) {
        var args = proto.args;
        for (var i = 0; i < args.length; ++i) {
            if (this.changes[args[i]]) {
                return true;
            }
        }
        return false;
    }
    _argsOrContextChanged(proto) {
        return this._argsChanged(proto) || this.changes[proto.contextIndex];
    }
    _readArgs(proto, values) {
        var res = ListWrapper.createFixedSize(proto.args.length);
        var args = proto.args;
        for (var i = 0; i < args.length; ++i) {
            res[i] = values[args[i]];
        }
        return res;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHluYW1pY19jaGFuZ2VfZGV0ZWN0b3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJkaWZmaW5nX3BsdWdpbl93cmFwcGVyLW91dHB1dF9wYXRoLW9YRE80cDJ2LnRtcC9hbmd1bGFyMi9zcmMvY29yZS9jaGFuZ2VfZGV0ZWN0aW9uL2R5bmFtaWNfY2hhbmdlX2RldGVjdG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJPQUFPLEVBQUMsU0FBUyxFQUFFLE9BQU8sRUFBRSxlQUFlLEVBQWdCLE1BQU0sMEJBQTBCO09BQ3BGLEVBQUMsYUFBYSxFQUFDLE1BQU0sZ0NBQWdDO09BQ3JELEVBQUMsV0FBVyxFQUErQixNQUFNLGdDQUFnQztPQUVqRixFQUFDLHNCQUFzQixFQUFDLE1BQU0sNEJBQTRCO09BTTFELEVBQUMsbUJBQW1CLEVBQWUsTUFBTSx5QkFBeUI7T0FDbEUsRUFBMEIsbUJBQW1CLEVBQUMsTUFBTSxhQUFhO09BQ2pFLEVBQWMsVUFBVSxFQUFDLE1BQU0sZ0JBQWdCO09BQy9DLEVBQUMsU0FBUyxFQUFDLE1BQU0seUNBQXlDO09BQzFELEVBQUMsaUJBQWlCLEVBQUMsTUFBTSwyQkFBMkI7QUFFM0QsMkNBQTJDLHNCQUFzQjtJQU0vRCxZQUFZLEVBQVUsRUFBRSw0QkFBb0MsRUFDaEQsc0JBQXVDLEVBQUUsZ0JBQWtDLEVBQzNFLFFBQWlDLEVBQVUsUUFBdUIsRUFDMUQsY0FBOEIsRUFBVSxpQkFBb0MsRUFDNUUsVUFBbUM7UUFDckQsTUFBTSxFQUFFLEVBQUUsNEJBQTRCLEVBQUUsc0JBQXNCLEVBQUUsZ0JBQWdCLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFIdkMsYUFBUSxHQUFSLFFBQVEsQ0FBZTtRQUMxRCxtQkFBYyxHQUFkLGNBQWMsQ0FBZ0I7UUFBVSxzQkFBaUIsR0FBakIsaUJBQWlCLENBQW1CO1FBQzVFLGVBQVUsR0FBVixVQUFVLENBQXlCO1FBRXJELElBQUksR0FBRyxHQUFHLFFBQVEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxD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cnQge2lzUHJlc2VudCwgaXNCbGFuaywgRnVuY3Rpb25XcmFwcGVyLCBTdHJpbmdXcmFwcGVyfSBmcm9tICdhbmd1bGFyMi9zcmMvZmFjYWRlL2xhbmcnO1xuaW1wb3J0IHtCYXNlRXhjZXB0aW9ufSBmcm9tICdhbmd1bGFyMi9zcmMvZmFjYWRlL2V4Y2VwdGlvbnMnO1xuaW1wb3J0IHtMaXN0V3JhcHBlciwgTWFwV3JhcHBlciwgU3RyaW5nTWFwV3JhcHBlcn0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9jb2xsZWN0aW9uJztcblxuaW1wb3J0IHtBYnN0cmFjdENoYW5nZURldGVjdG9yfSBmcm9tICcuL2Fic3RyYWN0X2NoYW5nZV9kZXRlY3Rvcic7XG5pbXBvcnQge0V2ZW50QmluZGluZ30gZnJvbSAnLi9ldmVudF9iaW5kaW5nJztcbmltcG9ydCB7QmluZGluZ1JlY29yZCwgQmluZGluZ1RhcmdldH0gZnJvbSAnLi9iaW5kaW5nX3JlY29yZCc7XG5pbXBvcnQge0RpcmVjdGl2ZVJlY29yZCwgRGlyZWN0aXZlSW5kZXh9IGZyb20gJy4vZGlyZWN0aXZlX3JlY29yZCc7XG5pbXBvcnQge0xvY2Fsc30gZnJvbSAnLi9wYXJzZXIvbG9jYWxzJztcbmltcG9ydCB7Q2hhbmdlRGlzcGF0Y2hlciwgQ2hhbmdlRGV0ZWN0b3JHZW5Db25maWd9IGZyb20gJy4vaW50ZXJmYWNlcyc7XG5pbXBvcnQge0NoYW5nZURldGVjdGlvblV0aWwsIFNpbXBsZUNoYW5nZX0gZnJvbSAnLi9jaGFuZ2VfZGV0ZWN0aW9uX3V0aWwnO1xuaW1wb3J0IHtDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSwgQ2hhbmdlRGV0ZWN0b3JTdGF0ZX0gZnJvbSAnLi9jb25zdGFudHMnO1xuaW1wb3J0IHtQcm90b1JlY29yZCwgUmVjb3JkVHlwZX0gZnJvbSAnLi9wcm90b19yZWNvcmQnO1xuaW1wb3J0IHtyZWZsZWN0b3J9IGZyb20gJ2FuZ3VsYXIyL3NyYy9jb3JlL3JlZmxlY3Rpb24vcmVmbGVjdGlvbic7XG5pbXBvcnQge09ic2VydmFibGVXcmFwcGVyfSBmcm9tICdhbmd1bGFyMi9zcmMvZmFjYWRlL2FzeW5jJztcblxuZXhwb3J0IGNsYXNzIER5bmFtaWNDaGFuZ2VEZXRlY3RvciBleHRlbmRzIEFic3RyYWN0Q2hhbmdlRGV0ZWN0b3I8YW55PiB7XG4gIHZhbHVlczogYW55W107XG4gIGNoYW5nZXM6IGFueVtdO1xuICBsb2NhbFBpcGVzOiBhbnlbXTtcbiAgcHJldkNvbnRleHRzOiBhbnlbXTtcblxuICBjb25zdHJ1Y3RvcihpZDogc3RyaW5nLCBudW1iZXJPZlByb3BlcnR5UHJvdG9SZWNvcmRzOiBudW1iZXIsXG4gICAgICAgICAgICAgIHByb3BlcnR5QmluZGluZ1RhcmdldHM6IEJpbmRpbmdUYXJnZXRbXSwgZGlyZWN0aXZlSW5kaWNlczogRGlyZWN0aXZlSW5kZXhbXSxcbiAgICAgICAgICAgICAgc3RyYXRlZ3k6IENoYW5nZURldGVjdGlvblN0cmF0ZWd5LCBwcml2YXRlIF9yZWNvcmRzOiBQcm90b1JlY29yZFtdLFxuICAgICAgICAgICAgICBwcml2YXRlIF9ldmVudEJpbmRpbmdzOiBFdmVudEJpbmRpbmdbXSwgcHJpdmF0ZSBfZGlyZWN0aXZlUmVjb3JkczogRGlyZWN0aXZlUmVjb3JkW10sXG4gICAgICAgICAgICAgIHByaXZhdGUgX2dlbkNvbmZpZzogQ2hhbmdlRGV0ZWN0b3JHZW5Db25maWcpIHtcbiAgICBzdXBlcihpZCwgbnVtYmVyT2ZQcm9wZXJ0eVByb3RvUmVjb3JkcywgcHJvcGVydHlCaW5kaW5nVGFyZ2V0cywgZGlyZWN0aXZlSW5kaWNlcywgc3RyYXRlZ3kpO1xuICAgIHZhciBsZW4gPSBfcmVjb3Jkcy5sZW5ndGggKyAxO1xuICAgIHRoaXMudmFsdWVzID0gTGlzdFdyYXBwZXIuY3JlYXRlRml4ZWRTaXplKGxlbik7XG4gICAgdGhpcy5sb2NhbFBpcGVzID0gTGlzdFdyYXBwZXIuY3JlYXRlRml4ZWRTaXplKGxlbik7XG4gICAgdGhpcy5wcmV2Q29udGV4dHMgPSBMaXN0V3JhcHBlci5jcmVhdGVGaXhlZFNpemUobGVuKTtcbiAgICB0aGlzLmNoYW5nZXMgPSBMaXN0V3JhcHBlci5jcmVhdGVGaXhlZFNpemUobGVuKTtcblxuICAgIHRoaXMuZGVoeWRyYXRlRGlyZWN0aXZlcyhmYWxzZSk7XG4gIH1cblxuICBoYW5kbGVFdmVudEludGVybmFsKGV2ZW50TmFtZTogc3RyaW5nLCBlbEluZGV4OiBudW1iZXIsIGxvY2FsczogTG9jYWxzKTogYm9vbGVhbiB7XG4gICAgdmFyIHByZXZlbnREZWZhdWx0ID0gZmFsc2U7XG5cbiAgICB0aGlzLl9tYXRjaGluZ0V2ZW50QmluZGluZ3MoZXZlbnROYW1lLCBlbEluZGV4KVxuICAgICAgICAuZm9yRWFjaChyZWMgPT4ge1xuICAgICAgICAgIHZhciByZXMgPSB0aGlzLl9wcm9jZXNzRXZlbnRCaW5kaW5nKHJlYywgbG9jYWxzKTtcbiAgICAgICAgICBpZiAocmVzID09PSBmYWxzZSkge1xuICAgICAgICAgICAgcHJldmVudERlZmF1bHQgPSB0cnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICByZXR1cm4gcHJldmVudERlZmF1bHQ7XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIF9wcm9jZXNzRXZlbnRCaW5kaW5nKGViOiBFdmVudEJpbmRpbmcsIGxvY2FsczogTG9jYWxzKTogYW55IHtcbiAgICB2YXIgdmFsdWVzID0gTGlzdFdyYXBwZXIuY3JlYXRlRml4ZWRTaXplKGViLnJlY29yZHMubGVuZ3RoKTtcbiAgICB2YWx1ZXNbMF0gPSB0aGlzLnZhbHVlc1swXTtcblxuICAgIGZvciAodmFyIHByb3RvSWR4ID0gMDsgcHJvdG9JZHggPCBlYi5yZWNvcmRzLmxlbmd0aDsgKytwcm90b0lkeCkge1xuICAgICAgdmFyIHByb3RvID0gZWIucmVjb3Jkc1twcm90b0lkeF07XG5cbiAgICAgIGlmIChwcm90by5pc1NraXBSZWNvcmQoKSkge1xuICAgICAgICBwcm90b0lkeCArPSB0aGlzLl9jb21wdXRlU2tpcExlbmd0aChwcm90b0lkeCwgcHJvdG8sIHZhbHVlcyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAocHJvdG8ubGFzdEluQmluZGluZykge1xuICAgICAgICAgIHRoaXMuX21hcmtQYXRoQXNDaGVja09uY2UocHJvdG8pO1xuICAgICAgICB9XG4gICAgICAgIHZhciByZXMgPSB0aGlzLl9jYWxjdWxhdGVDdXJyVmFsdWUocHJvdG8sIHZhbHVlcywgbG9jYWxzKTtcbiAgICAgICAgaWYgKHByb3RvLmxhc3RJbkJpbmRpbmcpIHtcbiAgICAgICAgICByZXR1cm4gcmVzO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuX3dyaXRlU2VsZihwcm90bywgcmVzLCB2YWx1ZXMpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhyb3cgbmV3IEJhc2VFeGNlcHRpb24oXCJDYW5ub3QgYmUgcmVhY2hlZFwiKTtcbiAgfVxuXG4gIHByaXZhdGUgX2NvbXB1dGVTa2lwTGVuZ3RoKHByb3RvSW5kZXg6IG51bWJlciwgcHJvdG86IFByb3RvUmVjb3JkLCB2YWx1ZXM6IGFueVtdKTogbnVtYmVyIHtcbiAgICBpZiAocHJvdG8ubW9kZSA9PT0gUmVjb3JkVHlwZS5Ta2lwUmVjb3Jkcykge1xuICAgICAgcmV0dXJuIHByb3RvLmZpeGVkQXJnc1swXSAtIHByb3RvSW5kZXggLSAxO1xuICAgIH1cblxuICAgIGlmIChwcm90by5tb2RlID09PSBSZWNvcmRUeXBlLlNraXBSZWNvcmRzSWYpIHtcbiAgICAgIGxldCBjb25kaXRpb24gPSB0aGlzLl9yZWFkQ29udGV4dChwcm90bywgdmFsdWVzKTtcbiAgICAgIHJldHVybiBjb25kaXRpb24gPyBwcm90by5maXhlZEFyZ3NbMF0gLSBwcm90b0luZGV4IC0gMSA6IDA7XG4gICAgfVxuXG4gICAgaWYgKHByb3RvLm1vZGUgPT09IFJlY29yZFR5cGUuU2tpcFJlY29yZHNJZk5vdCkge1xuICAgICAgbGV0IGNvbmRpdGlvbiA9IHRoaXMuX3JlYWRDb250ZXh0KHByb3RvLCB2YWx1ZXMpO1xuICAgICAgcmV0dXJuIGNvbmRpdGlvbiA/IDAgOiBwcm90by5maXhlZEFyZ3NbMF0gLSBwcm90b0luZGV4IC0gMTtcbiAgICB9XG5cbiAgICB0aHJvdyBuZXcgQmFzZUV4Y2VwdGlvbihcIkNhbm5vdCBiZSByZWFjaGVkXCIpO1xuICB9XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfbWFya1BhdGhBc0NoZWNrT25jZShwcm90bzogUHJvdG9SZWNvcmQpOiB2b2lkIHtcbiAgICBpZiAoIXByb3RvLmJpbmRpbmdSZWNvcmQuaXNEZWZhdWx0Q2hhbmdlRGV0ZWN0aW9uKCkpIHtcbiAgICAgIHZhciBkaXIgPSBwcm90by5iaW5kaW5nUmVjb3JkLmRpcmVjdGl2ZVJlY29yZDtcbiAgICAgIHRoaXMuX2dldERldGVjdG9yRm9yKGRpci5kaXJlY3RpdmVJbmRleCkubWFya1BhdGhUb1Jvb3RBc0NoZWNrT25jZSgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX21hdGNoaW5nRXZlbnRCaW5kaW5ncyhldmVudE5hbWU6IHN0cmluZywgZWxJbmRleDogbnVtYmVyKTogRXZlbnRCaW5kaW5nW10ge1xuICAgIHJldHVybiB0aGlzLl9ldmVudEJpbmRpbmdzLmZpbHRlcihlYiA9PiBlYi5ldmVudE5hbWUgPT0gZXZlbnROYW1lICYmIGViLmVsSW5kZXggPT09IGVsSW5kZXgpO1xuICB9XG5cbiAgaHlkcmF0ZURpcmVjdGl2ZXMoZGlzcGF0Y2hlcjogQ2hhbmdlRGlzcGF0Y2hlcik6IHZvaWQge1xuICAgIHRoaXMudmFsdWVzWzBdID0gdGhpcy5jb250ZXh0O1xuICAgIHRoaXMuZGlzcGF0Y2hlciA9IGRpc3BhdGNoZXI7XG5cbiAgICB0aGlzLm91dHB1dFN1YnNjcmlwdGlvbnMgPSBbXTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuX2RpcmVjdGl2ZVJlY29yZHMubGVuZ3RoOyArK2kpIHtcbiAgICAgIHZhciByID0gdGhpcy5fZGlyZWN0aXZlUmVjb3Jkc1tpXTtcbiAgICAgIGlmIChpc1ByZXNlbnQoci5vdXRwdXRzKSkge1xuICAgICAgICByLm91dHB1dHMuZm9yRWFjaChvdXRwdXQgPT4ge1xuICAgICAgICAgIHZhciBldmVudEhhbmRsZXIgPVxuICAgICAgICAgICAgICA8YW55PnRoaXMuX2NyZWF0ZUV2ZW50SGFuZGxlcihyLmRpcmVjdGl2ZUluZGV4LmVsZW1lbnRJbmRleCwgb3V0cHV0WzFdKTtcbiAgICAgICAgICB2YXIgZGlyZWN0aXZlID0gdGhpcy5fZ2V0RGlyZWN0aXZlRm9yKHIuZGlyZWN0aXZlSW5kZXgpO1xuICAgICAgICAgIHZhciBnZXR0ZXIgPSByZWZsZWN0b3IuZ2V0dGVyKG91dHB1dFswXSk7XG4gICAgICAgICAgdGhpcy5vdXRwdXRTdWJzY3JpcHRpb25zLnB1c2goXG4gICAgICAgICAgICAgIE9ic2VydmFibGVXcmFwcGVyLnN1YnNjcmliZShnZXR0ZXIoZGlyZWN0aXZlKSwgZXZlbnRIYW5kbGVyKSk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX2NyZWF0ZUV2ZW50SGFuZGxlcihib3VuZEVsZW1lbnRJbmRleDogbnVtYmVyLCBldmVudE5hbWU6IHN0cmluZyk6IEZ1bmN0aW9uIHtcbiAgICByZXR1cm4gKGV2ZW50KSA9PiB0aGlzLmhhbmRsZUV2ZW50KGV2ZW50TmFtZSwgYm91bmRFbGVtZW50SW5kZXgsIGV2ZW50KTtcbiAgfVxuXG5cbiAgZGVoeWRyYXRlRGlyZWN0aXZlcyhkZXN0cm95UGlwZXM6IGJvb2xlYW4pIHtcbiAgICBpZiAoZGVzdHJveVBpcGVzKSB7XG4gICAgICB0aGlzLl9kZXN0cm95UGlwZXMoKTtcbiAgICAgIHRoaXMuX2Rlc3Ryb3lEaXJlY3RpdmVzKCk7XG4gICAgfVxuICAgIHRoaXMudmFsdWVzWzBdID0gbnVsbDtcbiAgICBMaXN0V3JhcHBlci5maWxsKHRoaXMudmFsdWVzLCBDaGFuZ2VEZXRlY3Rpb25VdGlsLnVuaW5pdGlhbGl6ZWQsIDEpO1xuICAgIExpc3RXcmFwcGVyLmZpbGwodGhpcy5jaGFuZ2VzLCBmYWxzZSk7XG4gICAgTGlzdFdyYXBwZXIuZmlsbCh0aGlzLmxvY2FsUGlwZXMsIG51bGwpO1xuICAgIExpc3RXcmFwcGVyLmZpbGwodGhpcy5wcmV2Q29udGV4dHMsIENoYW5nZURldGVjdGlvblV0aWwudW5pbml0aWFsaXplZCk7XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIF9kZXN0cm95UGlwZXMoKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmxvY2FsUGlwZXMubGVuZ3RoOyArK2kpIHtcbiAgICAgIGlmIChpc1ByZXNlbnQodGhpcy5sb2NhbFBpcGVzW2ldKSkge1xuICAgICAgICBDaGFuZ2VEZXRlY3Rpb25VdGlsLmNhbGxQaXBlT25EZXN0cm95KHRoaXMubG9jYWxQaXBlc1tpXSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfZGVzdHJveURpcmVjdGl2ZXMoKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLl9kaXJlY3RpdmVSZWNvcmRzLmxlbmd0aDsgKytpKSB7XG4gICAgICB2YXIgcmVjb3JkID0gdGhpcy5fZGlyZWN0aXZlUmVjb3Jkc1tpXTtcbiAgICAgIGlmIChyZWNvcmQuY2FsbE9uRGVzdHJveSkge1xuICAgICAgICB0aGlzLl9nZXREaXJlY3RpdmVGb3IocmVjb3JkLmRpcmVjdGl2ZUluZGV4KS5uZ09uRGVzdHJveSgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGNoZWNrTm9DaGFuZ2VzKCk6IHZvaWQgeyB0aGlzLnJ1bkRldGVjdENoYW5nZXModHJ1ZSk7IH1cblxuICBkZXRlY3RDaGFuZ2VzSW5SZWNvcmRzSW50ZXJuYWwodGhyb3dPbkNoYW5nZTogYm9vbGVhbikge1xuICAgIHZhciBwcm90b3MgPSB0aGlzLl9yZWNvcmRzO1xuXG4gICAgdmFyIGNoYW5nZXMgPSBudWxsO1xuICAgIHZhciBpc0NoYW5nZWQgPSBmYWxzZTtcbiAgICBmb3IgKHZhciBwcm90b0lkeCA9IDA7IHByb3RvSWR4IDwgcHJvdG9zLmxlbmd0aDsgKytwcm90b0lkeCkge1xuICAgICAgdmFyIHByb3RvOiBQcm90b1JlY29yZCA9IHByb3Rvc1twcm90b0lkeF07XG4gICAgICB2YXIgYmluZGluZ1JlY29yZCA9IHByb3RvLmJpbmRpbmdSZWNvcmQ7XG4gICAgICB2YXIgZGlyZWN0aXZlUmVjb3JkID0gYmluZGluZ1JlY29yZC5kaXJlY3RpdmVSZWNvcmQ7XG5cbiAgICAgIGlmICh0aGlzLl9maXJzdEluQmluZGluZyhwcm90bykpIHtcbiAgICAgICAgdGhpcy5wcm9wZXJ0eUJpbmRpbmdJbmRleCA9IHByb3RvLnByb3BlcnR5QmluZGluZ0luZGV4O1xuICAgICAgfVxuXG4gICAgICBpZiAocHJvdG8uaXNMaWZlQ3ljbGVSZWNvcmQoKSkge1xuICAgICAgICBpZiAocHJvdG8ubmFtZSA9PT0gXCJEb0NoZWNrXCIgJiYgIXRocm93T25DaGFuZ2UpIHtcbiAgICAgICAgICB0aGlzLl9nZXREaXJlY3RpdmVGb3IoZGlyZWN0aXZlUmVjb3JkLmRpcmVjdGl2ZUluZGV4KS5uZ0RvQ2hlY2soKTtcbiAgICAgICAgfSBlbHNlIGlmIChwcm90by5uYW1lID09PSBcIk9uSW5pdFwiICYmICF0aHJvd09uQ2hhbmdlICYmXG4gICAgICAgICAgICAgICAgICAgdGhpcy5zdGF0ZSA9PSBDaGFuZ2VEZXRlY3RvclN0YXRlLk5ldmVyQ2hlY2tlZCkge1xuICAgICAgICAgIHRoaXMuX2dldERpcmVjdGl2ZUZvcihkaXJlY3RpdmVSZWNvcmQuZGlyZWN0aXZlSW5kZXgpLm5nT25Jbml0KCk7XG4gICAgICAgIH0gZWxzZSBpZiAocHJvdG8ubmFtZSA9PT0gXCJPbkNoYW5nZXNcIiAmJiBpc1ByZXNlbnQoY2hhbmdlcykgJiYgIXRocm93T25DaGFuZ2UpIHtcbiAgICAgICAgICB0aGlzLl9nZXREaXJlY3RpdmVGb3IoZGlyZWN0aXZlUmVjb3JkLmRpcmVjdGl2ZUluZGV4KS5uZ09uQ2hhbmdlcyhjaGFuZ2VzKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChwcm90by5pc1NraXBSZWNvcmQoKSkge1xuICAgICAgICBwcm90b0lkeCArPSB0aGlzLl9jb21wdXRlU2tpcExlbmd0aChwcm90b0lkeCwgcHJvdG8sIHRoaXMudmFsdWVzKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciBjaGFuZ2UgPSB0aGlzLl9jaGVjayhwcm90bywgdGhyb3dPbkNoYW5nZSwgdGhpcy52YWx1ZXMsIHRoaXMubG9jYWxzKTtcbiAgICAgICAgaWYgKGlzUHJlc2VudChjaGFuZ2UpKSB7XG4gICAgICAgICAgdGhpcy5fdXBkYXRlRGlyZWN0aXZlT3JFbGVtZW50KGNoYW5nZSwgYmluZGluZ1JlY29yZCk7XG4gICAgICAgICAgaXNDaGFuZ2VkID0gdHJ1ZTtcbiAgICAgICAgICBjaGFuZ2VzID0gdGhpcy5fYWRkQ2hhbmdlKGJpbmRpbmdSZWNvcmQsIGNoYW5nZSwgY2hhbmdlcyk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKHByb3RvLmxhc3RJbkRpcmVjdGl2ZSkge1xuICAgICAgICBjaGFuZ2VzID0gbnVsbDtcbiAgICAgICAgaWYgKGlzQ2hhbmdlZCAmJiAhYmluZGluZ1JlY29yZC5pc0RlZmF1bHRDaGFuZ2VEZXRlY3Rpb24oKSkge1xuICAgICAgICAgIHRoaXMuX2dldERldGVjdG9yRm9yKGRpcmVjdGl2ZVJlY29yZC5kaXJlY3RpdmVJbmRleCkubWFya0FzQ2hlY2tPbmNlKCk7XG4gICAgICAgIH1cblxuICAgICAgICBpc0NoYW5nZWQgPSBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIF9maXJzdEluQmluZGluZyhyOiBQcm90b1JlY29yZCk6IGJvb2xlYW4ge1xuICAgIHZhciBwcmV2ID0gQ2hhbmdlRGV0ZWN0aW9uVXRpbC5wcm90b0J5SW5kZXgodGhpcy5fcmVjb3Jkcywgci5zZWxmSW5kZXggLSAxKTtcbiAgICByZXR1cm4gaXNCbGFuayhwcmV2KSB8fCBwcmV2LmJpbmRpbmdSZWNvcmQgIT09IHIuYmluZGluZ1JlY29yZDtcbiAgfVxuXG4gIGFmdGVyQ29udGVudExpZmVjeWNsZUNhbGxiYWNrc0ludGVybmFsKCkge1xuICAgIHZhciBkaXJzID0gdGhpcy5fZGlyZWN0aXZlUmVjb3JkcztcbiAgICBmb3IgKHZhciBpID0gZGlycy5sZW5ndGggLSAxOyBpID49IDA7IC0taSkge1xuICAgICAgdmFyIGRpciA9IGRpcnNbaV07XG4gICAgICBpZiAoZGlyLmNhbGxBZnRlckNvbnRlbnRJbml0ICYmIHRoaXMuc3RhdGUgPT0gQ2hhbmdlRGV0ZWN0b3JTdGF0ZS5OZXZlckNoZWNrZWQpIHtcbiAgICAgICAgdGhpcy5fZ2V0RGlyZWN0aXZlRm9yKGRpci5kaXJlY3RpdmVJbmRleCkubmdBZnRlckNvbnRlbnRJbml0KCk7XG4gICAgICB9XG5cbiAgICAgIGlmIChkaXIuY2FsbEFmdGVyQ29udGVudENoZWNrZWQpIHtcbiAgICAgICAgdGhpcy5fZ2V0RGlyZWN0aXZlRm9yKGRpci5kaXJlY3RpdmVJbmRleCkubmdBZnRlckNvbnRlbnRDaGVja2VkKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgYWZ0ZXJWaWV3TGlmZWN5Y2xlQ2FsbGJhY2tzSW50ZXJuYWwoKSB7XG4gICAgdmFyIGRpcnMgPSB0aGlzLl9kaXJlY3RpdmVSZWNvcmRzO1xuICAgIGZvciAodmFyIGkgPSBkaXJzLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICB2YXIgZGlyID0gZGlyc1tpXTtcbiAgICAgIGlmIChkaXIuY2FsbEFmdGVyVmlld0luaXQgJiYgdGhpcy5zdGF0ZSA9PSBDaGFuZ2VEZXRlY3RvclN0YXRlLk5ldmVyQ2hlY2tlZCkge1xuICAgICAgICB0aGlzLl9nZXREaXJlY3RpdmVGb3IoZGlyLmRpcmVjdGl2ZUluZGV4KS5uZ0FmdGVyVmlld0luaXQoKTtcbiAgICAgIH1cbiAgICAgIGlmIChkaXIuY2FsbEFmdGVyVmlld0NoZWNrZWQpIHtcbiAgICAgICAgdGhpcy5fZ2V0RGlyZWN0aXZlRm9yKGRpci5kaXJlY3RpdmVJbmRleCkubmdBZnRlclZpZXdDaGVja2VkKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBwcml2YXRlIF91cGRhdGVEaXJlY3RpdmVPckVsZW1lbnQoY2hhbmdlLCBiaW5kaW5nUmVjb3JkKSB7XG4gICAgaWYgKGlzQmxhbmsoYmluZGluZ1JlY29yZC5kaXJlY3RpdmVSZWNvcmQpKSB7XG4gICAgICBzdXBlci5ub3RpZnlEaXNwYXRjaGVyKGNoYW5nZS5jdXJyZW50VmFsdWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgZGlyZWN0aXZlSW5kZXggPSBiaW5kaW5nUmVjb3JkLmRpcmVjdGl2ZVJlY29yZC5kaXJlY3RpdmVJbmRleDtcbiAgICAgIGJpbmRpbmdSZWNvcmQuc2V0dGVyKHRoaXMuX2dldERpcmVjdGl2ZUZvcihkaXJlY3RpdmVJbmRleCksIGNoYW5nZS5jdXJyZW50VmFsdWUpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9nZW5Db25maWcubG9nQmluZGluZ1VwZGF0ZSkge1xuICAgICAgc3VwZXIubG9nQmluZGluZ1VwZGF0ZShjaGFuZ2UuY3VycmVudFZhbHVlKTtcbiAgICB9XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIHByaXZhdGUgX2FkZENoYW5nZShiaW5kaW5nUmVjb3JkOiBCaW5kaW5nUmVjb3JkLCBjaGFuZ2UsIGNoYW5nZXMpIHtcbiAgICBpZiAoYmluZGluZ1JlY29yZC5jYWxsT25DaGFuZ2VzKCkpIHtcbiAgICAgIHJldHVybiBzdXBlci5hZGRDaGFuZ2UoY2hhbmdlcywgY2hhbmdlLnByZXZpb3VzVmFsdWUsIGNoYW5nZS5jdXJyZW50VmFsdWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gY2hhbmdlcztcbiAgICB9XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIHByaXZhdGUgX2dldERpcmVjdGl2ZUZvcihkaXJlY3RpdmVJbmRleDogRGlyZWN0aXZlSW5kZXgpIHtcbiAgICByZXR1cm4gdGhpcy5kaXNwYXRjaGVyLmdldERpcmVjdGl2ZUZvcihkaXJlY3RpdmVJbmRleCk7XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIHByaXZhdGUgX2dldERldGVjdG9yRm9yKGRpcmVjdGl2ZUluZGV4OiBEaXJlY3RpdmVJbmRleCkge1xuICAgIHJldHVybiB0aGlzLmRpc3BhdGNoZXIuZ2V0RGV0ZWN0b3JGb3IoZGlyZWN0aXZlSW5kZXgpO1xuICB9XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBwcml2YXRlIF9jaGVjayhwcm90bzogUHJvdG9SZWNvcmQsIHRocm93T25DaGFuZ2U6IGJvb2xlYW4sIHZhbHVlczogYW55W10sXG4gICAgICAgICAgICAgICAgIGxvY2FsczogTG9jYWxzKTogU2ltcGxlQ2hhbmdlIHtcbiAgICBpZiAocHJvdG8uaXNQaXBlUmVjb3JkKCkpIHtcbiAgICAgIHJldHVybiB0aGlzLl9waXBlQ2hlY2socHJvdG8sIHRocm93T25DaGFuZ2UsIHZhbHVlcyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLl9yZWZlcmVuY2VDaGVjayhwcm90bywgdGhyb3dPbkNoYW5nZSwgdmFsdWVzLCBsb2NhbHMpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgcHJpdmF0ZSBfcmVmZXJlbmNlQ2hlY2socHJvdG86IFByb3RvUmVjb3JkLCB0aHJvd09uQ2hhbmdlOiBib29sZWFuLCB2YWx1ZXM6IGFueVtdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBsb2NhbHM6IExvY2Fscykge1xuICAgIGlmICh0aGlzLl9wdXJlRnVuY0FuZEFyZ3NEaWROb3RDaGFuZ2UocHJvdG8pKSB7XG4gICAgICB0aGlzLl9zZXRDaGFuZ2VkKHByb3RvLCBmYWxzZSk7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICB2YXIgY3VyclZhbHVlID0gdGhpcy5fY2FsY3VsYXRlQ3VyclZhbHVlKHByb3RvLCB2YWx1ZXMsIGxvY2Fscyk7XG5cbiAgICBpZiAocHJvdG8uc2hvdWxkQmVDaGVja2VkKCkpIHtcbiAgICAgIHZhciBwcmV2VmFsdWUgPSB0aGlzLl9yZWFkU2VsZihwcm90bywgdmFsdWVzKTtcbiAgICAgIHZhciBkZXRlY3RlZENoYW5nZSA9IHRocm93T25DaGFuZ2UgP1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICFDaGFuZ2VEZXRlY3Rpb25VdGlsLmRldk1vZGVFcXVhbChwcmV2VmFsdWUsIGN1cnJWYWx1ZSkgOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIENoYW5nZURldGVjdGlvblV0aWwubG9vc2VOb3RJZGVudGljYWwocHJldlZhbHVlLCBjdXJyVmFsdWUpO1xuICAgICAgaWYgKGRldGVjdGVkQ2hhbmdlKSB7XG4gICAgICAgIGlmIChwcm90by5sYXN0SW5CaW5kaW5nKSB7XG4gICAgICAgICAgdmFyIGNoYW5nZSA9IENoYW5nZURldGVjdGlvblV0aWwuc2ltcGxlQ2hhbmdlKHByZXZWYWx1ZSwgY3VyclZhbHVlKTtcbiAgICAgICAgICBpZiAodGhyb3dPbkNoYW5nZSkgdGhpcy50aHJvd09uQ2hhbmdlRXJyb3IocHJldlZhbHVlLCBjdXJyVmFsdWUpO1xuXG4gICAgICAgICAgdGhpcy5fd3JpdGVTZWxmKHByb3RvLCBjdXJyVmFsdWUsIHZhbHVlcyk7XG4gICAgICAgICAgdGhpcy5fc2V0Q2hhbmdlZChwcm90bywgdHJ1ZSk7XG4gICAgICAgICAgcmV0dXJuIGNoYW5nZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLl93cml0ZVNlbGYocHJvdG8sIGN1cnJWYWx1ZSwgdmFsdWVzKTtcbiAgICAgICAgICB0aGlzLl9zZXRDaGFuZ2VkKHByb3RvLCB0cnVlKTtcbiAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fc2V0Q2hhbmdlZChwcm90bywgZmFsc2UpO1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cblxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl93cml0ZVNlbGYocHJvdG8sIGN1cnJWYWx1ZSwgdmFsdWVzKTtcbiAgICAgIHRoaXMuX3NldENoYW5nZWQocHJvdG8sIHRydWUpO1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfY2FsY3VsYXRlQ3VyclZhbHVlKHByb3RvOiBQcm90b1JlY29yZCwgdmFsdWVzOiBhbnlbXSwgbG9jYWxzOiBMb2NhbHMpIHtcbiAgICBzd2l0Y2ggKHByb3RvLm1vZGUpIHtcbiAgICAgIGNhc2UgUmVjb3JkVHlwZS5TZWxmOlxuICAgICAgICByZXR1cm4gdGhpcy5fcmVhZENvbnRleHQocHJvdG8sIHZhbHVlcyk7XG5cbiAgICAgIGNhc2UgUmVjb3JkVHlwZS5Db25zdDpcbiAgICAgICAgcmV0dXJuIHByb3RvLmZ1bmNPclZhbHVlO1xuXG4gICAgICBjYXNlIFJlY29yZFR5cGUuUHJvcGVydHlSZWFkOlxuICAgICAgICB2YXIgY29udGV4dCA9IHRoaXMuX3JlYWRDb250ZXh0KHByb3RvLCB2YWx1ZXMpO1xuICAgICAgICByZXR1cm4gcHJvdG8uZnVuY09yVmFsdWUoY29udGV4dCk7XG5cbiAgICAgIGNhc2UgUmVjb3JkVHlwZS5TYWZlUHJvcGVydHk6XG4gICAgICAgIHZhciBjb250ZXh0ID0gdGhpcy5fcmVhZENvbnRleHQocHJvdG8sIHZhbHVlcyk7XG4gICAgICAgIHJldHVybiBpc0JsYW5rKGNvbnRleHQpID8gbnVsbCA6IHByb3RvLmZ1bmNPclZhbHVlKGNvbnRleHQpO1xuXG4gICAgICBjYXNlIFJlY29yZFR5cGUuUHJvcGVydHlXcml0ZTpcbiAgICAgICAgdmFyIGNvbnRleHQgPSB0aGlzLl9yZWFkQ29udGV4dChwcm90bywgdmFsdWVzKTtcbiAgICAgICAgdmFyIHZhbHVlID0gdGhpcy5fcmVhZEFyZ3MocHJvdG8sIHZhbHVlcylbMF07XG4gICAgICAgIHByb3RvLmZ1bmNPclZhbHVlKGNvbnRleHQsIHZhbHVlKTtcbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuXG4gICAgICBjYXNlIFJlY29yZFR5cGUuS2V5ZWRXcml0ZTpcbiAgICAgICAgdmFyIGNvbnRleHQgPSB0aGlzLl9yZWFkQ29udGV4dChwcm90bywgdmFsdWVzKTtcbiAgICAgICAgdmFyIGtleSA9IHRoaXMuX3JlYWRBcmdzKHByb3RvLCB2YWx1ZXMpWzBdO1xuICAgICAgICB2YXIgdmFsdWUgPSB0aGlzLl9yZWFkQXJncyhwcm90bywgdmFsdWVzKVsxXTtcbiAgICAgICAgY29udGV4dFtrZXldID0gdmFsdWU7XG4gICAgICAgIHJldHVybiB2YWx1ZTtcblxuICAgICAgY2FzZSBSZWNvcmRUeXBlLkxvY2FsOlxuICAgICAgICByZXR1cm4gbG9jYWxzLmdldChwcm90by5uYW1lKTtcblxuICAgICAgY2FzZSBSZWNvcmRUeXBlLkludm9rZU1ldGhvZDpcbiAgICAgICAgdmFyIGNvbnRleHQgPSB0aGlzLl9yZWFkQ29udGV4dChwcm90bywgdmFsdWVzKTtcbiAgICAgICAgdmFyIGFyZ3MgPSB0aGlzLl9yZWFkQXJncyhwcm90bywgdmFsdWVzKTtcbiAgICAgICAgcmV0dXJuIHByb3RvLmZ1bmNPclZhbHVlKGNvbnRleHQsIGFyZ3MpO1xuXG4gICAgICBjYXNlIFJlY29yZFR5cGUuU2FmZU1ldGhvZEludm9rZTpcbiAgICAgICAgdmFyIGNvbnRleHQgPSB0aGlzLl9yZWFkQ29udGV4dChwcm90bywgdmFsdWVzKTtcbiAgICAgICAgaWYgKGlzQmxhbmsoY29udGV4dCkpIHtcbiAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICB2YXIgYXJncyA9IHRoaXMuX3JlYWRBcmdzKHByb3RvLCB2YWx1ZXMpO1xuICAgICAgICByZXR1cm4gcHJvdG8uZnVuY09yVmFsdWUoY29udGV4dCwgYXJncyk7XG5cbiAgICAgIGNhc2UgUmVjb3JkVHlwZS5LZXllZFJlYWQ6XG4gICAgICAgIHZhciBhcmcgPSB0aGlzLl9yZWFkQXJncyhwcm90bywgdmFsdWVzKVswXTtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3JlYWRDb250ZXh0KHByb3RvLCB2YWx1ZXMpW2FyZ107XG5cbiAgICAgIGNhc2UgUmVjb3JkVHlwZS5DaGFpbjpcbiAgICAgICAgdmFyIGFyZ3MgPSB0aGlzLl9yZWFkQXJncyhwcm90bywgdmFsdWVzKTtcbiAgICAgICAgcmV0dXJuIGFyZ3NbYXJncy5sZW5ndGggLSAxXTtcblxuICAgICAgY2FzZSBSZWNvcmRUeXBlLkludm9rZUNsb3N1cmU6XG4gICAgICAgIHJldHVybiBGdW5jdGlvbldyYXBwZXIuYXBwbHkodGhpcy5fcmVhZENvbnRleHQocHJvdG8sIHZhbHVlcyksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fcmVhZEFyZ3MocHJvdG8sIHZhbHVlcykpO1xuXG4gICAgICBjYXNlIFJlY29yZFR5cGUuSW50ZXJwb2xhdGU6XG4gICAgICBjYXNlIFJlY29yZFR5cGUuUHJpbWl0aXZlT3A6XG4gICAgICBjYXNlIFJlY29yZFR5cGUuQ29sbGVjdGlvbkxpdGVyYWw6XG4gICAgICAgIHJldHVybiBGdW5jdGlvbldyYXBwZXIuYXBwbHkocHJvdG8uZnVuY09yVmFsdWUsIHRoaXMuX3JlYWRBcmdzKHByb3RvLCB2YWx1ZXMpKTtcblxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgdGhyb3cgbmV3IEJhc2VFeGNlcHRpb24oYFVua25vd24gb3BlcmF0aW9uICR7cHJvdG8ubW9kZX1gKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF9waXBlQ2hlY2socHJvdG86IFByb3RvUmVjb3JkLCB0aHJvd09uQ2hhbmdlOiBib29sZWFuLCB2YWx1ZXM6IGFueVtdKSB7XG4gICAgdmFyIGNvbnRleHQgPSB0aGlzLl9yZWFkQ29udGV4dChwcm90bywgdmFsdWVzKTtcbiAgICB2YXIgc2VsZWN0ZWRQaXBlID0gdGhpcy5fcGlwZUZvcihwcm90bywgY29udGV4dCk7XG4gICAgaWYgKCFzZWxlY3RlZFBpcGUucHVyZSB8fCB0aGlzLl9hcmdzT3JDb250ZXh0Q2hhbmdlZChwcm90bykpIHtcbiAgICAgIHZhciBhcmdzID0gdGhpcy5fcmVhZEFyZ3MocHJvdG8sIHZhbHVlcyk7XG4gICAgICB2YXIgY3VyclZhbHVlID0gc2VsZWN0ZWRQaXBlLnBpcGUudHJhbnNmb3JtKGNvbnRleHQsIGFyZ3MpO1xuXG4gICAgICBpZiAocHJvdG8uc2hvdWxkQmVDaGVja2VkKCkpIHtcbiAgICAgICAgdmFyIHByZXZWYWx1ZSA9IHRoaXMuX3JlYWRTZWxmKHByb3RvLCB2YWx1ZXMpO1xuICAgICAgICB2YXIgZGV0ZWN0ZWRDaGFuZ2UgPSB0aHJvd09uQ2hhbmdlID9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICFDaGFuZ2VEZXRlY3Rpb25VdGlsLmRldk1vZGVFcXVhbChwcmV2VmFsdWUsIGN1cnJWYWx1ZSkgOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQ2hhbmdlRGV0ZWN0aW9uVXRpbC5sb29zZU5vdElkZW50aWNhbChwcmV2VmFsdWUsIGN1cnJWYWx1ZSk7XG4gICAgICAgIGlmIChkZXRlY3RlZENoYW5nZSkge1xuICAgICAgICAgIGN1cnJWYWx1ZSA9IENoYW5nZURldGVjdGlvblV0aWwudW53cmFwVmFsdWUoY3VyclZhbHVlKTtcblxuICAgICAgICAgIGlmIChwcm90by5sYXN0SW5CaW5kaW5nKSB7XG4gICAgICAgICAgICB2YXIgY2hhbmdlID0gQ2hhbmdlRGV0ZWN0aW9uVXRpbC5zaW1wbGVDaGFuZ2UocHJldlZhbHVlLCBjdXJyVmFsdWUpO1xuICAgICAgICAgICAgaWYgKHRocm93T25DaGFuZ2UpIHRoaXMudGhyb3dPbkNoYW5nZUVycm9yKHByZXZWYWx1ZSwgY3VyclZhbHVlKTtcblxuICAgICAgICAgICAgdGhpcy5fd3JpdGVTZWxmKHByb3RvLCBjdXJyVmFsdWUsIHZhbHVlcyk7XG4gICAgICAgICAgICB0aGlzLl9zZXRDaGFuZ2VkKHByb3RvLCB0cnVlKTtcblxuICAgICAgICAgICAgcmV0dXJuIGNoYW5nZTtcblxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl93cml0ZVNlbGYocHJvdG8sIGN1cnJWYWx1ZSwgdmFsdWVzKTtcbiAgICAgICAgICAgIHRoaXMuX3NldENoYW5nZWQocHJvdG8sIHRydWUpO1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuX3NldENoYW5nZWQocHJvdG8sIGZhbHNlKTtcbiAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fd3JpdGVTZWxmKHByb3RvLCBjdXJyVmFsdWUsIHZhbHVlcyk7XG4gICAgICAgIHRoaXMuX3NldENoYW5nZWQocHJvdG8sIHRydWUpO1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF9waXBlRm9yKHByb3RvOiBQcm90b1JlY29yZCwgY29udGV4dCkge1xuICAgIHZhciBzdG9yZWRQaXBlID0gdGhpcy5fcmVhZFBpcGUocHJvdG8pO1xuICAgIGlmIChpc1ByZXNlbnQoc3RvcmVkUGlwZSkpIHJldHVybiBzdG9yZWRQaXBlO1xuXG4gICAgdmFyIHBpcGUgPSB0aGlzLnBpcGVzLmdldChwcm90by5uYW1lKTtcbiAgICB0aGlzLl93cml0ZVBpcGUocHJvdG8sIHBpcGUpO1xuICAgIHJldHVybiBwaXBlO1xuICB9XG5cbiAgcHJpdmF0ZSBfcmVhZENvbnRleHQocHJvdG86IFByb3RvUmVjb3JkLCB2YWx1ZXM6IGFueVtdKSB7XG4gICAgaWYgKHByb3RvLmNvbnRleHRJbmRleCA9PSAtMSkge1xuICAgICAgcmV0dXJuIHRoaXMuX2dldERpcmVjdGl2ZUZvcihwcm90by5kaXJlY3RpdmVJbmRleCk7XG4gICAgfVxuICAgIHJldHVybiB2YWx1ZXNbcHJvdG8uY29udGV4dEluZGV4XTtcbiAgfVxuXG4gIHByaXZhdGUgX3JlYWRTZWxmKHByb3RvOiBQcm90b1JlY29yZCwgdmFsdWVzOiBhbnlbXSkgeyByZXR1cm4gdmFsdWVzW3Byb3RvLnNlbGZJbmRleF07IH1cblxuICBwcml2YXRlIF93cml0ZVNlbGYocHJvdG86IFByb3RvUmVjb3JkLCB2YWx1ZSwgdmFsdWVzOiBhbnlbXSkgeyB2YWx1ZXNbcHJvdG8uc2VsZkluZGV4XSA9IHZhbHVlOyB9XG5cbiAgcHJpdmF0ZSBfcmVhZFBpcGUocHJvdG86IFByb3RvUmVjb3JkKSB7IHJldHVybiB0aGlzLmxvY2FsUGlwZXNbcHJvdG8uc2VsZkluZGV4XTsgfVxuXG4gIHByaXZhdGUgX3dyaXRlUGlwZShwcm90bzogUHJvdG9SZWNvcmQsIHZhbHVlKSB7IHRoaXMubG9jYWxQaXBlc1twcm90by5zZWxmSW5kZXhdID0gdmFsdWU7IH1cblxuICBwcml2YXRlIF9zZXRDaGFuZ2VkKHByb3RvOiBQcm90b1JlY29yZCwgdmFsdWU6IGJvb2xlYW4pIHtcbiAgICBpZiAocHJvdG8uYXJndW1lbnRUb1B1cmVGdW5jdGlvbikgdGhpcy5jaGFuZ2VzW3Byb3RvLnNlbGZJbmRleF0gPSB2YWx1ZTtcbiAgfVxuXG4gIHByaXZhdGUgX3B1cmVGdW5jQW5kQXJnc0RpZE5vdENoYW5nZShwcm90bzogUHJvdG9SZWNvcmQpOiBib29sZWFuIHtcbiAgICByZXR1cm4gcHJvdG8uaXNQdXJlRnVuY3Rpb24oKSAmJiAhdGhpcy5fYXJnc0NoYW5nZWQocHJvdG8pO1xuICB9XG5cbiAgcHJpdmF0ZSBfYXJnc0NoYW5nZWQocHJvdG86IFByb3RvUmVjb3JkKTogYm9vbGVhbiB7XG4gICAgdmFyIGFyZ3MgPSBwcm90by5hcmdzO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJncy5sZW5ndGg7ICsraSkge1xuICAgICAgaWYgKHRoaXMuY2hhbmdlc1thcmdzW2ldXSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcHJpdmF0ZSBfYXJnc09yQ29udGV4dENoYW5nZWQocHJvdG86IFByb3RvUmVjb3JkKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX2FyZ3NDaGFuZ2VkKHByb3RvKSB8fCB0aGlzLmNoYW5nZXNbcHJvdG8uY29udGV4dEluZGV4XTtcbiAgfVxuXG4gIHByaXZhdGUgX3JlYWRBcmdzKHByb3RvOiBQcm90b1JlY29yZCwgdmFsdWVzOiBhbnlbXSkge1xuICAgIHZhciByZXMgPSBMaXN0V3JhcHBlci5jcmVhdGVGaXhlZFNpemUocHJvdG8uYXJncy5sZW5ndGgpO1xuICAgIHZhciBhcmdzID0gcHJvdG8uYXJncztcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3MubGVuZ3RoOyArK2kpIHtcbiAgICAgIHJlc1tpXSA9IHZhbHVlc1thcmdzW2ldXTtcbiAgICB9XG4gICAgcmV0dXJuIHJlcztcbiAgfVxufVxuIl19