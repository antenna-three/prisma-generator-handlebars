import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'

export async function writeFiles(
	basePath: string,
	entries: Record<string, string>,
): Promise<void> {
	await Promise.all(
		Object.entries(entries).map(async ([relativePath, content]) => {
			const fullPath = join(basePath, relativePath)
			await mkdir(dirname(fullPath), { recursive: true })
			await writeFile(fullPath, content, { encoding: 'utf8' })
		}),
	)
}
