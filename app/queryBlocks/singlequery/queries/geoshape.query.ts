import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from "@angular/core";

@Component({
    selector: 'geo-shape-query',
    template:   `<span class="col-xs-6 pd-0">
                    <div class="col-xs-6 pl-0">
                        <div class="form-group form-element">
                            <input type="text" class="form-control col-xs-12"
                                [(ngModel)]="inputs.type.value"
                                placeholder="{{inputs.type.placeholder}}"
                                (keyup)="getFormat();" />
                        </div>
                    </div>
                    <div class="col-xs-6 pr-0">
                        <div class="form-group form-element">
                            <input type="text" class="form-control col-xs-12"
                                [(ngModel)]="inputs.coordinates.value"
                                placeholder="{{inputs.coordinates.placeholder}}"
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

export class GeoShapeQuery implements OnInit, OnChanges {
    @Input() queryList;
    @Input() selectedField;
    @Input() appliedQuery;
    @Input() selectedQuery;
    @Output() getQueryFormat = new EventEmitter<any>();
    public queryName = '*';
    public fieldName = '*';
    public current_query = 'geo_shape';
    public information: any = {
        title: 'Geo Shape Query',
        content: `<span class="description">Return matches that have a shape that relates with the query shape. A relation can be an intersection, subset, superset, or a disjoint.</span>
                    <a class="link" href="https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-geo-shape-query.html#query-dsl-geo-shape-query">Read more</a>`
    };
    public informationList: any = {
        'relation': {
            title: 'relation',
            content: `<span class="description">Defines the relation to match for, can be one of <strong>intersects</strong>, <strong>disjoint</strong>, <strong>within</strong> or <strong>contains</strong>.</span>`
        }
    };
    public default_options: any = [
        'relation'
    ];
    public options: any;
    public singleOption = {
        name: '',
        value: ''
    };
    public optionRows: any = [];
    public inputs: any = {
        type: {
            placeholder: 'Type',
            value: ''
        },
        coordinates: {
            placeholder: 'Pass an Array',
            value: ''
        }
    };
    public queryFormat: any = {};

    ngOnInit() {
        this.options = JSON.parse(JSON.stringify(this.default_options));
        try {
            if(this.appliedQuery[this.current_query][this.fieldName]['shape']['type']) {
                this.inputs.type.value = this.appliedQuery[this.current_query][this.fieldName]['shape']['type'];
            }
            if(this.appliedQuery[this.current_query][this.fieldName]['shape']['coordinates']) {
                this.inputs.coordinates.value = this.appliedQuery[this.current_query][this.fieldName]['shape']['coordinates'];
            }
            for (let option in this.appliedQuery[this.current_query][this.fieldName]) {
                if (option != 'shape') {
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
        var coordinates =  this.inputs.coordinates.value;
        try {
            coordinates = JSON.parse(coordinates);
        } catch(e) {}
        var queryFormat = {
            [this.queryName]: {
                [this.fieldName]: {
                    shape: {
                        type: this.inputs.type.value,
                        coordinates: coordinates
                    }
                }
            }
        };
        this.optionRows.forEach(function(singleRow: any) {
            queryFormat[this.queryName][this.fieldName][singleRow.name] = singleRow.value;
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
