import { Component, OnInit } from "@angular/core";

@Component({
	selector: 'single-query',
	templateUrl: './app/build/singlequery/singlequery.component.html',
	inputs: ['mapping', 'config', 'query', 'queryList', 'addQuery', 'internal', 'internalIndex', 'queryIndex', 'buildQuery', 'buildInsideQuery', 'buildSubQuery', 'createQuery', 'setQueryFormat', 'editorHookHelp'],
	directives: [SinglequeryComponent]
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

	// on initialize set the select2 on field select element
	ngOnInit() {
		setTimeout(() => {
			var field_select = $('.query-' + this.queryIndex + '-' + this.internalIndex).find('.field-select');
			this.setSelect2(field_select, function(val) {
				this.query.field = val;
				this.analyzeTest(field_select);
			}.bind(this));
		}, 300)
	}

	// delete query
	removeQuery() {
		this.internal.splice(this.internalIndex, 1);
	}

	// On selecting the field, we are checking if field is analyzed or not
	// and according to that show the available query
	// and then apply select2 for query select element
	analyzeTest($event) {
		var self = this;
		$($event).parents('.editable-pack').removeClass('on');
		setTimeout(function() {
			var field = self.mapping.resultQuery.availableFields[self.query.field];
			self.query.analyzeTest = field.index === 'not_analyzed' ? 'not_analyzed' : 'analyzed';
			self.query.type = field.type;
			self.buildQuery();
			setTimeout(() => {
				var field_select = $('.query-' + self.queryIndex + '-' + self.internalIndex).find('.query-select');
				self.setSelect2(field_select, function(val) {
					field_select.parents('.editable-pack').removeClass('on');
					self.query.query = val;
					self.exeBuild();
				});
			}, 300)
		}, 300);
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

	// set the select2 - autocomplete.
	setSelect2(field_select, callback) {
		field_select.select2({
			placeholder: "Select from the option"
		});
		field_select.on("change", function(e) {
			callback(field_select.val())
		}.bind(this));
	}
}
