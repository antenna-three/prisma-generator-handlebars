/**
 * @this {import('@prisma/generator-helper').DMMF.Field}
 * @returns {string}
 */
export function fieldType() {
	return `${this.isId ? 'ID' : this.type}${this.isRequired ? '!' : ''}`
}

/**
 * @this {import('@prisma/generator-helper').DMMF.SchemaArg}
 * @returns {string}
 */
export function inputType() {
	/**
	 *
	 * @param {import('@prisma/generator-helper').DMMF.InputTypeRef} field
	 * @returns number
	 */
	const priority = (field) =>
		(field.isList ? 4 : 0) +
		['inputObjectTypes', 'enumTypes', 'scalar', 'fieldRefTypes'].indexOf(
			field.location,
		)
	return fieldType.bind(
		Array.from(this.inputTypes).sort((a, b) => priority(a) - priority(b))[0],
	)()
}
