import type { Template } from 'handlebars'

declare module 'handlebars' {
	// fixes invalid type declaration
	export function registerPartial(spec: { [name: string]: Template }): void
}
