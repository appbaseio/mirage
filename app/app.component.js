System.register(["@angular/core", "./build/build.component", "./result/result.component", "./run/run.component", './features/save/save.query.component', './features/list/list.query.component', './features/share/share.url.component', "./shared/editorHook", "./shared/appbase.service", "./shared/urlShare", "./features/modal/error-modal.component", "./features/appselect/appselect.component"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, build_component_1, result_component_1, run_component_1, save_query_component_1, list_query_component_1, share_url_component_1, editorHook_1, appbase_service_1, urlShare_1, error_modal_component_1, appselect_component_1;
    var AppComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (build_component_1_1) {
                build_component_1 = build_component_1_1;
            },
            function (result_component_1_1) {
                result_component_1 = result_component_1_1;
            },
            function (run_component_1_1) {
                run_component_1 = run_component_1_1;
            },
            function (save_query_component_1_1) {
                save_query_component_1 = save_query_component_1_1;
            },
            function (list_query_component_1_1) {
                list_query_component_1 = list_query_component_1_1;
            },
            function (share_url_component_1_1) {
                share_url_component_1 = share_url_component_1_1;
            },
            function (editorHook_1_1) {
                editorHook_1 = editorHook_1_1;
            },
            function (appbase_service_1_1) {
                appbase_service_1 = appbase_service_1_1;
            },
            function (urlShare_1_1) {
                urlShare_1 = urlShare_1_1;
            },
            function (error_modal_component_1_1) {
                error_modal_component_1 = error_modal_component_1_1;
            },
            function (appselect_component_1_1) {
                appselect_component_1 = appselect_component_1_1;
            }],
        execute: function() {
            AppComponent = (function () {
                function AppComponent(appbaseService) {
                    this.appbaseService = appbaseService;
                    this.connected = false;
                    this.initial_connect = false;
                    this.detectChange = null;
                    this.config = {
                        url: "",
                        appname: "",
                        username: "",
                        password: "",
                        host: ""
                    };
                    this.savedQueryList = [];
                    this.query_info = {
                        name: '',
                        tag: ''
                    };
                    this.sort_by = 'createdAt';
                    this.sort_direction = true;
                    this.searchTerm = '';
                    this.sidebar = false;
                    this.hide_url_flag = false;
                    this.appsList = [];
                    this.errorInfo = {};
                    this.editorHookHelp = new editorHook_1.EditorHook({ editorId: 'editor' });
                    this.responseHookHelp = new editorHook_1.EditorHook({ editorId: 'responseBlock' });
                    this.urlShare = new urlShare_1.UrlShare();
                }
                AppComponent.prototype.ngOnInit = function () {
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
                        var list = window.localStorage.getItem('queryList');
                        if (list) {
                            this.savedQueryList = JSON.parse(list);
                            this.sort(this.savedQueryList);
                        }
                    }
                    catch (e) { }
                };
                AppComponent.prototype.ngOnChanges = function (changes) {
                    var prev = changes['selectedQuery'].previousValue;
                    var current = changes['selectedQuery'].currentValue;
                };
                //Get config from localstorage 
                AppComponent.prototype.getLocalConfig = function () {
                    var url = window.localStorage.getItem('mirage-url');
                    var appname = window.localStorage.getItem('mirage-appname');
                    var appsList = window.localStorage.getItem('mirage-appsList');
                    if (url != null) {
                        this.config.url = url;
                        this.config.appname = appname;
                        this.connect(false);
                    }
                    else {
                        this.initial_connect = true;
                    }
                    if (appsList) {
                        try {
                            this.appsList = JSON.parse(appsList);
                        }
                        catch (e) {
                            this.appsList = [];
                        }
                    }
                };
                //Set config from localstorage
                AppComponent.prototype.setLocalConfig = function (url, appname) {
                    window.localStorage.setItem('mirage-url', url);
                    window.localStorage.setItem('mirage-appname', appname);
                    var obj = {
                        appname: appname,
                        url: url
                    };
                    var appsList = window.localStorage.getItem('mirage-appsList');
                    if (appsList) {
                        try {
                            this.appsList = JSON.parse(appsList);
                        }
                        catch (e) {
                            this.appsList = [];
                        }
                    }
                    if (this.appsList.length) {
                        this.appsList = this.appsList.filter(function (app) {
                            return app.appname !== appname;
                        });
                    }
                    this.appsList.push(obj);
                    window.localStorage.setItem('mirage-appsList', JSON.stringify(this.appsList));
                };
                AppComponent.prototype.setInitialValue = function () {
                    this.mapping = null;
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
                };
                AppComponent.prototype.connectHandle = function () {
                    if (this.connected) {
                        this.initial_connect = true;
                        this.connected = false;
                        this.urlShare.inputs = {};
                        this.urlShare.createUrl();
                    }
                    else {
                        this.connect(true);
                    }
                };
                AppComponent.prototype.hideUrl = function () {
                    this.hide_url_flag = this.hide_url_flag ? false : true;
                };
                // Connect with config url and appname
                // do mapping request  
                // and set response in mapping property 
                AppComponent.prototype.connect = function (clearFlag) {
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
                        this.appbaseService.get('/_mapping').then(function (res) {
                            self.connected = true;
                            var data = res.json();
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
                                if (decryptedData.types) {
                                    self.types = decryptedData.types;
                                }
                                if (decryptedData.selectedTypes) {
                                    self.selectedTypes = decryptedData.selectedTypes;
                                    self.detectChange = "check";
                                    setTimeout(function () { $('#setType').val(self.selectedTypes).trigger("change"); }, 300);
                                }
                                if (decryptedData.result) {
                                    self.result = decryptedData.result;
                                }
                                if (decryptedData.finalUrl) {
                                    self.finalUrl = decryptedData.finalUrl;
                                }
                            }
                            //set input state
                            self.urlShare.inputs['config'] = self.config;
                            self.urlShare.inputs['selectedTypes'] = self.selectedTypes;
                            self.urlShare.inputs['result'] = self.result;
                            self.urlShare.inputs['finalUrl'] = self.finalUrl;
                            self.urlShare.createUrl();
                            setTimeout(function () {
                                self.setLayoutResizer();
                                self.editorHookHelp.setValue('');
                            }, 300);
                        }).catch(function (e) {
                            self.initial_connect = true;
                            self.errorShow({
                                title: 'Disconnected',
                                message: e.json().message
                            });
                        });
                    }
                    catch (e) {
                        this.initial_connect = true;
                    }
                };
                // Seprate the types from mapping	
                AppComponent.prototype.seprateType = function (mappingObj) {
                    var mapObj = mappingObj[this.config.appname].mappings;
                    var types = [];
                    for (var type in mapObj) {
                        types.push(type);
                    }
                    return types;
                };
                AppComponent.prototype.newQuery = function (query) {
                    this.connected = false;
                    this.config = query.config;
                    this.appbaseService.get('/_mapping').then(function (res) {
                        var _this = this;
                        var data = res.json();
                        this.connected = true;
                        this.result = query.result;
                        this.mapping = data;
                        this.types = this.seprateType(data);
                        this.selectedTypes = query.selectedTypes;
                        setTimeout(function () { $('#setType').val(_this.selectedTypes).trigger("change"); }, 300);
                    }.bind(this));
                    this.query_info.name = query.name;
                    this.query_info.tag = query.tag;
                    this.detectChange = "check";
                };
                AppComponent.prototype.deleteQuery = function (index) {
                    var confirmFlag = confirm("Do you want to delete this query?");
                    if (confirmFlag) {
                        var selectedQuery = this.filteredQuery[index];
                        debugger;
                        this.savedQueryList.forEach(function (query, index) {
                            if (query.name === selectedQuery.name && query.tag === selectedQuery.tag) {
                                this.savedQueryList.splice(index, 1);
                            }
                        }.bind(this));
                        this.filteredQuery.splice(index, 1);
                        try {
                            window.localStorage.setItem('queryList', JSON.stringify(this.savedQueryList));
                        }
                        catch (e) { }
                    }
                };
                AppComponent.prototype.clearAll = function () {
                    this.setInitialValue();
                    this.query_info = {
                        name: '',
                        tag: ''
                    };
                    this.detectChange += "check";
                    this.editorHookHelp.setValue('');
                };
                AppComponent.prototype.sidebarToggle = function () {
                    this.sidebar = this.sidebar ? false : true;
                };
                // save query
                AppComponent.prototype.saveQuery = function () {
                    var createdAt = new Date().getTime();
                    this.savedQueryList.forEach(function (query, index) {
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
                    }
                    catch (e) { }
                    $('#saveQueryModal').modal('hide');
                };
                // Sorting by created At
                AppComponent.prototype.sort = function (list) {
                    this.sort_by = 'createdAt';
                    this.filteredQuery = list.sortBy(function (item) {
                        return -item[this.sort_by];
                    }.bind(this));
                };
                // Searching
                AppComponent.prototype.searchList = function (searchTerm) {
                    this.searchTerm = searchTerm;
                    if (this.searchTerm.trim().length > 1) {
                        this.filteredQuery = this.savedQueryList.filter(function (item) {
                            return item.tag.indexOf(this.searchTerm) !== -1 ? true : false;
                        }.bind(this));
                        if (!this.filteredQuery.length) {
                            this.filteredQuery = this.savedQueryList.filter(function (item) {
                                return item.name.indexOf(this.searchTerm) !== -1 ? true : false;
                            }.bind(this));
                        }
                    }
                    else {
                        this.filteredQuery = this.savedQueryList;
                    }
                    this.sort(this.filteredQuery);
                };
                AppComponent.prototype.setFinalUrl = function (url) {
                    this.finalUrl = url;
                    //set input state
                    this.urlShare.inputs['finalUrl'] = this.finalUrl;
                    this.urlShare.createUrl();
                };
                AppComponent.prototype.setProp = function (propInfo) {
                    if (propInfo.name === 'finalUrl') {
                        this.finalUrl = propInfo.value;
                        this.urlShare.inputs['finalUrl'] = this.finalUrl;
                    }
                    if (propInfo.name === 'availableFields') {
                        this.result.resultQuery.availableFields = propInfo.value;
                        this.urlShare.inputs['result'] = this.result;
                    }
                    if (propInfo.name === 'selectedTypes') {
                        this.selectedTypes = propInfo.value;
                        this.urlShare.inputs['selectedTypes'] = this.selectedTypes;
                    }
                    //set input state
                    this.urlShare.createUrl();
                };
                AppComponent.prototype.setLayoutResizer = function () {
                    $('body').layout({
                        west__size: "50%",
                        center__paneSelector: "#paneCenter",
                        west__paneSelector: "#paneWest"
                    });
                    function setSidebar() {
                        var windowHeight = $(window).height();
                        $('.features-section').css('height', windowHeight);
                    }
                    setSidebar();
                    $(window).on('resize', setSidebar);
                };
                AppComponent.prototype.setConfig = function (selectedConfig) {
                    this.config.appname = selectedConfig.appname;
                    this.config.url = selectedConfig.url;
                };
                AppComponent.prototype.errorShow = function (info) {
                    this.errorInfo = info;
                    $('#errorModal').modal('show');
                };
                AppComponent = __decorate([
                    core_1.Component({
                        selector: 'my-app',
                        templateUrl: './app/app.component.html',
                        directives: [build_component_1.BuildComponent, result_component_1.ResultComponent, run_component_1.RunComponent, save_query_component_1.SaveQueryComponent, list_query_component_1.ListQueryComponent, share_url_component_1.ShareUrlComponent, appselect_component_1.AppselectComponent, error_modal_component_1.ErrorModalComponent],
                        providers: [appbase_service_1.AppbaseService]
                    }), 
                    __metadata('design:paramtypes', [appbase_service_1.AppbaseService])
                ], AppComponent);
                return AppComponent;
            }());
            exports_1("AppComponent", AppComponent);
        }
    }
});
//# sourceMappingURL=app.component.js.map