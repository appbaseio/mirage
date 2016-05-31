import { ApplicationRef, Injectable } from '../index';
export class MockApplicationRef extends ApplicationRef {
    registerBootstrapListener(listener) { }
    registerDisposeListener(dispose) { }
    bootstrap(componentFactory) { return null; }
    get injector() { return null; }
    ;
    get zone() { return null; }
    ;
    run(callback) { return null; }
    waitForAsyncInitializers() { return null; }
    dispose() { }
    tick() { }
    get componentTypes() { return null; }
    ;
}
MockApplicationRef.decorators = [
    { type: Injectable },
];
//# sourceMappingURL=mock_application_ref.js.map