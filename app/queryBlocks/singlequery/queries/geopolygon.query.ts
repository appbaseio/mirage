import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from "@angular/core";

@Component({
    selector: 'geo-polygon-query',
    template:   `<span class="col-xs-6 pd-0">
                    <div class="col-xs-3 pl-0">
                        <div class="form-group form-element">
                            <input type="text" class="form-control col-xs-12"
                                [(ngModel)]="inputs.point1_lat.value"
                                placeholder="{{inputs.point1_lat.placeholder}}"
                                (keyup)="getFormat();" />
                        </div>
                    </div>
                    <div class="col-xs-3 pr-0">
                        <div class="form-group form-element">
                            <input type="text" class="form-control col-xs-12"
                                [(ngModel)]="inputs.point1_lon.value"
                                placeholder="{{inputs.point1_lon.placeholder}}"
                                (keyup)="getFormat();" />
                        </div>
                    </div>
                     <div class="col-xs-3 pl-0">
                        <div class="form-group form-element">
                            <input type="text" class="form-control col-xs-12"
                                [(ngModel)]="inputs.point2_lat.value"
                                placeholder="{{inputs.point2_lat.placeholder}}"
                                (keyup)="getFormat();" />
                        </div>
                    </div>
                    <div class="col-xs-3 pr-0">
                        <div class="form-group form-element">
                            <input type="text" class="form-control col-xs-12"
                                [(ngModel)]="inputs.point2_lon.value"
                                placeholder="{{inputs.point2_lon.placeholder}}"
                                (keyup)="getFormat();" />
                        </div>
                    </div>

                     <div class="col-xs-3 pl-0">
                        <div class="form-group form-element">
                            <input type="text" class="form-control col-xs-12"
                                [(ngModel)]="inputs.point3_lat.value"
                                placeholder="{{inputs.point3_lat.placeholder}}"
                                (keyup)="getFormat();" />
                        </div>
                    </div>
                    <div class="col-xs-3 pr-0">
                        <div class="form-group form-element">
                            <input type="text" class="form-control col-xs-12"
                                [(ngModel)]="inputs.point3_lon.value"
                                placeholder="{{inputs.point3_lon.placeholder}}"
                                (keyup)="getFormat();" />
                        </div>
                    </div>
                    <button (click)="addOption();" class="btn btn-info btn-xs add-option"> <i class="fa fa-plus"></i> </button>
                </span>
                <div class="col-xs-12 option-container" *ngIf="optionRows.length">
                    <div class="col-xs-12 single-option" *ngFor="let singleOption of optionRows, let i=index">
                        <div class="col-xs-6 pd-l0">
                            <editable
                                class = "additional-option-select-{{i}}"
                                [editableField]="singleOption.name"
                                [editPlaceholder]="'--choose option--'"
                                [editableInput]="'select2'"
                                [selectOption]="options"
                                [passWithCallback]="i"
                                [selector]="'additional-option-select'"
                                [querySelector]="querySelector"
                                [informationList]="informationList"
                                [showInfoFlag]="true"
                                [searchOff]="true"
                                (callback)="selectOption($event)">
                            </editable>
                        </div>
                        <div class="col-xs-6 pd-0">
                            <div class="form-group form-element">
                                <input class="form-control col-xs-12 pd-0" type="text" [(ngModel)]="singleOption.value" placeholder="value"  (keyup)="getFormat();"/>
                            </div>
                        </div>
                        <button (click)="removeOption(i)" class="btn btn-grey delete-option btn-xs">
                            <i class="fa fa-times"></i>
                        </button>
                    </div>
                </div>`,
    inputs: ['getQueryFormat', 'querySelector']
})

