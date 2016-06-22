import { PipeTransform } from '@angular/core';
/**
 * Transforms any input value using `JSON.stringify`. Useful for debugging.
 *
 * ### Example
 * {@example core/pipes/ts/json_pipe/json_pipe_example.ts region='JsonPipe'}
 */
export declare class JsonPipe implements PipeTransform {
    transform(value: any): string;
}
