import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";

@Component({
	selector: 'gt-query',
	template: 	`<div class="form-group form-element col-xs-12">
					<input type="text" class="form-control col-xs-12"
						[(ngModel)]="inputs.gt.value" 
					 	placeholder="{{inputs.gt.placeholder}}"
					 	(keyup)="getFormat();" />
				</div>`,
	inputs: ['queryName', 'fieldName', 'getQueryFormat', 'appliedQuery']
})

export class GtQuery implements OnInit {
	@Input() queryName;
	@Input() fieldName;
	@Input() appliedQuery;
	@Output() getQueryFormat = new EventEmitter<any>();
	
	public inputs: any = {
		gt: {
			placeholder: 'Greater than',
			value: ''
		}
	};
	public queryFormat: any = {};

	ngOnInit() {
		try {
			if(this.appliedQuery['range'][this.fieldName]['gt']) {
				this.inputs.gt.value = this.appliedQuery['range'][this.fieldName]['gt']
			}
		} catch(e) {}
		this.getFormat();	
	}

	// QUERY FORMAT
	/*
		Query Format for this query is
		range: {
			@fieldName: {
				gt: @from_value
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
		};
		queryFormat['range'][this.fieldName] = {
			gt: this.inputs.gt.value,
		};
		return queryFormat;
	}

}
