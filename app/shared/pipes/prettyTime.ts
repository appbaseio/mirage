import {Pipe, PipeTransform} from '@angular/core';
declare var moment;

@Pipe({name: 'prettyTime'})
export class prettyTime implements PipeTransform {
  transform(value : Object) : any {
  	console.log(moment(value).fromNow(true));
  	return moment(value).fromNow(true);
  }
}