System.register(["@angular/core", "./build/build.component", "./result/result.component", "./run/run.component", './features/save/save.query.component', './features/list/list.query.component', "./shared/editorHook", "./shared/appbase.service"], function(exports_1, context_1) {
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
    var core_1, build_component_1, result_component_1, run_component_1, save_query_component_1, list_query_component_1, editorHook_1, appbase_service_1;
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
            function (editorHook_1_1) {
                editorHook_1 = editorHook_1_1;
            },
            function (appbase_service_1_1) {
                appbase_service_1 = appbase_service_1_1;
            }],
        execute: function() {
            AppComponent = (function () {
                function AppComponent(appbaseService) {
                    this.appbaseService = appbaseService;
                    this.connected = false;
                    this.initial_connect = false;
                    this.mapping = {
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
                    this.detectChange = null;
                    this.config = {
                        url: "",
                        appname: "",
                        username: "",
                        password: ""
                    };
                    this.editorHookHelp = new editorHook_1.editorHook({ editorId: 'editor' });
                    this.responseHookHelp = new editorHook_1.editorHook({ editorId: 'responseBlock' });
                    this.savedQueryList = [];
                    this.query_info = {
                        name: '',
                        tag: ''
                    };
                    this.sort_by = 'createdAt';
                    this.sort_direction = true;
                    this.searchTerm = '';
                }
                AppComponent.prototype.ngOnInit = function () {
                    this.getLocalConfig();
                    try {
                        var list = window.localStorage.getItem('queryList');
                        if (list) {
                            this.savedQueryList = JSON.parse(list);
                            this.sort(this.sort_by, this.savedQueryList);
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
                };
                //Set config from localstorage
                AppComponent.prototype.setLocalConfig = function (url, appname) {
                    window.localStorage.setItem('url', url);
                    window.localStorage.setItem('appname', appname);
                };
                // Connect with config url and appname
                // do mapping request  
                // and set response in mapping property 
                AppComponent.prototype.connect = function () {
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
                    this.appbaseService.get('/_mapping').then(function (res) {
                        self.connected = true;
                        var data = res.json();
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
                    }).catch(function (e) {
                        self.initial_connect = true;
                        alert(e.json().message);
                    });
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
                    var _this = this;
                    this.config = query.config;
                    this.mapping = query.mapping;
                    console.log(this.mapping);
                    this.query_info.name = query.name;
                    this.query_info.tag = query.tag;
                    this.detectChange = "check";
                    setTimeout(function () { $('#setType').val(_this.mapping.selectedTypes).trigger("change"); }, 300);
                };
                AppComponent.prototype.deleteQuery = function (index) {
                    var confirmFlag = confirm("Do you want to delete this query?");
                    if (confirmFlag) {
                        this.savedQueryList.splice(index, 1);
                        try {
                            window.localStorage.setItem('queryList', JSON.stringify(this.savedQueryList));
                        }
                        catch (e) { }
                    }
                };
                AppComponent.prototype.clearAll = function () {
                    this.mapping = {
                        types: this.mapping.types,
                        resultQuery: {
                            'type': '',
                            'result': [],
                            'final': "{}"
                        },
                        output: {},
                        queryId: 1,
                        selectedTypes: []
                    };
                    this.query_info = {
                        name: '',
                        tag: ''
                    };
                    this.detectChange += "check";
                    this.editorHookHelp.setValue('');
                };
                AppComponent.prototype.sidebarToggle = function () {
                    if ($('.feature-query-container').hasClass('off')) {
                        $('.feature-query-container').removeClass('off');
                    }
                    else {
                        $('.feature-query-container').addClass('off');
                    }
                };
                AppComponent.prototype.saveQuery = function (list) {
                    this.savedQueryList = list;
                    var direction = this.sort_direction ? false : true;
                    this.sort(this.sort_by, this.filteredQuery, direction);
                    var queryString = JSON.stringify(this.savedQueryList);
                    try {
                        window.localStorage.setItem('queryList', JSON.stringify(this.savedQueryList));
                    }
                    catch (e) { }
                    $('#saveQueryModal').modal('hide');
                };
                // Sorting
                AppComponent.prototype.sort = function (prop, list, direction) {
                    if (this.searchTerm.trim().length < 1) {
                        var list = list ? list : this.savedQueryList;
                    }
                    else {
                        var list = list ? list : this.filteredQuery;
                    }
                    if (!direction) {
                        if (prop == this.sort_by) {
                            this.sort_direction = this.sort_direction ? false : true;
                        }
                        else {
                            this.sort_direction = true;
                        }
                    }
                    this.sort_by = prop;
                    if (this.sort_direction) {
                        this.filteredQuery = list.sortBy(function (item) {
                            return item[prop];
                        });
                    }
                    else {
                        this.filteredQuery = list.sortBy(function (item) {
                            return -item[prop];
                        });
                    }
                    console.log(this.sort_direction, this.sort_by);
                    console.log('filtered', this.filteredQuery);
                };
                // Searching
                AppComponent.prototype.searchList = function ($event) {
                    this.searchTerm = $event.target.value;
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
                    var direction = this.sort_direction ? false : true;
                    this.sort(this.sort_by, this.filteredQuery, direction);
                };
                AppComponent = __decorate([
                    core_1.Component({
                        selector: 'my-app',
                        templateUrl: './app/app.component.html',
                        directives: [build_component_1.BuildComponent, result_component_1.ResultComponent, run_component_1.RunComponent, save_query_component_1.SaveQueryComponent, list_query_component_1.ListQueryComponent],
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