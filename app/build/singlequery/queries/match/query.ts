import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";

@Component({
	selector: 'match-query',
	templateUrl: './app/build/singlequery/queries/match/query.html',
	inputs: ['queryName', 'fieldName', 'getQueryFormat'],
})

export class MatchQuery implements OnInit {
	@Input() queryName;
	@Input() fieldName;
	@Output() getQueryFormat = new EventEmitter<any>();
	
	public inputs: any = {
		input: {
			placeholder: 'Input',
			value: ''
		}
	};
	public queryFormat: any = {};

	ngOnInit() {
		this.setFormat();	
	}

	// QUERY FORMAT
	/*
		Query Format for this query is
		@queryName: {
			@fieldName: @value
		}
	*/
	setFormat() {
		this.queryFormat[this.queryName] = {};
		this.queryFormat[this.queryName][this.fieldName] = this.inputs.input.value;
		this.getQueryFormat.emit(this.queryFormat);
	}

}
