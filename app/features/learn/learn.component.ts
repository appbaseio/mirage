import { Component, Input, Output, EventEmitter } from "@angular/core";
import { Headers, Http } from '@angular/http';

declare var $: any;

@Component({
	selector: 'learn-modal',
	templateUrl: './app/features/learn/learn.component.html',
	inputs: ['saveQuery', 'newQuery'],
	directives: []
})

export class LearnModalComponent {
	constructor(private http: Http) {}

	@Output() saveQuery = new EventEmitter();
	@Output() newQuery = new EventEmitter();
	public queries: any = [];

	loadLearn() {
		let self = this;
		this.http.get('./app/shared/default.data.json').toPromise().then(function(res) {
			let data = res.json();
			data.queries.forEach((query) => {
				self.saveQuery.emit(query);
			});
			setTimeout(function() {
				self.newQuery.emit(data.queries[0]);
			}, 1000*2);
			$('#learnModal').modal('hide');
			$('#learnInfoModal').modal('show');
		}).catch(function(e) {
			console.log(e);
		});
	}
}
