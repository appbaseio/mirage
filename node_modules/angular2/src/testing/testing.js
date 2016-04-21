'use strict';"use strict";
/**
 * Public Test Library for unit testing Angular2 Applications. Uses the
 * Jasmine framework.
 */
var lang_1 = require('angular2/src/facade/lang');
var test_injector_1 = require('./test_injector');
var test_injector_2 = require('./test_injector');
exports.inject = test_injector_2.inject;
exports.injectAsync = test_injector_2.injectAsync;
var matchers_1 = require('./matchers');
exports.expect = matchers_1.expect;
var _global = (typeof window === 'undefined' ? lang_1.global : window);
/**
 * Run a function (with an optional asynchronous callback) after each test case.
 *
 * See http://jasmine.github.io/ for more details.
 *
 * ## Example:
 *
 * {@example testing/ts/testing.ts region='afterEach'}
 */
exports.afterEach = _global.afterEach;
/**
 * Group test cases together under a common description prefix.
 *
 * See http://jasmine.github.io/ for more details.
 *
 * ## Example:
 *
 * {@example testing/ts/testing.ts region='describeIt'}
 */
exports.describe = _global.describe;
/**
 * See {@link fdescribe}.
 */
exports.ddescribe = _global.fdescribe;
/**
 * Like {@link describe}, but instructs the test runner to only run
 * the test cases in this group. This is useful for debugging.
 *
 * See http://jasmine.github.io/ for more details.
 *
 * ## Example:
 *
 * {@example testing/ts/testing.ts region='fdescribe'}
 */
exports.fdescribe = _global.fdescribe;
/**
 * Like {@link describe}, but instructs the test runner to exclude
 * this group of test cases from execution. This is useful for
 * debugging, or for excluding broken tests until they can be fixed.
 *
 * See http://jasmine.github.io/ for more details.
 *
 * ## Example:
 *
 * {@example testing/ts/testing.ts region='xdescribe'}
 */
exports.xdescribe = _global.xdescribe;
var jsmBeforeEach = _global.beforeEach;
var jsmIt = _global.it;
var jsmIIt = _global.fit;
var jsmXIt = _global.xit;
var testInjector = test_injector_1.getTestInjector();
// Reset the test providers before each test.
jsmBeforeEach(function () { testInjector.reset(); });
/**
 * Allows overriding default providers of the test injector,
 * which are defined in test_injector.js.
 *
 * The given function must return a list of DI providers.
 *
 * ## Example:
 *
 * {@example testing/ts/testing.ts region='beforeEachProviders'}
 */
function beforeEachProviders(fn) {
    jsmBeforeEach(function () {
        var providers = fn();
        if (!providers)
            return;
        try {
            testInjector.addProviders(providers);
        }
        catch (e) {
            throw new Error('beforeEachProviders was called after the injector had ' +
                'been used in a beforeEach or it block. This invalidates the ' +
                'test injector');
        }
    });
}
exports.beforeEachProviders = beforeEachProviders;
function _isPromiseLike(input) {
    return input && !!(input.then);
}
function _it(jsmFn, name, testFn, testTimeOut) {
    var timeOut = testTimeOut;
    if (testFn instanceof test_injector_1.FunctionWithParamTokens) {
        var testFnT_1 = testFn;
        jsmFn(name, function (done) {
            var returnedTestValue;
            try {
                returnedTestValue = testInjector.execute(testFnT_1);
            }
            catch (err) {
                done.fail(err);
                return;
            }
            if (testFnT_1.isAsync) {
                if (_isPromiseLike(returnedTestValue)) {
                    returnedTestValue.then(function () { done(); }, function (err) { done.fail(err); });
                }
                else {
                    done.fail('Error: injectAsync was expected to return a promise, but the ' +
                        ' returned value was: ' + returnedTestValue);
                }
            }
            else {
                if (!(returnedTestValue === undefined)) {
                    done.fail('Error: inject returned a value. Did you mean to use injectAsync? Returned ' +
                        'value was: ' + returnedTestValue);
                }
                done();
            }
        }, timeOut);
    }
    else {
        // The test case doesn't use inject(). ie `it('test', (done) => { ... }));`
        jsmFn(name, testFn, timeOut);
    }
}
/**
 * Wrapper around Jasmine beforeEach function.
 *
 * beforeEach may be used with the `inject` function to fetch dependencies.
 * The test will automatically wait for any asynchronous calls inside the
 * injected test function to complete.
 *
 * See http://jasmine.github.io/ for more details.
 *
 * ## Example:
 *
 * {@example testing/ts/testing.ts region='beforeEach'}
 */
