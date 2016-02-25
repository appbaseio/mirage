import {Component} from "angular2/core";
import {HeaderComponent} from "./header/header.component";
import {BuildComponent} from "./build/build.component";
import {ResultComponent} from "./result/result.component";
import {RunComponent} from "./run/run.component";
import {Config} from "./shared/config";
import {$http} from './shared/httpwrap'

@Component({
	selector: 'my-app',
	templateUrl: './app/app.component.html',
	directives: [BuildComponent, ResultComponent, RunComponent]
})

export class AppComponent {
	public heros: string = 'asdjfkse';
	public mapping: any = { 
							types: [], 
							resultQuery:{'type':'',
								'result':[],
								'final':"{}"
							},
							output:{}
						};
	public config: Config = {
		url: "https://uHg3p7p70:155898a9-e597-430e-8e2b-61fd1914c0d0@scalr.api.appbase.io",
			appname: "moviedb",
			username: "",
	 		password: "" 
	};


	connect() {
		var APPNAME = this.config.appname;
		var URL = this.config.url;
		var urlsplit = URL.split(':');
		var pwsplit = urlsplit[2].split('@');
		this.config.username = urlsplit[1].replace('//', '');
		this.config.password = pwsplit[0];
		var self = this;
		var createUrl = this.config.url + '/' + this.config.appname + '/_mapping';
		var autho = "Basic " + btoa(self.config.username + ':' + self.config.password);
		console.log(autho);
		$http.get(createUrl, autho).then(function(res) {
			self.mapping.mapping = res;
			self.mapping.types = self.seprateType(res);
	   	});
	}
		
	seprateType(mappingObj){
		var mapObj = mappingObj[this.config.appname].mappings;
		var types = [];
		for(var type in mapObj){
			types.push(type);
		}
		return types;
	}

}

