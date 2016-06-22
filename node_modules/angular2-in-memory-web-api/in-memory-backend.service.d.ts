import { OpaqueToken } from '@angular/core';
import { Headers, Request, Response, ResponseOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/delay';
/**
* Seed data for in-memory database
* Must implement InMemoryDbService.
*/
export declare const SEED_DATA: OpaqueToken;
/**
* Interface for a class that creates an in-memory database
* Safe for consuming service to morph arrays and objects.
*/
export interface InMemoryDbService {
    /**
    * Creates "database" object hash whose keys are collection names
    * and whose values are arrays of the collection objects.
    *
    * It must be safe to call again and should return new arrays with new objects.
    * This condition allows InMemoryBackendService to morph the arrays and objects
    * without touching the original source data.
    */
    createDb(): {};
}
/**
* Interface for InMemoryBackend configuration options
*/
export interface InMemoryBackendConfigArgs {
    /**
     * default response options
     */
    defaultResponseOptions?: ResponseOptions;
    /**
     * delay (in ms) to simulate latency
     */
    delay?: number;
    /**
     * false (default) if ok when object-to-delete not found; else 404
     */
    delete404?: boolean;
    /**
     * host for this service
     */
    host?: string;
    /**
     * root path before any API call
     */
    rootPath?: string;
}
/**
*  InMemoryBackendService configuration options
*  Usage:
*    provide(InMemoryBackendConfig, {useValue: {delay:600}}),
*/
export declare class InMemoryBackendConfig implements InMemoryBackendConfigArgs {
    constructor(config?: InMemoryBackendConfigArgs);
}
/**
* Interface for object w/ info about the current request url
* extracted from an Http Request
*/
export interface ReqInfo {
    req: Request;
    base: string;
    collection: any[];
    collectionName: string;
    headers: Headers;
    id: any;
    resourceUrl: string;
}
export declare const isSuccess: (status: number) => boolean;
/**
 * Simulate the behavior of a RESTy web api
 * backed by the simple in-memory data store provided by the injected InMemoryDataService service.
 * Conforms mostly to behavior described here:
 * http://www.restapitutorial.com/lessons/httpmethods.html
 *
 * ### Usage
 *
 * Create InMemoryDataService class the implements IInMemoryDataService.
 * Register both this service and the seed data as in:
 * ```
 * // other imports
 * import { HTTP_PROVIDERS, XHRBackend } from 'angular2/http';
 * import { InMemoryBackendConfig, InMemoryBackendService, SEED_DATA } from '../in-memory-backend/in-memory-backend.service';
 * import { InMemoryStoryService } from '../api/in-memory-story.service';
 *
 * @Component({
 *   selector: ...,
 *   templateUrl: ...,
 *   providers: [
 *     HTTP_PROVIDERS,
 *     provide(XHRBackend, { useClass: InMemoryBackendService }),
 *     provide(SEED_DATA, { useClass: InMemoryStoryService }),
 *     provide(InMemoryBackendConfig, { useValue: { delay: 600 } }),
 *   ]
 * })
 * export class AppComponent { ... }
 * ```
 */
export declare class InMemoryBackendService {
    private _seedData;
    protected _config: InMemoryBackendConfigArgs;
    protected _db: {};
    constructor(_seedData: InMemoryDbService, config: InMemoryBackendConfigArgs);
    createConnection(req: Request): {
        response: Observable<{}>;
    };
    /**
     * Process Request and return an Http Response object
     * in the manner of a RESTy web api.
     *
     * Expect URI pattern in the form :base/:collectionName/:id?
     * Examples:
     *   api/characters
     *   api/characters/42
     *   api/characters.json/42   // ignores the ".json"
     *   commands/resetDb  // resets the "database"
     */
    protected _handleRequest(req: Request): Response;
    protected _clone(data: any): any;
    /**
     * When the `base`="commands", the `collectionName` is the command
     * Example URLs:
     *   commands/resetdb   // Reset the "database" to its original state
     *   commands/config (GET) // Return this service's config object
     *   commands/config (!GET) // Update the config (e.g. delay)
     *
     * Usage:
     *   http.post('commands/resetdb', null);
     *   http.get('commands/config');
     *   http.post('commands/config', '{"delay":1000}');
     */
    protected _commands(reqInfo: ReqInfo): ResponseOptions;
    protected _createErrorResponse(status: number, message: string): ResponseOptions;
    protected _delete({id, collection, collectionName, headers}: ReqInfo): ResponseOptions;
    protected _findById(collection: any[], id: number): any;
    protected _genId(collection: any): any;
    protected _get({id, collection, collectionName, headers}: ReqInfo): ResponseOptions;
    protected _getLocation(href: string): HTMLAnchorElement;
    protected _indexOf(collection: any[], id: number): number;
    protected _parseId(id: string): any;
    protected _parseUrl(url: string): {
        base: string;
        id: string;
        collectionName: string;
        resourceUrl: string;
    };
    protected _post({collection, headers, id, req, resourceUrl}: ReqInfo): ResponseOptions;
    protected _put({id, collection, collectionName, headers, req}: ReqInfo): ResponseOptions;
    protected _removeById(collection: any[], id: number): boolean;
    /**
     * Reset the "database" to its original state
     */
    protected _resetDb(): void;
    protected _setStatusText(options: ResponseOptions): ResponseOptions;
}
