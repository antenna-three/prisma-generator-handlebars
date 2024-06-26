import { readFile, readdir, readlink } from 'node:fs/promises'
import { resolve } from 'node:path'
import { relative } from 'node:path'
import type { HelperDeclareSpec, RuntimeOptions, compile } from 'handlebars'
import type { Config } from '../config/resolveConfig.js'

export interface Input {
	templates: Map<string, string>
	partials: Map<string, string>
	helpers: HelperDeclareSpec
	options: HandlebarsOptions
}

interface HandlebarsOptions {
	compileOptions?: Parameters<typeof compile>[1]
	runtimeOptions?: RuntimeOptions
}

export async function readInputFiles(config: Config): Promise<Input> {
	const [templates, partials, helpers, options] = await Promise.all([
		readTemplates(config.templates),
		readPartials(config.partials),
		importHelpers(config.helpers),
		importOptions(config.options),
	])
	return { templates, partials, helpers, options }
}

async function readTemplates(path: string): Promise<Map<string, string>> {
	try {
		return await readFilesRecursively(path)
	} catch (e) {
		warn('No templates are registered', e)
		return new Map<string, never>()
	}
}

async function readPartials(path: string): Promise<Map<string, string>> {
	try {
		return await readFilesRecursively(path)
	} catch (e) {
		warn('No partials are registered', e)
		return new Map<string, never>()
	}
}

async function importHelpers(path: string): Promise<HelperDeclareSpec> {
	try {
		return await import(path)
	} catch (e) {
		warn('No helpers are registered', e)
		return {}
	}
}

async function importOptions(path: string): Promise<HandlebarsOptions> {
	try {
		return await import(path)
	} catch (e) {
		warn('No handlebars options are set', e)
		return {}
	}
}

async function readFilesRecursively(
	path: string,
): Promise<Map<string, string>> {
	const entries = await readdir(path, { withFileTypes: true, recursive: true })
	const filePaths = entries
		.filter((entry) => entry.isFile())
		.map((file) => {
			const filePath = resolve(file.path, file.name)
			const entryPath = relative(path, filePath)
			return { filePath, entryPath }
		})
	const symbolicLinkPaths = await Promise.all(
		entries
			.filter((entry) => entry.isSymbolicLink())
			.map(async (link) => {
				const linkFullPath = resolve(link.path, link.name)
				const linkReference = await readlink(linkFullPath)
				const filePath = resolve(link.path, linkReference)
				const entryPath = relative(path, linkFullPath)
				return { filePath, entryPath }
			}),
	)
	const paths = [...filePaths, ...symbolicLinkPaths]
	return new Map(
		await Promise.all(
			paths.map(async ({ filePath, entryPath }) => {
				const content = await readFile(filePath, { encoding: 'utf8' })
				return [entryPath, content] as const
			}),
		),
	)
}

function warn(target: string, error: unknown): void {
	const reset = '\u001b[0m'
	const faint = '\u001b[2m'
	const yellow = '\u001b[33m'
	console.log(`${yellow}${target}:${reset}`)
	console.log(
		`${faint}${error instanceof Error ? error.message : error}${reset}`,
	)
}
