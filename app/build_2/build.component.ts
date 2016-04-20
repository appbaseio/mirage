import {Component} from "angular2/core";
import {SinglequeryComponent} from "./singlequery/singlequery.component";
import {queryList} from "../shared/queryList";

@Component({
	selector: 'query-build',
	templateUrl: './app/build/build.component.html',
	styleUrls: ['./app/build/build.component.css'],
	inputs: ['mapping', 'config'],
	directives: [SinglequeryComponent]
})

export class BuildComponent {
	public mapping;
	public config;
	public queryList = queryList;
	
	addQuery(parent_id: number) {
		
		// Only if type is selected
		if(this.mapping.types) {
			var queryObj = {
					field: '',
					query: '',
					input: '',
					analyzeTest: '',
					type: '',
					parent_id: 0,
					id: 0
			};
			queryObj.id =  this.mapping.queryId;
			queryObj.parent_id = parent_id;
			this.mapping.queryId += 1;
			this.mapping.resultQuery.result.push(queryObj);
		}

		else {
			alert('Select type first.');
		}
	}

	buildQuery() {
		var result = this.mapping.resultQuery.result;
		var objChain = [];
		
		result.forEach(function(val0) {
			var childExists = false;
			result.forEach(function(val1) {
				if (val0.id == val1.parent_id){
					childExists = true;
				}
			});
			val0.appliedQuery = this.createQuery(val0, childExists);	
		}.bind(this));
		var es_query = {
			"query": {
				"bool": {
					"must": objChain
				}
			}
		}
		this.buildSubQuery()
		result.forEach(function(val) {
			if(val.parent_id == 0) {
				objChain.push(val.appliedQuery)
			}
		});
		this.mapping.resultQuery.final = JSON.stringify(es_query, null, 4);
	}

	buildSubQuery() {
		var result = this.mapping.resultQuery.result;
		result.forEach(function(val0){
			if (val0.parent_id != 0) {
				result.forEach(function(val1){
					if(val0.parent_id == val1.id) {
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
		if (childExists)
			sampleobj['bool'] = { 'must': [] };
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

