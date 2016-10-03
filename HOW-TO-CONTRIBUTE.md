# Contributing a New Query

### Steps
1. Create a component file and a spec file, and add them in the queries directory: https://github.com/appbaseio/mirage/tree/dev/app/build/singlequery/queries
2. Import created component in singlequeryComponent and update markup to use new queyr
3. Add the query in queryList.

Let's take the example of `Match` query here.

### Create Component file - {queryName}.component.ts

Import angular core components and also a mirage custom component `Editable`.

Editable component which converts input or dropdown into editable ui

```js
import { Component, OnInit, OnChanges, Input, Output, EventEmitter, ViewChild, SimpleChange } from "@angular/core";
import { EditableComponent } from '../../editable/editable.component';
```
Markup contains 2 parts:  
1) Primary input box: which is 3rd input box in query box, in which user will write value,
    addOption button is optional if query contains optional paramater then add it.
2) Optional parameter: It is collection of option rows, each row will contain option property name and value  

```js
@Component({
	selector: 'match-query',
	template: `<span class="col-xs-6 pd-10">
					<div class="form-group form-element query-primary-input">
						<span class="input_with_option">
							<input type="text" class="form-control col-xs-12"
								[(ngModel)]="inputs.input.value"
							 	placeholder="{{inputs.input.placeholder}}"
							 	(keyup)="getFormat();" />
						</span>
					</div>
					<button (click)="addOption();" class="btn btn-info btn-xs add-option"> <i class="fa fa-plus"></i> </button>
				</span>
				<div class="col-xs-12 option-container" *ngIf="optionRows.length">
					<div class="col-xs-12 single-option" *ngFor="let singleOption of optionRows, let i=index">
						<div class="col-xs-6 pd-l0">
							<editable
								class = "additional-option-select-{{i}}"
								[editableField]="singleOption.name"
								[editPlaceholder]="'--choose option--'"
								[editableInput]="'select2'"
								[selectOption]="options"
								[passWithCallback]="i"
								[selector]="'additional-option-select'"
								[querySelector]="querySelector"
								[informationList]="informationList"
								[showInfoFlag]="true"
								[searchOff]="true"
								(callback)="selectOption($event)">
							</editable>
						</div>
						<div class="col-xs-6 pd-0">
							<div class="form-group form-element">
								<input class="form-control col-xs-12 pd-0" type="text" [(ngModel)]="singleOption.value" placeholder="value"  (keyup)="getFormat();"/>
							</div>
						</div>
						<button (click)="removeOption(i)" class="btn btn-grey delete-option btn-xs">
							<i class="fa fa-times"></i>
						</button>
					</div>
				</div>
				`,
	inputs: ['appliedQuery', 'queryList', 'selectedQuery', 'selectedField', 'getQueryFormat', 'querySelector'],
	directives: [EditableComponent]
})
```

Create component and declare variables

```js
export class MatchQuery implements OnInit, OnChanges {
	@Input() queryList: any;
	@Input() selectedField: string;
	@Input() appliedQuery: any;
	@Input() selectedQuery: string;
  ....	
```

Event which is listen by parent component. we will pass created query format in this event.

```js
@Output() getQueryFormat = new EventEmitter < any > ();
```

set current query name and information which will be displayed in popover

```js
public current_query: string = 'match';
	public queryName = '*';
	public fieldName = '*';
	public information: any = {
		title: 'Match',
		content: `<span class="description">Returns matches by doing a full-text search, is used as the <i>go to</i> query.</span><a class="link" href="https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-match-query.html#query-dsl-match-query">Read more</a>`
	};
```

// List of  optional parameter  and Information about optional parameters which will be shown in popover

