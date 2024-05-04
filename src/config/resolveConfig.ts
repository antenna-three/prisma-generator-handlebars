import { resolve } from 'node:path'
import type { GeneratorOptions } from '@prisma/generator-helper'
import defaultConfig from './defaultConfig.json' assert { type: 'json' }

export type Config = typeof defaultConfig

const { output: defaultOutput, ...defaultInputConfig } = defaultConfig

export function resolveConfig(options: GeneratorOptions): Config {
	const inputConfig = resolveInputConfig(options)
	const output = options.generator.output?.value ?? defaultOutput
	return { ...inputConfig, output }
}

function resolveInputConfig(options: GeneratorOptions): Omit<Config, 'output'> {
	const { inputBasePath, ...requiredConfig } = mapValues(
		defaultInputConfig,
		(value, key) => first(options.generator.config[key]) ?? value,
	)
	const absoluteBasePath = resolve(options.schemaPath, '..', inputBasePath)
	const absoluteConfig = mapValues(requiredConfig, (value) =>
		resolve(absoluteBasePath, value),
	)
	return { ...absoluteConfig, inputBasePath: absoluteBasePath }
}

function mapValues<K extends string, T, U>(
	object: Record<K, T>,
	mapper: (value: T, key: string) => U,
): Record<K, U> {
	return Object.fromEntries(
		Object.entries<T>(object).map(([key, value]) => [key, mapper(value, key)]),
	) as Record<K, U>
}

function first(config: string | string[] | undefined): string | undefined {
	if (Array.isArray(config)) {
		return config[0]
	}
	return config
}
