import { SecurityContext } from '../core_private';
import { ElementSchemaRegistry } from '../index';
export declare class MockSchemaRegistry implements ElementSchemaRegistry {
    existingProperties: {
        [key: string]: boolean;
    };
    attrPropMapping: {
        [key: string]: string;
    };
    constructor(existingProperties: {
        [key: string]: boolean;
    }, attrPropMapping: {
        [key: string]: string;
    });
    hasProperty(tagName: string, property: string): boolean;
    securityContext(tagName: string, property: string): SecurityContext;
    getMappedPropName(attrName: string): string;
}
