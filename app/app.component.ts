import {Component, OnInit, OnChanges} from "angular2/core";
import {BuildComponent} from "./build/build.component";
import {ResultComponent} from "./result/result.component";
import {RunComponent} from "./run/run.component";
import {Config} from "./shared/config";
import {$http} from './shared/httpwrap'
import {editorHook} from "./shared/editorHook";

@Component({
	selector: 'my-app',
	templateUrl: './app/app.component.html',
	directives: [BuildComponent, ResultComponent, RunComponent]
})

export class AppComponent implements OnInit, OnChanges {
	public mapping: any = { 
							types: [], 
							mapping: null,
							resultQuery:{'type':'',
								'result': [],
								'final': "{}"
							},
							output: {},
							queryId: 1
	};
	public detectChange: string = null;
	public config: Config = {
		url: "",
		appname: "",
		username: "",
		password: "" 
	};
	public editorHookHelp = new editorHook({editorId: 'editor'});

	// For default config
	// public config: Config = {
	// 	url: "https://uHg3p7p70:155898a9-e597-430e-8e2b-61fd1914c0d0@scalr.api.appbase.io",
	// 	appname: "moviedb",
	// 	username: "",
 	// 		password: "" 
	// };


	ngOnInit() {
		this.getLocalConfig();
  	}

  	ngOnChanges(changes) {
		console.log(changes);
  	}

  	changeMapResult() {
  		console.log('Hello there');
  		console.log(this);
  		this.mapResult = "Hello World1";
  	}

  	//Get config from localstorage 
	getLocalConfig() {
		var url = window.localStorage.getItem('url');
		var appname = window.localStorage.getItem('appname');
		if(url != null) {
			this.config.url = url;
			this.config.appname = appname;
			this.connect();
		}
	}

	//Set config from localstorage
	setLocalConfig(url, appname) {
		window.localStorage.setItem('url', url);
		window.localStorage.setItem('appname', appname);
	}

	// Connect with config url and appname
	// do mapping request  
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
			self.detectChange = "done";
	   	});
	}
	
	// Seprate the types from mapping	
	seprateType(mappingObj) {
		var mapObj = mappingObj[this.config.appname].mappings;
		var types = [];
		for(var type in mapObj){
			types.push(type);
		}
		return types;
	}

}