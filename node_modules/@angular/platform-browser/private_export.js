"use strict";
var animation_builder = require('./src/animate/animation_builder');
var css_animation_builder = require('./src/animate/css_animation_builder');
var browser_details = require('./src/animate/browser_details');
var css_animation_options = require('./src/animate/css_animation_options');
var animation = require('./src/animate/animation');
var dom_adapter = require('./src/dom/dom_adapter');
var browser_adapter = require('./src/browser/browser_adapter');
var __platform_browser_private__;
(function (__platform_browser_private__) {
    __platform_browser_private__.DomAdapter = dom_adapter.DomAdapter;
    function getDOM() { return dom_adapter.getDOM(); }
    __platform_browser_private__.getDOM = getDOM;
    function setDOM(adapter) { return dom_adapter.setDOM(adapter); }
    __platform_browser_private__.setDOM = setDOM;
    __platform_browser_private__.setRootDomAdapter = dom_adapter.setRootDomAdapter;
    __platform_browser_private__.BrowserDomAdapter = browser_adapter.BrowserDomAdapter;
    __platform_browser_private__.AnimationBuilder = animation_builder.AnimationBuilder;
    __platform_browser_private__.CssAnimationBuilder = css_animation_builder.CssAnimationBuilder;
    __platform_browser_private__.CssAnimationOptions = css_animation_options.CssAnimationOptions;
    __platform_browser_private__.Animation = animation.Animation;
    __platform_browser_private__.BrowserDetails = browser_details.BrowserDetails;
})(__platform_browser_private__ = exports.__platform_browser_private__ || (exports.__platform_browser_private__ = {}));
//# sourceMappingURL=private_export.js.map