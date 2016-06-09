import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";

@Component({
	selector: 'range-query',
	template: 	`<div class="form-group form-element col-xs-12">
					<input type="text" class="form-control col-xs-12"
						[(ngModel)]="inputs.from.value" 
					 	placeholder="{{inputs.from.placeholder}}"
					 	(keyup)="getFormat();" />
					<input type="text" class="form-control col-xs-12"
						[(ngModel)]="inputs.to.value" 
					 	placeholder="{{inputs.to.placeholder}}"
					 	(keyup)="getFormat();" />
				</div>`,
	inputs: ['queryName', 'fieldName', 'getQueryFormat', 'appliedQuery']
})

export class RangeQuery implements OnInit {
	@Input() queryName;
	@Input() fieldName;
	@Input() appliedQuery;
	@Output() getQueryFormat = new EventEmitter<any>();
	
	public inputs: any = {
		from: {
			placeholder: 'From',
			value: ''
		}, 
		to: {
			placeholder: 'To',
			value: ''
		}
	};
	public queryFormat: any = {};

	ngOnInit() {
		try {
			if(this.appliedQuery['range'][this.fieldName]['from']) {
				this.inputs.from.value = this.appliedQuery['range'][this.fieldName]['from']
			}
			if(this.appliedQuery['range'][this.fieldName]['to']) {
				this.inputs.to.value = this.appliedQuery['range'][this.fieldName]['to']	
			}
		} catch(e) {}
		this.getFormat();	
	}

	// QUERY FORMAT
	/*
		Query Format for this query is
		@queryName: {
			@fieldName: {
				from: @from_value,
				to: @to_value
			}
		}
	*/
	getFormat() {
		this.queryFormat = this.setFormat();
		this.getQueryFormat.emit(this.queryFormat);
	}
	setFormat() {
		var queryFormat = {};
		queryFormat[this.queryName] = {};
		queryFormat[this.queryName][this.fieldName] = {
			from: this.inputs.from.value,
			to: this.inputs.to.value,
		};
		return queryFormat;
	}

}
