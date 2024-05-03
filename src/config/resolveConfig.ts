import { resolve } from 'node:path'
import type { GeneratorOptions } from '@prisma/generator-helper'
import { mapEntries } from '../utils/mapEntries.js'
import defaultConfig from './defaultConfig.json' assert { type: 'json' }

export type Config = typeof defaultConfig

const { output: defaultOutput, ...defaultInputConfig } = defaultConfig

export function resolveConfig(options: GeneratorOptions): Config {
	const inputConfig = resolveInputConfig(options)
	const output = options.generator.output?.value ?? defaultOutput
	return { ...inputConfig, output }
}

function resolveInputConfig(options: GeneratorOptions): Omit<Config, 'output'> {
	const { inputBasePath, ...restConfig } = mapEntries(
		defaultInputConfig,
		([key, value]) => [key, first(options.generator.config[key]) ?? value],
	)
	const resolvedBasePath = resolve(options.schemaPath, '..', inputBasePath)
	const resolvedConfig = mapEntries(restConfig, ([key, value]) => [
		key,
		resolve(resolvedBasePath, value),
	])
	return { ...resolvedConfig, inputBasePath: resolvedBasePath }
}

function first(config: string | string[] | undefined): string | undefined {
	if (Array.isArray(config)) {
		return config[0]
	}
	return config
}
