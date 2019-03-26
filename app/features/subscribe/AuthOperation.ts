import {
  OnInit,
  OnChanges,
  Component,
  Input,
  Output,
  EventEmitter,
  AfterViewInit
} from "@angular/core";
import { Headers, Http } from "@angular/http";
import { StorageService } from "../../shared/storage.service";

declare var $: any, Auth0: any, location: any;

@Component({
  selector: "auth-operation",
  template: ""
})
export class AuthOperation implements OnInit {
  @Output() updateStatus = new EventEmitter<any>();
  public auth0: any;
  public serverAddress: string = "https://ossauth.appbase.io";
  public token: any;
  public access_token_applied: boolean = false;

  constructor(private http: Http, public storageService: StorageService) {}
  ngOnInit() {
    var authConfig = {
      domain: "appbaseio.auth0.com",
      clientID: "tCy6GxnrsyKec3UxXCuYLhU6XWFCMgRD",
      callbackURL: location.href,
      callbackOnLocationHash: true
    };
    this.auth0 = new Auth0(authConfig);
    // check if already logged in
    this.init.call(this);
  }
  init() {
    var self = this;
    this.parseHash.call(this);
    var parseHash = this.parseHash.bind(this);
    setTimeout(function() {
      window.onhashchange = function() {
        if (
          !self.access_token_applied &&
          location.hash.indexOf("access_token") > -1
        ) {
          console.log("access_token found!");
          parseHash();
        }
      };
    }, 300);
  }
  isTokenExpired(token) {
    var decoded = this.auth0.decodeJwt(token);
    var now = new Date().getTime() / 1000;
    return decoded.exp < now;
  }
  login(subscribeOption) {
    let savedState = window.location.hash;
    this.storageService.set("subscribeOption", subscribeOption);
    if (savedState.indexOf("access_token") < 0) {
      this.storageService.set("savedState", savedState);
    }
    this.auth0.login(
      {
        connection: "github"
      },
      function(err) {
        if (err) console.log("something went wrong: " + err.message);
      }
    );
  }
  show_logged_in(token) {
    this.token = token;
    if (window.location.hash.indexOf("access_token") > -1) {
      this.access_token_applied = true;
      this.restoreStates();
    } else {
      this.getUserProfile();
    }
  }
  show_sign_in() {}
  restoreStates() {
    let domain = location.href.split("#")[0];
    let savedState = this.storageService.get("savedState");
    let finalPath = domain;
    if (savedState && savedState.indexOf("access_token") < 0) {
      finalPath += savedState;
    } else {
      finalPath += "#";
    }
    window.location.href = finalPath;
    location.reload();
  }
  getUserProfile() {
    var url = this.serverAddress + "/api/getUserProfile";
    let subscribeOption =
      this.storageService.get("subscribeOption") &&
      this.storageService.get("subscribeOption") !== "null"
        ? this.storageService.get("subscribeOption")
        : null;
    var request = {
      token: this.storageService.get("mirage_id_token"),
      origin_app: "MIRAGE",
      email_preference: subscribeOption
    };
    $.ajax({
      type: "POST",
      url: url,
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      data: JSON.stringify(request)
    })
      .done(
        function(res) {
          this.storageService.set("subscribeOption", null);
          this.updateStatus.emit({ profile: res.message });
        }.bind(this)
      )
      .fail(function(err) {
        console.error(err);
      });
  }
  parseHash() {
    var token = this.storageService.get("mirage_id_token");
    if (token !== null && !this.isTokenExpired(token)) {
      this.show_logged_in(token);
    } else {
      var result = this.auth0.parseHash(window.location.hash);
      if (result && result.idToken) {
        this.storageService.set("mirage_id_token", result.idToken);
        this.show_logged_in(result.idToken);
      } else if (result && result.error) {
        console.log("error: " + result.error);
        this.show_sign_in();
      } else {
        this.show_sign_in();
      }
    }
  }
}
