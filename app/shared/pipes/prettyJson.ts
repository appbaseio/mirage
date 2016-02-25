import {Pipe, PipeTransform} from 'angular2/core';
/*
 * Raise the value exponentially
 * Takes an exponent argument that defaults to 1.
 * Usage:
 *   value | exponentialStrength:exponent
 * Example:
 *   {{ 2 |  exponentialStrength:10}}
 *   formats to: 1024
*/
@Pipe({name: 'prettyJson'})
export class prettyJson implements PipeTransform {
  transform(value : Object) : any {
	return JSON.stringify(value, null, 4);
  }
}