#<< app/build/sprite_builder
#<< app/build/style_builder
#<< app/build/plugin_builder
#<< app/utils/images_filter

fs = require "fs"
program = require "commander"

class Main

	folder:""
	name:"sprite"
	builds_concluded:0
	min:false
	messages:
		success:"Spritesheet and Stylesheet generation completed!"

	constructor:->
		
	generate:(@folder,@name,@min,quality)->

		@folder = path.resolve(@folder)
		@images_filter = new app.utils.ImagesFilter @folder
		@images_filter.bind("complete",@generate_style)
		@images_filter.bind("complete",@generate_sprite)
		@generate_jquery_plugin()

	generate_style:(images)=>
		@style = new app.build.StyleBuilder(images,@name,@min)
		@style.build @folder, @build_finished

	generate_sprite:(images)=>
		@sprite = new app.build.SpriteBuilder(images,@name)
		@sprite.build @folder, @build_finished

	generate_jquery_plugin:->
		@plugin = new app.build.PluginBuilder
		@plugin.build()

	build_finished:=>
		++@builds_concluded

		if @builds_concluded >= 2
			console.log @messages.success


module.exports = app.Main;