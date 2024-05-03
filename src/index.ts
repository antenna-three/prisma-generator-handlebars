import helper from '@prisma/generator-helper'
import defaultConfig from './config/defaultConfig.json' assert { type: 'json' }
import { resolveConfig } from './config/resolveConfig.js'
import { generate } from './generate.js'
import { readInputFiles } from './io/readInputFiles.js'
import { writeFiles } from './io/writeFiles.js'
import { throwWithStack } from './utils/throwWithStack.js'

helper.generatorHandler({
	onManifest() {
		return {
			defaultOutput: defaultConfig.output,
			prettyName: 'Prisma Handlebars generator',
			version: process.env.npm_package_version,
		}
	},
	async onGenerate(options) {
		try {
			const config = resolveConfig(options)
			const input = await readInputFiles(config)
			const outputs = generate(input, options.dmmf)
			await writeFiles(config.output, outputs)
		} catch (e) {
			throwWithStack(e)
		}
	},
})
