import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from "@angular/core";
declare var $: any;

@Component({
	selector: 'bool-query',
	templateUrl: './app/queryBlocks/boolquery/boolquery.component.html',
	inputs: ['config', 'query', 'queryList', 'addQuery', 'removeQuery', 'addBoolQuery', 'queryFormat', 'buildQuery', 'buildInsideQuery', 'buildSubQuery', 'createQuery', 'setQueryFormat', 'editorHookHelp', 'urlShare', 'setDocSample']
})

export class BoolqueryComponent implements OnInit, OnChanges {
	public config: Object;
	public queryList: any = this.queryList;
	public addQuery: any;
	public addBoolQuery: any;
	public removeQuery: any;
	public removeArray: any = [];
	public query: any = this.query;
	public buildQuery: any;
	public allFields: any;
	@Input() mapping: any;
	@Input() types: any;
	@Input() selectedTypes: any;
	@Input() result: any;
	@Input() joiningQuery: any;
	@Input() joiningQueryParam: any;
	@Output() setJoiningQuery = new EventEmitter < any >();
	@Output() setDocSample = new EventEmitter < any >();
	
	ngOnInit() {
		this.allFields = this.result.resultQuery.availableFields;
		this.exeBuild();
	}

	ngOnChanges() {
		this.allFields = this.result.resultQuery.availableFields;
	}

	addSubQuery(id: number) {
		this.addBoolQuery(id);
	}
	removeInQuery(id: number) {
		var resulQueries = this.result.resultQuery.result;
		this.removeArray.push(id);
		var removeFlag = true;
		resulQueries.forEach(function(v: any, i: number) {
			if (v.parent_id == id) {
				this.removeInQuery(v.id);
				removeFlag = false;
			}
		}.bind(this));

		if (removeFlag) {
			this.removeArray.forEach(function(remove_q: number) {
				resulQueries.forEach(function(v: any, i: number) {
					if (v.id == remove_q) {
						resulQueries.splice(i, 1);
					}
				}.bind(this));
			}.bind(this));
		}
		this.buildQuery();
	}
	exeBuild() {
		setTimeout(() => this.buildQuery(), 300);
	}
	booleanChange(boolVal: any) {
		this.query.boolparam = boolVal;
		this.exeBuild();
	}
	joiningQueryChange(val: any) {
		this.joiningQueryParam = val;
		this.setJoiningQuery.emit({
			param: val,
			allFields: this.allFields
		});
		this.exeBuild();
	}
	show_hidden_btns(event: any) {
		$('.bool_query').removeClass('show_hidden');
		$(event.currentTarget).addClass('show_hidden');
		event.stopPropagation();
	}
	hide_hidden_btns() {
		$('.bool_query').removeClass('show_hidden');
	}
	setDocSampleEve(link) {
		this.setDocSample.emit(link);
	}
}
