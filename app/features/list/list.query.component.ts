import { Component, OnInit, OnChanges, SimpleChange, Input, Output, EventEmitter } from "@angular/core";

@Component({
	selector: 'list-query',
	templateUrl: './app/features/list/list.query.component.html',
	inputs: ['savedQueryList', 'newQuery', 'deleteQuery', 'clearAll']
})

export class ListQueryComponent implements OnInit {
	@Input() savedQueryList;
	@Output() newQuery = new EventEmitter<boolean>();
	@Output() deleteQuery = new EventEmitter<any>();
	@Output() clearAll = new EventEmitter();
	public direction: boolean = true;
	public prop: string = 'createdAt';
	public searchTerm: string = '';
	public filteredQuery: any;

	ngOnInit() {
		this.sortBy(this.prop);
	}

	applyQuery(queryData) {
		this.newQuery.emit(queryData);
	}

	applyDeleteQuery(index) {
		this.deleteQuery.emit(index);
	}	

	applyClearAll() {
		this.clearAll.emit(null);
	}

	sortBy(prop) {
		if(prop == this.prop) {
			this.direction = this.direction ? false : true; 
		} else {
			this.direction = true;
			this.prop = prop;
		}
		if(this.direction) {
			this.filteredQuery = this.savedQueryList.sortBy(function(item) {
				return item[prop];
			});
		} else {
			this.filteredQuery = this.savedQueryList.sortBy(function(item) {
				return -item[prop];
			});
		}
	}

	searchList() {
		if(this.searchTerm.trim().length > 1) {
			this.filteredQuery = this.savedQueryList.filter(function(item) {
				return item.tag.indexOf(this.searchTerm) !== -1 ? true:false;
			}.bind(this));

			if(!this.filteredQuery.length) {
				this.filteredQuery = this.savedQueryList.filter(function(item) {
					return item.name.indexOf(this.searchTerm) !== -1 ? true:false;
				}.bind(this));				
			}
		} else {
			this.filteredQuery = this.savedQueryList;
		}
	}
}
