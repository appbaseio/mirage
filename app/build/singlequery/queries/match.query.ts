import { Component, OnInit, OnChanges, Input, Output, EventEmitter, ViewChild, SimpleChange } from "@angular/core";

@Component({
	selector: 'match-query',
	template: `<div class="form-group form-element col-xs-12">
					<input type="text" class="form-control col-xs-12"
						[(ngModel)]="inputs.input.value" 
					 	placeholder="{{inputs.input.placeholder}}"
					 	(keyup)="getFormat();" />
				</div>`,
	inputs: ['appliedQuery', 'queryList', 'selectedQuery', 'selectedField', 'getQueryFormat']
})

export class MatchQuery implements OnInit, OnChanges {
	@Input() queryList: any;
	@Input() selectedField:string;
	@Input() appliedQuery: any;
	@Input() selectedQuery: string;
	@Output() getQueryFormat = new EventEmitter < any > ();
	public queryName = '*';
	public fieldName = '*';
	public information: any = {
		title: 'Match query',
		content: 'Match query content',
		link: 'https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-match-query.html'
	};

	constructor() {}

	public inputs: any = {
		input: {
			placeholder: 'Input',
			value: ''
		}
	};
	public queryFormat: any = {};

	ngOnInit() {
		try {
			if (this.appliedQuery['match'][this.selectedField]) {
				this.inputs.input.value = this.appliedQuery['match'][this.fieldName];
			}
		} catch (e) {}
		this.getFormat();
	}

	ngOnChanges() {
		if (this.selectedField != '') {
			if (this.selectedField !== this.fieldName) {
				this.fieldName = this.selectedField;
			}
		}
		if (this.selectedQuery != '') {
			if (this.selectedQuery !== this.queryName) {
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
		if (this.queryName === 'match') {
			this.queryFormat = this.setFormat();
			this.getQueryFormat.emit(this.queryFormat);
		}
	}
	setFormat() {
		var queryFormat = {};
		queryFormat[this.queryName] = {};
		queryFormat[this.queryName][this.fieldName] = this.inputs.input.value;
		return queryFormat;
	}

}
