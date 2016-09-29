import { Component, OnInit, OnChanges, SimpleChange, Input, Output, EventEmitter } from "@angular/core";
import { TimeComponent } from "./time/time.component";

@Component({
	selector: 'list-query',
	templateUrl: './app/features/list/list.query.component.html',
	inputs: ['savedQueryList', 'newQuery', 'deleteQuery', 'clearAll'],
	directives: [TimeComponent]
})

export class ListQueryComponent implements OnInit {
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

	applyQuery(currentQuery) {
		var queryData = this.savedQueryList.filter(function(query) {
			return query.name === currentQuery.name && query.tag === currentQuery.tag;
		});
		if(queryData.length) {
			this.newQuery.emit(queryData[0]);
		}
	}

	applyDeleteQuery(query) {
		this.deleteQuery.emit(query);
	}

	applyClearAll() {
		this.clearAll.emit(null);
	}

	applySearchList() {
		this.searchList.emit({
			searchTerm: this.searchTerm,
			method: this.method
		});
	}

	tagApply(event, tag, method) {
		this.searchTerm = tag;
		this.method = method;
		this.applySearchList();
		event.stopPropagation();
	}

}
