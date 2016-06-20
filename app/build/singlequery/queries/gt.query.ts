import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from "@angular/core";

@Component({
	selector: 'gt-query',
	template: 	`<span class="col-xs-6 pd-0">
					<div class="form-group form-element">
						<input type="text" class="form-control col-xs-12"
							[(ngModel)]="inputs.gt.value" 
						 	placeholder="{{inputs.gt.placeholder}}"
						 	(keyup)="getFormat();" />
					</div>
				</span>`,
	inputs: ['appliedQuery', 'queryList', 'selectedQuery', 'selectedField','getQueryFormat']
})

export class GtQuery implements OnInit, OnChanges {
	@Input() queryList;
	@Input() selectedField;
	@Input() appliedQuery;
	@Input() selectedQuery;
	@Output() getQueryFormat = new EventEmitter<any>();
	public queryName = '*';
	public fieldName = '*';
	public information: any = {
		title: 'Gt query',
		content: `<span class="description"> Gt query content </span>
					<a class="link" href="https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-match-query.html">Documentation</a>`
	};
	
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

	ngOnChanges() {
		if(this.selectedField != '') {
			if(this.selectedField !== this.fieldName) {
				this.fieldName = this.selectedField;
			}
		}
		if(this.selectedQuery != '') {
			if(this.selectedQuery !== this.queryName) {
				this.queryName = this.selectedQuery;
				if(this.selectedQuery == 'gt') {
					this.getFormat();
				}
			}
		}
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
		if (this.queryName === 'gt') {
			this.queryFormat = this.setFormat();
			this.getQueryFormat.emit(this.queryFormat);
		}
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
