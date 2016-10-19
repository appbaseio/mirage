import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from "@angular/core";

@Component({
    selector: 'geo-distance-range-query',
    template:   `<span class="col-xs-6 pd-0">
                    <div class="col-xs-6 pl-0">
                        <div class="form-group form-element">
                            <input type="text" class="form-control col-xs-12"
                                [(ngModel)]="inputs.from.value"
                                placeholder="{{inputs.from.placeholder}}"
                                (keyup)="getFormat();" />
                        </div>
                    </div>
                    <div class="col-xs-6 pl-0">
                        <div class="form-group form-element">
                            <input type="text" class="form-control col-xs-12"
                                [(ngModel)]="inputs.to.value"
                                placeholder="{{inputs.to.placeholder}}"
                                (keyup)="getFormat();" />
                        </div>
                    </div>
                    <div class="col-xs-6 pl-0">
                        <div class="form-group form-element">
                            <input type="text" class="form-control col-xs-12"
                                [(ngModel)]="inputs.lat.value"
                                placeholder="{{inputs.lat.placeholder}}"
                                (keyup)="getFormat();" />
                        </div>
                    </div>
                    <div class="col-xs-6 pr-0">
                        <div class="form-group form-element">
                            <input type="text" class="form-control col-xs-12"
                                [(ngModel)]="inputs.lon.value"
                                placeholder="{{inputs.lon.placeholder}}"
                                (keyup)="getFormat();" />
                        </div>
                    </div>
                </span>
                `,
    inputs: ['getQueryFormat', 'querySelector']
})

export class GeoDistanceRangeQuery implements OnInit, OnChanges {
    @Input() queryList;
    @Input() selectedField;
    @Input() appliedQuery;
    @Input() selectedQuery;
    @Output() getQueryFormat = new EventEmitter<any>();
    public queryName = '*';
    public fieldName = '*';
    public current_query = 'geo_distance_range';
    public information: any = {
        title: 'Geo Distance Range Query',
        content: `<span class="description">Filters documents that exists within a range from a specific geo point.</span>
                    <a class="link" href="https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-geo-distance-range-query.html">Read more</a>`
    };
    public singleOption = {
        name: '',
        value: ''
    };
    public inputs: any = {
        lat: {
            placeholder: 'Latitude',
            value: ''
        },
        lon: {
            placeholder: 'Longitude',
            value: ''
        },
        from: {
            placeholder: 'From (with unit)',
            value: ''
        },
        to: {
            placeholder: 'To (with unit)',
            value: ''
        }
    };
    public queryFormat: any = {};

    ngOnInit() {
        try {
            if(this.appliedQuery[this.current_query][this.fieldName]['lat']) {
                this.inputs.lat.value = this.appliedQuery[this.current_query][this.fieldName]['lat'];
            }
            if(this.appliedQuery[this.current_query][this.fieldName]['lon']) {
                this.inputs.lon.value = this.appliedQuery[this.current_query][this.fieldName]['lon'];
            }
            if(this.appliedQuery[this.current_query][this.fieldName]['from']) {
                this.inputs.from.value = this.appliedQuery[this.current_query][this.fieldName]['from'];
            }
            if(this.appliedQuery[this.current_query][this.fieldName]['to']) {
                this.inputs.to.value = this.appliedQuery[this.current_query][this.fieldName]['to'];
            }
            for (let option in this.appliedQuery[this.current_query][this.fieldName]) {
                if (option != 'lat' && option != 'lon' && option != 'from' && option != 'to') {
                    var obj = {
                        name: option,
                        value: this.appliedQuery[this.current_query][this.fieldName][option]
                    };
                    this.optionRows.push(obj);
                }
            }
        } catch(e) {}
        this.getFormat();
    }

    ngOnChanges() {
        if(this.selectedField != '') {
            if(this.selectedField !== this.fieldName) {
                this.fieldName = this.selectedField;
                this.getFormat();
            }
        }
        if(this.selectedQuery != '') {
            if(this.selectedQuery !== this.queryName) {
                this.queryName = this.selectedQuery;
                this.optionRows = [];
                this.getFormat();
            }
        }
    }
    
    getFormat() {
        if (this.queryName === this.current_query) {
            this.queryFormat = this.setFormat();
            this.getQueryFormat.emit(this.queryFormat);
        }
    }
    
    setFormat() {
        var queryFormat = {
            [this.queryName]: {
                [this.fieldName]: {
                    lat: this.inputs.lat.value,
                    lon: this.inputs.lon.value
                },
                from: this.inputs.from.value,
                to: this.inputs.to.value
            }
        };
        return queryFormat;
    }
}
