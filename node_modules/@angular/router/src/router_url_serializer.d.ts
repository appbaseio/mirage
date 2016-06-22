import { UrlTree } from './segments';
/**
 * Defines a way to serialize/deserialize a url tree.
 */
export declare abstract class RouterUrlSerializer {
    /**
     * Parse a url into a {@Link UrlTree}
     */
    abstract parse(url: string): UrlTree;
    /**
     * Converts a {@Link UrlTree} into a url
     */
    abstract serialize(tree: UrlTree): string;
}
/**
 * A default implementation of the serialization.
 */
export declare class DefaultRouterUrlSerializer extends RouterUrlSerializer {
    parse(url: string): UrlTree;
    serialize(tree: UrlTree): string;
}
