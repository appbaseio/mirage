System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var EditorHook;
    return {
        setters:[],
        execute: function() {
            exports_1("EditorHook", EditorHook = function (config) {
                this.editorId = config.editorId;
                this.$editor = '#' + config.editorId;
            });
            EditorHook.prototype.applyEditor = function (settings) {
                var self = this;
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
            EditorHook.prototype.setValue = function (value) {
                this.editor.setValue(value);
            };
            EditorHook.prototype.getValue = function () {
                return this.editor.getValue();
            };
            EditorHook.prototype.getInstance = function () {
                return this.editor;
            };
        }
    }
});
//# sourceMappingURL=editorHook.js.map