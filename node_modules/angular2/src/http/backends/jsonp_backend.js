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
var interfaces_1 = require('../interfaces');
var enums_1 = require('../enums');
var static_response_1 = require('../static_response');
var base_response_options_1 = require('../base_response_options');
var core_1 = require('angular2/core');
var browser_jsonp_1 = require('./browser_jsonp');
var exceptions_1 = require('angular2/src/facade/exceptions');
var lang_1 = require('angular2/src/facade/lang');
var Observable_1 = require('rxjs/Observable');
var JSONP_ERR_NO_CALLBACK = 'JSONP injected script did not invoke callback.';
var JSONP_ERR_WRONG_METHOD = 'JSONP requests must use GET request method.';
/**
 * Abstract base class for an in-flight JSONP request.
 */
var JSONPConnection = (function () {
    function JSONPConnection() {
    }
    return JSONPConnection;
}());
exports.JSONPConnection = JSONPConnection;
var JSONPConnection_ = (function (_super) {
    __extends(JSONPConnection_, _super);
    function JSONPConnection_(req, _dom, baseResponseOptions) {
        var _this = this;
        _super.call(this);
        this._dom = _dom;
        this.baseResponseOptions = baseResponseOptions;
        this._finished = false;
        if (req.method !== enums_1.RequestMethod.Get) {
            throw exceptions_1.makeTypeError(JSONP_ERR_WRONG_METHOD);
        }
        this.request = req;
        this.response = new Observable_1.Observable(function (responseObserver) {
            _this.readyState = enums_1.ReadyState.Loading;
            var id = _this._id = _dom.nextRequestID();
            _dom.exposeConnection(id, _this);
            // Workaround Dart
            // url = url.replace(/=JSONP_CALLBACK(&|$)/, `generated method`);
            var callback = _dom.requestCallback(_this._id);
            var url = req.url;
            if (url.indexOf('=JSONP_CALLBACK&') > -1) {
                url = lang_1.StringWrapper.replace(url, '=JSONP_CALLBACK&', "=" + callback + "&");
            }
            else if (url.lastIndexOf('=JSONP_CALLBACK') === url.length - '=JSONP_CALLBACK'.length) {
                url = url.substring(0, url.length - '=JSONP_CALLBACK'.length) + ("=" + callback);
            }
            var script = _this._script = _dom.build(url);
            var onLoad = function (event) {
                if (_this.readyState === enums_1.ReadyState.Cancelled)
                    return;
                _this.readyState = enums_1.ReadyState.Done;
                _dom.cleanup(script);
                if (!_this._finished) {
                    var responseOptions_1 = new base_response_options_1.ResponseOptions({ body: JSONP_ERR_NO_CALLBACK, type: enums_1.ResponseType.Error, url: url });
                    if (lang_1.isPresent(baseResponseOptions)) {
                        responseOptions_1 = baseResponseOptions.merge(responseOptions_1);
                    }
                    responseObserver.error(new static_response_1.Response(responseOptions_1));
                    return;
                }
                var responseOptions = new base_response_options_1.ResponseOptions({ body: _this._responseData, url: url });
                if (lang_1.isPresent(_this.baseResponseOptions)) {
                    responseOptions = _this.baseResponseOptions.merge(responseOptions);
                }
                responseObserver.next(new static_response_1.Response(responseOptions));
                responseObserver.complete();
            };
            var onError = function (error) {
                if (_this.readyState === enums_1.ReadyState.Cancelled)
                    return;
                _this.readyState = enums_1.ReadyState.Done;
                _dom.cleanup(script);
                var responseOptions = new base_response_options_1.ResponseOptions({ body: error.message, type: enums_1.ResponseType.Error });
                if (lang_1.isPresent(baseResponseOptions)) {
                    responseOptions = baseResponseOptions.merge(responseOptions);
                }
                responseObserver.error(new static_response_1.Response(responseOptions));
            };
            script.addEventListener('load', onLoad);
            script.addEventListener('error', onError);
            _dom.send(script);
            return function () {
                _this.readyState = enums_1.ReadyState.Cancelled;
                script.removeEventListener('load', onLoad);
                script.removeEventListener('error', onError);
                if (lang_1.isPresent(script)) {
                    _this._dom.cleanup(script);
                }
            };
        });
    }
    JSONPConnection_.prototype.finished = function (data) {
        // Don't leak connections
        this._finished = true;
        this._dom.removeConnection(this._id);
        if (this.readyState === enums_1.ReadyState.Cancelled)
            return;
        this._responseData = data;
    };
    return JSONPConnection_;
}(JSONPConnection));
exports.JSONPConnection_ = JSONPConnection_;
/**
 * A {@link ConnectionBackend} that uses the JSONP strategy of making requests.
 */
