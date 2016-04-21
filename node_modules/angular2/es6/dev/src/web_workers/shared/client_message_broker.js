var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { MessageBus } from "angular2/src/web_workers/shared/message_bus";
import { print, isPresent, DateWrapper, stringify } from "angular2/src/facade/lang";
import { PromiseWrapper, ObservableWrapper } from "angular2/src/facade/async";
import { StringMapWrapper } from "angular2/src/facade/collection";
import { Serializer } from "angular2/src/web_workers/shared/serializer";
import { Injectable } from "angular2/src/core/di";
import { StringWrapper } from "angular2/src/facade/lang";
export { Type } from "angular2/src/facade/lang";
export class ClientMessageBrokerFactory {
}
export let ClientMessageBrokerFactory_ = class ClientMessageBrokerFactory_ extends ClientMessageBrokerFactory {
    constructor(_messageBus, _serializer) {
        super();
        this._messageBus = _messageBus;
        this._serializer = _serializer;
    }
    /**
     * Initializes the given channel and attaches a new {@link ClientMessageBroker} to it.
     */
    createMessageBroker(channel, runInZone = true) {
        this._messageBus.initChannel(channel, runInZone);
        return new ClientMessageBroker_(this._messageBus, this._serializer, channel);
    }
};
ClientMessageBrokerFactory_ = __decorate([
    Injectable(), 
    __metadata('design:paramtypes', [MessageBus, Serializer])
], ClientMessageBrokerFactory_);
export class ClientMessageBroker {
}
export class ClientMessageBroker_ extends ClientMessageBroker {
    constructor(messageBus, _serializer, channel) {
        super();
        this.channel = channel;
        this._pending = new Map();
        this._sink = messageBus.to(channel);
        this._serializer = _serializer;
        var source = messageBus.from(channel);
        ObservableWrapper.subscribe(source, (message) => this._handleMessage(message));
    }
    _generateMessageId(name) {
        var time = stringify(DateWrapper.toMillis(DateWrapper.now()));
        var iteration = 0;
        var id = name + time + stringify(iteration);
        while (isPresent(this._pending[id])) {
            id = `${name}${time}${iteration}`;
            iteration++;
        }
        return id;
    }
    runOnService(args, returnType) {
        var fnArgs = [];
        if (isPresent(args.args)) {
            args.args.forEach(argument => {
                if (argument.type != null) {
                    fnArgs.push(this._serializer.serialize(argument.value, argument.type));
                }
                else {
                    fnArgs.push(argument.value);
                }
            });
        }
        var promise;
        var id = null;
        if (returnType != null) {
            var completer = PromiseWrapper.completer();
            id = this._generateMessageId(args.method);
            this._pending.set(id, completer);
            PromiseWrapper.catchError(completer.promise, (err, stack) => {
                print(err);
                completer.reject(err, stack);
            });
            promise = PromiseWrapper.then(completer.promise, (value) => {
                if (this._serializer == null) {
                    return value;
                }
                else {
                    return this._serializer.deserialize(value, returnType);
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
        ObservableWrapper.callEmit(this._sink, message);
        return promise;
    }
    _handleMessage(message) {
        var data = new MessageData(message);
        // TODO(jteplitz602): replace these strings with messaging constants #3685
        if (StringWrapper.equals(data.type, "result") || StringWrapper.equals(data.type, "error")) {
            var id = data.id;
            if (this._pending.has(id)) {
                if (StringWrapper.equals(data.type, "result")) {
                    this._pending.get(id).resolve(data.value);
                }
                else {
                    this._pending.get(id).reject(data.value, null);
                }
                this._pending.delete(id);
            }
        }
    }
}
class MessageData {
    constructor(data) {
        this.type = StringMapWrapper.get(data, "type");
        this.id = this._getValueIfPresent(data, "id");
        this.value = this._getValueIfPresent(data, "value");
    }
    /**
     * Returns the value from the StringMap if present. Otherwise returns null
     * @internal
     */
    _getValueIfPresent(data, key) {
        if (StringMapWrapper.contains(data, key)) {
            return StringMapWrapper.get(data, key);
        }
        else {
            return null;
        }
    }
}
export class FnArg {
    constructor(value, type) {
        this.value = value;
        this.type = type;
    }
}
export class UiArguments {
    constructor(method, args) {
        this.method = method;
        this.args = args;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpZW50X21lc3NhZ2VfYnJva2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZGlmZmluZ19wbHVnaW5fd3JhcHBlci1vdXRwdXRfcGF0aC1vWERPNHAydi50bXAvYW5ndWxhcjIvc3JjL3dlYl93b3JrZXJzL3NoYXJlZC9jbGllbnRfbWVzc2FnZV9icm9rZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O09BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSw2Q0FBNkM7T0FDL0QsRUFBQyxLQUFLLEVBQUUsU0FBUyxFQUFFLFdBQVcsRUFBRSxTQUFTLEVBQUMsTUFBTSwwQkFBMEI7T0FDMUUsRUFFTCxjQUFjLEVBQ2QsaUJBQWlCLEVBRWxCLE1BQU0sMkJBQTJCO09BQzNCLEVBQUMsZ0JBQWdCLEVBQWEsTUFBTSxnQ0FBZ0M7T0FDcEUsRUFBQyxVQUFVLEVBQUMsTUFBTSw0Q0FBNEM7T0FDOUQsRUFBQyxVQUFVLEVBQUMsTUFBTSxzQkFBc0I7T0FDeEMsRUFBTyxhQUFhLEVBQUMsTUFBTSwwQkFBMEI7QUFDNUQsU0FBUSxJQUFJLFFBQU8sMEJBQTBCLENBQUM7QUFFOUM7QUFLQSxDQUFDO0FBR0QsbUZBQWlELDBCQUEwQjtJQUd6RSxZQUFvQixXQUF1QixFQUFFLFdBQXVCO1FBQ2xFLE9BQU8sQ0FBQztRQURVLGdCQUFXLEdBQVgsV0FBVyxDQUFZO1FBRXpDLElBQUksQ0FBQyxXQUFXLEdBQUcsV0FBVyxDQUFDO0lBQ2pDLENBQUM7SUFFRDs7T0FFRztJQUNILG1CQUFtQixDQUFDLE9BQWUsRUFBRSxTQUFTLEdBQVksSUFBSTtRQUM1RCxJQUFJLENBQUMsV0FBVyxDQUFDLFdBQVcsQ0FBQyxPQUFPLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFDakQsTUFBTSxDQUFDLElBQUksb0JBQW9CLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsV0FBVyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQy9FLENBQUM7QUFDSCxDQUFDO0FBaEJEO0lBQUMsVUFBVSxFQUFFOzsrQkFBQTtBQWtCYjtBQUVBLENBQUM7QUFFRCwwQ0FBMEMsbUJBQW1CO0lBTTNELFlBQVksVUFBc0IsRUFBRSxXQUF1QixFQUFTLE9BQU87UUFDekUsT0FBTyxDQUFDO1FBRDBELFlBQU8sR0FBUCxPQUFPLENBQUE7UUFMbkUsYUFBUSxHQUF1QyxJQUFJLEdBQUcsRUFBaUMsQ0FBQztRQU85RixJQUFJLENBQUMsS0FBSyxHQUFHLFVBQVUsQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDcEMsSUFBSSxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUM7UUFDL0IsSUFBSSxNQUFNLEdBQUcsVUFBVSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUN0QyxpQkFBaUIsQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUNOLENBQUMsT0FBNkIsS0FBSyxJQUFJLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7SUFDL0YsQ0FBQztJQUVPLGtCQUFrQixDQUFDLElBQVk7UUFDckMsSUFBSSxJQUFJLEdBQVcsU0FBUyxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUN0RSxJQUFJLFNBQVMsR0FBVyxDQUFDLENBQUM7UUFDMUIsSUFBSSxFQUFFLEdBQVcsSUFBSSxHQUFHLElBQUksR0FBRyxTQUFTLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDcEQsT0FBTyxTQUFTLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUM7WUFDcEMsRUFBRSxHQUFHLEdBQUcsSUFBSSxHQUFHLElBQUksR0FBRyxTQUFTLEVBQUUsQ0FBQztZQUNsQyxTQUFTLEVBQUUsQ0FBQztRQUNkLENBQUM7UUFDRCxNQUFNLENBQUMsRUFBRSxDQUFDO0lBQ1osQ0FBQztJQUVELFlBQVksQ0FBQyxJQUFpQixFQUFFLFVBQWdCO1FBQzlDLElBQUksTUFBTSxHQUFHLEVBQUUsQ0FBQztRQUNoQixFQUFFLENBQUMsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN6QixJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRO2dCQUN4QixFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUM7b0JBQzFCLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDekUsQ0FBQztnQkFBQyxJQUFJLENBQUMsQ0FBQztvQkFDTixNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDOUIsQ0FBQztZQUNILENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQztRQUVELElBQUksT0FBcUIsQ0FBQztRQUMxQixJQUFJLEVBQUUsR0FBVyxJQUFJLENBQUM7UUFDdEIsRUFBRSxDQUFDLENBQUMsVUFBVSxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDdkIsSUFBSSxTQUFTLEdBQTBCLGNBQWMsQ0FBQyxTQUFTLEVBQUUsQ0FBQztZQUNsRSxFQUFFLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUMxQyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsU0FBUyxDQUFDLENBQUM7WUFDakMsY0FBYyxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsT0FBTyxFQUFFLENBQUMsR0FBRyxFQUFFLEtBQU07Z0JBQ3ZELEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDWCxTQUFTLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQztZQUMvQixDQUFDLENBQUMsQ0FBQztZQUVILE9BQU8sR0FBRyxjQUFjLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxLQUFVO2dCQUMxRCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsV0FBVyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUM7b0JBQzdCLE1BQU0sQ0FBQyxLQUFLLENBQUM7Z0JBQ2YsQ0FBQztnQkFBQyxJQUFJLENBQUMsQ0FBQztvQkFDTixNQUFNLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUMsS0FBSyxFQUFFLFVBQVUsQ0FBQyxDQUFDO2dCQUN6RCxDQUFDO1lBQ0gsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDTixPQUFPLEdBQUcsSUFBSSxDQUFDO1FBQ2pCLENBQUM7UUFFRCw4RkFBOEY7UUFDOUYsSUFBSSxPQUFPLEdBQUcsRUFBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLE1BQU0sRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFDLENBQUM7UUFDdEQsRUFBRSxDQUFDLENBQUMsRUFBRSxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDZixPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDO1FBQ3JCLENBQUM7UUFDRCxpQkFBaUIsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxPQUFPLENBQUMsQ0FBQztRQUVoRCxNQUFNLENBQUMsT0FBTyxDQUFDO0lBQ2pCLENBQUM7SUFFTyxjQUFjLENBQUMsT0FBNkI7UUFDbEQsSUFBSSxJQUFJLEdBQUcsSUFBSSxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDcEMsMEVBQTBFO1FBQzFFLEVBQUUsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsSUFBSSxhQUFhLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzFGLElBQUksRUFBRSxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUM7WUFDakIsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUMxQixFQUFFLENBQUMsQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUM5QyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUM1QyxDQUFDO2dCQUFDLElBQUksQ0FBQyxDQUFDO29CQUNOLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDO2dCQUNqRCxDQUFDO2dCQUNELElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQzNCLENBQUM7UUFDSCxDQUFDO0lBQ0gsQ0FBQztBQUNILENBQUM7QUFFRDtJQUtFLFlBQVksSUFBMEI7UUFDcEMsSUFBSSxDQUFDLElBQUksR0FBRyxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQy9DLElBQUksQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztRQUM5QyxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDdEQsQ0FBQztJQUVEOzs7T0FHRztJQUNILGtCQUFrQixDQUFDLElBQTBCLEVBQUUsR0FBVztRQUN4RCxFQUFFLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN6QyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQztRQUN6QyxDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDTixNQUFNLENBQUMsSUFBSSxDQUFDO1FBQ2QsQ0FBQztJQUNILENBQUM7QUFDSCxDQUFDO0FBRUQ7SUFDRSxZQUFtQixLQUFLLEVBQVMsSUFBVTtRQUF4QixVQUFLLEdBQUwsS0FBSyxDQUFBO1FBQVMsU0FBSSxHQUFKLElBQUksQ0FBTTtJQUFHLENBQUM7QUFDakQsQ0FBQztBQUVEO0lBQ0UsWUFBbUIsTUFBYyxFQUFTLElBQWM7UUFBckMsV0FBTSxHQUFOLE1BQU0sQ0FBUTtRQUFTLFNBQUksR0FBSixJQUFJLENBQVU7SUFBRyxDQUFDO0FBQzlELENBQUM7QUFBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7TWVzc2FnZUJ1c30gZnJvbSBcImFuZ3VsYXIyL3NyYy93ZWJfd29ya2Vycy9zaGFyZWQvbWVzc2FnZV9idXNcIjtcbmltcG9ydCB7cHJpbnQsIGlzUHJlc2VudCwgRGF0ZVdyYXBwZXIsIHN0cmluZ2lmeX0gZnJvbSBcImFuZ3VsYXIyL3NyYy9mYWNhZGUvbGFuZ1wiO1xuaW1wb3J0IHtcbiAgUHJvbWlzZUNvbXBsZXRlcixcbiAgUHJvbWlzZVdyYXBwZXIsXG4gIE9ic2VydmFibGVXcmFwcGVyLFxuICBFdmVudEVtaXR0ZXJcbn0gZnJvbSBcImFuZ3VsYXIyL3NyYy9mYWNhZGUvYXN5bmNcIjtcbmltcG9ydCB7U3RyaW5nTWFwV3JhcHBlciwgTWFwV3JhcHBlcn0gZnJvbSBcImFuZ3VsYXIyL3NyYy9mYWNhZGUvY29sbGVjdGlvblwiO1xuaW1wb3J0IHtTZXJpYWxpemVyfSBmcm9tIFwiYW5ndWxhcjIvc3JjL3dlYl93b3JrZXJzL3NoYXJlZC9zZXJpYWxpemVyXCI7XG5pbXBvcnQge0luamVjdGFibGV9IGZyb20gXCJhbmd1bGFyMi9zcmMvY29yZS9kaVwiO1xuaW1wb3J0IHtUeXBlLCBTdHJpbmdXcmFwcGVyfSBmcm9tIFwiYW5ndWxhcjIvc3JjL2ZhY2FkZS9sYW5nXCI7XG5leHBvcnQge1R5cGV9IGZyb20gXCJhbmd1bGFyMi9zcmMvZmFjYWRlL2xhbmdcIjtcblxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIENsaWVudE1lc3NhZ2VCcm9rZXJGYWN0b3J5IHtcbiAgLyoqXG4gICAqIEluaXRpYWxpemVzIHRoZSBnaXZlbiBjaGFubmVsIGFuZCBhdHRhY2hlcyBhIG5ldyB7QGxpbmsgQ2xpZW50TWVzc2FnZUJyb2tlcn0gdG8gaXQuXG4gICAqL1xuICBhYnN0cmFjdCBjcmVhdGVNZXNzYWdlQnJva2VyKGNoYW5uZWw6IHN0cmluZywgcnVuSW5ab25lPzogYm9vbGVhbik6IENsaWVudE1lc3NhZ2VCcm9rZXI7XG59XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBDbGllbnRNZXNzYWdlQnJva2VyRmFjdG9yeV8gZXh0ZW5kcyBDbGllbnRNZXNzYWdlQnJva2VyRmFjdG9yeSB7XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgcHVibGljIF9zZXJpYWxpemVyOiBTZXJpYWxpemVyO1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9tZXNzYWdlQnVzOiBNZXNzYWdlQnVzLCBfc2VyaWFsaXplcjogU2VyaWFsaXplcikge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5fc2VyaWFsaXplciA9IF9zZXJpYWxpemVyO1xuICB9XG5cbiAgLyoqXG4gICAqIEluaXRpYWxpemVzIHRoZSBnaXZlbiBjaGFubmVsIGFuZCBhdHRhY2hlcyBhIG5ldyB7QGxpbmsgQ2xpZW50TWVzc2FnZUJyb2tlcn0gdG8gaXQuXG4gICAqL1xuICBjcmVhdGVNZXNzYWdlQnJva2VyKGNoYW5uZWw6IHN0cmluZywgcnVuSW5ab25lOiBib29sZWFuID0gdHJ1ZSk6IENsaWVudE1lc3NhZ2VCcm9rZXIge1xuICAgIHRoaXMuX21lc3NhZ2VCdXMuaW5pdENoYW5uZWwoY2hhbm5lbCwgcnVuSW5ab25lKTtcbiAgICByZXR1cm4gbmV3IENsaWVudE1lc3NhZ2VCcm9rZXJfKHRoaXMuX21lc3NhZ2VCdXMsIHRoaXMuX3NlcmlhbGl6ZXIsIGNoYW5uZWwpO1xuICB9XG59XG5cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBDbGllbnRNZXNzYWdlQnJva2VyIHtcbiAgYWJzdHJhY3QgcnVuT25TZXJ2aWNlKGFyZ3M6IFVpQXJndW1lbnRzLCByZXR1cm5UeXBlOiBUeXBlKTogUHJvbWlzZTxhbnk+O1xufVxuXG5leHBvcnQgY2xhc3MgQ2xpZW50TWVzc2FnZUJyb2tlcl8gZXh0ZW5kcyBDbGllbnRNZXNzYWdlQnJva2VyIHtcbiAgcHJpdmF0ZSBfcGVuZGluZzogTWFwPHN0cmluZywgUHJvbWlzZUNvbXBsZXRlcjxhbnk+PiA9IG5ldyBNYXA8c3RyaW5nLCBQcm9taXNlQ29tcGxldGVyPGFueT4+KCk7XG4gIHByaXZhdGUgX3Npbms6IEV2ZW50RW1pdHRlcjxhbnk+O1xuICAvKiogQGludGVybmFsICovXG4gIHB1YmxpYyBfc2VyaWFsaXplcjogU2VyaWFsaXplcjtcblxuICBjb25zdHJ1Y3RvcihtZXNzYWdlQnVzOiBNZXNzYWdlQnVzLCBfc2VyaWFsaXplcjogU2VyaWFsaXplciwgcHVibGljIGNoYW5uZWwpIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMuX3NpbmsgPSBtZXNzYWdlQnVzLnRvKGNoYW5uZWwpO1xuICAgIHRoaXMuX3NlcmlhbGl6ZXIgPSBfc2VyaWFsaXplcjtcbiAgICB2YXIgc291cmNlID0gbWVzc2FnZUJ1cy5mcm9tKGNoYW5uZWwpO1xuICAgIE9ic2VydmFibGVXcmFwcGVyLnN1YnNjcmliZShzb3VyY2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChtZXNzYWdlOiB7W2tleTogc3RyaW5nXTogYW55fSkgPT4gdGhpcy5faGFuZGxlTWVzc2FnZShtZXNzYWdlKSk7XG4gIH1cblxuICBwcml2YXRlIF9nZW5lcmF0ZU1lc3NhZ2VJZChuYW1lOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIHZhciB0aW1lOiBzdHJpbmcgPSBzdHJpbmdpZnkoRGF0ZVdyYXBwZXIudG9NaWxsaXMoRGF0ZVdyYXBwZXIubm93KCkpKTtcbiAgICB2YXIgaXRlcmF0aW9uOiBudW1iZXIgPSAwO1xuICAgIHZhciBpZDogc3RyaW5nID0gbmFtZSArIHRpbWUgKyBzdHJpbmdpZnkoaXRlcmF0aW9uKTtcbiAgICB3aGlsZSAoaXNQcmVzZW50KHRoaXMuX3BlbmRpbmdbaWRdKSkge1xuICAgICAgaWQgPSBgJHtuYW1lfSR7dGltZX0ke2l0ZXJhdGlvbn1gO1xuICAgICAgaXRlcmF0aW9uKys7XG4gICAgfVxuICAgIHJldHVybiBpZDtcbiAgfVxuXG4gIHJ1bk9uU2VydmljZShhcmdzOiBVaUFyZ3VtZW50cywgcmV0dXJuVHlwZTogVHlwZSk6IFByb21pc2U8YW55PiB7XG4gICAgdmFyIGZuQXJncyA9IFtdO1xuICAgIGlmIChpc1ByZXNlbnQoYXJncy5hcmdzKSkge1xuICAgICAgYXJncy5hcmdzLmZvckVhY2goYXJndW1lbnQgPT4ge1xuICAgICAgICBpZiAoYXJndW1lbnQudHlwZSAhPSBudWxsKSB7XG4gICAgICAgICAgZm5BcmdzLnB1c2godGhpcy5fc2VyaWFsaXplci5zZXJpYWxpemUoYXJndW1lbnQudmFsdWUsIGFyZ3VtZW50LnR5cGUpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBmbkFyZ3MucHVzaChhcmd1bWVudC52YWx1ZSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHZhciBwcm9taXNlOiBQcm9taXNlPGFueT47XG4gICAgdmFyIGlkOiBzdHJpbmcgPSBudWxsO1xuICAgIGlmIChyZXR1cm5UeXBlICE9IG51bGwpIHtcbiAgICAgIHZhciBjb21wbGV0ZXI6IFByb21pc2VDb21wbGV0ZXI8YW55PiA9IFByb21pc2VXcmFwcGVyLmNvbXBsZXRlcigpO1xuICAgICAgaWQgPSB0aGlzLl9nZW5lcmF0ZU1lc3NhZ2VJZChhcmdzLm1ldGhvZCk7XG4gICAgICB0aGlzLl9wZW5kaW5nLnNldChpZCwgY29tcGxldGVyKTtcbiAgICAgIFByb21pc2VXcmFwcGVyLmNhdGNoRXJyb3IoY29tcGxldGVyLnByb21pc2UsIChlcnIsIHN0YWNrPykgPT4ge1xuICAgICAgICBwcmludChlcnIpO1xuICAgICAgICBjb21wbGV0ZXIucmVqZWN0KGVyciwgc3RhY2spO1xuICAgICAgfSk7XG5cbiAgICAgIHByb21pc2UgPSBQcm9taXNlV3JhcHBlci50aGVuKGNvbXBsZXRlci5wcm9taXNlLCAodmFsdWU6IGFueSkgPT4ge1xuICAgICAgICBpZiAodGhpcy5fc2VyaWFsaXplciA9PSBudWxsKSB7XG4gICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiB0aGlzLl9zZXJpYWxpemVyLmRlc2VyaWFsaXplKHZhbHVlLCByZXR1cm5UeXBlKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHByb21pc2UgPSBudWxsO1xuICAgIH1cblxuICAgIC8vIFRPRE8oanRlcGxpdHo2MDIpOiBDcmVhdGUgYSBjbGFzcyBmb3IgdGhlc2UgbWVzc2FnZXMgc28gd2UgZG9uJ3Qga2VlcCB1c2luZyBTdHJpbmdNYXAgIzM2ODVcbiAgICB2YXIgbWVzc2FnZSA9IHsnbWV0aG9kJzogYXJncy5tZXRob2QsICdhcmdzJzogZm5BcmdzfTtcbiAgICBpZiAoaWQgIT0gbnVsbCkge1xuICAgICAgbWVzc2FnZVsnaWQnXSA9IGlkO1xuICAgIH1cbiAgICBPYnNlcnZhYmxlV3JhcHBlci5jYWxsRW1pdCh0aGlzLl9zaW5rLCBtZXNzYWdlKTtcblxuICAgIHJldHVybiBwcm9taXNlO1xuICB9XG5cbiAgcHJpdmF0ZSBfaGFuZGxlTWVzc2FnZShtZXNzYWdlOiB7W2tleTogc3RyaW5nXTogYW55fSk6IHZvaWQge1xuICAgIHZhciBkYXRhID0gbmV3IE1lc3NhZ2VEYXRhKG1lc3NhZ2UpO1xuICAgIC8vIFRPRE8oanRlcGxpdHo2MDIpOiByZXBsYWNlIHRoZXNlIHN0cmluZ3Mgd2l0aCBtZXNzYWdpbmcgY29uc3RhbnRzICMzNjg1XG4gICAgaWYgKFN0cmluZ1dyYXBwZXIuZXF1YWxzKGRhdGEudHlwZSwgXCJyZXN1bHRcIikgfHwgU3RyaW5nV3JhcHBlci5lcXVhbHMoZGF0YS50eXBlLCBcImVycm9yXCIpKSB7XG4gICAgICB2YXIgaWQgPSBkYXRhLmlkO1xuICAgICAgaWYgKHRoaXMuX3BlbmRpbmcuaGFzKGlkKSkge1xuICAgICAgICBpZiAoU3RyaW5nV3JhcHBlci5lcXVhbHMoZGF0YS50eXBlLCBcInJlc3VsdFwiKSkge1xuICAgICAgICAgIHRoaXMuX3BlbmRpbmcuZ2V0KGlkKS5yZXNvbHZlKGRhdGEudmFsdWUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuX3BlbmRpbmcuZ2V0KGlkKS5yZWplY3QoZGF0YS52YWx1ZSwgbnVsbCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fcGVuZGluZy5kZWxldGUoaWQpO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5jbGFzcyBNZXNzYWdlRGF0YSB7XG4gIHR5cGU6IHN0cmluZztcbiAgdmFsdWU6IGFueTtcbiAgaWQ6IHN0cmluZztcblxuICBjb25zdHJ1Y3RvcihkYXRhOiB7W2tleTogc3RyaW5nXTogYW55fSkge1xuICAgIHRoaXMudHlwZSA9IFN0cmluZ01hcFdyYXBwZXIuZ2V0KGRhdGEsIFwidHlwZVwiKTtcbiAgICB0aGlzLmlkID0gdGhpcy5fZ2V0VmFsdWVJZlByZXNlbnQoZGF0YSwgXCJpZFwiKTtcbiAgICB0aGlzLnZhbHVlID0gdGhpcy5fZ2V0VmFsdWVJZlByZXNlbnQoZGF0YSwgXCJ2YWx1ZVwiKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSB2YWx1ZSBmcm9tIHRoZSBTdHJpbmdNYXAgaWYgcHJlc2VudC4gT3RoZXJ3aXNlIHJldHVybnMgbnVsbFxuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIF9nZXRWYWx1ZUlmUHJlc2VudChkYXRhOiB7W2tleTogc3RyaW5nXTogYW55fSwga2V5OiBzdHJpbmcpIHtcbiAgICBpZiAoU3RyaW5nTWFwV3JhcHBlci5jb250YWlucyhkYXRhLCBrZXkpKSB7XG4gICAgICByZXR1cm4gU3RyaW5nTWFwV3JhcHBlci5nZXQoZGF0YSwga2V5KTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBGbkFyZyB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyB2YWx1ZSwgcHVibGljIHR5cGU6IFR5cGUpIHt9XG59XG5cbmV4cG9ydCBjbGFzcyBVaUFyZ3VtZW50cyB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBtZXRob2Q6IHN0cmluZywgcHVibGljIGFyZ3M/OiBGbkFyZ1tdKSB7fVxufVxuIl19