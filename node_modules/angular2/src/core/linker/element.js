'use strict';"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var lang_1 = require('angular2/src/facade/lang');
var exceptions_1 = require('angular2/src/facade/exceptions');
var collection_1 = require('angular2/src/facade/collection');
var di_1 = require('angular2/src/core/di');
var provider_1 = require('angular2/src/core/di/provider');
var injector_1 = require('angular2/src/core/di/injector');
var provider_2 = require('angular2/src/core/di/provider');
var di_2 = require('../metadata/di');
var view_type_1 = require('./view_type');
var element_ref_1 = require('./element_ref');
var view_container_ref_1 = require('./view_container_ref');
var element_ref_2 = require('./element_ref');
var api_1 = require('angular2/src/core/render/api');
var template_ref_1 = require('./template_ref');
var directives_1 = require('../metadata/directives');
var change_detection_1 = require('angular2/src/core/change_detection/change_detection');
var query_list_1 = require('./query_list');
var reflection_1 = require('angular2/src/core/reflection/reflection');
var pipe_provider_1 = require('angular2/src/core/pipes/pipe_provider');
var view_container_ref_2 = require("./view_container_ref");
var _staticKeys;
var StaticKeys = (function () {
    function StaticKeys() {
        this.templateRefId = di_1.Key.get(template_ref_1.TemplateRef).id;
        this.viewContainerId = di_1.Key.get(view_container_ref_1.ViewContainerRef).id;
        this.changeDetectorRefId = di_1.Key.get(change_detection_1.ChangeDetectorRef).id;
        this.elementRefId = di_1.Key.get(element_ref_2.ElementRef).id;
        this.rendererId = di_1.Key.get(api_1.Renderer).id;
    }
    StaticKeys.instance = function () {
        if (lang_1.isBlank(_staticKeys))
            _staticKeys = new StaticKeys();
        return _staticKeys;
    };
    return StaticKeys;
}());
exports.StaticKeys = StaticKeys;
var DirectiveDependency = (function (_super) {
    __extends(DirectiveDependency, _super);
    function DirectiveDependency(key, optional, lowerBoundVisibility, upperBoundVisibility, properties, attributeName, queryDecorator) {
        _super.call(this, key, optional, lowerBoundVisibility, upperBoundVisibility, properties);
        this.attributeName = attributeName;
        this.queryDecorator = queryDecorator;
        this._verify();
    }
    /** @internal */
    DirectiveDependency.prototype._verify = function () {
        var count = 0;
        if (lang_1.isPresent(this.queryDecorator))
            count++;
        if (lang_1.isPresent(this.attributeName))
            count++;
        if (count > 1)
            throw new exceptions_1.BaseException('A directive injectable can contain only one of the following @Attribute or @Query.');
    };
    DirectiveDependency.createFrom = function (d) {
        return new DirectiveDependency(d.key, d.optional, d.lowerBoundVisibility, d.upperBoundVisibility, d.properties, DirectiveDependency._attributeName(d.properties), DirectiveDependency._query(d.properties));
    };
    /** @internal */
    DirectiveDependency._attributeName = function (properties) {
        var p = properties.find(function (p) { return p instanceof di_2.AttributeMetadata; });
        return lang_1.isPresent(p) ? p.attributeName : null;
    };
    /** @internal */
    DirectiveDependency._query = function (properties) {
        return properties.find(function (p) { return p instanceof di_2.QueryMetadata; });
    };
    return DirectiveDependency;
}(di_1.Dependency));
exports.DirectiveDependency = DirectiveDependency;
var DirectiveProvider = (function (_super) {
    __extends(DirectiveProvider, _super);
    function DirectiveProvider(key, factory, deps, isComponent, providers, viewProviders, queries) {
        _super.call(this, key, [new provider_2.ResolvedFactory(factory, deps)], false);
        this.isComponent = isComponent;
        this.providers = providers;
        this.viewProviders = viewProviders;
        this.queries = queries;
    }
    Object.defineProperty(DirectiveProvider.prototype, "displayName", {
        get: function () { return this.key.displayName; },
        enumerable: true,
        configurable: true
    });
    DirectiveProvider.createFromType = function (type, meta) {
        var provider = new di_1.Provider(type, { useClass: type });
        if (lang_1.isBlank(meta)) {
            meta = new directives_1.DirectiveMetadata();
        }
        var rb = provider_2.resolveProvider(provider);
        var rf = rb.resolvedFactories[0];
        var deps = rf.dependencies.map(DirectiveDependency.createFrom);
        var isComponent = meta instanceof directives_1.ComponentMetadata;
        var resolvedProviders = lang_1.isPresent(meta.providers) ? di_1.Injector.resolve(meta.providers) : null;
        var resolvedViewProviders = meta instanceof directives_1.ComponentMetadata && lang_1.isPresent(meta.viewProviders) ?
            di_1.Injector.resolve(meta.viewProviders) :
            null;
        var queries = [];
        if (lang_1.isPresent(meta.queries)) {
            collection_1.StringMapWrapper.forEach(meta.queries, function (meta, fieldName) {
                var setter = reflection_1.reflector.setter(fieldName);
                queries.push(new QueryMetadataWithSetter(setter, meta));
            });
        }
        // queries passed into the constructor.
        // TODO: remove this after constructor queries are no longer supported
        deps.forEach(function (d) {
            if (lang_1.isPresent(d.queryDecorator)) {
                queries.push(new QueryMetadataWithSetter(null, d.queryDecorator));
            }
        });
        return new DirectiveProvider(rb.key, rf.factory, deps, isComponent, resolvedProviders, resolvedViewProviders, queries);
    };
    return DirectiveProvider;
}(provider_2.ResolvedProvider_));
exports.DirectiveProvider = DirectiveProvider;
var QueryMetadataWithSetter = (function () {
    function QueryMetadataWithSetter(setter, metadata) {
        this.setter = setter;
        this.metadata = metadata;
    }
    return QueryMetadataWithSetter;
}());
exports.QueryMetadataWithSetter = QueryMetadataWithSetter;
function setProvidersVisibility(providers, visibility, result) {
    for (var i = 0; i < providers.length; i++) {
        result.set(providers[i].key.id, visibility);
    }
}
var AppProtoElement = (function () {
    function AppProtoElement(firstProviderIsComponent, index, attributes, pwvs, protoQueryRefs, directiveVariableBindings) {
        this.firstProviderIsComponent = firstProviderIsComponent;
        this.index = index;
        this.attributes = attributes;
        this.protoQueryRefs = protoQueryRefs;
        this.directiveVariableBindings = directiveVariableBindings;
        var length = pwvs.length;
        if (length > 0) {
            this.protoInjector = new injector_1.ProtoInjector(pwvs);
        }
        else {
            this.protoInjector = null;
            this.protoQueryRefs = [];
        }
    }
    AppProtoElement.create = function (metadataCache, index, attributes, directiveTypes, directiveVariableBindings) {
        var componentDirProvider = null;
        var mergedProvidersMap = new Map();
        var providerVisibilityMap = new Map();
        var providers = collection_1.ListWrapper.createGrowableSize(directiveTypes.length);
        var protoQueryRefs = [];
        for (var i = 0; i < directiveTypes.length; i++) {
            var dirProvider = metadataCache.getResolvedDirectiveMetadata(directiveTypes[i]);
            providers[i] = new injector_1.ProviderWithVisibility(dirProvider, dirProvider.isComponent ? injector_1.Visibility.PublicAndPrivate : injector_1.Visibility.Public);
            if (dirProvider.isComponent) {
                componentDirProvider = dirProvider;
            }
            else {
                if (lang_1.isPresent(dirProvider.providers)) {
                    provider_1.mergeResolvedProviders(dirProvider.providers, mergedProvidersMap);
                    setProvidersVisibility(dirProvider.providers, injector_1.Visibility.Public, providerVisibilityMap);
                }
            }
            if (lang_1.isPresent(dirProvider.viewProviders)) {
                provider_1.mergeResolvedProviders(dirProvider.viewProviders, mergedProvidersMap);
                setProvidersVisibility(dirProvider.viewProviders, injector_1.Visibility.Private, providerVisibilityMap);
            }
            for (var queryIdx = 0; queryIdx < dirProvider.queries.length; queryIdx++) {
                var q = dirProvider.queries[queryIdx];
                protoQueryRefs.push(new ProtoQueryRef(i, q.setter, q.metadata));
            }
        }
        if (lang_1.isPresent(componentDirProvider) && lang_1.isPresent(componentDirProvider.providers)) {
            // directive providers need to be prioritized over component providers
            provider_1.mergeResolvedProviders(componentDirProvider.providers, mergedProvidersMap);
            setProvidersVisibility(componentDirProvider.providers, injector_1.Visibility.Public, providerVisibilityMap);
        }
        mergedProvidersMap.forEach(function (provider, _) {
            providers.push(new injector_1.ProviderWithVisibility(provider, providerVisibilityMap.get(provider.key.id)));
        });
        return new AppProtoElement(lang_1.isPresent(componentDirProvider), index, attributes, providers, protoQueryRefs, directiveVariableBindings);
    };
    AppProtoElement.prototype.getProviderAtIndex = function (index) { return this.protoInjector.getProviderAtIndex(index); };
    return AppProtoElement;
}());
exports.AppProtoElement = AppProtoElement;
var _Context = (function () {
    function _Context(element, componentElement, injector) {
        this.element = element;
        this.componentElement = componentElement;
        this.injector = injector;
    }
    return _Context;
}());
var InjectorWithHostBoundary = (function () {
    function InjectorWithHostBoundary(injector, hostInjectorBoundary) {
        this.injector = injector;
        this.hostInjectorBoundary = hostInjectorBoundary;
    }
    return InjectorWithHostBoundary;
}());
exports.InjectorWithHostBoundary = InjectorWithHostBoundary;
var AppElement = (function () {
    function AppElement(proto, parentView, parent, nativeElement, embeddedViewFactory) {
        var _this = this;
        this.proto = proto;
        this.parentView = parentView;
        this.parent = parent;
        this.nativeElement = nativeElement;
        this.embeddedViewFactory = embeddedViewFactory;
        this.nestedViews = null;
        this.componentView = null;
        this.ref = new element_ref_1.ElementRef_(this);
        var parentInjector = lang_1.isPresent(parent) ? parent._injector : parentView.parentInjector;
        if (lang_1.isPresent(this.proto.protoInjector)) {
            var isBoundary;
            if (lang_1.isPresent(parent) && lang_1.isPresent(parent.proto.protoInjector)) {
                isBoundary = false;
            }
            else {
                isBoundary = parentView.hostInjectorBoundary;
            }
            this._queryStrategy = this._buildQueryStrategy();
            this._injector = new di_1.Injector(this.proto.protoInjector, parentInjector, isBoundary, this, function () { return _this._debugContext(); });
            // we couple ourselves to the injector strategy to avoid polymorphic calls
            var injectorStrategy = this._injector.internalStrategy;
            this._strategy = injectorStrategy instanceof injector_1.InjectorInlineStrategy ?
                new ElementDirectiveInlineStrategy(injectorStrategy, this) :
                new ElementDirectiveDynamicStrategy(injectorStrategy, this);
            this._strategy.init();
        }
        else {
            this._queryStrategy = null;
            this._injector = parentInjector;
            this._strategy = null;
        }
    }
    AppElement.getViewParentInjector = function (parentViewType, containerAppElement, imperativelyCreatedProviders, rootInjector) {
        var parentInjector;
        var hostInjectorBoundary;
        switch (parentViewType) {
            case view_type_1.ViewType.COMPONENT:
                parentInjector = containerAppElement._injector;
                hostInjectorBoundary = true;
                break;
            case view_type_1.ViewType.EMBEDDED:
                parentInjector = lang_1.isPresent(containerAppElement.proto.protoInjector) ?
                    containerAppElement._injector.parent :
                    containerAppElement._injector;
                hostInjectorBoundary = containerAppElement._injector.hostBoundary;
                break;
            case view_type_1.ViewType.HOST:
                if (lang_1.isPresent(containerAppElement)) {
                    // host view is attached to a container
                    parentInjector = lang_1.isPresent(containerAppElement.proto.protoInjector) ?
                        containerAppElement._injector.parent :
                        containerAppElement._injector;
                    if (lang_1.isPresent(imperativelyCreatedProviders)) {
                        var imperativeProvidersWithVisibility = imperativelyCreatedProviders.map(function (p) { return new injector_1.ProviderWithVisibility(p, injector_1.Visibility.Public); });
                        // The imperative injector is similar to having an element between
                        // the dynamic-loaded component and its parent => no boundary between
                        // the component and imperativelyCreatedInjector.
                        parentInjector = new di_1.Injector(new injector_1.ProtoInjector(imperativeProvidersWithVisibility), parentInjector, true, null, null);
                        hostInjectorBoundary = false;
                    }
                    else {
                        hostInjectorBoundary = containerAppElement._injector.hostBoundary;
                    }
                }
                else {
                    // bootstrap
                    parentInjector = rootInjector;
                    hostInjectorBoundary = true;
                }
                break;
        }
        return new InjectorWithHostBoundary(parentInjector, hostInjectorBoundary);
    };
    AppElement.prototype.attachComponentView = function (componentView) { this.componentView = componentView; };
    AppElement.prototype._debugContext = function () {
        var c = this.parentView.getDebugContext(this, null, null);
        return lang_1.isPresent(c) ? new _Context(c.element, c.componentElement, c.injector) : null;
    };
    AppElement.prototype.hasVariableBinding = function (name) {
        var vb = this.proto.directiveVariableBindings;
        return lang_1.isPresent(vb) && collection_1.StringMapWrapper.contains(vb, name);
    };
    AppElement.prototype.getVariableBinding = function (name) {
        var index = this.proto.directiveVariableBindings[name];
        return lang_1.isPresent(index) ? this.getDirectiveAtIndex(index) : this.getElementRef();
    };
    AppElement.prototype.get = function (token) { return this._injector.get(token); };
    AppElement.prototype.hasDirective = function (type) { return lang_1.isPresent(this._injector.getOptional(type)); };
    AppElement.prototype.getComponent = function () { return lang_1.isPresent(this._strategy) ? this._strategy.getComponent() : null; };
    AppElement.prototype.getInjector = function () { return this._injector; };
    AppElement.prototype.getElementRef = function () { return this.ref; };
    AppElement.prototype.getViewContainerRef = function () { return new view_container_ref_2.ViewContainerRef_(this); };
    AppElement.prototype.getTemplateRef = function () {
        if (lang_1.isPresent(this.embeddedViewFactory)) {
            return new template_ref_1.TemplateRef_(this.ref);
        }
        return null;
    };
    AppElement.prototype.getDependency = function (injector, provider, dep) {
        if (provider instanceof DirectiveProvider) {
            var dirDep = dep;
            if (lang_1.isPresent(dirDep.attributeName))
                return this._buildAttribute(dirDep);
            if (lang_1.isPresent(dirDep.queryDecorator))
                return this._queryStrategy.findQuery(dirDep.queryDecorator).list;
            if (dirDep.key.id === StaticKeys.instance().changeDetectorRefId) {
                // We provide the component's view change detector to components and
                // the surrounding component's change detector to directives.
                if (this.proto.firstProviderIsComponent) {
                    // Note: The component view is not yet created when
                    // this method is called!
                    return new _ComponentViewChangeDetectorRef(this);
                }
                else {
                    return this.parentView.changeDetector.ref;
                }
            }
            if (dirDep.key.id === StaticKeys.instance().elementRefId) {
                return this.getElementRef();
            }
            if (dirDep.key.id === StaticKeys.instance().viewContainerId) {
                return this.getViewContainerRef();
            }
            if (dirDep.key.id === StaticKeys.instance().templateRefId) {
                var tr = this.getTemplateRef();
                if (lang_1.isBlank(tr) && !dirDep.optional) {
                    throw new di_1.NoProviderError(null, dirDep.key);
                }
                return tr;
            }
            if (dirDep.key.id === StaticKeys.instance().rendererId) {
                return this.parentView.renderer;
            }
        }
        else if (provider instanceof pipe_provider_1.PipeProvider) {
            if (dep.key.id === StaticKeys.instance().changeDetectorRefId) {
                // We provide the component's view change detector to components and
                // the surrounding component's change detector to directives.
                if (this.proto.firstProviderIsComponent) {
                    // Note: The component view is not yet created when
                    // this method is called!
                    return new _ComponentViewChangeDetectorRef(this);
                }
                else {
                    return this.parentView.changeDetector;
                }
            }
        }
        return injector_1.UNDEFINED;
    };
    AppElement.prototype._buildAttribute = function (dep) {
        var attributes = this.proto.attributes;
        if (lang_1.isPresent(attributes) && collection_1.StringMapWrapper.contains(attributes, dep.attributeName)) {
            return attributes[dep.attributeName];
        }
        else {
            return null;
        }
    };
    AppElement.prototype.addDirectivesMatchingQuery = function (query, list) {
        var templateRef = this.getTemplateRef();
        if (query.selector === template_ref_1.TemplateRef && lang_1.isPresent(templateRef)) {
            list.push(templateRef);
        }
        if (this._strategy != null) {
            this._strategy.addDirectivesMatchingQuery(query, list);
        }
    };
    AppElement.prototype._buildQueryStrategy = function () {
        if (this.proto.protoQueryRefs.length === 0) {
            return _emptyQueryStrategy;
        }
        else if (this.proto.protoQueryRefs.length <=
            InlineQueryStrategy.NUMBER_OF_SUPPORTED_QUERIES) {
            return new InlineQueryStrategy(this);
        }
        else {
            return new DynamicQueryStrategy(this);
        }
    };
    AppElement.prototype.getDirectiveAtIndex = function (index) { return this._injector.getAt(index); };
    AppElement.prototype.ngAfterViewChecked = function () {
        if (lang_1.isPresent(this._queryStrategy))
            this._queryStrategy.updateViewQueries();
    };
    AppElement.prototype.ngAfterContentChecked = function () {
        if (lang_1.isPresent(this._queryStrategy))
            this._queryStrategy.updateContentQueries();
    };
    AppElement.prototype.traverseAndSetQueriesAsDirty = function () {
        var inj = this;
        while (lang_1.isPresent(inj)) {
            inj._setQueriesAsDirty();
            if (lang_1.isBlank(inj.parent) && inj.parentView.proto.type === view_type_1.ViewType.EMBEDDED) {
                inj = inj.parentView.containerAppElement;
            }
            else {
                inj = inj.parent;
            }
        }
    };
    AppElement.prototype._setQueriesAsDirty = function () {
        if (lang_1.isPresent(this._queryStrategy)) {
            this._queryStrategy.setContentQueriesAsDirty();
        }
        if (this.parentView.proto.type === view_type_1.ViewType.COMPONENT) {
            this.parentView.containerAppElement._queryStrategy.setViewQueriesAsDirty();
        }
    };
    return AppElement;
}());
exports.AppElement = AppElement;
var _EmptyQueryStrategy = (function () {
    function _EmptyQueryStrategy() {
    }
    _EmptyQueryStrategy.prototype.setContentQueriesAsDirty = function () { };
    _EmptyQueryStrategy.prototype.setViewQueriesAsDirty = function () { };
    _EmptyQueryStrategy.prototype.updateContentQueries = function () { };
    _EmptyQueryStrategy.prototype.updateViewQueries = function () { };
    _EmptyQueryStrategy.prototype.findQuery = function (query) {
        throw new exceptions_1.BaseException("Cannot find query for directive " + query + ".");
    };
    return _EmptyQueryStrategy;
}());
var _emptyQueryStrategy = new _EmptyQueryStrategy();
var InlineQueryStrategy = (function () {
    function InlineQueryStrategy(ei) {
        var protoRefs = ei.proto.protoQueryRefs;
        if (protoRefs.length > 0)
            this.query0 = new QueryRef(protoRefs[0], ei);
        if (protoRefs.length > 1)
            this.query1 = new QueryRef(protoRefs[1], ei);
        if (protoRefs.length > 2)
            this.query2 = new QueryRef(protoRefs[2], ei);
    }
    InlineQueryStrategy.prototype.setContentQueriesAsDirty = function () {
        if (lang_1.isPresent(this.query0) && !this.query0.isViewQuery)
            this.query0.dirty = true;
        if (lang_1.isPresent(this.query1) && !this.query1.isViewQuery)
            this.query1.dirty = true;
        if (lang_1.isPresent(this.query2) && !this.query2.isViewQuery)
            this.query2.dirty = true;
    };
    InlineQueryStrategy.prototype.setViewQueriesAsDirty = function () {
        if (lang_1.isPresent(this.query0) && this.query0.isViewQuery)
            this.query0.dirty = true;
        if (lang_1.isPresent(this.query1) && this.query1.isViewQuery)
            this.query1.dirty = true;
        if (lang_1.isPresent(this.query2) && this.query2.isViewQuery)
            this.query2.dirty = true;
    };
    InlineQueryStrategy.prototype.updateContentQueries = function () {
        if (lang_1.isPresent(this.query0) && !this.query0.isViewQuery) {
            this.query0.update();
        }
        if (lang_1.isPresent(this.query1) && !this.query1.isViewQuery) {
            this.query1.update();
        }
        if (lang_1.isPresent(this.query2) && !this.query2.isViewQuery) {
            this.query2.update();
        }
    };
    InlineQueryStrategy.prototype.updateViewQueries = function () {
        if (lang_1.isPresent(this.query0) && this.query0.isViewQuery) {
            this.query0.update();
        }
        if (lang_1.isPresent(this.query1) && this.query1.isViewQuery) {
            this.query1.update();
        }
        if (lang_1.isPresent(this.query2) && this.query2.isViewQuery) {
            this.query2.update();
        }
    };
    InlineQueryStrategy.prototype.findQuery = function (query) {
        if (lang_1.isPresent(this.query0) && this.query0.protoQueryRef.query === query) {
            return this.query0;
        }
        if (lang_1.isPresent(this.query1) && this.query1.protoQueryRef.query === query) {
            return this.query1;
        }
        if (lang_1.isPresent(this.query2) && this.query2.protoQueryRef.query === query) {
            return this.query2;
        }
        throw new exceptions_1.BaseException("Cannot find query for directive " + query + ".");
    };
    InlineQueryStrategy.NUMBER_OF_SUPPORTED_QUERIES = 3;
    return InlineQueryStrategy;
}());
var DynamicQueryStrategy = (function () {
    function DynamicQueryStrategy(ei) {
        this.queries = ei.proto.protoQueryRefs.map(function (p) { return new QueryRef(p, ei); });
    }
    DynamicQueryStrategy.prototype.setContentQueriesAsDirty = function () {
        for (var i = 0; i < this.queries.length; ++i) {
            var q = this.queries[i];
            if (!q.isViewQuery)
                q.dirty = true;
        }
    };
    DynamicQueryStrategy.prototype.setViewQueriesAsDirty = function () {
        for (var i = 0; i < this.queries.length; ++i) {
            var q = this.queries[i];
            if (q.isViewQuery)
                q.dirty = true;
        }
    };
    DynamicQueryStrategy.prototype.updateContentQueries = function () {
        for (var i = 0; i < this.queries.length; ++i) {
            var q = this.queries[i];
            if (!q.isViewQuery) {
                q.update();
            }
        }
    };
    DynamicQueryStrategy.prototype.updateViewQueries = function () {
        for (var i = 0; i < this.queries.length; ++i) {
            var q = this.queries[i];
            if (q.isViewQuery) {
                q.update();
            }
        }
    };
    DynamicQueryStrategy.prototype.findQuery = function (query) {
        for (var i = 0; i < this.queries.length; ++i) {
            var q = this.queries[i];
            if (q.protoQueryRef.query === query) {
                return q;
            }
        }
        throw new exceptions_1.BaseException("Cannot find query for directive " + query + ".");
    };
    return DynamicQueryStrategy;
}());
/**
 * Strategy used by the `ElementInjector` when the number of providers is 10 or less.
 * In such a case, inlining fields is beneficial for performances.
 */
