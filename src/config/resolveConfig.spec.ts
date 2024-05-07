import type { GeneratorOptions } from '@prisma/generator-helper'
import { describe, expect, test } from 'vitest'
import { resolveConfig } from './resolveConfig.js'

test('default config', () => {
	const options = {
		generator: {
			config: {},
			output: { value: '/path/to/output' },
		},
		schemaPath: '/path/to/schema.prisma',
	} as GeneratorOptions
	expect(resolveConfig(options)).toEqual({
		output: '/path/to/output',
		inputBasePath: '/path/to',
		templates: '/path/to/templates',
		partials: '/path/to/partials',
		helpers: '/path/to/helpers.js',
		options: '/path/to/options.js',
	})
})

describe('custom config', () => {
	test('with relative path', () => {
		const options = {
			generator: {
				config: {
					inputBasePath: 'custom/base',
					templates: 'custom/templates',
					partials: 'custom/partials',
					helpers: 'custom/helpers.js',
					options: 'custom/options.js',
				} as Record<string, string>,
				output: { value: '/path/to/custom/output' },
			},
			schemaPath: '/path/to/schema.prisma',
		} as GeneratorOptions
		expect(resolveConfig(options)).toEqual({
			output: '/path/to/custom/output',
			inputBasePath: '/path/to/custom/base',
			templates: '/path/to/custom/base/custom/templates',
			partials: '/path/to/custom/base/custom/partials',
			helpers: '/path/to/custom/base/custom/helpers.js',
			options: '/path/to/custom/base/custom/options.js',
		})
	})

	test('with absolute path', () => {
		const options = {
			generator: {
				config: {
					inputBasePath: '/custom/base',
					templates: '/custom/templates',
					partials: 'custom/partials',
					helpers: '/custom/helpers.js',
					options: 'custom/options.js',
				} as Record<string, string>,
				output: { value: '/path/to/custom/output' },
			},
			schemaPath: '/path/to/schema.prisma',
		} as GeneratorOptions
		expect(resolveConfig(options)).toEqual({
			output: '/path/to/custom/output',
			inputBasePath: '/custom/base',
			templates: '/custom/templates',
			partials: '/custom/base/custom/partials',
			helpers: '/custom/helpers.js',
			options: '/custom/base/custom/options.js',
		})
	})
})
