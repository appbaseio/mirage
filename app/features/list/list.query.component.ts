import { Component, OnChanges, SimpleChange } from "@angular/core";

@Component({
	selector: 'list-query',
	templateUrl: './app/features/list/list.query.component.html',
	inputs: ['config', 'mapping', 'queryList', 'newQuery', 'createTokenData', 'selectedQuery']
})

export class ListQueryComponent {
	public config;
	public mapping;
	public queryList;
	public newQuery;

	applyQuery(i) {
		this.selectedQuery.push(i);
		// var queryData = this.queryList[i];
		// this.newQuery(queryData);
	}

}
