import { Component, OnInit } from "@angular/core";
import { SinglequeryComponent } from "../singlequery/singlequery.component";

@Component({
	selector: 'bool-query',
	templateUrl: './app/build/boolquery/boolquery.component.html',
	inputs: ['mapping', 'config', 'query', 'queryList', 'addQuery', 'removeQuery', 'addBoolQuery', 'queryFormat', 'buildQuery', 'buildInsideQuery', 'buildSubQuery', 'createQuery', 'setQueryFormat', 'editorHookHelp'],
	directives: [BoolqueryComponent, SinglequeryComponent]
})

export class BoolqueryComponent implements OnInit {
	public mapping;
	public config;
	public queryList = this.queryList;
	public addQuery;
	public addBoolQuery;
	public removeQuery;
	public removeArray = [];
	public query = this.query;
	public buildQuery;

	ngOnInit() {
		this.exeBuild();
	}

	addSubQuery(id) {
		this.addBoolQuery(id);
	}
	removeInQuery(id: number) {
		var resulQueries = this.mapping.resultQuery.result;
		this.removeArray.push(id);
		var removeFlag = true;
		resulQueries.forEach(function(v, i) {
			if (v.parent_id == id) {
				this.removeInQuery(v.id);
				removeFlag = false;
			}
		}.bind(this));

		if (removeFlag) {
			this.removeArray.forEach(function(remove_q) {
				resulQueries.forEach(function(v, i) {
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
}
