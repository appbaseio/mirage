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
    ]
};
//# sourceMappingURL=queryList.js.map