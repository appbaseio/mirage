export declare class BrowserDetection {
    private _overrideUa;
    private readonly _ua;
    static setup(): void;
    constructor(ua: string);
    readonly isFirefox: boolean;
    readonly isAndroid: boolean;
    readonly isEdge: boolean;
    readonly isIE: boolean;
    readonly isWebkit: boolean;
    readonly isIOS7: boolean;
    readonly isSlow: boolean;
    readonly supportsIntlApi: boolean;
}
export declare function dispatchEvent(element: any, eventType: any): void;
export declare function el(html: string): HTMLElement;
export declare function normalizeCSS(css: string): string;
export declare function stringifyElement(el: any): string;
export declare var browserDetection: BrowserDetection;
