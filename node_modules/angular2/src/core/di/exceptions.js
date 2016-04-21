'use strict';"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var collection_1 = require('angular2/src/facade/collection');
var lang_1 = require('angular2/src/facade/lang');
var exceptions_1 = require('angular2/src/facade/exceptions');
function findFirstClosedCycle(keys) {
    var res = [];
    for (var i = 0; i < keys.length; ++i) {
        if (collection_1.ListWrapper.contains(res, keys[i])) {
            res.push(keys[i]);
            return res;
        }
        else {
            res.push(keys[i]);
        }
    }
    return res;
}
function constructResolvingPath(keys) {
    if (keys.length > 1) {
        var reversed = findFirstClosedCycle(collection_1.ListWrapper.reversed(keys));
        var tokenStrs = reversed.map(function (k) { return lang_1.stringify(k.token); });
        return " (" + tokenStrs.join(' -> ') + ")";
    }
    else {
        return "";
    }
}
/**
 * Base class for all errors arising from misconfigured providers.
 */
var AbstractProviderError = (function (_super) {
    __extends(AbstractProviderError, _super);
    function AbstractProviderError(injector, key, constructResolvingMessage) {
        _super.call(this, "DI Exception");
        this.keys = [key];
        this.injectors = [injector];
        this.constructResolvingMessage = constructResolvingMessage;
        this.message = this.constructResolvingMessage(this.keys);
    }
    AbstractProviderError.prototype.addKey = function (injector, key) {
        this.injectors.push(injector);
        this.keys.push(key);
        this.message = this.constructResolvingMessage(this.keys);
    };
    Object.defineProperty(AbstractProviderError.prototype, "context", {
        get: function () { return this.injectors[this.injectors.length - 1].debugContext(); },
        enumerable: true,
        configurable: true
    });
    return AbstractProviderError;
}(exceptions_1.BaseException));
exports.AbstractProviderError = AbstractProviderError;
/**
 * Thrown when trying to retrieve a dependency by `Key` from {@link Injector}, but the
 * {@link Injector} does not have a {@link Provider} for {@link Key}.
 *
 * ### Example ([live demo](http://plnkr.co/edit/vq8D3FRB9aGbnWJqtEPE?p=preview))
 *
 * ```typescript
 * class A {
 *   constructor(b:B) {}
 * }
 *
 * expect(() => Injector.resolveAndCreate([A])).toThrowError();
 * ```
 */
var NoProviderError = (function (_super) {
    __extends(NoProviderError, _super);
    function NoProviderError(injector, key) {
        _super.call(this, injector, key, function (keys) {
            var first = lang_1.stringify(collection_1.ListWrapper.first(keys).token);
            return "No provider for " + first + "!" + constructResolvingPath(keys);
        });
    }
    return NoProviderError;
}(AbstractProviderError));
exports.NoProviderError = NoProviderError;
/**
 * Thrown when dependencies form a cycle.
 *
 * ### Example ([live demo](http://plnkr.co/edit/wYQdNos0Tzql3ei1EV9j?p=info))
 *
 * ```typescript
 * var injector = Injector.resolveAndCreate([
 *   provide("one", {useFactory: (two) => "two", deps: [[new Inject("two")]]}),
 *   provide("two", {useFactory: (one) => "one", deps: [[new Inject("one")]]})
 * ]);
 *
 * expect(() => injector.get("one")).toThrowError();
 * ```
 *
 * Retrieving `A` or `B` throws a `CyclicDependencyError` as the graph above cannot be constructed.
 */
var CyclicDependencyError = (function (_super) {
    __extends(CyclicDependencyError, _super);
    function CyclicDependencyError(injector, key) {
        _super.call(this, injector, key, function (keys) {
            return "Cannot instantiate cyclic dependency!" + constructResolvingPath(keys);
        });
    }
    return CyclicDependencyError;
}(AbstractProviderError));
exports.CyclicDependencyError = CyclicDependencyError;
/**
 * Thrown when a constructing type returns with an Error.
 *
 * The `InstantiationError` class contains the original error plus the dependency graph which caused
 * this object to be instantiated.
 *
 * ### Example ([live demo](http://plnkr.co/edit/7aWYdcqTQsP0eNqEdUAf?p=preview))
 *
 * ```typescript
 * class A {
 *   constructor() {
 *     throw new Error('message');
 *   }
 * }
 *
 * var injector = Injector.resolveAndCreate([A]);

 * try {
 *   injector.get(A);
 * } catch (e) {
 *   expect(e instanceof InstantiationError).toBe(true);
 *   expect(e.originalException.message).toEqual("message");
 *   expect(e.originalStack).toBeDefined();
 * }
 * ```
 */
