var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from 'angular2/core';
import { Request } from '../static_request';
import { ReadyState } from '../enums';
import { isPresent } from 'angular2/src/facade/lang';
import { BaseException } from 'angular2/src/facade/exceptions';
import { Subject } from 'rxjs/Subject';
import { ReplaySubject } from 'rxjs/subject/ReplaySubject';
import { take } from 'rxjs/operator/take';
/**
 *
 * Mock Connection to represent a {@link Connection} for tests.
 *
 **/
export class MockConnection {
    constructor(req) {
        this.response = take.call(new ReplaySubject(1), 1);
        this.readyState = ReadyState.Open;
        this.request = req;
    }
    /**
     * Sends a mock response to the connection. This response is the value that is emitted to the
     * {@link EventEmitter} returned by {@link Http}.
     *
     * ### Example
     *
     * ```
     * var connection;
     * backend.connections.subscribe(c => connection = c);
     * http.request('data.json').subscribe(res => console.log(res.text()));
     * connection.mockRespond(new Response('fake response')); //logs 'fake response'
     * ```
     *
     */
    mockRespond(res) {
        if (this.readyState === ReadyState.Done || this.readyState === ReadyState.Cancelled) {
            throw new BaseException('Connection has already been resolved');
        }
        this.readyState = ReadyState.Done;
        this.response.next(res);
        this.response.complete();
    }
    /**
     * Not yet implemented!
     *
     * Sends the provided {@link Response} to the `downloadObserver` of the `Request`
     * associated with this connection.
     */
    mockDownload(res) {
        // this.request.downloadObserver.onNext(res);
        // if (res.bytesLoaded === res.totalBytes) {
        //   this.request.downloadObserver.onCompleted();
        // }
    }
    // TODO(jeffbcross): consider using Response type
    /**
     * Emits the provided error object as an error to the {@link Response} {@link EventEmitter}
     * returned
     * from {@link Http}.
     */
    mockError(err) {
        // Matches XHR semantics
        this.readyState = ReadyState.Done;
        this.response.error(err);
    }
}
/**
 * A mock backend for testing the {@link Http} service.
 *
 * This class can be injected in tests, and should be used to override providers
 * to other backends, such as {@link XHRBackend}.
 *
 * ### Example
 *
 * ```
 * import {BaseRequestOptions, Http} from 'angular2/http';
 * import {MockBackend} from 'angular2/http/testing';
 * it('should get some data', inject([AsyncTestCompleter], (async) => {
 *   var connection;
 *   var injector = Injector.resolveAndCreate([
 *     MockBackend,
 *     provide(Http, {useFactory: (backend, options) => {
 *       return new Http(backend, options);
 *     }, deps: [MockBackend, BaseRequestOptions]})]);
 *   var http = injector.get(Http);
 *   var backend = injector.get(MockBackend);
 *   //Assign any newly-created connection to local variable
 *   backend.connections.subscribe(c => connection = c);
 *   http.request('data.json').subscribe((res) => {
 *     expect(res.text()).toBe('awesome');
 *     async.done();
 *   });
 *   connection.mockRespond(new Response('awesome'));
 * }));
 * ```
 *
 * This method only exists in the mock implementation, not in real Backends.
 **/
