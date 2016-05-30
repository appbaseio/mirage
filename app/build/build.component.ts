import { Component, OnInit } from "@angular/core";
import { BoolqueryComponent } from "./boolquery/boolquery.component";
import { queryList } from "../shared/queryList";
import { TypesComponent } from "./types/types.component";

@Component({
	selector: 'query-build',
	templateUrl: './app/build/build.component.html',
	styleUrls: ['./app/build/build.component.css'],
	inputs: ['mapping', 'config', 'detectChange', 'editorHookHelp'],
	directives: [TypesComponent, BoolqueryComponent]
})

export class BuildComponent implements OnInit {
	public mapping;
	public config;
	public queryList = queryList;
	public queryFormat: any = {
		internal: {
			field: '',
			query: '',
			input: '',
			analyzeTest: '',
			type: ''
		},
		bool: {
			boolparam: 0,
			parent_id: 0,
			id: 0,
			internal: []
		}
	};
	public editorHookHelp: any;

	ngOnInit() {}

	addBoolQuery(parent_id: number) {
		if (this.mapping.selectedTypes) {
			var queryObj = JSON.parse(JSON.stringify(this.queryFormat.bool));
			var internalObj = JSON.parse(JSON.stringify(this.queryFormat.internal));
			queryObj.internal.push(internalObj);
			queryObj.id = this.mapping.queryId;
			queryObj.parent_id = parent_id;
			this.mapping.queryId += 1;
			this.mapping.resultQuery.result.push(queryObj);
		} else {
			alert('Select type first.');
		}
	}

	addQuery(boolQuery) {
		var self = this;
		var queryObj = JSON.parse(JSON.stringify(self.queryFormat.internal));
		boolQuery.internal.push(queryObj);
	}

	buildQuery() {
		var self = this;
		var results = this.mapping.resultQuery.result;
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
					var currentBool = self.queryList['boolQuery'][result1['boolparam']].apply;
					current_query['bool'][currentBool] = result1.availableQuery;
					result0.availableQuery.push(current_query);
				}
			});
		});
		console.log(results);
		results.forEach(function(result) {
			if (result.parent_id === 0) {
				var currentBool = self.queryList['boolQuery'][result['boolparam']].apply;
				finalresult[currentBool] = result.availableQuery;
			}
		});
		this.mapping.resultQuery.final = JSON.stringify(es_final, null, 2);
		this.editorHookHelp.setValue(self.mapping.resultQuery.final);
	}

	buildInsideQuery(result) {
		var objChain = [];
		result.internal.forEach(function(val0) {
			var childExists = false;
			val0.appliedQuery = this.createQuery(val0, childExists);
			console.log(val0.appliedQuery);
		}.bind(this));


		// this.buildSubQuery()
		result.internal.forEach(function(val) {
			objChain.push(val.appliedQuery)
		});
		return objChain;
	}

	buildSubQuery() {
		var result = this.mapping.resultQuery.result[0];
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

	createQuery(val, childExists) {
		var query = this.queryList[val.analyzeTest][val.type][val.query].apply;
		var field = this.mapping.resultQuery.availableFields[val.field].name;
		var input = val.input;
		var sampleobj = this.setQueryFormat(query, field, val);
		return sampleobj;
	}

	setQueryFormat(query, field, val) {
		var sampleobj = {};
		switch (query) {
			case "gt":
			case "lt":
				sampleobj['range'] = {};
				sampleobj['range'][field] = {};
				sampleobj['range'][field][query] = val.input;
				break;
			case "range":
				sampleobj['range'] = {};
				sampleobj['range'][field] = {};
				sampleobj['range'][field] = {
					'from': val.from,
					'to': val.to
				};
				break;
			default:
				sampleobj[query] = {};
				sampleobj[query][field] = val.input;
				break;
		}
		return sampleobj;
	}

}
