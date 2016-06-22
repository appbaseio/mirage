import { Component, OnInit, OnChanges, SimpleChange } from "@angular/core";
import { NgForm } from "@angular/common";
import { BuildComponent } from "./build/build.component";
import { ResultComponent } from "./result/result.component";
import { RunComponent } from "./run/run.component";
import { SaveQueryComponent } from './features/save/save.query.component';
import { ListQueryComponent } from './features/list/list.query.component';
import { ShareUrlComponent } from './features/share/share.url.component';
import { Config } from "./shared/config";
import { EditorHook } from "./shared/editorHook";
import { AppbaseService } from "./shared/appbase.service";
import { UrlShare } from "./shared/urlShare";
import { ErrorModalComponent } from "./features/modal/error-modal.component";
import { AppselectComponent } from "./features/appselect/appselect.component";

@Component({
	selector: 'my-app',
	templateUrl: './app/app.component.html',
	directives: [BuildComponent, ResultComponent, RunComponent, SaveQueryComponent, ListQueryComponent, ShareUrlComponent, AppselectComponent, ErrorModalComponent],
	providers: [AppbaseService]
})

export class AppComponent implements OnInit, OnChanges {

	constructor(public appbaseService: AppbaseService) {}

	public connected: boolean = false;
	public initial_connect: boolean = false;
	public mapping: any;
	public types: any;
	public selectedTypes: any;
	public result: any;
	public detectChange: string = null;
	public config: Config = {
		url: "",
		appname: "",
		username: "",
		password: "",
		host: ""
	};
	public savedQueryList: any = [];
	public query_info = {
		name: '',
		tag: ''
	};
	public sort_by: string = 'createdAt';
	public sort_direction: boolean = true;
	public searchTerm: string = '';
	public filteredQuery: any;
	public finalUrl: string;
	public sidebar: boolean = false;
	public hide_url_flag: boolean = false;
	public appsList: any = [];
	public errorInfo: any = {};
	public editorHookHelp = new EditorHook({ editorId: 'editor' });
	public responseHookHelp = new EditorHook({ editorId: 'responseBlock' });
	public urlShare = new UrlShare();

	ngOnInit() {
		$('body').removeClass('is-loadingApp');
		this.setInitialValue();
		// get data from url
		this.urlShare.decryptUrl();
		if (this.urlShare.decryptedData.config) {
			var config = this.urlShare.decryptedData.config;
			this.setLocalConfig(config.url, config.appname);
		}
		
		this.getLocalConfig();
		try {
			let list = window.localStorage.getItem('queryList');
			if (list) {
				this.savedQueryList = JSON.parse(list);
				this.sort(this.savedQueryList);
			}
		} catch (e) {}
	}

	ngOnChanges(changes) {
		var prev = changes['selectedQuery'].previousValue;
		var current = changes['selectedQuery'].currentValue;
	}

	//Get config from localstorage 
	getLocalConfig() {
		var url = window.localStorage.getItem('mirage-url');
		var appname = window.localStorage.getItem('mirage-appname');
		var appsList = window.localStorage.getItem('mirage-appsList');
		if (url != null) {
			this.config.url = url;
			this.config.appname = appname;
			this.connect(false);
		} else {
			this.initial_connect = true;
		}
		if(appsList) {
			try {
				this.appsList = JSON.parse(appsList);
			} catch(e) {
				this.appsList = [];
			}
		}
	}

	//Set config from localstorage
	setLocalConfig(url, appname) {
		window.localStorage.setItem('mirage-url', url);
		window.localStorage.setItem('mirage-appname', appname);
		var obj = {
			appname: appname,
			url: url
		};
		var appsList = window.localStorage.getItem('mirage-appsList');
		if(appsList) {
			try {
				this.appsList = JSON.parse(appsList);
			} catch(e) {
				this.appsList = [];
			}
		}	
		if(this.appsList.length) {
			this.appsList = this.appsList.filter(function(app) {
				return app.appname !== appname;
			});
		}
		this.appsList.push(obj);
		window.localStorage.setItem('mirage-appsList', JSON.stringify(this.appsList));
	}

