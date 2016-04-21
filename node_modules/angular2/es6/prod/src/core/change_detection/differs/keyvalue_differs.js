var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { isBlank, isPresent, CONST } from 'angular2/src/facade/lang';
import { BaseException } from 'angular2/src/facade/exceptions';
import { ListWrapper } from 'angular2/src/facade/collection';
import { Provider, SkipSelfMetadata, OptionalMetadata } from 'angular2/src/core/di';
/**
 * A repository of different Map diffing strategies used by NgClass, NgStyle, and others.
 */
let KeyValueDiffers_1;
export let KeyValueDiffers = KeyValueDiffers_1 = class KeyValueDiffers {
    constructor(factories) {
        this.factories = factories;
    }
    static create(factories, parent) {
        if (isPresent(parent)) {
            var copied = ListWrapper.clone(parent.factories);
            factories = factories.concat(copied);
            return new KeyValueDiffers_1(factories);
        }
        else {
            return new KeyValueDiffers_1(factories);
        }
    }
    /**
     * Takes an array of {@link KeyValueDifferFactory} and returns a provider used to extend the
     * inherited {@link KeyValueDiffers} instance with the provided factories and return a new
     * {@link KeyValueDiffers} instance.
     *
     * The following example shows how to extend an existing list of factories,
           * which will only be applied to the injector for this component and its children.
           * This step is all that's required to make a new {@link KeyValueDiffer} available.
     *
     * ### Example
     *
     * ```
     * @Component({
     *   viewProviders: [
     *     KeyValueDiffers.extend([new ImmutableMapDiffer()])
     *   ]
     * })
     * ```
     */
    static extend(factories) {
        return new Provider(KeyValueDiffers_1, {
            useFactory: (parent) => {
                if (isBlank(parent)) {
                    // Typically would occur when calling KeyValueDiffers.extend inside of dependencies passed
                    // to
                    // bootstrap(), which would override default pipes instead of extending them.
                    throw new BaseException('Cannot extend KeyValueDiffers without a parent injector');
                }
                return KeyValueDiffers_1.create(factories, parent);
            },
            // Dependency technically isn't optional, but we can provide a better error message this way.
            deps: [[KeyValueDiffers_1, new SkipSelfMetadata(), new OptionalMetadata()]]
        });
    }
    find(kv) {
        var factory = this.factories.find(f => f.supports(kv));
        if (isPresent(factory)) {
            return factory;
        }
        else {
            throw new BaseException(`Cannot find a differ supporting object '${kv}'`);
        }
    }
};
KeyValueDiffers = KeyValueDiffers_1 = __decorate([
    CONST(), 
    __metadata('design:paramtypes', [Array])
], KeyValueDiffers);
