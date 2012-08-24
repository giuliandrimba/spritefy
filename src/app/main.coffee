#<< app/build/sprite_builder
#<< app/build/style_builder
#<< app/build/plugin_builder
#<< app/utils/images_filter

fs = require "fs"
program = require "commander"
path = require "path"

class Main

	folder:""
	name:"sprite"
	builds_concluded:0
	min:false
	messages:
		success:"Spritesheet and Stylesheet generation completed!"

	constructor:->
		
	generate:(@folder,@name,@at,@callback)->

		@folder = path.resolve @folder

		@at = path.resolve @at

		fs.mkdirSync @at if !path.existsSync(@at)

		@images_filter = new app.utils.ImagesFilter @folder
		@images_filter.bind("complete",@generate_style)
		@images_filter.bind("complete",@generate_sprite)
		@generate_jquery_plugin()

	generate_style:(images)=>
		@style = new app.build.StyleBuilder images, @name, @at
		@style.build @folder, @build_finished

	generate_sprite:(images)=>
		@sprite = new app.build.SpriteBuilder images, @name, @at
		@sprite.build @folder, @build_finished

	generate_jquery_plugin:->
		@plugin = new app.build.PluginBuilder @at
		@plugin.build()

	build_finished:=>
		++@builds_concluded

		if @builds_concluded >= 2
			console.log @messages.success
			@callback?()


module.exports = app.Main;