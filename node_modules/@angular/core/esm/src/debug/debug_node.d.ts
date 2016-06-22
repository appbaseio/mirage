import { Predicate } from '../../src/facade/collection';
import { Injector } from '../di';
import { RenderDebugInfo } from '../render/api';
export declare class EventListener {
    name: string;
    callback: Function;
    constructor(name: string, callback: Function);
}
export declare class DebugNode {
    private _debugInfo;
    nativeNode: any;
    listeners: EventListener[];
    parent: DebugElement;
    constructor(nativeNode: any, parent: DebugNode, _debugInfo: RenderDebugInfo);
    readonly injector: Injector;
    readonly componentInstance: any;
    readonly context: any;
    readonly references: {
        [key: string]: any;
    };
    readonly providerTokens: any[];
    readonly source: string;
    /**
     * Use injector.get(token) instead.
     *
     * @deprecated
     */
    inject(token: any): any;
}
export declare class DebugElement extends DebugNode {
    name: string;
    properties: {
        [key: string]: string;
    };
    attributes: {
        [key: string]: string;
    };
    childNodes: DebugNode[];
    nativeElement: any;
    constructor(nativeNode: any, parent: any, _debugInfo: RenderDebugInfo);
    addChild(child: DebugNode): void;
    removeChild(child: DebugNode): void;
    insertChildrenAfter(child: DebugNode, newChildren: DebugNode[]): void;
    query(predicate: Predicate<DebugElement>): DebugElement;
    queryAll(predicate: Predicate<DebugElement>): DebugElement[];
    queryAllNodes(predicate: Predicate<DebugNode>): DebugNode[];
    readonly children: DebugElement[];
    triggerEventHandler(eventName: string, eventObj: any): void;
}
export declare function asNativeElements(debugEls: DebugElement[]): any;
export declare function getDebugNode(nativeNode: any): DebugNode;
export declare function getAllDebugNodes(): DebugNode[];
export declare function indexDebugNode(node: DebugNode): void;
export declare function removeDebugNodeFromIndex(node: DebugNode): void;
