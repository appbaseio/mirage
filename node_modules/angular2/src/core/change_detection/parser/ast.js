'use strict';"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var collection_1 = require("angular2/src/facade/collection");
var AST = (function () {
    function AST() {
    }
    AST.prototype.visit = function (visitor) { return null; };
    AST.prototype.toString = function () { return "AST"; };
    return AST;
}());
exports.AST = AST;
/**
 * Represents a quoted expression of the form:
 *
 * quote = prefix `:` uninterpretedExpression
 * prefix = identifier
 * uninterpretedExpression = arbitrary string
 *
 * A quoted expression is meant to be pre-processed by an AST transformer that
 * converts it into another AST that no longer contains quoted expressions.
 * It is meant to allow third-party developers to extend Angular template
 * expression language. The `uninterpretedExpression` part of the quote is
 * therefore not interpreted by the Angular's own expression parser.
 */
var Quote = (function (_super) {
    __extends(Quote, _super);
    function Quote(prefix, uninterpretedExpression, location) {
        _super.call(this);
        this.prefix = prefix;
        this.uninterpretedExpression = uninterpretedExpression;
        this.location = location;
    }
    Quote.prototype.visit = function (visitor) { return visitor.visitQuote(this); };
    Quote.prototype.toString = function () { return "Quote"; };
    return Quote;
}(AST));
exports.Quote = Quote;
var EmptyExpr = (function (_super) {
    __extends(EmptyExpr, _super);
    function EmptyExpr() {
        _super.apply(this, arguments);
    }
    EmptyExpr.prototype.visit = function (visitor) {
        // do nothing
    };
    return EmptyExpr;
}(AST));
exports.EmptyExpr = EmptyExpr;
var ImplicitReceiver = (function (_super) {
    __extends(ImplicitReceiver, _super);
    function ImplicitReceiver() {
        _super.apply(this, arguments);
    }
    ImplicitReceiver.prototype.visit = function (visitor) { return visitor.visitImplicitReceiver(this); };
    return ImplicitReceiver;
}(AST));
exports.ImplicitReceiver = ImplicitReceiver;
/**
 * Multiple expressions separated by a semicolon.
 */
