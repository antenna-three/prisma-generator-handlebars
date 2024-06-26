import helper from '@prisma/generator-helper'
import defaultConfig from './config/defaultConfig.json' with { type: 'json' }
import { resolveConfig } from './config/resolveConfig.js'
import { generate } from './generate.js'
import { readInputFiles } from './io/readInputFiles.js'
import { writeFiles } from './io/writeFiles.js'

Error.stackTraceLimit = 2

helper.generatorHandler({
	onManifest(generator) {
		const reset = '\u001b[0m'
		const bold = '\u001b[1m'
		return {
			defaultOutput: defaultConfig.output,
			prettyName: `${generator.name}${reset} provided by ${bold}prisma-generator-handlebars`,
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
			// Printing error stack traces to stdout because Prisma does not
			// print stack traces and stderr is used to communicate with Prisma.
			console.log(e)
			throw e
		}
	},
})
