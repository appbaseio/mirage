/**
 * A SecurityContext marks a location that has dangerous security implications, e.g. a DOM property
 * like `innerHTML` that could cause Cross Site Scripting (XSS) security bugs when improperly
 * handled.
 *
 * See DomSanitizationService for more details on security in Angular applications.
 */
export declare enum SecurityContext {
    NONE = 0,
    HTML = 1,
    STYLE = 2,
    SCRIPT = 3,
    URL = 4,
    RESOURCE_URL = 5,
}
/**
 * SanitizationService is used by the views to sanitize potentially dangerous values. This is a
 * private API, use code should only refer to DomSanitizationService.
 */
export declare abstract class SanitizationService {
    abstract sanitize(context: SecurityContext, value: string): string;
}
