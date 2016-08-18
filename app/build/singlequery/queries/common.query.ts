import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from "@angular/core";
import { EditableComponent } from '../../editable/editable.component';

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
					<button (click)="addOption();" class="btn btn-info btn-xs add-option"> <i class="fa fa-plus"></i> </button>
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
								<input class="form-control col-xs-12 pd-0" type="text" [(ngModel)]="singleOption.value" placeholder="value"  (keyup)="getFormat();"/>
							</div>
						</div>
						<button (click)="removeOption(i)" class="btn btn-grey delete-option btn-xs">
							<i class="fa fa-times"></i>
						</button>
					</div>
				</div>`,
	inputs: ['appliedQuery', 'queryList', 'selectedQuery', 'selectedField','getQueryFormat'],
	directives: [EditableComponent]
})

export class CommonQuery implements OnInit, OnChanges {
	@Input() queryList: any;
	@Input() selectedField: any;
	@Input() appliedQuery: any;
	@Input() selectedQuery: any;
	@Output() getQueryFormat = new EventEmitter<any>();
	public current_query: string = 'common';
	public queryName = '*';
	public fieldName = '*';
	public information: any = {
	title: 'Common query',
	content: `<span class="description"> Common query content </span>
				<a class="link" href="https://www.elastic.co/guide/en/elasticsearch/reference/2.3/query-dsl-range-query.html">Documentation</a>`
	};
	public options: any = [
		'low_freq_operator',
		'minimum_should_match'
	];
	public singleOption = {
		name: '',
		value: ''
	};
	public optionRows: any = []


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
				this.inputs.cutoff_frequency.value = this.appliedQuery['common'][this.fieldName]['cutoff_frequency']	
			}
			for (let option in this.appliedQuery[this.current_query][this.fieldName]) {
				if (['query','cutoff_frequency'].indexOf(option) === -1) {
					var obj = {
						name: option,
						value: this.appliedQuery[this.current_query][this.fieldName][option]
					};
					this.optionRows.push(obj);
				}
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

	addOption() {
		var singleOption = JSON.parse(JSON.stringify(this.singleOption));
		this.optionRows.push(singleOption);
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
		if (this.optionRows.length) {
			queryFormat[this.queryName][this.fieldName] = {
				query: this.inputs.query.value,
				cutoff_frequency: this.inputs.cutoff_frequency.value		
			};
			this.optionRows.forEach(function(singleRow: any) {
				queryFormat[this.queryName][this.fieldName][singleRow.name] = singleRow.value;
			}.bind(this))
		} else {
			queryFormat[this.queryName][this.fieldName] = {
				query: this.inputs.query.value,
				cutoff_frequency: this.inputs.cutoff_frequency.value
			};
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
