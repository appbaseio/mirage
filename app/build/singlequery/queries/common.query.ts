import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from "@angular/core";

@Component({
	selector: 'common-query',
	template: 	`<span class="col-xs-6 pd-0">
					<div class="col-xs-6 pl-0">
						<div class="form-group form-element">
							<input type="text" class="form-control col-xs-12"
								[(ngModel)]="inputs.query.value" 
							 	placeholder="{{inputs.query.placeholder}}"
							 	(keyup)="getFormat();" />
						</div> 	
					</div> 	
					<div class="col-xs-6 pr-0">
						<div class="form-group form-element">
							<input type="number" class="form-control col-xs-12"
								[(ngModel)]="inputs.cutoff_frequency.value" 
							 	placeholder="{{inputs.cutoff_frequency.placeholder}}"
							 	(keyup)="getFormat();" />
						</div>	 	
					</div>
				</span>`,
	inputs: ['appliedQuery', 'queryList', 'selectedQuery', 'selectedField','getQueryFormat']
})

export class CommonQuery implements OnInit, OnChanges {
	@Input() queryList: any;
	@Input() selectedField: any;
	@Input() appliedQuery: any;
	@Input() selectedQuery: any;
	@Output() getQueryFormat = new EventEmitter<any>();
	public queryName = '*';
	public fieldName = '*';
	public information: any = {
	title: 'Common query',
	content: `<span class="description"> Common query content </span>
				<a class="link" href="https://www.elastic.co/guide/en/elasticsearch/reference/2.3/query-dsl-range-query.html">Documentation</a>`
	};

	public inputs: any = {
		query: {
			placeholder: 'Query',
			value: ''
		}, 
		cutoff_frequency: {
			placeholder: 'Cutoff frequency',
			value: ''
		}
	};
	public queryFormat: any = {};

	ngOnInit() {
		try {
			if(this.appliedQuery['common'][this.fieldName]['query']) {
				this.inputs.query.value = this.appliedQuery['common'][this.fieldName]['query']
			}
			if(this.appliedQuery['common'][this.fieldName]['cutoff_frequency']) {
				this.inputs.to.value = this.appliedQuery['common'][this.fieldName]['cutoff_frequency']	
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
				query: @query_value,
				cutoff_frequency: @cutoff_frequency_value
			}
		}
	*/
	getFormat() {
		if(this.queryName === 'common') {		
			this.queryFormat = this.setFormat();
			this.getQueryFormat.emit(this.queryFormat);
		}
	}
	setFormat() {
		var queryFormat = {};
		queryFormat[this.queryName] = {};
		queryFormat[this.queryName][this.fieldName] = {
			query: this.inputs.query.value,
			cutoff_frequency: this.inputs.cutoff_frequency.value,
		};
		return queryFormat;
	}

}
