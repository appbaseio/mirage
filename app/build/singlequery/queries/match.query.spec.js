System.register(['@angular/core/testing', './match.query'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var testing_1, match_query_1;
    return {
        setters:[
            function (testing_1_1) {
                testing_1 = testing_1_1;
            },
            function (match_query_1_1) {
                match_query_1 = match_query_1_1;
            }],
        execute: function() {
            testing_1.describe('Match query format', function () {
                // Set initial things
                // set expected query format
                var query;
                var expectedFormat = {
                    'match': {
                        'foo': 'bar'
                    }
                };
                var expectedFormatWithOption = {
                    'match': {
                        'foo': {
                            "query": "bar",
                            "operator": "and",
                            "zero_terms_query": "all"
                        }
                    }
                };
                // instantiate query component and set the input fields 
                testing_1.beforeEach(function () {
                    query = new match_query_1.MatchQuery();
                    query.queryName = 'match';
                    query.fieldName = 'foo';
                    query.inputs = {
                        input: {
                            value: 'bar'
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
        }
    }
});
//# sourceMappingURL=match.query.spec.js.map