import { Renderer, ElementRef, OnDestroy } from 'angular2/core';
import { ControlValueAccessor } from './control_value_accessor';
/**
 * The accessor for writing a value and listening to changes on a select element.
 */
export declare class SelectControlValueAccessor implements ControlValueAccessor {
    private _renderer;
    private _elementRef;
    value: any;
    onChange: (_: any) => void;
    onTouched: () => void;
    constructor(_renderer: Renderer, _elementRef: ElementRef);
    writeValue(value: any): void;
    registerOnChange(fn: (value: any) => any): void;
    registerOnTouched(fn: () => any): void;
}
/**
 * Marks `<option>` as dynamic, so Angular can be notified when options change.
 *
 * ### Example
 *
 * ```
 * <select ngControl="city">
 *   <option *ngFor="#c of cities" [value]="c"></option>
 * </select>
 * ```
 */
export declare class NgSelectOption implements OnDestroy {
    private _element;
    private _renderer;
    private _select;
    id: string;
    constructor(_element: ElementRef, _renderer: Renderer, _select: SelectControlValueAccessor);
    ngValue: any;
    value: any;
    ngOnDestroy(): void;
}
