import { Component, OnInit, OnChanges, SimpleChange, Input, Output, EventEmitter } from "@angular/core";

@Component({
	selector: 'appselect',
	templateUrl: './app/features/appselect/appselect.component.html',
	inputs: ['appsList', 'config', 'connected', 'setConfig'],
	directives: []
})

export class AppselectComponent implements OnInit, OnChanges {
	@Input() appsList: any;
	@Input() config: any;
	@Input() connected: boolean;
	@Output() setConfig = new EventEmitter();
	public filteredApps: any = [];
	public appFocus: boolean = false;

	ngOnInit() {
		// this.handleInput();
	}
	ngOnChanges() {

	}
	handleInput() {	
        this.filteredApps = this.appsList.filter(function(app, index) {
           return this.config.appname === '' || (this.config.appname !== '' && app.appname.toUpperCase().indexOf(this.config.appname.toUpperCase()) !== -1)
        }.bind(this));

	}
	focusInput() {
		this.appFocus = true;        
    }
    blurInput() { 
    	setTimeout(function() {
			this.appFocus = false; 
		}.bind(this), 500);  
    }
    setApp(app: any) {
    	this.setConfig.emit(app);
    }
}
