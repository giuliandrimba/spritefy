fs = require "fs"
path = require "path"

class app.build.StyleBuilder

	images: []
	name: ""
	min:false
	file_text: ""
	file_text_min: ""
	css_path:"css"
	steps:0
	step_count:0
	animation_time:1

	constructor:(@images,@name, @at)->

	build:(images_path, callback)=>
		css_path = path.resolve "sprites"
		css_path = path.resolve @at, "sprites" if @at

		if path.existsSync(css_path) is false
			fs.mkdirSync css_path

		@generate_animation "webkit"
		@generate_animation "moz"

		@animation_time = (@images.length*1)/30

		@file_text += """\n
		.#{@name}
		{
			background-image:url('#{@name}.png');
			display: block;
			width:#{@images[0].width}px;
			height:#{@images[0].height}px;
		}

		.#{@name}-animation
		{
			background-image:url('#{@name}.png');
			display: block;
			width:#{@images[0].width}px;
			height:#{@images[0].height}px;
			-moz-animation-duration: #{@animation_time}s;
			-moz-animation-name: #{@name};
			-moz-animation-timing-function: step-end;
			-moz-animation-iteration-count:infinite;
			-moz-animation-fill-mode: backwards;
			-webkit-animation-duration: #{@animation_time}s;
			-webkit-animation-name: #{@name};
			-webkit-animation-timing-function: step-end;
			-webkit-animation-iteration-count:infinite;
			-webkit-animation-fill-mode: backwards;
		}

		"""

		@file_text_min += ".#{@name} {background-image:url('#{@name}.png');display: block;width:#{@images[0].width}px;height:#{@images[0].height}px;}.#{@name}-animation{background-image:url('#{@name}.png');display: block;width:#{@images[0].width}px;height:#{@images[0].height}px;-moz-animation-duration: #{@animation_time}s;-moz-animation-name: #{@name};-moz-animation-timing-function: step-end;-moz-animation-iteration-count:infinite;-moz-animation-fill-mode: backwards;-webkit-animation-duration: #{@animation_time}s;-webkit-animation-name: #{@name};-webkit-animation-timing-function: step-end;-webkit-animation-iteration-count:infinite;-webkit-animation-fill-mode: backwards;}"

		fs.writeFileSync "#{css_path}/#{@name}.css", @file_text
		fs.writeFileSync "#{css_path}/#{@name}-compressed.css", @file_text_min

		callback() if callback

	generate_animation:(vendor)=>

		bg_position = 0
		@steps = (100 / @images.length)
		first_image = @images[0]
		last_image = @images[@images.length-1]

		@file_text += "@-#{vendor}-keyframes #{@name}\n"
		@file_text += "{"

		@file_text_min += "@-#{vendor}-keyframes #{@name}{"

		for image, i in @images

			@file_text += @step(@step_count,image,bg_position)
			@file_text_min += @step(@step_count,image,bg_position,true)

			bg_position -= parseInt image.width
			@step_count += @steps

		@file_text += @step(100,last_image,bg_position+last_image.width)
		@file_text_min += @step(100,last_image,bg_position+last_image.width,true)

		@file_text += "\n}\n"
		@file_text_min += "}"
		@step_count = 0


	step:(step, image, position, min)=>
		if min
			file_text = "#{step}%{background-position: #{position}px;width: #{image.width}px;height: #{image.height}px;}"
		else
			file_text = """\n
					#{step}%
					{
						background-position: #{position}px;
					}
				""".replace /(^)(.*)$/gm, "\t$1$2"
		
		file_text
