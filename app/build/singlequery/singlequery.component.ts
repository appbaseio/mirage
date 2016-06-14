import { Component, OnInit, OnChanges, Input, AfterViewInit, ViewChild } from "@angular/core";
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
	inputs: ['mapping', 'types', 'selectedTypes', 'result',  'config', 'query', 'queryList', 'addQuery', 'internal', 'internalIndex', 'queryIndex', 'buildQuery', 'buildInsideQuery', 'buildSubQuery', 'createQuery', 'setQueryFormat', 'editorHookHelp', 'urlShare'],
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

export class SinglequeryComponent implements OnInit, OnChanges, AfterViewInit {
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
	@Input() mapping: any;
	@Input() types: any;
	@Input() selectedTypes: any;
	@Input() result: any;
	
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
	}
	ngOnChanges() {
		setTimeout(function() {
			if(this.query.selectedField) {
				console.log(this.result.resultQuery.availableFields);
				var isFieldExists = this.getField(this.query.selectedField);
				if(!isFieldExists.length) {
					this.removeQuery();
				}
			}
		}.bind(this), 300);
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
		$(res.selector).parents('.editable-pack').removeClass('on');
		this.query.field = this.getField(res.val)[0];
		this.query.analyzeTest = this.query.field.index === 'not_analyzed' ? 'not_analyzed' : 'analyzed';
		this.query.type = this.query.field.type;
		this.query.selectedField = res.val;
		this.buildQuery();
	}

	// Query select - change event
	queryCallback(res) {
		res.selector.parents('.editable-pack').removeClass('on');
		this.query.query = res.val;
		this.query.selectedQuery = this.queryList[this.query.analyzeTest][this.query.type][this.query.query];
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

	getField(fieldName: any) {
		return this.result.resultQuery.availableFields.filter(function(ele: any) {
			return ele.name === fieldName;
		});
	}
}
