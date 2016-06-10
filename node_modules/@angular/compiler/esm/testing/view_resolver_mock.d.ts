import { ViewMetadata, Type } from '@angular/core';
import { ViewResolver } from '../index';
export declare class MockViewResolver extends ViewResolver {
    /** @internal */
    _views: Map<Type, ViewMetadata>;
    /** @internal */
    _inlineTemplates: Map<Type, string>;
    /** @internal */
    _viewCache: Map<Type, ViewMetadata>;
    /** @internal */
    _directiveOverrides: Map<Type, Map<Type, Type>>;
    constructor();
    /**
     * Overrides the {@link ViewMetadata} for a component.
     *
     * @param {Type} component
     * @param {ViewDefinition} view
     */
    setView(component: Type, view: ViewMetadata): void;
    /**
     * Overrides the inline template for a component - other configuration remains unchanged.
     *
     * @param {Type} component
     * @param {string} template
     */
    setInlineTemplate(component: Type, template: string): void;
    /**
     * Overrides a directive from the component {@link ViewMetadata}.
     *
     * @param {Type} component
     * @param {Type} from
     * @param {Type} to
     */
    overrideViewDirective(component: Type, from: Type, to: Type): void;
    /**
     * Returns the {@link ViewMetadata} for a component:
     * - Set the {@link ViewMetadata} to the overridden view when it exists or fallback to the default
     * `ViewResolver`,
     *   see `setView`.
     * - Override the directives, see `overrideViewDirective`.
     * - Override the @View definition, see `setInlineTemplate`.
     *
     * @param component
     * @returns {ViewDefinition}
     */
    resolve(component: Type): ViewMetadata;
    /**
     * @internal
     *
     * Once a component has been compiled, the AppProtoView is stored in the compiler cache.
     *
     * Then it should not be possible to override the component configuration after the component
     * has been compiled.
     *
     * @param {Type} component
     */
    _checkOverrideable(component: Type): void;
}
