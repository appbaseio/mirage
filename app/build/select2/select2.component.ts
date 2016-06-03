import { Component, OnChanges, SimpleChange, Input, Output, AfterContentInit, EventEmitter } from "@angular/core";

@Component({
	selector: 'select2',
	templateUrl: './app/build/select2/select2.component.html',
	inputs: ["selectModal", "selectOptions", "querySelector", "selector"]
})

export class select2Component implements OnChanges, AfterContentInit {
	@Input() querySelector;
	@Input() selector;
	@Output() callback = new EventEmitter();
	public select2Selector;

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
	}
}
