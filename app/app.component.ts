import { Component, OnInit, OnChanges, SimpleChange } from "@angular/core";
import { NgForm } from "@angular/common";
import { BuildComponent } from "./build/build.component";
import { ResultComponent } from "./result/result.component";
import { RunComponent } from "./run/run.component";
import { SaveQueryComponent } from './features/save/save.query.component';
import { ListQueryComponent } from './features/list/list.query.component';
import { Config } from "./shared/config";
import { editorHook } from "./shared/editorHook";
import { AppbaseService } from "./shared/appbase.service";

@Component({
	selector: 'my-app',
	templateUrl: './app/app.component.html',
	directives: [BuildComponent, ResultComponent, RunComponent, SaveQueryComponent, ListQueryComponent],
	providers: [AppbaseService]
})

export class AppComponent implements OnInit, OnChanges {

	constructor(public appbaseService: AppbaseService) {}

	public connected: boolean = false;
	public initial_connect: boolean = false;
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
	public savedQueryList = [];
	public query_info = {
		name: '',
		tag: ''
	};

	ngOnInit() {
		this.getLocalConfig();
		try {
			let list = window.localStorage.getItem('queryList');
			if(list) {
				this.savedQueryList = JSON.parse(list);
				console.log(this.savedQueryList);
			}
		} catch(e) {}
	}

	ngOnChanges(changes) {
		var prev = changes['selectedQuery'].previousValue;
		var current = changes['selectedQuery'].currentValue;
		console.log('changes', changes);
		// var q1 = {"mapping":{"types":["trash","Sample","analyzed_tweets","tweets",".percolator","product","_default_","~logs"],"mapping":{"App3":{"mappings":{"trash":{"dynamic_templates":[{"for_string":{"mapping":{"fielddata":{"format":"disabled"}},"match":"*","match_mapping_type":"string"}}],"properties":{"contact":{"type":"string","fielddata":{"format":"disabled"}},"contact2":{"type":"string","fielddata":{"format":"disabled"}},"contact3":{"type":"string","fielddata":{"format":"disabled"}},"name":{"type":"string","fielddata":{"format":"disabled"}}}},"Sample":{"dynamic_templates":[{"for_string":{"mapping":{"fielddata":{"format":"disabled"}},"match":"*","match_mapping_type":"string"}}],"properties":{"element":{"type":"string","fielddata":{"format":"disabled"}},"height":{"type":"string","fielddata":{"format":"disabled"}},"width":{"type":"string","fielddata":{"format":"disabled"}}}},"analyzed_tweets":{"dynamic_templates":[{"for_string":{"mapping":{"fielddata":{"format":"disabled"}},"match":"*","match_mapping_type":"string"}}],"properties":{"age":{"type":"long"},"analyzed_name":{"type":"string","analyzer":"nGram_analyzer","search_analyzer":"whitespace_analyzer"},"analyzed_tweet":{"type":"string","analyzer":"nGram_analyzer","search_analyzer":"whitespace_analyzer"},"name":{"type":"string","fielddata":{"format":"disabled"}},"tweet":{"type":"string","fielddata":{"format":"disabled"}}}},"tweets":{"dynamic_templates":[{"for_string":{"mapping":{"fielddata":{"format":"disabled"}},"match":"*","match_mapping_type":"string"}}],"properties":{"age":{"type":"long"},"name":{"type":"string","fielddata":{"format":"disabled"}},"tweet":{"type":"string","fielddata":{"format":"disabled"}}}},".percolator":{"_ttl":{"enabled":true},"dynamic_templates":[{"for_string":{"mapping":{"fielddata":{"format":"disabled"}},"match":"*","match_mapping_type":"string"}}],"properties":{"mode":{"type":"string","index":"not_analyzed","fielddata":{"format":"disabled"}},"query":{"type":"object","enabled":false},"type":{"type":"string","index":"not_analyzed","fielddata":{"format":"disabled"}}}},"product":{"dynamic_templates":[{"for_string":{"mapping":{"fielddata":{"format":"disabled"}},"match":"*","match_mapping_type":"string"}}],"properties":{"json":{"properties":{"name":{"type":"string","fielddata":{"format":"disabled"}},"price":{"type":"double"},"stores":{"type":"string","fielddata":{"format":"disabled"}},"tags":{"type":"string","fielddata":{"format":"disabled"}}}},"name":{"type":"string","fielddata":{"format":"disabled"}},"price":{"type":"double"},"query":{"properties":{"bool":{"properties":{"must":{"properties":{"bool":{"properties":{"must":{"properties":{"range":{"properties":{"price":{"properties":{"gt":{"type":"long"}}}}}}}}},"match":{"properties":{"name":{"type":"string","fielddata":{"format":"disabled"}}}}}}}}}},"stores":{"type":"string","fielddata":{"format":"disabled"}},"tags":{"type":"string","fielddata":{"format":"disabled"}}}},"_default_":{"dynamic_templates":[{"for_string":{"mapping":{"fielddata":{"format":"disabled"}},"match":"*","match_mapping_type":"string"}}]},"~logs":{"_ttl":{"enabled":true},"dynamic_templates":[{"for_string":{"mapping":{"fielddata":{"format":"disabled"}},"match":"*","match_mapping_type":"string"}}]}}}},"resultQuery":{"type":"","result":[{"boolparam":0,"parent_id":0,"id":1,"internal":[{"field":"1","query":"0","input":"test","analyzeTest":"analyzed","type":"string","appliedQuery":{"match":{"name":"test"}}}],"minimum_should_match":"","availableQuery":[{"match":{"name":"test"}}]}],"final":"{\n  \"query\": {\n    \"bool\": {\n      \"must\": [\n        {\n          \"match\": {\n            \"name\": \"test\"\n          }\n        }\n      ]\n    }\n  }\n}","availableFields":[{"name":"json","index":null},{"name":"name","type":"string","index":null},{"name":"price","type":"numeric","index":null},{"name":"query","index":null},{"name":"stores","type":"string","index":null},{"name":"tags","type":"string","index":null}]},"output":{},"queryId":2,"selectedTypes":["product"]},"config":{"url":"https://CnqEgei0f:a2176969-de4c-4ed0-bbbe-67e152de04f7@scalr.api.appbase.io","appname":"App3","username":"CnqEgei0f","password":"a2176969-de4c-4ed0-bbbe-67e152de04f7"},"name":"test","tag":"t1"};
		// this.newQuery(q1);
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
		else {
			this.initial_connect = true;
		}
	}

