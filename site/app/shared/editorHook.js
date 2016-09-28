"use strict";
exports.EditorHook = function (config) {
    this.editorId = config.editorId;
    this.$editor = '#' + config.editorId;
};
exports.EditorHook.prototype.applyEditor = function (settings) {
    var self = this;
    this.settings = settings;
    var defaultOptions = {
        lineNumbers: true,
        mode: "javascript",
        autoCloseBrackets: true,
        matchBrackets: true,
        showCursorWhenSelecting: true,
        tabSize: 2,
        extraKeys: { "Ctrl-Q": function (cm) { cm.foldCode(cm.getCursor()); } },
        foldGutter: true,
        gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"]
    };
    var options = settings ? jQuery.extend(settings, defaultOptions) : defaultOptions;
    self.editor = CodeMirror.fromTextArea(document.getElementById(self.editorId), options);
};
exports.EditorHook.prototype.setValue = function (value) {
    this.editor.setValue(value);
};
exports.EditorHook.prototype.focus = function (value) {
    this.editor.toTextArea();
    this.applyEditor(this.settings);
    this.setValue(value);
};
exports.EditorHook.prototype.getValue = function () {
    return this.editor.getValue();
};
exports.EditorHook.prototype.getInstance = function () {
    return this.editor;
};
//# sourceMappingURL=editorHook.js.map