var InstantiationError = (function (_super) {
    __extends(InstantiationError, _super);
    function InstantiationError(injector, originalException, originalStack, key) {
        _super.call(this, "DI Exception", originalException, originalStack, null);
        this.keys = [key];
        this.injectors = [injector];
    }
    InstantiationError.prototype.addKey = function (injector, key) {
        this.injectors.push(injector);
        this.keys.push(key);
    };
    Object.defineProperty(InstantiationError.prototype, "wrapperMessage", {
        get: function () {
            var first = lang_1.stringify(collection_1.ListWrapper.first(this.keys).token);
            return "Error during instantiation of " + first + "!" + constructResolvingPath(this.keys) + ".";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InstantiationError.prototype, "causeKey", {
        get: function () { return this.keys[0]; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InstantiationError.prototype, "context", {
        get: function () { return this.injectors[this.injectors.length - 1].debugContext(); },
        enumerable: true,
        configurable: true
    });
    return InstantiationError;
}(exceptions_1.WrappedException));
exports.InstantiationError = InstantiationError;
/**
 * Thrown when an object other then {@link Provider} (or `Type`) is passed to {@link Injector}
 * creation.
 *
 * ### Example ([live demo](http://plnkr.co/edit/YatCFbPAMCL0JSSQ4mvH?p=preview))
 *
 * ```typescript
 * expect(() => Injector.resolveAndCreate(["not a type"])).toThrowError();
 * ```
 */
var InvalidProviderError = (function (_super) {
    __extends(InvalidProviderError, _super);
    function InvalidProviderError(provider) {
        _super.call(this, "Invalid provider - only instances of Provider and Type are allowed, got: " +
            provider.toString());
    }
    return InvalidProviderError;
}(exceptions_1.BaseException));
exports.InvalidProviderError = InvalidProviderError;
/**
 * Thrown when the class has no annotation information.
 *
 * Lack of annotation information prevents the {@link Injector} from determining which dependencies
 * need to be injected into the constructor.
 *
 * ### Example ([live demo](http://plnkr.co/edit/rHnZtlNS7vJOPQ6pcVkm?p=preview))
 *
 * ```typescript
 * class A {
 *   constructor(b) {}
 * }
 *
 * expect(() => Injector.resolveAndCreate([A])).toThrowError();
 * ```
 *
 * This error is also thrown when the class not marked with {@link Injectable} has parameter types.
 *
 * ```typescript
 * class B {}
 *
 * class A {
 *   constructor(b:B) {} // no information about the parameter types of A is available at runtime.
 * }
 *
 * expect(() => Injector.resolveAndCreate([A,B])).toThrowError();
 * ```
 */
var NoAnnotationError = (function (_super) {
    __extends(NoAnnotationError, _super);
    function NoAnnotationError(typeOrFunc, params) {
        _super.call(this, NoAnnotationError._genMessage(typeOrFunc, params));
    }
    NoAnnotationError._genMessage = function (typeOrFunc, params) {
        var signature = [];
        for (var i = 0, ii = params.length; i < ii; i++) {
            var parameter = params[i];
            if (lang_1.isBlank(parameter) || parameter.length == 0) {
                signature.push('?');
            }
            else {
                signature.push(parameter.map(lang_1.stringify).join(' '));
            }
        }
        return "Cannot resolve all parameters for '" + lang_1.stringify(typeOrFunc) + "'(" +
            signature.join(', ') + "). " +
            "Make sure that all the parameters are decorated with Inject or have valid type annotations and that '" +
            lang_1.stringify(typeOrFunc) + "' is decorated with Injectable.";
    };
    return NoAnnotationError;
}(exceptions_1.BaseException));
exports.NoAnnotationError = NoAnnotationError;
/**
 * Thrown when getting an object by index.
 *
 * ### Example ([live demo](http://plnkr.co/edit/bRs0SX2OTQiJzqvjgl8P?p=preview))
 *
 * ```typescript
 * class A {}
 *
 * var injector = Injector.resolveAndCreate([A]);
 *
 * expect(() => injector.getAt(100)).toThrowError();
 * ```
 */
var OutOfBoundsError = (function (_super) {
    __extends(OutOfBoundsError, _super);
    function OutOfBoundsError(index) {
        _super.call(this, "Index " + index + " is out-of-bounds.");
    }
    return OutOfBoundsError;
}(exceptions_1.BaseException));
exports.OutOfBoundsError = OutOfBoundsError;
// TODO: add a working example after alpha38 is released
/**
 * Thrown when a multi provider and a regular provider are bound to the same token.
 *
 * ### Example
 *
 * ```typescript
 * expect(() => Injector.resolveAndCreate([
 *   new Provider("Strings", {useValue: "string1", multi: true}),
 *   new Provider("Strings", {useValue: "string2", multi: false})
 * ])).toThrowError();
 * ```
 */
var MixingMultiProvidersWithRegularProvidersError = (function (_super) {
    __extends(MixingMultiProvidersWithRegularProvidersError, _super);
    function MixingMultiProvidersWithRegularProvidersError(provider1, provider2) {
        _super.call(this, "Cannot mix multi providers and regular providers, got: " + provider1.toString() + " " +
            provider2.toString());
    }
    return MixingMultiProvidersWithRegularProvidersError;
}(exceptions_1.BaseException));
exports.MixingMultiProvidersWithRegularProvidersError = MixingMultiProvidersWithRegularProvidersError;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhjZXB0aW9ucy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRpZmZpbmdfcGx1Z2luX3dyYXBwZXItb3V0cHV0X3BhdGgtamFrWG5NbUwudG1wL2FuZ3VsYXIyL3NyYy9jb3JlL2RpL2V4Y2VwdGlvbnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsMkJBQTBCLGdDQUFnQyxDQUFDLENBQUE7QUFDM0QscUJBQWlDLDBCQUEwQixDQUFDLENBQUE7QUFDNUQsMkJBQTZELGdDQUFnQyxDQUFDLENBQUE7QUFJOUYsOEJBQThCLElBQVc7SUFDdkMsSUFBSSxHQUFHLEdBQUcsRUFBRSxDQUFDO0lBQ2IsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUM7UUFDckMsRUFBRSxDQUFDLENBQUMsd0JBQVcsQ0FBQyxRQUFRLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN2QyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2xCLE1BQU0sQ0FBQyxHQUFHLENBQUM7UUFDYixDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDTixHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3BCLENBQUM7SUFDSCxDQUFDO0lBQ0QsTUFBTSxDQUFDLEdBQUcsQ0FBQztBQUNiLENBQUM7QUFFRCxnQ0FBZ0MsSUFBVztJQUN6QyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDcEIsSUFBSSxRQUFRLEdBQUcsb0JBQW9CLENBQUMsd0JBQVcsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUNoRSxJQUFJLFNBQVMsR0FBRyxR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QixDQUFBO0FBRUQ7Ozs7Ozs7Ozs7OztHQVlHO0FBQ0g7SUFBc0Msb0NBQWE7SUFDakQsMEJBQVksS0FBSztRQUFJLGtCQUFNLFdBQVMsS0FBSyx1QkFBb0IsQ0FBQyxDQUFDO0lBQUMsQ0FBQztJQUNuRSx1QkFBQztBQUFELENBQUMsQUFGRCxDQUFzQywwQkFBYSxHQUVsRDtBQUZZLHdCQUFnQixtQkFFNUIsQ0FBQTtBQUVELHdEQUF3RDtBQUN4RDs7Ozs7Ozs7Ozs7R0FXRztBQUNIO0lBQW1FLGlFQUFhO0lBQzlFLHVEQUFZLFNBQVMsRUFBRSxTQUFTO1FBQzlCLGtCQUFNLHlEQUF5RCxHQUFHLFNBQVMsQ0FBQyxRQUFRLEVBQUUsR0FBRyxHQUFHO1lBQ3RGLFNBQVMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO0lBQzlCLENBQUM7SUFDSCxvREFBQztBQUFELENBQUMsQUFMRCxDQUFtRSwwQkFBYSxHQUsvRTtBQUxZLHFEQUE2QyxnREFLekQsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7TGlzdFdyYXBwZXJ9IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvY29sbGVjdGlvbic7XG5pbXBvcnQge3N0cmluZ2lmeSwgaXNCbGFua30gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9sYW5nJztcbmltcG9ydCB7QmFzZUV4Y2VwdGlvbiwgV3JhcHBlZEV4Y2VwdGlvbiwgdW5pbXBsZW1lbnRlZH0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9leGNlcHRpb25zJztcbmltcG9ydCB7S2V5fSBmcm9tICcuL2tleSc7XG5pbXBvcnQge0luamVjdG9yfSBmcm9tICcuL2luamVjdG9yJztcblxuZnVuY3Rpb24gZmluZEZpcnN0Q2xvc2VkQ3ljbGUoa2V5czogYW55W10pOiBhbnlbXSB7XG4gIHZhciByZXMgPSBbXTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBrZXlzLmxlbmd0aDsgKytpKSB7XG4gICAgaWYgKExpc3RXcmFwcGVyLmNvbnRhaW5zKHJlcywga2V5c1tpXSkpIHtcbiAgICAgIHJlcy5wdXNoKGtleXNbaV0pO1xuICAgICAgcmV0dXJuIHJlcztcbiAgICB9IGVsc2Uge1xuICAgICAgcmVzLnB1c2goa2V5c1tpXSk7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXM7XG59XG5cbmZ1bmN0aW9uIGNvbnN0cnVjdFJlc29sdmluZ1BhdGgoa2V5czogYW55W10pOiBzdHJpbmcge1xuICBpZiAoa2V5cy5sZW5ndGggPiAxKSB7XG4gICAgdmFyIHJldmVyc2VkID0gZmluZEZpcnN0Q2xvc2VkQ3ljbGUoTGlzdFdyYXBwZXIucmV2ZXJzZWQoa2V5cykpO1xuICAgIHZhciB0b2tlblN0cnMgPSByZXZlcnNlZC5tYXAoayA9PiBzdHJpbmdpZnkoay50b2tlbikpO1xuICAgIHJldHVybiBcIiAoXCIgKyB0b2tlblN0cnMuam9pbignIC0+ICcpICsgXCIpXCI7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIFwiXCI7XG4gIH1cbn1cblxuXG4vKipcbiAqIEJhc2UgY2xhc3MgZm9yIGFsbCBlcnJvcnMgYXJpc2luZyBmcm9tIG1pc2NvbmZpZ3VyZWQgcHJvdmlkZXJzLlxuICovXG5leHBvcnQgY2xhc3MgQWJzdHJhY3RQcm92aWRlckVycm9yIGV4dGVuZHMgQmFzZUV4Y2VwdGlvbiB7XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgbWVzc2FnZTogc3RyaW5nO1xuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAga2V5czogS2V5W107XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBpbmplY3RvcnM6IEluamVjdG9yW107XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBjb25zdHJ1Y3RSZXNvbHZpbmdNZXNzYWdlOiBGdW5jdGlvbjtcblxuICBjb25zdHJ1Y3RvcihpbmplY3RvcjogSW5qZWN0b3IsIGtleTogS2V5LCBjb25zdHJ1Y3RSZXNvbHZpbmdNZXNzYWdlOiBGdW5jdGlvbikge1xuICAgIHN1cGVyKFwiREkgRXhjZXB0aW9uXCIpO1xuICAgIHRoaXMua2V5cyA9IFtrZXldO1xuICAgIHRoaXMuaW5qZWN0b3JzID0gW2luamVjdG9yXTtcbiAgICB0aGlzLmNvbnN0cnVjdFJlc29sdmluZ01lc3NhZ2UgPSBjb25zdHJ1Y3RSZXNvbHZpbmdNZXNzYWdlO1xuICAgIHRoaXMubWVzc2FnZSA9IHRoaXMuY29uc3RydWN0UmVzb2x2aW5nTWVzc2FnZSh0aGlzLmtleXMpO1xuICB9XG5cbiAgYWRkS2V5KGluamVjdG9yOiBJbmplY3Rvciwga2V5OiBLZXkpOiB2b2lkIHtcbiAgICB0aGlzLmluamVjdG9ycy5wdXNoKGluamVjdG9yKTtcbiAgICB0aGlzLmtleXMucHVzaChrZXkpO1xuICAgIHRoaXMubWVzc2FnZSA9IHRoaXMuY29uc3RydWN0UmVzb2x2aW5nTWVzc2FnZSh0aGlzLmtleXMpO1xuICB9XG5cbiAgZ2V0IGNvbnRleHQoKSB7IHJldHVybiB0aGlzLmluamVjdG9yc1t0aGlzLmluamVjdG9ycy5sZW5ndGggLSAxXS5kZWJ1Z0NvbnRleHQoKTsgfVxufVxuXG4vKipcbiAqIFRocm93biB3aGVuIHRyeWluZyB0byByZXRyaWV2ZSBhIGRlcGVuZGVuY3kgYnkgYEtleWAgZnJvbSB7QGxpbmsgSW5qZWN0b3J9LCBidXQgdGhlXG4gKiB7QGxpbmsgSW5qZWN0b3J9IGRvZXMgbm90IGhhdmUgYSB7QGxpbmsgUHJvdmlkZXJ9IGZvciB7QGxpbmsgS2V5fS5cbiAqXG4gKiAjIyMgRXhhbXBsZSAoW2xpdmUgZGVtb10oaHR0cDovL3BsbmtyLmNvL2VkaXQvdnE4RDNGUkI5YUdibldKcXRFUEU/cD1wcmV2aWV3KSlcbiAqXG4gKiBgYGB0eXBlc2NyaXB0XG4gKiBjbGFzcyBBIHtcbiAqICAgY29uc3RydWN0b3IoYjpCKSB7fVxuICogfVxuICpcbiAqIGV4cGVjdCgoKSA9PiBJbmplY3Rvci5yZXNvbHZlQW5kQ3JlYXRlKFtBXSkpLnRvVGhyb3dFcnJvcigpO1xuICogYGBgXG4gKi9cbmV4cG9ydCBjbGFzcyBOb1Byb3ZpZGVyRXJyb3IgZXh0ZW5kcyBBYnN0cmFjdFByb3ZpZGVyRXJyb3Ige1xuICBjb25zdHJ1Y3RvcihpbmplY3RvcjogSW5qZWN0b3IsIGtleTogS2V5KSB7XG4gICAgc3VwZXIoaW5qZWN0b3IsIGtleSwgZnVuY3Rpb24oa2V5czogYW55W10pIHtcbiAgICAgIHZhciBmaXJzdCA9IHN0cmluZ2lmeShMaXN0V3JhcHBlci5maXJzdChrZXlzKS50b2tlbik7XG4gICAgICByZXR1cm4gYE5vIHByb3ZpZGVyIGZvciAke2ZpcnN0fSEke2NvbnN0cnVjdFJlc29sdmluZ1BhdGgoa2V5cyl9YDtcbiAgICB9KTtcbiAgfVxufVxuXG4vKipcbiAqIFRocm93biB3aGVuIGRlcGVuZGVuY2llcyBmb3JtIGEgY3ljbGUuXG4gKlxuICogIyMjIEV4YW1wbGUgKFtsaXZlIGRlbW9dKGh0dHA6Ly9wbG5rci5jby9lZGl0L3dZUWROb3MwVHpxbDNlaTFFVjlqP3A9aW5mbykpXG4gKlxuICogYGBgdHlwZXNjcmlwdFxuICogdmFyIGluamVjdG9yID0gSW5qZWN0b3IucmVzb2x2ZUFuZENyZWF0ZShbXG4gKiAgIHByb3ZpZGUoXCJvbmVcIiwge3VzZUZhY3Rvcnk6ICh0d28pID0+IFwidHdvXCIsIGRlcHM6IFtbbmV3IEluamVjdChcInR3b1wiKV1dfSksXG4gKiAgIHByb3ZpZGUoXCJ0d29cIiwge3VzZUZhY3Rvcnk6IChvbmUpID0+IFwib25lXCIsIGRlcHM6IFtbbmV3IEluamVjdChcIm9uZVwiKV1dfSlcbiAqIF0pO1xuICpcbiAqIGV4cGVjdCgoKSA9PiBpbmplY3Rvci5nZXQoXCJvbmVcIikpLnRvVGhyb3dFcnJvcigpO1xuICogYGBgXG4gKlxuICogUmV0cmlldmluZyBgQWAgb3IgYEJgIHRocm93cyBhIGBDeWNsaWNEZXBlbmRlbmN5RXJyb3JgIGFzIHRoZSBncmFwaCBhYm92ZSBjYW5ub3QgYmUgY29uc3RydWN0ZWQuXG4gKi9cbmV4cG9ydCBjbGFzcyBDeWNsaWNEZXBlbmRlbmN5RXJyb3IgZXh0ZW5kcyBBYnN0cmFjdFByb3ZpZGVyRXJyb3Ige1xuICBjb25zdHJ1Y3RvcihpbmplY3RvcjogSW5qZWN0b3IsIGtleTogS2V5KSB7XG4gICAgc3VwZXIoaW5qZWN0b3IsIGtleSwgZnVuY3Rpb24oa2V5czogYW55W10pIHtcbiAgICAgIHJldHVybiBgQ2Fubm90IGluc3RhbnRpYXRlIGN5Y2xpYyBkZXBlbmRlbmN5ISR7Y29uc3RydWN0UmVzb2x2aW5nUGF0aChrZXlzKX1gO1xuICAgIH0pO1xuICB9XG59XG5cbi8qKlxuICogVGhyb3duIHdoZW4gYSBjb25zdHJ1Y3RpbmcgdHlwZSByZXR1cm5zIHdpdGggYW4gRXJyb3IuXG4gKlxuICogVGhlIGBJbnN0YW50aWF0aW9uRXJyb3JgIGNsYXNzIGNvbnRhaW5zIHRoZSBvcmlnaW5hbCBlcnJvciBwbHVzIHRoZSBkZXBlbmRlbmN5IGdyYXBoIHdoaWNoIGNhdXNlZFxuICogdGhpcyBvYmplY3QgdG8gYmUgaW5zdGFudGlhdGVkLlxuICpcbiAqICMjIyBFeGFtcGxlIChbbGl2ZSBkZW1vXShodHRwOi8vcGxua3IuY28vZWRpdC83YVdZZGNxVFFzUDBlTnFFZFVBZj9wPXByZXZpZXcpKVxuICpcbiAqIGBgYHR5cGVzY3JpcHRcbiAqIGNsYXNzIEEge1xuICogICBjb25zdHJ1Y3RvcigpIHtcbiAqICAgICB0aHJvdyBuZXcgRXJyb3IoJ21lc3NhZ2UnKTtcbiAqICAgfVxuICogfVxuICpcbiAqIHZhciBpbmplY3RvciA9IEluamVjdG9yLnJlc29sdmVBbmRDcmVhdGUoW0FdKTtcblxuICogdHJ5IHtcbiAqICAgaW5qZWN0b3IuZ2V0KEEpO1xuICogfSBjYXRjaCAoZSkge1xuICogICBleHBlY3QoZSBpbnN0YW5jZW9mIEluc3RhbnRpYXRpb25FcnJvcikudG9CZSh0cnVlKTtcbiAqICAgZXhwZWN0KGUub3JpZ2luYWxFeGNlcHRpb24ubWVzc2FnZSkudG9FcXVhbChcIm1lc3NhZ2VcIik7XG4gKiAgIGV4cGVjdChlLm9yaWdpbmFsU3RhY2spLnRvQmVEZWZpbmVkKCk7XG4gKiB9XG4gKiBgYGBcbiAqL1xuZXhwb3J0IGNsYXNzIEluc3RhbnRpYXRpb25FcnJvciBleHRlbmRzIFdyYXBwZWRFeGNlcHRpb24ge1xuICAvKiogQGludGVybmFsICovXG4gIGtleXM6IEtleVtdO1xuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgaW5qZWN0b3JzOiBJbmplY3RvcltdO1xuXG4gIGNvbnN0cnVjdG9yKGluamVjdG9yOiBJbmplY3Rvciwgb3JpZ2luYWxFeGNlcHRpb24sIG9yaWdpbmFsU3RhY2ssIGtleTogS2V5KSB7XG4gICAgc3VwZXIoXCJESSBFeGNlcHRpb25cIiwgb3JpZ2luYWxFeGNlcHRpb24sIG9yaWdpbmFsU3RhY2ssIG51bGwpO1xuICAgIHRoaXMua2V5cyA9IFtrZXldO1xuICAgIHRoaXMuaW5qZWN0b3JzID0gW2luamVjdG9yXTtcbiAgfVxuXG4gIGFkZEtleShpbmplY3RvcjogSW5qZWN0b3IsIGtleTogS2V5KTogdm9pZCB7XG4gICAgdGhpcy5pbmplY3RvcnMucHVzaChpbmplY3Rvcik7XG4gICAgdGhpcy5rZXlzLnB1c2goa2V5KTtcbiAgfVxuXG4gIGdldCB3cmFwcGVyTWVzc2FnZSgpOiBzdHJpbmcge1xuICAgIHZhciBmaXJzdCA9IHN0cmluZ2lmeShMaXN0V3JhcHBlci5maXJzdCh0aGlzLmtleXMpLnRva2VuKTtcbiAgICByZXR1cm4gYEVycm9yIGR1cmluZyBpbnN0YW50aWF0aW9uIG9mICR7Zmlyc3R9ISR7Y29uc3RydWN0UmVzb2x2aW5nUGF0aCh0aGlzLmtleXMpfS5gO1xuICB9XG5cbiAgZ2V0IGNhdXNlS2V5KCk6IEtleSB7IHJldHVybiB0aGlzLmtleXNbMF07IH1cblxuICBnZXQgY29udGV4dCgpIHsgcmV0dXJuIHRoaXMuaW5qZWN0b3JzW3RoaXMuaW5qZWN0b3JzLmxlbmd0aCAtIDFdLmRlYnVnQ29udGV4dCgpOyB9XG59XG5cbi8qKlxuICogVGhyb3duIHdoZW4gYW4gb2JqZWN0IG90aGVyIHRoZW4ge0BsaW5rIFByb3ZpZGVyfSAob3IgYFR5cGVgKSBpcyBwYXNzZWQgdG8ge0BsaW5rIEluamVjdG9yfVxuICogY3JlYXRpb24uXG4gKlxuICogIyMjIEV4YW1wbGUgKFtsaXZlIGRlbW9dKGh0dHA6Ly9wbG5rci5jby9lZGl0L1lhdENGYlBBTUNMMEpTU1E0bXZIP3A9cHJldmlldykpXG4gKlxuICogYGBgdHlwZXNjcmlwdFxuICogZXhwZWN0KCgpID0+IEluamVjdG9yLnJlc29sdmVBbmRDcmVhdGUoW1wibm90IGEgdHlwZVwiXSkpLnRvVGhyb3dFcnJvcigpO1xuICogYGBgXG4gKi9cbmV4cG9ydCBjbGFzcyBJbnZhbGlkUHJvdmlkZXJFcnJvciBleHRlbmRzIEJhc2VFeGNlcHRpb24ge1xuICBjb25zdHJ1Y3Rvcihwcm92aWRlcikge1xuICAgIHN1cGVyKFwiSW52YWxpZCBwcm92aWRlciAtIG9ubHkgaW5zdGFuY2VzIG9mIFByb3ZpZGVyIGFuZCBUeXBlIGFyZSBhbGxvd2VkLCBnb3Q6IFwiICtcbiAgICAgICAgICBwcm92aWRlci50b1N0cmluZygpKTtcbiAgfVxufVxuXG4vKipcbiAqIFRocm93biB3aGVuIHRoZSBjbGFzcyBoYXMgbm8gYW5ub3RhdGlvbiBpbmZvcm1hdGlvbi5cbiAqXG4gKiBMYWNrIG9mIGFubm90YXRpb24gaW5mb3JtYXRpb24gcHJldmVudHMgdGhlIHtAbGluayBJbmplY3Rvcn0gZnJvbSBkZXRlcm1pbmluZyB3aGljaCBkZXBlbmRlbmNpZXNcbiAqIG5lZWQgdG8gYmUgaW5qZWN0ZWQgaW50byB0aGUgY29uc3RydWN0b3IuXG4gKlxuICogIyMjIEV4YW1wbGUgKFtsaXZlIGRlbW9dKGh0dHA6Ly9wbG5rci5jby9lZGl0L3JIblp0bE5TN3ZKT1BRNnBjVmttP3A9cHJldmlldykpXG4gKlxuICogYGBgdHlwZXNjcmlwdFxuICogY2xhc3MgQSB7XG4gKiAgIGNvbnN0cnVjdG9yKGIpIHt9XG4gKiB9XG4gKlxuICogZXhwZWN0KCgpID0+IEluamVjdG9yLnJlc29sdmVBbmRDcmVhdGUoW0FdKSkudG9UaHJvd0Vycm9yKCk7XG4gKiBgYGBcbiAqXG4gKiBUaGlzIGVycm9yIGlzIGFsc28gdGhyb3duIHdoZW4gdGhlIGNsYXNzIG5vdCBtYXJrZWQgd2l0aCB7QGxpbmsgSW5qZWN0YWJsZX0gaGFzIHBhcmFtZXRlciB0eXBlcy5cbiAqXG4gKiBgYGB0eXBlc2NyaXB0XG4gKiBjbGFzcyBCIHt9XG4gKlxuICogY2xhc3MgQSB7XG4gKiAgIGNvbnN0cnVjdG9yKGI6Qikge30gLy8gbm8gaW5mb3JtYXRpb24gYWJvdXQgdGhlIHBhcmFtZXRlciB0eXBlcyBvZiBBIGlzIGF2YWlsYWJsZSBhdCBydW50aW1lLlxuICogfVxuICpcbiAqIGV4cGVjdCgoKSA9PiBJbmplY3Rvci5yZXNvbHZlQW5kQ3JlYXRlKFtBLEJdKSkudG9UaHJvd0Vycm9yKCk7XG4gKiBgYGBcbiAqL1xuZXhwb3J0IGNsYXNzIE5vQW5ub3RhdGlvbkVycm9yIGV4dGVuZHMgQmFzZUV4Y2VwdGlvbiB7XG4gIGNvbnN0cnVjdG9yKHR5cGVPckZ1bmMsIHBhcmFtczogYW55W11bXSkge1xuICAgIHN1cGVyKE5vQW5ub3RhdGlvbkVycm9yLl9nZW5NZXNzYWdlKHR5cGVPckZ1bmMsIHBhcmFtcykpO1xuICB9XG5cbiAgcHJpdmF0ZSBzdGF0aWMgX2dlbk1lc3NhZ2UodHlwZU9yRnVuYywgcGFyYW1zOiBhbnlbXVtdKSB7XG4gICAgdmFyIHNpZ25hdHVyZSA9IFtdO1xuICAgIGZvciAodmFyIGkgPSAwLCBpaSA9IHBhcmFtcy5sZW5ndGg7IGkgPCBpaTsgaSsrKSB7XG4gICAgICB2YXIgcGFyYW1ldGVyID0gcGFyYW1zW2ldO1xuICAgICAgaWYgKGlzQmxhbmsocGFyYW1ldGVyKSB8fCBwYXJhbWV0ZXIubGVuZ3RoID09IDApIHtcbiAgICAgICAgc2lnbmF0dXJlLnB1c2goJz8nKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNpZ25hdHVyZS5wdXNoKHBhcmFtZXRlci5tYXAoc3RyaW5naWZ5KS5qb2luKCcgJykpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gXCJDYW5ub3QgcmVzb2x2ZSBhbGwgcGFyYW1ldGVycyBmb3IgJ1wiICsgc3RyaW5naWZ5KHR5cGVPckZ1bmMpICsgXCInKFwiICtcbiAgICAgICAgICAgc2lnbmF0dXJlLmpvaW4oJywgJykgKyBcIikuIFwiICtcbiAgICAgICAgICAgXCJNYWtlIHN1cmUgdGhhdCBhbGwgdGhlIHBhcmFtZXRlcnMgYXJlIGRlY29yYXRlZCB3aXRoIEluamVjdCBvciBoYXZlIHZhbGlkIHR5cGUgYW5ub3RhdGlvbnMgYW5kIHRoYXQgJ1wiICtcbiAgICAgICAgICAgc3RyaW5naWZ5KHR5cGVPckZ1bmMpICsgXCInIGlzIGRlY29yYXRlZCB3aXRoIEluamVjdGFibGUuXCI7XG4gIH1cbn1cblxuLyoqXG4gKiBUaHJvd24gd2hlbiBnZXR0aW5nIGFuIG9iamVjdCBieSBpbmRleC5cbiAqXG4gKiAjIyMgRXhhbXBsZSAoW2xpdmUgZGVtb10oaHR0cDovL3BsbmtyLmNvL2VkaXQvYlJzMFNYMk9UUWlKenF2amdsOFA/cD1wcmV2aWV3KSlcbiAqXG4gKiBgYGB0eXBlc2NyaXB0XG4gKiBjbGFzcyBBIHt9XG4gKlxuICogdmFyIGluamVjdG9yID0gSW5qZWN0b3IucmVzb2x2ZUFuZENyZWF0ZShbQV0pO1xuICpcbiAqIGV4cGVjdCgoKSA9PiBpbmplY3Rvci5nZXRBdCgxMDApKS50b1Rocm93RXJyb3IoKTtcbiAqIGBgYFxuICovXG5leHBvcnQgY2xhc3MgT3V0T2ZCb3VuZHNFcnJvciBleHRlbmRzIEJhc2VFeGNlcHRpb24ge1xuICBjb25zdHJ1Y3RvcihpbmRleCkgeyBzdXBlcihgSW5kZXggJHtpbmRleH0gaXMgb3V0LW9mLWJvdW5kcy5gKTsgfVxufVxuXG4vLyBUT0RPOiBhZGQgYSB3b3JraW5nIGV4YW1wbGUgYWZ0ZXIgYWxwaGEzOCBpcyByZWxlYXNlZFxuLyoqXG4gKiBUaHJvd24gd2hlbiBhIG11bHRpIHByb3ZpZGVyIGFuZCBhIHJlZ3VsYXIgcHJvdmlkZXIgYXJlIGJvdW5kIHRvIHRoZSBzYW1lIHRva2VuLlxuICpcbiAqICMjIyBFeGFtcGxlXG4gKlxuICogYGBgdHlwZXNjcmlwdFxuICogZXhwZWN0KCgpID0+IEluamVjdG9yLnJlc29sdmVBbmRDcmVhdGUoW1xuICogICBuZXcgUHJvdmlkZXIoXCJTdHJpbmdzXCIsIHt1c2VWYWx1ZTogXCJzdHJpbmcxXCIsIG11bHRpOiB0cnVlfSksXG4gKiAgIG5ldyBQcm92aWRlcihcIlN0cmluZ3NcIiwge3VzZVZhbHVlOiBcInN0cmluZzJcIiwgbXVsdGk6IGZhbHNlfSlcbiAqIF0pKS50b1Rocm93RXJyb3IoKTtcbiAqIGBgYFxuICovXG5leHBvcnQgY2xhc3MgTWl4aW5nTXVsdGlQcm92aWRlcnNXaXRoUmVndWxhclByb3ZpZGVyc0Vycm9yIGV4dGVuZHMgQmFzZUV4Y2VwdGlvbiB7XG4gIGNvbnN0cnVjdG9yKHByb3ZpZGVyMSwgcHJvdmlkZXIyKSB7XG4gICAgc3VwZXIoXCJDYW5ub3QgbWl4IG11bHRpIHByb3ZpZGVycyBhbmQgcmVndWxhciBwcm92aWRlcnMsIGdvdDogXCIgKyBwcm92aWRlcjEudG9TdHJpbmcoKSArIFwiIFwiICtcbiAgICAgICAgICBwcm92aWRlcjIudG9TdHJpbmcoKSk7XG4gIH1cbn1cbiJdfQ==