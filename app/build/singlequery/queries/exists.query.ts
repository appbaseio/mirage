import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from "@angular/core";

@Component({
	selector: 'exists-query',
	template: 	`<span class="col-xs-6 pd-0">
					<div class="form-group form-element">
						<input type="text" class="form-control col-xs-12"
							[(ngModel)]="inputs.input.value" 
						 	placeholder="{{inputs.input.placeholder}}"
						 	(keyup)="getFormat();" />
					</div>
				</span>`,
	inputs: ['appliedQuery', 'queryList', 'selectedQuery', 'selectedField','getQueryFormat']
})

export class ExistsQuery implements OnInit, OnChanges {
	@Input() queryList;
	@Input() selectedField;
	@Input() appliedQuery;
	@Input() selectedQuery;
	@Output() getQueryFormat = new EventEmitter<any>();
	public queryName = '*';
	public fieldName = '*';
	public information: any = {
		title: 'Exists query',
		content: `<span class="description"> Exists query content </span>
					<a class="link" href="https://www.elastic.co/guide/en/elasticsearch/reference/2.3/query-dsl-exists-query.html">Documentation</a>`
	};
	
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

	ngOnChanges() {
		if(this.selectedField != '') {
			if(this.selectedField !== this.fieldName) {
				this.fieldName = this.selectedField;
				this.getFormat();
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
			@fieldName: @value
		}
	*/
	getFormat() {
		if (this.queryName === 'exists') {
			this.queryFormat = this.setFormat();
			this.getQueryFormat.emit(this.queryFormat);
		}
	}
	setFormat() {
		var queryFormat = {};
		queryFormat[this.queryName] = {};
		queryFormat[this.queryName][this.fieldName] = this.inputs.input.value;
		return queryFormat;
	}

}
