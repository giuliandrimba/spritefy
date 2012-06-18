#<< app/build/sprite_builder
#<< app/build/style_builder
#<< app/utils/files

fs = require "fs"
program = require "commander"

class Main

	folder:""
	name:"sprite"

	constructor:->

		
	generate:(@folder,@name)->
		@folder = path.resolve(@folder)
		@files = new app.utils.Files @folder
		@files.bind("complete",@generate_style)
		@files.bind("complete",@generate_sprite)

	generate_style:(images)=>
		@style = new app.build.StyleBuilder(images,@name)
		@style.build @folder

	generate_sprite:(images)=>
		@sprite = new app.build.SpriteBuilder(images,@name)
		@sprite.build @folder

module.exports = app.Main;