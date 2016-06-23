import { Injectable } from '@angular/core';
import { Animation } from '../src/animate/animation';
import { BrowserDetails } from '../src/animate/browser_details';
import { AnimationBuilder } from '../src/animate/animation_builder';
import { CssAnimationBuilder } from '../src/animate/css_animation_builder';
export class MockAnimationBuilder extends AnimationBuilder {
    constructor() {
        super(null);
    }
    css() { return new MockCssAnimationBuilder(); }
}
MockAnimationBuilder.decorators = [
    { type: Injectable },
];
MockAnimationBuilder.ctorParameters = [];
class MockCssAnimationBuilder extends CssAnimationBuilder {
    constructor() {
        super(null);
    }
    start(element) { return new MockAnimation(element, this.data); }
}
class MockBrowserAbstraction extends BrowserDetails {
    doesElapsedTimeIncludesDelay() { this.elapsedTimeIncludesDelay = false; }
}
class MockAnimation extends Animation {
    constructor(element, data) {
        super(element, data, new MockBrowserAbstraction());
    }
    wait(callback) { this._callback = callback; }
    flush() {
        this._callback(0);
        this._callback = null;
    }
}
//# sourceMappingURL=animation_builder_mock.js.map