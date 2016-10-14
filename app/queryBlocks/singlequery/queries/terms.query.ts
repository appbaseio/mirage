import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from "@angular/core";

@Component({
	selector: 'terms-query',
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

export class TermsQuery implements OnInit, OnChanges {
	@Input() queryList;
	@Input() selectedField;
	@Input() appliedQuery;
	@Input() selectedQuery;
	@Output() getQueryFormat = new EventEmitter<any>();
	public queryName = '*';
	public fieldName = '*';
	public information: any = {
		title: 'Terms',
		content: `<span class="description">Returns matches with one of the exact values from the provided terms. </span>
					<a class="link" href="https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-terms-query.html#query-dsl-terms-query">Read more</a>`
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
			if(this.appliedQuery['terms'][this.fieldName]) {
				try {
					this.inputs.input.value = this.appliedQuery['terms'][this.fieldName].join(' ');
				} catch(e) {
					this.inputs.input.value = this.appliedQuery['terms'][this.fieldName];
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
			@fieldName: @value
		}
	*/

	getFormat() {
		if (this.queryName === 'terms') {
			this.queryFormat = this.setFormat();
			this.getQueryFormat.emit(this.queryFormat);
		}
	}
	setFormat() {
		var queryFormat = {};
		queryFormat[this.queryName] = {};
		try {
			queryFormat[this.queryName][this.fieldName] = this.inputs.input.value.split(',');
		} catch(e) {
			queryFormat[this.queryName][this.fieldName] = this.inputs.input.value.join(',');
		}
		return queryFormat;
	}

}
