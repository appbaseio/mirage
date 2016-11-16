import { Component, OnInit, OnChanges, EventEmitter, Input, Output } from "@angular/core";
import { queryList } from "../shared/queryList";
declare var $: any;

@Component({
	selector: 'query-blocks',
	templateUrl: './app/queryBlocks/queryBlocks.component.html',
	inputs: ['detectChange', 'editorHookHelp', 'saveQuery', 'setProp', 'setDocSample']
})

export class QueryBlocksComponent implements OnInit, OnChanges {
	public queryList: any = queryList;
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
			minimum_should_match: '',
			path: '',
			type: '',
			xid: 0,
			parent_type: '',
			score_mode: ''
		}
	};
	public editorHookHelp: any;
	public joiningQuery: any = [''];
	public joiningQueryParam: any = 0;
	@Input() mapping: any;
	@Input() types: any;
	@Input() selectedTypes: any;
	@Input() result: any;
	@Input() query_info: any;
	@Input() savedQueryList: any;
	@Input() finalUrl: string;
	@Input() urlShare: any;
	@Input() config: any;
	@Output() saveQuery = new EventEmitter < any > ();
	@Output() setProp = new EventEmitter < any > ();
	@Output() setDocSample = new EventEmitter < any >();

	ngOnInit() {
		this.handleEditable();
		this.joiningQuery = this.result.joiningQuery;
	}

	ngOnChanges() {
		this.joiningQuery = this.result.joiningQuery;
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

	addSortBlock() {
		let sortObj = {
            'selectedField': '',
            'order': 'desc',
            'mode': ''
        }
        this.result.sort.push(sortObj);
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
		var es_final = {};

		if(results.length) {
			var finalresult = {};
			es_final['query'] = {
				'bool': finalresult
			};
			results.forEach(function(result) {
				result.availableQuery = self.buildInsideQuery(result);
			});
			var isBoolPresent = true;

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
						if (self.joiningQuery[self.joiningQueryParam] === 'nested') {
							current_query['bool']['nested']['path'] = result1.path;
							current_query['bool']['nested']['score_mode'] = result1.score_mode;
							isBoolPresent = false;
						}
						result0.availableQuery.push(current_query);
					}
				});
			});
			results.forEach(function(result) {
				if (result.parent_id === 0) {
					var currentBool = self.queryList['boolQuery'][result['boolparam']];
					if(self.joiningQuery && self.joiningQuery[self.joiningQueryParam] === 'nested') {
						finalresult['nested'] = {
							path: result.path,
							score_mode: result.score_mode,
							query: {
								bool: {
									[currentBool]: result.availableQuery
								}
							}
						};
						isBoolPresent = false;
					} else if(self.joiningQuery && self.joiningQuery[self.joiningQueryParam] === 'has_child') {
						finalresult[currentBool] = {
							has_child: {
								type: result.type,
								score_mode: result.score_mode,
								query: result.availableQuery
							}
						};
					} else if(self.joiningQuery && self.joiningQuery[self.joiningQueryParam] === 'has_parent') {
						finalresult[currentBool] = {
							has_parent: {
								parent_type: result.parent_type,
								query: result.availableQuery
							}
						};
					} else if(self.joiningQuery && self.joiningQuery[self.joiningQueryParam] === 'parent_id') {
						finalresult[currentBool] = {
							parent_id: {
								type: result.type,
								id: result.xid
							}
						};
					}else {
						finalresult[currentBool] = result.availableQuery;
					}
					if (currentBool === 'should') {
						finalresult['minimum_should_match'] = result.minimum_should_match;
					}
				}
			});

			if (!isBoolPresent) {
				es_final['query'] = es_final['query']['bool'];
			}
		} else {
			if(this.selectedTypes.length) {
				es_final['query'] = {
					'match_all': {}
				};
			}
		}

		// apply sort
		self.result.sort.map((sortObj) => {
			if (sortObj.selectedField) {
				if (!es_final.hasOwnProperty('sort')) {
					es_final['sort'] = [];
				}
				let obj = {
					[sortObj.selectedField]: {
						'order': sortObj.order
					}
				};
				if (sortObj.mode) {
					obj[sortObj.selectedField]['mode'] = sortObj.mode;
				}

				es_final['sort'].push(obj);
			}
		});

		this.result.resultQuery.final = JSON.stringify(es_final, null, 2);
		try {
			this.editorHookHelp.setValue(self.result.resultQuery.final);
		} catch(e) {
			console.log(e);
		}

		//set input state
		try {
			this.urlShare.inputs['result'] = this.result;
			this.urlShare.createUrl();
		} catch (e) {
			console.log(e);
		}
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

	setDocSampleEve(link) {
		this.setDocSample.emit(link);
	}

	setJoiningQueryEve(obj) {
		this.joiningQueryParam = obj.param;
		this.result.resultQuery.availableFields = obj.allFields;
		this.buildQuery();
	}
}
