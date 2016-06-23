System.register(['@angular/core/testing', './simple_query_string.query', '../../../shared/appbase.service', '@angular/http'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var testing_1, simple_query_string_query_1, appbase_service_1, http_1;
    return {
        setters:[
            function (testing_1_1) {
                testing_1 = testing_1_1;
            },
            function (simple_query_string_query_1_1) {
                simple_query_string_query_1 = simple_query_string_query_1_1;
            },
            function (appbase_service_1_1) {
                appbase_service_1 = appbase_service_1_1;
            },
            function (http_1_1) {
                http_1 = http_1_1;
            }],
        execute: function() {
            testing_1.describe('Query string format', function () {
                // Set initial things
                // set expected query format
                var query;
                var expectedFormat = {
                    'simple_query_string': {
                        'query': 'test_foobar',
                        'fields': ['name']
                    }
                };
                var expectedFormatWithOption = {
                    'simple_query_string': {
                        'query': 'test_foobar',
                        'fields': ['name', 'gender', 'eyeColor']
                    }
                };
                // instantiate query component and set the input fields 
                testing_1.beforeEach(function () {
                    query = new simple_query_string_query_1.SimpleQueryStringQuery();
                    query.queryName = 'simple_query_string';
                    query.fieldName = 'name';
                    query.inputs = {
                        input: {
                            value: 'test_foobar'
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
                            name: 'fields',
                            value: 'gender,eyeColor'
                        }];
                    var format = query.setFormat();
                    testing_1.expect(format).toEqual(expectedFormatWithOption);
                });
            });
            testing_1.describe("xhr test (simple_query_string)", function () {
                var returnedJSON = {};
                var status = 0;
                testing_1.beforeEach(function (done) {
                    var query = new simple_query_string_query_1.SimpleQueryStringQuery();
                    query.queryName = 'simple_query_string';
                    query.fieldName = 'name';
                    query.inputs = {
                        input: {
                            value: 'test_foobar'
                        }
                    };
                    var config = {
                        url: 'https://scalr.api.appbase.io',
                        appname: 'mirage_test',
                        username: 'wvCmyBy3D',
                        password: '7a7078e0-0204-4ccf-9715-c720f24754f2'
                    };
                    var url = 'https://scalr.api.appbase.io/mirage_test/test/_search';
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
                testing_1.it("Should have returned JSON and Should have atleast 1 record", function () {
                    testing_1.expect(returnedJSON).not.toEqual({});
                    testing_1.expect(returnedJSON).not.toBeUndefined();
                    testing_1.expect(status).toEqual(200);
                    testing_1.expect(returnedJSON.hits.hits.length).toBeGreaterThan(0);
                });
            });
        }
    }
});
//# sourceMappingURL=simple_query_string.query.spec.js.map