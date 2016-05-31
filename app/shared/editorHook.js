"use strict";
exports.editorHook = function (config) {
    this.editorId = config.editorId;
    this.$editor = '#' + config.editorId;
};
exports.editorHook.prototype.applyEditor = function (settings) {
    var self = this;
    var defaultOptions = {
        lineNumbers: true,
        mode: "javascript",
        autoCloseBrackets: true,
        matchBrackets: true,
        showCursorWhenSelecting: true,
        theme: "monokai",
        tabSize: 2,
        extraKeys: { "Ctrl-Q": function (cm) { cm.foldCode(cm.getCursor()); } },
        foldGutter: true,
        gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"]
    };
    var options = settings ? jQuery.extend(settings, defaultOptions) : defaultOptions;
    self.editor = CodeMirror.fromTextArea(document.getElementById(self.editorId), options);
};
exports.editorHook.prototype.setValue = function (value) {
    this.editor.setValue(value);
};
exports.editorHook.prototype.getValue = function () {
    return this.editor.getValue();
};
exports.editorHook.prototype.getInstance = function () {
    return this.editor;
};
//# sourceMappingURL=editorHook.js.map