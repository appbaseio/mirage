import {Component, OnInit} from "@angular/core";
import {prettyJson} from "../shared/pipes/prettyJson";
import {MappingService} from "../shared/mapping.service";
import {$http} from '../shared/httpwrap';

@Component({
	selector: 'query-result',
	templateUrl: './app/result/result.component.html',
	styleUrls: ['./app/result/result.component.css'],
	inputs: ['mapping', 'config', 'editorHookHelp', 'responseHookHelp'],
	pipes: [prettyJson],
	providers: [MappingService]
})

export class ResultComponent implements OnInit {
	public mapping;
	public config;
	public editorHookHelp;
	public responseHookHelp;

	constructor(private mappingService: MappingService) { }
	
	ngOnInit() {
		var self = this;
		this.editorHookHelp.applyEditor();
		var resultHeight = $(window).height() - 170;
    	$('.queryRight .codemirror').css({  height:resultHeight });
    }


	runQuery() {
		var self = this;
		var createUrl = this.config.url + '/' + this.config.appname + '/'+ this.mapping.selectedTypes + '/_search';
		var autho = "Basic " + btoa(self.config.username + ':' + self.config.password);
		var getQuery = this.editorHookHelp.getValue();
		var payload = null;
		try {
			payload = JSON.parse(getQuery);
		} catch(e) {
			alert('Json is not valid');
		}
		if(payload) {
			// self.mapping.isWatching = true;
			self.responseHookHelp.setValue('{"Loading": "please wait......"}');
			$('#resultModal').modal('show');
			$http.post(createUrl, payload, autho).then(function(res) {
				// self.mapping.isWatching = false;
				self.mapping.output = JSON.stringify(res, null, 2);
				self.responseHookHelp.setValue(self.mapping.output);
			});
		}
	}
}