"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var index_1 = require('../index');
var collection_1 = require('../src/facade/collection');
var lang_1 = require('../src/facade/lang');
var core_1 = require('@angular/core');
var async_1 = require('../src/facade/async');
/**
 * A mock implementation of {@link XHR} that allows outgoing requests to be mocked
 * and responded to within a single test, without going to the network.
 */
var MockXHR = (function (_super) {
    __extends(MockXHR, _super);
    function MockXHR() {
        _super.apply(this, arguments);
        this._expectations = [];
        this._definitions = new collection_1.Map();
        this._requests = [];
    }
    MockXHR.prototype.get = function (url) {
        var request = new _PendingRequest(url);
        this._requests.push(request);
        return request.getPromise();
    };
    /**
     * Add an expectation for the given URL. Incoming requests will be checked against
     * the next expectation (in FIFO order). The `verifyNoOutstandingExpectations` method
     * can be used to check if any expectations have not yet been met.
     *
     * The response given will be returned if the expectation matches.
     */
    MockXHR.prototype.expect = function (url, response) {
        var expectation = new _Expectation(url, response);
        this._expectations.push(expectation);
    };
    /**
     * Add a definition for the given URL to return the given response. Unlike expectations,
     * definitions have no order and will satisfy any matching request at any time. Also
     * unlike expectations, unused definitions do not cause `verifyNoOutstandingExpectations`
     * to return an error.
     */
    MockXHR.prototype.when = function (url, response) { this._definitions.set(url, response); };
    /**
     * Process pending requests and verify there are no outstanding expectations. Also fails
     * if no requests are pending.
     */
    MockXHR.prototype.flush = function () {
        if (this._requests.length === 0) {
            throw new core_1.BaseException('No pending requests to flush');
        }
        do {
            this._processRequest(this._requests.shift());
        } while (this._requests.length > 0);
        this.verifyNoOutstandingExpectations();
    };
    /**
     * Throw an exception if any expectations have not been satisfied.
     */
    MockXHR.prototype.verifyNoOutstandingExpectations = function () {
        if (this._expectations.length === 0)
            return;
        var urls = [];
        for (var i = 0; i < this._expectations.length; i++) {
            var expectation = this._expectations[i];
            urls.push(expectation.url);
        }
        throw new core_1.BaseException("Unsatisfied requests: " + urls.join(', '));
    };
    MockXHR.prototype._processRequest = function (request) {
        var url = request.url;
        if (this._expectations.length > 0) {
            var expectation = this._expectations[0];
            if (expectation.url == url) {
                collection_1.ListWrapper.remove(this._expectations, expectation);
                request.complete(expectation.response);
                return;
            }
        }
        if (this._definitions.has(url)) {
            var response = this._definitions.get(url);
            request.complete(lang_1.normalizeBlank(response));
            return;
        }
        throw new core_1.BaseException("Unexpected request " + url);
    };
    return MockXHR;
}(index_1.XHR));
exports.MockXHR = MockXHR;
var _PendingRequest = (function () {
    function _PendingRequest(url) {
        this.url = url;
        this.completer = async_1.PromiseWrapper.completer();
    }
    _PendingRequest.prototype.complete = function (response) {
        if (lang_1.isBlank(response)) {
            this.completer.reject("Failed to load " + this.url, null);
        }
        else {
            this.completer.resolve(response);
        }
    };
    _PendingRequest.prototype.getPromise = function () { return this.completer.promise; };
    return _PendingRequest;
}());
var _Expectation = (function () {
    function _Expectation(url, response) {
        this.url = url;
        this.response = response;
    }
    return _Expectation;
}());
//# sourceMappingURL=xhr_mock.js.map