var JSONPBackend = (function (_super) {
    __extends(JSONPBackend, _super);
    function JSONPBackend() {
        _super.apply(this, arguments);
    }
    return JSONPBackend;
}(interfaces_1.ConnectionBackend));
exports.JSONPBackend = JSONPBackend;
var JSONPBackend_ = (function (_super) {
    __extends(JSONPBackend_, _super);
    function JSONPBackend_(_browserJSONP, _baseResponseOptions) {
        _super.call(this);
        this._browserJSONP = _browserJSONP;
        this._baseResponseOptions = _baseResponseOptions;
    }
    JSONPBackend_.prototype.createConnection = function (request) {
        return new JSONPConnection_(request, this._browserJSONP, this._baseResponseOptions);
    };
    JSONPBackend_ = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [browser_jsonp_1.BrowserJsonp, base_response_options_1.ResponseOptions])
    ], JSONPBackend_);
    return JSONPBackend_;
}(JSONPBackend));
exports.JSONPBackend_ = JSONPBackend_;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianNvbnBfYmFja2VuZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRpZmZpbmdfcGx1Z2luX3dyYXBwZXItb3V0cHV0X3BhdGgtamFrWG5NbUwudG1wL2FuZ3VsYXIyL3NyYy9odHRwL2JhY2tlbmRzL2pzb25wX2JhY2tlbmQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsMkJBQTRDLGVBQWUsQ0FBQyxDQUFBO0FBQzVELHNCQUFzRCxVQUFVLENBQUMsQ0FBQTtBQUVqRSxnQ0FBdUIsb0JBQW9CLENBQUMsQ0FBQTtBQUM1QyxzQ0FBbUQsMEJBQTBCLENBQUMsQ0FBQTtBQUM5RSxxQkFBeUIsZUFBZSxDQUFDLENBQUE7QUFDekMsOEJBQTJCLGlCQUFpQixDQUFDLENBQUE7QUFDN0MsMkJBQTRCLGdDQUFnQyxDQUFDLENBQUE7QUFDN0QscUJBQXVDLDBCQUEwQixDQUFDLENBQUE7QUFDbEUsMkJBQXlCLGlCQUFpQixDQUFDLENBQUE7QUFHM0MsSUFBTSxxQkFBcUIsR0FBRyxnREFBZ0QsQ0FBQztBQUMvRSxJQUFNLHNCQUFzQixHQUFHLDZDQUE2QyxDQUFDO0FBRTdFOztHQUVHO0FBQ0g7SUFBQTtJQXFCQSxDQUFDO0lBQUQsc0JBQUM7QUFBRCxDQUFDLEFBckJELElBcUJDO0FBckJxQix1QkFBZSxrQkFxQnBDLENBQUE7QUFFRDtJQUFzQyxvQ0FBZTtJQU1uRCwwQkFBWSxHQUFZLEVBQVUsSUFBa0IsRUFDaEMsbUJBQXFDO1FBUDNELGlCQTBGQztRQWxGRyxpQkFBTyxDQUFDO1FBRndCLFNBQUksR0FBSixJQUFJLENBQWM7UUFDaEMsd0JBQW1CLEdBQW5CLG1CQUFtQixDQUFrQjtRQUhqRCxjQUFTLEdBQVksS0FBSyxDQUFDO1FBS2pDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEtBQUsscUJBQWEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQ3JDLE1BQU0sMEJBQWEsQ0FBQyxzQkFBc0IsQ0FB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QUFVLEVBQUU7O3FCQUFBO0lBU2Isb0JBQUM7QUFBRCxDQUFDLEFBUkQsQ0FBbUMsWUFBWSxHQVE5QztBQVJZLHFCQUFhLGdCQVF6QixDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtDb25uZWN0aW9uQmFja2VuZCwgQ29ubmVjdGlvbn0gZnJvbSAnLi4vaW50ZXJmYWNlcyc7XG5pbXBvcnQge1JlYWR5U3RhdGUsIFJlcXVlc3RNZXRob2QsIFJlc3BvbnNlVHlwZX0gZnJvbSAnLi4vZW51bXMnO1xuaW1wb3J0IHtSZXF1ZXN0fSBmcm9tICcuLi9zdGF0aWNfcmVxdWVzdCc7XG5pbXBvcnQge1Jlc3BvbnNlfSBmcm9tICcuLi9zdGF0aWNfcmVzcG9uc2UnO1xuaW1wb3J0IHtSZXNwb25zZU9wdGlvbnMsIEJhc2VSZXNwb25zZU9wdGlvbnN9IGZyb20gJy4uL2Jhc2VfcmVzcG9uc2Vfb3B0aW9ucyc7XG5pbXBvcnQge0luamVjdGFibGV9IGZyb20gJ2FuZ3VsYXIyL2NvcmUnO1xuaW1wb3J0IHtCcm93c2VySnNvbnB9IGZyb20gJy4vYnJvd3Nlcl9qc29ucCc7XG5pbXBvcnQge21ha2VUeXBlRXJyb3J9IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvZXhjZXB0aW9ucyc7XG5pbXBvcnQge1N0cmluZ1dyYXBwZXIsIGlzUHJlc2VudH0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9sYW5nJztcbmltcG9ydCB7T2JzZXJ2YWJsZX0gZnJvbSAncnhqcy9PYnNlcnZhYmxlJztcbmltcG9ydCB7T2JzZXJ2ZXJ9IGZyb20gJ3J4anMvT2JzZXJ2ZXInO1xuXG5jb25zdCBKU09OUF9FUlJfTk9fQ0FMTEJBQ0sgPSAnSlNPTlAgaW5qZWN0ZWQgc2NyaXB0IGRpZCBub3QgaW52b2tlIGNhbGxiYWNrLic7XG5jb25zdCBKU09OUF9FUlJfV1JPTkdfTUVUSE9EID0gJ0pTT05QIHJlcXVlc3RzIG11c3QgdXNlIEdFVCByZXF1ZXN0IG1ldGhvZC4nO1xuXG4vKipcbiAqIEFic3RyYWN0IGJhc2UgY2xhc3MgZm9yIGFuIGluLWZsaWdodCBKU09OUCByZXF1ZXN0LlxuICovXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgSlNPTlBDb25uZWN0aW9uIGltcGxlbWVudHMgQ29ubmVjdGlvbiB7XG4gIC8qKlxuICAgKiBUaGUge0BsaW5rIFJlYWR5U3RhdGV9IG9mIHRoaXMgcmVxdWVzdC5cbiAgICovXG4gIHJlYWR5U3RhdGU6IFJlYWR5U3RhdGU7XG5cbiAgLyoqXG4gICAqIFRoZSBvdXRnb2luZyBIVFRQIHJlcXVlc3QuXG4gICAqL1xuICByZXF1ZXN0OiBSZXF1ZXN0O1xuXG4gIC8qKlxuICAgKiBBbiBvYnNlcnZhYmxlIHRoYXQgY29tcGxldGVzIHdpdGggdGhlIHJlc3BvbnNlLCB3aGVuIHRoZSByZXF1ZXN0IGlzIGZpbmlzaGVkLlxuICAgKi9cbiAgcmVzcG9uc2U6IE9ic2VydmFibGU8UmVzcG9uc2U+O1xuXG4gIC8qKlxuICAgKiBDYWxsYmFjayBjYWxsZWQgd2hlbiB0aGUgSlNPTlAgcmVxdWVzdCBjb21wbGV0ZXMsIHRvIG5vdGlmeSB0aGUgYXBwbGljYXRpb25cbiAgICogb2YgdGhlIG5ldyBkYXRhLlxuICAgKi9cbiAgYWJzdHJhY3QgZmluaXNoZWQoZGF0YT86IGFueSk6IHZvaWQ7XG59XG5cbmV4cG9ydCBjbGFzcyBKU09OUENvbm5lY3Rpb25fIGV4dGVuZHMgSlNPTlBDb25uZWN0aW9uIHtcbiAgcHJpdmF0ZSBfaWQ6IHN0cmluZztcbiAgcHJpdmF0ZSBfc2NyaXB0OiBFbGVtZW50O1xuICBwcml2YXRlIF9yZXNwb25zZURhdGE6IGFueTtcbiAgcHJpdmF0ZSBfZmluaXNoZWQ6IGJvb2xlYW4gPSBmYWxzZTtcblxuICBjb25zdHJ1Y3RvcihyZXE6IFJlcXVlc3QsIHByaXZhdGUgX2RvbTogQnJvd3Nlckpzb25wLFxuICAgICAgICAgICAgICBwcml2YXRlIGJhc2VSZXNwb25zZU9wdGlvbnM/OiBSZXNwb25zZU9wdGlvbnMpIHtcbiAgICBzdXBlcigpO1xuICAgIGlmIChyZXEubWV0aG9kICE9PSBSZXF1ZXN0TWV0aG9kLkdldCkge1xuICAgICAgdGhyb3cgbWFrZVR5cGVFcnJvcihKU09OUF9FUlJfV1JPTkdfTUVUSE9EKTtcbiAgICB9XG4gICAgdGhpcy5yZXF1ZXN0ID0gcmVxO1xuICAgIHRoaXMucmVzcG9uc2UgPSBuZXcgT2JzZXJ2YWJsZSgocmVzcG9uc2VPYnNlcnZlcjogT2JzZXJ2ZXI8UmVzcG9uc2U+KSA9PiB7XG5cbiAgICAgIHRoaXMucmVhZHlTdGF0ZSA9IFJlYWR5U3RhdGUuTG9hZGluZztcbiAgICAgIGxldCBpZCA9IHRoaXMuX2lkID0gX2RvbS5uZXh0UmVxdWVzdElEKCk7XG5cbiAgICAgIF9kb20uZXhwb3NlQ29ubmVjdGlvbihpZCwgdGhpcyk7XG5cbiAgICAgIC8vIFdvcmthcm91bmQgRGFydFxuICAgICAgLy8gdXJsID0gdXJsLnJlcGxhY2UoLz1KU09OUF9DQUxMQkFDSygmfCQpLywgYGdlbmVyYXRlZCBtZXRob2RgKTtcbiAgICAgIGxldCBjYWxsYmFjayA9IF9kb20ucmVxdWVzdENhbGxiYWNrKHRoaXMuX2lkKTtcbiAgICAgIGxldCB1cmw6IHN0cmluZyA9IHJlcS51cmw7XG4gICAgICBpZiAodXJsLmluZGV4T2YoJz1KU09OUF9DQUxMQkFDSyYnKSA+IC0xKSB7XG4gICAgICAgIHVybCA9IFN0cmluZ1dyYXBwZXIucmVwbGFjZSh1cmwsICc9SlNPTlBfQ0FMTEJBQ0smJywgYD0ke2NhbGxiYWNrfSZgKTtcbiAgICAgIH0gZWxzZSBpZiAodXJsLmxhc3RJbmRleE9mKCc9SlNPTlBfQ0FMTEJBQ0snKSA9PT0gdXJsLmxlbmd0aCAtICc9SlNPTlBfQ0FMTEJBQ0snLmxlbmd0aCkge1xuICAgICAgICB1cmwgPSB1cmwuc3Vic3RyaW5nKDAsIHVybC5sZW5ndGggLSAnPUpTT05QX0NBTExCQUNLJy5sZW5ndGgpICsgYD0ke2NhbGxiYWNrfWA7XG4gICAgICB9XG5cbiAgICAgIGxldCBzY3JpcHQgPSB0aGlzLl9zY3JpcHQgPSBfZG9tLmJ1aWxkKHVybCk7XG5cbiAgICAgIGxldCBvbkxvYWQgPSAoZXZlbnQ6IEV2ZW50KSA9PiB7XG4gICAgICAgIGlmICh0aGlzLnJlYWR5U3RhdGUgPT09IFJlYWR5U3RhdGUuQ2FuY2VsbGVkKSByZXR1cm47XG4gICAgICAgIHRoaXMucmVhZHlTdGF0ZSA9IFJlYWR5U3RhdGUuRG9uZTtcbiAgICAgICAgX2RvbS5jbGVhbnVwKHNjcmlwdCk7XG4gICAgICAgIGlmICghdGhpcy5fZmluaXNoZWQpIHtcbiAgICAgICAgICBsZXQgcmVzcG9uc2VPcHRpb25zID1cbiAgICAgICAgICAgICAgbmV3IFJlc3BvbnNlT3B0aW9ucyh7Ym9keTogSlNPTlBfRVJSX05PX0NBTExCQUNLLCB0eXBlOiBSZXNwb25zZVR5cGUuRXJyb3IsIHVybH0pO1xuICAgICAgICAgIGlmIChpc1ByZXNlbnQoYmFzZVJlc3BvbnNlT3B0aW9ucykpIHtcbiAgICAgICAgICAgIHJlc3BvbnNlT3B0aW9ucyA9IGJhc2VSZXNwb25zZU9wdGlvbnMubWVyZ2UocmVzcG9uc2VPcHRpb25zKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmVzcG9uc2VPYnNlcnZlci5lcnJvcihuZXcgUmVzcG9uc2UocmVzcG9uc2VPcHRpb25zKSk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHJlc3BvbnNlT3B0aW9ucyA9IG5ldyBSZXNwb25zZU9wdGlvbnMoe2JvZHk6IHRoaXMuX3Jlc3BvbnNlRGF0YSwgdXJsfSk7XG4gICAgICAgIGlmIChpc1ByZXNlbnQodGhpcy5iYXNlUmVzcG9uc2VPcHRpb25zKSkge1xuICAgICAgICAgIHJlc3BvbnNlT3B0aW9ucyA9IHRoaXMuYmFzZVJlc3BvbnNlT3B0aW9ucy5tZXJnZShyZXNwb25zZU9wdGlvbnMpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVzcG9uc2VPYnNlcnZlci5uZXh0KG5ldyBSZXNwb25zZShyZXNwb25zZU9wdGlvbnMpKTtcbiAgICAgICAgcmVzcG9uc2VPYnNlcnZlci5jb21wbGV0ZSgpO1xuICAgICAgfTtcblxuICAgICAgbGV0IG9uRXJyb3IgPSAoZXJyb3I6IEVycm9yKSA9PiB7XG4gICAgICAgIGlmICh0aGlzLnJlYWR5U3RhdGUgPT09IFJlYWR5U3RhdGUuQ2FuY2VsbGVkKSByZXR1cm47XG4gICAgICAgIHRoaXMucmVhZHlTdGF0ZSA9IFJlYWR5U3RhdGUuRG9uZTtcbiAgICAgICAgX2RvbS5jbGVhbnVwKHNjcmlwdCk7XG4gICAgICAgIGxldCByZXNwb25zZU9wdGlvbnMgPSBuZXcgUmVzcG9uc2VPcHRpb25zKHtib2R5OiBlcnJvci5tZXNzYWdlLCB0eXBlOiBSZXNwb25zZVR5cGUuRXJyb3J9KTtcbiAgICAgICAgaWYgKGlzUHJlc2VudChiYXNlUmVzcG9uc2VPcHRpb25zKSkge1xuICAgICAgICAgIHJlc3BvbnNlT3B0aW9ucyA9IGJhc2VSZXNwb25zZU9wdGlvbnMubWVyZ2UocmVzcG9uc2VPcHRpb25zKTtcbiAgICAgICAgfVxuICAgICAgICByZXNwb25zZU9ic2VydmVyLmVycm9yKG5ldyBSZXNwb25zZShyZXNwb25zZU9wdGlvbnMpKTtcbiAgICAgIH07XG5cbiAgICAgIHNjcmlwdC5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgb25Mb2FkKTtcbiAgICAgIHNjcmlwdC5hZGRFdmVudExpc3RlbmVyKCdlcnJvcicsIG9uRXJyb3IpO1xuXG4gICAgICBfZG9tLnNlbmQoc2NyaXB0KTtcblxuICAgICAgcmV0dXJuICgpID0+IHtcbiAgICAgICAgdGhpcy5yZWFkeVN0YXRlID0gUmVhZHlTdGF0ZS5DYW5jZWxsZWQ7XG4gICAgICAgIHNjcmlwdC5yZW1vdmVFdmVudExpc3RlbmVyKCdsb2FkJywgb25Mb2FkKTtcbiAgICAgICAgc2NyaXB0LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2Vycm9yJywgb25FcnJvcik7XG4gICAgICAgIGlmIChpc1ByZXNlbnQoc2NyaXB0KSkge1xuICAgICAgICAgIHRoaXMuX2RvbS5jbGVhbnVwKHNjcmlwdCk7XG4gICAgICAgIH1cblxuICAgICAgfTtcbiAgICB9KTtcbiAgfVxuXG4gIGZpbmlzaGVkKGRhdGE/OiBhbnkpIHtcbiAgICAvLyBEb24ndCBsZWFrIGNvbm5lY3Rpb25zXG4gICAgdGhpcy5fZmluaXNoZWQgPSB0cnVlO1xuICAgIHRoaXMuX2RvbS5yZW1vdmVDb25uZWN0aW9uKHRoaXMuX2lkKTtcbiAgICBpZiAodGhpcy5yZWFkeVN0YXRlID09PSBSZWFkeVN0YXRlLkNhbmNlbGxlZCkgcmV0dXJuO1xuICAgIHRoaXMuX3Jlc3BvbnNlRGF0YSA9IGRhdGE7XG4gIH1cbn1cblxuLyoqXG4gKiBBIHtAbGluayBDb25uZWN0aW9uQmFja2VuZH0gdGhhdCB1c2VzIHRoZSBKU09OUCBzdHJhdGVneSBvZiBtYWtpbmcgcmVxdWVzdHMuXG4gKi9cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBKU09OUEJhY2tlbmQgZXh0ZW5kcyBDb25uZWN0aW9uQmFja2VuZCB7fVxuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgSlNPTlBCYWNrZW5kXyBleHRlbmRzIEpTT05QQmFja2VuZCB7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgX2Jyb3dzZXJKU09OUDogQnJvd3Nlckpzb25wLCBwcml2YXRlIF9iYXNlUmVzcG9uc2VPcHRpb25zOiBSZXNwb25zZU9wdGlvbnMpIHtcbiAgICBzdXBlcigpO1xuICB9XG5cbiAgY3JlYXRlQ29ubmVjdGlvbihyZXF1ZXN0OiBSZXF1ZXN0KTogSlNPTlBDb25uZWN0aW9uIHtcbiAgICByZXR1cm4gbmV3IEpTT05QQ29ubmVjdGlvbl8ocmVxdWVzdCwgdGhpcy5fYnJvd3NlckpTT05QLCB0aGlzLl9iYXNlUmVzcG9uc2VPcHRpb25zKTtcbiAgfVxufVxuIl19