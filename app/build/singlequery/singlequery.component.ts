import {Component} from "angular2/core";

@Component({
	selector: 'single-query',
	templateUrl: './app/build/singlequery/singlequery.component.html',
	styleUrls: ['./app/build/singlequery/singlequery.component.css'],
	inputs: ['mapping', 'config', 'query', 'queryList', 'addQuery', 'internal', 'internalIndex'],
	directives: [SinglequeryComponent]
})

export class SinglequeryComponent {
	public mapping;
	public config;
	public queryList = this.queryList;
	public addQuery;
	public removeArray = [];
	public query = this.query;
	public internal;
	public internalIndex;

	removeQuery() {
		console.log(this.internal, this.internalIndex);
		this.internal.splice(this.internalIndex, 1);
	}

	analyzeTest() {
		var self = this;
		setTimeout(function() {
			var field = self.mapping.resultQuery.availableFields[self.query.field];
			self.query.analyzeTest = field.index === 'not_analyzed' ? 'not_analyzed' : 'analyzed'; 
			self.query.type = field.type;
		},300);
	}
}