import { Component, OnInit } from "@angular/core";
import { prettyJson } from "../shared/pipes/prettyJson";
declare var $: any;

@Component({
	selector: 'query-run',
	templateUrl: './app/run/run.component.html',
	inputs: ['mapping', 'config', 'responseHookHelp', 'result_time_taken'],
	pipes: [prettyJson]
})

export class RunComponent implements OnInit {
	public mapping: any;
	public config: any;
	public responseHookHelp: any;

	ngOnInit() {
		this.responseHookHelp.applyEditor({ readOnly: true });
		var modal_height = $(window).height() - 250;
		$('.result_block .codemirror').css({ height: modal_height });
	}
}