var Chain = (function (_super) {
    __extends(Chain, _super);
    function Chain(expressions) {
        _super.call(this);
        this.expressions = expressions;
    }
    Chain.prototype.visit = function (visitor) { return visitor.visitChain(this); };
    return Chain;
}(AST));
exports.Chain = Chain;
var Conditional = (function (_super) {
    __extends(Conditional, _super);
    function Conditional(condition, trueExp, falseExp) {
        _super.call(this);
        this.condition = condition;
        this.trueExp = trueExp;
        this.falseExp = falseExp;
    }
    Conditional.prototype.visit = function (visitor) { return visitor.visitConditional(this); };
    return Conditional;
}(AST));
exports.Conditional = Conditional;
var PropertyRead = (function (_super) {
    __extends(PropertyRead, _super);
    function PropertyRead(receiver, name, getter) {
        _super.call(this);
        this.receiver = receiver;
        this.name = name;
        this.getter = getter;
    }
    PropertyRead.prototype.visit = function (visitor) { return visitor.visitPropertyRead(this); };
    return PropertyRead;
}(AST));
exports.PropertyRead = PropertyRead;
var PropertyWrite = (function (_super) {
    __extends(PropertyWrite, _super);
    function PropertyWrite(receiver, name, setter, value) {
        _super.call(this);
        this.receiver = receiver;
        this.name = name;
        this.setter = setter;
        this.value = value;
    }
    PropertyWrite.prototype.visit = function (visitor) { return visitor.visitPropertyWrite(this); };
    return PropertyWrite;
}(AST));
exports.PropertyWrite = PropertyWrite;
var SafePropertyRead = (function (_super) {
    __extends(SafePropertyRead, _super);
    function SafePropertyRead(receiver, name, getter) {
        _super.call(this);
        this.receiver = receiver;
        this.name = name;
        this.getter = getter;
    }
    SafePropertyRead.prototype.visit = function (visitor) { return visitor.visitSafePropertyRead(this); };
    return SafePropertyRead;
}(AST));
exports.SafePropertyRead = SafePropertyRead;
var KeyedRead = (function (_super) {
    __extends(KeyedRead, _super);
    function KeyedRead(obj, key) {
        _super.call(this);
        this.obj = obj;
        this.key = key;
    }
    KeyedRead.prototype.visit = function (visitor) { return visitor.visitKeyedRead(this); };
    return KeyedRead;
}(AST));
exports.KeyedRead = KeyedRead;
var KeyedWrite = (function (_super) {
    __extends(KeyedWrite, _super);
    function KeyedWrite(obj, key, value) {
        _super.call(this);
        this.obj = obj;
        this.key = key;
        this.value = value;
    }
    KeyedWrite.prototype.visit = function (visitor) { return visitor.visitKeyedWrite(this); };
    return KeyedWrite;
}(AST));
exports.KeyedWrite = KeyedWrite;
var BindingPipe = (function (_super) {
    __extends(BindingPipe, _super);
    function BindingPipe(exp, name, args) {
        _super.call(this);
        this.exp = exp;
        this.name = name;
        this.args = args;
    }
    BindingPipe.prototype.visit = function (visitor) { return visitor.visitPipe(this); };
    return BindingPipe;
}(AST));
exports.BindingPipe = BindingPipe;
var LiteralPrimitive = (function (_super) {
    __extends(LiteralPrimitive, _super);
    function LiteralPrimitive(value) {
        _super.call(this);
        this.value = value;
    }
    LiteralPrimitive.prototype.visit = function (visitor) { return visitor.visitLiteralPrimitive(this); };
    return LiteralPrimitive;
}(AST));
exports.LiteralPrimitive = LiteralPrimitive;
var LiteralArray = (function (_super) {
    __extends(LiteralArray, _super);
    function LiteralArray(expressions) {
        _super.call(this);
        this.expressions = expressions;
    }
    LiteralArray.prototype.visit = function (visitor) { return visitor.visitLiteralArray(this); };
    return LiteralArray;
}(AST));
exports.LiteralArray = LiteralArray;
var LiteralMap = (function (_super) {
    __extends(LiteralMap, _super);
    function LiteralMap(keys, values) {
        _super.call(this);
        this.keys = keys;
        this.values = values;
    }
    LiteralMap.prototype.visit = function (visitor) { return visitor.visitLiteralMap(this); };
    return LiteralMap;
}(AST));
exports.LiteralMap = LiteralMap;
var Interpolation = (function (_super) {
    __extends(Interpolation, _super);
    function Interpolation(strings, expressions) {
        _super.call(this);
        this.strings = strings;
        this.expressions = expressions;
    }
    Interpolation.prototype.visit = function (visitor) { return visitor.visitInterpolation(this); };
    return Interpolation;
}(AST));
exports.Interpolation = Interpolation;
var Binary = (function (_super) {
    __extends(Binary, _super);
    function Binary(operation, left, right) {
        _super.call(this);
        this.operation = operation;
        this.left = left;
        this.right = right;
    }
    Binary.prototype.visit = function (visitor) { return visitor.visitBinary(this); };
    return Binary;
}(AST));
exports.Binary = Binary;
var PrefixNot = (function (_super) {
    __extends(PrefixNot, _super);
    function PrefixNot(expression) {
        _super.call(this);
        this.expression = expression;
    }
    PrefixNot.prototype.visit = function (visitor) { return visitor.visitPrefixNot(this); };
    return PrefixNot;
}(AST));
exports.PrefixNot = PrefixNot;
var MethodCall = (function (_super) {
    __extends(MethodCall, _super);
    function MethodCall(receiver, name, fn, args) {
        _super.call(this);
        this.receiver = receiver;
        this.name = name;
        this.fn = fn;
        this.args = args;
    }
    MethodCall.prototype.visit = function (visitor) { return visitor.visitMethodCall(this); };
    return MethodCall;
}(AST));
exports.MethodCall = MethodCall;
var SafeMethodCall = (function (_super) {
    __extends(SafeMethodCall, _super);
    function SafeMethodCall(receiver, name, fn, args) {
        _super.call(this);
        this.receiver = receiver;
        this.name = name;
        this.fn = fn;
        this.args = args;
    }
    SafeMethodCall.prototype.visit = function (visitor) { return visitor.visitSafeMethodCall(this); };
    return SafeMethodCall;
}(AST));
exports.SafeMethodCall = SafeMethodCall;
var FunctionCall = (function (_super) {
    __extends(FunctionCall, _super);
    function FunctionCall(target, args) {
        _super.call(this);
        this.target = target;
        this.args = args;
    }
    FunctionCall.prototype.visit = function (visitor) { return visitor.visitFunctionCall(this); };
    return FunctionCall;
}(AST));
exports.FunctionCall = FunctionCall;
var ASTWithSource = (function (_super) {
    __extends(ASTWithSource, _super);
    function ASTWithSource(ast, source, location) {
        _super.call(this);
        this.ast = ast;
        this.source = source;
        this.location = location;
    }
    ASTWithSource.prototype.visit = function (visitor) { return this.ast.visit(visitor); };
    ASTWithSource.prototype.toString = function () { return this.source + " in " + this.location; };
    return ASTWithSource;
}(AST));
exports.ASTWithSource = ASTWithSource;
var TemplateBinding = (function () {
    function TemplateBinding(key, keyIsVar, name, expression) {
        this.key = key;
        this.keyIsVar = keyIsVar;
        this.name = name;
        this.expression = expression;
    }
    return TemplateBinding;
}());
exports.TemplateBinding = TemplateBinding;
var RecursiveAstVisitor = (function () {
    function RecursiveAstVisitor() {
    }
    RecursiveAstVisitor.prototype.visitBinary = function (ast) {
        ast.left.visit(this);
        ast.right.visit(this);
        return null;
    };
    RecursiveAstVisitor.prototype.visitChain = function (ast) { return this.visitAll(ast.expressions); };
    RecursiveAstVisitor.prototype.visitConditional = function (ast) {
        ast.condition.visit(this);
        ast.trueExp.visit(this);
        ast.falseExp.visit(this);
        return null;
    };
    RecursiveAstVisitor.prototype.visitPipe = function (ast) {
        ast.exp.visit(this);
        this.visitAll(ast.args);
        return null;
    };
    RecursiveAstVisitor.prototype.visitFunctionCall = function (ast) {
        ast.target.visit(this);
        this.visitAll(ast.args);
        return null;
    };
    RecursiveAstVisitor.prototype.visitImplicitReceiver = function (ast) { return null; };
    RecursiveAstVisitor.prototype.visitInterpolation = function (ast) { return this.visitAll(ast.expressions); };
    RecursiveAstVisitor.prototype.visitKeyedRead = function (ast) {
        ast.obj.visit(this);
        ast.key.visit(this);
        return null;
    };
    RecursiveAstVisitor.prototype.visitKeyedWrite = function (ast) {
        ast.obj.visit(this);
        ast.key.visit(this);
        ast.value.visit(this);
        return null;
    };
    RecursiveAstVisitor.prototype.visitLiteralArray = function (ast) { return this.visitAll(ast.expressions); };
    RecursiveAstVisitor.prototype.visitLiteralMap = function (ast) { return this.visitAll(ast.values); };
    RecursiveAstVisitor.prototype.visitLiteralPrimitive = function (ast) { return null; };
    RecursiveAstVisitor.prototype.visitMethodCall = function (ast) {
        ast.receiver.visit(this);
        return this.visitAll(ast.args);
    };
    RecursiveAstVisitor.prototype.visitPrefixNot = function (ast) {
        ast.expression.visit(this);
        return null;
    };
    RecursiveAstVisitor.prototype.visitPropertyRead = function (ast) {
        ast.receiver.visit(this);
        return null;
    };
    RecursiveAstVisitor.prototype.visitPropertyWrite = function (ast) {
        ast.receiver.visit(this);
        ast.value.visit(this);
        return null;
    };
    RecursiveAstVisitor.prototype.visitSafePropertyRead = function (ast) {
        ast.receiver.visit(this);
        return null;
    };
    RecursiveAstVisitor.prototype.visitSafeMethodCall = function (ast) {
        ast.receiver.visit(this);
        return this.visitAll(ast.args);
    };
    RecursiveAstVisitor.prototype.visitAll = function (asts) {
        var _this = this;
        asts.forEach(function (ast) { return ast.visit(_this); });
        return null;
    };
    RecursiveAstVisitor.prototype.visitQuote = function (ast) { return null; };
    return RecursiveAstVisitor;
}());
exports.RecursiveAstVisitor = RecursiveAstVisitor;
var AstTransformer = (function () {
    function AstTransformer() {
    }
    AstTransformer.prototype.visitImplicitReceiver = function (ast) { return ast; };
    AstTransformer.prototype.visitInterpolation = function (ast) {
        return new Interpolation(ast.strings, this.visitAll(ast.expressions));
    };
    AstTransformer.prototype.visitLiteralPrimitive = function (ast) { return new LiteralPrimitive(ast.value); };
    AstTransformer.prototype.visitPropertyRead = function (ast) {
        return new PropertyRead(ast.receiver.visit(this), ast.name, ast.getter);
    };
    AstTransformer.prototype.visitPropertyWrite = function (ast) {
        return new PropertyWrite(ast.receiver.visit(this), ast.name, ast.setter, ast.value);
    };
    AstTransformer.prototype.visitSafePropertyRead = function (ast) {
        return new SafePropertyRead(ast.receiver.visit(this), ast.name, ast.getter);
    };
    AstTransformer.prototype.visitMethodCall = function (ast) {
        return new MethodCall(ast.receiver.visit(this), ast.name, ast.fn, this.visitAll(ast.args));
    };
    AstTransformer.prototype.visitSafeMethodCall = function (ast) {
        return new SafeMethodCall(ast.receiver.visit(this), ast.name, ast.fn, this.visitAll(ast.args));
    };
    AstTransformer.prototype.visitFunctionCall = function (ast) {
        return new FunctionCall(ast.target.visit(this), this.visitAll(ast.args));
    };
    AstTransformer.prototype.visitLiteralArray = function (ast) {
        return new LiteralArray(this.visitAll(ast.expressions));
    };
    AstTransformer.prototype.visitLiteralMap = function (ast) {
        return new LiteralMap(ast.keys, this.visitAll(ast.values));
    };
    AstTransformer.prototype.visitBinary = function (ast) {
        return new Binary(ast.operation, ast.left.visit(this), ast.right.visit(this));
    };
    AstTransformer.prototype.visitPrefixNot = function (ast) { return new PrefixNot(ast.expression.visit(this)); };
    AstTransformer.prototype.visitConditional = function (ast) {
        return new Conditional(ast.condition.visit(this), ast.trueExp.visit(this), ast.falseExp.visit(this));
    };
    AstTransformer.prototype.visitPipe = function (ast) {
        return new BindingPipe(ast.exp.visit(this), ast.name, this.visitAll(ast.args));
    };
    AstTransformer.prototype.visitKeyedRead = function (ast) {
        return new KeyedRead(ast.obj.visit(this), ast.key.visit(this));
    };
    AstTransformer.prototype.visitKeyedWrite = function (ast) {
        return new KeyedWrite(ast.obj.visit(this), ast.key.visit(this), ast.value.visit(this));
    };
    AstTransformer.prototype.visitAll = function (asts) {
        var res = collection_1.ListWrapper.createFixedSize(asts.length);
        for (var i = 0; i < asts.length; ++i) {
            res[i] = asts[i].visit(this);
        }
        return res;
    };
    AstTransformer.prototype.visitChain = function (ast) { return new Chain(this.visitAll(ast.expressions)); };
    AstTransformer.prototype.visitQuote = function (ast) {
        return new Quote(ast.prefix, ast.uninterpretedExpression, ast.location);
    };
    return AstTransformer;
}());
exports.AstTransformer = AstTransformer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZGlmZmluZ19wbHVnaW5fd3JhcHBlci1vdXRwdXRfcGF0aC1qYWtYbk1tTC50bXAvYW5ndWxhcjIvc3JjL2NvcmUvY2hhbmdlX2RldGVjdGlvbi9wYXJzZXIvYXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLDJCQUEwQixnQ0FBZ0MsQ0FBQyxDQUFBO0FBRTNEO0lBQUE7SUFHQSxDQUFDO0lBRkMsbUJBQUssR0FBTCxVQUFNLE9BQW1CLElBQVMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7SUFDaEQsc0JBQVEsR0FBUixjQUFxQixNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztJQUN0QyxVQUFDO0FBQUQsQ0FBQyxBQUhELElBR0M7QUFIWSxXQUFHLE1BR2YsQ0FBQTtBQUVEOzs7Ozs7Ozs7Ozs7R0FZRztBQUNIO0lBQTJCLHlCQUFHO0lBQzVCLGVBQW1CLE1BQWMsRUFBUyx1QkFBK0IsRUFBUyxRQUFhO1FBQzdGLGlCQUFPLENBQUM7UUFEUyxXQUFNLEdBQU4sTUFBTSxDQUFRO1FBQVMsNEJBQXVCLEdBQXZCLHVCQUF1QixDQUFRO1FBQVMsYUFBUSxHQUFSLFFBQVEsQ0FBSztJQUUvRixDQUFDO0lBQ0QscUJBQUssR0FBTCxVQUFNLE9BQW1CLElBQVMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3BFLHdCQUFRLEdBQVIsY0FBcUIsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7SUFDeEMsWUFBQztBQUFELENBQUMsQUFORCxDQUEyQixHQUFHLEdBTTdCO0FBTlksYUFBSyxRQU1qQixDQUFBO0FBRUQ7SUFBK0IsNkJBQUc7SUFBbEM7UUFBK0IsOEJBQUc7SUFJbEMsQ0FBQztJQUhDLHlCQUFLLEdBQUwsVUFBTSxPQUFtQjtRQUN2QixhQUFhO0lBQ2YsQ0FBQztJQUNILGdCQUFDO0FBQUQs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O0lBQ2IsQ0FBQztJQUVELG1DQUFVLEdBQVYsVUFBVyxHQUFVLElBQVMsTUFBTSxDQUFDLElBQUksS0FBSyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBRWpGLG1DQUFVLEdBQVYsVUFBVyxHQUFVO1FBQ25CLE1BQU0sQ0FBQyxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyx1QkFBdUIsRUFBRSxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDMUUsQ0FBQztJQUNILHFCQUFDO0FBQUQsQ0FBQyxBQTdFRCxJQTZFQztBQTdFWSxzQkFBYyxpQkE2RTFCLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0xpc3RXcmFwcGVyfSBmcm9tIFwiYW5ndWxhcjIvc3JjL2ZhY2FkZS9jb2xsZWN0aW9uXCI7XG5cbmV4cG9ydCBjbGFzcyBBU1Qge1xuICB2aXNpdCh2aXNpdG9yOiBBc3RWaXNpdG9yKTogYW55IHsgcmV0dXJuIG51bGw7IH1cbiAgdG9TdHJpbmcoKTogc3RyaW5nIHsgcmV0dXJuIFwiQVNUXCI7IH1cbn1cblxuLyoqXG4gKiBSZXByZXNlbnRzIGEgcXVvdGVkIGV4cHJlc3Npb24gb2YgdGhlIGZvcm06XG4gKlxuICogcXVvdGUgPSBwcmVmaXggYDpgIHVuaW50ZXJwcmV0ZWRFeHByZXNzaW9uXG4gKiBwcmVmaXggPSBpZGVudGlmaWVyXG4gKiB1bmludGVycHJldGVkRXhwcmVzc2lvbiA9IGFyYml0cmFyeSBzdHJpbmdcbiAqXG4gKiBBIHF1b3RlZCBleHByZXNzaW9uIGlzIG1lYW50IHRvIGJlIHByZS1wcm9jZXNzZWQgYnkgYW4gQVNUIHRyYW5zZm9ybWVyIHRoYXRcbiAqIGNvbnZlcnRzIGl0IGludG8gYW5vdGhlciBBU1QgdGhhdCBubyBsb25nZXIgY29udGFpbnMgcXVvdGVkIGV4cHJlc3Npb25zLlxuICogSXQgaXMgbWVhbnQgdG8gYWxsb3cgdGhpcmQtcGFydHkgZGV2ZWxvcGVycyB0byBleHRlbmQgQW5ndWxhciB0ZW1wbGF0ZVxuICogZXhwcmVzc2lvbiBsYW5ndWFnZS4gVGhlIGB1bmludGVycHJldGVkRXhwcmVzc2lvbmAgcGFydCBvZiB0aGUgcXVvdGUgaXNcbiAqIHRoZXJlZm9yZSBub3QgaW50ZXJwcmV0ZWQgYnkgdGhlIEFuZ3VsYXIncyBvd24gZXhwcmVzc2lvbiBwYXJzZXIuXG4gKi9cbmV4cG9ydCBjbGFzcyBRdW90ZSBleHRlbmRzIEFTVCB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBwcmVmaXg6IHN0cmluZywgcHVibGljIHVuaW50ZXJwcmV0ZWRFeHByZXNzaW9uOiBzdHJpbmcsIHB1YmxpYyBsb2NhdGlvbjogYW55KSB7XG4gICAgc3VwZXIoKTtcbiAgfVxuICB2aXNpdCh2aXNpdG9yOiBBc3RWaXNpdG9yKTogYW55IHsgcmV0dXJuIHZpc2l0b3IudmlzaXRRdW90ZSh0aGlzKTsgfVxuICB0b1N0cmluZygpOiBzdHJpbmcgeyByZXR1cm4gXCJRdW90ZVwiOyB9XG59XG5cbmV4cG9ydCBjbGFzcyBFbXB0eUV4cHIgZXh0ZW5kcyBBU1Qge1xuICB2aXNpdCh2aXNpdG9yOiBBc3RWaXNpdG9yKSB7XG4gICAgLy8gZG8gbm90aGluZ1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBJbXBsaWNpdFJlY2VpdmVyIGV4dGVuZHMgQVNUIHtcbiAgdmlzaXQodmlzaXRvcjogQXN0VmlzaXRvcik6IGFueSB7IHJldHVybiB2aXNpdG9yLnZpc2l0SW1wbGljaXRSZWNlaXZlcih0aGlzKTsgfVxufVxuXG4vKipcbiAqIE11bHRpcGxlIGV4cHJlc3Npb25zIHNlcGFyYXRlZCBieSBhIHNlbWljb2xvbi5cbiAqL1xuZXhwb3J0IGNsYXNzIENoYWluIGV4dGVuZHMgQVNUIHtcbiAgY29uc3RydWN0b3IocHVibGljIGV4cHJlc3Npb25zOiBhbnlbXSkgeyBzdXBlcigpOyB9XG4gIHZpc2l0KHZpc2l0b3I6IEFzdFZpc2l0b3IpOiBhbnkgeyByZXR1cm4gdmlzaXRvci52aXNpdENoYWluKHRoaXMpOyB9XG59XG5cbmV4cG9ydCBjbGFzcyBDb25kaXRpb25hbCBleHRlbmRzIEFTVCB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBjb25kaXRpb246IEFTVCwgcHVibGljIHRydWVFeHA6IEFTVCwgcHVibGljIGZhbHNlRXhwOiBBU1QpIHsgc3VwZXIoKTsgfVxuICB2aXNpdCh2aXNpdG9yOiBBc3RWaXNpdG9yKTogYW55IHsgcmV0dXJuIHZpc2l0b3IudmlzaXRDb25kaXRpb25hbCh0aGlzKTsgfVxufVxuXG5leHBvcnQgY2xhc3MgUHJvcGVydHlSZWFkIGV4dGVuZHMgQVNUIHtcbiAgY29uc3RydWN0b3IocHVibGljIHJlY2VpdmVyOiBBU1QsIHB1YmxpYyBuYW1lOiBzdHJpbmcsIHB1YmxpYyBnZXR0ZXI6IEZ1bmN0aW9uKSB7IHN1cGVyKCk7IH1cbiAgdmlzaXQodmlzaXRvcjogQXN0VmlzaXRvcik6IGFueSB7IHJldHVybiB2aXNpdG9yLnZpc2l0UHJvcGVydHlSZWFkKHRoaXMpOyB9XG59XG5cbmV4cG9ydCBjbGFzcyBQcm9wZXJ0eVdyaXRlIGV4dGVuZHMgQVNUIHtcbiAgY29uc3RydWN0b3IocHVibGljIHJlY2VpdmVyOiBBU1QsIHB1YmxpYyBuYW1lOiBzdHJpbmcsIHB1YmxpYyBzZXR0ZXI6IEZ1bmN0aW9uLFxuICAgICAgICAgICAgICBwdWJsaWMgdmFsdWU6IEFTVCkge1xuICAgIHN1cGVyKCk7XG4gIH1cbiAgdmlzaXQodmlzaXRvcjogQXN0VmlzaXRvcik6IGFueSB7IHJldHVybiB2aXNpdG9yLnZpc2l0UHJvcGVydHlXcml0ZSh0aGlzKTsgfVxufVxuXG5leHBvcnQgY2xhc3MgU2FmZVByb3BlcnR5UmVhZCBleHRlbmRzIEFTVCB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyByZWNlaXZlcjogQVNULCBwdWJsaWMgbmFtZTogc3RyaW5nLCBwdWJsaWMgZ2V0dGVyOiBGdW5jdGlvbikgeyBzdXBlcigpOyB9XG4gIHZpc2l0KHZpc2l0b3I6IEFzdFZpc2l0b3IpOiBhbnkgeyByZXR1cm4gdmlzaXRvci52aXNpdFNhZmVQcm9wZXJ0eVJlYWQodGhpcyk7IH1cbn1cblxuZXhwb3J0IGNsYXNzIEtleWVkUmVhZCBleHRlbmRzIEFTVCB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBvYmo6IEFTVCwgcHVibGljIGtleTogQVNUKSB7IHN1cGVyKCk7IH1cbiAgdmlzaXQodmlzaXRvcjogQXN0VmlzaXRvcik6IGFueSB7IHJldHVybiB2aXNpdG9yLnZpc2l0S2V5ZWRSZWFkKHRoaXMpOyB9XG59XG5cbmV4cG9ydCBjbGFzcyBLZXllZFdyaXRlIGV4dGVuZHMgQVNUIHtcbiAgY29uc3RydWN0b3IocHVibGljIG9iajogQVNULCBwdWJsaWMga2V5OiBBU1QsIHB1YmxpYyB2YWx1ZTogQVNUKSB7IHN1cGVyKCk7IH1cbiAgdmlzaXQodmlzaXRvcjogQXN0VmlzaXRvcik6IGFueSB7IHJldHVybiB2aXNpdG9yLnZpc2l0S2V5ZWRXcml0ZSh0aGlzKTsgfVxufVxuXG5leHBvcnQgY2xhc3MgQmluZGluZ1BpcGUgZXh0ZW5kcyBBU1Qge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgZXhwOiBBU1QsIHB1YmxpYyBuYW1lOiBzdHJpbmcsIHB1YmxpYyBhcmdzOiBhbnlbXSkgeyBzdXBlcigpOyB9XG4gIHZpc2l0KHZpc2l0b3I6IEFzdFZpc2l0b3IpOiBhbnkgeyByZXR1cm4gdmlzaXRvci52aXNpdFBpcGUodGhpcyk7IH1cbn1cblxuZXhwb3J0IGNsYXNzIExpdGVyYWxQcmltaXRpdmUgZXh0ZW5kcyBBU1Qge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgdmFsdWUpIHsgc3VwZXIoKTsgfVxuICB2aXNpdCh2aXNpdG9yOiBBc3RWaXNpdG9yKTogYW55IHsgcmV0dXJuIHZpc2l0b3IudmlzaXRMaXRlcmFsUHJpbWl0aXZlKHRoaXMpOyB9XG59XG5cbmV4cG9ydCBjbGFzcyBMaXRlcmFsQXJyYXkgZXh0ZW5kcyBBU1Qge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgZXhwcmVzc2lvbnM6IGFueVtdKSB7IHN1cGVyKCk7IH1cbiAgdmlzaXQodmlzaXRvcjogQXN0VmlzaXRvcik6IGFueSB7IHJldHVybiB2aXNpdG9yLnZpc2l0TGl0ZXJhbEFycmF5KHRoaXMpOyB9XG59XG5cbmV4cG9ydCBjbGFzcyBMaXRlcmFsTWFwIGV4dGVuZHMgQVNUIHtcbiAgY29uc3RydWN0b3IocHVibGljIGtleXM6IGFueVtdLCBwdWJsaWMgdmFsdWVzOiBhbnlbXSkgeyBzdXBlcigpOyB9XG4gIHZpc2l0KHZpc2l0b3I6IEFzdFZpc2l0b3IpOiBhbnkgeyByZXR1cm4gdmlzaXRvci52aXNpdExpdGVyYWxNYXAodGhpcyk7IH1cbn1cblxuZXhwb3J0IGNsYXNzIEludGVycG9sYXRpb24gZXh0ZW5kcyBBU1Qge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgc3RyaW5nczogYW55W10sIHB1YmxpYyBleHByZXNzaW9uczogYW55W10pIHsgc3VwZXIoKTsgfVxuICB2aXNpdCh2aXNpdG9yOiBBc3RWaXNpdG9yKTogYW55IHsgcmV0dXJuIHZpc2l0b3IudmlzaXRJbnRlcnBvbGF0aW9uKHRoaXMpOyB9XG59XG5cbmV4cG9ydCBjbGFzcyBCaW5hcnkgZXh0ZW5kcyBBU1Qge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgb3BlcmF0aW9uOiBzdHJpbmcsIHB1YmxpYyBsZWZ0OiBBU1QsIHB1YmxpYyByaWdodDogQVNUKSB7IHN1cGVyKCk7IH1cbiAgdmlzaXQodmlzaXRvcjogQXN0VmlzaXRvcik6IGFueSB7IHJldHVybiB2aXNpdG9yLnZpc2l0QmluYXJ5KHRoaXMpOyB9XG59XG5cbmV4cG9ydCBjbGFzcyBQcmVmaXhOb3QgZXh0ZW5kcyBBU1Qge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgZXhwcmVzc2lvbjogQVNUKSB7IHN1cGVyKCk7IH1cbiAgdmlzaXQodmlzaXRvcjogQXN0VmlzaXRvcik6IGFueSB7IHJldHVybiB2aXNpdG9yLnZpc2l0UHJlZml4Tm90KHRoaXMpOyB9XG59XG5cbmV4cG9ydCBjbGFzcyBNZXRob2RDYWxsIGV4dGVuZHMgQVNUIHtcbiAgY29uc3RydWN0b3IocHVibGljIHJlY2VpdmVyOiBBU1QsIHB1YmxpYyBuYW1lOiBzdHJpbmcsIHB1YmxpYyBmbjogRnVuY3Rpb24sIHB1YmxpYyBhcmdzOiBhbnlbXSkge1xuICAgIHN1cGVyKCk7XG4gIH1cbiAgdmlzaXQodmlzaXRvcjogQXN0VmlzaXRvcik6IGFueSB7IHJldHVybiB2aXNpdG9yLnZpc2l0TWV0aG9kQ2FsbCh0aGlzKTsgfVxufVxuXG5leHBvcnQgY2xhc3MgU2FmZU1ldGhvZENhbGwgZXh0ZW5kcyBBU1Qge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgcmVjZWl2ZXI6IEFTVCwgcHVibGljIG5hbWU6IHN0cmluZywgcHVibGljIGZuOiBGdW5jdGlvbiwgcHVibGljIGFyZ3M6IGFueVtdKSB7XG4gICAgc3VwZXIoKTtcbiAgfVxuICB2aXNpdCh2aXNpdG9yOiBBc3RWaXNpdG9yKTogYW55IHsgcmV0dXJuIHZpc2l0b3IudmlzaXRTYWZlTWV0aG9kQ2FsbCh0aGlzKTsgfVxufVxuXG5leHBvcnQgY2xhc3MgRnVuY3Rpb25DYWxsIGV4dGVuZHMgQVNUIHtcbiAgY29uc3RydWN0b3IocHVibGljIHRhcmdldDogQVNULCBwdWJsaWMgYXJnczogYW55W10pIHsgc3VwZXIoKTsgfVxuICB2aXNpdCh2aXNpdG9yOiBBc3RWaXNpdG9yKTogYW55IHsgcmV0dXJuIHZpc2l0b3IudmlzaXRGdW5jdGlvbkNhbGwodGhpcyk7IH1cbn1cblxuZXhwb3J0IGNsYXNzIEFTVFdpdGhTb3VyY2UgZXh0ZW5kcyBBU1Qge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgYXN0OiBBU1QsIHB1YmxpYyBzb3VyY2U6IHN0cmluZywgcHVibGljIGxvY2F0aW9uOiBzdHJpbmcpIHsgc3VwZXIoKTsgfVxuICB2aXNpdCh2aXNpdG9yOiBBc3RWaXNpdG9yKTogYW55IHsgcmV0dXJuIHRoaXMuYXN0LnZpc2l0KHZpc2l0b3IpOyB9XG4gIHRvU3RyaW5nKCk6IHN0cmluZyB7IHJldHVybiBgJHt0aGlzLnNvdXJjZX0gaW4gJHt0aGlzLmxvY2F0aW9ufWA7IH1cbn1cblxuZXhwb3J0IGNsYXNzIFRlbXBsYXRlQmluZGluZyB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBrZXk6IHN0cmluZywgcHVibGljIGtleUlzVmFyOiBib29sZWFuLCBwdWJsaWMgbmFtZTogc3RyaW5nLFxuICAgICAgICAgICAgICBwdWJsaWMgZXhwcmVzc2lvbjogQVNUV2l0aFNvdXJjZSkge31cbn1cblxuZXhwb3J0IGludGVyZmFjZSBBc3RWaXNpdG9yIHtcbiAgdmlzaXRCaW5hcnkoYXN0OiBCaW5hcnkpOiBhbnk7XG4gIHZpc2l0Q2hhaW4oYXN0OiBDaGFpbik6IGFueTtcbiAgdmlzaXRDb25kaXRpb25hbChhc3Q6IENvbmRpdGlvbmFsKTogYW55O1xuICB2aXNpdEZ1bmN0aW9uQ2FsbChhc3Q6IEZ1bmN0aW9uQ2FsbCk6IGFueTtcbiAgdmlzaXRJbXBsaWNpdFJlY2VpdmVyKGFzdDogSW1wbGljaXRSZWNlaXZlcik6IGFueTtcbiAgdmlzaXRJbnRlcnBvbGF0aW9uKGFzdDogSW50ZXJwb2xhdGlvbik6IGFueTtcbiAgdmlzaXRLZXllZFJlYWQoYXN0OiBLZXllZFJlYWQpOiBhbnk7XG4gIHZpc2l0S2V5ZWRXcml0ZShhc3Q6IEtleWVkV3JpdGUpOiBhbnk7XG4gIHZpc2l0TGl0ZXJhbEFycmF5KGFzdDogTGl0ZXJhbEFycmF5KTogYW55O1xuICB2aXNpdExpdGVyYWxNYXAoYXN0OiBMaXRlcmFsTWFwKTogYW55O1xuICB2aXNpdExpdGVyYWxQcmltaXRpdmUoYXN0OiBMaXRlcmFsUHJpbWl0aXZlKTogYW55O1xuICB2aXNpdE1ldGhvZENhbGwoYXN0OiBNZXRob2RDYWxsKTogYW55O1xuICB2aXNpdFBpcGUoYXN0OiBCaW5kaW5nUGlwZSk6IGFueTtcbiAgdmlzaXRQcmVmaXhOb3QoYXN0OiBQcmVmaXhOb3QpOiBhbnk7XG4gIHZpc2l0UHJvcGVydHlSZWFkKGFzdDogUHJvcGVydHlSZWFkKTogYW55O1xuICB2aXNpdFByb3BlcnR5V3JpdGUoYXN0OiBQcm9wZXJ0eVdyaXRlKTogYW55O1xuICB2aXNpdFF1b3RlKGFzdDogUXVvdGUpOiBhbnk7XG4gIHZpc2l0U2FmZU1ldGhvZENhbGwoYXN0OiBTYWZlTWV0aG9kQ2FsbCk6IGFueTtcbiAgdmlzaXRTYWZlUHJvcGVydHlSZWFkKGFzdDogU2FmZVByb3BlcnR5UmVhZCk6IGFueTtcbn1cblxuZXhwb3J0IGNsYXNzIFJlY3Vyc2l2ZUFzdFZpc2l0b3IgaW1wbGVtZW50cyBBc3RWaXNpdG9yIHtcbiAgdmlzaXRCaW5hcnkoYXN0OiBCaW5hcnkpOiBhbnkge1xuICAgIGFzdC5sZWZ0LnZpc2l0KHRoaXMpO1xuICAgIGFzdC5yaWdodC52aXNpdCh0aGlzKTtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICB2aXNpdENoYWluKGFzdDogQ2hhaW4pOiBhbnkgeyByZXR1cm4gdGhpcy52aXNpdEFsbChhc3QuZXhwcmVzc2lvbnMpOyB9XG4gIHZpc2l0Q29uZGl0aW9uYWwoYXN0OiBDb25kaXRpb25hbCk6IGFueSB7XG4gICAgYXN0LmNvbmRpdGlvbi52aXNpdCh0aGlzKTtcbiAgICBhc3QudHJ1ZUV4cC52aXNpdCh0aGlzKTtcbiAgICBhc3QuZmFsc2VFeHAudmlzaXQodGhpcyk7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgdmlzaXRQaXBlKGFzdDogQmluZGluZ1BpcGUpOiBhbnkge1xuICAgIGFzdC5leHAudmlzaXQodGhpcyk7XG4gICAgdGhpcy52aXNpdEFsbChhc3QuYXJncyk7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgdmlzaXRGdW5jdGlvbkNhbGwoYXN0OiBGdW5jdGlvbkNhbGwpOiBhbnkge1xuICAgIGFzdC50YXJnZXQudmlzaXQodGhpcyk7XG4gICAgdGhpcy52aXNpdEFsbChhc3QuYXJncyk7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgdmlzaXRJbXBsaWNpdFJlY2VpdmVyKGFzdDogSW1wbGljaXRSZWNlaXZlcik6IGFueSB7IHJldHVybiBudWxsOyB9XG4gIHZpc2l0SW50ZXJwb2xhdGlvbihhc3Q6IEludGVycG9sYXRpb24pOiBhbnkgeyByZXR1cm4gdGhpcy52aXNpdEFsbChhc3QuZXhwcmVzc2lvbnMpOyB9XG4gIHZpc2l0S2V5ZWRSZWFkKGFzdDogS2V5ZWRSZWFkKTogYW55IHtcbiAgICBhc3Qub2JqLnZpc2l0KHRoaXMpO1xuICAgIGFzdC5rZXkudmlzaXQodGhpcyk7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgdmlzaXRLZXllZFdyaXRlKGFzdDogS2V5ZWRXcml0ZSk6IGFueSB7XG4gICAgYXN0Lm9iai52aXNpdCh0aGlzKTtcbiAgICBhc3Qua2V5LnZpc2l0KHRoaXMpO1xuICAgIGFzdC52YWx1ZS52aXNpdCh0aGlzKTtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICB2aXNpdExpdGVyYWxBcnJheShhc3Q6IExpdGVyYWxBcnJheSk6IGFueSB7IHJldHVybiB0aGlzLnZpc2l0QWxsKGFzdC5leHByZXNzaW9ucyk7IH1cbiAgdmlzaXRMaXRlcmFsTWFwKGFzdDogTGl0ZXJhbE1hcCk6IGFueSB7IHJldHVybiB0aGlzLnZpc2l0QWxsKGFzdC52YWx1ZXMpOyB9XG4gIHZpc2l0TGl0ZXJhbFByaW1pdGl2ZShhc3Q6IExpdGVyYWxQcmltaXRpdmUpOiBhbnkgeyByZXR1cm4gbnVsbDsgfVxuICB2aXNpdE1ldGhvZENhbGwoYXN0OiBNZXRob2RDYWxsKTogYW55IHtcbiAgICBhc3QucmVjZWl2ZXIudmlzaXQodGhpcyk7XG4gICAgcmV0dXJuIHRoaXMudmlzaXRBbGwoYXN0LmFyZ3MpO1xuICB9XG4gIHZpc2l0UHJlZml4Tm90KGFzdDogUHJlZml4Tm90KTogYW55IHtcbiAgICBhc3QuZXhwcmVzc2lvbi52aXNpdCh0aGlzKTtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICB2aXNpdFByb3BlcnR5UmVhZChhc3Q6IFByb3BlcnR5UmVhZCk6IGFueSB7XG4gICAgYXN0LnJlY2VpdmVyLnZpc2l0KHRoaXMpO1xuICAgIHJldHVybiBudWxsO1xuICB9XG4gIHZpc2l0UHJvcGVydHlXcml0ZShhc3Q6IFByb3BlcnR5V3JpdGUpOiBhbnkge1xuICAgIGFzdC5yZWNlaXZlci52aXNpdCh0aGlzKTtcbiAgICBhc3QudmFsdWUudmlzaXQodGhpcyk7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgdmlzaXRTYWZlUHJvcGVydHlSZWFkKGFzdDogU2FmZVByb3BlcnR5UmVhZCk6IGFueSB7XG4gICAgYXN0LnJlY2VpdmVyLnZpc2l0KHRoaXMpO1xuICAgIHJldHVybiBudWxsO1xuICB9XG4gIHZpc2l0U2FmZU1ldGhvZENhbGwoYXN0OiBTYWZlTWV0aG9kQ2FsbCk6IGFueSB7XG4gICAgYXN0LnJlY2VpdmVyLnZpc2l0KHRoaXMpO1xuICAgIHJldHVybiB0aGlzLnZpc2l0QWxsKGFzdC5hcmdzKTtcbiAgfVxuICB2aXNpdEFsbChhc3RzOiBBU1RbXSk6IGFueSB7XG4gICAgYXN0cy5mb3JFYWNoKGFzdCA9PiBhc3QudmlzaXQodGhpcykpO1xuICAgIHJldHVybiBudWxsO1xuICB9XG4gIHZpc2l0UXVvdGUoYXN0OiBRdW90ZSk6IGFueSB7IHJldHVybiBudWxsOyB9XG59XG5cbmV4cG9ydCBjbGFzcyBBc3RUcmFuc2Zvcm1lciBpbXBsZW1lbnRzIEFzdFZpc2l0b3Ige1xuICB2aXNpdEltcGxpY2l0UmVjZWl2ZXIoYXN0OiBJbXBsaWNpdFJlY2VpdmVyKTogQVNUIHsgcmV0dXJuIGFzdDsgfVxuXG4gIHZpc2l0SW50ZXJwb2xhdGlvbihhc3Q6IEludGVycG9sYXRpb24pOiBBU1Qge1xuICAgIHJldHVybiBuZXcgSW50ZXJwb2xhdGlvbihhc3Quc3RyaW5ncywgdGhpcy52aXNpdEFsbChhc3QuZXhwcmVzc2lvbnMpKTtcbiAgfVxuXG4gIHZpc2l0TGl0ZXJhbFByaW1pdGl2ZShhc3Q6IExpdGVyYWxQcmltaXRpdmUpOiBBU1QgeyByZXR1cm4gbmV3IExpdGVyYWxQcmltaXRpdmUoYXN0LnZhbHVlKTsgfVxuXG4gIHZpc2l0UHJvcGVydHlSZWFkKGFzdDogUHJvcGVydHlSZWFkKTogQVNUIHtcbiAgICByZXR1cm4gbmV3IFByb3BlcnR5UmVhZChhc3QucmVjZWl2ZXIudmlzaXQodGhpcyksIGFzdC5uYW1lLCBhc3QuZ2V0dGVyKTtcbiAgfVxuXG4gIHZpc2l0UHJvcGVydHlXcml0ZShhc3Q6IFByb3BlcnR5V3JpdGUpOiBBU1Qge1xuICAgIHJldHVybiBuZXcgUHJvcGVydHlXcml0ZShhc3QucmVjZWl2ZXIudmlzaXQodGhpcyksIGFzdC5uYW1lLCBhc3Quc2V0dGVyLCBhc3QudmFsdWUpO1xuICB9XG5cbiAgdmlzaXRTYWZlUHJvcGVydHlSZWFkKGFzdDogU2FmZVByb3BlcnR5UmVhZCk6IEFTVCB7XG4gICAgcmV0dXJuIG5ldyBTYWZlUHJvcGVydHlSZWFkKGFzdC5yZWNlaXZlci52aXNpdCh0aGlzKSwgYXN0Lm5hbWUsIGFzdC5nZXR0ZXIpO1xuICB9XG5cbiAgdmlzaXRNZXRob2RDYWxsKGFzdDogTWV0aG9kQ2FsbCk6IEFTVCB7XG4gICAgcmV0dXJuIG5ldyBNZXRob2RDYWxsKGFzdC5yZWNlaXZlci52aXNpdCh0aGlzKSwgYXN0Lm5hbWUsIGFzdC5mbiwgdGhpcy52aXNpdEFsbChhc3QuYXJncykpO1xuICB9XG5cbiAgdmlzaXRTYWZlTWV0aG9kQ2FsbChhc3Q6IFNhZmVNZXRob2RDYWxsKTogQVNUIHtcbiAgICByZXR1cm4gbmV3IFNhZmVNZXRob2RDYWxsKGFzdC5yZWNlaXZlci52aXNpdCh0aGlzKSwgYXN0Lm5hbWUsIGFzdC5mbiwgdGhpcy52aXNpdEFsbChhc3QuYXJncykpO1xuICB9XG5cbiAgdmlzaXRGdW5jdGlvbkNhbGwoYXN0OiBGdW5jdGlvbkNhbGwpOiBBU1Qge1xuICAgIHJldHVybiBuZXcgRnVuY3Rpb25DYWxsKGFzdC50YXJnZXQudmlzaXQodGhpcyksIHRoaXMudmlzaXRBbGwoYXN0LmFyZ3MpKTtcbiAgfVxuXG4gIHZpc2l0TGl0ZXJhbEFycmF5KGFzdDogTGl0ZXJhbEFycmF5KTogQVNUIHtcbiAgICByZXR1cm4gbmV3IExpdGVyYWxBcnJheSh0aGlzLnZpc2l0QWxsKGFzdC5leHByZXNzaW9ucykpO1xuICB9XG5cbiAgdmlzaXRMaXRlcmFsTWFwKGFzdDogTGl0ZXJhbE1hcCk6IEFTVCB7XG4gICAgcmV0dXJuIG5ldyBMaXRlcmFsTWFwKGFzdC5rZXlzLCB0aGlzLnZpc2l0QWxsKGFzdC52YWx1ZXMpKTtcbiAgfVxuXG4gIHZpc2l0QmluYXJ5KGFzdDogQmluYXJ5KTogQVNUIHtcbiAgICByZXR1cm4gbmV3IEJpbmFyeShhc3Qub3BlcmF0aW9uLCBhc3QubGVmdC52aXNpdCh0aGlzKSwgYXN0LnJpZ2h0LnZpc2l0KHRoaXMpKTtcbiAgfVxuXG4gIHZpc2l0UHJlZml4Tm90KGFzdDogUHJlZml4Tm90KTogQVNUIHsgcmV0dXJuIG5ldyBQcmVmaXhOb3QoYXN0LmV4cHJlc3Npb24udmlzaXQodGhpcykpOyB9XG5cbiAgdmlzaXRDb25kaXRpb25hbChhc3Q6IENvbmRpdGlvbmFsKTogQVNUIHtcbiAgICByZXR1cm4gbmV3IENvbmRpdGlvbmFsKGFzdC5jb25kaXRpb24udmlzaXQodGhpcyksIGFzdC50cnVlRXhwLnZpc2l0KHRoaXMpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgYXN0LmZhbHNlRXhwLnZpc2l0KHRoaXMpKTtcbiAgfVxuXG4gIHZpc2l0UGlwZShhc3Q6IEJpbmRpbmdQaXBlKTogQVNUIHtcbiAgICByZXR1cm4gbmV3IEJpbmRpbmdQaXBlKGFzdC5leHAudmlzaXQodGhpcyksIGFzdC5uYW1lLCB0aGlzLnZpc2l0QWxsKGFzdC5hcmdzKSk7XG4gIH1cblxuICB2aXNpdEtleWVkUmVhZChhc3Q6IEtleWVkUmVhZCk6IEFTVCB7XG4gICAgcmV0dXJuIG5ldyBLZXllZFJlYWQoYXN0Lm9iai52aXNpdCh0aGlzKSwgYXN0LmtleS52aXNpdCh0aGlzKSk7XG4gIH1cblxuICB2aXNpdEtleWVkV3JpdGUoYXN0OiBLZXllZFdyaXRlKTogQVNUIHtcbiAgICByZXR1cm4gbmV3IEtleWVkV3JpdGUoYXN0Lm9iai52aXNpdCh0aGlzKSwgYXN0LmtleS52aXNpdCh0aGlzKSwgYXN0LnZhbHVlLnZpc2l0KHRoaXMpKTtcbiAgfVxuXG4gIHZpc2l0QWxsKGFzdHM6IGFueVtdKTogYW55W10ge1xuICAgIHZhciByZXMgPSBMaXN0V3JhcHBlci5jcmVhdGVGaXhlZFNpemUoYXN0cy5sZW5ndGgpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXN0cy5sZW5ndGg7ICsraSkge1xuICAgICAgcmVzW2ldID0gYXN0c1tpXS52aXNpdCh0aGlzKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlcztcbiAgfVxuXG4gIHZpc2l0Q2hhaW4oYXN0OiBDaGFpbik6IEFTVCB7IHJldHVybiBuZXcgQ2hhaW4odGhpcy52aXNpdEFsbChhc3QuZXhwcmVzc2lvbnMpKTsgfVxuXG4gIHZpc2l0UXVvdGUoYXN0OiBRdW90ZSk6IEFTVCB7XG4gICAgcmV0dXJuIG5ldyBRdW90ZShhc3QucHJlZml4LCBhc3QudW5pbnRlcnByZXRlZEV4cHJlc3Npb24sIGFzdC5sb2NhdGlvbik7XG4gIH1cbn1cbiJdfQ==