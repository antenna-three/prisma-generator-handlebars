export function mapEntries<K extends string, T, U>(
	object: Record<K, T>,
	mapper: (entry: [string, T]) => [string, U],
): Record<K, U> {
	return Object.fromEntries(Object.entries<T>(object).map(mapper)) as Record<
		K,
		U
	>
}
