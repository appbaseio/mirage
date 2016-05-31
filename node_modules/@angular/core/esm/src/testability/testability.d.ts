import { NgZone } from '../zone/ng_zone';
/**
 * The Testability service provides testing hooks that can be accessed from
 * the browser and by services such as Protractor. Each bootstrapped Angular
 * application on the page will have an instance of Testability.
 */
export declare class Testability {
    private _ngZone;
    /** @internal */
    _pendingCount: number;
    /** @internal */
    _isZoneStable: boolean;
    /**
     * Whether any work was done since the last 'whenStable' callback. This is
     * useful to detect if this could have potentially destabilized another
     * component while it is stabilizing.
     * @internal
     */
    _didWork: boolean;
    /** @internal */
    _callbacks: Function[];
    constructor(_ngZone: NgZone);
    /** @internal */
    _watchAngularEvents(): void;
    increasePendingRequestCount(): number;
    decreasePendingRequestCount(): number;
    isStable(): boolean;
    /** @internal */
    _runCallbacksIfReady(): void;
    whenStable(callback: Function): void;
    getPendingRequestCount(): number;
    findBindings(using: any, provider: string, exactMatch: boolean): any[];
    findProviders(using: any, provider: string, exactMatch: boolean): any[];
}
/**
 * A global registry of {@link Testability} instances for specific elements.
 */
export declare class TestabilityRegistry {
    /** @internal */
    _applications: Map<any, Testability>;
    constructor();
    registerApplication(token: any, testability: Testability): void;
    getTestability(elem: any): Testability;
    getAllTestabilities(): Testability[];
    getAllRootElements(): any[];
    findTestabilityInTree(elem: Node, findInAncestors?: boolean): Testability;
}
/**
 * Adapter interface for retrieving the `Testability` service associated for a
 * particular context.
 */
export interface GetTestability {
    addToWindow(registry: TestabilityRegistry): void;
    findTestabilityInTree(registry: TestabilityRegistry, elem: any, findInAncestors: boolean): Testability;
}
/**
 * Set the {@link GetTestability} implementation used by the Angular testing framework.
 */
export declare function setTestabilityGetter(getter: GetTestability): void;
