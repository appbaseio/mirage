declare var CryptoJS, JSONURL, msgpack5, SafeEncode;
export var UrlShare = function () {
    this.secret = 'e';
    this.decryptedData = {};
    this.inputs = {};
    this.url = '';
}

UrlShare.prototype.getInputs = function() {
    return this.inputs;
}

UrlShare.prototype.setInputs = function(inputs: any) {
    this.inputs = inputs;
    this.createUrl();
}

UrlShare.prototype.createUrl = function() {
    var inputs = JSON.parse(JSON.stringify(this.inputs));
    try {
        delete inputs.result.resultQuery.final;
        delete inputs.result.output;
    } catch(e) {}
    console.log(inputs);
    var data = JSON.stringify(inputs);
    this.compress(inputs, compressCb.bind(this));
    function compressCb(error, ciphertext) {
        if(!error) {
            this.url = ciphertext;
            if(window.location.href.indexOf('#?default=true') > -1) {
                window.location.href = window.location.href.split('?default=true')[0];
            }
            window.location.href = '#?input_state=' + ciphertext;
        }
    }
}

UrlShare.prototype.decryptUrl = function(cb) {
    var url = window.location.href.split('#?input_state=');
    if (url.length > 1) {
        this.decompress(url[1], cb);
    } else {
        // cb('Empty url');
    }
    // setTimeout(function() {
    //     cb('lol');
    // }, 1000);
}

UrlShare.prototype.convertToUrl = function(type) {
    var ciphertext = this.url;
    var final_url = '';
    if(type == 'gh-pages') {
        final_url = 'appbaseio.github.io/mirage/#?input_state='+ciphertext;
    }
    else {
        final_url = window.location.protocol + '//' + window.location.host +'#?input_state='+ciphertext;
    }
    return final_url;
}

UrlShare.prototype.dejavuLink = function() {
    var obj = {
        url: this.inputs.config.url,
        appname: this.inputs.config.appname,
        selectedType: this.inputs.selectedTypes
    };
    var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(obj), 'dejvu').toString();
    var final_url = 'http://appbaseio.github.io/dejaVu/live/#?input_state='+ciphertext;
    return final_url;
}

UrlShare.prototype.compress = function(jsonInput, cb) {
    var msgpack = msgpack5();
    var packed = msgpack.encode(jsonInput);
    JSONURL.compress(packed, 9, function(res, error) {
    var result = SafeEncode.buffer(res);
      try {
        cb(null, SafeEncode.encode(result));   
      } catch(e) {
        cb(e);
      }
    });
}

UrlShare.prototype.decompress = function(compressed, cb) {
    var self = this;
    var msgpack = msgpack5();
    var compressBuffer = SafeEncode.buffer(compressed);
    JSONURL.decompress(SafeEncode.decode(compressBuffer), function(res, error) {
    var decryptedData = msgpack.decode(res);
    try {
        if(decryptedData) {
            self.decryptedData = decryptedData;
            cb(null, decryptedData);   
        } else {
            cb('Not found');
        }
      } catch(e) {
        cb(e);
      }
    });
}

