import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from "@angular/core";

@Component({
	selector: 'missing-query',
	template: 	`<span class="col-xs-6 pd-0">
				</span>`,
	inputs: ['appliedQuery', 'queryList', 'selectedQuery', 'selectedField','getQueryFormat']
})

export class MissingQuery implements OnInit, OnChanges {
	@Input() queryList;
	@Input() selectedField;
	@Input() appliedQuery;
	@Input() selectedQuery;
	@Output() getQueryFormat = new EventEmitter<any>();
	public current_query = 'missing';
	public queryName = '*';
	public fieldName = '*';
	public information: any = {
		title: 'missing query',
		content: `<span class="description"> missing query content </span>
					<a class="link" href="https://www.elastic.co/guide/en/elasticsearch/reference/2.3/query-dsl-missing-query.html">Documentation</a>`
	};
	
	public queryFormat: any = {};

	ngOnInit() {
		try {
			if(this.appliedQuery[this.current_query]['field']) {
				this.appliedQuery[this.current_query]['field'] = this.fieldName;
			}
		} catch(e) {}
		this.getFormat();	
	}

	ngOnChanges() {
		if(this.selectedField != '') {
			if(this.selectedField !== this.fieldName) {
				this.fieldName = this.selectedField;
				this.getFormat();
			}
		}
		if(this.selectedQuery != '') {
			if(this.selectedQuery !== this.queryName) {
				this.queryName = this.selectedQuery;
				this.getFormat();
			}
		}
	}

	// QUERY FORMAT
	/*
		Query Format for this query is
		@queryName: {
			@field: @fieldName
		}
	*/
	getFormat() {
		if (this.queryName === this.current_query) {
			this.queryFormat = this.setFormat();
			this.getQueryFormat.emit(this.queryFormat);
		}
	}
	setFormat() {
		var queryFormat = {};
		queryFormat[this.queryName] = {
			'field': this.fieldName
		};
		return queryFormat;
	}

}
