"use strict";
var path_1 = require('path');
var url_1 = require('url');
var config_1 = require('./config');
var isAbsolute = require('is-absolute');
var mainTypingsDir = path_1.join(config_1.TYPINGS_DIR, 'main/definitions');
var browserTypingsDir = path_1.join(config_1.TYPINGS_DIR, 'browser/definitions');
var ambientMainTypingsDir = path_1.join(config_1.TYPINGS_DIR, 'main/ambient');
var ambientBrowserTypingsDir = path_1.join(config_1.TYPINGS_DIR, 'browser/ambient');
exports.EOL = '\n';
function isHttp(url) {
    return /^https?\:\/\//i.test(url);
}
exports.isHttp = isHttp;
function isDefinition(path) {
    if (isHttp(path)) {
        return isDefinition(url_1.parse(path).pathname);
    }
    return /\.d\.ts$/.test(path);
}
exports.isDefinition = isDefinition;
function isModuleName(value) {
    return !isHttp(value) && !isAbsolute(value) && value.charAt(0) !== '.';
}
exports.isModuleName = isModuleName;
function normalizeSlashes(path) {
    return path.replace(/\\/g, '/');
}
exports.normalizeSlashes = normalizeSlashes;
function resolveFrom(from, to) {
    if (isHttp(to)) {
        return to;
    }
    if (isHttp(from)) {
        var url = url_1.parse(from);
        url.pathname = url_1.resolve(url.pathname, to);
        return url_1.format(url);
    }
    return path_1.resolve(path_1.dirname(from), to);
}
exports.resolveFrom = resolveFrom;
function relativeTo(from, to) {
    if (isHttp(from)) {
        var fromUrl = url_1.parse(from);
        if (isHttp(to)) {
            var toUrl = url_1.parse(to);
            if (toUrl.auth !== fromUrl.auth || toUrl.host !== fromUrl.host) {
                return to;
            }
            var relativeUrl = relativeTo(fromUrl.pathname, toUrl.pathname);
            if (toUrl.search) {
                relativeUrl += toUrl.search;
            }
            if (toUrl.hash) {
                relativeUrl += toUrl.hash;
            }
            return relativeUrl;
        }
        return relativeTo(fromUrl.pathname, to);
    }
    return path_1.relative(path_1.dirname(from), to);
}
exports.relativeTo = relativeTo;
function toDefinition(path) {
    if (isHttp(path)) {
        var url = url_1.parse(path);
        url.pathname = toDefinition(url.pathname);
        return url_1.format(url);
    }
    return path + ".d.ts";
}
exports.toDefinition = toDefinition;
function pathFromDefinition(path) {
    if (isHttp(path)) {
        return pathFromDefinition(url_1.parse(path).pathname);
    }
    return path.replace(/\.d\.ts$/, '');
}
exports.pathFromDefinition = pathFromDefinition;
function normalizeToDefinition(path) {
    if (isDefinition(path)) {
        return path;
    }
    if (isHttp(path)) {
        var url = url_1.parse(path);
        url.pathname = normalizeToDefinition(path);
        return url_1.format(url);
    }
    var ext = path_1.extname(path);
    return toDefinition(ext ? path.slice(0, -ext.length) : path);
}
exports.normalizeToDefinition = normalizeToDefinition;
function getTypingsLocation(options) {
    var typings = path_1.join(options.cwd, config_1.TYPINGS_DIR);
    var main = path_1.join(typings, config_1.DTS_MAIN_FILE);
    var browser = path_1.join(typings, config_1.DTS_BROWSER_FILE);
    return { main: main, browser: browser, typings: typings };
}
exports.getTypingsLocation = getTypingsLocation;
function getDependencyLocation(options) {
    var mainDir = options.ambient ? ambientMainTypingsDir : mainTypingsDir;
    var browserDir = options.ambient ? ambientBrowserTypingsDir : browserTypingsDir;
    var main = path_1.join(options.cwd, mainDir, options.name, 'index.d.ts');
    var browser = path_1.join(options.cwd, browserDir, options.name, 'index.d.ts');
    return { mainDir: mainDir, browserDir: browserDir, main: main, browser: browser };
}
exports.getDependencyLocation = getDependencyLocation;
function getInfoFromDependencyLocation(path, options) {
    var parts = path_1.relative(options.cwd, path).split(path_1.sep);
    return {
        path: path,
        browser: parts[0] === 'browser',
        ambient: parts[1] === 'ambient',
        name: parts.slice(2, -1).join('/')
    };
}
exports.getInfoFromDependencyLocation = getInfoFromDependencyLocation;
function detectEOL(contents) {
    var match = contents.match(/\r\n|\r|\n/);
    return match ? match[0] : undefined;
}
exports.detectEOL = detectEOL;
function normalizeEOL(contents, eol) {
    return contents.replace(/\r\n|\r|\n/g, eol);
}
exports.normalizeEOL = normalizeEOL;
//# sourceMappingURL=path.js.map