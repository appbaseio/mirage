import { Component, OnChanges, SimpleChange, Input, Output, EventEmitter } from "@angular/core";

@Component({
	selector: 'list-query',
	templateUrl: './app/features/list/list.query.component.html',
	inputs: ['savedQueryList', 'newQuery', 'deleteQuery', 'clearAll']
})

export class ListQueryComponent {
	@Input() savedQueryList;
	@Output() newQuery = new EventEmitter<boolean>();
	@Output() deleteQuery = new EventEmitter<any>();
	@Output() clearAll = new EventEmitter();

	applyQuery(queryData) {
		this.newQuery.emit(queryData);
	}

	applyDeleteQuery(index) {
		this.deleteQuery.emit(index);
	}	

	applyClearAll() {
		this.clearAll.emit(null);
	}
}
