"use strict";
var testing_1 = require('@angular/core/testing');
var match_query_1 = require('./match.query');
testing_1.describe('Match query format', function () {
    // Set initial things
    // set expected query format
    var query;
    var expectedFormat = {
        'match': {
            'name': 'test_foobar'
        }
    };
    var expectedFormatWithOption = {
        'match': {
            'name': {
                "query": "test_foobar",
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
                value: 'test_foobar'
            }
        };
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
                name: 'operator',
                value: 'and'
            }, {
                name: 'zero_terms_query',
                value: 'all'
            }];
        var format = query.setFormat();
        testing_1.expect(format).toEqual(expectedFormatWithOption);
    });
});
testing_1.describe("xhr test (Match)", function () {
    var returnedJSON = {};
    var status = 0;
    testing_1.beforeEach(function (done) {
        var query = new match_query_1.MatchQuery();
        query.queryName = 'match';
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
                returnedJSON = xhr;
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
//# sourceMappingURL=match.query.spec.js.map