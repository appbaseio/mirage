var editorHook = function (config) {
    this.editorId = config.editorId;
};
editorHook.prototype.applyEditor = function () {
    var self = this;
    var editor = CodeMirror.fromTextArea(document.getElementById(self.editorId), {
        lineNumbers: true,
        lineWrapping: true
    });
};
editorHook = editorHook;
//# sourceMappingURL=helpHook.js.map