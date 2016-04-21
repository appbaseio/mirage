'use strict';"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var decorators_1 = require('angular2/src/core/di/decorators');
var collection_1 = require("angular2/src/facade/collection");
var lang_1 = require("angular2/src/facade/lang");
var exceptions_1 = require('angular2/src/facade/exceptions');
(function (TokenType) {
    TokenType[TokenType["Character"] = 0] = "Character";
    TokenType[TokenType["Identifier"] = 1] = "Identifier";
    TokenType[TokenType["Keyword"] = 2] = "Keyword";
    TokenType[TokenType["String"] = 3] = "String";
    TokenType[TokenType["Operator"] = 4] = "Operator";
    TokenType[TokenType["Number"] = 5] = "Number";
})(exports.TokenType || (exports.TokenType = {}));
var TokenType = exports.TokenType;
var Lexer = (function () {
    function Lexer() {
    }
    Lexer.prototype.tokenize = function (text) {
        var scanner = new _Scanner(text);
        var tokens = [];
        var token = scanner.scanToken();
        while (token != null) {
            tokens.push(token);
            token = scanner.scanToken();
        }
        return tokens;
    };
    Lexer = __decorate([
        decorators_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], Lexer);
    return Lexer;
}());
exports.Lexer = Lexer;
var Token = (function () {
    function Token(index, type, numValue, strValue) {
        this.index = index;
        this.type = type;
        this.numValue = numValue;
        this.strValue = strValue;
    }
    Token.prototype.isCharacter = function (code) {
        return (this.type == TokenType.Character && this.numValue == code);
    };
    Token.prototype.isNumber = function () { return (this.type == TokenType.Number); };
    Token.prototype.isString = function () { return (this.type == TokenType.String); };
    Token.prototype.isOperator = function (operater) {
        return (this.type == TokenType.Operator && this.strValue == operater);
    };
    Token.prototype.isIdentifier = function () { return (this.type == TokenType.Identifier); };
    Token.prototype.isKeyword = function () { return (this.type == TokenType.Keyword); };
    Token.prototype.isKeywordVar = function () { return (this.type == TokenType.Keyword && this.strValue == "var"); };
    Token.prototype.isKeywordNull = function () { return (this.type == TokenType.Keyword && this.strValue == "null"); };
    Token.prototype.isKeywordUndefined = function () {
        return (this.type == TokenType.Keyword && this.strValue == "undefined");
    };
    Token.prototype.isKeywordTrue = function () { return (this.type == TokenType.Keyword && this.strValue == "true"); };
    Token.prototype.isKeywordFalse = function () { return (this.type == TokenType.Keyword && this.strValue == "false"); };
    Token.prototype.toNumber = function () {
        // -1 instead of NULL ok?
        return (this.type == TokenType.Number) ? this.numValue : -1;
    };
    Token.prototype.toString = function () {
        switch (this.type) {
            case TokenType.Character:
            case TokenType.Identifier:
            case TokenType.Keyword:
            case TokenType.Operator:
            case TokenType.String:
                return this.strValue;
            case TokenType.Number:
                return this.numValue.toString();
            default:
                return null;
        }
    };
    return Token;
}());
exports.Token = Token;
function newCharacterToken(index, code) {
    return new Token(index, TokenType.Character, code, lang_1.StringWrapper.fromCharCode(code));
}
function newIdentifierToken(index, text) {
    return new Token(index, TokenType.Identifier, 0, text);
}
function newKeywordToken(index, text) {
    return new Token(index, TokenType.Keyword, 0, text);
}
function newOperatorToken(index, text) {
    return new Token(index, TokenType.Operator, 0, text);
}
function newStringToken(index, text) {
    return new Token(index, TokenType.String, 0, text);
}
function newNumberToken(index, n) {
    return new Token(index, TokenType.Number, n, "");
}
exports.EOF = new Token(-1, TokenType.Character, 0, "");
exports.$EOF = 0;
exports.$TAB = 9;
exports.$LF = 10;
exports.$VTAB = 11;
exports.$FF = 12;
exports.$CR = 13;
exports.$SPACE = 32;
exports.$BANG = 33;
exports.$DQ = 34;
exports.$HASH = 35;
exports.$$ = 36;
exports.$PERCENT = 37;
exports.$AMPERSAND = 38;
exports.$SQ = 39;
exports.$LPAREN = 40;
exports.$RPAREN = 41;
exports.$STAR = 42;
exports.$PLUS = 43;
exports.$COMMA = 44;
exports.$MINUS = 45;
exports.$PERIOD = 46;
exports.$SLASH = 47;
exports.$COLON = 58;
exports.$SEMICOLON = 59;
exports.$LT = 60;
exports.$EQ = 61;
exports.$GT = 62;
exports.$QUESTION = 63;
var $0 = 48;
var $9 = 57;
var $A = 65, $E = 69, $Z = 90;
exports.$LBRACKET = 91;
exports.$BACKSLASH = 92;
exports.$RBRACKET = 93;
var $CARET = 94;
var $_ = 95;
var $a = 97, $e = 101, $f = 102, $n = 110, $r = 114, $t = 116, $u = 117, $v = 118, $z = 122;
exports.$LBRACE = 123;
exports.$BAR = 124;
exports.$RBRACE = 125;
var $NBSP = 160;
var ScannerError = (function (_super) {
    __extends(ScannerError, _super);
    function ScannerError(message) {
        _super.call(this);
        this.message = message;
    }
    ScannerError.prototype.toString = function () { return this.message; };
    return ScannerError;
}(exceptions_1.BaseException));
exports.ScannerError = ScannerError;
var _Scanner = (function () {
    function _Scanner(input) {
        this.input = input;
        this.peek = 0;
        this.index = -1;
        this.length = input.length;
        this.advance();
    }
    _Scanner.prototype.advance = function () {
        this.peek =
            ++this.index >= this.length ? exports.$EOF : lang_1.StringWrapper.charCodeAt(this.input, this.index);
    };
    _Scanner.prototype.scanToken = function () {
        var input = this.input, length = this.length, peek = this.peek, index = this.index;
        // Skip whitespace.
        while (peek <= exports.$SPACE) {
            if (++index >= length) {
                peek = exports.$EOF;
                break;
            }
            else {
                peek = lang_1.StringWrapper.charCodeAt(input, index);
            }
        }
        this.peek = peek;
        this.index = index;
        if (index >= length) {
            return null;
        }
        // Handle identifiers and numbers.
        if (isIdentifierStart(peek))
            return this.scanIdentifier();
        if (isDigit(peek))
            return this.scanNumber(index);
        var start = index;
        switch (peek) {
            case exports.$PERIOD:
                this.advance();
                return isDigit(this.peek) ? this.scanNumber(start) : newCharacterToken(start, exports.$PERIOD);
            case exports.$LPAREN:
            case exports.$RPAREN:
            case exports.$LBRACE:
            case exports.$RBRACE:
            case exports.$LBRACKET:
            case exports.$RBRACKET:
            case exports.$COMMA:
            case exports.$COLON:
            case exports.$SEMICOLON:
                return this.scanCharacter(start, peek);
            case exports.$SQ:
            case exports.$DQ:
                return this.scanString();
            case exports.$HASH:
            case exports.$PLUS:
            case exports.$MINUS:
            case exports.$STAR:
            case exports.$SLASH:
            case exports.$PERCENT:
            case $CARET:
                return this.scanOperator(start, lang_1.StringWrapper.fromCharCode(peek));
            case exports.$QUESTION:
                return this.scanComplexOperator(start, '?', exports.$PERIOD, '.');
            case exports.$LT:
            case exports.$GT:
                return this.scanComplexOperator(start, lang_1.StringWrapper.fromCharCode(peek), exports.$EQ, '=');
            case exports.$BANG:
            case exports.$EQ:
                return this.scanComplexOperator(start, lang_1.StringWrapper.fromCharCode(peek), exports.$EQ, '=', exports.$EQ, '=');
            case exports.$AMPERSAND:
                return this.scanComplexOperator(start, '&', exports.$AMPERSAND, '&');
            case exports.$BAR:
                return this.scanComplexOperator(start, '|', exports.$BAR, '|');
            case $NBSP:
                while (isWhitespace(this.peek))
                    this.advance();
                return this.scanToken();
        }
        this.error("Unexpected character [" + lang_1.StringWrapper.fromCharCode(peek) + "]", 0);
        return null;
    };
    _Scanner.prototype.scanCharacter = function (start, code) {
        this.advance();
        return newCharacterToken(start, code);
    };
    _Scanner.prototype.scanOperator = function (start, str) {
        this.advance();
        return newOperatorToken(start, str);
    };
    /**
     * Tokenize a 2/3 char long operator
     *
     * @param start start index in the expression
     * @param one first symbol (always part of the operator)
     * @param twoCode code point for the second symbol
     * @param two second symbol (part of the operator when the second code point matches)
     * @param threeCode code point for the third symbol
     * @param three third symbol (part of the operator when provided and matches source expression)
     * @returns {Token}
     */
    _Scanner.prototype.scanComplexOperator = function (start, one, twoCode, two, threeCode, three) {
        this.advance();
        var str = one;
        if (this.peek == twoCode) {
            this.advance();
            str += two;
        }
        if (lang_1.isPresent(threeCode) && this.peek == threeCode) {
            this.advance();
            str += three;
        }
        return newOperatorToken(start, str);
    };
    _Scanner.prototype.scanIdentifier = function () {
        var start = this.index;
        this.advance();
        while (isIdentifierPart(this.peek))
            this.advance();
        var str = this.input.substring(start, this.index);
        if (collection_1.SetWrapper.has(KEYWORDS, str)) {
            return newKeywordToken(start, str);
        }
        else {
            return newIdentifierToken(start, str);
        }
    };
    _Scanner.prototype.scanNumber = function (start) {
        var simple = (this.index === start);
        this.advance(); // Skip initial digit.
        while (true) {
            if (isDigit(this.peek)) {
            }
            else if (this.peek == exports.$PERIOD) {
                simple = false;
            }
            else if (isExponentStart(this.peek)) {
                this.advance();
                if (isExponentSign(this.peek))
                    this.advance();
                if (!isDigit(this.peek))
                    this.error('Invalid exponent', -1);
                simple = false;
            }
            else {
                break;
            }
            this.advance();
        }
        var str = this.input.substring(start, this.index);
        // TODO
        var value = simple ? lang_1.NumberWrapper.parseIntAutoRadix(str) : lang_1.NumberWrapper.parseFloat(str);
        return newNumberToken(start, value);
    };
    _Scanner.prototype.scanString = function () {
        var start = this.index;
        var quote = this.peek;
        this.advance(); // Skip initial quote.
        var buffer;
        var marker = this.index;
        var input = this.input;
        while (this.peek != quote) {
            if (this.peek == exports.$BACKSLASH) {
                if (buffer == null)
                    buffer = new lang_1.StringJoiner();
                buffer.add(input.substring(marker, this.index));
                this.advance();
                var unescapedCode;
                if (this.peek == $u) {
                    // 4 character hex code for unicode character.
                    var hex = input.substring(this.index + 1, this.index + 5);
                    try {
                        unescapedCode = lang_1.NumberWrapper.parseInt(hex, 16);
                    }
                    catch (e) {
                        this.error("Invalid unicode escape [\\u" + hex + "]", 0);
                    }
                    for (var i = 0; i < 5; i++) {
                        this.advance();
                    }
                }
                else {
                    unescapedCode = unescape(this.peek);
                    this.advance();
                }
                buffer.add(lang_1.StringWrapper.fromCharCode(unescapedCode));
                marker = this.index;
            }
            else if (this.peek == exports.$EOF) {
                this.error('Unterminated quote', 0);
            }
            else {
                this.advance();
            }
        }
        var last = input.substring(marker, this.index);
        this.advance(); // Skip terminating quote.
        // Compute the unescaped string value.
        var unescaped = last;
        if (buffer != null) {
            buffer.add(last);
            unescaped = buffer.toString();
        }
        return newStringToken(start, unescaped);
    };
    _Scanner.prototype.error = function (message, offset) {
        var position = this.index + offset;
        throw new ScannerError("Lexer Error: " + message + " at column " + position + " in expression [" + this.input + "]");
    };
    return _Scanner;
}());
function isWhitespace(code) {
    return (code >= exports.$TAB && code <= exports.$SPACE) || (code == $NBSP);
}
function isIdentifierStart(code) {
    return ($a <= code && code <= $z) || ($A <= code && code <= $Z) || (code == $_) || (code == exports.$$);
}
function isIdentifier(input) {
    if (input.length == 0)
        return false;
    var scanner = new _Scanner(input);
    if (!isIdentifierStart(scanner.peek))
        return false;
    scanner.advance();
    while (scanner.peek !== exports.$EOF) {
        if (!isIdentifierPart(scanner.peek))
            return false;
        scanner.advance();
    }
    return true;
}
exports.isIdentifier = isIdentifier;
function isIdentifierPart(code) {
    return ($a <= code && code <= $z) || ($A <= code && code <= $Z) || ($0 <= code && code <= $9) ||
        (code == $_) || (code == exports.$$);
}
function isDigit(code) {
    return $0 <= code && code <= $9;
}
function isExponentStart(code) {
    return code == $e || code == $E;
}
function isExponentSign(code) {
    return code == exports.$MINUS || code == exports.$PLUS;
}
function unescape(code) {
    switch (code) {
        case $n:
            return exports.$LF;
        case $f:
            return exports.$FF;
        case $r:
            return exports.$CR;
        case $t:
            return exports.$TAB;
        case $v:
            return exports.$VTAB;
        default:
            return code;
    }
}
var OPERATORS = collection_1.SetWrapper.createFromList([
    '+',
    '-',
    '*',
    '/',
    '%',
    '^',
    '=',
    '==',
    '!=',
    '===',
    '!==',
    '<',
    '>',
    '<=',
    '>=',
    '&&',
    '||',
    '&',
    '|',
    '!',
    '?',
    '#',
    '?.'
]);
var KEYWORDS = collection_1.SetWrapper.createFromList(['var', 'null', 'undefined', 'true', 'false', 'if', 'else']);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGV4ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJkaWZmaW5nX3BsdWdpbl93cmFwcGVyLW91dHB1dF9wYXRoLWpha1huTW1MLnRtcC9hbmd1bGFyMi9zcmMvY29yZS9jaGFuZ2VfZGV0ZWN0aW9uL3BhcnNlci9sZXhlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFBQSwyQkFBeUIsaUNBQWlDLENBQUMsQ0FBQTtBQUMzRCwyQkFBc0MsZ0NBQWdDLENBQUMsQ0FBQTtBQUN2RSxxQkFBb0UsMEJBQTBCLENBQUMsQ0FBQTtBQUMvRiwyQkFBNEIsZ0NBQWdDLENBQUMsQ0FBQTtBQUU3RCxXQUFZLFNBQVM7SUFDbkIsbURBQVMsQ0FBQTtJQUNULHFEQUFVLENBQUE7SUFDViwrQ0FBTyxDQUFBO0lBQ1AsNkNBQU0sQ0FBQTtJQUNOLGlEQUFRLENBQUE7SUFDUiw2Q0FBTSxDQUFBO0FBQ1IsQ0FBQyxFQVBXLGlCQUFTLEtBQVQsaUJBQVMsUUFPcEI7QUFQRCxJQUFZLFNBQVMsR0FBVCxpQkFPWCxDQUFBO0FBR0Q7SUFBQTtJQVdBLENBQUM7SUFWQyx3QkFBUSxHQUFSLFVBQVMsSUFBWTtRQUNuQixJQUFJLE9BQU8sR0FBRyxJQUFJLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNqQyxJQUFJLE1BQU0sR0FBRyxFQUFFLENBQUM7UUFDaEIsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBQ2hDLE9BQU8sS0FBSyxJQUFJLElBQUksRUFBRSxDQUFDO1lBQ3JCLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDbkIsS0FBSyxHQUFHLE9BQU8sQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUM5QixDQUFDO1FBQ0QsTUFBTSxDQUFDLE1BQU0sQ0FBQztJQUNoQixDQUFDO0lBWEg7UUFBQyx1QkFBVSxFQUFFOzthQUFBO0lBWWIsWUFBQztBQUFELENBQUMsQUFYRCxJQVdDO0FBWFks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QUFRLEdBQ1IsdUJBQVUsQ0FBQyxjQUFjLENBQUMsQ0FBQyxLQUFLLEVBQUUsTUFBTSxFQUFFLFdBQVcsRUFBRSxNQUFNLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtJbmplY3RhYmxlfSBmcm9tICdhbmd1bGFyMi9zcmMvY29yZS9kaS9kZWNvcmF0b3JzJztcbmltcG9ydCB7TGlzdFdyYXBwZXIsIFNldFdyYXBwZXJ9IGZyb20gXCJhbmd1bGFyMi9zcmMvZmFjYWRlL2NvbGxlY3Rpb25cIjtcbmltcG9ydCB7TnVtYmVyV3JhcHBlciwgU3RyaW5nSm9pbmVyLCBTdHJpbmdXcmFwcGVyLCBpc1ByZXNlbnR9IGZyb20gXCJhbmd1bGFyMi9zcmMvZmFjYWRlL2xhbmdcIjtcbmltcG9ydCB7QmFzZUV4Y2VwdGlvbn0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9leGNlcHRpb25zJztcblxuZXhwb3J0IGVudW0gVG9rZW5UeXBlIHtcbiAgQ2hhcmFjdGVyLFxuICBJZGVudGlmaWVyLFxuICBLZXl3b3JkLFxuICBTdHJpbmcsXG4gIE9wZXJhdG9yLFxuICBOdW1iZXJcbn1cblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIExleGVyIHtcbiAgdG9rZW5pemUodGV4dDogc3RyaW5nKTogYW55W10ge1xuICAgIHZhciBzY2FubmVyID0gbmV3IF9TY2FubmVyKHRleHQpO1xuICAgIHZhciB0b2tlbnMgPSBbXTtcbiAgICB2YXIgdG9rZW4gPSBzY2FubmVyLnNjYW5Ub2tlbigpO1xuICAgIHdoaWxlICh0b2tlbiAhPSBudWxsKSB7XG4gICAgICB0b2tlbnMucHVzaCh0b2tlbik7XG4gICAgICB0b2tlbiA9IHNjYW5uZXIuc2NhblRva2VuKCk7XG4gICAgfVxuICAgIHJldHVybiB0b2tlbnM7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIFRva2VuIHtcbiAgY29uc3RydWN0b3IocHVibGljIGluZGV4OiBudW1iZXIsIHB1YmxpYyB0eXBlOiBUb2tlblR5cGUsIHB1YmxpYyBudW1WYWx1ZTogbnVtYmVyLFxuICAgICAgICAgICAgICBwdWJsaWMgc3RyVmFsdWU6IHN0cmluZykge31cblxuICBpc0NoYXJhY3Rlcihjb2RlOiBudW1iZXIpOiBib29sZWFuIHtcbiAgICByZXR1cm4gKHRoaXMudHlwZSA9PSBUb2tlblR5cGUuQ2hhcmFjdGVyICYmIHRoaXMubnVtVmFsdWUgPT0gY29kZSk7XG4gIH1cblxuICBpc051bWJlcigpOiBib29sZWFuIHsgcmV0dXJuICh0aGlzLnR5cGUgPT0gVG9rZW5UeXBlLk51bWJlcik7IH1cblxuICBpc1N0cmluZygpOiBib29sZWFuIHsgcmV0dXJuICh0aGlzLnR5cGUgPT0gVG9rZW5UeXBlLlN0cmluZyk7IH1cblxuICBpc09wZXJhdG9yKG9wZXJhdGVyOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICByZXR1cm4gKHRoaXMudHlwZSA9PSBUb2tlblR5cGUuT3BlcmF0b3IgJiYgdGhpcy5zdHJWYWx1ZSA9PSBvcGVyYXRlcik7XG4gIH1cblxuICBpc0lkZW50aWZpZXIoKTogYm9vbGVhbiB7IHJldHVybiAodGhpcy50eXBlID09IFRva2VuVHlwZS5JZGVudGlmaWVyKTsgfVxuXG4gIGlzS2V5d29yZCgpOiBib29sZWFuIHsgcmV0dXJuICh0aGlzLnR5cGUgPT0gVG9rZW5UeXBlLktleXdvcmQpOyB9XG5cbiAgaXNLZXl3b3JkVmFyKCk6IGJvb2xlYW4geyByZXR1cm4gKHRoaXMudHlwZSA9PSBUb2tlblR5cGUuS2V5d29yZCAmJiB0aGlzLnN0clZhbHVlID09IFwidmFyXCIpOyB9XG5cbiAgaXNLZXl3b3JkTnVsbCgpOiBib29sZWFuIHsgcmV0dXJuICh0aGlzLnR5cGUgPT0gVG9rZW5UeXBlLktleXdvcmQgJiYgdGhpcy5zdHJWYWx1ZSA9PSBcIm51bGxcIik7IH1cblxuICBpc0tleXdvcmRVbmRlZmluZWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuICh0aGlzLnR5cGUgPT0gVG9rZW5UeXBlLktleXdvcmQgJiYgdGhpcy5zdHJWYWx1ZSA9PSBcInVuZGVmaW5lZFwiKTtcbiAgfVxuXG4gIGlzS2V5d29yZFRydWUoKTogYm9vbGVhbiB7IHJldHVybiAodGhpcy50eXBlID09IFRva2VuVHlwZS5LZXl3b3JkICYmIHRoaXMuc3RyVmFsdWUgPT0gXCJ0cnVlXCIpOyB9XG5cbiAgaXNLZXl3b3JkRmFsc2UoKTogYm9vbGVhbiB7IHJldHVybiAodGhpcy50eXBlID09IFRva2VuVHlwZS5LZXl3b3JkICYmIHRoaXMuc3RyVmFsdWUgPT0gXCJmYWxzZVwiKTsgfVxuXG4gIHRvTnVtYmVyKCk6IG51bWJlciB7XG4gICAgLy8gLTEgaW5zdGVhZCBvZiBOVUxMIG9rP1xuICAgIHJldHVybiAodGhpcy50eXBlID09IFRva2VuVHlwZS5OdW1iZXIpID8gdGhpcy5udW1WYWx1ZSA6IC0xO1xuICB9XG5cbiAgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICBzd2l0Y2ggKHRoaXMudHlwZSkge1xuICAgICAgY2FzZSBUb2tlblR5cGUuQ2hhcmFjdGVyOlxuICAgICAgY2FzZSBUb2tlblR5cGUuSWRlbnRpZmllcjpcbiAgICAgIGNhc2UgVG9rZW5UeXBlLktleXdvcmQ6XG4gICAgICBjYXNlIFRva2VuVHlwZS5PcGVyYXRvcjpcbiAgICAgIGNhc2UgVG9rZW5UeXBlLlN0cmluZzpcbiAgICAgICAgcmV0dXJuIHRoaXMuc3RyVmFsdWU7XG4gICAgICBjYXNlIFRva2VuVHlwZS5OdW1iZXI6XG4gICAgICAgIHJldHVybiB0aGlzLm51bVZhbHVlLnRvU3RyaW5nKCk7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gbmV3Q2hhcmFjdGVyVG9rZW4oaW5kZXg6IG51bWJlciwgY29kZTogbnVtYmVyKTogVG9rZW4ge1xuICByZXR1cm4gbmV3IFRva2VuKGluZGV4LCBUb2tlblR5cGUuQ2hhcmFjdGVyLCBjb2RlLCBTdHJpbmdXcmFwcGVyLmZyb21DaGFyQ29kZShjb2RlKSk7XG59XG5cbmZ1bmN0aW9uIG5ld0lkZW50aWZpZXJUb2tlbihpbmRleDogbnVtYmVyLCB0ZXh0OiBzdHJpbmcpOiBUb2tlbiB7XG4gIHJldHVybiBuZXcgVG9rZW4oaW5kZXgsIFRva2VuVHlwZS5JZGVudGlmaWVyLCAwLCB0ZXh0KTtcbn1cblxuZnVuY3Rpb24gbmV3S2V5d29yZFRva2VuKGluZGV4OiBudW1iZXIsIHRleHQ6IHN0cmluZyk6IFRva2VuIHtcbiAgcmV0dXJuIG5ldyBUb2tlbihpbmRleCwgVG9rZW5UeXBlLktleXdvcmQsIDAsIHRleHQpO1xufVxuXG5mdW5jdGlvbiBuZXdPcGVyYXRvclRva2VuKGluZGV4OiBudW1iZXIsIHRleHQ6IHN0cmluZyk6IFRva2VuIHtcbiAgcmV0dXJuIG5ldyBUb2tlbihpbmRleCwgVG9rZW5UeXBlLk9wZXJhdG9yLCAwLCB0ZXh0KTtcbn1cblxuZnVuY3Rpb24gbmV3U3RyaW5nVG9rZW4oaW5kZXg6IG51bWJlciwgdGV4dDogc3RyaW5nKTogVG9rZW4ge1xuICByZXR1cm4gbmV3IFRva2VuKGluZGV4LCBUb2tlblR5cGUuU3RyaW5nLCAwLCB0ZXh0KTtcbn1cblxuZnVuY3Rpb24gbmV3TnVtYmVyVG9rZW4oaW5kZXg6IG51bWJlciwgbjogbnVtYmVyKTogVG9rZW4ge1xuICByZXR1cm4gbmV3IFRva2VuKGluZGV4LCBUb2tlblR5cGUuTnVtYmVyLCBuLCBcIlwiKTtcbn1cblxuXG5leHBvcnQgdmFyIEVPRjogVG9rZW4gPSBuZXcgVG9rZW4oLTEsIFRva2VuVHlwZS5DaGFyYWN0ZXIsIDAsIFwiXCIpO1xuXG5leHBvcnQgY29uc3QgJEVPRiA9IDA7XG5leHBvcnQgY29uc3QgJFRBQiA9IDk7XG5leHBvcnQgY29uc3QgJExGID0gMTA7XG5leHBvcnQgY29uc3QgJFZUQUIgPSAxMTtcbmV4cG9ydCBjb25zdCAkRkYgPSAxMjtcbmV4cG9ydCBjb25zdCAkQ1IgPSAxMztcbmV4cG9ydCBjb25zdCAkU1BBQ0UgPSAzMjtcbmV4cG9ydCBjb25zdCAkQkFORyA9IDMzO1xuZXhwb3J0IGNvbnN0ICREUSA9IDM0O1xuZXhwb3J0IGNvbnN0ICRIQVNIID0gMzU7XG5leHBvcnQgY29uc3QgJCQgPSAzNjtcbmV4cG9ydCBjb25zdCAkUEVSQ0VOVCA9IDM3O1xuZXhwb3J0IGNvbnN0ICRBTVBFUlNBTkQgPSAzODtcbmV4cG9ydCBjb25zdCAkU1EgPSAzOTtcbmV4cG9ydCBjb25zdCAkTFBBUkVOID0gNDA7XG5leHBvcnQgY29uc3QgJFJQQVJFTiA9IDQxO1xuZXhwb3J0IGNvbnN0ICRTVEFSID0gNDI7XG5leHBvcnQgY29uc3QgJFBMVVMgPSA0MztcbmV4cG9ydCBjb25zdCAkQ09NTUEgPSA0NDtcbmV4cG9ydCBjb25zdCAkTUlOVVMgPSA0NTtcbmV4cG9ydCBjb25zdCAkUEVSSU9EID0gNDY7XG5leHBvcnQgY29uc3QgJFNMQVNIID0gNDc7XG5leHBvcnQgY29uc3QgJENPTE9OID0gNTg7XG5leHBvcnQgY29uc3QgJFNFTUlDT0xPTiA9IDU5O1xuZXhwb3J0IGNvbnN0ICRMVCA9IDYwO1xuZXhwb3J0IGNvbnN0ICRFUSA9IDYxO1xuZXhwb3J0IGNvbnN0ICRHVCA9IDYyO1xuZXhwb3J0IGNvbnN0ICRRVUVTVElPTiA9IDYzO1xuXG5jb25zdCAkMCA9IDQ4O1xuY29uc3QgJDkgPSA1NztcblxuY29uc3QgJEEgPSA2NSwgJEUgPSA2OSwgJFogPSA5MDtcblxuZXhwb3J0IGNvbnN0ICRMQlJBQ0tFVCA9IDkxO1xuZXhwb3J0IGNvbnN0ICRCQUNLU0xBU0ggPSA5MjtcbmV4cG9ydCBjb25zdCAkUkJSQUNLRVQgPSA5MztcbmNvbnN0ICRDQVJFVCA9IDk0O1xuY29uc3QgJF8gPSA5NTtcblxuY29uc3QgJGEgPSA5NywgJGUgPSAxMDEsICRmID0gMTAyLCAkbiA9IDExMCwgJHIgPSAxMTQsICR0ID0gMTE2LCAkdSA9IDExNywgJHYgPSAxMTgsICR6ID0gMTIyO1xuXG5leHBvcnQgY29uc3QgJExCUkFDRSA9IDEyMztcbmV4cG9ydCBjb25zdCAkQkFSID0gMTI0O1xuZXhwb3J0IGNvbnN0ICRSQlJBQ0UgPSAxMjU7XG5jb25zdCAkTkJTUCA9IDE2MDtcblxuZXhwb3J0IGNsYXNzIFNjYW5uZXJFcnJvciBleHRlbmRzIEJhc2VFeGNlcHRpb24ge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgbWVzc2FnZSkgeyBzdXBlcigpOyB9XG5cbiAgdG9TdHJpbmcoKTogc3RyaW5nIHsgcmV0dXJuIHRoaXMubWVzc2FnZTsgfVxufVxuXG5jbGFzcyBfU2Nhbm5lciB7XG4gIGxlbmd0aDogbnVtYmVyO1xuICBwZWVrOiBudW1iZXIgPSAwO1xuICBpbmRleDogbnVtYmVyID0gLTE7XG5cbiAgY29uc3RydWN0b3IocHVibGljIGlucHV0OiBzdHJpbmcpIHtcbiAgICB0aGlzLmxlbmd0aCA9IGlucHV0Lmxlbmd0aDtcbiAgICB0aGlzLmFkdmFuY2UoKTtcbiAgfVxuXG4gIGFkdmFuY2UoKSB7XG4gICAgdGhpcy5wZWVrID1cbiAgICAgICAgKyt0aGlzLmluZGV4ID49IHRoaXMubGVuZ3RoID8gJEVPRiA6IFN0cmluZ1dyYXBwZXIuY2hhckNvZGVBdCh0aGlzLmlucHV0LCB0aGlzLmluZGV4KTtcbiAgfVxuXG4gIHNjYW5Ub2tlbigpOiBUb2tlbiB7XG4gICAgdmFyIGlucHV0ID0gdGhpcy5pbnB1dCwgbGVuZ3RoID0gdGhpcy5sZW5ndGgsIHBlZWsgPSB0aGlzLnBlZWssIGluZGV4ID0gdGhpcy5pbmRleDtcblxuICAgIC8vIFNraXAgd2hpdGVzcGFjZS5cbiAgICB3aGlsZSAocGVlayA8PSAkU1BBQ0UpIHtcbiAgICAgIGlmICgrK2luZGV4ID49IGxlbmd0aCkge1xuICAgICAgICBwZWVrID0gJEVPRjtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwZWVrID0gU3RyaW5nV3JhcHBlci5jaGFyQ29kZUF0KGlucHV0LCBpbmRleCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5wZWVrID0gcGVlaztcbiAgICB0aGlzLmluZGV4ID0gaW5kZXg7XG5cbiAgICBpZiAoaW5kZXggPj0gbGVuZ3RoKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICAvLyBIYW5kbGUgaWRlbnRpZmllcnMgYW5kIG51bWJlcnMuXG4gICAgaWYgKGlzSWRlbnRpZmllclN0YXJ0KHBlZWspKSByZXR1cm4gdGhpcy5zY2FuSWRlbnRpZmllcigpO1xuICAgIGlmIChpc0RpZ2l0KHBlZWspKSByZXR1cm4gdGhpcy5zY2FuTnVtYmVyKGluZGV4KTtcblxuICAgIHZhciBzdGFydDogbnVtYmVyID0gaW5kZXg7XG4gICAgc3dpdGNoIChwZWVrKSB7XG4gICAgICBjYXNlICRQRVJJT0Q6XG4gICAgICAgIHRoaXMuYWR2YW5jZSgpO1xuICAgICAgICByZXR1cm4gaXNEaWdpdCh0aGlzLnBlZWspID8gdGhpcy5zY2FuTnVtYmVyKHN0YXJ0KSA6IG5ld0NoYXJhY3RlclRva2VuKHN0YXJ0LCAkUEVSSU9EKTtcbiAgICAgIGNhc2UgJExQQVJFTjpcbiAgICAgIGNhc2UgJFJQQVJFTjpcbiAgICAgIGNhc2UgJExCUkFDRTpcbiAgICAgIGNhc2UgJFJCUkFDRTpcbiAgICAgIGNhc2UgJExCUkFDS0VUOlxuICAgICAgY2FzZSAkUkJSQUNLRVQ6XG4gICAgICBjYXNlICRDT01NQTpcbiAgICAgIGNhc2UgJENPTE9OOlxuICAgICAgY2FzZSAkU0VNSUNPTE9OOlxuICAgICAgICByZXR1cm4gdGhpcy5zY2FuQ2hhcmFjdGVyKHN0YXJ0LCBwZWVrKTtcbiAgICAgIGNhc2UgJFNROlxuICAgICAgY2FzZSAkRFE6XG4gICAgICAgIHJldHVybiB0aGlzLnNjYW5TdHJpbmcoKTtcbiAgICAgIGNhc2UgJEhBU0g6XG4gICAgICBjYXNlICRQTFVTOlxuICAgICAgY2FzZSAkTUlOVVM6XG4gICAgICBjYXNlICRTVEFSOlxuICAgICAgY2FzZSAkU0xBU0g6XG4gICAgICBjYXNlICRQRVJDRU5UOlxuICAgICAgY2FzZSAkQ0FSRVQ6XG4gICAgICAgIHJldHVybiB0aGlzLnNjYW5PcGVyYXRvcihzdGFydCwgU3RyaW5nV3JhcHBlci5mcm9tQ2hhckNvZGUocGVlaykpO1xuICAgICAgY2FzZSAkUVVFU1RJT046XG4gICAgICAgIHJldHVybiB0aGlzLnNjYW5Db21wbGV4T3BlcmF0b3Ioc3RhcnQsICc/JywgJFBFUklPRCwgJy4nKTtcbiAgICAgIGNhc2UgJExUOlxuICAgICAgY2FzZSAkR1Q6XG4gICAgICAgIHJldHVybiB0aGlzLnNjYW5Db21wbGV4T3BlcmF0b3Ioc3RhcnQsIFN0cmluZ1dyYXBwZXIuZnJvbUNoYXJDb2RlKHBlZWspLCAkRVEsICc9Jyk7XG4gICAgICBjYXNlICRCQU5HOlxuICAgICAgY2FzZSAkRVE6XG4gICAgICAgIHJldHVybiB0aGlzLnNjYW5Db21wbGV4T3BlcmF0b3Ioc3RhcnQsIFN0cmluZ1dyYXBwZXIuZnJvbUNoYXJDb2RlKHBlZWspLCAkRVEsICc9JywgJEVRLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICc9Jyk7XG4gICAgICBjYXNlICRBTVBFUlNBTkQ6XG4gICAgICAgIHJldHVybiB0aGlzLnNjYW5Db21wbGV4T3BlcmF0b3Ioc3RhcnQsICcmJywgJEFNUEVSU0FORCwgJyYnKTtcbiAgICAgIGNhc2UgJEJBUjpcbiAgICAgICAgcmV0dXJuIHRoaXMuc2NhbkNvbXBsZXhPcGVyYXRvcihzdGFydCwgJ3wnLCAkQkFSLCAnfCcpO1xuICAgICAgY2FzZSAkTkJTUDpcbiAgICAgICAgd2hpbGUgKGlzV2hpdGVzcGFjZSh0aGlzLnBlZWspKSB0aGlzLmFkdmFuY2UoKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2NhblRva2VuKCk7XG4gICAgfVxuXG4gICAgdGhpcy5lcnJvcihgVW5leHBlY3RlZCBjaGFyYWN0ZXIgWyR7U3RyaW5nV3JhcHBlci5mcm9tQ2hhckNvZGUocGVlayl9XWAsIDApO1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgc2NhbkNoYXJhY3RlcihzdGFydDogbnVtYmVyLCBjb2RlOiBudW1iZXIpOiBUb2tlbiB7XG4gICAgdGhpcy5hZHZhbmNlKCk7XG4gICAgcmV0dXJuIG5ld0NoYXJhY3RlclRva2VuKHN0YXJ0LCBjb2RlKTtcbiAgfVxuXG5cbiAgc2Nhbk9wZXJhdG9yKHN0YXJ0OiBudW1iZXIsIHN0cjogc3RyaW5nKTogVG9rZW4ge1xuICAgIHRoaXMuYWR2YW5jZSgpO1xuICAgIHJldHVybiBuZXdPcGVyYXRvclRva2VuKHN0YXJ0LCBzdHIpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRva2VuaXplIGEgMi8zIGNoYXIgbG9uZyBvcGVyYXRvclxuICAgKlxuICAgKiBAcGFyYW0gc3RhcnQgc3RhcnQgaW5kZXggaW4gdGhlIGV4cHJlc3Npb25cbiAgICogQHBhcmFtIG9uZSBmaXJzdCBzeW1ib2wgKGFsd2F5cyBwYXJ0IG9mIHRoZSBvcGVyYXRvcilcbiAgICogQHBhcmFtIHR3b0NvZGUgY29kZSBwb2ludCBmb3IgdGhlIHNlY29uZCBzeW1ib2xcbiAgICogQHBhcmFtIHR3byBzZWNvbmQgc3ltYm9sIChwYXJ0IG9mIHRoZSBvcGVyYXRvciB3aGVuIHRoZSBzZWNvbmQgY29kZSBwb2ludCBtYXRjaGVzKVxuICAgKiBAcGFyYW0gdGhyZWVDb2RlIGNvZGUgcG9pbnQgZm9yIHRoZSB0aGlyZCBzeW1ib2xcbiAgICogQHBhcmFtIHRocmVlIHRoaXJkIHN5bWJvbCAocGFydCBvZiB0aGUgb3BlcmF0b3Igd2hlbiBwcm92aWRlZCBhbmQgbWF0Y2hlcyBzb3VyY2UgZXhwcmVzc2lvbilcbiAgICogQHJldHVybnMge1Rva2VufVxuICAgKi9cbiAgc2NhbkNvbXBsZXhPcGVyYXRvcihzdGFydDogbnVtYmVyLCBvbmU6IHN0cmluZywgdHdvQ29kZTogbnVtYmVyLCB0d286IHN0cmluZywgdGhyZWVDb2RlPzogbnVtYmVyLFxuICAgICAgICAgICAgICAgICAgICAgIHRocmVlPzogc3RyaW5nKTogVG9rZW4ge1xuICAgIHRoaXMuYWR2YW5jZSgpO1xuICAgIHZhciBzdHI6IHN0cmluZyA9IG9uZTtcbiAgICBpZiAodGhpcy5wZWVrID09IHR3b0NvZGUpIHtcbiAgICAgIHRoaXMuYWR2YW5jZSgpO1xuICAgICAgc3RyICs9IHR3bztcbiAgICB9XG4gICAgaWYgKGlzUHJlc2VudCh0aHJlZUNvZGUpICYmIHRoaXMucGVlayA9PSB0aHJlZUNvZGUpIHtcbiAgICAgIHRoaXMuYWR2YW5jZSgpO1xuICAgICAgc3RyICs9IHRocmVlO1xuICAgIH1cbiAgICByZXR1cm4gbmV3T3BlcmF0b3JUb2tlbihzdGFydCwgc3RyKTtcbiAgfVxuXG4gIHNjYW5JZGVudGlmaWVyKCk6IFRva2VuIHtcbiAgICB2YXIgc3RhcnQ6IG51bWJlciA9IHRoaXMuaW5kZXg7XG4gICAgdGhpcy5hZHZhbmNlKCk7XG4gICAgd2hpbGUgKGlzSWRlbnRpZmllclBhcnQodGhpcy5wZWVrKSkgdGhpcy5hZHZhbmNlKCk7XG4gICAgdmFyIHN0cjogc3RyaW5nID0gdGhpcy5pbnB1dC5zdWJzdHJpbmcoc3RhcnQsIHRoaXMuaW5kZXgpO1xuICAgIGlmIChTZXRXcmFwcGVyLmhhcyhLRVlXT1JEUywgc3RyKSkge1xuICAgICAgcmV0dXJuIG5ld0tleXdvcmRUb2tlbihzdGFydCwgc3RyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIG5ld0lkZW50aWZpZXJUb2tlbihzdGFydCwgc3RyKTtcbiAgICB9XG4gIH1cblxuICBzY2FuTnVtYmVyKHN0YXJ0OiBudW1iZXIpOiBUb2tlbiB7XG4gICAgdmFyIHNpbXBsZTogYm9vbGVhbiA9ICh0aGlzLmluZGV4ID09PSBzdGFydCk7XG4gICAgdGhpcy5hZHZhbmNlKCk7ICAvLyBTa2lwIGluaXRpYWwgZGlnaXQuXG4gICAgd2hpbGUgKHRydWUpIHtcbiAgICAgIGlmIChpc0RpZ2l0KHRoaXMucGVlaykpIHtcbiAgICAgICAgLy8gRG8gbm90aGluZy5cbiAgICAgIH0gZWxzZSBpZiAodGhpcy5wZWVrID09ICRQRVJJT0QpIHtcbiAgICAgICAgc2ltcGxlID0gZmFsc2U7XG4gICAgICB9IGVsc2UgaWYgKGlzRXhwb25lbnRTdGFydCh0aGlzLnBlZWspKSB7XG4gICAgICAgIHRoaXMuYWR2YW5jZSgpO1xuICAgICAgICBpZiAoaXNFeHBvbmVudFNpZ24odGhpcy5wZWVrKSkgdGhpcy5hZHZhbmNlKCk7XG4gICAgICAgIGlmICghaXNEaWdpdCh0aGlzLnBlZWspKSB0aGlzLmVycm9yKCdJbnZhbGlkIGV4cG9uZW50JywgLTEpO1xuICAgICAgICBzaW1wbGUgPSBmYWxzZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgdGhpcy5hZHZhbmNlKCk7XG4gICAgfVxuICAgIHZhciBzdHI6IHN0cmluZyA9IHRoaXMuaW5wdXQuc3Vic3RyaW5nKHN0YXJ0LCB0aGlzLmluZGV4KTtcbiAgICAvLyBUT0RPXG4gICAgdmFyIHZhbHVlOiBudW1iZXIgPVxuICAgICAgICBzaW1wbGUgPyBOdW1iZXJXcmFwcGVyLnBhcnNlSW50QXV0b1JhZGl4KHN0cikgOiBOdW1iZXJXcmFwcGVyLnBhcnNlRmxvYXQoc3RyKTtcbiAgICByZXR1cm4gbmV3TnVtYmVyVG9rZW4oc3RhcnQsIHZhbHVlKTtcbiAgfVxuXG4gIHNjYW5TdHJpbmcoKTogVG9rZW4ge1xuICAgIHZhciBzdGFydDogbnVtYmVyID0gdGhpcy5pbmRleDtcbiAgICB2YXIgcXVvdGU6IG51bWJlciA9IHRoaXMucGVlaztcbiAgICB0aGlzLmFkdmFuY2UoKTsgIC8vIFNraXAgaW5pdGlhbCBxdW90ZS5cblxuICAgIHZhciBidWZmZXI6IFN0cmluZ0pvaW5lcjtcbiAgICB2YXIgbWFya2VyOiBudW1iZXIgPSB0aGlzLmluZGV4O1xuICAgIHZhciBpbnB1dDogc3RyaW5nID0gdGhpcy5pbnB1dDtcblxuICAgIHdoaWxlICh0aGlzLnBlZWsgIT0gcXVvdGUpIHtcbiAgICAgIGlmICh0aGlzLnBlZWsgPT0gJEJBQ0tTTEFTSCkge1xuICAgICAgICBpZiAoYnVmZmVyID09IG51bGwpIGJ1ZmZlciA9IG5ldyBTdHJpbmdKb2luZXIoKTtcbiAgICAgICAgYnVmZmVyLmFkZChpbnB1dC5zdWJzdHJpbmcobWFya2VyLCB0aGlzLmluZGV4KSk7XG4gICAgICAgIHRoaXMuYWR2YW5jZSgpO1xuICAgICAgICB2YXIgdW5lc2NhcGVkQ29kZTogbnVtYmVyO1xuICAgICAgICBpZiAodGhpcy5wZWVrID09ICR1KSB7XG4gICAgICAgICAgLy8gNCBjaGFyYWN0ZXIgaGV4IGNvZGUgZm9yIHVuaWNvZGUgY2hhcmFjdGVyLlxuICAgICAgICAgIHZhciBoZXg6IHN0cmluZyA9IGlucHV0LnN1YnN0cmluZyh0aGlzLmluZGV4ICsgMSwgdGhpcy5pbmRleCArIDUpO1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICB1bmVzY2FwZWRDb2RlID0gTnVtYmVyV3JhcHBlci5wYXJzZUludChoZXgsIDE2KTtcbiAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICB0aGlzLmVycm9yKGBJbnZhbGlkIHVuaWNvZGUgZXNjYXBlIFtcXFxcdSR7aGV4fV1gLCAwKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZm9yICh2YXIgaTogbnVtYmVyID0gMDsgaSA8IDU7IGkrKykge1xuICAgICAgICAgICAgdGhpcy5hZHZhbmNlKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHVuZXNjYXBlZENvZGUgPSB1bmVzY2FwZSh0aGlzLnBlZWspO1xuICAgICAgICAgIHRoaXMuYWR2YW5jZSgpO1xuICAgICAgICB9XG4gICAgICAgIGJ1ZmZlci5hZGQoU3RyaW5nV3JhcHBlci5mcm9tQ2hhckNvZGUodW5lc2NhcGVkQ29kZSkpO1xuICAgICAgICBtYXJrZXIgPSB0aGlzLmluZGV4O1xuICAgICAgfSBlbHNlIGlmICh0aGlzLnBlZWsgPT0gJEVPRikge1xuICAgICAgICB0aGlzLmVycm9yKCdVbnRlcm1pbmF0ZWQgcXVvdGUnLCAwKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuYWR2YW5jZSgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHZhciBsYXN0OiBzdHJpbmcgPSBpbnB1dC5zdWJzdHJpbmcobWFya2VyLCB0aGlzLmluZGV4KTtcbiAgICB0aGlzLmFkdmFuY2UoKTsgIC8vIFNraXAgdGVybWluYXRpbmcgcXVvdGUuXG5cbiAgICAvLyBDb21wdXRlIHRoZSB1bmVzY2FwZWQgc3RyaW5nIHZhbHVlLlxuICAgIHZhciB1bmVzY2FwZWQ6IHN0cmluZyA9IGxhc3Q7XG4gICAgaWYgKGJ1ZmZlciAhPSBudWxsKSB7XG4gICAgICBidWZmZXIuYWRkKGxhc3QpO1xuICAgICAgdW5lc2NhcGVkID0gYnVmZmVyLnRvU3RyaW5nKCk7XG4gICAgfVxuICAgIHJldHVybiBuZXdTdHJpbmdUb2tlbihzdGFydCwgdW5lc2NhcGVkKTtcbiAgfVxuXG4gIGVycm9yKG1lc3NhZ2U6IHN0cmluZywgb2Zmc2V0OiBudW1iZXIpIHtcbiAgICB2YXIgcG9zaXRpb246IG51bWJlciA9IHRoaXMuaW5kZXggKyBvZmZzZXQ7XG4gICAgdGhyb3cgbmV3IFNjYW5uZXJFcnJvcihcbiAgICAgICAgYExleGVyIEVycm9yOiAke21lc3NhZ2V9IGF0IGNvbHVtbiAke3Bvc2l0aW9ufSBpbiBleHByZXNzaW9uIFske3RoaXMuaW5wdXR9XWApO1xuICB9XG59XG5cbmZ1bmN0aW9uIGlzV2hpdGVzcGFjZShjb2RlOiBudW1iZXIpOiBib29sZWFuIHtcbiAgcmV0dXJuIChjb2RlID49ICRUQUIgJiYgY29kZSA8PSAkU1BBQ0UpIHx8IChjb2RlID09ICROQlNQKTtcbn1cblxuZnVuY3Rpb24gaXNJZGVudGlmaWVyU3RhcnQoY29kZTogbnVtYmVyKTogYm9vbGVhbiB7XG4gIHJldHVybiAoJGEgPD0gY29kZSAmJiBjb2RlIDw9ICR6KSB8fCAoJEEgPD0gY29kZSAmJiBjb2RlIDw9ICRaKSB8fCAoY29kZSA9PSAkXykgfHwgKGNvZGUgPT0gJCQpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNJZGVudGlmaWVyKGlucHV0OiBzdHJpbmcpOiBib29sZWFuIHtcbiAgaWYgKGlucHV0Lmxlbmd0aCA9PSAwKSByZXR1cm4gZmFsc2U7XG4gIHZhciBzY2FubmVyID0gbmV3IF9TY2FubmVyKGlucHV0KTtcbiAgaWYgKCFpc0lkZW50aWZpZXJTdGFydChzY2FubmVyLnBlZWspKSByZXR1cm4gZmFsc2U7XG4gIHNjYW5uZXIuYWR2YW5jZSgpO1xuICB3aGlsZSAoc2Nhbm5lci5wZWVrICE9PSAkRU9GKSB7XG4gICAgaWYgKCFpc0lkZW50aWZpZXJQYXJ0KHNjYW5uZXIucGVlaykpIHJldHVybiBmYWxzZTtcbiAgICBzY2FubmVyLmFkdmFuY2UoKTtcbiAgfVxuICByZXR1cm4gdHJ1ZTtcbn1cblxuZnVuY3Rpb24gaXNJZGVudGlmaWVyUGFydChjb2RlOiBudW1iZXIpOiBib29sZWFuIHtcbiAgcmV0dXJuICgkYSA8PSBjb2RlICYmIGNvZGUgPD0gJHopIHx8ICgkQSA8PSBjb2RlICYmIGNvZGUgPD0gJFopIHx8ICgkMCA8PSBjb2RlICYmIGNvZGUgPD0gJDkpIHx8XG4gICAgICAgICAoY29kZSA9PSAkXykgfHwgKGNvZGUgPT0gJCQpO1xufVxuXG5mdW5jdGlvbiBpc0RpZ2l0KGNvZGU6IG51bWJlcik6IGJvb2xlYW4ge1xuICByZXR1cm4gJDAgPD0gY29kZSAmJiBjb2RlIDw9ICQ5O1xufVxuXG5mdW5jdGlvbiBpc0V4cG9uZW50U3RhcnQoY29kZTogbnVtYmVyKTogYm9vbGVhbiB7XG4gIHJldHVybiBjb2RlID09ICRlIHx8IGNvZGUgPT0gJEU7XG59XG5cbmZ1bmN0aW9uIGlzRXhwb25lbnRTaWduKGNvZGU6IG51bWJlcik6IGJvb2xlYW4ge1xuICByZXR1cm4gY29kZSA9PSAkTUlOVVMgfHwgY29kZSA9PSAkUExVUztcbn1cblxuZnVuY3Rpb24gdW5lc2NhcGUoY29kZTogbnVtYmVyKTogbnVtYmVyIHtcbiAgc3dpdGNoIChjb2RlKSB7XG4gICAgY2FzZSAkbjpcbiAgICAgIHJldHVybiAkTEY7XG4gICAgY2FzZSAkZjpcbiAgICAgIHJldHVybiAkRkY7XG4gICAgY2FzZSAkcjpcbiAgICAgIHJldHVybiAkQ1I7XG4gICAgY2FzZSAkdDpcbiAgICAgIHJldHVybiAkVEFCO1xuICAgIGNhc2UgJHY6XG4gICAgICByZXR1cm4gJFZUQUI7XG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiBjb2RlO1xuICB9XG59XG5cbnZhciBPUEVSQVRPUlMgPSBTZXRXcmFwcGVyLmNyZWF0ZUZyb21MaXN0KFtcbiAgJysnLFxuICAnLScsXG4gICcqJyxcbiAgJy8nLFxuICAnJScsXG4gICdeJyxcbiAgJz0nLFxuICAnPT0nLFxuICAnIT0nLFxuICAnPT09JyxcbiAgJyE9PScsXG4gICc8JyxcbiAgJz4nLFxuICAnPD0nLFxuICAnPj0nLFxuICAnJiYnLFxuICAnfHwnLFxuICAnJicsXG4gICd8JyxcbiAgJyEnLFxuICAnPycsXG4gICcjJyxcbiAgJz8uJ1xuXSk7XG5cblxudmFyIEtFWVdPUkRTID1cbiAgICBTZXRXcmFwcGVyLmNyZWF0ZUZyb21MaXN0KFsndmFyJywgJ251bGwnLCAndW5kZWZpbmVkJywgJ3RydWUnLCAnZmFsc2UnLCAnaWYnLCAnZWxzZSddKTtcbiJdfQ==