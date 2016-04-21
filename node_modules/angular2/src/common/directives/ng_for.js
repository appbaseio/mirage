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
var core_1 = require('angular2/core');
var lang_1 = require('angular2/src/facade/lang');
var exceptions_1 = require("../../facade/exceptions");
/**
 * The `NgFor` directive instantiates a template once per item from an iterable. The context for
 * each instantiated template inherits from the outer context with the given loop variable set
 * to the current item from the iterable.
 *
 * # Local Variables
 *
 * `NgFor` provides several exported values that can be aliased to local variables:
 *
 * * `index` will be set to the current loop iteration for each template context.
 * * `first` will be set to a boolean value indicating whether the item is the first one in the
 *   iteration.
 * * `last` will be set to a boolean value indicating whether the item is the last one in the
 *   iteration.
 * * `even` will be set to a boolean value indicating whether this item has an even index.
 * * `odd` will be set to a boolean value indicating whether this item has an odd index.
 *
 * # Change Propagation
 *
 * When the contents of the iterator changes, `NgFor` makes the corresponding changes to the DOM:
 *
 * * When an item is added, a new instance of the template is added to the DOM.
 * * When an item is removed, its template instance is removed from the DOM.
 * * When items are reordered, their respective templates are reordered in the DOM.
 * * Otherwise, the DOM element for that item will remain the same.
 *
 * Angular uses object identity to track insertions and deletions within the iterator and reproduce
 * those changes in the DOM. This has important implications for animations and any stateful
 * controls
 * (such as `<input>` elements which accept user input) that are present. Inserted rows can be
 * animated in, deleted rows can be animated out, and unchanged rows retain any unsaved state such
 * as user input.
 *
 * It is possible for the identities of elements in the iterator to change while the data does not.
 * This can happen, for example, if the iterator produced from an RPC to the server, and that
 * RPC is re-run. Even if the data hasn't changed, the second response will produce objects with
 * different identities, and Angular will tear down the entire DOM and rebuild it (as if all old
 * elements were deleted and all new elements inserted). This is an expensive operation and should
 * be avoided if possible.
 *
 * # Syntax
 *
 * - `<li *ngFor="#item of items; #i = index">...</li>`
 * - `<li template="ngFor #item of items; #i = index">...</li>`
 * - `<template ngFor #item [ngForOf]="items" #i="index"><li>...</li></template>`
 *
 * ### Example
 *
 * See a [live demo](http://plnkr.co/edit/KVuXxDp0qinGDyo307QW?p=preview) for a more detailed
 * example.
 */
