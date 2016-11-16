import { Component, OnChanges, SimpleChange, Input, Output, AfterContentInit, EventEmitter } from "@angular/core";
import { GlobalShare } from "../../shared/globalshare.service";
import { DocService } from "../../shared/docService";

declare var $: any;

@Component({
	selector: 'select2',
	templateUrl: './app/queryBlocks/select2/select2.component.html',
	inputs: ["selectModal", "selectOptions", "setDocSample"],
	providers: [GlobalShare, DocService]
})

export class select2Component implements OnChanges, AfterContentInit {
	@Input() querySelector;
	@Input() selector;
	@Input() showInfoFlag;
	@Input() passWithCallback: any;
	@Input() searchOff: boolean;
	@Input() informationList;
	@Output() callback = new EventEmitter();
	@Output() setDocSample = new EventEmitter();
	public select2Selector;
	constructor(private globalShare: GlobalShare, public docService: DocService) {}

	ngOnChanges() {}

	ngAfterContentInit() {
		setTimeout(function() {
			var select2Selector;
			if(this.querySelector && this.selector) {
				select2Selector = $(this.querySelector).find('.' + this.selector).find('select');
			}
			else {
				select2Selector = $('.' + this.selector).find('select');
			}
			if(typeof this.passWithCallback != 'undefined') {
				if(this.querySelector && this.selector) {
					select2Selector = $(this.querySelector).find('.' + this.selector+'-'+this.passWithCallback).find('select');	
				} else if (this.selector) {
					select2Selector = $('.' + this.selector+'-'+this.passWithCallback).find('select');						
				}
			}
			this.setSelect2(select2Selector, function(val) {
				var obj: any = {
					val: val,
					selector: select2Selector
				};
				if(typeof this.passWithCallback != 'undefined') {
					obj.external = this.passWithCallback;
				}
				this.callback.emit(obj);
			}.bind(this));
		}.bind(this), 300);
	}

	setSelect2(field_select, callback) {
		var select2Option: any = {
			placeholder: "Select from the option"
		};
		if(this.searchOff) {
			select2Option.minimumResultsForSearch = -1;
		}
		field_select.select2(select2Option);
		field_select.on("change", function(e) {
			callback(field_select.val());
		}.bind(this));
		if (this.showInfoFlag) {
			field_select.on("select2:open", function() {
				this.setPopover.apply(this);
				$('.select2-search__field').keyup(function() {
					this.setPopover.apply(this);
				}.bind(this));
				$('.select2-search__field').keydown(function() {
					this.setPopover.apply(this);
				}.bind(this));
			}.bind(this));
		}
	}

	setPopover() {
		setTimeout(function() {
			var selector = $('li.select2-results__option');
			selector.each(function(i, item) {
				var val = $(item).html();
				var info = this.getInformation(val);
				$(item).popover(info);
				$(item).on('shown.bs.popover', this.setLink.bind(this))
				this.setLink();
			}.bind(this))
		}.bind(this), 300);
	}

	getInformation(query: any) {
		var query = this.informationList[query];
		query['html'] = true;
		query['trigger'] = 'click hover';
		query['placement'] = 'right';
		query['delay'] = {'show': 50, 'hide': 50};
		return query;
	}

	setLink() {
		var self = this;
		setTimeout(function() {
			$('.popover a').unbind('click').on('click',function(event) {
				event.preventDefault();
				var link = event.target.href;
				self.setDocSample.emit(link);
				// self.docService.emitNavChangeEvent(link);
				// window.open(link, '_blank');
			});
		}.bind(this), 500);
	}

}
