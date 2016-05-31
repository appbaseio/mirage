"use strict";
// TODO: vsavkin rename it into TemplateLoader
/**
 * An interface for retrieving documents by URL that the compiler uses
 * to load templates.
 */
var XHR = (function () {
    function XHR() {
    }
    XHR.prototype.get = function (url) { return null; };
    return XHR;
}());
exports.XHR = XHR;
//# sourceMappingURL=xhr.js.map