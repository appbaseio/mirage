"use strict";
var testing_1 = require('@angular/core/testing');
var match_phase_prefix_query_1 = require('./match_phase_prefix.query');
testing_1.describe('Match_phase_prefix query format', function () {
    // Set initial things
    // set expected query format
    var query;
    var expectedFormat = {
        'match_phase_prefixQuery': {
            'foo': 'bar'
        }
    };
    // instantiate query component and set the input fields 
    testing_1.beforeEach(function () {
        query = new match_phase_prefix_query_1.Match_phase_prefixQuery();
        query.queryName = 'match_phase_prefixQuery';
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
});
//# sourceMappingURL=match_phase_prefix.query.spec.js.map