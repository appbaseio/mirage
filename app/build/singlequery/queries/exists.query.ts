import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";

@Component({
	selector: 'exists-query',
	template: 	`<div class="form-group form-element col-xs-12">
					<input type="text" class="form-control col-xs-12"
						[(ngModel)]="inputs.input.value" 
					 	placeholder="{{inputs.input.placeholder}}"
					 	(keyup)="getFormat();" />
				</div>`,
	inputs: ['queryName', 'fieldName', 'getQueryFormat', 'appliedQuery']
})

export class ExistsQuery implements OnInit {
	@Input() queryName;
	@Input() fieldName;
	@Input() appliedQuery;
	@Output() getQueryFormat = new EventEmitter<any>();
	
	public inputs: any = {
		input: {
			placeholder: 'Input',
			value: ''
		}
	};
	public queryFormat: any = {};

	ngOnInit() {
		try {
			if(this.appliedQuery['exists'][this.fieldName]) {
				this.inputs.input.value = this.appliedQuery['exists'][this.fieldName]
			}
		} catch(e) {}
		this.getFormat();	
	}

	// QUERY FORMAT
	/*
		Query Format for this query is
		@queryName: {
			@fieldName: @value
		}
	*/
	getFormat() {
		this.queryFormat = this.setFormat();
		this.getQueryFormat.emit(this.queryFormat);
	}
	setFormat() {
		var queryFormat = {};
		queryFormat[this.queryName] = {};
		queryFormat[this.queryName][this.fieldName] = this.inputs.input.value;
		return queryFormat;
	}

}
