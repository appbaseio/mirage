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
				</div>`,
	inputs: ['getQueryFormat', 'querySelector']
})

export class GtQuery implements OnInit, OnChanges {
	@Input() queryList;
	@Input() selectedField;
	@Input() appliedQuery;
	@Input() selectedQuery;
	@Output() getQueryFormat = new EventEmitter<any>();
	public queryName = '*';
	public fieldName = '*';
	public current_query = 'gt';
	public information: any = {
		title: 'Greater Than',
		content: `<span class="description">Returns term values greater than the specified value. </span>
					<a class="link" href="https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-range-query.html#query-dsl-range-query">Read more</a>`
	};
	public informationList: any = {
		'boost': {
			title: 'boost',
			content: `<span class="description">Sets the boost value of the query, defaults to <strong>1.0</strong> </span>`
		}
	};
	public default_options: any = [
		'boost'
	];
	public options: any;
	public singleOption = {
		name: '',
		value: ''
	};
	public optionRows: any = [];
	public inputs: any = {
		gt: {
			placeholder: 'Greater than',
			value: ''
		}
	};
	public queryFormat: any = {};

	ngOnInit() {
		this.options = JSON.parse(JSON.stringify(this.default_options));
		try {
			if(this.appliedQuery['range'][this.fieldName][this.current_query]) {
				this.inputs.gt.value = this.appliedQuery['range'][this.fieldName]['gt'];
				for (let option in this.appliedQuery[this.current_query][this.fieldName]) {
					if (option != 'gt') {
						var obj = {
							name: option,
							value: this.appliedQuery[this.current_query][this.fieldName][option]
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
				if(this.selectedQuery == 'gt') {
					this.optionRows = [];
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
		this.optionRows.forEach(function(singleRow: any) {
			queryFormat['range'][this.fieldName][singleRow.name] = singleRow.value;
		}.bind(this));
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
