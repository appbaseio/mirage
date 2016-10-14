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
	title: 'Common Terms',
	content: `<span class="description">Returns common terms matches by avoiding noise from high frequency terms with a cutoff frequency parameter.</span>
				<a class="link" href="https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-common-terms-query.html#query-dsl-common-terms-query">Read more</a>`
	};
	public informationList: any = {
		'minimum_should_match': {
			title: 'minimum_should_match',
			content: `<span class="description">Specify a minimum number or % of low frequency terms which must be present in matches.</span>`
		},
		'low_freq_operator': {
			title: 'low_freq_operator',
			content: `<span class="description">Specify 'and' (defaults to 'or') to make all terms required.</span>`
		}
	};
	public default_options: any = [
		'low_freq_operator',
		'minimum_should_match'
	];
	public options: any;
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
		this.options = JSON.parse(JSON.stringify(this.default_options));
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
		this.filterOptions();
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
				this.optionRows = [];
				this.getFormat();
			}
		}
	}

	addOption() {
		var singleOption = JSON.parse(JSON.stringify(this.singleOption));
		this.filterOptions();
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
	removeOption(index: Number) {
		this.optionRows.splice(index, 1);
		this.filterOptions();
		this.getFormat();
	}
}
