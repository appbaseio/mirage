export var UrlShare = function () {
    this.secret = 'e';
    this.decryptedData = {};
    this.inputs = {};
    this.url = '';
}
declare var CryptoJS;

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
    var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(inputs), this.secret).toString();
    this.url = ciphertext;
    window.location.href = '#?input_state=' + ciphertext;
}

UrlShare.prototype.decryptUrl = function() {
    var ciphertext = window.location.href.split('#?input_state=');
    if (ciphertext.length > 1) {
        var bytes = CryptoJS.AES.decrypt(ciphertext[1], this.secret);
        this.decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    }
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


