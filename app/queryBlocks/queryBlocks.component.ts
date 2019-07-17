import {
  Component,
  OnInit,
  OnChanges,
  EventEmitter,
  Input,
  Output
} from "@angular/core";
import { queryList } from "../shared/queryList";
declare var $: any;

@Component({
  selector: "query-blocks",
  templateUrl: "./app/queryBlocks/queryBlocks.component.html",
  inputs: [
    "detectChange",
    "editorHookHelp",
    "saveQuery",
    "setProp",
    "setDocSample"
  ]
})
export class QueryBlocksComponent implements OnInit, OnChanges {
  public queryList: any = queryList;
  public queryFormat: any = {
    internal: {
      field: "",
      query: "",
      selectedField: "",
      selectedQuery: "",
      input: "",
      analyzeTest: "",
      type: ""
    },
    bool: {
      boolparam: 0,
      parent_id: 0,
      id: 0,
      internal: [],
      minimum_should_match: "",
      path: "",
      type: "",
      xid: 0,
      parent_type: "",
      score_mode: ""
    }
  };
  public editorHookHelp: any;
  public joiningQuery: any = [""];
  public joiningQueryParam: any = 0;
  public popoverInfo: any = {
    stream: {
      trigger: "hover",
      placement: "top",
      content:
        "Shows an interactive stream of results, useful when your data is changing quickly.",
      container: "body"
    },
    historic: {
      trigger: "hover",
      placement: "top",
      content:
        "Shows historical results, useful when your data is not changing quickly.",
      container: "body"
    }
  };
  @Input() isAppbaseApp: boolean;
  @Input() responseMode: string;
  @Input() mapping: any;
  @Input() types: any;
  @Input() selectedTypes: any;
  @Input() result: any;
  @Input() query_info: any;
  @Input() savedQueryList: any;
  @Input() finalUrl: string;
  @Input() urlShare: any;
  @Input() config: any;
  @Input() version: number;
  @Output() saveQuery = new EventEmitter<any>();
  @Output() setProp = new EventEmitter<any>();
  @Output() setDocSample = new EventEmitter<any>();

  ngOnInit() {
    this.handleEditable();
    this.joiningQuery = this.result.joiningQuery;
  }

  ngOnChanges(nextProps) {
    this.joiningQuery = this.result.joiningQuery;
    if (
      (nextProps &&
        (nextProps.isAppbaseApp && nextProps.isAppbaseApp.currentValue)) ||
      (nextProps.selectedTypes && nextProps.selectedTypes.currentValue.length)
    ) {
      this.setPopover();
    }
  }

  // Add the boolean query
  // get the default format for query and internal query
  // set the format and push into result array
  addBoolQuery(parent_id: number) {
    if (this.selectedTypes) {
      var queryObj = JSON.parse(JSON.stringify(this.queryFormat.bool));
      var internalObj = JSON.parse(JSON.stringify(this.queryFormat.internal));
      queryObj.internal.push(internalObj);
      queryObj.id = this.result.queryId;
      queryObj.parent_id = parent_id;
      this.result.queryId += 1;
      this.result.resultQuery.result.push(queryObj);
      this.buildQuery();
    } else {
      alert("Select type first.");
    }
  }

  removeQuery() {
    this.result.resultQuery.result = [];
    this.buildQuery();
  }

  addSortBlock() {
    let sortObj = {
      selectedField: "",
      order: "asc",
      availableOptionalParams: []
    };
    this.result.sort.push(sortObj);
  }

  removeSortBlock() {
    this.result.sort = [];
    this.buildQuery();
  }

  // add internal query
  addQuery(boolQuery) {
    var self = this;
    var queryObj = JSON.parse(JSON.stringify(self.queryFormat.internal));
    boolQuery.internal.push(queryObj);
    this.buildQuery();
  }

