import { Component, OnInit, OnChanges, SimpleChange } from "@angular/core";
import { Subscription } from "rxjs/Subscription";
import { NgForm } from "@angular/forms";
import { AppbaseService } from "./shared/appbase.service";
import { StorageService } from "./shared/storage.service";
import { DocService } from "./shared/docService";
import { Config } from "./shared/config";
import { EditorHook } from "./shared/editorHook";
import { UrlShare } from "./shared/urlShare";

const trimUrl = (url: string): string => {
  if (url.lastIndexOf("/") === url.length - 1) {
    return url.slice(0, -1);
  }

  return url;
};

const defaultQuery = {
  query: {
    match_all: {}
  }
};

declare var $: any;

@Component({
  selector: "my-app",
  templateUrl: "./app/app.component.html",
  providers: [AppbaseService, StorageService, DocService]
})
export class AppComponent implements OnInit, OnChanges {
  constructor(
    public appbaseService: AppbaseService,
    public storageService: StorageService,
    public docService: DocService
  ) {}

  public BRANCH = "dev";
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
    name: "",
    tag: ""
  };
  public sort_by: string = "createdAt";
  public sort_direction: boolean = true;
  public searchTerm: string = "";
  public searchByMethod: string = "tag";
  public filteredQuery: any;
  public finalUrl: string;
  public sidebar: boolean = false;
  public hide_url_flag: boolean = false;
  public appsList: any = [];
  public errorInfo: any = {};
  public editorHookHelp = new EditorHook({ editorId: "editor" });
  public responseHookHelp = new EditorHook({ editorId: "responseBlock" });
  public errorHookHelp = new EditorHook({ editorId: "errorEditor" });
  public urlShare = new UrlShare();
  public result_time_taken = null;
  public result_random_token = null;
  public version: number = 2;
  public docLink: string;
  public currentDeleteQuery: any;
  active = true;
  submitted = false;
  public queryParams: any;
  public allowHF: boolean;
  public allowH: boolean;
  public allowF: boolean;
  public setLayoutFlag = false;
  public responseMode: string = "historic";
  public isAppbaseApp: boolean = true;
  public deleteItemInfo: any = {
    title: "Confirm Deletion",
    message: "Do you want to delete this query?",
    yesText: "Delete",
    noText: "Cancel"
  };
  public defaultApp: any = {
    appname: "2016primaries",
    url:
      "https://Uy82NeW8e:c7d02cce-94cc-4b60-9b17-7e7325195851@scalr.api.appbase.io"
  };
  public appSelected: boolean = false;

  onSubmit() {
    this.submitted = true;
  }

  setDocSample(link) {
    this.docLink = link;
  }

  ngOnInit() {
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
      } else {
        if (config && config.url && config.appname) {
          this.setLocalConfig(config.url, config.appname);
        }
        this.getLocalConfig();
      }
    }
  }

  ngOnChanges(changes) {
    var prev = changes["selectedQuery"].previousValue;
    var current = changes["selectedQuery"].currentValue;
  }

  // detect app config, either get it from url or apply default config
  detectConfig(cb) {
    let config = null;
    let isDefault =
      window.location.href.indexOf("#?default=true") > -1 ? true : false;
    let isInputState =
      window.location.href.indexOf("input_state=") > -1 ? true : false;
    let isApp = window.location.href.indexOf("app=") > -1 ? true : false;
    if (isDefault) {
      config = this.defaultApp;
      return cb(config);
    } else if (!isInputState && !isApp) {
      return cb("learn");
    } else {
      this.urlShare.decryptUrl().then(data => {
        var decryptedData = data.data;
        if (decryptedData && decryptedData.config) {
          cb(decryptedData.config);
        } else {
          cb(null);
        }
      });
    }
  }

  // for Master branch
  EsSpecific() {
    this.getIndices();
  }

  // get indices
  getIndices() {
    var es_host = document.URL.split("/_plugin/")[0];
    var getIndices = this.appbaseService.getIndices(es_host);
    getIndices
      .then(
        function(res) {
          try {
            let data = res.json();
            let historicApps = this.getAppsList();
            var indices = [];
            for (let indice in data.indices) {
              if (historicApps && historicApps.length) {
                historicApps.forEach(function(old_app, index) {
                  if (old_app.appname === indice) {
                    historicApps.splice(index, 1);
                  }
                });
              }
              var obj = {
                appname: indice,
                url: es_host
              };
              indices.push(indice);
              historicApps.push(obj);
            }
            // default app is no app found
            if (!historicApps.length) {
              var obj = {
                appname: "sampleapp",
                url: es_host
              };
              historicApps.push(obj);
            }
            if (!this.config.url) {
              this.config.url = historicApps[0].url;
            }
            this.storageService.set(
              "mirage-appsList",
              JSON.stringify(historicApps)
            );
            this.getAppsList();
          } catch (e) {
            console.log(e);
          }
        }.bind(this)
      )
      .catch(function(e) {
        console.log("Not able to get the version.");
      });
  }

  //Get config from localstorage
  getLocalConfig() {
    var url = this.storageService.get("mirage-url");
    var appname = this.storageService.get("mirage-appname");
    this.getAppsList();
    if (url != null) {
      this.config.url = url;
      this.config.appname = appname;
      this.connect(false);
    } else {
      this.initial_connect = true;
    }
  }

  // get appsList from storage
  getAppsList() {
    var appsList = this.storageService.get("mirage-appsList");
    if (appsList) {
      try {
        this.appsList = JSON.parse(appsList);
      } catch (e) {
        this.appsList = [];
      }
    }
    return this.appsList;
  }

  // get query list from local storage
  getQueryList() {
    try {
      let list = this.storageService.get("queryList");
      if (list) {
        this.savedQueryList = JSON.parse(list);
        this.sort(this.savedQueryList);
      }
    } catch (e) {}
  }

  //Set config from localstorage
  setLocalConfig(url, appname) {
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
      } catch (e) {
        this.appsList = [];
      }
    }
    if (this.appsList.length) {
      this.appsList = this.appsList.filter(function(app) {
        return app.appname !== appname;
      });
    }
    this.appsList.push(obj);
    this.storageService.set("mirage-appsList", JSON.stringify(this.appsList));
  }

  setInitialValue() {
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
  }

  connectHandle() {
    if (this.connected) {
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
    var self = this;
    var APPNAME = this.config.appname;
    var URL = trimUrl(this.config.url);
    this.config.url = trimUrl(this.config.url);
    var filteredConfig = this.appbaseService.filterurl(URL);
    console.log(this.config, filteredConfig);
    if (!filteredConfig) {
      console.log("Not able to filter url", URL);
    } else {
      this.config.username = filteredConfig.username;
      this.config.password = filteredConfig.password;
      this.config.host = filteredConfig.url;
      this.appbaseService.setAppbase(this.config);
      this.getVersion();
      this.getMappings(clearFlag);
    }
  }

  // get version of elasticsearch
  getVersion() {
    var self = this;
    this.appbaseService
      .getVersion()
      .then(function(res) {
        try {
          let data = res.json();
          let source = data && data[self.config.appname];
          if (
            source &&
            source.settings &&
            source.settings.index &&
            source.settings.index.version
          ) {
            let version =
              source.settings.index.version.upgraded ||
              source.settings.index.version.created;
            self.version = parseInt(version.charAt(0), 10);
            self.appbaseService.setVersion(self.version);
            if (self.version > 7) {
              self.errorShow({
                title: "Elasticsearch Version Not Supported",
                message:
                  "Mirage only supports v2.x, v5.x, v6.x and v7.x* of Elasticsearch Query DSL"
              });
            }
          }
        } catch (e) {
          console.log(e);
        }
      })
      .catch(function(e) {
        console.log("Not able to get the version.");
      });
  }

  // get mappings
  getMappings(clearFlag) {
    var self = this;
    this.appbaseService
      .getMappings()
      .then(function(data) {
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
            setTimeout(() => {
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
        setTimeout(function() {
          if ($("body").width() > 768) {
            self.setLayoutResizer();
          } else {
            self.setMobileLayout();
          }
          var currentValue = self.editorHookHelp.getValue();
          if (!currentValue && currentValue !== "{}") {
            self.editorHookHelp.setValue(JSON.stringify(defaultQuery, null, 2));
          }
        }, 300);
      })
      .catch(function(e) {
        console.log(e);
        self.initial_connect = true;
        self.errorShow({
          title: "Authentication Error",
          message: `It looks like your app name, username, password combination doesn\'t match. Check your url and appname and then connect it again.`
        });
      });
  }

  // Seprate the types from mapping
  seprateType(mappingObj: any) {
    var mapObj = mappingObj[this.config.appname].mappings;
    var types = [];
    for (var type in mapObj) {
      types.push(type);
    }
    if (!types.length) {
      this.errorShow({
        title: "Type does not exist.",
        message:
          this.config.appname +
          " does not contain any type mapping. You should *first* create a type mapping to perform query operations."
      });
    }
    return types;
  }

  newQuery(currentQuery) {
    let queryList = this.storageService.get("queryList");
    if (queryList) {
      let list = JSON.parse(queryList);
      let queryData = list.filter(function(query) {
        return (
          query.name === currentQuery.name && query.tag === currentQuery.tag
        );
      });
      let query;
      if (queryData.length) {
        query = queryData[0];
        this.connected = false;
        this.initial_connect = false;
        this.config = query.config;
        this.appbaseService.setAppbase(this.config);
        this.appbaseService.get("/_mapping").then(
          function(res) {
            let data = res.json();
            this.finalUrl = this.config.host + "/" + this.config.appname;
            this.setInitialValue();
            this.connected = true;
            this.result = query.result;
            this.mapping = data;
            this.types = this.seprateType(data);
            this.selectedTypes = query.selectedTypes;
            //set input state
            this.urlShare.inputs["config"] = this.config;
            this.urlShare.inputs["selectedTypes"] = this.selectedTypes;
            this.urlShare.inputs["result"] = this.result;
            this.urlShare.inputs["finalUrl"] = this.finalUrl;
            this.urlShare.createUrl();
            setTimeout(() => {
              $("#setType")
                .val(this.selectedTypes)
                .trigger("change");
              if ($("body").width() > 768) {
                this.setLayoutResizer();
              } else {
                this.setMobileLayout();
              }
            }, 300);
          }.bind(this)
        );
        this.query_info.name = query.name;
        this.query_info.tag = query.tag;
        this.detectChange = "check";
      }
    }
  }

  deleteQuery(currentQuery) {
    this.currentDeleteQuery = currentQuery;
    $("#confirmModal").modal("show");
  }
  confirmDeleteQuery(confirmFlag: any) {
    if (confirmFlag && this.currentDeleteQuery) {
      var currentQuery = this.currentDeleteQuery;
      this.getQueryList();
      this.savedQueryList.forEach(
        function(query: any, index: Number) {
          if (
            query.name === currentQuery.name &&
            query.tag === currentQuery.tag
          ) {
            this.savedQueryList.splice(index, 1);
          }
        }.bind(this)
      );
      this.filteredQuery.forEach(
        function(query: any, index: Number) {
          if (
            query.name === currentQuery.name &&
            query.tag === currentQuery.tag
          ) {
            this.filteredQuery.splice(index, 1);
          }
        }.bind(this)
      );
      try {
        this.storageService.set(
          "queryList",
          JSON.stringify(this.savedQueryList)
        );
      } catch (e) {}
    }
    this.currentDeleteQuery = null;
  }

  clearAll() {
    this.setInitialValue();
    this.query_info = {
      name: "",
      tag: ""
    };
    this.detectChange += "check";
    this.editorHookHelp.setValue(JSON.stringify(defaultQuery, null, 2));
  }

  sidebarToggle() {
    this.sidebar = this.sidebar ? false : true;
  }

  // save query
  saveQuery(inputQuery: any) {
    this.getQueryList();
    var createdAt = new Date().getTime();
    let currentQuery = {
      name: this.query_info.name,
      tag: this.query_info.tag,
      config: this.config,
      selectedTypes: this.selectedTypes,
      result: this.result,
      version: this.version
    };
    let queryData = inputQuery ? inputQuery : currentQuery;
    queryData.createdAt = createdAt;
    this.savedQueryList.forEach(
      function(query, index) {
        if (query.name === queryData.name && query.tag === queryData.tag) {
          this.savedQueryList.splice(index, 1);
        }
      }.bind(this)
    );
    this.savedQueryList.push(queryData);
    this.sort(this.savedQueryList);
    var queryString = JSON.stringify(this.savedQueryList);
    try {
      this.storageService.set("queryList", JSON.stringify(this.savedQueryList));
    } catch (e) {}
    $("#saveQueryModal").modal("hide");
  }

  // Sorting by created At
  sort(list: any) {
    this.sort_by = "createdAt";
    this.filteredQuery = list.sortBy(
      function(item) {
        return -item[this.sort_by];
      }.bind(this)
    );
  }

  // Searching
  searchList(obj: any) {
    var searchTerm = obj.searchTerm;
    var searchByMethod = obj.searchByMethod ? obj.searchByMethod : "tag";
    this.searchTerm = searchTerm;
    this.searchByMethod = searchByMethod;
    if (this.searchTerm.trim().length > 1) {
      this.filteredQuery = this.savedQueryList.filter(
        function(item) {
          return item[this.searchByMethod] &&
            item[this.searchByMethod].indexOf(this.searchTerm) !== -1
            ? true
            : false;
        }.bind(this)
      );

      if (!this.filteredQuery.length) {
        this.filteredQuery = this.savedQueryList.filter(
          function(item) {
            return item.name.indexOf(this.searchTerm) !== -1 ? true : false;
          }.bind(this)
        );
      }
    } else {
      this.filteredQuery = this.savedQueryList;
    }
    this.sort(this.filteredQuery);
  }

  setFinalUrl(url: string) {
    this.finalUrl = url;

    //set input state
    this.urlShare.inputs["finalUrl"] = this.finalUrl;
    this.urlShare.createUrl();
  }

  setProp(propInfo: any) {
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
  }

  setLayoutResizer() {
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
      setTimeout(() => {
        $("#mirage-container").css("height", mirageHeight);
        $("#paneCenter, #paneEast").css("height", mirageHeight);
      }, 300);
    }
    setSidebar();
    $(window).on("resize", setSidebar);
  }
  setMobileLayout() {
    var bodyHeight = $("body").height();
    $("#mirage-container").css("height", bodyHeight - 116);
    $("#paneCenter, #paneEast").css("height", bodyHeight);
  }

  setConfig(selectedConfig: any) {
    this.config.appname = selectedConfig.appname;
    this.config.url = selectedConfig.url;
  }

  errorShow(info: any) {
    var self = this;
    this.errorInfo = info;
    $("#errorModal").modal("show");
    var message = info.message;
    self.errorHookHelp.focus(message);
    setTimeout(
      function() {
        self.errorHookHelp.focus(message);
        if ($("#errorModal").hasClass("in")) {
          self.errorHookHelp.setValue(message);
        } else {
          setTimeout(function() {
            self.errorHookHelp.setValue(message);
          }, 300);
        }
      }.bind(this),
      500
    );
  }

  viewData() {
    var dejavuLink = this.urlShare.dejavuLink();
    window.open(dejavuLink, "_blank");
  }

  openLearn() {
    $("#learnModal").modal("show");
  }

  onAppSelectChange(appInput: any) {
    this.appSelected = appInput.trim() ? true : false;
  }
}
