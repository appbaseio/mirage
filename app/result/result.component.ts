import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { prettyJson } from "../shared/pipes/prettyJson";
import { AppbaseService } from "../shared/appbase.service";

@Component({
	selector: 'query-result',
	templateUrl: './app/result/result.component.html',
	inputs: ['mapping', 'types', 'selectedTypes', 'result', 'config', 'editorHookHelp', 'responseHookHelp', 'finalUrl', 'setProp', 'errorShow'],
	pipes: [prettyJson],
	providers: [AppbaseService]
})

export class ResultComponent implements OnInit {
	public config;
	public editorHookHelp;
	public responseHookHelp;
	@Input() finalUrl;
	@Input() mapping: any;
	@Input() types: any;
	@Input() selectedTypes: any;
	@Input() result: any;
	@Output() setProp = new EventEmitter < any > ();
	@Output() errorShow = new EventEmitter();

	constructor(public appbaseService: AppbaseService) {}

	// Set codemirror instead of normal textarea
	// Set initial height for textarea
	ngOnInit() {
		var self = this;
		this.editorHookHelp.applyEditor();
		var resultHeight = $(window).height() - 138 - 49 - 80;
		$('.queryRight .codemirror').css({ height: resultHeight });
		$('#resultModal').on('hidden.bs.modal', function() {
			self.responseHookHelp.setValue('{}');
		});
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
			this.appbaseService.postUrl(self.finalUrl, validate.payload).then(function(res) {
				self.result.isWatching = false;
				self.result.output = JSON.stringify(res.json(), null, 2);
				self.responseHookHelp.setValue(self.result.output);
			}).catch(function(data) {
				$('#resultModal').modal('hide');
				self.result.isWatching = false;
				self.result.output = JSON.stringify(data, null, 4);
				var obj = {
					title: 'Response Error',
					message: self.result.output
				};
				self.errorShow.emit(obj);
			});
		} else {
			var obj = {
				title: 'Json validation',
				message: validate.message
			}
			this.errorShow.emit(obj);
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

		this.result.resultQuery.result.forEach(function(result) {
			result.internal.forEach(function(query) {
				if (query.field === '' || query.query === '') {
					returnObj.flag = false;
				}
			});
		});

		if (returnObj.flag) {
			try {
				returnObj.payload = JSON.parse(getQuery);
			} catch (e) {
				returnObj.message = "Json is not valid.";
			}
		} else {
			returnObj.message = "Please complete your query first.";
		}
		return returnObj;
	}

	setPropIn() {
		var propInfo = {
			name: 'finalUrl',
			value: this.finalUrl
		};
		this.setProp.emit(propInfo);
	}
}
