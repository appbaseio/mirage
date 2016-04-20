import {Component} from "angular2/core";

@Component({
	selector: 'single-query',
	templateUrl: './app/build/singlequery/singlequery.component.html',
	styleUrls: ['./app/build/singlequery/singlequery.component.css'],
	inputs: ['mapping', 'config', 'query', 'queryList', 'addQuery', 'removeQuery'],
	directives: [SinglequeryComponent]
})

export class SinglequeryComponent {
	public mapping;
	public config;
	public queryList = this.queryList;
	public addQuery;
	public removeQuery;
	public removeArray = [];
	public query = this.query;

	addSubQuery(id) {
		this.addQuery(id);
	}
	removeInQuery(id: number) {
		var resulQueries = this.mapping.resultQuery.result;
		this.removeArray.push(id);
		var removeFlag = true;
		resulQueries.forEach(function(v, i) {
			if(v.parent_id == id) {
				this.removeInQuery(v.id);
				removeFlag = false;
			}
		}.bind(this));

		if (removeFlag) {
			this.removeArray.forEach(function(remove_q){
				resulQueries.forEach(function(v, i) {
					if (v.id == remove_q) {
						resulQueries.splice(i, 1);
					}
				}.bind(this));				
			}.bind(this));
		}
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