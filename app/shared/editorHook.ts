export var editorHook = function (config) {
    this.editorId = config.editorId;
    this.$editor = '#'+config.editorId;
}

editorHook.prototype.applyEditor = function() {
    var self = this;
    var options = {
        lineNumbers: true,
        mode: "javascript",
        autoCloseBrackets: true,
        matchBrackets: true,
        showCursorWhenSelecting: true,
        theme: "monokai",
        tabSize: 2,
        extraKeys: {"Ctrl-Q": function(cm){ cm.foldCode(cm.getCursor()); }},
        foldGutter: true,
        gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"]
    };

    self.editor = CodeMirror.fromTextArea(document.getElementById(self.editorId), options);
}

editorHook.prototype.setValue = function(value) {
    this.editor.setValue(value);
}

editorHook.prototype.getValue = function() {
    return this.editor.getValue();   
}
