import { Inject, OpaqueToken, Optional } from '@angular/core';
import { BaseResponseOptions, Headers, Request, RequestMethod, Response, ResponseOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Observer }   from 'rxjs/Observer';
import 'rxjs/add/operator/delay';

import { STATUS, STATUS_CODE_INFO } from './http-status-codes';

/**
* Seed data for in-memory database
* Must implement InMemoryDbService.
*/
export const SEED_DATA = new OpaqueToken('seedData');

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
export class InMemoryBackendConfig implements InMemoryBackendConfigArgs {
  constructor(config: InMemoryBackendConfigArgs = {}) {
    Object.assign(this, {
      defaultResponseOptions: new BaseResponseOptions(),
      delay: 500,
      delete404: false
    }, config);
  }
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

export const isSuccess = (status: number): boolean => (status >= 200 && status < 300);

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

export class InMemoryBackendService {

  protected _config: InMemoryBackendConfigArgs = new InMemoryBackendConfig();
  protected _db: {};

  constructor(
    @Inject(SEED_DATA) private _seedData: InMemoryDbService,
    @Inject(InMemoryBackendConfig) @Optional() config: InMemoryBackendConfigArgs) {
    this._resetDb();

    let loc = this._getLocation('./');
    this._config.host = loc.host;
    this._config.rootPath = loc.pathname;
    Object.assign(this._config, config);
  }

  createConnection(req: Request) {
    let res = this._handleRequest(req);

    let response = new Observable((responseObserver: Observer<Response>) => {
      if (isSuccess(res.status)) {
        responseObserver.next(res);
        responseObserver.complete();
      } else {
        responseObserver.error(res);
      }
      return () => { }; // unsubscribe function
    });

    response = response.delay(this._config.delay || 500);
    return { response };
  }

  ////  protected /////

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
  protected _handleRequest(req: Request) {
    let {base, collectionName, id, resourceUrl} = this._parseUrl(req.url);

    let reqInfo: ReqInfo = {
      req: req,
      base: base,
      collection: this._db[collectionName],
      collectionName: collectionName,
      headers: new Headers({ 'Content-Type': 'application/json' }),
      id: this._parseId(id),
      resourceUrl: resourceUrl
    };

    let options: ResponseOptions;

    try {
      if ('commands' === reqInfo.base.toLowerCase()) {
        options = this._commands(reqInfo);

      } else if (reqInfo.collection) {
        switch (req.method) {
          case RequestMethod.Get:
            options = this._get(reqInfo);
            break;
          case RequestMethod.Post:
            options = this._post(reqInfo);
            break;
          case RequestMethod.Put:
            options = this._put(reqInfo);
            break;
          case RequestMethod.Delete:
            options = this._delete(reqInfo);
            break;
          default:
            options = this._createErrorResponse(STATUS.METHOD_NOT_ALLOWED, 'Method not allowed');
            break;
        }

      } else {
        options = this._createErrorResponse(STATUS.NOT_FOUND, `Collection '${collectionName}' not found`);
      }

    } catch (error) {
      let err = error.message || error;
      options = this._createErrorResponse(STATUS.INTERNAL_SERVER_ERROR, `${err}`);
    }

    options = this._setStatusText(options);
    if (this._config.defaultResponseOptions) {
      options = this._config.defaultResponseOptions.merge(options);
    }

    return new Response(options);
  }

  protected _clone(data: any) {
    return JSON.parse(JSON.stringify(data));
  }

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
  protected _commands(reqInfo: ReqInfo) {
    let command = reqInfo.collectionName.toLowerCase();
    let method = reqInfo.req.method;
    let options: ResponseOptions;

    switch (command) {
      case 'resetdb':
        this._resetDb();
        options = new ResponseOptions({ status: STATUS.OK });
        break;
      case 'config':
        if (method === RequestMethod.Get) {
          options = new ResponseOptions({
            body: this._clone(this._config),
            status: STATUS.OK
          });
        } else {
          // Be nice ... any other method is a config update
          let body = JSON.parse(<string>reqInfo.req.text() || '{}');
          Object.assign(this._config, body);
          options = new ResponseOptions({ status: STATUS.NO_CONTENT });
        }
        break;
      default:
        options = this._createErrorResponse(
          STATUS.INTERNAL_SERVER_ERROR, `Unknown command "${command}"`);
    }
    return options;
  }

  protected _createErrorResponse(status: number, message: string) {
    return new ResponseOptions({
      body: { 'error': `${message}` },
      headers: new Headers({ 'Content-Type': 'application/json' }),
      status: status
    });
  }

