#<< app/utils/pubsub

exec = require("child_process").exec

class SpriteBuilder

	images: []
	name: ""
	file_text: ""
	sprite_path:""
	files_path:[]
	files_list:[]
	pubsub:new app.utils.PubSub

	constructor:(@images, @name)->

		for image in @images
			@files_path.push image.file

		@list_files = @files_path.join(" ")

	build:(images_path)=>
		@sprite_path = path.resolve("#{images_path}/../sprites")

		if path.existsSync("#{@sprite_path}/#{@name}.png")
			fs.unlink "#{@sprite_path}/#{@name}.png"

		cmd = "convert #{@list_files} +append #{@sprite_path}/#{@name}.png";
		exec cmd, (err, stdout, stderr)=>
			throw err if err
			
			# @pubsub.trigger("complete")