  // builquery - this function handles everything to build the query
  buildQuery() {
    var self = this;
    var results = this.result.resultQuery.result;
    var es_final = {};

    if (results.length) {
      var finalresult = {};
      if (results.length > 1) {
        es_final["query"] = {
          bool: finalresult
        };
      } else {
        if (results[0].availableQuery && results[0].internal.length > 1) {
          es_final["query"] = {
            bool: finalresult
          };
        } else {
          if (self.queryList["boolQuery"][results[0]["boolparam"]] === "must") {
            es_final["query"] = finalresult;
          } else {
            es_final["query"] = {
              bool: finalresult
            };
          }
        }
      }

      results.forEach(function(result) {
        result.availableQuery = self.buildInsideQuery(result);
      });
      var isBoolPresent = true;

      results.forEach(function(result0) {
        results.forEach(function(result1) {
          if (result1.parent_id == result0.id) {
            var current_query = {
              bool: {}
            };
            var currentBool = self.queryList["boolQuery"][result1["boolparam"]];
            current_query["bool"][currentBool] = result1.availableQuery;
            if (currentBool === "should") {
              current_query["bool"]["minimum_should_match"] =
                result1.minimum_should_match;
            }
            if (self.joiningQuery[self.joiningQueryParam] === "nested") {
              current_query["bool"]["nested"]["path"] = result1.path;
              current_query["bool"]["nested"]["score_mode"] =
                result1.score_mode;
              isBoolPresent = false;
            }
            result0.availableQuery.push(current_query);
          }
        });
      });
      results.forEach(function(result) {
        if (result.parent_id === 0) {
          var currentBool = self.queryList["boolQuery"][result["boolparam"]];
          if (
            self.joiningQuery &&
            self.joiningQuery[self.joiningQueryParam] === "nested"
          ) {
            finalresult["nested"] = {
              path: result.path,
              score_mode: result.score_mode,
              query: {
                bool: {
                  [currentBool]: result.availableQuery
                }
              }
            };
            isBoolPresent = false;
          } else if (
            self.joiningQuery &&
            self.joiningQuery[self.joiningQueryParam] === "has_child"
          ) {
            finalresult[currentBool] = {
              has_child: {
                type: result.type,
                score_mode: result.score_mode,
                query: result.availableQuery
              }
            };
          } else if (
            self.joiningQuery &&
            self.joiningQuery[self.joiningQueryParam] === "has_parent"
          ) {
            finalresult[currentBool] = {
              has_parent: {
                parent_type: result.parent_type,
                query: result.availableQuery
              }
            };
          } else if (
            self.joiningQuery &&
            self.joiningQuery[self.joiningQueryParam] === "parent_id"
          ) {
            finalresult[currentBool] = {
              parent_id: {
                type: result.type,
                id: result.xid
              }
            };
          } else {
            if (result.internal.length > 1 || currentBool !== "must") {
              finalresult[currentBool] = result.availableQuery;
            } else {
              if (results.length > 1) {
                finalresult[currentBool] = result.availableQuery;
              } else {
                finalresult = result.availableQuery[0];
                es_final["query"] = finalresult;
              }
            }
          }
          if (currentBool === "should") {
            finalresult["minimum_should_match"] = result.minimum_should_match;
          } else {
            // condition required to reset when someone changes back from should to another bool type
            if (finalresult.hasOwnProperty("minimum_should_match")) {
              delete finalresult["minimum_should_match"];
            }
          }
        }
      });

      if (!isBoolPresent) {
        es_final["query"] = es_final["query"]["bool"];
      }
    } else {
      es_final["query"] = {
        match_all: {}
      };
    }

    // apply sort
    if (self.result.sort) {
      self.result.sort.map(sortObj => {
        if (sortObj.selectedField) {
          if (!es_final.hasOwnProperty("sort")) {
            es_final["sort"] = [];
          }

          let obj = {};
          if (sortObj._geo_distance) {
            obj = {
              ["_geo_distance"]: {
                [sortObj.selectedField]: {
                  lat: sortObj._geo_distance.lat,
                  lon: sortObj._geo_distance.lon
                },
                order: sortObj.order,
                distance_type: sortObj._geo_distance.distance_type,
                unit: sortObj._geo_distance.unit || "m"
              }
            };
            if (sortObj.mode) {
              obj["_geo_distance"]["mode"] = sortObj.mode;
            }
          } else {
            obj = {
              [sortObj.selectedField]: {
                order: sortObj.order
              }
            };
            if (sortObj.mode) {
              obj[sortObj.selectedField]["mode"] = sortObj.mode;
            }
            if (sortObj.missing) {
              obj[sortObj.selectedField]["missing"] = sortObj.missing;
            }
          }

          es_final["sort"].push(obj);
        }
      });
    }

    this.result.resultQuery.final = JSON.stringify(es_final, null, 2);
    try {
      this.editorHookHelp.setValue(self.result.resultQuery.final);
    } catch (e) {
      console.log(e);
    }

    //set input state
    try {
      this.urlShare.inputs["result"] = this.result;
      this.urlShare.createUrl();
    } catch (e) {
      console.log(e);
    }
  }

