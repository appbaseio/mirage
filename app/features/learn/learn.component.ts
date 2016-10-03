import { OnInit, OnChanges, Component, Input, Output, EventEmitter, AfterViewInit } from "@angular/core";
import { Headers, Http } from '@angular/http';

declare var $: any;

@Component({
	selector: 'learn-modal',
	templateUrl: './app/features/learn/learn.component.html',
	inputs: ['saveQuery', 'newQuery'],
	directives: []
})

export class LearnModalComponent  implements OnInit, AfterViewInit {
	constructor(private http: Http) {}

	ngAfterViewInit() {
		$('#learnModal').on('shown.bs.modal', this.loadHunt);
	}

	loadHunt() {
		if(!$('.embedph').hasClass('added')) {
			var hunt = $('<script>').attr({
				id: "embedhunt-77987",
				class: "embedhunt-async-script-loader"
			});
			$('.embedph').addClass('added').html(hunt);
			var s = document.createElement('script');
		    s.type = 'text/javascript';
		    s.async = true;
		    var theUrl = '//embedhunt.com/products/77987/widget';
		    s.src = theUrl; 
		    var embedder = document.getElementById('embedhunt-77987');
		    embedder.parentNode.insertBefore(s, embedder);
	    }
	}

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
			}, 500);
			$('#learnModal').modal('hide');
			$('#learnInfoModal').modal('show');
		}).catch(function(e) {
			console.log(e);
		});
	}
}