var ElementDirectiveInlineStrategy = (function () {
    function ElementDirectiveInlineStrategy(injectorStrategy, _ei) {
        this.injectorStrategy = injectorStrategy;
        this._ei = _ei;
    }
    ElementDirectiveInlineStrategy.prototype.init = function () {
        var i = this.injectorStrategy;
        var p = i.protoStrategy;
        i.resetConstructionCounter();
        if (p.provider0 instanceof DirectiveProvider && lang_1.isPresent(p.keyId0) && i.obj0 === injector_1.UNDEFINED)
            i.obj0 = i.instantiateProvider(p.provider0, p.visibility0);
        if (p.provider1 instanceof DirectiveProvider && lang_1.isPresent(p.keyId1) && i.obj1 === injector_1.UNDEFINED)
            i.obj1 = i.instantiateProvider(p.provider1, p.visibility1);
        if (p.provider2 instanceof DirectiveProvider && lang_1.isPresent(p.keyId2) && i.obj2 === injector_1.UNDEFINED)
            i.obj2 = i.instantiateProvider(p.provider2, p.visibility2);
        if (p.provider3 instanceof DirectiveProvider && lang_1.isPresent(p.keyId3) && i.obj3 === injector_1.UNDEFINED)
            i.obj3 = i.instantiateProvider(p.provider3, p.visibility3);
        if (p.provider4 instanceof DirectiveProvider && lang_1.isPresent(p.keyId4) && i.obj4 === injector_1.UNDEFINED)
            i.obj4 = i.instantiateProvider(p.provider4, p.visibility4);
        if (p.provider5 instanceof DirectiveProvider && lang_1.isPresent(p.keyId5) && i.obj5 === injector_1.UNDEFINED)
            i.obj5 = i.instantiateProvider(p.provider5, p.visibility5);
        if (p.provider6 instanceof DirectiveProvider && lang_1.isPresent(p.keyId6) && i.obj6 === injector_1.UNDEFINED)
            i.obj6 = i.instantiateProvider(p.provider6, p.visibility6);
        if (p.provider7 instanceof DirectiveProvider && lang_1.isPresent(p.keyId7) && i.obj7 === injector_1.UNDEFINED)
            i.obj7 = i.instantiateProvider(p.provider7, p.visibility7);
        if (p.provider8 instanceof DirectiveProvider && lang_1.isPresent(p.keyId8) && i.obj8 === injector_1.UNDEFINED)
            i.obj8 = i.instantiateProvider(p.provider8, p.visibility8);
        if (p.provider9 instanceof DirectiveProvider && lang_1.isPresent(p.keyId9) && i.obj9 === injector_1.UNDEFINED)
            i.obj9 = i.instantiateProvider(p.provider9, p.visibility9);
    };
    ElementDirectiveInlineStrategy.prototype.getComponent = function () { return this.injectorStrategy.obj0; };
    ElementDirectiveInlineStrategy.prototype.isComponentKey = function (key) {
        return this._ei.proto.firstProviderIsComponent && lang_1.isPresent(key) &&
            key.id === this.injectorStrategy.protoStrategy.keyId0;
    };
    ElementDirectiveInlineStrategy.prototype.addDirectivesMatchingQuery = function (query, list) {
        var i = this.injectorStrategy;
        var p = i.protoStrategy;
        if (lang_1.isPresent(p.provider0) && p.provider0.key.token === query.selector) {
            if (i.obj0 === injector_1.UNDEFINED)
                i.obj0 = i.instantiateProvider(p.provider0, p.visibility0);
            list.push(i.obj0);
        }
        if (lang_1.isPresent(p.provider1) && p.provider1.key.token === query.selector) {
            if (i.obj1 === injector_1.UNDEFINED)
                i.obj1 = i.instantiateProvider(p.provider1, p.visibility1);
            list.push(i.obj1);
        }
        if (lang_1.isPresent(p.provider2) && p.provider2.key.token === query.selector) {
            if (i.obj2 === injector_1.UNDEFINED)
                i.obj2 = i.instantiateProvider(p.provider2, p.visibility2);
            list.push(i.obj2);
        }
        if (lang_1.isPresent(p.provider3) && p.provider3.key.token === query.selector) {
            if (i.obj3 === injector_1.UNDEFINED)
                i.obj3 = i.instantiateProvider(p.provider3, p.visibility3);
            list.push(i.obj3);
        }
        if (lang_1.isPresent(p.provider4) && p.provider4.key.token === query.selector) {
            if (i.obj4 === injector_1.UNDEFINED)
                i.obj4 = i.instantiateProvider(p.provider4, p.visibility4);
            list.push(i.obj4);
        }
        if (lang_1.isPresent(p.provider5) && p.provider5.key.token === query.selector) {
            if (i.obj5 === injector_1.UNDEFINED)
                i.obj5 = i.instantiateProvider(p.provider5, p.visibility5);
            list.push(i.obj5);
        }
        if (lang_1.isPresent(p.provider6) && p.provider6.key.token === query.selector) {
            if (i.obj6 === injector_1.UNDEFINED)
                i.obj6 = i.instantiateProvider(p.provider6, p.visibility6);
            list.push(i.obj6);
        }
        if (lang_1.isPresent(p.provider7) && p.provider7.key.token === query.selector) {
            if (i.obj7 === injector_1.UNDEFINED)
                i.obj7 = i.instantiateProvider(p.provider7, p.visibility7);
            list.push(i.obj7);
        }
        if (lang_1.isPresent(p.provider8) && p.provider8.key.token === query.selector) {
            if (i.obj8 === injector_1.UNDEFINED)
                i.obj8 = i.instantiateProvider(p.provider8, p.visibility8);
            list.push(i.obj8);
        }
        if (lang_1.isPresent(p.provider9) && p.provider9.key.token === query.selector) {
            if (i.obj9 === injector_1.UNDEFINED)
                i.obj9 = i.instantiateProvider(p.provider9, p.visibility9);
            list.push(i.obj9);
        }
    };
    return ElementDirectiveInlineStrategy;
}());
/**
 * Strategy used by the `ElementInjector` when the number of bindings is 11 or more.
 * In such a case, there are too many fields to inline (see ElementInjectorInlineStrategy).
 */
