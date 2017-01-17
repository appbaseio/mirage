import { Component, OnInit, OnChanges } from "@angular/core";
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
declare var $: any;

@Component({
	selector: 'query-result',
	templateUrl: './app/result/result.component.html',
	inputs: ['mapping', 'config', 'editorHookHelp', 'urlShare', 'responseHookHelp', 'result_time_taken', 'types', 'selectedTypes', 'result', 'config', 'responseHookHelp', 'result_time_taken']
})

export class ResultComponent implements OnInit, OnChanges {
	public mapping: any;
	public config: any;
	public responseHookHelp: any;
	public url: SafeResourceUrl;
	public urlShare: any;
	public editorHookHelp: any;
	public urlAvailable: boolean = false;
	
	constructor(private sanitizer: DomSanitizer) {}

	ngOnInit() {
		this.responseHookHelp.applyEditor({ readOnly: true });
	}

	ngOnChanges(changes) {
		if(changes && changes['result_time_taken']) {
			var prev = changes['result_time_taken'].previousValue;
			var current = changes['result_time_taken'].currentValue;
			if(current && prev !== current && this.editorHookHelp) {
				var getQuery = this.editorHookHelp.getValue();
				if(getQuery) {
					getQuery = getQuery.trim();
					getQuery = JSON.stringify(JSON.parse(getQuery));
					var url = 'http://localhost:1358/#?input_state='+this.urlShare.url;
					url = url+'&hf=false&sidebar=false&query='+getQuery;
					this.url = this.sanitizeUrl(url);
					this.urlAvailable = true;
				}
			}
		}
	}

	sanitizeUrl(url) {
		return this.sanitizer.bypassSecurityTrustResourceUrl(url);
	}

}
