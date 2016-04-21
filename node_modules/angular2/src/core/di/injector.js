'use strict';"use strict";
var collection_1 = require('angular2/src/facade/collection');
var provider_1 = require('./provider');
var exceptions_1 = require('./exceptions');
var lang_1 = require('angular2/src/facade/lang');
var exceptions_2 = require('angular2/src/facade/exceptions');
var key_1 = require('./key');
var metadata_1 = require('./metadata');
// Threshold for the dynamic version
var _MAX_CONSTRUCTION_COUNTER = 10;
exports.UNDEFINED = lang_1.CONST_EXPR(new Object());
/**
 * Visibility of a {@link Provider}.
 */
(function (Visibility) {
    /**
     * A `Public` {@link Provider} is only visible to regular (as opposed to host) child injectors.
     */
    Visibility[Visibility["Public"] = 0] = "Public";
    /**
     * A `Private` {@link Provider} is only visible to host (as opposed to regular) child injectors.
     */
    Visibility[Visibility["Private"] = 1] = "Private";
    /**
     * A `PublicAndPrivate` {@link Provider} is visible to both host and regular child injectors.
     */
    Visibility[Visibility["PublicAndPrivate"] = 2] = "PublicAndPrivate";
})(exports.Visibility || (exports.Visibility = {}));
var Visibility = exports.Visibility;
function canSee(src, dst) {
    return (src === dst) ||
        (dst === Visibility.PublicAndPrivate || src === Visibility.PublicAndPrivate);
}
var ProtoInjectorInlineStrategy = (function () {
    function ProtoInjectorInlineStrategy(protoEI, bwv) {
        this.provider0 = null;
        this.provider1 = null;
        this.provider2 = null;
        this.provider3 = null;
        this.provider4 = null;
        this.provider5 = null;
        this.provider6 = null;
        this.provider7 = null;
        this.provider8 = null;
        this.provider9 = null;
        this.keyId0 = null;
        this.keyId1 = null;
        this.keyId2 = null;
        this.keyId3 = null;
        this.keyId4 = null;
        this.keyId5 = null;
        this.keyId6 = null;
        this.keyId7 = null;
        this.keyId8 = null;
        this.keyId9 = null;
        this.visibility0 = null;
        this.visibility1 = null;
        this.visibility2 = null;
        this.visibility3 = null;
        this.visibility4 = null;
        this.visibility5 = null;
        this.visibility6 = null;
        this.visibility7 = null;
        this.visibility8 = null;
        this.visibility9 = null;
        var length = bwv.length;
        if (length > 0) {
            this.provider0 = bwv[0].provider;
            this.keyId0 = bwv[0].getKeyId();
            this.visibility0 = bwv[0].visibility;
        }
        if (length > 1) {
            this.provider1 = bwv[1].provider;
            this.keyId1 = bwv[1].getKeyId();
            this.visibility1 = bwv[1].visibility;
        }
        if (length > 2) {
            this.provider2 = bwv[2].provider;
            this.keyId2 = bwv[2].getKeyId();
            this.visibility2 = bwv[2].visibility;
        }
        if (length > 3) {
            this.provider3 = bwv[3].provider;
            this.keyId3 = bwv[3].getKeyId();
            this.visibility3 = bwv[3].visibility;
        }
        if (length > 4) {
            this.provider4 = bwv[4].provider;
            this.keyId4 = bwv[4].getKeyId();
            this.visibility4 = bwv[4].visibility;
        }
        if (length > 5) {
            this.provider5 = bwv[5].provider;
            this.keyId5 = bwv[5].getKeyId();
            this.visibility5 = bwv[5].visibility;
        }
        if (length > 6) {
            this.provider6 = bwv[6].provider;
            this.keyId6 = bwv[6].getKeyId();
            this.visibility6 = bwv[6].visibility;
        }
        if (length > 7) {
            this.provider7 = bwv[7].provider;
            this.keyId7 = bwv[7].getKeyId();
            this.visibility7 = bwv[7].visibility;
        }
        if (length > 8) {
            this.provider8 = bwv[8].provider;
            this.keyId8 = bwv[8].getKeyId();
            this.visibility8 = bwv[8].visibility;
        }
        if (length > 9) {
            this.provider9 = bwv[9].provider;
            this.keyId9 = bwv[9].getKeyId();
            this.visibility9 = bwv[9].visibility;
        }
    }
    ProtoInjectorInlineStrategy.prototype.getProviderAtIndex = function (index) {
        if (index == 0)
            return this.provider0;
        if (index == 1)
            return this.provider1;
        if (index == 2)
            return this.provider2;
        if (index == 3)
            return this.provider3;
        if (index == 4)
            return this.provider4;
        if (index == 5)
            return this.provider5;
        if (index == 6)
            return this.provider6;
        if (index == 7)
            return this.provider7;
        if (index == 8)
            return this.provider8;
        if (index == 9)
            return this.provider9;
        throw new exceptions_1.OutOfBoundsError(index);
    };
    ProtoInjectorInlineStrategy.prototype.createInjectorStrategy = function (injector) {
        return new InjectorInlineStrategy(injector, this);
    };
    return ProtoInjectorInlineStrategy;
}());
exports.ProtoInjectorInlineStrategy = ProtoInjectorInlineStrategy;
var ProtoInjectorDynamicStrategy = (function () {
    function ProtoInjectorDynamicStrategy(protoInj, bwv) {
        var len = bwv.length;
        this.providers = collection_1.ListWrapper.createFixedSize(len);
        this.keyIds = collection_1.ListWrapper.createFixedSize(len);
        this.visibilities = collection_1.ListWrapper.createFixedSize(len);
        for (var i = 0; i < len; i++) {
            this.providers[i] = bwv[i].provider;
            this.keyIds[i] = bwv[i].getKeyId();
            this.visibilities[i] = bwv[i].visibility;
        }
    }
    ProtoInjectorDynamicStrategy.prototype.getProviderAtIndex = function (index) {
        if (index < 0 || index >= this.providers.length) {
            throw new exceptions_1.OutOfBoundsError(index);
        }
        return this.providers[index];
    };
    ProtoInjectorDynamicStrategy.prototype.createInjectorStrategy = function (ei) {
        return new InjectorDynamicStrategy(this, ei);
    };
    return ProtoInjectorDynamicStrategy;
}());
exports.ProtoInjectorDynamicStrategy = ProtoInjectorDynamicStrategy;
var ProtoInjector = (function () {
    function ProtoInjector(bwv) {
        this.numberOfProviders = bwv.length;
        this._strategy = bwv.length > _MAX_CONSTRUCTION_COUNTER ?
            new ProtoInjectorDynamicStrategy(this, bwv) :
            new ProtoInjectorInlineStrategy(this, bwv);
    }
    ProtoInjector.fromResolvedProviders = function (providers) {
        var bd = providers.map(function (b) { return new ProviderWithVisibility(b, Visibility.Public); });
        return new ProtoInjector(bd);
    };
    ProtoInjector.prototype.getProviderAtIndex = function (index) {
        return this._strategy.getProviderAtIndex(index);
    };
    return ProtoInjector;
}());
exports.ProtoInjector = ProtoInjector;
var InjectorInlineStrategy = (function () {
    function InjectorInlineStrategy(injector, protoStrategy) {
        this.injector = injector;
        this.protoStrategy = protoStrategy;
        this.obj0 = exports.UNDEFINED;
        this.obj1 = exports.UNDEFINED;
        this.obj2 = exports.UNDEFINED;
        this.obj3 = exports.UNDEFINED;
        this.obj4 = exports.UNDEFINED;
        this.obj5 = exports.UNDEFINED;
        this.obj6 = exports.UNDEFINED;
        this.obj7 = exports.UNDEFINED;
        this.obj8 = exports.UNDEFINED;
        this.obj9 = exports.UNDEFINED;
    }
    InjectorInlineStrategy.prototype.resetConstructionCounter = function () { this.injector._constructionCounter = 0; };
    InjectorInlineStrategy.prototype.instantiateProvider = function (provider, visibility) {
        return this.injector._new(provider, visibility);
    };
    InjectorInlineStrategy.prototype.getObjByKeyId = function (keyId, visibility) {
        var p = this.protoStrategy;
        var inj = this.injector;
        if (p.keyId0 === keyId && canSee(p.visibility0, visibility)) {
            if (this.obj0 === exports.UNDEFINED) {
                this.obj0 = inj._new(p.provider0, p.visibility0);
            }
            return this.obj0;
        }
        if (p.keyId1 === keyId && canSee(p.visibility1, visibility)) {
            if (this.obj1 === exports.UNDEFINED) {
                this.obj1 = inj._new(p.provider1, p.visibility1);
            }
            return this.obj1;
        }
        if (p.keyId2 === keyId && canSee(p.visibility2, visibility)) {
            if (this.obj2 === exports.UNDEFINED) {
                this.obj2 = inj._new(p.provider2, p.visibility2);
            }
            return this.obj2;
        }
        if (p.keyId3 === keyId && canSee(p.visibility3, visibility)) {
            if (this.obj3 === exports.UNDEFINED) {
                this.obj3 = inj._new(p.provider3, p.visibility3);
            }
            return this.obj3;
        }
        if (p.keyId4 === keyId && canSee(p.visibility4, visibility)) {
            if (this.obj4 === exports.UNDEFINED) {
                this.obj4 = inj._new(p.provider4, p.visibility4);
            }
            return this.obj4;
        }
        if (p.keyId5 === keyId && canSee(p.visibility5, visibility)) {
            if (this.obj5 === exports.UNDEFINED) {
                this.obj5 = inj._new(p.provider5, p.visibility5);
            }
            return this.obj5;
        }
        if (p.keyId6 === keyId && canSee(p.visibility6, visibility)) {
            if (this.obj6 === exports.UNDEFINED) {
                this.obj6 = inj._new(p.provider6, p.visibility6);
            }
            return this.obj6;
        }
        if (p.keyId7 === keyId && canSee(p.visibility7, visibility)) {
            if (this.obj7 === exports.UNDEFINED) {
                this.obj7 = inj._new(p.provider7, p.visibility7);
            }
            return this.obj7;
        }
        if (p.keyId8 === keyId && canSee(p.visibility8, visibility)) {
            if (this.obj8 === exports.UNDEFINED) {
                this.obj8 = inj._new(p.provider8, p.visibility8);
            }
            return this.obj8;
        }
        if (p.keyId9 === keyId && canSee(p.visibility9, visibility)) {
            if (this.obj9 === exports.UNDEFINED) {
                this.obj9 = inj._new(p.provider9, p.visibility9);
            }
            return this.obj9;
        }
        return exports.UNDEFINED;
    };
    InjectorInlineStrategy.prototype.getObjAtIndex = function (index) {
        if (index == 0)
            return this.obj0;
        if (index == 1)
            return this.obj1;
        if (index == 2)
            return this.obj2;
        if (index == 3)
            return this.obj3;
        if (index == 4)
            return this.obj4;
        if (index == 5)
            return this.obj5;
        if (index == 6)
            return this.obj6;
        if (index == 7)
            return this.obj7;
        if (index == 8)
            return this.obj8;
        if (index == 9)
            return this.obj9;
        throw new exceptions_1.OutOfBoundsError(index);
    };
    InjectorInlineStrategy.prototype.getMaxNumberOfObjects = function () { return _MAX_CONSTRUCTION_COUNTER; };
    return InjectorInlineStrategy;
}());
exports.InjectorInlineStrategy = InjectorInlineStrategy;
var InjectorDynamicStrategy = (function () {
    function InjectorDynamicStrategy(protoStrategy, injector) {
        this.protoStrategy = protoStrategy;
        this.injector = injector;
        this.objs = collection_1.ListWrapper.createFixedSize(protoStrategy.providers.length);
        collection_1.ListWrapper.fill(this.objs, exports.UNDEFINED);
    }
    InjectorDynamicStrategy.prototype.resetConstructionCounter = function () { this.injector._constructionCounter = 0; };
    InjectorDynamicStrategy.prototype.instantiateProvider = function (provider, visibility) {
        return this.injector._new(provider, visibility);
    };
    InjectorDynamicStrategy.prototype.getObjByKeyId = function (keyId, visibility) {
        var p = this.protoStrategy;
        for (var i = 0; i < p.keyIds.length; i++) {
            if (p.keyIds[i] === keyId && canSee(p.visibilities[i], visibility)) {
                if (this.objs[i] === exports.UNDEFINED) {
                    this.objs[i] = this.injector._new(p.providers[i], p.visibilities[i]);
                }
                return this.objs[i];
            }
        }
        return exports.UNDEFINED;
    };
    InjectorDynamicStrategy.prototype.getObjAtIndex = function (index) {
        if (index < 0 || index >= this.objs.length) {
            throw new exceptions_1.OutOfBoundsError(index);
        }
        return this.objs[index];
    };
    InjectorDynamicStrategy.prototype.getMaxNumberOfObjects = function () { return this.objs.length; };
    return InjectorDynamicStrategy;
}());
exports.InjectorDynamicStrategy = InjectorDynamicStrategy;
var ProviderWithVisibility = (function () {
    function ProviderWithVisibility(provider, visibility) {
        this.provider = provider;
        this.visibility = visibility;
    }
    ;
    ProviderWithVisibility.prototype.getKeyId = function () { return this.provider.key.id; };
    return ProviderWithVisibility;
}());
exports.ProviderWithVisibility = ProviderWithVisibility;
/**
 * A dependency injection container used for instantiating objects and resolving dependencies.
 *
 * An `Injector` is a replacement for a `new` operator, which can automatically resolve the
 * constructor dependencies.
 *
 * In typical use, application code asks for the dependencies in the constructor and they are
 * resolved by the `Injector`.
 *
 * ### Example ([live demo](http://plnkr.co/edit/jzjec0?p=preview))
 *
 * The following example creates an `Injector` configured to create `Engine` and `Car`.
 *
 * ```typescript
 * @Injectable()
 * class Engine {
 * }
 *
 * @Injectable()
 * class Car {
 *   constructor(public engine:Engine) {}
 * }
 *
 * var injector = Injector.resolveAndCreate([Car, Engine]);
 * var car = injector.get(Car);
 * expect(car instanceof Car).toBe(true);
 * expect(car.engine instanceof Engine).toBe(true);
 * ```
 *
 * Notice, we don't use the `new` operator because we explicitly want to have the `Injector`
 * resolve all of the object's dependencies automatically.
 */
