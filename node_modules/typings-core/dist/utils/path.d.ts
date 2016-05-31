export declare const EOL: string;
export declare function isHttp(url: string): boolean;
export declare function isDefinition(path: string): boolean;
export declare function isModuleName(value: string): boolean;
export declare function normalizeSlashes(path: string): string;
export declare function resolveFrom(from: string, to: string): string;
export declare function relativeTo(from: string, to: string): string;
export declare function toDefinition(path: string): string;
export declare function pathFromDefinition(path: string): string;
export declare function normalizeToDefinition(path: string): string;
export interface TypingsLocationResult extends LocationResult {
    typings: string;
}
export declare function getTypingsLocation(options: {
    cwd: string;
}): TypingsLocationResult;
export interface LocationOptions {
    cwd: string;
    name: string;
    ambient: boolean;
}
export interface LocationResult {
    main: string;
    browser: string;
}
export interface DependencyLocationResult extends LocationResult {
    mainDir: string;
    browserDir: string;
}
export declare function getDependencyLocation(options: LocationOptions): DependencyLocationResult;
export declare function getInfoFromDependencyLocation(path: string, options: {
    cwd: string;
}): {
    path: string;
    browser: boolean;
    ambient: boolean;
    name: string;
};
export declare function detectEOL(contents: string): string;
export declare function normalizeEOL(contents: string, eol: string): string;
