'use strict';"use strict";
var lang_1 = require('angular2/src/facade/lang');
var exceptions_1 = require('angular2/src/facade/exceptions');
var forward_ref_1 = require('./forward_ref');
/**
 * A unique object used for retrieving items from the {@link Injector}.
 *
 * Keys have:
 * - a system-wide unique `id`.
 * - a `token`.
 *
 * `Key` is used internally by {@link Injector} because its system-wide unique `id` allows the
 * injector to store created objects in a more efficient way.
 *
 * `Key` should not be created directly. {@link Injector} creates keys automatically when resolving
 * providers.
 */
var Key = (function () {
    /**
     * Private
     */
    function Key(token, id) {
        this.token = token;
        this.id = id;
        if (lang_1.isBlank(token)) {
            throw new exceptions_1.BaseException('Token must be defined!');
        }
    }
    Object.defineProperty(Key.prototype, "displayName", {
        /**
         * Returns a stringified token.
         */
        get: function () { return lang_1.stringify(this.token); },
        enumerable: true,
        configurable: true
    });
    /**
     * Retrieves a `Key` for a token.
     */
    Key.get = function (token) { return _globalKeyRegistry.get(forward_ref_1.resolveForwardRef(token)); };
    Object.defineProperty(Key, "numberOfKeys", {
        /**
         * @returns the number of keys registered in the system.
         */
        get: function () { return _globalKeyRegistry.numberOfKeys; },
        enumerable: true,
        configurable: true
    });
    return Key;
}());
exports.Key = Key;
/**
 * @internal
 */
