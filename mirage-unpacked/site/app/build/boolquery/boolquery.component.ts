import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { SinglequeryComponent } from "../singlequery/singlequery.component";
import { EditableComponent } from '../editable/editable.component';
declare var $: any;

@Component({
	selector: 'bool-query',
	templateUrl: './app/build/boolquery/boolquery.component.html',
	inputs: ['mapping', 'types', 'selectedTypes', 'result', 'config', 'query', 'queryList', 'addQuery', 'removeQuery', 'addBoolQuery', 'queryFormat', 'buildQuery', 'buildInsideQuery', 'buildSubQuery', 'createQuery', 'setQueryFormat', 'editorHookHelp', 'urlShare', 'setDocSample'],
	directives: [BoolqueryComponent, SinglequeryComponent, EditableComponent]
})

export class BoolqueryComponent implements OnInit {
	public config: Object;
	public queryList: any = this.queryList;
	public addQuery: any;
	public addBoolQuery: any;
	public removeQuery: any;
	public removeArray: any = [];
	public query: any = this.query;
	public buildQuery: any;
	@Input() mapping: any;
	@Input() types: any;
	@Input() selectedTypes: any;
	@Input() result: any;
	@Output() setDocSample = new EventEmitter < any >();
	
	ngOnInit() {
		this.exeBuild();
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
