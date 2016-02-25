import {Component} from "angular2/core";
import {prettyJson} from "../shared/pipes/prettyJson";
import {MappingService} from "../shared/mapping.service";
import {$http} from '../shared/httpwrap'

@Component({
	selector: 'query-result',
	templateUrl: './app/result/result.component.html',
	styleUrls: ['./app/result/result.component.css'],
	inputs: ['mapping', 'config'],
	pipes: [prettyJson],
	providers: [MappingService]
})

export class ResultComponent {
	public mapping;
	public config;
	constructor(private mappingService: MappingService) { }
	changeType(){
		setTimeout(function(){
			this.mapping.resultQuery.result = [];
			var mapObj = this.mapping.mapping[this.config.appname].mappings[this.mapping.resultQuery.type].properties;
			var availableFields = [];
			for (var field in mapObj){
				var obj = {
					name: field,
					type: mapObj[field]['type'],
					index: mapObj[field]['index']
				}
				switch (obj.type) {
					case 'long':
			        case 'integer':
		          	case 'short':
	           		case 'byte':
            		case 'double':
            		case 'float':
                		obj.type = 'numeric';
                	break;
		        }
				availableFields.push(obj);
			}
			this.mapping.resultQuery.availableFields = availableFields;
		}.bind(this),300);
	}

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