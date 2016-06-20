import { Component, OnInit, OnChanges, Input, Output, EventEmitter, ViewChild, SimpleChange } from "@angular/core";
import { EditableComponent } from '../../editable/editable.component';

@Component({
	selector: 'match-query',
	template: `<span class="col-xs-6 pd-0">
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
						<div class="form-group form-element col-xs-6">
							<input type="text" [(ngModel)]="singleOption.value" placeholder="value"  (keyup)="getFormat();"/>
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

export class MatchQuery implements OnInit, OnChanges {
	@Input() queryList: any;
	@Input() selectedField:string;
	@Input() appliedQuery: any;
	@Input() selectedQuery: string;
	@Output() getQueryFormat = new EventEmitter < any > ();
	public queryName = '*';
	public fieldName = '*';
	public information: any = {
		title: 'Match query',
		content: `<span class="description"> Match query content </span>
					<a class="link" href="https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-match-query.html">Documentation</a>`
	};
	public options: any = [
		'operator',
		'zero_terms_query',
		'cutoff_frequency',
		'type',
		'analyzer',
		'max_expansions'
	];
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
			if (this.appliedQuery['match'][this.selectedField]) {
				if(this.appliedQuery['match'][this.fieldName].query) {
					this.inputs.input.value = this.appliedQuery['match'][this.fieldName].query;
					for(let option in this.appliedQuery['match'][this.fieldName]) {
						if(option != 'query') {
							var obj = {
								name: option,
								value: this.appliedQuery['match'][this.fieldName][option]
							};
							this.optionRows.push(obj);
						}
					}
				}
				else {
					this.inputs.input.value = this.appliedQuery['match'][this.fieldName];
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
			@fieldName: @value
		}
	*/
	getFormat() {
		if (this.queryName === 'match') {
			this.queryFormat = this.setFormat();
			this.getQueryFormat.emit(this.queryFormat);
		}
	}
	setFormat() {
		var queryFormat = {};
		queryFormat[this.queryName] = {};
		if(this.optionRows.length) {
			queryFormat[this.queryName][this.fieldName] = {
				query: this.inputs.input.value
			};
			this.optionRows.forEach(function(singleRow: any) {
				queryFormat[this.queryName][this.fieldName][singleRow.name] = singleRow.value;
			}.bind(this))
		} else {
			queryFormat[this.queryName][this.fieldName] = this.inputs.input.value;
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
