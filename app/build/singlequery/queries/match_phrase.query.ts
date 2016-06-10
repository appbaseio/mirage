import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from "@angular/core";

@Component({
	selector: 'match_phrase-query',
	template: 	`<div class="form-group form-element col-xs-12">
					<input type="text" class="form-control col-xs-12"
						[(ngModel)]="inputs.input.value" 
					 	placeholder="{{inputs.input.placeholder}}"
					 	(keyup)="getFormat();" />
				</div>`,
	inputs: ['appliedQuery', 'queryList', 'selectedQuery', 'selectedField','getQueryFormat']
})

export class Match_phraseQuery implements OnInit, OnChanges {
	@Input() queryList;
	@Input() selectedField;
	@Input() appliedQuery;
	@Input() selectedQuery;
	@Output() getQueryFormat = new EventEmitter<any>();
	public queryName = '*';
	public fieldName = '*';
	public information: any = {
		title: 'lt query',
		content: 'lt query content',
		link: 'https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-match-query.html'
	};
	
	
	public inputs: any = {
		input: {
			placeholder: 'Input',
			value: ''
		}
	};
	public queryFormat: any = {};

	ngOnInit() {
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
		if (this.queryName === 'match_phrase') {
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
