import { Component, OnChanges, SimpleChange, Input, Output, EventEmitter } from "@angular/core";

@Component({
	selector: 'list-query',
	templateUrl: './app/features/list/list.query.component.html',
	inputs: ['savedQueryList', 'newQuery']
})

export class ListQueryComponent {
	@Input() savedQueryList;
	@Output() newQuery = new EventEmitter<boolean>();

	applyQuery(queryData) {
		this.newQuery.emit(queryData);
	}
	
}
