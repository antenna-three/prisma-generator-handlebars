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
	 * Prismaが受け付ける引数のうち、最も複雑なものをGraphQLの引数とする
	 * @param {import('@prisma/generator-helper').DMMF.InputTypeRef} field
	 * @returns number
	 */
	const priority = (field) =>
		(field.isList ? 0 : 8) +
		['inputObjectTypes', 'enumTypes', 'scalar', 'fieldRefTypes'].indexOf(
			field.location,
		) * 2 +
		['String', 'Null'].indexOf(field.type)
	const rawInputType = Array.from(this.inputTypes).sort((a, b) => priority(a) - priority(b))[0]
	return rawInputType.isList ? `[${rawInputType.type}]` : rawInputType.type
}
