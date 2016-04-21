var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ConnectionBackend } from '../interfaces';
import { ReadyState, RequestMethod, ResponseType } from '../enums';
import { Response } from '../static_response';
import { ResponseOptions } from '../base_response_options';
import { Injectable } from 'angular2/core';
import { BrowserJsonp } from './browser_jsonp';
import { makeTypeError } from 'angular2/src/facade/exceptions';
import { StringWrapper, isPresent } from 'angular2/src/facade/lang';
import { Observable } from 'rxjs/Observable';
const JSONP_ERR_NO_CALLBACK = 'JSONP injected script did not invoke callback.';
const JSONP_ERR_WRONG_METHOD = 'JSONP requests must use GET request method.';
/**
 * Abstract base class for an in-flight JSONP request.
 */
export class JSONPConnection {
}
export class JSONPConnection_ extends JSONPConnection {
    constructor(req, _dom, baseResponseOptions) {
        super();
        this._dom = _dom;
        this.baseResponseOptions = baseResponseOptions;
        this._finished = false;
        if (req.method !== RequestMethod.Get) {
            throw makeTypeError(JSONP_ERR_WRONG_METHOD);
        }
        this.request = req;
        this.response = new Observable((responseObserver) => {
            this.readyState = ReadyState.Loading;
            let id = this._id = _dom.nextRequestID();
            _dom.exposeConnection(id, this);
            // Workaround Dart
            // url = url.replace(/=JSONP_CALLBACK(&|$)/, `generated method`);
            let callback = _dom.requestCallback(this._id);
            let url = req.url;
            if (url.indexOf('=JSONP_CALLBACK&') > -1) {
                url = StringWrapper.replace(url, '=JSONP_CALLBACK&', `=${callback}&`);
            }
            else if (url.lastIndexOf('=JSONP_CALLBACK') === url.length - '=JSONP_CALLBACK'.length) {
                url = url.substring(0, url.length - '=JSONP_CALLBACK'.length) + `=${callback}`;
            }
            let script = this._script = _dom.build(url);
            let onLoad = (event) => {
                if (this.readyState === ReadyState.Cancelled)
                    return;
                this.readyState = ReadyState.Done;
                _dom.cleanup(script);
                if (!this._finished) {
                    let responseOptions = new ResponseOptions({ body: JSONP_ERR_NO_CALLBACK, type: ResponseType.Error, url });
                    if (isPresent(baseResponseOptions)) {
                        responseOptions = baseResponseOptions.merge(responseOptions);
                    }
                    responseObserver.error(new Response(responseOptions));
                    return;
                }
                let responseOptions = new ResponseOptions({ body: this._responseData, url });
                if (isPresent(this.baseResponseOptions)) {
                    responseOptions = this.baseResponseOptions.merge(responseOptions);
                }
                responseObserver.next(new Response(responseOptions));
                responseObserver.complete();
            };
            let onError = (error) => {
                if (this.readyState === ReadyState.Cancelled)
                    return;
                this.readyState = ReadyState.Done;
                _dom.cleanup(script);
                let responseOptions = new ResponseOptions({ body: error.message, type: ResponseType.Error });
                if (isPresent(baseResponseOptions)) {
                    responseOptions = baseResponseOptions.merge(responseOptions);
                }
                responseObserver.error(new Response(responseOptions));
            };
            script.addEventListener('load', onLoad);
            script.addEventListener('error', onError);
            _dom.send(script);
            return () => {
                this.readyState = ReadyState.Cancelled;
                script.removeEventListener('load', onLoad);
                script.removeEventListener('error', onError);
                if (isPresent(script)) {
                    this._dom.cleanup(script);
                }
            };
        });
    }
    finished(data) {
        // Don't leak connections
        this._finished = true;
        this._dom.removeConnection(this._id);
        if (this.readyState === ReadyState.Cancelled)
            return;
        this._responseData = data;
    }
}
/**
 * A {@link ConnectionBackend} that uses the JSONP strategy of making requests.
 */