	//Set config from localstorage
	setLocalConfig(url, appname) {
		window.localStorage.setItem('url', url);
		window.localStorage.setItem('appname', appname);
	}

	// Connect with config url and appname
	// do mapping request  
	// and set response in mapping property 
	connect() {
		this.connected = false;
		this.initial_connect = false;
		var APPNAME = this.config.appname;
		var URL = this.config.url;
		var urlsplit = URL.split(':');
		var pwsplit = urlsplit[2].split('@');
		this.config.username = urlsplit[1].replace('//', '');
		this.config.password = pwsplit[0];
		var self = this;
		this.appbaseService.setAppbase(this.config);
		this.appbaseService.get('/_mapping').then(function(res) {
			self.connected = true;
			let data = res.json();
			self.mapping = {
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
			self.mapping.mapping = data;
			self.mapping.types = self.seprateType(data);
			self.setLocalConfig(self.config.url, self.config.appname);
			self.detectChange += "done";
			self.editorHookHelp.setValue('');
		}).catch(function(e) {
			self.initial_connect = true;
			alert(e.json().message);
		});
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

	newQuery(query) {
		this.config = query.config;
		this.mapping = query.mapping;
		this.query_info.name = query.name;
		this.query_info.tag = query.tag;
		this.detectChange = "check";
		setTimeout(() => {$('#setType').val(this.mapping.selectedTypes).trigger("change");},300)
	}

	deleteQuery(index) {
		var confirmFlag = confirm("Do you want to delete this query?");
		if(confirmFlag) {
			this.savedQueryList.splice(index, 1);
			try {
				window.localStorage.setItem('queryList', JSON.stringify(this.savedQueryList));
			} catch(e) {}
		}
	}

	sidebarToggle() {
		if($('.feature-query-container').hasClass('off')) {
			$('.feature-query-container').removeClass('off');
		}
		else {
			$('.feature-query-container').addClass('off');
		}
	}

}
