import { NgZone } from '../index';
import { EventEmitter } from '../src/facade/async';
/**
 * A mock implementation of {@link NgZone}.
 */
export declare class MockNgZone extends NgZone {
    /** @internal */
    private _mockOnStable;
    constructor();
    onStable: EventEmitter<any>;
    run(fn: Function): any;
    runOutsideAngular(fn: Function): any;
    simulateZoneExit(): void;
}
