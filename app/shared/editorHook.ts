export var editorHook = function (config) {
    this.editorId = config.editorId;
    this.$editor = '#'+config.editorId;
}

editorHook.prototype.applyEditor = function() {
    var self = this;
    self.editor = CodeMirror.fromTextArea(document.getElementById(self.editorId), {
      lineNumbers: true,
      lineWrapping: true
    });
    var resultHeight = $(window).height() - 170;
    $('.codemirror').css({  height:resultHeight });

}

editorHook.prototype.setValue = function(value) {
    this.editor.setValue(value);
}

editorHook.prototype.getValue = function() {
    return this.editor.getValue();   
}
