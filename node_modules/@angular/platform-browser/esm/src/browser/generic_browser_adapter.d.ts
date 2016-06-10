import { DomAdapter } from '../dom/dom_adapter';
/**
 * Provides DOM operations in any browser environment.
 */
export declare abstract class GenericBrowserDomAdapter extends DomAdapter {
    private _animationPrefix;
    private _transitionEnd;
    constructor();
    getDistributedNodes(el: HTMLElement): Node[];
    resolveAndSetHref(el: HTMLAnchorElement, baseUrl: string, href: string): void;
    supportsDOMEvents(): boolean;
    supportsNativeShadowDOM(): boolean;
    getAnimationPrefix(): string;
    getTransitionEnd(): string;
    supportsAnimation(): boolean;
}
