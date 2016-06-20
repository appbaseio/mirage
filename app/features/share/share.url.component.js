System.register(["@angular/core"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1;
    var ShareUrlComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            }],
        execute: function() {
            ShareUrlComponent = (function () {
                function ShareUrlComponent() {
                }
                ShareUrlComponent.prototype.ngOnInit = function () {
                    var info = {
                        title: 'Share Url',
                        content: "<div class=\"share_content\">\n\t\t\t\t\t\t<input type=\"text\" class=\"form-control\" value=\"12341234\" id=\"for-share\">\n\t\t\t\t\t\t<p class=\"mt-10 success-msg\">Link is copied to clipboard!</p>\n\t\t\t\t\t</div>",
                        html: true,
                        trigger: 'click'
                    };
                    $('.share-btn').popover(info);
                    $('.share-btn').on('shown.bs.popover', function () {
                        this.shareClick();
                    }.bind(this));
                    $('.share-btn').on('hidden.bs.popover', function () {
                        $('.share_content .success-msg').hide();
                    }.bind(this));
                };
                ShareUrlComponent.prototype.ngOnChanges = function () {
                };
                ShareUrlComponent.prototype.shareClick = function () {
                    var link = this.urlShare.convertToUrl();
                    $('#for-share').val(link);
                    var ele = document.getElementById('for-share');
                    var succeed = this.copyToClipboard(ele);
                    if (succeed) {
                        $('.share_content .success-msg').show();
                    }
                };
                ShareUrlComponent.prototype.copyToClipboard = function (elem) {
                    // create hidden text element, if it doesn't already exist
                    var targetId = "_hiddenCopyText_";
                    var isInput = elem.tagName === "INPUT" || elem.tagName === "TEXTAREA";
                    var origSelectionStart, origSelectionEnd;
                    if (isInput) {
                        // can just use the original source element for the selection and copy
                        target = elem;
                        origSelectionStart = elem.selectionStart;
                        origSelectionEnd = elem.selectionEnd;
                    }
                    else {
                        // must use a temporary form element for the selection and copy
                        target = document.getElementById(targetId);
                        if (!target) {
                            var target = document.createElement("textarea");
                            target.style.position = "absolute";
                            target.style.left = "-9999px";
                            target.style.top = "0";
                            target.id = targetId;
                            document.body.appendChild(target);
                        }
                        target.textContent = elem.textContent;
                    }
                    // select the content
                    var currentFocus = document.activeElement;
                    target.focus();
                    target.setSelectionRange(0, target.value.length);
                    // copy the selection
                    var succeed;
                    try {
                        succeed = document.execCommand("copy");
                    }
                    catch (e) {
                        succeed = false;
                    }
                    // restore original focus
                    if (currentFocus && typeof currentFocus.focus === "function") {
                        currentFocus.focus();
                    }
                    if (isInput) {
                        // restore prior selection
                        elem.setSelectionRange(origSelectionStart, origSelectionEnd);
                    }
                    else {
                        // clear temporary content
                        target.textContent = "";
                    }
                    return succeed;
                };
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], ShareUrlComponent.prototype, "urlShare", void 0);
                ShareUrlComponent = __decorate([
                    core_1.Component({
                        selector: 'share-url',
                        templateUrl: './app/features/share/share.url.component.html',
                        inputs: ['urlShare'],
                        directives: []
                    }), 
                    __metadata('design:paramtypes', [])
                ], ShareUrlComponent);
                return ShareUrlComponent;
            }());
            exports_1("ShareUrlComponent", ShareUrlComponent);
        }
    }
});
//# sourceMappingURL=share.url.component.js.map