var ElementDirectiveDynamicStrategy = (function () {
    function ElementDirectiveDynamicStrategy(injectorStrategy, _ei) {
        this.injectorStrategy = injectorStrategy;
        this._ei = _ei;
    }
    ElementDirectiveDynamicStrategy.prototype.init = function () {
        var inj = this.injectorStrategy;
        var p = inj.protoStrategy;
        inj.resetConstructionCounter();
        for (var i = 0; i < p.keyIds.length; i++) {
            if (p.providers[i] instanceof DirectiveProvider && lang_1.isPresent(p.keyIds[i]) &&
                inj.objs[i] === injector_1.UNDEFINED) {
                inj.objs[i] = inj.instantiateProvider(p.providers[i], p.visibilities[i]);
            }
        }
    };
    ElementDirectiveDynamicStrategy.prototype.getComponent = function () { return this.injectorStrategy.objs[0]; };
    ElementDirectiveDynamicStrategy.prototype.isComponentKey = function (key) {
        var p = this.injectorStrategy.protoStrategy;
        return this._ei.proto.firstProviderIsComponent && lang_1.isPresent(key) && key.id === p.keyIds[0];
    };
    ElementDirectiveDynamicStrategy.prototype.addDirectivesMatchingQuery = function (query, list) {
        var ist = this.injectorStrategy;
        var p = ist.protoStrategy;
        for (var i = 0; i < p.providers.length; i++) {
            if (p.providers[i].key.token === query.selector) {
                if (ist.objs[i] === injector_1.UNDEFINED) {
                    ist.objs[i] = ist.instantiateProvider(p.providers[i], p.visibilities[i]);
                }
                list.push(ist.objs[i]);
            }
        }
    };
    return ElementDirectiveDynamicStrategy;
}());
var ProtoQueryRef = (function () {
    function ProtoQueryRef(dirIndex, setter, query) {
        this.dirIndex = dirIndex;
        this.setter = setter;
        this.query = query;
    }
    Object.defineProperty(ProtoQueryRef.prototype, "usesPropertySyntax", {
        get: function () { return lang_1.isPresent(this.setter); },
        enumerable: true,
        configurable: true
    });
    return ProtoQueryRef;
}());
exports.ProtoQueryRef = ProtoQueryRef;
var QueryRef = (function () {
    function QueryRef(protoQueryRef, originator) {
        this.protoQueryRef = protoQueryRef;
        this.originator = originator;
        this.list = new query_list_1.QueryList();
        this.dirty = true;
    }
    Object.defineProperty(QueryRef.prototype, "isViewQuery", {
        get: function () { return this.protoQueryRef.query.isViewQuery; },
        enumerable: true,
        configurable: true
    });
    QueryRef.prototype.update = function () {
        if (!this.dirty)
            return;
        this._update();
        this.dirty = false;
        // TODO delete the check once only field queries are supported
        if (this.protoQueryRef.usesPropertySyntax) {
            var dir = this.originator.getDirectiveAtIndex(this.protoQueryRef.dirIndex);
            if (this.protoQueryRef.query.first) {
                this.protoQueryRef.setter(dir, this.list.length > 0 ? this.list.first : null);
            }
            else {
                this.protoQueryRef.setter(dir, this.list);
            }
        }
        this.list.notifyOnChanges();
    };
    QueryRef.prototype._update = function () {
        var aggregator = [];
        if (this.protoQueryRef.query.isViewQuery) {
            // intentionally skipping originator for view queries.
            var nestedView = this.originator.componentView;
            if (lang_1.isPresent(nestedView))
                this._visitView(nestedView, aggregator);
        }
        else {
            this._visit(this.originator, aggregator);
        }
        this.list.reset(aggregator);
    };
    ;
    QueryRef.prototype._visit = function (inj, aggregator) {
        var view = inj.parentView;
        var startIdx = inj.proto.index;
        for (var i = startIdx; i < view.appElements.length; i++) {
            var curInj = view.appElements[i];
            // The first injector after inj, that is outside the subtree rooted at
            // inj has to have a null parent or a parent that is an ancestor of inj.
            if (i > startIdx && (lang_1.isBlank(curInj.parent) || curInj.parent.proto.index < startIdx)) {
                break;
            }
            if (!this.protoQueryRef.query.descendants &&
                !(curInj.parent == this.originator || curInj == this.originator))
                continue;
            // We visit the view container(VC) views right after the injector that contains
            // the VC. Theoretically, that might not be the right order if there are
            // child injectors of said injector. Not clear whether if such case can
            // even be constructed with the current apis.
            this._visitInjector(curInj, aggregator);
            this._visitViewContainerViews(curInj.nestedViews, aggregator);
        }
    };
    QueryRef.prototype._visitInjector = function (inj, aggregator) {
        if (this.protoQueryRef.query.isVarBindingQuery) {
            this._aggregateVariableBinding(inj, aggregator);
        }
        else {
            this._aggregateDirective(inj, aggregator);
        }
    };
    QueryRef.prototype._visitViewContainerViews = function (views, aggregator) {
        if (lang_1.isPresent(views)) {
            for (var j = 0; j < views.length; j++) {
                this._visitView(views[j], aggregator);
            }
        }
    };
    QueryRef.prototype._visitView = function (view, aggregator) {
        for (var i = 0; i < view.appElements.length; i++) {
            var inj = view.appElements[i];
            this._visitInjector(inj, aggregator);
            this._visitViewContainerViews(inj.nestedViews, aggregator);
        }
    };
    QueryRef.prototype._aggregateVariableBinding = function (inj, aggregator) {
        var vb = this.protoQueryRef.query.varBindings;
        for (var i = 0; i < vb.length; ++i) {
            if (inj.hasVariableBinding(vb[i])) {
                aggregator.push(inj.getVariableBinding(vb[i]));
            }
        }
    };
    QueryRef.prototype._aggregateDirective = function (inj, aggregator) {
        inj.addDirectivesMatchingQuery(this.protoQueryRef.query, aggregator);
    };
    return QueryRef;
}());
exports.QueryRef = QueryRef;
var _ComponentViewChangeDetectorRef = (function (_super) {
    __extends(_ComponentViewChangeDetectorRef, _super);
    function _ComponentViewChangeDetectorRef(_appElement) {
        _super.call(this);
        this._appElement = _appElement;
    }
    _ComponentViewChangeDetectorRef.prototype.markForCheck = function () { this._appElement.componentView.changeDetector.ref.markForCheck(); };
    _ComponentViewChangeDetectorRef.prototype.detach = function () { this._appElement.componentView.changeDetector.ref.detach(); };
    _ComponentViewChangeDetectorRef.prototype.detectChanges = function () { this._appElement.componentView.changeDetector.ref.detectChanges(); };
    _ComponentViewChangeDetectorRef.prototype.checkNoChanges = function () { this._appElement.componentView.changeDetector.ref.checkNoChanges(); };
    _ComponentViewChangeDetectorRef.prototype.reattach = function () { this._appElement.componentView.changeDetector.ref.reattach(); };
    return _ComponentViewChangeDetectorRef;
}(change_detection_1.ChangeDetectorRef));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWxlbWVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRpZmZpbmdfcGx1Z2luX3dyYXBwZXItb3V0cHV0X3BhdGgtamFrWG5NbUwudG1wL2FuZ3VsYXIyL3NyYy9jb3JlL2xpbmtlci9lbGVtZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLHFCQU9PLDBCQUEwQixDQUFDLENBQUE7QUFDbEMsMkJBQTRCLGdDQUFnQyxDQUFDLENBQUE7QUFDN0QsMkJBQXdELGdDQUFnQyxDQUFDLENBQUE7QUFDekYsbUJBWU8sc0JBQXNCLENBQUMsQ0FBQTtBQUM5Qix5QkFBcUMsK0JBQStCLENBQUMsQ0FBQTtBQUNyRSx5QkFRTywrQkFBK0IsQ0FBQyxDQUFBO0FBQ3ZDLHlCQUFrRSwrQkFBK0IsQ0FBQyxDQUFBO0FBRWxHLG1CQUErQyxnQkFBZ0IsQ0FBQyxDQUFBO0FBR2hFLDBCQUF1QixhQUFhLENBQUMsQ0FBQTtBQUNyQyw0QkFBMEIsZUFBZSxDQUFDLENBQUE7QUFFMUMsbUNBQStCLHNCQUFzQixDQUFDLENBQUE7QUFDdEQsNEJBQXlCLGVBQWUsQ0FBQyxDQUFBO0FBQ3pDLG9CQUF1Qiw4QkFBOEIsQ0FBQyxDQUFBO0FBQ3RELDZCQUF3QyxnQkFBZ0IsQ0FBQyxDQUFBO0FBQ3pELDJCQUFtRCx3QkFBd0IsQ0FBQyxDQUFBO0FBQzVFLGlDQUdPLHFEQUFxRCxDQUFDLENBQUE7QUFDN0QsMkJBQXdCLGNBQWMsQ0FBQyxDQUFBO0FBQ3ZDLDJCQUF3Qix5Q0FBeUMsQ0FBQyxDQUFBO0FBR2xFLDhCQUEyQix1Q0FBdUMsQ0FBQyxDQUFBO0FBRW5FLG1DQUFnQyxzQkFBc0IsQ0FBQyxDQUFBO0FBR3ZELElBQUksV0FBVyxDQUFDO0FBRWhCO0lBT0U7UUFDRSxJQUFJLENBQUMsYUFBYSxHQUFHLFFBQUcsQ0FBQyxHQUFHLENBQUMsMEJBQVcsQ0FBQyxDQUFDLEVBQUUsQ0FBQztRQUM3QyxJQUFJLENBQUMsZUFBZSxHQUFHLFFBQUcsQ0FB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QUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztZQUN2RCxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQ3ZCLENBQUM7UUFDRCxFQUFFLENBQUMsQ0FBQyxnQkFBUyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztZQUN2RCxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQ3ZCLENBQUM7UUFDRCxFQUFFLENBQUMsQ0FBQyxnQkFBUyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztZQUN2RCxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQ3ZCLENBQUM7SUFDSCxDQUFDO0lBRUQsK0NBQWlCLEdBQWpCO1FBQ0UsRUFBRSxDQUFDLENBQUMsZ0JBQVMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO1lBQ3RELElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDdkIsQ0FBQztRQUNELEVBQUUsQ0FBQyxDQUFDLGdCQUFTLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztZQUN0RCxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQ3ZCLENBQUM7UUFDRCxFQUFFLENBQUMsQ0FBQyxnQkFBUyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7WUFDdEQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUN2QixD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Q0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxLQUFLLG9CQUFTLENBQUM7WUFDMUYsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDN0QsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsWUFBWSxpQkFBaUIsSUFBSSxnQkFBUyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxLQUFLLG9CQUFTLENBQUM7WUFDMUYsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDN0QsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsWUFBWSxpQkFBaUIsSUFBSSxnQkFBUyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxLQUFLLG9CQUFTLENBQUM7WUFDMUYsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDN0QsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsWUFBWSxpQkFBaUIsSUFBSSxnQkFBUyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxLQUFLLG9CQUFTLENBQUM7WUFDMUYsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDN0QsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsWUFBWSxpQkFBaUIsSUFBSSxnQkFBUyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxLQUFLLG9CQUFTLENBQUM7WUFDMUYsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDN0QsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsWUFBWSxpQkFBaUIsSUFBSSxnQkFBUyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxLQUFLLG9CQUFTLENBQUM7WUFDMUYsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDN0QsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsWUFBWSxpQkFBaUIsSUFBSSxnQkFBUyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxLQUFLLG9CQUFTLENBQUM7WUFDMUYsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDN0QsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsWUFBWSxpQkFBaUIsSUFBSSxnQkFBUyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxLQUFLLG9CQUFTLENBQUM7WUFDMUYsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDN0QsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsWUFBWSxpQkFBaUIsSUFBSSxnQkFBUyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxLQUFLLG9CQUFTLENBQUM7WUFDMUYsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDN0QsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsWUFBWSxpQkFBaUIsSUFBSSxnQkFBUyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxLQUFLLG9CQUFTLENBQUM7WUFDMUYsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUM7SUFDL0QsQ0FBQztJQUVELHFEQUFZLEdBQVosY0FBc0IsTUFBTSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBRTFELHVEQUFjLEdBQWQsVUFBZSxHQUFRO1FBQ3JCLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyx3QkFBd0IsSUFBSSxnQkFBUyxDQUFDLEdBQUcsQ0FBQztZQUN6RCxHQUFHLENBQUMsRUFBRSxLQUFLLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDO0lBQy9ELENBQUM7SUFFRCxtRUFBMEIsR0FBMUIsVUFBMkIsS0FBb0IsRUFBRSxJQUFXO1FBQzFELElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQztRQUM5QixJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsYUFBYSxDQUFDO1FBQ3hCLEVBQUUsQ0FBQyxDQUFDLGdCQUFTLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLEtBQUssS0FBSyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztZQUN2RSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxLQUFLLG9CQUFTLENBQUM7Z0JBQUMsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUM7WUFDckYsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDcEIsQ0FBQztRQUNELEVBQUUsQ0FBQyxDQUFDLGdCQUFTLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLEtBQUssS0FBSyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztZQUN2RSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxLQUFLLG9CQUFTLENBQUM7Z0JBQUMsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUM7WUFDckYsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDcEIsQ0FBQztRQUNELEVBQUUsQ0FBQyxDQUFDLGdCQUFTLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLEtBQUssS0FBSyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztZQUN2RSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxLQUFLLG9CQUFTLENBQUM7Z0JBQUMsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUM7WUFDckYsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDcEIsQ0FBQztRQUNELEVBQUUsQ0FBQyxDQUFDLGdCQUFTLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLEtBQUssS0FBSyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztZQUN2RSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxLQUFLLG9CQUFTLENBQUM7Z0JBQUMsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUM7WUFDckYsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDcEIsQ0FBQztRQUNELEVBQUUsQ0FBQyxDQUFDLGdCQUFTLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLEtBQUssS0FBSyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztZQUN2RSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxLQUFLLG9CQUFTLENBQUM7Z0JBQUMsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUM7WUFDckYsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDcEIsQ0FBQztRQUNELEVBQUUsQ0FBQyxDQUFDLGdCQUFTLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLEtBQUssS0FBSyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztZQUN2RSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxLQUFLLG9CQUFTLENBQUM7Z0JBQUMsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUM7WUFDckYsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDcEIsQ0FBQztRQUNELEVBQUUsQ0FBQyxDQUFDLGdCQUFTLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLEtBQUssS0FBSyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztZQUN2RSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxLQUFLLG9CQUFTLENBQUM7Z0JBQUMsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUM7WUFDckYsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDcEIsQ0FBQztRQUNELEVBQUUsQ0FBQyxDQUFDLGdCQUFTLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLEtBQUssS0FBSyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztZQUN2RSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxLQUFLLG9CQUFTLENBQUM7Z0JBQUMsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUM7WUFDckYsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDcEIsQ0FBQztRQUNELEVBQUUsQ0FBQyxDQUFDLGdCQUFTLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLEtBQUssS0FBSyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztZQUN2RSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxLQUFLLG9CQUFTLENBQUM7Z0JBQUMsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUM7WUFDckYsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDcEIsQ0FBQztRQUNELEVBQUUsQ0FBQyxDQUFDLGdCQUFTLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLEtBQUssS0FBSyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztZQUN2RSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxLQUFLLG9CQUFTLENBQUM7Z0JBQUMsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUM7WUFDckYsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDcEIsQ0FBQztJQUNILENBQUM7SUFDSCxxQ0FBQztBQUFELENBQUMsQUFqRkQsSUFpRkM7QUFFRDs7O0dBR0c7QUFDSDtJQUNFLHlDQUFtQixnQkFBeUMsRUFBUyxHQUFlO1FBQWpFLHFCQUFnQixHQUFoQixnQkFBZ0IsQ0FBeUI7UUFBUyxRQUFHLEdBQUgsR0FBRyxDQUFZO0lBQUcsQ0FBQztJQUV4Riw4Q0FBSSxHQUFKO1FBQ0UsSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDO1FBQ2hDLElBQUksQ0FBQyxHQUFHLEdBQUcsQ0FBQyxhQUFhLENBQUM7UUFDMUIsR0FBRyxDQUFDLHdCQUF3QixFQUFFLENBQUM7UUFFL0IsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO1lBQ3pDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLFlBQVksaUJBQWlCLElBQUksZ0JBQVMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNyRSxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLG9CQUFTLENBQUMsQ0FBQyxDQUFDO2dCQUM5QixHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUMzRSxDQUFDO1FBQ0gsQ0FBQztJQUNILENBQUM7SUFFRCxzREFBWSxHQUFaLGNBQXNCLE1BQU0sQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUU3RCx3REFBYyxHQUFkLFVBQWUsR0FBUTtRQUNyQixJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsYUFBYSxDQUFDO1FBQzVDLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyx3QkFBd0IsSUFBSSxnQkFBUyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM3RixDQUFDO0lBRUQsb0VBQTBCLEdBQTFCLFVBQTJCLEtBQW9CLEVBQUUsSUFBVztRQUMxRCxJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUM7UUFDaEMsSUFBSSxDQUFDLEdBQUcsR0FBRyxDQUFDLGFBQWEsQ0FBQztRQUUxQixHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7WUFDNUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSyxLQUFLLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO2dCQUNoRCxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLG9CQUFTLENBQUMsQ0FBQyxDQUFDO29CQUM5QixHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDM0UsQ0FBQztnQkFDRCxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN6QixDQUFDO1FBQ0gsQ0FBQztJQUNILENBQUM7SUFDSCxzQ0FBQztBQUFELENBQUMsQUFwQ0QsSUFvQ0M7QUFFRDtJQUNFLHVCQUFtQixRQUFnQixFQUFTLE1BQWdCLEVBQVMsS0FBb0I7UUFBdEUsYUFBUSxHQUFSLFFBQVEsQ0FBUTtRQUFTLFdBQU0sR0FBTixNQUFNLENBQVU7UUFBUyxVQUFLLEdBQUwsS0FBSyxDQUFlO0lBQUcsQ0FBQztJQUU3RixzQkFBSSw2Q0FBa0I7YUFBdEIsY0FBb0MsTUFBTSxDQUFDLGdCQUFTLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQzs7O09BQUE7SUFDdEUsb0JBQUM7QUFBRCxDQUFDLEFBSkQsSUFJQztBQUpZLHFCQUFhLGdCQUl6QixDQUFBO0FBRUQ7SUFJRSxrQkFBbUIsYUFBNEIsRUFBVSxVQUFzQjtRQUE1RCxrQkFBYSxHQUFiLGFBQWEsQ0FBZTtRQUFVLGVBQVUsR0FBVixVQUFVLENBQVk7UUFDN0UsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLHNCQUFTLEVBQU8sQ0FBQztRQUNqQyxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztJQUNwQixDQUFDO0lBRUQsc0JBQUksaUNBQVc7YUFBZixjQUE2QixNQUFNLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQzs7O09BQUE7SUFFM0UseUJBQU0sR0FBTjtRQUNFLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQztZQUFDLE1BQU0sQ0FBQztRQUN4QixJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDZixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztRQUVuQiw4REFBOEQ7UUFDOUQsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLENBQUM7WUFDMUMsSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQzNFLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7Z0JBQ25DLElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLENBQUM7WUFDaEYsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNOLElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDNUMsQ0FBQztRQUNILENBQUM7UUFFRCxJQUFJLENBQUMsSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDO0lBQzlCLENBQUM7SUFFTywwQkFBTyxHQUFmO1FBQ0UsSUFBSSxVQUFVLEdBQUcsRUFBRSxDQUFDO1FBQ3BCLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7WUFDekMsc0RBQXNEO1lBQ3RELElBQUksVUFBVSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUFDO1lBQy9DLEVBQUUsQ0FBQyxDQUFDLGdCQUFTLENBQUMsVUFBVSxDQUFDLENBQUM7Z0JBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxVQUFVLEVBQUUsVUFBVSxDQUFDLENBQUM7UUFDckUsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ04sSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBQzNDLENBQUM7UUFDRCxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUM5QixDQUFDOztJQUVPLHlCQUFNLEdBQWQsVUFBZSxHQUFlLEVBQUUsVUFBaUI7UUFDL0MsSUFBSSxJQUFJLEdBQUcsR0FBRyxDQUFDLFVBQVUsQ0FBQztRQUMxQixJQUFJLFFBQVEsR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQztRQUMvQixHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxRQUFRLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7WUFDeEQsSUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNqQyxzRUFBc0U7WUFDdEUsd0VBQXdFO1lBQ3hFLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxRQUFRLElBQUksQ0FBQyxjQUFPLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLE1BQU0sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3JGLEtBQUssQ0FBQztZQUNSLENBQUM7WUFFRCxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLFdBQVc7Z0JBQ3JDLENBQUMsQ0FBQyxNQUFNLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxVQUFVLElBQUksTUFBTSxJQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztnQkFDbkUsUUFBUSxDQUFDO1lBRVgsK0VBQStFO1lBQy9FLHdFQUF3RTtZQUN4RSx1RUFBdUU7WUFDdkUsNkNBQTZDO1lBQzdDLElBQUksQ0FBQyxjQUFjLENBQUMsTUFBTSxFQUFFLFVBQVUsQ0FBQyxDQUFDO1lBQ3hDLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxNQUFNLENBQUMsV0FBVyxFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBQ2hFLENBQUM7SUFDSCxDQUFDO0lBRU8saUNBQWMsR0FBdEIsVUFBdUIsR0FBZSxFQUFFLFVBQWlCO1FBQ3ZELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQztZQUMvQyxJQUFJLENBQUMseUJBQXlCLENBQUMsR0FBRyxFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBQ2xELENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNOLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxHQUFHLEVBQUUsVUFBVSxDQUFDLENBQUM7UUFDNUMsQ0FBQztJQUNILENBQUM7SUFFTywyQ0FBd0IsR0FBaEMsVUFBaUMsS0FBZ0IsRUFBRSxVQUFpQjtRQUNsRSxFQUFFLENBQUMsQ0FBQyxnQkFBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNyQixHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztnQkFDdEMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsVUFBVSxDQUFDLENBQUM7WUFDeEMsQ0FBQztRQUNILENBQUM7SUFDSCxDQUFDO0lBRU8sNkJBQVUsR0FBbEIsVUFBbUIsSUFBYSxFQUFFLFVBQWlCO1FBQ2pELEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztZQUNqRCxJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzlCLElBQUksQ0FBQyxjQUFjLENBQUMsR0FBRyxFQUFFLFVBQVUsQ0FBQyxDQUFDO1lBQ3JDLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxHQUFHLENBQUMsV0FBVyxFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBQzdELENBQUM7SUFDSCxDQUFDO0lBRU8sNENBQXlCLEdBQWpDLFVBQWtDLEdBQWUsRUFBRSxVQUFpQjtRQUNsRSxJQUFJLEVBQUUsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUM7UUFDOUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUM7WUFDbkMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLGtCQUFrQixDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDbEMsVUFBVSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsa0JBQWtCLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNqRCxDQUFDO1FBQ0gsQ0FBQztJQUNILENBQUM7SUFFTyxzQ0FBbUIsR0FBM0IsVUFBNEIsR0FBZSxFQUFFLFVBQWlCO1FBQzVELEdBQUcsQ0FBQywwQkFBMEIsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLEtBQUssRUFBRSxVQUFVLENBQUMsQ0FBQztJQUN2RSxDQUFDO0lBQ0gsZUFBQztBQUFELENBQUMsQUFyR0QsSUFxR0M7QUFyR1ksZ0JBQVEsV0FxR3BCLENBQUE7QUFFRDtJQUE4QyxtREFBaUI7SUFDN0QseUNBQW9CLFdBQXVCO1FBQUksaUJBQU8sQ0FBQztRQUFuQyxnQkFBVyxHQUFYLFdBQVcsQ0FBWTtJQUFhLENBQUM7SUFFekQsc0RBQVksR0FBWixjQUF1QixJQUFJLENBQUMsV0FBVyxDQUFDLGFBQWEsQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLFlBQVksRUFBRSxDQUFDLENBQUMsQ0FBQztJQUMxRixnREFBTSxHQUFOLGNBQWlCLElBQUksQ0FBQyxXQUFXLENBQUMsYUFBYSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQzlFLHVEQUFhLEdBQWIsY0FBd0IsSUFBSSxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxhQUFhLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDNUYsd0RBQWMsR0FBZCxjQUF5QixJQUFJLENBQUMsV0FBVyxDQUFDLGFBQWEsQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLGNBQWMsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUM5RixrREFBUSxHQUFSLGNBQW1CLElBQUksQ0FBQyxXQUFXLENBQUMsYUFBYSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQ3BGLHNDQUFDO0FBQUQsQ0FBQyxBQVJELENBQThDLG9DQUFpQixHQVE5RCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIGlzUHJlc2VudCxcbiAgaXNCbGFuayxcbiAgVHlwZSxcbiAgc3RyaW5naWZ5LFxuICBDT05TVF9FWFBSLFxuICBTdHJpbmdXcmFwcGVyXG59IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvbGFuZyc7XG5pbXBvcnQge0Jhc2VFeGNlcHRpb259IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvZXhjZXB0aW9ucyc7XG5pbXBvcnQge0xpc3RXcmFwcGVyLCBNYXBXcmFwcGVyLCBTdHJpbmdNYXBXcmFwcGVyfSBmcm9tICdhbmd1bGFyMi9zcmMvZmFjYWRlL2NvbGxlY3Rpb24nO1xuaW1wb3J0IHtcbiAgSW5qZWN0b3IsXG4gIEtleSxcbiAgRGVwZW5kZW5jeSxcbiAgcHJvdmlkZSxcbiAgUHJvdmlkZXIsXG4gIFJlc29sdmVkUHJvdmlkZXIsXG4gIE5vUHJvdmlkZXJFcnJvcixcbiAgQWJzdHJhY3RQcm92aWRlckVycm9yLFxuICBDeWNsaWNEZXBlbmRlbmN5RXJyb3IsXG4gIHJlc29sdmVGb3J3YXJkUmVmLFxuICBJbmplY3RhYmxlXG59IGZyb20gJ2FuZ3VsYXIyL3NyYy9jb3JlL2RpJztcbmltcG9ydCB7bWVyZ2VSZXNvbHZlZFByb3ZpZGVyc30gZnJvbSAnYW5ndWxhcjIvc3JjL2NvcmUvZGkvcHJvdmlkZXInO1xuaW1wb3J0IHtcbiAgVU5ERUZJTkVELFxuICBQcm90b0luamVjdG9yLFxuICBWaXNpYmlsaXR5LFxuICBJbmplY3RvcklubGluZVN0cmF0ZWd5LFxuICBJbmplY3RvckR5bmFtaWNTdHJhdGVneSxcbiAgUHJvdmlkZXJXaXRoVmlzaWJpbGl0eSxcbiAgRGVwZW5kZW5jeVByb3ZpZGVyXG59IGZyb20gJ2FuZ3VsYXIyL3NyYy9jb3JlL2RpL2luamVjdG9yJztcbmltcG9ydCB7cmVzb2x2ZVByb3ZpZGVyLCBSZXNvbHZlZEZhY3RvcnksIFJlc29sdmVkUHJvdmlkZXJffSBmcm9tICdhbmd1bGFyMi9zcmMvY29yZS9kaS9wcm92aWRlcic7XG5cbmltcG9ydCB7QXR0cmlidXRlTWV0YWRhdGEsIFF1ZXJ5TWV0YWRhdGF9IGZyb20gJy4uL21ldGFkYXRhL2RpJztcblxuaW1wb3J0IHtBcHBWaWV3fSBmcm9tICcuL3ZpZXcnO1xuaW1wb3J0IHtWaWV3VHlwZX0gZnJvbSAnLi92aWV3X3R5cGUnO1xuaW1wb3J0IHtFbGVtZW50UmVmX30gZnJvbSAnLi9lbGVtZW50X3JlZic7XG5cbmltcG9ydCB7Vmlld0NvbnRhaW5lclJlZn0gZnJvbSAnLi92aWV3X2NvbnRhaW5lcl9yZWYnO1xuaW1wb3J0IHtFbGVtZW50UmVmfSBmcm9tICcuL2VsZW1lbnRfcmVmJztcbmltcG9ydCB7UmVuZGVyZXJ9IGZyb20gJ2FuZ3VsYXIyL3NyYy9jb3JlL3JlbmRlci9hcGknO1xuaW1wb3J0IHtUZW1wbGF0ZVJlZiwgVGVtcGxhdGVSZWZffSBmcm9tICcuL3RlbXBsYXRlX3JlZic7XG5pbXBvcnQge0RpcmVjdGl2ZU1ldGFkYXRhLCBDb21wb25lbnRNZXRhZGF0YX0gZnJvbSAnLi4vbWV0YWRhdGEvZGlyZWN0aXZlcyc7XG5pbXBvcnQge1xuICBDaGFuZ2VEZXRlY3RvcixcbiAgQ2hhbmdlRGV0ZWN0b3JSZWZcbn0gZnJvbSAnYW5ndWxhcjIvc3JjL2NvcmUvY2hhbmdlX2RldGVjdGlvbi9jaGFuZ2VfZGV0ZWN0aW9uJztcbmltcG9ydCB7UXVlcnlMaXN0fSBmcm9tICcuL3F1ZXJ5X2xpc3QnO1xuaW1wb3J0IHtyZWZsZWN0b3J9IGZyb20gJ2FuZ3VsYXIyL3NyYy9jb3JlL3JlZmxlY3Rpb24vcmVmbGVjdGlvbic7XG5pbXBvcnQge1NldHRlckZufSBmcm9tICdhbmd1bGFyMi9zcmMvY29yZS9yZWZsZWN0aW9uL3R5cGVzJztcbmltcG9ydCB7QWZ0ZXJWaWV3Q2hlY2tlZH0gZnJvbSAnYW5ndWxhcjIvc3JjL2NvcmUvbGlua2VyL2ludGVyZmFjZXMnO1xuaW1wb3J0IHtQaXBlUHJvdmlkZXJ9IGZyb20gJ2FuZ3VsYXIyL3NyYy9jb3JlL3BpcGVzL3BpcGVfcHJvdmlkZXInO1xuXG5pbXBvcnQge1ZpZXdDb250YWluZXJSZWZffSBmcm9tIFwiLi92aWV3X2NvbnRhaW5lcl9yZWZcIjtcbmltcG9ydCB7UmVzb2x2ZWRNZXRhZGF0YUNhY2hlfSBmcm9tICcuL3Jlc29sdmVkX21ldGFkYXRhX2NhY2hlJztcblxudmFyIF9zdGF0aWNLZXlzO1xuXG5leHBvcnQgY2xhc3MgU3RhdGljS2V5cyB7XG4gIHRlbXBsYXRlUmVmSWQ6IG51bWJlcjtcbiAgdmlld0NvbnRhaW5lcklkOiBudW1iZXI7XG4gIGNoYW5nZURldGVjdG9yUmVmSWQ6IG51bWJlcjtcbiAgZWxlbWVudFJlZklkOiBudW1iZXI7XG4gIHJlbmRlcmVySWQ6IG51bWJlcjtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnRlbXBsYXRlUmVmSWQgPSBLZXkuZ2V0KFRlbXBsYXRlUmVmKS5pZDtcbiAgICB0aGlzLnZpZXdDb250YWluZXJJZCA9IEtleS5nZXQoVmlld0NvbnRhaW5lclJlZikuaWQ7XG4gICAgdGhpcy5jaGFuZ2VEZXRlY3RvclJlZklkID0gS2V5LmdldChDaGFuZ2VEZXRlY3RvclJlZikuaWQ7XG4gICAgdGhpcy5lbGVtZW50UmVmSWQgPSBLZXkuZ2V0KEVsZW1lbnRSZWYpLmlkO1xuICAgIHRoaXMucmVuZGVyZXJJZCA9IEtleS5nZXQoUmVuZGVyZXIpLmlkO1xuICB9XG5cbiAgc3RhdGljIGluc3RhbmNlKCk6IFN0YXRpY0tleXMge1xuICAgIGlmIChpc0JsYW5rKF9zdGF0aWNLZXlzKSkgX3N0YXRpY0tleXMgPSBuZXcgU3RhdGljS2V5cygpO1xuICAgIHJldHVybiBfc3RhdGljS2V5cztcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgRGlyZWN0aXZlRGVwZW5kZW5jeSBleHRlbmRzIERlcGVuZGVuY3kge1xuICBjb25zdHJ1Y3RvcihrZXk6IEtleSwgb3B0aW9uYWw6IGJvb2xlYW4sIGxvd2VyQm91bmRWaXNpYmlsaXR5OiBPYmplY3QsXG4gICAgICAgICAgICAgIHVwcGVyQm91bmRWaXNpYmlsaXR5OiBPYmplY3QsIHByb3BlcnRpZXM6IGFueVtdLCBwdWJsaWMgYXR0cmlidXRlTmFtZTogc3RyaW5nLFxuICAgICAgICAgICAgICBwdWJsaWMgcXVlcnlEZWNvcmF0b3I6IFF1ZXJ5TWV0YWRhdGEpIHtcbiAgICBzdXBlcihrZXksIG9wdGlvbmFsLCBsb3dlckJvdW5kVmlzaWJpbGl0eSwgdXBwZXJCb3VuZFZpc2liaWxpdHksIHByb3BlcnRpZXMpO1xuICAgIHRoaXMuX3ZlcmlmeSgpO1xuICB9XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfdmVyaWZ5KCk6IHZvaWQge1xuICAgIHZhciBjb3VudCA9IDA7XG4gICAgaWYgKGlzUHJlc2VudCh0aGlzLnF1ZXJ5RGVjb3JhdG9yKSkgY291bnQrKztcbiAgICBpZiAoaXNQcmVzZW50KHRoaXMuYXR0cmlidXRlTmFtZSkpIGNvdW50Kys7XG4gICAgaWYgKGNvdW50ID4gMSlcbiAgICAgIHRocm93IG5ldyBCYXNlRXhjZXB0aW9uKFxuICAgICAgICAgICdBIGRpcmVjdGl2ZSBpbmplY3RhYmxlIGNhbiBjb250YWluIG9ubHkgb25lIG9mIHRoZSBmb2xsb3dpbmcgQEF0dHJpYnV0ZSBvciBAUXVlcnkuJyk7XG4gIH1cblxuICBzdGF0aWMgY3JlYXRlRnJvbShkOiBEZXBlbmRlbmN5KTogRGlyZWN0aXZlRGVwZW5kZW5jeSB7XG4gICAgcmV0dXJuIG5ldyBEaXJlY3RpdmVEZXBlbmRlbmN5KFxuICAgICAgICBkLmtleSwgZC5vcHRpb25hbCwgZC5sb3dlckJvdW5kVmlzaWJpbGl0eSwgZC51cHBlckJvdW5kVmlzaWJpbGl0eSwgZC5wcm9wZXJ0aWVzLFxuICAgICAgICBEaXJlY3RpdmVEZXBlbmRlbmN5Ll9hdHRyaWJ1dGVOYW1lKGQucHJvcGVydGllcyksIERpcmVjdGl2ZURlcGVuZGVuY3kuX3F1ZXJ5KGQucHJvcGVydGllcykpO1xuICB9XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBzdGF0aWMgX2F0dHJpYnV0ZU5hbWUocHJvcGVydGllczogYW55W10pOiBzdHJpbmcge1xuICAgIHZhciBwID0gPEF0dHJpYnV0ZU1ldGFkYXRhPnByb3BlcnRpZXMuZmluZChwID0+IHAgaW5zdGFuY2VvZiBBdHRyaWJ1dGVNZXRhZGF0YSk7XG4gICAgcmV0dXJuIGlzUHJlc2VudChwKSA/IHAuYXR0cmlidXRlTmFtZSA6IG51bGw7XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIHN0YXRpYyBfcXVlcnkocHJvcGVydGllczogYW55W10pOiBRdWVyeU1ldGFkYXRhIHtcbiAgICByZXR1cm4gPFF1ZXJ5TWV0YWRhdGE+cHJvcGVydGllcy5maW5kKHAgPT4gcCBpbnN0YW5jZW9mIFF1ZXJ5TWV0YWRhdGEpO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBEaXJlY3RpdmVQcm92aWRlciBleHRlbmRzIFJlc29sdmVkUHJvdmlkZXJfIHtcbiAgY29uc3RydWN0b3Ioa2V5OiBLZXksIGZhY3Rvcnk6IEZ1bmN0aW9uLCBkZXBzOiBEZXBlbmRlbmN5W10sIHB1YmxpYyBpc0NvbXBvbmVudDogYm9vbGVhbixcbiAgICAgICAgICAgICAgcHVibGljIHByb3ZpZGVyczogUmVzb2x2ZWRQcm92aWRlcltdLCBwdWJsaWMgdmlld1Byb3ZpZGVyczogUmVzb2x2ZWRQcm92aWRlcltdLFxuICAgICAgICAgICAgICBwdWJsaWMgcXVlcmllczogUXVlcnlNZXRhZGF0YVdpdGhTZXR0ZXJbXSkge1xuICAgIHN1cGVyKGtleSwgW25ldyBSZXNvbHZlZEZhY3RvcnkoZmFjdG9yeSwgZGVwcyldLCBmYWxzZSk7XG4gIH1cblxuICBnZXQgZGlzcGxheU5hbWUoKTogc3RyaW5nIHsgcmV0dXJuIHRoaXMua2V5LmRpc3BsYXlOYW1lOyB9XG5cbiAgc3RhdGljIGNyZWF0ZUZyb21UeXBlKHR5cGU6IFR5cGUsIG1ldGE6IERpcmVjdGl2ZU1ldGFkYXRhKTogRGlyZWN0aXZlUHJvdmlkZXIge1xuICAgIHZhciBwcm92aWRlciA9IG5ldyBQcm92aWRlcih0eXBlLCB7dXNlQ2xhc3M6IHR5cGV9KTtcbiAgICBpZiAoaXNCbGFuayhtZXRhKSkge1xuICAgICAgbWV0YSA9IG5ldyBEaXJlY3RpdmVNZXRhZGF0YSgpO1xuICAgIH1cbiAgICB2YXIgcmIgPSByZXNvbHZlUHJvdmlkZXIocHJvdmlkZXIpO1xuICAgIHZhciByZiA9IHJiLnJlc29sdmVkRmFjdG9yaWVzWzBdO1xuICAgIHZhciBkZXBzOiBEaXJlY3RpdmVEZXBlbmRlbmN5W10gPSByZi5kZXBlbmRlbmNpZXMubWFwKERpcmVjdGl2ZURlcGVuZGVuY3kuY3JlYXRlRnJvbSk7XG4gICAgdmFyIGlzQ29tcG9uZW50ID0gbWV0YSBpbnN0YW5jZW9mIENvbXBvbmVudE1ldGFkYXRhO1xuICAgIHZhciByZXNvbHZlZFByb3ZpZGVycyA9IGlzUHJlc2VudChtZXRhLnByb3ZpZGVycykgPyBJbmplY3Rvci5yZXNvbHZlKG1ldGEucHJvdmlkZXJzKSA6IG51bGw7XG4gICAgdmFyIHJlc29sdmVkVmlld1Byb3ZpZGVycyA9IG1ldGEgaW5zdGFuY2VvZiBDb21wb25lbnRNZXRhZGF0YSAmJiBpc1ByZXNlbnQobWV0YS52aWV3UHJvdmlkZXJzKSA/XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBJbmplY3Rvci5yZXNvbHZlKG1ldGEudmlld1Byb3ZpZGVycykgOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbnVsbDtcbiAgICB2YXIgcXVlcmllcyA9IFtdO1xuICAgIGlmIChpc1ByZXNlbnQobWV0YS5xdWVyaWVzKSkge1xuICAgICAgU3RyaW5nTWFwV3JhcHBlci5mb3JFYWNoKG1ldGEucXVlcmllcywgKG1ldGEsIGZpZWxkTmFtZSkgPT4ge1xuICAgICAgICB2YXIgc2V0dGVyID0gcmVmbGVjdG9yLnNldHRlcihmaWVsZE5hbWUpO1xuICAgICAgICBxdWVyaWVzLnB1c2gobmV3IFF1ZXJ5TWV0YWRhdGFXaXRoU2V0dGVyKHNldHRlciwgbWV0YSkpO1xuICAgICAgfSk7XG4gICAgfVxuICAgIC8vIHF1ZXJpZXMgcGFzc2VkIGludG8gdGhlIGNvbnN0cnVjdG9yLlxuICAgIC8vIFRPRE86IHJlbW92ZSB0aGlzIGFmdGVyIGNvbnN0cnVjdG9yIHF1ZXJpZXMgYXJlIG5vIGxvbmdlciBzdXBwb3J0ZWRcbiAgICBkZXBzLmZvckVhY2goZCA9PiB7XG4gICAgICBpZiAoaXNQcmVzZW50KGQucXVlcnlEZWNvcmF0b3IpKSB7XG4gICAgICAgIHF1ZXJpZXMucHVzaChuZXcgUXVlcnlNZXRhZGF0YVdpdGhTZXR0ZXIobnVsbCwgZC5xdWVyeURlY29yYXRvcikpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBuZXcgRGlyZWN0aXZlUHJvdmlkZXIocmIua2V5LCByZi5mYWN0b3J5LCBkZXBzLCBpc0NvbXBvbmVudCwgcmVzb2x2ZWRQcm92aWRlcnMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlZFZpZXdQcm92aWRlcnMsIHF1ZXJpZXMpO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBRdWVyeU1ldGFkYXRhV2l0aFNldHRlciB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBzZXR0ZXI6IFNldHRlckZuLCBwdWJsaWMgbWV0YWRhdGE6IFF1ZXJ5TWV0YWRhdGEpIHt9XG59XG5cblxuZnVuY3Rpb24gc2V0UHJvdmlkZXJzVmlzaWJpbGl0eShwcm92aWRlcnM6IFJlc29sdmVkUHJvdmlkZXJbXSwgdmlzaWJpbGl0eTogVmlzaWJpbGl0eSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0OiBNYXA8bnVtYmVyLCBWaXNpYmlsaXR5Pikge1xuICBmb3IgKHZhciBpID0gMDsgaSA8IHByb3ZpZGVycy5sZW5ndGg7IGkrKykge1xuICAgIHJlc3VsdC5zZXQocHJvdmlkZXJzW2ldLmtleS5pZCwgdmlzaWJpbGl0eSk7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIEFwcFByb3RvRWxlbWVudCB7XG4gIHByb3RvSW5qZWN0b3I6IFByb3RvSW5qZWN0b3I7XG5cbiAgc3RhdGljIGNyZWF0ZShtZXRhZGF0YUNhY2hlOiBSZXNvbHZlZE1ldGFkYXRhQ2FjaGUsIGluZGV4OiBudW1iZXIsXG4gICAgICAgICAgICAgICAgYXR0cmlidXRlczoge1trZXk6IHN0cmluZ106IHN0cmluZ30sIGRpcmVjdGl2ZVR5cGVzOiBUeXBlW10sXG4gICAgICAgICAgICAgICAgZGlyZWN0aXZlVmFyaWFibGVCaW5kaW5nczoge1trZXk6IHN0cmluZ106IG51bWJlcn0pOiBBcHBQcm90b0VsZW1lbnQge1xuICAgIHZhciBjb21wb25lbnREaXJQcm92aWRlciA9IG51bGw7XG4gICAgdmFyIG1lcmdlZFByb3ZpZGVyc01hcDogTWFwPG51bWJlciwgUmVzb2x2ZWRQcm92aWRlcj4gPSBuZXcgTWFwPG51bWJlciwgUmVzb2x2ZWRQcm92aWRlcj4oKTtcbiAgICB2YXIgcHJvdmlkZXJWaXNpYmlsaXR5TWFwOiBNYXA8bnVtYmVyLCBWaXNpYmlsaXR5PiA9IG5ldyBNYXA8bnVtYmVyLCBWaXNpYmlsaXR5PigpO1xuICAgIHZhciBwcm92aWRlcnMgPSBMaXN0V3JhcHBlci5jcmVhdGVHcm93YWJsZVNpemUoZGlyZWN0aXZlVHlwZXMubGVuZ3RoKTtcblxuICAgIHZhciBwcm90b1F1ZXJ5UmVmcyA9IFtdO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZGlyZWN0aXZlVHlwZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBkaXJQcm92aWRlciA9IG1ldGFkYXRhQ2FjaGUuZ2V0UmVzb2x2ZWREaXJlY3RpdmVNZXRhZGF0YShkaXJlY3RpdmVUeXBlc1tpXSk7XG4gICAgICBwcm92aWRlcnNbaV0gPSBuZXcgUHJvdmlkZXJXaXRoVmlzaWJpbGl0eShcbiAgICAgICAgICBkaXJQcm92aWRlciwgZGlyUHJvdmlkZXIuaXNDb21wb25lbnQgPyBWaXNpYmlsaXR5LlB1YmxpY0FuZFByaXZhdGUgOiBWaXNpYmlsaXR5LlB1YmxpYyk7XG5cbiAgICAgIGlmIChkaXJQcm92aWRlci5pc0NvbXBvbmVudCkge1xuICAgICAgICBjb21wb25lbnREaXJQcm92aWRlciA9IGRpclByb3ZpZGVyO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKGlzUHJlc2VudChkaXJQcm92aWRlci5wcm92aWRlcnMpKSB7XG4gICAgICAgICAgbWVyZ2VSZXNvbHZlZFByb3ZpZGVycyhkaXJQcm92aWRlci5wcm92aWRlcnMsIG1lcmdlZFByb3ZpZGVyc01hcCk7XG4gICAgICAgICAgc2V0UHJvdmlkZXJzVmlzaWJpbGl0eShkaXJQcm92aWRlci5wcm92aWRlcnMsIFZpc2liaWxpdHkuUHVibGljLCBwcm92aWRlclZpc2liaWxpdHlNYXApO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoaXNQcmVzZW50KGRpclByb3ZpZGVyLnZpZXdQcm92aWRlcnMpKSB7XG4gICAgICAgIG1lcmdlUmVzb2x2ZWRQcm92aWRlcnMoZGlyUHJvdmlkZXIudmlld1Byb3ZpZGVycywgbWVyZ2VkUHJvdmlkZXJzTWFwKTtcbiAgICAgICAgc2V0UHJvdmlkZXJzVmlzaWJpbGl0eShkaXJQcm92aWRlci52aWV3UHJvdmlkZXJzLCBWaXNpYmlsaXR5LlByaXZhdGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvdmlkZXJWaXNpYmlsaXR5TWFwKTtcbiAgICAgIH1cbiAgICAgIGZvciAodmFyIHF1ZXJ5SWR4ID0gMDsgcXVlcnlJZHggPCBkaXJQcm92aWRlci5xdWVyaWVzLmxlbmd0aDsgcXVlcnlJZHgrKykge1xuICAgICAgICB2YXIgcSA9IGRpclByb3ZpZGVyLnF1ZXJpZXNbcXVlcnlJZHhdO1xuICAgICAgICBwcm90b1F1ZXJ5UmVmcy5wdXNoKG5ldyBQcm90b1F1ZXJ5UmVmKGksIHEuc2V0dGVyLCBxLm1ldGFkYXRhKSk7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChpc1ByZXNlbnQoY29tcG9uZW50RGlyUHJvdmlkZXIpICYmIGlzUHJlc2VudChjb21wb25lbnREaXJQcm92aWRlci5wcm92aWRlcnMpKSB7XG4gICAgICAvLyBkaXJlY3RpdmUgcHJvdmlkZXJzIG5lZWQgdG8gYmUgcHJpb3JpdGl6ZWQgb3ZlciBjb21wb25lbnQgcHJvdmlkZXJzXG4gICAgICBtZXJnZVJlc29sdmVkUHJvdmlkZXJzKGNvbXBvbmVudERpclByb3ZpZGVyLnByb3ZpZGVycywgbWVyZ2VkUHJvdmlkZXJzTWFwKTtcbiAgICAgIHNldFByb3ZpZGVyc1Zpc2liaWxpdHkoY29tcG9uZW50RGlyUHJvdmlkZXIucHJvdmlkZXJzLCBWaXNpYmlsaXR5LlB1YmxpYyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvdmlkZXJWaXNpYmlsaXR5TWFwKTtcbiAgICB9XG4gICAgbWVyZ2VkUHJvdmlkZXJzTWFwLmZvckVhY2goKHByb3ZpZGVyLCBfKSA9PiB7XG4gICAgICBwcm92aWRlcnMucHVzaChcbiAgICAgICAgICBuZXcgUHJvdmlkZXJXaXRoVmlzaWJpbGl0eShwcm92aWRlciwgcHJvdmlkZXJWaXNpYmlsaXR5TWFwLmdldChwcm92aWRlci5rZXkuaWQpKSk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gbmV3IEFwcFByb3RvRWxlbWVudChpc1ByZXNlbnQoY29tcG9uZW50RGlyUHJvdmlkZXIpLCBpbmRleCwgYXR0cmlidXRlcywgcHJvdmlkZXJzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb3RvUXVlcnlSZWZzLCBkaXJlY3RpdmVWYXJpYWJsZUJpbmRpbmdzKTtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBmaXJzdFByb3ZpZGVySXNDb21wb25lbnQ6IGJvb2xlYW4sIHB1YmxpYyBpbmRleDogbnVtYmVyLFxuICAgICAgICAgICAgICBwdWJsaWMgYXR0cmlidXRlczoge1trZXk6IHN0cmluZ106IHN0cmluZ30sIHB3dnM6IFByb3ZpZGVyV2l0aFZpc2liaWxpdHlbXSxcbiAgICAgICAgICAgICAgcHVibGljIHByb3RvUXVlcnlSZWZzOiBQcm90b1F1ZXJ5UmVmW10sXG4gICAgICAgICAgICAgIHB1YmxpYyBkaXJlY3RpdmVWYXJpYWJsZUJpbmRpbmdzOiB7W2tleTogc3RyaW5nXTogbnVtYmVyfSkge1xuICAgIHZhciBsZW5ndGggPSBwd3ZzLmxlbmd0aDtcbiAgICBpZiAobGVuZ3RoID4gMCkge1xuICAgICAgdGhpcy5wcm90b0luamVjdG9yID0gbmV3IFByb3RvSW5qZWN0b3IocHd2cyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMucHJvdG9JbmplY3RvciA9IG51bGw7XG4gICAgICB0aGlzLnByb3RvUXVlcnlSZWZzID0gW107XG4gICAgfVxuICB9XG5cbiAgZ2V0UHJvdmlkZXJBdEluZGV4KGluZGV4OiBudW1iZXIpOiBhbnkgeyByZXR1cm4gdGhpcy5wcm90b0luamVjdG9yLmdldFByb3ZpZGVyQXRJbmRleChpbmRleCk7IH1cbn1cblxuY2xhc3MgX0NvbnRleHQge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgZWxlbWVudDogYW55LCBwdWJsaWMgY29tcG9uZW50RWxlbWVudDogYW55LCBwdWJsaWMgaW5qZWN0b3I6IGFueSkge31cbn1cblxuZXhwb3J0IGNsYXNzIEluamVjdG9yV2l0aEhvc3RCb3VuZGFyeSB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBpbmplY3RvcjogSW5qZWN0b3IsIHB1YmxpYyBob3N0SW5qZWN0b3JCb3VuZGFyeTogYm9vbGVhbikge31cbn1cblxuZXhwb3J0IGNsYXNzIEFwcEVsZW1lbnQgaW1wbGVtZW50cyBEZXBlbmRlbmN5UHJvdmlkZXIsIEVsZW1lbnRSZWYsIEFmdGVyVmlld0NoZWNrZWQge1xuICBzdGF0aWMgZ2V0Vmlld1BhcmVudEluamVjdG9yKHBhcmVudFZpZXdUeXBlOiBWaWV3VHlwZSwgY29udGFpbmVyQXBwRWxlbWVudDogQXBwRWxlbWVudCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbXBlcmF0aXZlbHlDcmVhdGVkUHJvdmlkZXJzOiBSZXNvbHZlZFByb3ZpZGVyW10sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcm9vdEluamVjdG9yOiBJbmplY3Rvcik6IEluamVjdG9yV2l0aEhvc3RCb3VuZGFyeSB7XG4gICAgdmFyIHBhcmVudEluamVjdG9yO1xuICAgIHZhciBob3N0SW5qZWN0b3JCb3VuZGFyeTtcbiAgICBzd2l0Y2ggKHBhcmVudFZpZXdUeXBlKSB7XG4gICAgICBjYXNlIFZpZXdUeXBlLkNPTVBPTkVOVDpcbiAgICAgICAgcGFyZW50SW5qZWN0b3IgPSBjb250YWluZXJBcHBFbGVtZW50Ll9pbmplY3RvcjtcbiAgICAgICAgaG9zdEluamVjdG9yQm91bmRhcnkgPSB0cnVlO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgVmlld1R5cGUuRU1CRURERUQ6XG4gICAgICAgIHBhcmVudEluamVjdG9yID0gaXNQcmVzZW50KGNvbnRhaW5lckFwcEVsZW1lbnQucHJvdG8ucHJvdG9JbmplY3RvcikgP1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250YWluZXJBcHBFbGVtZW50Ll9pbmplY3Rvci5wYXJlbnQgOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250YWluZXJBcHBFbGVtZW50Ll9pbmplY3RvcjtcbiAgICAgICAgaG9zdEluamVjdG9yQm91bmRhcnkgPSBjb250YWluZXJBcHBFbGVtZW50Ll9pbmplY3Rvci5ob3N0Qm91bmRhcnk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBWaWV3VHlwZS5IT1NUOlxuICAgICAgICBpZiAoaXNQcmVzZW50KGNvbnRhaW5lckFwcEVsZW1lbnQpKSB7XG4gICAgICAgICAgLy8gaG9zdCB2aWV3IGlzIGF0dGFjaGVkIHRvIGEgY29udGFpbmVyXG4gICAgICAgICAgcGFyZW50SW5qZWN0b3IgPSBpc1ByZXNlbnQoY29udGFpbmVyQXBwRWxlbWVudC5wcm90by5wcm90b0luamVjdG9yKSA/XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGFpbmVyQXBwRWxlbWVudC5faW5qZWN0b3IucGFyZW50IDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250YWluZXJBcHBFbGVtZW50Ll9pbmplY3RvcjtcbiAgICAgICAgICBpZiAoaXNQcmVzZW50KGltcGVyYXRpdmVseUNyZWF0ZWRQcm92aWRlcnMpKSB7XG4gICAgICAgICAgICB2YXIgaW1wZXJhdGl2ZVByb3ZpZGVyc1dpdGhWaXNpYmlsaXR5ID0gaW1wZXJhdGl2ZWx5Q3JlYXRlZFByb3ZpZGVycy5tYXAoXG4gICAgICAgICAgICAgICAgcCA9PiBuZXcgUHJvdmlkZXJXaXRoVmlzaWJpbGl0eShwLCBWaXNpYmlsaXR5LlB1YmxpYykpO1xuICAgICAgICAgICAgLy8gVGhlIGltcGVyYXRpdmUgaW5qZWN0b3IgaXMgc2ltaWxhciB0byBoYXZpbmcgYW4gZWxlbWVudCBiZXR3ZWVuXG4gICAgICAgICAgICAvLyB0aGUgZHluYW1pYy1sb2FkZWQgY29tcG9uZW50IGFuZCBpdHMgcGFyZW50ID0+IG5vIGJvdW5kYXJ5IGJldHdlZW5cbiAgICAgICAgICAgIC8vIHRoZSBjb21wb25lbnQgYW5kIGltcGVyYXRpdmVseUNyZWF0ZWRJbmplY3Rvci5cbiAgICAgICAgICAgIHBhcmVudEluamVjdG9yID0gbmV3IEluamVjdG9yKG5ldyBQcm90b0luamVjdG9yKGltcGVyYXRpdmVQcm92aWRlcnNXaXRoVmlzaWJpbGl0eSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJlbnRJbmplY3RvciwgdHJ1ZSwgbnVsbCwgbnVsbCk7XG4gICAgICAgICAgICBob3N0SW5qZWN0b3JCb3VuZGFyeSA9IGZhbHNlO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBob3N0SW5qZWN0b3JCb3VuZGFyeSA9IGNvbnRhaW5lckFwcEVsZW1lbnQuX2luamVjdG9yLmhvc3RCb3VuZGFyeTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gYm9vdHN0cmFwXG4gICAgICAgICAgcGFyZW50SW5qZWN0b3IgPSByb290SW5qZWN0b3I7XG4gICAgICAgICAgaG9zdEluamVjdG9yQm91bmRhcnkgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IEluamVjdG9yV2l0aEhvc3RCb3VuZGFyeShwYXJlbnRJbmplY3RvciwgaG9zdEluamVjdG9yQm91bmRhcnkpO1xuICB9XG5cbiAgcHVibGljIG5lc3RlZFZpZXdzOiBBcHBWaWV3W10gPSBudWxsO1xuICBwdWJsaWMgY29tcG9uZW50VmlldzogQXBwVmlldyA9IG51bGw7XG5cbiAgcHJpdmF0ZSBfcXVlcnlTdHJhdGVneTogX1F1ZXJ5U3RyYXRlZ3k7XG4gIHByaXZhdGUgX2luamVjdG9yOiBJbmplY3RvcjtcbiAgcHJpdmF0ZSBfc3RyYXRlZ3k6IF9FbGVtZW50RGlyZWN0aXZlU3RyYXRlZ3k7XG4gIHB1YmxpYyByZWY6IEVsZW1lbnRSZWZfO1xuXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBwcm90bzogQXBwUHJvdG9FbGVtZW50LCBwdWJsaWMgcGFyZW50VmlldzogQXBwVmlldywgcHVibGljIHBhcmVudDogQXBwRWxlbWVudCxcbiAgICAgICAgICAgICAgcHVibGljIG5hdGl2ZUVsZW1lbnQ6IGFueSwgcHVibGljIGVtYmVkZGVkVmlld0ZhY3Rvcnk6IEZ1bmN0aW9uKSB7XG4gICAgdGhpcy5yZWYgPSBuZXcgRWxlbWVudFJlZl8odGhpcyk7XG4gICAgdmFyIHBhcmVudEluamVjdG9yID0gaXNQcmVzZW50KHBhcmVudCkgPyBwYXJlbnQuX2luamVjdG9yIDogcGFyZW50Vmlldy5wYXJlbnRJbmplY3RvcjtcbiAgICBpZiAoaXNQcmVzZW50KHRoaXMucHJvdG8ucHJvdG9JbmplY3RvcikpIHtcbiAgICAgIHZhciBpc0JvdW5kYXJ5O1xuICAgICAgaWYgKGlzUHJlc2VudChwYXJlbnQpICYmIGlzUHJlc2VudChwYXJlbnQucHJvdG8ucHJvdG9JbmplY3RvcikpIHtcbiAgICAgICAgaXNCb3VuZGFyeSA9IGZhbHNlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaXNCb3VuZGFyeSA9IHBhcmVudFZpZXcuaG9zdEluamVjdG9yQm91bmRhcnk7XG4gICAgICB9XG4gICAgICB0aGlzLl9xdWVyeVN0cmF0ZWd5ID0gdGhpcy5fYnVpbGRRdWVyeVN0cmF0ZWd5KCk7XG4gICAgICB0aGlzLl9pbmplY3RvciA9IG5ldyBJbmplY3Rvcih0aGlzLnByb3RvLnByb3RvSW5qZWN0b3IsIHBhcmVudEluamVjdG9yLCBpc0JvdW5kYXJ5LCB0aGlzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKCkgPT4gdGhpcy5fZGVidWdDb250ZXh0KCkpO1xuXG4gICAgICAvLyB3ZSBjb3VwbGUgb3Vyc2VsdmVzIHRvIHRoZSBpbmplY3RvciBzdHJhdGVneSB0byBhdm9pZCBwb2x5bW9ycGhpYyBjYWxsc1xuICAgICAgdmFyIGluamVjdG9yU3RyYXRlZ3kgPSA8YW55PnRoaXMuX2luamVjdG9yLmludGVybmFsU3RyYXRlZ3k7XG4gICAgICB0aGlzLl9zdHJhdGVneSA9IGluamVjdG9yU3RyYXRlZ3kgaW5zdGFuY2VvZiBJbmplY3RvcklubGluZVN0cmF0ZWd5ID9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBFbGVtZW50RGlyZWN0aXZlSW5saW5lU3RyYXRlZ3koaW5qZWN0b3JTdHJhdGVneSwgdGhpcykgOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3IEVsZW1lbnREaXJlY3RpdmVEeW5hbWljU3RyYXRlZ3koaW5qZWN0b3JTdHJhdGVneSwgdGhpcyk7XG4gICAgICB0aGlzLl9zdHJhdGVneS5pbml0KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX3F1ZXJ5U3RyYXRlZ3kgPSBudWxsO1xuICAgICAgdGhpcy5faW5qZWN0b3IgPSBwYXJlbnRJbmplY3RvcjtcbiAgICAgIHRoaXMuX3N0cmF0ZWd5ID0gbnVsbDtcbiAgICB9XG4gIH1cblxuICBhdHRhY2hDb21wb25lbnRWaWV3KGNvbXBvbmVudFZpZXc6IEFwcFZpZXcpIHsgdGhpcy5jb21wb25lbnRWaWV3ID0gY29tcG9uZW50VmlldzsgfVxuXG4gIHByaXZhdGUgX2RlYnVnQ29udGV4dCgpOiBhbnkge1xuICAgIHZhciBjID0gdGhpcy5wYXJlbnRWaWV3LmdldERlYnVnQ29udGV4dCh0aGlzLCBudWxsLCBudWxsKTtcbiAgICByZXR1cm4gaXNQcmVzZW50KGMpID8gbmV3IF9Db250ZXh0KGMuZWxlbWVudCwgYy5jb21wb25lbnRFbGVtZW50LCBjLmluamVjdG9yKSA6IG51bGw7XG4gIH1cblxuICBoYXNWYXJpYWJsZUJpbmRpbmcobmFtZTogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgdmFyIHZiID0gdGhpcy5wcm90by5kaXJlY3RpdmVWYXJpYWJsZUJpbmRpbmdzO1xuICAgIHJldHVybiBpc1ByZXNlbnQodmIpICYmIFN0cmluZ01hcFdyYXBwZXIuY29udGFpbnModmIsIG5hbWUpO1xuICB9XG5cbiAgZ2V0VmFyaWFibGVCaW5kaW5nKG5hbWU6IHN0cmluZyk6IGFueSB7XG4gICAgdmFyIGluZGV4ID0gdGhpcy5wcm90by5kaXJlY3RpdmVWYXJpYWJsZUJpbmRpbmdzW25hbWVdO1xuICAgIHJldHVybiBpc1ByZXNlbnQoaW5kZXgpID8gdGhpcy5nZXREaXJlY3RpdmVBdEluZGV4KDxudW1iZXI+aW5kZXgpIDogdGhpcy5nZXRFbGVtZW50UmVmKCk7XG4gIH1cblxuICBnZXQodG9rZW46IGFueSk6IGFueSB7IHJldHVybiB0aGlzLl9pbmplY3Rvci5nZXQodG9rZW4pOyB9XG5cbiAgaGFzRGlyZWN0aXZlKHR5cGU6IFR5cGUpOiBib29sZWFuIHsgcmV0dXJuIGlzUHJlc2VudCh0aGlzLl9pbmplY3Rvci5nZXRPcHRpb25hbCh0eXBlKSk7IH1cblxuICBnZXRDb21wb25lbnQoKTogYW55IHsgcmV0dXJuIGlzUHJlc2VudCh0aGlzLl9zdHJhdGVneSkgPyB0aGlzLl9zdHJhdGVneS5nZXRDb21wb25lbnQoKSA6IG51bGw7IH1cblxuICBnZXRJbmplY3RvcigpOiBJbmplY3RvciB7IHJldHVybiB0aGlzLl9pbmplY3RvcjsgfVxuXG4gIGdldEVsZW1lbnRSZWYoKTogRWxlbWVudFJlZiB7IHJldHVybiB0aGlzLnJlZjsgfVxuXG4gIGdldFZpZXdDb250YWluZXJSZWYoKTogVmlld0NvbnRhaW5lclJlZiB7IHJldHVybiBuZXcgVmlld0NvbnRhaW5lclJlZl8odGhpcyk7IH1cblxuICBnZXRUZW1wbGF0ZVJlZigpOiBUZW1wbGF0ZVJlZiB7XG4gICAgaWYgKGlzUHJlc2VudCh0aGlzLmVtYmVkZGVkVmlld0ZhY3RvcnkpKSB7XG4gICAgICByZXR1cm4gbmV3IFRlbXBsYXRlUmVmXyh0aGlzLnJlZik7XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgZ2V0RGVwZW5kZW5jeShpbmplY3RvcjogSW5qZWN0b3IsIHByb3ZpZGVyOiBSZXNvbHZlZFByb3ZpZGVyLCBkZXA6IERlcGVuZGVuY3kpOiBhbnkge1xuICAgIGlmIChwcm92aWRlciBpbnN0YW5jZW9mIERpcmVjdGl2ZVByb3ZpZGVyKSB7XG4gICAgICB2YXIgZGlyRGVwID0gPERpcmVjdGl2ZURlcGVuZGVuY3k+ZGVwO1xuXG4gICAgICBpZiAoaXNQcmVzZW50KGRpckRlcC5hdHRyaWJ1dGVOYW1lKSkgcmV0dXJuIHRoaXMuX2J1aWxkQXR0cmlidXRlKGRpckRlcCk7XG5cbiAgICAgIGlmIChpc1ByZXNlbnQoZGlyRGVwLnF1ZXJ5RGVjb3JhdG9yKSlcbiAgICAgICAgcmV0dXJuIHRoaXMuX3F1ZXJ5U3RyYXRlZ3kuZmluZFF1ZXJ5KGRpckRlcC5xdWVyeURlY29yYXRvcikubGlzdDtcblxuICAgICAgaWYgKGRpckRlcC5rZXkuaWQgPT09IFN0YXRpY0tleXMuaW5zdGFuY2UoKS5jaGFuZ2VEZXRlY3RvclJlZklkKSB7XG4gICAgICAgIC8vIFdlIHByb3ZpZGUgdGhlIGNvbXBvbmVudCdzIHZpZXcgY2hhbmdlIGRldGVjdG9yIHRvIGNvbXBvbmVudHMgYW5kXG4gICAgICAgIC8vIHRoZSBzdXJyb3VuZGluZyBjb21wb25lbnQncyBjaGFuZ2UgZGV0ZWN0b3IgdG8gZGlyZWN0aXZlcy5cbiAgICAgICAgaWYgKHRoaXMucHJvdG8uZmlyc3RQcm92aWRlcklzQ29tcG9uZW50KSB7XG4gICAgICAgICAgLy8gTm90ZTogVGhlIGNvbXBvbmVudCB2aWV3IGlzIG5vdCB5ZXQgY3JlYXRlZCB3aGVuXG4gICAgICAgICAgLy8gdGhpcyBtZXRob2QgaXMgY2FsbGVkIVxuICAgICAgICAgIHJldHVybiBuZXcgX0NvbXBvbmVudFZpZXdDaGFuZ2VEZXRlY3RvclJlZih0aGlzKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5wYXJlbnRWaWV3LmNoYW5nZURldGVjdG9yLnJlZjtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoZGlyRGVwLmtleS5pZCA9PT0gU3RhdGljS2V5cy5pbnN0YW5jZSgpLmVsZW1lbnRSZWZJZCkge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRFbGVtZW50UmVmKCk7XG4gICAgICB9XG5cbiAgICAgIGlmIChkaXJEZXAua2V5LmlkID09PSBTdGF0aWNLZXlzLmluc3RhbmNlKCkudmlld0NvbnRhaW5lcklkKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldFZpZXdDb250YWluZXJSZWYoKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGRpckRlcC5rZXkuaWQgPT09IFN0YXRpY0tleXMuaW5zdGFuY2UoKS50ZW1wbGF0ZVJlZklkKSB7XG4gICAgICAgIHZhciB0ciA9IHRoaXMuZ2V0VGVtcGxhdGVSZWYoKTtcbiAgICAgICAgaWYgKGlzQmxhbmsodHIpICYmICFkaXJEZXAub3B0aW9uYWwpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgTm9Qcm92aWRlckVycm9yKG51bGwsIGRpckRlcC5rZXkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0cjtcbiAgICAgIH1cblxuICAgICAgaWYgKGRpckRlcC5rZXkuaWQgPT09IFN0YXRpY0tleXMuaW5zdGFuY2UoKS5yZW5kZXJlcklkKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnBhcmVudFZpZXcucmVuZGVyZXI7XG4gICAgICB9XG5cbiAgICB9IGVsc2UgaWYgKHByb3ZpZGVyIGluc3RhbmNlb2YgUGlwZVByb3ZpZGVyKSB7XG4gICAgICBpZiAoZGVwLmtleS5pZCA9PT0gU3RhdGljS2V5cy5pbnN0YW5jZSgpLmNoYW5nZURldGVjdG9yUmVmSWQpIHtcbiAgICAgICAgLy8gV2UgcHJvdmlkZSB0aGUgY29tcG9uZW50J3MgdmlldyBjaGFuZ2UgZGV0ZWN0b3IgdG8gY29tcG9uZW50cyBhbmRcbiAgICAgICAgLy8gdGhlIHN1cnJvdW5kaW5nIGNvbXBvbmVudCdzIGNoYW5nZSBkZXRlY3RvciB0byBkaXJlY3RpdmVzLlxuICAgICAgICBpZiAodGhpcy5wcm90by5maXJzdFByb3ZpZGVySXNDb21wb25lbnQpIHtcbiAgICAgICAgICAvLyBOb3RlOiBUaGUgY29tcG9uZW50IHZpZXcgaXMgbm90IHlldCBjcmVhdGVkIHdoZW5cbiAgICAgICAgICAvLyB0aGlzIG1ldGhvZCBpcyBjYWxsZWQhXG4gICAgICAgICAgcmV0dXJuIG5ldyBfQ29tcG9uZW50Vmlld0NoYW5nZURldGVjdG9yUmVmKHRoaXMpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiB0aGlzLnBhcmVudFZpZXcuY2hhbmdlRGV0ZWN0b3I7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gVU5ERUZJTkVEO1xuICB9XG5cbiAgcHJpdmF0ZSBfYnVpbGRBdHRyaWJ1dGUoZGVwOiBEaXJlY3RpdmVEZXBlbmRlbmN5KTogc3RyaW5nIHtcbiAgICB2YXIgYXR0cmlidXRlcyA9IHRoaXMucHJvdG8uYXR0cmlidXRlcztcbiAgICBpZiAoaXNQcmVzZW50KGF0dHJpYnV0ZXMpICYmIFN0cmluZ01hcFdyYXBwZXIuY29udGFpbnMoYXR0cmlidXRlcywgZGVwLmF0dHJpYnV0ZU5hbWUpKSB7XG4gICAgICByZXR1cm4gYXR0cmlidXRlc1tkZXAuYXR0cmlidXRlTmFtZV07XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgfVxuXG4gIGFkZERpcmVjdGl2ZXNNYXRjaGluZ1F1ZXJ5KHF1ZXJ5OiBRdWVyeU1ldGFkYXRhLCBsaXN0OiBhbnlbXSk6IHZvaWQge1xuICAgIHZhciB0ZW1wbGF0ZVJlZiA9IHRoaXMuZ2V0VGVtcGxhdGVSZWYoKTtcbiAgICBpZiAocXVlcnkuc2VsZWN0b3IgPT09IFRlbXBsYXRlUmVmICYmIGlzUHJlc2VudCh0ZW1wbGF0ZVJlZikpIHtcbiAgICAgIGxpc3QucHVzaCh0ZW1wbGF0ZVJlZik7XG4gICAgfVxuICAgIGlmICh0aGlzLl9zdHJhdGVneSAhPSBudWxsKSB7XG4gICAgICB0aGlzLl9zdHJhdGVneS5hZGREaXJlY3RpdmVzTWF0Y2hpbmdRdWVyeShxdWVyeSwgbGlzdCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfYnVpbGRRdWVyeVN0cmF0ZWd5KCk6IF9RdWVyeVN0cmF0ZWd5IHtcbiAgICBpZiAodGhpcy5wcm90by5wcm90b1F1ZXJ5UmVmcy5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiBfZW1wdHlRdWVyeVN0cmF0ZWd5O1xuICAgIH0gZWxzZSBpZiAodGhpcy5wcm90by5wcm90b1F1ZXJ5UmVmcy5sZW5ndGggPD1cbiAgICAgICAgICAgICAgIElubGluZVF1ZXJ5U3RyYXRlZ3kuTlVNQkVSX09GX1NVUFBPUlRFRF9RVUVSSUVTKSB7XG4gICAgICByZXR1cm4gbmV3IElubGluZVF1ZXJ5U3RyYXRlZ3kodGhpcyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBuZXcgRHluYW1pY1F1ZXJ5U3RyYXRlZ3kodGhpcyk7XG4gICAgfVxuICB9XG5cblxuICBnZXREaXJlY3RpdmVBdEluZGV4KGluZGV4OiBudW1iZXIpOiBhbnkgeyByZXR1cm4gdGhpcy5faW5qZWN0b3IuZ2V0QXQoaW5kZXgpOyB9XG5cbiAgbmdBZnRlclZpZXdDaGVja2VkKCk6IHZvaWQge1xuICAgIGlmIChpc1ByZXNlbnQodGhpcy5fcXVlcnlTdHJhdGVneSkpIHRoaXMuX3F1ZXJ5U3RyYXRlZ3kudXBkYXRlVmlld1F1ZXJpZXMoKTtcbiAgfVxuXG4gIG5nQWZ0ZXJDb250ZW50Q2hlY2tlZCgpOiB2b2lkIHtcbiAgICBpZiAoaXNQcmVzZW50KHRoaXMuX3F1ZXJ5U3RyYXRlZ3kpKSB0aGlzLl9xdWVyeVN0cmF0ZWd5LnVwZGF0ZUNvbnRlbnRRdWVyaWVzKCk7XG4gIH1cblxuICB0cmF2ZXJzZUFuZFNldFF1ZXJpZXNBc0RpcnR5KCk6IHZvaWQge1xuICAgIHZhciBpbmo6IEFwcEVsZW1lbnQgPSB0aGlzO1xuICAgIHdoaWxlIChpc1ByZXNlbnQoaW5qKSkge1xuICAgICAgaW5qLl9zZXRRdWVyaWVzQXNEaXJ0eSgpO1xuICAgICAgaWYgKGlzQmxhbmsoaW5qLnBhcmVudCkgJiYgaW5qLnBhcmVudFZpZXcucHJvdG8udHlwZSA9PT0gVmlld1R5cGUuRU1CRURERUQpIHtcbiAgICAgICAgaW5qID0gaW5qLnBhcmVudFZpZXcuY29udGFpbmVyQXBwRWxlbWVudDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGluaiA9IGluai5wYXJlbnQ7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfc2V0UXVlcmllc0FzRGlydHkoKTogdm9pZCB7XG4gICAgaWYgKGlzUHJlc2VudCh0aGlzLl9xdWVyeVN0cmF0ZWd5KSkge1xuICAgICAgdGhpcy5fcXVlcnlTdHJhdGVneS5zZXRDb250ZW50UXVlcmllc0FzRGlydHkoKTtcbiAgICB9XG4gICAgaWYgKHRoaXMucGFyZW50Vmlldy5wcm90by50eXBlID09PSBWaWV3VHlwZS5DT01QT05FTlQpIHtcbiAgICAgIHRoaXMucGFyZW50Vmlldy5jb250YWluZXJBcHBFbGVtZW50Ll9xdWVyeVN0cmF0ZWd5LnNldFZpZXdRdWVyaWVzQXNEaXJ0eSgpO1xuICAgIH1cbiAgfVxufVxuXG5pbnRlcmZhY2UgX1F1ZXJ5U3RyYXRlZ3kge1xuICBzZXRDb250ZW50UXVlcmllc0FzRGlydHkoKTogdm9pZDtcbiAgc2V0Vmlld1F1ZXJpZXNBc0RpcnR5KCk6IHZvaWQ7XG4gIHVwZGF0ZUNvbnRlbnRRdWVyaWVzKCk6IHZvaWQ7XG4gIHVwZGF0ZVZpZXdRdWVyaWVzKCk6IHZvaWQ7XG4gIGZpbmRRdWVyeShxdWVyeTogUXVlcnlNZXRhZGF0YSk6IFF1ZXJ5UmVmO1xufVxuXG5jbGFzcyBfRW1wdHlRdWVyeVN0cmF0ZWd5IGltcGxlbWVudHMgX1F1ZXJ5U3RyYXRlZ3kge1xuICBzZXRDb250ZW50UXVlcmllc0FzRGlydHkoKTogdm9pZCB7fVxuICBzZXRWaWV3UXVlcmllc0FzRGlydHkoKTogdm9pZCB7fVxuICB1cGRhdGVDb250ZW50UXVlcmllcygpOiB2b2lkIHt9XG4gIHVwZGF0ZVZpZXdRdWVyaWVzKCk6IHZvaWQge31cbiAgZmluZFF1ZXJ5KHF1ZXJ5OiBRdWVyeU1ldGFkYXRhKTogUXVlcnlSZWYge1xuICAgIHRocm93IG5ldyBCYXNlRXhjZXB0aW9uKGBDYW5ub3QgZmluZCBxdWVyeSBmb3IgZGlyZWN0aXZlICR7cXVlcnl9LmApO1xuICB9XG59XG5cbnZhciBfZW1wdHlRdWVyeVN0cmF0ZWd5ID0gbmV3IF9FbXB0eVF1ZXJ5U3RyYXRlZ3koKTtcblxuY2xhc3MgSW5saW5lUXVlcnlTdHJhdGVneSBpbXBsZW1lbnRzIF9RdWVyeVN0cmF0ZWd5IHtcbiAgc3RhdGljIE5VTUJFUl9PRl9TVVBQT1JURURfUVVFUklFUyA9IDM7XG5cbiAgcXVlcnkwOiBRdWVyeVJlZjtcbiAgcXVlcnkxOiBRdWVyeVJlZjtcbiAgcXVlcnkyOiBRdWVyeVJlZjtcblxuICBjb25zdHJ1Y3RvcihlaTogQXBwRWxlbWVudCkge1xuICAgIHZhciBwcm90b1JlZnMgPSBlaS5wcm90by5wcm90b1F1ZXJ5UmVmcztcbiAgICBpZiAocHJvdG9SZWZzLmxlbmd0aCA+IDApIHRoaXMucXVlcnkwID0gbmV3IFF1ZXJ5UmVmKHByb3RvUmVmc1swXSwgZWkpO1xuICAgIGlmIChwcm90b1JlZnMubGVuZ3RoID4gMSkgdGhpcy5xdWVyeTEgPSBuZXcgUXVlcnlSZWYocHJvdG9SZWZzWzFdLCBlaSk7XG4gICAgaWYgKHByb3RvUmVmcy5sZW5ndGggPiAyKSB0aGlzLnF1ZXJ5MiA9IG5ldyBRdWVyeVJlZihwcm90b1JlZnNbMl0sIGVpKTtcbiAgfVxuXG4gIHNldENvbnRlbnRRdWVyaWVzQXNEaXJ0eSgpOiB2b2lkIHtcbiAgICBpZiAoaXNQcmVzZW50KHRoaXMucXVlcnkwKSAmJiAhdGhpcy5xdWVyeTAuaXNWaWV3UXVlcnkpIHRoaXMucXVlcnkwLmRpcnR5ID0gdHJ1ZTtcbiAgICBpZiAoaXNQcmVzZW50KHRoaXMucXVlcnkxKSAmJiAhdGhpcy5xdWVyeTEuaXNWaWV3UXVlcnkpIHRoaXMucXVlcnkxLmRpcnR5ID0gdHJ1ZTtcbiAgICBpZiAoaXNQcmVzZW50KHRoaXMucXVlcnkyKSAmJiAhdGhpcy5xdWVyeTIuaXNWaWV3UXVlcnkpIHRoaXMucXVlcnkyLmRpcnR5ID0gdHJ1ZTtcbiAgfVxuXG4gIHNldFZpZXdRdWVyaWVzQXNEaXJ0eSgpOiB2b2lkIHtcbiAgICBpZiAoaXNQcmVzZW50KHRoaXMucXVlcnkwKSAmJiB0aGlzLnF1ZXJ5MC5pc1ZpZXdRdWVyeSkgdGhpcy5xdWVyeTAuZGlydHkgPSB0cnVlO1xuICAgIGlmIChpc1ByZXNlbnQodGhpcy5xdWVyeTEpICYmIHRoaXMucXVlcnkxLmlzVmlld1F1ZXJ5KSB0aGlzLnF1ZXJ5MS5kaXJ0eSA9IHRydWU7XG4gICAgaWYgKGlzUHJlc2VudCh0aGlzLnF1ZXJ5MikgJiYgdGhpcy5xdWVyeTIuaXNWaWV3UXVlcnkpIHRoaXMucXVlcnkyLmRpcnR5ID0gdHJ1ZTtcbiAgfVxuXG4gIHVwZGF0ZUNvbnRlbnRRdWVyaWVzKCkge1xuICAgIGlmIChpc1ByZXNlbnQodGhpcy5xdWVyeTApICYmICF0aGlzLnF1ZXJ5MC5pc1ZpZXdRdWVyeSkge1xuICAgICAgdGhpcy5xdWVyeTAudXBkYXRlKCk7XG4gICAgfVxuICAgIGlmIChpc1ByZXNlbnQodGhpcy5xdWVyeTEpICYmICF0aGlzLnF1ZXJ5MS5pc1ZpZXdRdWVyeSkge1xuICAgICAgdGhpcy5xdWVyeTEudXBkYXRlKCk7XG4gICAgfVxuICAgIGlmIChpc1ByZXNlbnQodGhpcy5xdWVyeTIpICYmICF0aGlzLnF1ZXJ5Mi5pc1ZpZXdRdWVyeSkge1xuICAgICAgdGhpcy5xdWVyeTIudXBkYXRlKCk7XG4gICAgfVxuICB9XG5cbiAgdXBkYXRlVmlld1F1ZXJpZXMoKSB7XG4gICAgaWYgKGlzUHJlc2VudCh0aGlzLnF1ZXJ5MCkgJiYgdGhpcy5xdWVyeTAuaXNWaWV3UXVlcnkpIHtcbiAgICAgIHRoaXMucXVlcnkwLnVwZGF0ZSgpO1xuICAgIH1cbiAgICBpZiAoaXNQcmVzZW50KHRoaXMucXVlcnkxKSAmJiB0aGlzLnF1ZXJ5MS5pc1ZpZXdRdWVyeSkge1xuICAgICAgdGhpcy5xdWVyeTEudXBkYXRlKCk7XG4gICAgfVxuICAgIGlmIChpc1ByZXNlbnQodGhpcy5xdWVyeTIpICYmIHRoaXMucXVlcnkyLmlzVmlld1F1ZXJ5KSB7XG4gICAgICB0aGlzLnF1ZXJ5Mi51cGRhdGUoKTtcbiAgICB9XG4gIH1cblxuICBmaW5kUXVlcnkocXVlcnk6IFF1ZXJ5TWV0YWRhdGEpOiBRdWVyeVJlZiB7XG4gICAgaWYgKGlzUHJlc2VudCh0aGlzLnF1ZXJ5MCkgJiYgdGhpcy5xdWVyeTAucHJvdG9RdWVyeVJlZi5xdWVyeSA9PT0gcXVlcnkpIHtcbiAgICAgIHJldHVybiB0aGlzLnF1ZXJ5MDtcbiAgICB9XG4gICAgaWYgKGlzUHJlc2VudCh0aGlzLnF1ZXJ5MSkgJiYgdGhpcy5xdWVyeTEucHJvdG9RdWVyeVJlZi5xdWVyeSA9PT0gcXVlcnkpIHtcbiAgICAgIHJldHVybiB0aGlzLnF1ZXJ5MTtcbiAgICB9XG4gICAgaWYgKGlzUHJlc2VudCh0aGlzLnF1ZXJ5MikgJiYgdGhpcy5xdWVyeTIucHJvdG9RdWVyeVJlZi5xdWVyeSA9PT0gcXVlcnkpIHtcbiAgICAgIHJldHVybiB0aGlzLnF1ZXJ5MjtcbiAgICB9XG4gICAgdGhyb3cgbmV3IEJhc2VFeGNlcHRpb24oYENhbm5vdCBmaW5kIHF1ZXJ5IGZvciBkaXJlY3RpdmUgJHtxdWVyeX0uYCk7XG4gIH1cbn1cblxuY2xhc3MgRHluYW1pY1F1ZXJ5U3RyYXRlZ3kgaW1wbGVtZW50cyBfUXVlcnlTdHJhdGVneSB7XG4gIHF1ZXJpZXM6IFF1ZXJ5UmVmW107XG5cbiAgY29uc3RydWN0b3IoZWk6IEFwcEVsZW1lbnQpIHtcbiAgICB0aGlzLnF1ZXJpZXMgPSBlaS5wcm90by5wcm90b1F1ZXJ5UmVmcy5tYXAocCA9PiBuZXcgUXVlcnlSZWYocCwgZWkpKTtcbiAgfVxuXG4gIHNldENvbnRlbnRRdWVyaWVzQXNEaXJ0eSgpOiB2b2lkIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMucXVlcmllcy5sZW5ndGg7ICsraSkge1xuICAgICAgdmFyIHEgPSB0aGlzLnF1ZXJpZXNbaV07XG4gICAgICBpZiAoIXEuaXNWaWV3UXVlcnkpIHEuZGlydHkgPSB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIHNldFZpZXdRdWVyaWVzQXNEaXJ0eSgpOiB2b2lkIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMucXVlcmllcy5sZW5ndGg7ICsraSkge1xuICAgICAgdmFyIHEgPSB0aGlzLnF1ZXJpZXNbaV07XG4gICAgICBpZiAocS5pc1ZpZXdRdWVyeSkgcS5kaXJ0eSA9IHRydWU7XG4gICAgfVxuICB9XG5cbiAgdXBkYXRlQ29udGVudFF1ZXJpZXMoKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnF1ZXJpZXMubGVuZ3RoOyArK2kpIHtcbiAgICAgIHZhciBxID0gdGhpcy5xdWVyaWVzW2ldO1xuICAgICAgaWYgKCFxLmlzVmlld1F1ZXJ5KSB7XG4gICAgICAgIHEudXBkYXRlKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgdXBkYXRlVmlld1F1ZXJpZXMoKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnF1ZXJpZXMubGVuZ3RoOyArK2kpIHtcbiAgICAgIHZhciBxID0gdGhpcy5xdWVyaWVzW2ldO1xuICAgICAgaWYgKHEuaXNWaWV3UXVlcnkpIHtcbiAgICAgICAgcS51cGRhdGUoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBmaW5kUXVlcnkocXVlcnk6IFF1ZXJ5TWV0YWRhdGEpOiBRdWVyeVJlZiB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnF1ZXJpZXMubGVuZ3RoOyArK2kpIHtcbiAgICAgIHZhciBxID0gdGhpcy5xdWVyaWVzW2ldO1xuICAgICAgaWYgKHEucHJvdG9RdWVyeVJlZi5xdWVyeSA9PT0gcXVlcnkpIHtcbiAgICAgICAgcmV0dXJuIHE7XG4gICAgICB9XG4gICAgfVxuICAgIHRocm93IG5ldyBCYXNlRXhjZXB0aW9uKGBDYW5ub3QgZmluZCBxdWVyeSBmb3IgZGlyZWN0aXZlICR7cXVlcnl9LmApO1xuICB9XG59XG5cbmludGVyZmFjZSBfRWxlbWVudERpcmVjdGl2ZVN0cmF0ZWd5IHtcbiAgZ2V0Q29tcG9uZW50KCk6IGFueTtcbiAgaXNDb21wb25lbnRLZXkoa2V5OiBLZXkpOiBib29sZWFuO1xuICBhZGREaXJlY3RpdmVzTWF0Y2hpbmdRdWVyeShxOiBRdWVyeU1ldGFkYXRhLCByZXM6IGFueVtdKTogdm9pZDtcbiAgaW5pdCgpOiB2b2lkO1xufVxuXG4vKipcbiAqIFN0cmF0ZWd5IHVzZWQgYnkgdGhlIGBFbGVtZW50SW5qZWN0b3JgIHdoZW4gdGhlIG51bWJlciBvZiBwcm92aWRlcnMgaXMgMTAgb3IgbGVzcy5cbiAqIEluIHN1Y2ggYSBjYXNlLCBpbmxpbmluZyBmaWVsZHMgaXMgYmVuZWZpY2lhbCBmb3IgcGVyZm9ybWFuY2VzLlxuICovXG5jbGFzcyBFbGVtZW50RGlyZWN0aXZlSW5saW5lU3RyYXRlZ3kgaW1wbGVtZW50cyBfRWxlbWVudERpcmVjdGl2ZVN0cmF0ZWd5IHtcbiAgY29uc3RydWN0b3IocHVibGljIGluamVjdG9yU3RyYXRlZ3k6IEluamVjdG9ySW5saW5lU3RyYXRlZ3ksIHB1YmxpYyBfZWk6IEFwcEVsZW1lbnQpIHt9XG5cbiAgaW5pdCgpOiB2b2lkIHtcbiAgICB2YXIgaSA9IHRoaXMuaW5qZWN0b3JTdHJhdGVneTtcbiAgICB2YXIgcCA9IGkucHJvdG9TdHJhdGVneTtcbiAgICBpLnJlc2V0Q29uc3RydWN0aW9uQ291bnRlcigpO1xuXG4gICAgaWYgKHAucHJvdmlkZXIwIGluc3RhbmNlb2YgRGlyZWN0aXZlUHJvdmlkZXIgJiYgaXNQcmVzZW50KHAua2V5SWQwKSAmJiBpLm9iajAgPT09IFVOREVGSU5FRClcbiAgICAgIGkub2JqMCA9IGkuaW5zdGFudGlhdGVQcm92aWRlcihwLnByb3ZpZGVyMCwgcC52aXNpYmlsaXR5MCk7XG4gICAgaWYgKHAucHJvdmlkZXIxIGluc3RhbmNlb2YgRGlyZWN0aXZlUHJvdmlkZXIgJiYgaXNQcmVzZW50KHAua2V5SWQxKSAmJiBpLm9iajEgPT09IFVOREVGSU5FRClcbiAgICAgIGkub2JqMSA9IGkuaW5zdGFudGlhdGVQcm92aWRlcihwLnByb3ZpZGVyMSwgcC52aXNpYmlsaXR5MSk7XG4gICAgaWYgKHAucHJvdmlkZXIyIGluc3RhbmNlb2YgRGlyZWN0aXZlUHJvdmlkZXIgJiYgaXNQcmVzZW50KHAua2V5SWQyKSAmJiBpLm9iajIgPT09IFVOREVGSU5FRClcbiAgICAgIGkub2JqMiA9IGkuaW5zdGFudGlhdGVQcm92aWRlcihwLnByb3ZpZGVyMiwgcC52aXNpYmlsaXR5Mik7XG4gICAgaWYgKHAucHJvdmlkZXIzIGluc3RhbmNlb2YgRGlyZWN0aXZlUHJvdmlkZXIgJiYgaXNQcmVzZW50KHAua2V5SWQzKSAmJiBpLm9iajMgPT09IFVOREVGSU5FRClcbiAgICAgIGkub2JqMyA9IGkuaW5zdGFudGlhdGVQcm92aWRlcihwLnByb3ZpZGVyMywgcC52aXNpYmlsaXR5Myk7XG4gICAgaWYgKHAucHJvdmlkZXI0IGluc3RhbmNlb2YgRGlyZWN0aXZlUHJvdmlkZXIgJiYgaXNQcmVzZW50KHAua2V5SWQ0KSAmJiBpLm9iajQgPT09IFVOREVGSU5FRClcbiAgICAgIGkub2JqNCA9IGkuaW5zdGFudGlhdGVQcm92aWRlcihwLnByb3ZpZGVyNCwgcC52aXNpYmlsaXR5NCk7XG4gICAgaWYgKHAucHJvdmlkZXI1IGluc3RhbmNlb2YgRGlyZWN0aXZlUHJvdmlkZXIgJiYgaXNQcmVzZW50KHAua2V5SWQ1KSAmJiBpLm9iajUgPT09IFVOREVGSU5FRClcbiAgICAgIGkub2JqNSA9IGkuaW5zdGFudGlhdGVQcm92aWRlcihwLnByb3ZpZGVyNSwgcC52aXNpYmlsaXR5NSk7XG4gICAgaWYgKHAucHJvdmlkZXI2IGluc3RhbmNlb2YgRGlyZWN0aXZlUHJvdmlkZXIgJiYgaXNQcmVzZW50KHAua2V5SWQ2KSAmJiBpLm9iajYgPT09IFVOREVGSU5FRClcbiAgICAgIGkub2JqNiA9IGkuaW5zdGFudGlhdGVQcm92aWRlcihwLnByb3ZpZGVyNiwgcC52aXNpYmlsaXR5Nik7XG4gICAgaWYgKHAucHJvdmlkZXI3IGluc3RhbmNlb2YgRGlyZWN0aXZlUHJvdmlkZXIgJiYgaXNQcmVzZW50KHAua2V5SWQ3KSAmJiBpLm9iajcgPT09IFVOREVGSU5FRClcbiAgICAgIGkub2JqNyA9IGkuaW5zdGFudGlhdGVQcm92aWRlcihwLnByb3ZpZGVyNywgcC52aXNpYmlsaXR5Nyk7XG4gICAgaWYgKHAucHJvdmlkZXI4IGluc3RhbmNlb2YgRGlyZWN0aXZlUHJvdmlkZXIgJiYgaXNQcmVzZW50KHAua2V5SWQ4KSAmJiBpLm9iajggPT09IFVOREVGSU5FRClcbiAgICAgIGkub2JqOCA9IGkuaW5zdGFudGlhdGVQcm92aWRlcihwLnByb3ZpZGVyOCwgcC52aXNpYmlsaXR5OCk7XG4gICAgaWYgKHAucHJvdmlkZXI5IGluc3RhbmNlb2YgRGlyZWN0aXZlUHJvdmlkZXIgJiYgaXNQcmVzZW50KHAua2V5SWQ5KSAmJiBpLm9iajkgPT09IFVOREVGSU5FRClcbiAgICAgIGkub2JqOSA9IGkuaW5zdGFudGlhdGVQcm92aWRlcihwLnByb3ZpZGVyOSwgcC52aXNpYmlsaXR5OSk7XG4gIH1cblxuICBnZXRDb21wb25lbnQoKTogYW55IHsgcmV0dXJuIHRoaXMuaW5qZWN0b3JTdHJhdGVneS5vYmowOyB9XG5cbiAgaXNDb21wb25lbnRLZXkoa2V5OiBLZXkpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fZWkucHJvdG8uZmlyc3RQcm92aWRlcklzQ29tcG9uZW50ICYmIGlzUHJlc2VudChrZXkpICYmXG4gICAgICAgICAgIGtleS5pZCA9PT0gdGhpcy5pbmplY3RvclN0cmF0ZWd5LnByb3RvU3RyYXRlZ3kua2V5SWQwO1xuICB9XG5cbiAgYWRkRGlyZWN0aXZlc01hdGNoaW5nUXVlcnkocXVlcnk6IFF1ZXJ5TWV0YWRhdGEsIGxpc3Q6IGFueVtdKTogdm9pZCB7XG4gICAgdmFyIGkgPSB0aGlzLmluamVjdG9yU3RyYXRlZ3k7XG4gICAgdmFyIHAgPSBpLnByb3RvU3RyYXRlZ3k7XG4gICAgaWYgKGlzUHJlc2VudChwLnByb3ZpZGVyMCkgJiYgcC5wcm92aWRlcjAua2V5LnRva2VuID09PSBxdWVyeS5zZWxlY3Rvcikge1xuICAgICAgaWYgKGkub2JqMCA9PT0gVU5ERUZJTkVEKSBpLm9iajAgPSBpLmluc3RhbnRpYXRlUHJvdmlkZXIocC5wcm92aWRlcjAsIHAudmlzaWJpbGl0eTApO1xuICAgICAgbGlzdC5wdXNoKGkub2JqMCk7XG4gICAgfVxuICAgIGlmIChpc1ByZXNlbnQocC5wcm92aWRlcjEpICYmIHAucHJvdmlkZXIxLmtleS50b2tlbiA9PT0gcXVlcnkuc2VsZWN0b3IpIHtcbiAgICAgIGlmIChpLm9iajEgPT09IFVOREVGSU5FRCkgaS5vYmoxID0gaS5pbnN0YW50aWF0ZVByb3ZpZGVyKHAucHJvdmlkZXIxLCBwLnZpc2liaWxpdHkxKTtcbiAgICAgIGxpc3QucHVzaChpLm9iajEpO1xuICAgIH1cbiAgICBpZiAoaXNQcmVzZW50KHAucHJvdmlkZXIyKSAmJiBwLnByb3ZpZGVyMi5rZXkudG9rZW4gPT09IHF1ZXJ5LnNlbGVjdG9yKSB7XG4gICAgICBpZiAoaS5vYmoyID09PSBVTkRFRklORUQpIGkub2JqMiA9IGkuaW5zdGFudGlhdGVQcm92aWRlcihwLnByb3ZpZGVyMiwgcC52aXNpYmlsaXR5Mik7XG4gICAgICBsaXN0LnB1c2goaS5vYmoyKTtcbiAgICB9XG4gICAgaWYgKGlzUHJlc2VudChwLnByb3ZpZGVyMykgJiYgcC5wcm92aWRlcjMua2V5LnRva2VuID09PSBxdWVyeS5zZWxlY3Rvcikge1xuICAgICAgaWYgKGkub2JqMyA9PT0gVU5ERUZJTkVEKSBpLm9iajMgPSBpLmluc3RhbnRpYXRlUHJvdmlkZXIocC5wcm92aWRlcjMsIHAudmlzaWJpbGl0eTMpO1xuICAgICAgbGlzdC5wdXNoKGkub2JqMyk7XG4gICAgfVxuICAgIGlmIChpc1ByZXNlbnQocC5wcm92aWRlcjQpICYmIHAucHJvdmlkZXI0LmtleS50b2tlbiA9PT0gcXVlcnkuc2VsZWN0b3IpIHtcbiAgICAgIGlmIChpLm9iajQgPT09IFVOREVGSU5FRCkgaS5vYmo0ID0gaS5pbnN0YW50aWF0ZVByb3ZpZGVyKHAucHJvdmlkZXI0LCBwLnZpc2liaWxpdHk0KTtcbiAgICAgIGxpc3QucHVzaChpLm9iajQpO1xuICAgIH1cbiAgICBpZiAoaXNQcmVzZW50KHAucHJvdmlkZXI1KSAmJiBwLnByb3ZpZGVyNS5rZXkudG9rZW4gPT09IHF1ZXJ5LnNlbGVjdG9yKSB7XG4gICAgICBpZiAoaS5vYmo1ID09PSBVTkRFRklORUQpIGkub2JqNSA9IGkuaW5zdGFudGlhdGVQcm92aWRlcihwLnByb3ZpZGVyNSwgcC52aXNpYmlsaXR5NSk7XG4gICAgICBsaXN0LnB1c2goaS5vYmo1KTtcbiAgICB9XG4gICAgaWYgKGlzUHJlc2VudChwLnByb3ZpZGVyNikgJiYgcC5wcm92aWRlcjYua2V5LnRva2VuID09PSBxdWVyeS5zZWxlY3Rvcikge1xuICAgICAgaWYgKGkub2JqNiA9PT0gVU5ERUZJTkVEKSBpLm9iajYgPSBpLmluc3RhbnRpYXRlUHJvdmlkZXIocC5wcm92aWRlcjYsIHAudmlzaWJpbGl0eTYpO1xuICAgICAgbGlzdC5wdXNoKGkub2JqNik7XG4gICAgfVxuICAgIGlmIChpc1ByZXNlbnQocC5wcm92aWRlcjcpICYmIHAucHJvdmlkZXI3LmtleS50b2tlbiA9PT0gcXVlcnkuc2VsZWN0b3IpIHtcbiAgICAgIGlmIChpLm9iajcgPT09IFVOREVGSU5FRCkgaS5vYmo3ID0gaS5pbnN0YW50aWF0ZVByb3ZpZGVyKHAucHJvdmlkZXI3LCBwLnZpc2liaWxpdHk3KTtcbiAgICAgIGxpc3QucHVzaChpLm9iajcpO1xuICAgIH1cbiAgICBpZiAoaXNQcmVzZW50KHAucHJvdmlkZXI4KSAmJiBwLnByb3ZpZGVyOC5rZXkudG9rZW4gPT09IHF1ZXJ5LnNlbGVjdG9yKSB7XG4gICAgICBpZiAoaS5vYmo4ID09PSBVTkRFRklORUQpIGkub2JqOCA9IGkuaW5zdGFudGlhdGVQcm92aWRlcihwLnByb3ZpZGVyOCwgcC52aXNpYmlsaXR5OCk7XG4gICAgICBsaXN0LnB1c2goaS5vYmo4KTtcbiAgICB9XG4gICAgaWYgKGlzUHJlc2VudChwLnByb3ZpZGVyOSkgJiYgcC5wcm92aWRlcjkua2V5LnRva2VuID09PSBxdWVyeS5zZWxlY3Rvcikge1xuICAgICAgaWYgKGkub2JqOSA9PT0gVU5ERUZJTkVEKSBpLm9iajkgPSBpLmluc3RhbnRpYXRlUHJvdmlkZXIocC5wcm92aWRlcjksIHAudmlzaWJpbGl0eTkpO1xuICAgICAgbGlzdC5wdXNoKGkub2JqOSk7XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogU3RyYXRlZ3kgdXNlZCBieSB0aGUgYEVsZW1lbnRJbmplY3RvcmAgd2hlbiB0aGUgbnVtYmVyIG9mIGJpbmRpbmdzIGlzIDExIG9yIG1vcmUuXG4gKiBJbiBzdWNoIGEgY2FzZSwgdGhlcmUgYXJlIHRvbyBtYW55IGZpZWxkcyB0byBpbmxpbmUgKHNlZSBFbGVtZW50SW5qZWN0b3JJbmxpbmVTdHJhdGVneSkuXG4gKi9cbmNsYXNzIEVsZW1lbnREaXJlY3RpdmVEeW5hbWljU3RyYXRlZ3kgaW1wbGVtZW50cyBfRWxlbWVudERpcmVjdGl2ZVN0cmF0ZWd5IHtcbiAgY29uc3RydWN0b3IocHVibGljIGluamVjdG9yU3RyYXRlZ3k6IEluamVjdG9yRHluYW1pY1N0cmF0ZWd5LCBwdWJsaWMgX2VpOiBBcHBFbGVtZW50KSB7fVxuXG4gIGluaXQoKTogdm9pZCB7XG4gICAgdmFyIGluaiA9IHRoaXMuaW5qZWN0b3JTdHJhdGVneTtcbiAgICB2YXIgcCA9IGluai5wcm90b1N0cmF0ZWd5O1xuICAgIGluai5yZXNldENvbnN0cnVjdGlvbkNvdW50ZXIoKTtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcC5rZXlJZHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChwLnByb3ZpZGVyc1tpXSBpbnN0YW5jZW9mIERpcmVjdGl2ZVByb3ZpZGVyICYmIGlzUHJlc2VudChwLmtleUlkc1tpXSkgJiZcbiAgICAgICAgICBpbmoub2Jqc1tpXSA9PT0gVU5ERUZJTkVEKSB7XG4gICAgICAgIGluai5vYmpzW2ldID0gaW5qLmluc3RhbnRpYXRlUHJvdmlkZXIocC5wcm92aWRlcnNbaV0sIHAudmlzaWJpbGl0aWVzW2ldKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBnZXRDb21wb25lbnQoKTogYW55IHsgcmV0dXJuIHRoaXMuaW5qZWN0b3JTdHJhdGVneS5vYmpzWzBdOyB9XG5cbiAgaXNDb21wb25lbnRLZXkoa2V5OiBLZXkpOiBib29sZWFuIHtcbiAgICB2YXIgcCA9IHRoaXMuaW5qZWN0b3JTdHJhdGVneS5wcm90b1N0cmF0ZWd5O1xuICAgIHJldHVybiB0aGlzLl9laS5wcm90by5maXJzdFByb3ZpZGVySXNDb21wb25lbnQgJiYgaXNQcmVzZW50KGtleSkgJiYga2V5LmlkID09PSBwLmtleUlkc1swXTtcbiAgfVxuXG4gIGFkZERpcmVjdGl2ZXNNYXRjaGluZ1F1ZXJ5KHF1ZXJ5OiBRdWVyeU1ldGFkYXRhLCBsaXN0OiBhbnlbXSk6IHZvaWQge1xuICAgIHZhciBpc3QgPSB0aGlzLmluamVjdG9yU3RyYXRlZ3k7XG4gICAgdmFyIHAgPSBpc3QucHJvdG9TdHJhdGVneTtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcC5wcm92aWRlcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChwLnByb3ZpZGVyc1tpXS5rZXkudG9rZW4gPT09IHF1ZXJ5LnNlbGVjdG9yKSB7XG4gICAgICAgIGlmIChpc3Qub2Jqc1tpXSA9PT0gVU5ERUZJTkVEKSB7XG4gICAgICAgICAgaXN0Lm9ianNbaV0gPSBpc3QuaW5zdGFudGlhdGVQcm92aWRlcihwLnByb3ZpZGVyc1tpXSwgcC52aXNpYmlsaXRpZXNbaV0pO1xuICAgICAgICB9XG4gICAgICAgIGxpc3QucHVzaChpc3Qub2Jqc1tpXSk7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBQcm90b1F1ZXJ5UmVmIHtcbiAgY29uc3RydWN0b3IocHVibGljIGRpckluZGV4OiBudW1iZXIsIHB1YmxpYyBzZXR0ZXI6IFNldHRlckZuLCBwdWJsaWMgcXVlcnk6IFF1ZXJ5TWV0YWRhdGEpIHt9XG5cbiAgZ2V0IHVzZXNQcm9wZXJ0eVN5bnRheCgpOiBib29sZWFuIHsgcmV0dXJuIGlzUHJlc2VudCh0aGlzLnNldHRlcik7IH1cbn1cblxuZXhwb3J0IGNsYXNzIFF1ZXJ5UmVmIHtcbiAgcHVibGljIGxpc3Q6IFF1ZXJ5TGlzdDxhbnk+O1xuICBwdWJsaWMgZGlydHk6IGJvb2xlYW47XG5cbiAgY29uc3RydWN0b3IocHVibGljIHByb3RvUXVlcnlSZWY6IFByb3RvUXVlcnlSZWYsIHByaXZhdGUgb3JpZ2luYXRvcjogQXBwRWxlbWVudCkge1xuICAgIHRoaXMubGlzdCA9IG5ldyBRdWVyeUxpc3Q8YW55PigpO1xuICAgIHRoaXMuZGlydHkgPSB0cnVlO1xuICB9XG5cbiAgZ2V0IGlzVmlld1F1ZXJ5KCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5wcm90b1F1ZXJ5UmVmLnF1ZXJ5LmlzVmlld1F1ZXJ5OyB9XG5cbiAgdXBkYXRlKCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5kaXJ0eSkgcmV0dXJuO1xuICAgIHRoaXMuX3VwZGF0ZSgpO1xuICAgIHRoaXMuZGlydHkgPSBmYWxzZTtcblxuICAgIC8vIFRPRE8gZGVsZXRlIHRoZSBjaGVjayBvbmNlIG9ubHkgZmllbGQgcXVlcmllcyBhcmUgc3VwcG9ydGVkXG4gICAgaWYgKHRoaXMucHJvdG9RdWVyeVJlZi51c2VzUHJvcGVydHlTeW50YXgpIHtcbiAgICAgIHZhciBkaXIgPSB0aGlzLm9yaWdpbmF0b3IuZ2V0RGlyZWN0aXZlQXRJbmRleCh0aGlzLnByb3RvUXVlcnlSZWYuZGlySW5kZXgpO1xuICAgICAgaWYgKHRoaXMucHJvdG9RdWVyeVJlZi5xdWVyeS5maXJzdCkge1xuICAgICAgICB0aGlzLnByb3RvUXVlcnlSZWYuc2V0dGVyKGRpciwgdGhpcy5saXN0Lmxlbmd0aCA+IDAgPyB0aGlzLmxpc3QuZmlyc3QgOiBudWxsKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMucHJvdG9RdWVyeVJlZi5zZXR0ZXIoZGlyLCB0aGlzLmxpc3QpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMubGlzdC5ub3RpZnlPbkNoYW5nZXMoKTtcbiAgfVxuXG4gIHByaXZhdGUgX3VwZGF0ZSgpOiB2b2lkIHtcbiAgICB2YXIgYWdncmVnYXRvciA9IFtdO1xuICAgIGlmICh0aGlzLnByb3RvUXVlcnlSZWYucXVlcnkuaXNWaWV3UXVlcnkpIHtcbiAgICAgIC8vIGludGVudGlvbmFsbHkgc2tpcHBpbmcgb3JpZ2luYXRvciBmb3IgdmlldyBxdWVyaWVzLlxuICAgICAgdmFyIG5lc3RlZFZpZXcgPSB0aGlzLm9yaWdpbmF0b3IuY29tcG9uZW50VmlldztcbiAgICAgIGlmIChpc1ByZXNlbnQobmVzdGVkVmlldykpIHRoaXMuX3Zpc2l0VmlldyhuZXN0ZWRWaWV3LCBhZ2dyZWdhdG9yKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fdmlzaXQodGhpcy5vcmlnaW5hdG9yLCBhZ2dyZWdhdG9yKTtcbiAgICB9XG4gICAgdGhpcy5saXN0LnJlc2V0KGFnZ3JlZ2F0b3IpO1xuICB9O1xuXG4gIHByaXZhdGUgX3Zpc2l0KGluajogQXBwRWxlbWVudCwgYWdncmVnYXRvcjogYW55W10pOiB2b2lkIHtcbiAgICB2YXIgdmlldyA9IGluai5wYXJlbnRWaWV3O1xuICAgIHZhciBzdGFydElkeCA9IGluai5wcm90by5pbmRleDtcbiAgICBmb3IgKHZhciBpID0gc3RhcnRJZHg7IGkgPCB2aWV3LmFwcEVsZW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgY3VySW5qID0gdmlldy5hcHBFbGVtZW50c1tpXTtcbiAgICAgIC8vIFRoZSBmaXJzdCBpbmplY3RvciBhZnRlciBpbmosIHRoYXQgaXMgb3V0c2lkZSB0aGUgc3VidHJlZSByb290ZWQgYXRcbiAgICAgIC8vIGluaiBoYXMgdG8gaGF2ZSBhIG51bGwgcGFyZW50IG9yIGEgcGFyZW50IHRoYXQgaXMgYW4gYW5jZXN0b3Igb2YgaW5qLlxuICAgICAgaWYgKGkgPiBzdGFydElkeCAmJiAoaXNCbGFuayhjdXJJbmoucGFyZW50KSB8fCBjdXJJbmoucGFyZW50LnByb3RvLmluZGV4IDwgc3RhcnRJZHgpKSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuXG4gICAgICBpZiAoIXRoaXMucHJvdG9RdWVyeVJlZi5xdWVyeS5kZXNjZW5kYW50cyAmJlxuICAgICAgICAgICEoY3VySW5qLnBhcmVudCA9PSB0aGlzLm9yaWdpbmF0b3IgfHwgY3VySW5qID09IHRoaXMub3JpZ2luYXRvcikpXG4gICAgICAgIGNvbnRpbnVlO1xuXG4gICAgICAvLyBXZSB2aXNpdCB0aGUgdmlldyBjb250YWluZXIoVkMpIHZpZXdzIHJpZ2h0IGFmdGVyIHRoZSBpbmplY3RvciB0aGF0IGNvbnRhaW5zXG4gICAgICAvLyB0aGUgVkMuIFRoZW9yZXRpY2FsbHksIHRoYXQgbWlnaHQgbm90IGJlIHRoZSByaWdodCBvcmRlciBpZiB0aGVyZSBhcmVcbiAgICAgIC8vIGNoaWxkIGluamVjdG9ycyBvZiBzYWlkIGluamVjdG9yLiBOb3QgY2xlYXIgd2hldGhlciBpZiBzdWNoIGNhc2UgY2FuXG4gICAgICAvLyBldmVuIGJlIGNvbnN0cnVjdGVkIHdpdGggdGhlIGN1cnJlbnQgYXBpcy5cbiAgICAgIHRoaXMuX3Zpc2l0SW5qZWN0b3IoY3VySW5qLCBhZ2dyZWdhdG9yKTtcbiAgICAgIHRoaXMuX3Zpc2l0Vmlld0NvbnRhaW5lclZpZXdzKGN1ckluai5uZXN0ZWRWaWV3cywgYWdncmVnYXRvcik7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfdmlzaXRJbmplY3Rvcihpbmo6IEFwcEVsZW1lbnQsIGFnZ3JlZ2F0b3I6IGFueVtdKSB7XG4gICAgaWYgKHRoaXMucHJvdG9RdWVyeVJlZi5xdWVyeS5pc1ZhckJpbmRpbmdRdWVyeSkge1xuICAgICAgdGhpcy5fYWdncmVnYXRlVmFyaWFibGVCaW5kaW5nKGluaiwgYWdncmVnYXRvcik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX2FnZ3JlZ2F0ZURpcmVjdGl2ZShpbmosIGFnZ3JlZ2F0b3IpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX3Zpc2l0Vmlld0NvbnRhaW5lclZpZXdzKHZpZXdzOiBBcHBWaWV3W10sIGFnZ3JlZ2F0b3I6IGFueVtdKSB7XG4gICAgaWYgKGlzUHJlc2VudCh2aWV3cykpIHtcbiAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgdmlld3MubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgdGhpcy5fdmlzaXRWaWV3KHZpZXdzW2pdLCBhZ2dyZWdhdG9yKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF92aXNpdFZpZXcodmlldzogQXBwVmlldywgYWdncmVnYXRvcjogYW55W10pIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHZpZXcuYXBwRWxlbWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBpbmogPSB2aWV3LmFwcEVsZW1lbnRzW2ldO1xuICAgICAgdGhpcy5fdmlzaXRJbmplY3RvcihpbmosIGFnZ3JlZ2F0b3IpO1xuICAgICAgdGhpcy5fdmlzaXRWaWV3Q29udGFpbmVyVmlld3MoaW5qLm5lc3RlZFZpZXdzLCBhZ2dyZWdhdG9yKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF9hZ2dyZWdhdGVWYXJpYWJsZUJpbmRpbmcoaW5qOiBBcHBFbGVtZW50LCBhZ2dyZWdhdG9yOiBhbnlbXSk6IHZvaWQge1xuICAgIHZhciB2YiA9IHRoaXMucHJvdG9RdWVyeVJlZi5xdWVyeS52YXJCaW5kaW5ncztcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHZiLmxlbmd0aDsgKytpKSB7XG4gICAgICBpZiAoaW5qLmhhc1ZhcmlhYmxlQmluZGluZyh2YltpXSkpIHtcbiAgICAgICAgYWdncmVnYXRvci5wdXNoKGluai5nZXRWYXJpYWJsZUJpbmRpbmcodmJbaV0pKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF9hZ2dyZWdhdGVEaXJlY3RpdmUoaW5qOiBBcHBFbGVtZW50LCBhZ2dyZWdhdG9yOiBhbnlbXSk6IHZvaWQge1xuICAgIGluai5hZGREaXJlY3RpdmVzTWF0Y2hpbmdRdWVyeSh0aGlzLnByb3RvUXVlcnlSZWYucXVlcnksIGFnZ3JlZ2F0b3IpO1xuICB9XG59XG5cbmNsYXNzIF9Db21wb25lbnRWaWV3Q2hhbmdlRGV0ZWN0b3JSZWYgZXh0ZW5kcyBDaGFuZ2VEZXRlY3RvclJlZiB7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgX2FwcEVsZW1lbnQ6IEFwcEVsZW1lbnQpIHsgc3VwZXIoKTsgfVxuXG4gIG1hcmtGb3JDaGVjaygpOiB2b2lkIHsgdGhpcy5fYXBwRWxlbWVudC5jb21wb25lbnRWaWV3LmNoYW5nZURldGVjdG9yLnJlZi5tYXJrRm9yQ2hlY2soKTsgfVxuICBkZXRhY2goKTogdm9pZCB7IHRoaXMuX2FwcEVsZW1lbnQuY29tcG9uZW50Vmlldy5jaGFuZ2VEZXRlY3Rvci5yZWYuZGV0YWNoKCk7IH1cbiAgZGV0ZWN0Q2hhbmdlcygpOiB2b2lkIHsgdGhpcy5fYXBwRWxlbWVudC5jb21wb25lbnRWaWV3LmNoYW5nZURldGVjdG9yLnJlZi5kZXRlY3RDaGFuZ2VzKCk7IH1cbiAgY2hlY2tOb0NoYW5nZXMoKTogdm9pZCB7IHRoaXMuX2FwcEVsZW1lbnQuY29tcG9uZW50Vmlldy5jaGFuZ2VEZXRlY3Rvci5yZWYuY2hlY2tOb0NoYW5nZXMoKTsgfVxuICByZWF0dGFjaCgpOiB2b2lkIHsgdGhpcy5fYXBwRWxlbWVudC5jb21wb25lbnRWaWV3LmNoYW5nZURldGVjdG9yLnJlZi5yZWF0dGFjaCgpOyB9XG59XG4iXX0=