export var UrlShare = function () {
    this.secret = 'es-querycomposer';
    this.decryptedData = {};
    this.inputs = {};
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
	console.log(this.inputs);
    var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(this.inputs), this.secret).toString();
    window.location.href = '#?input_state=' + ciphertext;
}

UrlShare.prototype.decryptUrl = function() {
    var ciphertext = window.location.href.split('#?input_state=');
    if (ciphertext.length > 1) {
        var bytes = CryptoJS.AES.decrypt(ciphertext[1], this.secret);
        this.decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    }
}

// urlShare.prototype.convertToUrl = function(type) {
//     var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(input_state), secret).toString();
//     var final_url = '';
//     if(type == 'gh-pages') {
//         final_url = 'appbaseio.github.io/dejaVu/live/#?input_state='+ciphertext;
//     }
//     else if(type == 'appbaseio') {
//         final_url = 'https://appbase.io/scalr/'+input_state.appname+'/browser/#?input_state='+ciphertext;
//     }
//     else {
//         final_url = window.location.protocol + '//' + window.location.host +'#?input_state='+ciphertext;
//     }
//     return final_url;
// }

