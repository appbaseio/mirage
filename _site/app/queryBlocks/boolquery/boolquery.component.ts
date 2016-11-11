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
	public informationList: any = {
		'nested': {
			title: 'nested',
			content: `<span class="description">Nested query allows you to run a query against the nested documents and filter parent docs by those that have at least one nested document matching the query.</span>
				<a class="link" href="https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-nested-query.html#query-dsl-nested-query">Read more</a>`
		},
		'has_child': {
			title: 'has_child',
			content: `<span class="description">has_child filter accepts a query and the child type to run against, and results in parent documents that have child docs matching the query.</span>
				<a class="link" href="https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-has-child-query.html#query-dsl-has-child-query">Read more</a>`
		},
		'has_parent': {
			title: 'has_parent',
			content: `<span class="description">has_parent query accepts a query and a parent type. The query is executed in the parent document space, which is specified by the parent type, and returns child documents which associated parents have matched.</span>
				<a class="link" href="https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-has-parent-query.html#query-dsl-has-parent-query">Read more</a>`
		},
		'parent_id': {
			title: 'parent_id',
			content: `<span class="description">parent_id query can be used to find child documents which belong to a particular parent. </span>
				<a class="link" href="https://www.elastic.co/guide/en/elasticsearch/reference/5.0/query-dsl-parent-id-query.html#query-dsl-parent-id-query">Read more</a>`
		}
	};
	@Input() mapping: any;
	@Input() types: any;
	@Input() selectedTypes: any;
	@Input() result: any;
	@Input() joiningQuery: any = [''];
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
		if (val.val) {
			val = this.joiningQuery.indexOf(val.val);
		}
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
