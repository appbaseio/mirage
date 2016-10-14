// Editable component which converts input or dropdown into editable ui
import { Component, OnInit, OnChanges, Input, Output, EventEmitter, ViewChild, SimpleChange } from "@angular/core";

// Markup contains 2 parts
// 1) primary input box: which is 3rd input box in query box, in which user will write value,
//    addOption button is optional if query contains optional paramater then add it
// 2) Optional parameter: It is collection of option rows, each row will contain option property name and value
@Component({
	selector: 'match-query',
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
	inputs: ['getQueryFormat', 'querySelector']
})

export class MatchQuery implements OnInit, OnChanges {
	// Initialize the variables
	@Input() queryList: any;
	@Input() selectedField: string;
	@Input() appliedQuery: any;
	@Input() selectedQuery: string;
	// Event which is listen by parent component. we will pass created query format in this event.
	@Output() getQueryFormat = new EventEmitter < any > ();
	// set current query name
	public current_query: string = 'match';
	public queryName = '*';
	public fieldName = '*';
	// Add information of query
	public information: any = {
		title: 'Match',
		content: `<span class="description">Returns matches by doing a full-text search, is used as the <i>go to</i> query.</span>
					<a class="link" href="https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-match-query.html#query-dsl-match-query">Read more</a>`
	};
	// Information about optional parameters which will be shown in popover
	public informationList: any = {
		'operator': {
			title: 'operator',
			content: `<span class="description">The operator flag can be set to 'OR' or 'AND' to control the boolean clauses.</span>`
		},
		'zero_terms_query': {
			title: 'zero_terms_query',
			content: `<span class="description">Accepts none (default) and all which corresponds to a match_all query.</span>`
		},
		'cutoff_frequency': {
			title: 'cutoff_frequency',
			content: `<span class="description">cutoff_frequency allows specifying frequency threshold where high frequency terms are moved into an optional subquery.</span>`
		},
		'type': {
			title: 'type',
			content: `<span class="description">There are three types of match query: boolean (default), phrase, and phrase_prefix</span>`
		},
		'analyzer': {
			title: 'analyzer',
			content: `<span class="description">The analyzer used to analyze each term of the query when creating composite queries.</span>`
		},
		'max_expansions': {
			title: 'max_expansions',
			content: `<span class="description">The maximum number of terms that the query will expand to. Defaults to 50.</span>`
		}
	};
	// list of optional parameters
	public default_options: any = [
		'operator',
		'zero_terms_query',
		'cutoff_frequency',
		'type',
		'analyzer',
		'max_expansions'
	];
	public options: any;
	public singleOption = {
		name: '',
		value: ''
	};
	public optionRows: any = [];

	constructor() {}
	// specify inputs placeholder and default value
	public inputs: any = {
		input: {
			placeholder: 'Input',
			value: ''
		}
	};
	public queryFormat: any = {};

	// Initial hook: 
	// Logic of creating query format when loading saved query or load query from url
	// appliedQuery contains the queries which we will get from parent component
	ngOnInit() {
		this.options = JSON.parse(JSON.stringify(this.default_options));
		try {
			// check if `match` query exists for selected field
			// set the inputs to show existing values in markup
			// set the optional parameter in `optionRows` if exists in query 
			if (this.appliedQuery[this.current_query][this.selectedField]) {
				if (this.appliedQuery[this.current_query][this.fieldName].hasOwnProperty('query')) {
					this.inputs.input.value = this.appliedQuery[this.current_query][this.fieldName].query;
					for (let option in this.appliedQuery[this.current_query][this.fieldName]) {
						if (option != 'query') {
							var obj = {
								name: option,
								value: this.appliedQuery[this.current_query][this.fieldName][option]
							};
							this.optionRows.push(obj);
						}
					}
				} else {
					this.inputs.input.value = this.appliedQuery[this.current_query][this.fieldName];
				}
			}
		} catch (e) {}
		this.filterOptions();
		this.getFormat();
	}

	// onchange hook:
	// Over here we will receive changes from parent and
	// if the selected field or selected query is changes then update the query by calliung `getFormat`.
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
				this.optionRows = [];
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
	// This method is responsible to get query format and execute the event which will be listen in parent component
	getFormat() {
		if (this.queryName === this.current_query) {
			this.queryFormat = this.setFormat();
			this.getQueryFormat.emit(this.queryFormat);
		}
	}
	// Build the query format in this method 
	setFormat() {
		var queryFormat = {};
		queryFormat[this.queryName] = {};
		if (this.optionRows.length) {
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
	// Now below methods are related to options parameter, 
	//so use it as it is in new query if query contains optional parametes
	// while selecting option
	selectOption(input: any) {
		input.selector.parents('.editable-pack').removeClass('on');
		this.optionRows[input.external].name = input.val;
		this.filterOptions();
		setTimeout(function() {
			this.getFormat();
		}.bind(this), 300);
	}
	// Update the option list because duplicate option is not allowed
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
	// while user click on add option button it will add new option row and update the available options
	addOption() {
		var singleOption = JSON.parse(JSON.stringify(this.singleOption));
		this.filterOptions();
		this.optionRows.push(singleOption);
	}
	// while user click on remove option button it will remove the row and update the available options
	removeOption(index: Number) {
		this.optionRows.splice(index, 1);
		this.filterOptions();
		this.getFormat();
	}

}
