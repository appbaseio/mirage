"use strict";
exports.EditorHook = function (config) {
    this.editorId = config.editorId;
    this.$editor = "#" + config.editorId;
};
exports.EditorHook.prototype.applyEditor = function (settings) {
    var self = this;
    this.settings = settings;
    var defaultOptions = {
        lineNumbers: true,
        mode: {
            name: "javascript",
            json: true
        },
        autoCloseBrackets: true,
        matchBrackets: true,
        showCursorWhenSelecting: true,
        indentWithTabs: true,
        tabSize: 2,
        extraKeys: {
            "Ctrl-Q": function (cm) {
                cm.foldCode(cm.getCursor());
            }
        },
        foldGutter: true,
        gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"]
    };
    var options = settings
        ? jQuery.extend(defaultOptions, settings)
        : defaultOptions;
    self.editor = CodeMirror.fromTextArea(document.getElementById(self.editorId), options);
};
exports.EditorHook.prototype.setValue = function (value) {
    if (this.editor && this.editor.setValue) {
        this.editor.setValue(value);
    }
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
exports.EditorHook.prototype.prepend = function (data) {
    var totalLine = data.split(/\r\n|\r|\n/).length;
    this.editor.replaceRange(data, { line: 0, ch: 0 });
    for (var i = 0; i < totalLine - 1; i++) {
        this.editor.addLineClass(i, "wrap", "streaming-response");
    }
};
//# sourceMappingURL=editorHook.js.map