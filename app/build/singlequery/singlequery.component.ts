import { Component, OnInit, Input, AfterViewInit, ViewChild } from "@angular/core";
import { select2Component } from '../select2/select2.component';
import { MatchQuery } from './queries/match.query';
import { Match_phraseQuery } from './queries/match_phrase.query';
import { Match_phase_prefixQuery } from './queries/match_phase_prefix.query';
import { RangeQuery } from './queries/range.query';
import { GtQuery } from './queries/gt.query';
import { LtQuery } from './queries/lt.query';
import { TermQuery } from './queries/term.query';
import { ExistsQuery } from './queries/exists.query';
import { TermsQuery } from './queries/terms.query';
import { PrefixQuery } from './queries/prefix.query';

@Component({
	selector: 'single-query',
	templateUrl: './app/build/singlequery/singlequery.component.html',
	inputs: ['mapping', 'config', 'query', 'queryList', 'addQuery', 'internal', 'internalIndex', 'queryIndex', 'buildQuery', 'buildInsideQuery', 'buildSubQuery', 'createQuery', 'setQueryFormat', 'editorHookHelp'],
	directives: [
		SinglequeryComponent,
		select2Component,
		MatchQuery,
		Match_phraseQuery,
		Match_phase_prefixQuery,
		RangeQuery,
		GtQuery,
		LtQuery
	]
})

export class SinglequeryComponent implements OnInit, AfterViewInit {
	public mapping: any;
	public config: any;
	public queryList: any = this.queryList;
	public addQuery: any;
	public removeArray: any = [];
	public internal: any;
	public internalIndex: number;
	public queryIndex: number;
	public buildQuery: any;
	public querySelector: any;
	public selector = {
		field: 'field-select',
		query: 'query-select'
	};
	public selectedQuery: string = '';
	public selectedField: string = '';

	@ViewChild(MatchQuery) private matchQuery: MatchQuery;
	@ViewChild(Match_phraseQuery) private match_phraseQuery: Match_phraseQuery;
	@ViewChild(Match_phase_prefixQuery) private match_phase_prefixQuery: Match_phase_prefixQuery;
	@ViewChild(RangeQuery) private rangeQuery: RangeQuery;
	@ViewChild(GtQuery) private gtQuery: GtQuery;
	@ViewChild(LtQuery) private ltQuery: LtQuery;
	@ViewChild(TermQuery) private termQuery: TermQuery;
	@ViewChild(ExistsQuery) private existsQuery: ExistsQuery;
	@ViewChild(TermsQuery) private termsQuery: TermsQuery;
	@ViewChild(PrefixQuery) private prefixQuery: PrefixQuery;

	public informationList: any = {};
	@Input() query: any;

	// on initialize set the query selector
	ngOnInit() {
		this.querySelector = '.query-' + this.queryIndex + '-' + this.internalIndex;
		if(this.query.field) {
			this.selectedField = this.mapping.resultQuery.availableFields[this.query.field].name;
		}
		if(this.query.query) {
			this.selectedQuery = this.queryList[this.query.analyzeTest][this.query.type][this.query.query];
		}
	}

	ngAfterViewInit() {
		this.informationList = {
			'match': this.matchQuery.information,
			'match_phrase': this.match_phraseQuery.information,
			'match-phase-prefix': this.match_phase_prefixQuery.information,
			'range': this.rangeQuery.information,
			'gt': this.gtQuery.information,
			'lt': this.ltQuery.information
			// 'term': this.termQuery.information,
			// 'terms': this.termsQuery.information,
			// 'prefix': this.prefixQuery.information
		};
	}

	getQueryFormat(outputQuery) {
		this.query.appliedQuery = outputQuery;
		console.log(this.query.appliedQuery);
		this.buildQuery();
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
		self.selectedField = field.name;
		self.buildQuery();
	}

	// Query select - change event
	queryCallback(res) {
		res.selector.parents('.editable-pack').removeClass('on');
		this.query.query = res.val;
		this.selectedQuery = this.queryList[this.query.analyzeTest][this.query.type][this.query.query];
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
