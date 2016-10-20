import {GeoPolygonQuery} from './geopolygon.query';

describe('geo_polygon query format', () => {
    // Set initial things
    // set expected query format
    var query: GeoPolygonQuery;
    var expectedFormat = {
        'geo_polygon': {
            'location': {
                "points" : [{
                    "lat" : "10.73",
                    "lon" : "9"
                }, {
                    "lat" : "9.01",
                    "lon" : "11"
                }, {
                    "lat" : "8.01",
                    "lon" : "12"
                }]
            }
        }
    };
    var expectedFormatWithOption = {
        'geo_polygon': {
            'location': {
                "points" : [{
                    "lat" : "10.73",
                    "lon" : "9"
                }, {
                    "lat" : "9.01",
                    "lon" : "11"
                }, {
                    "lat" : "8.01",
                    "lon" : "12"
                }]
            },
            "_name": "place",
            "ignore_malformed": "true"
        }
    };

    // instantiate query component and set the input fields 
    beforeEach(function() {
        query = new GeoPolygonQuery();
        query.queryName = 'geo_polygon';
        query.fieldName = 'location';
        query.inputs = {
            point1_lat: {
                value: '10.73'
            },
            point1_lon: {
                value: '9'
            },
            point2_lat: {
                value: '9.01'
            },
            point2_lon: {
                value: '11'
            },
            point3_lat: {
                value: '8.01'
            },
            point3_lon: {
                value: '12'
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

declare var $;
describe("xhr test (geo_polygon)", function () {
    var returnedJSON: any = {};
    var status = 0;

    beforeEach(function (done) {
        var query = new GeoPolygonQuery();
        query.queryName = 'geo_polygon';
        query.fieldName = 'place';
        query.inputs = {
            point1_lat: {
                value: '10.73'
            },
            point1_lon: {
                value: '9'
            },
            point2_lat: {
                value: '9.01'
            },
            point2_lon: {
                value: '11'
            },
            point3_lat: {
                value: '8.01'
            },
            point3_lon: {
                value: '12'
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