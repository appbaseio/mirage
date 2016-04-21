import { isBlank } from 'angular2/src/facade/lang';
/**
 * Describes the current state of the change detector.
 */
export var ChangeDetectorState;
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
})(ChangeDetectorState || (ChangeDetectorState = {}));
/**
 * Describes within the change detector which strategy will be used the next time change
 * detection is triggered.
 */
export var ChangeDetectionStrategy;
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
})(ChangeDetectionStrategy || (ChangeDetectionStrategy = {}));
/**
 * List of possible {@link ChangeDetectionStrategy} values.
 */
export var CHANGE_DETECTION_STRATEGY_VALUES = [
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
export var CHANGE_DETECTOR_STATE_VALUES = [
    ChangeDetectorState.NeverChecked,
    ChangeDetectorState.CheckedBefore,
    ChangeDetectorState.Errored
];
export function isDefaultChangeDetectionStrategy(changeDetectionStrategy) {
    return isBlank(changeDetectionStrategy) ||
        changeDetectionStrategy === ChangeDetectionStrategy.Default;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uc3RhbnRzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZGlmZmluZ19wbHVnaW5fd3JhcHBlci1vdXRwdXRfcGF0aC1vWERPNHAydi50bXAvYW5ndWxhcjIvc3JjL2NvcmUvY2hhbmdlX2RldGVjdGlvbi9jb25zdGFudHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ik9BQU8sRUFBK0IsT0FBTyxFQUFDLE1BQU0sMEJBQTBCO0FBRTlFOztHQUVHO0FBQ0gsV0FBWSxtQkFtQlg7QUFuQkQsV0FBWSxtQkFBbUI7SUFDN0I7OztPQUdHO0lBQ0gsNkVBQVksQ0FBQTtJQUVaOzs7T0FHRztJQUNILCtFQUFhLENBQUE7SUFFYjs7OztPQUlHO0lBQ0gsbUVBQU8sQ0FBQTtBQUNULENBQUMsRUFuQlcsbUJBQW1CLEtBQW5CLG1CQUFtQixRQW1COUI7QUFFRDs7O0dBR0c7QUFDSCxXQUFZLHVCQWtDWDtBQWxDRCxXQUFZLHVCQUF1QjtJQUNqQzs7O09BR0c7SUFDSCwrRUFBUyxDQUFBO0lBRVQ7OztPQUdHO0lBQ0gsMkVBQU8sQ0FBQTtJQUVQOzs7T0FHRztJQUNILG1GQUFXLENBQUE7SUFFWDs7O09BR0c7SUFDSCw2RUFBUSxDQUFBO0lBRVI7O09BRUc7SUFDSCx5RUFBTSxDQUFBO0lBRU47O09BRUc7SUFDSCwyRUFBTyxDQUFBO0FBQ1QsQ0FBQyxFQWxDVyx1QkFBdUIsS0FBdkIsdUJBQXVCLFFBa0NsQztBQUVEOztHQUVHO0FBQ0gsT0FBTyxJQUFJLGdDQUFnQyxHQUFHO0lBQzVDLHVCQUF1QixDQUFDLFNBQVM7SUFDakMsdUJBQXVCLENBQUMsT0FBTztJQUMvQix1QkFBdUIsQ0FBQyxXQUFXO0lBQ25DLHVCQUF1QixDQUFDLFFBQVE7SUFDaEMsdUJBQXVCLENBQUMsTUFBTTtJQUM5Qix1QkFBdUIsQ0FBQyxPQUFPO0NBQ2hDLENBQUM7QUFFRjs7R0FFRztBQUNILE9BQU8sSUFBSSw0QkFBNEIsR0FBRztJQUN4QyxtQkFBbUIsQ0FBQyxZQUFZO0lBQ2hDLG1CQUFtQixDQUFDLGFBQWE7SUFDakMsbUJBQW1CLENBQUMsT0FBTztDQUM1QixDQUFDO0FBRUYsaURBQ0ksdUJBQWdEO0lBQ2xELE1BQU0sQ0FBQyxPQUFPLENBQUMsdUJBQXVCLENBQUM7UUFDaEMsdUJBQXVCLEtBQUssdUJBQXVCLENBQUMsT0FBTyxDQUFDO0FBQ3JFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1N0cmluZ1dyYXBwZXIsIG5vcm1hbGl6ZUJvb2wsIGlzQmxhbmt9IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvbGFuZyc7XG5cbi8qKlxuICogRGVzY3JpYmVzIHRoZSBjdXJyZW50IHN0YXRlIG9mIHRoZSBjaGFuZ2UgZGV0ZWN0b3IuXG4gKi9cbmV4cG9ydCBlbnVtIENoYW5nZURldGVjdG9yU3RhdGUge1xuICAvKipcbiAgICogYE5ldmVyQ2hlY2tlZGAgbWVhbnMgdGhhdCB0aGUgY2hhbmdlIGRldGVjdG9yIGhhcyBub3QgYmVlbiBjaGVja2VkIHlldCwgYW5kXG4gICAqIGluaXRpYWxpemF0aW9uIG1ldGhvZHMgc2hvdWxkIGJlIGNhbGxlZCBkdXJpbmcgZGV0ZWN0aW9uLlxuICAgKi9cbiAgTmV2ZXJDaGVja2VkLFxuXG4gIC8qKlxuICAgKiBgQ2hlY2tlZEJlZm9yZWAgbWVhbnMgdGhhdCB0aGUgY2hhbmdlIGRldGVjdG9yIGhhcyBzdWNjZXNzZnVsbHkgY29tcGxldGVkIGF0IGxlYXN0XG4gICAqIG9uZSBkZXRlY3Rpb24gcHJldmlvdXNseS5cbiAgICovXG4gIENoZWNrZWRCZWZvcmUsXG5cbiAgLyoqXG4gICAqIGBFcnJvcmVkYCBtZWFucyB0aGF0IHRoZSBjaGFuZ2UgZGV0ZWN0b3IgZW5jb3VudGVyZWQgYW4gZXJyb3IgY2hlY2tpbmcgYSBiaW5kaW5nXG4gICAqIG9yIGNhbGxpbmcgYSBkaXJlY3RpdmUgbGlmZWN5Y2xlIG1ldGhvZCBhbmQgaXMgbm93IGluIGFuIGluY29uc2lzdGVudCBzdGF0ZS4gQ2hhbmdlXG4gICAqIGRldGVjdG9ycyBpbiB0aGlzIHN0YXRlIHdpbGwgbm8gbG9uZ2VyIGRldGVjdCBjaGFuZ2VzLlxuICAgKi9cbiAgRXJyb3JlZFxufVxuXG4vKipcbiAqIERlc2NyaWJlcyB3aXRoaW4gdGhlIGNoYW5nZSBkZXRlY3RvciB3aGljaCBzdHJhdGVneSB3aWxsIGJlIHVzZWQgdGhlIG5leHQgdGltZSBjaGFuZ2VcbiAqIGRldGVjdGlvbiBpcyB0cmlnZ2VyZWQuXG4gKi9cbmV4cG9ydCBlbnVtIENoYW5nZURldGVjdGlvblN0cmF0ZWd5IHtcbiAgLyoqXG4gICAqIGBDaGVja2VkT25jZWAgbWVhbnMgdGhhdCBhZnRlciBjYWxsaW5nIGRldGVjdENoYW5nZXMgdGhlIG1vZGUgb2YgdGhlIGNoYW5nZSBkZXRlY3RvclxuICAgKiB3aWxsIGJlY29tZSBgQ2hlY2tlZGAuXG4gICAqL1xuICBDaGVja09uY2UsXG5cbiAgLyoqXG4gICAqIGBDaGVja2VkYCBtZWFucyB0aGF0IHRoZSBjaGFuZ2UgZGV0ZWN0b3Igc2hvdWxkIGJlIHNraXBwZWQgdW50aWwgaXRzIG1vZGUgY2hhbmdlcyB0b1xuICAgKiBgQ2hlY2tPbmNlYC5cbiAgICovXG4gIENoZWNrZWQsXG5cbiAgLyoqXG4gICAqIGBDaGVja0Fsd2F5c2AgbWVhbnMgdGhhdCBhZnRlciBjYWxsaW5nIGRldGVjdENoYW5nZXMgdGhlIG1vZGUgb2YgdGhlIGNoYW5nZSBkZXRlY3RvclxuICAgKiB3aWxsIHJlbWFpbiBgQ2hlY2tBbHdheXNgLlxuICAgKi9cbiAgQ2hlY2tBbHdheXMsXG5cbiAgLyoqXG4gICAqIGBEZXRhY2hlZGAgbWVhbnMgdGhhdCB0aGUgY2hhbmdlIGRldGVjdG9yIHN1YiB0cmVlIGlzIG5vdCBhIHBhcnQgb2YgdGhlIG1haW4gdHJlZSBhbmRcbiAgICogc2hvdWxkIGJlIHNraXBwZWQuXG4gICAqL1xuICBEZXRhY2hlZCxcblxuICAvKipcbiAgICogYE9uUHVzaGAgbWVhbnMgdGhhdCB0aGUgY2hhbmdlIGRldGVjdG9yJ3MgbW9kZSB3aWxsIGJlIHNldCB0byBgQ2hlY2tPbmNlYCBkdXJpbmcgaHlkcmF0aW9uLlxuICAgKi9cbiAgT25QdXNoLFxuXG4gIC8qKlxuICAgKiBgRGVmYXVsdGAgbWVhbnMgdGhhdCB0aGUgY2hhbmdlIGRldGVjdG9yJ3MgbW9kZSB3aWxsIGJlIHNldCB0byBgQ2hlY2tBbHdheXNgIGR1cmluZyBoeWRyYXRpb24uXG4gICAqL1xuICBEZWZhdWx0LFxufVxuXG4vKipcbiAqIExpc3Qgb2YgcG9zc2libGUge0BsaW5rIENoYW5nZURldGVjdGlvblN0cmF0ZWd5fSB2YWx1ZXMuXG4gKi9cbmV4cG9ydCB2YXIgQ0hBTkdFX0RFVEVDVElPTl9TVFJBVEVHWV9WQUxVRVMgPSBbXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LkNoZWNrT25jZSxcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuQ2hlY2tlZCxcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuQ2hlY2tBbHdheXMsXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LkRldGFjaGVkLFxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LkRlZmF1bHRcbl07XG5cbi8qKlxuICogTGlzdCBvZiBwb3NzaWJsZSB7QGxpbmsgQ2hhbmdlRGV0ZWN0b3JTdGF0ZX0gdmFsdWVzLlxuICovXG5leHBvcnQgdmFyIENIQU5HRV9ERVRFQ1RPUl9TVEFURV9WQUxVRVMgPSBbXG4gIENoYW5nZURldGVjdG9yU3RhdGUuTmV2ZXJDaGVja2VkLFxuICBDaGFuZ2VEZXRlY3RvclN0YXRlLkNoZWNrZWRCZWZvcmUsXG4gIENoYW5nZURldGVjdG9yU3RhdGUuRXJyb3JlZFxuXTtcblxuZXhwb3J0IGZ1bmN0aW9uIGlzRGVmYXVsdENoYW5nZURldGVjdGlvblN0cmF0ZWd5KFxuICAgIGNoYW5nZURldGVjdGlvblN0cmF0ZWd5OiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSk6IGJvb2xlYW4ge1xuICByZXR1cm4gaXNCbGFuayhjaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSkgfHxcbiAgICAgICAgIGNoYW5nZURldGVjdGlvblN0cmF0ZWd5ID09PSBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5EZWZhdWx0O1xufVxuIl19