var Injector = (function () {
    /**
     * Private
     */
    function Injector(_proto /* ProtoInjector */, _parent, _isHostBoundary, _depProvider, _debugContext) {
        if (_parent === void 0) { _parent = null; }
        if (_isHostBoundary === void 0) { _isHostBoundary = false; }
        if (_depProvider === void 0) { _depProvider = null; }
        if (_debugContext === void 0) { _debugContext = null; }
        this._isHostBoundary = _isHostBoundary;
        this._depProvider = _depProvider;
        this._debugContext = _debugContext;
        /** @internal */
        this._constructionCounter = 0;
        this._proto = _proto;
        this._parent = _parent;
        this._strategy = _proto._strategy.createInjectorStrategy(this);
    }
    /**
     * Turns an array of provider definitions into an array of resolved providers.
     *
     * A resolution is a process of flattening multiple nested arrays and converting individual
     * providers into an array of {@link ResolvedProvider}s.
     *
     * ### Example ([live demo](http://plnkr.co/edit/AiXTHi?p=preview))
     *
     * ```typescript
     * @Injectable()
     * class Engine {
     * }
     *
     * @Injectable()
     * class Car {
     *   constructor(public engine:Engine) {}
     * }
     *
     * var providers = Injector.resolve([Car, [[Engine]]]);
     *
     * expect(providers.length).toEqual(2);
     *
     * expect(providers[0] instanceof ResolvedProvider).toBe(true);
     * expect(providers[0].key.displayName).toBe("Car");
     * expect(providers[0].dependencies.length).toEqual(1);
     * expect(providers[0].factory).toBeDefined();
     *
     * expect(providers[1].key.displayName).toBe("Engine");
     * });
     * ```
     *
     * See {@link Injector#fromResolvedProviders} for more info.
     */
    Injector.resolve = function (providers) {
        return provider_1.resolveProviders(providers);
    };
    /**
     * Resolves an array of providers and creates an injector from those providers.
     *
     * The passed-in providers can be an array of `Type`, {@link Provider},
     * or a recursive array of more providers.
     *
     * ### Example ([live demo](http://plnkr.co/edit/ePOccA?p=preview))
     *
     * ```typescript
     * @Injectable()
     * class Engine {
     * }
     *
     * @Injectable()
     * class Car {
     *   constructor(public engine:Engine) {}
     * }
     *
     * var injector = Injector.resolveAndCreate([Car, Engine]);
     * expect(injector.get(Car) instanceof Car).toBe(true);
     * ```
     *
     * This function is slower than the corresponding `fromResolvedProviders`
     * because it needs to resolve the passed-in providers first.
     * See {@link Injector#resolve} and {@link Injector#fromResolvedProviders}.
     */
    Injector.resolveAndCreate = function (providers) {
        var resolvedProviders = Injector.resolve(providers);
        return Injector.fromResolvedProviders(resolvedProviders);
    };
    /**
     * Creates an injector from previously resolved providers.
     *
     * This API is the recommended way to construct injectors in performance-sensitive parts.
     *
     * ### Example ([live demo](http://plnkr.co/edit/KrSMci?p=preview))
     *
     * ```typescript
     * @Injectable()
     * class Engine {
     * }
     *
     * @Injectable()
     * class Car {
     *   constructor(public engine:Engine) {}
     * }
     *
     * var providers = Injector.resolve([Car, Engine]);
     * var injector = Injector.fromResolvedProviders(providers);
     * expect(injector.get(Car) instanceof Car).toBe(true);
     * ```
     */
    Injector.fromResolvedProviders = function (providers) {
        return new Injector(ProtoInjector.fromResolvedProviders(providers));
    };
    /**
     * @deprecated
     */
    Injector.fromResolvedBindings = function (providers) {
        return Injector.fromResolvedProviders(providers);
    };
    Object.defineProperty(Injector.prototype, "hostBoundary", {
        /**
         * Whether this injector is a boundary to a host.
         * @internal
         */
        get: function () { return this._isHostBoundary; },
        enumerable: true,
        configurable: true
    });
    /**
     * @internal
     */
    Injector.prototype.debugContext = function () { return this._debugContext(); };
    /**
     * Retrieves an instance from the injector based on the provided token.
     * Throws {@link NoProviderError} if not found.
     *
     * ### Example ([live demo](http://plnkr.co/edit/HeXSHg?p=preview))
     *
     * ```typescript
     * var injector = Injector.resolveAndCreate([
     *   provide("validToken", {useValue: "Value"})
     * ]);
     * expect(injector.get("validToken")).toEqual("Value");
     * expect(() => injector.get("invalidToken")).toThrowError();
     * ```
     *
     * `Injector` returns itself when given `Injector` as a token.
     *
     * ```typescript
     * var injector = Injector.resolveAndCreate([]);
     * expect(injector.get(Injector)).toBe(injector);
     * ```
     */
    Injector.prototype.get = function (token) {
        return this._getByKey(key_1.Key.get(token), null, null, false, Visibility.PublicAndPrivate);
    };
    /**
     * Retrieves an instance from the injector based on the provided token.
     * Returns null if not found.
     *
     * ### Example ([live demo](http://plnkr.co/edit/tpEbEy?p=preview))
     *
     * ```typescript
     * var injector = Injector.resolveAndCreate([
     *   provide("validToken", {useValue: "Value"})
     * ]);
     * expect(injector.getOptional("validToken")).toEqual("Value");
     * expect(injector.getOptional("invalidToken")).toBe(null);
     * ```
     *
     * `Injector` returns itself when given `Injector` as a token.
     *
     * ```typescript
     * var injector = Injector.resolveAndCreate([]);
     * expect(injector.getOptional(Injector)).toBe(injector);
     * ```
     */
    Injector.prototype.getOptional = function (token) {
        return this._getByKey(key_1.Key.get(token), null, null, true, Visibility.PublicAndPrivate);
    };
    /**
     * @internal
     */
    Injector.prototype.getAt = function (index) { return this._strategy.getObjAtIndex(index); };
    Object.defineProperty(Injector.prototype, "parent", {
        /**
         * Parent of this injector.
         *
         * <!-- TODO: Add a link to the section of the user guide talking about hierarchical injection.
         * -->
         *
         * ### Example ([live demo](http://plnkr.co/edit/eosMGo?p=preview))
         *
         * ```typescript
         * var parent = Injector.resolveAndCreate([]);
         * var child = parent.resolveAndCreateChild([]);
         * expect(child.parent).toBe(parent);
         * ```
         */
        get: function () { return this._parent; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Injector.prototype, "internalStrategy", {
        /**
         * @internal
         * Internal. Do not use.
         * We return `any` not to export the InjectorStrategy type.
         */
        get: function () { return this._strategy; },
        enumerable: true,
        configurable: true
    });
    /**
     * Resolves an array of providers and creates a child injector from those providers.
     *
     * <!-- TODO: Add a link to the section of the user guide talking about hierarchical injection.
     * -->
     *
     * The passed-in providers can be an array of `Type`, {@link Provider},
     * or a recursive array of more providers.
     *
     * ### Example ([live demo](http://plnkr.co/edit/opB3T4?p=preview))
     *
     * ```typescript
     * class ParentProvider {}
     * class ChildProvider {}
     *
     * var parent = Injector.resolveAndCreate([ParentProvider]);
     * var child = parent.resolveAndCreateChild([ChildProvider]);
     *
     * expect(child.get(ParentProvider) instanceof ParentProvider).toBe(true);
     * expect(child.get(ChildProvider) instanceof ChildProvider).toBe(true);
     * expect(child.get(ParentProvider)).toBe(parent.get(ParentProvider));
     * ```
     *
     * This function is slower than the corresponding `createChildFromResolved`
     * because it needs to resolve the passed-in providers first.
     * See {@link Injector#resolve} and {@link Injector#createChildFromResolved}.
     */
    Injector.prototype.resolveAndCreateChild = function (providers) {
        var resolvedProviders = Injector.resolve(providers);
        return this.createChildFromResolved(resolvedProviders);
    };
    /**
     * Creates a child injector from previously resolved providers.
     *
     * <!-- TODO: Add a link to the section of the user guide talking about hierarchical injection.
     * -->
     *
     * This API is the recommended way to construct injectors in performance-sensitive parts.
     *
     * ### Example ([live demo](http://plnkr.co/edit/VhyfjN?p=preview))
     *
     * ```typescript
     * class ParentProvider {}
     * class ChildProvider {}
     *
     * var parentProviders = Injector.resolve([ParentProvider]);
     * var childProviders = Injector.resolve([ChildProvider]);
     *
     * var parent = Injector.fromResolvedProviders(parentProviders);
     * var child = parent.createChildFromResolved(childProviders);
     *
     * expect(child.get(ParentProvider) instanceof ParentProvider).toBe(true);
     * expect(child.get(ChildProvider) instanceof ChildProvider).toBe(true);
     * expect(child.get(ParentProvider)).toBe(parent.get(ParentProvider));
     * ```
     */
    Injector.prototype.createChildFromResolved = function (providers) {
        var bd = providers.map(function (b) { return new ProviderWithVisibility(b, Visibility.Public); });
        var proto = new ProtoInjector(bd);
        var inj = new Injector(proto);
        inj._parent = this;
        return inj;
    };
    /**
     * Resolves a provider and instantiates an object in the context of the injector.
     *
     * The created object does not get cached by the injector.
     *
     * ### Example ([live demo](http://plnkr.co/edit/yvVXoB?p=preview))
     *
     * ```typescript
     * @Injectable()
     * class Engine {
     * }
     *
     * @Injectable()
     * class Car {
     *   constructor(public engine:Engine) {}
     * }
     *
     * var injector = Injector.resolveAndCreate([Engine]);
     *
     * var car = injector.resolveAndInstantiate(Car);
     * expect(car.engine).toBe(injector.get(Engine));
     * expect(car).not.toBe(injector.resolveAndInstantiate(Car));
     * ```
     */
    Injector.prototype.resolveAndInstantiate = function (provider) {
        return this.instantiateResolved(Injector.resolve([provider])[0]);
    };
    /**
     * Instantiates an object using a resolved provider in the context of the injector.
     *
     * The created object does not get cached by the injector.
     *
     * ### Example ([live demo](http://plnkr.co/edit/ptCImQ?p=preview))
     *
     * ```typescript
     * @Injectable()
     * class Engine {
     * }
     *
     * @Injectable()
     * class Car {
     *   constructor(public engine:Engine) {}
     * }
     *
     * var injector = Injector.resolveAndCreate([Engine]);
     * var carProvider = Injector.resolve([Car])[0];
     * var car = injector.instantiateResolved(carProvider);
     * expect(car.engine).toBe(injector.get(Engine));
     * expect(car).not.toBe(injector.instantiateResolved(carProvider));
     * ```
     */
    Injector.prototype.instantiateResolved = function (provider) {
        return this._instantiateProvider(provider, Visibility.PublicAndPrivate);
    };
    /** @internal */
    Injector.prototype._new = function (provider, visibility) {
        if (this._constructionCounter++ > this._strategy.getMaxNumberOfObjects()) {
            throw new exceptions_1.CyclicDependencyError(this, provider.key);
        }
        return this._instantiateProvider(provider, visibility);
    };
    Injector.prototype._instantiateProvider = function (provider, visibility) {
        if (provider.multiProvider) {
            var res = collection_1.ListWrapper.createFixedSize(provider.resolvedFactories.length);
            for (var i = 0; i < provider.resolvedFactories.length; ++i) {
                res[i] = this._instantiate(provider, provider.resolvedFactories[i], visibility);
            }
            return res;
        }
        else {
            return this._instantiate(provider, provider.resolvedFactories[0], visibility);
        }
    };
    Injector.prototype._instantiate = function (provider, resolvedFactory, visibility) {
        var factory = resolvedFactory.factory;
        var deps = resolvedFactory.dependencies;
        var length = deps.length;
        var d0;
        var d1;
        var d2;
        var d3;
        var d4;
        var d5;
        var d6;
        var d7;
        var d8;
        var d9;
        var d10;
        var d11;
        var d12;
        var d13;
        var d14;
        var d15;
        var d16;
        var d17;
        var d18;
        var d19;
        try {
            d0 = length > 0 ? this._getByDependency(provider, deps[0], visibility) : null;
            d1 = length > 1 ? this._getByDependency(provider, deps[1], visibility) : null;
            d2 = length > 2 ? this._getByDependency(provider, deps[2], visibility) : null;
            d3 = length > 3 ? this._getByDependency(provider, deps[3], visibility) : null;
            d4 = length > 4 ? this._getByDependency(provider, deps[4], visibility) : null;
            d5 = length > 5 ? this._getByDependency(provider, deps[5], visibility) : null;
            d6 = length > 6 ? this._getByDependency(provider, deps[6], visibility) : null;
            d7 = length > 7 ? this._getByDependency(provider, deps[7], visibility) : null;
            d8 = length > 8 ? this._getByDependency(provider, deps[8], visibility) : null;
            d9 = length > 9 ? this._getByDependency(provider, deps[9], visibility) : null;
            d10 = length > 10 ? this._getByDependency(provider, deps[10], visibility) : null;
            d11 = length > 11 ? this._getByDependency(provider, deps[11], visibility) : null;
            d12 = length > 12 ? this._getByDependency(provider, deps[12], visibility) : null;
            d13 = length > 13 ? this._getByDependency(provider, deps[13], visibility) : null;
            d14 = length > 14 ? this._getByDependency(provider, deps[14], visibility) : null;
            d15 = length > 15 ? this._getByDependency(provider, deps[15], visibility) : null;
            d16 = length > 16 ? this._getByDependency(provider, deps[16], visibility) : null;
            d17 = length > 17 ? this._getByDependency(provider, deps[17], visibility) : null;
            d18 = length > 18 ? this._getByDependency(provider, deps[18], visibility) : null;
            d19 = length > 19 ? this._getByDependency(provider, deps[19], visibility) : null;
        }
        catch (e) {
            if (e instanceof exceptions_1.AbstractProviderError || e instanceof exceptions_1.InstantiationError) {
                e.addKey(this, provider.key);
            }
            throw e;
        }
        var obj;
        try {
            switch (length) {
                case 0:
                    obj = factory();
                    break;
                case 1:
                    obj = factory(d0);
                    break;
                case 2:
                    obj = factory(d0, d1);
                    break;
                case 3:
                    obj = factory(d0, d1, d2);
                    break;
                case 4:
                    obj = factory(d0, d1, d2, d3);
                    break;
                case 5:
                    obj = factory(d0, d1, d2, d3, d4);
                    break;
                case 6:
                    obj = factory(d0, d1, d2, d3, d4, d5);
                    break;
                case 7:
                    obj = factory(d0, d1, d2, d3, d4, d5, d6);
                    break;
                case 8:
                    obj = factory(d0, d1, d2, d3, d4, d5, d6, d7);
                    break;
                case 9:
                    obj = factory(d0, d1, d2, d3, d4, d5, d6, d7, d8);
                    break;
                case 10:
                    obj = factory(d0, d1, d2, d3, d4, d5, d6, d7, d8, d9);
                    break;
                case 11:
                    obj = factory(d0, d1, d2, d3, d4, d5, d6, d7, d8, d9, d10);
                    break;
                case 12:
                    obj = factory(d0, d1, d2, d3, d4, d5, d6, d7, d8, d9, d10, d11);
                    break;
                case 13:
                    obj = factory(d0, d1, d2, d3, d4, d5, d6, d7, d8, d9, d10, d11, d12);
                    break;
                case 14:
                    obj = factory(d0, d1, d2, d3, d4, d5, d6, d7, d8, d9, d10, d11, d12, d13);
                    break;
                case 15:
                    obj = factory(d0, d1, d2, d3, d4, d5, d6, d7, d8, d9, d10, d11, d12, d13, d14);
                    break;
                case 16:
                    obj = factory(d0, d1, d2, d3, d4, d5, d6, d7, d8, d9, d10, d11, d12, d13, d14, d15);
                    break;
                case 17:
                    obj = factory(d0, d1, d2, d3, d4, d5, d6, d7, d8, d9, d10, d11, d12, d13, d14, d15, d16);
                    break;
                case 18:
                    obj = factory(d0, d1, d2, d3, d4, d5, d6, d7, d8, d9, d10, d11, d12, d13, d14, d15, d16, d17);
                    break;
                case 19:
                    obj = factory(d0, d1, d2, d3, d4, d5, d6, d7, d8, d9, d10, d11, d12, d13, d14, d15, d16, d17, d18);
                    break;
                case 20:
                    obj = factory(d0, d1, d2, d3, d4, d5, d6, d7, d8, d9, d10, d11, d12, d13, d14, d15, d16, d17, d18, d19);
                    break;
                default:
                    throw new exceptions_2.BaseException("Cannot instantiate '" + provider.key.displayName + "' because it has more than 20 dependencies");
            }
        }
        catch (e) {
            throw new exceptions_1.InstantiationError(this, e, e.stack, provider.key);
        }
        return obj;
    };
    Injector.prototype._getByDependency = function (provider, dep, providerVisibility) {
        var special = lang_1.isPresent(this._depProvider) ?
            this._depProvider.getDependency(this, provider, dep) :
            exports.UNDEFINED;
        if (special !== exports.UNDEFINED) {
            return special;
        }
        else {
            return this._getByKey(dep.key, dep.lowerBoundVisibility, dep.upperBoundVisibility, dep.optional, providerVisibility);
        }
    };
    Injector.prototype._getByKey = function (key, lowerBoundVisibility, upperBoundVisibility, optional, providerVisibility) {
        if (key === INJECTOR_KEY) {
            return this;
        }
        if (upperBoundVisibility instanceof metadata_1.SelfMetadata) {
            return this._getByKeySelf(key, optional, providerVisibility);
        }
        else if (upperBoundVisibility instanceof metadata_1.HostMetadata) {
            return this._getByKeyHost(key, optional, providerVisibility, lowerBoundVisibility);
        }
        else {
            return this._getByKeyDefault(key, optional, providerVisibility, lowerBoundVisibility);
        }
    };
    /** @internal */
    Injector.prototype._throwOrNull = function (key, optional) {
        if (optional) {
            return null;
        }
        else {
            throw new exceptions_1.NoProviderError(this, key);
        }
    };
    /** @internal */
    Injector.prototype._getByKeySelf = function (key, optional, providerVisibility) {
        var obj = this._strategy.getObjByKeyId(key.id, providerVisibility);
        return (obj !== exports.UNDEFINED) ? obj : this._throwOrNull(key, optional);
    };
    /** @internal */
    Injector.prototype._getByKeyHost = function (key, optional, providerVisibility, lowerBoundVisibility) {
        var inj = this;
        if (lowerBoundVisibility instanceof metadata_1.SkipSelfMetadata) {
            if (inj._isHostBoundary) {
                return this._getPrivateDependency(key, optional, inj);
            }
            else {
                inj = inj._parent;
            }
        }
        while (inj != null) {
            var obj = inj._strategy.getObjByKeyId(key.id, providerVisibility);
            if (obj !== exports.UNDEFINED)
                return obj;
            if (lang_1.isPresent(inj._parent) && inj._isHostBoundary) {
                return this._getPrivateDependency(key, optional, inj);
            }
            else {
                inj = inj._parent;
            }
        }
        return this._throwOrNull(key, optional);
    };
    /** @internal */
    Injector.prototype._getPrivateDependency = function (key, optional, inj) {
        var obj = inj._parent._strategy.getObjByKeyId(key.id, Visibility.Private);
        return (obj !== exports.UNDEFINED) ? obj : this._throwOrNull(key, optional);
    };
    /** @internal */
    Injector.prototype._getByKeyDefault = function (key, optional, providerVisibility, lowerBoundVisibility) {
        var inj = this;
        if (lowerBoundVisibility instanceof metadata_1.SkipSelfMetadata) {
            providerVisibility = inj._isHostBoundary ? Visibility.PublicAndPrivate : Visibility.Public;
            inj = inj._parent;
        }
        while (inj != null) {
            var obj = inj._strategy.getObjByKeyId(key.id, providerVisibility);
            if (obj !== exports.UNDEFINED)
                return obj;
            providerVisibility = inj._isHostBoundary ? Visibility.PublicAndPrivate : Visibility.Public;
            inj = inj._parent;
        }
        return this._throwOrNull(key, optional);
    };
    Object.defineProperty(Injector.prototype, "displayName", {
        get: function () {
            return "Injector(providers: [" + _mapProviders(this, function (b) { return (" \"" + b.key.displayName + "\" "); }).join(", ") + "])";
        },
        enumerable: true,
        configurable: true
    });
    Injector.prototype.toString = function () { return this.displayName; };
    return Injector;
}());
exports.Injector = Injector;
var INJECTOR_KEY = key_1.Key.get(Injector);
function _mapProviders(injector, fn) {
    var res = [];
    for (var i = 0; i < injector._proto.numberOfProviders; ++i) {
        res.push(fn(injector._proto.getProviderAtIndex(i)));
    }
    return res;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5qZWN0b3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJkaWZmaW5nX3BsdWdpbl93cmFwcGVyLW91dHB1dF9wYXRoLWpha1huTW1MLnRtcC9hbmd1bGFyMi9zcmMvY29yZS9kaS9pbmplY3Rvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsMkJBQTJDLGdDQUFnQyxDQUFDLENBQUE7QUFDNUUseUJBUU8sWUFBWSxDQUFDLENBQUE7QUFDcEIsMkJBT08sY0FBYyxDQUFDLENBQUE7QUFDdEIscUJBQW9FLDBCQUEwQixDQUFDLENBQUE7QUFDL0YsMkJBQTRCLGdDQUFnQyxDQUFDLENBQUE7QUFDN0Qsb0JBQWtCLE9BQU8sQ0FBQyxDQUFBO0FBQzFCLHlCQUEyRCxZQUFZLENBQUMsQ0FBQTtBQUV4RSxvQ0FBb0M7QUFDcEMsSUFBTSx5QkFBeUIsR0FBRyxFQUFFLENBQUM7QUFFeEIsaUJBQVMsR0FBVyxpQkFBVSxDQUFDLElBQUksTUFBTSxFQUFFLENBQUMsQ0FBQztBQUUxRDs7R0FFRztBQUNILFdBQVksVUFBVTtJQUNwQjs7T0FFRztJQUNILCtDQUFNLENBQUE7SUFDTjs7T0FFRztJQUNILGlEQUFPLENBQUE7SUFDUDs7T0FFRztJQUNILG1FQUFnQixDQUFBO0FBQ2xCLENBQUMsRUFiVyxrQkFBVSxLQUFWLGtCQUFVLFFBYXJCO0FBYkQsSUFBWSxVQUFVLEdBQVYsa0JBYVgsQ0FBQTtBQUVELGdCQUFnQixHQUFlLEVBQUUsR0FBZTtJQUM5QyxNQUFNLENBQUMsQ0FBQyxHQUFHLEtBQUssR0FBRyxDQUFDO1FBQ2IsQ0FBQyxHQUFHLEtBQUssVUFBVSxDQUFDLGdCQUFnQixJQUFJLEdBQUcsS0FBSyxVQUFVLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztBQUN0RixDQUFDO0FBUUQ7SUFrQ0UscUNBQVksT0FBc0IsRUFBRSxHQUE2QjtRQWpDakUsY0FBUyxHQUFxQixJQUFJLENBQUM7UUFDbkMsY0FBUyxHQUFxQixJQUFJLENBQUM7UUFDbkMs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Z0JBQWdCLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxVQUFVLENBQUMsR0FBRyxJQUFJLENBQUM7WUFDOUUsRUFBRSxHQUFHLE1BQU0sR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsVUFBVSxDQUFDLEdBQUcsSUFBSSxDQUFDO1lBQzlFLEVBQUUsR0FBRyxNQUFNLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLFVBQVUsQ0FBQyxHQUFHLElBQUksQ0FBQztZQUM5RSxFQUFFLEdBQUcsTUFBTSxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxVQUFVLENBQUMsR0FBRyxJQUFJLENBQUM7WUFDOUUsRUFBRSxHQUFHLE1BQU0sR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsVUFBVSxDQUFDLEdBQUcsSUFBSSxDQUFDO1lBQzlFLEVBQUUsR0FBRyxNQUFNLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLFVBQVUsQ0FBQyxHQUFHLElBQUksQ0FBQztZQUM5RSxFQUFFLEdBQUcsTUFBTSxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxVQUFVLENBQUMsR0FBRyxJQUFJLENBQUM7WUFDOUUsR0FBRyxHQUFHLE1BQU0sR0FBRyxFQUFFLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsVUFBVSxDQUFDLEdBQUcsSUFBSSxDQUFDO1lBQ2pGLEdBQUcsR0FBRyxNQUFNLEdBQUcsRUFBRSxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLFVBQVUsQ0FBQyxHQUFHLElBQUksQ0FBQztZQUNqRixHQUFHLEdBQUcsTUFBTSxHQUFHLEVBQUUsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsRUFBRSxVQUFVLENBQUMsR0FBRyxJQUFJLENBQUM7WUFDakYsR0FBRyxHQUFHLE1BQU0sR0FBRyxFQUFFLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsVUFBVSxDQUFDLEdBQUcsSUFBSSxDQUFDO1lBQ2pGLEdBQUcsR0FBRyxNQUFNLEdBQUcsRUFBRSxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLFVBQVUsQ0FBQyxHQUFHLElBQUksQ0FBQztZQUNqRixHQUFHLEdBQUcsTUFBTSxHQUFHLEVBQUUsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsRUFBRSxVQUFVLENBQUMsR0FBRyxJQUFJLENBQUM7WUFDakYsR0FBRyxHQUFHLE1BQU0sR0FBRyxFQUFFLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsVUFBVSxDQUFDLEdBQUcsSUFBSSxDQUFDO1lBQ2pGLEdBQUcsR0FBRyxNQUFNLEdBQUcsRUFBRSxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLFVBQVUsQ0FBQyxHQUFHLElBQUksQ0FBQztZQUNqRixHQUFHLEdBQUcsTUFBTSxHQUFHLEVBQUUsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsRUFBRSxVQUFVLENBQUMsR0FBRyxJQUFJLENBQUM7WUFDakYsR0FBRyxHQUFHLE1BQU0sR0FBRyxFQUFFLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsVUFBVSxDQUFDLEdBQUcsSUFBSSxDQUFDO1FBQ25GLENBQUU7UUFBQSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ1gsRUFBRSxDQUFDLENBQUMsQ0FBQyxZQUFZLGtDQUFxQixJQUFJLENBQUMsWUFBWSwrQkFBa0IsQ0FBQyxDQUFDLENBQUM7Z0JBQzFFLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUMvQixDQUFDO1lBQ0QsTUFBTSxDQUFDLENBQUM7UUFDVixDQUFDO1FBRUQsSUFBSSxHQUFHLENBQUM7UUFDUixJQUFJLENBQUM7WUFDSCxNQUFNLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUNmLEtBQUssQ0FBQztvQkFDSixHQUFHLEdBQUcsT0FBTyxFQUFFLENBQUM7b0JBQ2hCLEtBQUssQ0FBQztnQkFDUixLQUFLLENBQUM7b0JBQ0osR0FBRyxHQUFHLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQztvQkFDbEIsS0FBSyxDQUFDO2dCQUNSLEtBQUssQ0FBQztvQkFDSixHQUFHLEdBQUcsT0FBTyxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztvQkFDdEIsS0FBSyxDQUFDO2dCQUNSLEtBQUssQ0FBQztvQkFDSixHQUFHLEdBQUcsT0FBTyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7b0JBQzFCLEtBQUssQ0FBQztnQkFDUixLQUFLLENBQUM7b0JBQ0osR0FBRyxHQUFHLE9BQU8sQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztvQkFDOUIsS0FBSyxDQUFDO2dCQUNSLEtBQUssQ0FBQztvQkFDSixHQUFHLEdBQUcsT0FBTyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztvQkFDbEMsS0FBSyxDQUFDO2dCQUNSLEtBQUssQ0FBQztvQkFDSixHQUFHLEdBQUcsT0FBTyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7b0JBQ3RDLEtBQUssQ0FBQztnQkFDUixLQUFLLENBQUM7b0JBQ0osR0FBRyxHQUFHLE9BQU8sQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztvQkFDMUMsS0FBSyxDQUFDO2dCQUNSLEtBQUssQ0FBQztvQkFDSixHQUFHLEdBQUcsT0FBTyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztvQkFDOUMsS0FBSyxDQUFDO2dCQUNSLEtBQUssQ0FBQztvQkFDSixHQUFHLEdBQUcsT0FBTyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7b0JBQ2xELEtBQUssQ0FBQztnQkFDUixLQUFLLEVBQUU7b0JBQ0wsR0FBRyxHQUFHLE9BQU8sQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztvQkFDdEQsS0FBSyxDQUFDO2dCQUNSLEtBQUssRUFBRTtvQkFDTCxHQUFHLEdBQUcsT0FBTyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxHQUFHLENBQUMsQ0FBQztvQkFDM0QsS0FBSyxDQUFDO2dCQUNSLEtBQUssRUFBRTtvQkFDTCxHQUFHLEdBQUcsT0FBTyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7b0JBQ2hFLEtBQUssQ0FBQztnQkFDUixLQUFLLEVBQUU7b0JBQ0wsR0FBRyxHQUFHLE9BQU8sQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztvQkFDckUsS0FBSyxDQUFDO2dCQUNSLEtBQUssRUFBRTtvQkFDTCxHQUFHLEdBQUcsT0FBTyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztvQkFDMUUsS0FBSyxDQUFDO2dCQUNSLEtBQUssRUFBRTtvQkFDTCxHQUFHLEdBQUcsT0FBTyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7b0JBQy9FLEtBQUssQ0FBQztnQkFDUixLQUFLLEVB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RCxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUN0RCxDQUFDO0lBQ0QsTUFBTSxDQUFDLEdBQUcsQ0FBQztBQUNiLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge01hcCwgTWFwV3JhcHBlciwgTGlzdFdyYXBwZXJ9IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvY29sbGVjdGlvbic7XG5pbXBvcnQge1xuICBSZXNvbHZlZFByb3ZpZGVyLFxuICBQcm92aWRlcixcbiAgRGVwZW5kZW5jeSxcbiAgUHJvdmlkZXJCdWlsZGVyLFxuICBSZXNvbHZlZEZhY3RvcnksXG4gIHByb3ZpZGUsXG4gIHJlc29sdmVQcm92aWRlcnNcbn0gZnJvbSAnLi9wcm92aWRlcic7XG5pbXBvcnQge1xuICBBYnN0cmFjdFByb3ZpZGVyRXJyb3IsXG4gIE5vUHJvdmlkZXJFcnJvcixcbiAgQ3ljbGljRGVwZW5kZW5jeUVycm9yLFxuICBJbnN0YW50aWF0aW9uRXJyb3IsXG4gIEludmFsaWRQcm92aWRlckVycm9yLFxuICBPdXRPZkJvdW5kc0Vycm9yXG59IGZyb20gJy4vZXhjZXB0aW9ucyc7XG5pbXBvcnQge0Z1bmN0aW9uV3JhcHBlciwgVHlwZSwgaXNQcmVzZW50LCBpc0JsYW5rLCBDT05TVF9FWFBSfSBmcm9tICdhbmd1bGFyMi9zcmMvZmFjYWRlL2xhbmcnO1xuaW1wb3J0IHtCYXNlRXhjZXB0aW9ufSBmcm9tICdhbmd1bGFyMi9zcmMvZmFjYWRlL2V4Y2VwdGlvbnMnO1xuaW1wb3J0IHtLZXl9IGZyb20gJy4va2V5JztcbmltcG9ydCB7U2VsZk1ldGFkYXRhLCBIb3N0TWV0YWRhdGEsIFNraXBTZWxmTWV0YWRhdGF9IGZyb20gJy4vbWV0YWRhdGEnO1xuXG4vLyBUaHJlc2hvbGQgZm9yIHRoZSBkeW5hbWljIHZlcnNpb25cbmNvbnN0IF9NQVhfQ09OU1RSVUNUSU9OX0NPVU5URVIgPSAxMDtcblxuZXhwb3J0IGNvbnN0IFVOREVGSU5FRDogT2JqZWN0ID0gQ09OU1RfRVhQUihuZXcgT2JqZWN0KCkpO1xuXG4vKipcbiAqIFZpc2liaWxpdHkgb2YgYSB7QGxpbmsgUHJvdmlkZXJ9LlxuICovXG5leHBvcnQgZW51bSBWaXNpYmlsaXR5IHtcbiAgLyoqXG4gICAqIEEgYFB1YmxpY2Age0BsaW5rIFByb3ZpZGVyfSBpcyBvbmx5IHZpc2libGUgdG8gcmVndWxhciAoYXMgb3Bwb3NlZCB0byBob3N0KSBjaGlsZCBpbmplY3RvcnMuXG4gICAqL1xuICBQdWJsaWMsXG4gIC8qKlxuICAgKiBBIGBQcml2YXRlYCB7QGxpbmsgUHJvdmlkZXJ9IGlzIG9ubHkgdmlzaWJsZSB0byBob3N0IChhcyBvcHBvc2VkIHRvIHJlZ3VsYXIpIGNoaWxkIGluamVjdG9ycy5cbiAgICovXG4gIFByaXZhdGUsXG4gIC8qKlxuICAgKiBBIGBQdWJsaWNBbmRQcml2YXRlYCB7QGxpbmsgUHJvdmlkZXJ9IGlzIHZpc2libGUgdG8gYm90aCBob3N0IGFuZCByZWd1bGFyIGNoaWxkIGluamVjdG9ycy5cbiAgICovXG4gIFB1YmxpY0FuZFByaXZhdGVcbn1cblxuZnVuY3Rpb24gY2FuU2VlKHNyYzogVmlzaWJpbGl0eSwgZHN0OiBWaXNpYmlsaXR5KTogYm9vbGVhbiB7XG4gIHJldHVybiAoc3JjID09PSBkc3QpIHx8XG4gICAgICAgICAoZHN0ID09PSBWaXNpYmlsaXR5LlB1YmxpY0FuZFByaXZhdGUgfHwgc3JjID09PSBWaXNpYmlsaXR5LlB1YmxpY0FuZFByaXZhdGUpO1xufVxuXG5cbmV4cG9ydCBpbnRlcmZhY2UgUHJvdG9JbmplY3RvclN0cmF0ZWd5IHtcbiAgZ2V0UHJvdmlkZXJBdEluZGV4KGluZGV4OiBudW1iZXIpOiBSZXNvbHZlZFByb3ZpZGVyO1xuICBjcmVhdGVJbmplY3RvclN0cmF0ZWd5KGluajogSW5qZWN0b3IpOiBJbmplY3RvclN0cmF0ZWd5O1xufVxuXG5leHBvcnQgY2xhc3MgUHJvdG9JbmplY3RvcklubGluZVN0cmF0ZWd5IGltcGxlbWVudHMgUHJvdG9JbmplY3RvclN0cmF0ZWd5IHtcbiAgcHJvdmlkZXIwOiBSZXNvbHZlZFByb3ZpZGVyID0gbnVsbDtcbiAgcHJvdmlkZXIxOiBSZXNvbHZlZFByb3ZpZGVyID0gbnVsbDtcbiAgcHJvdmlkZXIyOiBSZXNvbHZlZFByb3ZpZGVyID0gbnVsbDtcbiAgcHJvdmlkZXIzOiBSZXNvbHZlZFByb3ZpZGVyID0gbnVsbDtcbiAgcHJvdmlkZXI0OiBSZXNvbHZlZFByb3ZpZGVyID0gbnVsbDtcbiAgcHJvdmlkZXI1OiBSZXNvbHZlZFByb3ZpZGVyID0gbnVsbDtcbiAgcHJvdmlkZXI2OiBSZXNvbHZlZFByb3ZpZGVyID0gbnVsbDtcbiAgcHJvdmlkZXI3OiBSZXNvbHZlZFByb3ZpZGVyID0gbnVsbDtcbiAgcHJvdmlkZXI4OiBSZXNvbHZlZFByb3ZpZGVyID0gbnVsbDtcbiAgcHJvdmlkZXI5OiBSZXNvbHZlZFByb3ZpZGVyID0gbnVsbDtcblxuICBrZXlJZDA6IG51bWJlciA9IG51bGw7XG4gIGtleUlkMTogbnVtYmVyID0gbnVsbDtcbiAga2V5SWQyOiBudW1iZXIgPSBudWxsO1xuICBrZXlJZDM6IG51bWJlciA9IG51bGw7XG4gIGtleUlkNDogbnVtYmVyID0gbnVsbDtcbiAga2V5SWQ1OiBudW1iZXIgPSBudWxsO1xuICBrZXlJZDY6IG51bWJlciA9IG51bGw7XG4gIGtleUlkNzogbnVtYmVyID0gbnVsbDtcbiAga2V5SWQ4OiBudW1iZXIgPSBudWxsO1xuICBrZXlJZDk6IG51bWJlciA9IG51bGw7XG5cbiAgdmlzaWJpbGl0eTA6IFZpc2liaWxpdHkgPSBudWxsO1xuICB2aXNpYmlsaXR5MTogVmlzaWJpbGl0eSA9IG51bGw7XG4gIHZpc2liaWxpdHkyOiBWaXNpYmlsaXR5ID0gbnVsbDtcbiAgdmlzaWJpbGl0eTM6IFZpc2liaWxpdHkgPSBudWxsO1xuICB2aXNpYmlsaXR5NDogVmlzaWJpbGl0eSA9IG51bGw7XG4gIHZpc2liaWxpdHk1OiBWaXNpYmlsaXR5ID0gbnVsbDtcbiAgdmlzaWJpbGl0eTY6IFZpc2liaWxpdHkgPSBudWxsO1xuICB2aXNpYmlsaXR5NzogVmlzaWJpbGl0eSA9IG51bGw7XG4gIHZpc2liaWxpdHk4OiBWaXNpYmlsaXR5ID0gbnVsbDtcbiAgdmlzaWJpbGl0eTk6IFZpc2liaWxpdHkgPSBudWxsO1xuXG4gIGNvbnN0cnVjdG9yKHByb3RvRUk6IFByb3RvSW5qZWN0b3IsIGJ3djogUHJvdmlkZXJXaXRoVmlzaWJpbGl0eVtdKSB7XG4gICAgdmFyIGxlbmd0aCA9IGJ3di5sZW5ndGg7XG5cbiAgICBpZiAobGVuZ3RoID4gMCkge1xuICAgICAgdGhpcy5wcm92aWRlcjAgPSBid3ZbMF0ucHJvdmlkZXI7XG4gICAgICB0aGlzLmtleUlkMCA9IGJ3dlswXS5nZXRLZXlJZCgpO1xuICAgICAgdGhpcy52aXNpYmlsaXR5MCA9IGJ3dlswXS52aXNpYmlsaXR5O1xuICAgIH1cbiAgICBpZiAobGVuZ3RoID4gMSkge1xuICAgICAgdGhpcy5wcm92aWRlcjEgPSBid3ZbMV0ucHJvdmlkZXI7XG4gICAgICB0aGlzLmtleUlkMSA9IGJ3dlsxXS5nZXRLZXlJZCgpO1xuICAgICAgdGhpcy52aXNpYmlsaXR5MSA9IGJ3dlsxXS52aXNpYmlsaXR5O1xuICAgIH1cbiAgICBpZiAobGVuZ3RoID4gMikge1xuICAgICAgdGhpcy5wcm92aWRlcjIgPSBid3ZbMl0ucHJvdmlkZXI7XG4gICAgICB0aGlzLmtleUlkMiA9IGJ3dlsyXS5nZXRLZXlJZCgpO1xuICAgICAgdGhpcy52aXNpYmlsaXR5MiA9IGJ3dlsyXS52aXNpYmlsaXR5O1xuICAgIH1cbiAgICBpZiAobGVuZ3RoID4gMykge1xuICAgICAgdGhpcy5wcm92aWRlcjMgPSBid3ZbM10ucHJvdmlkZXI7XG4gICAgICB0aGlzLmtleUlkMyA9IGJ3dlszXS5nZXRLZXlJZCgpO1xuICAgICAgdGhpcy52aXNpYmlsaXR5MyA9IGJ3dlszXS52aXNpYmlsaXR5O1xuICAgIH1cbiAgICBpZiAobGVuZ3RoID4gNCkge1xuICAgICAgdGhpcy5wcm92aWRlcjQgPSBid3ZbNF0ucHJvdmlkZXI7XG4gICAgICB0aGlzLmtleUlkNCA9IGJ3dls0XS5nZXRLZXlJZCgpO1xuICAgICAgdGhpcy52aXNpYmlsaXR5NCA9IGJ3dls0XS52aXNpYmlsaXR5O1xuICAgIH1cbiAgICBpZiAobGVuZ3RoID4gNSkge1xuICAgICAgdGhpcy5wcm92aWRlcjUgPSBid3ZbNV0ucHJvdmlkZXI7XG4gICAgICB0aGlzLmtleUlkNSA9IGJ3dls1XS5nZXRLZXlJZCgpO1xuICAgICAgdGhpcy52aXNpYmlsaXR5NSA9IGJ3dls1XS52aXNpYmlsaXR5O1xuICAgIH1cbiAgICBpZiAobGVuZ3RoID4gNikge1xuICAgICAgdGhpcy5wcm92aWRlcjYgPSBid3ZbNl0ucHJvdmlkZXI7XG4gICAgICB0aGlzLmtleUlkNiA9IGJ3dls2XS5nZXRLZXlJZCgpO1xuICAgICAgdGhpcy52aXNpYmlsaXR5NiA9IGJ3dls2XS52aXNpYmlsaXR5O1xuICAgIH1cbiAgICBpZiAobGVuZ3RoID4gNykge1xuICAgICAgdGhpcy5wcm92aWRlcjcgPSBid3ZbN10ucHJvdmlkZXI7XG4gICAgICB0aGlzLmtleUlkNyA9IGJ3dls3XS5nZXRLZXlJZCgpO1xuICAgICAgdGhpcy52aXNpYmlsaXR5NyA9IGJ3dls3XS52aXNpYmlsaXR5O1xuICAgIH1cbiAgICBpZiAobGVuZ3RoID4gOCkge1xuICAgICAgdGhpcy5wcm92aWRlcjggPSBid3ZbOF0ucHJvdmlkZXI7XG4gICAgICB0aGlzLmtleUlkOCA9IGJ3dls4XS5nZXRLZXlJZCgpO1xuICAgICAgdGhpcy52aXNpYmlsaXR5OCA9IGJ3dls4XS52aXNpYmlsaXR5O1xuICAgIH1cbiAgICBpZiAobGVuZ3RoID4gOSkge1xuICAgICAgdGhpcy5wcm92aWRlcjkgPSBid3ZbOV0ucHJvdmlkZXI7XG4gICAgICB0aGlzLmtleUlkOSA9IGJ3dls5XS5nZXRLZXlJZCgpO1xuICAgICAgdGhpcy52aXNpYmlsaXR5OSA9IGJ3dls5XS52aXNpYmlsaXR5O1xuICAgIH1cbiAgfVxuXG4gIGdldFByb3ZpZGVyQXRJbmRleChpbmRleDogbnVtYmVyKTogUmVzb2x2ZWRQcm92aWRlciB7XG4gICAgaWYgKGluZGV4ID09IDApIHJldHVybiB0aGlzLnByb3ZpZGVyMDtcbiAgICBpZiAoaW5kZXggPT0gMSkgcmV0dXJuIHRoaXMucHJvdmlkZXIxO1xuICAgIGlmIChpbmRleCA9PSAyKSByZXR1cm4gdGhpcy5wcm92aWRlcjI7XG4gICAgaWYgKGluZGV4ID09IDMpIHJldHVybiB0aGlzLnByb3ZpZGVyMztcbiAgICBpZiAoaW5kZXggPT0gNCkgcmV0dXJuIHRoaXMucHJvdmlkZXI0O1xuICAgIGlmIChpbmRleCA9PSA1KSByZXR1cm4gdGhpcy5wcm92aWRlcjU7XG4gICAgaWYgKGluZGV4ID09IDYpIHJldHVybiB0aGlzLnByb3ZpZGVyNjtcbiAgICBpZiAoaW5kZXggPT0gNykgcmV0dXJuIHRoaXMucHJvdmlkZXI3O1xuICAgIGlmIChpbmRleCA9PSA4KSByZXR1cm4gdGhpcy5wcm92aWRlcjg7XG4gICAgaWYgKGluZGV4ID09IDkpIHJldHVybiB0aGlzLnByb3ZpZGVyOTtcbiAgICB0aHJvdyBuZXcgT3V0T2ZCb3VuZHNFcnJvcihpbmRleCk7XG4gIH1cblxuICBjcmVhdGVJbmplY3RvclN0cmF0ZWd5KGluamVjdG9yOiBJbmplY3Rvcik6IEluamVjdG9yU3RyYXRlZ3kge1xuICAgIHJldHVybiBuZXcgSW5qZWN0b3JJbmxpbmVTdHJhdGVneShpbmplY3RvciwgdGhpcyk7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIFByb3RvSW5qZWN0b3JEeW5hbWljU3RyYXRlZ3kgaW1wbGVtZW50cyBQcm90b0luamVjdG9yU3RyYXRlZ3kge1xuICBwcm92aWRlcnM6IFJlc29sdmVkUHJvdmlkZXJbXTtcbiAga2V5SWRzOiBudW1iZXJbXTtcbiAgdmlzaWJpbGl0aWVzOiBWaXNpYmlsaXR5W107XG5cbiAgY29uc3RydWN0b3IocHJvdG9Jbmo6IFByb3RvSW5qZWN0b3IsIGJ3djogUHJvdmlkZXJXaXRoVmlzaWJpbGl0eVtdKSB7XG4gICAgdmFyIGxlbiA9IGJ3di5sZW5ndGg7XG5cbiAgICB0aGlzLnByb3ZpZGVycyA9IExpc3RXcmFwcGVyLmNyZWF0ZUZpeGVkU2l6ZShsZW4pO1xuICAgIHRoaXMua2V5SWRzID0gTGlzdFdyYXBwZXIuY3JlYXRlRml4ZWRTaXplKGxlbik7XG4gICAgdGhpcy52aXNpYmlsaXRpZXMgPSBMaXN0V3JhcHBlci5jcmVhdGVGaXhlZFNpemUobGVuKTtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIHRoaXMucHJvdmlkZXJzW2ldID0gYnd2W2ldLnByb3ZpZGVyO1xuICAgICAgdGhpcy5rZXlJZHNbaV0gPSBid3ZbaV0uZ2V0S2V5SWQoKTtcbiAgICAgIHRoaXMudmlzaWJpbGl0aWVzW2ldID0gYnd2W2ldLnZpc2liaWxpdHk7XG4gICAgfVxuICB9XG5cbiAgZ2V0UHJvdmlkZXJBdEluZGV4KGluZGV4OiBudW1iZXIpOiBSZXNvbHZlZFByb3ZpZGVyIHtcbiAgICBpZiAoaW5kZXggPCAwIHx8IGluZGV4ID49IHRoaXMucHJvdmlkZXJzLmxlbmd0aCkge1xuICAgICAgdGhyb3cgbmV3IE91dE9mQm91bmRzRXJyb3IoaW5kZXgpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5wcm92aWRlcnNbaW5kZXhdO1xuICB9XG5cbiAgY3JlYXRlSW5qZWN0b3JTdHJhdGVneShlaTogSW5qZWN0b3IpOiBJbmplY3RvclN0cmF0ZWd5IHtcbiAgICByZXR1cm4gbmV3IEluamVjdG9yRHluYW1pY1N0cmF0ZWd5KHRoaXMsIGVpKTtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgUHJvdG9JbmplY3RvciB7XG4gIHN0YXRpYyBmcm9tUmVzb2x2ZWRQcm92aWRlcnMocHJvdmlkZXJzOiBSZXNvbHZlZFByb3ZpZGVyW10pOiBQcm90b0luamVjdG9yIHtcbiAgICB2YXIgYmQgPSBwcm92aWRlcnMubWFwKGIgPT4gbmV3IFByb3ZpZGVyV2l0aFZpc2liaWxpdHkoYiwgVmlzaWJpbGl0eS5QdWJsaWMpKTtcbiAgICByZXR1cm4gbmV3IFByb3RvSW5qZWN0b3IoYmQpO1xuICB9XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfc3RyYXRlZ3k6IFByb3RvSW5qZWN0b3JTdHJhdGVneTtcbiAgbnVtYmVyT2ZQcm92aWRlcnM6IG51bWJlcjtcblxuICBjb25zdHJ1Y3Rvcihid3Y6IFByb3ZpZGVyV2l0aFZpc2liaWxpdHlbXSkge1xuICAgIHRoaXMubnVtYmVyT2ZQcm92aWRlcnMgPSBid3YubGVuZ3RoO1xuICAgIHRoaXMuX3N0cmF0ZWd5ID0gYnd2Lmxlbmd0aCA+IF9NQVhfQ09OU1RSVUNUSU9OX0NPVU5URVIgP1xuICAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBQcm90b0luamVjdG9yRHluYW1pY1N0cmF0ZWd5KHRoaXMsIGJ3dikgOlxuICAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBQcm90b0luamVjdG9ySW5saW5lU3RyYXRlZ3kodGhpcywgYnd2KTtcbiAgfVxuXG4gIGdldFByb3ZpZGVyQXRJbmRleChpbmRleDogbnVtYmVyKTogUmVzb2x2ZWRQcm92aWRlciB7XG4gICAgcmV0dXJuIHRoaXMuX3N0cmF0ZWd5LmdldFByb3ZpZGVyQXRJbmRleChpbmRleCk7XG4gIH1cbn1cblxuXG5cbmV4cG9ydCBpbnRlcmZhY2UgSW5qZWN0b3JTdHJhdGVneSB7XG4gIGdldE9iakJ5S2V5SWQoa2V5SWQ6IG51bWJlciwgdmlzaWJpbGl0eTogVmlzaWJpbGl0eSk6IGFueTtcbiAgZ2V0T2JqQXRJbmRleChpbmRleDogbnVtYmVyKTogYW55O1xuICBnZXRNYXhOdW1iZXJPZk9iamVjdHMoKTogbnVtYmVyO1xuXG4gIHJlc2V0Q29uc3RydWN0aW9uQ291bnRlcigpOiB2b2lkO1xuICBpbnN0YW50aWF0ZVByb3ZpZGVyKHByb3ZpZGVyOiBSZXNvbHZlZFByb3ZpZGVyLCB2aXNpYmlsaXR5OiBWaXNpYmlsaXR5KTogYW55O1xufVxuXG5leHBvcnQgY2xhc3MgSW5qZWN0b3JJbmxpbmVTdHJhdGVneSBpbXBsZW1lbnRzIEluamVjdG9yU3RyYXRlZ3kge1xuICBvYmowOiBhbnkgPSBVTkRFRklORUQ7XG4gIG9iajE6IGFueSA9IFVOREVGSU5FRDtcbiAgb2JqMjogYW55ID0gVU5ERUZJTkVEO1xuICBvYmozOiBhbnkgPSBVTkRFRklORUQ7XG4gIG9iajQ6IGFueSA9IFVOREVGSU5FRDtcbiAgb2JqNTogYW55ID0gVU5ERUZJTkVEO1xuICBvYmo2OiBhbnkgPSBVTkRFRklORUQ7XG4gIG9iajc6IGFueSA9IFVOREVGSU5FRDtcbiAgb2JqODogYW55ID0gVU5ERUZJTkVEO1xuICBvYmo5OiBhbnkgPSBVTkRFRklORUQ7XG5cbiAgY29uc3RydWN0b3IocHVibGljIGluamVjdG9yOiBJbmplY3RvciwgcHVibGljIHByb3RvU3RyYXRlZ3k6IFByb3RvSW5qZWN0b3JJbmxpbmVTdHJhdGVneSkge31cblxuICByZXNldENvbnN0cnVjdGlvbkNvdW50ZXIoKTogdm9pZCB7IHRoaXMuaW5qZWN0b3IuX2NvbnN0cnVjdGlvbkNvdW50ZXIgPSAwOyB9XG5cbiAgaW5zdGFudGlhdGVQcm92aWRlcihwcm92aWRlcjogUmVzb2x2ZWRQcm92aWRlciwgdmlzaWJpbGl0eTogVmlzaWJpbGl0eSk6IGFueSB7XG4gICAgcmV0dXJuIHRoaXMuaW5qZWN0b3IuX25ldyhwcm92aWRlciwgdmlzaWJpbGl0eSk7XG4gIH1cblxuICBnZXRPYmpCeUtleUlkKGtleUlkOiBudW1iZXIsIHZpc2liaWxpdHk6IFZpc2liaWxpdHkpOiBhbnkge1xuICAgIHZhciBwID0gdGhpcy5wcm90b1N0cmF0ZWd5O1xuICAgIHZhciBpbmogPSB0aGlzLmluamVjdG9yO1xuXG4gICAgaWYgKHAua2V5SWQwID09PSBrZXlJZCAmJiBjYW5TZWUocC52aXNpYmlsaXR5MCwgdmlzaWJpbGl0eSkpIHtcbiAgICAgIGlmICh0aGlzLm9iajAgPT09IFVOREVGSU5FRCkge1xuICAgICAgICB0aGlzLm9iajAgPSBpbmouX25ldyhwLnByb3ZpZGVyMCwgcC52aXNpYmlsaXR5MCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcy5vYmowO1xuICAgIH1cbiAgICBpZiAocC5rZXlJZDEgPT09IGtleUlkICYmIGNhblNlZShwLnZpc2liaWxpdHkxLCB2aXNpYmlsaXR5KSkge1xuICAgICAgaWYgKHRoaXMub2JqMSA9PT0gVU5ERUZJTkVEKSB7XG4gICAgICAgIHRoaXMub2JqMSA9IGluai5fbmV3KHAucHJvdmlkZXIxLCBwLnZpc2liaWxpdHkxKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLm9iajE7XG4gICAgfVxuICAgIGlmIChwLmtleUlkMiA9PT0ga2V5SWQgJiYgY2FuU2VlKHAudmlzaWJpbGl0eTIsIHZpc2liaWxpdHkpKSB7XG4gICAgICBpZiAodGhpcy5vYmoyID09PSBVTkRFRklORUQpIHtcbiAgICAgICAgdGhpcy5vYmoyID0gaW5qLl9uZXcocC5wcm92aWRlcjIsIHAudmlzaWJpbGl0eTIpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMub2JqMjtcbiAgICB9XG4gICAgaWYgKHAua2V5SWQzID09PSBrZXlJZCAmJiBjYW5TZWUocC52aXNpYmlsaXR5MywgdmlzaWJpbGl0eSkpIHtcbiAgICAgIGlmICh0aGlzLm9iajMgPT09IFVOREVGSU5FRCkge1xuICAgICAgICB0aGlzLm9iajMgPSBpbmouX25ldyhwLnByb3ZpZGVyMywgcC52aXNpYmlsaXR5Myk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcy5vYmozO1xuICAgIH1cbiAgICBpZiAocC5rZXlJZDQgPT09IGtleUlkICYmIGNhblNlZShwLnZpc2liaWxpdHk0LCB2aXNpYmlsaXR5KSkge1xuICAgICAgaWYgKHRoaXMub2JqNCA9PT0gVU5ERUZJTkVEKSB7XG4gICAgICAgIHRoaXMub2JqNCA9IGluai5fbmV3KHAucHJvdmlkZXI0LCBwLnZpc2liaWxpdHk0KTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLm9iajQ7XG4gICAgfVxuICAgIGlmIChwLmtleUlkNSA9PT0ga2V5SWQgJiYgY2FuU2VlKHAudmlzaWJpbGl0eTUsIHZpc2liaWxpdHkpKSB7XG4gICAgICBpZiAodGhpcy5vYmo1ID09PSBVTkRFRklORUQpIHtcbiAgICAgICAgdGhpcy5vYmo1ID0gaW5qLl9uZXcocC5wcm92aWRlcjUsIHAudmlzaWJpbGl0eTUpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMub2JqNTtcbiAgICB9XG4gICAgaWYgKHAua2V5SWQ2ID09PSBrZXlJZCAmJiBjYW5TZWUocC52aXNpYmlsaXR5NiwgdmlzaWJpbGl0eSkpIHtcbiAgICAgIGlmICh0aGlzLm9iajYgPT09IFVOREVGSU5FRCkge1xuICAgICAgICB0aGlzLm9iajYgPSBpbmouX25ldyhwLnByb3ZpZGVyNiwgcC52aXNpYmlsaXR5Nik7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcy5vYmo2O1xuICAgIH1cbiAgICBpZiAocC5rZXlJZDcgPT09IGtleUlkICYmIGNhblNlZShwLnZpc2liaWxpdHk3LCB2aXNpYmlsaXR5KSkge1xuICAgICAgaWYgKHRoaXMub2JqNyA9PT0gVU5ERUZJTkVEKSB7XG4gICAgICAgIHRoaXMub2JqNyA9IGluai5fbmV3KHAucHJvdmlkZXI3LCBwLnZpc2liaWxpdHk3KTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLm9iajc7XG4gICAgfVxuICAgIGlmIChwLmtleUlkOCA9PT0ga2V5SWQgJiYgY2FuU2VlKHAudmlzaWJpbGl0eTgsIHZpc2liaWxpdHkpKSB7XG4gICAgICBpZiAodGhpcy5vYmo4ID09PSBVTkRFRklORUQpIHtcbiAgICAgICAgdGhpcy5vYmo4ID0gaW5qLl9uZXcocC5wcm92aWRlcjgsIHAudmlzaWJpbGl0eTgpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMub2JqODtcbiAgICB9XG4gICAgaWYgKHAua2V5SWQ5ID09PSBrZXlJZCAmJiBjYW5TZWUocC52aXNpYmlsaXR5OSwgdmlzaWJpbGl0eSkpIHtcbiAgICAgIGlmICh0aGlzLm9iajkgPT09IFVOREVGSU5FRCkge1xuICAgICAgICB0aGlzLm9iajkgPSBpbmouX25ldyhwLnByb3ZpZGVyOSwgcC52aXNpYmlsaXR5OSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcy5vYmo5O1xuICAgIH1cblxuICAgIHJldHVybiBVTkRFRklORUQ7XG4gIH1cblxuICBnZXRPYmpBdEluZGV4KGluZGV4OiBudW1iZXIpOiBhbnkge1xuICAgIGlmIChpbmRleCA9PSAwKSByZXR1cm4gdGhpcy5vYmowO1xuICAgIGlmIChpbmRleCA9PSAxKSByZXR1cm4gdGhpcy5vYmoxO1xuICAgIGlmIChpbmRleCA9PSAyKSByZXR1cm4gdGhpcy5vYmoyO1xuICAgIGlmIChpbmRleCA9PSAzKSByZXR1cm4gdGhpcy5vYmozO1xuICAgIGlmIChpbmRleCA9PSA0KSByZXR1cm4gdGhpcy5vYmo0O1xuICAgIGlmIChpbmRleCA9PSA1KSByZXR1cm4gdGhpcy5vYmo1O1xuICAgIGlmIChpbmRleCA9PSA2KSByZXR1cm4gdGhpcy5vYmo2O1xuICAgIGlmIChpbmRleCA9PSA3KSByZXR1cm4gdGhpcy5vYmo3O1xuICAgIGlmIChpbmRleCA9PSA4KSByZXR1cm4gdGhpcy5vYmo4O1xuICAgIGlmIChpbmRleCA9PSA5KSByZXR1cm4gdGhpcy5vYmo5O1xuICAgIHRocm93IG5ldyBPdXRPZkJvdW5kc0Vycm9yKGluZGV4KTtcbiAgfVxuXG4gIGdldE1heE51bWJlck9mT2JqZWN0cygpOiBudW1iZXIgeyByZXR1cm4gX01BWF9DT05TVFJVQ1RJT05fQ09VTlRFUjsgfVxufVxuXG5cbmV4cG9ydCBjbGFzcyBJbmplY3RvckR5bmFtaWNTdHJhdGVneSBpbXBsZW1lbnRzIEluamVjdG9yU3RyYXRlZ3kge1xuICBvYmpzOiBhbnlbXTtcblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgcHJvdG9TdHJhdGVneTogUHJvdG9JbmplY3RvckR5bmFtaWNTdHJhdGVneSwgcHVibGljIGluamVjdG9yOiBJbmplY3Rvcikge1xuICAgIHRoaXMub2JqcyA9IExpc3RXcmFwcGVyLmNyZWF0ZUZpeGVkU2l6ZShwcm90b1N0cmF0ZWd5LnByb3ZpZGVycy5sZW5ndGgpO1xuICAgIExpc3RXcmFwcGVyLmZpbGwodGhpcy5vYmpzLCBVTkRFRklORUQpO1xuICB9XG5cbiAgcmVzZXRDb25zdHJ1Y3Rpb25Db3VudGVyKCk6IHZvaWQgeyB0aGlzLmluamVjdG9yLl9jb25zdHJ1Y3Rpb25Db3VudGVyID0gMDsgfVxuXG4gIGluc3RhbnRpYXRlUHJvdmlkZXIocHJvdmlkZXI6IFJlc29sdmVkUHJvdmlkZXIsIHZpc2liaWxpdHk6IFZpc2liaWxpdHkpOiBhbnkge1xuICAgIHJldHVybiB0aGlzLmluamVjdG9yLl9uZXcocHJvdmlkZXIsIHZpc2liaWxpdHkpO1xuICB9XG5cbiAgZ2V0T2JqQnlLZXlJZChrZXlJZDogbnVtYmVyLCB2aXNpYmlsaXR5OiBWaXNpYmlsaXR5KTogYW55IHtcbiAgICB2YXIgcCA9IHRoaXMucHJvdG9TdHJhdGVneTtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcC5rZXlJZHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChwLmtleUlkc1tpXSA9PT0ga2V5SWQgJiYgY2FuU2VlKHAudmlzaWJpbGl0aWVzW2ldLCB2aXNpYmlsaXR5KSkge1xuICAgICAgICBpZiAodGhpcy5vYmpzW2ldID09PSBVTkRFRklORUQpIHtcbiAgICAgICAgICB0aGlzLm9ianNbaV0gPSB0aGlzLmluamVjdG9yLl9uZXcocC5wcm92aWRlcnNbaV0sIHAudmlzaWJpbGl0aWVzW2ldKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzLm9ianNbaV07XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIFVOREVGSU5FRDtcbiAgfVxuXG4gIGdldE9iakF0SW5kZXgoaW5kZXg6IG51bWJlcik6IGFueSB7XG4gICAgaWYgKGluZGV4IDwgMCB8fCBpbmRleCA+PSB0aGlzLm9ianMubGVuZ3RoKSB7XG4gICAgICB0aHJvdyBuZXcgT3V0T2ZCb3VuZHNFcnJvcihpbmRleCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMub2Jqc1tpbmRleF07XG4gIH1cblxuICBnZXRNYXhOdW1iZXJPZk9iamVjdHMoKTogbnVtYmVyIHsgcmV0dXJuIHRoaXMub2Jqcy5sZW5ndGg7IH1cbn1cblxuZXhwb3J0IGNsYXNzIFByb3ZpZGVyV2l0aFZpc2liaWxpdHkge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgcHJvdmlkZXI6IFJlc29sdmVkUHJvdmlkZXIsIHB1YmxpYyB2aXNpYmlsaXR5OiBWaXNpYmlsaXR5KXt9O1xuXG4gIGdldEtleUlkKCk6IG51bWJlciB7IHJldHVybiB0aGlzLnByb3ZpZGVyLmtleS5pZDsgfVxufVxuXG4vKipcbiAqIFVzZWQgdG8gcHJvdmlkZSBkZXBlbmRlbmNpZXMgdGhhdCBjYW5ub3QgYmUgZWFzaWx5IGV4cHJlc3NlZCBhcyBwcm92aWRlcnMuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgRGVwZW5kZW5jeVByb3ZpZGVyIHtcbiAgZ2V0RGVwZW5kZW5jeShpbmplY3RvcjogSW5qZWN0b3IsIHByb3ZpZGVyOiBSZXNvbHZlZFByb3ZpZGVyLCBkZXBlbmRlbmN5OiBEZXBlbmRlbmN5KTogYW55O1xufVxuXG4vKipcbiAqIEEgZGVwZW5kZW5jeSBpbmplY3Rpb24gY29udGFpbmVyIHVzZWQgZm9yIGluc3RhbnRpYXRpbmcgb2JqZWN0cyBhbmQgcmVzb2x2aW5nIGRlcGVuZGVuY2llcy5cbiAqXG4gKiBBbiBgSW5qZWN0b3JgIGlzIGEgcmVwbGFjZW1lbnQgZm9yIGEgYG5ld2Agb3BlcmF0b3IsIHdoaWNoIGNhbiBhdXRvbWF0aWNhbGx5IHJlc29sdmUgdGhlXG4gKiBjb25zdHJ1Y3RvciBkZXBlbmRlbmNpZXMuXG4gKlxuICogSW4gdHlwaWNhbCB1c2UsIGFwcGxpY2F0aW9uIGNvZGUgYXNrcyBmb3IgdGhlIGRlcGVuZGVuY2llcyBpbiB0aGUgY29uc3RydWN0b3IgYW5kIHRoZXkgYXJlXG4gKiByZXNvbHZlZCBieSB0aGUgYEluamVjdG9yYC5cbiAqXG4gKiAjIyMgRXhhbXBsZSAoW2xpdmUgZGVtb10oaHR0cDovL3BsbmtyLmNvL2VkaXQvanpqZWMwP3A9cHJldmlldykpXG4gKlxuICogVGhlIGZvbGxvd2luZyBleGFtcGxlIGNyZWF0ZXMgYW4gYEluamVjdG9yYCBjb25maWd1cmVkIHRvIGNyZWF0ZSBgRW5naW5lYCBhbmQgYENhcmAuXG4gKlxuICogYGBgdHlwZXNjcmlwdFxuICogQEluamVjdGFibGUoKVxuICogY2xhc3MgRW5naW5lIHtcbiAqIH1cbiAqXG4gKiBASW5qZWN0YWJsZSgpXG4gKiBjbGFzcyBDYXIge1xuICogICBjb25zdHJ1Y3RvcihwdWJsaWMgZW5naW5lOkVuZ2luZSkge31cbiAqIH1cbiAqXG4gKiB2YXIgaW5qZWN0b3IgPSBJbmplY3Rvci5yZXNvbHZlQW5kQ3JlYXRlKFtDYXIsIEVuZ2luZV0pO1xuICogdmFyIGNhciA9IGluamVjdG9yLmdldChDYXIpO1xuICogZXhwZWN0KGNhciBpbnN0YW5jZW9mIENhcikudG9CZSh0cnVlKTtcbiAqIGV4cGVjdChjYXIuZW5naW5lIGluc3RhbmNlb2YgRW5naW5lKS50b0JlKHRydWUpO1xuICogYGBgXG4gKlxuICogTm90aWNlLCB3ZSBkb24ndCB1c2UgdGhlIGBuZXdgIG9wZXJhdG9yIGJlY2F1c2Ugd2UgZXhwbGljaXRseSB3YW50IHRvIGhhdmUgdGhlIGBJbmplY3RvcmBcbiAqIHJlc29sdmUgYWxsIG9mIHRoZSBvYmplY3QncyBkZXBlbmRlbmNpZXMgYXV0b21hdGljYWxseS5cbiAqL1xuZXhwb3J0IGNsYXNzIEluamVjdG9yIHtcbiAgLyoqXG4gICAqIFR1cm5zIGFuIGFycmF5IG9mIHByb3ZpZGVyIGRlZmluaXRpb25zIGludG8gYW4gYXJyYXkgb2YgcmVzb2x2ZWQgcHJvdmlkZXJzLlxuICAgKlxuICAgKiBBIHJlc29sdXRpb24gaXMgYSBwcm9jZXNzIG9mIGZsYXR0ZW5pbmcgbXVsdGlwbGUgbmVzdGVkIGFycmF5cyBhbmQgY29udmVydGluZyBpbmRpdmlkdWFsXG4gICAqIHByb3ZpZGVycyBpbnRvIGFuIGFycmF5IG9mIHtAbGluayBSZXNvbHZlZFByb3ZpZGVyfXMuXG4gICAqXG4gICAqICMjIyBFeGFtcGxlIChbbGl2ZSBkZW1vXShodHRwOi8vcGxua3IuY28vZWRpdC9BaVhUSGk/cD1wcmV2aWV3KSlcbiAgICpcbiAgICogYGBgdHlwZXNjcmlwdFxuICAgKiBASW5qZWN0YWJsZSgpXG4gICAqIGNsYXNzIEVuZ2luZSB7XG4gICAqIH1cbiAgICpcbiAgICogQEluamVjdGFibGUoKVxuICAgKiBjbGFzcyBDYXIge1xuICAgKiAgIGNvbnN0cnVjdG9yKHB1YmxpYyBlbmdpbmU6RW5naW5lKSB7fVxuICAgKiB9XG4gICAqXG4gICAqIHZhciBwcm92aWRlcnMgPSBJbmplY3Rvci5yZXNvbHZlKFtDYXIsIFtbRW5naW5lXV1dKTtcbiAgICpcbiAgICogZXhwZWN0KHByb3ZpZGVycy5sZW5ndGgpLnRvRXF1YWwoMik7XG4gICAqXG4gICAqIGV4cGVjdChwcm92aWRlcnNbMF0gaW5zdGFuY2VvZiBSZXNvbHZlZFByb3ZpZGVyKS50b0JlKHRydWUpO1xuICAgKiBleHBlY3QocHJvdmlkZXJzWzBdLmtleS5kaXNwbGF5TmFtZSkudG9CZShcIkNhclwiKTtcbiAgICogZXhwZWN0KHByb3ZpZGVyc1swXS5kZXBlbmRlbmNpZXMubGVuZ3RoKS50b0VxdWFsKDEpO1xuICAgKiBleHBlY3QocHJvdmlkZXJzWzBdLmZhY3RvcnkpLnRvQmVEZWZpbmVkKCk7XG4gICAqXG4gICAqIGV4cGVjdChwcm92aWRlcnNbMV0ua2V5LmRpc3BsYXlOYW1lKS50b0JlKFwiRW5naW5lXCIpO1xuICAgKiB9KTtcbiAgICogYGBgXG4gICAqXG4gICAqIFNlZSB7QGxpbmsgSW5qZWN0b3IjZnJvbVJlc29sdmVkUHJvdmlkZXJzfSBmb3IgbW9yZSBpbmZvLlxuICAgKi9cbiAgc3RhdGljIHJlc29sdmUocHJvdmlkZXJzOiBBcnJheTxUeXBlIHwgUHJvdmlkZXIgfCBhbnlbXT4pOiBSZXNvbHZlZFByb3ZpZGVyW10ge1xuICAgIHJldHVybiByZXNvbHZlUHJvdmlkZXJzKHByb3ZpZGVycyk7XG4gIH1cblxuICAvKipcbiAgICogUmVzb2x2ZXMgYW4gYXJyYXkgb2YgcHJvdmlkZXJzIGFuZCBjcmVhdGVzIGFuIGluamVjdG9yIGZyb20gdGhvc2UgcHJvdmlkZXJzLlxuICAgKlxuICAgKiBUaGUgcGFzc2VkLWluIHByb3ZpZGVycyBjYW4gYmUgYW4gYXJyYXkgb2YgYFR5cGVgLCB7QGxpbmsgUHJvdmlkZXJ9LFxuICAgKiBvciBhIHJlY3Vyc2l2ZSBhcnJheSBvZiBtb3JlIHByb3ZpZGVycy5cbiAgICpcbiAgICogIyMjIEV4YW1wbGUgKFtsaXZlIGRlbW9dKGh0dHA6Ly9wbG5rci5jby9lZGl0L2VQT2NjQT9wPXByZXZpZXcpKVxuICAgKlxuICAgKiBgYGB0eXBlc2NyaXB0XG4gICAqIEBJbmplY3RhYmxlKClcbiAgICogY2xhc3MgRW5naW5lIHtcbiAgICogfVxuICAgKlxuICAgKiBASW5qZWN0YWJsZSgpXG4gICAqIGNsYXNzIENhciB7XG4gICAqICAgY29uc3RydWN0b3IocHVibGljIGVuZ2luZTpFbmdpbmUpIHt9XG4gICAqIH1cbiAgICpcbiAgICogdmFyIGluamVjdG9yID0gSW5qZWN0b3IucmVzb2x2ZUFuZENyZWF0ZShbQ2FyLCBFbmdpbmVdKTtcbiAgICogZXhwZWN0KGluamVjdG9yLmdldChDYXIpIGluc3RhbmNlb2YgQ2FyKS50b0JlKHRydWUpO1xuICAgKiBgYGBcbiAgICpcbiAgICogVGhpcyBmdW5jdGlvbiBpcyBzbG93ZXIgdGhhbiB0aGUgY29ycmVzcG9uZGluZyBgZnJvbVJlc29sdmVkUHJvdmlkZXJzYFxuICAgKiBiZWNhdXNlIGl0IG5lZWRzIHRvIHJlc29sdmUgdGhlIHBhc3NlZC1pbiBwcm92aWRlcnMgZmlyc3QuXG4gICAqIFNlZSB7QGxpbmsgSW5qZWN0b3IjcmVzb2x2ZX0gYW5kIHtAbGluayBJbmplY3RvciNmcm9tUmVzb2x2ZWRQcm92aWRlcnN9LlxuICAgKi9cbiAgc3RhdGljIHJlc29sdmVBbmRDcmVhdGUocHJvdmlkZXJzOiBBcnJheTxUeXBlIHwgUHJvdmlkZXIgfCBhbnlbXT4pOiBJbmplY3RvciB7XG4gICAgdmFyIHJlc29sdmVkUHJvdmlkZXJzID0gSW5qZWN0b3IucmVzb2x2ZShwcm92aWRlcnMpO1xuICAgIHJldHVybiBJbmplY3Rvci5mcm9tUmVzb2x2ZWRQcm92aWRlcnMocmVzb2x2ZWRQcm92aWRlcnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYW4gaW5qZWN0b3IgZnJvbSBwcmV2aW91c2x5IHJlc29sdmVkIHByb3ZpZGVycy5cbiAgICpcbiAgICogVGhpcyBBUEkgaXMgdGhlIHJlY29tbWVuZGVkIHdheSB0byBjb25zdHJ1Y3QgaW5qZWN0b3JzIGluIHBlcmZvcm1hbmNlLXNlbnNpdGl2ZSBwYXJ0cy5cbiAgICpcbiAgICogIyMjIEV4YW1wbGUgKFtsaXZlIGRlbW9dKGh0dHA6Ly9wbG5rci5jby9lZGl0L0tyU01jaT9wPXByZXZpZXcpKVxuICAgKlxuICAgKiBgYGB0eXBlc2NyaXB0XG4gICAqIEBJbmplY3RhYmxlKClcbiAgICogY2xhc3MgRW5naW5lIHtcbiAgICogfVxuICAgKlxuICAgKiBASW5qZWN0YWJsZSgpXG4gICAqIGNsYXNzIENhciB7XG4gICAqICAgY29uc3RydWN0b3IocHVibGljIGVuZ2luZTpFbmdpbmUpIHt9XG4gICAqIH1cbiAgICpcbiAgICogdmFyIHByb3ZpZGVycyA9IEluamVjdG9yLnJlc29sdmUoW0NhciwgRW5naW5lXSk7XG4gICAqIHZhciBpbmplY3RvciA9IEluamVjdG9yLmZyb21SZXNvbHZlZFByb3ZpZGVycyhwcm92aWRlcnMpO1xuICAgKiBleHBlY3QoaW5qZWN0b3IuZ2V0KENhcikgaW5zdGFuY2VvZiBDYXIpLnRvQmUodHJ1ZSk7XG4gICAqIGBgYFxuICAgKi9cbiAgc3RhdGljIGZyb21SZXNvbHZlZFByb3ZpZGVycyhwcm92aWRlcnM6IFJlc29sdmVkUHJvdmlkZXJbXSk6IEluamVjdG9yIHtcbiAgICByZXR1cm4gbmV3IEluamVjdG9yKFByb3RvSW5qZWN0b3IuZnJvbVJlc29sdmVkUHJvdmlkZXJzKHByb3ZpZGVycykpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBkZXByZWNhdGVkXG4gICAqL1xuICBzdGF0aWMgZnJvbVJlc29sdmVkQmluZGluZ3MocHJvdmlkZXJzOiBSZXNvbHZlZFByb3ZpZGVyW10pOiBJbmplY3RvciB7XG4gICAgcmV0dXJuIEluamVjdG9yLmZyb21SZXNvbHZlZFByb3ZpZGVycyhwcm92aWRlcnMpO1xuICB9XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfc3RyYXRlZ3k6IEluamVjdG9yU3RyYXRlZ3k7XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX2NvbnN0cnVjdGlvbkNvdW50ZXI6IG51bWJlciA9IDA7XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgcHVibGljIF9wcm90bzogYW55IC8qIFByb3RvSW5qZWN0b3IgKi87XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgcHVibGljIF9wYXJlbnQ6IEluamVjdG9yO1xuICAvKipcbiAgICogUHJpdmF0ZVxuICAgKi9cbiAgY29uc3RydWN0b3IoX3Byb3RvOiBhbnkgLyogUHJvdG9JbmplY3RvciAqLywgX3BhcmVudDogSW5qZWN0b3IgPSBudWxsLFxuICAgICAgICAgICAgICBwcml2YXRlIF9pc0hvc3RCb3VuZGFyeTogYm9vbGVhbiA9IGZhbHNlLFxuICAgICAgICAgICAgICBwcml2YXRlIF9kZXBQcm92aWRlcjogYW55IC8qIERlcGVuZGVuY3lQcm92aWRlciAqLyA9IG51bGwsXG4gICAgICAgICAgICAgIHByaXZhdGUgX2RlYnVnQ29udGV4dDogRnVuY3Rpb24gPSBudWxsKSB7XG4gICAgdGhpcy5fcHJvdG8gPSBfcHJvdG87XG4gICAgdGhpcy5fcGFyZW50ID0gX3BhcmVudDtcbiAgICB0aGlzLl9zdHJhdGVneSA9IF9wcm90by5fc3RyYXRlZ3kuY3JlYXRlSW5qZWN0b3JTdHJhdGVneSh0aGlzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRoaXMgaW5qZWN0b3IgaXMgYSBib3VuZGFyeSB0byBhIGhvc3QuXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgZ2V0IGhvc3RCb3VuZGFyeSgpIHsgcmV0dXJuIHRoaXMuX2lzSG9zdEJvdW5kYXJ5OyB9XG5cbiAgLyoqXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgZGVidWdDb250ZXh0KCk6IGFueSB7IHJldHVybiB0aGlzLl9kZWJ1Z0NvbnRleHQoKTsgfVxuXG4gIC8qKlxuICAgKiBSZXRyaWV2ZXMgYW4gaW5zdGFuY2UgZnJvbSB0aGUgaW5qZWN0b3IgYmFzZWQgb24gdGhlIHByb3ZpZGVkIHRva2VuLlxuICAgKiBUaHJvd3Mge0BsaW5rIE5vUHJvdmlkZXJFcnJvcn0gaWYgbm90IGZvdW5kLlxuICAgKlxuICAgKiAjIyMgRXhhbXBsZSAoW2xpdmUgZGVtb10oaHR0cDovL3BsbmtyLmNvL2VkaXQvSGVYU0hnP3A9cHJldmlldykpXG4gICAqXG4gICAqIGBgYHR5cGVzY3JpcHRcbiAgICogdmFyIGluamVjdG9yID0gSW5qZWN0b3IucmVzb2x2ZUFuZENyZWF0ZShbXG4gICAqICAgcHJvdmlkZShcInZhbGlkVG9rZW5cIiwge3VzZVZhbHVlOiBcIlZhbHVlXCJ9KVxuICAgKiBdKTtcbiAgICogZXhwZWN0KGluamVjdG9yLmdldChcInZhbGlkVG9rZW5cIikpLnRvRXF1YWwoXCJWYWx1ZVwiKTtcbiAgICogZXhwZWN0KCgpID0+IGluamVjdG9yLmdldChcImludmFsaWRUb2tlblwiKSkudG9UaHJvd0Vycm9yKCk7XG4gICAqIGBgYFxuICAgKlxuICAgKiBgSW5qZWN0b3JgIHJldHVybnMgaXRzZWxmIHdoZW4gZ2l2ZW4gYEluamVjdG9yYCBhcyBhIHRva2VuLlxuICAgKlxuICAgKiBgYGB0eXBlc2NyaXB0XG4gICAqIHZhciBpbmplY3RvciA9IEluamVjdG9yLnJlc29sdmVBbmRDcmVhdGUoW10pO1xuICAgKiBleHBlY3QoaW5qZWN0b3IuZ2V0KEluamVjdG9yKSkudG9CZShpbmplY3Rvcik7XG4gICAqIGBgYFxuICAgKi9cbiAgZ2V0KHRva2VuOiBhbnkpOiBhbnkge1xuICAgIHJldHVybiB0aGlzLl9nZXRCeUtleShLZXkuZ2V0KHRva2VuKSwgbnVsbCwgbnVsbCwgZmFsc2UsIFZpc2liaWxpdHkuUHVibGljQW5kUHJpdmF0ZSk7XG4gIH1cblxuICAvKipcbiAgICogUmV0cmlldmVzIGFuIGluc3RhbmNlIGZyb20gdGhlIGluamVjdG9yIGJhc2VkIG9uIHRoZSBwcm92aWRlZCB0b2tlbi5cbiAgICogUmV0dXJucyBudWxsIGlmIG5vdCBmb3VuZC5cbiAgICpcbiAgICogIyMjIEV4YW1wbGUgKFtsaXZlIGRlbW9dKGh0dHA6Ly9wbG5rci5jby9lZGl0L3RwRWJFeT9wPXByZXZpZXcpKVxuICAgKlxuICAgKiBgYGB0eXBlc2NyaXB0XG4gICAqIHZhciBpbmplY3RvciA9IEluamVjdG9yLnJlc29sdmVBbmRDcmVhdGUoW1xuICAgKiAgIHByb3ZpZGUoXCJ2YWxpZFRva2VuXCIsIHt1c2VWYWx1ZTogXCJWYWx1ZVwifSlcbiAgICogXSk7XG4gICAqIGV4cGVjdChpbmplY3Rvci5nZXRPcHRpb25hbChcInZhbGlkVG9rZW5cIikpLnRvRXF1YWwoXCJWYWx1ZVwiKTtcbiAgICogZXhwZWN0KGluamVjdG9yLmdldE9wdGlvbmFsKFwiaW52YWxpZFRva2VuXCIpKS50b0JlKG51bGwpO1xuICAgKiBgYGBcbiAgICpcbiAgICogYEluamVjdG9yYCByZXR1cm5zIGl0c2VsZiB3aGVuIGdpdmVuIGBJbmplY3RvcmAgYXMgYSB0b2tlbi5cbiAgICpcbiAgICogYGBgdHlwZXNjcmlwdFxuICAgKiB2YXIgaW5qZWN0b3IgPSBJbmplY3Rvci5yZXNvbHZlQW5kQ3JlYXRlKFtdKTtcbiAgICogZXhwZWN0KGluamVjdG9yLmdldE9wdGlvbmFsKEluamVjdG9yKSkudG9CZShpbmplY3Rvcik7XG4gICAqIGBgYFxuICAgKi9cbiAgZ2V0T3B0aW9uYWwodG9rZW46IGFueSk6IGFueSB7XG4gICAgcmV0dXJuIHRoaXMuX2dldEJ5S2V5KEtleS5nZXQodG9rZW4pLCBudWxsLCBudWxsLCB0cnVlLCBWaXNpYmlsaXR5LlB1YmxpY0FuZFByaXZhdGUpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgZ2V0QXQoaW5kZXg6IG51bWJlcik6IGFueSB7IHJldHVybiB0aGlzLl9zdHJhdGVneS5nZXRPYmpBdEluZGV4KGluZGV4KTsgfVxuXG4gIC8qKlxuICAgKiBQYXJlbnQgb2YgdGhpcyBpbmplY3Rvci5cbiAgICpcbiAgICogPCEtLSBUT0RPOiBBZGQgYSBsaW5rIHRvIHRoZSBzZWN0aW9uIG9mIHRoZSB1c2VyIGd1aWRlIHRhbGtpbmcgYWJvdXQgaGllcmFyY2hpY2FsIGluamVjdGlvbi5cbiAgICogLS0+XG4gICAqXG4gICAqICMjIyBFeGFtcGxlIChbbGl2ZSBkZW1vXShodHRwOi8vcGxua3IuY28vZWRpdC9lb3NNR28/cD1wcmV2aWV3KSlcbiAgICpcbiAgICogYGBgdHlwZXNjcmlwdFxuICAgKiB2YXIgcGFyZW50ID0gSW5qZWN0b3IucmVzb2x2ZUFuZENyZWF0ZShbXSk7XG4gICAqIHZhciBjaGlsZCA9IHBhcmVudC5yZXNvbHZlQW5kQ3JlYXRlQ2hpbGQoW10pO1xuICAgKiBleHBlY3QoY2hpbGQucGFyZW50KS50b0JlKHBhcmVudCk7XG4gICAqIGBgYFxuICAgKi9cbiAgZ2V0IHBhcmVudCgpOiBJbmplY3RvciB7IHJldHVybiB0aGlzLl9wYXJlbnQ7IH1cblxuICAvKipcbiAgICogQGludGVybmFsXG4gICAqIEludGVybmFsLiBEbyBub3QgdXNlLlxuICAgKiBXZSByZXR1cm4gYGFueWAgbm90IHRvIGV4cG9ydCB0aGUgSW5qZWN0b3JTdHJhdGVneSB0eXBlLlxuICAgKi9cbiAgZ2V0IGludGVybmFsU3RyYXRlZ3koKTogYW55IHsgcmV0dXJuIHRoaXMuX3N0cmF0ZWd5OyB9XG5cbiAgLyoqXG4gICAqIFJlc29sdmVzIGFuIGFycmF5IG9mIHByb3ZpZGVycyBhbmQgY3JlYXRlcyBhIGNoaWxkIGluamVjdG9yIGZyb20gdGhvc2UgcHJvdmlkZXJzLlxuICAgKlxuICAgKiA8IS0tIFRPRE86IEFkZCBhIGxpbmsgdG8gdGhlIHNlY3Rpb24gb2YgdGhlIHVzZXIgZ3VpZGUgdGFsa2luZyBhYm91dCBoaWVyYXJjaGljYWwgaW5qZWN0aW9uLlxuICAgKiAtLT5cbiAgICpcbiAgICogVGhlIHBhc3NlZC1pbiBwcm92aWRlcnMgY2FuIGJlIGFuIGFycmF5IG9mIGBUeXBlYCwge0BsaW5rIFByb3ZpZGVyfSxcbiAgICogb3IgYSByZWN1cnNpdmUgYXJyYXkgb2YgbW9yZSBwcm92aWRlcnMuXG4gICAqXG4gICAqICMjIyBFeGFtcGxlIChbbGl2ZSBkZW1vXShodHRwOi8vcGxua3IuY28vZWRpdC9vcEIzVDQ/cD1wcmV2aWV3KSlcbiAgICpcbiAgICogYGBgdHlwZXNjcmlwdFxuICAgKiBjbGFzcyBQYXJlbnRQcm92aWRlciB7fVxuICAgKiBjbGFzcyBDaGlsZFByb3ZpZGVyIHt9XG4gICAqXG4gICAqIHZhciBwYXJlbnQgPSBJbmplY3Rvci5yZXNvbHZlQW5kQ3JlYXRlKFtQYXJlbnRQcm92aWRlcl0pO1xuICAgKiB2YXIgY2hpbGQgPSBwYXJlbnQucmVzb2x2ZUFuZENyZWF0ZUNoaWxkKFtDaGlsZFByb3ZpZGVyXSk7XG4gICAqXG4gICAqIGV4cGVjdChjaGlsZC5nZXQoUGFyZW50UHJvdmlkZXIpIGluc3RhbmNlb2YgUGFyZW50UHJvdmlkZXIpLnRvQmUodHJ1ZSk7XG4gICAqIGV4cGVjdChjaGlsZC5nZXQoQ2hpbGRQcm92aWRlcikgaW5zdGFuY2VvZiBDaGlsZFByb3ZpZGVyKS50b0JlKHRydWUpO1xuICAgKiBleHBlY3QoY2hpbGQuZ2V0KFBhcmVudFByb3ZpZGVyKSkudG9CZShwYXJlbnQuZ2V0KFBhcmVudFByb3ZpZGVyKSk7XG4gICAqIGBgYFxuICAgKlxuICAgKiBUaGlzIGZ1bmN0aW9uIGlzIHNsb3dlciB0aGFuIHRoZSBjb3JyZXNwb25kaW5nIGBjcmVhdGVDaGlsZEZyb21SZXNvbHZlZGBcbiAgICogYmVjYXVzZSBpdCBuZWVkcyB0byByZXNvbHZlIHRoZSBwYXNzZWQtaW4gcHJvdmlkZXJzIGZpcnN0LlxuICAgKiBTZWUge0BsaW5rIEluamVjdG9yI3Jlc29sdmV9IGFuZCB7QGxpbmsgSW5qZWN0b3IjY3JlYXRlQ2hpbGRGcm9tUmVzb2x2ZWR9LlxuICAgKi9cbiAgcmVzb2x2ZUFuZENyZWF0ZUNoaWxkKHByb3ZpZGVyczogQXJyYXk8VHlwZSB8IFByb3ZpZGVyIHwgYW55W10+KTogSW5qZWN0b3Ige1xuICAgIHZhciByZXNvbHZlZFByb3ZpZGVycyA9IEluamVjdG9yLnJlc29sdmUocHJvdmlkZXJzKTtcbiAgICByZXR1cm4gdGhpcy5jcmVhdGVDaGlsZEZyb21SZXNvbHZlZChyZXNvbHZlZFByb3ZpZGVycyk7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlcyBhIGNoaWxkIGluamVjdG9yIGZyb20gcHJldmlvdXNseSByZXNvbHZlZCBwcm92aWRlcnMuXG4gICAqXG4gICAqIDwhLS0gVE9ETzogQWRkIGEgbGluayB0byB0aGUgc2VjdGlvbiBvZiB0aGUgdXNlciBndWlkZSB0YWxraW5nIGFib3V0IGhpZXJhcmNoaWNhbCBpbmplY3Rpb24uXG4gICAqIC0tPlxuICAgKlxuICAgKiBUaGlzIEFQSSBpcyB0aGUgcmVjb21tZW5kZWQgd2F5IHRvIGNvbnN0cnVjdCBpbmplY3RvcnMgaW4gcGVyZm9ybWFuY2Utc2Vuc2l0aXZlIHBhcnRzLlxuICAgKlxuICAgKiAjIyMgRXhhbXBsZSAoW2xpdmUgZGVtb10oaHR0cDovL3BsbmtyLmNvL2VkaXQvVmh5ZmpOP3A9cHJldmlldykpXG4gICAqXG4gICAqIGBgYHR5cGVzY3JpcHRcbiAgICogY2xhc3MgUGFyZW50UHJvdmlkZXIge31cbiAgICogY2xhc3MgQ2hpbGRQcm92aWRlciB7fVxuICAgKlxuICAgKiB2YXIgcGFyZW50UHJvdmlkZXJzID0gSW5qZWN0b3IucmVzb2x2ZShbUGFyZW50UHJvdmlkZXJdKTtcbiAgICogdmFyIGNoaWxkUHJvdmlkZXJzID0gSW5qZWN0b3IucmVzb2x2ZShbQ2hpbGRQcm92aWRlcl0pO1xuICAgKlxuICAgKiB2YXIgcGFyZW50ID0gSW5qZWN0b3IuZnJvbVJlc29sdmVkUHJvdmlkZXJzKHBhcmVudFByb3ZpZGVycyk7XG4gICAqIHZhciBjaGlsZCA9IHBhcmVudC5jcmVhdGVDaGlsZEZyb21SZXNvbHZlZChjaGlsZFByb3ZpZGVycyk7XG4gICAqXG4gICAqIGV4cGVjdChjaGlsZC5nZXQoUGFyZW50UHJvdmlkZXIpIGluc3RhbmNlb2YgUGFyZW50UHJvdmlkZXIpLnRvQmUodHJ1ZSk7XG4gICAqIGV4cGVjdChjaGlsZC5nZXQoQ2hpbGRQcm92aWRlcikgaW5zdGFuY2VvZiBDaGlsZFByb3ZpZGVyKS50b0JlKHRydWUpO1xuICAgKiBleHBlY3QoY2hpbGQuZ2V0KFBhcmVudFByb3ZpZGVyKSkudG9CZShwYXJlbnQuZ2V0KFBhcmVudFByb3ZpZGVyKSk7XG4gICAqIGBgYFxuICAgKi9cbiAgY3JlYXRlQ2hpbGRGcm9tUmVzb2x2ZWQocHJvdmlkZXJzOiBSZXNvbHZlZFByb3ZpZGVyW10pOiBJbmplY3RvciB7XG4gICAgdmFyIGJkID0gcHJvdmlkZXJzLm1hcChiID0+IG5ldyBQcm92aWRlcldpdGhWaXNpYmlsaXR5KGIsIFZpc2liaWxpdHkuUHVibGljKSk7XG4gICAgdmFyIHByb3RvID0gbmV3IFByb3RvSW5qZWN0b3IoYmQpO1xuICAgIHZhciBpbmogPSBuZXcgSW5qZWN0b3IocHJvdG8pO1xuICAgIGluai5fcGFyZW50ID0gdGhpcztcbiAgICByZXR1cm4gaW5qO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlc29sdmVzIGEgcHJvdmlkZXIgYW5kIGluc3RhbnRpYXRlcyBhbiBvYmplY3QgaW4gdGhlIGNvbnRleHQgb2YgdGhlIGluamVjdG9yLlxuICAgKlxuICAgKiBUaGUgY3JlYXRlZCBvYmplY3QgZG9lcyBub3QgZ2V0IGNhY2hlZCBieSB0aGUgaW5qZWN0b3IuXG4gICAqXG4gICAqICMjIyBFeGFtcGxlIChbbGl2ZSBkZW1vXShodHRwOi8vcGxua3IuY28vZWRpdC95dlZYb0I/cD1wcmV2aWV3KSlcbiAgICpcbiAgICogYGBgdHlwZXNjcmlwdFxuICAgKiBASW5qZWN0YWJsZSgpXG4gICAqIGNsYXNzIEVuZ2luZSB7XG4gICAqIH1cbiAgICpcbiAgICogQEluamVjdGFibGUoKVxuICAgKiBjbGFzcyBDYXIge1xuICAgKiAgIGNvbnN0cnVjdG9yKHB1YmxpYyBlbmdpbmU6RW5naW5lKSB7fVxuICAgKiB9XG4gICAqXG4gICAqIHZhciBpbmplY3RvciA9IEluamVjdG9yLnJlc29sdmVBbmRDcmVhdGUoW0VuZ2luZV0pO1xuICAgKlxuICAgKiB2YXIgY2FyID0gaW5qZWN0b3IucmVzb2x2ZUFuZEluc3RhbnRpYXRlKENhcik7XG4gICAqIGV4cGVjdChjYXIuZW5naW5lKS50b0JlKGluamVjdG9yLmdldChFbmdpbmUpKTtcbiAgICogZXhwZWN0KGNhcikubm90LnRvQmUoaW5qZWN0b3IucmVzb2x2ZUFuZEluc3RhbnRpYXRlKENhcikpO1xuICAgKiBgYGBcbiAgICovXG4gIHJlc29sdmVBbmRJbnN0YW50aWF0ZShwcm92aWRlcjogVHlwZSB8IFByb3ZpZGVyKTogYW55IHtcbiAgICByZXR1cm4gdGhpcy5pbnN0YW50aWF0ZVJlc29sdmVkKEluamVjdG9yLnJlc29sdmUoW3Byb3ZpZGVyXSlbMF0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEluc3RhbnRpYXRlcyBhbiBvYmplY3QgdXNpbmcgYSByZXNvbHZlZCBwcm92aWRlciBpbiB0aGUgY29udGV4dCBvZiB0aGUgaW5qZWN0b3IuXG4gICAqXG4gICAqIFRoZSBjcmVhdGVkIG9iamVjdCBkb2VzIG5vdCBnZXQgY2FjaGVkIGJ5IHRoZSBpbmplY3Rvci5cbiAgICpcbiAgICogIyMjIEV4YW1wbGUgKFtsaXZlIGRlbW9dKGh0dHA6Ly9wbG5rci5jby9lZGl0L3B0Q0ltUT9wPXByZXZpZXcpKVxuICAgKlxuICAgKiBgYGB0eXBlc2NyaXB0XG4gICAqIEBJbmplY3RhYmxlKClcbiAgICogY2xhc3MgRW5naW5lIHtcbiAgICogfVxuICAgKlxuICAgKiBASW5qZWN0YWJsZSgpXG4gICAqIGNsYXNzIENhciB7XG4gICAqICAgY29uc3RydWN0b3IocHVibGljIGVuZ2luZTpFbmdpbmUpIHt9XG4gICAqIH1cbiAgICpcbiAgICogdmFyIGluamVjdG9yID0gSW5qZWN0b3IucmVzb2x2ZUFuZENyZWF0ZShbRW5naW5lXSk7XG4gICAqIHZhciBjYXJQcm92aWRlciA9IEluamVjdG9yLnJlc29sdmUoW0Nhcl0pWzBdO1xuICAgKiB2YXIgY2FyID0gaW5qZWN0b3IuaW5zdGFudGlhdGVSZXNvbHZlZChjYXJQcm92aWRlcik7XG4gICAqIGV4cGVjdChjYXIuZW5naW5lKS50b0JlKGluamVjdG9yLmdldChFbmdpbmUpKTtcbiAgICogZXhwZWN0KGNhcikubm90LnRvQmUoaW5qZWN0b3IuaW5zdGFudGlhdGVSZXNvbHZlZChjYXJQcm92aWRlcikpO1xuICAgKiBgYGBcbiAgICovXG4gIGluc3RhbnRpYXRlUmVzb2x2ZWQocHJvdmlkZXI6IFJlc29sdmVkUHJvdmlkZXIpOiBhbnkge1xuICAgIHJldHVybiB0aGlzLl9pbnN0YW50aWF0ZVByb3ZpZGVyKHByb3ZpZGVyLCBWaXNpYmlsaXR5LlB1YmxpY0FuZFByaXZhdGUpO1xuICB9XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfbmV3KHByb3ZpZGVyOiBSZXNvbHZlZFByb3ZpZGVyLCB2aXNpYmlsaXR5OiBWaXNpYmlsaXR5KTogYW55IHtcbiAgICBpZiAodGhpcy5fY29uc3RydWN0aW9uQ291bnRlcisrID4gdGhpcy5fc3RyYXRlZ3kuZ2V0TWF4TnVtYmVyT2ZPYmplY3RzKCkpIHtcbiAgICAgIHRocm93IG5ldyBDeWNsaWNEZXBlbmRlbmN5RXJyb3IodGhpcywgcHJvdmlkZXIua2V5KTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX2luc3RhbnRpYXRlUHJvdmlkZXIocHJvdmlkZXIsIHZpc2liaWxpdHkpO1xuICB9XG5cbiAgcHJpdmF0ZSBfaW5zdGFudGlhdGVQcm92aWRlcihwcm92aWRlcjogUmVzb2x2ZWRQcm92aWRlciwgdmlzaWJpbGl0eTogVmlzaWJpbGl0eSk6IGFueSB7XG4gICAgaWYgKHByb3ZpZGVyLm11bHRpUHJvdmlkZXIpIHtcbiAgICAgIHZhciByZXMgPSBMaXN0V3JhcHBlci5jcmVhdGVGaXhlZFNpemUocHJvdmlkZXIucmVzb2x2ZWRGYWN0b3JpZXMubGVuZ3RoKTtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcHJvdmlkZXIucmVzb2x2ZWRGYWN0b3JpZXMubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgcmVzW2ldID0gdGhpcy5faW5zdGFudGlhdGUocHJvdmlkZXIsIHByb3ZpZGVyLnJlc29sdmVkRmFjdG9yaWVzW2ldLCB2aXNpYmlsaXR5KTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXM7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLl9pbnN0YW50aWF0ZShwcm92aWRlciwgcHJvdmlkZXIucmVzb2x2ZWRGYWN0b3JpZXNbMF0sIHZpc2liaWxpdHkpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX2luc3RhbnRpYXRlKHByb3ZpZGVyOiBSZXNvbHZlZFByb3ZpZGVyLCByZXNvbHZlZEZhY3Rvcnk6IFJlc29sdmVkRmFjdG9yeSxcbiAgICAgICAgICAgICAgICAgICAgICAgdmlzaWJpbGl0eTogVmlzaWJpbGl0eSk6IGFueSB7XG4gICAgdmFyIGZhY3RvcnkgPSByZXNvbHZlZEZhY3RvcnkuZmFjdG9yeTtcbiAgICB2YXIgZGVwcyA9IHJlc29sdmVkRmFjdG9yeS5kZXBlbmRlbmNpZXM7XG4gICAgdmFyIGxlbmd0aCA9IGRlcHMubGVuZ3RoO1xuXG4gICAgdmFyIGQwOiBhbnk7XG4gICAgdmFyIGQxOiBhbnk7XG4gICAgdmFyIGQyOiBhbnk7XG4gICAgdmFyIGQzOiBhbnk7XG4gICAgdmFyIGQ0OiBhbnk7XG4gICAgdmFyIGQ1OiBhbnk7XG4gICAgdmFyIGQ2OiBhbnk7XG4gICAgdmFyIGQ3OiBhbnk7XG4gICAgdmFyIGQ4OiBhbnk7XG4gICAgdmFyIGQ5OiBhbnk7XG4gICAgdmFyIGQxMDogYW55O1xuICAgIHZhciBkMTE6IGFueTtcbiAgICB2YXIgZDEyOiBhbnk7XG4gICAgdmFyIGQxMzogYW55O1xuICAgIHZhciBkMTQ6IGFueTtcbiAgICB2YXIgZDE1OiBhbnk7XG4gICAgdmFyIGQxNjogYW55O1xuICAgIHZhciBkMTc6IGFueTtcbiAgICB2YXIgZDE4OiBhbnk7XG4gICAgdmFyIGQxOTogYW55O1xuICAgIHRyeSB7XG4gICAgICBkMCA9IGxlbmd0aCA+IDAgPyB0aGlzLl9nZXRCeURlcGVuZGVuY3kocHJvdmlkZXIsIGRlcHNbMF0sIHZpc2liaWxpdHkpIDogbnVsbDtcbiAgICAgIGQxID0gbGVuZ3RoID4gMSA/IHRoaXMuX2dldEJ5RGVwZW5kZW5jeShwcm92aWRlciwgZGVwc1sxXSwgdmlzaWJpbGl0eSkgOiBudWxsO1xuICAgICAgZDIgPSBsZW5ndGggPiAyID8gdGhpcy5fZ2V0QnlEZXBlbmRlbmN5KHByb3ZpZGVyLCBkZXBzWzJdLCB2aXNpYmlsaXR5KSA6IG51bGw7XG4gICAgICBkMyA9IGxlbmd0aCA+IDMgPyB0aGlzLl9nZXRCeURlcGVuZGVuY3kocHJvdmlkZXIsIGRlcHNbM10sIHZpc2liaWxpdHkpIDogbnVsbDtcbiAgICAgIGQ0ID0gbGVuZ3RoID4gNCA/IHRoaXMuX2dldEJ5RGVwZW5kZW5jeShwcm92aWRlciwgZGVwc1s0XSwgdmlzaWJpbGl0eSkgOiBudWxsO1xuICAgICAgZDUgPSBsZW5ndGggPiA1ID8gdGhpcy5fZ2V0QnlEZXBlbmRlbmN5KHByb3ZpZGVyLCBkZXBzWzVdLCB2aXNpYmlsaXR5KSA6IG51bGw7XG4gICAgICBkNiA9IGxlbmd0aCA+IDYgPyB0aGlzLl9nZXRCeURlcGVuZGVuY3kocHJvdmlkZXIsIGRlcHNbNl0sIHZpc2liaWxpdHkpIDogbnVsbDtcbiAgICAgIGQ3ID0gbGVuZ3RoID4gNyA/IHRoaXMuX2dldEJ5RGVwZW5kZW5jeShwcm92aWRlciwgZGVwc1s3XSwgdmlzaWJpbGl0eSkgOiBudWxsO1xuICAgICAgZDggPSBsZW5ndGggPiA4ID8gdGhpcy5fZ2V0QnlEZXBlbmRlbmN5KHByb3ZpZGVyLCBkZXBzWzhdLCB2aXNpYmlsaXR5KSA6IG51bGw7XG4gICAgICBkOSA9IGxlbmd0aCA+IDkgPyB0aGlzLl9nZXRCeURlcGVuZGVuY3kocHJvdmlkZXIsIGRlcHNbOV0sIHZpc2liaWxpdHkpIDogbnVsbDtcbiAgICAgIGQxMCA9IGxlbmd0aCA+IDEwID8gdGhpcy5fZ2V0QnlEZXBlbmRlbmN5KHByb3ZpZGVyLCBkZXBzWzEwXSwgdmlzaWJpbGl0eSkgOiBudWxsO1xuICAgICAgZDExID0gbGVuZ3RoID4gMTEgPyB0aGlzLl9nZXRCeURlcGVuZGVuY3kocHJvdmlkZXIsIGRlcHNbMTFdLCB2aXNpYmlsaXR5KSA6IG51bGw7XG4gICAgICBkMTIgPSBsZW5ndGggPiAxMiA/IHRoaXMuX2dldEJ5RGVwZW5kZW5jeShwcm92aWRlciwgZGVwc1sxMl0sIHZpc2liaWxpdHkpIDogbnVsbDtcbiAgICAgIGQxMyA9IGxlbmd0aCA+IDEzID8gdGhpcy5fZ2V0QnlEZXBlbmRlbmN5KHByb3ZpZGVyLCBkZXBzWzEzXSwgdmlzaWJpbGl0eSkgOiBudWxsO1xuICAgICAgZDE0ID0gbGVuZ3RoID4gMTQgPyB0aGlzLl9nZXRCeURlcGVuZGVuY3kocHJvdmlkZXIsIGRlcHNbMTRdLCB2aXNpYmlsaXR5KSA6IG51bGw7XG4gICAgICBkMTUgPSBsZW5ndGggPiAxNSA/IHRoaXMuX2dldEJ5RGVwZW5kZW5jeShwcm92aWRlciwgZGVwc1sxNV0sIHZpc2liaWxpdHkpIDogbnVsbDtcbiAgICAgIGQxNiA9IGxlbmd0aCA+IDE2ID8gdGhpcy5fZ2V0QnlEZXBlbmRlbmN5KHByb3ZpZGVyLCBkZXBzWzE2XSwgdmlzaWJpbGl0eSkgOiBudWxsO1xuICAgICAgZDE3ID0gbGVuZ3RoID4gMTcgPyB0aGlzLl9nZXRCeURlcGVuZGVuY3kocHJvdmlkZXIsIGRlcHNbMTddLCB2aXNpYmlsaXR5KSA6IG51bGw7XG4gICAgICBkMTggPSBsZW5ndGggPiAxOCA/IHRoaXMuX2dldEJ5RGVwZW5kZW5jeShwcm92aWRlciwgZGVwc1sxOF0sIHZpc2liaWxpdHkpIDogbnVsbDtcbiAgICAgIGQxOSA9IGxlbmd0aCA+IDE5ID8gdGhpcy5fZ2V0QnlEZXBlbmRlbmN5KHByb3ZpZGVyLCBkZXBzWzE5XSwgdmlzaWJpbGl0eSkgOiBudWxsO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGlmIChlIGluc3RhbmNlb2YgQWJzdHJhY3RQcm92aWRlckVycm9yIHx8IGUgaW5zdGFuY2VvZiBJbnN0YW50aWF0aW9uRXJyb3IpIHtcbiAgICAgICAgZS5hZGRLZXkodGhpcywgcHJvdmlkZXIua2V5KTtcbiAgICAgIH1cbiAgICAgIHRocm93IGU7XG4gICAgfVxuXG4gICAgdmFyIG9iajtcbiAgICB0cnkge1xuICAgICAgc3dpdGNoIChsZW5ndGgpIHtcbiAgICAgICAgY2FzZSAwOlxuICAgICAgICAgIG9iaiA9IGZhY3RvcnkoKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAxOlxuICAgICAgICAgIG9iaiA9IGZhY3RvcnkoZDApO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgb2JqID0gZmFjdG9yeShkMCwgZDEpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgb2JqID0gZmFjdG9yeShkMCwgZDEsIGQyKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSA0OlxuICAgICAgICAgIG9iaiA9IGZhY3RvcnkoZDAsIGQxLCBkMiwgZDMpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDU6XG4gICAgICAgICAgb2JqID0gZmFjdG9yeShkMCwgZDEsIGQyLCBkMywgZDQpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDY6XG4gICAgICAgICAgb2JqID0gZmFjdG9yeShkMCwgZDEsIGQyLCBkMywgZDQsIGQ1KTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSA3OlxuICAgICAgICAgIG9iaiA9IGZhY3RvcnkoZDAsIGQxLCBkMiwgZDMsIGQ0LCBkNSwgZDYpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDg6XG4gICAgICAgICAgb2JqID0gZmFjdG9yeShkMCwgZDEsIGQyLCBkMywgZDQsIGQ1LCBkNiwgZDcpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDk6XG4gICAgICAgICAgb2JqID0gZmFjdG9yeShkMCwgZDEsIGQyLCBkMywgZDQsIGQ1LCBkNiwgZDcsIGQ4KTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAxMDpcbiAgICAgICAgICBvYmogPSBmYWN0b3J5KGQwLCBkMSwgZDIsIGQzLCBkNCwgZDUsIGQ2LCBkNywgZDgsIGQ5KTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAxMTpcbiAgICAgICAgICBvYmogPSBmYWN0b3J5KGQwLCBkMSwgZDIsIGQzLCBkNCwgZDUsIGQ2LCBkNywgZDgsIGQ5LCBkMTApO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDEyOlxuICAgICAgICAgIG9iaiA9IGZhY3RvcnkoZDAsIGQxLCBkMiwgZDMsIGQ0LCBkNSwgZDYsIGQ3LCBkOCwgZDksIGQxMCwgZDExKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAxMzpcbiAgICAgICAgICBvYmogPSBmYWN0b3J5KGQwLCBkMSwgZDIsIGQzLCBkNCwgZDUsIGQ2LCBkNywgZDgsIGQ5LCBkMTAsIGQxMSwgZDEyKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAxNDpcbiAgICAgICAgICBvYmogPSBmYWN0b3J5KGQwLCBkMSwgZDIsIGQzLCBkNCwgZDUsIGQ2LCBkNywgZDgsIGQ5LCBkMTAsIGQxMSwgZDEyLCBkMTMpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDE1OlxuICAgICAgICAgIG9iaiA9IGZhY3RvcnkoZDAsIGQxLCBkMiwgZDMsIGQ0LCBkNSwgZDYsIGQ3LCBkOCwgZDksIGQxMCwgZDExLCBkMTIsIGQxMywgZDE0KTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAxNjpcbiAgICAgICAgICBvYmogPSBmYWN0b3J5KGQwLCBkMSwgZDIsIGQzLCBkNCwgZDUsIGQ2LCBkNywgZDgsIGQ5LCBkMTAsIGQxMSwgZDEyLCBkMTMsIGQxNCwgZDE1KTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAxNzpcbiAgICAgICAgICBvYmogPSBmYWN0b3J5KGQwLCBkMSwgZDIsIGQzLCBkNCwgZDUsIGQ2LCBkNywgZDgsIGQ5LCBkMTAsIGQxMSwgZDEyLCBkMTMsIGQxNCwgZDE1LCBkMTYpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDE4OlxuICAgICAgICAgIG9iaiA9IGZhY3RvcnkoZDAsIGQxLCBkMiwgZDMsIGQ0LCBkNSwgZDYsIGQ3LCBkOCwgZDksIGQxMCwgZDExLCBkMTIsIGQxMywgZDE0LCBkMTUsIGQxNixcbiAgICAgICAgICAgICAgICAgICAgICAgIGQxNyk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgMTk6XG4gICAgICAgICAgb2JqID0gZmFjdG9yeShkMCwgZDEsIGQyLCBkMywgZDQsIGQ1LCBkNiwgZDcsIGQ4LCBkOSwgZDEwLCBkMTEsIGQxMiwgZDEzLCBkMTQsIGQxNSwgZDE2LFxuICAgICAgICAgICAgICAgICAgICAgICAgZDE3LCBkMTgpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDIwOlxuICAgICAgICAgIG9iaiA9IGZhY3RvcnkoZDAsIGQxLCBkMiwgZDMsIGQ0LCBkNSwgZDYsIGQ3LCBkOCwgZDksIGQxMCwgZDExLCBkMTIsIGQxMywgZDE0LCBkMTUsIGQxNixcbiAgICAgICAgICAgICAgICAgICAgICAgIGQxNywgZDE4LCBkMTkpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIHRocm93IG5ldyBCYXNlRXhjZXB0aW9uKFxuICAgICAgICAgICAgICBgQ2Fubm90IGluc3RhbnRpYXRlICcke3Byb3ZpZGVyLmtleS5kaXNwbGF5TmFtZX0nIGJlY2F1c2UgaXQgaGFzIG1vcmUgdGhhbiAyMCBkZXBlbmRlbmNpZXNgKTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICB0aHJvdyBuZXcgSW5zdGFudGlhdGlvbkVycm9yKHRoaXMsIGUsIGUuc3RhY2ssIHByb3ZpZGVyLmtleSk7XG4gICAgfVxuICAgIHJldHVybiBvYmo7XG4gIH1cblxuICBwcml2YXRlIF9nZXRCeURlcGVuZGVuY3kocHJvdmlkZXI6IFJlc29sdmVkUHJvdmlkZXIsIGRlcDogRGVwZW5kZW5jeSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb3ZpZGVyVmlzaWJpbGl0eTogVmlzaWJpbGl0eSk6IGFueSB7XG4gICAgdmFyIHNwZWNpYWwgPSBpc1ByZXNlbnQodGhpcy5fZGVwUHJvdmlkZXIpID9cbiAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9kZXBQcm92aWRlci5nZXREZXBlbmRlbmN5KHRoaXMsIHByb3ZpZGVyLCBkZXApIDpcbiAgICAgICAgICAgICAgICAgICAgICBVTkRFRklORUQ7XG4gICAgaWYgKHNwZWNpYWwgIT09IFVOREVGSU5FRCkge1xuICAgICAgcmV0dXJuIHNwZWNpYWw7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLl9nZXRCeUtleShkZXAua2V5LCBkZXAubG93ZXJCb3VuZFZpc2liaWxpdHksIGRlcC51cHBlckJvdW5kVmlzaWJpbGl0eSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXAub3B0aW9uYWwsIHByb3ZpZGVyVmlzaWJpbGl0eSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfZ2V0QnlLZXkoa2V5OiBLZXksIGxvd2VyQm91bmRWaXNpYmlsaXR5OiBPYmplY3QsIHVwcGVyQm91bmRWaXNpYmlsaXR5OiBPYmplY3QsXG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbmFsOiBib29sZWFuLCBwcm92aWRlclZpc2liaWxpdHk6IFZpc2liaWxpdHkpOiBhbnkge1xuICAgIGlmIChrZXkgPT09IElOSkVDVE9SX0tFWSkge1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgaWYgKHVwcGVyQm91bmRWaXNpYmlsaXR5IGluc3RhbmNlb2YgU2VsZk1ldGFkYXRhKSB7XG4gICAgICByZXR1cm4gdGhpcy5fZ2V0QnlLZXlTZWxmKGtleSwgb3B0aW9uYWwsIHByb3ZpZGVyVmlzaWJpbGl0eSk7XG5cbiAgICB9IGVsc2UgaWYgKHVwcGVyQm91bmRWaXNpYmlsaXR5IGluc3RhbmNlb2YgSG9zdE1ldGFkYXRhKSB7XG4gICAgICByZXR1cm4gdGhpcy5fZ2V0QnlLZXlIb3N0KGtleSwgb3B0aW9uYWwsIHByb3ZpZGVyVmlzaWJpbGl0eSwgbG93ZXJCb3VuZFZpc2liaWxpdHkpO1xuXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLl9nZXRCeUtleURlZmF1bHQoa2V5LCBvcHRpb25hbCwgcHJvdmlkZXJWaXNpYmlsaXR5LCBsb3dlckJvdW5kVmlzaWJpbGl0eSk7XG4gICAgfVxuICB9XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfdGhyb3dPck51bGwoa2V5OiBLZXksIG9wdGlvbmFsOiBib29sZWFuKTogYW55IHtcbiAgICBpZiAob3B0aW9uYWwpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgTm9Qcm92aWRlckVycm9yKHRoaXMsIGtleSk7XG4gICAgfVxuICB9XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfZ2V0QnlLZXlTZWxmKGtleTogS2V5LCBvcHRpb25hbDogYm9vbGVhbiwgcHJvdmlkZXJWaXNpYmlsaXR5OiBWaXNpYmlsaXR5KTogYW55IHtcbiAgICB2YXIgb2JqID0gdGhpcy5fc3RyYXRlZ3kuZ2V0T2JqQnlLZXlJZChrZXkuaWQsIHByb3ZpZGVyVmlzaWJpbGl0eSk7XG4gICAgcmV0dXJuIChvYmogIT09IFVOREVGSU5FRCkgPyBvYmogOiB0aGlzLl90aHJvd09yTnVsbChrZXksIG9wdGlvbmFsKTtcbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX2dldEJ5S2V5SG9zdChrZXk6IEtleSwgb3B0aW9uYWw6IGJvb2xlYW4sIHByb3ZpZGVyVmlzaWJpbGl0eTogVmlzaWJpbGl0eSxcbiAgICAgICAgICAgICAgICBsb3dlckJvdW5kVmlzaWJpbGl0eTogT2JqZWN0KTogYW55IHtcbiAgICB2YXIgaW5qOiBJbmplY3RvciA9IHRoaXM7XG5cbiAgICBpZiAobG93ZXJCb3VuZFZpc2liaWxpdHkgaW5zdGFuY2VvZiBTa2lwU2VsZk1ldGFkYXRhKSB7XG4gICAgICBpZiAoaW5qLl9pc0hvc3RCb3VuZGFyeSkge1xuICAgICAgICByZXR1cm4gdGhpcy5fZ2V0UHJpdmF0ZURlcGVuZGVuY3koa2V5LCBvcHRpb25hbCwgaW5qKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGluaiA9IGluai5fcGFyZW50O1xuICAgICAgfVxuICAgIH1cblxuICAgIHdoaWxlIChpbmogIT0gbnVsbCkge1xuICAgICAgdmFyIG9iaiA9IGluai5fc3RyYXRlZ3kuZ2V0T2JqQnlLZXlJZChrZXkuaWQsIHByb3ZpZGVyVmlzaWJpbGl0eSk7XG4gICAgICBpZiAob2JqICE9PSBVTkRFRklORUQpIHJldHVybiBvYmo7XG5cbiAgICAgIGlmIChpc1ByZXNlbnQoaW5qLl9wYXJlbnQpICYmIGluai5faXNIb3N0Qm91bmRhcnkpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2dldFByaXZhdGVEZXBlbmRlbmN5KGtleSwgb3B0aW9uYWwsIGluaik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpbmogPSBpbmouX3BhcmVudDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5fdGhyb3dPck51bGwoa2V5LCBvcHRpb25hbCk7XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIF9nZXRQcml2YXRlRGVwZW5kZW5jeShrZXk6IEtleSwgb3B0aW9uYWw6IGJvb2xlYW4sIGluajogSW5qZWN0b3IpOiBhbnkge1xuICAgIHZhciBvYmogPSBpbmouX3BhcmVudC5fc3RyYXRlZ3kuZ2V0T2JqQnlLZXlJZChrZXkuaWQsIFZpc2liaWxpdHkuUHJpdmF0ZSk7XG4gICAgcmV0dXJuIChvYmogIT09IFVOREVGSU5FRCkgPyBvYmogOiB0aGlzLl90aHJvd09yTnVsbChrZXksIG9wdGlvbmFsKTtcbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX2dldEJ5S2V5RGVmYXVsdChrZXk6IEtleSwgb3B0aW9uYWw6IGJvb2xlYW4sIHByb3ZpZGVyVmlzaWJpbGl0eTogVmlzaWJpbGl0eSxcbiAgICAgICAgICAgICAgICAgICBsb3dlckJvdW5kVmlzaWJpbGl0eTogT2JqZWN0KTogYW55IHtcbiAgICB2YXIgaW5qOiBJbmplY3RvciA9IHRoaXM7XG5cbiAgICBpZiAobG93ZXJCb3VuZFZpc2liaWxpdHkgaW5zdGFuY2VvZiBTa2lwU2VsZk1ldGFkYXRhKSB7XG4gICAgICBwcm92aWRlclZpc2liaWxpdHkgPSBpbmouX2lzSG9zdEJvdW5kYXJ5ID8gVmlzaWJpbGl0eS5QdWJsaWNBbmRQcml2YXRlIDogVmlzaWJpbGl0eS5QdWJsaWM7XG4gICAgICBpbmogPSBpbmouX3BhcmVudDtcbiAgICB9XG5cbiAgICB3aGlsZSAoaW5qICE9IG51bGwpIHtcbiAgICAgIHZhciBvYmogPSBpbmouX3N0cmF0ZWd5LmdldE9iakJ5S2V5SWQoa2V5LmlkLCBwcm92aWRlclZpc2liaWxpdHkpO1xuICAgICAgaWYgKG9iaiAhPT0gVU5ERUZJTkVEKSByZXR1cm4gb2JqO1xuXG4gICAgICBwcm92aWRlclZpc2liaWxpdHkgPSBpbmouX2lzSG9zdEJvdW5kYXJ5ID8gVmlzaWJpbGl0eS5QdWJsaWNBbmRQcml2YXRlIDogVmlzaWJpbGl0eS5QdWJsaWM7XG4gICAgICBpbmogPSBpbmouX3BhcmVudDtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5fdGhyb3dPck51bGwoa2V5LCBvcHRpb25hbCk7XG4gIH1cblxuICBnZXQgZGlzcGxheU5hbWUoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gYEluamVjdG9yKHByb3ZpZGVyczogWyR7X21hcFByb3ZpZGVycyh0aGlzLCAoYjogUmVzb2x2ZWRQcm92aWRlcikgPT4gYCBcIiR7Yi5rZXkuZGlzcGxheU5hbWV9XCIgYCkuam9pbihcIiwgXCIpfV0pYDtcbiAgfVxuXG4gIHRvU3RyaW5nKCk6IHN0cmluZyB7IHJldHVybiB0aGlzLmRpc3BsYXlOYW1lOyB9XG59XG5cbnZhciBJTkpFQ1RPUl9LRVkgPSBLZXkuZ2V0KEluamVjdG9yKTtcblxuXG5mdW5jdGlvbiBfbWFwUHJvdmlkZXJzKGluamVjdG9yOiBJbmplY3RvciwgZm46IEZ1bmN0aW9uKTogYW55W10ge1xuICB2YXIgcmVzID0gW107XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgaW5qZWN0b3IuX3Byb3RvLm51bWJlck9mUHJvdmlkZXJzOyArK2kpIHtcbiAgICByZXMucHVzaChmbihpbmplY3Rvci5fcHJvdG8uZ2V0UHJvdmlkZXJBdEluZGV4KGkpKSk7XG4gIH1cbiAgcmV0dXJuIHJlcztcbn1cbiJdfQ==