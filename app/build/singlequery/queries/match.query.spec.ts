import {describe, it, beforeEach, expect} from '@angular/core/testing';

import {MatchQuery} from './match.query';

describe('Match query format', () => {

    // Set initial things
    // set expected query format
    var query: MatchQuery;
    var expectedFormat = {
        'match': {
            'foo': 'bar'
        }
    };
    var expectedFormatWithOption = {
        'match': {
            'foo': {
                "query": "bar",
                "operator" : "and",
                "zero_terms_query": "all"
            }
        }
    };

    // instantiate query component and set the input fields 
    beforeEach(function() {
        query = new MatchQuery();
        query.queryName = 'match';
        query.fieldName = 'foo';
        query.inputs = {
            input: {
                value: 'bar'
            }
        };
    });

    function isValidJson(str: string) {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
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

})
