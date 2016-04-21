import { stringify, isBlank } from 'angular2/src/facade/lang';
import { BaseException } from 'angular2/src/facade/exceptions';
import { resolveForwardRef } from './forward_ref';
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
export class Key {
    /**
     * Private
     */
    constructor(token, id) {
        this.token = token;
        this.id = id;
        if (isBlank(token)) {
            throw new BaseException('Token must be defined!');
        }
    }
    /**
     * Returns a stringified token.
     */
    get displayName() { return stringify(this.token); }
    /**
     * Retrieves a `Key` for a token.
     */
    static get(token) { return _globalKeyRegistry.get(resolveForwardRef(token)); }
    /**
     * @returns the number of keys registered in the system.
     */
    static get numberOfKeys() { return _globalKeyRegistry.numberOfKeys; }
}
/**
 * @internal
 */
export class KeyRegistry {
    constructor() {
        this._allKeys = new Map();
    }
    get(token) {
        if (token instanceof Key)
            return token;
        if (this._allKeys.has(token)) {
            return this._allKeys.get(token);
        }
        var newKey = new Key(token, Key.numberOfKeys);
        this._allKeys.set(token, newKey);
        return newKey;
    }
    get numberOfKeys() { return this._allKeys.size; }
}
var _globalKeyRegistry = new KeyRegistry();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia2V5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZGlmZmluZ19wbHVnaW5fd3JhcHBlci1vdXRwdXRfcGF0aC1vWERPNHAydi50bXAvYW5ndWxhcjIvc3JjL2NvcmUvZGkva2V5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJPQUFPLEVBQUMsU0FBUyxFQUFlLE9BQU8sRUFBQyxNQUFNLDBCQUEwQjtPQUNqRSxFQUFDLGFBQWEsRUFBbUIsTUFBTSxnQ0FBZ0M7T0FDdkUsRUFBQyxpQkFBaUIsRUFBQyxNQUFNLGVBQWU7QUFFL0M7Ozs7Ozs7Ozs7OztHQVlHO0FBQ0g7SUFDRTs7T0FFRztJQUNILFlBQW1CLEtBQWEsRUFBUyxFQUFVO1FBQWhDLFVBQUssR0FBTCxLQUFLLENBQVE7UUFBUyxPQUFFLEdBQUYsRUFBRSxDQUFRO1FBQ2pELEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDbkIsTUFBTSxJQUFJLGFBQWEsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO1FBQ3BELENBQUM7SUFDSCxDQUFDO0lBRUQ7O09BRUc7SUFDSCxJQUFJLFdBQVcsS0FBYSxNQUFNLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFM0Q7O09BRUc7SUFDSCxPQUFPLEdBQUcsQ0FBQyxLQUFhLElBQVMsTUFBTSxDQUFDLGtCQUFrQixDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUUzRjs7T0FFRztJQUNILFdBQVcsWUFBWSxLQUFhLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO0FBQy9FLENBQUM7QUFFRDs7R0FFRztBQUNIO0lBQUE7UUFDVSxhQUFRLEdBQUcsSUFBSSxHQUFHLEVBQWUsQ0FBQztJQWU1QyxDQUFDO0lBYkMsR0FBRyxDQUFDLEtBQWE7UUFDZixFQUFFLENBQUMsQ0FBQyxLQUFLLFlBQVksR0FBRyxDQUFDO1lBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQztRQUV2QyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDN0IsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ2xDLENBQUM7UUFFRCxJQUFJLE1BQU0sR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBQzlDLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQztRQUNqQyxNQUFNLENBQUMsTUFBTSxDQUFDO0lBQ2hCLENBQUM7SUFFRCxJQUFJLFlBQVksS0FBYSxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0FBQzNELENBQUM7QUFFRCxJQUFJLGtCQUFrQixHQUFHLElBQUksV0FBVyxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge3N0cmluZ2lmeSwgQ09OU1QsIFR5cGUsIGlzQmxhbmt9IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvbGFuZyc7XG5pbXBvcnQge0Jhc2VFeGNlcHRpb24sIFdyYXBwZWRFeGNlcHRpb259IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvZXhjZXB0aW9ucyc7XG5pbXBvcnQge3Jlc29sdmVGb3J3YXJkUmVmfSBmcm9tICcuL2ZvcndhcmRfcmVmJztcblxuLyoqXG4gKiBBIHVuaXF1ZSBvYmplY3QgdXNlZCBmb3IgcmV0cmlldmluZyBpdGVtcyBmcm9tIHRoZSB7QGxpbmsgSW5qZWN0b3J9LlxuICpcbiAqIEtleXMgaGF2ZTpcbiAqIC0gYSBzeXN0ZW0td2lkZSB1bmlxdWUgYGlkYC5cbiAqIC0gYSBgdG9rZW5gLlxuICpcbiAqIGBLZXlgIGlzIHVzZWQgaW50ZXJuYWxseSBieSB7QGxpbmsgSW5qZWN0b3J9IGJlY2F1c2UgaXRzIHN5c3RlbS13aWRlIHVuaXF1ZSBgaWRgIGFsbG93cyB0aGVcbiAqIGluamVjdG9yIHRvIHN0b3JlIGNyZWF0ZWQgb2JqZWN0cyBpbiBhIG1vcmUgZWZmaWNpZW50IHdheS5cbiAqXG4gKiBgS2V5YCBzaG91bGQgbm90IGJlIGNyZWF0ZWQgZGlyZWN0bHkuIHtAbGluayBJbmplY3Rvcn0gY3JlYXRlcyBrZXlzIGF1dG9tYXRpY2FsbHkgd2hlbiByZXNvbHZpbmdcbiAqIHByb3ZpZGVycy5cbiAqL1xuZXhwb3J0IGNsYXNzIEtleSB7XG4gIC8qKlxuICAgKiBQcml2YXRlXG4gICAqL1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgdG9rZW46IE9iamVjdCwgcHVibGljIGlkOiBudW1iZXIpIHtcbiAgICBpZiAoaXNCbGFuayh0b2tlbikpIHtcbiAgICAgIHRocm93IG5ldyBCYXNlRXhjZXB0aW9uKCdUb2tlbiBtdXN0IGJlIGRlZmluZWQhJyk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYSBzdHJpbmdpZmllZCB0b2tlbi5cbiAgICovXG4gIGdldCBkaXNwbGF5TmFtZSgpOiBzdHJpbmcgeyByZXR1cm4gc3RyaW5naWZ5KHRoaXMudG9rZW4pOyB9XG5cbiAgLyoqXG4gICAqIFJldHJpZXZlcyBhIGBLZXlgIGZvciBhIHRva2VuLlxuICAgKi9cbiAgc3RhdGljIGdldCh0b2tlbjogT2JqZWN0KTogS2V5IHsgcmV0dXJuIF9nbG9iYWxLZXlSZWdpc3RyeS5nZXQocmVzb2x2ZUZvcndhcmRSZWYodG9rZW4pKTsgfVxuXG4gIC8qKlxuICAgKiBAcmV0dXJucyB0aGUgbnVtYmVyIG9mIGtleXMgcmVnaXN0ZXJlZCBpbiB0aGUgc3lzdGVtLlxuICAgKi9cbiAgc3RhdGljIGdldCBudW1iZXJPZktleXMoKTogbnVtYmVyIHsgcmV0dXJuIF9nbG9iYWxLZXlSZWdpc3RyeS5udW1iZXJPZktleXM7IH1cbn1cblxuLyoqXG4gKiBAaW50ZXJuYWxcbiAqL1xuZXhwb3J0IGNsYXNzIEtleVJlZ2lzdHJ5IHtcbiAgcHJpdmF0ZSBfYWxsS2V5cyA9IG5ldyBNYXA8T2JqZWN0LCBLZXk+KCk7XG5cbiAgZ2V0KHRva2VuOiBPYmplY3QpOiBLZXkge1xuICAgIGlmICh0b2tlbiBpbnN0YW5jZW9mIEtleSkgcmV0dXJuIHRva2VuO1xuXG4gICAgaWYgKHRoaXMuX2FsbEtleXMuaGFzKHRva2VuKSkge1xuICAgICAgcmV0dXJuIHRoaXMuX2FsbEtleXMuZ2V0KHRva2VuKTtcbiAgICB9XG5cbiAgICB2YXIgbmV3S2V5ID0gbmV3IEtleSh0b2tlbiwgS2V5Lm51bWJlck9mS2V5cyk7XG4gICAgdGhpcy5fYWxsS2V5cy5zZXQodG9rZW4sIG5ld0tleSk7XG4gICAgcmV0dXJuIG5ld0tleTtcbiAgfVxuXG4gIGdldCBudW1iZXJPZktleXMoKTogbnVtYmVyIHsgcmV0dXJuIHRoaXMuX2FsbEtleXMuc2l6ZTsgfVxufVxuXG52YXIgX2dsb2JhbEtleVJlZ2lzdHJ5ID0gbmV3IEtleVJlZ2lzdHJ5KCk7XG4iXX0=