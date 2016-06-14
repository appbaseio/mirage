import { Component, OnChanges, SimpleChange, Input, Output, EventEmitter } from "@angular/core";

@Component({
	selector: 'types',
	templateUrl: './app/build/types/types.component.html',
	inputs: ['mapping', 'types', 'selectedTypes', 'result', 'config', 'detectChange', 'finalUrl', 'setFinalUrl', 'urlShare']
})

export class TypesComponent implements OnChanges {
	@Input() mapping: any;
	@Input() config: any;
	@Input() types: any;
	@Input() selectedTypes: any;
	@Input() result: any;
	@Input() finalUrl: string;
	@Input() urlShare: any;
	@Output() setFinalUrl = new EventEmitter < any > ();

	constructor() {}

	ngOnChanges(changes: {
		[propertyName: string]: SimpleChange
	}) {
		if (changes['detectChange'] && this.types.length) {
			var setType = $('#setType');
			try {
				setType.select2('destroy').html('');
			} catch (e) {}
			setType.select2({
				placeholder: "Select types to apply query",
				tags: false,
				data: this.createTokenData(this.types)
			});
			setType.on("change", function(e) {
				this.changeType(setType.val());
			}.bind(this));
		}
	}

	createTokenData(types) {
		var data = [];
		types.forEach(function(val) {
			var obj = {
				id: val,
				text: val
			};
			data.push(obj);
		});
		return data;
	}

	changeType(val) {
		//this.mapping.resultQuery.result = [];
		this.selectedTypes = val;
		var availableFields: any = [];
		if (val && val.length) {
			val.forEach(function(type: any) {
				var mapObj = this.mapping[this.config.appname].mappings[type].properties;
				for (var field in mapObj) {
					var index = typeof mapObj[field]['index'] != 'undefined' ? mapObj[field]['index'] : null;
					var obj = {
						name: field,
						type: mapObj[field]['type'],
						index: index
					}
					switch (obj.type) {
						case 'long':
						case 'integer':
						case 'short':
						case 'byte':
						case 'double':
						case 'float':
							obj.type = 'numeric';
							break;
					}
					availableFields.push(obj);
				}
			}.bind(this));
			this.setUrl();

			//set input state
			this.urlShare.inputs['selectedTypes'] = this.selectedTypes;
			this.urlShare.createUrl();
		}
		console.log(availableFields);
		this.result.resultQuery.availableFields = availableFields;
	}

	setUrl() {
		var selectedTypes = this.selectedTypes;
		var finalUrl = this.finalUrl.split('/');
		var lastUrl = '';
		if (finalUrl.length > 4) {
			finalUrl[4] = this.selectedTypes.join(',');
			lastUrl = finalUrl.join('/');
		} else {
			lastUrl = this.finalUrl + '/' + this.selectedTypes.join(',') + '/_search';
		}
		this.setFinalUrl.emit(lastUrl);
	}

}
