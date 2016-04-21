'use strict';"use strict";
var collection_1 = require('angular2/src/facade/collection');
var lang_1 = require('angular2/src/facade/lang');
var core_1 = require('angular2/core');
var test_injector_1 = require('./test_injector');
var utils_1 = require('./utils');
var test_injector_2 = require('./test_injector');
exports.inject = test_injector_2.inject;
var matchers_1 = require('./matchers');
exports.expect = matchers_1.expect;
exports.proxy = function (t) { return t; };
var _global = (typeof window === 'undefined' ? lang_1.global : window);
exports.afterEach = _global.afterEach;
/**
 * Injectable completer that allows signaling completion of an asynchronous test. Used internally.
 */
var AsyncTestCompleter = (function () {
    function AsyncTestCompleter(_done) {
        this._done = _done;
    }
    AsyncTestCompleter.prototype.done = function () { this._done(); };
    return AsyncTestCompleter;
}());
exports.AsyncTestCompleter = AsyncTestCompleter;
var jsmBeforeEach = _global.beforeEach;
var jsmDescribe = _global.describe;
var jsmDDescribe = _global.fdescribe;
var jsmXDescribe = _global.xdescribe;
var jsmIt = _global.it;
var jsmIIt = _global.fit;
var jsmXIt = _global.xit;
var runnerStack = [];
var inIt = false;
jasmine.DEFAULT_TIMEOUT_INTERVAL = 500;
var globalTimeOut = utils_1.browserDetection.isSlow ? 3000 : jasmine.DEFAULT_TIMEOUT_INTERVAL;
var testInjector = test_injector_1.getTestInjector();
/**
 * Mechanism to run `beforeEach()` functions of Angular tests.
 *
 * Note: Jasmine own `beforeEach` is used by this library to handle DI providers.
 */
var BeforeEachRunner = (function () {
    function BeforeEachRunner(_parent) {
        this._parent = _parent;
        this._fns = [];
    }
    BeforeEachRunner.prototype.beforeEach = function (fn) { this._fns.push(fn); };
    BeforeEachRunner.prototype.run = function () {
        if (this._parent)
            this._parent.run();
        this._fns.forEach(function (fn) {
            return lang_1.isFunction(fn) ? fn() :
                (testInjector.execute(fn));
        });
    };
    return BeforeEachRunner;
}());
// Reset the test providers before each test
jsmBeforeEach(function () { testInjector.reset(); });
function _describe(jsmFn) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    var parentRunner = runnerStack.length === 0 ? null : runnerStack[runnerStack.length - 1];
    var runner = new BeforeEachRunner(parentRunner);
    runnerStack.push(runner);
    var suite = jsmFn.apply(void 0, args);
    runnerStack.pop();
    return suite;
}
function describe() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i - 0] = arguments[_i];
    }
    return _describe.apply(void 0, [jsmDescribe].concat(args));
}
exports.describe = describe;
function ddescribe() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i - 0] = arguments[_i];
    }
    return _describe.apply(void 0, [jsmDDescribe].concat(args));
}
exports.ddescribe = ddescribe;
function xdescribe() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i - 0] = arguments[_i];
    }
    return _describe.apply(void 0, [jsmXDescribe].concat(args));
}
exports.xdescribe = xdescribe;
function beforeEach(fn) {
    if (runnerStack.length > 0) {
        // Inside a describe block, beforeEach() uses a BeforeEachRunner
        runnerStack[runnerStack.length - 1].beforeEach(fn);
    }
    else {
        // Top level beforeEach() are delegated to jasmine
        jsmBeforeEach(fn);
    }
}
exports.beforeEach = beforeEach;
/**
 * Allows overriding default providers defined in test_injector.js.
 *
 * The given function must return a list of DI providers.
 *
 * Example:
 *
 *   beforeEachProviders(() => [
 *     provide(Compiler, {useClass: MockCompiler}),
 *     provide(SomeToken, {useValue: myValue}),
 *   ]);
 */
function beforeEachProviders(fn) {
    jsmBeforeEach(function () {
        var providers = fn();
        if (!providers)
            return;
        testInjector.addProviders(providers);
    });
}
exports.beforeEachProviders = beforeEachProviders;
/**
 * @deprecated
 */
