import { print, warn } from './facade/lang';
import { Injectable } from './di/decorators';
// Note: Need to rename warn as in Dart
// class members and imports can't use the same name.
let _warnImpl = warn;
export class Console {
    log(message) { print(message); }
    // Note: for reporting errors use `DOM.logError()` as it is platform specific
    warn(message) { _warnImpl(message); }
}
Console.decorators = [
    { type: Injectable },
];
//# sourceMappingURL=console.js.map