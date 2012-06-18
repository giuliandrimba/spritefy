fs = require "fs"
path = require "path"

class StyleBuilder

	images: []
	name: ""
	file_text: ""
	css_path:"css"

	constructor:(@images,@name)->

	build:(images_path)=>
		css_path = path.resolve("#{images_path}/../sprites")

		if path.existsSync(css_path) is false
			fs.mkdirSync css_path

		bg_position = 0

		for image, i in @images
			bg_position -= parseInt image.width
			@file_text += ".sprite-#{i}\n{\n"
			@file_text += "	background-image:url('#{@name}.png');\n"
			@file_text += "	background-position: #{bg_position}px; \n"
			@file_text += "	width: #{image.width}px; \n"
			@file_text += "	width: #{image.height}px; \n"
			@file_text += "	display: block; \n"
			@file_text += "}\n\n"

		fs.writeFileSync "#{css_path}/#{@name}.css", @file_text