function beforeEach(fn) {
    if (fn instanceof test_injector_1.FunctionWithParamTokens) {
        // The test case uses inject(). ie `beforeEach(inject([ClassA], (a) => { ...
        // }));`
        var fnT_1 = fn;
        jsmBeforeEach(function (done) {
            var returnedTestValue;
            try {
                returnedTestValue = testInjector.execute(fnT_1);
            }
            catch (err) {
                done.fail(err);
                return;
            }
            if (fnT_1.isAsync) {
                if (_isPromiseLike(returnedTestValue)) {
                    returnedTestValue.then(function () { done(); }, function (err) { done.fail(err); });
                }
                else {
                    done.fail('Error: injectAsync was expected to return a promise, but the ' +
                        ' returned value was: ' + returnedTestValue);
                }
            }
            else {
                if (!(returnedTestValue === undefined)) {
                    done.fail('Error: inject returned a value. Did you mean to use injectAsync? Returned ' +
                        'value was: ' + returnedTestValue);
                }
                done();
            }
        });
    }
    else {
        // The test case doesn't use inject(). ie `beforeEach((done) => { ... }));`
        if (fn.length === 0) {
            jsmBeforeEach(function () { fn(); });
        }
        else {
            jsmBeforeEach(function (done) { fn(done); });
        }
    }
}
exports.beforeEach = beforeEach;
/**
 * Define a single test case with the given test name and execution function.
 *
 * The test function can be either a synchronous function, an asynchronous function
 * that takes a completion callback, or an injected function created via {@link inject}
 * or {@link injectAsync}. The test will automatically wait for any asynchronous calls
 * inside the injected test function to complete.
 *
 * Wrapper around Jasmine it function. See http://jasmine.github.io/ for more details.
 *
 * ## Example:
 *
 * {@example testing/ts/testing.ts region='describeIt'}
 */
function it(name, fn, timeOut) {
    if (timeOut === void 0) { timeOut = null; }
    return _it(jsmIt, name, fn, timeOut);
}
exports.it = it;
/**
 * Like {@link it}, but instructs the test runner to exclude this test
 * entirely. Useful for debugging or for excluding broken tests until
 * they can be fixed.
 *
 * Wrapper around Jasmine xit function. See http://jasmine.github.io/ for more details.
 *
 * ## Example:
 *
 * {@example testing/ts/testing.ts region='xit'}
 */
function xit(name, fn, timeOut) {
    if (timeOut === void 0) { timeOut = null; }
    return _it(jsmXIt, name, fn, timeOut);
}
exports.xit = xit;
/**
 * See {@link fit}.
 */
function iit(name, fn, timeOut) {
    if (timeOut === void 0) { timeOut = null; }
    return _it(jsmIIt, name, fn, timeOut);
}
exports.iit = iit;
/**
 * Like {@link it}, but instructs the test runner to only run this test.
 * Useful for debugging.
 *
 * Wrapper around Jasmine fit function. See http://jasmine.github.io/ for more details.
 *
 * ## Example:
 *
 * {@example testing/ts/testing.ts region='fit'}
 */
