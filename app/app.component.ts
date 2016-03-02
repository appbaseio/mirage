import {Component, OnInit} from "angular2/core";
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

export class AppComponent implements OnInit {
	public heros: string = 'asdjfkse';
	public mapping: any = { 
							types: [], 
							mapping: null,
							resultQuery:{'type':'',
								'result':[],
								'final':"{}"
							},
							output:{}
						};
	
	//For default config
	// public config: Config = {
	// 	url: "https://uHg3p7p70:155898a9-e597-430e-8e2b-61fd1914c0d0@scalr.api.appbase.io",
	// 	appname: "moviedb",
	// 	username: "",
 	// 		password: "" 
	// };

	public config: Config = {
		url: "",
		appname: "",
		username: "",
		password: "" 
	};

	ngOnInit() {
		this.getLocalConfig();
  	}

	getLocalConfig() {
		var url = window.localStorage.getItem('url');
		var appname = window.localStorage.getItem('appname');
		if(url != null) {
			this.config.url = url;
			this.config.appname = appname;
			this.connect();
		}
	}

	setLocalConfig(url, appname) {
		window.localStorage.setItem('url', url);
		window.localStorage.setItem('appname', appname);
	}

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
		$http.get(createUrl, autho).then(function(res) {
			self.mapping.mapping = res;
			self.mapping.types = self.seprateType(res);
			self.setLocalConfig(self.config.url, self.config.appname);
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

