export declare class BrowserDetection {
    private _overrideUa;
    private _ua;
    static setup(): void;
    constructor(ua: string);
    isFirefox: boolean;
    isAndroid: boolean;
    isEdge: boolean;
    isIE: boolean;
    isWebkit: boolean;
    isIOS7: boolean;
    isSlow: boolean;
    supportsIntlApi: boolean;
}
export declare function dispatchEvent(element: any, eventType: any): void;
export declare function el(html: string): HTMLElement;
export declare function normalizeCSS(css: string): string;
export declare function stringifyElement(el: any): string;
export declare var browserDetection: BrowserDetection;
