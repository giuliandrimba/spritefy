fs = require "fs"
path = require "path"

class StyleBuilder

	images: []
	name: ""
	file_text: ""
	css_path:"css"
	steps:0
	step_count:0

	constructor:(@images,@name)->

	build:(images_path)=>
		css_path = path.resolve("#{images_path}/../sprites")

		if path.existsSync(css_path) is false
			fs.mkdirSync css_path

		bg_position = 0
		@steps = Math.floor((100 / @images.length) + 1)

		@file_text += "@-webkit-keyframes #{@name}\n"
		@file_text += "{"

		for image, i in @images
			@file_text += """\n
				#{@step_count}%
				{
					background-position: #{bg_position}px;
					width: #{image.width}px;
					height: #{image.height}px;
					display: block;
				}
			""".replace /(^)(.*)$/gm, "\t$1$2"

			bg_position -= parseInt image.width
			@step_count += @steps

		@file_text += "\n}\n"

		@file_text += ".#{@name}\n"
		@file_text += "{\n"
		@file_text += "	-webkit-animation-duration: 1s;\n"
		@file_text += "	-webkit-animation-name: #{@name};\n"
		@file_text += "	-webkit-animation-iteration-count: infinite;\n"
		@file_text += "	-webkit-animation-timing-function: step-end;\n"
		@file_text += "	background-image:url('#{@name}.png');\n"
		@file_text += "	display: block;\n"
		@file_text += "}\n"

		fs.writeFileSync "#{css_path}/#{@name}.css", @file_text