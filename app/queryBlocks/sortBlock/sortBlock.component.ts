import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from "@angular/core";
declare var $: any;

@Component({
    selector: 'sort-block',
    templateUrl: './app/queryBlocks/sortBlock/sortBlock.component.html',
    inputs: ['config', 'query', 'queryList', 'addQuery', 'removeQuery', 'addBoolQuery', 'queryFormat', 'buildQuery', 'buildInsideQuery', 'buildSubQuery', 'createQuery', 'setQueryFormat', 'editorHookHelp', 'urlShare', 'setDocSample']
})

export class SortBlockComponent implements OnInit, OnChanges {
    public config: Object;
    public queryList: any = this.queryList;
    public addQuery: any;
    public addBoolQuery: any;
    public removeQuery: any;
    public removeArray: any = [];
    public query: any = this.query;
    public buildQuery: any;
    public allFields: any = [];
    public modeList: any = [
        'min',
        'max',
        'sum',
        'avg',
        'median'
    ];

    public informationList: any = {
        'min': {
            title: 'min',
            content: `<span class="description">Pick the lowest value.</span>`
        },
        'max': {
            title: 'max',
            content: `<span class="description">Pick the highest value.</span>`
        },
        'sum': {
            title: 'sum',
            content: `<span class="description">Use the sum of all values as sort value. Only applicable for number based array fields.</span>`
        },
        'avg': {
            title: 'avg',
            content: `<span class="description">Use the average of all values as sort value. Only applicable for number based array fields.</span>`
        },
        'median': {
            title: 'median',
            content: `<span class="description">Use the median of all values as sort value. Only applicable for number based array fields.</span>`
        }
    };
    public optionalParamsInformation: any = {
        'mode': {
            title: 'mode',
            content: `<span class="description">The mode option controls what array value is picked for sorting the document it belongs to.</span>`
        },
        'missing': {
            title: 'missing',
            content: `<span class="description">The missing parameter specifies how docs which are missing the field should be treated. The value can be set to _last, _first, or a custom value.</span>`
        },
        'unmapped_type': {
            title: 'unmapped_type',
            content: `<span class="description">unmapped_type option allows to ignore fields that have no mapping and not sort by them. The value of this parameter is used to determine what sort values to emit.</span>`
        },
        'nested': {
            title: 'nested',
            content: `<span class="description">Allows sorting withing nested objects</span>`
        },
        'geo_distance': {
            title: 'geo_distance',
            content: `<span class="description">Allow to sort by _geo_distance.</span>`
        }
    };

    @Input() mapping: any;
    @Input() types: any;
    @Input() selectedTypes: any;
    @Input() result: any;
    @Input() joiningQuery: any = [''];
    @Input() joiningQueryParam: any;
    
    ngOnInit() {
        if (this.result.resultQuery.hasOwnProperty('availableFields')) {
            this.allFields = this.result.resultQuery.availableFields.map((ele: any) => {
                return ele.name;
            });
        }
    }

    ngOnChanges() {
        if (this.result.resultQuery.hasOwnProperty('availableFields')) {
            this.allFields = this.result.resultQuery.availableFields.map((ele: any) => {
                return ele.name;
            });
        }
    }
    
    exeBuild() {
        setTimeout(() => this.buildQuery(), 300);
    }

    initSort() {
        let sortObj = {
            'selectedField': '',
            'order': 'desc',
            'availableOptionalParams': [
                'mode',
                'missing',
                'unmapped_type'
            ]
        }
        this.result.sort.push(sortObj);
        this.exeBuild();
    }

    deleteSort() {
        this.result.sort = [];
        this.exeBuild();
    }

    sortFieldCallback(input: any) {
        this.result.sort[input.external].selectedField = input.val;
        this.exeBuild();
    }

    sortModeCallback(input: any) {
        this.result.sort[input.external].mode = input.val;
        this.exeBuild();
    }

    sortOptionalCallback(input: any) {
        let obj = this.result.sort[input.external];
        let index = obj.availableOptionalParams.indexOf(input.val);
        if (index > -1) {
            obj.availableOptionalParams.splice(index, 1);
        }
        obj[input.val] = '';
    }

    setSortOrder(order, index) {
        this.result.sort[index].order = order;
        this.exeBuild();
    }

    removeSortQuery(index: any) {
        this.result.sort.splice(index, 1);
        this.exeBuild();
    }

    show_hidden_btns(event: any) {
        $('.bool_query').removeClass('show_hidden');
        $(event.currentTarget).addClass('show_hidden');
        event.stopPropagation();
    }

    hide_hidden_btns() {
        $('.bool_query').removeClass('show_hidden');
    }
}
