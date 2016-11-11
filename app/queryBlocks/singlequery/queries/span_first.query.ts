import { Component, OnInit, OnChanges, Input, Output, EventEmitter, ViewChild, SimpleChange } from "@angular/core";

@Component({
    selector: 'span-first-query',
    template: `<span class="col-xs-6 pd-10">
                    <div class="form-group form-element query-primary-input">
                        <span class="input_with_option">
                            <input type="text" class="form-control col-xs-12"
                                [(ngModel)]="inputs.input.value"
                                placeholder="{{inputs.input.placeholder}}"
                                (keyup)="getFormat();" />
                        </span>
                    </div>
                    <div class="form-group form-element query-primary-input">
                        <span class="input_with_option">
                            <input type="text" class="form-control col-xs-12"
                                [(ngModel)]="inputs.end.value"
                                placeholder="{{inputs.end.placeholder}}"
                                (keyup)="getFormat();" />
                        </span>
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

export class SpanFirstQuery implements OnInit, OnChanges {
    // Initialize the variables
    @Input() queryList;
    @Input() selectedField;
    @Input() appliedQuery;
    @Input() selectedQuery;
    @Output() getQueryFormat = new EventEmitter<any>();
    public queryName = '*';
    public fieldName = '*';
    public current_query = 'span_first';

    public information: any = {
        title: 'Span First',
        content: `<span class="description">Matches spans near the beginning of a field. The span first query maps to Lucene SpanFirstQuery.</span>
                    <a class="link" href="https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-span-first-query.html#query-dsl-span-first-query">Read more</a>`
    };
    public informationList: any = {
        'boost': {
            title: 'boost',
            content: `<span class="description">Sets the boost value of the query, defaults to <strong>1.0</strong></span>`
        }
    };
    public default_options: any = [
        'boost'
    ];
    public options: any;
    public singleOption = {
        name: '',
        value: ''
    };
    public optionRows: any = [];

    constructor() {}

    public inputs: any = {
        input: {
            placeholder: 'Input',
            value: ''
        },
        end: {
            placeholder: 'End',
            value: ''
        }
    };
    public queryFormat: any = {};

    ngOnInit() {
        this.options = JSON.parse(JSON.stringify(this.default_options));
        try {
            if (this.appliedQuery[this.current_query]['match']['span_term'][this.selectedField]) {
                this.inputs.input.value = this.appliedQuery[this.current_query]['match']['span_term'][this.fieldName].value;
                this.inputs.end.value = this.appliedQuery[this.current_query].end;
                for (let option in this.appliedQuery[this.current_query][this.fieldName]) {
                    if (option != 'value') {
                        var obj = {
                            name: option,
                            value: this.appliedQuery[this.current_query][this.fieldName][option]
                        };
                        this.optionRows.push(obj);
                    }
                }
            }
        } catch (e) {}
        this.getFormat();
        this.filterOptions();
    }

    ngOnChanges() {
        if (this.selectedField != '') {
            if (this.selectedField !== this.fieldName) {
                this.fieldName = this.selectedField;
                this.getFormat();
            }
        }
        if (this.selectedQuery != '') {
            if (this.selectedQuery !== this.queryName) {
                this.queryName = this.selectedQuery;
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
            'match': {
                'span_term': {
                    [this.fieldName]: {}
                }
            }
        };
        if (this.optionRows.length) {
            queryFormat[this.queryName]['match']['span_term'][this.fieldName]['value'] = this.inputs.input.value;
            queryFormat[this.queryName]['end'] = this.inputs.end.value;
            this.optionRows.forEach(function(singleRow: any) {
                queryFormat[this.queryName]['match']['span_term'][this.fieldName][singleRow.name] = singleRow.value
            }.bind(this))
        } else {
            queryFormat[this.queryName]['match']['span_term'][this.fieldName]['value'] = this.inputs.input.value;
            queryFormat[this.queryName]['end'] = this.inputs.end.value;
        }
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
