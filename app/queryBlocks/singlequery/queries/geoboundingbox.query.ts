import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from "@angular/core";

@Component({
    selector: 'geo-bounding-box-query',
    template:   `<span class="col-xs-6 pd-0">
                    <div class="col-xs-3 pl-0">
                        <div class="form-group form-element">
                            <input type="text" class="form-control col-xs-12"
                                [(ngModel)]="inputs.top_left_lat.value"
                                placeholder="{{inputs.top_left_lat.placeholder}}"
                                (keyup)="getFormat();" />
                        </div>
                    </div>
                    <div class="col-xs-3 pr-0">
                        <div class="form-group form-element">
                            <input type="text" class="form-control col-xs-12"
                                [(ngModel)]="inputs.top_left_lon.value"
                                placeholder="{{inputs.top_left_lon.placeholder}}"
                                (keyup)="getFormat();" />
                        </div>
                    </div>
                     <div class="col-xs-3 pl-0">
                        <div class="form-group form-element">
                            <input type="text" class="form-control col-xs-12"
                                [(ngModel)]="inputs.bottom_right_lat.value"
                                placeholder="{{inputs.bottom_right_lat.placeholder}}"
                                (keyup)="getFormat();" />
                        </div>
                    </div>
                    <div class="col-xs-3 pr-0">
                        <div class="form-group form-element">
                            <input type="text" class="form-control col-xs-12"
                                [(ngModel)]="inputs.bottom_right_lon.value"
                                placeholder="{{inputs.bottom_right_lon.placeholder}}"
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

export class GeoBoundingBoxQuery implements OnInit, OnChanges {
    @Input() queryList;
    @Input() selectedField;
    @Input() appliedQuery;
    @Input() selectedQuery;
    @Output() getQueryFormat = new EventEmitter<any>();
    public queryName = '*';
    public fieldName = '*';
    public current_query = 'geo_bounding_box';
    public information: any = {
        title: 'Geo Bounding Box Query',
        content: `<span class="description">Returns matches within a bounding box area. Specified with <i>top left</i> and <i>bottom right</i> (lat, long) values.</span>
                    <a class="link" href="https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-geo-bounding-box-query.html#query-dsl-geo-bounding-box-query">Read more</a>`
    };
    public informationList: any = {
        '_name': {
            title: '_name',
            content: `<span class="description">Optional name field to identify the query.</span>`
        },
        'ignore_malformed': {
            title: 'ignore_malformed',
            content: `<span class="description">Set to <strong>true</strong> to accept geo points with invalid latitude or longitude (default is false).</span>`
        },
        'type': {
            title: 'type',
            content: `<span class="description">Set to <strong>memory</strong> if the query will be executed in memory, otherwise set to <strong>indexed</strong>.</span>`
        }
    };
    public default_options: any = [
        '_name',
        'ignore_malformed',
        'type'
    ];
    public options: any;
    public singleOption = {
        name: '',
        value: ''
    };
    public optionRows: any = [];
    public inputs: any = {
        top_left_lat: {
            placeholder: 'TL_latitude',
            value: ''
        },
        top_left_lon: {
            placeholder: 'TL_longitude',
            value: ''
        },
        bottom_right_lat: {
            placeholder: 'BR_latitude',
            value: ''
        },
        bottom_right_lon: {
            placeholder: 'BR_longitude',
            value: ''
        }
    };
    public queryFormat: any = {};

    ngOnInit() {
        this.options = JSON.parse(JSON.stringify(this.default_options));
        try {
            if(this.appliedQuery[this.current_query][this.fieldName]['top_left']['lat']) {
                this.inputs.top_left_lat.value = this.appliedQuery[this.current_query][this.fieldName]['top_left']['lat'];
            }
            if(this.appliedQuery[this.current_query][this.fieldName]['top_left']['lon']) {
                this.inputs.top_left_lon.value = this.appliedQuery[this.current_query][this.fieldName]['top_left']['lon'];
            }
            if(this.appliedQuery[this.current_query][this.fieldName]['bottom_right']['lat']) {
                this.inputs.bottom_right_lat.value = this.appliedQuery[this.current_query][this.fieldName]['bottom_right']['lat'];
            }
            if(this.appliedQuery[this.current_query][this.fieldName]['bottom_right']['lon']) {
                this.inputs.bottom_right_lon.value = this.appliedQuery[this.current_query][this.fieldName]['bottom_right']['lon'];
            }
            for (let option in this.appliedQuery[this.current_query][this.fieldName]) {
                if (option != 'top_left' && option != 'bottom_right') {
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
                    top_left: {
                        lat: this.inputs.top_left_lat.value,
                        lon: this.inputs.top_left_lon.value
                    },
                    bottom_right: {
                        lat: this.inputs.bottom_right_lat.value,
                        lon: this.inputs.bottom_right_lon.value
                    }
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
