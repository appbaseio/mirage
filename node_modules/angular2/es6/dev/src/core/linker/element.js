import { isPresent, isBlank } from 'angular2/src/facade/lang';
import { BaseException } from 'angular2/src/facade/exceptions';
import { ListWrapper, StringMapWrapper } from 'angular2/src/facade/collection';
import { Injector, Key, Dependency, Provider, NoProviderError } from 'angular2/src/core/di';
import { mergeResolvedProviders } from 'angular2/src/core/di/provider';
import { UNDEFINED, ProtoInjector, Visibility, InjectorInlineStrategy, ProviderWithVisibility } from 'angular2/src/core/di/injector';
import { resolveProvider, ResolvedFactory, ResolvedProvider_ } from 'angular2/src/core/di/provider';
import { AttributeMetadata, QueryMetadata } from '../metadata/di';
import { ViewType } from './view_type';
import { ElementRef_ } from './element_ref';
import { ViewContainerRef } from './view_container_ref';
import { ElementRef } from './element_ref';
import { Renderer } from 'angular2/src/core/render/api';
import { TemplateRef, TemplateRef_ } from './template_ref';
import { DirectiveMetadata, ComponentMetadata } from '../metadata/directives';
import { ChangeDetectorRef } from 'angular2/src/core/change_detection/change_detection';
import { QueryList } from './query_list';
import { reflector } from 'angular2/src/core/reflection/reflection';
import { PipeProvider } from 'angular2/src/core/pipes/pipe_provider';
import { ViewContainerRef_ } from "./view_container_ref";
var _staticKeys;
export class StaticKeys {
    constructor() {
        this.templateRefId = Key.get(TemplateRef).id;
        this.viewContainerId = Key.get(ViewContainerRef).id;
        this.changeDetectorRefId = Key.get(ChangeDetectorRef).id;
        this.elementRefId = Key.get(ElementRef).id;
        this.rendererId = Key.get(Renderer).id;
    }
    static instance() {
        if (isBlank(_staticKeys))
            _staticKeys = new StaticKeys();
        return _staticKeys;
    }
}
export class DirectiveDependency extends Dependency {
    constructor(key, optional, lowerBoundVisibility, upperBoundVisibility, properties, attributeName, queryDecorator) {
        super(key, optional, lowerBoundVisibility, upperBoundVisibility, properties);
        this.attributeName = attributeName;
        this.queryDecorator = queryDecorator;
        this._verify();
    }
    /** @internal */
    _verify() {
        var count = 0;
        if (isPresent(this.queryDecorator))
            count++;
        if (isPresent(this.attributeName))
            count++;
        if (count > 1)
            throw new BaseException('A directive injectable can contain only one of the following @Attribute or @Query.');
    }
    static createFrom(d) {
        return new DirectiveDependency(d.key, d.optional, d.lowerBoundVisibility, d.upperBoundVisibility, d.properties, DirectiveDependency._attributeName(d.properties), DirectiveDependency._query(d.properties));
    }
    /** @internal */
    static _attributeName(properties) {
        var p = properties.find(p => p instanceof AttributeMetadata);
        return isPresent(p) ? p.attributeName : null;
    }
    /** @internal */
    static _query(properties) {
        return properties.find(p => p instanceof QueryMetadata);
    }
}
export class DirectiveProvider extends ResolvedProvider_ {
    constructor(key, factory, deps, isComponent, providers, viewProviders, queries) {
        super(key, [new ResolvedFactory(factory, deps)], false);
        this.isComponent = isComponent;
        this.providers = providers;
        this.viewProviders = viewProviders;
        this.queries = queries;
    }
    get displayName() { return this.key.displayName; }
    static createFromType(type, meta) {
        var provider = new Provider(type, { useClass: type });
        if (isBlank(meta)) {
            meta = new DirectiveMetadata();
        }
        var rb = resolveProvider(provider);
        var rf = rb.resolvedFactories[0];
        var deps = rf.dependencies.map(DirectiveDependency.createFrom);
        var isComponent = meta instanceof ComponentMetadata;
        var resolvedProviders = isPresent(meta.providers) ? Injector.resolve(meta.providers) : null;
        var resolvedViewProviders = meta instanceof ComponentMetadata && isPresent(meta.viewProviders) ?
            Injector.resolve(meta.viewProviders) :
            null;
        var queries = [];
        if (isPresent(meta.queries)) {
            StringMapWrapper.forEach(meta.queries, (meta, fieldName) => {
                var setter = reflector.setter(fieldName);
                queries.push(new QueryMetadataWithSetter(setter, meta));
            });
        }
        // queries passed into the constructor.
        // TODO: remove this after constructor queries are no longer supported
        deps.forEach(d => {
            if (isPresent(d.queryDecorator)) {
                queries.push(new QueryMetadataWithSetter(null, d.queryDecorator));
            }
        });
        return new DirectiveProvider(rb.key, rf.factory, deps, isComponent, resolvedProviders, resolvedViewProviders, queries);
    }
}
export class QueryMetadataWithSetter {
    constructor(setter, metadata) {
        this.setter = setter;
        this.metadata = metadata;
    }
}
function setProvidersVisibility(providers, visibility, result) {
    for (var i = 0; i < providers.length; i++) {
        result.set(providers[i].key.id, visibility);
    }
}
export class AppProtoElement {
    constructor(firstProviderIsComponent, index, attributes, pwvs, protoQueryRefs, directiveVariableBindings) {
        this.firstProviderIsComponent = firstProviderIsComponent;
        this.index = index;
        this.attributes = attributes;
        this.protoQueryRefs = protoQueryRefs;
        this.directiveVariableBindings = directiveVariableBindings;
        var length = pwvs.length;
        if (length > 0) {
            this.protoInjector = new ProtoInjector(pwvs);
        }
        else {
            this.protoInjector = null;
            this.protoQueryRefs = [];
        }
    }
    static create(metadataCache, index, attributes, directiveTypes, directiveVariableBindings) {
        var componentDirProvider = null;
        var mergedProvidersMap = new Map();
        var providerVisibilityMap = new Map();
        var providers = ListWrapper.createGrowableSize(directiveTypes.length);
        var protoQueryRefs = [];
        for (var i = 0; i < directiveTypes.length; i++) {
            var dirProvider = metadataCache.getResolvedDirectiveMetadata(directiveTypes[i]);
            providers[i] = new ProviderWithVisibility(dirProvider, dirProvider.isComponent ? Visibility.PublicAndPrivate : Visibility.Public);
            if (dirProvider.isComponent) {
                componentDirProvider = dirProvider;
            }
            else {
                if (isPresent(dirProvider.providers)) {
                    mergeResolvedProviders(dirProvider.providers, mergedProvidersMap);
                    setProvidersVisibility(dirProvider.providers, Visibility.Public, providerVisibilityMap);
                }
            }
            if (isPresent(dirProvider.viewProviders)) {
                mergeResolvedProviders(dirProvider.viewProviders, mergedProvidersMap);
                setProvidersVisibility(dirProvider.viewProviders, Visibility.Private, providerVisibilityMap);
            }
            for (var queryIdx = 0; queryIdx < dirProvider.queries.length; queryIdx++) {
                var q = dirProvider.queries[queryIdx];
                protoQueryRefs.push(new ProtoQueryRef(i, q.setter, q.metadata));
            }
        }
        if (isPresent(componentDirProvider) && isPresent(componentDirProvider.providers)) {
            // directive providers need to be prioritized over component providers
            mergeResolvedProviders(componentDirProvider.providers, mergedProvidersMap);
            setProvidersVisibility(componentDirProvider.providers, Visibility.Public, providerVisibilityMap);
        }
        mergedProvidersMap.forEach((provider, _) => {
            providers.push(new ProviderWithVisibility(provider, providerVisibilityMap.get(provider.key.id)));
        });
        return new AppProtoElement(isPresent(componentDirProvider), index, attributes, providers, protoQueryRefs, directiveVariableBindings);
    }
    getProviderAtIndex(index) { return this.protoInjector.getProviderAtIndex(index); }
}
class _Context {
    constructor(element, componentElement, injector) {
        this.element = element;
        this.componentElement = componentElement;
        this.injector = injector;
    }
}
export class InjectorWithHostBoundary {
    constructor(injector, hostInjectorBoundary) {
        this.injector = injector;
        this.hostInjectorBoundary = hostInjectorBoundary;
    }
}
export class AppElement {
    constructor(proto, parentView, parent, nativeElement, embeddedViewFactory) {
        this.proto = proto;
        this.parentView = parentView;
        this.parent = parent;
        this.nativeElement = nativeElement;
        this.embeddedViewFactory = embeddedViewFactory;
        this.nestedViews = null;
        this.componentView = null;
        this.ref = new ElementRef_(this);
        var parentInjector = isPresent(parent) ? parent._injector : parentView.parentInjector;
        if (isPresent(this.proto.protoInjector)) {
            var isBoundary;
            if (isPresent(parent) && isPresent(parent.proto.protoInjector)) {
                isBoundary = false;
            }
            else {
                isBoundary = parentView.hostInjectorBoundary;
            }
            this._queryStrategy = this._buildQueryStrategy();
            this._injector = new Injector(this.proto.protoInjector, parentInjector, isBoundary, this, () => this._debugContext());
            // we couple ourselves to the injector strategy to avoid polymorphic calls
            var injectorStrategy = this._injector.internalStrategy;
            this._strategy = injectorStrategy instanceof InjectorInlineStrategy ?
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
    static getViewParentInjector(parentViewType, containerAppElement, imperativelyCreatedProviders, rootInjector) {
        var parentInjector;
        var hostInjectorBoundary;
        switch (parentViewType) {
            case ViewType.COMPONENT:
                parentInjector = containerAppElement._injector;
                hostInjectorBoundary = true;
                break;
            case ViewType.EMBEDDED:
                parentInjector = isPresent(containerAppElement.proto.protoInjector) ?
                    containerAppElement._injector.parent :
                    containerAppElement._injector;
                hostInjectorBoundary = containerAppElement._injector.hostBoundary;
                break;
            case ViewType.HOST:
                if (isPresent(containerAppElement)) {
                    // host view is attached to a container
                    parentInjector = isPresent(containerAppElement.proto.protoInjector) ?
                        containerAppElement._injector.parent :
                        containerAppElement._injector;
                    if (isPresent(imperativelyCreatedProviders)) {
                        var imperativeProvidersWithVisibility = imperativelyCreatedProviders.map(p => new ProviderWithVisibility(p, Visibility.Public));
                        // The imperative injector is similar to having an element between
                        // the dynamic-loaded component and its parent => no boundary between
                        // the component and imperativelyCreatedInjector.
                        parentInjector = new Injector(new ProtoInjector(imperativeProvidersWithVisibility), parentInjector, true, null, null);
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
    }
    attachComponentView(componentView) { this.componentView = componentView; }
    _debugContext() {
        var c = this.parentView.getDebugContext(this, null, null);
        return isPresent(c) ? new _Context(c.element, c.componentElement, c.injector) : null;
    }
    hasVariableBinding(name) {
        var vb = this.proto.directiveVariableBindings;
        return isPresent(vb) && StringMapWrapper.contains(vb, name);
    }
    getVariableBinding(name) {
        var index = this.proto.directiveVariableBindings[name];
        return isPresent(index) ? this.getDirectiveAtIndex(index) : this.getElementRef();
    }
    get(token) { return this._injector.get(token); }
    hasDirective(type) { return isPresent(this._injector.getOptional(type)); }
    getComponent() { return isPresent(this._strategy) ? this._strategy.getComponent() : null; }
    getInjector() { return this._injector; }
    getElementRef() { return this.ref; }
    getViewContainerRef() { return new ViewContainerRef_(this); }
    getTemplateRef() {
        if (isPresent(this.embeddedViewFactory)) {
            return new TemplateRef_(this.ref);
        }
        return null;
    }
    getDependency(injector, provider, dep) {
        if (provider instanceof DirectiveProvider) {
            var dirDep = dep;
            if (isPresent(dirDep.attributeName))
                return this._buildAttribute(dirDep);
            if (isPresent(dirDep.queryDecorator))
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
                if (isBlank(tr) && !dirDep.optional) {
                    throw new NoProviderError(null, dirDep.key);
                }
                return tr;
            }
            if (dirDep.key.id === StaticKeys.instance().rendererId) {
                return this.parentView.renderer;
            }
        }
        else if (provider instanceof PipeProvider) {
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
        return UNDEFINED;
    }
    _buildAttribute(dep) {
        var attributes = this.proto.attributes;
        if (isPresent(attributes) && StringMapWrapper.contains(attributes, dep.attributeName)) {
            return attributes[dep.attributeName];
        }
        else {
            return null;
        }
    }
    addDirectivesMatchingQuery(query, list) {
        var templateRef = this.getTemplateRef();
        if (query.selector === TemplateRef && isPresent(templateRef)) {
            list.push(templateRef);
        }
        if (this._strategy != null) {
            this._strategy.addDirectivesMatchingQuery(query, list);
        }
    }
    _buildQueryStrategy() {
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
    }
    getDirectiveAtIndex(index) { return this._injector.getAt(index); }
    ngAfterViewChecked() {
        if (isPresent(this._queryStrategy))
            this._queryStrategy.updateViewQueries();
    }
    ngAfterContentChecked() {
        if (isPresent(this._queryStrategy))
            this._queryStrategy.updateContentQueries();
    }
    traverseAndSetQueriesAsDirty() {
        var inj = this;
        while (isPresent(inj)) {
            inj._setQueriesAsDirty();
            if (isBlank(inj.parent) && inj.parentView.proto.type === ViewType.EMBEDDED) {
                inj = inj.parentView.containerAppElement;
            }
            else {
                inj = inj.parent;
            }
        }
    }
    _setQueriesAsDirty() {
        if (isPresent(this._queryStrategy)) {
            this._queryStrategy.setContentQueriesAsDirty();
        }
        if (this.parentView.proto.type === ViewType.COMPONENT) {
            this.parentView.containerAppElement._queryStrategy.setViewQueriesAsDirty();
        }
    }
}
class _EmptyQueryStrategy {
    setContentQueriesAsDirty() { }
    setViewQueriesAsDirty() { }
    updateContentQueries() { }
    updateViewQueries() { }
    findQuery(query) {
        throw new BaseException(`Cannot find query for directive ${query}.`);
    }
}
var _emptyQueryStrategy = new _EmptyQueryStrategy();
class InlineQueryStrategy {
    constructor(ei) {
        var protoRefs = ei.proto.protoQueryRefs;
        if (protoRefs.length > 0)
            this.query0 = new QueryRef(protoRefs[0], ei);
        if (protoRefs.length > 1)
            this.query1 = new QueryRef(protoRefs[1], ei);
        if (protoRefs.length > 2)
            this.query2 = new QueryRef(protoRefs[2], ei);
    }
    setContentQueriesAsDirty() {
        if (isPresent(this.query0) && !this.query0.isViewQuery)
            this.query0.dirty = true;
        if (isPresent(this.query1) && !this.query1.isViewQuery)
            this.query1.dirty = true;
        if (isPresent(this.query2) && !this.query2.isViewQuery)
            this.query2.dirty = true;
    }
    setViewQueriesAsDirty() {
        if (isPresent(this.query0) && this.query0.isViewQuery)
            this.query0.dirty = true;
        if (isPresent(this.query1) && this.query1.isViewQuery)
            this.query1.dirty = true;
        if (isPresent(this.query2) && this.query2.isViewQuery)
            this.query2.dirty = true;
    }
    updateContentQueries() {
        if (isPresent(this.query0) && !this.query0.isViewQuery) {
            this.query0.update();
        }
        if (isPresent(this.query1) && !this.query1.isViewQuery) {
            this.query1.update();
        }
        if (isPresent(this.query2) && !this.query2.isViewQuery) {
            this.query2.update();
        }
    }
    updateViewQueries() {
        if (isPresent(this.query0) && this.query0.isViewQuery) {
            this.query0.update();
        }
        if (isPresent(this.query1) && this.query1.isViewQuery) {
            this.query1.update();
        }
        if (isPresent(this.query2) && this.query2.isViewQuery) {
            this.query2.update();
        }
    }
    findQuery(query) {
        if (isPresent(this.query0) && this.query0.protoQueryRef.query === query) {
            return this.query0;
        }
        if (isPresent(this.query1) && this.query1.protoQueryRef.query === query) {
            return this.query1;
        }
        if (isPresent(this.query2) && this.query2.protoQueryRef.query === query) {
            return this.query2;
        }
        throw new BaseException(`Cannot find query for directive ${query}.`);
    }
}
InlineQueryStrategy.NUMBER_OF_SUPPORTED_QUERIES = 3;
class DynamicQueryStrategy {
    constructor(ei) {
        this.queries = ei.proto.protoQueryRefs.map(p => new QueryRef(p, ei));
    }
    setContentQueriesAsDirty() {
        for (var i = 0; i < this.queries.length; ++i) {
            var q = this.queries[i];
            if (!q.isViewQuery)
                q.dirty = true;
        }
    }
    setViewQueriesAsDirty() {
        for (var i = 0; i < this.queries.length; ++i) {
            var q = this.queries[i];
            if (q.isViewQuery)
                q.dirty = true;
        }
    }
    updateContentQueries() {
        for (var i = 0; i < this.queries.length; ++i) {
            var q = this.queries[i];
            if (!q.isViewQuery) {
                q.update();
            }
        }
    }
    updateViewQueries() {
        for (var i = 0; i < this.queries.length; ++i) {
            var q = this.queries[i];
            if (q.isViewQuery) {
                q.update();
            }
        }
    }
    findQuery(query) {
        for (var i = 0; i < this.queries.length; ++i) {
            var q = this.queries[i];
            if (q.protoQueryRef.query === query) {
                return q;
            }
        }
        throw new BaseException(`Cannot find query for directive ${query}.`);
    }
}
/**
 * Strategy used by the `ElementInjector` when the number of providers is 10 or less.
 * In such a case, inlining fields is beneficial for performances.
 */
class ElementDirectiveInlineStrategy {
    constructor(injectorStrategy, _ei) {
        this.injectorStrategy = injectorStrategy;
        this._ei = _ei;
    }
    init() {
        var i = this.injectorStrategy;
        var p = i.protoStrategy;
        i.resetConstructionCounter();
        if (p.provider0 instanceof DirectiveProvider && isPresent(p.keyId0) && i.obj0 === UNDEFINED)
            i.obj0 = i.instantiateProvider(p.provider0, p.visibility0);
        if (p.provider1 instanceof DirectiveProvider && isPresent(p.keyId1) && i.obj1 === UNDEFINED)
            i.obj1 = i.instantiateProvider(p.provider1, p.visibility1);
        if (p.provider2 instanceof DirectiveProvider && isPresent(p.keyId2) && i.obj2 === UNDEFINED)
            i.obj2 = i.instantiateProvider(p.provider2, p.visibility2);
        if (p.provider3 instanceof DirectiveProvider && isPresent(p.keyId3) && i.obj3 === UNDEFINED)
            i.obj3 = i.instantiateProvider(p.provider3, p.visibility3);
        if (p.provider4 instanceof DirectiveProvider && isPresent(p.keyId4) && i.obj4 === UNDEFINED)
            i.obj4 = i.instantiateProvider(p.provider4, p.visibility4);
        if (p.provider5 instanceof DirectiveProvider && isPresent(p.keyId5) && i.obj5 === UNDEFINED)
            i.obj5 = i.instantiateProvider(p.provider5, p.visibility5);
        if (p.provider6 instanceof DirectiveProvider && isPresent(p.keyId6) && i.obj6 === UNDEFINED)
            i.obj6 = i.instantiateProvider(p.provider6, p.visibility6);
        if (p.provider7 instanceof DirectiveProvider && isPresent(p.keyId7) && i.obj7 === UNDEFINED)
            i.obj7 = i.instantiateProvider(p.provider7, p.visibility7);
        if (p.provider8 instanceof DirectiveProvider && isPresent(p.keyId8) && i.obj8 === UNDEFINED)
            i.obj8 = i.instantiateProvider(p.provider8, p.visibility8);
        if (p.provider9 instanceof DirectiveProvider && isPresent(p.keyId9) && i.obj9 === UNDEFINED)
            i.obj9 = i.instantiateProvider(p.provider9, p.visibility9);
    }
    getComponent() { return this.injectorStrategy.obj0; }
    isComponentKey(key) {
        return this._ei.proto.firstProviderIsComponent && isPresent(key) &&
            key.id === this.injectorStrategy.protoStrategy.keyId0;
    }
    addDirectivesMatchingQuery(query, list) {
        var i = this.injectorStrategy;
        var p = i.protoStrategy;
        if (isPresent(p.provider0) && p.provider0.key.token === query.selector) {
            if (i.obj0 === UNDEFINED)
                i.obj0 = i.instantiateProvider(p.provider0, p.visibility0);
            list.push(i.obj0);
        }
        if (isPresent(p.provider1) && p.provider1.key.token === query.selector) {
            if (i.obj1 === UNDEFINED)
                i.obj1 = i.instantiateProvider(p.provider1, p.visibility1);
            list.push(i.obj1);
        }
        if (isPresent(p.provider2) && p.provider2.key.token === query.selector) {
            if (i.obj2 === UNDEFINED)
                i.obj2 = i.instantiateProvider(p.provider2, p.visibility2);
            list.push(i.obj2);
        }
        if (isPresent(p.provider3) && p.provider3.key.token === query.selector) {
            if (i.obj3 === UNDEFINED)
                i.obj3 = i.instantiateProvider(p.provider3, p.visibility3);
            list.push(i.obj3);
        }
        if (isPresent(p.provider4) && p.provider4.key.token === query.selector) {
            if (i.obj4 === UNDEFINED)
                i.obj4 = i.instantiateProvider(p.provider4, p.visibility4);
            list.push(i.obj4);
        }
        if (isPresent(p.provider5) && p.provider5.key.token === query.selector) {
            if (i.obj5 === UNDEFINED)
                i.obj5 = i.instantiateProvider(p.provider5, p.visibility5);
            list.push(i.obj5);
        }
        if (isPresent(p.provider6) && p.provider6.key.token === query.selector) {
            if (i.obj6 === UNDEFINED)
                i.obj6 = i.instantiateProvider(p.provider6, p.visibility6);
            list.push(i.obj6);
        }
        if (isPresent(p.provider7) && p.provider7.key.token === query.selector) {
            if (i.obj7 === UNDEFINED)
                i.obj7 = i.instantiateProvider(p.provider7, p.visibility7);
            list.push(i.obj7);
        }
        if (isPresent(p.provider8) && p.provider8.key.token === query.selector) {
            if (i.obj8 === UNDEFINED)
                i.obj8 = i.instantiateProvider(p.provider8, p.visibility8);
            list.push(i.obj8);
        }
        if (isPresent(p.provider9) && p.provider9.key.token === query.selector) {
            if (i.obj9 === UNDEFINED)
                i.obj9 = i.instantiateProvider(p.provider9, p.visibility9);
            list.push(i.obj9);
        }
    }
}
/**
 * Strategy used by the `ElementInjector` when the number of bindings is 11 or more.
 * In such a case, there are too many fields to inline (see ElementInjectorInlineStrategy).
 */
class ElementDirectiveDynamicStrategy {
    constructor(injectorStrategy, _ei) {
        this.injectorStrategy = injectorStrategy;
        this._ei = _ei;
    }
    init() {
        var inj = this.injectorStrategy;
        var p = inj.protoStrategy;
        inj.resetConstructionCounter();
        for (var i = 0; i < p.keyIds.length; i++) {
            if (p.providers[i] instanceof DirectiveProvider && isPresent(p.keyIds[i]) &&
                inj.objs[i] === UNDEFINED) {
                inj.objs[i] = inj.instantiateProvider(p.providers[i], p.visibilities[i]);
            }
        }
    }
    getComponent() { return this.injectorStrategy.objs[0]; }
    isComponentKey(key) {
        var p = this.injectorStrategy.protoStrategy;
        return this._ei.proto.firstProviderIsComponent && isPresent(key) && key.id === p.keyIds[0];
    }
    addDirectivesMatchingQuery(query, list) {
        var ist = this.injectorStrategy;
        var p = ist.protoStrategy;
        for (var i = 0; i < p.providers.length; i++) {
            if (p.providers[i].key.token === query.selector) {
                if (ist.objs[i] === UNDEFINED) {
                    ist.objs[i] = ist.instantiateProvider(p.providers[i], p.visibilities[i]);
                }
                list.push(ist.objs[i]);
            }
        }
    }
}
export class ProtoQueryRef {
    constructor(dirIndex, setter, query) {
        this.dirIndex = dirIndex;
        this.setter = setter;
        this.query = query;
    }
    get usesPropertySyntax() { return isPresent(this.setter); }
}
export class QueryRef {
    constructor(protoQueryRef, originator) {
        this.protoQueryRef = protoQueryRef;
        this.originator = originator;
        this.list = new QueryList();
        this.dirty = true;
    }
    get isViewQuery() { return this.protoQueryRef.query.isViewQuery; }
    update() {
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
    }
    _update() {
        var aggregator = [];
        if (this.protoQueryRef.query.isViewQuery) {
            // intentionally skipping originator for view queries.
            var nestedView = this.originator.componentView;
            if (isPresent(nestedView))
                this._visitView(nestedView, aggregator);
        }
        else {
            this._visit(this.originator, aggregator);
        }
        this.list.reset(aggregator);
    }
    ;
    _visit(inj, aggregator) {
        var view = inj.parentView;
        var startIdx = inj.proto.index;
        for (var i = startIdx; i < view.appElements.length; i++) {
            var curInj = view.appElements[i];
            // The first injector after inj, that is outside the subtree rooted at
            // inj has to have a null parent or a parent that is an ancestor of inj.
            if (i > startIdx && (isBlank(curInj.parent) || curInj.parent.proto.index < startIdx)) {
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
    }
    _visitInjector(inj, aggregator) {
        if (this.protoQueryRef.query.isVarBindingQuery) {
            this._aggregateVariableBinding(inj, aggregator);
        }
        else {
            this._aggregateDirective(inj, aggregator);
        }
    }
    _visitViewContainerViews(views, aggregator) {
        if (isPresent(views)) {
            for (var j = 0; j < views.length; j++) {
                this._visitView(views[j], aggregator);
            }
        }
    }
    _visitView(view, aggregator) {
        for (var i = 0; i < view.appElements.length; i++) {
            var inj = view.appElements[i];
            this._visitInjector(inj, aggregator);
            this._visitViewContainerViews(inj.nestedViews, aggregator);
        }
    }
    _aggregateVariableBinding(inj, aggregator) {
        var vb = this.protoQueryRef.query.varBindings;
        for (var i = 0; i < vb.length; ++i) {
            if (inj.hasVariableBinding(vb[i])) {
                aggregator.push(inj.getVariableBinding(vb[i]));
            }
        }
    }
    _aggregateDirective(inj, aggregator) {
        inj.addDirectivesMatchingQuery(this.protoQueryRef.query, aggregator);
    }
}
class _ComponentViewChangeDetectorRef extends ChangeDetectorRef {
    constructor(_appElement) {
        super();
        this._appElement = _appElement;
    }
    markForCheck() { this._appElement.componentView.changeDetector.ref.markForCheck(); }
    detach() { this._appElement.componentView.changeDetector.ref.detach(); }
    detectChanges() { this._appElement.componentView.changeDetector.ref.detectChanges(); }
    checkNoChanges() { this._appElement.componentView.changeDetector.ref.checkNoChanges(); }
    reattach() { this._appElement.componentView.changeDetector.ref.reattach(); }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWxlbWVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRpZmZpbmdfcGx1Z2luX3dyYXBwZXItb3V0cHV0X3BhdGgtb1hETzRwMnYudG1wL2FuZ3VsYXIyL3NyYy9jb3JlL2xpbmtlci9lbGVtZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJPQUFPLEVBQ0wsU0FBUyxFQUNULE9BQU8sRUFLUixNQUFNLDBCQUEwQjtPQUMxQixFQUFDLGFBQWEsRUFBQyxNQUFNLGdDQUFnQztPQUNyRCxFQUFDLFdBQVcsRUFBYyxnQkFBZ0IsRUFBQyxNQUFNLGdDQUFnQztPQUNqRixFQUNMLFFBQVEsRUFDUixHQUFHLEVBQ0gsVUFBVSxFQUVWLFFBQVEsRUFFUixlQUFlLEVBS2hCLE1BQU0sc0JBQXNCO09BQ3RCLEVBQUMsc0JBQXNCLEVBQUMsTUFBTSwrQkFBK0I7T0FDN0QsRUFDTCxTQUFTLEVBQ1QsYUFBYSxFQUNiLFVBQVUsRUFDVixzQkFBc0IsRUFFdEIsc0JBQXNCLEVBRXZCLE1BQU0sK0JBQStCO09BQy9CLEVBQUMsZUFBZSxFQUFFLGVBQWUsRUFBRSxpQkFBaUIsRUFBQyxNQUFNLCtCQUErQjtPQUUxRixFQUFDLGlCQUFpQixFQUFFLGFBQWEsRUFBQyxNQUFNLGdCQUFnQjtPQUd4RCxFQUFDLFFBQVEsRUFBQyxNQUFNLGFBQWE7T0FDN0IsRUFBQyxXQUFXLEVBQUMsTUFBTSxlQUFlO09BRWxDLEVBQUMsZ0JBQWdCLEVBQUMsTUFBTSxzQkFBc0I7T0FDOUMsRUFBQyxVQUFVLEVBQUMsTUFBTSxlQUFlO09BQ2pDLEVBQUMsUUFBUSxFQUFDLE1BQU0sOEJBQThCO09BQzlDLEVBQUMsV0FBVyxFQUFFLFlBQVksRUFBQyxNQUFNLGdCQUFnQjtPQUNqRCxFQUFDLGlCQUFpQixFQUFFLGlCQUFpQixFQUFDLE1BQU0sd0JBQXdCO09BQ3BFLEVBRUwsaUJBQWlCLEVBQ2xCLE1BQU0scURBQXFEO09BQ3JELEVBQUMsU0FBUyxFQUFDLE1BQU0sY0FBYztPQUMv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LE1BQU0sRUFBRSxDQUFDO1FBQ3ZCLENBQUM7UUFDRCxFQUFFLENBQUMsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztZQUN0RCxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQ3ZCLENBQUM7UUFDRCxFQUFFLENBQUMsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztZQUN0RCxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQ3ZCLENBQUM7SUFDSCxDQUFDO0lBRUQsU0FBUyxDQUFDLEtBQW9CO1FBQzVCLEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsS0FBSyxLQUFLLEtBQUssQ0FBQyxDQUFDLENBQUM7WUFDeEUsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUM7UUFDckIsQ0FBQztRQUNELEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsS0FBSyxLQUFLLEtBQUssQ0FBQyxDQUFDLENBQUM7WUFDeEUsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUM7UUFDckIsQ0FBQztRQUNELEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsS0FBSyxLQUFLLEtBQUssQ0FBQyxDQUFDLENBQUM7WUFDeEUsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUM7UUFDckIsQ0FBQztRQUNELE1BQU0sSUFBSSxhQUFhLENBQUMsbUNBQW1DLEtBQUssR0FBRyxDQUFDLENBQUM7SUFDdkUsQ0FB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RSxhQUFhLEtBQVcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxhQUFhLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDNUYsY0FBYyxLQUFXLElBQUksQ0FBQyxXQUFXLENBQUMsYUFBYSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsY0FBYyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQzlGLFFBQVEsS0FBVyxJQUFJLENBQUMsV0FBVyxDQUFDLGFBQWEsQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUNwRixDQUFDO0FBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBpc1ByZXNlbnQsXG4gIGlzQmxhbmssXG4gIFR5cGUsXG4gIHN0cmluZ2lmeSxcbiAgQ09OU1RfRVhQUixcbiAgU3RyaW5nV3JhcHBlclxufSBmcm9tICdhbmd1bGFyMi9zcmMvZmFjYWRlL2xhbmcnO1xuaW1wb3J0IHtCYXNlRXhjZXB0aW9ufSBmcm9tICdhbmd1bGFyMi9zcmMvZmFjYWRlL2V4Y2VwdGlvbnMnO1xuaW1wb3J0IHtMaXN0V3JhcHBlciwgTWFwV3JhcHBlciwgU3RyaW5nTWFwV3JhcHBlcn0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9jb2xsZWN0aW9uJztcbmltcG9ydCB7XG4gIEluamVjdG9yLFxuICBLZXksXG4gIERlcGVuZGVuY3ksXG4gIHByb3ZpZGUsXG4gIFByb3ZpZGVyLFxuICBSZXNvbHZlZFByb3ZpZGVyLFxuICBOb1Byb3ZpZGVyRXJyb3IsXG4gIEFic3RyYWN0UHJvdmlkZXJFcnJvcixcbiAgQ3ljbGljRGVwZW5kZW5jeUVycm9yLFxuICByZXNvbHZlRm9yd2FyZFJlZixcbiAgSW5qZWN0YWJsZVxufSBmcm9tICdhbmd1bGFyMi9zcmMvY29yZS9kaSc7XG5pbXBvcnQge21lcmdlUmVzb2x2ZWRQcm92aWRlcnN9IGZyb20gJ2FuZ3VsYXIyL3NyYy9jb3JlL2RpL3Byb3ZpZGVyJztcbmltcG9ydCB7XG4gIFVOREVGSU5FRCxcbiAgUHJvdG9JbmplY3RvcixcbiAgVmlzaWJpbGl0eSxcbiAgSW5qZWN0b3JJbmxpbmVTdHJhdGVneSxcbiAgSW5qZWN0b3JEeW5hbWljU3RyYXRlZ3ksXG4gIFByb3ZpZGVyV2l0aFZpc2liaWxpdHksXG4gIERlcGVuZGVuY3lQcm92aWRlclxufSBmcm9tICdhbmd1bGFyMi9zcmMvY29yZS9kaS9pbmplY3Rvcic7XG5pbXBvcnQge3Jlc29sdmVQcm92aWRlciwgUmVzb2x2ZWRGYWN0b3J5LCBSZXNvbHZlZFByb3ZpZGVyX30gZnJvbSAnYW5ndWxhcjIvc3JjL2NvcmUvZGkvcHJvdmlkZXInO1xuXG5pbXBvcnQge0F0dHJpYnV0ZU1ldGFkYXRhLCBRdWVyeU1ldGFkYXRhfSBmcm9tICcuLi9tZXRhZGF0YS9kaSc7XG5cbmltcG9ydCB7QXBwVmlld30gZnJvbSAnLi92aWV3JztcbmltcG9ydCB7Vmlld1R5cGV9IGZyb20gJy4vdmlld190eXBlJztcbmltcG9ydCB7RWxlbWVudFJlZl99IGZyb20gJy4vZWxlbWVudF9yZWYnO1xuXG5pbXBvcnQge1ZpZXdDb250YWluZXJSZWZ9IGZyb20gJy4vdmlld19jb250YWluZXJfcmVmJztcbmltcG9ydCB7RWxlbWVudFJlZn0gZnJvbSAnLi9lbGVtZW50X3JlZic7XG5pbXBvcnQge1JlbmRlcmVyfSBmcm9tICdhbmd1bGFyMi9zcmMvY29yZS9yZW5kZXIvYXBpJztcbmltcG9ydCB7VGVtcGxhdGVSZWYsIFRlbXBsYXRlUmVmX30gZnJvbSAnLi90ZW1wbGF0ZV9yZWYnO1xuaW1wb3J0IHtEaXJlY3RpdmVNZXRhZGF0YSwgQ29tcG9uZW50TWV0YWRhdGF9IGZyb20gJy4uL21ldGFkYXRhL2RpcmVjdGl2ZXMnO1xuaW1wb3J0IHtcbiAgQ2hhbmdlRGV0ZWN0b3IsXG4gIENoYW5nZURldGVjdG9yUmVmXG59IGZyb20gJ2FuZ3VsYXIyL3NyYy9jb3JlL2NoYW5nZV9kZXRlY3Rpb24vY2hhbmdlX2RldGVjdGlvbic7XG5pbXBvcnQge1F1ZXJ5TGlzdH0gZnJvbSAnLi9xdWVyeV9saXN0JztcbmltcG9ydCB7cmVmbGVjdG9yfSBmcm9tICdhbmd1bGFyMi9zcmMvY29yZS9yZWZsZWN0aW9uL3JlZmxlY3Rpb24nO1xuaW1wb3J0IHtTZXR0ZXJGbn0gZnJvbSAnYW5ndWxhcjIvc3JjL2NvcmUvcmVmbGVjdGlvbi90eXBlcyc7XG5pbXBvcnQge0FmdGVyVmlld0NoZWNrZWR9IGZyb20gJ2FuZ3VsYXIyL3NyYy9jb3JlL2xpbmtlci9pbnRlcmZhY2VzJztcbmltcG9ydCB7UGlwZVByb3ZpZGVyfSBmcm9tICdhbmd1bGFyMi9zcmMvY29yZS9waXBlcy9waXBlX3Byb3ZpZGVyJztcblxuaW1wb3J0IHtWaWV3Q29udGFpbmVyUmVmX30gZnJvbSBcIi4vdmlld19jb250YWluZXJfcmVmXCI7XG5pbXBvcnQge1Jlc29sdmVkTWV0YWRhdGFDYWNoZX0gZnJvbSAnLi9yZXNvbHZlZF9tZXRhZGF0YV9jYWNoZSc7XG5cbnZhciBfc3RhdGljS2V5cztcblxuZXhwb3J0IGNsYXNzIFN0YXRpY0tleXMge1xuICB0ZW1wbGF0ZVJlZklkOiBudW1iZXI7XG4gIHZpZXdDb250YWluZXJJZDogbnVtYmVyO1xuICBjaGFuZ2VEZXRlY3RvclJlZklkOiBudW1iZXI7XG4gIGVsZW1lbnRSZWZJZDogbnVtYmVyO1xuICByZW5kZXJlcklkOiBudW1iZXI7XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy50ZW1wbGF0ZVJlZklkID0gS2V5LmdldChUZW1wbGF0ZVJlZikuaWQ7XG4gICAgdGhpcy52aWV3Q29udGFpbmVySWQgPSBLZXkuZ2V0KFZpZXdDb250YWluZXJSZWYpLmlkO1xuICAgIHRoaXMuY2hhbmdlRGV0ZWN0b3JSZWZJZCA9IEtleS5nZXQoQ2hhbmdlRGV0ZWN0b3JSZWYpLmlkO1xuICAgIHRoaXMuZWxlbWVudFJlZklkID0gS2V5LmdldChFbGVtZW50UmVmKS5pZDtcbiAgICB0aGlzLnJlbmRlcmVySWQgPSBLZXkuZ2V0KFJlbmRlcmVyKS5pZDtcbiAgfVxuXG4gIHN0YXRpYyBpbnN0YW5jZSgpOiBTdGF0aWNLZXlzIHtcbiAgICBpZiAoaXNCbGFuayhfc3RhdGljS2V5cykpIF9zdGF0aWNLZXlzID0gbmV3IFN0YXRpY0tleXMoKTtcbiAgICByZXR1cm4gX3N0YXRpY0tleXM7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIERpcmVjdGl2ZURlcGVuZGVuY3kgZXh0ZW5kcyBEZXBlbmRlbmN5IHtcbiAgY29uc3RydWN0b3Ioa2V5OiBLZXksIG9wdGlvbmFsOiBib29sZWFuLCBsb3dlckJvdW5kVmlzaWJpbGl0eTogT2JqZWN0LFxuICAgICAgICAgICAgICB1cHBlckJvdW5kVmlzaWJpbGl0eTogT2JqZWN0LCBwcm9wZXJ0aWVzOiBhbnlbXSwgcHVibGljIGF0dHJpYnV0ZU5hbWU6IHN0cmluZyxcbiAgICAgICAgICAgICAgcHVibGljIHF1ZXJ5RGVjb3JhdG9yOiBRdWVyeU1ldGFkYXRhKSB7XG4gICAgc3VwZXIoa2V5LCBvcHRpb25hbCwgbG93ZXJCb3VuZFZpc2liaWxpdHksIHVwcGVyQm91bmRWaXNpYmlsaXR5LCBwcm9wZXJ0aWVzKTtcbiAgICB0aGlzLl92ZXJpZnkoKTtcbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX3ZlcmlmeSgpOiB2b2lkIHtcbiAgICB2YXIgY291bnQgPSAwO1xuICAgIGlmIChpc1ByZXNlbnQodGhpcy5xdWVyeURlY29yYXRvcikpIGNvdW50Kys7XG4gICAgaWYgKGlzUHJlc2VudCh0aGlzLmF0dHJpYnV0ZU5hbWUpKSBjb3VudCsrO1xuICAgIGlmIChjb3VudCA+IDEpXG4gICAgICB0aHJvdyBuZXcgQmFzZUV4Y2VwdGlvbihcbiAgICAgICAgICAnQSBkaXJlY3RpdmUgaW5qZWN0YWJsZSBjYW4gY29udGFpbiBvbmx5IG9uZSBvZiB0aGUgZm9sbG93aW5nIEBBdHRyaWJ1dGUgb3IgQFF1ZXJ5LicpO1xuICB9XG5cbiAgc3RhdGljIGNyZWF0ZUZyb20oZDogRGVwZW5kZW5jeSk6IERpcmVjdGl2ZURlcGVuZGVuY3kge1xuICAgIHJldHVybiBuZXcgRGlyZWN0aXZlRGVwZW5kZW5jeShcbiAgICAgICAgZC5rZXksIGQub3B0aW9uYWwsIGQubG93ZXJCb3VuZFZpc2liaWxpdHksIGQudXBwZXJCb3VuZFZpc2liaWxpdHksIGQucHJvcGVydGllcyxcbiAgICAgICAgRGlyZWN0aXZlRGVwZW5kZW5jeS5fYXR0cmlidXRlTmFtZShkLnByb3BlcnRpZXMpLCBEaXJlY3RpdmVEZXBlbmRlbmN5Ll9xdWVyeShkLnByb3BlcnRpZXMpKTtcbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgc3RhdGljIF9hdHRyaWJ1dGVOYW1lKHByb3BlcnRpZXM6IGFueVtdKTogc3RyaW5nIHtcbiAgICB2YXIgcCA9IDxBdHRyaWJ1dGVNZXRhZGF0YT5wcm9wZXJ0aWVzLmZpbmQocCA9PiBwIGluc3RhbmNlb2YgQXR0cmlidXRlTWV0YWRhdGEpO1xuICAgIHJldHVybiBpc1ByZXNlbnQocCkgPyBwLmF0dHJpYnV0ZU5hbWUgOiBudWxsO1xuICB9XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBzdGF0aWMgX3F1ZXJ5KHByb3BlcnRpZXM6IGFueVtdKTogUXVlcnlNZXRhZGF0YSB7XG4gICAgcmV0dXJuIDxRdWVyeU1ldGFkYXRhPnByb3BlcnRpZXMuZmluZChwID0+IHAgaW5zdGFuY2VvZiBRdWVyeU1ldGFkYXRhKTtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgRGlyZWN0aXZlUHJvdmlkZXIgZXh0ZW5kcyBSZXNvbHZlZFByb3ZpZGVyXyB7XG4gIGNvbnN0cnVjdG9yKGtleTogS2V5LCBmYWN0b3J5OiBGdW5jdGlvbiwgZGVwczogRGVwZW5kZW5jeVtdLCBwdWJsaWMgaXNDb21wb25lbnQ6IGJvb2xlYW4sXG4gICAgICAgICAgICAgIHB1YmxpYyBwcm92aWRlcnM6IFJlc29sdmVkUHJvdmlkZXJbXSwgcHVibGljIHZpZXdQcm92aWRlcnM6IFJlc29sdmVkUHJvdmlkZXJbXSxcbiAgICAgICAgICAgICAgcHVibGljIHF1ZXJpZXM6IFF1ZXJ5TWV0YWRhdGFXaXRoU2V0dGVyW10pIHtcbiAgICBzdXBlcihrZXksIFtuZXcgUmVzb2x2ZWRGYWN0b3J5KGZhY3RvcnksIGRlcHMpXSwgZmFsc2UpO1xuICB9XG5cbiAgZ2V0IGRpc3BsYXlOYW1lKCk6IHN0cmluZyB7IHJldHVybiB0aGlzLmtleS5kaXNwbGF5TmFtZTsgfVxuXG4gIHN0YXRpYyBjcmVhdGVGcm9tVHlwZSh0eXBlOiBUeXBlLCBtZXRhOiBEaXJlY3RpdmVNZXRhZGF0YSk6IERpcmVjdGl2ZVByb3ZpZGVyIHtcbiAgICB2YXIgcHJvdmlkZXIgPSBuZXcgUHJvdmlkZXIodHlwZSwge3VzZUNsYXNzOiB0eXBlfSk7XG4gICAgaWYgKGlzQmxhbmsobWV0YSkpIHtcbiAgICAgIG1ldGEgPSBuZXcgRGlyZWN0aXZlTWV0YWRhdGEoKTtcbiAgICB9XG4gICAgdmFyIHJiID0gcmVzb2x2ZVByb3ZpZGVyKHByb3ZpZGVyKTtcbiAgICB2YXIgcmYgPSByYi5yZXNvbHZlZEZhY3Rvcmllc1swXTtcbiAgICB2YXIgZGVwczogRGlyZWN0aXZlRGVwZW5kZW5jeVtdID0gcmYuZGVwZW5kZW5jaWVzLm1hcChEaXJlY3RpdmVEZXBlbmRlbmN5LmNyZWF0ZUZyb20pO1xuICAgIHZhciBpc0NvbXBvbmVudCA9IG1ldGEgaW5zdGFuY2VvZiBDb21wb25lbnRNZXRhZGF0YTtcbiAgICB2YXIgcmVzb2x2ZWRQcm92aWRlcnMgPSBpc1ByZXNlbnQobWV0YS5wcm92aWRlcnMpID8gSW5qZWN0b3IucmVzb2x2ZShtZXRhLnByb3ZpZGVycykgOiBudWxsO1xuICAgIHZhciByZXNvbHZlZFZpZXdQcm92aWRlcnMgPSBtZXRhIGluc3RhbmNlb2YgQ29tcG9uZW50TWV0YWRhdGEgJiYgaXNQcmVzZW50KG1ldGEudmlld1Byb3ZpZGVycykgP1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgSW5qZWN0b3IucmVzb2x2ZShtZXRhLnZpZXdQcm92aWRlcnMpIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG51bGw7XG4gICAgdmFyIHF1ZXJpZXMgPSBbXTtcbiAgICBpZiAoaXNQcmVzZW50KG1ldGEucXVlcmllcykpIHtcbiAgICAgIFN0cmluZ01hcFdyYXBwZXIuZm9yRWFjaChtZXRhLnF1ZXJpZXMsIChtZXRhLCBmaWVsZE5hbWUpID0+IHtcbiAgICAgICAgdmFyIHNldHRlciA9IHJlZmxlY3Rvci5zZXR0ZXIoZmllbGROYW1lKTtcbiAgICAgICAgcXVlcmllcy5wdXNoKG5ldyBRdWVyeU1ldGFkYXRhV2l0aFNldHRlcihzZXR0ZXIsIG1ldGEpKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgICAvLyBxdWVyaWVzIHBhc3NlZCBpbnRvIHRoZSBjb25zdHJ1Y3Rvci5cbiAgICAvLyBUT0RPOiByZW1vdmUgdGhpcyBhZnRlciBjb25zdHJ1Y3RvciBxdWVyaWVzIGFyZSBubyBsb25nZXIgc3VwcG9ydGVkXG4gICAgZGVwcy5mb3JFYWNoKGQgPT4ge1xuICAgICAgaWYgKGlzUHJlc2VudChkLnF1ZXJ5RGVjb3JhdG9yKSkge1xuICAgICAgICBxdWVyaWVzLnB1c2gobmV3IFF1ZXJ5TWV0YWRhdGFXaXRoU2V0dGVyKG51bGwsIGQucXVlcnlEZWNvcmF0b3IpKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gbmV3IERpcmVjdGl2ZVByb3ZpZGVyKHJiLmtleSwgcmYuZmFjdG9yeSwgZGVwcywgaXNDb21wb25lbnQsIHJlc29sdmVkUHJvdmlkZXJzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZWRWaWV3UHJvdmlkZXJzLCBxdWVyaWVzKTtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgUXVlcnlNZXRhZGF0YVdpdGhTZXR0ZXIge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgc2V0dGVyOiBTZXR0ZXJGbiwgcHVibGljIG1ldGFkYXRhOiBRdWVyeU1ldGFkYXRhKSB7fVxufVxuXG5cbmZ1bmN0aW9uIHNldFByb3ZpZGVyc1Zpc2liaWxpdHkocHJvdmlkZXJzOiBSZXNvbHZlZFByb3ZpZGVyW10sIHZpc2liaWxpdHk6IFZpc2liaWxpdHksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdDogTWFwPG51bWJlciwgVmlzaWJpbGl0eT4pIHtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm92aWRlcnMubGVuZ3RoOyBpKyspIHtcbiAgICByZXN1bHQuc2V0KHByb3ZpZGVyc1tpXS5rZXkuaWQsIHZpc2liaWxpdHkpO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBBcHBQcm90b0VsZW1lbnQge1xuICBwcm90b0luamVjdG9yOiBQcm90b0luamVjdG9yO1xuXG4gIHN0YXRpYyBjcmVhdGUobWV0YWRhdGFDYWNoZTogUmVzb2x2ZWRNZXRhZGF0YUNhY2hlLCBpbmRleDogbnVtYmVyLFxuICAgICAgICAgICAgICAgIGF0dHJpYnV0ZXM6IHtba2V5OiBzdHJpbmddOiBzdHJpbmd9LCBkaXJlY3RpdmVUeXBlczogVHlwZVtdLFxuICAgICAgICAgICAgICAgIGRpcmVjdGl2ZVZhcmlhYmxlQmluZGluZ3M6IHtba2V5OiBzdHJpbmddOiBudW1iZXJ9KTogQXBwUHJvdG9FbGVtZW50IHtcbiAgICB2YXIgY29tcG9uZW50RGlyUHJvdmlkZXIgPSBudWxsO1xuICAgIHZhciBtZXJnZWRQcm92aWRlcnNNYXA6IE1hcDxudW1iZXIsIFJlc29sdmVkUHJvdmlkZXI+ID0gbmV3IE1hcDxudW1iZXIsIFJlc29sdmVkUHJvdmlkZXI+KCk7XG4gICAgdmFyIHByb3ZpZGVyVmlzaWJpbGl0eU1hcDogTWFwPG51bWJlciwgVmlzaWJpbGl0eT4gPSBuZXcgTWFwPG51bWJlciwgVmlzaWJpbGl0eT4oKTtcbiAgICB2YXIgcHJvdmlkZXJzID0gTGlzdFdyYXBwZXIuY3JlYXRlR3Jvd2FibGVTaXplKGRpcmVjdGl2ZVR5cGVzLmxlbmd0aCk7XG5cbiAgICB2YXIgcHJvdG9RdWVyeVJlZnMgPSBbXTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGRpcmVjdGl2ZVR5cGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgZGlyUHJvdmlkZXIgPSBtZXRhZGF0YUNhY2hlLmdldFJlc29sdmVkRGlyZWN0aXZlTWV0YWRhdGEoZGlyZWN0aXZlVHlwZXNbaV0pO1xuICAgICAgcHJvdmlkZXJzW2ldID0gbmV3IFByb3ZpZGVyV2l0aFZpc2liaWxpdHkoXG4gICAgICAgICAgZGlyUHJvdmlkZXIsIGRpclByb3ZpZGVyLmlzQ29tcG9uZW50ID8gVmlzaWJpbGl0eS5QdWJsaWNBbmRQcml2YXRlIDogVmlzaWJpbGl0eS5QdWJsaWMpO1xuXG4gICAgICBpZiAoZGlyUHJvdmlkZXIuaXNDb21wb25lbnQpIHtcbiAgICAgICAgY29tcG9uZW50RGlyUHJvdmlkZXIgPSBkaXJQcm92aWRlcjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChpc1ByZXNlbnQoZGlyUHJvdmlkZXIucHJvdmlkZXJzKSkge1xuICAgICAgICAgIG1lcmdlUmVzb2x2ZWRQcm92aWRlcnMoZGlyUHJvdmlkZXIucHJvdmlkZXJzLCBtZXJnZWRQcm92aWRlcnNNYXApO1xuICAgICAgICAgIHNldFByb3ZpZGVyc1Zpc2liaWxpdHkoZGlyUHJvdmlkZXIucHJvdmlkZXJzLCBWaXNpYmlsaXR5LlB1YmxpYywgcHJvdmlkZXJWaXNpYmlsaXR5TWFwKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKGlzUHJlc2VudChkaXJQcm92aWRlci52aWV3UHJvdmlkZXJzKSkge1xuICAgICAgICBtZXJnZVJlc29sdmVkUHJvdmlkZXJzKGRpclByb3ZpZGVyLnZpZXdQcm92aWRlcnMsIG1lcmdlZFByb3ZpZGVyc01hcCk7XG4gICAgICAgIHNldFByb3ZpZGVyc1Zpc2liaWxpdHkoZGlyUHJvdmlkZXIudmlld1Byb3ZpZGVycywgVmlzaWJpbGl0eS5Qcml2YXRlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb3ZpZGVyVmlzaWJpbGl0eU1hcCk7XG4gICAgICB9XG4gICAgICBmb3IgKHZhciBxdWVyeUlkeCA9IDA7IHF1ZXJ5SWR4IDwgZGlyUHJvdmlkZXIucXVlcmllcy5sZW5ndGg7IHF1ZXJ5SWR4KyspIHtcbiAgICAgICAgdmFyIHEgPSBkaXJQcm92aWRlci5xdWVyaWVzW3F1ZXJ5SWR4XTtcbiAgICAgICAgcHJvdG9RdWVyeVJlZnMucHVzaChuZXcgUHJvdG9RdWVyeVJlZihpLCBxLnNldHRlciwgcS5tZXRhZGF0YSkpO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoaXNQcmVzZW50KGNvbXBvbmVudERpclByb3ZpZGVyKSAmJiBpc1ByZXNlbnQoY29tcG9uZW50RGlyUHJvdmlkZXIucHJvdmlkZXJzKSkge1xuICAgICAgLy8gZGlyZWN0aXZlIHByb3ZpZGVycyBuZWVkIHRvIGJlIHByaW9yaXRpemVkIG92ZXIgY29tcG9uZW50IHByb3ZpZGVyc1xuICAgICAgbWVyZ2VSZXNvbHZlZFByb3ZpZGVycyhjb21wb25lbnREaXJQcm92aWRlci5wcm92aWRlcnMsIG1lcmdlZFByb3ZpZGVyc01hcCk7XG4gICAgICBzZXRQcm92aWRlcnNWaXNpYmlsaXR5KGNvbXBvbmVudERpclByb3ZpZGVyLnByb3ZpZGVycywgVmlzaWJpbGl0eS5QdWJsaWMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb3ZpZGVyVmlzaWJpbGl0eU1hcCk7XG4gICAgfVxuICAgIG1lcmdlZFByb3ZpZGVyc01hcC5mb3JFYWNoKChwcm92aWRlciwgXykgPT4ge1xuICAgICAgcHJvdmlkZXJzLnB1c2goXG4gICAgICAgICAgbmV3IFByb3ZpZGVyV2l0aFZpc2liaWxpdHkocHJvdmlkZXIsIHByb3ZpZGVyVmlzaWJpbGl0eU1hcC5nZXQocHJvdmlkZXIua2V5LmlkKSkpO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIG5ldyBBcHBQcm90b0VsZW1lbnQoaXNQcmVzZW50KGNvbXBvbmVudERpclByb3ZpZGVyKSwgaW5kZXgsIGF0dHJpYnV0ZXMsIHByb3ZpZGVycyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm90b1F1ZXJ5UmVmcywgZGlyZWN0aXZlVmFyaWFibGVCaW5kaW5ncyk7XG4gIH1cblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgZmlyc3RQcm92aWRlcklzQ29tcG9uZW50OiBib29sZWFuLCBwdWJsaWMgaW5kZXg6IG51bWJlcixcbiAgICAgICAgICAgICAgcHVibGljIGF0dHJpYnV0ZXM6IHtba2V5OiBzdHJpbmddOiBzdHJpbmd9LCBwd3ZzOiBQcm92aWRlcldpdGhWaXNpYmlsaXR5W10sXG4gICAgICAgICAgICAgIHB1YmxpYyBwcm90b1F1ZXJ5UmVmczogUHJvdG9RdWVyeVJlZltdLFxuICAgICAgICAgICAgICBwdWJsaWMgZGlyZWN0aXZlVmFyaWFibGVCaW5kaW5nczoge1trZXk6IHN0cmluZ106IG51bWJlcn0pIHtcbiAgICB2YXIgbGVuZ3RoID0gcHd2cy5sZW5ndGg7XG4gICAgaWYgKGxlbmd0aCA+IDApIHtcbiAgICAgIHRoaXMucHJvdG9JbmplY3RvciA9IG5ldyBQcm90b0luamVjdG9yKHB3dnMpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnByb3RvSW5qZWN0b3IgPSBudWxsO1xuICAgICAgdGhpcy5wcm90b1F1ZXJ5UmVmcyA9IFtdO1xuICAgIH1cbiAgfVxuXG4gIGdldFByb3ZpZGVyQXRJbmRleChpbmRleDogbnVtYmVyKTogYW55IHsgcmV0dXJuIHRoaXMucHJvdG9JbmplY3Rvci5nZXRQcm92aWRlckF0SW5kZXgoaW5kZXgpOyB9XG59XG5cbmNsYXNzIF9Db250ZXh0IHtcbiAgY29uc3RydWN0b3IocHVibGljIGVsZW1lbnQ6IGFueSwgcHVibGljIGNvbXBvbmVudEVsZW1lbnQ6IGFueSwgcHVibGljIGluamVjdG9yOiBhbnkpIHt9XG59XG5cbmV4cG9ydCBjbGFzcyBJbmplY3RvcldpdGhIb3N0Qm91bmRhcnkge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgaW5qZWN0b3I6IEluamVjdG9yLCBwdWJsaWMgaG9zdEluamVjdG9yQm91bmRhcnk6IGJvb2xlYW4pIHt9XG59XG5cbmV4cG9ydCBjbGFzcyBBcHBFbGVtZW50IGltcGxlbWVudHMgRGVwZW5kZW5jeVByb3ZpZGVyLCBFbGVtZW50UmVmLCBBZnRlclZpZXdDaGVja2VkIHtcbiAgc3RhdGljIGdldFZpZXdQYXJlbnRJbmplY3RvcihwYXJlbnRWaWV3VHlwZTogVmlld1R5cGUsIGNvbnRhaW5lckFwcEVsZW1lbnQ6IEFwcEVsZW1lbnQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW1wZXJhdGl2ZWx5Q3JlYXRlZFByb3ZpZGVyczogUmVzb2x2ZWRQcm92aWRlcltdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvb3RJbmplY3RvcjogSW5qZWN0b3IpOiBJbmplY3RvcldpdGhIb3N0Qm91bmRhcnkge1xuICAgIHZhciBwYXJlbnRJbmplY3RvcjtcbiAgICB2YXIgaG9zdEluamVjdG9yQm91bmRhcnk7XG4gICAgc3dpdGNoIChwYXJlbnRWaWV3VHlwZSkge1xuICAgICAgY2FzZSBWaWV3VHlwZS5DT01QT05FTlQ6XG4gICAgICAgIHBhcmVudEluamVjdG9yID0gY29udGFpbmVyQXBwRWxlbWVudC5faW5qZWN0b3I7XG4gICAgICAgIGhvc3RJbmplY3RvckJvdW5kYXJ5ID0gdHJ1ZTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFZpZXdUeXBlLkVNQkVEREVEOlxuICAgICAgICBwYXJlbnRJbmplY3RvciA9IGlzUHJlc2VudChjb250YWluZXJBcHBFbGVtZW50LnByb3RvLnByb3RvSW5qZWN0b3IpID9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGFpbmVyQXBwRWxlbWVudC5faW5qZWN0b3IucGFyZW50IDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGFpbmVyQXBwRWxlbWVudC5faW5qZWN0b3I7XG4gICAgICAgIGhvc3RJbmplY3RvckJvdW5kYXJ5ID0gY29udGFpbmVyQXBwRWxlbWVudC5faW5qZWN0b3IuaG9zdEJvdW5kYXJ5O1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgVmlld1R5cGUuSE9TVDpcbiAgICAgICAgaWYgKGlzUHJlc2VudChjb250YWluZXJBcHBFbGVtZW50KSkge1xuICAgICAgICAgIC8vIGhvc3QgdmlldyBpcyBhdHRhY2hlZCB0byBhIGNvbnRhaW5lclxuICAgICAgICAgIHBhcmVudEluamVjdG9yID0gaXNQcmVzZW50KGNvbnRhaW5lckFwcEVsZW1lbnQucHJvdG8ucHJvdG9JbmplY3RvcikgP1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRhaW5lckFwcEVsZW1lbnQuX2luamVjdG9yLnBhcmVudCA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGFpbmVyQXBwRWxlbWVudC5faW5qZWN0b3I7XG4gICAgICAgICAgaWYgKGlzUHJlc2VudChpbXBlcmF0aXZlbHlDcmVhdGVkUHJvdmlkZXJzKSkge1xuICAgICAgICAgICAgdmFyIGltcGVyYXRpdmVQcm92aWRlcnNXaXRoVmlzaWJpbGl0eSA9IGltcGVyYXRpdmVseUNyZWF0ZWRQcm92aWRlcnMubWFwKFxuICAgICAgICAgICAgICAgIHAgPT4gbmV3IFByb3ZpZGVyV2l0aFZpc2liaWxpdHkocCwgVmlzaWJpbGl0eS5QdWJsaWMpKTtcbiAgICAgICAgICAgIC8vIFRoZSBpbXBlcmF0aXZlIGluamVjdG9yIGlzIHNpbWlsYXIgdG8gaGF2aW5nIGFuIGVsZW1lbnQgYmV0d2VlblxuICAgICAgICAgICAgLy8gdGhlIGR5bmFtaWMtbG9hZGVkIGNvbXBvbmVudCBhbmQgaXRzIHBhcmVudCA9PiBubyBib3VuZGFyeSBiZXR3ZWVuXG4gICAgICAgICAgICAvLyB0aGUgY29tcG9uZW50IGFuZCBpbXBlcmF0aXZlbHlDcmVhdGVkSW5qZWN0b3IuXG4gICAgICAgICAgICBwYXJlbnRJbmplY3RvciA9IG5ldyBJbmplY3RvcihuZXcgUHJvdG9JbmplY3RvcihpbXBlcmF0aXZlUHJvdmlkZXJzV2l0aFZpc2liaWxpdHkpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFyZW50SW5qZWN0b3IsIHRydWUsIG51bGwsIG51bGwpO1xuICAgICAgICAgICAgaG9zdEluamVjdG9yQm91bmRhcnkgPSBmYWxzZTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaG9zdEluamVjdG9yQm91bmRhcnkgPSBjb250YWluZXJBcHBFbGVtZW50Ll9pbmplY3Rvci5ob3N0Qm91bmRhcnk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIGJvb3RzdHJhcFxuICAgICAgICAgIHBhcmVudEluamVjdG9yID0gcm9vdEluamVjdG9yO1xuICAgICAgICAgIGhvc3RJbmplY3RvckJvdW5kYXJ5ID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBJbmplY3RvcldpdGhIb3N0Qm91bmRhcnkocGFyZW50SW5qZWN0b3IsIGhvc3RJbmplY3RvckJvdW5kYXJ5KTtcbiAgfVxuXG4gIHB1YmxpYyBuZXN0ZWRWaWV3czogQXBwVmlld1tdID0gbnVsbDtcbiAgcHVibGljIGNvbXBvbmVudFZpZXc6IEFwcFZpZXcgPSBudWxsO1xuXG4gIHByaXZhdGUgX3F1ZXJ5U3RyYXRlZ3k6IF9RdWVyeVN0cmF0ZWd5O1xuICBwcml2YXRlIF9pbmplY3RvcjogSW5qZWN0b3I7XG4gIHByaXZhdGUgX3N0cmF0ZWd5OiBfRWxlbWVudERpcmVjdGl2ZVN0cmF0ZWd5O1xuICBwdWJsaWMgcmVmOiBFbGVtZW50UmVmXztcblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgcHJvdG86IEFwcFByb3RvRWxlbWVudCwgcHVibGljIHBhcmVudFZpZXc6IEFwcFZpZXcsIHB1YmxpYyBwYXJlbnQ6IEFwcEVsZW1lbnQsXG4gICAgICAgICAgICAgIHB1YmxpYyBuYXRpdmVFbGVtZW50OiBhbnksIHB1YmxpYyBlbWJlZGRlZFZpZXdGYWN0b3J5OiBGdW5jdGlvbikge1xuICAgIHRoaXMucmVmID0gbmV3IEVsZW1lbnRSZWZfKHRoaXMpO1xuICAgIHZhciBwYXJlbnRJbmplY3RvciA9IGlzUHJlc2VudChwYXJlbnQpID8gcGFyZW50Ll9pbmplY3RvciA6IHBhcmVudFZpZXcucGFyZW50SW5qZWN0b3I7XG4gICAgaWYgKGlzUHJlc2VudCh0aGlzLnByb3RvLnByb3RvSW5qZWN0b3IpKSB7XG4gICAgICB2YXIgaXNCb3VuZGFyeTtcbiAgICAgIGlmIChpc1ByZXNlbnQocGFyZW50KSAmJiBpc1ByZXNlbnQocGFyZW50LnByb3RvLnByb3RvSW5qZWN0b3IpKSB7XG4gICAgICAgIGlzQm91bmRhcnkgPSBmYWxzZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlzQm91bmRhcnkgPSBwYXJlbnRWaWV3Lmhvc3RJbmplY3RvckJvdW5kYXJ5O1xuICAgICAgfVxuICAgICAgdGhpcy5fcXVlcnlTdHJhdGVneSA9IHRoaXMuX2J1aWxkUXVlcnlTdHJhdGVneSgpO1xuICAgICAgdGhpcy5faW5qZWN0b3IgPSBuZXcgSW5qZWN0b3IodGhpcy5wcm90by5wcm90b0luamVjdG9yLCBwYXJlbnRJbmplY3RvciwgaXNCb3VuZGFyeSwgdGhpcyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICgpID0+IHRoaXMuX2RlYnVnQ29udGV4dCgpKTtcblxuICAgICAgLy8gd2UgY291cGxlIG91cnNlbHZlcyB0byB0aGUgaW5qZWN0b3Igc3RyYXRlZ3kgdG8gYXZvaWQgcG9seW1vcnBoaWMgY2FsbHNcbiAgICAgIHZhciBpbmplY3RvclN0cmF0ZWd5ID0gPGFueT50aGlzLl9pbmplY3Rvci5pbnRlcm5hbFN0cmF0ZWd5O1xuICAgICAgdGhpcy5fc3RyYXRlZ3kgPSBpbmplY3RvclN0cmF0ZWd5IGluc3RhbmNlb2YgSW5qZWN0b3JJbmxpbmVTdHJhdGVneSA/XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBuZXcgRWxlbWVudERpcmVjdGl2ZUlubGluZVN0cmF0ZWd5KGluamVjdG9yU3RyYXRlZ3ksIHRoaXMpIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBFbGVtZW50RGlyZWN0aXZlRHluYW1pY1N0cmF0ZWd5KGluamVjdG9yU3RyYXRlZ3ksIHRoaXMpO1xuICAgICAgdGhpcy5fc3RyYXRlZ3kuaW5pdCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9xdWVyeVN0cmF0ZWd5ID0gbnVsbDtcbiAgICAgIHRoaXMuX2luamVjdG9yID0gcGFyZW50SW5qZWN0b3I7XG4gICAgICB0aGlzLl9zdHJhdGVneSA9IG51bGw7XG4gICAgfVxuICB9XG5cbiAgYXR0YWNoQ29tcG9uZW50Vmlldyhjb21wb25lbnRWaWV3OiBBcHBWaWV3KSB7IHRoaXMuY29tcG9uZW50VmlldyA9IGNvbXBvbmVudFZpZXc7IH1cblxuICBwcml2YXRlIF9kZWJ1Z0NvbnRleHQoKTogYW55IHtcbiAgICB2YXIgYyA9IHRoaXMucGFyZW50Vmlldy5nZXREZWJ1Z0NvbnRleHQodGhpcywgbnVsbCwgbnVsbCk7XG4gICAgcmV0dXJuIGlzUHJlc2VudChjKSA/IG5ldyBfQ29udGV4dChjLmVsZW1lbnQsIGMuY29tcG9uZW50RWxlbWVudCwgYy5pbmplY3RvcikgOiBudWxsO1xuICB9XG5cbiAgaGFzVmFyaWFibGVCaW5kaW5nKG5hbWU6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgIHZhciB2YiA9IHRoaXMucHJvdG8uZGlyZWN0aXZlVmFyaWFibGVCaW5kaW5ncztcbiAgICByZXR1cm4gaXNQcmVzZW50KHZiKSAmJiBTdHJpbmdNYXBXcmFwcGVyLmNvbnRhaW5zKHZiLCBuYW1lKTtcbiAgfVxuXG4gIGdldFZhcmlhYmxlQmluZGluZyhuYW1lOiBzdHJpbmcpOiBhbnkge1xuICAgIHZhciBpbmRleCA9IHRoaXMucHJvdG8uZGlyZWN0aXZlVmFyaWFibGVCaW5kaW5nc1tuYW1lXTtcbiAgICByZXR1cm4gaXNQcmVzZW50KGluZGV4KSA/IHRoaXMuZ2V0RGlyZWN0aXZlQXRJbmRleCg8bnVtYmVyPmluZGV4KSA6IHRoaXMuZ2V0RWxlbWVudFJlZigpO1xuICB9XG5cbiAgZ2V0KHRva2VuOiBhbnkpOiBhbnkgeyByZXR1cm4gdGhpcy5faW5qZWN0b3IuZ2V0KHRva2VuKTsgfVxuXG4gIGhhc0RpcmVjdGl2ZSh0eXBlOiBUeXBlKTogYm9vbGVhbiB7IHJldHVybiBpc1ByZXNlbnQodGhpcy5faW5qZWN0b3IuZ2V0T3B0aW9uYWwodHlwZSkpOyB9XG5cbiAgZ2V0Q29tcG9uZW50KCk6IGFueSB7IHJldHVybiBpc1ByZXNlbnQodGhpcy5fc3RyYXRlZ3kpID8gdGhpcy5fc3RyYXRlZ3kuZ2V0Q29tcG9uZW50KCkgOiBudWxsOyB9XG5cbiAgZ2V0SW5qZWN0b3IoKTogSW5qZWN0b3IgeyByZXR1cm4gdGhpcy5faW5qZWN0b3I7IH1cblxuICBnZXRFbGVtZW50UmVmKCk6IEVsZW1lbnRSZWYgeyByZXR1cm4gdGhpcy5yZWY7IH1cblxuICBnZXRWaWV3Q29udGFpbmVyUmVmKCk6IFZpZXdDb250YWluZXJSZWYgeyByZXR1cm4gbmV3IFZpZXdDb250YWluZXJSZWZfKHRoaXMpOyB9XG5cbiAgZ2V0VGVtcGxhdGVSZWYoKTogVGVtcGxhdGVSZWYge1xuICAgIGlmIChpc1ByZXNlbnQodGhpcy5lbWJlZGRlZFZpZXdGYWN0b3J5KSkge1xuICAgICAgcmV0dXJuIG5ldyBUZW1wbGF0ZVJlZl8odGhpcy5yZWYpO1xuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGdldERlcGVuZGVuY3koaW5qZWN0b3I6IEluamVjdG9yLCBwcm92aWRlcjogUmVzb2x2ZWRQcm92aWRlciwgZGVwOiBEZXBlbmRlbmN5KTogYW55IHtcbiAgICBpZiAocHJvdmlkZXIgaW5zdGFuY2VvZiBEaXJlY3RpdmVQcm92aWRlcikge1xuICAgICAgdmFyIGRpckRlcCA9IDxEaXJlY3RpdmVEZXBlbmRlbmN5PmRlcDtcblxuICAgICAgaWYgKGlzUHJlc2VudChkaXJEZXAuYXR0cmlidXRlTmFtZSkpIHJldHVybiB0aGlzLl9idWlsZEF0dHJpYnV0ZShkaXJEZXApO1xuXG4gICAgICBpZiAoaXNQcmVzZW50KGRpckRlcC5xdWVyeURlY29yYXRvcikpXG4gICAgICAgIHJldHVybiB0aGlzLl9xdWVyeVN0cmF0ZWd5LmZpbmRRdWVyeShkaXJEZXAucXVlcnlEZWNvcmF0b3IpLmxpc3Q7XG5cbiAgICAgIGlmIChkaXJEZXAua2V5LmlkID09PSBTdGF0aWNLZXlzLmluc3RhbmNlKCkuY2hhbmdlRGV0ZWN0b3JSZWZJZCkge1xuICAgICAgICAvLyBXZSBwcm92aWRlIHRoZSBjb21wb25lbnQncyB2aWV3IGNoYW5nZSBkZXRlY3RvciB0byBjb21wb25lbnRzIGFuZFxuICAgICAgICAvLyB0aGUgc3Vycm91bmRpbmcgY29tcG9uZW50J3MgY2hhbmdlIGRldGVjdG9yIHRvIGRpcmVjdGl2ZXMuXG4gICAgICAgIGlmICh0aGlzLnByb3RvLmZpcnN0UHJvdmlkZXJJc0NvbXBvbmVudCkge1xuICAgICAgICAgIC8vIE5vdGU6IFRoZSBjb21wb25lbnQgdmlldyBpcyBub3QgeWV0IGNyZWF0ZWQgd2hlblxuICAgICAgICAgIC8vIHRoaXMgbWV0aG9kIGlzIGNhbGxlZCFcbiAgICAgICAgICByZXR1cm4gbmV3IF9Db21wb25lbnRWaWV3Q2hhbmdlRGV0ZWN0b3JSZWYodGhpcyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMucGFyZW50Vmlldy5jaGFuZ2VEZXRlY3Rvci5yZWY7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKGRpckRlcC5rZXkuaWQgPT09IFN0YXRpY0tleXMuaW5zdGFuY2UoKS5lbGVtZW50UmVmSWQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0RWxlbWVudFJlZigpO1xuICAgICAgfVxuXG4gICAgICBpZiAoZGlyRGVwLmtleS5pZCA9PT0gU3RhdGljS2V5cy5pbnN0YW5jZSgpLnZpZXdDb250YWluZXJJZCkge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRWaWV3Q29udGFpbmVyUmVmKCk7XG4gICAgICB9XG5cbiAgICAgIGlmIChkaXJEZXAua2V5LmlkID09PSBTdGF0aWNLZXlzLmluc3RhbmNlKCkudGVtcGxhdGVSZWZJZCkge1xuICAgICAgICB2YXIgdHIgPSB0aGlzLmdldFRlbXBsYXRlUmVmKCk7XG4gICAgICAgIGlmIChpc0JsYW5rKHRyKSAmJiAhZGlyRGVwLm9wdGlvbmFsKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IE5vUHJvdmlkZXJFcnJvcihudWxsLCBkaXJEZXAua2V5KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHI7XG4gICAgICB9XG5cbiAgICAgIGlmIChkaXJEZXAua2V5LmlkID09PSBTdGF0aWNLZXlzLmluc3RhbmNlKCkucmVuZGVyZXJJZCkge1xuICAgICAgICByZXR1cm4gdGhpcy5wYXJlbnRWaWV3LnJlbmRlcmVyO1xuICAgICAgfVxuXG4gICAgfSBlbHNlIGlmIChwcm92aWRlciBpbnN0YW5jZW9mIFBpcGVQcm92aWRlcikge1xuICAgICAgaWYgKGRlcC5rZXkuaWQgPT09IFN0YXRpY0tleXMuaW5zdGFuY2UoKS5jaGFuZ2VEZXRlY3RvclJlZklkKSB7XG4gICAgICAgIC8vIFdlIHByb3ZpZGUgdGhlIGNvbXBvbmVudCdzIHZpZXcgY2hhbmdlIGRldGVjdG9yIHRvIGNvbXBvbmVudHMgYW5kXG4gICAgICAgIC8vIHRoZSBzdXJyb3VuZGluZyBjb21wb25lbnQncyBjaGFuZ2UgZGV0ZWN0b3IgdG8gZGlyZWN0aXZlcy5cbiAgICAgICAgaWYgKHRoaXMucHJvdG8uZmlyc3RQcm92aWRlcklzQ29tcG9uZW50KSB7XG4gICAgICAgICAgLy8gTm90ZTogVGhlIGNvbXBvbmVudCB2aWV3IGlzIG5vdCB5ZXQgY3JlYXRlZCB3aGVuXG4gICAgICAgICAgLy8gdGhpcyBtZXRob2QgaXMgY2FsbGVkIVxuICAgICAgICAgIHJldHVybiBuZXcgX0NvbXBvbmVudFZpZXdDaGFuZ2VEZXRlY3RvclJlZih0aGlzKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5wYXJlbnRWaWV3LmNoYW5nZURldGVjdG9yO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIFVOREVGSU5FRDtcbiAgfVxuXG4gIHByaXZhdGUgX2J1aWxkQXR0cmlidXRlKGRlcDogRGlyZWN0aXZlRGVwZW5kZW5jeSk6IHN0cmluZyB7XG4gICAgdmFyIGF0dHJpYnV0ZXMgPSB0aGlzLnByb3RvLmF0dHJpYnV0ZXM7XG4gICAgaWYgKGlzUHJlc2VudChhdHRyaWJ1dGVzKSAmJiBTdHJpbmdNYXBXcmFwcGVyLmNvbnRhaW5zKGF0dHJpYnV0ZXMsIGRlcC5hdHRyaWJ1dGVOYW1lKSkge1xuICAgICAgcmV0dXJuIGF0dHJpYnV0ZXNbZGVwLmF0dHJpYnV0ZU5hbWVdO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gIH1cblxuICBhZGREaXJlY3RpdmVzTWF0Y2hpbmdRdWVyeShxdWVyeTogUXVlcnlNZXRhZGF0YSwgbGlzdDogYW55W10pOiB2b2lkIHtcbiAgICB2YXIgdGVtcGxhdGVSZWYgPSB0aGlzLmdldFRlbXBsYXRlUmVmKCk7XG4gICAgaWYgKHF1ZXJ5LnNlbGVjdG9yID09PSBUZW1wbGF0ZVJlZiAmJiBpc1ByZXNlbnQodGVtcGxhdGVSZWYpKSB7XG4gICAgICBsaXN0LnB1c2godGVtcGxhdGVSZWYpO1xuICAgIH1cbiAgICBpZiAodGhpcy5fc3RyYXRlZ3kgIT0gbnVsbCkge1xuICAgICAgdGhpcy5fc3RyYXRlZ3kuYWRkRGlyZWN0aXZlc01hdGNoaW5nUXVlcnkocXVlcnksIGxpc3QpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX2J1aWxkUXVlcnlTdHJhdGVneSgpOiBfUXVlcnlTdHJhdGVneSB7XG4gICAgaWYgKHRoaXMucHJvdG8ucHJvdG9RdWVyeVJlZnMubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gX2VtcHR5UXVlcnlTdHJhdGVneTtcbiAgICB9IGVsc2UgaWYgKHRoaXMucHJvdG8ucHJvdG9RdWVyeVJlZnMubGVuZ3RoIDw9XG4gICAgICAgICAgICAgICBJbmxpbmVRdWVyeVN0cmF0ZWd5Lk5VTUJFUl9PRl9TVVBQT1JURURfUVVFUklFUykge1xuICAgICAgcmV0dXJuIG5ldyBJbmxpbmVRdWVyeVN0cmF0ZWd5KHRoaXMpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gbmV3IER5bmFtaWNRdWVyeVN0cmF0ZWd5KHRoaXMpO1xuICAgIH1cbiAgfVxuXG5cbiAgZ2V0RGlyZWN0aXZlQXRJbmRleChpbmRleDogbnVtYmVyKTogYW55IHsgcmV0dXJuIHRoaXMuX2luamVjdG9yLmdldEF0KGluZGV4KTsgfVxuXG4gIG5nQWZ0ZXJWaWV3Q2hlY2tlZCgpOiB2b2lkIHtcbiAgICBpZiAoaXNQcmVzZW50KHRoaXMuX3F1ZXJ5U3RyYXRlZ3kpKSB0aGlzLl9xdWVyeVN0cmF0ZWd5LnVwZGF0ZVZpZXdRdWVyaWVzKCk7XG4gIH1cblxuICBuZ0FmdGVyQ29udGVudENoZWNrZWQoKTogdm9pZCB7XG4gICAgaWYgKGlzUHJlc2VudCh0aGlzLl9xdWVyeVN0cmF0ZWd5KSkgdGhpcy5fcXVlcnlTdHJhdGVneS51cGRhdGVDb250ZW50UXVlcmllcygpO1xuICB9XG5cbiAgdHJhdmVyc2VBbmRTZXRRdWVyaWVzQXNEaXJ0eSgpOiB2b2lkIHtcbiAgICB2YXIgaW5qOiBBcHBFbGVtZW50ID0gdGhpcztcbiAgICB3aGlsZSAoaXNQcmVzZW50KGluaikpIHtcbiAgICAgIGluai5fc2V0UXVlcmllc0FzRGlydHkoKTtcbiAgICAgIGlmIChpc0JsYW5rKGluai5wYXJlbnQpICYmIGluai5wYXJlbnRWaWV3LnByb3RvLnR5cGUgPT09IFZpZXdUeXBlLkVNQkVEREVEKSB7XG4gICAgICAgIGluaiA9IGluai5wYXJlbnRWaWV3LmNvbnRhaW5lckFwcEVsZW1lbnQ7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpbmogPSBpbmoucGFyZW50O1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX3NldFF1ZXJpZXNBc0RpcnR5KCk6IHZvaWQge1xuICAgIGlmIChpc1ByZXNlbnQodGhpcy5fcXVlcnlTdHJhdGVneSkpIHtcbiAgICAgIHRoaXMuX3F1ZXJ5U3RyYXRlZ3kuc2V0Q29udGVudFF1ZXJpZXNBc0RpcnR5KCk7XG4gICAgfVxuICAgIGlmICh0aGlzLnBhcmVudFZpZXcucHJvdG8udHlwZSA9PT0gVmlld1R5cGUuQ09NUE9ORU5UKSB7XG4gICAgICB0aGlzLnBhcmVudFZpZXcuY29udGFpbmVyQXBwRWxlbWVudC5fcXVlcnlTdHJhdGVneS5zZXRWaWV3UXVlcmllc0FzRGlydHkoKTtcbiAgICB9XG4gIH1cbn1cblxuaW50ZXJmYWNlIF9RdWVyeVN0cmF0ZWd5IHtcbiAgc2V0Q29udGVudFF1ZXJpZXNBc0RpcnR5KCk6IHZvaWQ7XG4gIHNldFZpZXdRdWVyaWVzQXNEaXJ0eSgpOiB2b2lkO1xuICB1cGRhdGVDb250ZW50UXVlcmllcygpOiB2b2lkO1xuICB1cGRhdGVWaWV3UXVlcmllcygpOiB2b2lkO1xuICBmaW5kUXVlcnkocXVlcnk6IFF1ZXJ5TWV0YWRhdGEpOiBRdWVyeVJlZjtcbn1cblxuY2xhc3MgX0VtcHR5UXVlcnlTdHJhdGVneSBpbXBsZW1lbnRzIF9RdWVyeVN0cmF0ZWd5IHtcbiAgc2V0Q29udGVudFF1ZXJpZXNBc0RpcnR5KCk6IHZvaWQge31cbiAgc2V0Vmlld1F1ZXJpZXNBc0RpcnR5KCk6IHZvaWQge31cbiAgdXBkYXRlQ29udGVudFF1ZXJpZXMoKTogdm9pZCB7fVxuICB1cGRhdGVWaWV3UXVlcmllcygpOiB2b2lkIHt9XG4gIGZpbmRRdWVyeShxdWVyeTogUXVlcnlNZXRhZGF0YSk6IFF1ZXJ5UmVmIHtcbiAgICB0aHJvdyBuZXcgQmFzZUV4Y2VwdGlvbihgQ2Fubm90IGZpbmQgcXVlcnkgZm9yIGRpcmVjdGl2ZSAke3F1ZXJ5fS5gKTtcbiAgfVxufVxuXG52YXIgX2VtcHR5UXVlcnlTdHJhdGVneSA9IG5ldyBfRW1wdHlRdWVyeVN0cmF0ZWd5KCk7XG5cbmNsYXNzIElubGluZVF1ZXJ5U3RyYXRlZ3kgaW1wbGVtZW50cyBfUXVlcnlTdHJhdGVneSB7XG4gIHN0YXRpYyBOVU1CRVJfT0ZfU1VQUE9SVEVEX1FVRVJJRVMgPSAzO1xuXG4gIHF1ZXJ5MDogUXVlcnlSZWY7XG4gIHF1ZXJ5MTogUXVlcnlSZWY7XG4gIHF1ZXJ5MjogUXVlcnlSZWY7XG5cbiAgY29uc3RydWN0b3IoZWk6IEFwcEVsZW1lbnQpIHtcbiAgICB2YXIgcHJvdG9SZWZzID0gZWkucHJvdG8ucHJvdG9RdWVyeVJlZnM7XG4gICAgaWYgKHByb3RvUmVmcy5sZW5ndGggPiAwKSB0aGlzLnF1ZXJ5MCA9IG5ldyBRdWVyeVJlZihwcm90b1JlZnNbMF0sIGVpKTtcbiAgICBpZiAocHJvdG9SZWZzLmxlbmd0aCA+IDEpIHRoaXMucXVlcnkxID0gbmV3IFF1ZXJ5UmVmKHByb3RvUmVmc1sxXSwgZWkpO1xuICAgIGlmIChwcm90b1JlZnMubGVuZ3RoID4gMikgdGhpcy5xdWVyeTIgPSBuZXcgUXVlcnlSZWYocHJvdG9SZWZzWzJdLCBlaSk7XG4gIH1cblxuICBzZXRDb250ZW50UXVlcmllc0FzRGlydHkoKTogdm9pZCB7XG4gICAgaWYgKGlzUHJlc2VudCh0aGlzLnF1ZXJ5MCkgJiYgIXRoaXMucXVlcnkwLmlzVmlld1F1ZXJ5KSB0aGlzLnF1ZXJ5MC5kaXJ0eSA9IHRydWU7XG4gICAgaWYgKGlzUHJlc2VudCh0aGlzLnF1ZXJ5MSkgJiYgIXRoaXMucXVlcnkxLmlzVmlld1F1ZXJ5KSB0aGlzLnF1ZXJ5MS5kaXJ0eSA9IHRydWU7XG4gICAgaWYgKGlzUHJlc2VudCh0aGlzLnF1ZXJ5MikgJiYgIXRoaXMucXVlcnkyLmlzVmlld1F1ZXJ5KSB0aGlzLnF1ZXJ5Mi5kaXJ0eSA9IHRydWU7XG4gIH1cblxuICBzZXRWaWV3UXVlcmllc0FzRGlydHkoKTogdm9pZCB7XG4gICAgaWYgKGlzUHJlc2VudCh0aGlzLnF1ZXJ5MCkgJiYgdGhpcy5xdWVyeTAuaXNWaWV3UXVlcnkpIHRoaXMucXVlcnkwLmRpcnR5ID0gdHJ1ZTtcbiAgICBpZiAoaXNQcmVzZW50KHRoaXMucXVlcnkxKSAmJiB0aGlzLnF1ZXJ5MS5pc1ZpZXdRdWVyeSkgdGhpcy5xdWVyeTEuZGlydHkgPSB0cnVlO1xuICAgIGlmIChpc1ByZXNlbnQodGhpcy5xdWVyeTIpICYmIHRoaXMucXVlcnkyLmlzVmlld1F1ZXJ5KSB0aGlzLnF1ZXJ5Mi5kaXJ0eSA9IHRydWU7XG4gIH1cblxuICB1cGRhdGVDb250ZW50UXVlcmllcygpIHtcbiAgICBpZiAoaXNQcmVzZW50KHRoaXMucXVlcnkwKSAmJiAhdGhpcy5xdWVyeTAuaXNWaWV3UXVlcnkpIHtcbiAgICAgIHRoaXMucXVlcnkwLnVwZGF0ZSgpO1xuICAgIH1cbiAgICBpZiAoaXNQcmVzZW50KHRoaXMucXVlcnkxKSAmJiAhdGhpcy5xdWVyeTEuaXNWaWV3UXVlcnkpIHtcbiAgICAgIHRoaXMucXVlcnkxLnVwZGF0ZSgpO1xuICAgIH1cbiAgICBpZiAoaXNQcmVzZW50KHRoaXMucXVlcnkyKSAmJiAhdGhpcy5xdWVyeTIuaXNWaWV3UXVlcnkpIHtcbiAgICAgIHRoaXMucXVlcnkyLnVwZGF0ZSgpO1xuICAgIH1cbiAgfVxuXG4gIHVwZGF0ZVZpZXdRdWVyaWVzKCkge1xuICAgIGlmIChpc1ByZXNlbnQodGhpcy5xdWVyeTApICYmIHRoaXMucXVlcnkwLmlzVmlld1F1ZXJ5KSB7XG4gICAgICB0aGlzLnF1ZXJ5MC51cGRhdGUoKTtcbiAgICB9XG4gICAgaWYgKGlzUHJlc2VudCh0aGlzLnF1ZXJ5MSkgJiYgdGhpcy5xdWVyeTEuaXNWaWV3UXVlcnkpIHtcbiAgICAgIHRoaXMucXVlcnkxLnVwZGF0ZSgpO1xuICAgIH1cbiAgICBpZiAoaXNQcmVzZW50KHRoaXMucXVlcnkyKSAmJiB0aGlzLnF1ZXJ5Mi5pc1ZpZXdRdWVyeSkge1xuICAgICAgdGhpcy5xdWVyeTIudXBkYXRlKCk7XG4gICAgfVxuICB9XG5cbiAgZmluZFF1ZXJ5KHF1ZXJ5OiBRdWVyeU1ldGFkYXRhKTogUXVlcnlSZWYge1xuICAgIGlmIChpc1ByZXNlbnQodGhpcy5xdWVyeTApICYmIHRoaXMucXVlcnkwLnByb3RvUXVlcnlSZWYucXVlcnkgPT09IHF1ZXJ5KSB7XG4gICAgICByZXR1cm4gdGhpcy5xdWVyeTA7XG4gICAgfVxuICAgIGlmIChpc1ByZXNlbnQodGhpcy5xdWVyeTEpICYmIHRoaXMucXVlcnkxLnByb3RvUXVlcnlSZWYucXVlcnkgPT09IHF1ZXJ5KSB7XG4gICAgICByZXR1cm4gdGhpcy5xdWVyeTE7XG4gICAgfVxuICAgIGlmIChpc1ByZXNlbnQodGhpcy5xdWVyeTIpICYmIHRoaXMucXVlcnkyLnByb3RvUXVlcnlSZWYucXVlcnkgPT09IHF1ZXJ5KSB7XG4gICAgICByZXR1cm4gdGhpcy5xdWVyeTI7XG4gICAgfVxuICAgIHRocm93IG5ldyBCYXNlRXhjZXB0aW9uKGBDYW5ub3QgZmluZCBxdWVyeSBmb3IgZGlyZWN0aXZlICR7cXVlcnl9LmApO1xuICB9XG59XG5cbmNsYXNzIER5bmFtaWNRdWVyeVN0cmF0ZWd5IGltcGxlbWVudHMgX1F1ZXJ5U3RyYXRlZ3kge1xuICBxdWVyaWVzOiBRdWVyeVJlZltdO1xuXG4gIGNvbnN0cnVjdG9yKGVpOiBBcHBFbGVtZW50KSB7XG4gICAgdGhpcy5xdWVyaWVzID0gZWkucHJvdG8ucHJvdG9RdWVyeVJlZnMubWFwKHAgPT4gbmV3IFF1ZXJ5UmVmKHAsIGVpKSk7XG4gIH1cblxuICBzZXRDb250ZW50UXVlcmllc0FzRGlydHkoKTogdm9pZCB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnF1ZXJpZXMubGVuZ3RoOyArK2kpIHtcbiAgICAgIHZhciBxID0gdGhpcy5xdWVyaWVzW2ldO1xuICAgICAgaWYgKCFxLmlzVmlld1F1ZXJ5KSBxLmRpcnR5ID0gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICBzZXRWaWV3UXVlcmllc0FzRGlydHkoKTogdm9pZCB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnF1ZXJpZXMubGVuZ3RoOyArK2kpIHtcbiAgICAgIHZhciBxID0gdGhpcy5xdWVyaWVzW2ldO1xuICAgICAgaWYgKHEuaXNWaWV3UXVlcnkpIHEuZGlydHkgPSB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIHVwZGF0ZUNvbnRlbnRRdWVyaWVzKCkge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5xdWVyaWVzLmxlbmd0aDsgKytpKSB7XG4gICAgICB2YXIgcSA9IHRoaXMucXVlcmllc1tpXTtcbiAgICAgIGlmICghcS5pc1ZpZXdRdWVyeSkge1xuICAgICAgICBxLnVwZGF0ZSgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHVwZGF0ZVZpZXdRdWVyaWVzKCkge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5xdWVyaWVzLmxlbmd0aDsgKytpKSB7XG4gICAgICB2YXIgcSA9IHRoaXMucXVlcmllc1tpXTtcbiAgICAgIGlmIChxLmlzVmlld1F1ZXJ5KSB7XG4gICAgICAgIHEudXBkYXRlKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZmluZFF1ZXJ5KHF1ZXJ5OiBRdWVyeU1ldGFkYXRhKTogUXVlcnlSZWYge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5xdWVyaWVzLmxlbmd0aDsgKytpKSB7XG4gICAgICB2YXIgcSA9IHRoaXMucXVlcmllc1tpXTtcbiAgICAgIGlmIChxLnByb3RvUXVlcnlSZWYucXVlcnkgPT09IHF1ZXJ5KSB7XG4gICAgICAgIHJldHVybiBxO1xuICAgICAgfVxuICAgIH1cbiAgICB0aHJvdyBuZXcgQmFzZUV4Y2VwdGlvbihgQ2Fubm90IGZpbmQgcXVlcnkgZm9yIGRpcmVjdGl2ZSAke3F1ZXJ5fS5gKTtcbiAgfVxufVxuXG5pbnRlcmZhY2UgX0VsZW1lbnREaXJlY3RpdmVTdHJhdGVneSB7XG4gIGdldENvbXBvbmVudCgpOiBhbnk7XG4gIGlzQ29tcG9uZW50S2V5KGtleTogS2V5KTogYm9vbGVhbjtcbiAgYWRkRGlyZWN0aXZlc01hdGNoaW5nUXVlcnkocTogUXVlcnlNZXRhZGF0YSwgcmVzOiBhbnlbXSk6IHZvaWQ7XG4gIGluaXQoKTogdm9pZDtcbn1cblxuLyoqXG4gKiBTdHJhdGVneSB1c2VkIGJ5IHRoZSBgRWxlbWVudEluamVjdG9yYCB3aGVuIHRoZSBudW1iZXIgb2YgcHJvdmlkZXJzIGlzIDEwIG9yIGxlc3MuXG4gKiBJbiBzdWNoIGEgY2FzZSwgaW5saW5pbmcgZmllbGRzIGlzIGJlbmVmaWNpYWwgZm9yIHBlcmZvcm1hbmNlcy5cbiAqL1xuY2xhc3MgRWxlbWVudERpcmVjdGl2ZUlubGluZVN0cmF0ZWd5IGltcGxlbWVudHMgX0VsZW1lbnREaXJlY3RpdmVTdHJhdGVneSB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBpbmplY3RvclN0cmF0ZWd5OiBJbmplY3RvcklubGluZVN0cmF0ZWd5LCBwdWJsaWMgX2VpOiBBcHBFbGVtZW50KSB7fVxuXG4gIGluaXQoKTogdm9pZCB7XG4gICAgdmFyIGkgPSB0aGlzLmluamVjdG9yU3RyYXRlZ3k7XG4gICAgdmFyIHAgPSBpLnByb3RvU3RyYXRlZ3k7XG4gICAgaS5yZXNldENvbnN0cnVjdGlvbkNvdW50ZXIoKTtcblxuICAgIGlmIChwLnByb3ZpZGVyMCBpbnN0YW5jZW9mIERpcmVjdGl2ZVByb3ZpZGVyICYmIGlzUHJlc2VudChwLmtleUlkMCkgJiYgaS5vYmowID09PSBVTkRFRklORUQpXG4gICAgICBpLm9iajAgPSBpLmluc3RhbnRpYXRlUHJvdmlkZXIocC5wcm92aWRlcjAsIHAudmlzaWJpbGl0eTApO1xuICAgIGlmIChwLnByb3ZpZGVyMSBpbnN0YW5jZW9mIERpcmVjdGl2ZVByb3ZpZGVyICYmIGlzUHJlc2VudChwLmtleUlkMSkgJiYgaS5vYmoxID09PSBVTkRFRklORUQpXG4gICAgICBpLm9iajEgPSBpLmluc3RhbnRpYXRlUHJvdmlkZXIocC5wcm92aWRlcjEsIHAudmlzaWJpbGl0eTEpO1xuICAgIGlmIChwLnByb3ZpZGVyMiBpbnN0YW5jZW9mIERpcmVjdGl2ZVByb3ZpZGVyICYmIGlzUHJlc2VudChwLmtleUlkMikgJiYgaS5vYmoyID09PSBVTkRFRklORUQpXG4gICAgICBpLm9iajIgPSBpLmluc3RhbnRpYXRlUHJvdmlkZXIocC5wcm92aWRlcjIsIHAudmlzaWJpbGl0eTIpO1xuICAgIGlmIChwLnByb3ZpZGVyMyBpbnN0YW5jZW9mIERpcmVjdGl2ZVByb3ZpZGVyICYmIGlzUHJlc2VudChwLmtleUlkMykgJiYgaS5vYmozID09PSBVTkRFRklORUQpXG4gICAgICBpLm9iajMgPSBpLmluc3RhbnRpYXRlUHJvdmlkZXIocC5wcm92aWRlcjMsIHAudmlzaWJpbGl0eTMpO1xuICAgIGlmIChwLnByb3ZpZGVyNCBpbnN0YW5jZW9mIERpcmVjdGl2ZVByb3ZpZGVyICYmIGlzUHJlc2VudChwLmtleUlkNCkgJiYgaS5vYmo0ID09PSBVTkRFRklORUQpXG4gICAgICBpLm9iajQgPSBpLmluc3RhbnRpYXRlUHJvdmlkZXIocC5wcm92aWRlcjQsIHAudmlzaWJpbGl0eTQpO1xuICAgIGlmIChwLnByb3ZpZGVyNSBpbnN0YW5jZW9mIERpcmVjdGl2ZVByb3ZpZGVyICYmIGlzUHJlc2VudChwLmtleUlkNSkgJiYgaS5vYmo1ID09PSBVTkRFRklORUQpXG4gICAgICBpLm9iajUgPSBpLmluc3RhbnRpYXRlUHJvdmlkZXIocC5wcm92aWRlcjUsIHAudmlzaWJpbGl0eTUpO1xuICAgIGlmIChwLnByb3ZpZGVyNiBpbnN0YW5jZW9mIERpcmVjdGl2ZVByb3ZpZGVyICYmIGlzUHJlc2VudChwLmtleUlkNikgJiYgaS5vYmo2ID09PSBVTkRFRklORUQpXG4gICAgICBpLm9iajYgPSBpLmluc3RhbnRpYXRlUHJvdmlkZXIocC5wcm92aWRlcjYsIHAudmlzaWJpbGl0eTYpO1xuICAgIGlmIChwLnByb3ZpZGVyNyBpbnN0YW5jZW9mIERpcmVjdGl2ZVByb3ZpZGVyICYmIGlzUHJlc2VudChwLmtleUlkNykgJiYgaS5vYmo3ID09PSBVTkRFRklORUQpXG4gICAgICBpLm9iajcgPSBpLmluc3RhbnRpYXRlUHJvdmlkZXIocC5wcm92aWRlcjcsIHAudmlzaWJpbGl0eTcpO1xuICAgIGlmIChwLnByb3ZpZGVyOCBpbnN0YW5jZW9mIERpcmVjdGl2ZVByb3ZpZGVyICYmIGlzUHJlc2VudChwLmtleUlkOCkgJiYgaS5vYmo4ID09PSBVTkRFRklORUQpXG4gICAgICBpLm9iajggPSBpLmluc3RhbnRpYXRlUHJvdmlkZXIocC5wcm92aWRlcjgsIHAudmlzaWJpbGl0eTgpO1xuICAgIGlmIChwLnByb3ZpZGVyOSBpbnN0YW5jZW9mIERpcmVjdGl2ZVByb3ZpZGVyICYmIGlzUHJlc2VudChwLmtleUlkOSkgJiYgaS5vYmo5ID09PSBVTkRFRklORUQpXG4gICAgICBpLm9iajkgPSBpLmluc3RhbnRpYXRlUHJvdmlkZXIocC5wcm92aWRlcjksIHAudmlzaWJpbGl0eTkpO1xuICB9XG5cbiAgZ2V0Q29tcG9uZW50KCk6IGFueSB7IHJldHVybiB0aGlzLmluamVjdG9yU3RyYXRlZ3kub2JqMDsgfVxuXG4gIGlzQ29tcG9uZW50S2V5KGtleTogS2V5KTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX2VpLnByb3RvLmZpcnN0UHJvdmlkZXJJc0NvbXBvbmVudCAmJiBpc1ByZXNlbnQoa2V5KSAmJlxuICAgICAgICAgICBrZXkuaWQgPT09IHRoaXMuaW5qZWN0b3JTdHJhdGVneS5wcm90b1N0cmF0ZWd5LmtleUlkMDtcbiAgfVxuXG4gIGFkZERpcmVjdGl2ZXNNYXRjaGluZ1F1ZXJ5KHF1ZXJ5OiBRdWVyeU1ldGFkYXRhLCBsaXN0OiBhbnlbXSk6IHZvaWQge1xuICAgIHZhciBpID0gdGhpcy5pbmplY3RvclN0cmF0ZWd5O1xuICAgIHZhciBwID0gaS5wcm90b1N0cmF0ZWd5O1xuICAgIGlmIChpc1ByZXNlbnQocC5wcm92aWRlcjApICYmIHAucHJvdmlkZXIwLmtleS50b2tlbiA9PT0gcXVlcnkuc2VsZWN0b3IpIHtcbiAgICAgIGlmIChpLm9iajAgPT09IFVOREVGSU5FRCkgaS5vYmowID0gaS5pbnN0YW50aWF0ZVByb3ZpZGVyKHAucHJvdmlkZXIwLCBwLnZpc2liaWxpdHkwKTtcbiAgICAgIGxpc3QucHVzaChpLm9iajApO1xuICAgIH1cbiAgICBpZiAoaXNQcmVzZW50KHAucHJvdmlkZXIxKSAmJiBwLnByb3ZpZGVyMS5rZXkudG9rZW4gPT09IHF1ZXJ5LnNlbGVjdG9yKSB7XG4gICAgICBpZiAoaS5vYmoxID09PSBVTkRFRklORUQpIGkub2JqMSA9IGkuaW5zdGFudGlhdGVQcm92aWRlcihwLnByb3ZpZGVyMSwgcC52aXNpYmlsaXR5MSk7XG4gICAgICBsaXN0LnB1c2goaS5vYmoxKTtcbiAgICB9XG4gICAgaWYgKGlzUHJlc2VudChwLnByb3ZpZGVyMikgJiYgcC5wcm92aWRlcjIua2V5LnRva2VuID09PSBxdWVyeS5zZWxlY3Rvcikge1xuICAgICAgaWYgKGkub2JqMiA9PT0gVU5ERUZJTkVEKSBpLm9iajIgPSBpLmluc3RhbnRpYXRlUHJvdmlkZXIocC5wcm92aWRlcjIsIHAudmlzaWJpbGl0eTIpO1xuICAgICAgbGlzdC5wdXNoKGkub2JqMik7XG4gICAgfVxuICAgIGlmIChpc1ByZXNlbnQocC5wcm92aWRlcjMpICYmIHAucHJvdmlkZXIzLmtleS50b2tlbiA9PT0gcXVlcnkuc2VsZWN0b3IpIHtcbiAgICAgIGlmIChpLm9iajMgPT09IFVOREVGSU5FRCkgaS5vYmozID0gaS5pbnN0YW50aWF0ZVByb3ZpZGVyKHAucHJvdmlkZXIzLCBwLnZpc2liaWxpdHkzKTtcbiAgICAgIGxpc3QucHVzaChpLm9iajMpO1xuICAgIH1cbiAgICBpZiAoaXNQcmVzZW50KHAucHJvdmlkZXI0KSAmJiBwLnByb3ZpZGVyNC5rZXkudG9rZW4gPT09IHF1ZXJ5LnNlbGVjdG9yKSB7XG4gICAgICBpZiAoaS5vYmo0ID09PSBVTkRFRklORUQpIGkub2JqNCA9IGkuaW5zdGFudGlhdGVQcm92aWRlcihwLnByb3ZpZGVyNCwgcC52aXNpYmlsaXR5NCk7XG4gICAgICBsaXN0LnB1c2goaS5vYmo0KTtcbiAgICB9XG4gICAgaWYgKGlzUHJlc2VudChwLnByb3ZpZGVyNSkgJiYgcC5wcm92aWRlcjUua2V5LnRva2VuID09PSBxdWVyeS5zZWxlY3Rvcikge1xuICAgICAgaWYgKGkub2JqNSA9PT0gVU5ERUZJTkVEKSBpLm9iajUgPSBpLmluc3RhbnRpYXRlUHJvdmlkZXIocC5wcm92aWRlcjUsIHAudmlzaWJpbGl0eTUpO1xuICAgICAgbGlzdC5wdXNoKGkub2JqNSk7XG4gICAgfVxuICAgIGlmIChpc1ByZXNlbnQocC5wcm92aWRlcjYpICYmIHAucHJvdmlkZXI2LmtleS50b2tlbiA9PT0gcXVlcnkuc2VsZWN0b3IpIHtcbiAgICAgIGlmIChpLm9iajYgPT09IFVOREVGSU5FRCkgaS5vYmo2ID0gaS5pbnN0YW50aWF0ZVByb3ZpZGVyKHAucHJvdmlkZXI2LCBwLnZpc2liaWxpdHk2KTtcbiAgICAgIGxpc3QucHVzaChpLm9iajYpO1xuICAgIH1cbiAgICBpZiAoaXNQcmVzZW50KHAucHJvdmlkZXI3KSAmJiBwLnByb3ZpZGVyNy5rZXkudG9rZW4gPT09IHF1ZXJ5LnNlbGVjdG9yKSB7XG4gICAgICBpZiAoaS5vYmo3ID09PSBVTkRFRklORUQpIGkub2JqNyA9IGkuaW5zdGFudGlhdGVQcm92aWRlcihwLnByb3ZpZGVyNywgcC52aXNpYmlsaXR5Nyk7XG4gICAgICBsaXN0LnB1c2goaS5vYmo3KTtcbiAgICB9XG4gICAgaWYgKGlzUHJlc2VudChwLnByb3ZpZGVyOCkgJiYgcC5wcm92aWRlcjgua2V5LnRva2VuID09PSBxdWVyeS5zZWxlY3Rvcikge1xuICAgICAgaWYgKGkub2JqOCA9PT0gVU5ERUZJTkVEKSBpLm9iajggPSBpLmluc3RhbnRpYXRlUHJvdmlkZXIocC5wcm92aWRlcjgsIHAudmlzaWJpbGl0eTgpO1xuICAgICAgbGlzdC5wdXNoKGkub2JqOCk7XG4gICAgfVxuICAgIGlmIChpc1ByZXNlbnQocC5wcm92aWRlcjkpICYmIHAucHJvdmlkZXI5LmtleS50b2tlbiA9PT0gcXVlcnkuc2VsZWN0b3IpIHtcbiAgICAgIGlmIChpLm9iajkgPT09IFVOREVGSU5FRCkgaS5vYmo5ID0gaS5pbnN0YW50aWF0ZVByb3ZpZGVyKHAucHJvdmlkZXI5LCBwLnZpc2liaWxpdHk5KTtcbiAgICAgIGxpc3QucHVzaChpLm9iajkpO1xuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIFN0cmF0ZWd5IHVzZWQgYnkgdGhlIGBFbGVtZW50SW5qZWN0b3JgIHdoZW4gdGhlIG51bWJlciBvZiBiaW5kaW5ncyBpcyAxMSBvciBtb3JlLlxuICogSW4gc3VjaCBhIGNhc2UsIHRoZXJlIGFyZSB0b28gbWFueSBmaWVsZHMgdG8gaW5saW5lIChzZWUgRWxlbWVudEluamVjdG9ySW5saW5lU3RyYXRlZ3kpLlxuICovXG5jbGFzcyBFbGVtZW50RGlyZWN0aXZlRHluYW1pY1N0cmF0ZWd5IGltcGxlbWVudHMgX0VsZW1lbnREaXJlY3RpdmVTdHJhdGVneSB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBpbmplY3RvclN0cmF0ZWd5OiBJbmplY3RvckR5bmFtaWNTdHJhdGVneSwgcHVibGljIF9laTogQXBwRWxlbWVudCkge31cblxuICBpbml0KCk6IHZvaWQge1xuICAgIHZhciBpbmogPSB0aGlzLmluamVjdG9yU3RyYXRlZ3k7XG4gICAgdmFyIHAgPSBpbmoucHJvdG9TdHJhdGVneTtcbiAgICBpbmoucmVzZXRDb25zdHJ1Y3Rpb25Db3VudGVyKCk7XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHAua2V5SWRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAocC5wcm92aWRlcnNbaV0gaW5zdGFuY2VvZiBEaXJlY3RpdmVQcm92aWRlciAmJiBpc1ByZXNlbnQocC5rZXlJZHNbaV0pICYmXG4gICAgICAgICAgaW5qLm9ianNbaV0gPT09IFVOREVGSU5FRCkge1xuICAgICAgICBpbmoub2Jqc1tpXSA9IGluai5pbnN0YW50aWF0ZVByb3ZpZGVyKHAucHJvdmlkZXJzW2ldLCBwLnZpc2liaWxpdGllc1tpXSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZ2V0Q29tcG9uZW50KCk6IGFueSB7IHJldHVybiB0aGlzLmluamVjdG9yU3RyYXRlZ3kub2Jqc1swXTsgfVxuXG4gIGlzQ29tcG9uZW50S2V5KGtleTogS2V5KTogYm9vbGVhbiB7XG4gICAgdmFyIHAgPSB0aGlzLmluamVjdG9yU3RyYXRlZ3kucHJvdG9TdHJhdGVneTtcbiAgICByZXR1cm4gdGhpcy5fZWkucHJvdG8uZmlyc3RQcm92aWRlcklzQ29tcG9uZW50ICYmIGlzUHJlc2VudChrZXkpICYmIGtleS5pZCA9PT0gcC5rZXlJZHNbMF07XG4gIH1cblxuICBhZGREaXJlY3RpdmVzTWF0Y2hpbmdRdWVyeShxdWVyeTogUXVlcnlNZXRhZGF0YSwgbGlzdDogYW55W10pOiB2b2lkIHtcbiAgICB2YXIgaXN0ID0gdGhpcy5pbmplY3RvclN0cmF0ZWd5O1xuICAgIHZhciBwID0gaXN0LnByb3RvU3RyYXRlZ3k7XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHAucHJvdmlkZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAocC5wcm92aWRlcnNbaV0ua2V5LnRva2VuID09PSBxdWVyeS5zZWxlY3Rvcikge1xuICAgICAgICBpZiAoaXN0Lm9ianNbaV0gPT09IFVOREVGSU5FRCkge1xuICAgICAgICAgIGlzdC5vYmpzW2ldID0gaXN0Lmluc3RhbnRpYXRlUHJvdmlkZXIocC5wcm92aWRlcnNbaV0sIHAudmlzaWJpbGl0aWVzW2ldKTtcbiAgICAgICAgfVxuICAgICAgICBsaXN0LnB1c2goaXN0Lm9ianNbaV0pO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgUHJvdG9RdWVyeVJlZiB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBkaXJJbmRleDogbnVtYmVyLCBwdWJsaWMgc2V0dGVyOiBTZXR0ZXJGbiwgcHVibGljIHF1ZXJ5OiBRdWVyeU1ldGFkYXRhKSB7fVxuXG4gIGdldCB1c2VzUHJvcGVydHlTeW50YXgoKTogYm9vbGVhbiB7IHJldHVybiBpc1ByZXNlbnQodGhpcy5zZXR0ZXIpOyB9XG59XG5cbmV4cG9ydCBjbGFzcyBRdWVyeVJlZiB7XG4gIHB1YmxpYyBsaXN0OiBRdWVyeUxpc3Q8YW55PjtcbiAgcHVibGljIGRpcnR5OiBib29sZWFuO1xuXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBwcm90b1F1ZXJ5UmVmOiBQcm90b1F1ZXJ5UmVmLCBwcml2YXRlIG9yaWdpbmF0b3I6IEFwcEVsZW1lbnQpIHtcbiAgICB0aGlzLmxpc3QgPSBuZXcgUXVlcnlMaXN0PGFueT4oKTtcbiAgICB0aGlzLmRpcnR5ID0gdHJ1ZTtcbiAgfVxuXG4gIGdldCBpc1ZpZXdRdWVyeSgpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMucHJvdG9RdWVyeVJlZi5xdWVyeS5pc1ZpZXdRdWVyeTsgfVxuXG4gIHVwZGF0ZSgpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuZGlydHkpIHJldHVybjtcbiAgICB0aGlzLl91cGRhdGUoKTtcbiAgICB0aGlzLmRpcnR5ID0gZmFsc2U7XG5cbiAgICAvLyBUT0RPIGRlbGV0ZSB0aGUgY2hlY2sgb25jZSBvbmx5IGZpZWxkIHF1ZXJpZXMgYXJlIHN1cHBvcnRlZFxuICAgIGlmICh0aGlzLnByb3RvUXVlcnlSZWYudXNlc1Byb3BlcnR5U3ludGF4KSB7XG4gICAgICB2YXIgZGlyID0gdGhpcy5vcmlnaW5hdG9yLmdldERpcmVjdGl2ZUF0SW5kZXgodGhpcy5wcm90b1F1ZXJ5UmVmLmRpckluZGV4KTtcbiAgICAgIGlmICh0aGlzLnByb3RvUXVlcnlSZWYucXVlcnkuZmlyc3QpIHtcbiAgICAgICAgdGhpcy5wcm90b1F1ZXJ5UmVmLnNldHRlcihkaXIsIHRoaXMubGlzdC5sZW5ndGggPiAwID8gdGhpcy5saXN0LmZpcnN0IDogbnVsbCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnByb3RvUXVlcnlSZWYuc2V0dGVyKGRpciwgdGhpcy5saXN0KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLmxpc3Qubm90aWZ5T25DaGFuZ2VzKCk7XG4gIH1cblxuICBwcml2YXRlIF91cGRhdGUoKTogdm9pZCB7XG4gICAgdmFyIGFnZ3JlZ2F0b3IgPSBbXTtcbiAgICBpZiAodGhpcy5wcm90b1F1ZXJ5UmVmLnF1ZXJ5LmlzVmlld1F1ZXJ5KSB7XG4gICAgICAvLyBpbnRlbnRpb25hbGx5IHNraXBwaW5nIG9yaWdpbmF0b3IgZm9yIHZpZXcgcXVlcmllcy5cbiAgICAgIHZhciBuZXN0ZWRWaWV3ID0gdGhpcy5vcmlnaW5hdG9yLmNvbXBvbmVudFZpZXc7XG4gICAgICBpZiAoaXNQcmVzZW50KG5lc3RlZFZpZXcpKSB0aGlzLl92aXNpdFZpZXcobmVzdGVkVmlldywgYWdncmVnYXRvcik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX3Zpc2l0KHRoaXMub3JpZ2luYXRvciwgYWdncmVnYXRvcik7XG4gICAgfVxuICAgIHRoaXMubGlzdC5yZXNldChhZ2dyZWdhdG9yKTtcbiAgfTtcblxuICBwcml2YXRlIF92aXNpdChpbmo6IEFwcEVsZW1lbnQsIGFnZ3JlZ2F0b3I6IGFueVtdKTogdm9pZCB7XG4gICAgdmFyIHZpZXcgPSBpbmoucGFyZW50VmlldztcbiAgICB2YXIgc3RhcnRJZHggPSBpbmoucHJvdG8uaW5kZXg7XG4gICAgZm9yICh2YXIgaSA9IHN0YXJ0SWR4OyBpIDwgdmlldy5hcHBFbGVtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGN1ckluaiA9IHZpZXcuYXBwRWxlbWVudHNbaV07XG4gICAgICAvLyBUaGUgZmlyc3QgaW5qZWN0b3IgYWZ0ZXIgaW5qLCB0aGF0IGlzIG91dHNpZGUgdGhlIHN1YnRyZWUgcm9vdGVkIGF0XG4gICAgICAvLyBpbmogaGFzIHRvIGhhdmUgYSBudWxsIHBhcmVudCBvciBhIHBhcmVudCB0aGF0IGlzIGFuIGFuY2VzdG9yIG9mIGluai5cbiAgICAgIGlmIChpID4gc3RhcnRJZHggJiYgKGlzQmxhbmsoY3VySW5qLnBhcmVudCkgfHwgY3VySW5qLnBhcmVudC5wcm90by5pbmRleCA8IHN0YXJ0SWR4KSkge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cblxuICAgICAgaWYgKCF0aGlzLnByb3RvUXVlcnlSZWYucXVlcnkuZGVzY2VuZGFudHMgJiZcbiAgICAgICAgICAhKGN1ckluai5wYXJlbnQgPT0gdGhpcy5vcmlnaW5hdG9yIHx8IGN1ckluaiA9PSB0aGlzLm9yaWdpbmF0b3IpKVxuICAgICAgICBjb250aW51ZTtcblxuICAgICAgLy8gV2UgdmlzaXQgdGhlIHZpZXcgY29udGFpbmVyKFZDKSB2aWV3cyByaWdodCBhZnRlciB0aGUgaW5qZWN0b3IgdGhhdCBjb250YWluc1xuICAgICAgLy8gdGhlIFZDLiBUaGVvcmV0aWNhbGx5LCB0aGF0IG1pZ2h0IG5vdCBiZSB0aGUgcmlnaHQgb3JkZXIgaWYgdGhlcmUgYXJlXG4gICAgICAvLyBjaGlsZCBpbmplY3RvcnMgb2Ygc2FpZCBpbmplY3Rvci4gTm90IGNsZWFyIHdoZXRoZXIgaWYgc3VjaCBjYXNlIGNhblxuICAgICAgLy8gZXZlbiBiZSBjb25zdHJ1Y3RlZCB3aXRoIHRoZSBjdXJyZW50IGFwaXMuXG4gICAgICB0aGlzLl92aXNpdEluamVjdG9yKGN1ckluaiwgYWdncmVnYXRvcik7XG4gICAgICB0aGlzLl92aXNpdFZpZXdDb250YWluZXJWaWV3cyhjdXJJbmoubmVzdGVkVmlld3MsIGFnZ3JlZ2F0b3IpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX3Zpc2l0SW5qZWN0b3IoaW5qOiBBcHBFbGVtZW50LCBhZ2dyZWdhdG9yOiBhbnlbXSkge1xuICAgIGlmICh0aGlzLnByb3RvUXVlcnlSZWYucXVlcnkuaXNWYXJCaW5kaW5nUXVlcnkpIHtcbiAgICAgIHRoaXMuX2FnZ3JlZ2F0ZVZhcmlhYmxlQmluZGluZyhpbmosIGFnZ3JlZ2F0b3IpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9hZ2dyZWdhdGVEaXJlY3RpdmUoaW5qLCBhZ2dyZWdhdG9yKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF92aXNpdFZpZXdDb250YWluZXJWaWV3cyh2aWV3czogQXBwVmlld1tdLCBhZ2dyZWdhdG9yOiBhbnlbXSkge1xuICAgIGlmIChpc1ByZXNlbnQodmlld3MpKSB7XG4gICAgICBmb3IgKHZhciBqID0gMDsgaiA8IHZpZXdzLmxlbmd0aDsgaisrKSB7XG4gICAgICAgIHRoaXMuX3Zpc2l0Vmlldyh2aWV3c1tqXSwgYWdncmVnYXRvcik7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfdmlzaXRWaWV3KHZpZXc6IEFwcFZpZXcsIGFnZ3JlZ2F0b3I6IGFueVtdKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB2aWV3LmFwcEVsZW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgaW5qID0gdmlldy5hcHBFbGVtZW50c1tpXTtcbiAgICAgIHRoaXMuX3Zpc2l0SW5qZWN0b3IoaW5qLCBhZ2dyZWdhdG9yKTtcbiAgICAgIHRoaXMuX3Zpc2l0Vmlld0NvbnRhaW5lclZpZXdzKGluai5uZXN0ZWRWaWV3cywgYWdncmVnYXRvcik7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfYWdncmVnYXRlVmFyaWFibGVCaW5kaW5nKGluajogQXBwRWxlbWVudCwgYWdncmVnYXRvcjogYW55W10pOiB2b2lkIHtcbiAgICB2YXIgdmIgPSB0aGlzLnByb3RvUXVlcnlSZWYucXVlcnkudmFyQmluZGluZ3M7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB2Yi5sZW5ndGg7ICsraSkge1xuICAgICAgaWYgKGluai5oYXNWYXJpYWJsZUJpbmRpbmcodmJbaV0pKSB7XG4gICAgICAgIGFnZ3JlZ2F0b3IucHVzaChpbmouZ2V0VmFyaWFibGVCaW5kaW5nKHZiW2ldKSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfYWdncmVnYXRlRGlyZWN0aXZlKGluajogQXBwRWxlbWVudCwgYWdncmVnYXRvcjogYW55W10pOiB2b2lkIHtcbiAgICBpbmouYWRkRGlyZWN0aXZlc01hdGNoaW5nUXVlcnkodGhpcy5wcm90b1F1ZXJ5UmVmLnF1ZXJ5LCBhZ2dyZWdhdG9yKTtcbiAgfVxufVxuXG5jbGFzcyBfQ29tcG9uZW50Vmlld0NoYW5nZURldGVjdG9yUmVmIGV4dGVuZHMgQ2hhbmdlRGV0ZWN0b3JSZWYge1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9hcHBFbGVtZW50OiBBcHBFbGVtZW50KSB7IHN1cGVyKCk7IH1cblxuICBtYXJrRm9yQ2hlY2soKTogdm9pZCB7IHRoaXMuX2FwcEVsZW1lbnQuY29tcG9uZW50Vmlldy5jaGFuZ2VEZXRlY3Rvci5yZWYubWFya0ZvckNoZWNrKCk7IH1cbiAgZGV0YWNoKCk6IHZvaWQgeyB0aGlzLl9hcHBFbGVtZW50LmNvbXBvbmVudFZpZXcuY2hhbmdlRGV0ZWN0b3IucmVmLmRldGFjaCgpOyB9XG4gIGRldGVjdENoYW5nZXMoKTogdm9pZCB7IHRoaXMuX2FwcEVsZW1lbnQuY29tcG9uZW50Vmlldy5jaGFuZ2VEZXRlY3Rvci5yZWYuZGV0ZWN0Q2hhbmdlcygpOyB9XG4gIGNoZWNrTm9DaGFuZ2VzKCk6IHZvaWQgeyB0aGlzLl9hcHBFbGVtZW50LmNvbXBvbmVudFZpZXcuY2hhbmdlRGV0ZWN0b3IucmVmLmNoZWNrTm9DaGFuZ2VzKCk7IH1cbiAgcmVhdHRhY2goKTogdm9pZCB7IHRoaXMuX2FwcEVsZW1lbnQuY29tcG9uZW50Vmlldy5jaGFuZ2VEZXRlY3Rvci5yZWYucmVhdHRhY2goKTsgfVxufVxuIl19