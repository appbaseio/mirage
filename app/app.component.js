"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("@angular/core");
var appbase_service_1 = require("./shared/appbase.service");
var storage_service_1 = require("./shared/storage.service");
var docService_1 = require("./shared/docService");
var editorHook_1 = require("./shared/editorHook");
var urlShare_1 = require("./shared/urlShare");
var trimUrl = function (url) {
    if (url.lastIndexOf("/") === url.length - 1) {
        return url.slice(0, -1);
    }
    return url;
};
var defaultQuery = {
    query: {
        match_all: {}
    }
};
var AppComponent = (function () {
    function AppComponent(appbaseService, storageService, docService) {
        this.appbaseService = appbaseService;
        this.storageService = storageService;
        this.docService = docService;
        this.BRANCH = "dev";
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
            name: "",
            tag: ""
        };
        this.sort_by = "createdAt";
        this.sort_direction = true;
        this.searchTerm = "";
        this.searchByMethod = "tag";
        this.sidebar = false;
        this.hide_url_flag = false;
        this.appsList = [];
        this.errorInfo = {};
        this.editorHookHelp = new editorHook_1.EditorHook({ editorId: "editor" });
        this.responseHookHelp = new editorHook_1.EditorHook({ editorId: "responseBlock" });
        this.errorHookHelp = new editorHook_1.EditorHook({ editorId: "errorEditor" });
        this.urlShare = new urlShare_1.UrlShare();
        this.result_time_taken = null;
        this.result_random_token = null;
        this.version = 2;
        this.active = true;
        this.submitted = false;
        this.setLayoutFlag = false;
        this.responseMode = "historic";
        this.isAppbaseApp = true;
        this.deleteItemInfo = {
            title: "Confirm Deletion",
            message: "Do you want to delete this query?",
            yesText: "Delete",
            noText: "Cancel"
        };
        this.defaultApp = {
            appname: "2016primaries",
            url: "https://Uy82NeW8e:c7d02cce-94cc-4b60-9b17-7e7325195851@scalr.api.appbase.io"
        };
        this.appSelected = false;
    }
    AppComponent.prototype.onSubmit = function () {
        this.submitted = true;
    };
    AppComponent.prototype.setDocSample = function (link) {
        this.docLink = link;
    };
    AppComponent.prototype.ngOnInit = function () {
        $("body").removeClass("is-loadingApp");
        this.queryParams = this.urlShare.getQueryParameters();
        this.allowHF = !(this.queryParams && this.queryParams.hasOwnProperty("hf"))
            ? true
            : false;
        this.allowF = !this.allowHF
            ? false
            : !(this.queryParams && this.queryParams.hasOwnProperty("f"))
                ? true
                : false;
        this.allowH = !this.allowHF
            ? false
            : !(this.queryParams && this.queryParams.hasOwnProperty("h"))
                ? true
                : false;
        // get data from url
        this.detectConfig(configCb.bind(this));
        function configCb(config) {
            this.setInitialValue();
            this.getQueryList();
            this.getAppsList();
            if (this.BRANCH === "master") {
                this.EsSpecific();
            }
            if (config && config === "learn") {
                $("#learnModal").modal("show");
                this.initial_connect = true;
            }
            else {
                if (config && config.url && config.appname) {
                    this.setLocalConfig(config.url, config.appname);
                }
                this.getLocalConfig();
            }
        }
    };
    AppComponent.prototype.ngOnChanges = function (changes) {
        var prev = changes["selectedQuery"].previousValue;
        var current = changes["selectedQuery"].currentValue;
    };
    // detect app config, either get it from url or apply default config
    AppComponent.prototype.detectConfig = function (cb) {
        var config = null;
        var isDefault = window.location.href.indexOf("#?default=true") > -1 ? true : false;
        var isInputState = window.location.href.indexOf("input_state=") > -1 ? true : false;
        var isApp = window.location.href.indexOf("app=") > -1 ? true : false;
        if (isDefault) {
            config = this.defaultApp;
            return cb(config);
        }
        else if (!isInputState && !isApp) {
            return cb("learn");
        }
        else {
            this.urlShare.decryptUrl().then(function (data) {
                var decryptedData = data.data;
                if (decryptedData && decryptedData.config) {
                    cb(decryptedData.config);
                }
                else {
                    cb(null);
                }
            });
        }
    };
    // for Master branch
    AppComponent.prototype.EsSpecific = function () {
        this.getIndices();
    };
    // get indices
    AppComponent.prototype.getIndices = function () {
        var es_host = document.URL.split("/_plugin/")[0];
        var getIndices = this.appbaseService.getIndices(es_host);
        getIndices
            .then(function (res) {
            try {
                var data = res.json();
                var historicApps_1 = this.getAppsList();
                var indices = [];
                var _loop_1 = function(indice) {
                    if (historicApps_1 && historicApps_1.length) {
                        historicApps_1.forEach(function (old_app, index) {
                            if (old_app.appname === indice) {
                                historicApps_1.splice(index, 1);
                            }
                        });
                    }
                    obj = {
                        appname: indice,
                        url: es_host
                    };
                    indices.push(indice);
                    historicApps_1.push(obj);
                };
                var obj;
                for (var indice in data.indices) {
                    _loop_1(indice);
                }
                // default app is no app found
                if (!historicApps_1.length) {
                    var obj = {
                        appname: "sampleapp",
                        url: es_host
                    };
                    historicApps_1.push(obj);
                }
                if (!this.config.url) {
                    this.config.url = historicApps_1[0].url;
                }
                this.storageService.set("mirage-appsList", JSON.stringify(historicApps_1));
                this.getAppsList();
            }
            catch (e) {
                console.log(e);
            }
        }.bind(this))
            .catch(function (e) {
            console.log("Not able to get the version.");
        });
    };
    //Get config from localstorage
    AppComponent.prototype.getLocalConfig = function () {
        var url = this.storageService.get("mirage-url");
        var appname = this.storageService.get("mirage-appname");
        this.getAppsList();
        if (url != null) {
            this.config.url = url;
            this.config.appname = appname;
            this.connect(false);
        }
        else {
            this.initial_connect = true;
        }
    };
    // get appsList from storage
    AppComponent.prototype.getAppsList = function () {
        var appsList = this.storageService.get("mirage-appsList");
        if (appsList) {
            try {
                this.appsList = JSON.parse(appsList);
            }
            catch (e) {
                this.appsList = [];
            }
        }
        return this.appsList;
    };
    // get query list from local storage
    AppComponent.prototype.getQueryList = function () {
        try {
            var list = this.storageService.get("queryList");
            if (list) {
                this.savedQueryList = JSON.parse(list);
                this.sort(this.savedQueryList);
            }
        }
        catch (e) { }
    };
    //Set config from localstorage
    AppComponent.prototype.setLocalConfig = function (url, appname) {
        this.storageService.set("mirage-url", url);
        this.storageService.set("mirage-appname", appname);
        var obj = {
            appname: appname,
            url: trimUrl(url)
        };
        var appsList = this.storageService.get("mirage-appsList");
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
        this.storageService.set("mirage-appsList", JSON.stringify(this.appsList));
    };
    AppComponent.prototype.setInitialValue = function () {
        this.mapping = null;
        this.types = [];
        this.selectedTypes = [];
        this.result = {
            resultQuery: {
                type: "",
                result: [],
                final: "{}"
            },
            output: {},
            queryId: 1,
            sort: []
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
        var self = this;
        var APPNAME = this.config.appname;
        var URL = trimUrl(this.config.url);
        this.config.url = trimUrl(this.config.url);
        var filteredConfig = this.appbaseService.filterurl(URL);
        console.log(this.config, filteredConfig);
        if (!filteredConfig) {
            console.log("Not able to filter url", URL);
        }
        else {
            this.config.username = filteredConfig.username;
            this.config.password = filteredConfig.password;
            this.config.host = filteredConfig.url;
            this.appbaseService.setAppbase(this.config);
            this.getVersion();
            this.getMappings(clearFlag);
        }
    };
    // get version of elasticsearch
    AppComponent.prototype.getVersion = function () {
        var self = this;
        this.appbaseService
            .getVersion()
            .then(function (res) {
            try {
                var data = res.json();
                var source = data && data[self.config.appname];
                if (source &&
                    source.settings &&
                    source.settings.index &&
                    source.settings.index.version) {
                    var version = source.settings.index.version.upgraded ||
                        source.settings.index.version.created;
                    self.version = parseInt(version.charAt(0), 10);
                    self.appbaseService.setVersion(self.version);
                    if (self.version > 7) {
                        self.errorShow({
                            title: "Elasticsearch Version Not Supported",
                            message: "Mirage only supports v2.x, v5.x, v6.x and v7.x* of Elasticsearch Query DSL"
                        });
                    }
                }
            }
            catch (e) {
                console.log(e);
            }
        })
            .catch(function (e) {
            console.log("Not able to get the version.");
        });
    };
    // get mappings
    AppComponent.prototype.getMappings = function (clearFlag) {
        var self = this;
        this.appbaseService
            .getMappings()
            .then(function (data) {
            self.isAppbaseApp =
                self.config.host === "https://scalr.api.appbase.io" ? true : false;
            self.connected = true;
            self.setInitialValue();
            self.finalUrl = self.config.host + "/" + self.config.appname;
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
                    setTimeout(function () {
                        $("#setType")
                            .val(self.selectedTypes)
                            .trigger("change");
                    }, 300);
                }
                if (decryptedData.result) {
                    self.result = decryptedData.result;
                }
                if (decryptedData.finalUrl) {
                    self.finalUrl = decryptedData.finalUrl;
                }
            }
            //set input state
            self.urlShare.inputs["config"] = self.config;
            self.urlShare.inputs["selectedTypes"] = self.selectedTypes;
            self.urlShare.inputs["result"] = self.result;
            self.urlShare.inputs["finalUrl"] = self.finalUrl;
            self.urlShare.createUrl();
            setTimeout(function () {
                if ($("body").width() > 768) {
                    self.setLayoutResizer();
                }
                else {
                    self.setMobileLayout();
                }
                var currentValue = self.editorHookHelp.getValue();
                if (!currentValue && currentValue !== "{}") {
                    self.editorHookHelp.setValue(JSON.stringify(defaultQuery, null, 2));
                }
            }, 300);
        })
            .catch(function (e) {
            console.log(e);
            self.initial_connect = true;
            self.errorShow({
                title: "Authentication Error",
                message: "It looks like your app name, username, password combination doesn't match. Check your url and appname and then connect it again."
            });
        });
    };
    // Seprate the types from mapping
    AppComponent.prototype.seprateType = function (mappingObj) {
        var mapObj = mappingObj[this.config.appname].mappings;
        var types = [];
        for (var type in mapObj) {
            types.push(type);
        }
        if (!types.length) {
            this.errorShow({
                title: "Type does not exist.",
                message: this.config.appname +
                    " does not contain any type mapping. You should *first* create a type mapping to perform query operations."
            });
        }
        return types;
    };
    AppComponent.prototype.newQuery = function (currentQuery) {
        var queryList = this.storageService.get("queryList");
        if (queryList) {
            var list = JSON.parse(queryList);
            var queryData = list.filter(function (query) {
                return (query.name === currentQuery.name && query.tag === currentQuery.tag);
            });
            var query_1;
            if (queryData.length) {
                query_1 = queryData[0];
                this.connected = false;
                this.initial_connect = false;
                this.config = query_1.config;
                this.appbaseService.setAppbase(this.config);
                this.appbaseService.get("/_mapping").then(function (res) {
                    var _this = this;
                    var data = res.json();
                    this.finalUrl = this.config.host + "/" + this.config.appname;
                    this.setInitialValue();
                    this.connected = true;
                    this.result = query_1.result;
                    this.mapping = data;
                    this.types = this.seprateType(data);
                    this.selectedTypes = query_1.selectedTypes;
                    //set input state
                    this.urlShare.inputs["config"] = this.config;
                    this.urlShare.inputs["selectedTypes"] = this.selectedTypes;
                    this.urlShare.inputs["result"] = this.result;
                    this.urlShare.inputs["finalUrl"] = this.finalUrl;
                    this.urlShare.createUrl();
                    setTimeout(function () {
                        $("#setType")
                            .val(_this.selectedTypes)
                            .trigger("change");
                        if ($("body").width() > 768) {
                            _this.setLayoutResizer();
                        }
                        else {
                            _this.setMobileLayout();
                        }
                    }, 300);
                }.bind(this));
                this.query_info.name = query_1.name;
                this.query_info.tag = query_1.tag;
                this.detectChange = "check";
            }
        }
    };
    AppComponent.prototype.deleteQuery = function (currentQuery) {
        this.currentDeleteQuery = currentQuery;
        $("#confirmModal").modal("show");
    };
    AppComponent.prototype.confirmDeleteQuery = function (confirmFlag) {
        if (confirmFlag && this.currentDeleteQuery) {
            var currentQuery = this.currentDeleteQuery;
            this.getQueryList();
            this.savedQueryList.forEach(function (query, index) {
                if (query.name === currentQuery.name &&
                    query.tag === currentQuery.tag) {
                    this.savedQueryList.splice(index, 1);
                }
            }.bind(this));
            this.filteredQuery.forEach(function (query, index) {
                if (query.name === currentQuery.name &&
                    query.tag === currentQuery.tag) {
                    this.filteredQuery.splice(index, 1);
                }
            }.bind(this));
            try {
                this.storageService.set("queryList", JSON.stringify(this.savedQueryList));
            }
            catch (e) { }
        }
        this.currentDeleteQuery = null;
    };
    AppComponent.prototype.clearAll = function () {
        this.setInitialValue();
        this.query_info = {
            name: "",
            tag: ""
        };
        this.detectChange += "check";
        this.editorHookHelp.setValue(JSON.stringify(defaultQuery, null, 2));
    };
    AppComponent.prototype.sidebarToggle = function () {
        this.sidebar = this.sidebar ? false : true;
    };
    // save query
    AppComponent.prototype.saveQuery = function (inputQuery) {
        this.getQueryList();
        var createdAt = new Date().getTime();
        var currentQuery = {
            name: this.query_info.name,
            tag: this.query_info.tag,
            config: this.config,
            selectedTypes: this.selectedTypes,
            result: this.result,
            version: this.version
        };
        var queryData = inputQuery ? inputQuery : currentQuery;
        queryData.createdAt = createdAt;
        this.savedQueryList.forEach(function (query, index) {
            if (query.name === queryData.name && query.tag === queryData.tag) {
                this.savedQueryList.splice(index, 1);
            }
        }.bind(this));
        this.savedQueryList.push(queryData);
        this.sort(this.savedQueryList);
        var queryString = JSON.stringify(this.savedQueryList);
        try {
            this.storageService.set("queryList", JSON.stringify(this.savedQueryList));
        }
        catch (e) { }
        $("#saveQueryModal").modal("hide");
    };
    // Sorting by created At
    AppComponent.prototype.sort = function (list) {
        this.sort_by = "createdAt";
        this.filteredQuery = list.sortBy(function (item) {
            return -item[this.sort_by];
        }.bind(this));
    };
    // Searching
    AppComponent.prototype.searchList = function (obj) {
        var searchTerm = obj.searchTerm;
        var searchByMethod = obj.searchByMethod ? obj.searchByMethod : "tag";
        this.searchTerm = searchTerm;
        this.searchByMethod = searchByMethod;
        if (this.searchTerm.trim().length > 1) {
            this.filteredQuery = this.savedQueryList.filter(function (item) {
                return item[this.searchByMethod] &&
                    item[this.searchByMethod].indexOf(this.searchTerm) !== -1
                    ? true
                    : false;
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
        this.urlShare.inputs["finalUrl"] = this.finalUrl;
        this.urlShare.createUrl();
    };
    AppComponent.prototype.setProp = function (propInfo) {
        if (propInfo.name === "finalUrl") {
            this.finalUrl = propInfo.value;
            this.urlShare.inputs["finalUrl"] = this.finalUrl;
        }
        if (propInfo.name === "availableFields") {
            this.result.resultQuery.availableFields = propInfo.value;
            this.urlShare.inputs["result"] = this.result;
        }
        if (propInfo.name === "selectedTypes") {
            this.selectedTypes = propInfo.value;
            this.urlShare.inputs["selectedTypes"] = this.selectedTypes;
        }
        if (propInfo.name === "result_time_taken") {
            this.result_time_taken = propInfo.value;
        }
        if (propInfo.name === "random_token") {
            this.result_random_token = propInfo.value;
        }
        if (propInfo.name === "responseMode") {
            this.responseMode = propInfo.value;
        }
        //set input state
        this.urlShare.createUrl();
    };
    AppComponent.prototype.setLayoutResizer = function () {
        this.setLayoutFlag = true;
        var self = this;
        $("body").layout({
            east__size: "50%",
            center__paneSelector: "#paneCenter",
            east__paneSelector: "#paneEast"
        });
        function setSidebar() {
            var windowHeight = $(window).height();
            $(".features-section").css("height", windowHeight);
            var bodyHeight = $("body").height();
            var mirageHeight = bodyHeight;
            if (self.allowHF && self.allowF && !self.allowH) {
                mirageHeight -= 15;
            }
            if (self.allowHF && self.allowH && !self.allowF) {
                mirageHeight -= 140;
            }
            if (self.allowHF && self.allowH && self.allowF) {
                mirageHeight -= 166;
            }
            setTimeout(function () {
                $("#mirage-container").css("height", mirageHeight);
                $("#paneCenter, #paneEast").css("height", mirageHeight);
            }, 300);
        }
        setSidebar();
        $(window).on("resize", setSidebar);
    };
    AppComponent.prototype.setMobileLayout = function () {
        var bodyHeight = $("body").height();
        $("#mirage-container").css("height", bodyHeight - 116);
        $("#paneCenter, #paneEast").css("height", bodyHeight);
    };
    AppComponent.prototype.setConfig = function (selectedConfig) {
        this.config.appname = selectedConfig.appname;
        this.config.url = selectedConfig.url;
    };
    AppComponent.prototype.errorShow = function (info) {
        var self = this;
        this.errorInfo = info;
        $("#errorModal").modal("show");
        var message = info.message;
        self.errorHookHelp.focus(message);
        setTimeout(function () {
            self.errorHookHelp.focus(message);
            if ($("#errorModal").hasClass("in")) {
                self.errorHookHelp.setValue(message);
            }
            else {
                setTimeout(function () {
                    self.errorHookHelp.setValue(message);
                }, 300);
            }
        }.bind(this), 500);
    };
    AppComponent.prototype.viewData = function () {
        var dejavuLink = this.urlShare.dejavuLink();
        window.open(dejavuLink, "_blank");
    };
    AppComponent.prototype.openLearn = function () {
        $("#learnModal").modal("show");
    };
    AppComponent.prototype.onAppSelectChange = function (appInput) {
        this.appSelected = appInput.trim() ? true : false;
    };
    AppComponent = __decorate([
        core_1.Component({
            selector: "my-app",
            templateUrl: "./app/app.component.html",
            providers: [appbase_service_1.AppbaseService, storage_service_1.StorageService, docService_1.DocService]
        }), 
        __metadata('design:paramtypes', [appbase_service_1.AppbaseService, storage_service_1.StorageService, docService_1.DocService])
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.component.js.map