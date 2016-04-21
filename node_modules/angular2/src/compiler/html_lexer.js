'use strict';"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var lang_1 = require('angular2/src/facade/lang');
var collection_1 = require('angular2/src/facade/collection');
var parse_util_1 = require('./parse_util');
var html_tags_1 = require('./html_tags');
(function (HtmlTokenType) {
    HtmlTokenType[HtmlTokenType["TAG_OPEN_START"] = 0] = "TAG_OPEN_START";
    HtmlTokenType[HtmlTokenType["TAG_OPEN_END"] = 1] = "TAG_OPEN_END";
    HtmlTokenType[HtmlTokenType["TAG_OPEN_END_VOID"] = 2] = "TAG_OPEN_END_VOID";
    HtmlTokenType[HtmlTokenType["TAG_CLOSE"] = 3] = "TAG_CLOSE";
    HtmlTokenType[HtmlTokenType["TEXT"] = 4] = "TEXT";
    HtmlTokenType[HtmlTokenType["ESCAPABLE_RAW_TEXT"] = 5] = "ESCAPABLE_RAW_TEXT";
    HtmlTokenType[HtmlTokenType["RAW_TEXT"] = 6] = "RAW_TEXT";
    HtmlTokenType[HtmlTokenType["COMMENT_START"] = 7] = "COMMENT_START";
    HtmlTokenType[HtmlTokenType["COMMENT_END"] = 8] = "COMMENT_END";
    HtmlTokenType[HtmlTokenType["CDATA_START"] = 9] = "CDATA_START";
    HtmlTokenType[HtmlTokenType["CDATA_END"] = 10] = "CDATA_END";
    HtmlTokenType[HtmlTokenType["ATTR_NAME"] = 11] = "ATTR_NAME";
    HtmlTokenType[HtmlTokenType["ATTR_VALUE"] = 12] = "ATTR_VALUE";
    HtmlTokenType[HtmlTokenType["DOC_TYPE"] = 13] = "DOC_TYPE";
    HtmlTokenType[HtmlTokenType["EOF"] = 14] = "EOF";
})(exports.HtmlTokenType || (exports.HtmlTokenType = {}));
var HtmlTokenType = exports.HtmlTokenType;
var HtmlToken = (function () {
    function HtmlToken(type, parts, sourceSpan) {
        this.type = type;
        this.parts = parts;
        this.sourceSpan = sourceSpan;
    }
    return HtmlToken;
}());
exports.HtmlToken = HtmlToken;
var HtmlTokenError = (function (_super) {
    __extends(HtmlTokenError, _super);
    function HtmlTokenError(errorMsg, tokenType, span) {
        _super.call(this, span, errorMsg);
        this.tokenType = tokenType;
    }
    return HtmlTokenError;
}(parse_util_1.ParseError));
exports.HtmlTokenError = HtmlTokenError;
var HtmlTokenizeResult = (function () {
    function HtmlTokenizeResult(tokens, errors) {
        this.tokens = tokens;
        this.errors = errors;
    }
    return HtmlTokenizeResult;
}());
exports.HtmlTokenizeResult = HtmlTokenizeResult;
function tokenizeHtml(sourceContent, sourceUrl) {
    return new _HtmlTokenizer(new parse_util_1.ParseSourceFile(sourceContent, sourceUrl)).tokenize();
}
exports.tokenizeHtml = tokenizeHtml;
var $EOF = 0;
var $TAB = 9;
var $LF = 10;
var $FF = 12;
var $CR = 13;
var $SPACE = 32;
var $BANG = 33;
var $DQ = 34;
var $HASH = 35;
var $$ = 36;
var $AMPERSAND = 38;
var $SQ = 39;
var $MINUS = 45;
var $SLASH = 47;
var $0 = 48;
var $SEMICOLON = 59;
var $9 = 57;
var $COLON = 58;
var $LT = 60;
var $EQ = 61;
var $GT = 62;
var $QUESTION = 63;
var $LBRACKET = 91;
var $RBRACKET = 93;
var $A = 65;
var $F = 70;
var $X = 88;
var $Z = 90;
var $a = 97;
var $f = 102;
var $z = 122;
var $x = 120;
var $NBSP = 160;
var CR_OR_CRLF_REGEXP = /\r\n?/g;
function unexpectedCharacterErrorMsg(charCode) {
    var char = charCode === $EOF ? 'EOF' : lang_1.StringWrapper.fromCharCode(charCode);
    return "Unexpected character \"" + char + "\"";
}
function unknownEntityErrorMsg(entitySrc) {
    return "Unknown entity \"" + entitySrc + "\" - use the \"&#<decimal>;\" or  \"&#x<hex>;\" syntax";
}
var ControlFlowError = (function () {
    function ControlFlowError(error) {
        this.error = error;
    }
    return ControlFlowError;
}());
// See http://www.w3.org/TR/html51/syntax.html#writing
var _HtmlTokenizer = (function () {
    function _HtmlTokenizer(file) {
        this.file = file;
        // Note: this is always lowercase!
        this.peek = -1;
        this.index = -1;
        this.line = 0;
        this.column = -1;
        this.tokens = [];
        this.errors = [];
        this.input = file.content;
        this.length = file.content.length;
        this._advance();
    }
    _HtmlTokenizer.prototype._processCarriageReturns = function (content) {
        // http://www.w3.org/TR/html5/syntax.html#preprocessing-the-input-stream
        // In order to keep the original position in the source, we can not
        // pre-process it.
        // Instead CRs are processed right before instantiating the tokens.
        return lang_1.StringWrapper.replaceAll(content, CR_OR_CRLF_REGEXP, '\n');
    };
    _HtmlTokenizer.prototype.tokenize = function () {
        while (this.peek !== $EOF) {
            var start = this._getLocation();
            try {
                if (this._attemptCharCode($LT)) {
                    if (this._attemptCharCode($BANG)) {
                        if (this._attemptCharCode($LBRACKET)) {
                            this._consumeCdata(start);
                        }
                        else if (this._attemptCharCode($MINUS)) {
                            this._consumeComment(start);
                        }
                        else {
                            this._consumeDocType(start);
                        }
                    }
                    else if (this._attemptCharCode($SLASH)) {
                        this._consumeTagClose(start);
                    }
                    else {
                        this._consumeTagOpen(start);
                    }
                }
                else {
                    this._consumeText();
                }
            }
            catch (e) {
                if (e instanceof ControlFlowError) {
                    this.errors.push(e.error);
                }
                else {
                    throw e;
                }
            }
        }
        this._beginToken(HtmlTokenType.EOF);
        this._endToken([]);
        return new HtmlTokenizeResult(mergeTextTokens(this.tokens), this.errors);
    };
    _HtmlTokenizer.prototype._getLocation = function () {
        return new parse_util_1.ParseLocation(this.file, this.index, this.line, this.column);
    };
    _HtmlTokenizer.prototype._getSpan = function (start, end) {
        if (lang_1.isBlank(start)) {
            start = this._getLocation();
        }
        if (lang_1.isBlank(end)) {
            end = this._getLocation();
        }
        return new parse_util_1.ParseSourceSpan(start, end);
    };
    _HtmlTokenizer.prototype._beginToken = function (type, start) {
        if (start === void 0) { start = null; }
        if (lang_1.isBlank(start)) {
            start = this._getLocation();
        }
        this.currentTokenStart = start;
        this.currentTokenType = type;
    };
    _HtmlTokenizer.prototype._endToken = function (parts, end) {
        if (end === void 0) { end = null; }
        if (lang_1.isBlank(end)) {
            end = this._getLocation();
        }
        var token = new HtmlToken(this.currentTokenType, parts, new parse_util_1.ParseSourceSpan(this.currentTokenStart, end));
        this.tokens.push(token);
        this.currentTokenStart = null;
        this.currentTokenType = null;
        return token;
    };
    _HtmlTokenizer.prototype._createError = function (msg, span) {
        var error = new HtmlTokenError(msg, this.currentTokenType, span);
        this.currentTokenStart = null;
        this.currentTokenType = null;
        return new ControlFlowError(error);
    };
    _HtmlTokenizer.prototype._advance = function () {
        if (this.index >= this.length) {
            throw this._createError(unexpectedCharacterErrorMsg($EOF), this._getSpan());
        }
        if (this.peek === $LF) {
            this.line++;
            this.column = 0;
        }
        else if (this.peek !== $LF && this.peek !== $CR) {
            this.column++;
        }
        this.index++;
        this.peek = this.index >= this.length ? $EOF : lang_1.StringWrapper.charCodeAt(this.input, this.index);
    };
    _HtmlTokenizer.prototype._attemptCharCode = function (charCode) {
        if (this.peek === charCode) {
            this._advance();
            return true;
        }
        return false;
    };
    _HtmlTokenizer.prototype._attemptCharCodeCaseInsensitive = function (charCode) {
        if (compareCharCodeCaseInsensitive(this.peek, charCode)) {
            this._advance();
            return true;
        }
        return false;
    };
    _HtmlTokenizer.prototype._requireCharCode = function (charCode) {
        var location = this._getLocation();
        if (!this._attemptCharCode(charCode)) {
            throw this._createError(unexpectedCharacterErrorMsg(this.peek), this._getSpan(location, location));
        }
    };
    _HtmlTokenizer.prototype._attemptStr = function (chars) {
        for (var i = 0; i < chars.length; i++) {
            if (!this._attemptCharCode(lang_1.StringWrapper.charCodeAt(chars, i))) {
                return false;
            }
        }
        return true;
    };
    _HtmlTokenizer.prototype._attemptStrCaseInsensitive = function (chars) {
        for (var i = 0; i < chars.length; i++) {
            if (!this._attemptCharCodeCaseInsensitive(lang_1.StringWrapper.charCodeAt(chars, i))) {
                return false;
            }
        }
        return true;
    };
    _HtmlTokenizer.prototype._requireStr = function (chars) {
        var location = this._getLocation();
        if (!this._attemptStr(chars)) {
            throw this._createError(unexpectedCharacterErrorMsg(this.peek), this._getSpan(location));
        }
    };
    _HtmlTokenizer.prototype._attemptCharCodeUntilFn = function (predicate) {
        while (!predicate(this.peek)) {
            this._advance();
        }
    };
    _HtmlTokenizer.prototype._requireCharCodeUntilFn = function (predicate, len) {
        var start = this._getLocation();
        this._attemptCharCodeUntilFn(predicate);
        if (this.index - start.offset < len) {
            throw this._createError(unexpectedCharacterErrorMsg(this.peek), this._getSpan(start, start));
        }
    };
    _HtmlTokenizer.prototype._attemptUntilChar = function (char) {
        while (this.peek !== char) {
            this._advance();
        }
    };
    _HtmlTokenizer.prototype._readChar = function (decodeEntities) {
        if (decodeEntities && this.peek === $AMPERSAND) {
            return this._decodeEntity();
        }
        else {
            var index = this.index;
            this._advance();
            return this.input[index];
        }
    };
    _HtmlTokenizer.prototype._decodeEntity = function () {
        var start = this._getLocation();
        this._advance();
        if (this._attemptCharCode($HASH)) {
            var isHex = this._attemptCharCode($x) || this._attemptCharCode($X);
            var numberStart = this._getLocation().offset;
            this._attemptCharCodeUntilFn(isDigitEntityEnd);
            if (this.peek != $SEMICOLON) {
                throw this._createError(unexpectedCharacterErrorMsg(this.peek), this._getSpan());
            }
            this._advance();
            var strNum = this.input.substring(numberStart, this.index - 1);
            try {
                var charCode = lang_1.NumberWrapper.parseInt(strNum, isHex ? 16 : 10);
                return lang_1.StringWrapper.fromCharCode(charCode);
            }
            catch (e) {
                var entity = this.input.substring(start.offset + 1, this.index - 1);
                throw this._createError(unknownEntityErrorMsg(entity), this._getSpan(start));
            }
        }
        else {
            var startPosition = this._savePosition();
            this._attemptCharCodeUntilFn(isNamedEntityEnd);
            if (this.peek != $SEMICOLON) {
                this._restorePosition(startPosition);
                return '&';
            }
            this._advance();
            var name_1 = this.input.substring(start.offset + 1, this.index - 1);
            var char = html_tags_1.NAMED_ENTITIES[name_1];
            if (lang_1.isBlank(char)) {
                throw this._createError(unknownEntityErrorMsg(name_1), this._getSpan(start));
            }
            return char;
        }
    };
    _HtmlTokenizer.prototype._consumeRawText = function (decodeEntities, firstCharOfEnd, attemptEndRest) {
        var tagCloseStart;
        var textStart = this._getLocation();
        this._beginToken(decodeEntities ? HtmlTokenType.ESCAPABLE_RAW_TEXT : HtmlTokenType.RAW_TEXT, textStart);
        var parts = [];
        while (true) {
            tagCloseStart = this._getLocation();
            if (this._attemptCharCode(firstCharOfEnd) && attemptEndRest()) {
                break;
            }
            if (this.index > tagCloseStart.offset) {
                parts.push(this.input.substring(tagCloseStart.offset, this.index));
            }
            while (this.peek !== firstCharOfEnd) {
                parts.push(this._readChar(decodeEntities));
            }
        }
        return this._endToken([this._processCarriageReturns(parts.join(''))], tagCloseStart);
    };
    _HtmlTokenizer.prototype._consumeComment = function (start) {
        var _this = this;
        this._beginToken(HtmlTokenType.COMMENT_START, start);
        this._requireCharCode($MINUS);
        this._endToken([]);
        var textToken = this._consumeRawText(false, $MINUS, function () { return _this._attemptStr('->'); });
        this._beginToken(HtmlTokenType.COMMENT_END, textToken.sourceSpan.end);
        this._endToken([]);
    };
    _HtmlTokenizer.prototype._consumeCdata = function (start) {
        var _this = this;
        this._beginToken(HtmlTokenType.CDATA_START, start);
        this._requireStr('CDATA[');
        this._endToken([]);
        var textToken = this._consumeRawText(false, $RBRACKET, function () { return _this._attemptStr(']>'); });
        this._beginToken(HtmlTokenType.CDATA_END, textToken.sourceSpan.end);
        this._endToken([]);
    };
    _HtmlTokenizer.prototype._consumeDocType = function (start) {
        this._beginToken(HtmlTokenType.DOC_TYPE, start);
        this._attemptUntilChar($GT);
        this._advance();
        this._endToken([this.input.substring(start.offset + 2, this.index - 1)]);
    };
    _HtmlTokenizer.prototype._consumePrefixAndName = function () {
        var nameOrPrefixStart = this.index;
        var prefix = null;
        while (this.peek !== $COLON && !isPrefixEnd(this.peek)) {
            this._advance();
        }
        var nameStart;
        if (this.peek === $COLON) {
            this._advance();
            prefix = this.input.substring(nameOrPrefixStart, this.index - 1);
            nameStart = this.index;
        }
        else {
            nameStart = nameOrPrefixStart;
        }
        this._requireCharCodeUntilFn(isNameEnd, this.index === nameStart ? 1 : 0);
        var name = this.input.substring(nameStart, this.index);
        return [prefix, name];
    };
    _HtmlTokenizer.prototype._consumeTagOpen = function (start) {
        var savedPos = this._savePosition();
        var lowercaseTagName;
        try {
            if (!isAsciiLetter(this.peek)) {
                throw this._createError(unexpectedCharacterErrorMsg(this.peek), this._getSpan());
            }
            var nameStart = this.index;
            this._consumeTagOpenStart(start);
            lowercaseTagName = this.input.substring(nameStart, this.index).toLowerCase();
            this._attemptCharCodeUntilFn(isNotWhitespace);
            while (this.peek !== $SLASH && this.peek !== $GT) {
                this._consumeAttributeName();
                this._attemptCharCodeUntilFn(isNotWhitespace);
                if (this._attemptCharCode($EQ)) {
                    this._attemptCharCodeUntilFn(isNotWhitespace);
                    this._consumeAttributeValue();
                }
                this._attemptCharCodeUntilFn(isNotWhitespace);
            }
            this._consumeTagOpenEnd();
        }
        catch (e) {
            if (e instanceof ControlFlowError) {
                // When the start tag is invalid, assume we want a "<"
                this._restorePosition(savedPos);
                // Back to back text tokens are merged at the end
                this._beginToken(HtmlTokenType.TEXT, start);
                this._endToken(['<']);
                return;
            }
            throw e;
        }
        var contentTokenType = html_tags_1.getHtmlTagDefinition(lowercaseTagName).contentType;
        if (contentTokenType === html_tags_1.HtmlTagContentType.RAW_TEXT) {
            this._consumeRawTextWithTagClose(lowercaseTagName, false);
        }
        else if (contentTokenType === html_tags_1.HtmlTagContentType.ESCAPABLE_RAW_TEXT) {
            this._consumeRawTextWithTagClose(lowercaseTagName, true);
        }
    };
    _HtmlTokenizer.prototype._consumeRawTextWithTagClose = function (lowercaseTagName, decodeEntities) {
        var _this = this;
        var textToken = this._consumeRawText(decodeEntities, $LT, function () {
            if (!_this._attemptCharCode($SLASH))
                return false;
            _this._attemptCharCodeUntilFn(isNotWhitespace);
            if (!_this._attemptStrCaseInsensitive(lowercaseTagName))
                return false;
            _this._attemptCharCodeUntilFn(isNotWhitespace);
            if (!_this._attemptCharCode($GT))
                return false;
            return true;
        });
        this._beginToken(HtmlTokenType.TAG_CLOSE, textToken.sourceSpan.end);
        this._endToken([null, lowercaseTagName]);
    };
    _HtmlTokenizer.prototype._consumeTagOpenStart = function (start) {
        this._beginToken(HtmlTokenType.TAG_OPEN_START, start);
        var parts = this._consumePrefixAndName();
        this._endToken(parts);
    };
    _HtmlTokenizer.prototype._consumeAttributeName = function () {
        this._beginToken(HtmlTokenType.ATTR_NAME);
        var prefixAndName = this._consumePrefixAndName();
        this._endToken(prefixAndName);
    };
    _HtmlTokenizer.prototype._consumeAttributeValue = function () {
        this._beginToken(HtmlTokenType.ATTR_VALUE);
        var value;
        if (this.peek === $SQ || this.peek === $DQ) {
            var quoteChar = this.peek;
            this._advance();
            var parts = [];
            while (this.peek !== quoteChar) {
                parts.push(this._readChar(true));
            }
            value = parts.join('');
            this._advance();
        }
        else {
            var valueStart = this.index;
            this._requireCharCodeUntilFn(isNameEnd, 1);
            value = this.input.substring(valueStart, this.index);
        }
        this._endToken([this._processCarriageReturns(value)]);
    };
    _HtmlTokenizer.prototype._consumeTagOpenEnd = function () {
        var tokenType = this._attemptCharCode($SLASH) ? HtmlTokenType.TAG_OPEN_END_VOID :
            HtmlTokenType.TAG_OPEN_END;
        this._beginToken(tokenType);
        this._requireCharCode($GT);
        this._endToken([]);
    };
    _HtmlTokenizer.prototype._consumeTagClose = function (start) {
        this._beginToken(HtmlTokenType.TAG_CLOSE, start);
        this._attemptCharCodeUntilFn(isNotWhitespace);
        var prefixAndName;
        prefixAndName = this._consumePrefixAndName();
        this._attemptCharCodeUntilFn(isNotWhitespace);
        this._requireCharCode($GT);
        this._endToken(prefixAndName);
    };
    _HtmlTokenizer.prototype._consumeText = function () {
        var start = this._getLocation();
        this._beginToken(HtmlTokenType.TEXT, start);
        var parts = [this._readChar(true)];
        while (!isTextEnd(this.peek)) {
            parts.push(this._readChar(true));
        }
        this._endToken([this._processCarriageReturns(parts.join(''))]);
    };
    _HtmlTokenizer.prototype._savePosition = function () {
        return [this.peek, this.index, this.column, this.line, this.tokens.length];
    };
    _HtmlTokenizer.prototype._restorePosition = function (position) {
        this.peek = position[0];
        this.index = position[1];
        this.column = position[2];
        this.line = position[3];
        var nbTokens = position[4];
        if (nbTokens < this.tokens.length) {
            // remove any extra tokens
            this.tokens = collection_1.ListWrapper.slice(this.tokens, 0, nbTokens);
        }
    };
    return _HtmlTokenizer;
}());
function isNotWhitespace(code) {
    return !isWhitespace(code) || code === $EOF;
}
function isWhitespace(code) {
    return (code >= $TAB && code <= $SPACE) || (code === $NBSP);
}
function isNameEnd(code) {
    return isWhitespace(code) || code === $GT || code === $SLASH || code === $SQ || code === $DQ ||
        code === $EQ;
}
function isPrefixEnd(code) {
    return (code < $a || $z < code) && (code < $A || $Z < code) && (code < $0 || code > $9);
}
function isDigitEntityEnd(code) {
    return code == $SEMICOLON || code == $EOF || !isAsciiHexDigit(code);
}
function isNamedEntityEnd(code) {
    return code == $SEMICOLON || code == $EOF || !isAsciiLetter(code);
}
function isTextEnd(code) {
    return code === $LT || code === $EOF;
}
function isAsciiLetter(code) {
    return code >= $a && code <= $z || code >= $A && code <= $Z;
}
function isAsciiHexDigit(code) {
    return code >= $a && code <= $f || code >= $A && code <= $F || code >= $0 && code <= $9;
}
function compareCharCodeCaseInsensitive(code1, code2) {
    return toUpperCaseCharCode(code1) == toUpperCaseCharCode(code2);
}
function toUpperCaseCharCode(code) {
    return code >= $a && code <= $z ? code - $a + $A : code;
}
function mergeTextTokens(srcTokens) {
    var dstTokens = [];
    var lastDstToken;
    for (var i = 0; i < srcTokens.length; i++) {
        var token = srcTokens[i];
        if (lang_1.isPresent(lastDstToken) && lastDstToken.type == HtmlTokenType.TEXT &&
            token.type == HtmlTokenType.TEXT) {
            lastDstToken.parts[0] += token.parts[0];
            lastDstToken.sourceSpan.end = token.sourceSpan.end;
        }
        else {
            lastDstToken = token;
            dstTokens.push(lastDstToken);
        }
    }
    return dstTokens;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaHRtbF9sZXhlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRpZmZpbmdfcGx1Z2luX3dyYXBwZXItb3V0cHV0X3BhdGgtamFrWG5NbUwudG1wL2FuZ3VsYXIyL3NyYy9jb21waWxlci9odG1sX2xleGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLHFCQU9PLDBCQUEwQixDQUFDLENBQUE7QUFDbEMsMkJBQTBCLGdDQUFnQyxDQUFDLENBQUE7QUFDM0QsMkJBQTBFLGNBQWMsQ0FBQyxDQUFBO0FBQ3pGLDBCQUF1RSxhQUFhLENBQUMsQ0FBQTtBQUVyRixXQUFZLGFBQWE7SUFDdkIscUVBQWMsQ0FBQTtJQUNkLGlFQUFZLENBQUE7SUFDWiwyRUFBaUIsQ0FBQTtJQUNqQiwyREFBUyxDQUFBO0lBQ1QsaURBQUksQ0FBQTtJQUNKLDZFQUFrQixDQUFBO0lBQ2xCLHlEQUFRLENBQUE7SUFDUixtRUFBYSxDQUFBO0lBQ2IsK0RBQVcsQ0FBQTtJQUNYLCtEQUFXLENBQUE7SUFDWCw0REFBUyxDQUFBO0lBQ1QsNERBQVMsQ0FBQTtJQUNULDhEQUFVLENBQUE7SUFDViwwREFBUSxDQUFBO0lBQ1IsZ0RBQUcsQ0FBQTtBQUNMLENBQUMsRUFoQlcscUJBQWEsS0FBYixxQkFBYSxRQWdCeEI7QUFoQkQsSUFBWSxhQUFhLEdBQWIscUJBZ0JYLENBQUE7QUFFRDtJQUNFLG1CQUFtQixJQUFtQixFQUFTLEtBQWUsRUFDM0MsVUFBMkI7UUFEM0IsU0FBSSxHQUFKLElBQUksQ0FBZTtRQUFTLFVBQUssR0FBTCxLQUFLLENBQVU7UUFDM0MsZUFBVSxHQUFWLFVBQVUsQ0FBaUI7SUFBRyxDQUFDO0lBQ3BELGdCQUFDO0FBQUQsQ0FBQyxBQUhELElBR0M7QUFIWSxpQkFBUyxZQUdyQixDQUFBO0FBRUQ7SUFBb0Msa0NBQVU7SUFDNUMsd0JBQVksUUFBZ0IsRUFBUyxTQUF3QixFQUFFLElBQXFCO1FBQ2xGLGtCQUFNLElBQUksRUFBRSxRQUFRLENB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QUFDLENBQUMsQ0FBQztZQUN4QyxZQUFZLENBQUMsVUFBVSxDQUFDLEdBQUcsR0FBRyxLQUFLLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQztRQUNyRCxDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDTixZQUFZLEdBQUcsS0FBSyxDQUFDO1lBQ3JCLFNBQVMsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDL0IsQ0FBQztJQUNILENBQUM7SUFFRCxNQUFNLENBQUMsU0FBUyxDQUFDO0FBQ25CLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBTdHJpbmdXcmFwcGVyLFxuICBOdW1iZXJXcmFwcGVyLFxuICBpc1ByZXNlbnQsXG4gIGlzQmxhbmssXG4gIENPTlNUX0VYUFIsXG4gIHNlcmlhbGl6ZUVudW1cbn0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9sYW5nJztcbmltcG9ydCB7TGlzdFdyYXBwZXJ9IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvY29sbGVjdGlvbic7XG5pbXBvcnQge1BhcnNlTG9jYXRpb24sIFBhcnNlRXJyb3IsIFBhcnNlU291cmNlRmlsZSwgUGFyc2VTb3VyY2VTcGFufSBmcm9tICcuL3BhcnNlX3V0aWwnO1xuaW1wb3J0IHtnZXRIdG1sVGFnRGVmaW5pdGlvbiwgSHRtbFRhZ0NvbnRlbnRUeXBlLCBOQU1FRF9FTlRJVElFU30gZnJvbSAnLi9odG1sX3RhZ3MnO1xuXG5leHBvcnQgZW51bSBIdG1sVG9rZW5UeXBlIHtcbiAgVEFHX09QRU5fU1RBUlQsXG4gIFRBR19PUEVOX0VORCxcbiAgVEFHX09QRU5fRU5EX1ZPSUQsXG4gIFRBR19DTE9TRSxcbiAgVEVYVCxcbiAgRVNDQVBBQkxFX1JBV19URVhULFxuICBSQVdfVEVYVCxcbiAgQ09NTUVOVF9TVEFSVCxcbiAgQ09NTUVOVF9FTkQsXG4gIENEQVRBX1NUQVJULFxuICBDREFUQV9FTkQsXG4gIEFUVFJfTkFNRSxcbiAgQVRUUl9WQUxVRSxcbiAgRE9DX1RZUEUsXG4gIEVPRlxufVxuXG5leHBvcnQgY2xhc3MgSHRtbFRva2VuIHtcbiAgY29uc3RydWN0b3IocHVibGljIHR5cGU6IEh0bWxUb2tlblR5cGUsIHB1YmxpYyBwYXJ0czogc3RyaW5nW10sXG4gICAgICAgICAgICAgIHB1YmxpYyBzb3VyY2VTcGFuOiBQYXJzZVNvdXJjZVNwYW4pIHt9XG59XG5cbmV4cG9ydCBjbGFzcyBIdG1sVG9rZW5FcnJvciBleHRlbmRzIFBhcnNlRXJyb3Ige1xuICBjb25zdHJ1Y3RvcihlcnJvck1zZzogc3RyaW5nLCBwdWJsaWMgdG9rZW5UeXBlOiBIdG1sVG9rZW5UeXBlLCBzcGFuOiBQYXJzZVNvdXJjZVNwYW4pIHtcbiAgICBzdXBlcihzcGFuLCBlcnJvck1zZyk7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIEh0bWxUb2tlbml6ZVJlc3VsdCB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyB0b2tlbnM6IEh0bWxUb2tlbltdLCBwdWJsaWMgZXJyb3JzOiBIdG1sVG9rZW5FcnJvcltdKSB7fVxufVxuXG5leHBvcnQgZnVuY3Rpb24gdG9rZW5pemVIdG1sKHNvdXJjZUNvbnRlbnQ6IHN0cmluZywgc291cmNlVXJsOiBzdHJpbmcpOiBIdG1sVG9rZW5pemVSZXN1bHQge1xuICByZXR1cm4gbmV3IF9IdG1sVG9rZW5pemVyKG5ldyBQYXJzZVNvdXJjZUZpbGUoc291cmNlQ29udGVudCwgc291cmNlVXJsKSkudG9rZW5pemUoKTtcbn1cblxuY29uc3QgJEVPRiA9IDA7XG5jb25zdCAkVEFCID0gOTtcbmNvbnN0ICRMRiA9IDEwO1xuY29uc3QgJEZGID0gMTI7XG5jb25zdCAkQ1IgPSAxMztcblxuY29uc3QgJFNQQUNFID0gMzI7XG5cbmNvbnN0ICRCQU5HID0gMzM7XG5jb25zdCAkRFEgPSAzNDtcbmNvbnN0ICRIQVNIID0gMzU7XG5jb25zdCAkJCA9IDM2O1xuY29uc3QgJEFNUEVSU0FORCA9IDM4O1xuY29uc3QgJFNRID0gMzk7XG5jb25zdCAkTUlOVVMgPSA0NTtcbmNvbnN0ICRTTEFTSCA9IDQ3O1xuY29uc3QgJDAgPSA0ODtcblxuY29uc3QgJFNFTUlDT0xPTiA9IDU5O1xuXG5jb25zdCAkOSA9IDU3O1xuY29uc3QgJENPTE9OID0gNTg7XG5jb25zdCAkTFQgPSA2MDtcbmNvbnN0ICRFUSA9IDYxO1xuY29uc3QgJEdUID0gNjI7XG5jb25zdCAkUVVFU1RJT04gPSA2MztcbmNvbnN0ICRMQlJBQ0tFVCA9IDkxO1xuY29uc3QgJFJCUkFDS0VUID0gOTM7XG5jb25zdCAkQSA9IDY1O1xuY29uc3QgJEYgPSA3MDtcbmNvbnN0ICRYID0gODg7XG5jb25zdCAkWiA9IDkwO1xuXG5jb25zdCAkYSA9IDk3O1xuY29uc3QgJGYgPSAxMDI7XG5jb25zdCAkeiA9IDEyMjtcbmNvbnN0ICR4ID0gMTIwO1xuXG5jb25zdCAkTkJTUCA9IDE2MDtcblxudmFyIENSX09SX0NSTEZfUkVHRVhQID0gL1xcclxcbj8vZztcblxuZnVuY3Rpb24gdW5leHBlY3RlZENoYXJhY3RlckVycm9yTXNnKGNoYXJDb2RlOiBudW1iZXIpOiBzdHJpbmcge1xuICB2YXIgY2hhciA9IGNoYXJDb2RlID09PSAkRU9GID8gJ0VPRicgOiBTdHJpbmdXcmFwcGVyLmZyb21DaGFyQ29kZShjaGFyQ29kZSk7XG4gIHJldHVybiBgVW5leHBlY3RlZCBjaGFyYWN0ZXIgXCIke2NoYXJ9XCJgO1xufVxuXG5mdW5jdGlvbiB1bmtub3duRW50aXR5RXJyb3JNc2coZW50aXR5U3JjOiBzdHJpbmcpOiBzdHJpbmcge1xuICByZXR1cm4gYFVua25vd24gZW50aXR5IFwiJHtlbnRpdHlTcmN9XCIgLSB1c2UgdGhlIFwiJiM8ZGVjaW1hbD47XCIgb3IgIFwiJiN4PGhleD47XCIgc3ludGF4YDtcbn1cblxuY2xhc3MgQ29udHJvbEZsb3dFcnJvciB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBlcnJvcjogSHRtbFRva2VuRXJyb3IpIHt9XG59XG5cbi8vIFNlZSBodHRwOi8vd3d3LnczLm9yZy9UUi9odG1sNTEvc3ludGF4Lmh0bWwjd3JpdGluZ1xuY2xhc3MgX0h0bWxUb2tlbml6ZXIge1xuICBwcml2YXRlIGlucHV0OiBzdHJpbmc7XG4gIHByaXZhdGUgbGVuZ3RoOiBudW1iZXI7XG4gIC8vIE5vdGU6IHRoaXMgaXMgYWx3YXlzIGxvd2VyY2FzZSFcbiAgcHJpdmF0ZSBwZWVrOiBudW1iZXIgPSAtMTtcbiAgcHJpdmF0ZSBpbmRleDogbnVtYmVyID0gLTE7XG4gIHByaXZhdGUgbGluZTogbnVtYmVyID0gMDtcbiAgcHJpdmF0ZSBjb2x1bW46IG51bWJlciA9IC0xO1xuICBwcml2YXRlIGN1cnJlbnRUb2tlblN0YXJ0OiBQYXJzZUxvY2F0aW9uO1xuICBwcml2YXRlIGN1cnJlbnRUb2tlblR5cGU6IEh0bWxUb2tlblR5cGU7XG5cbiAgdG9rZW5zOiBIdG1sVG9rZW5bXSA9IFtdO1xuICBlcnJvcnM6IEh0bWxUb2tlbkVycm9yW10gPSBbXTtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGZpbGU6IFBhcnNlU291cmNlRmlsZSkge1xuICAgIHRoaXMuaW5wdXQgPSBmaWxlLmNvbnRlbnQ7XG4gICAgdGhpcy5sZW5ndGggPSBmaWxlLmNvbnRlbnQubGVuZ3RoO1xuICAgIHRoaXMuX2FkdmFuY2UoKTtcbiAgfVxuXG4gIHByaXZhdGUgX3Byb2Nlc3NDYXJyaWFnZVJldHVybnMoY29udGVudDogc3RyaW5nKTogc3RyaW5nIHtcbiAgICAvLyBodHRwOi8vd3d3LnczLm9yZy9UUi9odG1sNS9zeW50YXguaHRtbCNwcmVwcm9jZXNzaW5nLXRoZS1pbnB1dC1zdHJlYW1cbiAgICAvLyBJbiBvcmRlciB0byBrZWVwIHRoZSBvcmlnaW5hbCBwb3NpdGlvbiBpbiB0aGUgc291cmNlLCB3ZSBjYW4gbm90XG4gICAgLy8gcHJlLXByb2Nlc3MgaXQuXG4gICAgLy8gSW5zdGVhZCBDUnMgYXJlIHByb2Nlc3NlZCByaWdodCBiZWZvcmUgaW5zdGFudGlhdGluZyB0aGUgdG9rZW5zLlxuICAgIHJldHVybiBTdHJpbmdXcmFwcGVyLnJlcGxhY2VBbGwoY29udGVudCwgQ1JfT1JfQ1JMRl9SRUdFWFAsICdcXG4nKTtcbiAgfVxuXG4gIHRva2VuaXplKCk6IEh0bWxUb2tlbml6ZVJlc3VsdCB7XG4gICAgd2hpbGUgKHRoaXMucGVlayAhPT0gJEVPRikge1xuICAgICAgdmFyIHN0YXJ0ID0gdGhpcy5fZ2V0TG9jYXRpb24oKTtcbiAgICAgIHRyeSB7XG4gICAgICAgIGlmICh0aGlzLl9hdHRlbXB0Q2hhckNvZGUoJExUKSkge1xuICAgICAgICAgIGlmICh0aGlzLl9hdHRlbXB0Q2hhckNvZGUoJEJBTkcpKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5fYXR0ZW1wdENoYXJDb2RlKCRMQlJBQ0tFVCkpIHtcbiAgICAgICAgICAgICAgdGhpcy5fY29uc3VtZUNkYXRhKHN0YXJ0KTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5fYXR0ZW1wdENoYXJDb2RlKCRNSU5VUykpIHtcbiAgICAgICAgICAgICAgdGhpcy5fY29uc3VtZUNvbW1lbnQoc3RhcnQpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgdGhpcy5fY29uc3VtZURvY1R5cGUoc3RhcnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5fYXR0ZW1wdENoYXJDb2RlKCRTTEFTSCkpIHtcbiAgICAgICAgICAgIHRoaXMuX2NvbnN1bWVUYWdDbG9zZShzdGFydCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX2NvbnN1bWVUYWdPcGVuKHN0YXJ0KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5fY29uc3VtZVRleHQoKTtcbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBpZiAoZSBpbnN0YW5jZW9mIENvbnRyb2xGbG93RXJyb3IpIHtcbiAgICAgICAgICB0aGlzLmVycm9ycy5wdXNoKGUuZXJyb3IpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRocm93IGU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5fYmVnaW5Ub2tlbihIdG1sVG9rZW5UeXBlLkVPRik7XG4gICAgdGhpcy5fZW5kVG9rZW4oW10pO1xuICAgIHJldHVybiBuZXcgSHRtbFRva2VuaXplUmVzdWx0KG1lcmdlVGV4dFRva2Vucyh0aGlzLnRva2VucyksIHRoaXMuZXJyb3JzKTtcbiAgfVxuXG4gIHByaXZhdGUgX2dldExvY2F0aW9uKCk6IFBhcnNlTG9jYXRpb24ge1xuICAgIHJldHVybiBuZXcgUGFyc2VMb2NhdGlvbih0aGlzLmZpbGUsIHRoaXMuaW5kZXgsIHRoaXMubGluZSwgdGhpcy5jb2x1bW4pO1xuICB9XG5cbiAgcHJpdmF0ZSBfZ2V0U3BhbihzdGFydD86IFBhcnNlTG9jYXRpb24sIGVuZD86IFBhcnNlTG9jYXRpb24pOiBQYXJzZVNvdXJjZVNwYW4ge1xuICAgIGlmIChpc0JsYW5rKHN0YXJ0KSkge1xuICAgICAgc3RhcnQgPSB0aGlzLl9nZXRMb2NhdGlvbigpO1xuICAgIH1cbiAgICBpZiAoaXNCbGFuayhlbmQpKSB7XG4gICAgICBlbmQgPSB0aGlzLl9nZXRMb2NhdGlvbigpO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IFBhcnNlU291cmNlU3BhbihzdGFydCwgZW5kKTtcbiAgfVxuXG4gIHByaXZhdGUgX2JlZ2luVG9rZW4odHlwZTogSHRtbFRva2VuVHlwZSwgc3RhcnQ6IFBhcnNlTG9jYXRpb24gPSBudWxsKSB7XG4gICAgaWYgKGlzQmxhbmsoc3RhcnQpKSB7XG4gICAgICBzdGFydCA9IHRoaXMuX2dldExvY2F0aW9uKCk7XG4gICAgfVxuICAgIHRoaXMuY3VycmVudFRva2VuU3RhcnQgPSBzdGFydDtcbiAgICB0aGlzLmN1cnJlbnRUb2tlblR5cGUgPSB0eXBlO1xuICB9XG5cbiAgcHJpdmF0ZSBfZW5kVG9rZW4ocGFydHM6IHN0cmluZ1tdLCBlbmQ6IFBhcnNlTG9jYXRpb24gPSBudWxsKTogSHRtbFRva2VuIHtcbiAgICBpZiAoaXNCbGFuayhlbmQpKSB7XG4gICAgICBlbmQgPSB0aGlzLl9nZXRMb2NhdGlvbigpO1xuICAgIH1cbiAgICB2YXIgdG9rZW4gPSBuZXcgSHRtbFRva2VuKHRoaXMuY3VycmVudFRva2VuVHlwZSwgcGFydHMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXcgUGFyc2VTb3VyY2VTcGFuKHRoaXMuY3VycmVudFRva2VuU3RhcnQsIGVuZCkpO1xuICAgIHRoaXMudG9rZW5zLnB1c2godG9rZW4pO1xuICAgIHRoaXMuY3VycmVudFRva2VuU3RhcnQgPSBudWxsO1xuICAgIHRoaXMuY3VycmVudFRva2VuVHlwZSA9IG51bGw7XG4gICAgcmV0dXJuIHRva2VuO1xuICB9XG5cbiAgcHJpdmF0ZSBfY3JlYXRlRXJyb3IobXNnOiBzdHJpbmcsIHNwYW46IFBhcnNlU291cmNlU3Bhbik6IENvbnRyb2xGbG93RXJyb3Ige1xuICAgIHZhciBlcnJvciA9IG5ldyBIdG1sVG9rZW5FcnJvcihtc2csIHRoaXMuY3VycmVudFRva2VuVHlwZSwgc3Bhbik7XG4gICAgdGhpcy5jdXJyZW50VG9rZW5TdGFydCA9IG51bGw7XG4gICAgdGhpcy5jdXJyZW50VG9rZW5UeXBlID0gbnVsbDtcbiAgICByZXR1cm4gbmV3IENvbnRyb2xGbG93RXJyb3IoZXJyb3IpO1xuICB9XG5cbiAgcHJpdmF0ZSBfYWR2YW5jZSgpIHtcbiAgICBpZiAodGhpcy5pbmRleCA+PSB0aGlzLmxlbmd0aCkge1xuICAgICAgdGhyb3cgdGhpcy5fY3JlYXRlRXJyb3IodW5leHBlY3RlZENoYXJhY3RlckVycm9yTXNnKCRFT0YpLCB0aGlzLl9nZXRTcGFuKCkpO1xuICAgIH1cbiAgICBpZiAodGhpcy5wZWVrID09PSAkTEYpIHtcbiAgICAgIHRoaXMubGluZSsrO1xuICAgICAgdGhpcy5jb2x1bW4gPSAwO1xuICAgIH0gZWxzZSBpZiAodGhpcy5wZWVrICE9PSAkTEYgJiYgdGhpcy5wZWVrICE9PSAkQ1IpIHtcbiAgICAgIHRoaXMuY29sdW1uKys7XG4gICAgfVxuICAgIHRoaXMuaW5kZXgrKztcbiAgICB0aGlzLnBlZWsgPSB0aGlzLmluZGV4ID49IHRoaXMubGVuZ3RoID8gJEVPRiA6IFN0cmluZ1dyYXBwZXIuY2hhckNvZGVBdCh0aGlzLmlucHV0LCB0aGlzLmluZGV4KTtcbiAgfVxuXG4gIHByaXZhdGUgX2F0dGVtcHRDaGFyQ29kZShjaGFyQ29kZTogbnVtYmVyKTogYm9vbGVhbiB7XG4gICAgaWYgKHRoaXMucGVlayA9PT0gY2hhckNvZGUpIHtcbiAgICAgIHRoaXMuX2FkdmFuY2UoKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBwcml2YXRlIF9hdHRlbXB0Q2hhckNvZGVDYXNlSW5zZW5zaXRpdmUoY2hhckNvZGU6IG51bWJlcik6IGJvb2xlYW4ge1xuICAgIGlmIChjb21wYXJlQ2hhckNvZGVDYXNlSW5zZW5zaXRpdmUodGhpcy5wZWVrLCBjaGFyQ29kZSkpIHtcbiAgICAgIHRoaXMuX2FkdmFuY2UoKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBwcml2YXRlIF9yZXF1aXJlQ2hhckNvZGUoY2hhckNvZGU6IG51bWJlcikge1xuICAgIHZhciBsb2NhdGlvbiA9IHRoaXMuX2dldExvY2F0aW9uKCk7XG4gICAgaWYgKCF0aGlzLl9hdHRlbXB0Q2hhckNvZGUoY2hhckNvZGUpKSB7XG4gICAgICB0aHJvdyB0aGlzLl9jcmVhdGVFcnJvcih1bmV4cGVjdGVkQ2hhcmFjdGVyRXJyb3JNc2codGhpcy5wZWVrKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2dldFNwYW4obG9jYXRpb24sIGxvY2F0aW9uKSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfYXR0ZW1wdFN0cihjaGFyczogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjaGFycy5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKCF0aGlzLl9hdHRlbXB0Q2hhckNvZGUoU3RyaW5nV3JhcHBlci5jaGFyQ29kZUF0KGNoYXJzLCBpKSkpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIHByaXZhdGUgX2F0dGVtcHRTdHJDYXNlSW5zZW5zaXRpdmUoY2hhcnM6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2hhcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmICghdGhpcy5fYXR0ZW1wdENoYXJDb2RlQ2FzZUluc2Vuc2l0aXZlKFN0cmluZ1dyYXBwZXIuY2hhckNvZGVBdChjaGFycywgaSkpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBwcml2YXRlIF9yZXF1aXJlU3RyKGNoYXJzOiBzdHJpbmcpIHtcbiAgICB2YXIgbG9jYXRpb24gPSB0aGlzLl9nZXRMb2NhdGlvbigpO1xuICAgIGlmICghdGhpcy5fYXR0ZW1wdFN0cihjaGFycykpIHtcbiAgICAgIHRocm93IHRoaXMuX2NyZWF0ZUVycm9yKHVuZXhwZWN0ZWRDaGFyYWN0ZXJFcnJvck1zZyh0aGlzLnBlZWspLCB0aGlzLl9nZXRTcGFuKGxvY2F0aW9uKSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfYXR0ZW1wdENoYXJDb2RlVW50aWxGbihwcmVkaWNhdGU6IEZ1bmN0aW9uKSB7XG4gICAgd2hpbGUgKCFwcmVkaWNhdGUodGhpcy5wZWVrKSkge1xuICAgICAgdGhpcy5fYWR2YW5jZSgpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX3JlcXVpcmVDaGFyQ29kZVVudGlsRm4ocHJlZGljYXRlOiBGdW5jdGlvbiwgbGVuOiBudW1iZXIpIHtcbiAgICB2YXIgc3RhcnQgPSB0aGlzLl9nZXRMb2NhdGlvbigpO1xuICAgIHRoaXMuX2F0dGVtcHRDaGFyQ29kZVVudGlsRm4ocHJlZGljYXRlKTtcbiAgICBpZiAodGhpcy5pbmRleCAtIHN0YXJ0Lm9mZnNldCA8IGxlbikge1xuICAgICAgdGhyb3cgdGhpcy5fY3JlYXRlRXJyb3IodW5leHBlY3RlZENoYXJhY3RlckVycm9yTXNnKHRoaXMucGVlayksIHRoaXMuX2dldFNwYW4oc3RhcnQsIHN0YXJ0KSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfYXR0ZW1wdFVudGlsQ2hhcihjaGFyOiBudW1iZXIpIHtcbiAgICB3aGlsZSAodGhpcy5wZWVrICE9PSBjaGFyKSB7XG4gICAgICB0aGlzLl9hZHZhbmNlKCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfcmVhZENoYXIoZGVjb2RlRW50aXRpZXM6IGJvb2xlYW4pOiBzdHJpbmcge1xuICAgIGlmIChkZWNvZGVFbnRpdGllcyAmJiB0aGlzLnBlZWsgPT09ICRBTVBFUlNBTkQpIHtcbiAgICAgIHJldHVybiB0aGlzLl9kZWNvZGVFbnRpdHkoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIGluZGV4ID0gdGhpcy5pbmRleDtcbiAgICAgIHRoaXMuX2FkdmFuY2UoKTtcbiAgICAgIHJldHVybiB0aGlzLmlucHV0W2luZGV4XTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF9kZWNvZGVFbnRpdHkoKTogc3RyaW5nIHtcbiAgICB2YXIgc3RhcnQgPSB0aGlzLl9nZXRMb2NhdGlvbigpO1xuICAgIHRoaXMuX2FkdmFuY2UoKTtcbiAgICBpZiAodGhpcy5fYXR0ZW1wdENoYXJDb2RlKCRIQVNIKSkge1xuICAgICAgbGV0IGlzSGV4ID0gdGhpcy5fYXR0ZW1wdENoYXJDb2RlKCR4KSB8fCB0aGlzLl9hdHRlbXB0Q2hhckNvZGUoJFgpO1xuICAgICAgbGV0IG51bWJlclN0YXJ0ID0gdGhpcy5fZ2V0TG9jYXRpb24oKS5vZmZzZXQ7XG4gICAgICB0aGlzLl9hdHRlbXB0Q2hhckNvZGVVbnRpbEZuKGlzRGlnaXRFbnRpdHlFbmQpO1xuICAgICAgaWYgKHRoaXMucGVlayAhPSAkU0VNSUNPTE9OKSB7XG4gICAgICAgIHRocm93IHRoaXMuX2NyZWF0ZUVycm9yKHVuZXhwZWN0ZWRDaGFyYWN0ZXJFcnJvck1zZyh0aGlzLnBlZWspLCB0aGlzLl9nZXRTcGFuKCkpO1xuICAgICAgfVxuICAgICAgdGhpcy5fYWR2YW5jZSgpO1xuICAgICAgbGV0IHN0ck51bSA9IHRoaXMuaW5wdXQuc3Vic3RyaW5nKG51bWJlclN0YXJ0LCB0aGlzLmluZGV4IC0gMSk7XG4gICAgICB0cnkge1xuICAgICAgICBsZXQgY2hhckNvZGUgPSBOdW1iZXJXcmFwcGVyLnBhcnNlSW50KHN0ck51bSwgaXNIZXggPyAxNiA6IDEwKTtcbiAgICAgICAgcmV0dXJuIFN0cmluZ1dyYXBwZXIuZnJvbUNoYXJDb2RlKGNoYXJDb2RlKTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgbGV0IGVudGl0eSA9IHRoaXMuaW5wdXQuc3Vic3RyaW5nKHN0YXJ0Lm9mZnNldCArIDEsIHRoaXMuaW5kZXggLSAxKTtcbiAgICAgICAgdGhyb3cgdGhpcy5fY3JlYXRlRXJyb3IodW5rbm93bkVudGl0eUVycm9yTXNnKGVudGl0eSksIHRoaXMuX2dldFNwYW4oc3RhcnQpKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgbGV0IHN0YXJ0UG9zaXRpb24gPSB0aGlzLl9zYXZlUG9zaXRpb24oKTtcbiAgICAgIHRoaXMuX2F0dGVtcHRDaGFyQ29kZVVudGlsRm4oaXNOYW1lZEVudGl0eUVuZCk7XG4gICAgICBpZiAodGhpcy5wZWVrICE9ICRTRU1JQ09MT04pIHtcbiAgICAgICAgdGhpcy5fcmVzdG9yZVBvc2l0aW9uKHN0YXJ0UG9zaXRpb24pO1xuICAgICAgICByZXR1cm4gJyYnO1xuICAgICAgfVxuICAgICAgdGhpcy5fYWR2YW5jZSgpO1xuICAgICAgbGV0IG5hbWUgPSB0aGlzLmlucHV0LnN1YnN0cmluZyhzdGFydC5vZmZzZXQgKyAxLCB0aGlzLmluZGV4IC0gMSk7XG4gICAgICBsZXQgY2hhciA9IE5BTUVEX0VOVElUSUVTW25hbWVdO1xuICAgICAgaWYgKGlzQmxhbmsoY2hhcikpIHtcbiAgICAgICAgdGhyb3cgdGhpcy5fY3JlYXRlRXJyb3IodW5rbm93bkVudGl0eUVycm9yTXNnKG5hbWUpLCB0aGlzLl9nZXRTcGFuKHN0YXJ0KSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gY2hhcjtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF9jb25zdW1lUmF3VGV4dChkZWNvZGVFbnRpdGllczogYm9vbGVhbiwgZmlyc3RDaGFyT2ZFbmQ6IG51bWJlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0ZW1wdEVuZFJlc3Q6IEZ1bmN0aW9uKTogSHRtbFRva2VuIHtcbiAgICB2YXIgdGFnQ2xvc2VTdGFydDtcbiAgICB2YXIgdGV4dFN0YXJ0ID0gdGhpcy5fZ2V0TG9jYXRpb24oKTtcbiAgICB0aGlzLl9iZWdpblRva2VuKGRlY29kZUVudGl0aWVzID8gSHRtbFRva2VuVHlwZS5FU0NBUEFCTEVfUkFXX1RFWFQgOiBIdG1sVG9rZW5UeXBlLlJBV19URVhULFxuICAgICAgICAgICAgICAgICAgICAgdGV4dFN0YXJ0KTtcbiAgICB2YXIgcGFydHMgPSBbXTtcbiAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgdGFnQ2xvc2VTdGFydCA9IHRoaXMuX2dldExvY2F0aW9uKCk7XG4gICAgICBpZiAodGhpcy5fYXR0ZW1wdENoYXJDb2RlKGZpcnN0Q2hhck9mRW5kKSAmJiBhdHRlbXB0RW5kUmVzdCgpKSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMuaW5kZXggPiB0YWdDbG9zZVN0YXJ0Lm9mZnNldCkge1xuICAgICAgICBwYXJ0cy5wdXNoKHRoaXMuaW5wdXQuc3Vic3RyaW5nKHRhZ0Nsb3NlU3RhcnQub2Zmc2V0LCB0aGlzLmluZGV4KSk7XG4gICAgICB9XG4gICAgICB3aGlsZSAodGhpcy5wZWVrICE9PSBmaXJzdENoYXJPZkVuZCkge1xuICAgICAgICBwYXJ0cy5wdXNoKHRoaXMuX3JlYWRDaGFyKGRlY29kZUVudGl0aWVzKSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0aGlzLl9lbmRUb2tlbihbdGhpcy5fcHJvY2Vzc0NhcnJpYWdlUmV0dXJucyhwYXJ0cy5qb2luKCcnKSldLCB0YWdDbG9zZVN0YXJ0KTtcbiAgfVxuXG4gIHByaXZhdGUgX2NvbnN1bWVDb21tZW50KHN0YXJ0OiBQYXJzZUxvY2F0aW9uKSB7XG4gICAgdGhpcy5fYmVnaW5Ub2tlbihIdG1sVG9rZW5UeXBlLkNPTU1FTlRfU1RBUlQsIHN0YXJ0KTtcbiAgICB0aGlzLl9yZXF1aXJlQ2hhckNvZGUoJE1JTlVTKTtcbiAgICB0aGlzLl9lbmRUb2tlbihbXSk7XG4gICAgdmFyIHRleHRUb2tlbiA9IHRoaXMuX2NvbnN1bWVSYXdUZXh0KGZhbHNlLCAkTUlOVVMsICgpID0+IHRoaXMuX2F0dGVtcHRTdHIoJy0+JykpO1xuICAgIHRoaXMuX2JlZ2luVG9rZW4oSHRtbFRva2VuVHlwZS5DT01NRU5UX0VORCwgdGV4dFRva2VuLnNvdXJjZVNwYW4uZW5kKTtcbiAgICB0aGlzLl9lbmRUb2tlbihbXSk7XG4gIH1cblxuICBwcml2YXRlIF9jb25zdW1lQ2RhdGEoc3RhcnQ6IFBhcnNlTG9jYXRpb24pIHtcbiAgICB0aGlzLl9iZWdpblRva2VuKEh0bWxUb2tlblR5cGUuQ0RBVEFfU1RBUlQsIHN0YXJ0KTtcbiAgICB0aGlzLl9yZXF1aXJlU3RyKCdDREFUQVsnKTtcbiAgICB0aGlzLl9lbmRUb2tlbihbXSk7XG4gICAgdmFyIHRleHRUb2tlbiA9IHRoaXMuX2NvbnN1bWVSYXdUZXh0KGZhbHNlLCAkUkJSQUNLRVQsICgpID0+IHRoaXMuX2F0dGVtcHRTdHIoJ10+JykpO1xuICAgIHRoaXMuX2JlZ2luVG9rZW4oSHRtbFRva2VuVHlwZS5DREFUQV9FTkQsIHRleHRUb2tlbi5zb3VyY2VTcGFuLmVuZCk7XG4gICAgdGhpcy5fZW5kVG9rZW4oW10pO1xuICB9XG5cbiAgcHJpdmF0ZSBfY29uc3VtZURvY1R5cGUoc3RhcnQ6IFBhcnNlTG9jYXRpb24pIHtcbiAgICB0aGlzLl9iZWdpblRva2VuKEh0bWxUb2tlblR5cGUuRE9DX1RZUEUsIHN0YXJ0KTtcbiAgICB0aGlzLl9hdHRlbXB0VW50aWxDaGFyKCRHVCk7XG4gICAgdGhpcy5fYWR2YW5jZSgpO1xuICAgIHRoaXMuX2VuZFRva2VuKFt0aGlzLmlucHV0LnN1YnN0cmluZyhzdGFydC5vZmZzZXQgKyAyLCB0aGlzLmluZGV4IC0gMSldKTtcbiAgfVxuXG4gIHByaXZhdGUgX2NvbnN1bWVQcmVmaXhBbmROYW1lKCk6IHN0cmluZ1tdIHtcbiAgICB2YXIgbmFtZU9yUHJlZml4U3RhcnQgPSB0aGlzLmluZGV4O1xuICAgIHZhciBwcmVmaXggPSBudWxsO1xuICAgIHdoaWxlICh0aGlzLnBlZWsgIT09ICRDT0xPTiAmJiAhaXNQcmVmaXhFbmQodGhpcy5wZWVrKSkge1xuICAgICAgdGhpcy5fYWR2YW5jZSgpO1xuICAgIH1cbiAgICB2YXIgbmFtZVN0YXJ0O1xuICAgIGlmICh0aGlzLnBlZWsgPT09ICRDT0xPTikge1xuICAgICAgdGhpcy5fYWR2YW5jZSgpO1xuICAgICAgcHJlZml4ID0gdGhpcy5pbnB1dC5zdWJzdHJpbmcobmFtZU9yUHJlZml4U3RhcnQsIHRoaXMuaW5kZXggLSAxKTtcbiAgICAgIG5hbWVTdGFydCA9IHRoaXMuaW5kZXg7XG4gICAgfSBlbHNlIHtcbiAgICAgIG5hbWVTdGFydCA9IG5hbWVPclByZWZpeFN0YXJ0O1xuICAgIH1cbiAgICB0aGlzLl9yZXF1aXJlQ2hhckNvZGVVbnRpbEZuKGlzTmFtZUVuZCwgdGhpcy5pbmRleCA9PT0gbmFtZVN0YXJ0ID8gMSA6IDApO1xuICAgIHZhciBuYW1lID0gdGhpcy5pbnB1dC5zdWJzdHJpbmcobmFtZVN0YXJ0LCB0aGlzLmluZGV4KTtcbiAgICByZXR1cm4gW3ByZWZpeCwgbmFtZV07XG4gIH1cblxuICBwcml2YXRlIF9jb25zdW1lVGFnT3BlbihzdGFydDogUGFyc2VMb2NhdGlvbikge1xuICAgIGxldCBzYXZlZFBvcyA9IHRoaXMuX3NhdmVQb3NpdGlvbigpO1xuICAgIGxldCBsb3dlcmNhc2VUYWdOYW1lO1xuICAgIHRyeSB7XG4gICAgICBpZiAoIWlzQXNjaWlMZXR0ZXIodGhpcy5wZWVrKSkge1xuICAgICAgICB0aHJvdyB0aGlzLl9jcmVhdGVFcnJvcih1bmV4cGVjdGVkQ2hhcmFjdGVyRXJyb3JNc2codGhpcy5wZWVrKSwgdGhpcy5fZ2V0U3BhbigpKTtcbiAgICAgIH1cbiAgICAgIHZhciBuYW1lU3RhcnQgPSB0aGlzLmluZGV4O1xuICAgICAgdGhpcy5fY29uc3VtZVRhZ09wZW5TdGFydChzdGFydCk7XG4gICAgICBsb3dlcmNhc2VUYWdOYW1lID0gdGhpcy5pbnB1dC5zdWJzdHJpbmcobmFtZVN0YXJ0LCB0aGlzLmluZGV4KS50b0xvd2VyQ2FzZSgpO1xuICAgICAgdGhpcy5fYXR0ZW1wdENoYXJDb2RlVW50aWxGbihpc05vdFdoaXRlc3BhY2UpO1xuICAgICAgd2hpbGUgKHRoaXMucGVlayAhPT0gJFNMQVNIICYmIHRoaXMucGVlayAhPT0gJEdUKSB7XG4gICAgICAgIHRoaXMuX2NvbnN1bWVBdHRyaWJ1dGVOYW1lKCk7XG4gICAgICAgIHRoaXMuX2F0dGVtcHRDaGFyQ29kZVVudGlsRm4oaXNOb3RXaGl0ZXNwYWNlKTtcbiAgICAgICAgaWYgKHRoaXMuX2F0dGVtcHRDaGFyQ29kZSgkRVEpKSB7XG4gICAgICAgICAgdGhpcy5fYXR0ZW1wdENoYXJDb2RlVW50aWxGbihpc05vdFdoaXRlc3BhY2UpO1xuICAgICAgICAgIHRoaXMuX2NvbnN1bWVBdHRyaWJ1dGVWYWx1ZSgpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX2F0dGVtcHRDaGFyQ29kZVVudGlsRm4oaXNOb3RXaGl0ZXNwYWNlKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuX2NvbnN1bWVUYWdPcGVuRW5kKCk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgaWYgKGUgaW5zdGFuY2VvZiBDb250cm9sRmxvd0Vycm9yKSB7XG4gICAgICAgIC8vIFdoZW4gdGhlIHN0YXJ0IHRhZyBpcyBpbnZhbGlkLCBhc3N1bWUgd2Ugd2FudCBhIFwiPFwiXG4gICAgICAgIHRoaXMuX3Jlc3RvcmVQb3NpdGlvbihzYXZlZFBvcyk7XG4gICAgICAgIC8vIEJhY2sgdG8gYmFjayB0ZXh0IHRva2VucyBhcmUgbWVyZ2VkIGF0IHRoZSBlbmRcbiAgICAgICAgdGhpcy5fYmVnaW5Ub2tlbihIdG1sVG9rZW5UeXBlLlRFWFQsIHN0YXJ0KTtcbiAgICAgICAgdGhpcy5fZW5kVG9rZW4oWyc8J10pO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHRocm93IGU7XG4gICAgfVxuXG4gICAgdmFyIGNvbnRlbnRUb2tlblR5cGUgPSBnZXRIdG1sVGFnRGVmaW5pdGlvbihsb3dlcmNhc2VUYWdOYW1lKS5jb250ZW50VHlwZTtcbiAgICBpZiAoY29udGVudFRva2VuVHlwZSA9PT0gSHRtbFRhZ0NvbnRlbnRUeXBlLlJBV19URVhUKSB7XG4gICAgICB0aGlzLl9jb25zdW1lUmF3VGV4dFdpdGhUYWdDbG9zZShsb3dlcmNhc2VUYWdOYW1lLCBmYWxzZSk7XG4gICAgfSBlbHNlIGlmIChjb250ZW50VG9rZW5UeXBlID09PSBIdG1sVGFnQ29udGVudFR5cGUuRVNDQVBBQkxFX1JBV19URVhUKSB7XG4gICAgICB0aGlzLl9jb25zdW1lUmF3VGV4dFdpdGhUYWdDbG9zZShsb3dlcmNhc2VUYWdOYW1lLCB0cnVlKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF9jb25zdW1lUmF3VGV4dFdpdGhUYWdDbG9zZShsb3dlcmNhc2VUYWdOYW1lOiBzdHJpbmcsIGRlY29kZUVudGl0aWVzOiBib29sZWFuKSB7XG4gICAgdmFyIHRleHRUb2tlbiA9IHRoaXMuX2NvbnN1bWVSYXdUZXh0KGRlY29kZUVudGl0aWVzLCAkTFQsICgpID0+IHtcbiAgICAgIGlmICghdGhpcy5fYXR0ZW1wdENoYXJDb2RlKCRTTEFTSCkpIHJldHVybiBmYWxzZTtcbiAgICAgIHRoaXMuX2F0dGVtcHRDaGFyQ29kZVVudGlsRm4oaXNOb3RXaGl0ZXNwYWNlKTtcbiAgICAgIGlmICghdGhpcy5fYXR0ZW1wdFN0ckNhc2VJbnNlbnNpdGl2ZShsb3dlcmNhc2VUYWdOYW1lKSkgcmV0dXJuIGZhbHNlO1xuICAgICAgdGhpcy5fYXR0ZW1wdENoYXJDb2RlVW50aWxGbihpc05vdFdoaXRlc3BhY2UpO1xuICAgICAgaWYgKCF0aGlzLl9hdHRlbXB0Q2hhckNvZGUoJEdUKSkgcmV0dXJuIGZhbHNlO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSk7XG4gICAgdGhpcy5fYmVnaW5Ub2tlbihIdG1sVG9rZW5UeXBlLlRBR19DTE9TRSwgdGV4dFRva2VuLnNvdXJjZVNwYW4uZW5kKTtcbiAgICB0aGlzLl9lbmRUb2tlbihbbnVsbCwgbG93ZXJjYXNlVGFnTmFtZV0pO1xuICB9XG5cbiAgcHJpdmF0ZSBfY29uc3VtZVRhZ09wZW5TdGFydChzdGFydDogUGFyc2VMb2NhdGlvbikge1xuICAgIHRoaXMuX2JlZ2luVG9rZW4oSHRtbFRva2VuVHlwZS5UQUdfT1BFTl9TVEFSVCwgc3RhcnQpO1xuICAgIHZhciBwYXJ0cyA9IHRoaXMuX2NvbnN1bWVQcmVmaXhBbmROYW1lKCk7XG4gICAgdGhpcy5fZW5kVG9rZW4ocGFydHMpO1xuICB9XG5cbiAgcHJpdmF0ZSBfY29uc3VtZUF0dHJpYnV0ZU5hbWUoKSB7XG4gICAgdGhpcy5fYmVnaW5Ub2tlbihIdG1sVG9rZW5UeXBlLkFUVFJfTkFNRSk7XG4gICAgdmFyIHByZWZpeEFuZE5hbWUgPSB0aGlzLl9jb25zdW1lUHJlZml4QW5kTmFtZSgpO1xuICAgIHRoaXMuX2VuZFRva2VuKHByZWZpeEFuZE5hbWUpO1xuICB9XG5cbiAgcHJpdmF0ZSBfY29uc3VtZUF0dHJpYnV0ZVZhbHVlKCkge1xuICAgIHRoaXMuX2JlZ2luVG9rZW4oSHRtbFRva2VuVHlwZS5BVFRSX1ZBTFVFKTtcbiAgICB2YXIgdmFsdWU7XG4gICAgaWYgKHRoaXMucGVlayA9PT0gJFNRIHx8IHRoaXMucGVlayA9PT0gJERRKSB7XG4gICAgICB2YXIgcXVvdGVDaGFyID0gdGhpcy5wZWVrO1xuICAgICAgdGhpcy5fYWR2YW5jZSgpO1xuICAgICAgdmFyIHBhcnRzID0gW107XG4gICAgICB3aGlsZSAodGhpcy5wZWVrICE9PSBxdW90ZUNoYXIpIHtcbiAgICAgICAgcGFydHMucHVzaCh0aGlzLl9yZWFkQ2hhcih0cnVlKSk7XG4gICAgICB9XG4gICAgICB2YWx1ZSA9IHBhcnRzLmpvaW4oJycpO1xuICAgICAgdGhpcy5fYWR2YW5jZSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgdmFsdWVTdGFydCA9IHRoaXMuaW5kZXg7XG4gICAgICB0aGlzLl9yZXF1aXJlQ2hhckNvZGVVbnRpbEZuKGlzTmFtZUVuZCwgMSk7XG4gICAgICB2YWx1ZSA9IHRoaXMuaW5wdXQuc3Vic3RyaW5nKHZhbHVlU3RhcnQsIHRoaXMuaW5kZXgpO1xuICAgIH1cbiAgICB0aGlzLl9lbmRUb2tlbihbdGhpcy5fcHJvY2Vzc0NhcnJpYWdlUmV0dXJucyh2YWx1ZSldKTtcbiAgfVxuXG4gIHByaXZhdGUgX2NvbnN1bWVUYWdPcGVuRW5kKCkge1xuICAgIHZhciB0b2tlblR5cGUgPSB0aGlzLl9hdHRlbXB0Q2hhckNvZGUoJFNMQVNIKSA/IEh0bWxUb2tlblR5cGUuVEFHX09QRU5fRU5EX1ZPSUQgOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEh0bWxUb2tlblR5cGUuVEFHX09QRU5fRU5EO1xuICAgIHRoaXMuX2JlZ2luVG9rZW4odG9rZW5UeXBlKTtcbiAgICB0aGlzLl9yZXF1aXJlQ2hhckNvZGUoJEdUKTtcbiAgICB0aGlzLl9lbmRUb2tlbihbXSk7XG4gIH1cblxuICBwcml2YXRlIF9jb25zdW1lVGFnQ2xvc2Uoc3RhcnQ6IFBhcnNlTG9jYXRpb24pIHtcbiAgICB0aGlzLl9iZWdpblRva2VuKEh0bWxUb2tlblR5cGUuVEFHX0NMT1NFLCBzdGFydCk7XG4gICAgdGhpcy5fYXR0ZW1wdENoYXJDb2RlVW50aWxGbihpc05vdFdoaXRlc3BhY2UpO1xuICAgIHZhciBwcmVmaXhBbmROYW1lO1xuICAgIHByZWZpeEFuZE5hbWUgPSB0aGlzLl9jb25zdW1lUHJlZml4QW5kTmFtZSgpO1xuICAgIHRoaXMuX2F0dGVtcHRDaGFyQ29kZVVudGlsRm4oaXNOb3RXaGl0ZXNwYWNlKTtcbiAgICB0aGlzLl9yZXF1aXJlQ2hhckNvZGUoJEdUKTtcbiAgICB0aGlzLl9lbmRUb2tlbihwcmVmaXhBbmROYW1lKTtcbiAgfVxuXG4gIHByaXZhdGUgX2NvbnN1bWVUZXh0KCkge1xuICAgIHZhciBzdGFydCA9IHRoaXMuX2dldExvY2F0aW9uKCk7XG4gICAgdGhpcy5fYmVnaW5Ub2tlbihIdG1sVG9rZW5UeXBlLlRFWFQsIHN0YXJ0KTtcbiAgICB2YXIgcGFydHMgPSBbdGhpcy5fcmVhZENoYXIodHJ1ZSldO1xuICAgIHdoaWxlICghaXNUZXh0RW5kKHRoaXMucGVlaykpIHtcbiAgICAgIHBhcnRzLnB1c2godGhpcy5fcmVhZENoYXIodHJ1ZSkpO1xuICAgIH1cbiAgICB0aGlzLl9lbmRUb2tlbihbdGhpcy5fcHJvY2Vzc0NhcnJpYWdlUmV0dXJucyhwYXJ0cy5qb2luKCcnKSldKTtcbiAgfVxuXG4gIHByaXZhdGUgX3NhdmVQb3NpdGlvbigpOiBudW1iZXJbXSB7XG4gICAgcmV0dXJuIFt0aGlzLnBlZWssIHRoaXMuaW5kZXgsIHRoaXMuY29sdW1uLCB0aGlzLmxpbmUsIHRoaXMudG9rZW5zLmxlbmd0aF07XG4gIH1cblxuICBwcml2YXRlIF9yZXN0b3JlUG9zaXRpb24ocG9zaXRpb246IG51bWJlcltdKTogdm9pZCB7XG4gICAgdGhpcy5wZWVrID0gcG9zaXRpb25bMF07XG4gICAgdGhpcy5pbmRleCA9IHBvc2l0aW9uWzFdO1xuICAgIHRoaXMuY29sdW1uID0gcG9zaXRpb25bMl07XG4gICAgdGhpcy5saW5lID0gcG9zaXRpb25bM107XG4gICAgbGV0IG5iVG9rZW5zID0gcG9zaXRpb25bNF07XG4gICAgaWYgKG5iVG9rZW5zIDwgdGhpcy50b2tlbnMubGVuZ3RoKSB7XG4gICAgICAvLyByZW1vdmUgYW55IGV4dHJhIHRva2Vuc1xuICAgICAgdGhpcy50b2tlbnMgPSBMaXN0V3JhcHBlci5zbGljZSh0aGlzLnRva2VucywgMCwgbmJUb2tlbnMpO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBpc05vdFdoaXRlc3BhY2UoY29kZTogbnVtYmVyKTogYm9vbGVhbiB7XG4gIHJldHVybiAhaXNXaGl0ZXNwYWNlKGNvZGUpIHx8IGNvZGUgPT09ICRFT0Y7XG59XG5cbmZ1bmN0aW9uIGlzV2hpdGVzcGFjZShjb2RlOiBudW1iZXIpOiBib29sZWFuIHtcbiAgcmV0dXJuIChjb2RlID49ICRUQUIgJiYgY29kZSA8PSAkU1BBQ0UpIHx8IChjb2RlID09PSAkTkJTUCk7XG59XG5cbmZ1bmN0aW9uIGlzTmFtZUVuZChjb2RlOiBudW1iZXIpOiBib29sZWFuIHtcbiAgcmV0dXJuIGlzV2hpdGVzcGFjZShjb2RlKSB8fCBjb2RlID09PSAkR1QgfHwgY29kZSA9PT0gJFNMQVNIIHx8IGNvZGUgPT09ICRTUSB8fCBjb2RlID09PSAkRFEgfHxcbiAgICAgICAgIGNvZGUgPT09ICRFUTtcbn1cblxuZnVuY3Rpb24gaXNQcmVmaXhFbmQoY29kZTogbnVtYmVyKTogYm9vbGVhbiB7XG4gIHJldHVybiAoY29kZSA8ICRhIHx8ICR6IDwgY29kZSkgJiYgKGNvZGUgPCAkQSB8fCAkWiA8IGNvZGUpICYmIChjb2RlIDwgJDAgfHwgY29kZSA+ICQ5KTtcbn1cblxuZnVuY3Rpb24gaXNEaWdpdEVudGl0eUVuZChjb2RlOiBudW1iZXIpOiBib29sZWFuIHtcbiAgcmV0dXJuIGNvZGUgPT0gJFNFTUlDT0xPTiB8fCBjb2RlID09ICRFT0YgfHwgIWlzQXNjaWlIZXhEaWdpdChjb2RlKTtcbn1cblxuZnVuY3Rpb24gaXNOYW1lZEVudGl0eUVuZChjb2RlOiBudW1iZXIpOiBib29sZWFuIHtcbiAgcmV0dXJuIGNvZGUgPT0gJFNFTUlDT0xPTiB8fCBjb2RlID09ICRFT0YgfHwgIWlzQXNjaWlMZXR0ZXIoY29kZSk7XG59XG5cbmZ1bmN0aW9uIGlzVGV4dEVuZChjb2RlOiBudW1iZXIpOiBib29sZWFuIHtcbiAgcmV0dXJuIGNvZGUgPT09ICRMVCB8fCBjb2RlID09PSAkRU9GO1xufVxuXG5mdW5jdGlvbiBpc0FzY2lpTGV0dGVyKGNvZGU6IG51bWJlcik6IGJvb2xlYW4ge1xuICByZXR1cm4gY29kZSA+PSAkYSAmJiBjb2RlIDw9ICR6IHx8IGNvZGUgPj0gJEEgJiYgY29kZSA8PSAkWjtcbn1cblxuZnVuY3Rpb24gaXNBc2NpaUhleERpZ2l0KGNvZGU6IG51bWJlcik6IGJvb2xlYW4ge1xuICByZXR1cm4gY29kZSA+PSAkYSAmJiBjb2RlIDw9ICRmIHx8IGNvZGUgPj0gJEEgJiYgY29kZSA8PSAkRiB8fCBjb2RlID49ICQwICYmIGNvZGUgPD0gJDk7XG59XG5cbmZ1bmN0aW9uIGNvbXBhcmVDaGFyQ29kZUNhc2VJbnNlbnNpdGl2ZShjb2RlMTogbnVtYmVyLCBjb2RlMjogbnVtYmVyKTogYm9vbGVhbiB7XG4gIHJldHVybiB0b1VwcGVyQ2FzZUNoYXJDb2RlKGNvZGUxKSA9PSB0b1VwcGVyQ2FzZUNoYXJDb2RlKGNvZGUyKTtcbn1cblxuZnVuY3Rpb24gdG9VcHBlckNhc2VDaGFyQ29kZShjb2RlOiBudW1iZXIpOiBudW1iZXIge1xuICByZXR1cm4gY29kZSA+PSAkYSAmJiBjb2RlIDw9ICR6ID8gY29kZSAtICRhICsgJEEgOiBjb2RlO1xufVxuXG5mdW5jdGlvbiBtZXJnZVRleHRUb2tlbnMoc3JjVG9rZW5zOiBIdG1sVG9rZW5bXSk6IEh0bWxUb2tlbltdIHtcbiAgbGV0IGRzdFRva2VucyA9IFtdO1xuICBsZXQgbGFzdERzdFRva2VuOiBIdG1sVG9rZW47XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgc3JjVG9rZW5zLmxlbmd0aDsgaSsrKSB7XG4gICAgbGV0IHRva2VuID0gc3JjVG9rZW5zW2ldO1xuICAgIGlmIChpc1ByZXNlbnQobGFzdERzdFRva2VuKSAmJiBsYXN0RHN0VG9rZW4udHlwZSA9PSBIdG1sVG9rZW5UeXBlLlRFWFQgJiZcbiAgICAgICAgdG9rZW4udHlwZSA9PSBIdG1sVG9rZW5UeXBlLlRFWFQpIHtcbiAgICAgIGxhc3REc3RUb2tlbi5wYXJ0c1swXSArPSB0b2tlbi5wYXJ0c1swXTtcbiAgICAgIGxhc3REc3RUb2tlbi5zb3VyY2VTcGFuLmVuZCA9IHRva2VuLnNvdXJjZVNwYW4uZW5kO1xuICAgIH0gZWxzZSB7XG4gICAgICBsYXN0RHN0VG9rZW4gPSB0b2tlbjtcbiAgICAgIGRzdFRva2Vucy5wdXNoKGxhc3REc3RUb2tlbik7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGRzdFRva2Vucztcbn1cbiJdfQ==