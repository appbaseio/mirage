"use strict";
exports.queryList = {
    'analyzed': {
        'string': [
            {
                name: 'matches',
                apply: 'match'
            }, {
                name: 'match_phrase',
                apply: 'match_phrase'
            }, {
                name: 'match-phase-prefix',
                apply: 'match_phrase_prefix'
            }],
        'numeric': [
            {
                name: 'matches',
                apply: 'match'
            }, {
                name: 'range',
                apply: 'range'
            }, {
                name: 'greater than',
                apply: 'gt'
            }, {
                name: 'less than',
                apply: 'lt'
            }
        ]
    },
    'not_analyzed': {
        'string': [{
                name: 'equals',
                apply: 'term'
            }, {
                name: 'exists',
                apply: 'exists'
            }, {
                name: 'contains',
                apply: 'terms'
            }, {
                name: 'start with',
                apply: 'prefix'
            }],
        'numeric': [
            {
                name: 'matches',
                apply: 'match'
            }, {
                name: 'range',
                apply: 'range'
            }, {
                name: 'greater than',
                apply: 'gt'
            }, {
                name: 'less than',
                apply: 'lt'
            }
        ]
    },
    'boolQuery': [
        {
            name: 'must',
            apply: 'must'
        }, {
            name: 'must_not',
            apply: 'must_not'
        }, {
            name: 'should',
            apply: 'should'
        }, {
            name: 'filter',
            apply: 'filter'
        }
    ],
    'information': {
        "matches": {
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
        "greater than": {
            "title": "gt",
            "content": "match query content"
        },
        "less than": {
            "title": "lt",
            "content": "match query content"
        }
    }
};
//# sourceMappingURL=queryList.js.map