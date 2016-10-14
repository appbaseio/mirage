import { Component, OnInit, OnChanges, Input, AfterViewInit, ViewChild, Output, EventEmitter } from "@angular/core";

declare var $;

@Component({
	selector: 'editable',
	templateUrl: './app/queryBlocks/editable/editable.component.html',
	inputs: ['editPlaceholder', 'callback', 'selectOption', 'informationList', 'showInfoFlag', 'searchOff', 'setDocSample']
})

export class EditableComponent implements OnInit, OnChanges, AfterViewInit {	
	@Input() editableField: any;
	@Input() editableInput: any;
	@Input() result: any;
	@Input() querySelector: any;
	@Input() selector: any;
	@Input() editableModal: any;
	@Input() passWithCallback: any;
	@Output() callback = new EventEmitter();
	@Output() setDocSample = new EventEmitter < any >();

	ngOnInit() {
	}
	ngOnChanges() {
	}

	ngAfterViewInit() {
	}

	// allow user to select field, or query
	// toggle between editable-front and editable-back
	// focus to select element
	editable_on($event: any) {
		$('.editable-pack').removeClass('on');
		$($event.currentTarget).parents('.editable-pack').addClass('on');
		if(this.editableInput == 'select2') {
			$($event.currentTarget).parents('.editable-pack').find('select').select2('open');
		}
		if(this.editableInput == 'select') {
			$($event.currentTarget).parents('.editable-pack').find('select').focus().simulate('mousedown');
		}
	}
	editable_off($event: any) {
		setTimeout(function() { 
			$('.editable-pack').removeClass('on');
			if(typeof this.passWithCallback != 'undefined') {
				var obj = {
					external: this.passWithCallback,
					value: this.editableModal
				};	
				this.callback.emit(obj);
			} else {
				this.callback.emit(this.editableModal);
			}
		}.bind(this), 300);
	}
	setDocSampleEve(link) {
		this.setDocSample.emit(link);
	}

}
