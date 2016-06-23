import { ComponentFactory, Type } from '@angular/core';
export declare class Tree<T> {
    /** @internal */
    _root: TreeNode<T>;
    constructor(root: TreeNode<T>);
    root: T;
    parent(t: T): T;
    children(t: T): T[];
    firstChild(t: T): T;
    pathFromRoot(t: T): T[];
    contains(tree: Tree<T>): boolean;
}
export declare class UrlTree extends Tree<UrlSegment> {
    constructor(root: TreeNode<UrlSegment>);
}
export declare class RouteTree extends Tree<RouteSegment> {
    constructor(root: TreeNode<RouteSegment>);
}
export declare function rootNode<T>(tree: Tree<T>): TreeNode<T>;
export declare class TreeNode<T> {
    value: T;
    children: TreeNode<T>[];
    constructor(value: T, children: TreeNode<T>[]);
}
export declare class UrlSegment {
    segment: any;
    parameters: {
        [key: string]: any;
    };
    outlet: string;
    constructor(segment: any, parameters: {
        [key: string]: any;
    }, outlet: string);
    toString(): string;
}
export declare class RouteSegment {
    urlSegments: UrlSegment[];
    parameters: {
        [key: string]: any;
    };
    outlet: string;
    /** @internal */
    _type: Type;
    /** @internal */
    _componentFactory: ComponentFactory<any>;
    constructor(urlSegments: UrlSegment[], parameters: {
        [key: string]: any;
    }, outlet: string, type: Type, componentFactory: ComponentFactory<any>);
    getParam(param: string): string;
    type: Type;
    stringifiedUrlSegments: string;
}
export declare function serializeRouteSegmentTree(tree: RouteTree): string;
export declare function equalSegments(a: RouteSegment, b: RouteSegment): boolean;
export declare function equalUrlSegments(a: UrlSegment, b: UrlSegment): boolean;
export declare function routeSegmentComponentFactory(a: RouteSegment): ComponentFactory<any>;
