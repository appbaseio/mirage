import { OnInit, OnChanges, Component, Input, Output, ViewChild, EventEmitter, AfterViewInit } from "@angular/core";
import { Headers, Http } from '@angular/http';
import { AuthOperation } from '../subscribe/AuthOperation';
import { StorageService } from "../../shared/storage.service";

declare var $: any;

@Component({
	selector: 'learn-modal',
	templateUrl: './app/features/learn/learn.component.html',
	inputs: ['saveQuery', 'newQuery']
})

export class LearnModalComponent {
	
	constructor(private http: Http, public storageService: StorageService) {
		this.updateStatus = this.updateStatus.bind(this);
	}

	@Output() saveQuery = new EventEmitter();
	@Output() newQuery = new EventEmitter();
	public queries: any = [];
	public subscribeOption: string = "major";
	public profile: any = null;
	public serverAddress: string = 'https://ossauth.appbase.io';
	@ViewChild(AuthOperation) private authOperation: AuthOperation;

	loadLearn() {
		let self = this;
		this.http.get('./app/shared/default.data.json').toPromise().then(function(res) {
			let data = res.json();
			data.queries.forEach((query) => {
				self.saveQuery.emit(query);
			});
			setTimeout(function() {
				self.newQuery.emit(data.queries[0]);
			}, 500);
			$('#learnModal').modal('hide');
			$('#learnInfoModal').modal('show');
		}).catch(function(e) {
			console.log(e);
		});
	}

	updateStatus(info: any) {
		this.profile = info.profile;
	}

	subscribe() {
		this.authOperation.login(this.subscribeOption);
	}
}
