"use strict";
var match_phase_prefix_query_1 = require('./match_phase_prefix.query');
describe('Match_phase_prefix query format', function () {
    // Set initial things
    // set expected query format
    var query;
    var expectedFormat = {
        'match_phase_prefixQuery': {
            'foo': 'bar'
        }
    };
    // instantiate query component and set the input fields 
    beforeEach(function () {
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
    it('is valid json', function () {
        var format = query.setFormat();
        var validJson = isValidJson(JSON.stringify(format));
        expect(validJson).toEqual(true);
    });
    // Test to check if result of setformat is equal to expected query format.
    it('Is setformat matches with expected query format', function () {
        var format = query.setFormat();
        expect(format).toEqual(expectedFormat);
    });
});
//# sourceMappingURL=match_phase_prefix.query.spec.js.map