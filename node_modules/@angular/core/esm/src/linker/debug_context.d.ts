import { Injector } from '../di';
import { RenderDebugInfo } from '../render/api';
import { DebugAppView } from './view';
export declare class StaticNodeDebugInfo {
    providerTokens: any[];
    componentToken: any;
    refTokens: {
        [key: string]: any;
    };
    constructor(providerTokens: any[], componentToken: any, refTokens: {
        [key: string]: any;
    });
}
export declare class DebugContext implements RenderDebugInfo {
    private _view;
    private _nodeIndex;
    private _tplRow;
    private _tplCol;
    constructor(_view: DebugAppView<any>, _nodeIndex: number, _tplRow: number, _tplCol: number);
    private readonly _staticNodeInfo;
    readonly context: any;
    readonly component: any;
    readonly componentRenderElement: any;
    readonly injector: Injector;
    readonly renderNode: any;
    readonly providerTokens: any[];
    readonly source: string;
    readonly references: {
        [key: string]: any;
    };
}
