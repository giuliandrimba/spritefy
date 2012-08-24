util = require "util"
path = require "path"
fs = require "fs"

class PluginBuilder

	plugin_file:path.join(path.dirname(fs.realpathSync(__filename)), '../spritefy-animation/jquery.spritefy.js')
	plugin_file_min:path.join(path.dirname(fs.realpathSync(__filename)), '../spritefy-animation/jquery.spritefy.min.js')

	new_path:path.resolve("scripts/")

	constructor:(@at)->
		@new_path = path.resolve @at, "scripts" if @at

	build:->

		if path.existsSync(@new_path) is false
			fs.mkdirSync @new_path

		copyFileSync(@plugin_file, "#{@new_path}/jquery.spritefy.js")
		copyFileSync(@plugin_file_min, "#{@new_path}/jquery.spritefy.min.js")

	copyFileSync = (srcFile, destFile) ->
		BUF_LENGTH = 64*1024
		buff = new Buffer(BUF_LENGTH)
		fdr = fs.openSync(srcFile, 'r')
		fdw = fs.openSync(destFile, 'w')
		bytesRead = 1
		pos = 0
		while bytesRead > 0
			bytesRead = fs.readSync(fdr, buff, 0, BUF_LENGTH, pos)
			fs.writeSync(fdw,buff,0,bytesRead)
			pos += bytesRead
		fs.closeSync(fdr)
		fs.closeSync(fdw)