var NgFor = (function () {
    function NgFor(_viewContainer, _templateRef, _iterableDiffers, _cdr) {
        this._viewContainer = _viewContainer;
        this._templateRef = _templateRef;
        this._iterableDiffers = _iterableDiffers;
        this._cdr = _cdr;
    }
    Object.defineProperty(NgFor.prototype, "ngForOf", {
        set: function (value) {
            this._ngForOf = value;
            if (lang_1.isBlank(this._differ) && lang_1.isPresent(value)) {
                try {
                    this._differ = this._iterableDiffers.find(value).create(this._cdr, this._ngForTrackBy);
                }
                catch (e) {
                    throw new exceptions_1.BaseException("Cannot find a differ supporting object '" + value + "' of type '" + lang_1.getTypeNameForDebugging(value) + "'. NgFor only supports binding to Iterables such as Arrays.");
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NgFor.prototype, "ngForTemplate", {
        set: function (value) {
            if (lang_1.isPresent(value)) {
                this._templateRef = value;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NgFor.prototype, "ngForTrackBy", {
        set: function (value) { this._ngForTrackBy = value; },
        enumerable: true,
        configurable: true
    });
    NgFor.prototype.ngDoCheck = function () {
        if (lang_1.isPresent(this._differ)) {
            var changes = this._differ.diff(this._ngForOf);
            if (lang_1.isPresent(changes))
                this._applyChanges(changes);
        }
    };
    NgFor.prototype._applyChanges = function (changes) {
        var _this = this;
        // TODO(rado): check if change detection can produce a change record that is
        // easier to consume than current.
        var recordViewTuples = [];
        changes.forEachRemovedItem(function (removedRecord) {
            return recordViewTuples.push(new RecordViewTuple(removedRecord, null));
        });
        changes.forEachMovedItem(function (movedRecord) {
            return recordViewTuples.push(new RecordViewTuple(movedRecord, null));
        });
        var insertTuples = this._bulkRemove(recordViewTuples);
        changes.forEachAddedItem(function (addedRecord) {
            return insertTuples.push(new RecordViewTuple(addedRecord, null));
        });
        this._bulkInsert(insertTuples);
        for (var i = 0; i < insertTuples.length; i++) {
            this._perViewChange(insertTuples[i].view, insertTuples[i].record);
        }
        for (var i = 0, ilen = this._viewContainer.length; i < ilen; i++) {
            var viewRef = this._viewContainer.get(i);
            viewRef.setLocal('first', i === 0);
            viewRef.setLocal('last', i === ilen - 1);
        }
        changes.forEachIdentityChange(function (record) {
            var viewRef = _this._viewContainer.get(record.currentIndex);
            viewRef.setLocal('\$implicit', record.item);
        });
    };
    NgFor.prototype._perViewChange = function (view, record) {
        view.setLocal('\$implicit', record.item);
        view.setLocal('index', record.currentIndex);
        view.setLocal('even', (record.currentIndex % 2 == 0));
        view.setLocal('odd', (record.currentIndex % 2 == 1));
    };
    NgFor.prototype._bulkRemove = function (tuples) {
        tuples.sort(function (a, b) {
            return a.record.previousIndex - b.record.previousIndex;
        });
        var movedTuples = [];
        for (var i = tuples.length - 1; i >= 0; i--) {
            var tuple = tuples[i];
            // separate moved views from removed views.
            if (lang_1.isPresent(tuple.record.currentIndex)) {
                tuple.view = this._viewContainer.detach(tuple.record.previousIndex);
                movedTuples.push(tuple);
            }
            else {
                this._viewContainer.remove(tuple.record.previousIndex);
            }
        }
        return movedTuples;
    };
    NgFor.prototype._bulkInsert = function (tuples) {
        tuples.sort(function (a, b) { return a.record.currentIndex - b.record.currentIndex; });
        for (var i = 0; i < tuples.length; i++) {
            var tuple = tuples[i];
            if (lang_1.isPresent(tuple.view)) {
                this._viewContainer.insert(tuple.view, tuple.record.currentIndex);
            }
            else {
                tuple.view =
                    this._viewContainer.createEmbeddedView(this._templateRef, tuple.record.currentIndex);
            }
        }
        return tuples;
    };
    NgFor = __decorate([
        core_1.Directive({ selector: '[ngFor][ngForOf]', inputs: ['ngForTrackBy', 'ngForOf', 'ngForTemplate'] }), 
        __metadata('design:paramtypes', [core_1.ViewContainerRef, core_1.TemplateRef, core_1.IterableDiffers, core_1.ChangeDetectorRef])
    ], NgFor);
    return NgFor;
}());
exports.NgFor = NgFor;
var RecordViewTuple = (function () {
    function RecordViewTuple(record, view) {
        this.record = record;
        this.view = view;
    }
    return RecordViewTuple;
}());
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmdfZm9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZGlmZmluZ19wbHVnaW5fd3JhcHBlci1vdXRwdXRfcGF0aC1qYWtYbk1tTC50bXAvYW5ndWxhcjIvc3JjL2NvbW1vbi9kaXJlY3RpdmVzL25nX2Zvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEscUJBVU8sZUFBZSxDQUFDLENBQUE7QUFDdkIscUJBQXFFLDBCQUEwQixDQUFDLENBQUE7QUFLaEcsMkJBQTRCLHlCQUF5QixDQUFDLENBQUE7QUFFdEQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBa0RHO0FBRUg7SUFPRSxlQUFvQixjQUFnQyxFQUFVLFlBQXlCLEVBQ25FLGdCQUFpQyxFQUFVLElBQXVCO1FBRGxFLG1CQUFjLEdBQWQsY0FBYyxDQUFrQjtRQUFVLGlCQUFZLEdBQVosWUFBWSxDQUFhO1FBQ25FLHFCQUFnQixHQUFoQixnQkFBZ0IsQ0FBaUI7UUFBVSxTQUFJLEdBQUosSUFBSSxDQUFtQjtJQUFHLENBQUM7SUFFMUYsc0JBQUksMEJBQU87YUFBWCxVQUFZLEtBQVU7WUFDcEIsSUFBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUM7WUFDdEIsRUFBRSxDQUFDLENBQUMsY0FBTyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxnQkFBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDOUMsSUFBSSxDQUFDO29CQUNILElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7Z0JBQ3pGLENBQUU7Z0JBQUEsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDWCxNQUFNLElBQUksMEJBQWEsQ0FDbkIsNkNB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Q0FBQyxZQUFZLEVBQUUsS0FBSyxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQztZQUMzRixDQUFDO1FBQ0gsQ0FBQztRQUNELE1BQU0sQ0FBQyxNQUFNLENBQUM7SUFDaEIsQ0FBQztJQTNHSDtRQUFDLGdCQUFTLENBQUMsRUFBQyxRQUFRLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSxFQUFFLENBQUMsY0FBYyxFQUFFLFNBQVMsRUFBRSxlQUFlLENBQUMsRUFBQyxDQUFDOzthQUFBO0lBNEdoRyxZQUFDO0FBQUQsQ0FBQyxBQTNHRCxJQTJHQztBQTNHWSxhQUFLLFFBMkdqQixDQUFBO0FBRUQ7SUFHRSx5QkFBWSxNQUFXLEVBQUUsSUFBcUI7UUFDNUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7UUFDckIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7SUFDbkIsQ0FBQztJQUNILHNCQUFDO0FBQUQsQ0FBQyxBQVBELElBT0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBEb0NoZWNrLFxuICBEaXJlY3RpdmUsXG4gIENoYW5nZURldGVjdG9yUmVmLFxuICBJdGVyYWJsZURpZmZlcixcbiAgSXRlcmFibGVEaWZmZXJzLFxuICBWaWV3Q29udGFpbmVyUmVmLFxuICBUZW1wbGF0ZVJlZixcbiAgRW1iZWRkZWRWaWV3UmVmLFxuICBUcmFja0J5Rm5cbn0gZnJvbSAnYW5ndWxhcjIvY29yZSc7XG5pbXBvcnQge2lzUHJlc2VudCwgaXNCbGFuaywgc3RyaW5naWZ5LCBnZXRUeXBlTmFtZUZvckRlYnVnZ2luZ30gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9sYW5nJztcbmltcG9ydCB7XG4gIERlZmF1bHRJdGVyYWJsZURpZmZlcixcbiAgQ29sbGVjdGlvbkNoYW5nZVJlY29yZFxufSBmcm9tIFwiLi4vLi4vY29yZS9jaGFuZ2VfZGV0ZWN0aW9uL2RpZmZlcnMvZGVmYXVsdF9pdGVyYWJsZV9kaWZmZXJcIjtcbmltcG9ydCB7QmFzZUV4Y2VwdGlvbn0gZnJvbSBcIi4uLy4uL2ZhY2FkZS9leGNlcHRpb25zXCI7XG5cbi8qKlxuICogVGhlIGBOZ0ZvcmAgZGlyZWN0aXZlIGluc3RhbnRpYXRlcyBhIHRlbXBsYXRlIG9uY2UgcGVyIGl0ZW0gZnJvbSBhbiBpdGVyYWJsZS4gVGhlIGNvbnRleHQgZm9yXG4gKiBlYWNoIGluc3RhbnRpYXRlZCB0ZW1wbGF0ZSBpbmhlcml0cyBmcm9tIHRoZSBvdXRlciBjb250ZXh0IHdpdGggdGhlIGdpdmVuIGxvb3AgdmFyaWFibGUgc2V0XG4gKiB0byB0aGUgY3VycmVudCBpdGVtIGZyb20gdGhlIGl0ZXJhYmxlLlxuICpcbiAqICMgTG9jYWwgVmFyaWFibGVzXG4gKlxuICogYE5nRm9yYCBwcm92aWRlcyBzZXZlcmFsIGV4cG9ydGVkIHZhbHVlcyB0aGF0IGNhbiBiZSBhbGlhc2VkIHRvIGxvY2FsIHZhcmlhYmxlczpcbiAqXG4gKiAqIGBpbmRleGAgd2lsbCBiZSBzZXQgdG8gdGhlIGN1cnJlbnQgbG9vcCBpdGVyYXRpb24gZm9yIGVhY2ggdGVtcGxhdGUgY29udGV4dC5cbiAqICogYGZpcnN0YCB3aWxsIGJlIHNldCB0byBhIGJvb2xlYW4gdmFsdWUgaW5kaWNhdGluZyB3aGV0aGVyIHRoZSBpdGVtIGlzIHRoZSBmaXJzdCBvbmUgaW4gdGhlXG4gKiAgIGl0ZXJhdGlvbi5cbiAqICogYGxhc3RgIHdpbGwgYmUgc2V0IHRvIGEgYm9vbGVhbiB2YWx1ZSBpbmRpY2F0aW5nIHdoZXRoZXIgdGhlIGl0ZW0gaXMgdGhlIGxhc3Qgb25lIGluIHRoZVxuICogICBpdGVyYXRpb24uXG4gKiAqIGBldmVuYCB3aWxsIGJlIHNldCB0byBhIGJvb2xlYW4gdmFsdWUgaW5kaWNhdGluZyB3aGV0aGVyIHRoaXMgaXRlbSBoYXMgYW4gZXZlbiBpbmRleC5cbiAqICogYG9kZGAgd2lsbCBiZSBzZXQgdG8gYSBib29sZWFuIHZhbHVlIGluZGljYXRpbmcgd2hldGhlciB0aGlzIGl0ZW0gaGFzIGFuIG9kZCBpbmRleC5cbiAqXG4gKiAjIENoYW5nZSBQcm9wYWdhdGlvblxuICpcbiAqIFdoZW4gdGhlIGNvbnRlbnRzIG9mIHRoZSBpdGVyYXRvciBjaGFuZ2VzLCBgTmdGb3JgIG1ha2VzIHRoZSBjb3JyZXNwb25kaW5nIGNoYW5nZXMgdG8gdGhlIERPTTpcbiAqXG4gKiAqIFdoZW4gYW4gaXRlbSBpcyBhZGRlZCwgYSBuZXcgaW5zdGFuY2Ugb2YgdGhlIHRlbXBsYXRlIGlzIGFkZGVkIHRvIHRoZSBET00uXG4gKiAqIFdoZW4gYW4gaXRlbSBpcyByZW1vdmVkLCBpdHMgdGVtcGxhdGUgaW5zdGFuY2UgaXMgcmVtb3ZlZCBmcm9tIHRoZSBET00uXG4gKiAqIFdoZW4gaXRlbXMgYXJlIHJlb3JkZXJlZCwgdGhlaXIgcmVzcGVjdGl2ZSB0ZW1wbGF0ZXMgYXJlIHJlb3JkZXJlZCBpbiB0aGUgRE9NLlxuICogKiBPdGhlcndpc2UsIHRoZSBET00gZWxlbWVudCBmb3IgdGhhdCBpdGVtIHdpbGwgcmVtYWluIHRoZSBzYW1lLlxuICpcbiAqIEFuZ3VsYXIgdXNlcyBvYmplY3QgaWRlbnRpdHkgdG8gdHJhY2sgaW5zZXJ0aW9ucyBhbmQgZGVsZXRpb25zIHdpdGhpbiB0aGUgaXRlcmF0b3IgYW5kIHJlcHJvZHVjZVxuICogdGhvc2UgY2hhbmdlcyBpbiB0aGUgRE9NLiBUaGlzIGhhcyBpbXBvcnRhbnQgaW1wbGljYXRpb25zIGZvciBhbmltYXRpb25zIGFuZCBhbnkgc3RhdGVmdWxcbiAqIGNvbnRyb2xzXG4gKiAoc3VjaCBhcyBgPGlucHV0PmAgZWxlbWVudHMgd2hpY2ggYWNjZXB0IHVzZXIgaW5wdXQpIHRoYXQgYXJlIHByZXNlbnQuIEluc2VydGVkIHJvd3MgY2FuIGJlXG4gKiBhbmltYXRlZCBpbiwgZGVsZXRlZCByb3dzIGNhbiBiZSBhbmltYXRlZCBvdXQsIGFuZCB1bmNoYW5nZWQgcm93cyByZXRhaW4gYW55IHVuc2F2ZWQgc3RhdGUgc3VjaFxuICogYXMgdXNlciBpbnB1dC5cbiAqXG4gKiBJdCBpcyBwb3NzaWJsZSBmb3IgdGhlIGlkZW50aXRpZXMgb2YgZWxlbWVudHMgaW4gdGhlIGl0ZXJhdG9yIHRvIGNoYW5nZSB3aGlsZSB0aGUgZGF0YSBkb2VzIG5vdC5cbiAqIFRoaXMgY2FuIGhhcHBlbiwgZm9yIGV4YW1wbGUsIGlmIHRoZSBpdGVyYXRvciBwcm9kdWNlZCBmcm9tIGFuIFJQQyB0byB0aGUgc2VydmVyLCBhbmQgdGhhdFxuICogUlBDIGlzIHJlLXJ1bi4gRXZlbiBpZiB0aGUgZGF0YSBoYXNuJ3QgY2hhbmdlZCwgdGhlIHNlY29uZCByZXNwb25zZSB3aWxsIHByb2R1Y2Ugb2JqZWN0cyB3aXRoXG4gKiBkaWZmZXJlbnQgaWRlbnRpdGllcywgYW5kIEFuZ3VsYXIgd2lsbCB0ZWFyIGRvd24gdGhlIGVudGlyZSBET00gYW5kIHJlYnVpbGQgaXQgKGFzIGlmIGFsbCBvbGRcbiAqIGVsZW1lbnRzIHdlcmUgZGVsZXRlZCBhbmQgYWxsIG5ldyBlbGVtZW50cyBpbnNlcnRlZCkuIFRoaXMgaXMgYW4gZXhwZW5zaXZlIG9wZXJhdGlvbiBhbmQgc2hvdWxkXG4gKiBiZSBhdm9pZGVkIGlmIHBvc3NpYmxlLlxuICpcbiAqICMgU3ludGF4XG4gKlxuICogLSBgPGxpICpuZ0Zvcj1cIiNpdGVtIG9mIGl0ZW1zOyAjaSA9IGluZGV4XCI+Li4uPC9saT5gXG4gKiAtIGA8bGkgdGVtcGxhdGU9XCJuZ0ZvciAjaXRlbSBvZiBpdGVtczsgI2kgPSBpbmRleFwiPi4uLjwvbGk+YFxuICogLSBgPHRlbXBsYXRlIG5nRm9yICNpdGVtIFtuZ0Zvck9mXT1cIml0ZW1zXCIgI2k9XCJpbmRleFwiPjxsaT4uLi48L2xpPjwvdGVtcGxhdGU+YFxuICpcbiAqICMjIyBFeGFtcGxlXG4gKlxuICogU2VlIGEgW2xpdmUgZGVtb10oaHR0cDovL3BsbmtyLmNvL2VkaXQvS1Z1WHhEcDBxaW5HRHlvMzA3UVc/cD1wcmV2aWV3KSBmb3IgYSBtb3JlIGRldGFpbGVkXG4gKiBleGFtcGxlLlxuICovXG5ARGlyZWN0aXZlKHtzZWxlY3RvcjogJ1tuZ0Zvcl1bbmdGb3JPZl0nLCBpbnB1dHM6IFsnbmdGb3JUcmFja0J5JywgJ25nRm9yT2YnLCAnbmdGb3JUZW1wbGF0ZSddfSlcbmV4cG9ydCBjbGFzcyBOZ0ZvciBpbXBsZW1lbnRzIERvQ2hlY2sge1xuICAvKiogQGludGVybmFsICovXG4gIF9uZ0Zvck9mOiBhbnk7XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX25nRm9yVHJhY2tCeTogVHJhY2tCeUZuO1xuICBwcml2YXRlIF9kaWZmZXI6IEl0ZXJhYmxlRGlmZmVyO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgX3ZpZXdDb250YWluZXI6IFZpZXdDb250YWluZXJSZWYsIHByaXZhdGUgX3RlbXBsYXRlUmVmOiBUZW1wbGF0ZVJlZixcbiAgICAgICAgICAgICAgcHJpdmF0ZSBfaXRlcmFibGVEaWZmZXJzOiBJdGVyYWJsZURpZmZlcnMsIHByaXZhdGUgX2NkcjogQ2hhbmdlRGV0ZWN0b3JSZWYpIHt9XG5cbiAgc2V0IG5nRm9yT2YodmFsdWU6IGFueSkge1xuICAgIHRoaXMuX25nRm9yT2YgPSB2YWx1ZTtcbiAgICBpZiAoaXNCbGFuayh0aGlzLl9kaWZmZXIpICYmIGlzUHJlc2VudCh2YWx1ZSkpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHRoaXMuX2RpZmZlciA9IHRoaXMuX2l0ZXJhYmxlRGlmZmVycy5maW5kKHZhbHVlKS5jcmVhdGUodGhpcy5fY2RyLCB0aGlzLl9uZ0ZvclRyYWNrQnkpO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICB0aHJvdyBuZXcgQmFzZUV4Y2VwdGlvbihcbiAgICAgICAgICAgIGBDYW5ub3QgZmluZCBhIGRpZmZlciBzdXBwb3J0aW5nIG9iamVjdCAnJHt2YWx1ZX0nIG9mIHR5cGUgJyR7Z2V0VHlwZU5hbWVGb3JEZWJ1Z2dpbmcodmFsdWUpfScuIE5nRm9yIG9ubHkgc3VwcG9ydHMgYmluZGluZyB0byBJdGVyYWJsZXMgc3VjaCBhcyBBcnJheXMuYCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgc2V0IG5nRm9yVGVtcGxhdGUodmFsdWU6IFRlbXBsYXRlUmVmKSB7XG4gICAgaWYgKGlzUHJlc2VudCh2YWx1ZSkpIHtcbiAgICAgIHRoaXMuX3RlbXBsYXRlUmVmID0gdmFsdWU7XG4gICAgfVxuICB9XG5cbiAgc2V0IG5nRm9yVHJhY2tCeSh2YWx1ZTogVHJhY2tCeUZuKSB7IHRoaXMuX25nRm9yVHJhY2tCeSA9IHZhbHVlOyB9XG5cbiAgbmdEb0NoZWNrKCkge1xuICAgIGlmIChpc1ByZXNlbnQodGhpcy5fZGlmZmVyKSkge1xuICAgICAgdmFyIGNoYW5nZXMgPSB0aGlzLl9kaWZmZXIuZGlmZih0aGlzLl9uZ0Zvck9mKTtcbiAgICAgIGlmIChpc1ByZXNlbnQoY2hhbmdlcykpIHRoaXMuX2FwcGx5Q2hhbmdlcyhjaGFuZ2VzKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF9hcHBseUNoYW5nZXMoY2hhbmdlczogRGVmYXVsdEl0ZXJhYmxlRGlmZmVyKSB7XG4gICAgLy8gVE9ETyhyYWRvKTogY2hlY2sgaWYgY2hhbmdlIGRldGVjdGlvbiBjYW4gcHJvZHVjZSBhIGNoYW5nZSByZWNvcmQgdGhhdCBpc1xuICAgIC8vIGVhc2llciB0byBjb25zdW1lIHRoYW4gY3VycmVudC5cbiAgICB2YXIgcmVjb3JkVmlld1R1cGxlczogUmVjb3JkVmlld1R1cGxlW10gPSBbXTtcbiAgICBjaGFuZ2VzLmZvckVhY2hSZW1vdmVkSXRlbSgocmVtb3ZlZFJlY29yZDogQ29sbGVjdGlvbkNoYW5nZVJlY29yZCkgPT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVjb3JkVmlld1R1cGxlcy5wdXNoKG5ldyBSZWNvcmRWaWV3VHVwbGUocmVtb3ZlZFJlY29yZCwgbnVsbCkpKTtcblxuICAgIGNoYW5nZXMuZm9yRWFjaE1vdmVkSXRlbSgobW92ZWRSZWNvcmQ6IENvbGxlY3Rpb25DaGFuZ2VSZWNvcmQpID0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWNvcmRWaWV3VHVwbGVzLnB1c2gobmV3IFJlY29yZFZpZXdUdXBsZShtb3ZlZFJlY29yZCwgbnVsbCkpKTtcblxuICAgIHZhciBpbnNlcnRUdXBsZXMgPSB0aGlzLl9idWxrUmVtb3ZlKHJlY29yZFZpZXdUdXBsZXMpO1xuXG4gICAgY2hhbmdlcy5mb3JFYWNoQWRkZWRJdGVtKChhZGRlZFJlY29yZDogQ29sbGVjdGlvbkNoYW5nZVJlY29yZCkgPT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluc2VydFR1cGxlcy5wdXNoKG5ldyBSZWNvcmRWaWV3VHVwbGUoYWRkZWRSZWNvcmQsIG51bGwpKSk7XG5cbiAgICB0aGlzLl9idWxrSW5zZXJ0KGluc2VydFR1cGxlcyk7XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGluc2VydFR1cGxlcy5sZW5ndGg7IGkrKykge1xuICAgICAgdGhpcy5fcGVyVmlld0NoYW5nZShpbnNlcnRUdXBsZXNbaV0udmlldywgaW5zZXJ0VHVwbGVzW2ldLnJlY29yZCk7XG4gICAgfVxuXG4gICAgZm9yICh2YXIgaSA9IDAsIGlsZW4gPSB0aGlzLl92aWV3Q29udGFpbmVyLmxlbmd0aDsgaSA8IGlsZW47IGkrKykge1xuICAgICAgdmFyIHZpZXdSZWYgPSA8RW1iZWRkZWRWaWV3UmVmPnRoaXMuX3ZpZXdDb250YWluZXIuZ2V0KGkpO1xuICAgICAgdmlld1JlZi5zZXRMb2NhbCgnZmlyc3QnLCBpID09PSAwKTtcbiAgICAgIHZpZXdSZWYuc2V0TG9jYWwoJ2xhc3QnLCBpID09PSBpbGVuIC0gMSk7XG4gICAgfVxuXG4gICAgY2hhbmdlcy5mb3JFYWNoSWRlbnRpdHlDaGFuZ2UoKHJlY29yZCkgPT4ge1xuICAgICAgdmFyIHZpZXdSZWYgPSA8RW1iZWRkZWRWaWV3UmVmPnRoaXMuX3ZpZXdDb250YWluZXIuZ2V0KHJlY29yZC5jdXJyZW50SW5kZXgpO1xuICAgICAgdmlld1JlZi5zZXRMb2NhbCgnXFwkaW1wbGljaXQnLCByZWNvcmQuaXRlbSk7XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIF9wZXJWaWV3Q2hhbmdlKHZpZXc6IEVtYmVkZGVkVmlld1JlZiwgcmVjb3JkOiBDb2xsZWN0aW9uQ2hhbmdlUmVjb3JkKSB7XG4gICAgdmlldy5zZXRMb2NhbCgnXFwkaW1wbGljaXQnLCByZWNvcmQuaXRlbSk7XG4gICAgdmlldy5zZXRMb2NhbCgnaW5kZXgnLCByZWNvcmQuY3VycmVudEluZGV4KTtcbiAgICB2aWV3LnNldExvY2FsKCdldmVuJywgKHJlY29yZC5jdXJyZW50SW5kZXggJSAyID09IDApKTtcbiAgICB2aWV3LnNldExvY2FsKCdvZGQnLCAocmVjb3JkLmN1cnJlbnRJbmRleCAlIDIgPT0gMSkpO1xuICB9XG5cbiAgcHJpdmF0ZSBfYnVsa1JlbW92ZSh0dXBsZXM6IFJlY29yZFZpZXdUdXBsZVtdKTogUmVjb3JkVmlld1R1cGxlW10ge1xuICAgIHR1cGxlcy5zb3J0KChhOiBSZWNvcmRWaWV3VHVwbGUsIGI6IFJlY29yZFZpZXdUdXBsZSkgPT5cbiAgICAgICAgICAgICAgICAgICAgYS5yZWNvcmQucHJldmlvdXNJbmRleCAtIGIucmVjb3JkLnByZXZpb3VzSW5kZXgpO1xuICAgIHZhciBtb3ZlZFR1cGxlczogUmVjb3JkVmlld1R1cGxlW10gPSBbXTtcbiAgICBmb3IgKHZhciBpID0gdHVwbGVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICB2YXIgdHVwbGUgPSB0dXBsZXNbaV07XG4gICAgICAvLyBzZXBhcmF0ZSBtb3ZlZCB2aWV3cyBmcm9tIHJlbW92ZWQgdmlld3MuXG4gICAgICBpZiAoaXNQcmVzZW50KHR1cGxlLnJlY29yZC5jdXJyZW50SW5kZXgpKSB7XG4gICAgICAgIHR1cGxlLnZpZXcgPSB0aGlzLl92aWV3Q29udGFpbmVyLmRldGFjaCh0dXBsZS5yZWNvcmQucHJldmlvdXNJbmRleCk7XG4gICAgICAgIG1vdmVkVHVwbGVzLnB1c2godHVwbGUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fdmlld0NvbnRhaW5lci5yZW1vdmUodHVwbGUucmVjb3JkLnByZXZpb3VzSW5kZXgpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbW92ZWRUdXBsZXM7XG4gIH1cblxuICBwcml2YXRlIF9idWxrSW5zZXJ0KHR1cGxlczogUmVjb3JkVmlld1R1cGxlW10pOiBSZWNvcmRWaWV3VHVwbGVbXSB7XG4gICAgdHVwbGVzLnNvcnQoKGEsIGIpID0+IGEucmVjb3JkLmN1cnJlbnRJbmRleCAtIGIucmVjb3JkLmN1cnJlbnRJbmRleCk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0dXBsZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciB0dXBsZSA9IHR1cGxlc1tpXTtcbiAgICAgIGlmIChpc1ByZXNlbnQodHVwbGUudmlldykpIHtcbiAgICAgICAgdGhpcy5fdmlld0NvbnRhaW5lci5pbnNlcnQodHVwbGUudmlldywgdHVwbGUucmVjb3JkLmN1cnJlbnRJbmRleCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0dXBsZS52aWV3ID1cbiAgICAgICAgICAgIHRoaXMuX3ZpZXdDb250YWluZXIuY3JlYXRlRW1iZWRkZWRWaWV3KHRoaXMuX3RlbXBsYXRlUmVmLCB0dXBsZS5yZWNvcmQuY3VycmVudEluZGV4KTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHR1cGxlcztcbiAgfVxufVxuXG5jbGFzcyBSZWNvcmRWaWV3VHVwbGUge1xuICB2aWV3OiBFbWJlZGRlZFZpZXdSZWY7XG4gIHJlY29yZDogYW55O1xuICBjb25zdHJ1Y3RvcihyZWNvcmQ6IGFueSwgdmlldzogRW1iZWRkZWRWaWV3UmVmKSB7XG4gICAgdGhpcy5yZWNvcmQgPSByZWNvcmQ7XG4gICAgdGhpcy52aWV3ID0gdmlldztcbiAgfVxufVxuIl19