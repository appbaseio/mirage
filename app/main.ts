import { bootstrap } from '@angular/platform-browser-dynamic';
import { HTTP_PROVIDERS, JSONP_PROVIDERS, XHRBackend } from '@angular/http';
import { AppComponent } from './app.component'
import { enableProdMode } from '@angular/core'

enableProdMode();
bootstrap(AppComponent, [HTTP_PROVIDERS, XHRBackend, JSONP_PROVIDERS]);