export class GeoPolygonQuery implements OnInit, OnChanges {
    @Input() queryList;
    @Input() selectedField;
    @Input() appliedQuery;
    @Input() selectedQuery;
    @Output() getQueryFormat = new EventEmitter<any>();
    public queryName = '*';
    public fieldName = '*';
    public current_query = 'geo_polygon';
    public information: any = {
        title: 'Geo Polygon Query',
        content: `<span class="description">A query allowing to include hits that only fall within a polygon of points.</span>
                    <a class="link" href="https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-geo-polygon-query.html">Read more</a>`
    };
    public informationList: any = {
        '_name': {
            title: '_name',
            content: `<span class="description">Optional name field to identify the query</span>`
        },
        'ignore_malformed': {
            title: 'ignore_malformed',
            content: `<span class="description">Set to true to accept geo points with invalid latitude or longitude (default is false).</span>`
        }
    };
    public default_options: any = [
        '_name',
        'ignore_malformed'
    ];
    public options: any;
    public singleOption = {
        name: '',
        value: ''
    };
    public optionRows: any = [];
    public inputs: any = {
        point1_lat: {
            placeholder: 'point1 Latitude',
            value: ''
        },
        point1_lon: {
            placeholder: 'point1 Longitude',
            value: ''
        },
        point2_lat: {
            placeholder: 'point2 Latitude',
            value: ''
        },
        point2_lon: {
            placeholder: 'point2 Longitude',
            value: ''
        },
        point3_lat: {
            placeholder: 'point3 Latitude',
            value: ''
        },
        point3_lon: {
            placeholder: 'point3 Longitude',
            value: ''
        }
    };
    public queryFormat: any = {};

    ngOnInit() {
        this.options = JSON.parse(JSON.stringify(this.default_options));
        try {
            if(this.appliedQuery[this.current_query][this.fieldName]['points'][0]['lat']) {
                this.inputs.point1_lat.value = this.appliedQuery[this.current_query][this.fieldName]['points'][0]['lat'];
            }
            if(this.appliedQuery[this.current_query][this.fieldName]['points'][0]['lon']) {
                this.inputs.point1_lon.value = this.appliedQuery[this.current_query][this.fieldName]['points'][0]['lon'];
            }
            if(this.appliedQuery[this.current_query][this.fieldName]['points'][1]['lat']) {
                this.inputs.point2_lat.value = this.appliedQuery[this.current_query][this.fieldName]['points'][1]['lat'];
            }
            if(this.appliedQuery[this.current_query][this.fieldName]['points'][1]['lon']) {
                this.inputs.point2_lon.value = this.appliedQuery[this.current_query][this.fieldName]['points'][1]['lon'];
            }
            if(this.appliedQuery[this.current_query][this.fieldName]['points'][2]['lat']) {
                this.inputs.point2_lat.value = this.appliedQuery[this.current_query][this.fieldName]['points'][2]['lat'];
            }
            if(this.appliedQuery[this.current_query][this.fieldName]['points'][2]['lon']) {
                this.inputs.point2_lon.value = this.appliedQuery[this.current_query][this.fieldName]['points'][2]['lon'];
            }
            for (let option in this.appliedQuery[this.current_query][this.fieldName]) {
                if (option != 'points') {
                    var obj = {
                        name: option,
                        value: this.appliedQuery[this.current_query][this.fieldName][option]
                    };
                    this.optionRows.push(obj);
                }
            }
        } catch(e) {}
        this.filterOptions();
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
                    points: [{
                        lat: this.inputs.point1_lat.value,
                        lon: this.inputs.point1_lon.value
                    }, {
                        lat: this.inputs.point2_lat.value,
                        lon: this.inputs.point2_lon.value
                    }, {
                        lat: this.inputs.point3_lat.value,
                        lon: this.inputs.point3_lon.value
                    }]
                }
            }
        };
        this.optionRows.forEach(function(singleRow: any) {
            queryFormat[this.queryName][singleRow.name] = singleRow.value;
        }.bind(this));
        return queryFormat;
    }

    selectOption(input: any) {
        input.selector.parents('.editable-pack').removeClass('on');
        this.optionRows[input.external].name = input.val;
        this.filterOptions();
        setTimeout(function() {
            this.getFormat();
        }.bind(this), 300);
    }

    filterOptions() {
        this.options = this.default_options.filter(function(opt) {
            var flag = true;
            this.optionRows.forEach(function(row) {
                if(row.name === opt) {
                    flag = false;
                }
            });
            return flag;
        }.bind(this));
    }

    addOption() {
        var singleOption = JSON.parse(JSON.stringify(this.singleOption));
        this.filterOptions();
        this.optionRows.push(singleOption);
    }

    removeOption(index: Number) {
        this.optionRows.splice(index, 1);
        this.filterOptions();
        this.getFormat();
    }
}
