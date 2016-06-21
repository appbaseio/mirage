import { Component, OnInit, OnChanges, SimpleChange, Input, Output, EventEmitter } from "@angular/core";

@Component({
	selector: 'error-modal',
	templateUrl: './app/features/modal/error-modal.component.html',
	inputs: ['info', 'callback'],
	directives: []
})

export class ErrorModalComponent implements OnInit, OnChanges {
	@Input() info: any;
	@Output() callback = new EventEmitter();
	ngOnInit() {
	}
	ngOnChanges() {
	}

}
