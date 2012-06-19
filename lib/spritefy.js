
var __t;

__t = function(ns, expose) {
  var curr, index, part, parts, _i, _len;
  curr = null;
  parts = [].concat = ns.split(".");
  for (index = _i = 0, _len = parts.length; _i < _len; index = ++_i) {
    part = parts[index];
    if (curr === null) {
      curr = eval(part);
      if (expose != null) {
        expose[part] = curr;
      }
      continue;
    } else {
      if (curr[part] == null) {
        curr = curr[part] = {};
        if (expose != null) {
          expose[part] = curr;
        }
      } else {
        curr = curr[part];
      }
    }
  }
  return curr;
};

var app = {};


(function() {
  var easyimage, exec, fs, path, program,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  __t('app.utils').PubSub = (function() {
    var listeners;

    listeners = [];

    function PubSub() {}

    PubSub.prototype.bind = function(event, callback) {
      return listeners.push({
        event: event,
        callback: callback
      });
    };

    PubSub.prototype.trigger = function(event, params) {
      var e, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = listeners.length; _i < _len; _i++) {
        e = listeners[_i];
        if (e.event === event) {
          _results.push(e.callback(params));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    PubSub.prototype.unbind = function(event, callback) {
      var e, i, _i, _len, _results;
      _results = [];
      for (i = _i = 0, _len = listeners.length; _i < _len; i = ++_i) {
        e = listeners[i];
        if (e.event === event && e.callback() === callback()) {
          _results.push(listeners.slice(i, 0));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    return PubSub;

  })();

  exec = require("child_process").exec;

  __t('app.build').SpriteBuilder = (function() {

    SpriteBuilder.prototype.images = [];

    SpriteBuilder.prototype.name = "";

    SpriteBuilder.prototype.file_text = "";

    SpriteBuilder.prototype.sprite_path = "";

    SpriteBuilder.prototype.files_path = [];

    SpriteBuilder.prototype.files_list = [];

    SpriteBuilder.prototype.pubsub = new app.utils.PubSub;

    function SpriteBuilder(images, name) {
      var image, _i, _len, _ref;
      this.images = images;
      this.name = name;
      this.build = __bind(this.build, this);

      _ref = this.images;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        image = _ref[_i];
        this.files_path.push(image.file);
      }
      this.list_files = this.files_path.join(" ");
    }

    SpriteBuilder.prototype.build = function(images_path) {
      var cmd,
        _this = this;
      this.sprite_path = path.resolve("" + images_path + "/../sprites");
      if (path.existsSync("" + this.sprite_path + "/" + this.name + ".png")) {
        fs.unlink("" + this.sprite_path + "/" + this.name + ".png");
      }
      cmd = "convert " + this.list_files + " -transparent white -background None +append " + this.sprite_path + "/" + this.name + ".png";
      return exec(cmd, function(err, stdout, stderr) {
        if (err) {
          throw err;
        }
      });
    };

    return SpriteBuilder;

  })();

  fs = require("fs");

  easyimage = require("easyimage");

  __t('app.utils').Files = (function() {
    var count, folder_path;

    folder_path = "";

    Files.prototype.images = [];

    Files.prototype.pubsub = new app.utils.PubSub;

    count = 0;

    function Files(folder_path) {
      this.folder_path = folder_path;
      this.trigger = __bind(this.trigger, this);

      this.bind = __bind(this.bind, this);

      this.get_images();
    }

    Files.prototype.get_images = function() {
      var pattern,
        _this = this;
      pattern = new RegExp(".*(jpg|png|gif)$");
      return fs.readdir(this.folder_path, function(err, files) {
        var file, i, is_image, _i, _len;
        if (err) {
          throw err;
        }
        for (i = _i = 0, _len = files.length; _i < _len; i = ++_i) {
          file = files[i];
          is_image = pattern.test(file);
          if (is_image) {
            _this.images.push({
              file: "" + _this.folder_path + "/" + file
            });
          }
        }
        return _this.setup_images(function() {
          return _this.pubsub.trigger("complete", _this.images);
        });
      });
    };

    Files.prototype.setup_images = function(callback) {
      var _this = this;
      return easyimage.info(this.images[count].file, function(err, file) {
        if (err) {
          throw err;
        }
        _this.images[count].width = parseInt(file.width);
        _this.images[count].height = parseInt(file.height);
        _this.images[count].size = file.size;
        _this.images[count].type = file.type;
        _this.images[count].file = "" + _this.folder_path + "/" + file.name;
        count++;
        if (count < _this.images.length) {
          _this.setup_images(callback);
          return;
        }
        if (count >= _this.images.length) {
          return callback();
        }
      });
    };

    Files.prototype.bind = function(event, callback) {
      return this.pubsub.bind(event, callback);
    };

    Files.prototype.trigger = function(event) {
      return this.pubsub.trigger(event);
    };

    return Files;

  })();

  fs = require("fs");

  path = require("path");

  __t('app.build').StyleBuilder = (function() {

    StyleBuilder.prototype.images = [];

    StyleBuilder.prototype.name = "";

    StyleBuilder.prototype.file_text = "";

    StyleBuilder.prototype.css_path = "css";

    function StyleBuilder(images, name) {
      this.images = images;
      this.name = name;
      this.build = __bind(this.build, this);

    }

    StyleBuilder.prototype.build = function(images_path) {
      var bg_position, css_path, i, image, _i, _len, _ref;
      css_path = path.resolve("" + images_path + "/../sprites");
      if (path.existsSync(css_path) === false) {
        fs.mkdirSync(css_path);
      }
      bg_position = 0;
      _ref = this.images;
      for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
        image = _ref[i];
        bg_position -= parseInt(image.width);
        this.file_text += ".sprite-" + i + "\n{\n";
        this.file_text += "	background-image:url('" + this.name + ".png');\n";
        this.file_text += "	background-position: " + bg_position + "px; \n";
        this.file_text += "	width: " + image.width + "px; \n";
        this.file_text += "	width: " + image.height + "px; \n";
        this.file_text += "	display: block; \n";
        this.file_text += "}\n\n";
      }
      return fs.writeFileSync("" + css_path + "/" + this.name + ".css", this.file_text);
    };

    return StyleBuilder;

  })();

  fs = require("fs");

  program = require("commander");

  __t('app').Main = (function() {

    Main.prototype.folder = "";

    Main.prototype.name = "sprite";

    function Main() {
      this.generate_sprite = __bind(this.generate_sprite, this);

      this.generate_style = __bind(this.generate_style, this);

    }

    Main.prototype.generate = function(folder, name) {
      this.folder = folder;
      this.name = name;
      this.folder = path.resolve(this.folder);
      this.files = new app.utils.Files(this.folder);
      this.files.bind("complete", this.generate_style);
      return this.files.bind("complete", this.generate_sprite);
    };

    Main.prototype.generate_style = function(images) {
      this.style = new app.build.StyleBuilder(images, this.name);
      return this.style.build(this.folder);
    };

    Main.prototype.generate_sprite = function(images) {
      this.sprite = new app.build.SpriteBuilder(images, this.name);
      return this.sprite.build(this.folder);
    };

    return Main;

  })();

  module.exports = app.Main;

}).call(this);

