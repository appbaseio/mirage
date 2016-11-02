"use strict";
exports.queryList = {
    analyzed: {
        string: [
            'match',
            'match_phrase',
            'term',
            'terms',
            'exists',
            'missing',
            'multi_match',
            'query_string',
            'prefix',
            'wildcard',
            'regexp',
            'fuzzy',
            'simple_query_string',
            'match_phrase_prefix',
            'ids',
            'common'
        ],
        numeric: [
            'match',
            'range',
            'gt',
            'lt',
            'exists',
            'missing',
            'ids',
            'common'
        ],
        geo_point: [
            'geo_distance',
            'geo_distance_range',
            'geo_bounding_box',
            'geo_polygon',
            'geohash_cell'
        ],
        geo_shape: [
            'geo_shape'
        ]
    },
    not_analyzed: {
        string: [
            'term',
            'exists',
            'terms',
            'prefix'
        ],
        numeric: [
            'match',
            'range',
            'gt',
            'lt'
        ],
        geo_point: [
            'geo_distance',
            'geo_bounding_box',
            'geo_distance_range',
            'geo_polygon',
            'geohash_cell'
        ]
    },
    boolQuery: [
        'must',
        'must_not',
        'should',
        'filter',
        'nested'
    ],
    allowedDataTypes: [
        'string',
        'text',
        'keyword',
        'date',
        'numeric',
        'geo_point',
        'geo_shape'
    ]
};
//# sourceMappingURL=queryList.js.map