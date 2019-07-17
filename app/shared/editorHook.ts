declare var $: any, jQuery: any, CodeMirror: any;

export var EditorHook = function(config) {
  this.editorId = config.editorId;
  this.$editor = "#" + config.editorId;
};

EditorHook.prototype.applyEditor = function(settings) {
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
      "Ctrl-Q": function(cm) {
        cm.foldCode(cm.getCursor());
      }
    },
    foldGutter: true,
    gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"]
  };
  var options = settings
    ? jQuery.extend(defaultOptions, settings)
    : defaultOptions;
  self.editor = CodeMirror.fromTextArea(
    document.getElementById(self.editorId),
    options
  );
};

EditorHook.prototype.setValue = function(value) {
  if (this.editor && this.editor.setValue) {
    this.editor.setValue(value);
  }
};

EditorHook.prototype.focus = function(value) {
  this.editor.toTextArea();
  this.applyEditor(this.settings);
  this.setValue(value);
};

EditorHook.prototype.getValue = function() {
  return this.editor.getValue();
};

EditorHook.prototype.getInstance = function() {
  return this.editor;
};

EditorHook.prototype.prepend = function(data) {
  const totalLine = data.split(/\r\n|\r|\n/).length;
  this.editor.replaceRange(data, { line: 0, ch: 0 });
  for (let i = 0; i < totalLine - 1; i++) {
    this.editor.addLineClass(i, "wrap", "streaming-response");
  }
};
