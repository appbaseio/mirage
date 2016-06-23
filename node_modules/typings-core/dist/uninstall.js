"use strict";
var extend = require('xtend');
var Promise = require('any-promise');
var events_1 = require('events');
var fs_1 = require('./utils/fs');
var find_1 = require('./utils/find');
var path_1 = require('./utils/path');
function uninstallDependency(name, options) {
    return uninstallDependencies([name], options);
}
exports.uninstallDependency = uninstallDependency;
function uninstallDependencies(names, options) {
    var emitter = options.emitter || new events_1.EventEmitter();
    return find_1.findProject(options.cwd)
        .then(function (cwd) { return extend(options, { cwd: cwd, emitter: emitter }); }, function () { return extend(options, { emitter: emitter }); })
        .then(function (options) {
        return Promise.all(names.map(function (x) { return uninstallFrom(x, options); }))
            .then(function () { return writeBundle(names, options); })
            .then(function () { return writeToConfig(names, options); })
            .then(function () { return undefined; });
    });
}
exports.uninstallDependencies = uninstallDependencies;
function uninstallFrom(name, options) {
    var cwd = options.cwd, ambient = options.ambient, emitter = options.emitter;
    var location = path_1.getDependencyLocation({ name: name, cwd: cwd, ambient: ambient });
    return Promise.all([
        fs_1.rmUntil(location.main, { cwd: cwd, emitter: emitter }),
        fs_1.rmUntil(location.browser, { cwd: cwd, emitter: emitter })
    ]);
}
function writeToConfig(names, options) {
    if (options.save || options.saveDev || options.savePeer) {
        return fs_1.transformConfig(options.cwd, function (config) {
            for (var _i = 0, names_1 = names; _i < names_1.length; _i++) {
                var name = names_1[_i];
                if (options.save) {
                    if (options.ambient) {
                        if (config.ambientDependencies && config.ambientDependencies[name]) {
                            delete config.ambientDependencies[name];
                        }
                        else {
                            return Promise.reject(new TypeError("Typings for \"" + name + "\" are not listed in ambient dependencies"));
                        }
                    }
                    else {
                        if (config.dependencies && config.dependencies[name]) {
                            delete config.dependencies[name];
                        }
                        else {
                            return Promise.reject(new TypeError("Typings for \"" + name + "\" are not listed in dependencies"));
                        }
                    }
                }
                if (options.saveDev) {
                    if (options.ambient) {
                        if (config.ambientDevDependencies && config.ambientDevDependencies[name]) {
                            delete config.ambientDevDependencies[name];
                        }
                        else {
                            return Promise.reject(new TypeError("Typings for \"" + name + "\" are not listed in ambient dev dependencies"));
                        }
                    }
                    else {
                        if (config.devDependencies && config.devDependencies[name]) {
                            delete config.devDependencies[name];
                        }
                        else {
                            return Promise.reject(new TypeError("Typings for \"" + name + "\" are not listed in dev dependencies"));
                        }
                    }
                }
                if (options.savePeer) {
                    if (config.peerDependencies && config.peerDependencies[name]) {
                        delete config.peerDependencies[name];
                    }
                    else {
                        return Promise.reject(new TypeError("Typings for \"" + name + "\" are not listed in peer dependencies"));
                    }
                }
            }
            return config;
        });
    }
}
function writeBundle(names, options) {
    var cwd = options.cwd, ambient = options.ambient;
    var bundle = path_1.getTypingsLocation(options);
    var locations = names.map(function (name) { return path_1.getDependencyLocation({ name: name, cwd: cwd, ambient: ambient }); });
    var mainLocations = locations.map(function (x) { return x.main; });
    var browserLocations = locations.map(function (x) { return x.browser; });
    return Promise.all([
        fs_1.transformDtsFile(bundle.main, function (x) { return x.filter(function (x) { return mainLocations.indexOf(x) === -1; }); }),
        fs_1.transformDtsFile(bundle.browser, function (x) { return x.filter(function (x) { return browserLocations.indexOf(x) === -1; }); })
    ]);
}
//# sourceMappingURL=uninstall.js.map