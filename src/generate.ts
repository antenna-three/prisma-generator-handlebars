import * as changeCase from 'change-case'
import handlebars from 'handlebars'
import pluralize from 'pluralize'
import type { Input } from './io/readInputFiles.js'
import { mapEntries } from './utils/mapEntries.js'

type Output = Record<string, string>

export function generate(input: Input, context: unknown): Output {
	handlebars.registerPartial(input.partials)
	handlebars.registerHelper({ pluralize, ...changeCase, ...input.helpers })
	return mapEntries(input.templates, ([path, template]) => {
		const outputPath = path.replace(/.handlebars$/, '')
		const generate = handlebars.compile(template, input.options.compileOptions)
		return [outputPath, generate(context, input.options.runtimeOptions)]
	})
}
