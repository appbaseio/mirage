var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { CONST, stringify, isString } from 'angular2/src/facade/lang';
import { resolveForwardRef } from 'angular2/src/core/di';
import { DependencyMetadata } from 'angular2/src/core/di/metadata';
/**
 * Specifies that a constant attribute value should be injected.
 *
 * The directive can inject constant string literals of host element attributes.
 *
 * ### Example
 *
 * Suppose we have an `<input>` element and want to know its `type`.
 *
 * ```html
 * <input type="text">
 * ```
 *
 * A decorator can inject string literal `text` like so:
 *
 * {@example core/ts/metadata/metadata.ts region='attributeMetadata'}
 */
export let AttributeMetadata = class AttributeMetadata extends DependencyMetadata {
    constructor(attributeName) {
        super();
        this.attributeName = attributeName;
    }
    get token() {
        // Normally one would default a token to a type of an injected value but here
        // the type of a variable is "string" and we can't use primitive type as a return value
        // so we use instance of Attribute instead. This doesn't matter much in practice as arguments
        // with @Attribute annotation are injected by ElementInjector that doesn't take tokens into
        // account.
        return this;
    }
    toString() { return `@Attribute(${stringify(this.attributeName)})`; }
};
AttributeMetadata = __decorate([
    CONST(), 
    __metadata('design:paramtypes', [String])
], AttributeMetadata);
/**
 * Declares an injectable parameter to be a live list of directives or variable
 * bindings from the content children of a directive.
 *
 * ### Example ([live demo](http://plnkr.co/edit/lY9m8HLy7z06vDoUaSN2?p=preview))
 *
 * Assume that `<tabs>` component would like to get a list its children `<pane>`
 * components as shown in this example:
 *
 * ```html
 * <tabs>
 *   <pane title="Overview">...</pane>
 *   <pane *ngFor="#o of objects" [title]="o.title">{{o.text}}</pane>
 * </tabs>
 * ```
 *
 * The preferred solution is to query for `Pane` directives using this decorator.
 *
 * ```javascript
 * @Component({
 *   selector: 'pane',
 *   inputs: ['title']
 * })
 * class Pane {
 *   title:string;
 * }
 *
 * @Component({
 *  selector: 'tabs',
 *  template: `
 *    <ul>
 *      <li *ngFor="#pane of panes">{{pane.title}}</li>
 *    </ul>
 *    <ng-content></ng-content>
 *  `
 * })
 * class Tabs {
 *   panes: QueryList<Pane>;
 *   constructor(@Query(Pane) panes:QueryList<Pane>) {
  *    this.panes = panes;
  *  }
 * }
 * ```
 *
 * A query can look for variable bindings by passing in a string with desired binding symbol.
 *
 * ### Example ([live demo](http://plnkr.co/edit/sT2j25cH1dURAyBRCKx1?p=preview))
 * ```html
 * <seeker>
 *   <div #findme>...</div>
 * </seeker>
 *
 * @Component({ selector: 'seeker' })
 * class Seeker {
 *   constructor(@Query('findme') elList: QueryList<ElementRef>) {...}
 * }
 * ```
 *
 * In this case the object that is injected depend on the type of the variable
 * binding. It can be an ElementRef, a directive or a component.
 *
 * Passing in a comma separated list of variable bindings will query for all of them.
 *
 * ```html
 * <seeker>
 *   <div #find-me>...</div>
 *   <div #find-me-too>...</div>
 * </seeker>
 *
 *  @Component({
 *   selector: 'seeker'
 * })
 * class Seeker {
 *   constructor(@Query('findMe, findMeToo') elList: QueryList<ElementRef>) {...}
 * }
 * ```
 *
 * Configure whether query looks for direct children or all descendants
 * of the querying element, by using the `descendants` parameter.
 * It is set to `false` by default.
 *
 * ### Example ([live demo](http://plnkr.co/edit/wtGeB977bv7qvA5FTYl9?p=preview))
 * ```html
 * <container #first>
 *   <item>a</item>
 *   <item>b</item>
 *   <container #second>
 *     <item>c</item>
 *   </container>
 * </container>
 * ```
 *
 * When querying for items, the first container will see only `a` and `b` by default,
 * but with `Query(TextDirective, {descendants: true})` it will see `c` too.
 *
 * The queried directives are kept in a depth-first pre-order with respect to their
 * positions in the DOM.
 *
 * Query does not look deep into any subcomponent views.
 *
 * Query is updated as part of the change-detection cycle. Since change detection
 * happens after construction of a directive, QueryList will always be empty when observed in the
 * constructor.
 *
 * The injected object is an unmodifiable live list.
 * See {@link QueryList} for more details.
 */
export let QueryMetadata = class QueryMetadata extends DependencyMetadata {
    constructor(_selector, { descendants = false, first = false } = {}) {
        super();
        this._selector = _selector;
        this.descendants = descendants;
        this.first = first;
    }
    /**
     * always `false` to differentiate it with {@link ViewQueryMetadata}.
     */
    get isViewQuery() { return false; }
    /**
     * what this is querying for.
     */
    get selector() { return resolveForwardRef(this._selector); }
    /**
     * whether this is querying for a variable binding or a directive.
     */
    get isVarBindingQuery() { return isString(this.selector); }
    /**
     * returns a list of variable bindings this is querying for.
     * Only applicable if this is a variable bindings query.
     */
    get varBindings() { return this.selector.split(','); }
    toString() { return `@Query(${stringify(this.selector)})`; }
};
QueryMetadata = __decorate([
    CONST(), 
    __metadata('design:paramtypes', [Object, Object])
], QueryMetadata);
// TODO: add an example after ContentChildren and ViewChildren are in master
/**
 * Configures a content query.
 *
 * Content queries are set before the `ngAfterContentInit` callback is called.
 *
 * ### Example
 *
 * ```
 * @Directive({
 *   selector: 'someDir'
 * })
 * class SomeDir {
 *   @ContentChildren(ChildDirective) contentChildren: QueryList<ChildDirective>;
 *
 *   ngAfterContentInit() {
 *     // contentChildren is set
 *   }
 * }
 * ```
 */
