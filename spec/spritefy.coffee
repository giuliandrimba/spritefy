vows = require "vows"
assert = require "assert"
path = require("path")
fs = require("fs")

lib = path.join(path.dirname(fs.realpathSync(__filename)), '../lib')
img = path.join __dirname, "img"
dest = path.join __dirname, "dest"

Spritefy = require(lib + '/spritefy')

suite = vows.describe "Spritefy"

suite.addBatch(
	"A new spritesheet":
		topic:()->
			sprite = new Spritefy 
			sprite.generate "images", "victor", false, "test", ()=>
				@callback()

			undefined

		"should build at right folder":(msg)->
			
			folder = path.resolve __dirname, "test"

			tree = (folder)->
				obj = []
				for file,i in fs.readdirSync folder
					file_path = path.resolve folder, file
					if (fs.statSync(file_path).isDirectory())
						dir = {}
						dir[file] = tree file_path
						obj[i] = dir
					else
						obj[i] = file
				obj

			test = tree "test"
			template = tree "template"

			assert.deepEqual test, template



).export module