  protected _delete({id, collection, collectionName, headers /*, req */}: ReqInfo) {
    if (!id) {
      return this._createErrorResponse(STATUS.NOT_FOUND, `Missing "${collectionName}" id`);
    }
    let exists = this._removeById(collection, id);
    return new ResponseOptions({
      headers: headers,
      status: (exists || !this._config.delete404) ? STATUS.NO_CONTENT : STATUS.NOT_FOUND
    });
  }

  protected _findById(collection: any[], id: number) {
    return collection.find((item: any) => item.id === id);
  }

  protected _genId(collection: any): any {
    // assumes numeric ids
    let maxId = 0;
    collection.reduce((prev: any, item: any) => {
      maxId = Math.max(maxId, typeof item.id === 'number' ? item.id : maxId);
    }, null);
    return maxId + 1;
  }

  protected _get({id, collection, collectionName, headers}: ReqInfo) {
    let data = (id) ? this._findById(collection, id) : collection;
    if (!data) {
      return this._createErrorResponse(STATUS.NOT_FOUND,
        `'${collectionName}' with id='${id}' not found`);
    }
    return new ResponseOptions({
      body: { data: this._clone(data) },
      headers: headers,
      status: STATUS.OK
    });
  }

  protected _getLocation(href: string) {
    let l = document.createElement('a');
    l.href = href;
    return l;
  };

  protected _indexOf(collection: any[], id: number) {
    return collection.findIndex((item: any) => item.id === id);
  }

  // tries to parse id as integer; returns input id if not an integer.
  protected _parseId(id: string): any {
    if (!id) { return null; }
    let idNum = parseInt(id, 10);
    return isNaN(idNum) ? id : idNum;
  }

  protected _parseUrl(url: string) {
    try {
      let loc = this._getLocation(url);
      let drop = this._config.rootPath.length;
      let urlRoot = '';
      if (loc.host !== this._config.host) {
        // url for a server on a different host!
        // assume it's collection is actually here too.
        drop = 1; // the leading slash
        urlRoot = loc.protocol + '//' + loc.host + '/';
      }
      let path = loc.pathname.substring(drop);
      let [base, collectionName, id] = path.split('/');
      let resourceUrl = urlRoot + base + '/' + collectionName + '/';
      [collectionName] = collectionName.split('.'); // ignore anything after the '.', e.g., '.json'
      return { base, id, collectionName, resourceUrl };
    } catch (err) {
      let msg = `unable to parse url '${url}'; original error: ${err.message}`;
      throw new Error(msg);
    }
  }

  protected _post({collection, /* collectionName, */ headers, id, req, resourceUrl}: ReqInfo) {
    let item = JSON.parse(<string>req.text());
    if (!item.id) {
      item.id = id || this._genId(collection);
    }
    // ignore the request id, if any. Alternatively,
    // could reject request if id differs from item.id
    id = item.id;
    let existingIx = this._indexOf(collection, id);
    if (existingIx > -1) {
      collection[existingIx] = item;
      return new ResponseOptions({
        headers: headers,
        status: STATUS.NO_CONTENT
      });
    } else {
      collection.push(item);
      headers.set('Location', resourceUrl + '/' + id);
      return new ResponseOptions({
        headers: headers,
        body: { data: this._clone(item) },
        status: STATUS.CREATED
      });
    }
  }

  protected _put({id, collection, collectionName, headers, req}: ReqInfo) {
    let item = JSON.parse(<string>req.text());
    if (!id) {
      return this._createErrorResponse(STATUS.NOT_FOUND, `Missing '${collectionName}' id`);
    }
    if (id !== item.id) {
      return this._createErrorResponse(STATUS.BAD_REQUEST,
        `"${collectionName}" id does not match item.id`);
    }
    let existingIx = this._indexOf(collection, id);
    if (existingIx > -1) {
      collection[existingIx] = item;
      return new ResponseOptions({
        headers: headers,
        status: STATUS.NO_CONTENT // successful; no content
      });
    } else {
      collection.push(item);
      return new ResponseOptions({
        body: { data: this._clone(item) },
        headers: headers,
        status: STATUS.CREATED
      });
    }
  }

  protected _removeById(collection: any[], id: number) {
    let ix = this._indexOf(collection, id);
    if (ix > -1) {
      collection.splice(ix, 1);
      return true;
    }
    return false;
  }

  /**
   * Reset the "database" to its original state
   */
  protected _resetDb() {
    this._db = this._seedData.createDb();
  }

  protected _setStatusText(options: ResponseOptions) {
    try {
      let statusCode = STATUS_CODE_INFO[options.status];
      options['statusText'] = statusCode ? statusCode.text : 'Unknown Status';
      return options;
    } catch (err) {
      return new ResponseOptions({
        status: STATUS.INTERNAL_SERVER_ERROR,
        statusText: 'Invalid Server Operation'
      });
    }
  }
}