export let ContentChildrenMetadata = class ContentChildrenMetadata extends QueryMetadata {
    constructor(_selector, { descendants = false } = {}) {
        super(_selector, { descendants: descendants });
    }
};
ContentChildrenMetadata = __decorate([
    CONST(), 
    __metadata('design:paramtypes', [Object, Object])
], ContentChildrenMetadata);
// TODO: add an example after ContentChild and ViewChild are in master
/**
 * Configures a content query.
 *
 * Content queries are set before the `ngAfterContentInit` callback is called.
 *
 * ### Example
 *
 * ```
 * @Directive({
 *   selector: 'someDir'
 * })
 * class SomeDir {
 *   @ContentChild(ChildDirective) contentChild;
 *
 *   ngAfterContentInit() {
 *     // contentChild is set
 *   }
 * }
 * ```
 */
export let ContentChildMetadata = class ContentChildMetadata extends QueryMetadata {
    constructor(_selector) {
        super(_selector, { descendants: true, first: true });
    }
};
ContentChildMetadata = __decorate([
    CONST(), 
    __metadata('design:paramtypes', [Object])
], ContentChildMetadata);
/**
 * Similar to {@link QueryMetadata}, but querying the component view, instead of
 * the content children.
 *
 * ### Example ([live demo](http://plnkr.co/edit/eNsFHDf7YjyM6IzKxM1j?p=preview))
 *
 * ```javascript
 * @Component({
 *   ...,
 *   template: `
 *     <item> a </item>
 *     <item> b </item>
 *     <item> c </item>
 *   `
 * })
 * class MyComponent {
 *   shown: boolean;
 *
 *   constructor(private @ViewQuery(Item) items:QueryList<Item>) {
 *     items.changes.subscribe(() => console.log(items.length));
 *   }
 * }
 * ```
 *
 * Supports the same querying parameters as {@link QueryMetadata}, except
 * `descendants`. This always queries the whole view.
 *
 * As `shown` is flipped between true and false, items will contain zero of one
 * items.
 *
 * Specifies that a {@link QueryList} should be injected.
 *
 * The injected object is an iterable and observable live list.
 * See {@link QueryList} for more details.
 */
export let ViewQueryMetadata = class ViewQueryMetadata extends QueryMetadata {
    constructor(_selector, { descendants = false, first = false } = {}) {
        super(_selector, { descendants: descendants, first: first });
    }
    /**
     * always `true` to differentiate it with {@link QueryMetadata}.
     */
    get isViewQuery() { return true; }
    toString() { return `@ViewQuery(${stringify(this.selector)})`; }
};
ViewQueryMetadata = __decorate([
    CONST(), 
    __metadata('design:paramtypes', [Object, Object])
], ViewQueryMetadata);
/**
 * Configures a view query.
 *
 * View queries are set before the `ngAfterViewInit` callback is called.
 *
 * ### Example
 *
 * ```
 * @Component({
 *   selector: 'someDir',
 *   templateUrl: 'someTemplate',
 *   directives: [ItemDirective]
 * })
 * class SomeDir {
 *   @ViewChildren(ItemDirective) viewChildren: QueryList<ItemDirective>;
 *
 *   ngAfterViewInit() {
 *     // viewChildren is set
 *   }
 * }
 * ```
 */
export let ViewChildrenMetadata = class ViewChildrenMetadata extends ViewQueryMetadata {
    constructor(_selector) {
        super(_selector, { descendants: true });
    }
};
ViewChildrenMetadata = __decorate([
    CONST(), 
    __metadata('design:paramtypes', [Object])
], ViewChildrenMetadata);
/**
 * Configures a view query.
 *
 * View queries are set before the `ngAfterViewInit` callback is called.
 *
 * ### Example
 *
 * ```
 * @Component({
 *   selector: 'someDir',
 *   templateUrl: 'someTemplate',
 *   directives: [ItemDirective]
 * })
 * class SomeDir {
 *   @ViewChild(ItemDirective) viewChild:ItemDirective;
 *
 *   ngAfterViewInit() {
 *     // viewChild is set
 *   }
 * }
 * ```
 */
