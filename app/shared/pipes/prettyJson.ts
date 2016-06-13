import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'prettyJson'})
export class prettyJson implements PipeTransform {
  transform(value : Object) : any {
	return JSON.stringify(value, null, 4);
  }
}
