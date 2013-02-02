easyimage = require "easyimage"
path = require "path"

class app.build.SpriteBuilder

	images: []
	name: ""
	file_text: ""
	sprite_path:""
	files_path:[]
	files_list:[]

	constructor:(@images, @name, @at)->

		for image in @images
			@files_path.push image.file

		@list_files = @files_path.join(" ")

	build:(images_path, callback)=>
		@sprite_path = path.resolve("sprites/")
		@sprite_path = path.resolve @at, "sprites" if @at

		if path.existsSync("#{@sprite_path}/#{@name}.png")
			fs.unlink "#{@sprite_path}/#{@name}.png"

		cmd = "convert #{@list_files} -transparent white -background None +append #{@sprite_path}/#{@name}.png";

		easyimage.exec cmd, (err, stdout, stdin)=>
			throw err if err

			callback() if callback