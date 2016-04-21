var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { isBlank, isString, isArray, StringWrapper } from 'angular2/src/facade/lang';
import { BaseException } from 'angular2/src/facade/exceptions';
import { ListWrapper } from 'angular2/src/facade/collection';
import { Injectable, Pipe } from 'angular2/core';
import { InvalidPipeArgumentException } from './invalid_pipe_argument_exception';
/**
 * Creates a new List or String containing only a subset (slice) of the
 * elements.
 *
 * The starting index of the subset to return is specified by the `start` parameter.
 *
 * The ending index of the subset to return is specified by the optional `end` parameter.
 *
 * ### Usage
 *
 *     expression | slice:start[:end]
 *
 * All behavior is based on the expected behavior of the JavaScript API
 * Array.prototype.slice() and String.prototype.slice()
 *
 * Where the input expression is a [List] or [String], and `start` is:
 *
 * - **a positive integer**: return the item at _start_ index and all items after
 * in the list or string expression.
 * - **a negative integer**: return the item at _start_ index from the end and all items after
 * in the list or string expression.
 * - **`|start|` greater than the size of the expression**: return an empty list or string.
 * - **`|start|` negative greater than the size of the expression**: return entire list or
 * string expression.
 *
 * and where `end` is:
 *
 * - **omitted**: return all items until the end of the input
 * - **a positive integer**: return all items before _end_ index of the list or string
 * expression.
 * - **a negative integer**: return all items before _end_ index from the end of the list
 * or string expression.
 *
 * When operating on a [List], the returned list is always a copy even when all
 * the elements are being returned.
 *
 * ## List Example
 *
 * This `ngFor` example:
 *
 * {@example core/pipes/ts/slice_pipe/slice_pipe_example.ts region='SlicePipe_list'}
 *
 * produces the following:
 *
 *     <li>b</li>
 *     <li>c</li>
 *
 * ## String Examples
 *
 * {@example core/pipes/ts/slice_pipe/slice_pipe_example.ts region='SlicePipe_string'}
 */
