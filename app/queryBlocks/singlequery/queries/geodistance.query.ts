import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from "@angular/core";

@Component({
    selector: 'geo-distance-query',
    template:   `<span class="col-xs-6 pd-0">
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
                    <div class="col-xs-6 pl-0">
                        <div class="form-group form-element">
                            <input type="text" class="form-control col-xs-12"
                                [(ngModel)]="inputs.distance.value"
                                placeholder="{{inputs.distance.placeholder}}"
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

export class GeoDistanceQuery implements OnInit, OnChanges {
    @Input() queryList;
    @Input() selectedField;
    @Input() appliedQuery;
    @Input() selectedQuery;
    @Output() getQueryFormat = new EventEmitter<any>();
    public queryName = '*';
    public fieldName = '*';
    public current_query = 'geo_distance';
    public information: any = {
        title: 'Geo Distance Query',
        content: `<span class="description">Returns matches within a specific distance from a geo-point field.</span>
                    <a class="link" href="https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-geo-distance-query.html#query-dsl-geo-distance-query">Read more</a>`
    };
		public informationList: any = {
        'distance_type': {
            title: 'distance_type',
            content: `<span class="description">How to compute the distance. Can either be <strong>sloppy_arc</strong> (default), <strong>arc</strong>
                        (slightly more precise but significantly slower) or <strong>plane</strong> (faster, but inaccurate on long distances and close to the poles).</span>`
        },
        'optimize_bbox': {
            title: 'optimize_bbox',
            content: `<span class="description">Defaults to <strong>memory</strong> which will do in memory bounding box checks before the distance check. Can also have values of <strong>indexed</strong> to use indexed value check, or <strong>none</strong> which disables bounding box optimization.</span>`
        },
        '_name': {
            title: '_name',
            content: `<span class="description">Optional name field to identify the query.</span>`
        },
        'ignore_malformed': {
            title: 'ignore_malformed',
            content: `<span class="description">Set to <strong>true</strong> to accept geo points with invalid latitude or longitude (default is <strong>false</strong>).</span>`
        }
    };
    public default_options: any = [
        'distance_type',
        'optimize_bbox',
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
        lat: {
            placeholder: 'Latitude',
            value: ''
        },
        lon: {
            placeholder: 'Longitude',
            value: ''
        },
        distance: {
            placeholder: 'Distance (with unit)',
            value: ''
        }
    };
    public queryFormat: any = {};

    ngOnInit() {
        this.options = JSON.parse(JSON.stringify(this.default_options));
        try {
            if(this.appliedQuery[this.current_query][this.fieldName]['lat']) {
                this.inputs.lat.value = this.appliedQuery[this.current_query][this.fieldName]['lat'];
            }
            if(this.appliedQuery[this.current_query][this.fieldName]['lon']) {
                this.inputs.lon.value = this.appliedQuery[this.current_query][this.fieldName]['lon'];
            }
            if(this.appliedQuery[this.current_query][this.fieldName]['distance']) {
                this.inputs.distance.value = this.appliedQuery[this.current_query][this.fieldName]['distance'];
            }
            for (let option in this.appliedQuery[this.current_query][this.fieldName]) {
                if (option != 'lat' && option != 'lon' && option != 'distance') {
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
        var queryFormat = {};
        queryFormat[this.queryName] = {
            distance: this.inputs.distance.value,
        };
        queryFormat[this.queryName][this.fieldName] = {
            lat: this.inputs.lat.value,
            lon: this.inputs.lon.value
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
