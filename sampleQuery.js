// 1) match_all query

{
	query: {
		match_all: {}
	}
}

// 2) match query
{
	query: {
		match: {
			"name": "mango"
		}
	}
}

// 2.1) Structure 
{
	query: {
		match: {
			"name": {
				"query": "mango"
			}
		}
	}
}

// 2.2) Match with Operator
{
	query: {
		match: {
			"name": {
				query: "green door",
				operator: "and"
			}
		}
	}
}

// 3) match_phrase
{
	query: {
		match_phrase: {
			"name": "green door"
		}
	}
}

// 3.1) match_phrase is type of match
{
	query: {
		match: {
			"name": {
				query: "mango",
				type: "phrase"
			}
		}
	}
}

// 4) match_phrase_prefix
{
	query: {
		match_phrase_prefix: {
			"name": "green door"
		}
	}
}

// 5) multi_match
// to apply match on multiple fields
{
	query: {
		multi_match: {
			"query": "door",
			"fields": ["name", "price"]
		}
	}
}

// 6) common
{
	query: {
		"common": {
			"name": "green door"
		}
	}
}

// 7) bool.filter
{
	query: {
		"bool": {
			"filter": {
				"term": {
					"name": "door"
				}
			}
		}
	}
}

// 7) bool
{
	query: {
		"bool": {
			"must": {
				"term": {
					"user": "kimchy"
				}
			},
			"filter": {
				"term": {
					"tag": "tech"
				}
			},
			"must_not": {
				"range": {
					"age": {
						"from": 10,
						"to": 20
					}
				}
			},
			"should": [{
				"term": {
					"tag": "wow"
				}
			}, {
				"term": {
					"tag": "elasticsearch"
				}
			}],
			"minimum_should_match": 1,
			"boost": 1.0
		}
	}
}

// 8) multiple-1
{
	"query": {
		"filtered": {
			"filter": {
				"bool": {
					"should": [{
						"term": {
							"productID": "KDKE-B-9947-#kL5"
						}
					}, {
						"bool": {
							"must": [{
								"term": {
									"productID": "JODL-X-1937-#pV7"
								}
							}, {
								"term": {
									"price": 30
								}
							}, {
								"bool": {
									"must": {
										"match": {}
									}
								}
							}]
						}
					}]
				}
			}
		}
	}
}

// 9) terms
{
	"constant_score": {
		"filter": {
			"terms": {
				"user": ["kimchy", "elasticsearch"]
			}
		}
	}
}

// 10) Product example
{
	"query": {
		"bool": {
			"must": [{
				"match": {
					"name": "door"
				}
			}],
			"must_not": [{
					"range": {
						"price": {
							"gt": 20
						}
					}
				}, {
					"match": {
						"name": "green"
					}
				}

			]
		}
	}
}

// 11) Deep

{
	"query": {
		"bool": {
			"must": [{
				"match": {
					"name": "testing"
				}
			}, {
				"bool": {
					"must": {
						"match": {
							"name": "testing"
						}
					}
				}
			}],
			"should": [{
				"range": {
					"price": {
						"lt": 50
					}
				}
			}]
		}
	}
}