function beforeEachBindings(fn) {
    beforeEachProviders(fn);
}
exports.beforeEachBindings = beforeEachBindings;
function _it(jsmFn, name, testFn, testTimeOut) {
    var runner = runnerStack[runnerStack.length - 1];
    var timeOut = lang_1.Math.max(globalTimeOut, testTimeOut);
    if (testFn instanceof test_injector_1.FunctionWithParamTokens) {
        // The test case uses inject(). ie `it('test', inject([AsyncTestCompleter], (async) => { ...
        // }));`
        var testFnT_1 = testFn;
        if (testFn.hasToken(AsyncTestCompleter)) {
            jsmFn(name, function (done) {
                var completerProvider = core_1.provide(AsyncTestCompleter, {
                    useFactory: function () {
                        // Mark the test as async when an AsyncTestCompleter is injected in an it()
                        if (!inIt)
                            throw new Error('AsyncTestCompleter can only be injected in an "it()"');
                        return new AsyncTestCompleter(done);
                    }
                });
                testInjector.addProviders([completerProvider]);
                runner.run();
                inIt = true;
                testInjector.execute(testFnT_1);
                inIt = false;
            }, timeOut);
        }
        else {
            jsmFn(name, function () {
                runner.run();
                testInjector.execute(testFnT_1);
            }, timeOut);
        }
    }
    else {
        // The test case doesn't use inject(). ie `it('test', (done) => { ... }));`
        if (testFn.length === 0) {
            jsmFn(name, function () {
                runner.run();
                testFn();
            }, timeOut);
        }
        else {
            jsmFn(name, function (done) {
                runner.run();
                testFn(done);
            }, timeOut);
        }
    }
}
function it(name, fn, timeOut) {
    if (timeOut === void 0) { timeOut = null; }
    return _it(jsmIt, name, fn, timeOut);
}
exports.it = it;
function xit(name, fn, timeOut) {
    if (timeOut === void 0) { timeOut = null; }
    return _it(jsmXIt, name, fn, timeOut);
}
exports.xit = xit;
function iit(name, fn, timeOut) {
    if (timeOut === void 0) { timeOut = null; }
    return _it(jsmIIt, name, fn, timeOut);
}
exports.iit = iit;
var SpyObject = (function () {
    function SpyObject(type) {
        if (type === void 0) { type = null; }
        if (type) {
            for (var prop in type.prototype) {
                var m = null;
                try {
                    m = type.prototype[prop];
                }
                catch (e) {
                }
                if (typeof m === 'function') {
                    this.spy(prop);
                }
            }
        }
    }
    // Noop so that SpyObject has the same interface as in Dart
    SpyObject.prototype.noSuchMethod = function (args) { };
    SpyObject.prototype.spy = function (name) {
        if (!this[name]) {
            this[name] = this._createGuinnessCompatibleSpy(name);
        }
        return this[name];
    };
    SpyObject.prototype.prop = function (name, value) { this[name] = value; };
    SpyObject.stub = function (object, config, overrides) {
        if (object === void 0) { object = null; }
        if (config === void 0) { config = null; }
        if (overrides === void 0) { overrides = null; }
        if (!(object instanceof SpyObject)) {
            overrides = config;
            config = object;
            object = new SpyObject();
        }
        var m = collection_1.StringMapWrapper.merge(config, overrides);
        collection_1.StringMapWrapper.forEach(m, function (value, key) { object.spy(key).andReturn(value); });
        return object;
    };
    /** @internal */
    SpyObject.prototype._createGuinnessCompatibleSpy = function (name) {
        var newSpy = jasmine.createSpy(name);
        newSpy.andCallFake = newSpy.and.callFake;
        newSpy.andReturn = newSpy.and.returnValue;
        newSpy.reset = newSpy.calls.reset;
        // revisit return null here (previously needed for rtts_assert).
        newSpy.and.returnValue(null);
        return newSpy;
    };
    return SpyObject;
}());
exports.SpyObject = SpyObject;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdGluZ19pbnRlcm5hbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRpZmZpbmdfcGx1Z2luX3dyYXBwZXItb3V0cHV0X3BhdGgtY25SOXVlbGUudG1wL2FuZ3VsYXIyL3NyYy90ZXN0aW5nL3Rlc3RpbmdfaW50ZXJuYWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLDJCQUErQixnQ0FBZ0MsQ0FBQyxDQUFBO0FBQ2hFLHFCQUF1QywwQkFBMEIsQ0FBQyxDQUFBO0FBRWxFLHFCQUFzQixlQUFlLENBQUMsQ0FBQTtBQUV0Qyw4QkFBK0QsaUJBQWlCLENBQUMsQ0FBQTtBQUNqRixzQkFBK0IsU0FBUyxDQUFDLENBQUE7QUFHekMsOEJBQXFCLGlCQUFpQixDQUFDO0FBQS9CLHdDQUErQjtBQUV2Qyx5QkFBaUMsWUFBWSxDQUFDO0FBQXRDLG1DQUFzQztBQUVuQyxhQUFLLEdBQW1CLFVBQUMsQ0FBQyxJQUFLLE9BQUEsQ0FBQyxFQUFELENBQUMsQ0FBQztBQUU1QyxJQUFJLE9BQU8sR0FBUSxDQUFDLE9BQU8sTUFBTSxLQUFLLFdBQVcsR0FBRyxhQUFNLEdBQUcsTUFBTSxDQUFDLENBQUM7QUFFMUQsaUJBQVMsR0FBYSxPQUFPLENBQUMsU0FBUyxDQUFDO0FBTW5EOztHQUVHO0FBQ0g7SUFDRSw0QkFBb0IsS0FBZTtRQUFmLFVBQUssR0FBTCxLQUFLLENBQVU7SUFBRyxDQUFDO0lBRXZDLGlDQUFJLEdBQUosY0FBZSxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQ2hDLHlCQUFDO0FBQUQsQ0FBQyxBQUpELElBSUM7QUFKWSwwQkFBa0IscUJBSTlCLENBQUE7QUFFRCxJQUFJLGFBQWEsR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDO0FBQ3ZDLElBQUksV0FBVyxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUM7QUFDbkMsSUFBSSxZQUFZLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQztBQUNyQyxJQUFJLFlBQVksR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDO0FBQ3JDLElBQUksS0FBSyxHQUFHLE9BQU8sQ0FBQyxFQUFFLENBQUM7QUFDdkIsSUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQztBQUN6QixJQUFJLE1BQU0sR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDO0FBRXpCLElBQUksV0FBVyxHQUFHLEVBQUUsQ0FBQztBQUNyQixJQUFJLElBQUksR0FBRyxLQUFLLENBQUM7QUFDakIsT0FBTyxDQUFDLHdCQUF3QixHQUFHLEdBQUcsQ0FBQztBQUN2QyxJQUFJLGFBQWEsR0FBRyx3QkFBZ0IsQ0FBQyxNQUFNLEdBQUcsSUFBSSxHQUFHLE9BQU8sQ0FBQyx3QkFBd0IsQ0FBQztBQUV0RixJQUFJLFlBQVksR0FBRywrQkFBZSxFQUFFLENBQUM7QUFFckM7Ozs7R0FJRztBQUNIO0lBR0UsMEJBQW9CLE9BQXlCO1FBQXpCLFlBQU8sR0FBUCxPQUFPLENBQWtCO1FBRnJDLFNBQUksR0FBZ0QsRUFBRSxDQUFDO0lBRWYsQ0FBQztJQUVqRCxxQ0FBVSxHQUFWLFVBQVcsRUFBd0MsSUFBVSxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFbEYsOEJBQUcsR0FBSDtRQUNFLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUM7WUFBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxDQUFDO1FBQ3JDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQUMsRUFBRTtZQUNuQixNQUFNLENBQUMsaUJBQVUsQ0FBQyxFQUFFLENBQUMsR0FBZ0IsRUFBRyxFQUFFO2dCQUNsQixDQUFDLFlBQVksQ0FBQyxPQUFPLENBQTBCLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDOUUsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBQ0gsdUJBQUM7QUFBRCxDQUFDLEFBZEQsSUFjQztBQUVELDRDQUE0QztBQUM1QyxhQUFhLENBQUMsY0FBUSxZQUFZLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUUvQyxtQkFBbUIsS0FBSztJQUFFLGNBQU87U0FBUCxXQUFPLENBQVAsc0JBQU8sQ0FBUCxJQUFPO1FBQVAsNkJBQU87O0lBQy9CLElBQUksWUFBWSxHQUFHLFdBQVcsQ0FBQyxNQUFNLEtBQUssQ0FBQyxHQUFHLElBQUksR0FBRyxXQUFXLENBQUMsV0FBVyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztJQUN6RixJQUFJLE1BQU0sR0FBRyxJQUFJLGdCQUFnQixDQUFDLFlBQVksQ0FBQyxDQUFDO0lBQ2hELFdBQVcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDekIsSUFBSSxLQUFLLEdBQUcsS0FBSyxlQUFJLElBQUksQ0FBQyxDQUFDO0lBQzNCLFdBQVcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztJQUNsQixNQUFNLENBQUMsS0FBSyxDQUFDO0FBQ2YsQ0FBQztBQUVEO0lBQXlCLGNBQU87U0FBUCxXQUFPLENBQVAsc0JBQU8sQ0FBUCxJQUFPO1FBQVAsNkJBQU87O0lBQzlCLE1BQU0sQ0FBQyxTQUFTLGdCQUFDLFdBQVcsU0FBSyxJQUFJLEVBQUMsQ0FBQztBQUN6QyxDQUFDO0FBRmUsZ0JBQVEsV0FFdkIsQ0FBQTtBQUVEO0lBQTBCLGNBQU87U0FBUCxXQUFPLENBQVAsc0JBQU8sQ0FBUCxJQUFPO1FBQVAsNkJBQU87O0lBQy9CLE1BQU0sQ0FBQyxTQUFTLGdCQUFDLFlBQVksU0FBSyxJQUFJLEVBQUMsQ0FBQztBQUMxQyxDQUFDO0FBRmUsaUJBQVMsWUFFeEIsQ0FBQTtBQUVEO0lBQTBCLGNBQU87U0FBUCxXQUFPLENBQVAsc0JBQU8sQ0FBUCxJQUFPO1FBQVAsNkJBQU87O0lBQy9CLE1BQU0sQ0FBQyxTQUFTLGdCQUFDLFlBQVksU0FBSyxJQUFJLEVBQUMsQ0FBQztBQUMxQyxDQUFDO0FBRmUsaUJBQVMsWUFFeEIsQ0FBQTtBQUVELG9CQUEyQixFQUF3QztJQUNqRSxFQUFFLENBQUMsQ0FBQyxXQUFXLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDM0IsZ0VBQWdFO1FBQ2hFLFdBQVcsQ0FBQyxXQUFXLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUNyRCxDQUFDO0lBQUMsSUFBSSxDQUFDLENBQUM7UUFDTixrREFBa0Q7UUFDbEQsYUFBYSxDQUFhLEVBQUUsQ0FBQyxDQUFDO0lBQ2hDLENBQUM7QUFDSCxDQUFDO0FBUmUsa0JBQVUsYUFRekIsQ0FBQTtBQUVEOzs7Ozs7Ozs7OztHQVdHO0FBQ0gsNkJBQW9DLEVBQUU7SUFDcEMsYUFBYSxDQUFDO1FBQ1osSUFBSSxTQUFTLEdBQUcsRUFBRSxFQUFFLENBQUM7UUFDckIsRUFBRSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUM7WUFBQyxNQUFNLENBQUM7UUFDdkIsWUFBWSxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUN2QyxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUM7QUFOZSwyQkFBbUIsc0JBTWxDLENBQUE7QUFFRDs7R0FFRztBQUNILDRCQUFtQyxFQUFFO0lBQ25DLG1CQUFtQixDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQzFCLENBQUM7QUFGZSwwQkFBa0IscUJBRWpDLENBQUE7QUFFRCxhQUFhLEtBQWUsRUFBRSxJQUFZLEVBQUUsTUFBMkMsRUFDMUUsV0FBbUI7SUFDOUIsSUFBSSxNQUFNLEdBQUcsV0FBVyxDQUFDLFdBQVcsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDakQsSUFBSSxPQUFPLEdBQUcsV0FBSSxDQUFDLEdBQUcsQ0FBQyxhQUFhLEVBQUUsV0FBVyxDQUFDLENBQUM7SUFFbkQsRUFBRSxDQUFDLENBQUMsTUFBTSxZQUFZLHVDQUF1QixDQUFDLENBQUMsQ0FBQztRQUM5Qyw0RkFBNEY7UUFDNUYsUUFBUTtRQUNSLElBQUksU0FBTyxHQUFHLE1BQU0sQ0FBQztRQUVyQixFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3hDLEtBQUssQ0FBQyxJQUFJLEVBQUUsVUFBQyxJQUFJO2dCQUNmLElBQUksaUJBQWlCLEdBQUcsY0FBTyxDQUFDLGtCQUFrQixFQUFFO29CQUNsRCxVQUFVLEVBQUU7d0JBQ1YsMkVBQTJFO3dCQUMzRSxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQzs0QkFBQyxNQUFNLElBQUksS0FBSyxDQUFDLHNEQUFzRCxDQUFDLENBQUM7d0JBQ25GLE1BQU0sQ0FBQyxJQUFJLGtCQUFrQixDQUFDLElBQUksQ0FBQyxDQUFDO29CQUN0QyxDQUFDO2lCQUNGLENBQUMsQ0FBQztnQkFFSCxZQUFZLENBQUMsWUFBWSxDQUFDLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDO2dCQUMvQyxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUM7Z0JBRWIsSUFBSSxHQUFHLElBQUksQ0FBQztnQkFDWixZQUFZLENBQUMsT0FBTyxDQUFDLFNBQU8sQ0FBQyxDQUFDO2dCQUM5QixJQUFJLEdBQUcsS0FBSyxDQUFDO1lBQ2YsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQ2QsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ04sS0FBSyxDQUFDLElBQUksRUFBRTtnQkFDVixNQUFNLENBQUMsR0FBRyxFQUFFLENBQUM7Z0JBQ2IsWUFBWSxDQUFDLE9BQU8sQ0FBQyxTQUFPLENBQUMsQ0FBQztZQUNoQyxDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDZCxDQUFDO0lBRUgsQ0FBQztJQUFDLElBQUksQ0FBQyxDQUFDO1FBQ04sMkVBQTJFO1FBRTNFLEVBQUUsQ0FBQyxDQUFPLE1BQU8sQ0FBQyxNQUFNLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUMvQixLQUFLLENBQUMsSUFBSSxFQUFFO2dCQUNWLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQztnQkFDQSxNQUFPLEVBQUUsQ0FBQztZQUN6QixDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDZCxDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDTixLQUFLLENBQUMsSUFBSSxFQUFFLFVBQUMsSUFBSTtnQkFDZixNQUFNLENBQUMsR0FBRyxFQUFFLENBQUM7Z0JBQ0MsTUFBTyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQzlCLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQztRQUNkLENBQUM7SUFDSCxDQUFDO0FBQ0gsQ0FBQztBQUVELFlBQW1CLElBQUksRUFBRSxFQUFFLEVBQUUsT0FBYztJQUFkLHVCQUFjLEdBQWQsY0FBYztJQUN6QyxNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBQ3ZDLENBQUM7QUFGZSxVQUFFLEtBRWpCLENBQUE7QUFFRCxhQUFvQixJQUFJLEVBQUUsRUFBRSxFQUFFLE9BQWM7SUFBZCx1QkFBYyxHQUFkLGNBQWM7SUFDMUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxPQUFPLENBQUMsQ0FBQztBQUN4QyxDQUFDO0FBRmUsV0FBRyxNQUVsQixDQUFBO0FBRUQsYUFBb0IsSUFBSSxFQUFFLEVBQUUsRUFBRSxPQUFjO0lBQWQsdUJBQWMsR0FBZCxjQUFjO0lBQzFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsT0FBTyxDQUFDLENBQUM7QUFDeEMsQ0FBQztBQUZlLFdBQUcsTUFFbEIsQ0FBQTtBQWNEO0lBQ0UsbUJBQVksSUFBVztRQUFYLG9CQUFXLEdBQVgsV0FBVztRQUNyQixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQ1QsR0FBRyxDQUFDLENBQUMsSUFBSSxJQUFJLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7Z0JBQ2hDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQztnQkFDYixJQUFJLENBQUM7b0JBQ0gsQ0FBQyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQzNCLENBQUU7Z0JBQUEsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFLYixDQUFDO2dCQUNELEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLFVBQVUsQ0FBQyxDQUFDLENBQUM7b0JBQzVCLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ2pCLENBQUM7WUFDSCxDQUFDO1FBQ0gsQ0FBQztJQUNILENBQUM7SUFDRCwyREFBMkQ7SUFDM0QsZ0NBQVksR0FBWixVQUFhLElBQUksSUFBRyxDQUFDO0lBRXJCLHVCQUFHLEdBQUgsVUFBSSxJQUFJO1FBQ04sRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2hCLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsNEJBQTRCLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDdkQsQ0FBQztRQUNELE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDcEIsQ0FBQztJQUVELHdCQUFJLEdBQUosVUFBSyxJQUFJLEVBQUUsS0FBSyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDO0lBRWxDLGNBQUksR0FBWCxVQUFZLE1BQWEsRUFBRSxNQUFhLEVBQUUsU0FBZ0I7UUFBOUMsc0JBQWEsR0FBYixhQUFhO1FBQUUsc0JBQWEsR0FBYixhQUFhO1FBQUUseUJBQWdCLEdBQWhCLGdCQUFnQjtRQUN4RCxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxZQUFZLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNuQyxTQUFTLEdBQUcsTUFBTSxDQUFDO1lBQ25CLE1BQU0sR0FBRyxNQUFNLENBQUM7WUFDaEIsTUFBTSxHQUFHLElBQUksU0FBUyxFQUFFLENBQUM7UUFDM0IsQ0FBQztRQUVELElBQUksQ0FBQyxHQUFHLDZCQUFnQixDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFDbEQsNkJBQWdCLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBRSxVQUFDLEtBQUssRUFBRSxHQUFHLElBQU8sTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNuRixNQUFNLENBQUMsTUFBTSxDQUFDO0lBQ2hCLENBQUM7SUFFRCxnQkFBZ0I7SUFDaEIsZ0RBQTRCLEdBQTVCLFVBQTZCLElBQUk7UUFDL0IsSUFBSSxNQUFNLEdBQThCLE9BQU8sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDaEUsTUFBTSxDQUFDLFdBQVcsR0FBUSxNQUFNLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQztRQUM5QyxNQUFNLENBQUMsU0FBUyxHQUFRLE1BQU0sQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDO1FBQy9DLE1BQU0sQ0FBQyxLQUFLLEdBQVEsTUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUM7UUFDdkMsZ0VBQWdFO1FBQ2hFLE1BQU0sQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzdCLE1BQU0sQ0FBQyxNQUFNLENBQUM7SUFDaEIsQ0FBQztJQUNILGdCQUFDO0FBQUQsQ0FBQyxBQXJERCxJQXFEQztBQXJEWSxpQkFBUyxZQXFEckIsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7U3RyaW5nTWFwV3JhcHBlcn0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9jb2xsZWN0aW9uJztcbmltcG9ydCB7Z2xvYmFsLCBpc0Z1bmN0aW9uLCBNYXRofSBmcm9tICdhbmd1bGFyMi9zcmMvZmFjYWRlL2xhbmcnO1xuXG5pbXBvcnQge3Byb3ZpZGV9IGZyb20gJ2FuZ3VsYXIyL2NvcmUnO1xuXG5pbXBvcnQge2dldFRlc3RJbmplY3RvciwgRnVuY3Rpb25XaXRoUGFyYW1Ub2tlbnMsIGluamVjdH0gZnJvbSAnLi90ZXN0X2luamVjdG9yJztcbmltcG9ydCB7YnJvd3NlckRldGVjdGlvbn0gZnJvbSAnLi91dGlscyc7XG5pbXBvcnQge05nWm9uZX0gZnJvbSAnYW5ndWxhcjIvc3JjL2NvcmUvem9uZS9uZ196b25lJztcblxuZXhwb3J0IHtpbmplY3R9IGZyb20gJy4vdGVzdF9pbmplY3Rvcic7XG5cbmV4cG9ydCB7ZXhwZWN0LCBOZ01hdGNoZXJzfSBmcm9tICcuL21hdGNoZXJzJztcblxuZXhwb3J0IHZhciBwcm94eTogQ2xhc3NEZWNvcmF0b3IgPSAodCkgPT4gdDtcblxudmFyIF9nbG9iYWwgPSA8YW55Pih0eXBlb2Ygd2luZG93ID09PSAndW5kZWZpbmVkJyA/IGdsb2JhbCA6IHdpbmRvdyk7XG5cbmV4cG9ydCB2YXIgYWZ0ZXJFYWNoOiBGdW5jdGlvbiA9IF9nbG9iYWwuYWZ0ZXJFYWNoO1xuXG5leHBvcnQgdHlwZSBTeW5jVGVzdEZuID0gKCkgPT4gdm9pZDtcbnR5cGUgQXN5bmNUZXN0Rm4gPSAoZG9uZTogKCkgPT4gdm9pZCkgPT4gdm9pZDtcbnR5cGUgQW55VGVzdEZuID0gU3luY1Rlc3RGbiB8IEFzeW5jVGVzdEZuO1xuXG4vKipcbiAqIEluamVjdGFibGUgY29tcGxldGVyIHRoYXQgYWxsb3dzIHNpZ25hbGluZyBjb21wbGV0aW9uIG9mIGFuIGFzeW5jaHJvbm91cyB0ZXN0LiBVc2VkIGludGVybmFsbHkuXG4gKi9cbmV4cG9ydCBjbGFzcyBBc3luY1Rlc3RDb21wbGV0ZXIge1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9kb25lOiBGdW5jdGlvbikge31cblxuICBkb25lKCk6IHZvaWQgeyB0aGlzLl9kb25lKCk7IH1cbn1cblxudmFyIGpzbUJlZm9yZUVhY2ggPSBfZ2xvYmFsLmJlZm9yZUVhY2g7XG52YXIganNtRGVzY3JpYmUgPSBfZ2xvYmFsLmRlc2NyaWJlO1xudmFyIGpzbUREZXNjcmliZSA9IF9nbG9iYWwuZmRlc2NyaWJlO1xudmFyIGpzbVhEZXNjcmliZSA9IF9nbG9iYWwueGRlc2NyaWJlO1xudmFyIGpzbUl0ID0gX2dsb2JhbC5pdDtcbnZhciBqc21JSXQgPSBfZ2xvYmFsLmZpdDtcbnZhciBqc21YSXQgPSBfZ2xvYmFsLnhpdDtcblxudmFyIHJ1bm5lclN0YWNrID0gW107XG52YXIgaW5JdCA9IGZhbHNlO1xuamFzbWluZS5ERUZBVUxUX1RJTUVPVVRfSU5URVJWQUwgPSA1MDA7XG52YXIgZ2xvYmFsVGltZU91dCA9IGJyb3dzZXJEZXRlY3Rpb24uaXNTbG93ID8gMzAwMCA6IGphc21pbmUuREVGQVVMVF9USU1FT1VUX0lOVEVSVkFMO1xuXG52YXIgdGVzdEluamVjdG9yID0gZ2V0VGVzdEluamVjdG9yKCk7XG5cbi8qKlxuICogTWVjaGFuaXNtIHRvIHJ1biBgYmVmb3JlRWFjaCgpYCBmdW5jdGlvbnMgb2YgQW5ndWxhciB0ZXN0cy5cbiAqXG4gKiBOb3RlOiBKYXNtaW5lIG93biBgYmVmb3JlRWFjaGAgaXMgdXNlZCBieSB0aGlzIGxpYnJhcnkgdG8gaGFuZGxlIERJIHByb3ZpZGVycy5cbiAqL1xuY2xhc3MgQmVmb3JlRWFjaFJ1bm5lciB7XG4gIHByaXZhdGUgX2ZuczogQXJyYXk8RnVuY3Rpb25XaXRoUGFyYW1Ub2tlbnMgfCBTeW5jVGVzdEZuPiA9IFtdO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgX3BhcmVudDogQmVmb3JlRWFjaFJ1bm5lcikge31cblxuICBiZWZvcmVFYWNoKGZuOiBGdW5jdGlvbldpdGhQYXJhbVRva2VucyB8IFN5bmNUZXN0Rm4pOiB2b2lkIHsgdGhpcy5fZm5zLnB1c2goZm4pOyB9XG5cbiAgcnVuKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLl9wYXJlbnQpIHRoaXMuX3BhcmVudC5ydW4oKTtcbiAgICB0aGlzLl9mbnMuZm9yRWFjaCgoZm4pID0+IHtcbiAgICAgIHJldHVybiBpc0Z1bmN0aW9uKGZuKSA/ICg8U3luY1Rlc3RGbj5mbikoKSA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAodGVzdEluamVjdG9yLmV4ZWN1dGUoPEZ1bmN0aW9uV2l0aFBhcmFtVG9rZW5zPmZuKSk7XG4gICAgfSk7XG4gIH1cbn1cblxuLy8gUmVzZXQgdGhlIHRlc3QgcHJvdmlkZXJzIGJlZm9yZSBlYWNoIHRlc3RcbmpzbUJlZm9yZUVhY2goKCkgPT4geyB0ZXN0SW5qZWN0b3IucmVzZXQoKTsgfSk7XG5cbmZ1bmN0aW9uIF9kZXNjcmliZShqc21GbiwgLi4uYXJncykge1xuICB2YXIgcGFyZW50UnVubmVyID0gcnVubmVyU3RhY2subGVuZ3RoID09PSAwID8gbnVsbCA6IHJ1bm5lclN0YWNrW3J1bm5lclN0YWNrLmxlbmd0aCAtIDFdO1xuICB2YXIgcnVubmVyID0gbmV3IEJlZm9yZUVhY2hSdW5uZXIocGFyZW50UnVubmVyKTtcbiAgcnVubmVyU3RhY2sucHVzaChydW5uZXIpO1xuICB2YXIgc3VpdGUgPSBqc21GbiguLi5hcmdzKTtcbiAgcnVubmVyU3RhY2sucG9wKCk7XG4gIHJldHVybiBzdWl0ZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRlc2NyaWJlKC4uLmFyZ3MpOiB2b2lkIHtcbiAgcmV0dXJuIF9kZXNjcmliZShqc21EZXNjcmliZSwgLi4uYXJncyk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkZGVzY3JpYmUoLi4uYXJncyk6IHZvaWQge1xuICByZXR1cm4gX2Rlc2NyaWJlKGpzbUREZXNjcmliZSwgLi4uYXJncyk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB4ZGVzY3JpYmUoLi4uYXJncyk6IHZvaWQge1xuICByZXR1cm4gX2Rlc2NyaWJlKGpzbVhEZXNjcmliZSwgLi4uYXJncyk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBiZWZvcmVFYWNoKGZuOiBGdW5jdGlvbldpdGhQYXJhbVRva2VucyB8IFN5bmNUZXN0Rm4pOiB2b2lkIHtcbiAgaWYgKHJ1bm5lclN0YWNrLmxlbmd0aCA+IDApIHtcbiAgICAvLyBJbnNpZGUgYSBkZXNjcmliZSBibG9jaywgYmVmb3JlRWFjaCgpIHVzZXMgYSBCZWZvcmVFYWNoUnVubmVyXG4gICAgcnVubmVyU3RhY2tbcnVubmVyU3RhY2subGVuZ3RoIC0gMV0uYmVmb3JlRWFjaChmbik7XG4gIH0gZWxzZSB7XG4gICAgLy8gVG9wIGxldmVsIGJlZm9yZUVhY2goKSBhcmUgZGVsZWdhdGVkIHRvIGphc21pbmVcbiAgICBqc21CZWZvcmVFYWNoKDxTeW5jVGVzdEZuPmZuKTtcbiAgfVxufVxuXG4vKipcbiAqIEFsbG93cyBvdmVycmlkaW5nIGRlZmF1bHQgcHJvdmlkZXJzIGRlZmluZWQgaW4gdGVzdF9pbmplY3Rvci5qcy5cbiAqXG4gKiBUaGUgZ2l2ZW4gZnVuY3Rpb24gbXVzdCByZXR1cm4gYSBsaXN0IG9mIERJIHByb3ZpZGVycy5cbiAqXG4gKiBFeGFtcGxlOlxuICpcbiAqICAgYmVmb3JlRWFjaFByb3ZpZGVycygoKSA9PiBbXG4gKiAgICAgcHJvdmlkZShDb21waWxlciwge3VzZUNsYXNzOiBNb2NrQ29tcGlsZXJ9KSxcbiAqICAgICBwcm92aWRlKFNvbWVUb2tlbiwge3VzZVZhbHVlOiBteVZhbHVlfSksXG4gKiAgIF0pO1xuICovXG5leHBvcnQgZnVuY3Rpb24gYmVmb3JlRWFjaFByb3ZpZGVycyhmbik6IHZvaWQge1xuICBqc21CZWZvcmVFYWNoKCgpID0+IHtcbiAgICB2YXIgcHJvdmlkZXJzID0gZm4oKTtcbiAgICBpZiAoIXByb3ZpZGVycykgcmV0dXJuO1xuICAgIHRlc3RJbmplY3Rvci5hZGRQcm92aWRlcnMocHJvdmlkZXJzKTtcbiAgfSk7XG59XG5cbi8qKlxuICogQGRlcHJlY2F0ZWRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGJlZm9yZUVhY2hCaW5kaW5ncyhmbik6IHZvaWQge1xuICBiZWZvcmVFYWNoUHJvdmlkZXJzKGZuKTtcbn1cblxuZnVuY3Rpb24gX2l0KGpzbUZuOiBGdW5jdGlvbiwgbmFtZTogc3RyaW5nLCB0ZXN0Rm46IEZ1bmN0aW9uV2l0aFBhcmFtVG9rZW5zIHwgQW55VGVzdEZuLFxuICAgICAgICAgICAgIHRlc3RUaW1lT3V0OiBudW1iZXIpOiB2b2lkIHtcbiAgdmFyIHJ1bm5lciA9IHJ1bm5lclN0YWNrW3J1bm5lclN0YWNrLmxlbmd0aCAtIDFdO1xuICB2YXIgdGltZU91dCA9IE1hdGgubWF4KGdsb2JhbFRpbWVPdXQsIHRlc3RUaW1lT3V0KTtcblxuICBpZiAodGVzdEZuIGluc3RhbmNlb2YgRnVuY3Rpb25XaXRoUGFyYW1Ub2tlbnMpIHtcbiAgICAvLyBUaGUgdGVzdCBjYXNlIHVzZXMgaW5qZWN0KCkuIGllIGBpdCgndGVzdCcsIGluamVjdChbQXN5bmNUZXN0Q29tcGxldGVyXSwgKGFzeW5jKSA9PiB7IC4uLlxuICAgIC8vIH0pKTtgXG4gICAgbGV0IHRlc3RGblQgPSB0ZXN0Rm47XG5cbiAgICBpZiAodGVzdEZuLmhhc1Rva2VuKEFzeW5jVGVzdENvbXBsZXRlcikpIHtcbiAgICAgIGpzbUZuKG5hbWUsIChkb25lKSA9PiB7XG4gICAgICAgIHZhciBjb21wbGV0ZXJQcm92aWRlciA9IHByb3ZpZGUoQXN5bmNUZXN0Q29tcGxldGVyLCB7XG4gICAgICAgICAgdXNlRmFjdG9yeTogKCkgPT4ge1xuICAgICAgICAgICAgLy8gTWFyayB0aGUgdGVzdCBhcyBhc3luYyB3aGVuIGFuIEFzeW5jVGVzdENvbXBsZXRlciBpcyBpbmplY3RlZCBpbiBhbiBpdCgpXG4gICAgICAgICAgICBpZiAoIWluSXQpIHRocm93IG5ldyBFcnJvcignQXN5bmNUZXN0Q29tcGxldGVyIGNhbiBvbmx5IGJlIGluamVjdGVkIGluIGFuIFwiaXQoKVwiJyk7XG4gICAgICAgICAgICByZXR1cm4gbmV3IEFzeW5jVGVzdENvbXBsZXRlcihkb25lKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRlc3RJbmplY3Rvci5hZGRQcm92aWRlcnMoW2NvbXBsZXRlclByb3ZpZGVyXSk7XG4gICAgICAgIHJ1bm5lci5ydW4oKTtcblxuICAgICAgICBpbkl0ID0gdHJ1ZTtcbiAgICAgICAgdGVzdEluamVjdG9yLmV4ZWN1dGUodGVzdEZuVCk7XG4gICAgICAgIGluSXQgPSBmYWxzZTtcbiAgICAgIH0sIHRpbWVPdXQpO1xuICAgIH0gZWxzZSB7XG4gICAgICBqc21GbihuYW1lLCAoKSA9PiB7XG4gICAgICAgIHJ1bm5lci5ydW4oKTtcbiAgICAgICAgdGVzdEluamVjdG9yLmV4ZWN1dGUodGVzdEZuVCk7XG4gICAgICB9LCB0aW1lT3V0KTtcbiAgICB9XG5cbiAgfSBlbHNlIHtcbiAgICAvLyBUaGUgdGVzdCBjYXNlIGRvZXNuJ3QgdXNlIGluamVjdCgpLiBpZSBgaXQoJ3Rlc3QnLCAoZG9uZSkgPT4geyAuLi4gfSkpO2BcblxuICAgIGlmICgoPGFueT50ZXN0Rm4pLmxlbmd0aCA9PT0gMCkge1xuICAgICAganNtRm4obmFtZSwgKCkgPT4ge1xuICAgICAgICBydW5uZXIucnVuKCk7XG4gICAgICAgICg8U3luY1Rlc3RGbj50ZXN0Rm4pKCk7XG4gICAgICB9LCB0aW1lT3V0KTtcbiAgICB9IGVsc2Uge1xuICAgICAganNtRm4obmFtZSwgKGRvbmUpID0+IHtcbiAgICAgICAgcnVubmVyLnJ1bigpO1xuICAgICAgICAoPEFzeW5jVGVzdEZuPnRlc3RGbikoZG9uZSk7XG4gICAgICB9LCB0aW1lT3V0KTtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGl0KG5hbWUsIGZuLCB0aW1lT3V0ID0gbnVsbCk6IHZvaWQge1xuICByZXR1cm4gX2l0KGpzbUl0LCBuYW1lLCBmbiwgdGltZU91dCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB4aXQobmFtZSwgZm4sIHRpbWVPdXQgPSBudWxsKTogdm9pZCB7XG4gIHJldHVybiBfaXQoanNtWEl0LCBuYW1lLCBmbiwgdGltZU91dCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpaXQobmFtZSwgZm4sIHRpbWVPdXQgPSBudWxsKTogdm9pZCB7XG4gIHJldHVybiBfaXQoanNtSUl0LCBuYW1lLCBmbiwgdGltZU91dCk7XG59XG5cblxuZXhwb3J0IGludGVyZmFjZSBHdWluZXNzQ29tcGF0aWJsZVNweSBleHRlbmRzIGphc21pbmUuU3B5IHtcbiAgLyoqIEJ5IGNoYWluaW5nIHRoZSBzcHkgd2l0aCBhbmQucmV0dXJuVmFsdWUsIGFsbCBjYWxscyB0byB0aGUgZnVuY3Rpb24gd2lsbCByZXR1cm4gYSBzcGVjaWZpY1xuICAgKiB2YWx1ZS4gKi9cbiAgYW5kUmV0dXJuKHZhbDogYW55KTogdm9pZDtcbiAgLyoqIEJ5IGNoYWluaW5nIHRoZSBzcHkgd2l0aCBhbmQuY2FsbEZha2UsIGFsbCBjYWxscyB0byB0aGUgc3B5IHdpbGwgZGVsZWdhdGUgdG8gdGhlIHN1cHBsaWVkXG4gICAqIGZ1bmN0aW9uLiAqL1xuICBhbmRDYWxsRmFrZShmbjogRnVuY3Rpb24pOiBHdWluZXNzQ29tcGF0aWJsZVNweTtcbiAgLyoqIHJlbW92ZXMgYWxsIHJlY29yZGVkIGNhbGxzICovXG4gIHJlc2V0KCk7XG59XG5cbmV4cG9ydCBjbGFzcyBTcHlPYmplY3Qge1xuICBjb25zdHJ1Y3Rvcih0eXBlID0gbnVsbCkge1xuICAgIGlmICh0eXBlKSB7XG4gICAgICBmb3IgKHZhciBwcm9wIGluIHR5cGUucHJvdG90eXBlKSB7XG4gICAgICAgIHZhciBtID0gbnVsbDtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBtID0gdHlwZS5wcm90b3R5cGVbcHJvcF07XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAvLyBBcyB3ZSBhcmUgY3JlYXRpbmcgc3B5cyBmb3IgYWJzdHJhY3QgY2xhc3NlcyxcbiAgICAgICAgICAvLyB0aGVzZSBjbGFzc2VzIG1pZ2h0IGhhdmUgZ2V0dGVycyB0aGF0IHRocm93IHdoZW4gdGhleSBhcmUgYWNjZXNzZWQuXG4gICAgICAgICAgLy8gQXMgd2UgYXJlIG9ubHkgYXV0byBjcmVhdGluZyBzcHlzIGZvciBtZXRob2RzLCB0aGlzXG4gICAgICAgICAgLy8gc2hvdWxkIG5vdCBtYXR0ZXIuXG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGVvZiBtID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgdGhpcy5zcHkocHJvcCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgLy8gTm9vcCBzbyB0aGF0IFNweU9iamVjdCBoYXMgdGhlIHNhbWUgaW50ZXJmYWNlIGFzIGluIERhcnRcbiAgbm9TdWNoTWV0aG9kKGFyZ3MpIHt9XG5cbiAgc3B5KG5hbWUpIHtcbiAgICBpZiAoIXRoaXNbbmFtZV0pIHtcbiAgICAgIHRoaXNbbmFtZV0gPSB0aGlzLl9jcmVhdGVHdWlubmVzc0NvbXBhdGlibGVTcHkobmFtZSk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzW25hbWVdO1xuICB9XG5cbiAgcHJvcChuYW1lLCB2YWx1ZSkgeyB0aGlzW25hbWVdID0gdmFsdWU7IH1cblxuICBzdGF0aWMgc3R1YihvYmplY3QgPSBudWxsLCBjb25maWcgPSBudWxsLCBvdmVycmlkZXMgPSBudWxsKSB7XG4gICAgaWYgKCEob2JqZWN0IGluc3RhbmNlb2YgU3B5T2JqZWN0KSkge1xuICAgICAgb3ZlcnJpZGVzID0gY29uZmlnO1xuICAgICAgY29uZmlnID0gb2JqZWN0O1xuICAgICAgb2JqZWN0ID0gbmV3IFNweU9iamVjdCgpO1xuICAgIH1cblxuICAgIHZhciBtID0gU3RyaW5nTWFwV3JhcHBlci5tZXJnZShjb25maWcsIG92ZXJyaWRlcyk7XG4gICAgU3RyaW5nTWFwV3JhcHBlci5mb3JFYWNoKG0sICh2YWx1ZSwga2V5KSA9PiB7IG9iamVjdC5zcHkoa2V5KS5hbmRSZXR1cm4odmFsdWUpOyB9KTtcbiAgICByZXR1cm4gb2JqZWN0O1xuICB9XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfY3JlYXRlR3Vpbm5lc3NDb21wYXRpYmxlU3B5KG5hbWUpOiBHdWluZXNzQ29tcGF0aWJsZVNweSB7XG4gICAgdmFyIG5ld1NweTogR3VpbmVzc0NvbXBhdGlibGVTcHkgPSA8YW55Pmphc21pbmUuY3JlYXRlU3B5KG5hbWUpO1xuICAgIG5ld1NweS5hbmRDYWxsRmFrZSA9IDxhbnk+bmV3U3B5LmFuZC5jYWxsRmFrZTtcbiAgICBuZXdTcHkuYW5kUmV0dXJuID0gPGFueT5uZXdTcHkuYW5kLnJldHVyblZhbHVlO1xuICAgIG5ld1NweS5yZXNldCA9IDxhbnk+bmV3U3B5LmNhbGxzLnJlc2V0O1xuICAgIC8vIHJldmlzaXQgcmV0dXJuIG51bGwgaGVyZSAocHJldmlvdXNseSBuZWVkZWQgZm9yIHJ0dHNfYXNzZXJ0KS5cbiAgICBuZXdTcHkuYW5kLnJldHVyblZhbHVlKG51bGwpO1xuICAgIHJldHVybiBuZXdTcHk7XG4gIH1cbn1cbiJdfQ==