function fit(name, fn, timeOut) {
    if (timeOut === void 0) { timeOut = null; }
    return _it(jsmIIt, name, fn, timeOut);
}
exports.fit = fit;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdGluZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRpZmZpbmdfcGx1Z2luX3dyYXBwZXItb3V0cHV0X3BhdGgtY25SOXVlbGUudG1wL2FuZ3VsYXIyL3NyYy90ZXN0aW5nL3Rlc3RpbmcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7R0FHRztBQUNILHFCQUFxQiwwQkFBMEIsQ0FBQyxDQUFBO0FBSWhELDhCQU1PLGlCQUFpQixDQUFDLENBQUE7QUFFekIsOEJBQWtDLGlCQUFpQixDQUFDO0FBQTVDLHdDQUFNO0FBQUUsa0RBQW9DO0FBRXBELHlCQUFpQyxZQUFZLENBQUM7QUFBdEMsbUNBQXNDO0FBRTlDLElBQUksT0FBTyxHQUFRLENBQUMsT0FBTyxNQUFNLEtBQUssV0FBVyxHQUFHLGFBQU0sR0FBRyxNQUFNLENBQUMsQ0FBQztBQUVyRTs7Ozs7Ozs7R0FRRztBQUNRLGlCQUFTLEdBQWEsT0FBTyxDQUFDLFNBQVMsQ0FBQztBQUVuRDs7Ozs7Ozs7R0FRRztBQUNRLGdCQUFRLEdBQWEsT0FBTyxDQUFDLFFBQVEsQ0FBQztBQUVqRDs7R0FFRztBQUNRLGlCQUFTLEdBQWEsT0FBTyxDQUFDLFNBQVMsQ0FBQztBQUVuRDs7Ozs7Ozs7O0dBU0c7QUFDUSxpQkFBUyxHQUFhLE9BQU8sQ0FBQyxTQUFTLENBQUM7QUFFbkQ7Ozs7Ozs7Ozs7R0FVRztBQUNRLGlCQUFTLEdBQWEsT0FBTyxDQUFDLFNBQVMsQ0FBQztBQWtCbkQsSUFBSSxhQUFhLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQztBQUN2QyxJQUFJLEtBQUssR0FBRyxPQUFPLENBQUMsRUFBRSxDQUFDO0FBQ3ZCLElBQUksTUFBTSxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUM7QUFDekIsSUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQztBQUV6QixJQUFJLFlBQVksR0FBaUIsK0JBQWUsRUFBRSxDQUFDO0FBRW5ELDZDQUE2QztBQUM3QyxhQUFhLENBQUMsY0FB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SSxFQUFFLEVBQUUsRUFBRSxPQUFPLENBQUMsQ0FBQztBQUN4QyxDQUFDO0FBSGUsV0FBRyxNQUdsQixDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBQdWJsaWMgVGVzdCBMaWJyYXJ5IGZvciB1bml0IHRlc3RpbmcgQW5ndWxhcjIgQXBwbGljYXRpb25zLiBVc2VzIHRoZVxuICogSmFzbWluZSBmcmFtZXdvcmsuXG4gKi9cbmltcG9ydCB7Z2xvYmFsfSBmcm9tICdhbmd1bGFyMi9zcmMvZmFjYWRlL2xhbmcnO1xuaW1wb3J0IHtMaXN0V3JhcHBlcn0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9jb2xsZWN0aW9uJztcbmltcG9ydCB7YmluZH0gZnJvbSAnYW5ndWxhcjIvY29yZSc7XG5cbmltcG9ydCB7XG4gIEZ1bmN0aW9uV2l0aFBhcmFtVG9rZW5zLFxuICBpbmplY3QsXG4gIGluamVjdEFzeW5jLFxuICBUZXN0SW5qZWN0b3IsXG4gIGdldFRlc3RJbmplY3RvclxufSBmcm9tICcuL3Rlc3RfaW5qZWN0b3InO1xuXG5leHBvcnQge2luamVjdCwgaW5qZWN0QXN5bmN9IGZyb20gJy4vdGVzdF9pbmplY3Rvcic7XG5cbmV4cG9ydCB7ZXhwZWN0LCBOZ01hdGNoZXJzfSBmcm9tICcuL21hdGNoZXJzJztcblxudmFyIF9nbG9iYWwgPSA8YW55Pih0eXBlb2Ygd2luZG93ID09PSAndW5kZWZpbmVkJyA/IGdsb2JhbCA6IHdpbmRvdyk7XG5cbi8qKlxuICogUnVuIGEgZnVuY3Rpb24gKHdpdGggYW4gb3B0aW9uYWwgYXN5bmNocm9ub3VzIGNhbGxiYWNrKSBhZnRlciBlYWNoIHRlc3QgY2FzZS5cbiAqXG4gKiBTZWUgaHR0cDovL2phc21pbmUuZ2l0aHViLmlvLyBmb3IgbW9yZSBkZXRhaWxzLlxuICpcbiAqICMjIEV4YW1wbGU6XG4gKlxuICoge0BleGFtcGxlIHRlc3RpbmcvdHMvdGVzdGluZy50cyByZWdpb249J2FmdGVyRWFjaCd9XG4gKi9cbmV4cG9ydCB2YXIgYWZ0ZXJFYWNoOiBGdW5jdGlvbiA9IF9nbG9iYWwuYWZ0ZXJFYWNoO1xuXG4vKipcbiAqIEdyb3VwIHRlc3QgY2FzZXMgdG9nZXRoZXIgdW5kZXIgYSBjb21tb24gZGVzY3JpcHRpb24gcHJlZml4LlxuICpcbiAqIFNlZSBodHRwOi8vamFzbWluZS5naXRodWIuaW8vIGZvciBtb3JlIGRldGFpbHMuXG4gKlxuICogIyMgRXhhbXBsZTpcbiAqXG4gKiB7QGV4YW1wbGUgdGVzdGluZy90cy90ZXN0aW5nLnRzIHJlZ2lvbj0nZGVzY3JpYmVJdCd9XG4gKi9cbmV4cG9ydCB2YXIgZGVzY3JpYmU6IEZ1bmN0aW9uID0gX2dsb2JhbC5kZXNjcmliZTtcblxuLyoqXG4gKiBTZWUge0BsaW5rIGZkZXNjcmliZX0uXG4gKi9cbmV4cG9ydCB2YXIgZGRlc2NyaWJlOiBGdW5jdGlvbiA9IF9nbG9iYWwuZmRlc2NyaWJlO1xuXG4vKipcbiAqIExpa2Uge0BsaW5rIGRlc2NyaWJlfSwgYnV0IGluc3RydWN0cyB0aGUgdGVzdCBydW5uZXIgdG8gb25seSBydW5cbiAqIHRoZSB0ZXN0IGNhc2VzIGluIHRoaXMgZ3JvdXAuIFRoaXMgaXMgdXNlZnVsIGZvciBkZWJ1Z2dpbmcuXG4gKlxuICogU2VlIGh0dHA6Ly9qYXNtaW5lLmdpdGh1Yi5pby8gZm9yIG1vcmUgZGV0YWlscy5cbiAqXG4gKiAjIyBFeGFtcGxlOlxuICpcbiAqIHtAZXhhbXBsZSB0ZXN0aW5nL3RzL3Rlc3RpbmcudHMgcmVnaW9uPSdmZGVzY3JpYmUnfVxuICovXG5leHBvcnQgdmFyIGZkZXNjcmliZTogRnVuY3Rpb24gPSBfZ2xvYmFsLmZkZXNjcmliZTtcblxuLyoqXG4gKiBMaWtlIHtAbGluayBkZXNjcmliZX0sIGJ1dCBpbnN0cnVjdHMgdGhlIHRlc3QgcnVubmVyIHRvIGV4Y2x1ZGVcbiAqIHRoaXMgZ3JvdXAgb2YgdGVzdCBjYXNlcyBmcm9tIGV4ZWN1dGlvbi4gVGhpcyBpcyB1c2VmdWwgZm9yXG4gKiBkZWJ1Z2dpbmcsIG9yIGZvciBleGNsdWRpbmcgYnJva2VuIHRlc3RzIHVudGlsIHRoZXkgY2FuIGJlIGZpeGVkLlxuICpcbiAqIFNlZSBodHRwOi8vamFzbWluZS5naXRodWIuaW8vIGZvciBtb3JlIGRldGFpbHMuXG4gKlxuICogIyMgRXhhbXBsZTpcbiAqXG4gKiB7QGV4YW1wbGUgdGVzdGluZy90cy90ZXN0aW5nLnRzIHJlZ2lvbj0neGRlc2NyaWJlJ31cbiAqL1xuZXhwb3J0IHZhciB4ZGVzY3JpYmU6IEZ1bmN0aW9uID0gX2dsb2JhbC54ZGVzY3JpYmU7XG5cbi8qKlxuICogU2lnbmF0dXJlIGZvciBhIHN5bmNocm9ub3VzIHRlc3QgZnVuY3Rpb24gKG5vIGFyZ3VtZW50cykuXG4gKi9cbmV4cG9ydCB0eXBlIFN5bmNUZXN0Rm4gPSAoKSA9PiB2b2lkO1xuXG4vKipcbiAqIFNpZ25hdHVyZSBmb3IgYW4gYXN5bmNocm9ub3VzIHRlc3QgZnVuY3Rpb24gd2hpY2ggdGFrZXMgYVxuICogYGRvbmVgIGNhbGxiYWNrLlxuICovXG5leHBvcnQgdHlwZSBBc3luY1Rlc3RGbiA9IChkb25lOiAoKSA9PiB2b2lkKSA9PiB2b2lkO1xuXG4vKipcbiAqIFNpZ25hdHVyZSBmb3IgYW55IHNpbXBsZSB0ZXN0aW5nIGZ1bmN0aW9uLlxuICovXG5leHBvcnQgdHlwZSBBbnlUZXN0Rm4gPSBTeW5jVGVzdEZuIHwgQXN5bmNUZXN0Rm47XG5cbnZhciBqc21CZWZvcmVFYWNoID0gX2dsb2JhbC5iZWZvcmVFYWNoO1xudmFyIGpzbUl0ID0gX2dsb2JhbC5pdDtcbnZhciBqc21JSXQgPSBfZ2xvYmFsLmZpdDtcbnZhciBqc21YSXQgPSBfZ2xvYmFsLnhpdDtcblxudmFyIHRlc3RJbmplY3RvcjogVGVzdEluamVjdG9yID0gZ2V0VGVzdEluamVjdG9yKCk7XG5cbi8vIFJlc2V0IHRoZSB0ZXN0IHByb3ZpZGVycyBiZWZvcmUgZWFjaCB0ZXN0LlxuanNtQmVmb3JlRWFjaCgoKSA9PiB7IHRlc3RJbmplY3Rvci5yZXNldCgpOyB9KTtcblxuLyoqXG4gKiBBbGxvd3Mgb3ZlcnJpZGluZyBkZWZhdWx0IHByb3ZpZGVycyBvZiB0aGUgdGVzdCBpbmplY3RvcixcbiAqIHdoaWNoIGFyZSBkZWZpbmVkIGluIHRlc3RfaW5qZWN0b3IuanMuXG4gKlxuICogVGhlIGdpdmVuIGZ1bmN0aW9uIG11c3QgcmV0dXJuIGEgbGlzdCBvZiBESSBwcm92aWRlcnMuXG4gKlxuICogIyMgRXhhbXBsZTpcbiAqXG4gKiB7QGV4YW1wbGUgdGVzdGluZy90cy90ZXN0aW5nLnRzIHJlZ2lvbj0nYmVmb3JlRWFjaFByb3ZpZGVycyd9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBiZWZvcmVFYWNoUHJvdmlkZXJzKGZuKTogdm9pZCB7XG4gIGpzbUJlZm9yZUVhY2goKCkgPT4ge1xuICAgIHZhciBwcm92aWRlcnMgPSBmbigpO1xuICAgIGlmICghcHJvdmlkZXJzKSByZXR1cm47XG4gICAgdHJ5IHtcbiAgICAgIHRlc3RJbmplY3Rvci5hZGRQcm92aWRlcnMocHJvdmlkZXJzKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2JlZm9yZUVhY2hQcm92aWRlcnMgd2FzIGNhbGxlZCBhZnRlciB0aGUgaW5qZWN0b3IgaGFkICcgK1xuICAgICAgICAgICAgICAgICAgICAgICdiZWVuIHVzZWQgaW4gYSBiZWZvcmVFYWNoIG9yIGl0IGJsb2NrLiBUaGlzIGludmFsaWRhdGVzIHRoZSAnICtcbiAgICAgICAgICAgICAgICAgICAgICAndGVzdCBpbmplY3RvcicpO1xuICAgIH1cbiAgfSk7XG59XG5cbmZ1bmN0aW9uIF9pc1Byb21pc2VMaWtlKGlucHV0KTogYm9vbGVhbiB7XG4gIHJldHVybiBpbnB1dCAmJiAhIShpbnB1dC50aGVuKTtcbn1cblxuZnVuY3Rpb24gX2l0KGpzbUZuOiBGdW5jdGlvbiwgbmFtZTogc3RyaW5nLCB0ZXN0Rm46IEZ1bmN0aW9uV2l0aFBhcmFtVG9rZW5zIHwgQW55VGVzdEZuLFxuICAgICAgICAgICAgIHRlc3RUaW1lT3V0OiBudW1iZXIpOiB2b2lkIHtcbiAgdmFyIHRpbWVPdXQgPSB0ZXN0VGltZU91dDtcblxuICBpZiAodGVzdEZuIGluc3RhbmNlb2YgRnVuY3Rpb25XaXRoUGFyYW1Ub2tlbnMpIHtcbiAgICBsZXQgdGVzdEZuVCA9IHRlc3RGbjtcbiAgICBqc21GbihuYW1lLCAoZG9uZSkgPT4ge1xuICAgICAgdmFyIHJldHVybmVkVGVzdFZhbHVlO1xuICAgICAgdHJ5IHtcbiAgICAgICAgcmV0dXJuZWRUZXN0VmFsdWUgPSB0ZXN0SW5qZWN0b3IuZXhlY3V0ZSh0ZXN0Rm5UKTtcbiAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICBkb25lLmZhaWwoZXJyKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAodGVzdEZuVC5pc0FzeW5jKSB7XG4gICAgICAgIGlmIChfaXNQcm9taXNlTGlrZShyZXR1cm5lZFRlc3RWYWx1ZSkpIHtcbiAgICAgICAgICAoPFByb21pc2U8YW55Pj5yZXR1cm5lZFRlc3RWYWx1ZSkudGhlbigoKSA9PiB7IGRvbmUoKTsgfSwgKGVycikgPT4geyBkb25lLmZhaWwoZXJyKTsgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZG9uZS5mYWlsKCdFcnJvcjogaW5qZWN0QXN5bmMgd2FzIGV4cGVjdGVkIHRvIHJldHVybiBhIHByb21pc2UsIGJ1dCB0aGUgJyArXG4gICAgICAgICAgICAgICAgICAgICcgcmV0dXJuZWQgdmFsdWUgd2FzOiAnICsgcmV0dXJuZWRUZXN0VmFsdWUpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoIShyZXR1cm5lZFRlc3RWYWx1ZSA9PT0gdW5kZWZpbmVkKSkge1xuICAgICAgICAgIGRvbmUuZmFpbCgnRXJyb3I6IGluamVjdCByZXR1cm5lZCBhIHZhbHVlLiBEaWQgeW91IG1lYW4gdG8gdXNlIGluamVjdEFzeW5jPyBSZXR1cm5lZCAnICtcbiAgICAgICAgICAgICAgICAgICAgJ3ZhbHVlIHdhczogJyArIHJldHVybmVkVGVzdFZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgICBkb25lKCk7XG4gICAgICB9XG4gICAgfSwgdGltZU91dCk7XG4gIH0gZWxzZSB7XG4gICAgLy8gVGhlIHRlc3QgY2FzZSBkb2Vzbid0IHVzZSBpbmplY3QoKS4gaWUgYGl0KCd0ZXN0JywgKGRvbmUpID0+IHsgLi4uIH0pKTtgXG4gICAganNtRm4obmFtZSwgdGVzdEZuLCB0aW1lT3V0KTtcbiAgfVxufVxuXG4vKipcbiAqIFdyYXBwZXIgYXJvdW5kIEphc21pbmUgYmVmb3JlRWFjaCBmdW5jdGlvbi5cbiAqXG4gKiBiZWZvcmVFYWNoIG1heSBiZSB1c2VkIHdpdGggdGhlIGBpbmplY3RgIGZ1bmN0aW9uIHRvIGZldGNoIGRlcGVuZGVuY2llcy5cbiAqIFRoZSB0ZXN0IHdpbGwgYXV0b21hdGljYWxseSB3YWl0IGZvciBhbnkgYXN5bmNocm9ub3VzIGNhbGxzIGluc2lkZSB0aGVcbiAqIGluamVjdGVkIHRlc3QgZnVuY3Rpb24gdG8gY29tcGxldGUuXG4gKlxuICogU2VlIGh0dHA6Ly9qYXNtaW5lLmdpdGh1Yi5pby8gZm9yIG1vcmUgZGV0YWlscy5cbiAqXG4gKiAjIyBFeGFtcGxlOlxuICpcbiAqIHtAZXhhbXBsZSB0ZXN0aW5nL3RzL3Rlc3RpbmcudHMgcmVnaW9uPSdiZWZvcmVFYWNoJ31cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGJlZm9yZUVhY2goZm46IEZ1bmN0aW9uV2l0aFBhcmFtVG9rZW5zIHwgQW55VGVzdEZuKTogdm9pZCB7XG4gIGlmIChmbiBpbnN0YW5jZW9mIEZ1bmN0aW9uV2l0aFBhcmFtVG9rZW5zKSB7XG4gICAgLy8gVGhlIHRlc3QgY2FzZSB1c2VzIGluamVjdCgpLiBpZSBgYmVmb3JlRWFjaChpbmplY3QoW0NsYXNzQV0sIChhKSA9PiB7IC4uLlxuICAgIC8vIH0pKTtgXG4gICAgbGV0IGZuVCA9IGZuO1xuICAgIGpzbUJlZm9yZUVhY2goKGRvbmUpID0+IHtcblxuICAgICAgdmFyIHJldHVybmVkVGVzdFZhbHVlO1xuICAgICAgdHJ5IHtcbiAgICAgICAgcmV0dXJuZWRUZXN0VmFsdWUgPSB0ZXN0SW5qZWN0b3IuZXhlY3V0ZShmblQpO1xuICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIGRvbmUuZmFpbChlcnIpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAoZm5ULmlzQXN5bmMpIHtcbiAgICAgICAgaWYgKF9pc1Byb21pc2VMaWtlKHJldHVybmVkVGVzdFZhbHVlKSkge1xuICAgICAgICAgICg8UHJvbWlzZTxhbnk+PnJldHVybmVkVGVzdFZhbHVlKS50aGVuKCgpID0+IHsgZG9uZSgpOyB9LCAoZXJyKSA9PiB7IGRvbmUuZmFpbChlcnIpOyB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBkb25lLmZhaWwoJ0Vycm9yOiBpbmplY3RBc3luYyB3YXMgZXhwZWN0ZWQgdG8gcmV0dXJuIGEgcHJvbWlzZSwgYnV0IHRoZSAnICtcbiAgICAgICAgICAgICAgICAgICAgJyByZXR1cm5lZCB2YWx1ZSB3YXM6ICcgKyByZXR1cm5lZFRlc3RWYWx1ZSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICghKHJldHVybmVkVGVzdFZhbHVlID09PSB1bmRlZmluZWQpKSB7XG4gICAgICAgICAgZG9uZS5mYWlsKCdFcnJvcjogaW5qZWN0IHJldHVybmVkIGEgdmFsdWUuIERpZCB5b3UgbWVhbiB0byB1c2UgaW5qZWN0QXN5bmM/IFJldHVybmVkICcgK1xuICAgICAgICAgICAgICAgICAgICAndmFsdWUgd2FzOiAnICsgcmV0dXJuZWRUZXN0VmFsdWUpO1xuICAgICAgICB9XG4gICAgICAgIGRvbmUoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICAvLyBUaGUgdGVzdCBjYXNlIGRvZXNuJ3QgdXNlIGluamVjdCgpLiBpZSBgYmVmb3JlRWFjaCgoZG9uZSkgPT4geyAuLi4gfSkpO2BcbiAgICBpZiAoKDxhbnk+Zm4pLmxlbmd0aCA9PT0gMCkge1xuICAgICAganNtQmVmb3JlRWFjaCgoKSA9PiB7ICg8U3luY1Rlc3RGbj5mbikoKTsgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGpzbUJlZm9yZUVhY2goKGRvbmUpID0+IHsgKDxBc3luY1Rlc3RGbj5mbikoZG9uZSk7IH0pO1xuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIERlZmluZSBhIHNpbmdsZSB0ZXN0IGNhc2Ugd2l0aCB0aGUgZ2l2ZW4gdGVzdCBuYW1lIGFuZCBleGVjdXRpb24gZnVuY3Rpb24uXG4gKlxuICogVGhlIHRlc3QgZnVuY3Rpb24gY2FuIGJlIGVpdGhlciBhIHN5bmNocm9ub3VzIGZ1bmN0aW9uLCBhbiBhc3luY2hyb25vdXMgZnVuY3Rpb25cbiAqIHRoYXQgdGFrZXMgYSBjb21wbGV0aW9uIGNhbGxiYWNrLCBvciBhbiBpbmplY3RlZCBmdW5jdGlvbiBjcmVhdGVkIHZpYSB7QGxpbmsgaW5qZWN0fVxuICogb3Ige0BsaW5rIGluamVjdEFzeW5jfS4gVGhlIHRlc3Qgd2lsbCBhdXRvbWF0aWNhbGx5IHdhaXQgZm9yIGFueSBhc3luY2hyb25vdXMgY2FsbHNcbiAqIGluc2lkZSB0aGUgaW5qZWN0ZWQgdGVzdCBmdW5jdGlvbiB0byBjb21wbGV0ZS5cbiAqXG4gKiBXcmFwcGVyIGFyb3VuZCBKYXNtaW5lIGl0IGZ1bmN0aW9uLiBTZWUgaHR0cDovL2phc21pbmUuZ2l0aHViLmlvLyBmb3IgbW9yZSBkZXRhaWxzLlxuICpcbiAqICMjIEV4YW1wbGU6XG4gKlxuICoge0BleGFtcGxlIHRlc3RpbmcvdHMvdGVzdGluZy50cyByZWdpb249J2Rlc2NyaWJlSXQnfVxuICovXG5leHBvcnQgZnVuY3Rpb24gaXQobmFtZTogc3RyaW5nLCBmbjogRnVuY3Rpb25XaXRoUGFyYW1Ub2tlbnMgfCBBbnlUZXN0Rm4sXG4gICAgICAgICAgICAgICAgICAgdGltZU91dDogbnVtYmVyID0gbnVsbCk6IHZvaWQge1xuICByZXR1cm4gX2l0KGpzbUl0LCBuYW1lLCBmbiwgdGltZU91dCk7XG59XG5cbi8qKlxuICogTGlrZSB7QGxpbmsgaXR9LCBidXQgaW5zdHJ1Y3RzIHRoZSB0ZXN0IHJ1bm5lciB0byBleGNsdWRlIHRoaXMgdGVzdFxuICogZW50aXJlbHkuIFVzZWZ1bCBmb3IgZGVidWdnaW5nIG9yIGZvciBleGNsdWRpbmcgYnJva2VuIHRlc3RzIHVudGlsXG4gKiB0aGV5IGNhbiBiZSBmaXhlZC5cbiAqXG4gKiBXcmFwcGVyIGFyb3VuZCBKYXNtaW5lIHhpdCBmdW5jdGlvbi4gU2VlIGh0dHA6Ly9qYXNtaW5lLmdpdGh1Yi5pby8gZm9yIG1vcmUgZGV0YWlscy5cbiAqXG4gKiAjIyBFeGFtcGxlOlxuICpcbiAqIHtAZXhhbXBsZSB0ZXN0aW5nL3RzL3Rlc3RpbmcudHMgcmVnaW9uPSd4aXQnfVxuICovXG5leHBvcnQgZnVuY3Rpb24geGl0KG5hbWU6IHN0cmluZywgZm46IEZ1bmN0aW9uV2l0aFBhcmFtVG9rZW5zIHwgQW55VGVzdEZuLFxuICAgICAgICAgICAgICAgICAgICB0aW1lT3V0OiBudW1iZXIgPSBudWxsKTogdm9pZCB7XG4gIHJldHVybiBfaXQoanNtWEl0LCBuYW1lLCBmbiwgdGltZU91dCk7XG59XG5cbi8qKlxuICogU2VlIHtAbGluayBmaXR9LlxuICovXG5leHBvcnQgZnVuY3Rpb24gaWl0KG5hbWU6IHN0cmluZywgZm46IEZ1bmN0aW9uV2l0aFBhcmFtVG9rZW5zIHwgQW55VGVzdEZuLFxuICAgICAgICAgICAgICAgICAgICB0aW1lT3V0OiBudW1iZXIgPSBudWxsKTogdm9pZCB7XG4gIHJldHVybiBfaXQoanNtSUl0LCBuYW1lLCBmbiwgdGltZU91dCk7XG59XG5cbi8qKlxuICogTGlrZSB7QGxpbmsgaXR9LCBidXQgaW5zdHJ1Y3RzIHRoZSB0ZXN0IHJ1bm5lciB0byBvbmx5IHJ1biB0aGlzIHRlc3QuXG4gKiBVc2VmdWwgZm9yIGRlYnVnZ2luZy5cbiAqXG4gKiBXcmFwcGVyIGFyb3VuZCBKYXNtaW5lIGZpdCBmdW5jdGlvbi4gU2VlIGh0dHA6Ly9qYXNtaW5lLmdpdGh1Yi5pby8gZm9yIG1vcmUgZGV0YWlscy5cbiAqXG4gKiAjIyBFeGFtcGxlOlxuICpcbiAqIHtAZXhhbXBsZSB0ZXN0aW5nL3RzL3Rlc3RpbmcudHMgcmVnaW9uPSdmaXQnfVxuICovXG5leHBvcnQgZnVuY3Rpb24gZml0KG5hbWU6IHN0cmluZywgZm46IEZ1bmN0aW9uV2l0aFBhcmFtVG9rZW5zIHwgQW55VGVzdEZuLFxuICAgICAgICAgICAgICAgICAgICB0aW1lT3V0OiBudW1iZXIgPSBudWxsKTogdm9pZCB7XG4gIHJldHVybiBfaXQoanNtSUl0LCBuYW1lLCBmbiwgdGltZU91dCk7XG59XG4iXX0=