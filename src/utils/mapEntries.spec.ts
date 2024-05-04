import { expect, test } from 'vitest'
import { mapEntries } from './mapEntries.js'

const input = {
	foo: 'bar',
	baz: 'qux',
}

test('maps keys', () => {
	const mapped = mapEntries(input, ([key, value]) => [`${key}Mapped`, value])
	expect(mapped).toEqual({
		fooMapped: 'bar',
		bazMapped: 'qux',
	})
})

test('maps values', () => {
	const mapped = mapEntries(input, ([key, value]) => [key, `${value}Mapped`])
	expect(mapped).toEqual({
		foo: 'barMapped',
		baz: 'quxMapped',
	})
})
