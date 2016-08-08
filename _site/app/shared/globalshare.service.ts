import {Injectable} from "@angular/core";

@Injectable()
export class GlobalShare {
    public informationList: any = {};

    constructor() {}

    setValue(key, val) {
        this[key] = val;
        console.log(this.informationList);
    }

    getValue(key) {
    	console.log(this);
        console.log(key, this[key]);
        return this[key];
    }
}