System.register(['@angular/core/testing', './exists.query'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var testing_1, exists_query_1;
    return {
        setters:[
            function (testing_1_1) {
                testing_1 = testing_1_1;
            },
            function (exists_query_1_1) {
                exists_query_1 = exists_query_1_1;
            }],
        execute: function() {
            testing_1.describe('exists query format', function () {
                // Set initial things
                // set expected query format
                var query;
                var expectedFormat = {
                    'exists': {
                        'field': 'name'
                    }
                };
                // instantiate query component and set the input fields 
                testing_1.beforeEach(function () {
                    query = new exists_query_1.ExistsQuery();
                    query.queryName = 'exists';
                    query.fieldName = 'name';
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
            });
            testing_1.describe("Exists query test with xhr call", function () {
                var returnedJSON = {};
                var status = 0;
                testing_1.beforeEach(function (done) {
                    var query = new exists_query_1.ExistsQuery();
                    query.queryName = 'exists';
                    query.fieldName = 'name';
                    var config = {
                        url: 'https://scalr.api.appbase.io',
                        appname: 'App3',
                        username: 'CnqEgei0f',
                        password: 'a2176969-de4c-4ed0-bbbe-67e152de04f7'
                    };
                    var url = 'https://scalr.api.appbase.io/App3/testing/_search';
                    var query_data = query.setFormat();
                    var request_data = {
                        "query": {
                            "bool": {
                                "must": [query_data]
                            }
                        }
                    };
                    $.ajax({
                        type: 'POST',
                        beforeSend: function (request) {
                            request.setRequestHeader("Authorization", "Basic " + btoa(config.username + ':' + config.password));
                        },
                        url: url,
                        contentType: 'application/json; charset=utf-8',
                        dataType: 'json',
                        data: JSON.stringify(request_data),
                        xhrFields: {
                            withCredentials: true
                        },
                        success: function (res) {
                            returnedJSON = res;
                            status = 200;
                            done();
                        },
                        error: function (xhr) {
                            returnedJSON = res;
                            status = xhr.status;
                            done();
                        }
                    });
                });
                testing_1.it("Should have returned JSON", function () {
                    testing_1.expect(returnedJSON).not.toEqual({});
                    testing_1.expect(returnedJSON).not.toBeUndefined();
                    testing_1.expect(status).toEqual(200);
                });
            });
        }
    }
});
//# sourceMappingURL=exists.query.spec.js.map