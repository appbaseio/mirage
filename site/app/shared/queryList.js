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
        ]
    },
    boolQuery: [
        'must',
        'must_not',
        'should',
        'should_not'
    ],
    information: {
        "match": {
            "title": "match",
            "content": "match query content"
        },
        "match_phrase": {
            "title": "match_phrase",
            "content": "match query content"
        },
        "match-phase-prefix": {
            "title": "match-phase-prefix",
            "content": "match query content"
        },
        "range": {
            "title": "range",
            "content": "match query content"
        },
        "gt": {
            "title": "gt",
            "content": "match query content"
        },
        "lt": {
            "title": "lt",
            "content": "match query content"
        }
    }
};
//# sourceMappingURL=queryList.js.map