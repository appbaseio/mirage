"use strict";
var path_1 = require('path');
var Promise = require('any-promise');
var extend = require('xtend');
var events_1 = require('events');
var find_1 = require('./utils/find');
var fs_1 = require('./utils/fs');
var path_2 = require('./utils/path');
function prune(options) {
    var cwd = options.cwd, production = options.production;
    var emitter = options.emitter || new events_1.EventEmitter();
    return find_1.findConfigFile(cwd)
        .then(function (path) {
        var cwd = path_1.dirname(path);
        return fs_1.readConfig(path)
            .then(function (config) {
            return transformBundles(config, { cwd: cwd, production: production, emitter: emitter });
        });
    });
}
exports.prune = prune;
function transformBundles(config, options) {
    var production = options.production;
    var bundle = path_2.getTypingsLocation(options);
    var dependencies = extend(config.dependencies, config.peerDependencies, production ? {} : config.devDependencies);
    var ambientDependencies = extend(config.ambientDependencies, production ? {} : config.ambientDevDependencies);
    return Promise.all([
        transformBundle(bundle.main, dependencies, ambientDependencies, options),
        transformBundle(bundle.browser, dependencies, ambientDependencies, options)
    ]).then(function () { return undefined; });
}
function transformBundle(path, dependencies, ambientDependencies, options) {
    var emitter = options.emitter;
    var cwd = path_1.dirname(path);
    var rmQueue = [];
    return fs_1.transformDtsFile(path, function (typings) {
        var infos = typings.map(function (x) { return path_2.getInfoFromDependencyLocation(x, { cwd: cwd }); });
        var validPaths = [];
        for (var _i = 0, infos_1 = infos; _i < infos_1.length; _i++) {
            var _a = infos_1[_i], name = _a.name, ambient = _a.ambient, path_3 = _a.path, browser = _a.browser;
            if (ambient) {
                if (!ambientDependencies.hasOwnProperty(name)) {
                    emitter.emit('prune', { name: name, ambient: ambient, browser: browser });
                    rmQueue.push(fs_1.rmUntil(path_3, { cwd: cwd, emitter: emitter }));
                }
                else {
                    validPaths.push(path_3);
                }
            }
            else {
                if (!dependencies.hasOwnProperty(name)) {
                    emitter.emit('prune', { name: name, ambient: ambient, browser: browser });
                    rmQueue.push(fs_1.rmUntil(path_3, { cwd: cwd, emitter: emitter }));
                }
                else {
                    validPaths.push(path_3);
                }
            }
        }
        return validPaths;
    })
        .then(function () { return Promise.all(rmQueue); })
        .then(function () { return undefined; });
}
//# sourceMappingURL=prune.js.map