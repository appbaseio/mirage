import { Component, OnInit } from "@angular/core";
import { prettyJson } from "../shared/pipes/prettyJson";
import { AppbaseService } from "../shared/appbase.service";

@Component({
	selector: 'query-result',
	templateUrl: './app/result/result.component.html',
	inputs: ['mapping', 'config', 'editorHookHelp', 'responseHookHelp'],
	pipes: [prettyJson],
	providers: [AppbaseService]
})

export class ResultComponent implements OnInit {
	public mapping;
	public config;
	public editorHookHelp;
	public responseHookHelp;

	constructor(public appbaseService: AppbaseService) {}

	// Set codemirror instead of normal textarea
	// Set initial height for textarea
	ngOnInit() {
		var self = this;
		this.editorHookHelp.applyEditor();
		var resultHeight = $(window).height() - 170;
		$('.queryRight .codemirror').css({ height: resultHeight });
	}

	// Validate using checkValidaQuery method
	// if validation success then apply search query and set result in textarea using editorhook
	// else show message
	runQuery() {
		var self = this;
		this.appbaseService.setAppbase(this.config);
		var validate = this.checkValidQuery();

		if (validate.flag) {
			self.responseHookHelp.setValue('{"Loading": "please wait......"}');
			$('#resultModal').modal('show');
			this.appbaseService.post('/_search', validate.payload).then(function(res) {
				self.mapping.isWatching = false;
				self.mapping.output = JSON.stringify(res.json(), null, 2);
				self.responseHookHelp.setValue(self.mapping.output);
			});
		}
		else {
			alert(validate.message);
		}
	}

	// get the textarea value using editor hook
	// Checking if all the internal queries have field and query,
	// Query should not contain '*' that we are setting on default
	// If internal query is perfect then check for valid json
	checkValidQuery() {
		var getQuery = this.editorHookHelp.getValue();
		var returnObj = {
			flag: true,
			payload: null,
			message: null
		};

		this.mapping.resultQuery.result.forEach(function(result) {
			result.internal.forEach(function(query) {
				if(query.field === '' || query.query === '') {
					returnObj.flag = false;
				}
			});
		});

		if(returnObj.flag) {
			try {
				returnObj.payload = JSON.parse(getQuery);
			} catch (e) {
				returnObj.message = "Json is not valid.";
			}
		}
		else {
			returnObj.message = "Please complete your query first.";
		}
		return returnObj;
	}
}
