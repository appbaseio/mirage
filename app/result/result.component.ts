import {Component, OnInit, OnChanges} from "angular2/core";
import {prettyJson} from "../shared/pipes/prettyJson";
import {MappingService} from "../shared/mapping.service";
import {$http} from '../shared/httpwrap';
import {TypesComponent} from "./types/types.component";


@Component({
	selector: 'query-result',
	templateUrl: './app/result/result.component.html',
	styleUrls: ['./app/result/result.component.css'],
	inputs: ['mapping', 'config', 'detectChange', 'editorHookHelp'],
	pipes: [prettyJson],
	providers: [MappingService],
	directives: [TypesComponent]
})

export class ResultComponent implements OnInit, OnChanges {
	public mapping;
	public config;
	public editorHookHelp;

	constructor(private mappingService: MappingService) { }
	
	ngOnInit() {
		var self = this;
		this.editorHookHelp.applyEditor();
	//	this.editorHookHelp.setValue(self.mapping.resultQuery.final);
	}

	ngOnChanges(changes) {
		console.log('result change', changes);
	}


	runQuery() {
		var self = this;
		var createUrl = this.config.url + '/' + this.config.appname + '/'+ this.mapping.selectedTypes + '/_search';
		var autho = "Basic " + btoa(self.config.username + ':' + self.config.password);
		var getQuery = this.editorHookHelp.getValue();
		var payload = JSON.parse(getQuery);
		// console.log(this.mapping.resultQuery);
		$http.post(createUrl, payload, autho).then(function(res) {
			self.mapping.output = JSON.stringify(res);
		});
	}
}