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
    if(this.inputs && this.inputs.config) {
        this.inputs.appname = this.inputs.config.appname;
        this.inputs.url = this.inputs.config.url;
    }
    var inputs = JSON.parse(JSON.stringify(this.inputs));
    try {
        delete inputs.result.resultQuery.final;
        delete inputs.result.output;
    } catch(e) {}
    var data = JSON.stringify(inputs);
    this.compress(inputs, compressCb.bind(this));
    function compressCb(error, ciphertext) {
        if(!error) {
            this.url = ciphertext;
            if(window.location.href.indexOf('#?default=true') > -1) {
                window.location.href = window.location.href.split('?default=true')[0];
            }
            let finalUrl = '#?input_state=' + ciphertext;
            if(this.queryParams && this.queryParams.hf) {
                finalUrl += '&hf='+this.queryParams.hf
            }
            window.location.href = finalUrl;
        }
    }
}

UrlShare.prototype.decryptUrl = function(cb) {
    return new Promise((resolve, reject) => {
        this.queryParams = this.getQueryParameters();
        if (this.queryParams.input_state) {
        this.decompress(this.queryParams.input_state, function(error, data) {
                if(data && data.appname && data.url) {
                    data.config = {
                        appname: data.appname,
                        url: data.url
                    };
                } if(data && data.config) {
                    data.appname = data.config.appname;
                    data.url = data.config.url;
                }
                resolve({error: error, data: data});
            });    
        } else {
            resolve({error:'Empty url'});
        }
    });
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
    var final_url = 'http://appbaseio.github.io/dejavu/live/#?input_state='+ciphertext;
    return final_url;
}

UrlShare.prototype.compress = function(jsonInput, cb) {
    if(!jsonInput) {
        return cb('Input should not be empty');
    } else {
    var packed = JSON.stringify(jsonInput);
        JSONURL.compress(packed, 9, function(res, error) {
          try {
            var result = SafeEncode.buffer(res);
            cb(null, SafeEncode.encode(result));   
          } catch(e) {
            cb(e);
          }
        });
    }
}

UrlShare.prototype.decompress = function(compressed, cb) {
    var self = this;
    if(compressed) {
        var compressBuffer = SafeEncode.buffer(compressed);
        JSONURL.decompress(SafeEncode.decode(compressBuffer), function(res, error) {
        var decryptedData = res;
        try {
            if(decryptedData) {
                decryptedData = JSON.parse(decryptedData);
                self.decryptedData = decryptedData;
                cb(null, decryptedData);   
            } else {
                cb('Not found');
            }
          } catch(e) {
            cb(e);
          }
        });
    } else {
        return cb('Empty');
    }
}

UrlShare.prototype.getQueryParameters = function(str) {
    let hash = window.location.hash.split('#');
    if(hash.length > 1) {
      return (str || hash[1]).replace(/(^\?)/,'').split("&").map(function(n){return n = n.split("="),this[n[0]] = n[1],this}.bind({}))[0];
    } else {
      return null;
    }
}

