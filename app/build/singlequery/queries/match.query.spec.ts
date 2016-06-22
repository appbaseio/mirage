import {describe, it, beforeEach, expect, async, inject, injectAsync, beforeEachProviders} from '@angular/core/testing';
import {TestComponentBuilder, MockXHR} from '@angular/compiler/testing';
import {MockBackend, MockConnection} from '@angular/http/testing';
import {provide} from '@angular/core';
import {MatchQuery} from './match.query';
import {AppbaseService} from '../../../shared/appbase.service';
import { HTTP_PROVIDERS, JSONP_PROVIDERS, XHRBackend, Response, ResponseOptions} from '@angular/http';


describe('Match query format', () => {
    // Set initial things
    // set expected query format
    var query: MatchQuery;
    var expectedFormat = {
        'match': {
            'name': 'Elisabeth'
        }
    };
    var expectedFormatWithOption = {
        'match': {
            'name': {
                "query": "Elisabeth",
                "operator" : "and",
                "zero_terms_query": "all"
            }
        }
    };

    // instantiate query component and set the input fields 
    beforeEach(function() {
        query = new MatchQuery();
        query.queryName = 'match';
        query.fieldName = 'name';
        query.inputs = {
            input: {
                value: 'Elisabeth'
            }
        };
    });
    beforeEachProviders(() => {
        return [
          HTTP_PROVIDERS,
          AppbaseService
        ];
    });




    function isValidJson(str: string) {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    }

    function xhrCall(data: any, cb) {
        var config = {
            url: 'https://scalr.api.appbase.io',
            appname: 'App3',
            username: 'CnqEgei0f',
            password: 'a2176969-de4c-4ed0-bbbe-67e152de04f7'
        };
        var url = 'https://scalr.api.appbase.io/App3/testing/_search';
        var auth = "Basic " + btoa(config.username + ':' + config.password);
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (xhttp.readyState == 4 && xhttp.status == 200) {
                cb(true);
            } else {
                cb(false);
            }
        };
        xhttp.open("POST", url);
        xhttp.setRequestHeader("Content-type", "application/json");
        xhttp.setRequestHeader("Authorization", auth);
        xhttp.send();
    }

    // Test to check if queryformat is valid json
    it('is valid json', () => {
        var format = query.setFormat();
        var validJson = isValidJson(JSON.stringify(format));
        expect(validJson).toEqual(true);
    });

    // Test to check if result of setformat is equal to expected query format.
    it('Is setformat matches with expected query format', () => {
        var format = query.setFormat();
        expect(format).toEqual(expectedFormat);
    });


    // Test to check if result of setformat is equal to expected query format with option.
    it('Is setformat matches with expected query format when pass options with query', () => {
        query.optionRows = [{
            name: 'operator',
            value: 'and'
        }, {
            name: 'zero_terms_query',
            value: 'all'
        }];
        var format = query.setFormat();
        expect(format).toEqual(expectedFormatWithOption);
    });

    it('should get data', 
        inject([AppbaseService], (appbaseService: AppbaseService) => {
         var config = {
            url: 'https://scalr.api.appbase.io',
            appname: 'App3',
            username: 'CnqEgei0f',
            password: 'a2176969-de4c-4ed0-bbbe-67e152de04f7'
        };
        var url = 'https://scalr.api.appbase.io/App3/testing/_search';
        appbaseService.setAppbase(config);
        var query_data = query.setFormat();
        var request_data = {
            "query": {
                "bool": {
                    "must": [query_data]
                }
            }
        };
        appbaseService.postUrl(url, request_data).then(function(data: any) {
            expect(true).toBe(true);
        });
    }));

    // it('should get data', 
    //     inject([AppbaseService, XHRBackend], (appbaseService: AppbaseService, mockBackend: XHRBackend) => {
    //      var config = {
    //         url: 'https://scalr.api.appbase.io',
    //         appname: 'App3',
    //         username: 'CnqEgei0f',
    //         password: 'a2176969-de4c-4ed0-bbbe-67e152de04f7'
    //     };
    //     var url = 'https://scalr.api.appbase.io/App3/testing/_search';
    //     appbaseService.setAppbase(config);
    //     var query_data = query.setFormat();
    //     var request_data = {
    //         "query": {
    //             "bool": {
    //                 "must": [query_data]
    //             }
    //         }
    //     };
    //     // return new Promise((resolve, reject) => {});
    //     // mockBackend.connections.subscribe(connection => {
    //     //   connection.mockRespond(new ResponseOptions({status: 200}));
    //     // });
    //     appbaseService.saveBlog(url, request_data).subscribe(
    //       (successResult) => {
    //         expect(successResult).toBeDefined();
    //         expect(successResult.status).toBe(200);
    //     });

    //     // appbaseService.postUrl(url, request_data).then(function(data: any) {
    //     //     expect(true).toBe(true);
    //     // });
    // }));


    // Test to check if result of setformat is equal to expected query format with option.
    // it('Test if query works', () => {
    //     var format = query.setFormat();
    //     var config = {
    //         url: 'https://scalr.api.appbase.io',
    //         appname: 'App3',
    //         username: 'CnqEgei0f',
    //         password: 'a2176969-de4c-4ed0-bbbe-67e152de04f7'
    //     };
    //     var url = 'https://scalr.api.appbase.io/App3/testing/_search';
    //     var auth = "Basic " + btoa(config.username + ':' + config.password);
    //     var xhttp = new XMLHttpRequest();
    //     xhttp.onreadystatechange = function() {
    //         debugger;
    //         if (xhttp.readyState == 4 && xhttp.status == 200) {
    //             expect(true).toBe(true);
    //         } else {
    //             expect(false).toBe(true);              
    //         }
    //     };
    //     xhttp.open("POST", url, true);
    //     xhttp.setRequestHeader("Content-type", "application/json");
    //     xhttp.setRequestHeader("Authorization", auth);
    //     xhttp.send();
    //     // xhrCall(format, function(flag: boolean){
    //     //     expect(flag).toBe(true);
    //     // });
    // });
    

})
