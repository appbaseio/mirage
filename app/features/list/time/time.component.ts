import { Component, OnInit, OnChanges, SimpleChange, Input, Output, EventEmitter } from "@angular/core";
import { prettyTime } from "../../../shared/pipes/prettyTime";

@Component({
	selector: 'time-relative',
	template: `<span class="query-time">
					{{time | prettyTime}}
				</span>`,
	inputs: ['time'],
	pipes: [prettyTime]
})

export class TimeComponent implements OnInit, OnChanges {
	@Input() time: any;
	ngOnInit() {
		this.setTimeInterval();	
	}
	ngOnChanges() {}

	setTimeInterval() {
		setInterval(function() {
			this.time = this.time;
		}.bind(this), 1000*60);
	}
}
