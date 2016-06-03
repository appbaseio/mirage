import { Component, OnInit } from "@angular/core";
import { select2Component } from '../select2/select2.component';


@Component({
	selector: 'single-query',
	templateUrl: './app/build/singlequery/singlequery.component.html',
	inputs: ['mapping', 'config', 'query', 'queryList', 'addQuery', 'internal', 'internalIndex', 'queryIndex', 'buildQuery', 'buildInsideQuery', 'buildSubQuery', 'createQuery', 'setQueryFormat', 'editorHookHelp'],
	directives: [SinglequeryComponent, select2Component]
})

export class SinglequeryComponent implements OnInit {
	public mapping;
	public config;
	public queryList = this.queryList;
	public addQuery;
	public removeArray = [];
	public query = this.query;
	public internal;
	public internalIndex;
	public queryIndex;
	public buildQuery;
	public querySelector;
	public selector = {
		field: 'field-select',
		query: 'query-select'
	};

	// on initialize set the query selector
	ngOnInit() {
		this.querySelector = '.query-' + this.queryIndex + '-' + this.internalIndex;
	}

	// delete query
	removeQuery() {
		this.internal.splice(this.internalIndex, 1);
		this.buildQuery();
	}

	// field select - change event
	// On selecting the field, we are checking if field is analyzed or not
	// and according to that show the available query
	analyzeTest(res) {
		this.query.field = res.val;
		var self = this;
		$(res.selector).parents('.editable-pack').removeClass('on');
		var field = self.mapping.resultQuery.availableFields[self.query.field];
		self.query.analyzeTest = field.index === 'not_analyzed' ? 'not_analyzed' : 'analyzed';
		self.query.type = field.type;
		self.buildQuery();
	}

	// Query select - change event
	queryCallback(res) {
		res.selector.parents('.editable-pack').removeClass('on');
		this.query.query = res.val;
		this.buildQuery();
	}

	// build the query
	// buildquery method is inside build.component
	exeBuild() {
		setTimeout(() => this.buildQuery(), 300);
	}

	// allow user to select field, or query
	// toggle between editable-front and editable-back
	// focus to select element
	editable_on($event) {
		$('.editable-pack').removeClass('on');
		$($event.currentTarget).parents('.editable-pack').addClass('on');
		$($event.currentTarget).parents('.editable-pack').find('select').select2('open');
	}
}
