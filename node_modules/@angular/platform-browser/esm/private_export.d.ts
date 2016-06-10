import * as animation_builder from './src/animate/animation_builder';
import * as css_animation_builder from './src/animate/css_animation_builder';
import * as browser_details from './src/animate/browser_details';
import * as css_animation_options from './src/animate/css_animation_options';
import * as animation from './src/animate/animation';
import * as dom_adapter from './src/dom/dom_adapter';
import * as browser_adapter from './src/browser/browser_adapter';
export declare namespace __platform_browser_private__ {
    type DomAdapter = dom_adapter.DomAdapter;
    var DomAdapter: typeof dom_adapter.DomAdapter;
    function getDOM(): DomAdapter;
    function setDOM(adapter: DomAdapter): void;
    var setRootDomAdapter: typeof dom_adapter.setRootDomAdapter;
    type BrowserDomAdapter = browser_adapter.BrowserDomAdapter;
    var BrowserDomAdapter: typeof browser_adapter.BrowserDomAdapter;
    type AnimationBuilder = animation_builder.AnimationBuilder;
    var AnimationBuilder: typeof animation_builder.AnimationBuilder;
    type CssAnimationBuilder = css_animation_builder.CssAnimationBuilder;
    var CssAnimationBuilder: typeof css_animation_builder.CssAnimationBuilder;
    type CssAnimationOptions = css_animation_options.CssAnimationOptions;
    var CssAnimationOptions: typeof css_animation_options.CssAnimationOptions;
    type Animation = animation.Animation;
    var Animation: typeof animation.Animation;
    type BrowserDetails = browser_details.BrowserDetails;
    var BrowserDetails: typeof browser_details.BrowserDetails;
}
