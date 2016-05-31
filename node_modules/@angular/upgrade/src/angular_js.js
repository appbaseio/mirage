"use strict";
function noNg() {
    throw new Error('AngularJS v1.x is not loaded!');
}
var angular = {
    bootstrap: noNg,
    module: noNg,
    element: noNg,
    version: noNg,
    resumeBootstrap: noNg,
    getTestability: noNg
};
try {
    if (window.hasOwnProperty('angular')) {
        angular = window.angular;
    }
}
catch (e) {
}
exports.bootstrap = angular.bootstrap;
exports.module = angular.module;
exports.element = angular.element;
exports.version = angular.version;
exports.resumeBootstrap = angular.resumeBootstrap;
exports.getTestability = angular.getTestability;
//# sourceMappingURL=angular_js.js.map