  buildInsideQuery(result) {
    var objChain = [];
    result.internal.forEach(
      function(val0) {
        var childExists = false;
        val0.appliedQuery = this.createQuery(val0, childExists);
      }.bind(this)
    );
    result.internal.forEach(function(val) {
      objChain.push(val.appliedQuery);
    });
    return objChain;
  }

  buildSubQuery() {
    var result = this.result.resultQuery.result[0];
    result.forEach(
      function(val0) {
        if (val0.parent_id != 0) {
          result.forEach(
            function(val1) {
              if (val0.parent_id == val1.id) {
                val1.appliedQuery["bool"]["must"].push(val0.appliedQuery);
              }
            }.bind(this)
          );
        }
      }.bind(this)
    );
  }

  // Createquery until query is selected
  createQuery(val, childExists) {
    var queryParam = {
      query: "*",
      field: "*",
      queryFlag: true,
      fieldFlag: true
    };

    if (val.analyzeTest === "" || val.type === "" || val.query === "") {
      queryParam.queryFlag = false;
    }
    if (val.field === "") {
      queryParam.fieldFlag = false;
    }

    if (queryParam.queryFlag) {
      return val.appliedQuery;
    } else {
      if (queryParam.fieldFlag) {
        queryParam.field = val.selectedField;
      }
      var sampleobj = this.setQueryFormat(
        queryParam.query,
        queryParam.field,
        val
      );
      return sampleobj;
    }
  }

  setQueryFormat(query, field, val) {
    var sampleobj = {};
    sampleobj[query] = {};
    sampleobj[query][field] = val.input;
    return sampleobj;
  }

  toggleBoolQuery() {
    if (
      this.result.resultQuery.result.length < 1 &&
      this.selectedTypes.length > 0
    ) {
      this.addBoolQuery(0);
    } else {
      this.removeQuery();
    }
  }

  toggleSortQuery() {
    if (this.result.sort) {
      console.log("coming");
      if (this.result.sort.length < 1 && this.selectedTypes.length > 0) {
        this.addSortBlock();
      } else {
        this.removeSortBlock();
      }
    } else {
      this.result.sort = [];
      this.addSortBlock();
    }
  }

  // handle the body click event for editable
  // close all the select2 whene clicking outside of editable-element
  handleEditable() {
    $("body").on("click", function(e) {
      var target = $(e.target);
      if (
        target.hasClass(".editable-pack") ||
        target.parents(".editable-pack").length
      ) {
      } else {
        $(".editable-pack").removeClass("on");
      }
    });
  }

  // open save query modal
  openModal() {
    $("#saveQueryModal").modal("show");
  }

  setPropIn(propObj: any) {
    this.setProp.emit(propObj);
  }

  setDocSampleEve(link) {
    this.setDocSample.emit(link);
  }

  setJoiningQueryEve(obj) {
    this.joiningQueryParam = obj.param;
    this.result.resultQuery.availableFields = obj.allFields;
    this.buildQuery();
  }

  setPopover() {
    setTimeout(() => {
      $(".responseMode .stream").popover(this.popoverInfo.stream);
      $(".responseMode .historic").popover(this.popoverInfo.historic);
    }, 1000);
  }

  changeMode(mode) {
    this.responseMode = mode;
    const propInfo = {
      name: "responseMode",
      value: mode
    };
    this.setProp.emit(propInfo);
  }
}
