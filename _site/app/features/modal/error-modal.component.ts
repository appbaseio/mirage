import { Component, OnInit, OnChanges, SimpleChange, Input, Output, EventEmitter } from "@angular/core";

@Component({
	selector: 'error-modal',
	templateUrl: './app/features/modal/error-modal.component.html',
	inputs: ['callback']
})

export class ErrorModalComponent implements OnInit, OnChanges {
	@Input() info: any;
	@Input() errorHookHelp: any;
	@Output() callback = new EventEmitter();
	ngOnInit() {
		var self = this;
		this.errorHookHelp.applyEditor({
			lineNumbers: false,
			lineWrapping: true
		});
	}
	ngOnChanges() {
	}

}
