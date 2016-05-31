import { Component, OnInit, OnChanges } from "@angular/core";
import { BuildComponent } from "./build/build.component";
import { ResultComponent } from "./result/result.component";
import { RunComponent } from "./run/run.component";
import { Config } from "./shared/config";
import { editorHook } from "./shared/editorHook";
import { AppbaseService } from "./shared/appbase.service";

@Component({
	selector: 'my-app',
	templateUrl: './app/app.component.html',
	directives: [BuildComponent, ResultComponent, RunComponent],
	providers: [AppbaseService]
})

export class AppComponent implements OnInit, OnChanges {

	constructor(public appbaseService: AppbaseService) {}

	public mapping: any = {
		types: [],
		mapping: null,
		resultQuery: {
			'type': '',
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
	public editorHookHelp = new editorHook({ editorId: 'editor' });
	public responseHookHelp = new editorHook({ editorId: 'responseBlock' });

	ngOnInit() {
		this.getLocalConfig();
	}

	ngOnChanges(changes) {
		console.log(changes);
	}

	//Get config from localstorage 
	getLocalConfig() {
		var url = window.localStorage.getItem('url');
		var appname = window.localStorage.getItem('appname');
		if (url != null) {
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
		this.appbaseService.setAppbase(this.config);
		this.appbaseService.get('/_mapping').then(function(res) {
			let data = res.json();
			self.mapping.mapping = data;
			self.mapping.types = self.seprateType(data);
			self.setLocalConfig(self.config.url, self.config.appname);
			self.detectChange = "done";
		}).catch(self.appbaseService.handleError);
	}

	// Seprate the types from mapping	
	seprateType(mappingObj) {
		var mapObj = mappingObj[this.config.appname].mappings;
		var types = [];
		for (var type in mapObj) {
			types.push(type);
		}
		return types;
	}

}
