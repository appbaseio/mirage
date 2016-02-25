import {Component} from "angular2/core";
import {Config} from "../shared/config";
import {MappingService} from "../shared/mapping.service";
import {$http} from "../shared/httpwrap";

@Component({
	selector: 'header-app',
	templateUrl: './app/header/header.component.html',
	styleUrls: ['./app/header/header.component.css'],
	inputs: ['connectConfig', 'mapping'],
	providers: [MappingService]
})


export class HeaderComponent {
	public config: Config = {
		url: "https://uHg3p7p70:155898a9-e597-430e-8e2b-61fd1914c0d0@scalr.api.appbase.io",
		appname: "moviedb",
		username: "",
		password: ""
	};
	public username: string;
	public connectConfig;
	public mapping;
	constructor(private mappingService: MappingService) { }
	
	connect() {
		var APPNAME = this.config.appname;
		var URL = this.config.url;
		var urlsplit = URL.split(':');
		var pwsplit = urlsplit[2].split('@');
		this.config.username = urlsplit[1].replace('//', '');
		this.config.password = pwsplit[0];
		//this.connectConfig(this.config);
		// var getConfig = this.mappingService.getMapping1(this.config);
		// getConfig.subscribe(function(data){
		// 	console.log(data);
		// });
		var self = this;
		var createUrl = this.config.url + '/' + this.config.appname + '/_mapping';
		var autho = "Basic " + btoa(self.config.username + ':' + self.config.password);
		console.log(autho);
		$http.get(createUrl, autho).then(function(json) {
			//self.mapping = json;
			self.connectConfig(self.config, json);	
	   	});
		// $.ajax({
		// 	type: 'GET',
		// 	beforeSend: function(request) {
		// 		request.setRequestHeader("Authorization", "Basic " + btoa(self.config.username + ':' + self.config.password));
		// 	},
		// 	url: createUrl,
		// 	xhrFields: {
		// 		withCredentials: true
		// 	}
		// }).done(function(data){
		// 	self.connectConfig(self.config, data);
		// });
	}
}