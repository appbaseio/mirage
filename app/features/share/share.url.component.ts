import { Component, OnInit, OnChanges, SimpleChange, Input, Output, EventEmitter } from "@angular/core";
declare var $: any;

@Component({
	selector: 'share-url',
	templateUrl: './app/features/share/share.url.component.html'
})

export class ShareUrlComponent implements OnInit, OnChanges {
	@Input() urlShare: any;
	ngOnInit() {
		var info = {
			title: 'Share Url',
			content: `<div class="share_content">
						<input type="text" class="form-control" value="" id="for-share">
						<p class="mt-10 success-msg">Link is copied to clipboard!</p>
					</div>`,
			html: true,
			trigger: 'click'
		};
		$('.share-btn').popover(info);
		$('.share-btn').on('shown.bs.popover', function () {
		  this.shareClick();
		}.bind(this));
		$('.share-btn').on('hidden.bs.popover', function () {
		  $('.share_content .success-msg').hide();
		}.bind(this))
	}
	ngOnChanges() {

	}

	shareClick() {
		var link = this.urlShare.convertToUrl('gh-pages');
		$('#for-share').val(link);
		var ele = document.getElementById('for-share');
      	var succeed = this.copyToClipboard(ele);
      	if(succeed) {
	        $('.share_content .success-msg').show();
	    }
	}
	copyToClipboard(elem) {
		// create hidden text element, if it doesn't already exist
		var targetId = "_hiddenCopyText_";
		var isInput = elem.tagName === "INPUT" || elem.tagName === "TEXTAREA";
		var origSelectionStart, origSelectionEnd;
		var target: any;
		if (isInput) {
			// can just use the original source element for the selection and copy
			target = elem;
			origSelectionStart = elem.selectionStart;
			origSelectionEnd = elem.selectionEnd;
		} else {
			// must use a temporary form element for the selection and copy
			target = document.getElementById(targetId);
			if (!target) {
				target = document.createElement("textarea");
				target.style.position = "absolute";
				target.style.left = "-9999px";
				target.style.top = "0";
				target.id = targetId;
				document.body.appendChild(target);
			}
			target.textContent = elem.textContent;
		}
		// select the content
		var currentFocus: any = document.activeElement;
		target.focus();
		target.setSelectionRange(0, target.value.length);

		// copy the selection
		var succeed;
		try {
			succeed = document.execCommand("copy");
		} catch (e) {
			succeed = false;
		}
		// restore original focus
		if (currentFocus && typeof currentFocus.focus === "function") {
			currentFocus.focus();
		}

		if (isInput) {
			// restore prior selection
			elem.setSelectionRange(origSelectionStart, origSelectionEnd);
		} else {
			// clear temporary content
			target.textContent = "";
		}
		return succeed;
	}
}
