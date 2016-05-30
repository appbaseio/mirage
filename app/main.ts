import { bootstrap }    from '@angular/platform-browser-dynamic';
import {HTTP_PROVIDERS, JSONP_PROVIDERS } from '@angular/http';
import {AppComponent} from './app.component'

bootstrap(AppComponent, [ HTTP_PROVIDERS, JSONP_PROVIDERS ]);