import { Component, OnChanges, SimpleChange, Input, Output, AfterContentInit, EventEmitter } from "@angular/core";
import { queryList } from "../../shared/queryList";

@Component({
	selector: 'select2',
	templateUrl: './app/build/select2/select2.component.html',
	inputs: ["selectModal", "selectOptions", "querySelector", "selector", "showInfoFlag"]
})

export class select2Component implements OnChanges, AfterContentInit {
	@Input() querySelector;
	@Input() selector;
	@Input() showInfoFlag;
	@Output() callback = new EventEmitter();
	public select2Selector;
	public queryList = queryList;

	constructor() {}

	ngOnChanges() {
	}

	ngAfterContentInit() {
		var select2Selector = $(this.querySelector).find('.'+this.selector).find('select');
		this.setSelect2(select2Selector, function(val) {
			console.log(select2Selector)
			var obj = {
				val: val,
				selector: select2Selector
			};
			this.callback.emit(obj);
		}.bind(this));
	}

	setSelect2(field_select, callback) {
		console.log(field_select);
		field_select.select2({
			placeholder: "Select from the option"
		});
		field_select.on("change", function(e) {
			callback(field_select.val())
		}.bind(this));
		if(this.showInfoFlag) {
			field_select.on("select2:open", function(e) {
				setTimeout(function() {
					var selector = $('li.select2-results__option');
					selector.each(function(i, item) {
						var val = $(item).html();
						var info = this.getInformation(val);
						$(item).popover(info);
					}.bind(this))
				}.bind(this), 300);
			}.bind(this));
		}
	}

	getInformation(query) {
		console.log(this.queryList);
		var query = this.queryList['information'][query];
		query['trigger'] = 'hover';
		return query;
	}
}
