import {Component} from "angular2/core";

@Component({
	selector: 'single-query',
	templateUrl: './app/build/singlequery/singlequery.component.html',
	styleUrls: ['./app/build/singlequery/singlequery.component.css'],
	inputs: ['mapping', 'config', 'query', 'queryList']
})

export class SinglequeryComponent {
	public mapping;
	public config;
	public queryList = this.queryList;
}