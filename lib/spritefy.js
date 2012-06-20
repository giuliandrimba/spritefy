
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
  var easyimage, fs, path, program,
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

  easyimage = require("easyimage");

  __t('app.build').SpriteBuilder = (function() {

    SpriteBuilder.prototype.images = [];

    SpriteBuilder.prototype.name = "";

    SpriteBuilder.prototype.file_text = "";

    SpriteBuilder.prototype.sprite_path = "";

    SpriteBuilder.prototype.files_path = [];

    SpriteBuilder.prototype.files_list = [];

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

    SpriteBuilder.prototype.build = function(images_path, callback) {
      var cmd,
        _this = this;
      this.sprite_path = path.resolve("" + images_path + "/../sprites");
      if (path.existsSync("" + this.sprite_path + "/" + this.name + ".png")) {
        fs.unlink("" + this.sprite_path + "/" + this.name + ".png");
      }
      cmd = "convert " + this.list_files + " -transparent white -background None +append " + this.sprite_path + "/" + this.name + ".png";
      return easyimage.exec(cmd, function(err, stdout, stdin) {
        if (err) {
          throw err;
        }
        if (callback) {
          return callback();
        }
      });
    };

    return SpriteBuilder;

  })();

  fs = require("fs");

  path = require("path");

  __t('app.build').StyleBuilder = (function() {

    StyleBuilder.prototype.images = [];

    StyleBuilder.prototype.name = "";

    StyleBuilder.prototype.min = false;

    StyleBuilder.prototype.file_text = "";

    StyleBuilder.prototype.css_path = "css";

    StyleBuilder.prototype.steps = 0;

    StyleBuilder.prototype.step_count = 0;

    StyleBuilder.prototype.animation_time = 1;

    function StyleBuilder(images, name, min) {
      this.images = images;
      this.name = name;
      this.min = min;
      this.step = __bind(this.step, this);

      this.generate_animation = __bind(this.generate_animation, this);

      this.build = __bind(this.build, this);

    }

    StyleBuilder.prototype.build = function(images_path, callback) {
      var css_path;
      css_path = path.resolve("" + images_path + "/../sprites");
      if (path.existsSync(css_path) === false) {
        fs.mkdirSync(css_path);
      }
      this.generate_animation("webkit");
      this.generate_animation("moz");
      this.animation_time = (this.images.length * 1) / 30;
      if (this.min === false) {
        this.file_text += "\n\n." + this.name + "\n{\n	-moz-animation-duration: " + this.animation_time + "s;\n	-moz-animation-name: " + this.name + ";\n	-moz-animation-timing-function: step-end;\n	-moz-animation-iteration-count:once;\n	-moz-animation-fill-mode: forwards;\n	-webkit-animation-duration: " + this.animation_time + "s;\n	-webkit-animation-name: " + this.name + ";\n	-webkit-animation-timing-function: step-end;\n	-webkit-animation-iteration-count:once;\n	-webkit-animation-fill-mode: forwards;\n	background-image:url('" + this.name + ".png');\n	display: block;\n	width:" + this.images[0].width + "px;\n	height:" + this.images[0].height + "px;\n}\n\n." + this.name + "-pause\n{\n	-webkit-animation-play-state:paused;\n	-moz-animation-play-state:paused;\n}\n\n." + this.name + "-play\n{\n	-webkit-animation-play-state:running;\n	-moz-animation-play-state:running;\n}\n";
      } else {
        this.file_text += "." + this.name + "{-moz-animation-duration: " + this.animation_time + "s;-moz-animation-name: " + this.name + ";-moz-animation-timing-function: step-end;-moz-animation-iteration-count:once;-moz-animation-fill-mode: forwards;-webkit-animation-duration: " + this.animation_time + "s;-webkit-animation-name: " + this.name + ";	-webkit-animation-timing-function: step-end;-webkit-animation-iteration-count:once;-webkit-animation-fill-mode: forwards;background-image:url('" + this.name + ".png');display: block;width:" + this.images[0].width + "px;height:" + this.images[0].height + "px;}." + this.name + "-pause{-webkit-animation-play-state:paused;-moz-animation-play-state:paused;}." + this.name + "-play{-webkit-animation-play-state:running;-moz-animation-play-state:running;}";
      }
      fs.writeFileSync("" + css_path + "/" + this.name + ".css", this.file_text);
      if (callback) {
        return callback();
      }
    };

    StyleBuilder.prototype.generate_animation = function(vendor) {
      var bg_position, first_image, i, image, last_image, _i, _len, _ref;
      bg_position = 0;
      this.steps = 100 / this.images.length;
      first_image = this.images[0];
      last_image = this.images[this.images.length - 1];
      this.file_text += "@-" + vendor + "-keyframes " + this.name + "\n";
      this.file_text += "{";
      _ref = this.images;
      for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
        image = _ref[i];
        this.file_text += this.step(this.step_count, image, bg_position);
        bg_position -= parseInt(image.width);
        this.step_count += this.steps;
      }
      this.file_text += this.step(100, last_image, bg_position + last_image.width);
      this.file_text += "\n}\n";
      return this.step_count = 0;
    };

    StyleBuilder.prototype.step = function(step, image, position) {
      var file_text;
      if (this.min) {
        file_text = "" + step + "%{background-position: " + position + "px;width: " + image.width + "px;height: " + image.height + "px;}";
      } else {
        file_text = ("\n\n" + step + "%\n{\n	background-position: " + position + "px;\n	width: " + image.width + "px;\n	height: " + image.height + "px;\n}").replace(/(^)(.*)$/gm, "\t$1$2");
      }
      return file_text;
    };

    return StyleBuilder;

  })();

  fs = require("fs");

  easyimage = require("easyimage");

  __t('app.utils').ImagesFilter = (function() {
    var count, folder_path;

    folder_path = "";

    ImagesFilter.prototype.images = [];

    ImagesFilter.prototype.pubsub = new app.utils.PubSub;

    count = 0;

    ImagesFilter.prototype.error_messages = {
      not_found: "ERROR: Images not found in the folder"
    };

    function ImagesFilter(folder_path) {
      this.folder_path = folder_path;
      this.trigger = __bind(this.trigger, this);

      this.bind = __bind(this.bind, this);

      this.get_images();
    }

    ImagesFilter.prototype.get_images = function() {
      var only_images,
        _this = this;
      only_images = new RegExp(".*(jpg|png|gif)$");
      return fs.readdir(this.folder_path, function(err, files) {
        var file, i, is_image, _i, _len;
        if (err) {
          throw err;
        }
        for (i = _i = 0, _len = files.length; _i < _len; i = ++_i) {
          file = files[i];
          is_image = only_images.test(file);
          if (is_image) {
            _this.images.push({
              file: "" + _this.folder_path + "/" + file
            });
          }
        }
        if (_this.images.length > 0) {
          return _this.setup_images(function() {
            return _this.pubsub.trigger("complete", _this.images);
          });
        } else {
          return console.log(_this.error_messages.not_found);
        }
      });
    };

    ImagesFilter.prototype.setup_images = function(callback) {
      var _this = this;
      return easyimage.info(this.images[count].file, function(err, file) {
        var img;
        if (err) {
          throw err;
        }
        (img = _this.images[count]).width = parseInt(file.width);
        img.height = parseInt(file.height);
        img.size = file.size;
        img.type = file.type;
        img.file = "" + _this.folder_path + "/" + file.name;
        if (++count < _this.images.length) {
          return _this.setup_images(callback);
        }
        if (count >= _this.images.length) {
          return callback();
        }
      });
    };

    ImagesFilter.prototype.bind = function(event, callback) {
      return this.pubsub.bind(event, callback);
    };

    ImagesFilter.prototype.trigger = function(event) {
      return this.pubsub.trigger(event);
    };

    return ImagesFilter;

  })();

  fs = require("fs");

  program = require("commander");

  __t('app').Main = (function() {

    Main.prototype.folder = "";

    Main.prototype.name = "sprite";

    Main.prototype.builds_concluded = 0;

    Main.prototype.min = false;

    Main.prototype.messages = {
      success: "Spritesheet and Stylesheet generation completed!"
    };

    function Main() {
      this.build_finished = __bind(this.build_finished, this);

      this.generate_sprite = __bind(this.generate_sprite, this);

      this.generate_style = __bind(this.generate_style, this);

    }

    Main.prototype.generate = function(folder, name, min) {
      this.folder = folder;
      this.name = name;
      this.min = min;
      this.folder = path.resolve(this.folder);
      this.images_filter = new app.utils.ImagesFilter(this.folder);
      this.images_filter.bind("complete", this.generate_style);
      return this.images_filter.bind("complete", this.generate_sprite);
    };

    Main.prototype.generate_style = function(images) {
      this.style = new app.build.StyleBuilder(images, this.name, this.min);
      return this.style.build(this.folder, this.build_finished);
    };

    Main.prototype.generate_sprite = function(images) {
      this.sprite = new app.build.SpriteBuilder(images, this.name);
      return this.sprite.build(this.folder, this.build_finished);
    };

    Main.prototype.build_finished = function() {
      ++this.builds_concluded;
      if (this.builds_concluded >= 2) {
        return console.log(this.messages.success);
      }
    };

    return Main;

  })();

  module.exports = app.Main;

}).call(this);

