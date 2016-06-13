import { Component, OnInit, OnChanges, SimpleChange, Input, Output, EventEmitter } from "@angular/core";
import { prettyTime } from "../../shared/pipes/prettyTime";

@Component({
	selector: 'list-query',
	templateUrl: './app/features/list/list.query.component.html',
	inputs: ['savedQueryList', 'newQuery', 'deleteQuery', 'clearAll'],
	pipes: [prettyTime]
})

export class ListQueryComponent implements OnInit, OnChanges {
	@Input() savedQueryList;
	@Input() sort_by;
	@Input() sort_direction;
	@Input() searchTerm;
	@Input() filteredQuery;
	@Output() newQuery = new EventEmitter < boolean > ();
	@Output() deleteQuery = new EventEmitter < any > ();
	@Output() clearAll = new EventEmitter < any > ();
	@Output() sort = new EventEmitter < any > ();
	@Output() searchList = new EventEmitter < any > ();
	public direction: boolean = false;

	ngOnInit() {}

	applyQuery(queryData) {
		this.newQuery.emit(queryData);
	}

	applyDeleteQuery(index) {
		this.deleteQuery.emit(index);
	}

	applyClearAll() {
		this.clearAll.emit(null);
	}

	applySearchList() {
		this.searchList.emit(null);
	}

}
