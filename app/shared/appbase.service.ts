import { Injectable } from '@angular/core';
import { Headers, Http, Jsonp } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

@Injectable()

export class AppbaseService {
    constructor(private http: Http, private jsonp: Jsonp) {}
    public requestParam: any = {
        url: null,
        auth: null
    };
    public appbaseRef: any;

    setAppbase(config: any) {
        this.requestParam.url = config.url + '/' + config.appname;
        this.requestParam.auth = "Basic " + btoa(config.username + ':' + config.password);
    }
    get(path: string) {
        let headers = new Headers({
            'Content-Type': 'application/json;charset=UTF-8',
            'Authorization': this.requestParam.auth
        });
        return this.http.get(this.requestParam.url + path, { headers: headers }).toPromise()
    }
    post(path: string, data: any) {
        let requestData = JSON.stringify(data);
        let headers = new Headers({
            'Content-Type': 'application/json;charset=UTF-8',
            'Authorization': this.requestParam.auth
        });
        return this.http.post(this.requestParam.url + path, requestData, { headers: headers }).toPromise()
    }
    postUrl(url: string, data: any) {
        let requestData = JSON.stringify(data);
        let headers = new Headers({
            'Content-Type': 'application/json;charset=UTF-8',
            'Authorization': this.requestParam.auth
        });
        return this.http.post(url, requestData, { headers: headers }).toPromise()
    }
    put(path: string, data: any) {
        let headers = new Headers({
            'Content-Type': 'application/json;charset=UTF-8',
            'Authorization': this.requestParam.auth
        });
        return this.http.put(this.requestParam.url + path, data, { headers: headers }).toPromise()
    }
    delete(path: string) {
        let headers = new Headers({
            'Content-Type': 'application/json;charset=UTF-8',
            'Authorization': this.requestParam.auth
        });
        return this.http.delete(this.requestParam.url + path, { headers: headers }).toPromise()
    }
    public handleError(error: any) {
        console.error('An error occurred', error);
    }

}
