import { Dependency, DependencyMeta } from '../interfaces';
export declare function parseDependency(raw: string): Dependency;
export declare function resolveDependency(raw: string, filename: string): string;
export declare function parseDependencyExpression(raw: string, options: {
    ambient?: boolean;
}): {
    name: string;
    location: string;
};
export declare function buildDependencyExpression(type: string, meta: DependencyMeta): string;
export declare function expandRegistry(raw: string, options: {
    ambient?: boolean;
}): string;
