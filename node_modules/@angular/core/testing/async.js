"use strict";
/**
* Wraps a test function in an asynchronous test zone. The test will automatically
* complete when all asynchronous calls within this zone are done. Can be used
* to wrap an {@link inject} call.
*
* Example:
*
* ```
* it('...', async(inject([AClass], (object) => {
*   object.doSomething.then(() => {
*     expect(...);
*   })
* });
* ```
*/
function async(fn) {
    return function () {
        return new Promise(function (finishCallback, failCallback) {
            var AsyncTestZoneSpec = Zone['AsyncTestZoneSpec'];
            var testZoneSpec = new AsyncTestZoneSpec(finishCallback, failCallback, 'test');
            var testZone = Zone.current.fork(testZoneSpec);
            return testZone.run(fn);
        });
    };
}
exports.async = async;
//# sourceMappingURL=async.js.map