```js
public default_options: any = [
		'operator',
		'zero_terms_query',
		'cutoff_frequency',
		'type',
		'analyzer',
		'max_expansions'
	];
	
public informationList: any = {
		'operator': {
			title: 'operator',
			content: `<span class="description">The operator flag can be set to 'OR' or 'AND' to control the boolean clauses.</span>`
		},
		'zero_terms_query': {
			title: 'zero_terms_query',
			content: `<span class="description">Accepts none (default) and all which corresponds to a match_all query.</span>`
		},
		'cutoff_frequency': {
			title: 'cutoff_frequency',
			content: `<span class="description">cutoff_frequency allows specifying frequency threshold where high frequency terms are moved into an optional subquery.</span>`
		},
		'type': {
			title: 'type',
			content: `<span class="description">There are three types of match query: boolean (default), phrase, and phrase_prefix</span>`
		},
		'analyzer': {
			title: 'analyzer',
			content: `<span class="description">The analyzer used to analyze each term of the query when creating composite queries.</span>`
		},
		'max_expansions': {
			title: 'max_expansions',
			content: `<span class="description">The maximum number of terms that the query will expand to. Defaults to 50.</span>`
		}
	};
	public options: any;
	public singleOption = {
		name: '',
		value: ''
	};
	public optionRows: any = [];
```

specify inputs placeholder and default value
```js
public inputs: any = {
		input: {
			placeholder: 'Input',
			value: ''
		}
	};
public queryFormat: any = {};
```

Initial hook: 

Logic of creating query format when loading saved query or load query from url
appliedQuery contains the queries which we will get from parent component

check if `match` query exists for selected field set the inputs to show existing values in markup set the optional parameter in `optionRows` if exists in query 
```js
ngOnInit() {
		this.options = JSON.parse(JSON.stringify(this.default_options));
		try {
			if (this.appliedQuery[this.current_query][this.selectedField]) {
				if (this.appliedQuery[this.current_query][this.fieldName].hasOwnProperty('query')) {
					this.inputs.input.value = this.appliedQuery[this.current_query][this.fieldName].query;
					for (let option in this.appliedQuery[this.current_query][this.fieldName]) {
						if (option != 'query') {
							var obj = {
								name: option,
								value: this.appliedQuery[this.current_query][this.fieldName][option]
							};
							this.optionRows.push(obj);
						}
					}
				} else {
					this.inputs.input.value = this.appliedQuery[this.current_query][this.fieldName];
				}
			}
		} catch (e) {}
		this.filterOptions();
		this.getFormat();
	}
```

onchange hook:

Over here we will receive changes from parent and if the selected field or selected query is changes then update the query by calliung `getFormat`.

```js
ngOnChanges() {
		if (this.selectedField != '') {
			if (this.selectedField !== this.fieldName) {
				this.fieldName = this.selectedField;
				this.getFormat();
			}
		}
		if (this.selectedQuery != '') {
			if (this.selectedQuery !== this.queryName) {
				this.queryName = this.selectedQuery;
				this.optionRows = [];
				this.getFormat();
			}
		}
	}
```

getFormat method is responsible to get query format and execute the event which will be listen in parent component

```js
getFormat() {
		if (this.queryName === this.current_query) {
			this.queryFormat = this.setFormat();
			this.getQueryFormat.emit(this.queryFormat);
		}
	}
```

Build the query format in this method 
```js
setFormat() {
	var queryFormat = {};
	queryFormat[this.queryName] = {};
	if (this.optionRows.length) {
		queryFormat[this.queryName][this.fieldName] = {
			query: this.inputs.input.value
		};
		this.optionRows.forEach(function(singleRow: any) {
			queryFormat[this.queryName][this.fieldName][singleRow.name] = singleRow.value;
		}.bind(this))
	} else {
		queryFormat[this.queryName][this.fieldName] = this.inputs.input.value;
	}
	return queryFormat;
}
```

Now below methods are related to options parameter, so use it as it is in new query if query contains optional parametes.

