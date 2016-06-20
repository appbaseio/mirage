import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from "@angular/core";

@Component({
	selector: 'lt-query',
	template: 	`<span class="col-xs-6 pd-0">
					<div class="form-group form-element">
						<input type="text" class="form-control col-xs-12"
							[(ngModel)]="inputs.lt.value" 
						 	placeholder="{{inputs.lt.placeholder}}"
						 	(keyup)="getFormat();" />
					</div>
				</span>`,
	inputs: ['appliedQuery', 'queryList', 'selectedQuery', 'selectedField','getQueryFormat']
})

export class LtQuery implements OnInit, OnChanges {
	@Input() queryList;
	@Input() selectedField;
	@Input() appliedQuery;
	@Input() selectedQuery;
	@Output() getQueryFormat = new EventEmitter<any>();
	public queryName = '*';
	public fieldName = '*';
	public information: any = {
		title: 'Lt query',
		content: `<span class="description"> Lt query content </span>
					<a class="link" href="https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-match-query.html">Documentation</a>`
	};
	
	
	public inputs: any = {
		lt: {
			placeholder: 'Less than',
			value: ''
		}
	};
	public queryFormat: any = {};

	ngOnInit() {
		try {
			if(this.appliedQuery['range'][this.fieldName]['lt']) {
				this.inputs.lt.value = this.appliedQuery['range'][this.fieldName]['lt']
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
		range: {
			@fieldName: {
				lt: @from_value
			}
		}
	*/
	getFormat() {
		if (this.queryName === 'lt') {
			this.queryFormat = this.setFormat();
			this.getQueryFormat.emit(this.queryFormat);
		}
	}
	setFormat() {
		var queryFormat = {
			'range': {}
		}
		queryFormat['range'][this.fieldName] = {
			lt: this.inputs.lt.value,
		};
		return queryFormat;
	}

}
