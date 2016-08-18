import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from "@angular/core";
import { EditableComponent } from '../../editable/editable.component';

@Component({
	selector: 'missing-query',
	template: 	`<span class="col-xs-6 pd-10">
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

export class MissingQuery implements OnInit, OnChanges {
	@Input() queryList;
	@Input() selectedField;
	@Input() appliedQuery;
	@Input() selectedQuery;
	@Output() getQueryFormat = new EventEmitter<any>();
	public current_query = 'missing';
	public queryName = '*';
	public fieldName = '*';
	public information: any = {
		title: 'missing query',
		content: `<span class="description"> missing query content </span>
					<a class="link" href="https://www.elastic.co/guide/en/elasticsearch/reference/2.3/query-dsl-missing-query.html">Documentation</a>`
	};
	public options: any = [
		'existence',
		'null_value'
	];
	public singleOption = {
		name: '',
		value: ''
	};
	public optionRows: any = [];

	
	public queryFormat: any = {};

	ngOnInit() {
		try {
			if(this.appliedQuery[this.current_query]['field']) {
				this.appliedQuery[this.current_query]['field'] = this.fieldName;
				for (let option in this.appliedQuery[this.current_query]) {
					if (option != 'field') {
						var obj = {
							name: option,
							value: this.appliedQuery[this.current_query][option]
						};
						this.optionRows.push(obj);
					}
				}
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
			@field: @fieldName
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
		queryFormat[this.queryName] = {
			'field': this.fieldName
		};
		this.optionRows.forEach(function(singleRow: any) {
			queryFormat[this.queryName][singleRow.name] = singleRow.value;
		}.bind(this))
		return queryFormat;
	}
	selectOption(input: any) {
		this.optionRows[input.external].name = input.value;
		setTimeout(function() {
			this.getFormat();
		}.bind(this), 300);
	}	
	addOption() {
		var singleOption = JSON.parse(JSON.stringify(this.singleOption));
		this.optionRows.push(singleOption);
	}
	removeOption(index: Number) {
		this.optionRows.splice(index, 1);
		this.getFormat();
	}

}
