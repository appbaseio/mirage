import { Component, OnInit, OnChanges, Input, Output, EventEmitter, ViewChild, SimpleChange } from "@angular/core";

@Component({
	selector: 'multi_match-query',
	template: `<span class="col-xs-6 pd-10">
					<div class="form-group form-element query-primary-input">
						<span class="input_with_option">
							<input type="text" class="form-control col-xs-12"
								[(ngModel)]="inputs.input.value"
							 	placeholder="{{inputs.input.placeholder}}"
							 	(keyup)="getFormat();" />
						</span>
					</div>
					<button (click)="addOption();" class="btn btn-info btn-xs add-option"> <i class="fa fa-plus"></i> </button>
				</span>
				<div class="col-xs-12 option-container" *ngIf="optionRows.length">
					<div class="col-xs-12 single-option" *ngFor="let singleOption of optionRows, let i=index">
						<div class="col-xs-6 pd-l0">
							<editable
								class = "additional-option-select-{{i}}"
								[editableField]="singleOption.name"
								[editPlaceholder]="'--choose option--'"
								[editableInput]="'select2'"
								[selectOption]="options"
								[passWithCallback]="i"
								[selector]="'additional-option-select'"
								[querySelector]="querySelector"
								[informationList]="informationList"
								[showInfoFlag]="true"
								[searchOff]="true"
								(callback)="selectOption($event)">
							</editable>
						</div>
						<div class="col-xs-6 pd-0">
							<div class="form-group form-element">
								<input class="form-control col-xs-12 pd-0" type="text" [(ngModel)]="singleOption.value" placeholder="value"  (keyup)="getFormat();"/>
							</div>
						</div>
						<button (click)="removeOption(i)" class="btn btn-grey delete-option btn-xs">
							<i class="fa fa-times"></i>
						</button>
					</div>
				</div>
				`,
	inputs: [ 'getQueryFormat', 'querySelector']
})

export class MultiMatchQuery implements OnInit, OnChanges {
	@Input() queryList: any;
	@Input() selectedField: string;
	@Input() appliedQuery: any;
	@Input() selectedQuery: string;
	@Output() getQueryFormat = new EventEmitter < any > ();
	public current_query: string = 'multi_match';
	public queryName = '*';
	public fieldName = '*';
	public information: any = {
		title: 'Multi Match',
		content: `<span class="description">Returns matches by doing a full-text search on multiple fields.</span>
					<a class="link" href="https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-multi-match-query.html#query-dsl-multi-match-query">Read more</a>`
	};
	public informationList: any = {
		'operator': {
			title: 'operator',
			content: `<span class="description">The operator flag can be set to 'OR' or 'AND' to control the boolean clauses.</span>`
		},
		'fields': {
			title: 'fields',
			content: `<span class="description">Specify one or more fields separated by comma to run a multi-field query.</span>`
		},
		'type': {
			title: 'type',
			content: `<span class="description">There are three types of match query: boolean (default), phrase, and phrase_prefix</span>`
		},
	};
	public default_options: any = [
		'operator',
		'fields',
		'type',
	];
	public options: any;
	public placeholders: any = {
		fields: 'Comma seprated values'
	};
	public singleOption = {
		name: '',
		value: ''
	};
	public optionRows: any = []

	constructor() {}

	public inputs: any = {
		input: {
			placeholder: 'Input',
			value: ''
		}
	};
	public queryFormat: any = {};

	ngOnInit() {
		this.options = JSON.parse(JSON.stringify(this.default_options));
		try {
			if (this.appliedQuery[this.current_query]) {
				var applied = this.appliedQuery[this.current_query];
				this.inputs.input.value = applied.query;
				if(applied.fields.length > 1) {
					var other_fields = JSON.parse(JSON.stringify(applied.fields));
					other_fields.splice(0, 1);
					other_fields = other_fields.join(',');
					var obj = {
						name: 'fields',
						value: other_fields
					};
					this.optionRows.push(obj);
				}

				for (let option in applied) {
					if (option != 'fields' && option != 'query') {
						var obj = {
							name: option,
							value: applied[option]
						};
						this.optionRows.push(obj);
					}
				}

			}
		} catch (e) {}
		this.getFormat();
		this.filterOptions();
	}

	ngOnChanges() {
		if (this.selectedField != '') {
			if (this.selectedField !== this.fieldName) {
				this.fieldName = this.selectedField;
				this.getFormat();
			}
		}
		if (this.selectedQuery != '') {
			if (this.selectedQuery !== this.queryName) {
				this.queryName = this.selectedQuery;
				this.getFormat();
				this.optionRows = [];
			}
		}
	}

	// QUERY FORMAT
	/*
		Query Format for this query is
		@queryName: {
			query: value,
			fields: [fieldname, other fields]
		}
	*/
	getFormat() {
		if (this.queryName === this.current_query) {
			this.queryFormat = this.setFormat();
			this.getQueryFormat.emit(this.queryFormat);
		}
	}
	setFormat() {
		var queryFormat = {};
		var fields = [this.fieldName];
		queryFormat[this.queryName] = {
			query: this.inputs.input.value,
			fields: fields
		};
		if(this.optionRows.length) {
			this.optionRows.forEach(function(singleRow: any) {
				if(singleRow.name != 'fields') {
					queryFormat[this.queryName][singleRow.name] = singleRow.value;
				} else {
					var field_split = singleRow.value.split(',');
					fields = fields.concat(field_split);
					queryFormat[this.queryName].fields = fields;
				}
			}.bind(this))
		}
		return queryFormat;
	}
	selectOption(input: any) {
		input.selector.parents('.editable-pack').removeClass('on');
		this.optionRows[input.external].name = input.val;
		this.filterOptions();
		setTimeout(function() {
			this.getFormat();
		}.bind(this), 300);
	}
	filterOptions() {
		this.options = this.default_options.filter(function(opt) {
			var flag = true;
			this.optionRows.forEach(function(row) {
				if(row.name === opt) {
					flag = false;
				}
			});
			return flag;
		}.bind(this));
	}
	addOption() {
		var singleOption = JSON.parse(JSON.stringify(this.singleOption));
		this.filterOptions();
		this.optionRows.push(singleOption);
	}
	removeOption(index: Number) {
		this.optionRows.splice(index, 1);
		this.filterOptions();
		this.getFormat();
	}

}
