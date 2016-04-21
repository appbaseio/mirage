'use strict';"use strict";
var lang_1 = require('angular2/src/facade/lang');
var codegen_facade_1 = require('./codegen_facade');
var proto_record_1 = require('./proto_record');
var exceptions_1 = require('angular2/src/facade/exceptions');
/**
 * Class responsible for providing change detection logic for change detector classes.
 */
var CodegenLogicUtil = (function () {
    function CodegenLogicUtil(_names, _utilName, _changeDetectorStateName) {
        this._names = _names;
        this._utilName = _utilName;
        this._changeDetectorStateName = _changeDetectorStateName;
    }
    /**
     * Generates a statement which updates the local variable representing `protoRec` with the current
     * value of the record. Used by property bindings.
     */
    CodegenLogicUtil.prototype.genPropertyBindingEvalValue = function (protoRec) {
        var _this = this;
        return this._genEvalValue(protoRec, function (idx) { return _this._names.getLocalName(idx); }, this._names.getLocalsAccessorName());
    };
    /**
     * Generates a statement which updates the local variable representing `protoRec` with the current
     * value of the record. Used by event bindings.
     */
    CodegenLogicUtil.prototype.genEventBindingEvalValue = function (eventRecord, protoRec) {
        var _this = this;
        return this._genEvalValue(protoRec, function (idx) { return _this._names.getEventLocalName(eventRecord, idx); }, "locals");
    };
    CodegenLogicUtil.prototype._genEvalValue = function (protoRec, getLocalName, localsAccessor) {
        var context = (protoRec.contextIndex == -1) ?
            this._names.getDirectiveName(protoRec.directiveIndex) :
            getLocalName(protoRec.contextIndex);
        var argString = protoRec.args.map(function (arg) { return getLocalName(arg); }).join(", ");
        var rhs;
        switch (protoRec.mode) {
            case proto_record_1.RecordType.Self:
                rhs = context;
                break;
            case proto_record_1.RecordType.Const:
                rhs = codegen_facade_1.codify(protoRec.funcOrValue);
                break;
            case proto_record_1.RecordType.PropertyRead:
                rhs = context + "." + protoRec.name;
                break;
            case proto_record_1.RecordType.SafeProperty:
                var read = context + "." + protoRec.name;
                rhs = this._utilName + ".isValueBlank(" + context + ") ? null : " + read;
                break;
            case proto_record_1.RecordType.PropertyWrite:
                rhs = context + "." + protoRec.name + " = " + getLocalName(protoRec.args[0]);
                break;
            case proto_record_1.RecordType.Local:
                rhs = localsAccessor + ".get(" + codegen_facade_1.rawString(protoRec.name) + ")";
                break;
            case proto_record_1.RecordType.InvokeMethod:
                rhs = context + "." + protoRec.name + "(" + argString + ")";
                break;
            case proto_record_1.RecordType.SafeMethodInvoke:
                var invoke = context + "." + protoRec.name + "(" + argString + ")";
                rhs = this._utilName + ".isValueBlank(" + context + ") ? null : " + invoke;
                break;
            case proto_record_1.RecordType.InvokeClosure:
                rhs = context + "(" + argString + ")";
                break;
            case proto_record_1.RecordType.PrimitiveOp:
                rhs = this._utilName + "." + protoRec.name + "(" + argString + ")";
                break;
            case proto_record_1.RecordType.CollectionLiteral:
                rhs = this._utilName + "." + protoRec.name + "(" + argString + ")";
                break;
            case proto_record_1.RecordType.Interpolate:
                rhs = this._genInterpolation(protoRec);
                break;
            case proto_record_1.RecordType.KeyedRead:
                rhs = context + "[" + getLocalName(protoRec.args[0]) + "]";
                break;
            case proto_record_1.RecordType.KeyedWrite:
                rhs = context + "[" + getLocalName(protoRec.args[0]) + "] = " + getLocalName(protoRec.args[1]);
                break;
            case proto_record_1.RecordType.Chain:
                rhs = "" + getLocalName(protoRec.args[protoRec.args.length - 1]);
                break;
            default:
                throw new exceptions_1.BaseException("Unknown operation " + protoRec.mode);
        }
        return getLocalName(protoRec.selfIndex) + " = " + rhs + ";";
    };
    CodegenLogicUtil.prototype.genPropertyBindingTargets = function (propertyBindingTargets, genDebugInfo) {
        var _this = this;
        var bs = propertyBindingTargets.map(function (b) {
            if (lang_1.isBlank(b))
                return "null";
            var debug = genDebugInfo ? codegen_facade_1.codify(b.debug) : "null";
            return _this._utilName + ".bindingTarget(" + codegen_facade_1.codify(b.mode) + ", " + b.elementIndex + ", " + codegen_facade_1.codify(b.name) + ", " + codegen_facade_1.codify(b.unit) + ", " + debug + ")";
        });
        return "[" + bs.join(", ") + "]";
    };
    CodegenLogicUtil.prototype.genDirectiveIndices = function (directiveRecords) {
        var _this = this;
        var bs = directiveRecords.map(function (b) {
            return (_this._utilName + ".directiveIndex(" + b.directiveIndex.elementIndex + ", " + b.directiveIndex.directiveIndex + ")");
        });
        return "[" + bs.join(", ") + "]";
    };
    /** @internal */
    CodegenLogicUtil.prototype._genInterpolation = function (protoRec) {
        var iVals = [];
        for (var i = 0; i < protoRec.args.length; ++i) {
            iVals.push(codegen_facade_1.codify(protoRec.fixedArgs[i]));
            iVals.push(this._utilName + ".s(" + this._names.getLocalName(protoRec.args[i]) + ")");
        }
        iVals.push(codegen_facade_1.codify(protoRec.fixedArgs[protoRec.args.length]));
        return codegen_facade_1.combineGeneratedStrings(iVals);
    };
    CodegenLogicUtil.prototype.genHydrateDirectives = function (directiveRecords) {
        var _this = this;
        var res = [];
        var outputCount = 0;
        for (var i = 0; i < directiveRecords.length; ++i) {
            var r = directiveRecords[i];
            var dirVarName = this._names.getDirectiveName(r.directiveIndex);
            res.push(dirVarName + " = " + this._genReadDirective(i) + ";");
            if (lang_1.isPresent(r.outputs)) {
                r.outputs.forEach(function (output) {
                    var eventHandlerExpr = _this._genEventHandler(r.directiveIndex.elementIndex, output[1]);
                    var statementStart = "this.outputSubscriptions[" + outputCount++ + "] = " + dirVarName + "." + output[0];
                    if (lang_1.IS_DART) {
                        res.push(statementStart + ".listen(" + eventHandlerExpr + ");");
                    }
                    else {
                        res.push(statementStart + ".subscribe({next: " + eventHandlerExpr + "});");
                    }
                });
            }
        }
        if (outputCount > 0) {
            var statementStart = 'this.outputSubscriptions';
            if (lang_1.IS_DART) {
                res.unshift(statementStart + " = new List(" + outputCount + ");");
            }
            else {
                res.unshift(statementStart + " = new Array(" + outputCount + ");");
            }
        }
        return res.join("\n");
    };
    CodegenLogicUtil.prototype.genDirectivesOnDestroy = function (directiveRecords) {
        var res = [];
        for (var i = 0; i < directiveRecords.length; ++i) {
            var r = directiveRecords[i];
            if (r.callOnDestroy) {
                var dirVarName = this._names.getDirectiveName(r.directiveIndex);
                res.push(dirVarName + ".ngOnDestroy();");
            }
        }
        return res.join("\n");
    };
    CodegenLogicUtil.prototype._genEventHandler = function (boundElementIndex, eventName) {
        if (lang_1.IS_DART) {
            return "(event) => this.handleEvent('" + eventName + "', " + boundElementIndex + ", event)";
        }
        else {
            return "(function(event) { return this.handleEvent('" + eventName + "', " + boundElementIndex + ", event); }).bind(this)";
        }
    };
    CodegenLogicUtil.prototype._genReadDirective = function (index) { return "this.getDirectiveFor(directives, " + index + ")"; };
    CodegenLogicUtil.prototype.genHydrateDetectors = function (directiveRecords) {
        var res = [];
        for (var i = 0; i < directiveRecords.length; ++i) {
            var r = directiveRecords[i];
            if (!r.isDefaultChangeDetection()) {
                res.push(this._names.getDetectorName(r.directiveIndex) + " = this.getDetectorFor(directives, " + i + ");");
            }
        }
        return res.join("\n");
    };
    CodegenLogicUtil.prototype.genContentLifecycleCallbacks = function (directiveRecords) {
        var res = [];
        var eq = lang_1.IS_DART ? '==' : '===';
        // NOTE(kegluneq): Order is important!
        for (var i = directiveRecords.length - 1; i >= 0; --i) {
            var dir = directiveRecords[i];
            if (dir.callAfterContentInit) {
                res.push("if(" + this._names.getStateName() + " " + eq + " " + this._changeDetectorStateName + ".NeverChecked) " + this._names.getDirectiveName(dir.directiveIndex) + ".ngAfterContentInit();");
            }
            if (dir.callAfterContentChecked) {
                res.push(this._names.getDirectiveName(dir.directiveIndex) + ".ngAfterContentChecked();");
            }
        }
        return res;
    };
    CodegenLogicUtil.prototype.genViewLifecycleCallbacks = function (directiveRecords) {
        var res = [];
        var eq = lang_1.IS_DART ? '==' : '===';
        // NOTE(kegluneq): Order is important!
        for (var i = directiveRecords.length - 1; i >= 0; --i) {
            var dir = directiveRecords[i];
            if (dir.callAfterViewInit) {
                res.push("if(" + this._names.getStateName() + " " + eq + " " + this._changeDetectorStateName + ".NeverChecked) " + this._names.getDirectiveName(dir.directiveIndex) + ".ngAfterViewInit();");
            }
            if (dir.callAfterViewChecked) {
                res.push(this._names.getDirectiveName(dir.directiveIndex) + ".ngAfterViewChecked();");
            }
        }
        return res;
    };
    return CodegenLogicUtil;
}());
exports.CodegenLogicUtil = CodegenLogicUtil;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29kZWdlbl9sb2dpY191dGlsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZGlmZmluZ19wbHVnaW5fd3JhcHBlci1vdXRwdXRfcGF0aC1qYWtYbk1tTC50bXAvYW5ndWxhcjIvc3JjL2NvcmUvY2hhbmdlX2RldGVjdGlvbi9jb2RlZ2VuX2xvZ2ljX3V0aWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLHFCQUErRCwwQkFBMEIsQ0FBQyxDQUFBO0FBRTFGLCtCQUF5RCxrQkFBa0IsQ0FBQyxDQUFBO0FBQzVFLDZCQUFzQyxnQkFBZ0IsQ0FBQyxDQUFBO0FBR3ZELDJCQUE0QixnQ0FBZ0MsQ0FBQyxDQUFBO0FBRTdEOztHQUVHO0FBQ0g7SUFDRSwwQkFBb0IsTUFBdUIsRUFBVSxTQUFpQixFQUNsRCx3QkFBZ0M7UUFEaEMsV0FBTSxHQUFOLE1BQU0sQ0FBaUI7UUFBVSxjQUFTLEdBQVQsU0FBUyxDQUFRO1FBQ2xELDZCQUF3QixHQUF4Qix3QkFBd0IsQ0FBUTtJQUFHLENBQUM7SUFFeEQ7OztPQUdHO0lBQ0gsc0RBQTJCLEdBQTNCLFVBQTRCLFFBQXFCO1FBQWpELGlCQUdDO1FBRkMsTUFBTSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxFQUFFLFVBQUEsR0FBRyxJQUFJLE9BQUEsS0FBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLEVBQTdCLENBQTZCLEVBQzlDLElBQUksQ0FBQyxNQUFNLENBQUMscUJBQXFCLEVBQUUsQ0FBQyxDQUFDO0lBQ2pFLENBQUM7SUFFRDs7O09BR0c7SUFDSCxtREFBd0IsR0FBeEIsVUFBeUIsV0FBZ0IsRUFBRSxRQUFxQjtRQUFoRSxpQkFHQztRQUZDLE1BQU0sQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsRUFBRSxVQUFBLEdBQUcsSUFBSSxPQUFBLEtBQUksQ0FBQyxNQUFNLENBQUMsaUJBQWlCLENBQUMsV0FBVyxFQUFFLEdBQUcsQ0FBQyxFQUEvQyxDQUErQyxF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QUFDLE1BQU0sR0FBRyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDO1lBQ3RELElBQUksR0FBRyxHQUFHLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzlCLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUM7Z0JBQzFCLEdBQUcsQ0FBQyxJQUFJLENBQ0osUUFBTSxJQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksRUFBRSxTQUFJLEVBQUUsU0FBSSxJQUFJLENBQUMsd0JBQXdCLHVCQUFrQixJQUFJLENBQUMsTUFBTSxDQUFDLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsd0JBQXFCLENBQUMsQ0FBQztZQUN0SyxDQUFDO1lBRUQsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLG9CQUFvQixDQUFDLENBQUMsQ0FBQztnQkFDN0IsR0FBRyxDQUFDLElBQUksQ0FBSSxJQUFJLENBQUMsTUFBTSxDQUFDLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsMkJBQXdCLENBQUMsQ0FBQztZQUN4RixDQUFDO1FBQ0gsQ0FBQztRQUNELE1BQU0sQ0FBQyxHQUFHLENBQUM7SUFDYixDQUFDO0lBQ0gsdUJBQUM7QUFBRCxDQUFDLEFBcE9ELElBb09DO0FBcE9ZLHdCQUFnQixtQkFvTzVCLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0lTX0RBUlQsIEpzb24sIFN0cmluZ1dyYXBwZXIsIGlzUHJlc2VudCwgaXNCbGFua30gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9sYW5nJztcbmltcG9ydCB7Q29kZWdlbk5hbWVVdGlsfSBmcm9tICcuL2NvZGVnZW5fbmFtZV91dGlsJztcbmltcG9ydCB7Y29kaWZ5LCBjb21iaW5lR2VuZXJhdGVkU3RyaW5ncywgcmF3U3RyaW5nfSBmcm9tICcuL2NvZGVnZW5fZmFjYWRlJztcbmltcG9ydCB7UHJvdG9SZWNvcmQsIFJlY29yZFR5cGV9IGZyb20gJy4vcHJvdG9fcmVjb3JkJztcbmltcG9ydCB7QmluZGluZ1RhcmdldH0gZnJvbSAnLi9iaW5kaW5nX3JlY29yZCc7XG5pbXBvcnQge0RpcmVjdGl2ZVJlY29yZH0gZnJvbSAnLi9kaXJlY3RpdmVfcmVjb3JkJztcbmltcG9ydCB7QmFzZUV4Y2VwdGlvbn0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9leGNlcHRpb25zJztcblxuLyoqXG4gKiBDbGFzcyByZXNwb25zaWJsZSBmb3IgcHJvdmlkaW5nIGNoYW5nZSBkZXRlY3Rpb24gbG9naWMgZm9yIGNoYW5nZSBkZXRlY3RvciBjbGFzc2VzLlxuICovXG5leHBvcnQgY2xhc3MgQ29kZWdlbkxvZ2ljVXRpbCB7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgX25hbWVzOiBDb2RlZ2VuTmFtZVV0aWwsIHByaXZhdGUgX3V0aWxOYW1lOiBzdHJpbmcsXG4gICAgICAgICAgICAgIHByaXZhdGUgX2NoYW5nZURldGVjdG9yU3RhdGVOYW1lOiBzdHJpbmcpIHt9XG5cbiAgLyoqXG4gICAqIEdlbmVyYXRlcyBhIHN0YXRlbWVudCB3aGljaCB1cGRhdGVzIHRoZSBsb2NhbCB2YXJpYWJsZSByZXByZXNlbnRpbmcgYHByb3RvUmVjYCB3aXRoIHRoZSBjdXJyZW50XG4gICAqIHZhbHVlIG9mIHRoZSByZWNvcmQuIFVzZWQgYnkgcHJvcGVydHkgYmluZGluZ3MuXG4gICAqL1xuICBnZW5Qcm9wZXJ0eUJpbmRpbmdFdmFsVmFsdWUocHJvdG9SZWM6IFByb3RvUmVjb3JkKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5fZ2VuRXZhbFZhbHVlKHByb3RvUmVjLCBpZHggPT4gdGhpcy5fbmFtZXMuZ2V0TG9jYWxOYW1lKGlkeCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9uYW1lcy5nZXRMb2NhbHNBY2Nlc3Nvck5hbWUoKSk7XG4gIH1cblxuICAvKipcbiAgICogR2VuZXJhdGVzIGEgc3RhdGVtZW50IHdoaWNoIHVwZGF0ZXMgdGhlIGxvY2FsIHZhcmlhYmxlIHJlcHJlc2VudGluZyBgcHJvdG9SZWNgIHdpdGggdGhlIGN1cnJlbnRcbiAgICogdmFsdWUgb2YgdGhlIHJlY29yZC4gVXNlZCBieSBldmVudCBiaW5kaW5ncy5cbiAgICovXG4gIGdlbkV2ZW50QmluZGluZ0V2YWxWYWx1ZShldmVudFJlY29yZDogYW55LCBwcm90b1JlYzogUHJvdG9SZWNvcmQpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLl9nZW5FdmFsVmFsdWUocHJvdG9SZWMsIGlkeCA9PiB0aGlzLl9uYW1lcy5nZXRFdmVudExvY2FsTmFtZShldmVudFJlY29yZCwgaWR4KSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwibG9jYWxzXCIpO1xuICB9XG5cbiAgcHJpdmF0ZSBfZ2VuRXZhbFZhbHVlKHByb3RvUmVjOiBQcm90b1JlY29yZCwgZ2V0TG9jYWxOYW1lOiBGdW5jdGlvbixcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvY2Fsc0FjY2Vzc29yOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIHZhciBjb250ZXh0ID0gKHByb3RvUmVjLmNvbnRleHRJbmRleCA9PSAtMSkgP1xuICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX25hbWVzLmdldERpcmVjdGl2ZU5hbWUocHJvdG9SZWMuZGlyZWN0aXZlSW5kZXgpIDpcbiAgICAgICAgICAgICAgICAgICAgICBnZXRMb2NhbE5hbWUocHJvdG9SZWMuY29udGV4dEluZGV4KTtcbiAgICB2YXIgYXJnU3RyaW5nID0gcHJvdG9SZWMuYXJncy5tYXAoYXJnID0+IGdldExvY2FsTmFtZShhcmcpKS5qb2luKFwiLCBcIik7XG5cbiAgICB2YXIgcmhzOiBzdHJpbmc7XG4gICAgc3dpdGNoIChwcm90b1JlYy5tb2RlKSB7XG4gICAgICBjYXNlIFJlY29yZFR5cGUuU2VsZjpcbiAgICAgICAgcmhzID0gY29udGV4dDtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgUmVjb3JkVHlwZS5Db25zdDpcbiAgICAgICAgcmhzID0gY29kaWZ5KHByb3RvUmVjLmZ1bmNPclZhbHVlKTtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgUmVjb3JkVHlwZS5Qcm9wZXJ0eVJlYWQ6XG4gICAgICAgIHJocyA9IGAke2NvbnRleHR9LiR7cHJvdG9SZWMubmFtZX1gO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSBSZWNvcmRUeXBlLlNhZmVQcm9wZXJ0eTpcbiAgICAgICAgdmFyIHJlYWQgPSBgJHtjb250ZXh0fS4ke3Byb3RvUmVjLm5hbWV9YDtcbiAgICAgICAgcmhzID0gYCR7dGhpcy5fdXRpbE5hbWV9LmlzVmFsdWVCbGFuaygke2NvbnRleHR9KSA/IG51bGwgOiAke3JlYWR9YDtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgUmVjb3JkVHlwZS5Qcm9wZXJ0eVdyaXRlOlxuICAgICAgICByaHMgPSBgJHtjb250ZXh0fS4ke3Byb3RvUmVjLm5hbWV9ID0gJHtnZXRMb2NhbE5hbWUocHJvdG9SZWMuYXJnc1swXSl9YDtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgUmVjb3JkVHlwZS5Mb2NhbDpcbiAgICAgICAgcmhzID0gYCR7bG9jYWxzQWNjZXNzb3J9LmdldCgke3Jhd1N0cmluZyhwcm90b1JlYy5uYW1lKX0pYDtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgUmVjb3JkVHlwZS5JbnZva2VNZXRob2Q6XG4gICAgICAgIHJocyA9IGAke2NvbnRleHR9LiR7cHJvdG9SZWMubmFtZX0oJHthcmdTdHJpbmd9KWA7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlIFJlY29yZFR5cGUuU2FmZU1ldGhvZEludm9rZTpcbiAgICAgICAgdmFyIGludm9rZSA9IGAke2NvbnRleHR9LiR7cHJvdG9SZWMubmFtZX0oJHthcmdTdHJpbmd9KWA7XG4gICAgICAgIHJocyA9IGAke3RoaXMuX3V0aWxOYW1lfS5pc1ZhbHVlQmxhbmsoJHtjb250ZXh0fSkgPyBudWxsIDogJHtpbnZva2V9YDtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgUmVjb3JkVHlwZS5JbnZva2VDbG9zdXJlOlxuICAgICAgICByaHMgPSBgJHtjb250ZXh0fSgke2FyZ1N0cmluZ30pYDtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgUmVjb3JkVHlwZS5QcmltaXRpdmVPcDpcbiAgICAgICAgcmhzID0gYCR7dGhpcy5fdXRpbE5hbWV9LiR7cHJvdG9SZWMubmFtZX0oJHthcmdTdHJpbmd9KWA7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlIFJlY29yZFR5cGUuQ29sbGVjdGlvbkxpdGVyYWw6XG4gICAgICAgIHJocyA9IGAke3RoaXMuX3V0aWxOYW1lfS4ke3Byb3RvUmVjLm5hbWV9KCR7YXJnU3RyaW5nfSlgO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSBSZWNvcmRUeXBlLkludGVycG9sYXRlOlxuICAgICAgICByaHMgPSB0aGlzLl9nZW5JbnRlcnBvbGF0aW9uKHByb3RvUmVjKTtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgUmVjb3JkVHlwZS5LZXllZFJlYWQ6XG4gICAgICAgIHJocyA9IGAke2NvbnRleHR9WyR7Z2V0TG9jYWxOYW1lKHByb3RvUmVjLmFyZ3NbMF0pfV1gO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSBSZWNvcmRUeXBlLktleWVkV3JpdGU6XG4gICAgICAgIHJocyA9IGAke2NvbnRleHR9WyR7Z2V0TG9jYWxOYW1lKHByb3RvUmVjLmFyZ3NbMF0pfV0gPSAke2dldExvY2FsTmFtZShwcm90b1JlYy5hcmdzWzFdKX1gO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSBSZWNvcmRUeXBlLkNoYWluOlxuICAgICAgICByaHMgPSBgJHtnZXRMb2NhbE5hbWUocHJvdG9SZWMuYXJnc1twcm90b1JlYy5hcmdzLmxlbmd0aCAtIDFdKX1gO1xuICAgICAgICBicmVhaztcblxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgdGhyb3cgbmV3IEJhc2VFeGNlcHRpb24oYFVua25vd24gb3BlcmF0aW9uICR7cHJvdG9SZWMubW9kZX1gKTtcbiAgICB9XG4gICAgcmV0dXJuIGAke2dldExvY2FsTmFtZShwcm90b1JlYy5zZWxmSW5kZXgpfSA9ICR7cmhzfTtgO1xuICB9XG5cbiAgZ2VuUHJvcGVydHlCaW5kaW5nVGFyZ2V0cyhwcm9wZXJ0eUJpbmRpbmdUYXJnZXRzOiBCaW5kaW5nVGFyZ2V0W10sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2VuRGVidWdJbmZvOiBib29sZWFuKTogc3RyaW5nIHtcbiAgICB2YXIgYnMgPSBwcm9wZXJ0eUJpbmRpbmdUYXJnZXRzLm1hcChiID0+IHtcbiAgICAgIGlmIChpc0JsYW5rKGIpKSByZXR1cm4gXCJudWxsXCI7XG5cbiAgICAgIHZhciBkZWJ1ZyA9IGdlbkRlYnVnSW5mbyA/IGNvZGlmeShiLmRlYnVnKSA6IFwibnVsbFwiO1xuICAgICAgcmV0dXJuIGAke3RoaXMuX3V0aWxOYW1lfS5iaW5kaW5nVGFyZ2V0KCR7Y29kaWZ5KGIubW9kZSl9LCAke2IuZWxlbWVudEluZGV4fSwgJHtjb2RpZnkoYi5uYW1lKX0sICR7Y29kaWZ5KGIudW5pdCl9LCAke2RlYnVnfSlgO1xuICAgIH0pO1xuICAgIHJldHVybiBgWyR7YnMuam9pbihcIiwgXCIpfV1gO1xuICB9XG5cbiAgZ2VuRGlyZWN0aXZlSW5kaWNlcyhkaXJlY3RpdmVSZWNvcmRzOiBEaXJlY3RpdmVSZWNvcmRbXSk6IHN0cmluZyB7XG4gICAgdmFyIGJzID0gZGlyZWN0aXZlUmVjb3Jkcy5tYXAoXG4gICAgICAgIGIgPT5cbiAgICAgICAgICAgIGAke3RoaXMuX3V0aWxOYW1lfS5kaXJlY3RpdmVJbmRleCgke2IuZGlyZWN0aXZlSW5kZXguZWxlbWVudEluZGV4fSwgJHtiLmRpcmVjdGl2ZUluZGV4LmRpcmVjdGl2ZUluZGV4fSlgKTtcbiAgICByZXR1cm4gYFske2JzLmpvaW4oXCIsIFwiKX1dYDtcbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX2dlbkludGVycG9sYXRpb24ocHJvdG9SZWM6IFByb3RvUmVjb3JkKTogc3RyaW5nIHtcbiAgICB2YXIgaVZhbHMgPSBbXTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHByb3RvUmVjLmFyZ3MubGVuZ3RoOyArK2kpIHtcbiAgICAgIGlWYWxzLnB1c2goY29kaWZ5KHByb3RvUmVjLmZpeGVkQXJnc1tpXSkpO1xuICAgICAgaVZhbHMucHVzaChgJHt0aGlzLl91dGlsTmFtZX0ucygke3RoaXMuX25hbWVzLmdldExvY2FsTmFtZShwcm90b1JlYy5hcmdzW2ldKX0pYCk7XG4gICAgfVxuICAgIGlWYWxzLnB1c2goY29kaWZ5KHByb3RvUmVjLmZpeGVkQXJnc1twcm90b1JlYy5hcmdzLmxlbmd0aF0pKTtcbiAgICByZXR1cm4gY29tYmluZUdlbmVyYXRlZFN0cmluZ3MoaVZhbHMpO1xuICB9XG5cbiAgZ2VuSHlkcmF0ZURpcmVjdGl2ZXMoZGlyZWN0aXZlUmVjb3JkczogRGlyZWN0aXZlUmVjb3JkW10pOiBzdHJpbmcge1xuICAgIHZhciByZXMgPSBbXTtcbiAgICB2YXIgb3V0cHV0Q291bnQgPSAwO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZGlyZWN0aXZlUmVjb3Jkcy5sZW5ndGg7ICsraSkge1xuICAgICAgdmFyIHIgPSBkaXJlY3RpdmVSZWNvcmRzW2ldO1xuICAgICAgdmFyIGRpclZhck5hbWUgPSB0aGlzLl9uYW1lcy5nZXREaXJlY3RpdmVOYW1lKHIuZGlyZWN0aXZlSW5kZXgpO1xuICAgICAgcmVzLnB1c2goYCR7ZGlyVmFyTmFtZX0gPSAke3RoaXMuX2dlblJlYWREaXJlY3RpdmUoaSl9O2ApO1xuICAgICAgaWYgKGlzUHJlc2VudChyLm91dHB1dHMpKSB7XG4gICAgICAgIHIub3V0cHV0cy5mb3JFYWNoKG91dHB1dCA9PiB7XG4gICAgICAgICAgdmFyIGV2ZW50SGFuZGxlckV4cHIgPSB0aGlzLl9nZW5FdmVudEhhbmRsZXIoci5kaXJlY3RpdmVJbmRleC5lbGVtZW50SW5kZXgsIG91dHB1dFsxXSk7XG4gICAgICAgICAgdmFyIHN0YXRlbWVudFN0YXJ0ID1cbiAgICAgICAgICAgICAgYHRoaXMub3V0cHV0U3Vic2NyaXB0aW9uc1ske291dHB1dENvdW50Kyt9XSA9ICR7ZGlyVmFyTmFtZX0uJHtvdXRwdXRbMF19YDtcbiAgICAgICAgICBpZiAoSVNfREFSVCkge1xuICAgICAgICAgICAgcmVzLnB1c2goYCR7c3RhdGVtZW50U3RhcnR9Lmxpc3Rlbigke2V2ZW50SGFuZGxlckV4cHJ9KTtgKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmVzLnB1c2goYCR7c3RhdGVtZW50U3RhcnR9LnN1YnNjcmliZSh7bmV4dDogJHtldmVudEhhbmRsZXJFeHByfX0pO2ApO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChvdXRwdXRDb3VudCA+IDApIHtcbiAgICAgIHZhciBzdGF0ZW1lbnRTdGFydCA9ICd0aGlzLm91dHB1dFN1YnNjcmlwdGlvbnMnO1xuICAgICAgaWYgKElTX0RBUlQpIHtcbiAgICAgICAgcmVzLnVuc2hpZnQoYCR7c3RhdGVtZW50U3RhcnR9ID0gbmV3IExpc3QoJHtvdXRwdXRDb3VudH0pO2ApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVzLnVuc2hpZnQoYCR7c3RhdGVtZW50U3RhcnR9ID0gbmV3IEFycmF5KCR7b3V0cHV0Q291bnR9KTtgKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJlcy5qb2luKFwiXFxuXCIpO1xuICB9XG5cbiAgZ2VuRGlyZWN0aXZlc09uRGVzdHJveShkaXJlY3RpdmVSZWNvcmRzOiBEaXJlY3RpdmVSZWNvcmRbXSk6IHN0cmluZyB7XG4gICAgdmFyIHJlcyA9IFtdO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZGlyZWN0aXZlUmVjb3Jkcy5sZW5ndGg7ICsraSkge1xuICAgICAgdmFyIHIgPSBkaXJlY3RpdmVSZWNvcmRzW2ldO1xuICAgICAgaWYgKHIuY2FsbE9uRGVzdHJveSkge1xuICAgICAgICB2YXIgZGlyVmFyTmFtZSA9IHRoaXMuX25hbWVzLmdldERpcmVjdGl2ZU5hbWUoci5kaXJlY3RpdmVJbmRleCk7XG4gICAgICAgIHJlcy5wdXNoKGAke2RpclZhck5hbWV9Lm5nT25EZXN0cm95KCk7YCk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXMuam9pbihcIlxcblwiKTtcbiAgfVxuXG4gIHByaXZhdGUgX2dlbkV2ZW50SGFuZGxlcihib3VuZEVsZW1lbnRJbmRleDogbnVtYmVyLCBldmVudE5hbWU6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgaWYgKElTX0RBUlQpIHtcbiAgICAgIHJldHVybiBgKGV2ZW50KSA9PiB0aGlzLmhhbmRsZUV2ZW50KCcke2V2ZW50TmFtZX0nLCAke2JvdW5kRWxlbWVudEluZGV4fSwgZXZlbnQpYDtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGAoZnVuY3Rpb24oZXZlbnQpIHsgcmV0dXJuIHRoaXMuaGFuZGxlRXZlbnQoJyR7ZXZlbnROYW1lfScsICR7Ym91bmRFbGVtZW50SW5kZXh9LCBldmVudCk7IH0pLmJpbmQodGhpcylgO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX2dlblJlYWREaXJlY3RpdmUoaW5kZXg6IG51bWJlcikgeyByZXR1cm4gYHRoaXMuZ2V0RGlyZWN0aXZlRm9yKGRpcmVjdGl2ZXMsICR7aW5kZXh9KWA7IH1cblxuICBnZW5IeWRyYXRlRGV0ZWN0b3JzKGRpcmVjdGl2ZVJlY29yZHM6IERpcmVjdGl2ZVJlY29yZFtdKTogc3RyaW5nIHtcbiAgICB2YXIgcmVzID0gW107XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBkaXJlY3RpdmVSZWNvcmRzLmxlbmd0aDsgKytpKSB7XG4gICAgICB2YXIgciA9IGRpcmVjdGl2ZVJlY29yZHNbaV07XG4gICAgICBpZiAoIXIuaXNEZWZhdWx0Q2hhbmdlRGV0ZWN0aW9uKCkpIHtcbiAgICAgICAgcmVzLnB1c2goXG4gICAgICAgICAgICBgJHt0aGlzLl9uYW1lcy5nZXREZXRlY3Rvck5hbWUoci5kaXJlY3RpdmVJbmRleCl9ID0gdGhpcy5nZXREZXRlY3RvckZvcihkaXJlY3RpdmVzLCAke2l9KTtgKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJlcy5qb2luKFwiXFxuXCIpO1xuICB9XG5cbiAgZ2VuQ29udGVudExpZmVjeWNsZUNhbGxiYWNrcyhkaXJlY3RpdmVSZWNvcmRzOiBEaXJlY3RpdmVSZWNvcmRbXSk6IHN0cmluZ1tdIHtcbiAgICB2YXIgcmVzID0gW107XG4gICAgdmFyIGVxID0gSVNfREFSVCA/ICc9PScgOiAnPT09JztcbiAgICAvLyBOT1RFKGtlZ2x1bmVxKTogT3JkZXIgaXMgaW1wb3J0YW50IVxuICAgIGZvciAodmFyIGkgPSBkaXJlY3RpdmVSZWNvcmRzLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICB2YXIgZGlyID0gZGlyZWN0aXZlUmVjb3Jkc1tpXTtcbiAgICAgIGlmIChkaXIuY2FsbEFmdGVyQ29udGVudEluaXQpIHtcbiAgICAgICAgcmVzLnB1c2goXG4gICAgICAgICAgICBgaWYoJHt0aGlzLl9uYW1lcy5nZXRTdGF0ZU5hbWUoKX0gJHtlcX0gJHt0aGlzLl9jaGFuZ2VEZXRlY3RvclN0YXRlTmFtZX0uTmV2ZXJDaGVja2VkKSAke3RoaXMuX25hbWVzLmdldERpcmVjdGl2ZU5hbWUoZGlyLmRpcmVjdGl2ZUluZGV4KX0ubmdBZnRlckNvbnRlbnRJbml0KCk7YCk7XG4gICAgICB9XG5cbiAgICAgIGlmIChkaXIuY2FsbEFmdGVyQ29udGVudENoZWNrZWQpIHtcbiAgICAgICAgcmVzLnB1c2goYCR7dGhpcy5fbmFtZXMuZ2V0RGlyZWN0aXZlTmFtZShkaXIuZGlyZWN0aXZlSW5kZXgpfS5uZ0FmdGVyQ29udGVudENoZWNrZWQoKTtgKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJlcztcbiAgfVxuXG4gIGdlblZpZXdMaWZlY3ljbGVDYWxsYmFja3MoZGlyZWN0aXZlUmVjb3JkczogRGlyZWN0aXZlUmVjb3JkW10pOiBzdHJpbmdbXSB7XG4gICAgdmFyIHJlcyA9IFtdO1xuICAgIHZhciBlcSA9IElTX0RBUlQgPyAnPT0nIDogJz09PSc7XG4gICAgLy8gTk9URShrZWdsdW5lcSk6IE9yZGVyIGlzIGltcG9ydGFudCFcbiAgICBmb3IgKHZhciBpID0gZGlyZWN0aXZlUmVjb3Jkcy5sZW5ndGggLSAxOyBpID49IDA7IC0taSkge1xuICAgICAgdmFyIGRpciA9IGRpcmVjdGl2ZVJlY29yZHNbaV07XG4gICAgICBpZiAoZGlyLmNhbGxBZnRlclZpZXdJbml0KSB7XG4gICAgICAgIHJlcy5wdXNoKFxuICAgICAgICAgICAgYGlmKCR7dGhpcy5fbmFtZXMuZ2V0U3RhdGVOYW1lKCl9ICR7ZXF9ICR7dGhpcy5fY2hhbmdlRGV0ZWN0b3JTdGF0ZU5hbWV9Lk5ldmVyQ2hlY2tlZCkgJHt0aGlzLl9uYW1lcy5nZXREaXJlY3RpdmVOYW1lKGRpci5kaXJlY3RpdmVJbmRleCl9Lm5nQWZ0ZXJWaWV3SW5pdCgpO2ApO1xuICAgICAgfVxuXG4gICAgICBpZiAoZGlyLmNhbGxBZnRlclZpZXdDaGVja2VkKSB7XG4gICAgICAgIHJlcy5wdXNoKGAke3RoaXMuX25hbWVzLmdldERpcmVjdGl2ZU5hbWUoZGlyLmRpcmVjdGl2ZUluZGV4KX0ubmdBZnRlclZpZXdDaGVja2VkKCk7YCk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXM7XG4gIH1cbn1cbiJdfQ==