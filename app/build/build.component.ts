import { Component, OnInit, EventEmitter, Input, Output } from "@angular/core";
import { NgForm } from "@angular/common";
import { BoolqueryComponent } from "./boolquery/boolquery.component";
import { queryList } from "../shared/queryList";
import { TypesComponent } from "./types/types.component";

@Component({
	selector: 'query-build',
	templateUrl: './app/build/build.component.html',
	inputs: ['mapping', 'types', 'selectedTypes', 'result', 'config', 'detectChange', 'editorHookHelp', 'savedQueryList', "query_info", 'saveQuery', 'finalUrl', 'setProp', 'urlShare'],
	directives: [TypesComponent, BoolqueryComponent]
})

export class BuildComponent implements OnInit {
	public queryList = queryList;
	public queryFormat: any = {
		internal: {
			field: '',
			query: '',
			selectedField: '',
			selectedQuery: '',
			input: '',
			analyzeTest: '',
			type: ''
		},
		bool: {
			boolparam: 0,
			parent_id: 0,
			id: 0,
			internal: [],
			minimum_should_match: ''
		}
	};
	public editorHookHelp: any;
	@Input() mapping: any;
	@Input() types: any;
	@Input() selectedTypes: any;
	@Input() result: any;
	@Input() query_info: any;
	@Input() savedQueryList: any;
	@Input() finalUrl: string;
	@Input() urlShare: any;
	@Output() saveQuery = new EventEmitter < any > ();
	@Output() setProp = new EventEmitter < any > ();

	ngOnInit() {
		this.handleEditable();
	}

	// Add the boolean query
	// get the default format for query and internal query
	// set the format and push into result array
	addBoolQuery(parent_id: number) {
		if (this.selectedTypes) {
			var queryObj = JSON.parse(JSON.stringify(this.queryFormat.bool));
			var internalObj = JSON.parse(JSON.stringify(this.queryFormat.internal));
			queryObj.internal.push(internalObj);
			queryObj.id = this.result.queryId;
			queryObj.parent_id = parent_id;
			this.result.queryId += 1;
			this.result.resultQuery.result.push(queryObj);
			this.buildQuery();
		} else {
			alert('Select type first.');
		}
	}

	// add internal query
	addQuery(boolQuery) {
		var self = this;
		var queryObj = JSON.parse(JSON.stringify(self.queryFormat.internal));
		boolQuery.internal.push(queryObj);
		this.buildQuery();
	}

	// builquery - this function handles everything to build the query
	buildQuery() {
		var self = this;
		var results = this.result.resultQuery.result;
		var finalresult = {};
		var es_final = {
			'query': {
				'bool': finalresult
			}
		};
		results.forEach(function(result) {
			result.availableQuery = self.buildInsideQuery(result);
		});

		results.forEach(function(result0) {
			results.forEach(function(result1) {
				if (result1.parent_id == result0.id) {
					var current_query = {
						'bool': {}
					};
					var currentBool = self.queryList['boolQuery'][result1['boolparam']];
					current_query['bool'][currentBool] = result1.availableQuery;
					if (currentBool === 'should') {
						current_query['bool']['minimum_should_match'] = result1.minimum_should_match;
					}
					result0.availableQuery.push(current_query);
				}
			});
		});
		results.forEach(function(result) {
			if (result.parent_id === 0) {
				var currentBool = self.queryList['boolQuery'][result['boolparam']];
				finalresult[currentBool] = result.availableQuery;
				if (currentBool === 'should') {
					finalresult['minimum_should_match'] = result.minimum_should_match;
				}
			}
		});
		this.result.resultQuery.final = JSON.stringify(es_final, null, 2);
		this.editorHookHelp.setValue(self.result.resultQuery.final);

		//set input state
		try {
			this.urlShare.inputs['result'] = this.result;
			this.urlShare.createUrl();
		} catch (e) {}
	}

	buildInsideQuery(result) {
		var objChain = [];
		result.internal.forEach(function(val0) {
			var childExists = false;
			val0.appliedQuery = this.createQuery(val0, childExists);
		}.bind(this));
		result.internal.forEach(function(val) {
			objChain.push(val.appliedQuery)
		});
		return objChain;
	}

	buildSubQuery() {
		var result = this.result.resultQuery.result[0];
		result.forEach(function(val0) {
			if (val0.parent_id != 0) {
				result.forEach(function(val1) {
					if (val0.parent_id == val1.id) {
						val1.appliedQuery['bool']['must'].push(val0.appliedQuery);
					}
				}.bind(this));
			}
		}.bind(this));
	}

	// Createquery until query is selected
	createQuery(val, childExists) {
		var queryParam = {
			query: '*',
			field: '*',
			queryFlag: true,
			fieldFlag: true
		};

		if (val.analyzeTest === '' || val.type === '' || val.query === '') {
			queryParam.queryFlag = false;
		}
		if (val.field === '') {
			queryParam.fieldFlag = false;
		}
		if (queryParam.queryFlag) {
			return val.appliedQuery;
		} else {
			if (queryParam.fieldFlag) {
				queryParam.field = val.selectedField;
			}
			var sampleobj = this.setQueryFormat(queryParam.query, queryParam.field, val);
			return sampleobj;
		}
	}

	setQueryFormat(query, field, val) {
		var sampleobj = {};
		sampleobj[query] = {};
		sampleobj[query][field] = val.input;
		return sampleobj;
	}

	// handle the body click event for editable
	// close all the select2 whene clicking outside of editable-element
	handleEditable() {
		$('body').on('click', function(e) {
			var target = $(e.target);
			if (target.hasClass('.editable-pack') || target.parents('.editable-pack').length) {} else {
				$('.editable-pack').removeClass('on');
			}
		});
	}

	// open save query modal
	openModal() {
		$('#saveQueryModal').modal('show');
	}

	setPropIn(propObj: any) {
		this.setProp.emit(propObj);
	}
}
