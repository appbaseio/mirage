declare var CryptoJS, JSONURL, msgpack5, SafeEncode;
export var UrlShare = function() {
  this.secret = "e";
  this.decryptedData = {};
  this.inputs = {};
  this.url = "";
};

UrlShare.prototype.getInputs = function() {
  return this.inputs;
};

UrlShare.prototype.setInputs = function(inputs: any) {
  this.inputs = inputs;
  this.createUrl();
};

UrlShare.prototype.createUrl = function() {
  if (this.inputs && this.inputs.config) {
    this.inputs.appname = this.inputs.config.appname;
    this.inputs.url = this.inputs.config.url;
  }
  if (this.inputs.selectedTypes) {
    this.inputs.selectedType = this.inputs.selectedTypes;
  }
  var inputs = JSON.parse(JSON.stringify(this.inputs));
  try {
    delete inputs.result.resultQuery.final;
    delete inputs.result.output;
  } catch (e) {}
  var data = JSON.stringify(inputs);
  this.compress(inputs, compressCb.bind(this));
  function compressCb(error, ciphertext) {
    if (!error) {
      this.url = ciphertext;
      if (window.location.href.indexOf("#?default=true") > -1) {
        window.location.href = window.location.href.split("?default=true")[0];
      }
      let finalUrl = "#?input_state=" + ciphertext;
      for (let params in this.queryParams) {
        if (params !== "input_state") {
          console.log(params, this.queryParams[params]);
          finalUrl += "&" + params + "=" + this.queryParams[params];
        }
      }
      window.location.href = finalUrl;
    }
  }
};

UrlShare.prototype.decryptUrl = function(cb) {
  return new Promise((resolve, reject) => {
    this.queryParams = this.getQueryParameters();
    if (this.queryParams.input_state) {
      this.decompress(this.queryParams.input_state, function(error, data) {
        if (data && data.appname && data.url) {
          data.config = {
            appname: data.appname,
            url: data.url
          };
        }
        if (data && data.config) {
          data.appname = data.config.appname;
          data.url = data.config.url;
        }
        resolve({ error: error, data: data });
      });
    } else if (this.queryParams && this.queryParams.app) {
      try {
        const config = JSON.parse(this.queryParams.app);
        const data = {
          config
        };
        resolve({ error: null, data: data });
      } catch (e) {
        resolve({ error: e });
      }
    } else {
      resolve({ error: "Empty url" });
    }
  });
};

UrlShare.prototype.convertToUrl = function(type) {
  var ciphertext = this.url;
  var final_url = "";
  if (type == "gh-pages") {
    final_url = "appbaseio.github.io/mirage/#?input_state=" + ciphertext;
  } else {
    final_url =
      window.location.protocol +
      "//" +
      window.location.host +
      "#?input_state=" +
      ciphertext;
  }
  return final_url;
};

UrlShare.prototype.dejavuLink = function() {
  console.log("final url", this.inputs);
  var final_url =
    "https://dejavu.appbase.io?mode=edit&appname=" +
    this.inputs.appname +
    "&url=" +
    this.inputs.url;

  return final_url;
};

UrlShare.prototype.compress = function(jsonInput, cb) {
  if (!jsonInput) {
    return cb("Input should not be empty");
  } else {
    var packed = JSON.stringify(jsonInput);
    JSONURL.compress(packed, 9, function(res, error) {
      try {
        var result = SafeEncode.buffer(res);
        cb(null, SafeEncode.encode(result));
      } catch (e) {
        cb(e);
      }
    });
  }
};

UrlShare.prototype.decompress = function(compressed, cb) {
  var self = this;
  if (compressed) {
    var compressBuffer = SafeEncode.buffer(compressed);
    JSONURL.decompress(SafeEncode.decode(compressBuffer), function(res, error) {
      var decryptedData = res;
      try {
        if (decryptedData) {
          decryptedData = JSON.parse(decryptedData);
          self.decryptedData = decryptedData;
          cb(null, decryptedData);
        } else {
          cb("Not found");
        }
      } catch (e) {
        cb(e);
      }
    });
  } else {
    return cb("Empty");
  }
};

UrlShare.prototype.getQueryParameters = function(str) {
  const tempurl = decodeURIComponent(window.location.href);
  const hash = tempurl.split("#");
  if (hash.length > 1) {
    return (str || hash[1])
      .replace(/(^\?)/, "")
      .split("&")
      .map(
        function(n) {
          return (n = n.split("=")), (this[n[0]] = n[1]), this;
        }.bind({})
      )[0];
  } else {
    return null;
  }
};
