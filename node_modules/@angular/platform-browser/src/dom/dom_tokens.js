"use strict";
var core_1 = require('@angular/core');
/**
 * A DI Token representing the main rendering context. In a browser this is the DOM Document.
 *
 * Note: Document might not be available in the Application Context when Application and Rendering
 * Contexts are not the same (e.g. when running the application into a Web Worker).
 */
exports.DOCUMENT = new core_1.OpaqueToken('DocumentToken');
//# sourceMappingURL=dom_tokens.js.map