	setInitialValue() {
		this.mapping =  null;
		this.types = [];
		this.selectedTypes = [];
		this.result = {
			resultQuery: {
				'type': '',
				'result': [],
				'final': "{}"
			},
			output: {},
			queryId: 1
		};
	}

	connectHandle() {
		if(this.connected) {
			this.initial_connect = true;
			this.connected = false;
			this.urlShare.inputs = {};
			this.urlShare.createUrl();
		} else {
			this.connect(true);
		}
	}
	hideUrl() {
		this.hide_url_flag = this.hide_url_flag ? false : true;
	}

	// Connect with config url and appname
	// do mapping request  
	// and set response in mapping property 
	connect(clearFlag) {
		this.connected = false;
		this.initial_connect = false;
		console.log(this.config);
		try {
			var APPNAME = this.config.appname;
			var URL = this.config.url;
			var urlsplit = URL.split(':');
			var pwsplit = urlsplit[2].split('@');
			this.config.username = urlsplit[1].replace('//', '');
			this.config.password = pwsplit[0];
			this.config.host = urlsplit[0] + '://' + pwsplit[1];
			var self = this;
			this.appbaseService.setAppbase(this.config);
			this.appbaseService.get('/_mapping').then(function(res) {
				self.connected = true;
				let data = res.json();
				self.setInitialValue();
				self.finalUrl = self.config.host + '/' + self.config.appname;
				self.mapping = data;
				self.types = self.seprateType(data);
				self.setLocalConfig(self.config.url, self.config.appname);
				self.detectChange += "done";
				
				if (!clearFlag) {
					var decryptedData = self.urlShare.decryptedData;
					if (decryptedData.mapping) {
						self.mapping = decryptedData.mapping;
					}
					if(decryptedData.types) {
						self.types = decryptedData.types;
					}
					if(decryptedData.selectedTypes) {
						self.selectedTypes = decryptedData.selectedTypes;
						self.detectChange = "check";
						setTimeout(() => { $('#setType').val(self.selectedTypes).trigger("change"); }, 300)
					}
					if(decryptedData.result) {
						self.result = decryptedData.result;
					}
					if(decryptedData.finalUrl) {
						self.finalUrl = decryptedData.finalUrl;
					}
				}

				//set input state
				self.urlShare.inputs['config'] = self.config;
				self.urlShare.inputs['selectedTypes'] = self.selectedTypes;
				self.urlShare.inputs['result'] = self.result;
				self.urlShare.inputs['finalUrl'] = self.finalUrl;
				self.urlShare.createUrl();
				setTimeout(function() {
					self.setLayoutResizer();
					self.editorHookHelp.setValue('');
				}, 300);
				
			}).catch(function(e) {
				self.initial_connect = true;
				self.errorShow({
					title: 'Disconnected',
					message: e.json().message
				});
			});
		} catch(e) {
			this.initial_connect = true;
		}
	}

	// Seprate the types from mapping	
	seprateType(mappingObj: any) {
		var mapObj = mappingObj[this.config.appname].mappings;
		var types = [];
		for (var type in mapObj) {
			types.push(type);
		}
		return types;
	}

	newQuery(query) {
		this.connected = false;
		this.config = query.config;
		this.appbaseService.get('/_mapping').then(function(res) {
			let data = res.json();
			this.connected = true;
			this.result = query.result;
			this.mapping = data;
			this.types = this.seprateType(data);
			this.selectedTypes = query.selectedTypes;
			setTimeout(() => { $('#setType').val(this.selectedTypes).trigger("change"); }, 300);
		}.bind(this));	
		this.query_info.name = query.name;
		this.query_info.tag = query.tag;
		this.detectChange = "check";
	}

