export var RecordType;
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
})(RecordType || (RecordType = {}));
export class ProtoRecord {
    constructor(mode, name, funcOrValue, args, fixedArgs, contextIndex, directiveIndex, selfIndex, bindingRecord, lastInBinding, lastInDirective, argumentToPureFunction, referencedBySelf, propertyBindingIndex) {
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
    isPureFunction() {
        return this.mode === RecordType.Interpolate || this.mode === RecordType.CollectionLiteral;
    }
    isUsedByOtherRecord() { return !this.lastInBinding || this.referencedBySelf; }
    shouldBeChecked() {
        return this.argumentToPureFunction || this.lastInBinding || this.isPureFunction() ||
            this.isPipeRecord();
    }
    isPipeRecord() { return this.mode === RecordType.Pipe; }
    isConditionalSkipRecord() {
        return this.mode === RecordType.SkipRecordsIfNot || this.mode === RecordType.SkipRecordsIf;
    }
    isUnconditionalSkipRecord() { return this.mode === RecordType.SkipRecords; }
    isSkipRecord() {
        return this.isConditionalSkipRecord() || this.isUnconditionalSkipRecord();
    }
    isLifeCycleRecord() { return this.mode === RecordType.DirectiveLifecycle; }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvdG9fcmVjb3JkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZGlmZmluZ19wbHVnaW5fd3JhcHBlci1vdXRwdXRfcGF0aC1vWERPNHAydi50bXAvYW5ndWxhcjIvc3JjL2NvcmUvY2hhbmdlX2RldGVjdGlvbi9wcm90b19yZWNvcmQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBR0EsV0FBWSxVQXFCWDtBQXJCRCxXQUFZLFVBQVU7SUFDcEIsMkNBQUksQ0FBQTtJQUNKLDZDQUFLLENBQUE7SUFDTCx5REFBVyxDQUFBO0lBQ1gsMkRBQVksQ0FBQTtJQUNaLDZEQUFhLENBQUE7SUFDYiw2Q0FBSyxDQUFBO0lBQ0wsMkRBQVksQ0FBQTtJQUNaLDZEQUFhLENBQUE7SUFDYixxREFBUyxDQUFBO0lBQ1QsdURBQVUsQ0FBQTtJQUNWLDRDQUFJLENBQUE7SUFDSiwwREFBVyxDQUFBO0lBQ1gsNERBQVksQ0FBQTtJQUNaLHNFQUFpQixDQUFBO0lBQ2pCLG9FQUFnQixDQUFBO0lBQ2hCLHdFQUFrQixDQUFBO0lBQ2xCLDhDQUFLLENBQUE7SUFDTCw4REFBYSxDQUFBO0lBQ2Isb0VBQWdCLENBQUE7SUFDaEIsMERBQVcsQ0FBQSxDQUFRLCtCQUErQjtBQUNwRCxDQUFDLEVBckJXLFVBQVUsS0FBVixVQUFVLFFBcUJyQjtBQUVEO0lBQ0UsWUFBbUIsSUFBZ0IsRUFBUyxJQUFZLEVBQVMsV0FBVyxFQUFTLElBQVcsRUFDN0UsU0FBZ0IsRUFBUyxZQUFvQixFQUM3QyxjQUE4QixFQUFTLFNBQWlCLEVBQ3hELGFBQTRCLEVBQVMsYUFBc0IsRUFDM0QsZUFBd0IsRUFBUyxzQkFBK0IsRUFDaEUsZ0JBQXlCLEVBQVMsb0JBQTRCO1FBTDlELFNBQUksR0FBSixJQUFJLENBQVk7UUFBUyxTQUFJLEdBQUosSUFBSSxDQUFRO1FBQVMsZ0JBQVcsR0FBWCxXQUFXLENBQUE7UUFBUyxTQUFJLEdBQUosSUFBSSxDQUFPO1FBQzdFLGNBQVMsR0FBVCxTQUFTLENBQU87UUFBUyxpQkFBWSxHQUFaLFlBQVksQ0FBUTtRQUM3QyxtQkFBYyxHQUFkLGNBQWMsQ0FBZ0I7UUFBUyxjQUFTLEdBQVQsU0FBUyxDQUFRO1FBQ3hELGtCQUFhLEdBQWIsYUFBYSxDQUFlO1FBQVMsa0JBQWEsR0FBYixhQUFhLENBQVM7UUFDM0Qsb0JBQWUsR0FBZixlQUFlLENBQVM7UUFBUywyQkFBc0IsR0FBdEIsc0JBQXNCLENBQVM7UUFDaEUscUJBQWdCLEdBQWhCLGdCQUFnQixDQUFTO1FBQVMseUJBQW9CLEdBQXBCLG9CQUFvQixDQUFRO0lBQUcsQ0FBQztJQUVyRixjQUFjO1FBQ1osTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLEtBQUssVUFBVSxDQUFDLFdBQVcsSUFBSSxJQUFJLENBQUMsSUFBSSxLQUFLLFVBQVUsQ0FBQyxpQkFBaUIsQ0FBQztJQUM1RixDQUFDO0lBRUQsbUJBQW1CLEtBQWMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLGFBQWEsSUFBSSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDO0lBRXZGLGVBQWU7UUFDYixNQUFNLENBQUMsSUFBSSxDQUFDLHNCQUFzQixJQUFJLElBQUksQ0FBQyxhQUFhLElBQUksSUFBSSxDQUFDLGNBQWMsRUFBRTtZQUMxRSxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7SUFDN0IsQ0FBQztJQUVELFlBQVksS0FBYyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksS0FBSyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztJQUVqRSx1QkFBdUI7UUFDckIsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLEtBQUssVUFBVSxDQUFDLGdCQUFnQixJQUFJLElBQUksQ0FBQyxJQUFJLEtBQUssVUFBVSxDQUFDLGFBQWEsQ0FBQztJQUM3RixDQUFDO0lBRUQseUJBQXlCLEtBQWMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLEtBQUssVUFBVSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7SUFFckYsWUFBWTtRQUNWLE1BQU0sQ0FBQyxJQUFJLENBQUMsdUJBQXVCLEVBQUUsSUFBSSxJQUFJLENBQUMseUJBQXlCLEVBQUUsQ0FBQztJQUM1RSxDQUFDO0lBRUQsaUJBQWlCLEtBQWMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLEtBQUssVUFBVSxDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQztBQUN0RixDQUFDO0FBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0JpbmRpbmdSZWNvcmR9IGZyb20gJy4vYmluZGluZ19yZWNvcmQnO1xuaW1wb3J0IHtEaXJlY3RpdmVJbmRleH0gZnJvbSAnLi9kaXJlY3RpdmVfcmVjb3JkJztcblxuZXhwb3J0IGVudW0gUmVjb3JkVHlwZSB7XG4gIFNlbGYsXG4gIENvbnN0LFxuICBQcmltaXRpdmVPcCxcbiAgUHJvcGVydHlSZWFkLFxuICBQcm9wZXJ0eVdyaXRlLFxuICBMb2NhbCxcbiAgSW52b2tlTWV0aG9kLFxuICBJbnZva2VDbG9zdXJlLFxuICBLZXllZFJlYWQsXG4gIEtleWVkV3JpdGUsXG4gIFBpcGUsXG4gIEludGVycG9sYXRlLFxuICBTYWZlUHJvcGVydHksXG4gIENvbGxlY3Rpb25MaXRlcmFsLFxuICBTYWZlTWV0aG9kSW52b2tlLFxuICBEaXJlY3RpdmVMaWZlY3ljbGUsXG4gIENoYWluLFxuICBTa2lwUmVjb3Jkc0lmLCAgICAgLy8gU2tpcCByZWNvcmRzIHdoZW4gdGhlIGNvbmRpdGlvbiBpcyB0cnVlXG4gIFNraXBSZWNvcmRzSWZOb3QsICAvLyBTa2lwIHJlY29yZHMgd2hlbiB0aGUgY29uZGl0aW9uIGlzIGZhbHNlXG4gIFNraXBSZWNvcmRzICAgICAgICAvLyBTa2lwIHJlY29yZHMgdW5jb25kaXRpb25hbGx5XG59XG5cbmV4cG9ydCBjbGFzcyBQcm90b1JlY29yZCB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBtb2RlOiBSZWNvcmRUeXBlLCBwdWJsaWMgbmFtZTogc3RyaW5nLCBwdWJsaWMgZnVuY09yVmFsdWUsIHB1YmxpYyBhcmdzOiBhbnlbXSxcbiAgICAgICAgICAgICAgcHVibGljIGZpeGVkQXJnczogYW55W10sIHB1YmxpYyBjb250ZXh0SW5kZXg6IG51bWJlcixcbiAgICAgICAgICAgICAgcHVibGljIGRpcmVjdGl2ZUluZGV4OiBEaXJlY3RpdmVJbmRleCwgcHVibGljIHNlbGZJbmRleDogbnVtYmVyLFxuICAgICAgICAgICAgICBwdWJsaWMgYmluZGluZ1JlY29yZDogQmluZGluZ1JlY29yZCwgcHVibGljIGxhc3RJbkJpbmRpbmc6IGJvb2xlYW4sXG4gICAgICAgICAgICAgIHB1YmxpYyBsYXN0SW5EaXJlY3RpdmU6IGJvb2xlYW4sIHB1YmxpYyBhcmd1bWVudFRvUHVyZUZ1bmN0aW9uOiBib29sZWFuLFxuICAgICAgICAgICAgICBwdWJsaWMgcmVmZXJlbmNlZEJ5U2VsZjogYm9vbGVhbiwgcHVibGljIHByb3BlcnR5QmluZGluZ0luZGV4OiBudW1iZXIpIHt9XG5cbiAgaXNQdXJlRnVuY3Rpb24oKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMubW9kZSA9PT0gUmVjb3JkVHlwZS5JbnRlcnBvbGF0ZSB8fCB0aGlzLm1vZGUgPT09IFJlY29yZFR5cGUuQ29sbGVjdGlvbkxpdGVyYWw7XG4gIH1cblxuICBpc1VzZWRCeU90aGVyUmVjb3JkKCk6IGJvb2xlYW4geyByZXR1cm4gIXRoaXMubGFzdEluQmluZGluZyB8fCB0aGlzLnJlZmVyZW5jZWRCeVNlbGY7IH1cblxuICBzaG91bGRCZUNoZWNrZWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuYXJndW1lbnRUb1B1cmVGdW5jdGlvbiB8fCB0aGlzLmxhc3RJbkJpbmRpbmcgfHwgdGhpcy5pc1B1cmVGdW5jdGlvbigpIHx8XG4gICAgICAgICAgIHRoaXMuaXNQaXBlUmVjb3JkKCk7XG4gIH1cblxuICBpc1BpcGVSZWNvcmQoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLm1vZGUgPT09IFJlY29yZFR5cGUuUGlwZTsgfVxuXG4gIGlzQ29uZGl0aW9uYWxTa2lwUmVjb3JkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLm1vZGUgPT09IFJlY29yZFR5cGUuU2tpcFJlY29yZHNJZk5vdCB8fCB0aGlzLm1vZGUgPT09IFJlY29yZFR5cGUuU2tpcFJlY29yZHNJZjtcbiAgfVxuXG4gIGlzVW5jb25kaXRpb25hbFNraXBSZWNvcmQoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLm1vZGUgPT09IFJlY29yZFR5cGUuU2tpcFJlY29yZHM7IH1cblxuICBpc1NraXBSZWNvcmQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuaXNDb25kaXRpb25hbFNraXBSZWNvcmQoKSB8fCB0aGlzLmlzVW5jb25kaXRpb25hbFNraXBSZWNvcmQoKTtcbiAgfVxuXG4gIGlzTGlmZUN5Y2xlUmVjb3JkKCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5tb2RlID09PSBSZWNvcmRUeXBlLkRpcmVjdGl2ZUxpZmVjeWNsZTsgfVxufVxuIl19