while selecting option
```js
selectOption(input: any) {
	input.selector.parents('.editable-pack').removeClass('on');
	this.optionRows[input.external].name = input.val;
	this.filterOptions();
	setTimeout(function() {
		this.getFormat();
	}.bind(this), 300);
}
```
Update the option list because duplicate option is not allowed
```js
filterOptions() {
		this.options = this.default_options.filter(function(opt) {
			var flag = true;
			this.optionRows.forEach(function(row) {
				if(row.name === opt) {
					flag = false;
				}
			});
			return flag;
		}.bind(this));
	}
```

while user click on add option button it will add new option row and update the available options
```js
addOption() {
		var singleOption = JSON.parse(JSON.stringify(this.singleOption));
		this.filterOptions();
		this.optionRows.push(singleOption);
	}
```

while user click on remove option button it will remove the row and update the available options

```js
removeOption(index: Number) {
		this.optionRows.splice(index, 1);
		this.filterOptions();
		this.getFormat();
	}
```


### Create spec file - {queryName}.query.spec.ts
Import testing components and created query component

```js
import {describe, it, beforeEach, expect} from '@angular/core/testing';
import {MatchQuery} from './match.query';
```

test for query format
```js
describe('Match query format', () => {
    // Set initial things
    // set expected query format
    var query: MatchQuery;
    var expectedFormat = {
        'match': {
            'name': 'test_foobar'
        }
    };
    var expectedFormatWithOption = {
        'match': {
            'name': {
                "query": "test_foobar",
                "operator" : "and",
                "zero_terms_query": "all"
            }
        }
    };

    // instantiate query component and set the input fields 
    beforeEach(function() {
        query = new MatchQuery();
        query.queryName = 'match';
        query.fieldName = 'name';
        query.inputs = {
            input: {
                value: 'test_foobar'
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
            name: 'operator',
            value: 'and'
        }, {
            name: 'zero_terms_query',
            value: 'all'
        }];
        var format = query.setFormat();
        expect(format).toEqual(expectedFormatWithOption);
    });
})
```

Create xhr call test

apply app config  and your query should return atleast 1 result

```js
declare var $;
describe("xhr test (Match)", function () {
    var returnedJSON: any = {};
    var status = 0;

    beforeEach(function (done) {
        var query = new MatchQuery();
        query.queryName = 'match';
        query.fieldName = 'name';
        query.inputs = {
            input: {
                value: 'test_foobar'
            }
        };
        var config = {
            url: 'https://scalr.api.appbase.io',
            appname: 'mirage_test',
            username: 'wvCmyBy3D',
            password: '7a7078e0-0204-4ccf-9715-c720f24754f2'
        };
        var url = 'https://scalr.api.appbase.io/mirage_test/test/_search';
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
```


### Integrate with singlequery.component.ts (https://github.com/appbaseio/mirage/blob/dev/app/build/singlequery/singlequery.component.ts)
Import query and add in directives array
```js
import { MatchQuery } from './queries/match.query';
directives: [
		MatchQuery ...
		]
```
Read match query information to pass in popover
```js
@ViewChild(MatchQuery) private matchQuery: MatchQuery;
ngAfterViewInit() {
 'match': this.matchQuery.information,
 ....
}
```

### Append in markup of singlequery.component.html (https://github.com/appbaseio/mirage/blob/dev/app/build/singlequery/singlequery.component.html)
```html
<!-- match query start -->
	<div [hidden]="query.selectedQuery != 'match'" class="row">
		<match-query 
			[appliedQuery]="query.appliedQuery"
			[queryList]="queryList"
			[selectedQuery]="query.selectedQuery"
			[selectedField]="query.selectedField"
			[querySelector]="querySelector"  
			(getQueryFormat)="getQueryFormat($event);"
			>
		</match-query>
	</div>
	<!-- match query end -->
```

### Add the query in queryList (https://github.com/appbaseio/mirage/blob/dev/app/shared/queryList.ts)
```js
analyzed:{
		string: [
			'match',
			...
			]
			....
		}
```
