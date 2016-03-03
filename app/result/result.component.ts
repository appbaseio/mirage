import {Component} from "angular2/core";
import {prettyJson} from "../shared/pipes/prettyJson";
import {MappingService} from "../shared/mapping.service";
import {$http} from '../shared/httpwrap';
import {TypesComponent} from "./types/types.component";


@Component({
	selector: 'query-result',
	templateUrl: './app/result/result.component.html',
	styleUrls: ['./app/result/result.component.css'],
	inputs: ['mapping', 'config', 'detectChange'],
	pipes: [prettyJson],
	providers: [MappingService],
	directives: [TypesComponent]
})

export class ResultComponent {
	public mapping;
	public config;
	constructor(private mappingService: MappingService) { }
	

	runQuery() {
		var self = this;
		var createUrl = this.config.url + '/' + this.config.appname + '/'+ this.mapping.resultQuery.type + '/_search';
		var autho = "Basic " + btoa(self.config.username + ':' + self.config.password);
		var payload = JSON.parse(this.mapping.resultQuery.final);

		$http.post(createUrl, payload, autho).then(function(res) {
			self.mapping.output = JSON.stringify(res);
		});
	}
}