	deleteQuery(index) {
		var confirmFlag = confirm("Do you want to delete this query?");
		if (confirmFlag) {
			var selectedQuery = this.filteredQuery[index];
			debugger
			this.savedQueryList.forEach(function(query: any, index: Number) {
				if (query.name === selectedQuery.name && query.tag === selectedQuery.tag) {
					this.savedQueryList.splice(index, 1);
				}
			}.bind(this));
			this.filteredQuery.splice(index, 1);
			try {
				window.localStorage.setItem('queryList', JSON.stringify(this.savedQueryList));
			} catch (e) {}
		}
	}

	clearAll() {
		this.setInitialValue();
		this.query_info = {
			name: '',
			tag: ''
		};
		this.detectChange += "check";
		this.editorHookHelp.setValue('');
	}

	sidebarToggle() {
		this.sidebar = this.sidebar ? false : true;
	}

	// save query
	saveQuery() {
		var createdAt = new Date().getTime();
		this.savedQueryList.forEach(function(query, index) {
			if (query.name === this.query_info.name && query.tag === this.query_info.tag) {
				this.savedQueryList.splice(index, 1);
			}
		}.bind(this));
		var queryData = {
			config: this.config,
			selectedTypes: this.selectedTypes,
			result: this.result,
			name: this.query_info.name,
			tag: this.query_info.tag,
			createdAt: createdAt
		};
		this.savedQueryList.push(queryData);
		this.sort(this.savedQueryList);
		var queryString = JSON.stringify(this.savedQueryList);
		try {
			window.localStorage.setItem('queryList', JSON.stringify(this.savedQueryList));
		} catch (e) {}
		$('#saveQueryModal').modal('hide');
	}

	// Sorting by created At
	sort(list: any) {
		this.sort_by = 'createdAt';
		this.filteredQuery = list.sortBy(function(item) {
			return -item[this.sort_by];
		}.bind(this));
	}

	// Searching
	searchList(searchTerm: any) {
		this.searchTerm = searchTerm;
		if (this.searchTerm.trim().length > 1) {
			this.filteredQuery = this.savedQueryList.filter(function(item) {
				return item.tag.indexOf(this.searchTerm) !== -1 ? true : false;
			}.bind(this));

			if (!this.filteredQuery.length) {
				this.filteredQuery = this.savedQueryList.filter(function(item) {
					return item.name.indexOf(this.searchTerm) !== -1 ? true : false;
				}.bind(this));
			}
		} else {
			this.filteredQuery = this.savedQueryList;
		}
		this.sort(this.filteredQuery);
	}

	setFinalUrl(url: string) {
		this.finalUrl = url;

		//set input state
		this.urlShare.inputs['finalUrl'] = this.finalUrl;
		this.urlShare.createUrl();
	}

	setProp(propInfo: any) {
		if(propInfo.name === 'finalUrl') {
			this.finalUrl = propInfo.value;
			this.urlShare.inputs['finalUrl'] = this.finalUrl;
		}
		if(propInfo.name === 'availableFields') {
			this.result.resultQuery.availableFields = propInfo.value;
			this.urlShare.inputs['result'] = this.result;
		}
		if(propInfo.name === 'selectedTypes') {
			this.selectedTypes = propInfo.value;
			this.urlShare.inputs['selectedTypes'] = this.selectedTypes;
		}

		//set input state
		this.urlShare.createUrl();
	}

	setLayoutResizer() {
		$('body').layout({
			east__size:	"50%",
			center__paneSelector: "#paneCenter",
			east__paneSelector: "#paneEast"
		});
		function setSidebar() {
			var windowHeight = $(window).height();
			$('.features-section').css('height', windowHeight);
		}
		setSidebar();
		$(window).on('resize', setSidebar);
	}

	setConfig(selectedConfig: any) {
		this.config.appname = selectedConfig.appname;
		this.config.url = selectedConfig.url;
	}

	errorShow(info: any) {
		this.errorInfo = info;
		$('#errorModal').modal('show');
	}
}
