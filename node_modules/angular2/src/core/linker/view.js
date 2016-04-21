'use strict';"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var collection_1 = require('angular2/src/facade/collection');
var change_detection_1 = require('angular2/src/core/change_detection/change_detection');
var interfaces_1 = require('angular2/src/core/change_detection/interfaces');
var element_1 = require('./element');
var lang_1 = require('angular2/src/facade/lang');
var exceptions_1 = require('angular2/src/facade/exceptions');
var api_1 = require('angular2/src/core/render/api');
var view_ref_1 = require('./view_ref');
var pipes_1 = require('angular2/src/core/pipes/pipes');
var util_1 = require('angular2/src/core/render/util');
var interfaces_2 = require('angular2/src/core/change_detection/interfaces');
exports.DebugContext = interfaces_2.DebugContext;
var pipes_2 = require('angular2/src/core/pipes/pipes');
var view_type_1 = require('./view_type');
var REFLECT_PREFIX = 'ng-reflect-';
var EMPTY_CONTEXT = lang_1.CONST_EXPR(new Object());
/**
 * Cost of making objects: http://jsperf.com/instantiate-size-of-object
 *
 */
var AppView = (function () {
    function AppView(proto, renderer, viewManager, projectableNodes, containerAppElement, imperativelyCreatedProviders, rootInjector, changeDetector) {
        this.proto = proto;
        this.renderer = renderer;
        this.viewManager = viewManager;
        this.projectableNodes = projectableNodes;
        this.containerAppElement = containerAppElement;
        this.changeDetector = changeDetector;
        /**
         * The context against which data-binding expressions in this view are evaluated against.
         * This is always a component instance.
         */
        this.context = null;
        this.destroyed = false;
        this.ref = new view_ref_1.ViewRef_(this);
        var injectorWithHostBoundary = element_1.AppElement.getViewParentInjector(this.proto.type, containerAppElement, imperativelyCreatedProviders, rootInjector);
        this.parentInjector = injectorWithHostBoundary.injector;
        this.hostInjectorBoundary = injectorWithHostBoundary.hostInjectorBoundary;
        var pipes;
        var context;
        switch (proto.type) {
            case view_type_1.ViewType.COMPONENT:
                pipes = new pipes_2.Pipes(proto.protoPipes, containerAppElement.getInjector());
                context = containerAppElement.getComponent();
                break;
            case view_type_1.ViewType.EMBEDDED:
                pipes = containerAppElement.parentView.pipes;
                context = containerAppElement.parentView.context;
                break;
            case view_type_1.ViewType.HOST:
                pipes = null;
                context = EMPTY_CONTEXT;
                break;
        }
        this.pipes = pipes;
        this.context = context;
    }
    AppView.prototype.init = function (rootNodesOrAppElements, allNodes, disposables, appElements) {
        this.rootNodesOrAppElements = rootNodesOrAppElements;
        this.allNodes = allNodes;
        this.disposables = disposables;
        this.appElements = appElements;
        var localsMap = new collection_1.Map();
        collection_1.StringMapWrapper.forEach(this.proto.templateVariableBindings, function (templateName, _) { localsMap.set(templateName, null); });
        for (var i = 0; i < appElements.length; i++) {
            var appEl = appElements[i];
            var providerTokens = [];
            if (lang_1.isPresent(appEl.proto.protoInjector)) {
                for (var j = 0; j < appEl.proto.protoInjector.numberOfProviders; j++) {
                    providerTokens.push(appEl.proto.protoInjector.getProviderAtIndex(j).key.token);
                }
            }
            collection_1.StringMapWrapper.forEach(appEl.proto.directiveVariableBindings, function (directiveIndex, name) {
                if (lang_1.isBlank(directiveIndex)) {
                    localsMap.set(name, appEl.nativeElement);
                }
                else {
                    localsMap.set(name, appEl.getDirectiveAtIndex(directiveIndex));
                }
            });
            this.renderer.setElementDebugInfo(appEl.nativeElement, new api_1.RenderDebugInfo(appEl.getInjector(), appEl.getComponent(), providerTokens, localsMap));
        }
        var parentLocals = null;
        if (this.proto.type !== view_type_1.ViewType.COMPONENT) {
            parentLocals =
                lang_1.isPresent(this.containerAppElement) ? this.containerAppElement.parentView.locals : null;
        }
        if (this.proto.type === view_type_1.ViewType.COMPONENT) {
            // Note: the render nodes have been attached to their host element
            // in the ViewFactory already.
            this.containerAppElement.attachComponentView(this);
            this.containerAppElement.parentView.changeDetector.addViewChild(this.changeDetector);
        }
        this.locals = new change_detection_1.Locals(parentLocals, localsMap);
        this.changeDetector.hydrate(this.context, this.locals, this, this.pipes);
        this.viewManager.onViewCreated(this);
    };
    AppView.prototype.destroy = function () {
        if (this.destroyed) {
            throw new exceptions_1.BaseException('This view has already been destroyed!');
        }
        this.changeDetector.destroyRecursive();
    };
    AppView.prototype.notifyOnDestroy = function () {
        this.destroyed = true;
        var hostElement = this.proto.type === view_type_1.ViewType.COMPONENT ? this.containerAppElement.nativeElement : null;
        this.renderer.destroyView(hostElement, this.allNodes);
        for (var i = 0; i < this.disposables.length; i++) {
            this.disposables[i]();
        }
        this.viewManager.onViewDestroyed(this);
    };
    Object.defineProperty(AppView.prototype, "changeDetectorRef", {
        get: function () { return this.changeDetector.ref; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppView.prototype, "flatRootNodes", {
        get: function () { return flattenNestedViewRenderNodes(this.rootNodesOrAppElements); },
        enumerable: true,
        configurable: true
    });
    AppView.prototype.hasLocal = function (contextName) {
        return collection_1.StringMapWrapper.contains(this.proto.templateVariableBindings, contextName);
    };
    AppView.prototype.setLocal = function (contextName, value) {
        if (!this.hasLocal(contextName)) {
            return;
        }
        var templateName = this.proto.templateVariableBindings[contextName];
        this.locals.set(templateName, value);
    };
    // dispatch to element injector or text nodes based on context
    AppView.prototype.notifyOnBinding = function (b, currentValue) {
        if (b.isTextNode()) {
            this.renderer.setText(this.allNodes[b.elementIndex], currentValue);
        }
        else {
            var nativeElement = this.appElements[b.elementIndex].nativeElement;
            if (b.isElementProperty()) {
                this.renderer.setElementProperty(nativeElement, b.name, currentValue);
            }
            else if (b.isElementAttribute()) {
                this.renderer.setElementAttribute(nativeElement, b.name, lang_1.isPresent(currentValue) ? "" + currentValue : null);
            }
            else if (b.isElementClass()) {
                this.renderer.setElementClass(nativeElement, b.name, currentValue);
            }
            else if (b.isElementStyle()) {
                var unit = lang_1.isPresent(b.unit) ? b.unit : '';
                this.renderer.setElementStyle(nativeElement, b.name, lang_1.isPresent(currentValue) ? "" + currentValue + unit : null);
            }
            else {
                throw new exceptions_1.BaseException('Unsupported directive record');
            }
        }
    };
    AppView.prototype.logBindingUpdate = function (b, value) {
        if (b.isDirective() || b.isElementProperty()) {
            var nativeElement = this.appElements[b.elementIndex].nativeElement;
            this.renderer.setBindingDebugInfo(nativeElement, "" + REFLECT_PREFIX + util_1.camelCaseToDashCase(b.name), "" + value);
        }
    };
    AppView.prototype.notifyAfterContentChecked = function () {
        var count = this.appElements.length;
        for (var i = count - 1; i >= 0; i--) {
            this.appElements[i].ngAfterContentChecked();
        }
    };
    AppView.prototype.notifyAfterViewChecked = function () {
        var count = this.appElements.length;
        for (var i = count - 1; i >= 0; i--) {
            this.appElements[i].ngAfterViewChecked();
        }
    };
    AppView.prototype.getDebugContext = function (appElement, elementIndex, directiveIndex) {
        try {
            if (lang_1.isBlank(appElement) && elementIndex < this.appElements.length) {
                appElement = this.appElements[elementIndex];
            }
            var container = this.containerAppElement;
            var element = lang_1.isPresent(appElement) ? appElement.nativeElement : null;
            var componentElement = lang_1.isPresent(container) ? container.nativeElement : null;
            var directive = lang_1.isPresent(directiveIndex) ? appElement.getDirectiveAtIndex(directiveIndex) : null;
            var injector = lang_1.isPresent(appElement) ? appElement.getInjector() : null;
            return new interfaces_1.DebugContext(element, componentElement, directive, this.context, _localsToStringMap(this.locals), injector);
        }
        catch (e) {
            // TODO: vsavkin log the exception once we have a good way to log errors and warnings
            // if an error happens during getting the debug context, we return null.
            return null;
        }
    };
    AppView.prototype.getDirectiveFor = function (directive) {
        return this.appElements[directive.elementIndex].getDirectiveAtIndex(directive.directiveIndex);
    };
    AppView.prototype.getDetectorFor = function (directive) {
        var componentView = this.appElements[directive.elementIndex].componentView;
        return lang_1.isPresent(componentView) ? componentView.changeDetector : null;
    };
    /**
     * Triggers the event handlers for the element and the directives.
     *
     * This method is intended to be called from directive EventEmitters.
     *
     * @param {string} eventName
     * @param {*} eventObj
     * @param {number} boundElementIndex
     * @return false if preventDefault must be applied to the DOM event
     */
    AppView.prototype.triggerEventHandlers = function (eventName, eventObj, boundElementIndex) {
        return this.changeDetector.handleEvent(eventName, boundElementIndex, eventObj);
    };
    return AppView;
}());
exports.AppView = AppView;
function _localsToStringMap(locals) {
    var res = {};
    var c = locals;
    while (lang_1.isPresent(c)) {
        res = collection_1.StringMapWrapper.merge(res, collection_1.MapWrapper.toStringMap(c.current));
        c = c.parent;
    }
    return res;
}
/**
 *
 */
var AppProtoView = (function () {
    function AppProtoView(type, protoPipes, templateVariableBindings) {
        this.type = type;
        this.protoPipes = protoPipes;
        this.templateVariableBindings = templateVariableBindings;
    }
    AppProtoView.create = function (metadataCache, type, pipes, templateVariableBindings) {
        var protoPipes = null;
        if (lang_1.isPresent(pipes) && pipes.length > 0) {
            var boundPipes = collection_1.ListWrapper.createFixedSize(pipes.length);
            for (var i = 0; i < pipes.length; i++) {
                boundPipes[i] = metadataCache.getResolvedPipeMetadata(pipes[i]);
            }
            protoPipes = pipes_1.ProtoPipes.fromProviders(boundPipes);
        }
        return new AppProtoView(type, protoPipes, templateVariableBindings);
    };
    return AppProtoView;
}());
exports.AppProtoView = AppProtoView;
var HostViewFactory = (function () {
    function HostViewFactory(selector, viewFactory) {
        this.selector = selector;
        this.viewFactory = viewFactory;
    }
    HostViewFactory = __decorate([
        lang_1.CONST(), 
        __metadata('design:paramtypes', [String, Function])
    ], HostViewFactory);
    return HostViewFactory;
}());
exports.HostViewFactory = HostViewFactory;
function flattenNestedViewRenderNodes(nodes) {
    return _flattenNestedViewRenderNodes(nodes, []);
}
exports.flattenNestedViewRenderNodes = flattenNestedViewRenderNodes;
function _flattenNestedViewRenderNodes(nodes, renderNodes) {
    for (var i = 0; i < nodes.length; i++) {
        var node = nodes[i];
        if (node instanceof element_1.AppElement) {
            var appEl = node;
            renderNodes.push(appEl.nativeElement);
            if (lang_1.isPresent(appEl.nestedViews)) {
                for (var k = 0; k < appEl.nestedViews.length; k++) {
                    _flattenNestedViewRenderNodes(appEl.nestedViews[k].rootNodesOrAppElements, renderNodes);
                }
            }
        }
        else {
            renderNodes.push(node);
        }
    }
    return renderNodes;
}
function findLastRenderNode(node) {
    var lastNode;
    if (node instanceof element_1.AppElement) {
        var appEl = node;
        lastNode = appEl.nativeElement;
        if (lang_1.isPresent(appEl.nestedViews)) {
            // Note: Views might have no root nodes at all!
            for (var i = appEl.nestedViews.length - 1; i >= 0; i--) {
                var nestedView = appEl.nestedViews[i];
                if (nestedView.rootNodesOrAppElements.length > 0) {
                    lastNode = findLastRenderNode(nestedView.rootNodesOrAppElements[nestedView.rootNodesOrAppElements.length - 1]);
                }
            }
        }
    }
    else {
        lastNode = node;
    }
    return lastNode;
}
exports.findLastRenderNode = findLastRenderNode;
function checkSlotCount(componentName, expectedSlotCount, projectableNodes) {
    var givenSlotCount = lang_1.isPresent(projectableNodes) ? projectableNodes.length : 0;
    if (givenSlotCount < expectedSlotCount) {
        throw new exceptions_1.BaseException(("The component " + componentName + " has " + expectedSlotCount + " <ng-content> elements,") +
            (" but only " + givenSlotCount + " slots were provided."));
    }
}
exports.checkSlotCount = checkSlotCount;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmlldy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRpZmZpbmdfcGx1Z2luX3dyYXBwZXItb3V0cHV0X3BhdGgtamFrWG5NbUwudG1wL2FuZ3VsYXIyL3NyYy9jb3JlL2xpbmtlci92aWV3LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQSwyQkFLTyxnQ0FBZ0MsQ0FBQyxDQUFBO0FBQ3hDLGlDQVFPLHFEQUFxRCxDQUFDLENBQUE7QUFFN0QsMkJBQTJCLCtDQUErQyxDQUFDLENBQUE7QUFFM0Usd0JBQTZELFdBQVcsQ0FBQyxDQUFBO0FBQ3pFLHFCQVFPLDBCQUEwQixDQUFDLENBQUE7QUFDbEMsMkJBQThDLGdDQUFnQyxDQUFDLENBQUE7QUFDL0Usb0JBQXNELDhCQUE4QixDQUFDLENBQUE7QUFDckYseUJBQTJDLFlBQVksQ0FBQyxDQUFBO0FBQ3hELHNCQUF5QiwrQkFBK0IsQ0FBQyxDQUFBO0FBQ3pELHFCQUFrQywrQkFBK0IsQ0FBQyxDQUFBO0FBRWxFLDJCQUEyQiwrQ0FBK0MsQ0FBQztBQUFuRSxpREFBbUU7QUFDM0Usc0JBQW9CLCtCQUErQixDQUFDLENBQUE7QUFHcEQsMEJBQXVCLGFBQWEsQ0FBQyxDQUFBO0FBRXJDLElBQU0sY0FBYyxHQUFXLGFBQWEsQ0FBQztBQUU3QyxJQUFNLGFBQWEsR0FBRyxpQkFBVSxDQUFDLElBQUksTUFBTSxFQUFFLENBQUMsQ0FBQztBQUUvQzs7O0dBR0c7QUFDSDtJQWdDRSxpQkFBbUIsS0FBbUIsRUFBUyxRQUFrQixFQUM5QyxXQUE0QixFQUFTLGdCQUFvQyxFQUN6RSxtQkFBK0IsRUFDdEMsNEJBQWdELEVBQUUsWUFBc0IsRUFDakUsY0FBOEI7UUFKOUIsVUFBSyxHQUFMLEtBQUssQ0FBYztRQUFTLGFBQVEsR0FBUixRQUFRLENBQVU7UUFDOUMsZ0JBQVcsR0FBWCxXQUFXLENBQWlCO1FBQVMscUJBQWdCLEdBQWhCLGdCQUFnQixDQUFvQjtRQUN6RSx3QkFBbUIsR0FBbkIs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QixhQUFhLGFBQVEsaUJBQWlCLDZCQUF5QjtZQUNoRixnQkFBYSxjQUFjLDJCQUF1QixDQUFDLENBQUM7SUFDMUQsQ0FBQztBQUNILENBQUM7QUFSZSxzQkFBYyxpQkFRN0IsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIExpc3RXcmFwcGVyLFxuICBNYXBXcmFwcGVyLFxuICBNYXAsXG4gIFN0cmluZ01hcFdyYXBwZXIsXG59IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvY29sbGVjdGlvbic7XG5pbXBvcnQge1xuICBDaGFuZ2VEZXRlY3RvcixcbiAgQ2hhbmdlRGlzcGF0Y2hlcixcbiAgRGlyZWN0aXZlSW5kZXgsXG4gIEJpbmRpbmdUYXJnZXQsXG4gIExvY2FscyxcbiAgUHJvdG9DaGFuZ2VEZXRlY3RvcixcbiAgQ2hhbmdlRGV0ZWN0b3JSZWZcbn0gZnJvbSAnYW5ndWxhcjIvc3JjL2NvcmUvY2hhbmdlX2RldGVjdGlvbi9jaGFuZ2VfZGV0ZWN0aW9uJztcbmltcG9ydCB7UmVzb2x2ZWRQcm92aWRlciwgSW5qZWN0YWJsZSwgSW5qZWN0b3J9IGZyb20gJ2FuZ3VsYXIyL3NyYy9jb3JlL2RpJztcbmltcG9ydCB7RGVidWdDb250ZXh0fSBmcm9tICdhbmd1bGFyMi9zcmMvY29yZS9jaGFuZ2VfZGV0ZWN0aW9uL2ludGVyZmFjZXMnO1xuXG5pbXBvcnQge0FwcFByb3RvRWxlbWVudCwgQXBwRWxlbWVudCwgRGlyZWN0aXZlUHJvdmlkZXJ9IGZyb20gJy4vZWxlbWVudCc7XG5pbXBvcnQge1xuICBpc1ByZXNlbnQsXG4gIGlzQmxhbmssXG4gIFR5cGUsXG4gIGlzQXJyYXksXG4gIGlzTnVtYmVyLFxuICBDT05TVCxcbiAgQ09OU1RfRVhQUlxufSBmcm9tICdhbmd1bGFyMi9zcmMvZmFjYWRlL2xhbmcnO1xuaW1wb3J0IHtCYXNlRXhjZXB0aW9uLCBXcmFwcGVkRXhjZXB0aW9ufSBmcm9tICdhbmd1bGFyMi9zcmMvZmFjYWRlL2V4Y2VwdGlvbnMnO1xuaW1wb3J0IHtSZW5kZXJlciwgUm9vdFJlbmRlcmVyLCBSZW5kZXJEZWJ1Z0luZm99IGZyb20gJ2FuZ3VsYXIyL3NyYy9jb3JlL3JlbmRlci9hcGknO1xuaW1wb3J0IHtWaWV3UmVmXywgSG9zdFZpZXdGYWN0b3J5UmVmfSBmcm9tICcuL3ZpZXdfcmVmJztcbmltcG9ydCB7UHJvdG9QaXBlc30gZnJvbSAnYW5ndWxhcjIvc3JjL2NvcmUvcGlwZXMvcGlwZXMnO1xuaW1wb3J0IHtjYW1lbENhc2VUb0Rhc2hDYXNlfSBmcm9tICdhbmd1bGFyMi9zcmMvY29yZS9yZW5kZXIvdXRpbCc7XG5cbmV4cG9ydCB7RGVidWdDb250ZXh0fSBmcm9tICdhbmd1bGFyMi9zcmMvY29yZS9jaGFuZ2VfZGV0ZWN0aW9uL2ludGVyZmFjZXMnO1xuaW1wb3J0IHtQaXBlc30gZnJvbSAnYW5ndWxhcjIvc3JjL2NvcmUvcGlwZXMvcGlwZXMnO1xuaW1wb3J0IHtBcHBWaWV3TWFuYWdlcl8sIEFwcFZpZXdNYW5hZ2VyfSBmcm9tICcuL3ZpZXdfbWFuYWdlcic7XG5pbXBvcnQge1Jlc29sdmVkTWV0YWRhdGFDYWNoZX0gZnJvbSAnLi9yZXNvbHZlZF9tZXRhZGF0YV9jYWNoZSc7XG5pbXBvcnQge1ZpZXdUeXBlfSBmcm9tICcuL3ZpZXdfdHlwZSc7XG5cbmNvbnN0IFJFRkxFQ1RfUFJFRklYOiBzdHJpbmcgPSAnbmctcmVmbGVjdC0nO1xuXG5jb25zdCBFTVBUWV9DT05URVhUID0gQ09OU1RfRVhQUihuZXcgT2JqZWN0KCkpO1xuXG4vKipcbiAqIENvc3Qgb2YgbWFraW5nIG9iamVjdHM6IGh0dHA6Ly9qc3BlcmYuY29tL2luc3RhbnRpYXRlLXNpemUtb2Ytb2JqZWN0XG4gKlxuICovXG5leHBvcnQgY2xhc3MgQXBwVmlldyBpbXBsZW1lbnRzIENoYW5nZURpc3BhdGNoZXIge1xuICByZWY6IFZpZXdSZWZfO1xuICByb290Tm9kZXNPckFwcEVsZW1lbnRzOiBhbnlbXTtcbiAgYWxsTm9kZXM6IGFueVtdO1xuICBkaXNwb3NhYmxlczogRnVuY3Rpb25bXTtcbiAgYXBwRWxlbWVudHM6IEFwcEVsZW1lbnRbXTtcblxuICAvKipcbiAgICogVGhlIGNvbnRleHQgYWdhaW5zdCB3aGljaCBkYXRhLWJpbmRpbmcgZXhwcmVzc2lvbnMgaW4gdGhpcyB2aWV3IGFyZSBldmFsdWF0ZWQgYWdhaW5zdC5cbiAgICogVGhpcyBpcyBhbHdheXMgYSBjb21wb25lbnQgaW5zdGFuY2UuXG4gICAqL1xuICBjb250ZXh0OiBhbnkgPSBudWxsO1xuXG4gIC8qKlxuICAgKiBWYXJpYWJsZXMsIGxvY2FsIHRvIHRoaXMgdmlldywgdGhhdCBjYW4gYmUgdXNlZCBpbiBiaW5kaW5nIGV4cHJlc3Npb25zIChpbiBhZGRpdGlvbiB0byB0aGVcbiAgICogY29udGV4dCkuIFRoaXMgaXMgdXNlZCBmb3IgdGhpbmcgbGlrZSBgPHZpZGVvICNwbGF5ZXI+YCBvclxuICAgKiBgPGxpIHRlbXBsYXRlPVwiZm9yICNpdGVtIG9mIGl0ZW1zXCI+YCwgd2hlcmUgXCJwbGF5ZXJcIiBhbmQgXCJpdGVtXCIgYXJlIGxvY2FscywgcmVzcGVjdGl2ZWx5LlxuICAgKi9cbiAgbG9jYWxzOiBMb2NhbHM7XG5cbiAgcGlwZXM6IFBpcGVzO1xuXG4gIHBhcmVudEluamVjdG9yOiBJbmplY3RvcjtcblxuICAvKipcbiAgICogV2hldGhlciByb290IGluamVjdG9ycyBvZiB0aGlzIHZpZXdcbiAgICogaGF2ZSBhIGhvc3RCb3VuZGFyeS5cbiAgICovXG4gIGhvc3RJbmplY3RvckJvdW5kYXJ5OiBib29sZWFuO1xuXG4gIGRlc3Ryb3llZDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBwcm90bzogQXBwUHJvdG9WaWV3LCBwdWJsaWMgcmVuZGVyZXI6IFJlbmRlcmVyLFxuICAgICAgICAgICAgICBwdWJsaWMgdmlld01hbmFnZXI6IEFwcFZpZXdNYW5hZ2VyXywgcHVibGljIHByb2plY3RhYmxlTm9kZXM6IEFycmF5PGFueSB8IGFueVtdPixcbiAgICAgICAgICAgICAgcHVibGljIGNvbnRhaW5lckFwcEVsZW1lbnQ6IEFwcEVsZW1lbnQsXG4gICAgICAgICAgICAgIGltcGVyYXRpdmVseUNyZWF0ZWRQcm92aWRlcnM6IFJlc29sdmVkUHJvdmlkZXJbXSwgcm9vdEluamVjdG9yOiBJbmplY3RvcixcbiAgICAgICAgICAgICAgcHVibGljIGNoYW5nZURldGVjdG9yOiBDaGFuZ2VEZXRlY3Rvcikge1xuICAgIHRoaXMucmVmID0gbmV3IFZpZXdSZWZfKHRoaXMpO1xuICAgIHZhciBpbmplY3RvcldpdGhIb3N0Qm91bmRhcnkgPSBBcHBFbGVtZW50LmdldFZpZXdQYXJlbnRJbmplY3RvcihcbiAgICAgICAgdGhpcy5wcm90by50eXBlLCBjb250YWluZXJBcHBFbGVtZW50LCBpbXBlcmF0aXZlbHlDcmVhdGVkUHJvdmlkZXJzLCByb290SW5qZWN0b3IpO1xuICAgIHRoaXMucGFyZW50SW5qZWN0b3IgPSBpbmplY3RvcldpdGhIb3N0Qm91bmRhcnkuaW5qZWN0b3I7XG4gICAgdGhpcy5ob3N0SW5qZWN0b3JCb3VuZGFyeSA9IGluamVjdG9yV2l0aEhvc3RCb3VuZGFyeS5ob3N0SW5qZWN0b3JCb3VuZGFyeTtcbiAgICB2YXIgcGlwZXM7XG4gICAgdmFyIGNvbnRleHQ7XG4gICAgc3dpdGNoIChwcm90by50eXBlKSB7XG4gICAgICBjYXNlIFZpZXdUeXBlLkNPTVBPTkVOVDpcbiAgICAgICAgcGlwZXMgPSBuZXcgUGlwZXMocHJvdG8ucHJvdG9QaXBlcywgY29udGFpbmVyQXBwRWxlbWVudC5nZXRJbmplY3RvcigpKTtcbiAgICAgICAgY29udGV4dCA9IGNvbnRhaW5lckFwcEVsZW1lbnQuZ2V0Q29tcG9uZW50KCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBWaWV3VHlwZS5FTUJFRERFRDpcbiAgICAgICAgcGlwZXMgPSBjb250YWluZXJBcHBFbGVtZW50LnBhcmVudFZpZXcucGlwZXM7XG4gICAgICAgIGNvbnRleHQgPSBjb250YWluZXJBcHBFbGVtZW50LnBhcmVudFZpZXcuY29udGV4dDtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFZpZXdUeXBlLkhPU1Q6XG4gICAgICAgIHBpcGVzID0gbnVsbDtcbiAgICAgICAgY29udGV4dCA9IEVNUFRZX0NPTlRFWFQ7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgICB0aGlzLnBpcGVzID0gcGlwZXM7XG4gICAgdGhpcy5jb250ZXh0ID0gY29udGV4dDtcbiAgfVxuXG4gIGluaXQocm9vdE5vZGVzT3JBcHBFbGVtZW50czogYW55W10sIGFsbE5vZGVzOiBhbnlbXSwgZGlzcG9zYWJsZXM6IEZ1bmN0aW9uW10sXG4gICAgICAgYXBwRWxlbWVudHM6IEFwcEVsZW1lbnRbXSkge1xuICAgIHRoaXMucm9vdE5vZGVzT3JBcHBFbGVtZW50cyA9IHJvb3ROb2Rlc09yQXBwRWxlbWVudHM7XG4gICAgdGhpcy5hbGxOb2RlcyA9IGFsbE5vZGVzO1xuICAgIHRoaXMuZGlzcG9zYWJsZXMgPSBkaXNwb3NhYmxlcztcbiAgICB0aGlzLmFwcEVsZW1lbnRzID0gYXBwRWxlbWVudHM7XG4gICAgdmFyIGxvY2Fsc01hcCA9IG5ldyBNYXA8c3RyaW5nLCBhbnk+KCk7XG4gICAgU3RyaW5nTWFwV3JhcHBlci5mb3JFYWNoKFxuICAgICAgICB0aGlzLnByb3RvLnRlbXBsYXRlVmFyaWFibGVCaW5kaW5ncyxcbiAgICAgICAgKHRlbXBsYXRlTmFtZTogc3RyaW5nLCBfOiBzdHJpbmcpID0+IHsgbG9jYWxzTWFwLnNldCh0ZW1wbGF0ZU5hbWUsIG51bGwpOyB9KTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFwcEVsZW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgYXBwRWwgPSBhcHBFbGVtZW50c1tpXTtcbiAgICAgIHZhciBwcm92aWRlclRva2VucyA9IFtdO1xuICAgICAgaWYgKGlzUHJlc2VudChhcHBFbC5wcm90by5wcm90b0luamVjdG9yKSkge1xuICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IGFwcEVsLnByb3RvLnByb3RvSW5qZWN0b3IubnVtYmVyT2ZQcm92aWRlcnM7IGorKykge1xuICAgICAgICAgIHByb3ZpZGVyVG9rZW5zLnB1c2goYXBwRWwucHJvdG8ucHJvdG9JbmplY3Rvci5nZXRQcm92aWRlckF0SW5kZXgoaikua2V5LnRva2VuKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgU3RyaW5nTWFwV3JhcHBlci5mb3JFYWNoKGFwcEVsLnByb3RvLmRpcmVjdGl2ZVZhcmlhYmxlQmluZGluZ3MsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGRpcmVjdGl2ZUluZGV4OiBudW1iZXIsIG5hbWU6IHN0cmluZykgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGlzQmxhbmsoZGlyZWN0aXZlSW5kZXgpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvY2Fsc01hcC5zZXQobmFtZSwgYXBwRWwubmF0aXZlRWxlbWVudCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2NhbHNNYXAuc2V0KG5hbWUsIGFwcEVsLmdldERpcmVjdGl2ZUF0SW5kZXgoZGlyZWN0aXZlSW5kZXgpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgIHRoaXMucmVuZGVyZXIuc2V0RWxlbWVudERlYnVnSW5mbyhcbiAgICAgICAgICBhcHBFbC5uYXRpdmVFbGVtZW50LCBuZXcgUmVuZGVyRGVidWdJbmZvKGFwcEVsLmdldEluamVjdG9yKCksIGFwcEVsLmdldENvbXBvbmVudCgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvdmlkZXJUb2tlbnMsIGxvY2Fsc01hcCkpO1xuICAgIH1cbiAgICB2YXIgcGFyZW50TG9jYWxzID0gbnVsbDtcbiAgICBpZiAodGhpcy5wcm90by50eXBlICE9PSBWaWV3VHlwZS5DT01QT05FTlQpIHtcbiAgICAgIHBhcmVudExvY2FscyA9XG4gICAgICAgICAgaXNQcmVzZW50KHRoaXMuY29udGFpbmVyQXBwRWxlbWVudCkgPyB0aGlzLmNvbnRhaW5lckFwcEVsZW1lbnQucGFyZW50Vmlldy5sb2NhbHMgOiBudWxsO1xuICAgIH1cbiAgICBpZiAodGhpcy5wcm90by50eXBlID09PSBWaWV3VHlwZS5DT01QT05FTlQpIHtcbiAgICAgIC8vIE5vdGU6IHRoZSByZW5kZXIgbm9kZXMgaGF2ZSBiZWVuIGF0dGFjaGVkIHRvIHRoZWlyIGhvc3QgZWxlbWVudFxuICAgICAgLy8gaW4gdGhlIFZpZXdGYWN0b3J5IGFscmVhZHkuXG4gICAgICB0aGlzLmNvbnRhaW5lckFwcEVsZW1lbnQuYXR0YWNoQ29tcG9uZW50Vmlldyh0aGlzKTtcbiAgICAgIHRoaXMuY29udGFpbmVyQXBwRWxlbWVudC5wYXJlbnRWaWV3LmNoYW5nZURldGVjdG9yLmFkZFZpZXdDaGlsZCh0aGlzLmNoYW5nZURldGVjdG9yKTtcbiAgICB9XG4gICAgdGhpcy5sb2NhbHMgPSBuZXcgTG9jYWxzKHBhcmVudExvY2FscywgbG9jYWxzTWFwKTtcbiAgICB0aGlzLmNoYW5nZURldGVjdG9yLmh5ZHJhdGUodGhpcy5jb250ZXh0LCB0aGlzLmxvY2FscywgdGhpcywgdGhpcy5waXBlcyk7XG4gICAgdGhpcy52aWV3TWFuYWdlci5vblZpZXdDcmVhdGVkKHRoaXMpO1xuICB9XG5cbiAgZGVzdHJveSgpIHtcbiAgICBpZiAodGhpcy5kZXN0cm95ZWQpIHtcbiAgICAgIHRocm93IG5ldyBCYXNlRXhjZXB0aW9uKCdUaGlzIHZpZXcgaGFzIGFscmVhZHkgYmVlbiBkZXN0cm95ZWQhJyk7XG4gICAgfVxuICAgIHRoaXMuY2hhbmdlRGV0ZWN0b3IuZGVzdHJveVJlY3Vyc2l2ZSgpO1xuICB9XG5cbiAgbm90aWZ5T25EZXN0cm95KCkge1xuICAgIHRoaXMuZGVzdHJveWVkID0gdHJ1ZTtcbiAgICB2YXIgaG9zdEVsZW1lbnQgPVxuICAgICAgICB0aGlzLnByb3RvLnR5cGUgPT09IFZpZXdUeXBlLkNPTVBPTkVOVCA/IHRoaXMuY29udGFpbmVyQXBwRWxlbWVudC5uYXRpdmVFbGVtZW50IDogbnVsbDtcbiAgICB0aGlzLnJlbmRlcmVyLmRlc3Ryb3lWaWV3KGhvc3RFbGVtZW50LCB0aGlzLmFsbE5vZGVzKTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuZGlzcG9zYWJsZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHRoaXMuZGlzcG9zYWJsZXNbaV0oKTtcbiAgICB9XG4gICAgdGhpcy52aWV3TWFuYWdlci5vblZpZXdEZXN0cm95ZWQodGhpcyk7XG4gIH1cblxuICBnZXQgY2hhbmdlRGV0ZWN0b3JSZWYoKTogQ2hhbmdlRGV0ZWN0b3JSZWYgeyByZXR1cm4gdGhpcy5jaGFuZ2VEZXRlY3Rvci5yZWY7IH1cblxuICBnZXQgZmxhdFJvb3ROb2RlcygpOiBhbnlbXSB7IHJldHVybiBmbGF0dGVuTmVzdGVkVmlld1JlbmRlck5vZGVzKHRoaXMucm9vdE5vZGVzT3JBcHBFbGVtZW50cyk7IH1cblxuICBoYXNMb2NhbChjb250ZXh0TmFtZTogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIFN0cmluZ01hcFdyYXBwZXIuY29udGFpbnModGhpcy5wcm90by50ZW1wbGF0ZVZhcmlhYmxlQmluZGluZ3MsIGNvbnRleHROYW1lKTtcbiAgfVxuXG4gIHNldExvY2FsKGNvbnRleHROYW1lOiBzdHJpbmcsIHZhbHVlOiBhbnkpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuaGFzTG9jYWwoY29udGV4dE5hbWUpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHZhciB0ZW1wbGF0ZU5hbWUgPSB0aGlzLnByb3RvLnRlbXBsYXRlVmFyaWFibGVCaW5kaW5nc1tjb250ZXh0TmFtZV07XG4gICAgdGhpcy5sb2NhbHMuc2V0KHRlbXBsYXRlTmFtZSwgdmFsdWUpO1xuICB9XG5cbiAgLy8gZGlzcGF0Y2ggdG8gZWxlbWVudCBpbmplY3RvciBvciB0ZXh0IG5vZGVzIGJhc2VkIG9uIGNvbnRleHRcbiAgbm90aWZ5T25CaW5kaW5nKGI6IEJpbmRpbmdUYXJnZXQsIGN1cnJlbnRWYWx1ZTogYW55KTogdm9pZCB7XG4gICAgaWYgKGIuaXNUZXh0Tm9kZSgpKSB7XG4gICAgICB0aGlzLnJlbmRlcmVyLnNldFRleHQodGhpcy5hbGxOb2Rlc1tiLmVsZW1lbnRJbmRleF0sIGN1cnJlbnRWYWx1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBuYXRpdmVFbGVtZW50ID0gdGhpcy5hcHBFbGVtZW50c1tiLmVsZW1lbnRJbmRleF0ubmF0aXZlRWxlbWVudDtcbiAgICAgIGlmIChiLmlzRWxlbWVudFByb3BlcnR5KCkpIHtcbiAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRFbGVtZW50UHJvcGVydHkobmF0aXZlRWxlbWVudCwgYi5uYW1lLCBjdXJyZW50VmFsdWUpO1xuICAgICAgfSBlbHNlIGlmIChiLmlzRWxlbWVudEF0dHJpYnV0ZSgpKSB7XG4gICAgICAgIHRoaXMucmVuZGVyZXIuc2V0RWxlbWVudEF0dHJpYnV0ZShuYXRpdmVFbGVtZW50LCBiLm5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc1ByZXNlbnQoY3VycmVudFZhbHVlKSA/IGAke2N1cnJlbnRWYWx1ZX1gIDogbnVsbCk7XG4gICAgICB9IGVsc2UgaWYgKGIuaXNFbGVtZW50Q2xhc3MoKSkge1xuICAgICAgICB0aGlzLnJlbmRlcmVyLnNldEVsZW1lbnRDbGFzcyhuYXRpdmVFbGVtZW50LCBiLm5hbWUsIGN1cnJlbnRWYWx1ZSk7XG4gICAgICB9IGVsc2UgaWYgKGIuaXNFbGVtZW50U3R5bGUoKSkge1xuICAgICAgICB2YXIgdW5pdCA9IGlzUHJlc2VudChiLnVuaXQpID8gYi51bml0IDogJyc7XG4gICAgICAgIHRoaXMucmVuZGVyZXIuc2V0RWxlbWVudFN0eWxlKG5hdGl2ZUVsZW1lbnQsIGIubmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNQcmVzZW50KGN1cnJlbnRWYWx1ZSkgPyBgJHtjdXJyZW50VmFsdWV9JHt1bml0fWAgOiBudWxsKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IG5ldyBCYXNlRXhjZXB0aW9uKCdVbnN1cHBvcnRlZCBkaXJlY3RpdmUgcmVjb3JkJyk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgbG9nQmluZGluZ1VwZGF0ZShiOiBCaW5kaW5nVGFyZ2V0LCB2YWx1ZTogYW55KTogdm9pZCB7XG4gICAgaWYgKGIuaXNEaXJlY3RpdmUoKSB8fCBiLmlzRWxlbWVudFByb3BlcnR5KCkpIHtcbiAgICAgIHZhciBuYXRpdmVFbGVtZW50ID0gdGhpcy5hcHBFbGVtZW50c1tiLmVsZW1lbnRJbmRleF0ubmF0aXZlRWxlbWVudDtcbiAgICAgIHRoaXMucmVuZGVyZXIuc2V0QmluZGluZ0RlYnVnSW5mbyhcbiAgICAgICAgICBuYXRpdmVFbGVtZW50LCBgJHtSRUZMRUNUX1BSRUZJWH0ke2NhbWVsQ2FzZVRvRGFzaENhc2UoYi5uYW1lKX1gLCBgJHt2YWx1ZX1gKTtcbiAgICB9XG4gIH1cblxuICBub3RpZnlBZnRlckNvbnRlbnRDaGVja2VkKCk6IHZvaWQge1xuICAgIHZhciBjb3VudCA9IHRoaXMuYXBwRWxlbWVudHMubGVuZ3RoO1xuICAgIGZvciAodmFyIGkgPSBjb3VudCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICB0aGlzLmFwcEVsZW1lbnRzW2ldLm5nQWZ0ZXJDb250ZW50Q2hlY2tlZCgpO1xuICAgIH1cbiAgfVxuXG4gIG5vdGlmeUFmdGVyVmlld0NoZWNrZWQoKTogdm9pZCB7XG4gICAgdmFyIGNvdW50ID0gdGhpcy5hcHBFbGVtZW50cy5sZW5ndGg7XG4gICAgZm9yICh2YXIgaSA9IGNvdW50IC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgIHRoaXMuYXBwRWxlbWVudHNbaV0ubmdBZnRlclZpZXdDaGVja2VkKCk7XG4gICAgfVxuICB9XG5cbiAgZ2V0RGVidWdDb250ZXh0KGFwcEVsZW1lbnQ6IEFwcEVsZW1lbnQsIGVsZW1lbnRJbmRleDogbnVtYmVyLFxuICAgICAgICAgICAgICAgICAgZGlyZWN0aXZlSW5kZXg6IG51bWJlcik6IERlYnVnQ29udGV4dCB7XG4gICAgdHJ5IHtcbiAgICAgIGlmIChpc0JsYW5rKGFwcEVsZW1lbnQpICYmIGVsZW1lbnRJbmRleCA8IHRoaXMuYXBwRWxlbWVudHMubGVuZ3RoKSB7XG4gICAgICAgIGFwcEVsZW1lbnQgPSB0aGlzLmFwcEVsZW1lbnRzW2VsZW1lbnRJbmRleF07XG4gICAgICB9XG4gICAgICB2YXIgY29udGFpbmVyID0gdGhpcy5jb250YWluZXJBcHBFbGVtZW50O1xuXG4gICAgICB2YXIgZWxlbWVudCA9IGlzUHJlc2VudChhcHBFbGVtZW50KSA/IGFwcEVsZW1lbnQubmF0aXZlRWxlbWVudCA6IG51bGw7XG4gICAgICB2YXIgY29tcG9uZW50RWxlbWVudCA9IGlzUHJlc2VudChjb250YWluZXIpID8gY29udGFpbmVyLm5hdGl2ZUVsZW1lbnQgOiBudWxsO1xuICAgICAgdmFyIGRpcmVjdGl2ZSA9XG4gICAgICAgICAgaXNQcmVzZW50KGRpcmVjdGl2ZUluZGV4KSA/IGFwcEVsZW1lbnQuZ2V0RGlyZWN0aXZlQXRJbmRleChkaXJlY3RpdmVJbmRleCkgOiBudWxsO1xuICAgICAgdmFyIGluamVjdG9yID0gaXNQcmVzZW50KGFwcEVsZW1lbnQpID8gYXBwRWxlbWVudC5nZXRJbmplY3RvcigpIDogbnVsbDtcblxuICAgICAgcmV0dXJuIG5ldyBEZWJ1Z0NvbnRleHQoZWxlbWVudCwgY29tcG9uZW50RWxlbWVudCwgZGlyZWN0aXZlLCB0aGlzLmNvbnRleHQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfbG9jYWxzVG9TdHJpbmdNYXAodGhpcy5sb2NhbHMpLCBpbmplY3Rvcik7XG5cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAvLyBUT0RPOiB2c2F2a2luIGxvZyB0aGUgZXhjZXB0aW9uIG9uY2Ugd2UgaGF2ZSBhIGdvb2Qgd2F5IHRvIGxvZyBlcnJvcnMgYW5kIHdhcm5pbmdzXG4gICAgICAvLyBpZiBhbiBlcnJvciBoYXBwZW5zIGR1cmluZyBnZXR0aW5nIHRoZSBkZWJ1ZyBjb250ZXh0LCB3ZSByZXR1cm4gbnVsbC5cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgfVxuXG4gIGdldERpcmVjdGl2ZUZvcihkaXJlY3RpdmU6IERpcmVjdGl2ZUluZGV4KTogYW55IHtcbiAgICByZXR1cm4gdGhpcy5hcHBFbGVtZW50c1tkaXJlY3RpdmUuZWxlbWVudEluZGV4XS5nZXREaXJlY3RpdmVBdEluZGV4KGRpcmVjdGl2ZS5kaXJlY3RpdmVJbmRleCk7XG4gIH1cblxuICBnZXREZXRlY3RvckZvcihkaXJlY3RpdmU6IERpcmVjdGl2ZUluZGV4KTogQ2hhbmdlRGV0ZWN0b3Ige1xuICAgIHZhciBjb21wb25lbnRWaWV3ID0gdGhpcy5hcHBFbGVtZW50c1tkaXJlY3RpdmUuZWxlbWVudEluZGV4XS5jb21wb25lbnRWaWV3O1xuICAgIHJldHVybiBpc1ByZXNlbnQoY29tcG9uZW50VmlldykgPyBjb21wb25lbnRWaWV3LmNoYW5nZURldGVjdG9yIDogbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBUcmlnZ2VycyB0aGUgZXZlbnQgaGFuZGxlcnMgZm9yIHRoZSBlbGVtZW50IGFuZCB0aGUgZGlyZWN0aXZlcy5cbiAgICpcbiAgICogVGhpcyBtZXRob2QgaXMgaW50ZW5kZWQgdG8gYmUgY2FsbGVkIGZyb20gZGlyZWN0aXZlIEV2ZW50RW1pdHRlcnMuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBldmVudE5hbWVcbiAgICogQHBhcmFtIHsqfSBldmVudE9ialxuICAgKiBAcGFyYW0ge251bWJlcn0gYm91bmRFbGVtZW50SW5kZXhcbiAgICogQHJldHVybiBmYWxzZSBpZiBwcmV2ZW50RGVmYXVsdCBtdXN0IGJlIGFwcGxpZWQgdG8gdGhlIERPTSBldmVudFxuICAgKi9cbiAgdHJpZ2dlckV2ZW50SGFuZGxlcnMoZXZlbnROYW1lOiBzdHJpbmcsIGV2ZW50T2JqOiBFdmVudCwgYm91bmRFbGVtZW50SW5kZXg6IG51bWJlcik6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmNoYW5nZURldGVjdG9yLmhhbmRsZUV2ZW50KGV2ZW50TmFtZSwgYm91bmRFbGVtZW50SW5kZXgsIGV2ZW50T2JqKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBfbG9jYWxzVG9TdHJpbmdNYXAobG9jYWxzOiBMb2NhbHMpOiB7W2tleTogc3RyaW5nXTogYW55fSB7XG4gIHZhciByZXMgPSB7fTtcbiAgdmFyIGMgPSBsb2NhbHM7XG4gIHdoaWxlIChpc1ByZXNlbnQoYykpIHtcbiAgICByZXMgPSBTdHJpbmdNYXBXcmFwcGVyLm1lcmdlKHJlcywgTWFwV3JhcHBlci50b1N0cmluZ01hcChjLmN1cnJlbnQpKTtcbiAgICBjID0gYy5wYXJlbnQ7XG4gIH1cbiAgcmV0dXJuIHJlcztcbn1cblxuLyoqXG4gKlxuICovXG5leHBvcnQgY2xhc3MgQXBwUHJvdG9WaWV3IHtcbiAgc3RhdGljIGNyZWF0ZShtZXRhZGF0YUNhY2hlOiBSZXNvbHZlZE1ldGFkYXRhQ2FjaGUsIHR5cGU6IFZpZXdUeXBlLCBwaXBlczogVHlwZVtdLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVmFyaWFibGVCaW5kaW5nczoge1trZXk6IHN0cmluZ106IHN0cmluZ30pOiBBcHBQcm90b1ZpZXcge1xuICAgIHZhciBwcm90b1BpcGVzID0gbnVsbDtcbiAgICBpZiAoaXNQcmVzZW50KHBpcGVzKSAmJiBwaXBlcy5sZW5ndGggPiAwKSB7XG4gICAgICB2YXIgYm91bmRQaXBlcyA9IExpc3RXcmFwcGVyLmNyZWF0ZUZpeGVkU2l6ZShwaXBlcy5sZW5ndGgpO1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwaXBlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBib3VuZFBpcGVzW2ldID0gbWV0YWRhdGFDYWNoZS5nZXRSZXNvbHZlZFBpcGVNZXRhZGF0YShwaXBlc1tpXSk7XG4gICAgICB9XG4gICAgICBwcm90b1BpcGVzID0gUHJvdG9QaXBlcy5mcm9tUHJvdmlkZXJzKGJvdW5kUGlwZXMpO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IEFwcFByb3RvVmlldyh0eXBlLCBwcm90b1BpcGVzLCB0ZW1wbGF0ZVZhcmlhYmxlQmluZGluZ3MpO1xuICB9XG5cbiAgY29uc3RydWN0b3IocHVibGljIHR5cGU6IFZpZXdUeXBlLCBwdWJsaWMgcHJvdG9QaXBlczogUHJvdG9QaXBlcyxcbiAgICAgICAgICAgICAgcHVibGljIHRlbXBsYXRlVmFyaWFibGVCaW5kaW5nczoge1trZXk6IHN0cmluZ106IHN0cmluZ30pIHt9XG59XG5cblxuQENPTlNUKClcbmV4cG9ydCBjbGFzcyBIb3N0Vmlld0ZhY3Rvcnkge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgc2VsZWN0b3I6IHN0cmluZywgcHVibGljIHZpZXdGYWN0b3J5OiBGdW5jdGlvbikge31cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZsYXR0ZW5OZXN0ZWRWaWV3UmVuZGVyTm9kZXMobm9kZXM6IGFueVtdKTogYW55W10ge1xuICByZXR1cm4gX2ZsYXR0ZW5OZXN0ZWRWaWV3UmVuZGVyTm9kZXMobm9kZXMsIFtdKTtcbn1cblxuZnVuY3Rpb24gX2ZsYXR0ZW5OZXN0ZWRWaWV3UmVuZGVyTm9kZXMobm9kZXM6IGFueVtdLCByZW5kZXJOb2RlczogYW55W10pOiBhbnlbXSB7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgbm9kZSA9IG5vZGVzW2ldO1xuICAgIGlmIChub2RlIGluc3RhbmNlb2YgQXBwRWxlbWVudCkge1xuICAgICAgdmFyIGFwcEVsID0gPEFwcEVsZW1lbnQ+bm9kZTtcbiAgICAgIHJlbmRlck5vZGVzLnB1c2goYXBwRWwubmF0aXZlRWxlbWVudCk7XG4gICAgICBpZiAoaXNQcmVzZW50KGFwcEVsLm5lc3RlZFZpZXdzKSkge1xuICAgICAgICBmb3IgKHZhciBrID0gMDsgayA8IGFwcEVsLm5lc3RlZFZpZXdzLmxlbmd0aDsgaysrKSB7XG4gICAgICAgICAgX2ZsYXR0ZW5OZXN0ZWRWaWV3UmVuZGVyTm9kZXMoYXBwRWwubmVzdGVkVmlld3Nba10ucm9vdE5vZGVzT3JBcHBFbGVtZW50cywgcmVuZGVyTm9kZXMpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlbmRlck5vZGVzLnB1c2gobm9kZSk7XG4gICAgfVxuICB9XG4gIHJldHVybiByZW5kZXJOb2Rlcztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZpbmRMYXN0UmVuZGVyTm9kZShub2RlOiBhbnkpOiBhbnkge1xuICB2YXIgbGFzdE5vZGU7XG4gIGlmIChub2RlIGluc3RhbmNlb2YgQXBwRWxlbWVudCkge1xuICAgIHZhciBhcHBFbCA9IDxBcHBFbGVtZW50Pm5vZGU7XG4gICAgbGFzdE5vZGUgPSBhcHBFbC5uYXRpdmVFbGVtZW50O1xuICAgIGlmIChpc1ByZXNlbnQoYXBwRWwubmVzdGVkVmlld3MpKSB7XG4gICAgICAvLyBOb3RlOiBWaWV3cyBtaWdodCBoYXZlIG5vIHJvb3Qgbm9kZXMgYXQgYWxsIVxuICAgICAgZm9yICh2YXIgaSA9IGFwcEVsLm5lc3RlZFZpZXdzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgIHZhciBuZXN0ZWRWaWV3ID0gYXBwRWwubmVzdGVkVmlld3NbaV07XG4gICAgICAgIGlmIChuZXN0ZWRWaWV3LnJvb3ROb2Rlc09yQXBwRWxlbWVudHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgIGxhc3ROb2RlID0gZmluZExhc3RSZW5kZXJOb2RlKFxuICAgICAgICAgICAgICBuZXN0ZWRWaWV3LnJvb3ROb2Rlc09yQXBwRWxlbWVudHNbbmVzdGVkVmlldy5yb290Tm9kZXNPckFwcEVsZW1lbnRzLmxlbmd0aCAtIDFdKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBsYXN0Tm9kZSA9IG5vZGU7XG4gIH1cbiAgcmV0dXJuIGxhc3ROb2RlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY2hlY2tTbG90Q291bnQoY29tcG9uZW50TmFtZTogc3RyaW5nLCBleHBlY3RlZFNsb3RDb3VudDogbnVtYmVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb2plY3RhYmxlTm9kZXM6IGFueVtdW10pOiB2b2lkIHtcbiAgdmFyIGdpdmVuU2xvdENvdW50ID0gaXNQcmVzZW50KHByb2plY3RhYmxlTm9kZXMpID8gcHJvamVjdGFibGVOb2Rlcy5sZW5ndGggOiAwO1xuICBpZiAoZ2l2ZW5TbG90Q291bnQgPCBleHBlY3RlZFNsb3RDb3VudCkge1xuICAgIHRocm93IG5ldyBCYXNlRXhjZXB0aW9uKFxuICAgICAgICBgVGhlIGNvbXBvbmVudCAke2NvbXBvbmVudE5hbWV9IGhhcyAke2V4cGVjdGVkU2xvdENvdW50fSA8bmctY29udGVudD4gZWxlbWVudHMsYCArXG4gICAgICAgIGAgYnV0IG9ubHkgJHtnaXZlblNsb3RDb3VudH0gc2xvdHMgd2VyZSBwcm92aWRlZC5gKTtcbiAgfVxufVxuIl19