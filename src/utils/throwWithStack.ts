/**
 * Prisma CLI prints error message but no stack trace, making debugging difficult.
 * This utility adds the first line of the error stack to the error message.
 */
export function throwWithStack(error: unknown): never {
	if (error instanceof Error) {
		throw new Error(`${error.message}\n${error.stack?.split('\n', 2)?.[1]}`, {
			cause: error,
		})
	}
	throw error
}