export let ViewChildMetadata = class ViewChildMetadata extends ViewQueryMetadata {
    constructor(_selector) {
        super(_selector, { descendants: true, first: true });
    }
};
ViewChildMetadata = __decorate([
    CONST(), 
    __metadata('design:paramtypes', [Object])
], ViewChildMetadata);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJkaWZmaW5nX3BsdWdpbl93cmFwcGVyLW91dHB1dF9wYXRoLW9YRE80cDJ2LnRtcC9hbmd1bGFyMi9zcmMvY29yZS9tZXRhZGF0YS9kaS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7T0FBTyxFQUFDLEtBQUssRUFBUSxTQUFTLEVBQWEsUUFBUSxFQUFDLE1BQU0sMEJBQTBCO09BQzdFLEVBQUMsaUJBQWlCLEVBQUMsTUFBTSxzQkFBc0I7T0FDL0MsRUFBQyxrQkFBa0IsRUFBQyxNQUFNLCtCQUErQjtBQUVoRTs7Ozs7Ozs7Ozs7Ozs7OztHQWdCRztBQUVILCtEQUF1QyxrQkFBa0I7SUFDdkQsWUFBbUIsYUFBcUI7UUFBSSxPQUFPLENBQUM7UUFBakMsa0JBQWEsR0FBYixhQUFhLENBQVE7SUFBYSxDQUFDO0lBRXRELElBQUksS0FBSztRQUNQLDZFQUE2RTtRQUM3RSx1RkFBdUY7UUFDdkYsNkZBQTZGO1FBQzdGLDJGQUEyRjtRQUMzRixXQUFXO1FBQ1gsTUFBTSxDQUFDLElBQUksQ0FBQztJQUNkLENBQUM7SUFDRCxRQUFRLEtBQWEsTUFBTSxDQUFDLGNBQWMsU0FBUyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztBQUMvRSxDQUFDO0FBYkQ7SUFBQyxLQUFLLEVBQUU7O3FCQUFBO0FBZVI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0EwR0c7QUFFSCx1REFBbUMsa0JBQWtCO0lBUW5ELFlBQW9CLFNBQXdCLEVBQ2hDLEVBQUMsV0FBVyxHQUFHLEtBQUssRUFBRSxLQUFLLEdBQUcsS0FBSyxFQUFDLEdBQTZDLEVBQUU7UUFDN0YsT0FBTyxDQUFDO1FBRlUsY0FBUyxHQUFULFNBQVMsQ0FBZTtRQUcxQyxJQUFJLENBQUMsV0FBVyxHQUFHLFdBQVcsQ0FBQztRQUMvQixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztJQUNyQixDQUFDO0lBRUQ7O09BRUc7SUFDSCxJQUFJLFdBQVcsS0FBYyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztJQUU1Qzs7T0FFRztJQUNILElBQUksUUFBUSxLQUFLLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBRTVEOztPQUVHO0lBQ0gsSUFBSSxpQkFBaUIsS0FBYyxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFcEU7OztPQUdHO0lBQ0gsSUFBSSxXQUFXLEtBQWUsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUVoRSxRQUFRLEtBQWEsTUFBTSxDQUFDLFVBQVUsU0FBUyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztBQUN0RSxDQUFDO0FBdENEO0lBQUMsS0FBSyxFQUFFOztpQkFBQTtBQXdDUiw0RUFBNEU7QUFDNUU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FtQkc7QUFFSCwyRUFBNkMsYUFBYTtJQUN4RCxZQUFZLFNBQXdCLEVBQUUsRUFBQyxXQUFXLEdBQUcsS0FBSyxFQUFDLEdBQTRCLEVBQUU7UUFDdkYsTUFBTSxTQUFTLEVBQUUsRUFBQyxXQUFXLEVBQUUsV0FBVyxFQUFDLENBQUMsQ0FBQztJQUMvQyxDQUFDO0FBQ0gsQ0FBQztBQUxEO0lBQUMsS0FBSyxFQUFFOzsyQkFBQTtBQU9SLHNFQUFzRTtBQUN0RTs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQW1CRztBQUVILHFFQUEwQyxhQUFhO0lBQ3JELFlBQVksU0FBd0I7UUFBSSxNQUFNLFNBQVMsRUFBRSxFQUFDLFdBQVcsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBQyxDQUFDLENBQUM7SUFBQyxDQUFDO0FBQy9GLENBQUM7QUFIRDtJQUFDLEtBQUssRUFBRTs7d0JBQUE7QUFLUjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQWtDRztBQUVILCtEQUF1QyxhQUFhO0lBQ2xELFlBQVksU0FBd0IsRUFDeEIsRUFBQyxXQUFXLEdBQUcsS0FBSyxFQUFFLEtBQUssR0FBRyxLQUFLLEVBQUMsR0FBNkMsRUFBRTtRQUM3RixNQUFNLFNBQVMsRUFBRSxFQUFDLFdBQVcsRUFBRSxXQUFXLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBQyxDQUFDLENBQUM7SUFDN0QsQ0FBQztJQUVEOztPQUVHO0lBQ0gsSUFBSSxXQUFXLEtBQUssTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7SUFDbEMsUUFBUSxLQUFhLE1BQU0sQ0FBQyxjQUFjLFNBQVMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDMUUsQ0FBQztBQVpEO0lBQUMsS0FBSyxFQUFFOztxQkFBQTtBQWNSOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FxQkc7QUFFSCxxRUFBMEMsaUJBQWlCO0lBQ3pELFlBQVksU0FBd0I7UUFBSSxNQUFNLFNBQVMsRUFBRSxFQUFDLFdBQVcsRUFBRSxJQUFJLEVBQUMsQ0FBQyxDQUFDO0lBQUMsQ0FBQztBQUNsRixDQUFDO0FBSEQ7SUFBQyxLQUFLLEVBQUU7O3dCQUFBO0FBS1I7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXFCRztBQUVILCtEQUF1QyxpQkFBaUI7SUFDdEQsWUFBWSxTQUF3QjtRQUFJLE1BQU0sU0FBUyxFQUFFLEVBQUMsV0FBVyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFDLENBQUMsQ0FBQztJQUFDLENBQUM7QUFDL0YsQ0FBQztBQUhEO0lBQUMsS0FBSyxFQUFFOztxQkFBQTtBQUdQIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtDT05TVCwgVHlwZSwgc3RyaW5naWZ5LCBpc1ByZXNlbnQsIGlzU3RyaW5nfSBmcm9tICdhbmd1bGFyMi9zcmMvZmFjYWRlL2xhbmcnO1xuaW1wb3J0IHtyZXNvbHZlRm9yd2FyZFJlZn0gZnJvbSAnYW5ndWxhcjIvc3JjL2NvcmUvZGknO1xuaW1wb3J0IHtEZXBlbmRlbmN5TWV0YWRhdGF9IGZyb20gJ2FuZ3VsYXIyL3NyYy9jb3JlL2RpL21ldGFkYXRhJztcblxuLyoqXG4gKiBTcGVjaWZpZXMgdGhhdCBhIGNvbnN0YW50IGF0dHJpYnV0ZSB2YWx1ZSBzaG91bGQgYmUgaW5qZWN0ZWQuXG4gKlxuICogVGhlIGRpcmVjdGl2ZSBjYW4gaW5qZWN0IGNvbnN0YW50IHN0cmluZyBsaXRlcmFscyBvZiBob3N0IGVsZW1lbnQgYXR0cmlidXRlcy5cbiAqXG4gKiAjIyMgRXhhbXBsZVxuICpcbiAqIFN1cHBvc2Ugd2UgaGF2ZSBhbiBgPGlucHV0PmAgZWxlbWVudCBhbmQgd2FudCB0byBrbm93IGl0cyBgdHlwZWAuXG4gKlxuICogYGBgaHRtbFxuICogPGlucHV0IHR5cGU9XCJ0ZXh0XCI+XG4gKiBgYGBcbiAqXG4gKiBBIGRlY29yYXRvciBjYW4gaW5qZWN0IHN0cmluZyBsaXRlcmFsIGB0ZXh0YCBsaWtlIHNvOlxuICpcbiAqIHtAZXhhbXBsZSBjb3JlL3RzL21ldGFkYXRhL21ldGFkYXRhLnRzIHJlZ2lvbj0nYXR0cmlidXRlTWV0YWRhdGEnfVxuICovXG5AQ09OU1QoKVxuZXhwb3J0IGNsYXNzIEF0dHJpYnV0ZU1ldGFkYXRhIGV4dGVuZHMgRGVwZW5kZW5jeU1ldGFkYXRhIHtcbiAgY29uc3RydWN0b3IocHVibGljIGF0dHJpYnV0ZU5hbWU6IHN0cmluZykgeyBzdXBlcigpOyB9XG5cbiAgZ2V0IHRva2VuKCk6IEF0dHJpYnV0ZU1ldGFkYXRhIHtcbiAgICAvLyBOb3JtYWxseSBvbmUgd291bGQgZGVmYXVsdCBhIHRva2VuIHRvIGEgdHlwZSBvZiBhbiBpbmplY3RlZCB2YWx1ZSBidXQgaGVyZVxuICAgIC8vIHRoZSB0eXBlIG9mIGEgdmFyaWFibGUgaXMgXCJzdHJpbmdcIiBhbmQgd2UgY2FuJ3QgdXNlIHByaW1pdGl2ZSB0eXBlIGFzIGEgcmV0dXJuIHZhbHVlXG4gICAgLy8gc28gd2UgdXNlIGluc3RhbmNlIG9mIEF0dHJpYnV0ZSBpbnN0ZWFkLiBUaGlzIGRvZXNuJ3QgbWF0dGVyIG11Y2ggaW4gcHJhY3RpY2UgYXMgYXJndW1lbnRzXG4gICAgLy8gd2l0aCBAQXR0cmlidXRlIGFubm90YXRpb24gYXJlIGluamVjdGVkIGJ5IEVsZW1lbnRJbmplY3RvciB0aGF0IGRvZXNuJ3QgdGFrZSB0b2tlbnMgaW50b1xuICAgIC8vIGFjY291bnQuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbiAgdG9TdHJpbmcoKTogc3RyaW5nIHsgcmV0dXJuIGBAQXR0cmlidXRlKCR7c3RyaW5naWZ5KHRoaXMuYXR0cmlidXRlTmFtZSl9KWA7IH1cbn1cblxuLyoqXG4gKiBEZWNsYXJlcyBhbiBpbmplY3RhYmxlIHBhcmFtZXRlciB0byBiZSBhIGxpdmUgbGlzdCBvZiBkaXJlY3RpdmVzIG9yIHZhcmlhYmxlXG4gKiBiaW5kaW5ncyBmcm9tIHRoZSBjb250ZW50IGNoaWxkcmVuIG9mIGEgZGlyZWN0aXZlLlxuICpcbiAqICMjIyBFeGFtcGxlIChbbGl2ZSBkZW1vXShodHRwOi8vcGxua3IuY28vZWRpdC9sWTltOEhMeTd6MDZ2RG9VYVNOMj9wPXByZXZpZXcpKVxuICpcbiAqIEFzc3VtZSB0aGF0IGA8dGFicz5gIGNvbXBvbmVudCB3b3VsZCBsaWtlIHRvIGdldCBhIGxpc3QgaXRzIGNoaWxkcmVuIGA8cGFuZT5gXG4gKiBjb21wb25lbnRzIGFzIHNob3duIGluIHRoaXMgZXhhbXBsZTpcbiAqXG4gKiBgYGBodG1sXG4gKiA8dGFicz5cbiAqICAgPHBhbmUgdGl0bGU9XCJPdmVydmlld1wiPi4uLjwvcGFuZT5cbiAqICAgPHBhbmUgKm5nRm9yPVwiI28gb2Ygb2JqZWN0c1wiIFt0aXRsZV09XCJvLnRpdGxlXCI+e3tvLnRleHR9fTwvcGFuZT5cbiAqIDwvdGFicz5cbiAqIGBgYFxuICpcbiAqIFRoZSBwcmVmZXJyZWQgc29sdXRpb24gaXMgdG8gcXVlcnkgZm9yIGBQYW5lYCBkaXJlY3RpdmVzIHVzaW5nIHRoaXMgZGVjb3JhdG9yLlxuICpcbiAqIGBgYGphdmFzY3JpcHRcbiAqIEBDb21wb25lbnQoe1xuICogICBzZWxlY3RvcjogJ3BhbmUnLFxuICogICBpbnB1dHM6IFsndGl0bGUnXVxuICogfSlcbiAqIGNsYXNzIFBhbmUge1xuICogICB0aXRsZTpzdHJpbmc7XG4gKiB9XG4gKlxuICogQENvbXBvbmVudCh7XG4gKiAgc2VsZWN0b3I6ICd0YWJzJyxcbiAqICB0ZW1wbGF0ZTogYFxuICogICAgPHVsPlxuICogICAgICA8bGkgKm5nRm9yPVwiI3BhbmUgb2YgcGFuZXNcIj57e3BhbmUudGl0bGV9fTwvbGk+XG4gKiAgICA8L3VsPlxuICogICAgPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PlxuICogIGBcbiAqIH0pXG4gKiBjbGFzcyBUYWJzIHtcbiAqICAgcGFuZXM6IFF1ZXJ5TGlzdDxQYW5lPjtcbiAqICAgY29uc3RydWN0b3IoQFF1ZXJ5KFBhbmUpIHBhbmVzOlF1ZXJ5TGlzdDxQYW5lPikge1xuICAqICAgIHRoaXMucGFuZXMgPSBwYW5lcztcbiAgKiAgfVxuICogfVxuICogYGBgXG4gKlxuICogQSBxdWVyeSBjYW4gbG9vayBmb3IgdmFyaWFibGUgYmluZGluZ3MgYnkgcGFzc2luZyBpbiBhIHN0cmluZyB3aXRoIGRlc2lyZWQgYmluZGluZyBzeW1ib2wuXG4gKlxuICogIyMjIEV4YW1wbGUgKFtsaXZlIGRlbW9dKGh0dHA6Ly9wbG5rci5jby9lZGl0L3NUMmoyNWNIMWRVUkF5QlJDS3gxP3A9cHJldmlldykpXG4gKiBgYGBodG1sXG4gKiA8c2Vla2VyPlxuICogICA8ZGl2ICNmaW5kbWU+Li4uPC9kaXY+XG4gKiA8L3NlZWtlcj5cbiAqXG4gKiBAQ29tcG9uZW50KHsgc2VsZWN0b3I6ICdzZWVrZXInIH0pXG4gKiBjbGFzcyBTZWVrZXIge1xuICogICBjb25zdHJ1Y3RvcihAUXVlcnkoJ2ZpbmRtZScpIGVsTGlzdDogUXVlcnlMaXN0PEVsZW1lbnRSZWY+KSB7Li4ufVxuICogfVxuICogYGBgXG4gKlxuICogSW4gdGhpcyBjYXNlIHRoZSBvYmplY3QgdGhhdCBpcyBpbmplY3RlZCBkZXBlbmQgb24gdGhlIHR5cGUgb2YgdGhlIHZhcmlhYmxlXG4gKiBiaW5kaW5nLiBJdCBjYW4gYmUgYW4gRWxlbWVudFJlZiwgYSBkaXJlY3RpdmUgb3IgYSBjb21wb25lbnQuXG4gKlxuICogUGFzc2luZyBpbiBhIGNvbW1hIHNlcGFyYXRlZCBsaXN0IG9mIHZhcmlhYmxlIGJpbmRpbmdzIHdpbGwgcXVlcnkgZm9yIGFsbCBvZiB0aGVtLlxuICpcbiAqIGBgYGh0bWxcbiAqIDxzZWVrZXI+XG4gKiAgIDxkaXYgI2ZpbmQtbWU+Li4uPC9kaXY+XG4gKiAgIDxkaXYgI2ZpbmQtbWUtdG9vPi4uLjwvZGl2PlxuICogPC9zZWVrZXI+XG4gKlxuICogIEBDb21wb25lbnQoe1xuICogICBzZWxlY3RvcjogJ3NlZWtlcidcbiAqIH0pXG4gKiBjbGFzcyBTZWVrZXIge1xuICogICBjb25zdHJ1Y3RvcihAUXVlcnkoJ2ZpbmRNZSwgZmluZE1lVG9vJykgZWxMaXN0OiBRdWVyeUxpc3Q8RWxlbWVudFJlZj4pIHsuLi59XG4gKiB9XG4gKiBgYGBcbiAqXG4gKiBDb25maWd1cmUgd2hldGhlciBxdWVyeSBsb29rcyBmb3IgZGlyZWN0IGNoaWxkcmVuIG9yIGFsbCBkZXNjZW5kYW50c1xuICogb2YgdGhlIHF1ZXJ5aW5nIGVsZW1lbnQsIGJ5IHVzaW5nIHRoZSBgZGVzY2VuZGFudHNgIHBhcmFtZXRlci5cbiAqIEl0IGlzIHNldCB0byBgZmFsc2VgIGJ5IGRlZmF1bHQuXG4gKlxuICogIyMjIEV4YW1wbGUgKFtsaXZlIGRlbW9dKGh0dHA6Ly9wbG5rci5jby9lZGl0L3d0R2VCOTc3YnY3cXZBNUZUWWw5P3A9cHJldmlldykpXG4gKiBgYGBodG1sXG4gKiA8Y29udGFpbmVyICNmaXJzdD5cbiAqICAgPGl0ZW0+YTwvaXRlbT5cbiAqICAgPGl0ZW0+YjwvaXRlbT5cbiAqICAgPGNvbnRhaW5lciAjc2Vjb25kPlxuICogICAgIDxpdGVtPmM8L2l0ZW0+XG4gKiAgIDwvY29udGFpbmVyPlxuICogPC9jb250YWluZXI+XG4gKiBgYGBcbiAqXG4gKiBXaGVuIHF1ZXJ5aW5nIGZvciBpdGVtcywgdGhlIGZpcnN0IGNvbnRhaW5lciB3aWxsIHNlZSBvbmx5IGBhYCBhbmQgYGJgIGJ5IGRlZmF1bHQsXG4gKiBidXQgd2l0aCBgUXVlcnkoVGV4dERpcmVjdGl2ZSwge2Rlc2NlbmRhbnRzOiB0cnVlfSlgIGl0IHdpbGwgc2VlIGBjYCB0b28uXG4gKlxuICogVGhlIHF1ZXJpZWQgZGlyZWN0aXZlcyBhcmUga2VwdCBpbiBhIGRlcHRoLWZpcnN0IHByZS1vcmRlciB3aXRoIHJlc3BlY3QgdG8gdGhlaXJcbiAqIHBvc2l0aW9ucyBpbiB0aGUgRE9NLlxuICpcbiAqIFF1ZXJ5IGRvZXMgbm90IGxvb2sgZGVlcCBpbnRvIGFueSBzdWJjb21wb25lbnQgdmlld3MuXG4gKlxuICogUXVlcnkgaXMgdXBkYXRlZCBhcyBwYXJ0IG9mIHRoZSBjaGFuZ2UtZGV0ZWN0aW9uIGN5Y2xlLiBTaW5jZSBjaGFuZ2UgZGV0ZWN0aW9uXG4gKiBoYXBwZW5zIGFmdGVyIGNvbnN0cnVjdGlvbiBvZiBhIGRpcmVjdGl2ZSwgUXVlcnlMaXN0IHdpbGwgYWx3YXlzIGJlIGVtcHR5IHdoZW4gb2JzZXJ2ZWQgaW4gdGhlXG4gKiBjb25zdHJ1Y3Rvci5cbiAqXG4gKiBUaGUgaW5qZWN0ZWQgb2JqZWN0IGlzIGFuIHVubW9kaWZpYWJsZSBsaXZlIGxpc3QuXG4gKiBTZWUge0BsaW5rIFF1ZXJ5TGlzdH0gZm9yIG1vcmUgZGV0YWlscy5cbiAqL1xuQENPTlNUKClcbmV4cG9ydCBjbGFzcyBRdWVyeU1ldGFkYXRhIGV4dGVuZHMgRGVwZW5kZW5jeU1ldGFkYXRhIHtcbiAgLyoqXG4gICAqIHdoZXRoZXIgd2Ugd2FudCB0byBxdWVyeSBvbmx5IGRpcmVjdCBjaGlsZHJlbiAoZmFsc2UpIG9yIGFsbFxuICAgKiBjaGlsZHJlbiAodHJ1ZSkuXG4gICAqL1xuICBkZXNjZW5kYW50czogYm9vbGVhbjtcbiAgZmlyc3Q6IGJvb2xlYW47XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBfc2VsZWN0b3I6IFR5cGUgfCBzdHJpbmcsXG4gICAgICAgICAgICAgIHtkZXNjZW5kYW50cyA9IGZhbHNlLCBmaXJzdCA9IGZhbHNlfToge2Rlc2NlbmRhbnRzPzogYm9vbGVhbiwgZmlyc3Q/OiBib29sZWFufSA9IHt9KSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLmRlc2NlbmRhbnRzID0gZGVzY2VuZGFudHM7XG4gICAgdGhpcy5maXJzdCA9IGZpcnN0O1xuICB9XG5cbiAgLyoqXG4gICAqIGFsd2F5cyBgZmFsc2VgIHRvIGRpZmZlcmVudGlhdGUgaXQgd2l0aCB7QGxpbmsgVmlld1F1ZXJ5TWV0YWRhdGF9LlxuICAgKi9cbiAgZ2V0IGlzVmlld1F1ZXJ5KCk6IGJvb2xlYW4geyByZXR1cm4gZmFsc2U7IH1cblxuICAvKipcbiAgICogd2hhdCB0aGlzIGlzIHF1ZXJ5aW5nIGZvci5cbiAgICovXG4gIGdldCBzZWxlY3RvcigpIHsgcmV0dXJuIHJlc29sdmVGb3J3YXJkUmVmKHRoaXMuX3NlbGVjdG9yKTsgfVxuXG4gIC8qKlxuICAgKiB3aGV0aGVyIHRoaXMgaXMgcXVlcnlpbmcgZm9yIGEgdmFyaWFibGUgYmluZGluZyBvciBhIGRpcmVjdGl2ZS5cbiAgICovXG4gIGdldCBpc1ZhckJpbmRpbmdRdWVyeSgpOiBib29sZWFuIHsgcmV0dXJuIGlzU3RyaW5nKHRoaXMuc2VsZWN0b3IpOyB9XG5cbiAgLyoqXG4gICAqIHJldHVybnMgYSBsaXN0IG9mIHZhcmlhYmxlIGJpbmRpbmdzIHRoaXMgaXMgcXVlcnlpbmcgZm9yLlxuICAgKiBPbmx5IGFwcGxpY2FibGUgaWYgdGhpcyBpcyBhIHZhcmlhYmxlIGJpbmRpbmdzIHF1ZXJ5LlxuICAgKi9cbiAgZ2V0IHZhckJpbmRpbmdzKCk6IHN0cmluZ1tdIHsgcmV0dXJuIHRoaXMuc2VsZWN0b3Iuc3BsaXQoJywnKTsgfVxuXG4gIHRvU3RyaW5nKCk6IHN0cmluZyB7IHJldHVybiBgQFF1ZXJ5KCR7c3RyaW5naWZ5KHRoaXMuc2VsZWN0b3IpfSlgOyB9XG59XG5cbi8vIFRPRE86IGFkZCBhbiBleGFtcGxlIGFmdGVyIENvbnRlbnRDaGlsZHJlbiBhbmQgVmlld0NoaWxkcmVuIGFyZSBpbiBtYXN0ZXJcbi8qKlxuICogQ29uZmlndXJlcyBhIGNvbnRlbnQgcXVlcnkuXG4gKlxuICogQ29udGVudCBxdWVyaWVzIGFyZSBzZXQgYmVmb3JlIHRoZSBgbmdBZnRlckNvbnRlbnRJbml0YCBjYWxsYmFjayBpcyBjYWxsZWQuXG4gKlxuICogIyMjIEV4YW1wbGVcbiAqXG4gKiBgYGBcbiAqIEBEaXJlY3RpdmUoe1xuICogICBzZWxlY3RvcjogJ3NvbWVEaXInXG4gKiB9KVxuICogY2xhc3MgU29tZURpciB7XG4gKiAgIEBDb250ZW50Q2hpbGRyZW4oQ2hpbGREaXJlY3RpdmUpIGNvbnRlbnRDaGlsZHJlbjogUXVlcnlMaXN0PENoaWxkRGlyZWN0aXZlPjtcbiAqXG4gKiAgIG5nQWZ0ZXJDb250ZW50SW5pdCgpIHtcbiAqICAgICAvLyBjb250ZW50Q2hpbGRyZW4gaXMgc2V0XG4gKiAgIH1cbiAqIH1cbiAqIGBgYFxuICovXG5AQ09OU1QoKVxuZXhwb3J0IGNsYXNzIENvbnRlbnRDaGlsZHJlbk1ldGFkYXRhIGV4dGVuZHMgUXVlcnlNZXRhZGF0YSB7XG4gIGNvbnN0cnVjdG9yKF9zZWxlY3RvcjogVHlwZSB8IHN0cmluZywge2Rlc2NlbmRhbnRzID0gZmFsc2V9OiB7ZGVzY2VuZGFudHM/OiBib29sZWFufSA9IHt9KSB7XG4gICAgc3VwZXIoX3NlbGVjdG9yLCB7ZGVzY2VuZGFudHM6IGRlc2NlbmRhbnRzfSk7XG4gIH1cbn1cblxuLy8gVE9ETzogYWRkIGFuIGV4YW1wbGUgYWZ0ZXIgQ29udGVudENoaWxkIGFuZCBWaWV3Q2hpbGQgYXJlIGluIG1hc3RlclxuLyoqXG4gKiBDb25maWd1cmVzIGEgY29udGVudCBxdWVyeS5cbiAqXG4gKiBDb250ZW50IHF1ZXJpZXMgYXJlIHNldCBiZWZvcmUgdGhlIGBuZ0FmdGVyQ29udGVudEluaXRgIGNhbGxiYWNrIGlzIGNhbGxlZC5cbiAqXG4gKiAjIyMgRXhhbXBsZVxuICpcbiAqIGBgYFxuICogQERpcmVjdGl2ZSh7XG4gKiAgIHNlbGVjdG9yOiAnc29tZURpcidcbiAqIH0pXG4gKiBjbGFzcyBTb21lRGlyIHtcbiAqICAgQENvbnRlbnRDaGlsZChDaGlsZERpcmVjdGl2ZSkgY29udGVudENoaWxkO1xuICpcbiAqICAgbmdBZnRlckNvbnRlbnRJbml0KCkge1xuICogICAgIC8vIGNvbnRlbnRDaGlsZCBpcyBzZXRcbiAqICAgfVxuICogfVxuICogYGBgXG4gKi9cbkBDT05TVCgpXG5leHBvcnQgY2xhc3MgQ29udGVudENoaWxkTWV0YWRhdGEgZXh0ZW5kcyBRdWVyeU1ldGFkYXRhIHtcbiAgY29uc3RydWN0b3IoX3NlbGVjdG9yOiBUeXBlIHwgc3RyaW5nKSB7IHN1cGVyKF9zZWxlY3Rvciwge2Rlc2NlbmRhbnRzOiB0cnVlLCBmaXJzdDogdHJ1ZX0pOyB9XG59XG5cbi8qKlxuICogU2ltaWxhciB0byB7QGxpbmsgUXVlcnlNZXRhZGF0YX0sIGJ1dCBxdWVyeWluZyB0aGUgY29tcG9uZW50IHZpZXcsIGluc3RlYWQgb2ZcbiAqIHRoZSBjb250ZW50IGNoaWxkcmVuLlxuICpcbiAqICMjIyBFeGFtcGxlIChbbGl2ZSBkZW1vXShodHRwOi8vcGxua3IuY28vZWRpdC9lTnNGSERmN1lqeU02SXpLeE0xaj9wPXByZXZpZXcpKVxuICpcbiAqIGBgYGphdmFzY3JpcHRcbiAqIEBDb21wb25lbnQoe1xuICogICAuLi4sXG4gKiAgIHRlbXBsYXRlOiBgXG4gKiAgICAgPGl0ZW0+IGEgPC9pdGVtPlxuICogICAgIDxpdGVtPiBiIDwvaXRlbT5cbiAqICAgICA8aXRlbT4gYyA8L2l0ZW0+XG4gKiAgIGBcbiAqIH0pXG4gKiBjbGFzcyBNeUNvbXBvbmVudCB7XG4gKiAgIHNob3duOiBib29sZWFuO1xuICpcbiAqICAgY29uc3RydWN0b3IocHJpdmF0ZSBAVmlld1F1ZXJ5KEl0ZW0pIGl0ZW1zOlF1ZXJ5TGlzdDxJdGVtPikge1xuICogICAgIGl0ZW1zLmNoYW5nZXMuc3Vic2NyaWJlKCgpID0+IGNvbnNvbGUubG9nKGl0ZW1zLmxlbmd0aCkpO1xuICogICB9XG4gKiB9XG4gKiBgYGBcbiAqXG4gKiBTdXBwb3J0cyB0aGUgc2FtZSBxdWVyeWluZyBwYXJhbWV0ZXJzIGFzIHtAbGluayBRdWVyeU1ldGFkYXRhfSwgZXhjZXB0XG4gKiBgZGVzY2VuZGFudHNgLiBUaGlzIGFsd2F5cyBxdWVyaWVzIHRoZSB3aG9sZSB2aWV3LlxuICpcbiAqIEFzIGBzaG93bmAgaXMgZmxpcHBlZCBiZXR3ZWVuIHRydWUgYW5kIGZhbHNlLCBpdGVtcyB3aWxsIGNvbnRhaW4gemVybyBvZiBvbmVcbiAqIGl0ZW1zLlxuICpcbiAqIFNwZWNpZmllcyB0aGF0IGEge0BsaW5rIFF1ZXJ5TGlzdH0gc2hvdWxkIGJlIGluamVjdGVkLlxuICpcbiAqIFRoZSBpbmplY3RlZCBvYmplY3QgaXMgYW4gaXRlcmFibGUgYW5kIG9ic2VydmFibGUgbGl2ZSBsaXN0LlxuICogU2VlIHtAbGluayBRdWVyeUxpc3R9IGZvciBtb3JlIGRldGFpbHMuXG4gKi9cbkBDT05TVCgpXG5leHBvcnQgY2xhc3MgVmlld1F1ZXJ5TWV0YWRhdGEgZXh0ZW5kcyBRdWVyeU1ldGFkYXRhIHtcbiAgY29uc3RydWN0b3IoX3NlbGVjdG9yOiBUeXBlIHwgc3RyaW5nLFxuICAgICAgICAgICAgICB7ZGVzY2VuZGFudHMgPSBmYWxzZSwgZmlyc3QgPSBmYWxzZX06IHtkZXNjZW5kYW50cz86IGJvb2xlYW4sIGZpcnN0PzogYm9vbGVhbn0gPSB7fSkge1xuICAgIHN1cGVyKF9zZWxlY3Rvciwge2Rlc2NlbmRhbnRzOiBkZXNjZW5kYW50cywgZmlyc3Q6IGZpcnN0fSk7XG4gIH1cblxuICAvKipcbiAgICogYWx3YXlzIGB0cnVlYCB0byBkaWZmZXJlbnRpYXRlIGl0IHdpdGgge0BsaW5rIFF1ZXJ5TWV0YWRhdGF9LlxuICAgKi9cbiAgZ2V0IGlzVmlld1F1ZXJ5KCkgeyByZXR1cm4gdHJ1ZTsgfVxuICB0b1N0cmluZygpOiBzdHJpbmcgeyByZXR1cm4gYEBWaWV3UXVlcnkoJHtzdHJpbmdpZnkodGhpcy5zZWxlY3Rvcil9KWA7IH1cbn1cblxuLyoqXG4gKiBDb25maWd1cmVzIGEgdmlldyBxdWVyeS5cbiAqXG4gKiBWaWV3IHF1ZXJpZXMgYXJlIHNldCBiZWZvcmUgdGhlIGBuZ0FmdGVyVmlld0luaXRgIGNhbGxiYWNrIGlzIGNhbGxlZC5cbiAqXG4gKiAjIyMgRXhhbXBsZVxuICpcbiAqIGBgYFxuICogQENvbXBvbmVudCh7XG4gKiAgIHNlbGVjdG9yOiAnc29tZURpcicsXG4gKiAgIHRlbXBsYXRlVXJsOiAnc29tZVRlbXBsYXRlJyxcbiAqICAgZGlyZWN0aXZlczogW0l0ZW1EaXJlY3RpdmVdXG4gKiB9KVxuICogY2xhc3MgU29tZURpciB7XG4gKiAgIEBWaWV3Q2hpbGRyZW4oSXRlbURpcmVjdGl2ZSkgdmlld0NoaWxkcmVuOiBRdWVyeUxpc3Q8SXRlbURpcmVjdGl2ZT47XG4gKlxuICogICBuZ0FmdGVyVmlld0luaXQoKSB7XG4gKiAgICAgLy8gdmlld0NoaWxkcmVuIGlzIHNldFxuICogICB9XG4gKiB9XG4gKiBgYGBcbiAqL1xuQENPTlNUKClcbmV4cG9ydCBjbGFzcyBWaWV3Q2hpbGRyZW5NZXRhZGF0YSBleHRlbmRzIFZpZXdRdWVyeU1ldGFkYXRhIHtcbiAgY29uc3RydWN0b3IoX3NlbGVjdG9yOiBUeXBlIHwgc3RyaW5nKSB7IHN1cGVyKF9zZWxlY3Rvciwge2Rlc2NlbmRhbnRzOiB0cnVlfSk7IH1cbn1cblxuLyoqXG4gKiBDb25maWd1cmVzIGEgdmlldyBxdWVyeS5cbiAqXG4gKiBWaWV3IHF1ZXJpZXMgYXJlIHNldCBiZWZvcmUgdGhlIGBuZ0FmdGVyVmlld0luaXRgIGNhbGxiYWNrIGlzIGNhbGxlZC5cbiAqXG4gKiAjIyMgRXhhbXBsZVxuICpcbiAqIGBgYFxuICogQENvbXBvbmVudCh7XG4gKiAgIHNlbGVjdG9yOiAnc29tZURpcicsXG4gKiAgIHRlbXBsYXRlVXJsOiAnc29tZVRlbXBsYXRlJyxcbiAqICAgZGlyZWN0aXZlczogW0l0ZW1EaXJlY3RpdmVdXG4gKiB9KVxuICogY2xhc3MgU29tZURpciB7XG4gKiAgIEBWaWV3Q2hpbGQoSXRlbURpcmVjdGl2ZSkgdmlld0NoaWxkOkl0ZW1EaXJlY3RpdmU7XG4gKlxuICogICBuZ0FmdGVyVmlld0luaXQoKSB7XG4gKiAgICAgLy8gdmlld0NoaWxkIGlzIHNldFxuICogICB9XG4gKiB9XG4gKiBgYGBcbiAqL1xuQENPTlNUKClcbmV4cG9ydCBjbGFzcyBWaWV3Q2hpbGRNZXRhZGF0YSBleHRlbmRzIFZpZXdRdWVyeU1ldGFkYXRhIHtcbiAgY29uc3RydWN0b3IoX3NlbGVjdG9yOiBUeXBlIHwgc3RyaW5nKSB7IHN1cGVyKF9zZWxlY3Rvciwge2Rlc2NlbmRhbnRzOiB0cnVlLCBmaXJzdDogdHJ1ZX0pOyB9XG59XG4iXX0=