import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from "@angular/core";

@Component({
	selector: 'range-query',
	template: 	`<span class="col-xs-6 pd-0">
					<div class="col-xs-6 pl-0">
						<div class="form-group form-element">
							<input type="text" class="form-control col-xs-12"
								[(ngModel)]="inputs.from.value" 
							 	placeholder="{{inputs.from.placeholder}}"
							 	(keyup)="getFormat();" />
						</div> 	
					</div> 	
					<div class="col-xs-6 pr-0">
						<div class="form-group form-element">
							<input type="text" class="form-control col-xs-12"
								[(ngModel)]="inputs.to.value" 
							 	placeholder="{{inputs.to.placeholder}}"
							 	(keyup)="getFormat();" />
						</div>	 	
					</div>
				</span>`,
	inputs: ['appliedQuery', 'queryList', 'selectedQuery', 'selectedField','getQueryFormat']
})

export class RangeQuery implements OnInit, OnChanges {
	@Input() queryList;
	@Input() selectedField;
	@Input() appliedQuery;
	@Input() selectedQuery;
	@Output() getQueryFormat = new EventEmitter<any>();
	public queryName = '*';
	public fieldName = '*';
	public information: any = {
	title: 'Range query',
	content: `<span class="description"> Range query content </span>
				<a class="link" href="https://www.elastic.co/guide/en/elasticsearch/reference/2.3/query-dsl-range-query.html">Documentation</a>`
	};

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

	ngOnChanges() {
		if(this.selectedField != '') {
			if(this.selectedField !== this.fieldName) {
				this.fieldName = this.selectedField;
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
			@fieldName: {
				from: @from_value,
				to: @to_value
			}
		}
	*/
	getFormat() {
		if(this.queryName === 'range') {		
			this.queryFormat = this.setFormat();
			this.getQueryFormat.emit(this.queryFormat);
		}
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
