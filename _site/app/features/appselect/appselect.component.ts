import { Component, OnInit, OnChanges, SimpleChange, Input, Output, EventEmitter } from "@angular/core";

@Component({
	selector: 'appselect',
	templateUrl: './app/features/appselect/appselect.component.html',
	inputs: ['setConfig', 'onAppSelectChange']
})

export class AppselectComponent implements OnInit, OnChanges {
	@Input() appsList: any;
	@Input() config: any;
	@Input() connected: boolean;
	@Output() onAppSelectChange = new EventEmitter();
	@Output() setConfig = new EventEmitter();
	public filteredApps: any = [];
	public appFocus: boolean = false;

	ngOnInit() {
		// this.handleInput();
		this.onAppSelectChange.emit(this.config.appname);
	}
	ngOnChanges() {
		this.onAppSelectChange.emit(this.config.appname);
	}
	handleInput() {	
		this.filteredApps = this.getFilterApp();
        if(this.filteredApps.length) {
			this.appFocus = true;        
		} else {
			this.appFocus = false;
		}
		this.onAppSelectChange.emit(this.config.appname);
	}
	getFilterApp() {
		return this.appsList.filter(function(app, index) {
           return this.config.appname === '' || (this.config.appname !== '' && app.appname.toUpperCase().indexOf(this.config.appname.toUpperCase()) !== -1)
        }.bind(this));
	}
	focusInput() {
		this.filteredApps = this.getFilterApp();
        if(this.filteredApps.length) {
			this.appFocus = true;        
		}
		this.onAppSelectChange.emit(this.config.appname);
    }
    blurInput() { 
    	setTimeout(function() {
			this.appFocus = false; 
		}.bind(this), 500);  
		this.onAppSelectChange.emit(this.config.appname);
    }
    setApp(app: any) {
    	this.setConfig.emit(app);
    	this.onAppSelectChange.emit(app.appname);
    }
}
