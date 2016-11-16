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
            'mode': ''
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
