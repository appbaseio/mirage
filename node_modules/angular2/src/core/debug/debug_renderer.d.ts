import { Renderer, RootRenderer, RenderComponentType, RenderDebugInfo } from 'angular2/src/core/render/api';
export declare class DebugDomRootRenderer implements RootRenderer {
    private _delegate;
    constructor(_delegate: RootRenderer);
    renderComponent(componentProto: RenderComponentType): Renderer;
}
export declare class DebugDomRenderer implements Renderer {
    private _rootRenderer;
    private _delegate;
    constructor(_rootRenderer: DebugDomRootRenderer, _delegate: Renderer);
    renderComponent(componentType: RenderComponentType): Renderer;
    selectRootElement(selector: string): any;
    createElement(parentElement: any, name: string): any;
    createViewRoot(hostElement: any): any;
    createTemplateAnchor(parentElement: any): any;
    createText(parentElement: any, value: string): any;
    projectNodes(parentElement: any, nodes: any[]): void;
    attachViewAfter(node: any, viewRootNodes: any[]): void;
    detachView(viewRootNodes: any[]): void;
    destroyView(hostElement: any, viewAllNodes: any[]): void;
    listen(renderElement: any, name: string, callback: Function): Function;
    listenGlobal(target: string, name: string, callback: Function): Function;
    setElementProperty(renderElement: any, propertyName: string, propertyValue: any): void;
    setElementAttribute(renderElement: any, attributeName: string, attributeValue: string): void;
    /**
     * Used only in debug mode to serialize property changes to comment nodes,
     * such as <template> placeholders.
     */
    setBindingDebugInfo(renderElement: any, propertyName: string, propertyValue: string): void;
    /**
     * Used only in development mode to set information needed by the DebugNode for this element.
     */
    setElementDebugInfo(renderElement: any, info: RenderDebugInfo): void;
    setElementClass(renderElement: any, className: string, isAdd: boolean): void;
    setElementStyle(renderElement: any, styleName: string, styleValue: string): void;
    invokeElementMethod(renderElement: any, methodName: string, args: any[]): void;
    setText(renderNode: any, text: string): void;
}
