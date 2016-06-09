import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";

@Component({
	selector: 'lt-query',
	template: 	`<div class="form-group form-element col-xs-12">
					<input type="text" class="form-control col-xs-12"
						[(ngModel)]="inputs.lt.value" 
					 	placeholder="{{inputs.lt.placeholder}}"
					 	(keyup)="getFormat();" />
				</div>`,
	inputs: ['queryName', 'fieldName', 'getQueryFormat', 'appliedQuery']
})

export class LtQuery implements OnInit {
	@Input() queryName;
	@Input() fieldName;
	@Input() appliedQuery;
	@Output() getQueryFormat = new EventEmitter<any>();
	
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
		this.queryFormat = this.setFormat();
		this.getQueryFormat.emit(this.queryFormat);
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
