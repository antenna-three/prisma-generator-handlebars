import * as changeCase from 'change-case'
import handlebars from 'handlebars'
import pluralize from 'pluralize'
import type { Input } from './io/readInputFiles.js'

export function generate(input: Input, context: unknown): Map<string, string> {
	handlebars.registerPartial(Object.fromEntries(input.partials))
	handlebars.registerHelper({ pluralize, ...changeCase, ...input.helpers })
	return [...input.templates.entries()].reduce((map, [path, template]) => {
		const outputPath = path.replace(/.handlebars$/, '')
		const generate = handlebars.compile(template, input.options.compileOptions)
		return map.set(outputPath, generate(context, input.options.runtimeOptions))
	}, new Map())
}
