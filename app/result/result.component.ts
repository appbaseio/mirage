import { Component, OnInit } from "@angular/core";
import { prettyJson } from "../shared/pipes/prettyJson";
declare var $: any;

@Component({
	selector: 'query-result',
	templateUrl: './app/result/result.component.html',
	inputs: ['mapping', 'config', 'responseHookHelp', 'result_time_taken'],
	pipes: [prettyJson]
})

export class ResultComponent implements OnInit {
	public mapping: any;
	public config: any;
	public responseHookHelp: any;

	ngOnInit() {
		this.responseHookHelp.applyEditor({ readOnly: true });
	}
}
