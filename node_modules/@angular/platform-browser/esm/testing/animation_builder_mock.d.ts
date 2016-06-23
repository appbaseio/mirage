import { AnimationBuilder } from '../src/animate/animation_builder';
import { CssAnimationBuilder } from '../src/animate/css_animation_builder';
export declare class MockAnimationBuilder extends AnimationBuilder {
    constructor();
    css(): CssAnimationBuilder;
}
