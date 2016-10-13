import { Component, OnInit, OnChanges, SimpleChange, Input, Output, EventEmitter } from "@angular/core";

@Component({
	selector: 'confirm-modal',
	templateUrl: './app/features/confirm/confirm-modal.component.html',
	inputs: ['callback']
})

export class ConfirmModalComponent implements OnInit, OnChanges {
	@Input() info: any;
	@Output() callback = new EventEmitter();
	ngOnInit() {
	}
	ngOnChanges() {
	}
	confirm(flag: boolean) {
		this.callback.emit(flag);
	}

}
