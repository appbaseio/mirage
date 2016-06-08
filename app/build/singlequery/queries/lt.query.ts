import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";

@Component({
	selector: 'lt-query',
	template: 	`<div class="form-group form-element col-xs-12">
					<input type="text" class="form-control col-xs-12"
						[(ngModel)]="inputs.lt.value" 
					 	placeholder="{{inputs.lt.placeholder}}"
					 	(keyup)="setFormat();" />
				</div>`,
	inputs: ['queryName', 'fieldName', 'getQueryFormat']
})

export class LtQuery implements OnInit {
	@Input() queryName;
	@Input() fieldName;
	@Output() getQueryFormat = new EventEmitter<any>();
	
	public inputs: any = {
		lt: {
			placeholder: 'Less than',
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
		range: {
			@fieldName: {
				lt: @from_value
			}
		}
	*/
	setFormat() {
		this.queryFormat['range'] = {};
		this.queryFormat['range'][this.fieldName] = {
			lt: this.inputs.lt.value,
		};
		this.getQueryFormat.emit(this.queryFormat);
	}

}
