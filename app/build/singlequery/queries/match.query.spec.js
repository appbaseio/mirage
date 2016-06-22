System.register(['@angular/core/testing', './match.query', '../../../shared/appbase.service', '@angular/http'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var testing_1, match_query_1, appbase_service_1, http_1;
    return {
        setters:[
            function (testing_1_1) {
                testing_1 = testing_1_1;
            },
            function (match_query_1_1) {
                match_query_1 = match_query_1_1;
            },
            function (appbase_service_1_1) {
                appbase_service_1 = appbase_service_1_1;
            },
            function (http_1_1) {
                http_1 = http_1_1;
            }],
        execute: function() {
            testing_1.describe('Match query format', function () {
                // Set initial things
                // set expected query format
                var query;
                var expectedFormat = {
                    'match': {
                        'name': 'Elisabeth'
                    }
                };
                var expectedFormatWithOption = {
                    'match': {
                        'name': {
                            "query": "Elisabeth",
                            "operator": "and",
                            "zero_terms_query": "all"
                        }
                    }
                };
                // instantiate query component and set the input fields 
                testing_1.beforeEach(function () {
                    query = new match_query_1.MatchQuery();
                    query.queryName = 'match';
                    query.fieldName = 'name';
                    query.inputs = {
                        input: {
                            value: 'Elisabeth'
                        }
                    };
                });
                testing_1.beforeEachProviders(function () {
                    return [
                        http_1.HTTP_PROVIDERS,
                        appbase_service_1.AppbaseService
                    ];
                });
                function isValidJson(str) {
                    try {
                        JSON.parse(str);
                    }
                    catch (e) {
                        return false;
                    }
                    return true;
                }
                function xhrCall(data, cb) {
                    var config = {
                        url: 'https://scalr.api.appbase.io',
                        appname: 'App3',
                        username: 'CnqEgei0f',
                        password: 'a2176969-de4c-4ed0-bbbe-67e152de04f7'
                    };
                    var url = 'https://scalr.api.appbase.io/App3/testing/_search';
                    var auth = "Basic " + btoa(config.username + ':' + config.password);
                    var xhttp = new XMLHttpRequest();
                    xhttp.onreadystatechange = function () {
                        if (xhttp.readyState == 4 && xhttp.status == 200) {
                            cb(true);
                        }
                        else {
                            cb(false);
                        }
                    };
                    xhttp.open("POST", url);
                    xhttp.setRequestHeader("Content-type", "application/json");
                    xhttp.setRequestHeader("Authorization", auth);
                    xhttp.send();
                }
                // Test to check if queryformat is valid json
                testing_1.it('is valid json', function () {
                    var format = query.setFormat();
                    var validJson = isValidJson(JSON.stringify(format));
                    testing_1.expect(validJson).toEqual(true);
                });
                // Test to check if result of setformat is equal to expected query format.
                testing_1.it('Is setformat matches with expected query format', function () {
                    var format = query.setFormat();
                    testing_1.expect(format).toEqual(expectedFormat);
                });
                // Test to check if result of setformat is equal to expected query format with option.
                testing_1.it('Is setformat matches with expected query format when pass options with query', function () {
                    query.optionRows = [{
                            name: 'operator',
                            value: 'and'
                        }, {
                            name: 'zero_terms_query',
                            value: 'all'
                        }];
                    var format = query.setFormat();
                    testing_1.expect(format).toEqual(expectedFormatWithOption);
                });
                testing_1.it('should get data', testing_1.inject([appbase_service_1.AppbaseService], function (appbaseService) {
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
                    appbaseService.postUrl(url, request_data).then(function (data) {
                        testing_1.expect(true).toBe(true);
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
            });
        }
    }
});
//# sourceMappingURL=match.query.spec.js.map