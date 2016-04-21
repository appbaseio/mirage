import { isPresent, isString } from 'angular2/src/facade/lang';
import { BaseException } from 'angular2/src/facade/exceptions';
import { ListWrapper } from 'angular2/src/facade/collection';
import { ImplicitReceiver } from './parser/ast';
import { ChangeDetectionUtil } from './change_detection_util';
import { DynamicChangeDetector } from './dynamic_change_detector';
import { DirectiveIndex } from './directive_record';
import { EventBinding } from './event_binding';
import { coalesce } from './coalesce';
import { ProtoRecord, RecordType } from './proto_record';
export class DynamicProtoChangeDetector {
    constructor(_definition) {
        this._definition = _definition;
        this._propertyBindingRecords = createPropertyRecords(_definition);
        this._eventBindingRecords = createEventRecords(_definition);
        this._propertyBindingTargets = this._definition.bindingRecords.map(b => b.target);
        this._directiveIndices = this._definition.directiveRecords.map(d => d.directiveIndex);
    }
    instantiate() {
        return new DynamicChangeDetector(this._definition.id, this._propertyBindingRecords.length, this._propertyBindingTargets, this._directiveIndices, this._definition.strategy, this._propertyBindingRecords, this._eventBindingRecords, this._definition.directiveRecords, this._definition.genConfig);
    }
}
export function createPropertyRecords(definition) {
    var recordBuilder = new ProtoRecordBuilder();
    ListWrapper.forEachWithIndex(definition.bindingRecords, (b, index) => recordBuilder.add(b, definition.variableNames, index));
    return coalesce(recordBuilder.records);
}
export function createEventRecords(definition) {
    // TODO: vsavkin: remove $event when the compiler handles render-side variables properly
    var varNames = ListWrapper.concat(['$event'], definition.variableNames);
    return definition.eventRecords.map(er => {
        var records = _ConvertAstIntoProtoRecords.create(er, varNames);
        var dirIndex = er.implicitReceiver instanceof DirectiveIndex ? er.implicitReceiver : null;
        return new EventBinding(er.target.name, er.target.elementIndex, dirIndex, records);
    });
}
export class ProtoRecordBuilder {
    constructor() {
        this.records = [];
    }
    add(b, variableNames, bindingIndex) {
        var oldLast = ListWrapper.last(this.records);
        if (isPresent(oldLast) && oldLast.bindingRecord.directiveRecord == b.directiveRecord) {
            oldLast.lastInDirective = false;
        }
        var numberOfRecordsBefore = this.records.length;
        this._appendRecords(b, variableNames, bindingIndex);
        var newLast = ListWrapper.last(this.records);
        if (isPresent(newLast) && newLast !== oldLast) {
            newLast.lastInBinding = true;
            newLast.lastInDirective = true;
            this._setArgumentToPureFunction(numberOfRecordsBefore);
        }
    }
    /** @internal */
    _setArgumentToPureFunction(startIndex) {
        for (var i = startIndex; i < this.records.length; ++i) {
            var rec = this.records[i];
            if (rec.isPureFunction()) {
                rec.args.forEach(recordIndex => this.records[recordIndex - 1].argumentToPureFunction =
                    true);
            }
            if (rec.mode === RecordType.Pipe) {
                rec.args.forEach(recordIndex => this.records[recordIndex - 1].argumentToPureFunction =
                    true);
                this.records[rec.contextIndex - 1].argumentToPureFunction = true;
            }
        }
    }
    /** @internal */
    _appendRecords(b, variableNames, bindingIndex) {
        if (b.isDirectiveLifecycle()) {
            this.records.push(new ProtoRecord(RecordType.DirectiveLifecycle, b.lifecycleEvent, null, [], [], -1, null, this.records.length + 1, b, false, false, false, false, null));
        }
        else {
            _ConvertAstIntoProtoRecords.append(this.records, b, variableNames, bindingIndex);
        }
    }
}
class _ConvertAstIntoProtoRecords {
    constructor(_records, _bindingRecord, _variableNames, _bindingIndex) {
        this._records = _records;
        this._bindingRecord = _bindingRecord;
        this._variableNames = _variableNames;
        this._bindingIndex = _bindingIndex;
    }
    static append(records, b, variableNames, bindingIndex) {
        var c = new _ConvertAstIntoProtoRecords(records, b, variableNames, bindingIndex);
        b.ast.visit(c);
    }
    static create(b, variableNames) {
        var rec = [];
        _ConvertAstIntoProtoRecords.append(rec, b, variableNames, null);
        rec[rec.length - 1].lastInBinding = true;
        return rec;
    }
    visitImplicitReceiver(ast) { return this._bindingRecord.implicitReceiver; }
    visitInterpolation(ast) {
        var args = this._visitAll(ast.expressions);
        return this._addRecord(RecordType.Interpolate, "interpolate", _interpolationFn(ast.strings), args, ast.strings, 0);
    }
    visitLiteralPrimitive(ast) {
        return this._addRecord(RecordType.Const, "literal", ast.value, [], null, 0);
    }
    visitPropertyRead(ast) {
        var receiver = ast.receiver.visit(this);
        if (isPresent(this._variableNames) && ListWrapper.contains(this._variableNames, ast.name) &&
            ast.receiver instanceof ImplicitReceiver) {
            return this._addRecord(RecordType.Local, ast.name, ast.name, [], null, receiver);
        }
        else {
            return this._addRecord(RecordType.PropertyRead, ast.name, ast.getter, [], null, receiver);
        }
    }
    visitPropertyWrite(ast) {
        if (isPresent(this._variableNames) && ListWrapper.contains(this._variableNames, ast.name) &&
            ast.receiver instanceof ImplicitReceiver) {
            throw new BaseException(`Cannot reassign a variable binding ${ast.name}`);
        }
        else {
            var receiver = ast.receiver.visit(this);
            var value = ast.value.visit(this);
            return this._addRecord(RecordType.PropertyWrite, ast.name, ast.setter, [value], null, receiver);
        }
    }
    visitKeyedWrite(ast) {
        var obj = ast.obj.visit(this);
        var key = ast.key.visit(this);
        var value = ast.value.visit(this);
        return this._addRecord(RecordType.KeyedWrite, null, null, [key, value], null, obj);
    }
    visitSafePropertyRead(ast) {
        var receiver = ast.receiver.visit(this);
        return this._addRecord(RecordType.SafeProperty, ast.name, ast.getter, [], null, receiver);
    }
    visitMethodCall(ast) {
        var receiver = ast.receiver.visit(this);
        var args = this._visitAll(ast.args);
        if (isPresent(this._variableNames) && ListWrapper.contains(this._variableNames, ast.name)) {
            var target = this._addRecord(RecordType.Local, ast.name, ast.name, [], null, receiver);
            return this._addRecord(RecordType.InvokeClosure, "closure", null, args, null, target);
        }
        else {
            return this._addRecord(RecordType.InvokeMethod, ast.name, ast.fn, args, null, receiver);
        }
    }
    visitSafeMethodCall(ast) {
        var receiver = ast.receiver.visit(this);
        var args = this._visitAll(ast.args);
        return this._addRecord(RecordType.SafeMethodInvoke, ast.name, ast.fn, args, null, receiver);
    }
    visitFunctionCall(ast) {
        var target = ast.target.visit(this);
        var args = this._visitAll(ast.args);
        return this._addRecord(RecordType.InvokeClosure, "closure", null, args, null, target);
    }
    visitLiteralArray(ast) {
        var primitiveName = `arrayFn${ast.expressions.length}`;
        return this._addRecord(RecordType.CollectionLiteral, primitiveName, _arrayFn(ast.expressions.length), this._visitAll(ast.expressions), null, 0);
    }
    visitLiteralMap(ast) {
        return this._addRecord(RecordType.CollectionLiteral, _mapPrimitiveName(ast.keys), ChangeDetectionUtil.mapFn(ast.keys), this._visitAll(ast.values), null, 0);
    }
    visitBinary(ast) {
        var left = ast.left.visit(this);
        switch (ast.operation) {
            case '&&':
                var branchEnd = [null];
                this._addRecord(RecordType.SkipRecordsIfNot, "SkipRecordsIfNot", null, [], branchEnd, left);
                var right = ast.right.visit(this);
                branchEnd[0] = right;
                return this._addRecord(RecordType.PrimitiveOp, "cond", ChangeDetectionUtil.cond, [left, right, left], null, 0);
            case '||':
                var branchEnd = [null];
                this._addRecord(RecordType.SkipRecordsIf, "SkipRecordsIf", null, [], branchEnd, left);
                var right = ast.right.visit(this);
                branchEnd[0] = right;
                return this._addRecord(RecordType.PrimitiveOp, "cond", ChangeDetectionUtil.cond, [left, left, right], null, 0);
            default:
                var right = ast.right.visit(this);
                return this._addRecord(RecordType.PrimitiveOp, _operationToPrimitiveName(ast.operation), _operationToFunction(ast.operation), [left, right], null, 0);
        }
    }
    visitPrefixNot(ast) {
        var exp = ast.expression.visit(this);
        return this._addRecord(RecordType.PrimitiveOp, "operation_negate", ChangeDetectionUtil.operation_negate, [exp], null, 0);
    }
    visitConditional(ast) {
        var condition = ast.condition.visit(this);
        var startOfFalseBranch = [null];
        var endOfFalseBranch = [null];
        this._addRecord(RecordType.SkipRecordsIfNot, "SkipRecordsIfNot", null, [], startOfFalseBranch, condition);
        var whenTrue = ast.trueExp.visit(this);
        var skip = this._addRecord(RecordType.SkipRecords, "SkipRecords", null, [], endOfFalseBranch, 0);
        var whenFalse = ast.falseExp.visit(this);
        startOfFalseBranch[0] = skip;
        endOfFalseBranch[0] = whenFalse;
        return this._addRecord(RecordType.PrimitiveOp, "cond", ChangeDetectionUtil.cond, [condition, whenTrue, whenFalse], null, 0);
    }
    visitPipe(ast) {
        var value = ast.exp.visit(this);
        var args = this._visitAll(ast.args);
        return this._addRecord(RecordType.Pipe, ast.name, ast.name, args, null, value);
    }
    visitKeyedRead(ast) {
        var obj = ast.obj.visit(this);
        var key = ast.key.visit(this);
        return this._addRecord(RecordType.KeyedRead, "keyedAccess", ChangeDetectionUtil.keyedAccess, [key], null, obj);
    }
    visitChain(ast) {
        var args = ast.expressions.map(e => e.visit(this));
        return this._addRecord(RecordType.Chain, "chain", null, args, null, 0);
    }
    visitQuote(ast) {
        throw new BaseException(`Caught uninterpreted expression at ${ast.location}: ${ast.uninterpretedExpression}. ` +
            `Expression prefix ${ast.prefix} did not match a template transformer to interpret the expression.`);
    }
    _visitAll(asts) {
        var res = ListWrapper.createFixedSize(asts.length);
        for (var i = 0; i < asts.length; ++i) {
            res[i] = asts[i].visit(this);
        }
        return res;
    }
    /**
     * Adds a `ProtoRecord` and returns its selfIndex.
     */
    _addRecord(type, name, funcOrValue, args, fixedArgs, context) {
        var selfIndex = this._records.length + 1;
        if (context instanceof DirectiveIndex) {
            this._records.push(new ProtoRecord(type, name, funcOrValue, args, fixedArgs, -1, context, selfIndex, this._bindingRecord, false, false, false, false, this._bindingIndex));
        }
        else {
            this._records.push(new ProtoRecord(type, name, funcOrValue, args, fixedArgs, context, null, selfIndex, this._bindingRecord, false, false, false, false, this._bindingIndex));
        }
        return selfIndex;
    }
}
function _arrayFn(length) {
    switch (length) {
        case 0:
            return ChangeDetectionUtil.arrayFn0;
        case 1:
            return ChangeDetectionUtil.arrayFn1;
        case 2:
            return ChangeDetectionUtil.arrayFn2;
        case 3:
            return ChangeDetectionUtil.arrayFn3;
        case 4:
            return ChangeDetectionUtil.arrayFn4;
        case 5:
            return ChangeDetectionUtil.arrayFn5;
        case 6:
            return ChangeDetectionUtil.arrayFn6;
        case 7:
            return ChangeDetectionUtil.arrayFn7;
        case 8:
            return ChangeDetectionUtil.arrayFn8;
        case 9:
            return ChangeDetectionUtil.arrayFn9;
        default:
            throw new BaseException(`Does not support literal maps with more than 9 elements`);
    }
}
function _mapPrimitiveName(keys) {
    var stringifiedKeys = keys.map(k => isString(k) ? `"${k}"` : `${k}`).join(', ');
    return `mapFn([${stringifiedKeys}])`;
}
function _operationToPrimitiveName(operation) {
    switch (operation) {
        case '+':
            return "operation_add";
        case '-':
            return "operation_subtract";
        case '*':
            return "operation_multiply";
        case '/':
            return "operation_divide";
        case '%':
            return "operation_remainder";
        case '==':
            return "operation_equals";
        case '!=':
            return "operation_not_equals";
        case '===':
            return "operation_identical";
        case '!==':
            return "operation_not_identical";
        case '<':
            return "operation_less_then";
        case '>':
            return "operation_greater_then";
        case '<=':
            return "operation_less_or_equals_then";
        case '>=':
            return "operation_greater_or_equals_then";
        default:
            throw new BaseException(`Unsupported operation ${operation}`);
    }
}
function _operationToFunction(operation) {
    switch (operation) {
        case '+':
            return ChangeDetectionUtil.operation_add;
        case '-':
            return ChangeDetectionUtil.operation_subtract;
        case '*':
            return ChangeDetectionUtil.operation_multiply;
        case '/':
            return ChangeDetectionUtil.operation_divide;
        case '%':
            return ChangeDetectionUtil.operation_remainder;
        case '==':
            return ChangeDetectionUtil.operation_equals;
        case '!=':
            return ChangeDetectionUtil.operation_not_equals;
        case '===':
            return ChangeDetectionUtil.operation_identical;
        case '!==':
            return ChangeDetectionUtil.operation_not_identical;
        case '<':
            return ChangeDetectionUtil.operation_less_then;
        case '>':
            return ChangeDetectionUtil.operation_greater_then;
        case '<=':
            return ChangeDetectionUtil.operation_less_or_equals_then;
        case '>=':
            return ChangeDetectionUtil.operation_greater_or_equals_then;
        default:
            throw new BaseException(`Unsupported operation ${operation}`);
    }
}
function s(v) {
    return isPresent(v) ? `${v}` : '';
}
function _interpolationFn(strings) {
    var length = strings.length;
    var c0 = length > 0 ? strings[0] : null;
    var c1 = length > 1 ? strings[1] : null;
    var c2 = length > 2 ? strings[2] : null;
    var c3 = length > 3 ? strings[3] : null;
    var c4 = length > 4 ? strings[4] : null;
    var c5 = length > 5 ? strings[5] : null;
    var c6 = length > 6 ? strings[6] : null;
    var c7 = length > 7 ? strings[7] : null;
    var c8 = length > 8 ? strings[8] : null;
    var c9 = length > 9 ? strings[9] : null;
    switch (length - 1) {
        case 1:
            return (a1) => c0 + s(a1) + c1;
        case 2:
            return (a1, a2) => c0 + s(a1) + c1 + s(a2) + c2;
        case 3:
            return (a1, a2, a3) => c0 + s(a1) + c1 + s(a2) + c2 + s(a3) + c3;
        case 4:
            return (a1, a2, a3, a4) => c0 + s(a1) + c1 + s(a2) + c2 + s(a3) + c3 + s(a4) + c4;
        case 5:
            return (a1, a2, a3, a4, a5) => c0 + s(a1) + c1 + s(a2) + c2 + s(a3) + c3 + s(a4) + c4 + s(a5) + c5;
        case 6:
            return (a1, a2, a3, a4, a5, a6) => c0 + s(a1) + c1 + s(a2) + c2 + s(a3) + c3 + s(a4) + c4 + s(a5) + c5 + s(a6) + c6;
        case 7:
            return (a1, a2, a3, a4, a5, a6, a7) => c0 + s(a1) + c1 + s(a2) + c2 + s(a3) + c3 + s(a4) +
                c4 + s(a5) + c5 + s(a6) + c6 + s(a7) + c7;
        case 8:
            return (a1, a2, a3, a4, a5, a6, a7, a8) => c0 + s(a1) + c1 + s(a2) + c2 + s(a3) + c3 + s(a4) +
                c4 + s(a5) + c5 + s(a6) + c6 + s(a7) + c7 + s(a8) +
                c8;
        case 9:
            return (a1, a2, a3, a4, a5, a6, a7, a8, a9) => c0 + s(a1) + c1 + s(a2) + c2 + s(a3) + c3 +
                s(a4) + c4 + s(a5) + c5 + s(a6) + c6 + s(a7) +
                c7 + s(a8) + c8 + s(a9) + c9;
        default:
            throw new BaseException(`Does not support more than 9 expressions`);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvdG9fY2hhbmdlX2RldGVjdG9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZGlmZmluZ19wbHVnaW5fd3JhcHBlci1vdXRwdXRfcGF0aC1vWERPNHAydi50bXAvYW5ndWxhcjIvc3JjL2NvcmUvY2hhbmdlX2RldGVjdGlvbi9wcm90b19jaGFuZ2VfZGV0ZWN0b3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ik9BQU8sRUFBZ0IsU0FBUyxFQUFFLFFBQVEsRUFBQyxNQUFNLDBCQUEwQjtPQUNwRSxFQUFDLGFBQWEsRUFBQyxNQUFNLGdDQUFnQztPQUNyRCxFQUFDLFdBQVcsRUFBK0IsTUFBTSxnQ0FBZ0M7T0FFakYsRUFZTCxnQkFBZ0IsRUFXakIsTUFBTSxjQUFjO09BR2QsRUFBQyxtQkFBbUIsRUFBQyxNQUFNLHlCQUF5QjtPQUNwRCxFQUFDLHFCQUFxQixFQUFDLE1BQU0sMkJBQTJCO09BRXhELEVBQWtCLGNBQWMsRUFBQyxNQUFNLG9CQUFvQjtPQUMzRCxFQUFDLFlBQVksRUFBQyxNQUFNLGlCQUFpQjtPQUVyQyxFQUFDLFFBQVEsRUFBQyxNQUFNLFlBQVk7T0FDNUIsRUFBQyxXQUFXLEVBQUUsVUFBVSxFQUFDLE1BQU0sZ0JBQWdCO0FBRXREO0lBVUUsWUFBb0IsV0FBcUM7UUFBckMsZ0JBQVcsR0FBWCxXQUFXLENBQTBCO1FBQ3ZELElBQUksQ0FBQyx1QkFBdUIsR0FBRyxxQkFBcUIsQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUNsRSxJQUFJLENBQUMsb0JBQW9CLEdBQUcsa0JBQWtCLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDNUQsSUFBSSxDQUFDLHVCQUF1QixHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ2xGLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxDQUFD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QUN4QyxNQUFNLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNuQixLQUFLLENBQUM7WUFDSixNQUFNLENBQUMsQ0FBQyxFQUFFLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLENBQUM7UUFDakMsS0FBSyxDQUFDO1lBQ0osTUFBTSxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDO1FBQ2xELEtBQUssQ0FBQztZQUNKLE1BQU0sQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQztRQUNuRSxLQUFLLENBQUM7WUFDSixNQUFNLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLENBQUM7UUFDcEYsS0FBSyxDQUFDO1lBQ0osTUFBTSxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsS0FDZixFQUFFLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDO1FBQ2pGLEtBQUssQ0FBQztZQUNKLE1BQU0sQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxLQUNuQixFQUFFLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLENBQUM7UUFDOUYsS0FBSyxDQUFDO1lBQ0osTUFBTSxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDO2dCQUNqRCxFQUFFLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLENBQUM7UUFDbkYsS0FBSyxDQUFDO1lBQ0osTUFBTSxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQztnQkFDakQsRUFBRSxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUM7Z0JBQ2pELEVBQUUsQ0FBQztRQUNoRCxLQUFLLENBQUM7WUFDSixNQUFNLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFO2dCQUN6QyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDO2dCQUM1QyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDO1FBQzlFO1lBQ0UsTUFBTSxJQUFJLGFBQWEsQ0FBQywwQ0FBMEMsQ0FBQyxDQUFDO0lBQ3hFLENBQUM7QUFDSCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtUeXBlLCBpc0JsYW5rLCBpc1ByZXNlbnQsIGlzU3RyaW5nfSBmcm9tICdhbmd1bGFyMi9zcmMvZmFjYWRlL2xhbmcnO1xuaW1wb3J0IHtCYXNlRXhjZXB0aW9ufSBmcm9tICdhbmd1bGFyMi9zcmMvZmFjYWRlL2V4Y2VwdGlvbnMnO1xuaW1wb3J0IHtMaXN0V3JhcHBlciwgTWFwV3JhcHBlciwgU3RyaW5nTWFwV3JhcHBlcn0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9jb2xsZWN0aW9uJztcblxuaW1wb3J0IHtcbiAgUHJvcGVydHlSZWFkLFxuICBQcm9wZXJ0eVdyaXRlLFxuICBLZXllZFdyaXRlLFxuICBBU1QsXG4gIEFTVFdpdGhTb3VyY2UsXG4gIEFzdFZpc2l0b3IsXG4gIEJpbmFyeSxcbiAgQ2hhaW4sXG4gIENvbmRpdGlvbmFsLFxuICBCaW5kaW5nUGlwZSxcbiAgRnVuY3Rpb25DYWxsLFxuICBJbXBsaWNpdFJlY2VpdmVyLFxuICBJbnRlcnBvbGF0aW9uLFxuICBLZXllZFJlYWQsXG4gIExpdGVyYWxBcnJheSxcbiAgTGl0ZXJhbE1hcCxcbiAgTGl0ZXJhbFByaW1pdGl2ZSxcbiAgTWV0aG9kQ2FsbCxcbiAgUHJlZml4Tm90LFxuICBRdW90ZSxcbiAgU2FmZVByb3BlcnR5UmVhZCxcbiAgU2FmZU1ldGhvZENhbGxcbn0gZnJvbSAnLi9wYXJzZXIvYXN0JztcblxuaW1wb3J0IHtDaGFuZ2VEZXRlY3RvciwgUHJvdG9DaGFuZ2VEZXRlY3RvciwgQ2hhbmdlRGV0ZWN0b3JEZWZpbml0aW9ufSBmcm9tICcuL2ludGVyZmFjZXMnO1xuaW1wb3J0IHtDaGFuZ2VEZXRlY3Rpb25VdGlsfSBmcm9tICcuL2NoYW5nZV9kZXRlY3Rpb25fdXRpbCc7XG5pbXBvcnQge0R5bmFtaWNDaGFuZ2VEZXRlY3Rvcn0gZnJvbSAnLi9keW5hbWljX2NoYW5nZV9kZXRlY3Rvcic7XG5pbXBvcnQge0JpbmRpbmdSZWNvcmQsIEJpbmRpbmdUYXJnZXR9IGZyb20gJy4vYmluZGluZ19yZWNvcmQnO1xuaW1wb3J0IHtEaXJlY3RpdmVSZWNvcmQsIERpcmVjdGl2ZUluZGV4fSBmcm9tICcuL2RpcmVjdGl2ZV9yZWNvcmQnO1xuaW1wb3J0IHtFdmVudEJpbmRpbmd9IGZyb20gJy4vZXZlbnRfYmluZGluZyc7XG5cbmltcG9ydCB7Y29hbGVzY2V9IGZyb20gJy4vY29hbGVzY2UnO1xuaW1wb3J0IHtQcm90b1JlY29yZCwgUmVjb3JkVHlwZX0gZnJvbSAnLi9wcm90b19yZWNvcmQnO1xuXG5leHBvcnQgY2xhc3MgRHluYW1pY1Byb3RvQ2hhbmdlRGV0ZWN0b3IgaW1wbGVtZW50cyBQcm90b0NoYW5nZURldGVjdG9yIHtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfcHJvcGVydHlCaW5kaW5nUmVjb3JkczogUHJvdG9SZWNvcmRbXTtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfcHJvcGVydHlCaW5kaW5nVGFyZ2V0czogQmluZGluZ1RhcmdldFtdO1xuICAvKiogQGludGVybmFsICovXG4gIF9ldmVudEJpbmRpbmdSZWNvcmRzOiBFdmVudEJpbmRpbmdbXTtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfZGlyZWN0aXZlSW5kaWNlczogRGlyZWN0aXZlSW5kZXhbXTtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9kZWZpbml0aW9uOiBDaGFuZ2VEZXRlY3RvckRlZmluaXRpb24pIHtcbiAgICB0aGlzLl9wcm9wZXJ0eUJpbmRpbmdSZWNvcmRzID0gY3JlYXRlUHJvcGVydHlSZWNvcmRzKF9kZWZpbml0aW9uKTtcbiAgICB0aGlzLl9ldmVudEJpbmRpbmdSZWNvcmRzID0gY3JlYXRlRXZlbnRSZWNvcmRzKF9kZWZpbml0aW9uKTtcbiAgICB0aGlzLl9wcm9wZXJ0eUJpbmRpbmdUYXJnZXRzID0gdGhpcy5fZGVmaW5pdGlvbi5iaW5kaW5nUmVjb3Jkcy5tYXAoYiA9PiBiLnRhcmdldCk7XG4gICAgdGhpcy5fZGlyZWN0aXZlSW5kaWNlcyA9IHRoaXMuX2RlZmluaXRpb24uZGlyZWN0aXZlUmVjb3Jkcy5tYXAoZCA9PiBkLmRpcmVjdGl2ZUluZGV4KTtcbiAgfVxuXG4gIGluc3RhbnRpYXRlKCk6IENoYW5nZURldGVjdG9yIHtcbiAgICByZXR1cm4gbmV3IER5bmFtaWNDaGFuZ2VEZXRlY3RvcihcbiAgICAgICAgdGhpcy5fZGVmaW5pdGlvbi5pZCwgdGhpcy5fcHJvcGVydHlCaW5kaW5nUmVjb3Jkcy5sZW5ndGgsIHRoaXMuX3Byb3BlcnR5QmluZGluZ1RhcmdldHMsXG4gICAgICAgIHRoaXMuX2RpcmVjdGl2ZUluZGljZXMsIHRoaXMuX2RlZmluaXRpb24uc3RyYXRlZ3ksIHRoaXMuX3Byb3BlcnR5QmluZGluZ1JlY29yZHMsXG4gICAgICAgIHRoaXMuX2V2ZW50QmluZGluZ1JlY29yZHMsIHRoaXMuX2RlZmluaXRpb24uZGlyZWN0aXZlUmVjb3JkcywgdGhpcy5fZGVmaW5pdGlvbi5nZW5Db25maWcpO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVQcm9wZXJ0eVJlY29yZHMoZGVmaW5pdGlvbjogQ2hhbmdlRGV0ZWN0b3JEZWZpbml0aW9uKTogUHJvdG9SZWNvcmRbXSB7XG4gIHZhciByZWNvcmRCdWlsZGVyID0gbmV3IFByb3RvUmVjb3JkQnVpbGRlcigpO1xuICBMaXN0V3JhcHBlci5mb3JFYWNoV2l0aEluZGV4KFxuICAgICAgZGVmaW5pdGlvbi5iaW5kaW5nUmVjb3JkcyxcbiAgICAgIChiOiBCaW5kaW5nUmVjb3JkLCBpbmRleDogbnVtYmVyKSA9PiByZWNvcmRCdWlsZGVyLmFkZChiLCBkZWZpbml0aW9uLnZhcmlhYmxlTmFtZXMsIGluZGV4KSk7XG4gIHJldHVybiBjb2FsZXNjZShyZWNvcmRCdWlsZGVyLnJlY29yZHMpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlRXZlbnRSZWNvcmRzKGRlZmluaXRpb246IENoYW5nZURldGVjdG9yRGVmaW5pdGlvbik6IEV2ZW50QmluZGluZ1tdIHtcbiAgLy8gVE9ETzogdnNhdmtpbjogcmVtb3ZlICRldmVudCB3aGVuIHRoZSBjb21waWxlciBoYW5kbGVzIHJlbmRlci1zaWRlIHZhcmlhYmxlcyBwcm9wZXJseVxuICB2YXIgdmFyTmFtZXMgPSBMaXN0V3JhcHBlci5jb25jYXQoWyckZXZlbnQnXSwgZGVmaW5pdGlvbi52YXJpYWJsZU5hbWVzKTtcbiAgcmV0dXJuIGRlZmluaXRpb24uZXZlbnRSZWNvcmRzLm1hcChlciA9PiB7XG4gICAgdmFyIHJlY29yZHMgPSBfQ29udmVydEFzdEludG9Qcm90b1JlY29yZHMuY3JlYXRlKGVyLCB2YXJOYW1lcyk7XG4gICAgdmFyIGRpckluZGV4ID0gZXIuaW1wbGljaXRSZWNlaXZlciBpbnN0YW5jZW9mIERpcmVjdGl2ZUluZGV4ID8gZXIuaW1wbGljaXRSZWNlaXZlciA6IG51bGw7XG4gICAgcmV0dXJuIG5ldyBFdmVudEJpbmRpbmcoZXIudGFyZ2V0Lm5hbWUsIGVyLnRhcmdldC5lbGVtZW50SW5kZXgsIGRpckluZGV4LCByZWNvcmRzKTtcbiAgfSk7XG59XG5cbmV4cG9ydCBjbGFzcyBQcm90b1JlY29yZEJ1aWxkZXIge1xuICByZWNvcmRzOiBQcm90b1JlY29yZFtdID0gW107XG5cbiAgYWRkKGI6IEJpbmRpbmdSZWNvcmQsIHZhcmlhYmxlTmFtZXM6IHN0cmluZ1tdLCBiaW5kaW5nSW5kZXg6IG51bWJlcikge1xuICAgIHZhciBvbGRMYXN0ID0gTGlzdFdyYXBwZXIubGFzdCh0aGlzLnJlY29yZHMpO1xuICAgIGlmIChpc1ByZXNlbnQob2xkTGFzdCkgJiYgb2xkTGFzdC5iaW5kaW5nUmVjb3JkLmRpcmVjdGl2ZVJlY29yZCA9PSBiLmRpcmVjdGl2ZVJlY29yZCkge1xuICAgICAgb2xkTGFzdC5sYXN0SW5EaXJlY3RpdmUgPSBmYWxzZTtcbiAgICB9XG4gICAgdmFyIG51bWJlck9mUmVjb3Jkc0JlZm9yZSA9IHRoaXMucmVjb3Jkcy5sZW5ndGg7XG4gICAgdGhpcy5fYXBwZW5kUmVjb3JkcyhiLCB2YXJpYWJsZU5hbWVzLCBiaW5kaW5nSW5kZXgpO1xuICAgIHZhciBuZXdMYXN0ID0gTGlzdFdyYXBwZXIubGFzdCh0aGlzLnJlY29yZHMpO1xuICAgIGlmIChpc1ByZXNlbnQobmV3TGFzdCkgJiYgbmV3TGFzdCAhPT0gb2xkTGFzdCkge1xuICAgICAgbmV3TGFzdC5sYXN0SW5CaW5kaW5nID0gdHJ1ZTtcbiAgICAgIG5ld0xhc3QubGFzdEluRGlyZWN0aXZlID0gdHJ1ZTtcbiAgICAgIHRoaXMuX3NldEFyZ3VtZW50VG9QdXJlRnVuY3Rpb24obnVtYmVyT2ZSZWNvcmRzQmVmb3JlKTtcbiAgICB9XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIF9zZXRBcmd1bWVudFRvUHVyZUZ1bmN0aW9uKHN0YXJ0SW5kZXg6IG51bWJlcik6IHZvaWQge1xuICAgIGZvciAodmFyIGkgPSBzdGFydEluZGV4OyBpIDwgdGhpcy5yZWNvcmRzLmxlbmd0aDsgKytpKSB7XG4gICAgICB2YXIgcmVjID0gdGhpcy5yZWNvcmRzW2ldO1xuICAgICAgaWYgKHJlYy5pc1B1cmVGdW5jdGlvbigpKSB7XG4gICAgICAgIHJlYy5hcmdzLmZvckVhY2gocmVjb3JkSW5kZXggPT4gdGhpcy5yZWNvcmRzW3JlY29yZEluZGV4IC0gMV0uYXJndW1lbnRUb1B1cmVGdW5jdGlvbiA9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRydWUpO1xuICAgICAgfVxuICAgICAgaWYgKHJlYy5tb2RlID09PSBSZWNvcmRUeXBlLlBpcGUpIHtcbiAgICAgICAgcmVjLmFyZ3MuZm9yRWFjaChyZWNvcmRJbmRleCA9PiB0aGlzLnJlY29yZHNbcmVjb3JkSW5kZXggLSAxXS5hcmd1bWVudFRvUHVyZUZ1bmN0aW9uID1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJ1ZSk7XG4gICAgICAgIHRoaXMucmVjb3Jkc1tyZWMuY29udGV4dEluZGV4IC0gMV0uYXJndW1lbnRUb1B1cmVGdW5jdGlvbiA9IHRydWU7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfYXBwZW5kUmVjb3JkcyhiOiBCaW5kaW5nUmVjb3JkLCB2YXJpYWJsZU5hbWVzOiBzdHJpbmdbXSwgYmluZGluZ0luZGV4OiBudW1iZXIpIHtcbiAgICBpZiAoYi5pc0RpcmVjdGl2ZUxpZmVjeWNsZSgpKSB7XG4gICAgICB0aGlzLnJlY29yZHMucHVzaChuZXcgUHJvdG9SZWNvcmQoUmVjb3JkVHlwZS5EaXJlY3RpdmVMaWZlY3ljbGUsIGIubGlmZWN5Y2xlRXZlbnQsIG51bGwsIFtdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtdLCAtMSwgbnVsbCwgdGhpcy5yZWNvcmRzLmxlbmd0aCArIDEsIGIsIGZhbHNlLCBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmYWxzZSwgZmFsc2UsIG51bGwpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgX0NvbnZlcnRBc3RJbnRvUHJvdG9SZWNvcmRzLmFwcGVuZCh0aGlzLnJlY29yZHMsIGIsIHZhcmlhYmxlTmFtZXMsIGJpbmRpbmdJbmRleCk7XG4gICAgfVxuICB9XG59XG5cbmNsYXNzIF9Db252ZXJ0QXN0SW50b1Byb3RvUmVjb3JkcyBpbXBsZW1lbnRzIEFzdFZpc2l0b3Ige1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9yZWNvcmRzOiBQcm90b1JlY29yZFtdLCBwcml2YXRlIF9iaW5kaW5nUmVjb3JkOiBCaW5kaW5nUmVjb3JkLFxuICAgICAgICAgICAgICBwcml2YXRlIF92YXJpYWJsZU5hbWVzOiBzdHJpbmdbXSwgcHJpdmF0ZSBfYmluZGluZ0luZGV4OiBudW1iZXIpIHt9XG5cbiAgc3RhdGljIGFwcGVuZChyZWNvcmRzOiBQcm90b1JlY29yZFtdLCBiOiBCaW5kaW5nUmVjb3JkLCB2YXJpYWJsZU5hbWVzOiBzdHJpbmdbXSxcbiAgICAgICAgICAgICAgICBiaW5kaW5nSW5kZXg6IG51bWJlcikge1xuICAgIHZhciBjID0gbmV3IF9Db252ZXJ0QXN0SW50b1Byb3RvUmVjb3JkcyhyZWNvcmRzLCBiLCB2YXJpYWJsZU5hbWVzLCBiaW5kaW5nSW5kZXgpO1xuICAgIGIuYXN0LnZpc2l0KGMpO1xuICB9XG5cbiAgc3RhdGljIGNyZWF0ZShiOiBCaW5kaW5nUmVjb3JkLCB2YXJpYWJsZU5hbWVzOiBhbnlbXSk6IFByb3RvUmVjb3JkW10ge1xuICAgIHZhciByZWMgPSBbXTtcbiAgICBfQ29udmVydEFzdEludG9Qcm90b1JlY29yZHMuYXBwZW5kKHJlYywgYiwgdmFyaWFibGVOYW1lcywgbnVsbCk7XG4gICAgcmVjW3JlYy5sZW5ndGggLSAxXS5sYXN0SW5CaW5kaW5nID0gdHJ1ZTtcbiAgICByZXR1cm4gcmVjO1xuICB9XG5cbiAgdmlzaXRJbXBsaWNpdFJlY2VpdmVyKGFzdDogSW1wbGljaXRSZWNlaXZlcik6IGFueSB7IHJldHVybiB0aGlzLl9iaW5kaW5nUmVjb3JkLmltcGxpY2l0UmVjZWl2ZXI7IH1cblxuICB2aXNpdEludGVycG9sYXRpb24oYXN0OiBJbnRlcnBvbGF0aW9uKTogbnVtYmVyIHtcbiAgICB2YXIgYXJncyA9IHRoaXMuX3Zpc2l0QWxsKGFzdC5leHByZXNzaW9ucyk7XG4gICAgcmV0dXJuIHRoaXMuX2FkZFJlY29yZChSZWNvcmRUeXBlLkludGVycG9sYXRlLCBcImludGVycG9sYXRlXCIsIF9pbnRlcnBvbGF0aW9uRm4oYXN0LnN0cmluZ3MpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgYXJncywgYXN0LnN0cmluZ3MsIDApO1xuICB9XG5cbiAgdmlzaXRMaXRlcmFsUHJpbWl0aXZlKGFzdDogTGl0ZXJhbFByaW1pdGl2ZSk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuX2FkZFJlY29yZChSZWNvcmRUeXBlLkNvbnN0LCBcImxpdGVyYWxcIiwgYXN0LnZhbHVlLCBbXSwgbnVsbCwgMCk7XG4gIH1cblxuICB2aXNpdFByb3BlcnR5UmVhZChhc3Q6IFByb3BlcnR5UmVhZCk6IG51bWJlciB7XG4gICAgdmFyIHJlY2VpdmVyID0gYXN0LnJlY2VpdmVyLnZpc2l0KHRoaXMpO1xuICAgIGlmIChpc1ByZXNlbnQodGhpcy5fdmFyaWFibGVOYW1lcykgJiYgTGlzdFdyYXBwZXIuY29udGFpbnModGhpcy5fdmFyaWFibGVOYW1lcywgYXN0Lm5hbWUpICYmXG4gICAgICAgIGFzdC5yZWNlaXZlciBpbnN0YW5jZW9mIEltcGxpY2l0UmVjZWl2ZXIpIHtcbiAgICAgIHJldHVybiB0aGlzLl9hZGRSZWNvcmQoUmVjb3JkVHlwZS5Mb2NhbCwgYXN0Lm5hbWUsIGFzdC5uYW1lLCBbXSwgbnVsbCwgcmVjZWl2ZXIpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5fYWRkUmVjb3JkKFJlY29yZFR5cGUuUHJvcGVydHlSZWFkLCBhc3QubmFtZSwgYXN0LmdldHRlciwgW10sIG51bGwsIHJlY2VpdmVyKTtcbiAgICB9XG4gIH1cblxuICB2aXNpdFByb3BlcnR5V3JpdGUoYXN0OiBQcm9wZXJ0eVdyaXRlKTogbnVtYmVyIHtcbiAgICBpZiAoaXNQcmVzZW50KHRoaXMuX3ZhcmlhYmxlTmFtZXMpICYmIExpc3RXcmFwcGVyLmNvbnRhaW5zKHRoaXMuX3ZhcmlhYmxlTmFtZXMsIGFzdC5uYW1lKSAmJlxuICAgICAgICBhc3QucmVjZWl2ZXIgaW5zdGFuY2VvZiBJbXBsaWNpdFJlY2VpdmVyKSB7XG4gICAgICB0aHJvdyBuZXcgQmFzZUV4Y2VwdGlvbihgQ2Fubm90IHJlYXNzaWduIGEgdmFyaWFibGUgYmluZGluZyAke2FzdC5uYW1lfWApO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgcmVjZWl2ZXIgPSBhc3QucmVjZWl2ZXIudmlzaXQodGhpcyk7XG4gICAgICB2YXIgdmFsdWUgPSBhc3QudmFsdWUudmlzaXQodGhpcyk7XG4gICAgICByZXR1cm4gdGhpcy5fYWRkUmVjb3JkKFJlY29yZFR5cGUuUHJvcGVydHlXcml0ZSwgYXN0Lm5hbWUsIGFzdC5zZXR0ZXIsIFt2YWx1ZV0sIG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlY2VpdmVyKTtcbiAgICB9XG4gIH1cblxuICB2aXNpdEtleWVkV3JpdGUoYXN0OiBLZXllZFdyaXRlKTogbnVtYmVyIHtcbiAgICB2YXIgb2JqID0gYXN0Lm9iai52aXNpdCh0aGlzKTtcbiAgICB2YXIga2V5ID0gYXN0LmtleS52aXNpdCh0aGlzKTtcbiAgICB2YXIgdmFsdWUgPSBhc3QudmFsdWUudmlzaXQodGhpcyk7XG4gICAgcmV0dXJuIHRoaXMuX2FkZFJlY29yZChSZWNvcmRUeXBlLktleWVkV3JpdGUsIG51bGwsIG51bGwsIFtrZXksIHZhbHVlXSwgbnVsbCwgb2JqKTtcbiAgfVxuXG4gIHZpc2l0U2FmZVByb3BlcnR5UmVhZChhc3Q6IFNhZmVQcm9wZXJ0eVJlYWQpOiBudW1iZXIge1xuICAgIHZhciByZWNlaXZlciA9IGFzdC5yZWNlaXZlci52aXNpdCh0aGlzKTtcbiAgICByZXR1cm4gdGhpcy5fYWRkUmVjb3JkKFJlY29yZFR5cGUuU2FmZVByb3BlcnR5LCBhc3QubmFtZSwgYXN0LmdldHRlciwgW10sIG51bGwsIHJlY2VpdmVyKTtcbiAgfVxuXG4gIHZpc2l0TWV0aG9kQ2FsbChhc3Q6IE1ldGhvZENhbGwpOiBudW1iZXIge1xuICAgIHZhciByZWNlaXZlciA9IGFzdC5yZWNlaXZlci52aXNpdCh0aGlzKTtcbiAgICB2YXIgYXJncyA9IHRoaXMuX3Zpc2l0QWxsKGFzdC5hcmdzKTtcbiAgICBpZiAoaXNQcmVzZW50KHRoaXMuX3ZhcmlhYmxlTmFtZXMpICYmIExpc3RXcmFwcGVyLmNvbnRhaW5zKHRoaXMuX3ZhcmlhYmxlTmFtZXMsIGFzdC5uYW1lKSkge1xuICAgICAgdmFyIHRhcmdldCA9IHRoaXMuX2FkZFJlY29yZChSZWNvcmRUeXBlLkxvY2FsLCBhc3QubmFtZSwgYXN0Lm5hbWUsIFtdLCBudWxsLCByZWNlaXZlcik7XG4gICAgICByZXR1cm4gdGhpcy5fYWRkUmVjb3JkKFJlY29yZFR5cGUuSW52b2tlQ2xvc3VyZSwgXCJjbG9zdXJlXCIsIG51bGwsIGFyZ3MsIG51bGwsIHRhcmdldCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLl9hZGRSZWNvcmQoUmVjb3JkVHlwZS5JbnZva2VNZXRob2QsIGFzdC5uYW1lLCBhc3QuZm4sIGFyZ3MsIG51bGwsIHJlY2VpdmVyKTtcbiAgICB9XG4gIH1cblxuICB2aXNpdFNhZmVNZXRob2RDYWxsKGFzdDogU2FmZU1ldGhvZENhbGwpOiBudW1iZXIge1xuICAgIHZhciByZWNlaXZlciA9IGFzdC5yZWNlaXZlci52aXNpdCh0aGlzKTtcbiAgICB2YXIgYXJncyA9IHRoaXMuX3Zpc2l0QWxsKGFzdC5hcmdzKTtcbiAgICByZXR1cm4gdGhpcy5fYWRkUmVjb3JkKFJlY29yZFR5cGUuU2FmZU1ldGhvZEludm9rZSwgYXN0Lm5hbWUsIGFzdC5mbiwgYXJncywgbnVsbCwgcmVjZWl2ZXIpO1xuICB9XG5cbiAgdmlzaXRGdW5jdGlvbkNhbGwoYXN0OiBGdW5jdGlvbkNhbGwpOiBudW1iZXIge1xuICAgIHZhciB0YXJnZXQgPSBhc3QudGFyZ2V0LnZpc2l0KHRoaXMpO1xuICAgIHZhciBhcmdzID0gdGhpcy5fdmlzaXRBbGwoYXN0LmFyZ3MpO1xuICAgIHJldHVybiB0aGlzLl9hZGRSZWNvcmQoUmVjb3JkVHlwZS5JbnZva2VDbG9zdXJlLCBcImNsb3N1cmVcIiwgbnVsbCwgYXJncywgbnVsbCwgdGFyZ2V0KTtcbiAgfVxuXG4gIHZpc2l0TGl0ZXJhbEFycmF5KGFzdDogTGl0ZXJhbEFycmF5KTogbnVtYmVyIHtcbiAgICB2YXIgcHJpbWl0aXZlTmFtZSA9IGBhcnJheUZuJHthc3QuZXhwcmVzc2lvbnMubGVuZ3RofWA7XG4gICAgcmV0dXJuIHRoaXMuX2FkZFJlY29yZChSZWNvcmRUeXBlLkNvbGxlY3Rpb25MaXRlcmFsLCBwcmltaXRpdmVOYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgX2FycmF5Rm4oYXN0LmV4cHJlc3Npb25zLmxlbmd0aCksIHRoaXMuX3Zpc2l0QWxsKGFzdC5leHByZXNzaW9ucyksIG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAwKTtcbiAgfVxuXG4gIHZpc2l0TGl0ZXJhbE1hcChhc3Q6IExpdGVyYWxNYXApOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLl9hZGRSZWNvcmQoUmVjb3JkVHlwZS5Db2xsZWN0aW9uTGl0ZXJhbCwgX21hcFByaW1pdGl2ZU5hbWUoYXN0LmtleXMpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgQ2hhbmdlRGV0ZWN0aW9uVXRpbC5tYXBGbihhc3Qua2V5cyksIHRoaXMuX3Zpc2l0QWxsKGFzdC52YWx1ZXMpLCBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgMCk7XG4gIH1cblxuICB2aXNpdEJpbmFyeShhc3Q6IEJpbmFyeSk6IG51bWJlciB7XG4gICAgdmFyIGxlZnQgPSBhc3QubGVmdC52aXNpdCh0aGlzKTtcbiAgICBzd2l0Y2ggKGFzdC5vcGVyYXRpb24pIHtcbiAgICAgIGNhc2UgJyYmJzpcbiAgICAgICAgdmFyIGJyYW5jaEVuZCA9IFtudWxsXTtcbiAgICAgICAgdGhpcy5fYWRkUmVjb3JkKFJlY29yZFR5cGUuU2tpcFJlY29yZHNJZk5vdCwgXCJTa2lwUmVjb3Jkc0lmTm90XCIsIG51bGwsIFtdLCBicmFuY2hFbmQsIGxlZnQpO1xuICAgICAgICB2YXIgcmlnaHQgPSBhc3QucmlnaHQudmlzaXQodGhpcyk7XG4gICAgICAgIGJyYW5jaEVuZFswXSA9IHJpZ2h0O1xuICAgICAgICByZXR1cm4gdGhpcy5fYWRkUmVjb3JkKFJlY29yZFR5cGUuUHJpbWl0aXZlT3AsIFwiY29uZFwiLCBDaGFuZ2VEZXRlY3Rpb25VdGlsLmNvbmQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgW2xlZnQsIHJpZ2h0LCBsZWZ0XSwgbnVsbCwgMCk7XG5cbiAgICAgIGNhc2UgJ3x8JzpcbiAgICAgICAgdmFyIGJyYW5jaEVuZCA9IFtudWxsXTtcbiAgICAgICAgdGhpcy5fYWRkUmVjb3JkKFJlY29yZFR5cGUuU2tpcFJlY29yZHNJZiwgXCJTa2lwUmVjb3Jkc0lmXCIsIG51bGwsIFtdLCBicmFuY2hFbmQsIGxlZnQpO1xuICAgICAgICB2YXIgcmlnaHQgPSBhc3QucmlnaHQudmlzaXQodGhpcyk7XG4gICAgICAgIGJyYW5jaEVuZFswXSA9IHJpZ2h0O1xuICAgICAgICByZXR1cm4gdGhpcy5fYWRkUmVjb3JkKFJlY29yZFR5cGUuUHJpbWl0aXZlT3AsIFwiY29uZFwiLCBDaGFuZ2VEZXRlY3Rpb25VdGlsLmNvbmQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgW2xlZnQsIGxlZnQsIHJpZ2h0XSwgbnVsbCwgMCk7XG5cbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHZhciByaWdodCA9IGFzdC5yaWdodC52aXNpdCh0aGlzKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2FkZFJlY29yZChSZWNvcmRUeXBlLlByaW1pdGl2ZU9wLCBfb3BlcmF0aW9uVG9QcmltaXRpdmVOYW1lKGFzdC5vcGVyYXRpb24pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9vcGVyYXRpb25Ub0Z1bmN0aW9uKGFzdC5vcGVyYXRpb24pLCBbbGVmdCwgcmlnaHRdLCBudWxsLCAwKTtcbiAgICB9XG4gIH1cblxuICB2aXNpdFByZWZpeE5vdChhc3Q6IFByZWZpeE5vdCk6IG51bWJlciB7XG4gICAgdmFyIGV4cCA9IGFzdC5leHByZXNzaW9uLnZpc2l0KHRoaXMpO1xuICAgIHJldHVybiB0aGlzLl9hZGRSZWNvcmQoUmVjb3JkVHlwZS5QcmltaXRpdmVPcCwgXCJvcGVyYXRpb25fbmVnYXRlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBDaGFuZ2VEZXRlY3Rpb25VdGlsLm9wZXJhdGlvbl9uZWdhdGUsIFtleHBdLCBudWxsLCAwKTtcbiAgfVxuXG4gIHZpc2l0Q29uZGl0aW9uYWwoYXN0OiBDb25kaXRpb25hbCk6IG51bWJlciB7XG4gICAgdmFyIGNvbmRpdGlvbiA9IGFzdC5jb25kaXRpb24udmlzaXQodGhpcyk7XG4gICAgdmFyIHN0YXJ0T2ZGYWxzZUJyYW5jaCA9IFtudWxsXTtcbiAgICB2YXIgZW5kT2ZGYWxzZUJyYW5jaCA9IFtudWxsXTtcbiAgICB0aGlzLl9hZGRSZWNvcmQoUmVjb3JkVHlwZS5Ta2lwUmVjb3Jkc0lmTm90LCBcIlNraXBSZWNvcmRzSWZOb3RcIiwgbnVsbCwgW10sIHN0YXJ0T2ZGYWxzZUJyYW5jaCxcbiAgICAgICAgICAgICAgICAgICAgY29uZGl0aW9uKTtcbiAgICB2YXIgd2hlblRydWUgPSBhc3QudHJ1ZUV4cC52aXNpdCh0aGlzKTtcbiAgICB2YXIgc2tpcCA9XG4gICAgICAgIHRoaXMuX2FkZFJlY29yZChSZWNvcmRUeXBlLlNraXBSZWNvcmRzLCBcIlNraXBSZWNvcmRzXCIsIG51bGwsIFtdLCBlbmRPZkZhbHNlQnJhbmNoLCAwKTtcbiAgICB2YXIgd2hlbkZhbHNlID0gYXN0LmZhbHNlRXhwLnZpc2l0KHRoaXMpO1xuICAgIHN0YXJ0T2ZGYWxzZUJyYW5jaFswXSA9IHNraXA7XG4gICAgZW5kT2ZGYWxzZUJyYW5jaFswXSA9IHdoZW5GYWxzZTtcblxuICAgIHJldHVybiB0aGlzLl9hZGRSZWNvcmQoUmVjb3JkVHlwZS5QcmltaXRpdmVPcCwgXCJjb25kXCIsIENoYW5nZURldGVjdGlvblV0aWwuY29uZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIFtjb25kaXRpb24sIHdoZW5UcnVlLCB3aGVuRmFsc2VdLCBudWxsLCAwKTtcbiAgfVxuXG4gIHZpc2l0UGlwZShhc3Q6IEJpbmRpbmdQaXBlKTogbnVtYmVyIHtcbiAgICB2YXIgdmFsdWUgPSBhc3QuZXhwLnZpc2l0KHRoaXMpO1xuICAgIHZhciBhcmdzID0gdGhpcy5fdmlzaXRBbGwoYXN0LmFyZ3MpO1xuICAgIHJldHVybiB0aGlzLl9hZGRSZWNvcmQoUmVjb3JkVHlwZS5QaXBlLCBhc3QubmFtZSwgYXN0Lm5hbWUsIGFyZ3MsIG51bGwsIHZhbHVlKTtcbiAgfVxuXG4gIHZpc2l0S2V5ZWRSZWFkKGFzdDogS2V5ZWRSZWFkKTogbnVtYmVyIHtcbiAgICB2YXIgb2JqID0gYXN0Lm9iai52aXNpdCh0aGlzKTtcbiAgICB2YXIga2V5ID0gYXN0LmtleS52aXNpdCh0aGlzKTtcbiAgICByZXR1cm4gdGhpcy5fYWRkUmVjb3JkKFJlY29yZFR5cGUuS2V5ZWRSZWFkLCBcImtleWVkQWNjZXNzXCIsIENoYW5nZURldGVjdGlvblV0aWwua2V5ZWRBY2Nlc3MsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBba2V5XSwgbnVsbCwgb2JqKTtcbiAgfVxuXG4gIHZpc2l0Q2hhaW4oYXN0OiBDaGFpbik6IG51bWJlciB7XG4gICAgdmFyIGFyZ3MgPSBhc3QuZXhwcmVzc2lvbnMubWFwKGUgPT4gZS52aXNpdCh0aGlzKSk7XG4gICAgcmV0dXJuIHRoaXMuX2FkZFJlY29yZChSZWNvcmRUeXBlLkNoYWluLCBcImNoYWluXCIsIG51bGwsIGFyZ3MsIG51bGwsIDApO1xuICB9XG5cbiAgdmlzaXRRdW90ZShhc3Q6IFF1b3RlKTogdm9pZCB7XG4gICAgdGhyb3cgbmV3IEJhc2VFeGNlcHRpb24oXG4gICAgICAgIGBDYXVnaHQgdW5pbnRlcnByZXRlZCBleHByZXNzaW9uIGF0ICR7YXN0LmxvY2F0aW9ufTogJHthc3QudW5pbnRlcnByZXRlZEV4cHJlc3Npb259LiBgICtcbiAgICAgICAgYEV4cHJlc3Npb24gcHJlZml4ICR7YXN0LnByZWZpeH0gZGlkIG5vdCBtYXRjaCBhIHRlbXBsYXRlIHRyYW5zZm9ybWVyIHRvIGludGVycHJldCB0aGUgZXhwcmVzc2lvbi5gKTtcbiAgfVxuXG4gIHByaXZhdGUgX3Zpc2l0QWxsKGFzdHM6IGFueVtdKSB7XG4gICAgdmFyIHJlcyA9IExpc3RXcmFwcGVyLmNyZWF0ZUZpeGVkU2l6ZShhc3RzLmxlbmd0aCk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhc3RzLmxlbmd0aDsgKytpKSB7XG4gICAgICByZXNbaV0gPSBhc3RzW2ldLnZpc2l0KHRoaXMpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgYSBgUHJvdG9SZWNvcmRgIGFuZCByZXR1cm5zIGl0cyBzZWxmSW5kZXguXG4gICAqL1xuICBwcml2YXRlIF9hZGRSZWNvcmQodHlwZSwgbmFtZSwgZnVuY09yVmFsdWUsIGFyZ3MsIGZpeGVkQXJncywgY29udGV4dCk6IG51bWJlciB7XG4gICAgdmFyIHNlbGZJbmRleCA9IHRoaXMuX3JlY29yZHMubGVuZ3RoICsgMTtcbiAgICBpZiAoY29udGV4dCBpbnN0YW5jZW9mIERpcmVjdGl2ZUluZGV4KSB7XG4gICAgICB0aGlzLl9yZWNvcmRzLnB1c2gobmV3IFByb3RvUmVjb3JkKHR5cGUsIG5hbWUsIGZ1bmNPclZhbHVlLCBhcmdzLCBmaXhlZEFyZ3MsIC0xLCBjb250ZXh0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmSW5kZXgsIHRoaXMuX2JpbmRpbmdSZWNvcmQsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9iaW5kaW5nSW5kZXgpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fcmVjb3Jkcy5wdXNoKG5ldyBQcm90b1JlY29yZCh0eXBlLCBuYW1lLCBmdW5jT3JWYWx1ZSwgYXJncywgZml4ZWRBcmdzLCBjb250ZXh0LCBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmSW5kZXgsIHRoaXMuX2JpbmRpbmdSZWNvcmQsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9iaW5kaW5nSW5kZXgpKTtcbiAgICB9XG4gICAgcmV0dXJuIHNlbGZJbmRleDtcbiAgfVxufVxuXG5cbmZ1bmN0aW9uIF9hcnJheUZuKGxlbmd0aDogbnVtYmVyKTogRnVuY3Rpb24ge1xuICBzd2l0Y2ggKGxlbmd0aCkge1xuICAgIGNhc2UgMDpcbiAgICAgIHJldHVybiBDaGFuZ2VEZXRlY3Rpb25VdGlsLmFycmF5Rm4wO1xuICAgIGNhc2UgMTpcbiAgICAgIHJldHVybiBDaGFuZ2VEZXRlY3Rpb25VdGlsLmFycmF5Rm4xO1xuICAgIGNhc2UgMjpcbiAgICAgIHJldHVybiBDaGFuZ2VEZXRlY3Rpb25VdGlsLmFycmF5Rm4yO1xuICAgIGNhc2UgMzpcbiAgICAgIHJldHVybiBDaGFuZ2VEZXRlY3Rpb25VdGlsLmFycmF5Rm4zO1xuICAgIGNhc2UgNDpcbiAgICAgIHJldHVybiBDaGFuZ2VEZXRlY3Rpb25VdGlsLmFycmF5Rm40O1xuICAgIGNhc2UgNTpcbiAgICAgIHJldHVybiBDaGFuZ2VEZXRlY3Rpb25VdGlsLmFycmF5Rm41O1xuICAgIGNhc2UgNjpcbiAgICAgIHJldHVybiBDaGFuZ2VEZXRlY3Rpb25VdGlsLmFycmF5Rm42O1xuICAgIGNhc2UgNzpcbiAgICAgIHJldHVybiBDaGFuZ2VEZXRlY3Rpb25VdGlsLmFycmF5Rm43O1xuICAgIGNhc2UgODpcbiAgICAgIHJldHVybiBDaGFuZ2VEZXRlY3Rpb25VdGlsLmFycmF5Rm44O1xuICAgIGNhc2UgOTpcbiAgICAgIHJldHVybiBDaGFuZ2VEZXRlY3Rpb25VdGlsLmFycmF5Rm45O1xuICAgIGRlZmF1bHQ6XG4gICAgICB0aHJvdyBuZXcgQmFzZUV4Y2VwdGlvbihgRG9lcyBub3Qgc3VwcG9ydCBsaXRlcmFsIG1hcHMgd2l0aCBtb3JlIHRoYW4gOSBlbGVtZW50c2ApO1xuICB9XG59XG5cbmZ1bmN0aW9uIF9tYXBQcmltaXRpdmVOYW1lKGtleXM6IGFueVtdKSB7XG4gIHZhciBzdHJpbmdpZmllZEtleXMgPSBrZXlzLm1hcChrID0+IGlzU3RyaW5nKGspID8gYFwiJHtrfVwiYCA6IGAke2t9YCkuam9pbignLCAnKTtcbiAgcmV0dXJuIGBtYXBGbihbJHtzdHJpbmdpZmllZEtleXN9XSlgO1xufVxuXG5mdW5jdGlvbiBfb3BlcmF0aW9uVG9QcmltaXRpdmVOYW1lKG9wZXJhdGlvbjogc3RyaW5nKTogc3RyaW5nIHtcbiAgc3dpdGNoIChvcGVyYXRpb24pIHtcbiAgICBjYXNlICcrJzpcbiAgICAgIHJldHVybiBcIm9wZXJhdGlvbl9hZGRcIjtcbiAgICBjYXNlICctJzpcbiAgICAgIHJldHVybiBcIm9wZXJhdGlvbl9zdWJ0cmFjdFwiO1xuICAgIGNhc2UgJyonOlxuICAgICAgcmV0dXJuIFwib3BlcmF0aW9uX211bHRpcGx5XCI7XG4gICAgY2FzZSAnLyc6XG4gICAgICByZXR1cm4gXCJvcGVyYXRpb25fZGl2aWRlXCI7XG4gICAgY2FzZSAnJSc6XG4gICAgICByZXR1cm4gXCJvcGVyYXRpb25fcmVtYWluZGVyXCI7XG4gICAgY2FzZSAnPT0nOlxuICAgICAgcmV0dXJuIFwib3BlcmF0aW9uX2VxdWFsc1wiO1xuICAgIGNhc2UgJyE9JzpcbiAgICAgIHJldHVybiBcIm9wZXJhdGlvbl9ub3RfZXF1YWxzXCI7XG4gICAgY2FzZSAnPT09JzpcbiAgICAgIHJldHVybiBcIm9wZXJhdGlvbl9pZGVudGljYWxcIjtcbiAgICBjYXNlICchPT0nOlxuICAgICAgcmV0dXJuIFwib3BlcmF0aW9uX25vdF9pZGVudGljYWxcIjtcbiAgICBjYXNlICc8JzpcbiAgICAgIHJldHVybiBcIm9wZXJhdGlvbl9sZXNzX3RoZW5cIjtcbiAgICBjYXNlICc+JzpcbiAgICAgIHJldHVybiBcIm9wZXJhdGlvbl9ncmVhdGVyX3RoZW5cIjtcbiAgICBjYXNlICc8PSc6XG4gICAgICByZXR1cm4gXCJvcGVyYXRpb25fbGVzc19vcl9lcXVhbHNfdGhlblwiO1xuICAgIGNhc2UgJz49JzpcbiAgICAgIHJldHVybiBcIm9wZXJhdGlvbl9ncmVhdGVyX29yX2VxdWFsc190aGVuXCI7XG4gICAgZGVmYXVsdDpcbiAgICAgIHRocm93IG5ldyBCYXNlRXhjZXB0aW9uKGBVbnN1cHBvcnRlZCBvcGVyYXRpb24gJHtvcGVyYXRpb259YCk7XG4gIH1cbn1cblxuZnVuY3Rpb24gX29wZXJhdGlvblRvRnVuY3Rpb24ob3BlcmF0aW9uOiBzdHJpbmcpOiBGdW5jdGlvbiB7XG4gIHN3aXRjaCAob3BlcmF0aW9uKSB7XG4gICAgY2FzZSAnKyc6XG4gICAgICByZXR1cm4gQ2hhbmdlRGV0ZWN0aW9uVXRpbC5vcGVyYXRpb25fYWRkO1xuICAgIGNhc2UgJy0nOlxuICAgICAgcmV0dXJuIENoYW5nZURldGVjdGlvblV0aWwub3BlcmF0aW9uX3N1YnRyYWN0O1xuICAgIGNhc2UgJyonOlxuICAgICAgcmV0dXJuIENoYW5nZURldGVjdGlvblV0aWwub3BlcmF0aW9uX211bHRpcGx5O1xuICAgIGNhc2UgJy8nOlxuICAgICAgcmV0dXJuIENoYW5nZURldGVjdGlvblV0aWwub3BlcmF0aW9uX2RpdmlkZTtcbiAgICBjYXNlICclJzpcbiAgICAgIHJldHVybiBDaGFuZ2VEZXRlY3Rpb25VdGlsLm9wZXJhdGlvbl9yZW1haW5kZXI7XG4gICAgY2FzZSAnPT0nOlxuICAgICAgcmV0dXJuIENoYW5nZURldGVjdGlvblV0aWwub3BlcmF0aW9uX2VxdWFscztcbiAgICBjYXNlICchPSc6XG4gICAgICByZXR1cm4gQ2hhbmdlRGV0ZWN0aW9uVXRpbC5vcGVyYXRpb25fbm90X2VxdWFscztcbiAgICBjYXNlICc9PT0nOlxuICAgICAgcmV0dXJuIENoYW5nZURldGVjdGlvblV0aWwub3BlcmF0aW9uX2lkZW50aWNhbDtcbiAgICBjYXNlICchPT0nOlxuICAgICAgcmV0dXJuIENoYW5nZURldGVjdGlvblV0aWwub3BlcmF0aW9uX25vdF9pZGVudGljYWw7XG4gICAgY2FzZSAnPCc6XG4gICAgICByZXR1cm4gQ2hhbmdlRGV0ZWN0aW9uVXRpbC5vcGVyYXRpb25fbGVzc190aGVuO1xuICAgIGNhc2UgJz4nOlxuICAgICAgcmV0dXJuIENoYW5nZURldGVjdGlvblV0aWwub3BlcmF0aW9uX2dyZWF0ZXJfdGhlbjtcbiAgICBjYXNlICc8PSc6XG4gICAgICByZXR1cm4gQ2hhbmdlRGV0ZWN0aW9uVXRpbC5vcGVyYXRpb25fbGVzc19vcl9lcXVhbHNfdGhlbjtcbiAgICBjYXNlICc+PSc6XG4gICAgICByZXR1cm4gQ2hhbmdlRGV0ZWN0aW9uVXRpbC5vcGVyYXRpb25fZ3JlYXRlcl9vcl9lcXVhbHNfdGhlbjtcbiAgICBkZWZhdWx0OlxuICAgICAgdGhyb3cgbmV3IEJhc2VFeGNlcHRpb24oYFVuc3VwcG9ydGVkIG9wZXJhdGlvbiAke29wZXJhdGlvbn1gKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBzKHYpOiBzdHJpbmcge1xuICByZXR1cm4gaXNQcmVzZW50KHYpID8gYCR7dn1gIDogJyc7XG59XG5cbmZ1bmN0aW9uIF9pbnRlcnBvbGF0aW9uRm4oc3RyaW5nczogYW55W10pIHtcbiAgdmFyIGxlbmd0aCA9IHN0cmluZ3MubGVuZ3RoO1xuICB2YXIgYzAgPSBsZW5ndGggPiAwID8gc3RyaW5nc1swXSA6IG51bGw7XG4gIHZhciBjMSA9IGxlbmd0aCA+IDEgPyBzdHJpbmdzWzFdIDogbnVsbDtcbiAgdmFyIGMyID0gbGVuZ3RoID4gMiA/IHN0cmluZ3NbMl0gOiBudWxsO1xuICB2YXIgYzMgPSBsZW5ndGggPiAzID8gc3RyaW5nc1szXSA6IG51bGw7XG4gIHZhciBjNCA9IGxlbmd0aCA+IDQgPyBzdHJpbmdzWzRdIDogbnVsbDtcbiAgdmFyIGM1ID0gbGVuZ3RoID4gNSA/IHN0cmluZ3NbNV0gOiBudWxsO1xuICB2YXIgYzYgPSBsZW5ndGggPiA2ID8gc3RyaW5nc1s2XSA6IG51bGw7XG4gIHZhciBjNyA9IGxlbmd0aCA+IDcgPyBzdHJpbmdzWzddIDogbnVsbDtcbiAgdmFyIGM4ID0gbGVuZ3RoID4gOCA/IHN0cmluZ3NbOF0gOiBudWxsO1xuICB2YXIgYzkgPSBsZW5ndGggPiA5ID8gc3RyaW5nc1s5XSA6IG51bGw7XG4gIHN3aXRjaCAobGVuZ3RoIC0gMSkge1xuICAgIGNhc2UgMTpcbiAgICAgIHJldHVybiAoYTEpID0+IGMwICsgcyhhMSkgKyBjMTtcbiAgICBjYXNlIDI6XG4gICAgICByZXR1cm4gKGExLCBhMikgPT4gYzAgKyBzKGExKSArIGMxICsgcyhhMikgKyBjMjtcbiAgICBjYXNlIDM6XG4gICAgICByZXR1cm4gKGExLCBhMiwgYTMpID0+IGMwICsgcyhhMSkgKyBjMSArIHMoYTIpICsgYzIgKyBzKGEzKSArIGMzO1xuICAgIGNhc2UgNDpcbiAgICAgIHJldHVybiAoYTEsIGEyLCBhMywgYTQpID0+IGMwICsgcyhhMSkgKyBjMSArIHMoYTIpICsgYzIgKyBzKGEzKSArIGMzICsgcyhhNCkgKyBjNDtcbiAgICBjYXNlIDU6XG4gICAgICByZXR1cm4gKGExLCBhMiwgYTMsIGE0LCBhNSkgPT5cbiAgICAgICAgICAgICAgICAgYzAgKyBzKGExKSArIGMxICsgcyhhMikgKyBjMiArIHMoYTMpICsgYzMgKyBzKGE0KSArIGM0ICsgcyhhNSkgKyBjNTtcbiAgICBjYXNlIDY6XG4gICAgICByZXR1cm4gKGExLCBhMiwgYTMsIGE0LCBhNSwgYTYpID0+XG4gICAgICAgICAgICAgICAgIGMwICsgcyhhMSkgKyBjMSArIHMoYTIpICsgYzIgKyBzKGEzKSArIGMzICsgcyhhNCkgKyBjNCArIHMoYTUpICsgYzUgKyBzKGE2KSArIGM2O1xuICAgIGNhc2UgNzpcbiAgICAgIHJldHVybiAoYTEsIGEyLCBhMywgYTQsIGE1LCBhNiwgYTcpID0+IGMwICsgcyhhMSkgKyBjMSArIHMoYTIpICsgYzIgKyBzKGEzKSArIGMzICsgcyhhNCkgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYzQgKyBzKGE1KSArIGM1ICsgcyhhNikgKyBjNiArIHMoYTcpICsgYzc7XG4gICAgY2FzZSA4OlxuICAgICAgcmV0dXJuIChhMSwgYTIsIGEzLCBhNCwgYTUsIGE2LCBhNywgYTgpID0+IGMwICsgcyhhMSkgKyBjMSArIHMoYTIpICsgYzIgKyBzKGEzKSArIGMzICsgcyhhNCkgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGM0ICsgcyhhNSkgKyBjNSArIHMoYTYpICsgYzYgKyBzKGE3KSArIGM3ICsgcyhhOCkgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGM4O1xuICAgIGNhc2UgOTpcbiAgICAgIHJldHVybiAoYTEsIGEyLCBhMywgYTQsIGE1LCBhNiwgYTcsIGE4LCBhOSkgPT4gYzAgKyBzKGExKSArIGMxICsgcyhhMikgKyBjMiArIHMoYTMpICsgYzMgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzKGE0KSArIGM0ICsgcyhhNSkgKyBjNSArIHMoYTYpICsgYzYgKyBzKGE3KSArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGM3ICsgcyhhOCkgKyBjOCArIHMoYTkpICsgYzk7XG4gICAgZGVmYXVsdDpcbiAgICAgIHRocm93IG5ldyBCYXNlRXhjZXB0aW9uKGBEb2VzIG5vdCBzdXBwb3J0IG1vcmUgdGhhbiA5IGV4cHJlc3Npb25zYCk7XG4gIH1cbn1cbiJdfQ==