export let MockBackend = class MockBackend {
    constructor() {
        this.connectionsArray = [];
        this.connections = new Subject();
        this.connections.subscribe((connection) => this.connectionsArray.push(connection));
        this.pendingConnections = new Subject();
    }
    /**
     * Checks all connections, and raises an exception if any connection has not received a response.
     *
     * This method only exists in the mock implementation, not in real Backends.
     */
    verifyNoPendingRequests() {
        let pending = 0;
        this.pendingConnections.subscribe((c) => pending++);
        if (pending > 0)
            throw new BaseException(`${pending} pending connections to be resolved`);
    }
    /**
     * Can be used in conjunction with `verifyNoPendingRequests` to resolve any not-yet-resolve
     * connections, if it's expected that there are connections that have not yet received a response.
     *
     * This method only exists in the mock implementation, not in real Backends.
     */
    resolveAllConnections() { this.connections.subscribe((c) => c.readyState = 4); }
    /**
     * Creates a new {@link MockConnection}. This is equivalent to calling `new
     * MockConnection()`, except that it also will emit the new `Connection` to the `connections`
     * emitter of this `MockBackend` instance. This method will usually only be used by tests
     * against the framework itself, not by end-users.
     */
    createConnection(req) {
        if (!isPresent(req) || !(req instanceof Request)) {
            throw new BaseException(`createConnection requires an instance of Request, got ${req}`);
        }
        let connection = new MockConnection(req);
        this.connections.next(connection);
        return connection;
    }
};
MockBackend = __decorate([
    Injectable(), 
    __metadata('design:paramtypes', [])
], MockBackend);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9ja19iYWNrZW5kLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZGlmZmluZ19wbHVnaW5fd3JhcHBlci1vdXRwdXRfcGF0aC1vWERPNHAydi50bXAvYW5ndWxhcjIvc3JjL2h0dHAvYmFja2VuZHMvbW9ja19iYWNrZW5kLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sZUFBZTtPQUNqQyxFQUFDLE9BQU8sRUFBQyxNQUFNLG1CQUFtQjtPQUVsQyxFQUFDLFVBQVUsRUFBQyxNQUFNLFVBQVU7T0FFNUIsRUFBQyxTQUFTLEVBQUMsTUFBTSwwQkFBMEI7T0FDM0MsRUFBQyxhQUFhLEVBQW1CLE1BQU0sZ0NBQWdDO09BQ3ZFLEVBQUMsT0FBTyxFQUFDLE1BQU0sY0FBYztPQUM3QixFQUFDLGFBQWEsRUFBQyxNQUFNLDRCQUE0QjtPQUNqRCxFQUFDLElBQUksRUFBQyxNQUFNLG9CQUFvQjtBQUV2Qzs7OztJQUlJO0FBQ0o7SUFvQkUsWUFBWSxHQUFZO1FBQ3RCLElBQUksQ0FBQyxRQUFRLEdBQVEsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLGFBQWEsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUN4RCxJQUFJLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQyxJQUFJLENBQUM7UUFDbEMsSUFBSSxDQUFDLE9BQU8sR0FBRyxHQUFHLENBQUM7SUFDckIsQ0FBQztJQUVEOzs7Ozs7Ozs7Ozs7O09BYUc7SUFDSCxXQUFXLENBQUMsR0FBYTtRQUN2QixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxLQUFLLFVBQVUsQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLFVBQVUsS0FBSyxVQUFVLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztZQUNwRixNQUFNLElBQUksYUFBYSxDQUFDLHNDQUFzQyxDQUFDLENBQUM7UUFDbEUsQ0FBQztRQUNELElBQUksQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFDLElBQUksQ0FBQztRQUNsQyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUN4QixJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQzNCLENBQUM7SUFFRDs7Ozs7T0FLRztJQUNILFlBQVksQ0FBQyxHQUFhO1FBQ3hCLDZDQUE2QztRQUM3Qyw0Q0FBNEM7UUFDNUMsaURBQWlEO1FBQ2pELElBQUk7SUFDTixDQUFDO0lBRUQsaURBQWlEO0lBQ2pEOzs7O09BSUc7SUFDSCxTQUFTLENBQUMsR0FBVztRQUNuQix3QkFBd0I7UUFDeEIsSUFBSSxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUMsSUFBSSxDQUFDO1FBQ2xDLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQzNCLENBQUM7QUFDSCxDQUFDO0FBRUQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUErQkk7QUFFSjtJQW9ERTtRQUNFLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxFQUFFLENBQUM7UUFDM0IsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLE9BQU8sRUFBRSxDQUFDO1FBQ2pDLElBQUksQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLENBQUMsVUFBMEIsS0FDdkIsSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO1FBQ3ZFLElBQUksQ0FBQyxrQkFBa0IsR0FBRyxJQUFJLE9BQU8sRUFBRSxDQUFDO0lBQzFDLENBQUM7SUFFRDs7OztPQUlHO0lBQ0gsdUJBQXVCO1FBQ3JCLElBQUksT0FBTyxHQUFHLENBQUMsQ0FBQztRQUNoQixJQUFJLENBQUMsa0JBQWtCLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBaUIsS0FBSyxPQUFPLEVBQUUsQ0FBQyxDQUFDO1FBQ3BFLEVBQUUsQ0FBQyxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUM7WUFBQyxNQUFNLElBQUksYUFBYSxDQUFDLEdBQUcsT0FBTyxxQ0FBcUMsQ0FBQyxDQUFDO0lBQzVGLENBQUM7SUFFRDs7Ozs7T0FLRztJQUNILHFCQUFxQixLQUFLLElBQUksQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBaUIsS0FBSyxDQUFDLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUVoRzs7Ozs7T0FLRztJQUNILGdCQUFnQixDQUFDLEdBQVk7UUFDM0IsRUFBRSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsWUFBWSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDakQsTUFBTSxJQUFJLGFBQWEsQ0FBQyx5REFBeUQsR0FBRyxFQUFFLENBQUMsQ0FBQztRQUMxRixDQUFDO1FBQ0QsSUFBSSxVQUFVLEdBQUcsSUFBSSxjQUFjLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDekMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDbEMsTUFBTSxDQUFDLFVBQVUsQ0FBQztJQUNwQixDQUFDO0FBQ0gsQ0FBQztBQTlGRDtJQUFDLFVBQVUsRUFBRTs7ZUFBQTtBQThGWiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7SW5qZWN0YWJsZX0gZnJvbSAnYW5ndWxhcjIvY29yZSc7XG5pbXBvcnQge1JlcXVlc3R9IGZyb20gJy4uL3N0YXRpY19yZXF1ZXN0JztcbmltcG9ydCB7UmVzcG9uc2V9IGZyb20gJy4uL3N0YXRpY19yZXNwb25zZSc7XG5pbXBvcnQge1JlYWR5U3RhdGV9IGZyb20gJy4uL2VudW1zJztcbmltcG9ydCB7Q29ubmVjdGlvbiwgQ29ubmVjdGlvbkJhY2tlbmR9IGZyb20gJy4uL2ludGVyZmFjZXMnO1xuaW1wb3J0IHtpc1ByZXNlbnR9IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvbGFuZyc7XG5pbXBvcnQge0Jhc2VFeGNlcHRpb24sIFdyYXBwZWRFeGNlcHRpb259IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvZXhjZXB0aW9ucyc7XG5pbXBvcnQge1N1YmplY3R9IGZyb20gJ3J4anMvU3ViamVjdCc7XG5pbXBvcnQge1JlcGxheVN1YmplY3R9IGZyb20gJ3J4anMvc3ViamVjdC9SZXBsYXlTdWJqZWN0JztcbmltcG9ydCB7dGFrZX0gZnJvbSAncnhqcy9vcGVyYXRvci90YWtlJztcblxuLyoqXG4gKlxuICogTW9jayBDb25uZWN0aW9uIHRvIHJlcHJlc2VudCBhIHtAbGluayBDb25uZWN0aW9ufSBmb3IgdGVzdHMuXG4gKlxuICoqL1xuZXhwb3J0IGNsYXNzIE1vY2tDb25uZWN0aW9uIGltcGxlbWVudHMgQ29ubmVjdGlvbiB7XG4gIC8vIFRPRE8gTmFtZSBgcmVhZHlTdGF0ZWAgc2hvdWxkIGNoYW5nZSB0byBiZSBtb3JlIGdlbmVyaWMsIGFuZCBzdGF0ZXMgY291bGQgYmUgbWFkZSB0byBiZSBtb3JlXG4gIC8vIGRlc2NyaXB0aXZlIHRoYW4gWEhSIHN0YXRlcy5cbiAgLyoqXG4gICAqIERlc2NyaWJlcyB0aGUgc3RhdGUgb2YgdGhlIGNvbm5lY3Rpb24sIGJhc2VkIG9uIGBYTUxIdHRwUmVxdWVzdC5yZWFkeVN0YXRlYCwgYnV0IHdpdGhcbiAgICogYWRkaXRpb25hbCBzdGF0ZXMuIEZvciBleGFtcGxlLCBzdGF0ZSA1IGluZGljYXRlcyBhbiBhYm9ydGVkIGNvbm5lY3Rpb24uXG4gICAqL1xuICByZWFkeVN0YXRlOiBSZWFkeVN0YXRlO1xuXG4gIC8qKlxuICAgKiB7QGxpbmsgUmVxdWVzdH0gaW5zdGFuY2UgdXNlZCB0byBjcmVhdGUgdGhlIGNvbm5lY3Rpb24uXG4gICAqL1xuICByZXF1ZXN0OiBSZXF1ZXN0O1xuXG4gIC8qKlxuICAgKiB7QGxpbmsgRXZlbnRFbWl0dGVyfSBvZiB7QGxpbmsgUmVzcG9uc2V9LiBDYW4gYmUgc3Vic2NyaWJlZCB0byBpbiBvcmRlciB0byBiZSBub3RpZmllZCB3aGVuIGFcbiAgICogcmVzcG9uc2UgaXMgYXZhaWxhYmxlLlxuICAgKi9cbiAgcmVzcG9uc2U6IFJlcGxheVN1YmplY3Q8UmVzcG9uc2U+O1xuXG4gIGNvbnN0cnVjdG9yKHJlcTogUmVxdWVzdCkge1xuICAgIHRoaXMucmVzcG9uc2UgPSA8YW55PnRha2UuY2FsbChuZXcgUmVwbGF5U3ViamVjdCgxKSwgMSk7XG4gICAgdGhpcy5yZWFkeVN0YXRlID0gUmVhZHlTdGF0ZS5PcGVuO1xuICAgIHRoaXMucmVxdWVzdCA9IHJlcTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZW5kcyBhIG1vY2sgcmVzcG9uc2UgdG8gdGhlIGNvbm5lY3Rpb24uIFRoaXMgcmVzcG9uc2UgaXMgdGhlIHZhbHVlIHRoYXQgaXMgZW1pdHRlZCB0byB0aGVcbiAgICoge0BsaW5rIEV2ZW50RW1pdHRlcn0gcmV0dXJuZWQgYnkge0BsaW5rIEh0dHB9LlxuICAgKlxuICAgKiAjIyMgRXhhbXBsZVxuICAgKlxuICAgKiBgYGBcbiAgICogdmFyIGNvbm5lY3Rpb247XG4gICAqIGJhY2tlbmQuY29ubmVjdGlvbnMuc3Vic2NyaWJlKGMgPT4gY29ubmVjdGlvbiA9IGMpO1xuICAgKiBodHRwLnJlcXVlc3QoJ2RhdGEuanNvbicpLnN1YnNjcmliZShyZXMgPT4gY29uc29sZS5sb2cocmVzLnRleHQoKSkpO1xuICAgKiBjb25uZWN0aW9uLm1vY2tSZXNwb25kKG5ldyBSZXNwb25zZSgnZmFrZSByZXNwb25zZScpKTsgLy9sb2dzICdmYWtlIHJlc3BvbnNlJ1xuICAgKiBgYGBcbiAgICpcbiAgICovXG4gIG1vY2tSZXNwb25kKHJlczogUmVzcG9uc2UpIHtcbiAgICBpZiAodGhpcy5yZWFkeVN0YXRlID09PSBSZWFkeVN0YXRlLkRvbmUgfHwgdGhpcy5yZWFkeVN0YXRlID09PSBSZWFkeVN0YXRlLkNhbmNlbGxlZCkge1xuICAgICAgdGhyb3cgbmV3IEJhc2VFeGNlcHRpb24oJ0Nvbm5lY3Rpb24gaGFzIGFscmVhZHkgYmVlbiByZXNvbHZlZCcpO1xuICAgIH1cbiAgICB0aGlzLnJlYWR5U3RhdGUgPSBSZWFkeVN0YXRlLkRvbmU7XG4gICAgdGhpcy5yZXNwb25zZS5uZXh0KHJlcyk7XG4gICAgdGhpcy5yZXNwb25zZS5jb21wbGV0ZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIE5vdCB5ZXQgaW1wbGVtZW50ZWQhXG4gICAqXG4gICAqIFNlbmRzIHRoZSBwcm92aWRlZCB7QGxpbmsgUmVzcG9uc2V9IHRvIHRoZSBgZG93bmxvYWRPYnNlcnZlcmAgb2YgdGhlIGBSZXF1ZXN0YFxuICAgKiBhc3NvY2lhdGVkIHdpdGggdGhpcyBjb25uZWN0aW9uLlxuICAgKi9cbiAgbW9ja0Rvd25sb2FkKHJlczogUmVzcG9uc2UpIHtcbiAgICAvLyB0aGlzLnJlcXVlc3QuZG93bmxvYWRPYnNlcnZlci5vbk5leHQocmVzKTtcbiAgICAvLyBpZiAocmVzLmJ5dGVzTG9hZGVkID09PSByZXMudG90YWxCeXRlcykge1xuICAgIC8vICAgdGhpcy5yZXF1ZXN0LmRvd25sb2FkT2JzZXJ2ZXIub25Db21wbGV0ZWQoKTtcbiAgICAvLyB9XG4gIH1cblxuICAvLyBUT0RPKGplZmZiY3Jvc3MpOiBjb25zaWRlciB1c2luZyBSZXNwb25zZSB0eXBlXG4gIC8qKlxuICAgKiBFbWl0cyB0aGUgcHJvdmlkZWQgZXJyb3Igb2JqZWN0IGFzIGFuIGVycm9yIHRvIHRoZSB7QGxpbmsgUmVzcG9uc2V9IHtAbGluayBFdmVudEVtaXR0ZXJ9XG4gICAqIHJldHVybmVkXG4gICAqIGZyb20ge0BsaW5rIEh0dHB9LlxuICAgKi9cbiAgbW9ja0Vycm9yKGVycj86IEVycm9yKSB7XG4gICAgLy8gTWF0Y2hlcyBYSFIgc2VtYW50aWNzXG4gICAgdGhpcy5yZWFkeVN0YXRlID0gUmVhZHlTdGF0ZS5Eb25lO1xuICAgIHRoaXMucmVzcG9uc2UuZXJyb3IoZXJyKTtcbiAgfVxufVxuXG4vKipcbiAqIEEgbW9jayBiYWNrZW5kIGZvciB0ZXN0aW5nIHRoZSB7QGxpbmsgSHR0cH0gc2VydmljZS5cbiAqXG4gKiBUaGlzIGNsYXNzIGNhbiBiZSBpbmplY3RlZCBpbiB0ZXN0cywgYW5kIHNob3VsZCBiZSB1c2VkIHRvIG92ZXJyaWRlIHByb3ZpZGVyc1xuICogdG8gb3RoZXIgYmFja2VuZHMsIHN1Y2ggYXMge0BsaW5rIFhIUkJhY2tlbmR9LlxuICpcbiAqICMjIyBFeGFtcGxlXG4gKlxuICogYGBgXG4gKiBpbXBvcnQge0Jhc2VSZXF1ZXN0T3B0aW9ucywgSHR0cH0gZnJvbSAnYW5ndWxhcjIvaHR0cCc7XG4gKiBpbXBvcnQge01vY2tCYWNrZW5kfSBmcm9tICdhbmd1bGFyMi9odHRwL3Rlc3RpbmcnO1xuICogaXQoJ3Nob3VsZCBnZXQgc29tZSBkYXRhJywgaW5qZWN0KFtBc3luY1Rlc3RDb21wbGV0ZXJdLCAoYXN5bmMpID0+IHtcbiAqICAgdmFyIGNvbm5lY3Rpb247XG4gKiAgIHZhciBpbmplY3RvciA9IEluamVjdG9yLnJlc29sdmVBbmRDcmVhdGUoW1xuICogICAgIE1vY2tCYWNrZW5kLFxuICogICAgIHByb3ZpZGUoSHR0cCwge3VzZUZhY3Rvcnk6IChiYWNrZW5kLCBvcHRpb25zKSA9PiB7XG4gKiAgICAgICByZXR1cm4gbmV3IEh0dHAoYmFja2VuZCwgb3B0aW9ucyk7XG4gKiAgICAgfSwgZGVwczogW01vY2tCYWNrZW5kLCBCYXNlUmVxdWVzdE9wdGlvbnNdfSldKTtcbiAqICAgdmFyIGh0dHAgPSBpbmplY3Rvci5nZXQoSHR0cCk7XG4gKiAgIHZhciBiYWNrZW5kID0gaW5qZWN0b3IuZ2V0KE1vY2tCYWNrZW5kKTtcbiAqICAgLy9Bc3NpZ24gYW55IG5ld2x5LWNyZWF0ZWQgY29ubmVjdGlvbiB0byBsb2NhbCB2YXJpYWJsZVxuICogICBiYWNrZW5kLmNvbm5lY3Rpb25zLnN1YnNjcmliZShjID0+IGNvbm5lY3Rpb24gPSBjKTtcbiAqICAgaHR0cC5yZXF1ZXN0KCdkYXRhLmpzb24nKS5zdWJzY3JpYmUoKHJlcykgPT4ge1xuICogICAgIGV4cGVjdChyZXMudGV4dCgpKS50b0JlKCdhd2Vzb21lJyk7XG4gKiAgICAgYXN5bmMuZG9uZSgpO1xuICogICB9KTtcbiAqICAgY29ubmVjdGlvbi5tb2NrUmVzcG9uZChuZXcgUmVzcG9uc2UoJ2F3ZXNvbWUnKSk7XG4gKiB9KSk7XG4gKiBgYGBcbiAqXG4gKiBUaGlzIG1ldGhvZCBvbmx5IGV4aXN0cyBpbiB0aGUgbW9jayBpbXBsZW1lbnRhdGlvbiwgbm90IGluIHJlYWwgQmFja2VuZHMuXG4gKiovXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgTW9ja0JhY2tlbmQgaW1wbGVtZW50cyBDb25uZWN0aW9uQmFja2VuZCB7XG4gIC8qKlxuICAgKiB7QGxpbmsgRXZlbnRFbWl0dGVyfVxuICAgKiBvZiB7QGxpbmsgTW9ja0Nvbm5lY3Rpb259IGluc3RhbmNlcyB0aGF0IGhhdmUgYmVlbiBjcmVhdGVkIGJ5IHRoaXMgYmFja2VuZC4gQ2FuIGJlIHN1YnNjcmliZWRcbiAgICogdG8gaW4gb3JkZXIgdG8gcmVzcG9uZCB0byBjb25uZWN0aW9ucy5cbiAgICpcbiAgICogIyMjIEV4YW1wbGVcbiAgICpcbiAgICogYGBgXG4gICAqIGltcG9ydCB7SHR0cCwgQmFzZVJlcXVlc3RPcHRpb25zfSBmcm9tICdhbmd1bGFyMi9odHRwJztcbiAgICogaW1wb3J0IHtNb2NrQmFja2VuZH0gZnJvbSAnYW5ndWxhcjIvaHR0cC90ZXN0aW5nJztcbiAgICogaW1wb3J0IHtJbmplY3Rvcn0gZnJvbSAnYW5ndWxhcjIvY29yZSc7XG4gICAqXG4gICAqIGl0KCdzaG91bGQgZ2V0IGEgcmVzcG9uc2UnLCAoKSA9PiB7XG4gICAqICAgdmFyIGNvbm5lY3Rpb247IC8vdGhpcyB3aWxsIGJlIHNldCB3aGVuIGEgbmV3IGNvbm5lY3Rpb24gaXMgZW1pdHRlZCBmcm9tIHRoZSBiYWNrZW5kLlxuICAgKiAgIHZhciB0ZXh0OyAvL3RoaXMgd2lsbCBiZSBzZXQgZnJvbSBtb2NrIHJlc3BvbnNlXG4gICAqICAgdmFyIGluamVjdG9yID0gSW5qZWN0b3IucmVzb2x2ZUFuZENyZWF0ZShbXG4gICAqICAgICBNb2NrQmFja2VuZCxcbiAgICogICAgIHByb3ZpZGUoSHR0cCwge3VzZUZhY3Rvcnk6IChiYWNrZW5kLCBvcHRpb25zKSA9PiB7XG4gICAqICAgICAgIHJldHVybiBuZXcgSHR0cChiYWNrZW5kLCBvcHRpb25zKTtcbiAgICogICAgIH0sIGRlcHM6IFtNb2NrQmFja2VuZCwgQmFzZVJlcXVlc3RPcHRpb25zXX1dKTtcbiAgICogICB2YXIgYmFja2VuZCA9IGluamVjdG9yLmdldChNb2NrQmFja2VuZCk7XG4gICAqICAgdmFyIGh0dHAgPSBpbmplY3Rvci5nZXQoSHR0cCk7XG4gICAqICAgYmFja2VuZC5jb25uZWN0aW9ucy5zdWJzY3JpYmUoYyA9PiBjb25uZWN0aW9uID0gYyk7XG4gICAqICAgaHR0cC5yZXF1ZXN0KCdzb21ldGhpbmcuanNvbicpLnN1YnNjcmliZShyZXMgPT4ge1xuICAgKiAgICAgdGV4dCA9IHJlcy50ZXh0KCk7XG4gICAqICAgfSk7XG4gICAqICAgY29ubmVjdGlvbi5tb2NrUmVzcG9uZChuZXcgUmVzcG9uc2Uoe2JvZHk6ICdTb21ldGhpbmcnfSkpO1xuICAgKiAgIGV4cGVjdCh0ZXh0KS50b0JlKCdTb21ldGhpbmcnKTtcbiAgICogfSk7XG4gICAqIGBgYFxuICAgKlxuICAgKiBUaGlzIHByb3BlcnR5IG9ubHkgZXhpc3RzIGluIHRoZSBtb2NrIGltcGxlbWVudGF0aW9uLCBub3QgaW4gcmVhbCBCYWNrZW5kcy5cbiAgICovXG4gIGNvbm5lY3Rpb25zOiBhbnk7ICAvLzxNb2NrQ29ubmVjdGlvbj5cblxuICAvKipcbiAgICogQW4gYXJyYXkgcmVwcmVzZW50YXRpb24gb2YgYGNvbm5lY3Rpb25zYC4gVGhpcyBhcnJheSB3aWxsIGJlIHVwZGF0ZWQgd2l0aCBlYWNoIGNvbm5lY3Rpb24gdGhhdFxuICAgKiBpcyBjcmVhdGVkIGJ5IHRoaXMgYmFja2VuZC5cbiAgICpcbiAgICogVGhpcyBwcm9wZXJ0eSBvbmx5IGV4aXN0cyBpbiB0aGUgbW9jayBpbXBsZW1lbnRhdGlvbiwgbm90IGluIHJlYWwgQmFja2VuZHMuXG4gICAqL1xuICBjb25uZWN0aW9uc0FycmF5OiBNb2NrQ29ubmVjdGlvbltdO1xuICAvKipcbiAgICoge0BsaW5rIEV2ZW50RW1pdHRlcn0gb2Yge0BsaW5rIE1vY2tDb25uZWN0aW9ufSBpbnN0YW5jZXMgdGhhdCBoYXZlbid0IHlldCBiZWVuIHJlc29sdmVkIChpLmUuXG4gICAqIHdpdGggYSBgcmVhZHlTdGF0ZWBcbiAgICogbGVzcyB0aGFuIDQpLiBVc2VkIGludGVybmFsbHkgdG8gdmVyaWZ5IHRoYXQgbm8gY29ubmVjdGlvbnMgYXJlIHBlbmRpbmcgdmlhIHRoZVxuICAgKiBgdmVyaWZ5Tm9QZW5kaW5nUmVxdWVzdHNgIG1ldGhvZC5cbiAgICpcbiAgICogVGhpcyBwcm9wZXJ0eSBvbmx5IGV4aXN0cyBpbiB0aGUgbW9jayBpbXBsZW1lbnRhdGlvbiwgbm90IGluIHJlYWwgQmFja2VuZHMuXG4gICAqL1xuICBwZW5kaW5nQ29ubmVjdGlvbnM6IGFueTsgIC8vIFN1YmplY3Q8TW9ja0Nvbm5lY3Rpb24+XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuY29ubmVjdGlvbnNBcnJheSA9IFtdO1xuICAgIHRoaXMuY29ubmVjdGlvbnMgPSBuZXcgU3ViamVjdCgpO1xuICAgIHRoaXMuY29ubmVjdGlvbnMuc3Vic2NyaWJlKChjb25uZWN0aW9uOiBNb2NrQ29ubmVjdGlvbikgPT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jb25uZWN0aW9uc0FycmF5LnB1c2goY29ubmVjdGlvbikpO1xuICAgIHRoaXMucGVuZGluZ0Nvbm5lY3Rpb25zID0gbmV3IFN1YmplY3QoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVja3MgYWxsIGNvbm5lY3Rpb25zLCBhbmQgcmFpc2VzIGFuIGV4Y2VwdGlvbiBpZiBhbnkgY29ubmVjdGlvbiBoYXMgbm90IHJlY2VpdmVkIGEgcmVzcG9uc2UuXG4gICAqXG4gICAqIFRoaXMgbWV0aG9kIG9ubHkgZXhpc3RzIGluIHRoZSBtb2NrIGltcGxlbWVudGF0aW9uLCBub3QgaW4gcmVhbCBCYWNrZW5kcy5cbiAgICovXG4gIHZlcmlmeU5vUGVuZGluZ1JlcXVlc3RzKCkge1xuICAgIGxldCBwZW5kaW5nID0gMDtcbiAgICB0aGlzLnBlbmRpbmdDb25uZWN0aW9ucy5zdWJzY3JpYmUoKGM6IE1vY2tDb25uZWN0aW9uKSA9PiBwZW5kaW5nKyspO1xuICAgIGlmIChwZW5kaW5nID4gMCkgdGhyb3cgbmV3IEJhc2VFeGNlcHRpb24oYCR7cGVuZGluZ30gcGVuZGluZyBjb25uZWN0aW9ucyB0byBiZSByZXNvbHZlZGApO1xuICB9XG5cbiAgLyoqXG4gICAqIENhbiBiZSB1c2VkIGluIGNvbmp1bmN0aW9uIHdpdGggYHZlcmlmeU5vUGVuZGluZ1JlcXVlc3RzYCB0byByZXNvbHZlIGFueSBub3QteWV0LXJlc29sdmVcbiAgICogY29ubmVjdGlvbnMsIGlmIGl0J3MgZXhwZWN0ZWQgdGhhdCB0aGVyZSBhcmUgY29ubmVjdGlvbnMgdGhhdCBoYXZlIG5vdCB5ZXQgcmVjZWl2ZWQgYSByZXNwb25zZS5cbiAgICpcbiAgICogVGhpcyBtZXRob2Qgb25seSBleGlzdHMgaW4gdGhlIG1vY2sgaW1wbGVtZW50YXRpb24sIG5vdCBpbiByZWFsIEJhY2tlbmRzLlxuICAgKi9cbiAgcmVzb2x2ZUFsbENvbm5lY3Rpb25zKCkgeyB0aGlzLmNvbm5lY3Rpb25zLnN1YnNjcmliZSgoYzogTW9ja0Nvbm5lY3Rpb24pID0+IGMucmVhZHlTdGF0ZSA9IDQpOyB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBuZXcge0BsaW5rIE1vY2tDb25uZWN0aW9ufS4gVGhpcyBpcyBlcXVpdmFsZW50IHRvIGNhbGxpbmcgYG5ld1xuICAgKiBNb2NrQ29ubmVjdGlvbigpYCwgZXhjZXB0IHRoYXQgaXQgYWxzbyB3aWxsIGVtaXQgdGhlIG5ldyBgQ29ubmVjdGlvbmAgdG8gdGhlIGBjb25uZWN0aW9uc2BcbiAgICogZW1pdHRlciBvZiB0aGlzIGBNb2NrQmFja2VuZGAgaW5zdGFuY2UuIFRoaXMgbWV0aG9kIHdpbGwgdXN1YWxseSBvbmx5IGJlIHVzZWQgYnkgdGVzdHNcbiAgICogYWdhaW5zdCB0aGUgZnJhbWV3b3JrIGl0c2VsZiwgbm90IGJ5IGVuZC11c2Vycy5cbiAgICovXG4gIGNyZWF0ZUNvbm5lY3Rpb24ocmVxOiBSZXF1ZXN0KTogTW9ja0Nvbm5lY3Rpb24ge1xuICAgIGlmICghaXNQcmVzZW50KHJlcSkgfHwgIShyZXEgaW5zdGFuY2VvZiBSZXF1ZXN0KSkge1xuICAgICAgdGhyb3cgbmV3IEJhc2VFeGNlcHRpb24oYGNyZWF0ZUNvbm5lY3Rpb24gcmVxdWlyZXMgYW4gaW5zdGFuY2Ugb2YgUmVxdWVzdCwgZ290ICR7cmVxfWApO1xuICAgIH1cbiAgICBsZXQgY29ubmVjdGlvbiA9IG5ldyBNb2NrQ29ubmVjdGlvbihyZXEpO1xuICAgIHRoaXMuY29ubmVjdGlvbnMubmV4dChjb25uZWN0aW9uKTtcbiAgICByZXR1cm4gY29ubmVjdGlvbjtcbiAgfVxufVxuIl19