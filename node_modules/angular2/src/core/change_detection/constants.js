'use strict';"use strict";
var lang_1 = require('angular2/src/facade/lang');
/**
 * Describes the current state of the change detector.
 */
(function (ChangeDetectorState) {
    /**
     * `NeverChecked` means that the change detector has not been checked yet, and
     * initialization methods should be called during detection.
     */
    ChangeDetectorState[ChangeDetectorState["NeverChecked"] = 0] = "NeverChecked";
    /**
     * `CheckedBefore` means that the change detector has successfully completed at least
     * one detection previously.
     */
    ChangeDetectorState[ChangeDetectorState["CheckedBefore"] = 1] = "CheckedBefore";
    /**
     * `Errored` means that the change detector encountered an error checking a binding
     * or calling a directive lifecycle method and is now in an inconsistent state. Change
     * detectors in this state will no longer detect changes.
     */
    ChangeDetectorState[ChangeDetectorState["Errored"] = 2] = "Errored";
})(exports.ChangeDetectorState || (exports.ChangeDetectorState = {}));
var ChangeDetectorState = exports.ChangeDetectorState;
/**
 * Describes within the change detector which strategy will be used the next time change
 * detection is triggered.
 */
(function (ChangeDetectionStrategy) {
    /**
     * `CheckedOnce` means that after calling detectChanges the mode of the change detector
     * will become `Checked`.
     */
    ChangeDetectionStrategy[ChangeDetectionStrategy["CheckOnce"] = 0] = "CheckOnce";
    /**
     * `Checked` means that the change detector should be skipped until its mode changes to
     * `CheckOnce`.
     */
    ChangeDetectionStrategy[ChangeDetectionStrategy["Checked"] = 1] = "Checked";
    /**
     * `CheckAlways` means that after calling detectChanges the mode of the change detector
     * will remain `CheckAlways`.
     */
    ChangeDetectionStrategy[ChangeDetectionStrategy["CheckAlways"] = 2] = "CheckAlways";
    /**
     * `Detached` means that the change detector sub tree is not a part of the main tree and
     * should be skipped.
     */
    ChangeDetectionStrategy[ChangeDetectionStrategy["Detached"] = 3] = "Detached";
    /**
     * `OnPush` means that the change detector's mode will be set to `CheckOnce` during hydration.
     */
    ChangeDetectionStrategy[ChangeDetectionStrategy["OnPush"] = 4] = "OnPush";
    /**
     * `Default` means that the change detector's mode will be set to `CheckAlways` during hydration.
     */
    ChangeDetectionStrategy[ChangeDetectionStrategy["Default"] = 5] = "Default";
})(exports.ChangeDetectionStrategy || (exports.ChangeDetectionStrategy = {}));
var ChangeDetectionStrategy = exports.ChangeDetectionStrategy;
/**
 * List of possible {@link ChangeDetectionStrategy} values.
 */
exports.CHANGE_DETECTION_STRATEGY_VALUES = [
    ChangeDetectionStrategy.CheckOnce,
    ChangeDetectionStrategy.Checked,
    ChangeDetectionStrategy.CheckAlways,
    ChangeDetectionStrategy.Detached,
    ChangeDetectionStrategy.OnPush,
    ChangeDetectionStrategy.Default
];
/**
 * List of possible {@link ChangeDetectorState} values.
 */
