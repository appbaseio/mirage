import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from "@angular/core";

@Component({
	selector: 'ids-query',
	template: 	`<span class="col-xs-6 pd-0">
					<div class="form-group form-element">
						<input type="text" class="form-control col-xs-12"
							[(ngModel)]="inputs.input.value"
						 	placeholder="{{inputs.input.placeholder}}"
						 	(keyup)="getFormat();" />
					</div>
				</span>`,
	inputs: ['getQueryFormat', 'querySelector']
})

export class IdsQuery implements OnInit, OnChanges {
	@Input() queryList: any;
	@Input() selectedField: any;
	@Input() appliedQuery: any;
	@Input() selectedQuery: any;
	@Input() selectedTypes: any;
	@Output() getQueryFormat = new EventEmitter<any>();
	public queryName = '*';
	public fieldName = '*';
	public information: any = {
		title: 'Ids',
		content: `<span class="description">Returns matches that only have the provided ids (<strong>_id</strong> field). </span>
					<a class="link" href="https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-ids-query.html#query-dsl-ids-query">Read more</a>`
	};

	public inputs: any = {
		input: {
			placeholder: 'Input',
			value: ''
		}
	};
	public queryFormat: any = {};

	ngOnInit() {
		try {
			if(this.appliedQuery['ids']) {
				try {
					this.inputs.input.value = this.appliedQuery['ids'].values.join(',');
				} catch(e) {
					this.inputs.input.value = this.appliedQuery['ids'].values;
				}
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
			@fieldName: {
				type: @type,
				values: @value
			}
		}
	*/

	getFormat() {
		if (this.queryName === 'ids') {
			this.queryFormat = this.setFormat();
			this.getQueryFormat.emit(this.queryFormat);
		}
	}
	setFormat() {
		var queryFormat = {};
		queryFormat[this.queryName] = {
			values: [],
			type: this.selectedTypes
		};
		try {
			queryFormat[this.queryName].values = this.inputs.input.value.split(',');
		} catch(e) {
			queryFormat[this.queryName].values = [];
		}
		return queryFormat;
	}

}
