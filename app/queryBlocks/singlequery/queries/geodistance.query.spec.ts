import {describe, it, beforeEach, expect} from '@angular/core/testing';
import {GeoDistanceQuery} from './geodistance.query';

describe('geo_distance query format', () => {
    // Set initial things
    // set expected query format
    var query: GeoDistanceQuery;
    var expectedFormat = {
        'geo_distance': {
            'distance': '100km',
            'location': {
                'lat': '10',
                'lon': '10'
            }
        }
    };
    var expectedFormatWithOption = {
        'geo_distance': {
            'distance': '100km',
            'location': {
                'lat': '10',
                'lon': '10'
            },
            "distance_type": "arc",
            "optimize_bbox": "none",
            "_name": "place",
            "ignore_malformed": "true"
        }
    };

    // instantiate query component and set the input fields 
    beforeEach(function() {
        query = new GeoDistanceQuery();
        query.queryName = 'geo_distance';
        query.fieldName = 'location';
        query.inputs = {
            lat: {
                value: '10'
            },
            lon: {
                value: '10'
            },
            distance: {
                value: '200km'
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
            name: 'distance_type',
            value: 'arc'
        }, {
            name: 'optimize_bbox',
            value: 'none'
        }, {
            name: '_name',
            value: 'place'
        }, {
            name: 'ignore_malformed',
            value: 'true'
        }];
        var format = query.setFormat();
        expect(format).toEqual(expectedFormatWithOption);
    });
});