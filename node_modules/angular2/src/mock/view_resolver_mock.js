'use strict';"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var di_1 = require('angular2/src/core/di');
var collection_1 = require('angular2/src/facade/collection');
var lang_1 = require('angular2/src/facade/lang');
var exceptions_1 = require('angular2/src/facade/exceptions');
var metadata_1 = require('../core/metadata');
var view_resolver_1 = require('angular2/src/core/linker/view_resolver');
var MockViewResolver = (function (_super) {
    __extends(MockViewResolver, _super);
    function MockViewResolver() {
        _super.call(this);
        /** @internal */
        this._views = new collection_1.Map();
        /** @internal */
        this._inlineTemplates = new collection_1.Map();
        /** @internal */
        this._viewCache = new collection_1.Map();
        /** @internal */
        this._directiveOverrides = new collection_1.Map();
    }
    /**
     * Overrides the {@link ViewMetadata} for a component.
     *
     * @param {Type} component
     * @param {ViewDefinition} view
     */
    MockViewResolver.prototype.setView = function (component, view) {
        this._checkOverrideable(component);
        this._views.set(component, view);
    };
    /**
     * Overrides the inline template for a component - other configuration remains unchanged.
     *
     * @param {Type} component
     * @param {string} template
     */
    MockViewResolver.prototype.setInlineTemplate = function (component, template) {
        this._checkOverrideable(component);
        this._inlineTemplates.set(component, template);
    };
    /**
     * Overrides a directive from the component {@link ViewMetadata}.
     *
     * @param {Type} component
     * @param {Type} from
     * @param {Type} to
     */
    MockViewResolver.prototype.overrideViewDirective = function (component, from, to) {
        this._checkOverrideable(component);
        var overrides = this._directiveOverrides.get(component);
        if (lang_1.isBlank(overrides)) {
            overrides = new collection_1.Map();
            this._directiveOverrides.set(component, overrides);
        }
        overrides.set(from, to);
    };
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
    MockViewResolver.prototype.resolve = function (component) {
        var view = this._viewCache.get(component);
        if (lang_1.isPresent(view))
            return view;
        view = this._views.get(component);
        if (lang_1.isBlank(view)) {
            view = _super.prototype.resolve.call(this, component);
        }
        var directives = view.directives;
        var overrides = this._directiveOverrides.get(component);
        if (lang_1.isPresent(overrides) && lang_1.isPresent(directives)) {
            directives = collection_1.ListWrapper.clone(view.directives);
            overrides.forEach(function (to, from) {
                var srcIndex = directives.indexOf(from);
                if (srcIndex == -1) {
                    throw new exceptions_1.BaseException("Overriden directive " + lang_1.stringify(from) + " not found in the template of " + lang_1.stringify(component));
                }
                directives[srcIndex] = to;
            });
            view = new metadata_1.ViewMetadata({ template: view.template, templateUrl: view.templateUrl, directives: directives });
        }
        var inlineTemplate = this._inlineTemplates.get(component);
        if (lang_1.isPresent(inlineTemplate)) {
            view = new metadata_1.ViewMetadata({ template: inlineTemplate, templateUrl: null, directives: view.directives });
        }
        this._viewCache.set(component, view);
        return view;
    };
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
    MockViewResolver.prototype._checkOverrideable = function (component) {
        var cached = this._viewCache.get(component);
        if (lang_1.isPresent(cached)) {
            throw new exceptions_1.BaseException("The component " + lang_1.stringify(component) + " has already been compiled, its configuration can not be changed");
        }
    };
    MockViewResolver = __decorate([
        di_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], MockViewResolver);
    return MockViewResolver;
}(view_resolver_1.ViewResolver));
exports.MockViewResolver = MockViewResolver;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmlld19yZXNvbHZlcl9tb2NrLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZGlmZmluZ19wbHVnaW5fd3JhcHBlci1vdXRwdXRfcGF0aC1qYWtYbk1tTC50bXAvYW5ndWxhcjIvc3JjL21vY2svdmlld19yZXNvbHZlcl9tb2NrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUFBLG1CQUF5QixzQkFBc0IsQ0FBQyxDQUFBO0FBQ2hELDJCQUEyQyxnQ0FBZ0MsQ0FBQyxDQUFBO0FBQzVFLHFCQUFrRCwwQkFBMEIsQ0FBQyxDQUFBO0FBQzdFLDJCQUE4QyxnQ0FBZ0MsQ0FBQyxDQUFBO0FBRS9FLHlCQUEyQixrQkFBa0IsQ0FBQyxDQUFBO0FBQzlDLDhCQUEyQix3Q0FBd0MsQ0FBQyxDQUFBO0FBR3BFO0lBQXNDLG9DQUFZO0lBVWhEO1FBQWdCLGlCQUFPLENBQUM7UUFUeEIsZ0JBQWdCO1FBQ2hCLFdBQU0sR0FBRyxJQUFJLGdCQUFHLEVBQXNCLENBQUM7UUFDdkMsZ0JBQWdCO1FBQ2hCLHFCQUFnQixHQUFHLElBQUksZ0JBQUcsRUFBZ0IsQ0FBQztRQUMzQyxnQkFBZ0I7UUFDaEIsZUFBVSxHQUFHLElBQUksZ0JBQUcsRUFBc0IsQ0FBQztRQUMzQyxnQkFBZ0I7UUFDaEIsd0JBQW1CLEdBQUcsSUFBSSxnQkFBRyxFQUF5QixDQUFDO0lBRTlCLENBQUM7SUFFMUI7Ozs7O09BS0c7SUFDSCxrQ0FBTyxHQUFQLFVBQVEsU0FBZSxFQUFFLElBQWtCO1FBQ3pDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUNuQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDbkMsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0gsNENBQWlCLEdBQWpCLFVBQWtCLFNBQWUsRUFBRSxRQUFnQjtRQUNqRCxJQUFJLENBQUMsa0JBQWtCLENBQUMsU0FBUyxDQUFDLENB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Q0FBQztRQUNsRixDQUFDO1FBRUQsSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3JDLE1BQU0sQ0FBQyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBRUQ7Ozs7Ozs7OztPQVNHO0lBQ0gsNkNBQWtCLEdBQWxCLFVBQW1CLFNBQWU7UUFDaEMsSUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUM7UUFFNUMsRUFBRSxDQUFDLENBQUMsZ0JBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDdEIsTUFBTSxJQUFJLDBCQUFhLENBQ25CLG1CQUFpQixnQkFBUyxDQUFDLFNBQVMsQ0FBQyxxRUFBa0UsQ0FBQyxDQUFDO1FBQy9HLENBQUM7SUFDSCxDQUFDO0lBdkhIO1FBQUMsZUFBVSxFQUFFOzt3QkFBQTtJQXdIYix1QkFBQztBQUFELENBQUMsQUF2SEQsQ0FBc0MsNEJBQVksR0F1SGpEO0FBdkhZLHdCQUFnQixtQkF1SDVCLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0luamVjdGFibGV9IGZyb20gJ2FuZ3VsYXIyL3NyYy9jb3JlL2RpJztcbmltcG9ydCB7TWFwLCBNYXBXcmFwcGVyLCBMaXN0V3JhcHBlcn0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9jb2xsZWN0aW9uJztcbmltcG9ydCB7VHlwZSwgaXNQcmVzZW50LCBzdHJpbmdpZnksIGlzQmxhbmt9IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvbGFuZyc7XG5pbXBvcnQge0Jhc2VFeGNlcHRpb24sIFdyYXBwZWRFeGNlcHRpb259IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvZXhjZXB0aW9ucyc7XG5cbmltcG9ydCB7Vmlld01ldGFkYXRhfSBmcm9tICcuLi9jb3JlL21ldGFkYXRhJztcbmltcG9ydCB7Vmlld1Jlc29sdmVyfSBmcm9tICdhbmd1bGFyMi9zcmMvY29yZS9saW5rZXIvdmlld19yZXNvbHZlcic7XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBNb2NrVmlld1Jlc29sdmVyIGV4dGVuZHMgVmlld1Jlc29sdmVyIHtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfdmlld3MgPSBuZXcgTWFwPFR5cGUsIFZpZXdNZXRhZGF0YT4oKTtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfaW5saW5lVGVtcGxhdGVzID0gbmV3IE1hcDxUeXBlLCBzdHJpbmc+KCk7XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX3ZpZXdDYWNoZSA9IG5ldyBNYXA8VHlwZSwgVmlld01ldGFkYXRhPigpO1xuICAvKiogQGludGVybmFsICovXG4gIF9kaXJlY3RpdmVPdmVycmlkZXMgPSBuZXcgTWFwPFR5cGUsIE1hcDxUeXBlLCBUeXBlPj4oKTtcblxuICBjb25zdHJ1Y3RvcigpIHsgc3VwZXIoKTsgfVxuXG4gIC8qKlxuICAgKiBPdmVycmlkZXMgdGhlIHtAbGluayBWaWV3TWV0YWRhdGF9IGZvciBhIGNvbXBvbmVudC5cbiAgICpcbiAgICogQHBhcmFtIHtUeXBlfSBjb21wb25lbnRcbiAgICogQHBhcmFtIHtWaWV3RGVmaW5pdGlvbn0gdmlld1xuICAgKi9cbiAgc2V0Vmlldyhjb21wb25lbnQ6IFR5cGUsIHZpZXc6IFZpZXdNZXRhZGF0YSk6IHZvaWQge1xuICAgIHRoaXMuX2NoZWNrT3ZlcnJpZGVhYmxlKGNvbXBvbmVudCk7XG4gICAgdGhpcy5fdmlld3Muc2V0KGNvbXBvbmVudCwgdmlldyk7XG4gIH1cblxuICAvKipcbiAgICogT3ZlcnJpZGVzIHRoZSBpbmxpbmUgdGVtcGxhdGUgZm9yIGEgY29tcG9uZW50IC0gb3RoZXIgY29uZmlndXJhdGlvbiByZW1haW5zIHVuY2hhbmdlZC5cbiAgICpcbiAgICogQHBhcmFtIHtUeXBlfSBjb21wb25lbnRcbiAgICogQHBhcmFtIHtzdHJpbmd9IHRlbXBsYXRlXG4gICAqL1xuICBzZXRJbmxpbmVUZW1wbGF0ZShjb21wb25lbnQ6IFR5cGUsIHRlbXBsYXRlOiBzdHJpbmcpOiB2b2lkIHtcbiAgICB0aGlzLl9jaGVja092ZXJyaWRlYWJsZShjb21wb25lbnQpO1xuICAgIHRoaXMuX2lubGluZVRlbXBsYXRlcy5zZXQoY29tcG9uZW50LCB0ZW1wbGF0ZSk7XG4gIH1cblxuICAvKipcbiAgICogT3ZlcnJpZGVzIGEgZGlyZWN0aXZlIGZyb20gdGhlIGNvbXBvbmVudCB7QGxpbmsgVmlld01ldGFkYXRhfS5cbiAgICpcbiAgICogQHBhcmFtIHtUeXBlfSBjb21wb25lbnRcbiAgICogQHBhcmFtIHtUeXBlfSBmcm9tXG4gICAqIEBwYXJhbSB7VHlwZX0gdG9cbiAgICovXG4gIG92ZXJyaWRlVmlld0RpcmVjdGl2ZShjb21wb25lbnQ6IFR5cGUsIGZyb206IFR5cGUsIHRvOiBUeXBlKTogdm9pZCB7XG4gICAgdGhpcy5fY2hlY2tPdmVycmlkZWFibGUoY29tcG9uZW50KTtcblxuICAgIHZhciBvdmVycmlkZXMgPSB0aGlzLl9kaXJlY3RpdmVPdmVycmlkZXMuZ2V0KGNvbXBvbmVudCk7XG5cbiAgICBpZiAoaXNCbGFuayhvdmVycmlkZXMpKSB7XG4gICAgICBvdmVycmlkZXMgPSBuZXcgTWFwPFR5cGUsIFR5cGU+KCk7XG4gICAgICB0aGlzLl9kaXJlY3RpdmVPdmVycmlkZXMuc2V0KGNvbXBvbmVudCwgb3ZlcnJpZGVzKTtcbiAgICB9XG5cbiAgICBvdmVycmlkZXMuc2V0KGZyb20sIHRvKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSB7QGxpbmsgVmlld01ldGFkYXRhfSBmb3IgYSBjb21wb25lbnQ6XG4gICAqIC0gU2V0IHRoZSB7QGxpbmsgVmlld01ldGFkYXRhfSB0byB0aGUgb3ZlcnJpZGRlbiB2aWV3IHdoZW4gaXQgZXhpc3RzIG9yIGZhbGxiYWNrIHRvIHRoZSBkZWZhdWx0XG4gICAqIGBWaWV3UmVzb2x2ZXJgLFxuICAgKiAgIHNlZSBgc2V0Vmlld2AuXG4gICAqIC0gT3ZlcnJpZGUgdGhlIGRpcmVjdGl2ZXMsIHNlZSBgb3ZlcnJpZGVWaWV3RGlyZWN0aXZlYC5cbiAgICogLSBPdmVycmlkZSB0aGUgQFZpZXcgZGVmaW5pdGlvbiwgc2VlIGBzZXRJbmxpbmVUZW1wbGF0ZWAuXG4gICAqXG4gICAqIEBwYXJhbSBjb21wb25lbnRcbiAgICogQHJldHVybnMge1ZpZXdEZWZpbml0aW9ufVxuICAgKi9cbiAgcmVzb2x2ZShjb21wb25lbnQ6IFR5cGUpOiBWaWV3TWV0YWRhdGEge1xuICAgIHZhciB2aWV3ID0gdGhpcy5fdmlld0NhY2hlLmdldChjb21wb25lbnQpO1xuICAgIGlmIChpc1ByZXNlbnQodmlldykpIHJldHVybiB2aWV3O1xuXG4gICAgdmlldyA9IHRoaXMuX3ZpZXdzLmdldChjb21wb25lbnQpO1xuICAgIGlmIChpc0JsYW5rKHZpZXcpKSB7XG4gICAgICB2aWV3ID0gc3VwZXIucmVzb2x2ZShjb21wb25lbnQpO1xuICAgIH1cblxuICAgIHZhciBkaXJlY3RpdmVzID0gdmlldy5kaXJlY3RpdmVzO1xuICAgIHZhciBvdmVycmlkZXMgPSB0aGlzLl9kaXJlY3RpdmVPdmVycmlkZXMuZ2V0KGNvbXBvbmVudCk7XG5cbiAgICBpZiAoaXNQcmVzZW50KG92ZXJyaWRlcykgJiYgaXNQcmVzZW50KGRpcmVjdGl2ZXMpKSB7XG4gICAgICBkaXJlY3RpdmVzID0gTGlzdFdyYXBwZXIuY2xvbmUodmlldy5kaXJlY3RpdmVzKTtcbiAgICAgIG92ZXJyaWRlcy5mb3JFYWNoKCh0bywgZnJvbSkgPT4ge1xuICAgICAgICB2YXIgc3JjSW5kZXggPSBkaXJlY3RpdmVzLmluZGV4T2YoZnJvbSk7XG4gICAgICAgIGlmIChzcmNJbmRleCA9PSAtMSkge1xuICAgICAgICAgIHRocm93IG5ldyBCYXNlRXhjZXB0aW9uKFxuICAgICAgICAgICAgICBgT3ZlcnJpZGVuIGRpcmVjdGl2ZSAke3N0cmluZ2lmeShmcm9tKX0gbm90IGZvdW5kIGluIHRoZSB0ZW1wbGF0ZSBvZiAke3N0cmluZ2lmeShjb21wb25lbnQpfWApO1xuICAgICAgICB9XG4gICAgICAgIGRpcmVjdGl2ZXNbc3JjSW5kZXhdID0gdG87XG4gICAgICB9KTtcbiAgICAgIHZpZXcgPSBuZXcgVmlld01ldGFkYXRhKFxuICAgICAgICAgIHt0ZW1wbGF0ZTogdmlldy50ZW1wbGF0ZSwgdGVtcGxhdGVVcmw6IHZpZXcudGVtcGxhdGVVcmwsIGRpcmVjdGl2ZXM6IGRpcmVjdGl2ZXN9KTtcbiAgICB9XG5cbiAgICB2YXIgaW5saW5lVGVtcGxhdGUgPSB0aGlzLl9pbmxpbmVUZW1wbGF0ZXMuZ2V0KGNvbXBvbmVudCk7XG4gICAgaWYgKGlzUHJlc2VudChpbmxpbmVUZW1wbGF0ZSkpIHtcbiAgICAgIHZpZXcgPSBuZXcgVmlld01ldGFkYXRhKFxuICAgICAgICAgIHt0ZW1wbGF0ZTogaW5saW5lVGVtcGxhdGUsIHRlbXBsYXRlVXJsOiBudWxsLCBkaXJlY3RpdmVzOiB2aWV3LmRpcmVjdGl2ZXN9KTtcbiAgICB9XG5cbiAgICB0aGlzLl92aWV3Q2FjaGUuc2V0KGNvbXBvbmVudCwgdmlldyk7XG4gICAgcmV0dXJuIHZpZXc7XG4gIH1cblxuICAvKipcbiAgICogQGludGVybmFsXG4gICAqXG4gICAqIE9uY2UgYSBjb21wb25lbnQgaGFzIGJlZW4gY29tcGlsZWQsIHRoZSBBcHBQcm90b1ZpZXcgaXMgc3RvcmVkIGluIHRoZSBjb21waWxlciBjYWNoZS5cbiAgICpcbiAgICogVGhlbiBpdCBzaG91bGQgbm90IGJlIHBvc3NpYmxlIHRvIG92ZXJyaWRlIHRoZSBjb21wb25lbnQgY29uZmlndXJhdGlvbiBhZnRlciB0aGUgY29tcG9uZW50XG4gICAqIGhhcyBiZWVuIGNvbXBpbGVkLlxuICAgKlxuICAgKiBAcGFyYW0ge1R5cGV9IGNvbXBvbmVudFxuICAgKi9cbiAgX2NoZWNrT3ZlcnJpZGVhYmxlKGNvbXBvbmVudDogVHlwZSk6IHZvaWQge1xuICAgIHZhciBjYWNoZWQgPSB0aGlzLl92aWV3Q2FjaGUuZ2V0KGNvbXBvbmVudCk7XG5cbiAgICBpZiAoaXNQcmVzZW50KGNhY2hlZCkpIHtcbiAgICAgIHRocm93IG5ldyBCYXNlRXhjZXB0aW9uKFxuICAgICAgICAgIGBUaGUgY29tcG9uZW50ICR7c3RyaW5naWZ5KGNvbXBvbmVudCl9IGhhcyBhbHJlYWR5IGJlZW4gY29tcGlsZWQsIGl0cyBjb25maWd1cmF0aW9uIGNhbiBub3QgYmUgY2hhbmdlZGApO1xuICAgIH1cbiAgfVxufVxuIl19