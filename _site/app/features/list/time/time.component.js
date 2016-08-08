"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("@angular/core");
var prettyTime_1 = require("../../../shared/pipes/prettyTime");
var TimeComponent = (function () {
    function TimeComponent() {
    }
    TimeComponent.prototype.ngOnInit = function () {
        this.setTimeInterval(false);
    };
    TimeComponent.prototype.ngOnChanges = function () { };
    TimeComponent.prototype.setTimeInterval = function (flag) {
        this.time = flag ? this.time + 1 : this.time - 1;
        flag = flag ? false : true;
        setTimeout(function () {
            this.setTimeInterval(flag);
        }.bind(this), 1000 * 60);
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], TimeComponent.prototype, "time", void 0);
    TimeComponent = __decorate([
        core_1.Component({
            selector: 'time-relative',
            template: "<span class=\"query-time\">\n\t\t\t\t\t{{time | prettyTime}}\n\t\t\t\t</span>",
            inputs: ['time'],
            pipes: [prettyTime_1.prettyTime]
        }), 
        __metadata('design:paramtypes', [])
    ], TimeComponent);
    return TimeComponent;
}());
exports.TimeComponent = TimeComponent;
//# sourceMappingURL=time.component.js.map