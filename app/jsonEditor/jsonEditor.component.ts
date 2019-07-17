import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { AppbaseService } from "../shared/appbase.service";
declare var $;

@Component({
  selector: "query-jsoneditor",
  templateUrl: "./app/jsonEditor/jsonEditor.component.html",
  inputs: [
    "config",
    "editorHookHelp",
    "responseHookHelp",
    "setProp",
    "errorShow"
  ],
  providers: [AppbaseService]
})
export class JsonEditorComponent implements OnInit {
  public config;
  public editorHookHelp;
  public responseHookHelp;
  public streamPopoverInfo: any = {
    trigger: "hover",
    placement: "right",
    content: "Stream is avtive, waiting for data updates .."
  };
  @Input() finalUrl;
  @Input() mapping: any;
  @Input() types: any;
  @Input() selectedTypes: any;
  @Input() result: any;
  @Input() responseMode: string;
  @Output() setProp = new EventEmitter<any>();
  @Output() errorShow = new EventEmitter();
  @Input() allowF: any;

  constructor(public appbaseService: AppbaseService) {}

  // Set codemirror instead of normal textarea
  ngOnInit() {
    var self = this;
    console.log("allowed footer", self.allowF);
    self.finalUrl =
      self.finalUrl.indexOf("/_search") > -1
        ? self.finalUrl
        : `${self.finalUrl}/_search`;

    this.editorHookHelp.applyEditor();
    $("#resultModal").modal({
      show: false,
      backdrop: "static"
    });
    $("#resultModal").on("hide.bs.modal", function() {
      $('#resultTabs a[href="#resultJson"]').tab("show");
      self.responseHookHelp.focus('{"Loading": "please wait......"}');
      var propInfo = {
        name: "result_time_taken",
        value: null
      };
      self.setProp.emit(propInfo);
    });
  }

  // Validate using checkValidaQuery method
  // if validation success then apply search query and set result in textarea using editorhook
  // else show message
  runQuery() {
    var self = this;
    this.appbaseService.setAppbase(this.config);
    var validate = this.checkValidQuery();

    if (validate.flag) {
      $("#resultModal").modal("show");
      this.appbaseService
        .posturl(self.finalUrl, validate.payload)
        .then(function(res) {
          self.result.isWatching = false;
          var propInfo = {
            name: "result_time_taken",
            value: res.json().took
          };
          self.setProp.emit(propInfo);
          var propInfo1 = {
            name: "random_token",
            value: Math.random()
          };
          self.setProp.emit(propInfo1);
          self.result.output = JSON.stringify(res.json(), null, 2);
          if ($("#resultModal").hasClass("in")) {
            self.responseHookHelp.setValue(self.result.output);
          } else {
            setTimeout(function() {
              self.responseHookHelp.setValue(self.result.output);
            }, 300);
          }
        })
        .catch(function(data) {
          $("#resultModal").modal("hide");
          self.result.isWatching = false;
          self.result.output = JSON.stringify(data, null, 4);
          var obj = {
            title: "Response Error",
            message: self.result.output
          };
          self.errorShow.emit(obj);
        });
      if (this.responseMode === "stream") {
        this.setStream(validate);
      }
    } else {
      var obj = {
        title: "Json validation",
        message: validate.message
      };
      this.errorShow.emit(obj);
    }
  }

  setStream(validate) {
    const selectedTypes = $("#setType").val();
    const body = validate.payload;
    setTimeout(() => {
      $(".stream-signal").show();
      $(".stream-signal").popover(this.streamPopoverInfo);
    }, 300);
    this.appbaseService
      .searchStream(selectedTypes, body)
      .on("data", this.onStreamData.bind(this))
      .on("error", this.onStreamError.bind(this));
  }

  onStreamData(res) {
    $(".stream-signal")
      .addClass("warning")
      .addClass("success");
    const streamResponse = JSON.stringify(res, null, 2);
    if ($("#resultModal").hasClass("in")) {
      this.responseHookHelp.prepend(streamResponse + "\n");
    } else {
      setTimeout(function() {
        this.responseHookHelp.prepend(streamResponse + "\n");
      }, 300);
    }
  }

  onStreamError(res) {
    setTimeout(() => {
      $(".stream-signal").hide();
    }, 300);
  }

  // get the textarea value using editor hook
  // Checking if all the internal queries have field and query,
  // Query should not contain '*' that we are setting on default
  // If internal query is perfect then check for valid json
  checkValidQuery() {
    var getQuery = this.editorHookHelp.getValue();
    getQuery = getQuery.trim();
    var returnObj = {
      flag: true,
      payload: null,
      message: null
    };

    this.result.resultQuery.result.forEach(function(result) {
      result.internal.forEach(function(query) {
        if (query.field === "" || query.query === "") {
          returnObj.flag = false;
        }
      });
    });
    if (returnObj.flag && getQuery && getQuery != "") {
      try {
        returnObj.payload = JSON.parse(getQuery);
      } catch (e) {
        returnObj.message = "Json is not valid.";
      }
    } else {
      returnObj.flag = false;
      returnObj.message = "  Please complete your query first.";
    }
    return returnObj;
  }

  setPropIn() {
    var propInfo = {
      name: "finalUrl",
      value: this.finalUrl
    };
    this.setProp.emit(propInfo);
  }

  getBottom() {
    if (this.allowF) {
      return -23;
    }

    return 10;
  }
}
