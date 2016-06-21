export var queryList = {
	analyzed:{
		string: [
			'match',
			'match_phrase',
			'term',
			'terms',
			'exists',
			'multi_match',
			'query_string',
			'match-phase-prefix'
		],
		numeric: [
			'match',
			'range',
			'gt',
			'lt'
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
