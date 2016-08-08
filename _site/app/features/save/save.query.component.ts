import { Component, OnChanges, SimpleChange } from "@angular/core";
import { StorageService } from "../../shared/storage.service";
declare var $: any;

@Component({
	selector: 'save-query',
	templateUrl: './app/features/save/save.query.component.html',
	inputs: ['config', 'mapping', 'queryList'],
	providers: [StorageService]
})

export class SaveQueryComponent {
	public config;
	public mapping;
	public queryList;
	public query_info = {
		name: '',
		tag: ''
	};

	constructor(public storageService: StorageService) {}

	openModal() {
		$('#saveQueryModal').modal('show');
	}

	save() {
		var queryData = {
			mapping: this.mapping,
			config: this.config,
			name: this.query_info.name,
			tag: this.query_info.tag
		};
		this.queryList.push(queryData);
		try {
			this.storageService.set('queryList', JSON.stringify(this.queryList));
		} catch (e) {}
		console.log(this.queryList);
	}
}
