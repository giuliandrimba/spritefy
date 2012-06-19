#<< app/utils/pubsub

fs = require "fs"
easyimage = require "easyimage"

class Files

	folder_path=""
	images:[]
	pubsub: new app.utils.PubSub;
	count = 0

	constructor:(@folder_path)->
		@get_images()

	get_images:->

		pattern = new RegExp ".*(jpg|png|gif)$"

		fs.readdir @folder_path, (err, files)=>

			throw err if err

			for file, i in files

				is_image = pattern.test file

				if is_image
					@images.push {file:"#{@folder_path}/#{file}"}

			@setup_images =>
				@pubsub.trigger("complete",@images)

	setup_images:(callback)->

		easyimage.info @images[count].file, (err, file)=>

			throw err if err

			(img = @images[count]).width = parseInt file.width
			img.height = parseInt file.height
			img.size = file.size
			img.type = file.type
			img.file = "#{@folder_path}/#{file.name}"

			return @setup_images callback if ++count < @images.length
			
			callback() if count >= @images.length

	bind:(event, callback)=>
		@pubsub.bind(event, callback)
	
	trigger:(event)=>
		@pubsub.trigger(event)