#<< app/utils/pubsub

fs = require "fs"
easyimage = require "easyimage"

class ImagesFilter

	folder_path=""
	images:[]
	pubsub: new app.utils.PubSub;
	count = 0
	error_messages:
		not_found:"ERROR: Images not found in the folder"

	constructor:(@folder_path)->
		@get_images()

	get_images:->

		only_images = new RegExp ".*(jpg|png|gif)$"

		fs.readdir @folder_path, (err, files)=>

			throw err if err

			for file, i in files

				is_image = only_images.test file

				if is_image
					@images.push {file:"#{@folder_path}/#{file}"}

			if @images.length > 0
				@setup_images =>
					@pubsub.trigger("complete",@images)
			else
				console.log @error_messages.not_found

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