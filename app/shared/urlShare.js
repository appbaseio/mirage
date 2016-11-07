"use strict";
exports.UrlShare = function () {
    this.secret = 'e';
    this.decryptedData = {};
    this.inputs = {};
    this.url = '';
};
exports.UrlShare.prototype.getInputs = function () {
    return this.inputs;
};
exports.UrlShare.prototype.setInputs = function (inputs) {
    this.inputs = inputs;
    this.createUrl();
};
exports.UrlShare.prototype.createUrl = function () {
    if (this.inputs && this.inputs.config) {
        this.inputs.appname = this.inputs.config.appname;
        this.inputs.url = this.inputs.config.url;
    }
    var inputs = JSON.parse(JSON.stringify(this.inputs));
    try {
        delete inputs.result.resultQuery.final;
        delete inputs.result.output;
    }
    catch (e) { }
    var data = JSON.stringify(inputs);
    this.compress(inputs, compressCb.bind(this));
    function compressCb(error, ciphertext) {
        if (!error) {
            this.url = ciphertext;
            if (window.location.href.indexOf('#?default=true') > -1) {
                window.location.href = window.location.href.split('?default=true')[0];
            }
            window.location.href = '#?input_state=' + ciphertext;
        }
    }
};
exports.UrlShare.prototype.decryptUrl = function (cb) {
    var _this = this;
    return new Promise(function (resolve, reject) {
        var url = window.location.href.split('#?input_state=');
        if (url.length > 1) {
            _this.decompress(url[1], function (error, data) {
                if (data && data.appname && data.url) {
                    data.config = {
                        appname: data.appname,
                        url: data.url
                    };
                }
                if (data && data.config) {
                    data.appname = data.config.appname;
                    data.url = data.config.url;
                }
                resolve({ error: error, data: data });
            });
        }
        else {
            resolve({ error: 'Empty url' });
        }
    });
};
exports.UrlShare.prototype.convertToUrl = function (type) {
    var ciphertext = this.url;
    var final_url = '';
    if (type == 'gh-pages') {
        final_url = 'appbaseio.github.io/mirage/#?input_state=' + ciphertext;
    }
    else {
        final_url = window.location.protocol + '//' + window.location.host + '#?input_state=' + ciphertext;
    }
    return final_url;
};
exports.UrlShare.prototype.dejavuLink = function () {
    var obj = {
        url: this.inputs.config.url,
        appname: this.inputs.config.appname,
        selectedType: this.inputs.selectedTypes
    };
    var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(obj), 'dejvu').toString();
    var final_url = 'http://appbaseio.github.io/dejavu/live/#?input_state=' + ciphertext;
    return final_url;
};
exports.UrlShare.prototype.compress = function (jsonInput, cb) {
    if (!jsonInput) {
        return cb('Input should not be empty');
    }
    else {
        var packed = JSON.stringify(jsonInput);
        JSONURL.compress(packed, 9, function (res, error) {
            try {
                var result = SafeEncode.buffer(res);
                cb(null, SafeEncode.encode(result));
            }
            catch (e) {
                cb(e);
            }
        });
    }
};
exports.UrlShare.prototype.decompress = function (compressed, cb) {
    var self = this;
    if (compressed) {
        var compressBuffer = SafeEncode.buffer(compressed);
        JSONURL.decompress(SafeEncode.decode(compressBuffer), function (res, error) {
            var decryptedData = res;
            try {
                if (decryptedData) {
                    decryptedData = JSON.parse(decryptedData);
                    self.decryptedData = decryptedData;
                    cb(null, decryptedData);
                }
                else {
                    cb('Not found');
                }
            }
            catch (e) {
                cb(e);
            }
        });
    }
    else {
        return cb('Empty');
    }
};
//# sourceMappingURL=urlShare.js.map