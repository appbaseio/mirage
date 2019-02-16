import { Component, OnInit, OnChanges, Input, Output } from "@angular/core";
import { SafeResourceUrl, DomSanitizer } from "@angular/platform-browser";
import { UrlShare } from "../shared/urlShare";
declare var $: any;

@Component({
  selector: "query-result",
  templateUrl: "./app/result/result.component.html",
  inputs: [
    "mapping",
    "config",
    "editorHookHelp",
    "urlShare",
    "responseHookHelp",
    "result_time_taken",
    "result_random_token",
    "types",
    "result",
    "config",
    "responseHookHelp",
    "result_time_taken"
  ]
})
export class ResultComponent implements OnInit, OnChanges {
  public mapping: any;
  public config: any;
  public responseHookHelp: any;
  public url: SafeResourceUrl;
  public urlShare: any;
  public editorHookHelp: any;
  public urlAvailable: boolean = false;
  @Input() selectedTypes: any;
  @Input() responseMode: string;
  // public dejavuDomain: string = 'http://localhost:1358/';
  public dejavuDomain: string = "https://dejavu.appbase.io/";

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit() {
    this.responseHookHelp.applyEditor({ readOnly: true });
  }

  ngOnChanges(changes) {
    if (changes && changes["result_random_token"]) {
      var prev = changes["result_random_token"].previousValue;
      var current = changes["result_random_token"].currentValue;
      if (current && prev !== current && this.editorHookHelp) {
        var getQuery = this.editorHookHelp.getValue();
        if (getQuery) {
          console.log(this.selectedTypes);
          getQuery = getQuery.trim();
          getQuery = JSON.parse(getQuery);
          var queryObj = {
            query: getQuery,
            type: this.selectedTypes
          };
          this.url = this.sanitizeUrl(this.dejavuDomain);
          setTimeout(
            function() {
              var url =
                this.dejavuDomain +
                "?mode=edit&appswitcher=false&sidebar=false&oldBanner=false&appname=" +
                this.urlShare.inputs.appname +
                "&url=" +
                this.urlShare.inputs.url;
              url =
                url +
                "&hf=false&sidebar=false&subscribe=false&query=" +
                JSON.stringify(queryObj);
              this.url = this.sanitizeUrl(url);
              console.log(this.url);
            }.bind(this),
            300
          );
          this.urlAvailable = true;
        }
      }
    }
  }

  sanitizeUrl(url) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
