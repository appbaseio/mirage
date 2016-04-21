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
var message_bus_1 = require("angular2/src/web_workers/shared/message_bus");
var lang_1 = require("angular2/src/facade/lang");
var async_1 = require("angular2/src/facade/async");
var collection_1 = require("angular2/src/facade/collection");
var serializer_1 = require("angular2/src/web_workers/shared/serializer");
var di_1 = require("angular2/src/core/di");
var lang_2 = require("angular2/src/facade/lang");
var lang_3 = require("angular2/src/facade/lang");
exports.Type = lang_3.Type;
var ClientMessageBrokerFactory = (function () {
    function ClientMessageBrokerFactory() {
    }
    return ClientMessageBrokerFactory;
}());
exports.ClientMessageBrokerFactory = ClientMessageBrokerFactory;
var ClientMessageBrokerFactory_ = (function (_super) {
    __extends(ClientMessageBrokerFactory_, _super);
    function ClientMessageBrokerFactory_(_messageBus, _serializer) {
        _super.call(this);
        this._messageBus = _messageBus;
        this._serializer = _serializer;
    }
    /**
     * Initializes the given channel and attaches a new {@link ClientMessageBroker} to it.
     */
    ClientMessageBrokerFactory_.prototype.createMessageBroker = function (channel, runInZone) {
        if (runInZone === void 0) { runInZone = true; }
        this._messageBus.initChannel(channel, runInZone);
        return new ClientMessageBroker_(this._messageBus, this._serializer, channel);
    };
    ClientMessageBrokerFactory_ = __decorate([
        di_1.Injectable(), 
        __metadata('design:paramtypes', [message_bus_1.MessageBus, serializer_1.Serializer])
    ], ClientMessageBrokerFactory_);
    return ClientMessageBrokerFactory_;
}(ClientMessageBrokerFactory));
exports.ClientMessageBrokerFactory_ = ClientMessageBrokerFactory_;
var ClientMessageBroker = (function () {
    function ClientMessageBroker() {
    }
    return ClientMessageBroker;
}());
exports.ClientMessageBroker = ClientMessageBroker;
var ClientMessageBroker_ = (function (_super) {
    __extends(ClientMessageBroker_, _super);
    function ClientMessageBroker_(messageBus, _serializer, channel) {
        var _this = this;
        _super.call(this);
        this.channel = channel;
        this._pending = new Map();
        this._sink = messageBus.to(channel);
        this._serializer = _serializer;
        var source = messageBus.from(channel);
        async_1.ObservableWrapper.subscribe(source, function (message) { return _this._handleMessage(message); });
    }
    ClientMessageBroker_.prototype._generateMessageId = function (name) {
        var time = lang_1.stringify(lang_1.DateWrapper.toMillis(lang_1.DateWrapper.now()));
        var iteration = 0;
        var id = name + time + lang_1.stringify(iteration);
        while (lang_1.isPresent(this._pending[id])) {
            id = "" + name + time + iteration;
            iteration++;
        }
        return id;
    };
    ClientMessageBroker_.prototype.runOnService = function (args, returnType) {
        var _this = this;
        var fnArgs = [];
        if (lang_1.isPresent(args.args)) {
            args.args.forEach(function (argument) {
                if (argument.type != null) {
                    fnArgs.push(_this._serializer.serialize(argument.value, argument.type));
                }
                else {
                    fnArgs.push(argument.value);
                }
            });
        }
        var promise;
        var id = null;
        if (returnType != null) {
            var completer = async_1.PromiseWrapper.completer();
            id = this._generateMessageId(args.method);
            this._pending.set(id, completer);
            async_1.PromiseWrapper.catchError(completer.promise, function (err, stack) {
                lang_1.print(err);
                completer.reject(err, stack);
            });
            promise = async_1.PromiseWrapper.then(completer.promise, function (value) {
                if (_this._serializer == null) {
                    return value;
                }
                else {
                    return _this._serializer.deserialize(value, returnType);
                }
            });
        }
        else {
            promise = null;
        }
        // TODO(jteplitz602): Create a class for these messages so we don't keep using StringMap #3685
        var message = { 'method': args.method, 'args': fnArgs };
        if (id != null) {
            message['id'] = id;
        }
        async_1.ObservableWrapper.callEmit(this._sink, message);
        return promise;
    };
    ClientMessageBroker_.prototype._handleMessage = function (message) {
        var data = new MessageData(message);
        // TODO(jteplitz602): replace these strings with messaging constants #3685
        if (lang_2.StringWrapper.equals(data.type, "result") || lang_2.StringWrapper.equals(data.type, "error")) {
            var id = data.id;
            if (this._pending.has(id)) {
                if (lang_2.StringWrapper.equals(data.type, "result")) {
                    this._pending.get(id).resolve(data.value);
                }
                else {
                    this._pending.get(id).reject(data.value, null);
                }
                this._pending.delete(id);
            }
        }
    };
    return ClientMessageBroker_;
}(ClientMessageBroker));
exports.ClientMessageBroker_ = ClientMessageBroker_;
var MessageData = (function () {
    function MessageData(data) {
        this.type = collection_1.StringMapWrapper.get(data, "type");
        this.id = this._getValueIfPresent(data, "id");
        this.value = this._getValueIfPresent(data, "value");
    }
    /**
     * Returns the value from the StringMap if present. Otherwise returns null
     * @internal
     */
    MessageData.prototype._getValueIfPresent = function (data, key) {
        if (collection_1.StringMapWrapper.contains(data, key)) {
            return collection_1.StringMapWrapper.get(data, key);
        }
        else {
            return null;
        }
    };
    return MessageData;
}());
var FnArg = (function () {
    function FnArg(value, type) {
        this.value = value;
        this.type = type;
    }
    return FnArg;
}());
exports.FnArg = FnArg;
var UiArguments = (function () {
    function UiArguments(method, args) {
        this.method = method;
        this.args = args;
    }
    return UiArguments;
}());
exports.UiArguments = UiArguments;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpZW50X21lc3NhZ2VfYnJva2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZGlmZmluZ19wbHVnaW5fd3JhcHBlci1vdXRwdXRfcGF0aC1qYWtYbk1tTC50bXAvYW5ndWxhcjIvc3JjL3dlYl93b3JrZXJzL3NoYXJlZC9jbGllbnRfbWVzc2FnZV9icm9rZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsNEJBQXlCLDZDQUE2QyxDQUFDLENBQUE7QUFDdkUscUJBQXVELDBCQUEwQixDQUFDLENBQUE7QUFDbEYsc0JBS08sMkJBQTJCLENBQUMsQ0FBQTtBQUNuQywyQkFBMkMsZ0NBQWdDLENBQUMsQ0FBQTtBQUM1RSwyQkFBeUIsNENBQTRDLENBQUMsQ0FBQTtBQUN0RSxtQkFBeUIsc0JBQXNCLENBQUMsQ0FBQTtBQUNoRCxxQkFBa0MsMEJBQTBCLENBQUMsQ0FBQTtBQUM3RCxxQkFBbUIsMEJBQTBCLENBQUM7QUFBdEMsMkJBQXNDO0FBRTlDO0lBQUE7SUFLQSxDQUFDO0lBQUQsaUNBQUM7QUFBRCxDQUFDLEFBTEQsSUFLQztBQUxxQixrQ0FBMEIsNkJBSy9DLENBQUE7QUFHRDtJQUFpRCwrQ0FBMEI7SUFHekUscUNBQW9CLFdBQXVCLEVBQUUsV0FBdUI7UUFDbEUsaUJBQU8sQ0FBQztRQURVLGdCQUFXLEdBQVgsV0FBVyxDQUFZO1FBRXpDLElBQUksQ0FBQyxXQUFXLEdBQUcsV0FBVyxDQUFDO0lBQ2pDLENBQUM7SUFFRDs7T0FFRztJQUNILHlEQUFtQixHQUFuQixVQUFvQixPQUFlLEVBQUUsU0FBeUI7UUFBekIseUJBQXlCLEdBQXpCLGdCQUF5QjtRQUM1RCxJQUFJLENBQUMsV0FBVyxDQUFDLFdBQVcsQ0FBQyxPQUFPLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFDakQsTUFBTSxDQUFDLElBQUksb0JBQW9CLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsV0FBVyxFQUFFLE9BQU8sQ0FB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LElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQztJQUN0RCxDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsd0NBQWtCLEdBQWxCLFVBQW1CLElBQTBCLEVBQUUsR0FBVztRQUN4RCxFQUFFLENBQUMsQ0FBQyw2QkFBZ0IsQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN6QyxNQUFNLENBQUMsNkJBQWdCLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQztRQUN6QyxDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDTixNQUFNLENBQUMsSUFBSSxDQUFDO1FBQ2QsQ0FBQztJQUNILENBQUM7SUFDSCxrQkFBQztBQUFELENBQUMsQUF0QkQsSUFzQkM7QUFFRDtJQUNFLGVBQW1CLEtBQUssRUFBUyxJQUFVO1FBQXhCLFVBQUssR0FBTCxLQUFLLENBQUE7UUFBUyxTQUFJLEdBQUosSUFBSSxDQUFNO0lBQUcsQ0FBQztJQUNqRCxZQUFDO0FBQUQsQ0FBQyxBQUZELElBRUM7QUFGWSxhQUFLLFFBRWpCLENBQUE7QUFFRDtJQUNFLHFCQUFtQixNQUFjLEVBQVMsSUFBYztRQUFyQyxXQUFNLEdBQU4sTUFBTSxDQUFRO1FBQVMsU0FBSSxHQUFKLElBQUksQ0FBVTtJQUFHLENBQUM7SUFDOUQsa0JBQUM7QUFBRCxDQUFDLEFBRkQsSUFFQztBQUZZLG1CQUFXLGNBRXZCLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge01lc3NhZ2VCdXN9IGZyb20gXCJhbmd1bGFyMi9zcmMvd2ViX3dvcmtlcnMvc2hhcmVkL21lc3NhZ2VfYnVzXCI7XG5pbXBvcnQge3ByaW50LCBpc1ByZXNlbnQsIERhdGVXcmFwcGVyLCBzdHJpbmdpZnl9IGZyb20gXCJhbmd1bGFyMi9zcmMvZmFjYWRlL2xhbmdcIjtcbmltcG9ydCB7XG4gIFByb21pc2VDb21wbGV0ZXIsXG4gIFByb21pc2VXcmFwcGVyLFxuICBPYnNlcnZhYmxlV3JhcHBlcixcbiAgRXZlbnRFbWl0dGVyXG59IGZyb20gXCJhbmd1bGFyMi9zcmMvZmFjYWRlL2FzeW5jXCI7XG5pbXBvcnQge1N0cmluZ01hcFdyYXBwZXIsIE1hcFdyYXBwZXJ9IGZyb20gXCJhbmd1bGFyMi9zcmMvZmFjYWRlL2NvbGxlY3Rpb25cIjtcbmltcG9ydCB7U2VyaWFsaXplcn0gZnJvbSBcImFuZ3VsYXIyL3NyYy93ZWJfd29ya2Vycy9zaGFyZWQvc2VyaWFsaXplclwiO1xuaW1wb3J0IHtJbmplY3RhYmxlfSBmcm9tIFwiYW5ndWxhcjIvc3JjL2NvcmUvZGlcIjtcbmltcG9ydCB7VHlwZSwgU3RyaW5nV3JhcHBlcn0gZnJvbSBcImFuZ3VsYXIyL3NyYy9mYWNhZGUvbGFuZ1wiO1xuZXhwb3J0IHtUeXBlfSBmcm9tIFwiYW5ndWxhcjIvc3JjL2ZhY2FkZS9sYW5nXCI7XG5cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBDbGllbnRNZXNzYWdlQnJva2VyRmFjdG9yeSB7XG4gIC8qKlxuICAgKiBJbml0aWFsaXplcyB0aGUgZ2l2ZW4gY2hhbm5lbCBhbmQgYXR0YWNoZXMgYSBuZXcge0BsaW5rIENsaWVudE1lc3NhZ2VCcm9rZXJ9IHRvIGl0LlxuICAgKi9cbiAgYWJzdHJhY3QgY3JlYXRlTWVzc2FnZUJyb2tlcihjaGFubmVsOiBzdHJpbmcsIHJ1bkluWm9uZT86IGJvb2xlYW4pOiBDbGllbnRNZXNzYWdlQnJva2VyO1xufVxuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgQ2xpZW50TWVzc2FnZUJyb2tlckZhY3RvcnlfIGV4dGVuZHMgQ2xpZW50TWVzc2FnZUJyb2tlckZhY3Rvcnkge1xuICAvKiogQGludGVybmFsICovXG4gIHB1YmxpYyBfc2VyaWFsaXplcjogU2VyaWFsaXplcjtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBfbWVzc2FnZUJ1czogTWVzc2FnZUJ1cywgX3NlcmlhbGl6ZXI6IFNlcmlhbGl6ZXIpIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMuX3NlcmlhbGl6ZXIgPSBfc2VyaWFsaXplcjtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbml0aWFsaXplcyB0aGUgZ2l2ZW4gY2hhbm5lbCBhbmQgYXR0YWNoZXMgYSBuZXcge0BsaW5rIENsaWVudE1lc3NhZ2VCcm9rZXJ9IHRvIGl0LlxuICAgKi9cbiAgY3JlYXRlTWVzc2FnZUJyb2tlcihjaGFubmVsOiBzdHJpbmcsIHJ1bkluWm9uZTogYm9vbGVhbiA9IHRydWUpOiBDbGllbnRNZXNzYWdlQnJva2VyIHtcbiAgICB0aGlzLl9tZXNzYWdlQnVzLmluaXRDaGFubmVsKGNoYW5uZWwsIHJ1bkluWm9uZSk7XG4gICAgcmV0dXJuIG5ldyBDbGllbnRNZXNzYWdlQnJva2VyXyh0aGlzLl9tZXNzYWdlQnVzLCB0aGlzLl9zZXJpYWxpemVyLCBjaGFubmVsKTtcbiAgfVxufVxuXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgQ2xpZW50TWVzc2FnZUJyb2tlciB7XG4gIGFic3RyYWN0IHJ1bk9uU2VydmljZShhcmdzOiBVaUFyZ3VtZW50cywgcmV0dXJuVHlwZTogVHlwZSk6IFByb21pc2U8YW55Pjtcbn1cblxuZXhwb3J0IGNsYXNzIENsaWVudE1lc3NhZ2VCcm9rZXJfIGV4dGVuZHMgQ2xpZW50TWVzc2FnZUJyb2tlciB7XG4gIHByaXZhdGUgX3BlbmRpbmc6IE1hcDxzdHJpbmcsIFByb21pc2VDb21wbGV0ZXI8YW55Pj4gPSBuZXcgTWFwPHN0cmluZywgUHJvbWlzZUNvbXBsZXRlcjxhbnk+PigpO1xuICBwcml2YXRlIF9zaW5rOiBFdmVudEVtaXR0ZXI8YW55PjtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBwdWJsaWMgX3NlcmlhbGl6ZXI6IFNlcmlhbGl6ZXI7XG5cbiAgY29uc3RydWN0b3IobWVzc2FnZUJ1czogTWVzc2FnZUJ1cywgX3NlcmlhbGl6ZXI6IFNlcmlhbGl6ZXIsIHB1YmxpYyBjaGFubmVsKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLl9zaW5rID0gbWVzc2FnZUJ1cy50byhjaGFubmVsKTtcbiAgICB0aGlzLl9zZXJpYWxpemVyID0gX3NlcmlhbGl6ZXI7XG4gICAgdmFyIHNvdXJjZSA9IG1lc3NhZ2VCdXMuZnJvbShjaGFubmVsKTtcbiAgICBPYnNlcnZhYmxlV3JhcHBlci5zdWJzY3JpYmUoc291cmNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAobWVzc2FnZToge1trZXk6IHN0cmluZ106IGFueX0pID0+IHRoaXMuX2hhbmRsZU1lc3NhZ2UobWVzc2FnZSkpO1xuICB9XG5cbiAgcHJpdmF0ZSBfZ2VuZXJhdGVNZXNzYWdlSWQobmFtZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgICB2YXIgdGltZTogc3RyaW5nID0gc3RyaW5naWZ5KERhdGVXcmFwcGVyLnRvTWlsbGlzKERhdGVXcmFwcGVyLm5vdygpKSk7XG4gICAgdmFyIGl0ZXJhdGlvbjogbnVtYmVyID0gMDtcbiAgICB2YXIgaWQ6IHN0cmluZyA9IG5hbWUgKyB0aW1lICsgc3RyaW5naWZ5KGl0ZXJhdGlvbik7XG4gICAgd2hpbGUgKGlzUHJlc2VudCh0aGlzLl9wZW5kaW5nW2lkXSkpIHtcbiAgICAgIGlkID0gYCR7bmFtZX0ke3RpbWV9JHtpdGVyYXRpb259YDtcbiAgICAgIGl0ZXJhdGlvbisrO1xuICAgIH1cbiAgICByZXR1cm4gaWQ7XG4gIH1cblxuICBydW5PblNlcnZpY2UoYXJnczogVWlBcmd1bWVudHMsIHJldHVyblR5cGU6IFR5cGUpOiBQcm9taXNlPGFueT4ge1xuICAgIHZhciBmbkFyZ3MgPSBbXTtcbiAgICBpZiAoaXNQcmVzZW50KGFyZ3MuYXJncykpIHtcbiAgICAgIGFyZ3MuYXJncy5mb3JFYWNoKGFyZ3VtZW50ID0+IHtcbiAgICAgICAgaWYgKGFyZ3VtZW50LnR5cGUgIT0gbnVsbCkge1xuICAgICAgICAgIGZuQXJncy5wdXNoKHRoaXMuX3NlcmlhbGl6ZXIuc2VyaWFsaXplKGFyZ3VtZW50LnZhbHVlLCBhcmd1bWVudC50eXBlKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZm5BcmdzLnB1c2goYXJndW1lbnQudmFsdWUpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICB2YXIgcHJvbWlzZTogUHJvbWlzZTxhbnk+O1xuICAgIHZhciBpZDogc3RyaW5nID0gbnVsbDtcbiAgICBpZiAocmV0dXJuVHlwZSAhPSBudWxsKSB7XG4gICAgICB2YXIgY29tcGxldGVyOiBQcm9taXNlQ29tcGxldGVyPGFueT4gPSBQcm9taXNlV3JhcHBlci5jb21wbGV0ZXIoKTtcbiAgICAgIGlkID0gdGhpcy5fZ2VuZXJhdGVNZXNzYWdlSWQoYXJncy5tZXRob2QpO1xuICAgICAgdGhpcy5fcGVuZGluZy5zZXQoaWQsIGNvbXBsZXRlcik7XG4gICAgICBQcm9taXNlV3JhcHBlci5jYXRjaEVycm9yKGNvbXBsZXRlci5wcm9taXNlLCAoZXJyLCBzdGFjaz8pID0+IHtcbiAgICAgICAgcHJpbnQoZXJyKTtcbiAgICAgICAgY29tcGxldGVyLnJlamVjdChlcnIsIHN0YWNrKTtcbiAgICAgIH0pO1xuXG4gICAgICBwcm9taXNlID0gUHJvbWlzZVdyYXBwZXIudGhlbihjb21wbGV0ZXIucHJvbWlzZSwgKHZhbHVlOiBhbnkpID0+IHtcbiAgICAgICAgaWYgKHRoaXMuX3NlcmlhbGl6ZXIgPT0gbnVsbCkge1xuICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5fc2VyaWFsaXplci5kZXNlcmlhbGl6ZSh2YWx1ZSwgcmV0dXJuVHlwZSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBwcm9taXNlID0gbnVsbDtcbiAgICB9XG5cbiAgICAvLyBUT0RPKGp0ZXBsaXR6NjAyKTogQ3JlYXRlIGEgY2xhc3MgZm9yIHRoZXNlIG1lc3NhZ2VzIHNvIHdlIGRvbid0IGtlZXAgdXNpbmcgU3RyaW5nTWFwICMzNjg1XG4gICAgdmFyIG1lc3NhZ2UgPSB7J21ldGhvZCc6IGFyZ3MubWV0aG9kLCAnYXJncyc6IGZuQXJnc307XG4gICAgaWYgKGlkICE9IG51bGwpIHtcbiAgICAgIG1lc3NhZ2VbJ2lkJ10gPSBpZDtcbiAgICB9XG4gICAgT2JzZXJ2YWJsZVdyYXBwZXIuY2FsbEVtaXQodGhpcy5fc2luaywgbWVzc2FnZSk7XG5cbiAgICByZXR1cm4gcHJvbWlzZTtcbiAgfVxuXG4gIHByaXZhdGUgX2hhbmRsZU1lc3NhZ2UobWVzc2FnZToge1trZXk6IHN0cmluZ106IGFueX0pOiB2b2lkIHtcbiAgICB2YXIgZGF0YSA9IG5ldyBNZXNzYWdlRGF0YShtZXNzYWdlKTtcbiAgICAvLyBUT0RPKGp0ZXBsaXR6NjAyKTogcmVwbGFjZSB0aGVzZSBzdHJpbmdzIHdpdGggbWVzc2FnaW5nIGNvbnN0YW50cyAjMzY4NVxuICAgIGlmIChTdHJpbmdXcmFwcGVyLmVxdWFscyhkYXRhLnR5cGUsIFwicmVzdWx0XCIpIHx8IFN0cmluZ1dyYXBwZXIuZXF1YWxzKGRhdGEudHlwZSwgXCJlcnJvclwiKSkge1xuICAgICAgdmFyIGlkID0gZGF0YS5pZDtcbiAgICAgIGlmICh0aGlzLl9wZW5kaW5nLmhhcyhpZCkpIHtcbiAgICAgICAgaWYgKFN0cmluZ1dyYXBwZXIuZXF1YWxzKGRhdGEudHlwZSwgXCJyZXN1bHRcIikpIHtcbiAgICAgICAgICB0aGlzLl9wZW5kaW5nLmdldChpZCkucmVzb2x2ZShkYXRhLnZhbHVlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLl9wZW5kaW5nLmdldChpZCkucmVqZWN0KGRhdGEudmFsdWUsIG51bGwpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX3BlbmRpbmcuZGVsZXRlKGlkKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuY2xhc3MgTWVzc2FnZURhdGEge1xuICB0eXBlOiBzdHJpbmc7XG4gIHZhbHVlOiBhbnk7XG4gIGlkOiBzdHJpbmc7XG5cbiAgY29uc3RydWN0b3IoZGF0YToge1trZXk6IHN0cmluZ106IGFueX0pIHtcbiAgICB0aGlzLnR5cGUgPSBTdHJpbmdNYXBXcmFwcGVyLmdldChkYXRhLCBcInR5cGVcIik7XG4gICAgdGhpcy5pZCA9IHRoaXMuX2dldFZhbHVlSWZQcmVzZW50KGRhdGEsIFwiaWRcIik7XG4gICAgdGhpcy52YWx1ZSA9IHRoaXMuX2dldFZhbHVlSWZQcmVzZW50KGRhdGEsIFwidmFsdWVcIik7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgdmFsdWUgZnJvbSB0aGUgU3RyaW5nTWFwIGlmIHByZXNlbnQuIE90aGVyd2lzZSByZXR1cm5zIG51bGxcbiAgICogQGludGVybmFsXG4gICAqL1xuICBfZ2V0VmFsdWVJZlByZXNlbnQoZGF0YToge1trZXk6IHN0cmluZ106IGFueX0sIGtleTogc3RyaW5nKSB7XG4gICAgaWYgKFN0cmluZ01hcFdyYXBwZXIuY29udGFpbnMoZGF0YSwga2V5KSkge1xuICAgICAgcmV0dXJuIFN0cmluZ01hcFdyYXBwZXIuZ2V0KGRhdGEsIGtleSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgRm5Bcmcge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgdmFsdWUsIHB1YmxpYyB0eXBlOiBUeXBlKSB7fVxufVxuXG5leHBvcnQgY2xhc3MgVWlBcmd1bWVudHMge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgbWV0aG9kOiBzdHJpbmcsIHB1YmxpYyBhcmdzPzogRm5BcmdbXSkge31cbn1cbiJdfQ==