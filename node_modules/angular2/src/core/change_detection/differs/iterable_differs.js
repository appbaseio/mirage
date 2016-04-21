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
var lang_1 = require('angular2/src/facade/lang');
var exceptions_1 = require('angular2/src/facade/exceptions');
var collection_1 = require('angular2/src/facade/collection');
var di_1 = require('angular2/src/core/di');
/**
 * A repository of different iterable diffing strategies used by NgFor, NgClass, and others.
 */
var IterableDiffers = (function () {
    function IterableDiffers(factories) {
        this.factories = factories;
    }
    IterableDiffers.create = function (factories, parent) {
        if (lang_1.isPresent(parent)) {
            var copied = collection_1.ListWrapper.clone(parent.factories);
            factories = factories.concat(copied);
            return new IterableDiffers(factories);
        }
        else {
            return new IterableDiffers(factories);
        }
    };
    /**
     * Takes an array of {@link IterableDifferFactory} and returns a provider used to extend the
     * inherited {@link IterableDiffers} instance with the provided factories and return a new
     * {@link IterableDiffers} instance.
     *
     * The following example shows how to extend an existing list of factories,
           * which will only be applied to the injector for this component and its children.
           * This step is all that's required to make a new {@link IterableDiffer} available.
     *
     * ### Example
     *
     * ```
     * @Component({
     *   viewProviders: [
     *     IterableDiffers.extend([new ImmutableListDiffer()])
     *   ]
     * })
     * ```
     */
    IterableDiffers.extend = function (factories) {
        return new di_1.Provider(IterableDiffers, {
            useFactory: function (parent) {
                if (lang_1.isBlank(parent)) {
                    // Typically would occur when calling IterableDiffers.extend inside of dependencies passed
                    // to
                    // bootstrap(), which would override default pipes instead of extending them.
                    throw new exceptions_1.BaseException('Cannot extend IterableDiffers without a parent injector');
                }
                return IterableDiffers.create(factories, parent);
            },
            // Dependency technically isn't optional, but we can provide a better error message this way.
            deps: [[IterableDiffers, new di_1.SkipSelfMetadata(), new di_1.OptionalMetadata()]]
        });
    };
    IterableDiffers.prototype.find = function (iterable) {
        var factory = this.factories.find(function (f) { return f.supports(iterable); });
        if (lang_1.isPresent(factory)) {
            return factory;
        }
        else {
            throw new exceptions_1.BaseException("Cannot find a differ supporting object '" + iterable + "' of type '" + lang_1.getTypeNameForDebugging(iterable) + "'");
        }
    };
    IterableDiffers = __decorate([
        lang_1.CONST(), 
        __metadata('design:paramtypes', [Array])
    ], IterableDiffers);
    return IterableDiffers;
}());
exports.IterableDiffers = IterableDiffers;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaXRlcmFibGVfZGlmZmVycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRpZmZpbmdfcGx1Z2luX3dyYXBwZXItb3V0cHV0X3BhdGgtamFrWG5NbUwudG1wL2FuZ3VsYXIyL3NyYy9jb3JlL2NoYW5nZV9kZXRlY3Rpb24vZGlmZmVycy9pdGVyYWJsZV9kaWZmZXJzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQSxxQkFBaUUsMEJBQTBCLENBQUMsQ0FBQTtBQUM1RiwyQkFBNEIsZ0NBQWdDLENBQUMsQ0FBQTtBQUM3RCwyQkFBMEIsZ0NBQWdDLENBQUMsQ0FBQTtBQUUzRCxtQkFBdUUsc0JBQXNCLENBQUMsQ0FBQTtBQTBCOUY7O0dBRUc7QUFFSDtJQUNFLHlCQUFtQixTQUFrQztRQUFsQyxjQUFTLEdBQVQsU0FBUyxDQUF5QjtJQUFHLENBQUM7SUFFbEQsc0JBQU0sR0FBYixVQUFjLFNBQWtDLEVBQUUsTUFBd0I7UUFDeEUsRUFBRSxDQUFDLENBQUMsZ0JBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDdEIsSUFBSSxNQUFNLEdBQUcsd0JBQVcsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQ2pELFNBQVMsR0FBRyxTQUFTLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ3JDLE1BQU0sQ0FBQyxJQUFJLGVBQWUsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUN4QyxDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDTixNQUFNLENBQUMsSUFBSSxlQUFlLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDeEMsQ0FBQztJQUNILENBQUM7SUFFRDs7Ozs7Ozs7Ozs7Ozs7Ozs7O09Ba0JHO0lBQ0ksc0JBQU0sR0FBYixVQUFjLFNBQWtDO1FBQzlDLE1BQU0sQ0FBQyxJQUFJLGFBQVEsQ0FBQyxlQUFlLEVBQUU7WUFDbkMsVUFBVSxFQUFFLFVBQUMsTUFBdUI7Z0JBQ2xDLEVBQUUsQ0FBQyxDQUFDLGNBQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ3BCLDBGQUEwRjtvQkFDMUYsS0FBSztvQkFDTCw2RUFBNkU7b0JBQzdFLE1BQU0sSUFBSSwwQkFBYSxDQUFDLHlEQUF5RCxDQUFDLENBQUM7Z0JBQ3JGLENBQUM7Z0JBQ0QsTUFBTSxDQUFDLGVBQWUsQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1lBQ25ELENBQUM7WUFDRCw2RkFBNkY7WUFDN0YsSUFBSSxFQUFFLENBQUMsQ0FBQyxlQUFlLEVBQUUsSUFBSSxxQkFBZ0IsRUFBRSxFQUFFLElBQUkscUJBQWdCLEVBQUUsQ0FBQyxDQUFDO1NBQzFFLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRCw4QkFBSSxHQUFKLFVBQUssUUFBYTtRQUNoQixJQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxVQUFBLENBQUMsSUFBSSxPQUFBLENBQUMsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLEVBQXBCLENBQW9CLENBQUMsQ0FBQztRQUM3RCxFQUFFLENBQUMsQ0FBQyxnQkFBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN2QixNQUFNLENBQUMsT0FBTyxDQUFDO1FBQ2pCLENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNOLE1BQU0sSUFBSSwwQkFBYSxDQUNuQiw2Q0FBMkMsUUFBUSxtQkFBYyw4QkFBdUIsQ0FBQyxRQUFRLENBQUMsTUFBRyxDQUFDLENBQUM7UUFDN0csQ0FBQztJQUNILENBQUM7SUF6REg7UUFBQyxZQUFLLEVBQUU7O3VCQUFBO0lBMERSLHNCQUFDO0FBQUQsQ0FBQyxBQXpERCxJQXlEQztBQXpEWSx1QkFBZSxrQkF5RDNCLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge2lzQmxhbmssIGlzUHJlc2VudCwgQ09OU1QsIGdldFR5cGVOYW1lRm9yRGVidWdnaW5nfSBmcm9tICdhbmd1bGFyMi9zcmMvZmFjYWRlL2xhbmcnO1xuaW1wb3J0IHtCYXNlRXhjZXB0aW9ufSBmcm9tICdhbmd1bGFyMi9zcmMvZmFjYWRlL2V4Y2VwdGlvbnMnO1xuaW1wb3J0IHtMaXN0V3JhcHBlcn0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9jb2xsZWN0aW9uJztcbmltcG9ydCB7Q2hhbmdlRGV0ZWN0b3JSZWZ9IGZyb20gJy4uL2NoYW5nZV9kZXRlY3Rvcl9yZWYnO1xuaW1wb3J0IHtQcm92aWRlciwgU2tpcFNlbGZNZXRhZGF0YSwgT3B0aW9uYWxNZXRhZGF0YSwgSW5qZWN0YWJsZX0gZnJvbSAnYW5ndWxhcjIvc3JjL2NvcmUvZGknO1xuXG4vKipcbiAqIEEgc3RyYXRlZ3kgZm9yIHRyYWNraW5nIGNoYW5nZXMgb3ZlciB0aW1lIHRvIGFuIGl0ZXJhYmxlLiBVc2VkIGZvciB7QGxpbmsgTmdGb3J9IHRvXG4gKiByZXNwb25kIHRvIGNoYW5nZXMgaW4gYW4gaXRlcmFibGUgYnkgZWZmZWN0aW5nIGVxdWl2YWxlbnQgY2hhbmdlcyBpbiB0aGUgRE9NLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIEl0ZXJhYmxlRGlmZmVyIHtcbiAgZGlmZihvYmplY3Q6IGFueSk6IGFueTtcbiAgb25EZXN0cm95KCk7XG59XG5cbi8qKlxuICAqIEFuIG9wdGlvbmFsIGZ1bmN0aW9uIHBhc3NlZCBpbnRvIHtAbGluayBOZ0Zvcn0gdGhhdCBkZWZpbmVzIGhvdyB0byB0cmFja1xuICAqIGl0ZW1zIGluIGFuIGl0ZXJhYmxlIChlLmcuIGJ5IGluZGV4IG9yIGlkKVxuICovXG5leHBvcnQgaW50ZXJmYWNlIFRyYWNrQnlGbiB7IChpbmRleDogbnVtYmVyLCBpdGVtOiBhbnkpOiBhbnk7IH1cblxuXG4vKipcbiAqIFByb3ZpZGVzIGEgZmFjdG9yeSBmb3Ige0BsaW5rIEl0ZXJhYmxlRGlmZmVyfS5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBJdGVyYWJsZURpZmZlckZhY3Rvcnkge1xuICBzdXBwb3J0cyhvYmplY3RzOiBhbnkpOiBib29sZWFuO1xuICBjcmVhdGUoY2RSZWY6IENoYW5nZURldGVjdG9yUmVmLCB0cmFja0J5Rm4/OiBUcmFja0J5Rm4pOiBJdGVyYWJsZURpZmZlcjtcbn1cblxuLyoqXG4gKiBBIHJlcG9zaXRvcnkgb2YgZGlmZmVyZW50IGl0ZXJhYmxlIGRpZmZpbmcgc3RyYXRlZ2llcyB1c2VkIGJ5IE5nRm9yLCBOZ0NsYXNzLCBhbmQgb3RoZXJzLlxuICovXG5AQ09OU1QoKVxuZXhwb3J0IGNsYXNzIEl0ZXJhYmxlRGlmZmVycyB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBmYWN0b3JpZXM6IEl0ZXJhYmxlRGlmZmVyRmFjdG9yeVtdKSB7fVxuXG4gIHN0YXRpYyBjcmVhdGUoZmFjdG9yaWVzOiBJdGVyYWJsZURpZmZlckZhY3RvcnlbXSwgcGFyZW50PzogSXRlcmFibGVEaWZmZXJzKTogSXRlcmFibGVEaWZmZXJzIHtcbiAgICBpZiAoaXNQcmVzZW50KHBhcmVudCkpIHtcbiAgICAgIHZhciBjb3BpZWQgPSBMaXN0V3JhcHBlci5jbG9uZShwYXJlbnQuZmFjdG9yaWVzKTtcbiAgICAgIGZhY3RvcmllcyA9IGZhY3Rvcmllcy5jb25jYXQoY29waWVkKTtcbiAgICAgIHJldHVybiBuZXcgSXRlcmFibGVEaWZmZXJzKGZhY3Rvcmllcyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBuZXcgSXRlcmFibGVEaWZmZXJzKGZhY3Rvcmllcyk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFRha2VzIGFuIGFycmF5IG9mIHtAbGluayBJdGVyYWJsZURpZmZlckZhY3Rvcnl9IGFuZCByZXR1cm5zIGEgcHJvdmlkZXIgdXNlZCB0byBleHRlbmQgdGhlXG4gICAqIGluaGVyaXRlZCB7QGxpbmsgSXRlcmFibGVEaWZmZXJzfSBpbnN0YW5jZSB3aXRoIHRoZSBwcm92aWRlZCBmYWN0b3JpZXMgYW5kIHJldHVybiBhIG5ld1xuICAgKiB7QGxpbmsgSXRlcmFibGVEaWZmZXJzfSBpbnN0YW5jZS5cbiAgICpcbiAgICogVGhlIGZvbGxvd2luZyBleGFtcGxlIHNob3dzIGhvdyB0byBleHRlbmQgYW4gZXhpc3RpbmcgbGlzdCBvZiBmYWN0b3JpZXMsXG4gICAgICAgICAqIHdoaWNoIHdpbGwgb25seSBiZSBhcHBsaWVkIHRvIHRoZSBpbmplY3RvciBmb3IgdGhpcyBjb21wb25lbnQgYW5kIGl0cyBjaGlsZHJlbi5cbiAgICAgICAgICogVGhpcyBzdGVwIGlzIGFsbCB0aGF0J3MgcmVxdWlyZWQgdG8gbWFrZSBhIG5ldyB7QGxpbmsgSXRlcmFibGVEaWZmZXJ9IGF2YWlsYWJsZS5cbiAgICpcbiAgICogIyMjIEV4YW1wbGVcbiAgICpcbiAgICogYGBgXG4gICAqIEBDb21wb25lbnQoe1xuICAgKiAgIHZpZXdQcm92aWRlcnM6IFtcbiAgICogICAgIEl0ZXJhYmxlRGlmZmVycy5leHRlbmQoW25ldyBJbW11dGFibGVMaXN0RGlmZmVyKCldKVxuICAgKiAgIF1cbiAgICogfSlcbiAgICogYGBgXG4gICAqL1xuICBzdGF0aWMgZXh0ZW5kKGZhY3RvcmllczogSXRlcmFibGVEaWZmZXJGYWN0b3J5W10pOiBQcm92aWRlciB7XG4gICAgcmV0dXJuIG5ldyBQcm92aWRlcihJdGVyYWJsZURpZmZlcnMsIHtcbiAgICAgIHVzZUZhY3Rvcnk6IChwYXJlbnQ6IEl0ZXJhYmxlRGlmZmVycykgPT4ge1xuICAgICAgICBpZiAoaXNCbGFuayhwYXJlbnQpKSB7XG4gICAgICAgICAgLy8gVHlwaWNhbGx5IHdvdWxkIG9jY3VyIHdoZW4gY2FsbGluZyBJdGVyYWJsZURpZmZlcnMuZXh0ZW5kIGluc2lkZSBvZiBkZXBlbmRlbmNpZXMgcGFzc2VkXG4gICAgICAgICAgLy8gdG9cbiAgICAgICAgICAvLyBib290c3RyYXAoKSwgd2hpY2ggd291bGQgb3ZlcnJpZGUgZGVmYXVsdCBwaXBlcyBpbnN0ZWFkIG9mIGV4dGVuZGluZyB0aGVtLlxuICAgICAgICAgIHRocm93IG5ldyBCYXNlRXhjZXB0aW9uKCdDYW5ub3QgZXh0ZW5kIEl0ZXJhYmxlRGlmZmVycyB3aXRob3V0IGEgcGFyZW50IGluamVjdG9yJyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIEl0ZXJhYmxlRGlmZmVycy5jcmVhdGUoZmFjdG9yaWVzLCBwYXJlbnQpO1xuICAgICAgfSxcbiAgICAgIC8vIERlcGVuZGVuY3kgdGVjaG5pY2FsbHkgaXNuJ3Qgb3B0aW9uYWwsIGJ1dCB3ZSBjYW4gcHJvdmlkZSBhIGJldHRlciBlcnJvciBtZXNzYWdlIHRoaXMgd2F5LlxuICAgICAgZGVwczogW1tJdGVyYWJsZURpZmZlcnMsIG5ldyBTa2lwU2VsZk1ldGFkYXRhKCksIG5ldyBPcHRpb25hbE1ldGFkYXRhKCldXVxuICAgIH0pO1xuICB9XG5cbiAgZmluZChpdGVyYWJsZTogYW55KTogSXRlcmFibGVEaWZmZXJGYWN0b3J5IHtcbiAgICB2YXIgZmFjdG9yeSA9IHRoaXMuZmFjdG9yaWVzLmZpbmQoZiA9PiBmLnN1cHBvcnRzKGl0ZXJhYmxlKSk7XG4gICAgaWYgKGlzUHJlc2VudChmYWN0b3J5KSkge1xuICAgICAgcmV0dXJuIGZhY3Rvcnk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBCYXNlRXhjZXB0aW9uKFxuICAgICAgICAgIGBDYW5ub3QgZmluZCBhIGRpZmZlciBzdXBwb3J0aW5nIG9iamVjdCAnJHtpdGVyYWJsZX0nIG9mIHR5cGUgJyR7Z2V0VHlwZU5hbWVGb3JEZWJ1Z2dpbmcoaXRlcmFibGUpfSdgKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==