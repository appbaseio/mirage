"use strict";
var core_1 = require('@angular/core');
var css_animation_builder_1 = require('./css_animation_builder');
var browser_details_1 = require('./browser_details');
var AnimationBuilder = (function () {
    /**
     * Used for DI
     * @param browserDetails
     */
    function AnimationBuilder(browserDetails) {
        this.browserDetails = browserDetails;
    }
    /**
     * Creates a new CSS Animation
     * @returns {CssAnimationBuilder}
     */
    AnimationBuilder.prototype.css = function () { return new css_animation_builder_1.CssAnimationBuilder(this.browserDetails); };
    AnimationBuilder.decorators = [
        { type: core_1.Injectable },
    ];
    AnimationBuilder.ctorParameters = [
        { type: browser_details_1.BrowserDetails, },
    ];
    return AnimationBuilder;
}());
exports.AnimationBuilder = AnimationBuilder;
//# sourceMappingURL=animation_builder.js.map