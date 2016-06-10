System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var urlShare;
    return {
        setters:[],
        execute: function() {
            exports_1("urlShare", urlShare = function () {
                this.secret = 'es-querycomposer';
                this.decryptedData = {};
            });
            urlShare.prototype.createUrl = function (inputs) {
                var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(inputs), this.secret).toString();
                window.location.href = '#?input_state=' + ciphertext;
            };
        }
    }
});
// urlShare.prototype.getUrl = function() {
//     var ciphertext = window.location.href.split('#?input_state=');
//     if (ciphertext.length > 1) {
//         var bytes = CryptoJS.AES.decrypt(ciphertext[1], this.secret);
//         this.decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
//         window.localStorage.setItem('esurl', this.decryptedData.url);
//         window.localStorage.setItem('appname', this.decryptedData.appname);
//         if (this.decryptedData.selectedType && this.decryptedData.selectedType.length) {
//             this.decryptedData.selectedType.forEach(function(type) {
//                 window.localStorage.setItem(type, true);
//             });
//         }
//     }
// }
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
//# sourceMappingURL=urlShare.js.map