import { OnInit, OnChanges, Component, Input, Output, ViewChild, EventEmitter, AfterViewInit } from "@angular/core";
import { Headers, Http } from '@angular/http';
import { AuthOperation } from './AuthOperation';

declare var $: any;

@Component({
	selector: 'subscribe-modal',
	templateUrl: './app/features/subscribe/subscribe.component.html'
})

export class SubscribeModalComponent {
	public options: any = {
      option1: {
        value: 'major',
        text: 'New MIRAGE releases'
      },
      option2: {
        value: 'all',
        text: 'Limited major updates'
      }
    };
	public subscribeOption: string = "major";
	public profile: any = null;
	@ViewChild(AuthOperation) private authOperation: AuthOperation;

	constructor(private http: Http) {
		this.updateStatus = this.updateStatus.bind(this);
	}

	open() {
		$('#subscribeModal').modal('show');
	}

	updateStatus(info: any) {
		this.profile = info.profile;
	}

	subscribe() {
		this.authOperation.login(this.subscribeOption);
	}

}
