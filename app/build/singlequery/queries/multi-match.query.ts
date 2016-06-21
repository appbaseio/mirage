import { Component, OnInit, OnChanges, Input, Output, EventEmitter, ViewChild, SimpleChange } from "@angular/core";
import { EditableComponent } from '../../editable/editable.component';

@Component({
	selector: 'multi_match-query',
	template: `<span class="col-xs-6 pd-10">
					<div class="form-group form-element query-primary-input">
						<input type="text" class="form-control col-xs-12"
							[(ngModel)]="inputs.input.value" 
						 	placeholder="{{inputs.input.placeholder}}"
						 	(keyup)="getFormat();" />
						<button (click)="addOption();" class="btn btn-info btn-xs add-option"> <i class="fa fa-plus"></i> </button>
					</div>
				</span>	
				<div class="col-xs-12 option-container" *ngIf="optionRows.length">
					<div class="col-xs-12 single-option" *ngFor="let singleOption of optionRows, let i=index">
						<div class="col-xs-6 pd-l0">			
							<editable [editableField]="singleOption.name" 
								[editableModal]="singleOption.name" 
								[editPlaceholder]="'--choose option--'"
								[editableInput]="'selectOption'" 
								[selectOption]="options" 
								[passWithCallback]="i"
								(callback)="selectOption($event)"></editable>
						</div>
						<div class="col-xs-6 pd-0">
							<div class="form-group form-element">
 								<input class="form-control col-xs-12 pd-0" type="text" [(ngModel)]="singleOption.value" placeholder="{{placeholders[singleOption.name] || 'value'}}"  (keyup)="getFormat();"/>							
 							</div>
						</div>
						<button (click)="removeOption(i)" class="btn btn-grey delete-option">
							<i class="fa fa-times"></i>
						</button>
					</div>
				</div>
				`,
	inputs: ['appliedQuery', 'queryList', 'selectedQuery', 'selectedField', 'getQueryFormat'],
	directives: [EditableComponent]
})

export class MultiMatchQuery implements OnInit, OnChanges {
	@Input() queryList: any;
	@Input() selectedField: string;
	@Input() appliedQuery: any;
	@Input() selectedQuery: string;
	@Output() getQueryFormat = new EventEmitter < any > ();
	public queryName = '*';
	public fieldName = '*';
	public information: any = {
		title: 'Match query',
		content: `<span class="description"> Multi-match query content </span>
					<a class="link" href="https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-match-query.html">Documentation</a>`
	};
	public options: any = [
		'fields',
		'tie_breaker',
		'type',
		'operator'
	];
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
		try {
			if (this.appliedQuery['multi_match']) {
				var applied = this.appliedQuery['multi_match'];
				this.inputs.input.value = applied.query;
				// this.fieldName = applied.fields[0];
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
	}

	ngOnChanges() {
		if (this.selectedField != '') {
			if (this.selectedField !== this.fieldName) {
				this.fieldName = this.selectedField;
			}
		}
		if (this.selectedQuery != '') {
			if (this.selectedQuery !== this.queryName) {
				this.queryName = this.selectedQuery;
				this.getFormat();
			}
		}
	}

	addOption() {
		var singleOption = JSON.parse(JSON.stringify(this.singleOption));
		this.optionRows.push(singleOption);
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
		if (this.queryName === 'multi_match') {
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
		this.optionRows[input.external].name = input.value;
		setTimeout(function() {
			this.getFormat();
		}.bind(this), 300);
	}
	removeOption(index: Number) {
		this.optionRows.splice(index, 1);
		this.getFormat();
	}

}
