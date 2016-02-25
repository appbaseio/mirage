import {Injectable} from "angular2/core";
import { Http, Response, Headers, RequestOptions, RequestMethod, Request } from "angular2/http"

//Grab everything with import 'rxjs/Rx';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map'; 
import 'rxjs/add/operator/catch';


@Injectable()
export class MappingService{

	constructor(private http: Http) { }

    getMapping(config) {
        var headers = new Headers({ 'withCredentials': 'true' });
        headers.append('Authorization', "Basic " + btoa(config.username + ':' + config.username));
        
        var options = new RequestOptions( { headers: headers});
        
        return this.http.get(config.url +'/'+config.appname + '/_mapping', options)
                    .map((res: Response) => res.json())
                    .catch(this.handleError);

        // return Observable.fromPromise($.ajax({
        //     type: 'GET',
        //         beforeSend: function(request) {
        //             request.setRequestHeader("Authorization", "Basic " + btoa(config.username + ':' + config.password));
        //             },
        //         url: config.url+'/'+config.appname+'/_mapping',
        //         xhrFields: {
        //                 withCredentials: true
        //         })).map(this.mapper);                    
    }

    getMapping1(config){
        var configUrl = config.url + '/' + config.appname + '/_mapping';
        
    }
    _sendRequest(url: string, payLoad: any, type: string): Promise {
        return new Promise(function(resolve, reject) {
            var req = new XMLHttpRequest();
            req.open(type, url);
            req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
     
            req.onload = function () {
                 if (req.status == 200) {
                    resolve(JSON.parse(req.response));
                } else {
                    reject(JSON.parse(req.response));
                }
            };
     
            req.onerror = function() {
                reject(JSON.parse(req.response));
            };
     
            if (payLoad) {
                req.send(JSON.stringify(payLoad));
            } else {
                req.send(null);
            }
        });
    }

    handleError(error: any) {
        console.error(error);
        return Observable.throw(error.json().error || 'Server error');
    }
    private mapper(response:{json: Function}) {
        return response.json();
    }

    getHeroesSlowly() {
        var HEROES = {'name':123};
        return new Promise(resolve =>
          setTimeout(()=>resolve(HEROES), 2000) // 2 seconds
        );
      }
}
