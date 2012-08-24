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
			sprite.generate "images", "victor", "test", ()=>
				@callback()

			undefined

		"should build at right folder":(topic)->
			
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

		"should build right the stylesheet":(topic)->

			tmpl_styl_path = path.resolve __dirname, "template/sprites/victor.css"
			test_styl_path = path.resolve __dirname, "test/sprites/victor.css"

			tmpl_styl = fs.readFileSync tmpl_styl_path, "utf8"
			test_styl = fs.readFileSync tmpl_styl_path, "utf8"

			assert.equal tmpl_styl, test_styl


).export module