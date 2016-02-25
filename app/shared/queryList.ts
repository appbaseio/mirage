export var queryList = {
	'analyzed':[{
			name: 'matches',
			apply: 'match'
		}, {
			name: 'match_phrase',
			apply: 'match_phrase'
		}, {
			name: 'match-phase-prefix',
			apply: 'match_phrase_prefix'
		}],
	'not_analyzed': [{
			name: 'equals',
			apply: 'term'
		}, {
			name: 'range',
			apply: 'range'
		}, {
			name: 'exists',
			apply: 'exists'
		}, {
			name: 'greater than',
			apply: 'gt'
		}, {
			name: 'less than',
			apply: 'lt'
		}, {
			name: 'contains',
			apply: 'terms'
		}, {
			name: 'start with',
			apply: 'prefix'
		}]	
};
