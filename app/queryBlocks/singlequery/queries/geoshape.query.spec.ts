import {GeoShapeQuery} from './geoshape.query';

describe('geo_shape query format', () => {
    // Set initial things
    // set expected query format
    var query: GeoShapeQuery;
    var expectedFormat = {
        'geo_shape': {
            'location': {
                "shape" : {
                    "type" : "Point",
                    "coordinates" : [25, 25]
                }
            }
        }
    };
    var expectedFormatWithOption = {
        'geo_shape': {
             'location': {
                "shape" : {
                    "type" : "Point",
                    "coordinates" : [25, 25]
                },
                "relation": "within"
            }
        }
    };

    // instantiate query component and set the input fields
    beforeEach(function() {
        query = new GeoShapeQuery();
        query.queryName = 'geo_shape';
        query.fieldName = 'location';
        query.inputs = {
            type: {
                value: 'Point'
            },
            coordinates: {
                value: [25, 25]
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
            name: 'relation',
            value: 'within'
        }];
        var format = query.setFormat();
        expect(format).toEqual(expectedFormatWithOption);
    });
});

declare var $;
describe("xhr test (geo_shape)", function () {
    var returnedJSON: any = {};
    var status = 0;

    beforeEach(function (done) {
        var query = new GeoShapeQuery();
        query.queryName = 'geo_shape';
        query.fieldName = 'location_shape';
        query.inputs = {
            type: {
                value: 'Point'
            },
            coordinates: {
                value: [25, 25]
            }
        };
        var config = {
            url: 'https://scalr.api.appbase.io',
            appname: 'mirage_test',
            username: 'wvCmyBy3D',
            password: '7a7078e0-0204-4ccf-9715-c720f24754f2'
        };
        var url = 'https://scalr.api.appbase.io/mirage_test/geo/_search';
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
            beforeSend: function(request) {
                request.setRequestHeader("Authorization", "Basic " + btoa(config.username + ':' + config.password));
            },
            url: url,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: JSON.stringify(request_data),
            xhrFields: {
                withCredentials: true
            },
            success: function(res) {
                returnedJSON = res;
                status = 200;
                done();
            },
            error: function(xhr) {
                returnedJSON = xhr;
                status = xhr.status;
                done();
            }
        });
    });

    it("Should have returned JSON and Should have atleast 1 record", function () {
        expect(returnedJSON).not.toEqual({});
        expect(returnedJSON).not.toBeUndefined();
        expect(status).toEqual(200);
        expect(returnedJSON.hits.hits.length).toBeGreaterThan(0);
    });

});