export class JSONPBackend extends ConnectionBackend {
}
export let JSONPBackend_ = class JSONPBackend_ extends JSONPBackend {
    constructor(_browserJSONP, _baseResponseOptions) {
        super();
        this._browserJSONP = _browserJSONP;
        this._baseResponseOptions = _baseResponseOptions;
    }
    createConnection(request) {
        return new JSONPConnection_(request, this._browserJSONP, this._baseResponseOptions);
    }
};
JSONPBackend_ = __decorate([
    Injectable(), 
    __metadata('design:paramtypes', [BrowserJsonp, ResponseOptions])
], JSONPBackend_);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianNvbnBfYmFja2VuZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRpZmZpbmdfcGx1Z2luX3dyYXBwZXItb3V0cHV0X3BhdGgtb1hETzRwMnYudG1wL2FuZ3VsYXIyL3NyYy9odHRwL2JhY2tlbmRzL2pzb25wX2JhY2tlbmQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O09BQU8sRUFBQyxpQkFBaUIsRUFBYSxNQUFNLGVBQWU7T0FDcEQsRUFBQyxVQUFVLEVBQUUsYUFBYSxFQUFFLFlBQVksRUFBQyxNQUFNLFVBQVU7T0FFekQsRUFBQyxRQUFRLEVBQUMsTUFBTSxvQkFBb0I7T0FDcEMsRUFBQyxlQUFlLEVBQXNCLE1BQU0sMEJBQTBCO09BQ3RFLEVBQUMsVUFBVSxFQUFDLE1BQU0sZUFBZTtPQUNqQyxFQUFDLFlBQVksRUFBQyxNQUFNLGlCQUFpQjtPQUNyQyxFQUFDLGFBQWEsRUFBQyxNQUFNLGdDQUFnQztPQUNyRCxFQUFDLGFBQWEsRUFBRSxTQUFTLEVBQUMsTUFBTSwwQkFBMEI7T0FDMUQsRUFBQyxVQUFVLEVBQUMsTUFBTSxpQkFBaUI7QUFHMUMsTUFBTSxxQkFBcUIsR0FBRyxnREFBZ0QsQ0FBQztBQUMvRSxNQUFNLHNCQUFzQixHQUFHLDZDQUE2QyxDQUFDO0FBRTdFOztHQUVHO0FBQ0g7QUFxQkEsQ0FBQztBQUVELHNDQUFzQyxlQUFlO0lBTW5ELFlBQVksR0FBWSxFQUFVLElBQWtCLEVBQ2hDLG1CQUFxQztRQUN2RCxPQUFPLENBQUM7UUFGd0IsU0FBSSxHQUFKLElBQUksQ0FBYztRQUNoQyx3QkFBbUIsR0FBbkIsbUJBQW1CLENBQWtCO1FBSGpELGNBQVMsR0FBWSxLQUFLLENBQUM7UUFLakMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sS0FBSyxhQUFhLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztZQUNyQyxNQUFNLGFBQWEsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO1FBQzlDLENBQUM7UUFDRCxJQUFJ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LElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUM1QixDQUFDO1lBRUgsQ0FBQyxDQUFDO1FBQ0osQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQsUUFBUSxDQUFDLElBQVU7UUFDakIseUJBQXlCO1FBQ3pCLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO1FBQ3RCLElBQUksQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3JDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLEtBQUssVUFBVSxDQUFDLFNBQVMsQ0FBQztZQUFDLE1BQU0sQ0FBQztRQUNyRCxJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQztJQUM1QixDQUFDO0FBQ0gsQ0FBQztBQUVEOztHQUVHO0FBQ0gsa0NBQTJDLGlCQUFpQjtBQUFFLENBQUM7QUFHL0QsdURBQW1DLFlBQVk7SUFDN0MsWUFBb0IsYUFBMkIsRUFBVSxvQkFBcUM7UUFDNUYsT0FBTyxDQUFDO1FBRFUsa0JBQWEsR0FBYixhQUFhLENBQWM7UUFBVSx5QkFBb0IsR0FBcEIsb0JBQW9CLENBQWlCO0lBRTlGLENBQUM7SUFFRCxnQkFBZ0IsQ0FBQyxPQUFnQjtRQUMvQixNQUFNLENBQUMsSUFBSSxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsb0JBQW9CLENBQUMsQ0FBQztJQUN0RixDQUFDO0FBQ0gsQ0FBQztBQVREO0lBQUMsVUFBVSxFQUFFOztpQkFBQTtBQVNaIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtDb25uZWN0aW9uQmFja2VuZCwgQ29ubmVjdGlvbn0gZnJvbSAnLi4vaW50ZXJmYWNlcyc7XG5pbXBvcnQge1JlYWR5U3RhdGUsIFJlcXVlc3RNZXRob2QsIFJlc3BvbnNlVHlwZX0gZnJvbSAnLi4vZW51bXMnO1xuaW1wb3J0IHtSZXF1ZXN0fSBmcm9tICcuLi9zdGF0aWNfcmVxdWVzdCc7XG5pbXBvcnQge1Jlc3BvbnNlfSBmcm9tICcuLi9zdGF0aWNfcmVzcG9uc2UnO1xuaW1wb3J0IHtSZXNwb25zZU9wdGlvbnMsIEJhc2VSZXNwb25zZU9wdGlvbnN9IGZyb20gJy4uL2Jhc2VfcmVzcG9uc2Vfb3B0aW9ucyc7XG5pbXBvcnQge0luamVjdGFibGV9IGZyb20gJ2FuZ3VsYXIyL2NvcmUnO1xuaW1wb3J0IHtCcm93c2VySnNvbnB9IGZyb20gJy4vYnJvd3Nlcl9qc29ucCc7XG5pbXBvcnQge21ha2VUeXBlRXJyb3J9IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvZXhjZXB0aW9ucyc7XG5pbXBvcnQge1N0cmluZ1dyYXBwZXIsIGlzUHJlc2VudH0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9sYW5nJztcbmltcG9ydCB7T2JzZXJ2YWJsZX0gZnJvbSAncnhqcy9PYnNlcnZhYmxlJztcbmltcG9ydCB7T2JzZXJ2ZXJ9IGZyb20gJ3J4anMvT2JzZXJ2ZXInO1xuXG5jb25zdCBKU09OUF9FUlJfTk9fQ0FMTEJBQ0sgPSAnSlNPTlAgaW5qZWN0ZWQgc2NyaXB0IGRpZCBub3QgaW52b2tlIGNhbGxiYWNrLic7XG5jb25zdCBKU09OUF9FUlJfV1JPTkdfTUVUSE9EID0gJ0pTT05QIHJlcXVlc3RzIG11c3QgdXNlIEdFVCByZXF1ZXN0IG1ldGhvZC4nO1xuXG4vKipcbiAqIEFic3RyYWN0IGJhc2UgY2xhc3MgZm9yIGFuIGluLWZsaWdodCBKU09OUCByZXF1ZXN0LlxuICovXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgSlNPTlBDb25uZWN0aW9uIGltcGxlbWVudHMgQ29ubmVjdGlvbiB7XG4gIC8qKlxuICAgKiBUaGUge0BsaW5rIFJlYWR5U3RhdGV9IG9mIHRoaXMgcmVxdWVzdC5cbiAgICovXG4gIHJlYWR5U3RhdGU6IFJlYWR5U3RhdGU7XG5cbiAgLyoqXG4gICAqIFRoZSBvdXRnb2luZyBIVFRQIHJlcXVlc3QuXG4gICAqL1xuICByZXF1ZXN0OiBSZXF1ZXN0O1xuXG4gIC8qKlxuICAgKiBBbiBvYnNlcnZhYmxlIHRoYXQgY29tcGxldGVzIHdpdGggdGhlIHJlc3BvbnNlLCB3aGVuIHRoZSByZXF1ZXN0IGlzIGZpbmlzaGVkLlxuICAgKi9cbiAgcmVzcG9uc2U6IE9ic2VydmFibGU8UmVzcG9uc2U+O1xuXG4gIC8qKlxuICAgKiBDYWxsYmFjayBjYWxsZWQgd2hlbiB0aGUgSlNPTlAgcmVxdWVzdCBjb21wbGV0ZXMsIHRvIG5vdGlmeSB0aGUgYXBwbGljYXRpb25cbiAgICogb2YgdGhlIG5ldyBkYXRhLlxuICAgKi9cbiAgYWJzdHJhY3QgZmluaXNoZWQoZGF0YT86IGFueSk6IHZvaWQ7XG59XG5cbmV4cG9ydCBjbGFzcyBKU09OUENvbm5lY3Rpb25fIGV4dGVuZHMgSlNPTlBDb25uZWN0aW9uIHtcbiAgcHJpdmF0ZSBfaWQ6IHN0cmluZztcbiAgcHJpdmF0ZSBfc2NyaXB0OiBFbGVtZW50O1xuICBwcml2YXRlIF9yZXNwb25zZURhdGE6IGFueTtcbiAgcHJpdmF0ZSBfZmluaXNoZWQ6IGJvb2xlYW4gPSBmYWxzZTtcblxuICBjb25zdHJ1Y3RvcihyZXE6IFJlcXVlc3QsIHByaXZhdGUgX2RvbTogQnJvd3Nlckpzb25wLFxuICAgICAgICAgICAgICBwcml2YXRlIGJhc2VSZXNwb25zZU9wdGlvbnM/OiBSZXNwb25zZU9wdGlvbnMpIHtcbiAgICBzdXBlcigpO1xuICAgIGlmIChyZXEubWV0aG9kICE9PSBSZXF1ZXN0TWV0aG9kLkdldCkge1xuICAgICAgdGhyb3cgbWFrZVR5cGVFcnJvcihKU09OUF9FUlJfV1JPTkdfTUVUSE9EKTtcbiAgICB9XG4gICAgdGhpcy5yZXF1ZXN0ID0gcmVxO1xuICAgIHRoaXMucmVzcG9uc2UgPSBuZXcgT2JzZXJ2YWJsZSgocmVzcG9uc2VPYnNlcnZlcjogT2JzZXJ2ZXI8UmVzcG9uc2U+KSA9PiB7XG5cbiAgICAgIHRoaXMucmVhZHlTdGF0ZSA9IFJlYWR5U3RhdGUuTG9hZGluZztcbiAgICAgIGxldCBpZCA9IHRoaXMuX2lkID0gX2RvbS5uZXh0UmVxdWVzdElEKCk7XG5cbiAgICAgIF9kb20uZXhwb3NlQ29ubmVjdGlvbihpZCwgdGhpcyk7XG5cbiAgICAgIC8vIFdvcmthcm91bmQgRGFydFxuICAgICAgLy8gdXJsID0gdXJsLnJlcGxhY2UoLz1KU09OUF9DQUxMQkFDSygmfCQpLywgYGdlbmVyYXRlZCBtZXRob2RgKTtcbiAgICAgIGxldCBjYWxsYmFjayA9IF9kb20ucmVxdWVzdENhbGxiYWNrKHRoaXMuX2lkKTtcbiAgICAgIGxldCB1cmw6IHN0cmluZyA9IHJlcS51cmw7XG4gICAgICBpZiAodXJsLmluZGV4T2YoJz1KU09OUF9DQUxMQkFDSyYnKSA+IC0xKSB7XG4gICAgICAgIHVybCA9IFN0cmluZ1dyYXBwZXIucmVwbGFjZSh1cmwsICc9SlNPTlBfQ0FMTEJBQ0smJywgYD0ke2NhbGxiYWNrfSZgKTtcbiAgICAgIH0gZWxzZSBpZiAodXJsLmxhc3RJbmRleE9mKCc9SlNPTlBfQ0FMTEJBQ0snKSA9PT0gdXJsLmxlbmd0aCAtICc9SlNPTlBfQ0FMTEJBQ0snLmxlbmd0aCkge1xuICAgICAgICB1cmwgPSB1cmwuc3Vic3RyaW5nKDAsIHVybC5sZW5ndGggLSAnPUpTT05QX0NBTExCQUNLJy5sZW5ndGgpICsgYD0ke2NhbGxiYWNrfWA7XG4gICAgICB9XG5cbiAgICAgIGxldCBzY3JpcHQgPSB0aGlzLl9zY3JpcHQgPSBfZG9tLmJ1aWxkKHVybCk7XG5cbiAgICAgIGxldCBvbkxvYWQgPSAoZXZlbnQ6IEV2ZW50KSA9PiB7XG4gICAgICAgIGlmICh0aGlzLnJlYWR5U3RhdGUgPT09IFJlYWR5U3RhdGUuQ2FuY2VsbGVkKSByZXR1cm47XG4gICAgICAgIHRoaXMucmVhZHlTdGF0ZSA9IFJlYWR5U3RhdGUuRG9uZTtcbiAgICAgICAgX2RvbS5jbGVhbnVwKHNjcmlwdCk7XG4gICAgICAgIGlmICghdGhpcy5fZmluaXNoZWQpIHtcbiAgICAgICAgICBsZXQgcmVzcG9uc2VPcHRpb25zID1cbiAgICAgICAgICAgICAgbmV3IFJlc3BvbnNlT3B0aW9ucyh7Ym9keTogSlNPTlBfRVJSX05PX0NBTExCQUNLLCB0eXBlOiBSZXNwb25zZVR5cGUuRXJyb3IsIHVybH0pO1xuICAgICAgICAgIGlmIChpc1ByZXNlbnQoYmFzZVJlc3BvbnNlT3B0aW9ucykpIHtcbiAgICAgICAgICAgIHJlc3BvbnNlT3B0aW9ucyA9IGJhc2VSZXNwb25zZU9wdGlvbnMubWVyZ2UocmVzcG9uc2VPcHRpb25zKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmVzcG9uc2VPYnNlcnZlci5lcnJvcihuZXcgUmVzcG9uc2UocmVzcG9uc2VPcHRpb25zKSk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHJlc3BvbnNlT3B0aW9ucyA9IG5ldyBSZXNwb25zZU9wdGlvbnMoe2JvZHk6IHRoaXMuX3Jlc3BvbnNlRGF0YSwgdXJsfSk7XG4gICAgICAgIGlmIChpc1ByZXNlbnQodGhpcy5iYXNlUmVzcG9uc2VPcHRpb25zKSkge1xuICAgICAgICAgIHJlc3BvbnNlT3B0aW9ucyA9IHRoaXMuYmFzZVJlc3BvbnNlT3B0aW9ucy5tZXJnZShyZXNwb25zZU9wdGlvbnMpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVzcG9uc2VPYnNlcnZlci5uZXh0KG5ldyBSZXNwb25zZShyZXNwb25zZU9wdGlvbnMpKTtcbiAgICAgICAgcmVzcG9uc2VPYnNlcnZlci5jb21wbGV0ZSgpO1xuICAgICAgfTtcblxuICAgICAgbGV0IG9uRXJyb3IgPSAoZXJyb3I6IEVycm9yKSA9PiB7XG4gICAgICAgIGlmICh0aGlzLnJlYWR5U3RhdGUgPT09IFJlYWR5U3RhdGUuQ2FuY2VsbGVkKSByZXR1cm47XG4gICAgICAgIHRoaXMucmVhZHlTdGF0ZSA9IFJlYWR5U3RhdGUuRG9uZTtcbiAgICAgICAgX2RvbS5jbGVhbnVwKHNjcmlwdCk7XG4gICAgICAgIGxldCByZXNwb25zZU9wdGlvbnMgPSBuZXcgUmVzcG9uc2VPcHRpb25zKHtib2R5OiBlcnJvci5tZXNzYWdlLCB0eXBlOiBSZXNwb25zZVR5cGUuRXJyb3J9KTtcbiAgICAgICAgaWYgKGlzUHJlc2VudChiYXNlUmVzcG9uc2VPcHRpb25zKSkge1xuICAgICAgICAgIHJlc3BvbnNlT3B0aW9ucyA9IGJhc2VSZXNwb25zZU9wdGlvbnMubWVyZ2UocmVzcG9uc2VPcHRpb25zKTtcbiAgICAgICAgfVxuICAgICAgICByZXNwb25zZU9ic2VydmVyLmVycm9yKG5ldyBSZXNwb25zZShyZXNwb25zZU9wdGlvbnMpKTtcbiAgICAgIH07XG5cbiAgICAgIHNjcmlwdC5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgb25Mb2FkKTtcbiAgICAgIHNjcmlwdC5hZGRFdmVudExpc3RlbmVyKCdlcnJvcicsIG9uRXJyb3IpO1xuXG4gICAgICBfZG9tLnNlbmQoc2NyaXB0KTtcblxuICAgICAgcmV0dXJuICgpID0+IHtcbiAgICAgICAgdGhpcy5yZWFkeVN0YXRlID0gUmVhZHlTdGF0ZS5DYW5jZWxsZWQ7XG4gICAgICAgIHNjcmlwdC5yZW1vdmVFdmVudExpc3RlbmVyKCdsb2FkJywgb25Mb2FkKTtcbiAgICAgICAgc2NyaXB0LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2Vycm9yJywgb25FcnJvcik7XG4gICAgICAgIGlmIChpc1ByZXNlbnQoc2NyaXB0KSkge1xuICAgICAgICAgIHRoaXMuX2RvbS5jbGVhbnVwKHNjcmlwdCk7XG4gICAgICAgIH1cblxuICAgICAgfTtcbiAgICB9KTtcbiAgfVxuXG4gIGZpbmlzaGVkKGRhdGE/OiBhbnkpIHtcbiAgICAvLyBEb24ndCBsZWFrIGNvbm5lY3Rpb25zXG4gICAgdGhpcy5fZmluaXNoZWQgPSB0cnVlO1xuICAgIHRoaXMuX2RvbS5yZW1vdmVDb25uZWN0aW9uKHRoaXMuX2lkKTtcbiAgICBpZiAodGhpcy5yZWFkeVN0YXRlID09PSBSZWFkeVN0YXRlLkNhbmNlbGxlZCkgcmV0dXJuO1xuICAgIHRoaXMuX3Jlc3BvbnNlRGF0YSA9IGRhdGE7XG4gIH1cbn1cblxuLyoqXG4gKiBBIHtAbGluayBDb25uZWN0aW9uQmFja2VuZH0gdGhhdCB1c2VzIHRoZSBKU09OUCBzdHJhdGVneSBvZiBtYWtpbmcgcmVxdWVzdHMuXG4gKi9cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBKU09OUEJhY2tlbmQgZXh0ZW5kcyBDb25uZWN0aW9uQmFja2VuZCB7fVxuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgSlNPTlBCYWNrZW5kXyBleHRlbmRzIEpTT05QQmFja2VuZCB7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgX2Jyb3dzZXJKU09OUDogQnJvd3Nlckpzb25wLCBwcml2YXRlIF9iYXNlUmVzcG9uc2VPcHRpb25zOiBSZXNwb25zZU9wdGlvbnMpIHtcbiAgICBzdXBlcigpO1xuICB9XG5cbiAgY3JlYXRlQ29ubmVjdGlvbihyZXF1ZXN0OiBSZXF1ZXN0KTogSlNPTlBDb25uZWN0aW9uIHtcbiAgICByZXR1cm4gbmV3IEpTT05QQ29ubmVjdGlvbl8ocmVxdWVzdCwgdGhpcy5fYnJvd3NlckpTT05QLCB0aGlzLl9iYXNlUmVzcG9uc2VPcHRpb25zKTtcbiAgfVxufVxuIl19