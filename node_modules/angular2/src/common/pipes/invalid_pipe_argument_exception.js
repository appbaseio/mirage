'use strict';"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var lang_1 = require('angular2/src/facade/lang');
var exceptions_1 = require('angular2/src/facade/exceptions');
var InvalidPipeArgumentException = (function (_super) {
    __extends(InvalidPipeArgumentException, _super);
    function InvalidPipeArgumentException(type, value) {
        _super.call(this, "Invalid argument '" + value + "' for pipe '" + lang_1.stringify(type) + "'");
    }
    return InvalidPipeArgumentException;
}(exceptions_1.BaseException));
exports.InvalidPipeArgumentException = InvalidPipeArgumentException;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW52YWxpZF9waXBlX2FyZ3VtZW50X2V4Y2VwdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRpZmZpbmdfcGx1Z2luX3dyYXBwZXItb3V0cHV0X3BhdGgtamFrWG5NbUwudG1wL2FuZ3VsYXIyL3NyYy9jb21tb24vcGlwZXMvaW52YWxpZF9waXBlX2FyZ3VtZW50X2V4Y2VwdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxxQkFBcUMsMEJBQTBCLENBQUMsQ0FBQTtBQUNoRSwyQkFBOEMsZ0NBQWdDLENBQUMsQ0FBQTtBQUUvRTtJQUFrRCxnREFBYTtJQUM3RCxzQ0FBWSxJQUFVLEVBQUUsS0FBYTtRQUNuQyxrQkFBTSx1QkFBcUIsS0FBSyxvQkFBZSxnQkFBUyxDQUFDLElBQUksQ0FBQyxNQUFHLENBQUMsQ0FBQztJQUNyRSxDQUFDO0lBQ0gsbUNBQUM7QUFBRCxDQUFDLEFBSkQsQ0FBa0QsMEJBQWEsR0FJOUQ7QUFKWSxvQ0FBNEIsK0JBSXhDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0NPTlNULCBUeXBlLCBzdHJpbmdpZnl9IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvbGFuZyc7XG5pbXBvcnQge0Jhc2VFeGNlcHRpb24sIFdyYXBwZWRFeGNlcHRpb259IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvZXhjZXB0aW9ucyc7XG5cbmV4cG9ydCBjbGFzcyBJbnZhbGlkUGlwZUFyZ3VtZW50RXhjZXB0aW9uIGV4dGVuZHMgQmFzZUV4Y2VwdGlvbiB7XG4gIGNvbnN0cnVjdG9yKHR5cGU6IFR5cGUsIHZhbHVlOiBPYmplY3QpIHtcbiAgICBzdXBlcihgSW52YWxpZCBhcmd1bWVudCAnJHt2YWx1ZX0nIGZvciBwaXBlICcke3N0cmluZ2lmeSh0eXBlKX0nYCk7XG4gIH1cbn1cbiJdfQ==