let SlicePipe_1;
export let SlicePipe = SlicePipe_1 = class SlicePipe {
    transform(value, args = null) {
        if (isBlank(args) || args.length == 0) {
            throw new BaseException('Slice pipe requires one argument');
        }
        if (!this.supports(value)) {
            throw new InvalidPipeArgumentException(SlicePipe_1, value);
        }
        if (isBlank(value))
            return value;
        var start = args[0];
        var end = args.length > 1 ? args[1] : null;
        if (isString(value)) {
            return StringWrapper.slice(value, start, end);
        }
        return ListWrapper.slice(value, start, end);
    }
    supports(obj) { return isString(obj) || isArray(obj); }
};
SlicePipe = SlicePipe_1 = __decorate([
    Pipe({ name: 'slice', pure: false }),
    Injectable(), 
    __metadata('design:paramtypes', [])
], SlicePipe);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2xpY2VfcGlwZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRpZmZpbmdfcGx1Z2luX3dyYXBwZXItb3V0cHV0X3BhdGgtb1hETzRwMnYudG1wL2FuZ3VsYXIyL3NyYy9jb21tb24vcGlwZXMvc2xpY2VfcGlwZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7T0FBTyxFQUFDLE9BQU8sRUFBRSxRQUFRLEVBQUUsT0FBTyxFQUFFLGFBQWEsRUFBUSxNQUFNLDBCQUEwQjtPQUNsRixFQUFDLGFBQWEsRUFBQyxNQUFNLGdDQUFnQztPQUNyRCxFQUFDLFdBQVcsRUFBQyxNQUFNLGdDQUFnQztPQUNuRCxFQUFDLFVBQVUsRUFBK0IsSUFBSSxFQUFDLE1BQU0sZUFBZTtPQUNwRSxFQUFDLDRCQUE0QixFQUFDLE1BQU0sbUNBQW1DO0FBRTlFOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQWtERztBQUlIOztJQUNFLFNBQVMsQ0FBQyxLQUFVLEVBQUUsSUFBSSxHQUFVLElBQUk7UUFDdEMsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxNQUFNLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN0QyxNQUFNLElBQUksYUFBYSxDQUFDLGtDQUFrQyxDQUFDLENBQUM7UUFDOUQsQ0FBQztRQUNELEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDMUIsTUFBTSxJQUFJLDRCQUE0QixDQUFDLFdBQVMsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUMzRCxDQUFDO1FBQ0QsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQztRQUNqQyxJQUFJLEtBQUssR0FBVyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDNUIsSUFBSSxHQUFHLEdBQVcsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztRQUNuRCxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3BCLE1BQU0sQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDaEQsQ0FBQztRQUNELE1BQU0sQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFDOUMsQ0FBQztJQUVPLFFBQVEsQ0FBQyxHQUFRLElBQWEsTUFBTSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsSUFBSSxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQy9FLENBQUM7QUFwQkQ7SUFBQyxJQUFJLENBQUMsRUFBQyxJQUFJLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUMsQ0FBQztJQUNsQyxVQUFVLEVBQUU7O2FBQUE7QUFtQloiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge2lzQmxhbmssIGlzU3RyaW5nLCBpc0FycmF5LCBTdHJpbmdXcmFwcGVyLCBDT05TVH0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9sYW5nJztcbmltcG9ydCB7QmFzZUV4Y2VwdGlvbn0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9leGNlcHRpb25zJztcbmltcG9ydCB7TGlzdFdyYXBwZXJ9IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvY29sbGVjdGlvbic7XG5pbXBvcnQge0luamVjdGFibGUsIFBpcGVUcmFuc2Zvcm0sIFdyYXBwZWRWYWx1ZSwgUGlwZX0gZnJvbSAnYW5ndWxhcjIvY29yZSc7XG5pbXBvcnQge0ludmFsaWRQaXBlQXJndW1lbnRFeGNlcHRpb259IGZyb20gJy4vaW52YWxpZF9waXBlX2FyZ3VtZW50X2V4Y2VwdGlvbic7XG5cbi8qKlxuICogQ3JlYXRlcyBhIG5ldyBMaXN0IG9yIFN0cmluZyBjb250YWluaW5nIG9ubHkgYSBzdWJzZXQgKHNsaWNlKSBvZiB0aGVcbiAqIGVsZW1lbnRzLlxuICpcbiAqIFRoZSBzdGFydGluZyBpbmRleCBvZiB0aGUgc3Vic2V0IHRvIHJldHVybiBpcyBzcGVjaWZpZWQgYnkgdGhlIGBzdGFydGAgcGFyYW1ldGVyLlxuICpcbiAqIFRoZSBlbmRpbmcgaW5kZXggb2YgdGhlIHN1YnNldCB0byByZXR1cm4gaXMgc3BlY2lmaWVkIGJ5IHRoZSBvcHRpb25hbCBgZW5kYCBwYXJhbWV0ZXIuXG4gKlxuICogIyMjIFVzYWdlXG4gKlxuICogICAgIGV4cHJlc3Npb24gfCBzbGljZTpzdGFydFs6ZW5kXVxuICpcbiAqIEFsbCBiZWhhdmlvciBpcyBiYXNlZCBvbiB0aGUgZXhwZWN0ZWQgYmVoYXZpb3Igb2YgdGhlIEphdmFTY3JpcHQgQVBJXG4gKiBBcnJheS5wcm90b3R5cGUuc2xpY2UoKSBhbmQgU3RyaW5nLnByb3RvdHlwZS5zbGljZSgpXG4gKlxuICogV2hlcmUgdGhlIGlucHV0IGV4cHJlc3Npb24gaXMgYSBbTGlzdF0gb3IgW1N0cmluZ10sIGFuZCBgc3RhcnRgIGlzOlxuICpcbiAqIC0gKiphIHBvc2l0aXZlIGludGVnZXIqKjogcmV0dXJuIHRoZSBpdGVtIGF0IF9zdGFydF8gaW5kZXggYW5kIGFsbCBpdGVtcyBhZnRlclxuICogaW4gdGhlIGxpc3Qgb3Igc3RyaW5nIGV4cHJlc3Npb24uXG4gKiAtICoqYSBuZWdhdGl2ZSBpbnRlZ2VyKio6IHJldHVybiB0aGUgaXRlbSBhdCBfc3RhcnRfIGluZGV4IGZyb20gdGhlIGVuZCBhbmQgYWxsIGl0ZW1zIGFmdGVyXG4gKiBpbiB0aGUgbGlzdCBvciBzdHJpbmcgZXhwcmVzc2lvbi5cbiAqIC0gKipgfHN0YXJ0fGAgZ3JlYXRlciB0aGFuIHRoZSBzaXplIG9mIHRoZSBleHByZXNzaW9uKio6IHJldHVybiBhbiBlbXB0eSBsaXN0IG9yIHN0cmluZy5cbiAqIC0gKipgfHN0YXJ0fGAgbmVnYXRpdmUgZ3JlYXRlciB0aGFuIHRoZSBzaXplIG9mIHRoZSBleHByZXNzaW9uKio6IHJldHVybiBlbnRpcmUgbGlzdCBvclxuICogc3RyaW5nIGV4cHJlc3Npb24uXG4gKlxuICogYW5kIHdoZXJlIGBlbmRgIGlzOlxuICpcbiAqIC0gKipvbWl0dGVkKio6IHJldHVybiBhbGwgaXRlbXMgdW50aWwgdGhlIGVuZCBvZiB0aGUgaW5wdXRcbiAqIC0gKiphIHBvc2l0aXZlIGludGVnZXIqKjogcmV0dXJuIGFsbCBpdGVtcyBiZWZvcmUgX2VuZF8gaW5kZXggb2YgdGhlIGxpc3Qgb3Igc3RyaW5nXG4gKiBleHByZXNzaW9uLlxuICogLSAqKmEgbmVnYXRpdmUgaW50ZWdlcioqOiByZXR1cm4gYWxsIGl0ZW1zIGJlZm9yZSBfZW5kXyBpbmRleCBmcm9tIHRoZSBlbmQgb2YgdGhlIGxpc3RcbiAqIG9yIHN0cmluZyBleHByZXNzaW9uLlxuICpcbiAqIFdoZW4gb3BlcmF0aW5nIG9uIGEgW0xpc3RdLCB0aGUgcmV0dXJuZWQgbGlzdCBpcyBhbHdheXMgYSBjb3B5IGV2ZW4gd2hlbiBhbGxcbiAqIHRoZSBlbGVtZW50cyBhcmUgYmVpbmcgcmV0dXJuZWQuXG4gKlxuICogIyMgTGlzdCBFeGFtcGxlXG4gKlxuICogVGhpcyBgbmdGb3JgIGV4YW1wbGU6XG4gKlxuICoge0BleGFtcGxlIGNvcmUvcGlwZXMvdHMvc2xpY2VfcGlwZS9zbGljZV9waXBlX2V4YW1wbGUudHMgcmVnaW9uPSdTbGljZVBpcGVfbGlzdCd9XG4gKlxuICogcHJvZHVjZXMgdGhlIGZvbGxvd2luZzpcbiAqXG4gKiAgICAgPGxpPmI8L2xpPlxuICogICAgIDxsaT5jPC9saT5cbiAqXG4gKiAjIyBTdHJpbmcgRXhhbXBsZXNcbiAqXG4gKiB7QGV4YW1wbGUgY29yZS9waXBlcy90cy9zbGljZV9waXBlL3NsaWNlX3BpcGVfZXhhbXBsZS50cyByZWdpb249J1NsaWNlUGlwZV9zdHJpbmcnfVxuICovXG5cbkBQaXBlKHtuYW1lOiAnc2xpY2UnLCBwdXJlOiBmYWxzZX0pXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgU2xpY2VQaXBlIGltcGxlbWVudHMgUGlwZVRyYW5zZm9ybSB7XG4gIHRyYW5zZm9ybSh2YWx1ZTogYW55LCBhcmdzOiBhbnlbXSA9IG51bGwpOiBhbnkge1xuICAgIGlmIChpc0JsYW5rKGFyZ3MpIHx8IGFyZ3MubGVuZ3RoID09IDApIHtcbiAgICAgIHRocm93IG5ldyBCYXNlRXhjZXB0aW9uKCdTbGljZSBwaXBlIHJlcXVpcmVzIG9uZSBhcmd1bWVudCcpO1xuICAgIH1cbiAgICBpZiAoIXRoaXMuc3VwcG9ydHModmFsdWUpKSB7XG4gICAgICB0aHJvdyBuZXcgSW52YWxpZFBpcGVBcmd1bWVudEV4Y2VwdGlvbihTbGljZVBpcGUsIHZhbHVlKTtcbiAgICB9XG4gICAgaWYgKGlzQmxhbmsodmFsdWUpKSByZXR1cm4gdmFsdWU7XG4gICAgdmFyIHN0YXJ0OiBudW1iZXIgPSBhcmdzWzBdO1xuICAgIHZhciBlbmQ6IG51bWJlciA9IGFyZ3MubGVuZ3RoID4gMSA/IGFyZ3NbMV0gOiBudWxsO1xuICAgIGlmIChpc1N0cmluZyh2YWx1ZSkpIHtcbiAgICAgIHJldHVybiBTdHJpbmdXcmFwcGVyLnNsaWNlKHZhbHVlLCBzdGFydCwgZW5kKTtcbiAgICB9XG4gICAgcmV0dXJuIExpc3RXcmFwcGVyLnNsaWNlKHZhbHVlLCBzdGFydCwgZW5kKTtcbiAgfVxuXG4gIHByaXZhdGUgc3VwcG9ydHMob2JqOiBhbnkpOiBib29sZWFuIHsgcmV0dXJuIGlzU3RyaW5nKG9iaikgfHwgaXNBcnJheShvYmopOyB9XG59XG4iXX0=