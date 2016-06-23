import { ApplicationRef, ComponentRef, ComponentFactory, Injector, NgZone, Type } from '../index';
/**
 * A no-op implementation of {@link ApplicationRef}, useful for testing.
 */
export declare class MockApplicationRef extends ApplicationRef {
    registerBootstrapListener(listener: (ref: ComponentRef<any>) => void): void;
    registerDisposeListener(dispose: () => void): void;
    bootstrap<C>(componentFactory: ComponentFactory<C>): ComponentRef<C>;
    readonly injector: Injector;
    readonly zone: NgZone;
    run(callback: Function): any;
    waitForAsyncInitializers(): Promise<any>;
    dispose(): void;
    tick(): void;
    readonly componentTypes: Type[];
}
