import { Injectable } from '@angular/core';
import { CssAnimationBuilder } from './css_animation_builder';
import { BrowserDetails } from './browser_details';
export class AnimationBuilder {
    /**
     * Used for DI
     * @param browserDetails
     */
    constructor(browserDetails) {
        this.browserDetails = browserDetails;
    }
    /**
     * Creates a new CSS Animation
     * @returns {CssAnimationBuilder}
     */
    css() { return new CssAnimationBuilder(this.browserDetails); }
}
AnimationBuilder.decorators = [
    { type: Injectable },
];
AnimationBuilder.ctorParameters = [
    { type: BrowserDetails, },
];
//# sourceMappingURL=animation_builder.js.map