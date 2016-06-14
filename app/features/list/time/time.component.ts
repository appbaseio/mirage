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

	setTimeInterval(flag: boolean) {
		this.time = flag ? this.time+1 : this.time-1;
		flag = flag ? false : true;
		setTimeout(function() {
			this.setTimeInterval(flag);
		}.bind(this), 1000*60);
	}
}
