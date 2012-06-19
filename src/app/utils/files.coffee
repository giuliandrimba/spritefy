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

			@setup_images(=>
				@pubsub.trigger("complete",@images)
				)

	setup_images:(callback)->

		easyimage.info @images[count].file, (err, file)=>

			throw err if err

			@images[count].width = parseInt file.width
			@images[count].height = parseInt file.height
			@images[count].size = file.size
			@images[count].type = file.type
			@images[count].file = "#{@folder_path}/#{file.name}"

			count++

			if count < @images.length
				@setup_images(callback)
				return

			callback() if count >= @images.length

	bind:(event, callback)=>
		@pubsub.bind(event, callback)
	
	trigger:(event)=>
		@pubsub.trigger(event)