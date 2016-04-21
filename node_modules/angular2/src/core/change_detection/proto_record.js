'use strict';"use strict";
(function (RecordType) {
    RecordType[RecordType["Self"] = 0] = "Self";
    RecordType[RecordType["Const"] = 1] = "Const";
    RecordType[RecordType["PrimitiveOp"] = 2] = "PrimitiveOp";
    RecordType[RecordType["PropertyRead"] = 3] = "PropertyRead";
    RecordType[RecordType["PropertyWrite"] = 4] = "PropertyWrite";
    RecordType[RecordType["Local"] = 5] = "Local";
    RecordType[RecordType["InvokeMethod"] = 6] = "InvokeMethod";
    RecordType[RecordType["InvokeClosure"] = 7] = "InvokeClosure";
    RecordType[RecordType["KeyedRead"] = 8] = "KeyedRead";
    RecordType[RecordType["KeyedWrite"] = 9] = "KeyedWrite";
    RecordType[RecordType["Pipe"] = 10] = "Pipe";
    RecordType[RecordType["Interpolate"] = 11] = "Interpolate";
    RecordType[RecordType["SafeProperty"] = 12] = "SafeProperty";
    RecordType[RecordType["CollectionLiteral"] = 13] = "CollectionLiteral";
    RecordType[RecordType["SafeMethodInvoke"] = 14] = "SafeMethodInvoke";
    RecordType[RecordType["DirectiveLifecycle"] = 15] = "DirectiveLifecycle";
    RecordType[RecordType["Chain"] = 16] = "Chain";
    RecordType[RecordType["SkipRecordsIf"] = 17] = "SkipRecordsIf";
    RecordType[RecordType["SkipRecordsIfNot"] = 18] = "SkipRecordsIfNot";
    RecordType[RecordType["SkipRecords"] = 19] = "SkipRecords"; // Skip records unconditionally
})(exports.RecordType || (exports.RecordType = {}));
var RecordType = exports.RecordType;
var ProtoRecord = (function () {
    function ProtoRecord(mode, name, funcOrValue, args, fixedArgs, contextIndex, directiveIndex, selfIndex, bindingRecord, lastInBinding, lastInDirective, argumentToPureFunction, referencedBySelf, propertyBindingIndex) {
        this.mode = mode;
        this.name = name;
        this.funcOrValue = funcOrValue;
        this.args = args;
        this.fixedArgs = fixedArgs;
        this.contextIndex = contextIndex;
        this.directiveIndex = directiveIndex;
        this.selfIndex = selfIndex;
        this.bindingRecord = bindingRecord;
        this.lastInBinding = lastInBinding;
        this.lastInDirective = lastInDirective;
        this.argumentToPureFunction = argumentToPureFunction;
        this.referencedBySelf = referencedBySelf;
        this.propertyBindingIndex = propertyBindingIndex;
    }
    ProtoRecord.prototype.isPureFunction = function () {
        return this.mode === RecordType.Interpolate || this.mode === RecordType.CollectionLiteral;
    };
    ProtoRecord.prototype.isUsedByOtherRecord = function () { return !this.lastInBinding || this.referencedBySelf; };
    ProtoRecord.prototype.shouldBeChecked = function () {
        return this.argumentToPureFunction || this.lastInBinding || this.isPureFunction() ||
            this.isPipeRecord();
    };
    ProtoRecord.prototype.isPipeRecord = function () { return this.mode === RecordType.Pipe; };
    ProtoRecord.prototype.isConditionalSkipRecord = function () {
        return this.mode === RecordType.SkipRecordsIfNot || this.mode === RecordType.SkipRecordsIf;
    };
    ProtoRecord.prototype.isUnconditionalSkipRecord = function () { return this.mode === RecordType.SkipRecords; };
    ProtoRecord.prototype.isSkipRecord = function () {
        return this.isConditionalSkipRecord() || this.isUnconditionalSkipRecord();
    };
    ProtoRecord.prototype.isLifeCycleRecord = function () { return this.mode === RecordType.DirectiveLifecycle; };
    return ProtoRecord;
}());
exports.ProtoRecord = ProtoRecord;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvdG9fcmVjb3JkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZGlmZmluZ19wbHVnaW5fd3JhcHBlci1vdXRwdXRfcGF0aC1qYWtYbk1tTC50bXAvYW5ndWxhcjIvc3JjL2NvcmUvY2hhbmdlX2RldGVjdGlvbi9wcm90b19yZWNvcmQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUdBLFdBQVksVUFBVTtJQUNwQiwyQ0FBSSxDQUFBO0lBQ0osNkNBQUssQ0FBQTtJQUNMLHlEQUFXLENBQUE7SUFDWCwyREFBWSxDQUFBO0lBQ1osNkRBQWEsQ0FBQTtJQUNiLDZDQUFLLENBQUE7SUFDTCwyREFBWSxDQUFBO0lBQ1osNkRBQWEsQ0FBQTtJQUNiLHFEQUFTLENBQUE7SUFDVCx1REFBVSxDQUFBO0lBQ1YsNENBQUksQ0FBQTtJQUNKLDBEQUFXLENBQUE7SUFDWCw0REFBWSxDQUFBO0lBQ1osc0VBQWlCLENBQUE7SUFDakIsb0VBQWdCLENBQUE7SUFDaEIsd0VBQWtCLENBQUE7SUFDbEIsOENBQUssQ0FBQTtJQUNMLDhEQUFhLENBQUE7SUFDYixvRUFBZ0IsQ0FBQTtJQUNoQiwwREFBVyxDQUFBLENBQVEsK0JBQStCO0FBQ3BELENBQUMsRUFyQlcsa0JBQVUsS0FBVixrQkFBVSxRQXFCckI7QUFyQkQsSUFBWSxVQUFVLEdBQVYsa0JBcUJYLENBQUE7QUFFRDtJQUNFLHFCQUFtQixJQUFnQixFQUFTLElBQVksRUFBUyxXQUFXLEVBQVMsSUFBVyxFQUM3RSxTQUFnQixFQUFTLFlBQW9CLEVBQzdDLGNBQThCLEVBQVMsU0FBaUIsRUFDeEQsYUFBNEIsRUFBUyxhQUFzQixFQUMzRCxlQUF3QixFQUFTLHNCQUErQixFQUNoRSxnQkFBeUIsRUFBUyxvQkFBNEI7UUFMOUQsU0FBSSxHQUFKLElBQUksQ0FBWTtRQUFTLFNBQUksR0FBSixJQUFJLENBQVE7UUFBUyxnQkFBVyxHQUFYLFdBQVcsQ0FBQTtRQUFTLFNBQUksR0FBSixJQUFJLENBQU87UUFDN0UsY0FBUyxHQUFULFNBQVMsQ0FBTztRQUFTLGlCQUFZLEdBQVosWUFBWSxDQUFRO1FBQzdDLG1CQUFjLEdBQWQsY0FBYyxDQUFnQjtRQUFTLGNBQVMsR0FBVCxTQUFTLENBQVE7UUFDeEQsa0JBQWEsR0FBYixhQUFhLENBQWU7UUFBUyxrQkFBYSxHQUFiLGFBQWEsQ0FBUztRQUMzRCxvQkFBZSxHQUFmLGVBQWUsQ0FBUztRQUFTLDJCQUFzQixHQUF0QixzQkFBc0IsQ0FBUztRQUNoRSxxQkFBZ0IsR0FBaEIsZ0JBQWdCLENBQVM7UUFBUyx5QkFBb0IsR0FBcEIsb0JBQW9CLENBQVE7SUFBRyxDQUFDO0lBRXJGLG9DQUFjLEdBQWQ7UUFDRSxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksS0FBSyxVQUFVLENBQUMsV0FBVyxJQUFJLElBQUksQ0FBQyxJQUFJLEtBQUssVUFBVSxDQUFDLGlCQUFpQixDQUFDO0lBQzVGLENBQUM7SUFFRCx5Q0FBbUIsR0FBbkIsY0FBaUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLGFBQWEsSUFBSSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDO0lBRXZGLHFDQUFlLEdBQWY7UUFDRSxNQUFNLENBQUMsSUFBSSxDQUFDLHNCQUFzQixJQUFJLElBQUksQ0FBQyxhQUFhLElBQUksSUFBSSxDQUFDLGNBQWMsRUFBRTtZQUMxRSxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7SUFDN0IsQ0FBQztJQUVELGtDQUFZLEdBQVosY0FBMEIsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLEtBQUssVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7SUFFakUsNkNBQXVCLEdBQXZCO1FBQ0UsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLEtBQUssVUFBVSxDQUFDLGdCQUFnQixJQUFJLElBQUksQ0FBQyxJQUFJLEtBQUssVUFBVSxDQUFDLGFBQWEsQ0FBQztJQUM3RixDQUFDO0lBRUQsK0NBQXlCLEdBQXpCLGNBQXVDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxLQUFLLFVBQVUsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO0lBRXJGLGtDQUFZLEdBQVo7UUFDRSxNQUFNLENBQUMsSUFBSSxDQUFDLHVCQUF1QixFQUFFLElBQUksSUFBSSxDQUFDLHlCQUF5QixFQUFFLENBQUM7SUFDNUUsQ0FBQztJQUVELHVDQUFpQixHQUFqQixjQUErQixNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksS0FBSyxVQUFVLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDO0lBQ3RGLGtCQUFDO0FBQUQsQ0FBQyxBQWhDRCxJQWdDQztBQWhDWSxtQkFBVyxjQWdDdkIsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7QmluZGluZ1JlY29yZH0gZnJvbSAnLi9iaW5kaW5nX3JlY29yZCc7XG5pbXBvcnQge0RpcmVjdGl2ZUluZGV4fSBmcm9tICcuL2RpcmVjdGl2ZV9yZWNvcmQnO1xuXG5leHBvcnQgZW51bSBSZWNvcmRUeXBlIHtcbiAgU2VsZixcbiAgQ29uc3QsXG4gIFByaW1pdGl2ZU9wLFxuICBQcm9wZXJ0eVJlYWQsXG4gIFByb3BlcnR5V3JpdGUsXG4gIExvY2FsLFxuICBJbnZva2VNZXRob2QsXG4gIEludm9rZUNsb3N1cmUsXG4gIEtleWVkUmVhZCxcbiAgS2V5ZWRXcml0ZSxcbiAgUGlwZSxcbiAgSW50ZXJwb2xhdGUsXG4gIFNhZmVQcm9wZXJ0eSxcbiAgQ29sbGVjdGlvbkxpdGVyYWwsXG4gIFNhZmVNZXRob2RJbnZva2UsXG4gIERpcmVjdGl2ZUxpZmVjeWNsZSxcbiAgQ2hhaW4sXG4gIFNraXBSZWNvcmRzSWYsICAgICAvLyBTa2lwIHJlY29yZHMgd2hlbiB0aGUgY29uZGl0aW9uIGlzIHRydWVcbiAgU2tpcFJlY29yZHNJZk5vdCwgIC8vIFNraXAgcmVjb3JkcyB3aGVuIHRoZSBjb25kaXRpb24gaXMgZmFsc2VcbiAgU2tpcFJlY29yZHMgICAgICAgIC8vIFNraXAgcmVjb3JkcyB1bmNvbmRpdGlvbmFsbHlcbn1cblxuZXhwb3J0IGNsYXNzIFByb3RvUmVjb3JkIHtcbiAgY29uc3RydWN0b3IocHVibGljIG1vZGU6IFJlY29yZFR5cGUsIHB1YmxpYyBuYW1lOiBzdHJpbmcsIHB1YmxpYyBmdW5jT3JWYWx1ZSwgcHVibGljIGFyZ3M6IGFueVtdLFxuICAgICAgICAgICAgICBwdWJsaWMgZml4ZWRBcmdzOiBhbnlbXSwgcHVibGljIGNvbnRleHRJbmRleDogbnVtYmVyLFxuICAgICAgICAgICAgICBwdWJsaWMgZGlyZWN0aXZlSW5kZXg6IERpcmVjdGl2ZUluZGV4LCBwdWJsaWMgc2VsZkluZGV4OiBudW1iZXIsXG4gICAgICAgICAgICAgIHB1YmxpYyBiaW5kaW5nUmVjb3JkOiBCaW5kaW5nUmVjb3JkLCBwdWJsaWMgbGFzdEluQmluZGluZzogYm9vbGVhbixcbiAgICAgICAgICAgICAgcHVibGljIGxhc3RJbkRpcmVjdGl2ZTogYm9vbGVhbiwgcHVibGljIGFyZ3VtZW50VG9QdXJlRnVuY3Rpb246IGJvb2xlYW4sXG4gICAgICAgICAgICAgIHB1YmxpYyByZWZlcmVuY2VkQnlTZWxmOiBib29sZWFuLCBwdWJsaWMgcHJvcGVydHlCaW5kaW5nSW5kZXg6IG51bWJlcikge31cblxuICBpc1B1cmVGdW5jdGlvbigpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5tb2RlID09PSBSZWNvcmRUeXBlLkludGVycG9sYXRlIHx8IHRoaXMubW9kZSA9PT0gUmVjb3JkVHlwZS5Db2xsZWN0aW9uTGl0ZXJhbDtcbiAgfVxuXG4gIGlzVXNlZEJ5T3RoZXJSZWNvcmQoKTogYm9vbGVhbiB7IHJldHVybiAhdGhpcy5sYXN0SW5CaW5kaW5nIHx8IHRoaXMucmVmZXJlbmNlZEJ5U2VsZjsgfVxuXG4gIHNob3VsZEJlQ2hlY2tlZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5hcmd1bWVudFRvUHVyZUZ1bmN0aW9uIHx8IHRoaXMubGFzdEluQmluZGluZyB8fCB0aGlzLmlzUHVyZUZ1bmN0aW9uKCkgfHxcbiAgICAgICAgICAgdGhpcy5pc1BpcGVSZWNvcmQoKTtcbiAgfVxuXG4gIGlzUGlwZVJlY29yZCgpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMubW9kZSA9PT0gUmVjb3JkVHlwZS5QaXBlOyB9XG5cbiAgaXNDb25kaXRpb25hbFNraXBSZWNvcmQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMubW9kZSA9PT0gUmVjb3JkVHlwZS5Ta2lwUmVjb3Jkc0lmTm90IHx8IHRoaXMubW9kZSA9PT0gUmVjb3JkVHlwZS5Ta2lwUmVjb3Jkc0lmO1xuICB9XG5cbiAgaXNVbmNvbmRpdGlvbmFsU2tpcFJlY29yZCgpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMubW9kZSA9PT0gUmVjb3JkVHlwZS5Ta2lwUmVjb3JkczsgfVxuXG4gIGlzU2tpcFJlY29yZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5pc0NvbmRpdGlvbmFsU2tpcFJlY29yZCgpIHx8IHRoaXMuaXNVbmNvbmRpdGlvbmFsU2tpcFJlY29yZCgpO1xuICB9XG5cbiAgaXNMaWZlQ3ljbGVSZWNvcmQoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLm1vZGUgPT09IFJlY29yZFR5cGUuRGlyZWN0aXZlTGlmZWN5Y2xlOyB9XG59XG4iXX0=