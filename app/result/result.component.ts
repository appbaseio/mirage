import { Component, OnInit } from "@angular/core";
declare var $: any;

@Component({
	selector: 'query-result',
	templateUrl: './app/result/result.component.html',
	inputs: ['mapping', 'config', 'responseHookHelp', 'result_time_taken', 'types', 'selectedTypes', 'result', 'config', 'responseHookHelp', 'result_time_taken']
})

export class ResultComponent implements OnInit {
	public mapping: any;
	public config: any;
	public responseHookHelp: any;

	ngOnInit() {
		this.responseHookHelp.applyEditor({ readOnly: true });
	}
}
