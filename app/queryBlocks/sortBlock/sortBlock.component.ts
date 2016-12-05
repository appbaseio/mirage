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
    public distanceTypeList: any = [
        'sloppy_arc',
        'arc',
        'plane'
    ]

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
            content: `<span class="description">The mode option controls what array value is picked for sorting the document it belongs to.</span>
                        <a class="link" href="https://www.elastic.co/guide/en/elasticsearch/reference/current/search-request-sort.html#_sort_mode_option">Read more</a>`
        },
        'missing': {
            title: 'missing',
            content: `<span class="description">The missing parameter specifies how docs which are missing the field should be treated. The value can be set to _last, _first, or a custom value.</span>
                        <a class="link" href="https://www.elastic.co/guide/en/elasticsearch/reference/current/search-request-sort.html#_missing_values">Read more</a>`
        },
        'nested': {
            title: 'nested',
            content: `<span class="description">Allows sorting withing nested objects</span>
                        <a class="link" href="https://www.elastic.co/guide/en/elasticsearch/reference/current/search-request-sort.html#nested-sorting">Read more</a>`
        },
        '_geo_distance': {
            title: '_geo_distance',
            content: `<span class="description">Allow to sort by _geo_distance.</span>
                        <a class="link" href="https://www.elastic.co/guide/en/elasticsearch/reference/current/search-request-sort.html#geo-sorting">Read more</a>`
        }
    };
    public distanceTypeInformation: any = {
        'sloppy_arc': {
            title: 'sloppy_arc',
            content: `<span class="description">Default distance type</span>`
        },
        'arc': {
            title: 'arc',
            content: `<span class="description">slightly more precise but significantly slower.</span>`
        },
        'plane': {
            title: 'plane',
            content: `<span class="description">faster, but inaccurate on long distances and close to the poles.</span>`
        }
    };

    @Input() mapping: any;
    @Input() types: any;
    @Input() selectedTypes: any;
    @Input() result: any;
    @Input() joiningQuery: any = [''];
    @Input() joiningQueryParam: any;
    @Output() setDocSample = new EventEmitter < any >();
    
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
            'order': 'asc',
            'availableOptionalParams': [],
            'modeList': []
        }
        this.result.sort.push(sortObj);
        this.exeBuild();
    }

    deleteSort() {
        this.result.sort = [];
        this.exeBuild();
    }

    sortFieldCallback(input: any) {
        let obj = this.result.sort[input.external];
        let geoFlag = false;

        obj.selectedField = input.val;
        obj.availableOptionalParams = [];

        if (!obj.mode && obj.mode != '') {
            obj.availableOptionalParams.push('mode');
        }
        if (!obj.missing && obj.missing != '') {
            obj.availableOptionalParams.push('missing');
        }

        this.result.resultQuery.availableFields.map(field => {
            if (field.name === input.val) {
                if (field.type === 'geo_point') {
                    let index = obj.availableOptionalParams.indexOf('missing');
                    if (index > -1) {
                        obj.availableOptionalParams.splice(index, 1);
                    }

                    if (obj.hasOwnProperty('missing')) {
                        delete obj['missing'];
                    }

                    geoFlag = true;
                    obj.modeList = ['min', 'max', 'avg', 'median'];
                    obj['_geo_distance'] = {
                        'distance_type': 'sloppy_arc',
                        'lat': '',
                        'lon': '',
                        'unit': ''
                    }
                } else {
                    obj.modeList = ['min', 'max', 'sum', 'avg', 'median'];
                }
            }
        });

        if (!geoFlag) {
            delete obj['_geo_distance'];
        }
        this.exeBuild();
    }

    sortModeCallback(input: any) {
        this.result.sort[input.external].mode = input.val;
        this.exeBuild();
    }

    sortDistanceTypeCallback(input: any) {
        this.result.sort[input.external]['_geo_distance']['distance_type'] = input.val;
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

    removeSortOptionalQuery(index: any, type: any) {
        this.result.sort[index].availableOptionalParams.push(type);
        delete this.result.sort[index][type];
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

    setDocSampleEve(link) {
        this.setDocSample.emit(link);
    }
}
