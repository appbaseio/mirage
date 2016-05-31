import { Component, OnChanges, SimpleChange } from "@angular/core";

@Component({
	selector: 'types',
	templateUrl: './app/build/types/types.component.html',
	inputs: ['mapping', 'config', 'detectChange']
})

export class TypesComponent implements OnChanges {
	public mapping;
	public config;

	constructor() {}

	ngOnChanges(changes: {
		[propertyName: string]: SimpleChange
	}) {
		if (changes['detectChange'] && this.mapping.types.length) {
			var data = this.createTokenData(this.mapping.types);
			console.log(data);
			var setType = $('#setType');
			setType.select2({
				placeholder: "Select types to apply query",
				tags: false,
				data: data
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
		this.mapping.selectedTypes = val;
		var availableFields = [];
		val.forEach(function(type) {
			var mapObj = this.mapping.mapping[this.config.appname].mappings[type].properties;
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
		console.log(availableFields);
		this.mapping.resultQuery.availableFields = availableFields;
	}

}