var KeyRegistry = (function () {
    function KeyRegistry() {
        this._allKeys = new Map();
    }
    KeyRegistry.prototype.get = function (token) {
        if (token instanceof Key)
            return token;
        if (this._allKeys.has(token)) {
            return this._allKeys.get(token);
        }
        var newKey = new Key(token, Key.numberOfKeys);
        this._allKeys.set(token, newKey);
        return newKey;
    };
    Object.defineProperty(KeyRegistry.prototype, "numberOfKeys", {
        get: function () { return this._allKeys.size; },
        enumerable: true,
        configurable: true
    });
    return KeyRegistry;
}());
exports.KeyRegistry = KeyRegistry;
var _globalKeyRegistry = new KeyRegistry();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia2V5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZGlmZmluZ19wbHVnaW5fd3JhcHBlci1vdXRwdXRfcGF0aC1qYWtYbk1tTC50bXAvYW5ndWxhcjIvc3JjL2NvcmUvZGkva2V5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxxQkFBOEMsMEJBQTBCLENBQUMsQ0FBQTtBQUN6RSwyQkFBOEMsZ0NBQWdDLENBQUMsQ0FBQTtBQUMvRSw0QkFBZ0MsZUFBZSxDQUFDLENBQUE7QUFFaEQ7Ozs7Ozs7Ozs7OztHQVlHO0FBQ0g7SUFDRTs7T0FFRztJQUNILGFBQW1CLEtBQWEsRUFBUyxFQUFVO1FBQWhDLFVBQUssR0FBTCxLQUFLLENBQVE7UUFBUyxPQUFFLEdBQUYsRUFBRSxDQUFRO1FBQ2pELEVBQUUsQ0FBQyxDQUFDLGNBQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDbkIsTUFBTSxJQUFJLDBCQUFhLENBQUMsd0JBQXdCLENBQUMsQ0FBQztRQUNwRCxDQUFDO0lBQ0gsQ0FBQztJQUtELHNCQUFJLDRCQUFXO1FBSGY7O1dBRUc7YUFDSCxjQUE0QixNQUFNLENBQUMsZ0JBQVMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDOzs7T0FBQTtJQUUzRDs7T0FFRztJQUNJLE9BQUcsR0FBVixVQUFXLEtBQWEsSUFBUyxNQUFNLENBQUMsa0JBQWtCLENBQUMsR0FBRyxDQUFDLCtCQUFpQixDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBSzNGLHNCQUFXLG1CQUFZO1FBSHZCOztXQUVHO2FBQ0gsY0FBb0MsTUFBTSxDQUFDLGtCQUFrQixDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7OztPQUFBO0lBQy9FLFVBQUM7QUFBRCxDQUFDLEFBeEJELElBd0JDO0FBeEJZLFdBQUcsTUF3QmYsQ0FBQTtBQUVEOztHQUVHO0FBQ0g7SUFBQTtRQUNVLGFBQVEsR0FBRyxJQUFJLEdBQUcsRUFBZSxDQUFDO0lBZTVDLENBQUM7SUFiQyx5QkFBRyxHQUFILFVBQUksS0FBYTtRQUNmLEVBQUUsQ0FBQyxDQUFDLEtBQUssWUFBWSxHQUFHLENBQUM7WUFBQyxNQUFNLENBQUMsS0FBSyxDQUFDO1FBRXZDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM3QixNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDbEMsQ0FBQztRQUVELElBQUksTUFBTSxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDOUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ2pDLE1BQU0sQ0FBQyxNQUFNLENBQUM7SUFDaEIsQ0FBQztJQUVELHNCQUFJLHFDQUFZO2FBQWhCLGNBQTZCLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7OztPQUFBO0lBQzNELGtCQUFDO0FBQUQsQ0FBQyxBQWhCRCxJQWdCQztBQWhCWSxtQkFBVyxjQWdCdkIsQ0FBQTtBQUVELElBQUksa0JBQWtCLEdBQUcsSUFBSSxXQUFXLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7c3RyaW5naWZ5LCBDT05TVCwgVHlwZSwgaXNCbGFua30gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9sYW5nJztcbmltcG9ydCB7QmFzZUV4Y2VwdGlvbiwgV3JhcHBlZEV4Y2VwdGlvbn0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9leGNlcHRpb25zJztcbmltcG9ydCB7cmVzb2x2ZUZvcndhcmRSZWZ9IGZyb20gJy4vZm9yd2FyZF9yZWYnO1xuXG4vKipcbiAqIEEgdW5pcXVlIG9iamVjdCB1c2VkIGZvciByZXRyaWV2aW5nIGl0ZW1zIGZyb20gdGhlIHtAbGluayBJbmplY3Rvcn0uXG4gKlxuICogS2V5cyBoYXZlOlxuICogLSBhIHN5c3RlbS13aWRlIHVuaXF1ZSBgaWRgLlxuICogLSBhIGB0b2tlbmAuXG4gKlxuICogYEtleWAgaXMgdXNlZCBpbnRlcm5hbGx5IGJ5IHtAbGluayBJbmplY3Rvcn0gYmVjYXVzZSBpdHMgc3lzdGVtLXdpZGUgdW5pcXVlIGBpZGAgYWxsb3dzIHRoZVxuICogaW5qZWN0b3IgdG8gc3RvcmUgY3JlYXRlZCBvYmplY3RzIGluIGEgbW9yZSBlZmZpY2llbnQgd2F5LlxuICpcbiAqIGBLZXlgIHNob3VsZCBub3QgYmUgY3JlYXRlZCBkaXJlY3RseS4ge0BsaW5rIEluamVjdG9yfSBjcmVhdGVzIGtleXMgYXV0b21hdGljYWxseSB3aGVuIHJlc29sdmluZ1xuICogcHJvdmlkZXJzLlxuICovXG5leHBvcnQgY2xhc3MgS2V5IHtcbiAgLyoqXG4gICAqIFByaXZhdGVcbiAgICovXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyB0b2tlbjogT2JqZWN0LCBwdWJsaWMgaWQ6IG51bWJlcikge1xuICAgIGlmIChpc0JsYW5rKHRva2VuKSkge1xuICAgICAgdGhyb3cgbmV3IEJhc2VFeGNlcHRpb24oJ1Rva2VuIG11c3QgYmUgZGVmaW5lZCEnKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhIHN0cmluZ2lmaWVkIHRva2VuLlxuICAgKi9cbiAgZ2V0IGRpc3BsYXlOYW1lKCk6IHN0cmluZyB7IHJldHVybiBzdHJpbmdpZnkodGhpcy50b2tlbik7IH1cblxuICAvKipcbiAgICogUmV0cmlldmVzIGEgYEtleWAgZm9yIGEgdG9rZW4uXG4gICAqL1xuICBzdGF0aWMgZ2V0KHRva2VuOiBPYmplY3QpOiBLZXkgeyByZXR1cm4gX2dsb2JhbEtleVJlZ2lzdHJ5LmdldChyZXNvbHZlRm9yd2FyZFJlZih0b2tlbikpOyB9XG5cbiAgLyoqXG4gICAqIEByZXR1cm5zIHRoZSBudW1iZXIgb2Yga2V5cyByZWdpc3RlcmVkIGluIHRoZSBzeXN0ZW0uXG4gICAqL1xuICBzdGF0aWMgZ2V0IG51bWJlck9mS2V5cygpOiBudW1iZXIgeyByZXR1cm4gX2dsb2JhbEtleVJlZ2lzdHJ5Lm51bWJlck9mS2V5czsgfVxufVxuXG4vKipcbiAqIEBpbnRlcm5hbFxuICovXG5leHBvcnQgY2xhc3MgS2V5UmVnaXN0cnkge1xuICBwcml2YXRlIF9hbGxLZXlzID0gbmV3IE1hcDxPYmplY3QsIEtleT4oKTtcblxuICBnZXQodG9rZW46IE9iamVjdCk6IEtleSB7XG4gICAgaWYgKHRva2VuIGluc3RhbmNlb2YgS2V5KSByZXR1cm4gdG9rZW47XG5cbiAgICBpZiAodGhpcy5fYWxsS2V5cy5oYXModG9rZW4pKSB7XG4gICAgICByZXR1cm4gdGhpcy5fYWxsS2V5cy5nZXQodG9rZW4pO1xuICAgIH1cblxuICAgIHZhciBuZXdLZXkgPSBuZXcgS2V5KHRva2VuLCBLZXkubnVtYmVyT2ZLZXlzKTtcbiAgICB0aGlzLl9hbGxLZXlzLnNldCh0b2tlbiwgbmV3S2V5KTtcbiAgICByZXR1cm4gbmV3S2V5O1xuICB9XG5cbiAgZ2V0IG51bWJlck9mS2V5cygpOiBudW1iZXIgeyByZXR1cm4gdGhpcy5fYWxsS2V5cy5zaXplOyB9XG59XG5cbnZhciBfZ2xvYmFsS2V5UmVnaXN0cnkgPSBuZXcgS2V5UmVnaXN0cnkoKTtcbiJdfQ==