exports.CHANGE_DETECTOR_STATE_VALUES = [
    ChangeDetectorState.NeverChecked,
    ChangeDetectorState.CheckedBefore,
    ChangeDetectorState.Errored
];
function isDefaultChangeDetectionStrategy(changeDetectionStrategy) {
    return lang_1.isBlank(changeDetectionStrategy) ||
        changeDetectionStrategy === ChangeDetectionStrategy.Default;
}
exports.isDefaultChangeDetectionStrategy = isDefaultChangeDetectionStrategy;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uc3RhbnRzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZGlmZmluZ19wbHVnaW5fd3JhcHBlci1vdXRwdXRfcGF0aC1qYWtYbk1tTC50bXAvYW5ndWxhcjIvc3JjL2NvcmUvY2hhbmdlX2RldGVjdGlvbi9jb25zdGFudHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLHFCQUFvRCwwQkFBMEIsQ0FBQyxDQUFBO0FBRS9FOztHQUVHO0FBQ0gsV0FBWSxtQkFBbUI7SUFDN0I7OztPQUdHO0lBQ0gsNkVBQVksQ0FBQTtJQUVaOzs7T0FHRztJQUNILCtFQUFhLENBQUE7SUFFYjs7OztPQUlHO0lBQ0gsbUVBQU8sQ0FBQTtBQUNULENBQUMsRUFuQlcsMkJBQW1CLEtBQW5CLDJCQUFtQixRQW1COUI7QUFuQkQsSUFBWSxtQkFBbUIsR0FBbkIsMkJBbUJYLENBQUE7QUFFRDs7O0dBR0c7QUFDSCxXQUFZLHVCQUF1QjtJQUNqQzs7O09BR0c7SUFDSCwrRUFBUyxDQUFBO0lBRVQ7OztPQUdHO0lBQ0gsMkVBQU8sQ0FBQTtJQUVQOzs7T0FHRztJQUNILG1GQUFXLENBQUE7SUFFWDs7O09BR0c7SUFDSCw2RUFBUSxDQUFBO0lBRVI7O09BRUc7SUFDSCx5RUFBTSxDQUFBO0lBRU47O09BRUc7SUFDSCwyRUFBTyxDQUFBO0FBQ1QsQ0FBQyxFQWxDVywrQkFBdUIsS0FBdkIsK0JBQXVCLFFBa0NsQztBQWxDRCxJQUFZLHVCQUF1QixHQUF2QiwrQkFrQ1gsQ0FBQTtBQUVEOztHQUVHO0FBQ1Esd0NBQWdDLEdBQUc7SUFDNUMsdUJBQXVCLENBQUMsU0FBUztJQUNqQyx1QkFBdUIsQ0FBQyxPQUFPO0lBQy9CLHVCQUF1QixDQUFDLFdBQVc7SUFDbkMsdUJBQXVCLENBQUMsUUFBUTtJQUNoQyx1QkFBdUIsQ0FBQyxNQUFNO0lBQzlCLHVCQUF1QixDQUFDLE9BQU87Q0FDaEMsQ0FBQztBQUVGOztHQUVHO0FBQ1Esb0NBQTRCLEdBQUc7SUFDeEMsbUJBQW1CLENBQUMsWUFBWTtJQUNoQyxtQkFBbUIsQ0FBQyxhQUFhO0lBQ2pDLG1CQUFtQixDQUFDLE9BQU87Q0FDNUIsQ0FBQztBQUVGLDBDQUNJLHVCQUFnRDtJQUNsRCxNQUFNLENBQUMsY0FBTyxDQUFDLHVCQUF1QixDQUFDO1FBQ2hDLHVCQUF1QixLQUFLLHVCQUF1QixDQUFDLE9BQU8sQ0FBQztBQUNyRSxDQUFDO0FBSmUsd0NBQWdDLG1DQUkvQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtTdHJpbmdXcmFwcGVyLCBub3JtYWxpemVCb29sLCBpc0JsYW5rfSBmcm9tICdhbmd1bGFyMi9zcmMvZmFjYWRlL2xhbmcnO1xuXG4vKipcbiAqIERlc2NyaWJlcyB0aGUgY3VycmVudCBzdGF0ZSBvZiB0aGUgY2hhbmdlIGRldGVjdG9yLlxuICovXG5leHBvcnQgZW51bSBDaGFuZ2VEZXRlY3RvclN0YXRlIHtcbiAgLyoqXG4gICAqIGBOZXZlckNoZWNrZWRgIG1lYW5zIHRoYXQgdGhlIGNoYW5nZSBkZXRlY3RvciBoYXMgbm90IGJlZW4gY2hlY2tlZCB5ZXQsIGFuZFxuICAgKiBpbml0aWFsaXphdGlvbiBtZXRob2RzIHNob3VsZCBiZSBjYWxsZWQgZHVyaW5nIGRldGVjdGlvbi5cbiAgICovXG4gIE5ldmVyQ2hlY2tlZCxcblxuICAvKipcbiAgICogYENoZWNrZWRCZWZvcmVgIG1lYW5zIHRoYXQgdGhlIGNoYW5nZSBkZXRlY3RvciBoYXMgc3VjY2Vzc2Z1bGx5IGNvbXBsZXRlZCBhdCBsZWFzdFxuICAgKiBvbmUgZGV0ZWN0aW9uIHByZXZpb3VzbHkuXG4gICAqL1xuICBDaGVja2VkQmVmb3JlLFxuXG4gIC8qKlxuICAgKiBgRXJyb3JlZGAgbWVhbnMgdGhhdCB0aGUgY2hhbmdlIGRldGVjdG9yIGVuY291bnRlcmVkIGFuIGVycm9yIGNoZWNraW5nIGEgYmluZGluZ1xuICAgKiBvciBjYWxsaW5nIGEgZGlyZWN0aXZlIGxpZmVjeWNsZSBtZXRob2QgYW5kIGlzIG5vdyBpbiBhbiBpbmNvbnNpc3RlbnQgc3RhdGUuIENoYW5nZVxuICAgKiBkZXRlY3RvcnMgaW4gdGhpcyBzdGF0ZSB3aWxsIG5vIGxvbmdlciBkZXRlY3QgY2hhbmdlcy5cbiAgICovXG4gIEVycm9yZWRcbn1cblxuLyoqXG4gKiBEZXNjcmliZXMgd2l0aGluIHRoZSBjaGFuZ2UgZGV0ZWN0b3Igd2hpY2ggc3RyYXRlZ3kgd2lsbCBiZSB1c2VkIHRoZSBuZXh0IHRpbWUgY2hhbmdlXG4gKiBkZXRlY3Rpb24gaXMgdHJpZ2dlcmVkLlxuICovXG5leHBvcnQgZW51bSBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSB7XG4gIC8qKlxuICAgKiBgQ2hlY2tlZE9uY2VgIG1lYW5zIHRoYXQgYWZ0ZXIgY2FsbGluZyBkZXRlY3RDaGFuZ2VzIHRoZSBtb2RlIG9mIHRoZSBjaGFuZ2UgZGV0ZWN0b3JcbiAgICogd2lsbCBiZWNvbWUgYENoZWNrZWRgLlxuICAgKi9cbiAgQ2hlY2tPbmNlLFxuXG4gIC8qKlxuICAgKiBgQ2hlY2tlZGAgbWVhbnMgdGhhdCB0aGUgY2hhbmdlIGRldGVjdG9yIHNob3VsZCBiZSBza2lwcGVkIHVudGlsIGl0cyBtb2RlIGNoYW5nZXMgdG9cbiAgICogYENoZWNrT25jZWAuXG4gICAqL1xuICBDaGVja2VkLFxuXG4gIC8qKlxuICAgKiBgQ2hlY2tBbHdheXNgIG1lYW5zIHRoYXQgYWZ0ZXIgY2FsbGluZyBkZXRlY3RDaGFuZ2VzIHRoZSBtb2RlIG9mIHRoZSBjaGFuZ2UgZGV0ZWN0b3JcbiAgICogd2lsbCByZW1haW4gYENoZWNrQWx3YXlzYC5cbiAgICovXG4gIENoZWNrQWx3YXlzLFxuXG4gIC8qKlxuICAgKiBgRGV0YWNoZWRgIG1lYW5zIHRoYXQgdGhlIGNoYW5nZSBkZXRlY3RvciBzdWIgdHJlZSBpcyBub3QgYSBwYXJ0IG9mIHRoZSBtYWluIHRyZWUgYW5kXG4gICAqIHNob3VsZCBiZSBza2lwcGVkLlxuICAgKi9cbiAgRGV0YWNoZWQsXG5cbiAgLyoqXG4gICAqIGBPblB1c2hgIG1lYW5zIHRoYXQgdGhlIGNoYW5nZSBkZXRlY3RvcidzIG1vZGUgd2lsbCBiZSBzZXQgdG8gYENoZWNrT25jZWAgZHVyaW5nIGh5ZHJhdGlvbi5cbiAgICovXG4gIE9uUHVzaCxcblxuICAvKipcbiAgICogYERlZmF1bHRgIG1lYW5zIHRoYXQgdGhlIGNoYW5nZSBkZXRlY3RvcidzIG1vZGUgd2lsbCBiZSBzZXQgdG8gYENoZWNrQWx3YXlzYCBkdXJpbmcgaHlkcmF0aW9uLlxuICAgKi9cbiAgRGVmYXVsdCxcbn1cblxuLyoqXG4gKiBMaXN0IG9mIHBvc3NpYmxlIHtAbGluayBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneX0gdmFsdWVzLlxuICovXG5leHBvcnQgdmFyIENIQU5HRV9ERVRFQ1RJT05fU1RSQVRFR1lfVkFMVUVTID0gW1xuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5DaGVja09uY2UsXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LkNoZWNrZWQsXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LkNoZWNrQWx3YXlzLFxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5EZXRhY2hlZCxcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5EZWZhdWx0XG5dO1xuXG4vKipcbiAqIExpc3Qgb2YgcG9zc2libGUge0BsaW5rIENoYW5nZURldGVjdG9yU3RhdGV9IHZhbHVlcy5cbiAqL1xuZXhwb3J0IHZhciBDSEFOR0VfREVURUNUT1JfU1RBVEVfVkFMVUVTID0gW1xuICBDaGFuZ2VEZXRlY3RvclN0YXRlLk5ldmVyQ2hlY2tlZCxcbiAgQ2hhbmdlRGV0ZWN0b3JTdGF0ZS5DaGVja2VkQmVmb3JlLFxuICBDaGFuZ2VEZXRlY3RvclN0YXRlLkVycm9yZWRcbl07XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0RlZmF1bHRDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneShcbiAgICBjaGFuZ2VEZXRlY3Rpb25TdHJhdGVneTogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kpOiBib29sZWFuIHtcbiAgcmV0dXJuIGlzQmxhbmsoY2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kpIHx8XG4gICAgICAgICBjaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSA9PT0gQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuRGVmYXVsdDtcbn1cbiJdfQ==