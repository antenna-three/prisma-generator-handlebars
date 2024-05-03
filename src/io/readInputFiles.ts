import { readFile, readdir } from 'node:fs/promises'
import { resolve } from 'node:path'
import { relative } from 'node:path'
import type { HelperDeclareSpec, RuntimeOptions, compile } from 'handlebars'
import type { Config } from '../config/resolveConfig.js'

export interface Input {
	templates: Record<string, string>
	partials: Record<string, string>
	helpers: HelperDeclareSpec
	options: HandlebarsOptions
}

interface HandlebarsOptions {
	compileOptions: Parameters<typeof compile>[1]
	runtimeOptions: RuntimeOptions
}

export async function readInputFiles(config: Config): Promise<Input> {
	const [templates, partials, helpers, options] = await Promise.all([
		readFilesRecursively(config.templates).catch(
			continueWithWarning('templates'),
		),
		readFilesRecursively(config.partials).catch(
			continueWithWarning('partials'),
		),
		import(config.helpers).catch(continueWithWarning('custom helpers')),
		import(config.options).catch(continueWithWarning('handlebars options'))
	])
	return { templates, partials, helpers, options }
}

async function readFilesRecursively(
	path: string,
): Promise<Record<string, string>> {
	const entries = await readdir(path, { withFileTypes: true, recursive: true })
	const files = entries.filter((entry) => entry.isFile())
	return Object.fromEntries(
		await Promise.all(
			files.map(async (file) => {
				const fullPath = resolve(file.path, file.name)
				const relativePath = relative(path, fullPath)
				return [relativePath, await readFile(fullPath, { encoding: 'utf8' })]
			}),
		),
	)
}

function continueWithWarning(
	target: string,
): (error: unknown) => Record<string, never> {
	return (error) => {
		const reset = '\u001b[0m'
		const faint = '\u001b[2m'
		const yellow = '\u001b[33m'
		console.log(`${yellow}No ${target} are registered:${reset}`)
		console.log(
			`${faint}${error instanceof Error ? error.message : error}${reset}`,
		)
		return {}
	}
}
