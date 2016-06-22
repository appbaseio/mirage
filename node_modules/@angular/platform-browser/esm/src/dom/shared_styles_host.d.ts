export declare class SharedStylesHost {
    /** @internal */
    _styles: string[];
    /** @internal */
    _stylesSet: Set<string>;
    constructor();
    addStyles(styles: string[]): void;
    onStylesAdded(additions: string[]): void;
    getAllStyles(): string[];
}
export declare class DomSharedStylesHost extends SharedStylesHost {
    private _hostNodes;
    constructor(doc: any);
    /** @internal */
    _addStylesToHost(styles: string[], host: Node): void;
    addHost(hostNode: Node): void;
    removeHost(hostNode: Node): void;
    onStylesAdded(additions: string[]): void;
}
