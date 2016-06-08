import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";

@Component({
	selector: 'range-query',
	template: 	`<div class="form-group form-element col-xs-12">
					<input type="text" class="form-control col-xs-12"
						[(ngModel)]="inputs.from.value" 
					 	placeholder="{{inputs.from.placeholder}}"
					 	(keyup)="setFormat();" />
					<input type="text" class="form-control col-xs-12"
						[(ngModel)]="inputs.to.value" 
					 	placeholder="{{inputs.to.placeholder}}"
					 	(keyup)="setFormat();" />
				</div>`,
	inputs: ['queryName', 'fieldName', 'getQueryFormat']
})

export class RangeQuery implements OnInit {
	@Input() queryName;
	@Input() fieldName;
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
		this.setFormat();	
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
	setFormat() {
		this.queryFormat[this.queryName] = {};
		this.queryFormat[this.queryName][this.fieldName] = {
			from: this.inputs.from.value,
			to: this.inputs.to.value,
		};
		this.getQueryFormat.emit(this.queryFormat);
	}

}
