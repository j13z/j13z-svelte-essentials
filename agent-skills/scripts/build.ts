// Simple skript that build agents skill directories compiled from shared Markdown sources

import { access, cp, mkdir, readdir, rm } from "node:fs/promises"
import os from "node:os"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const skillsRootDir = path.resolve(__dirname, "..")
const repoRootDir = path.resolve(skillsRootDir, "..")
const srcDir = path.join(skillsRootDir, "src")
const distDir = path.join(skillsRootDir, "dist")

type TargetFileType = "reference" | "asset"

type Source = {
	source: string
	kind: TargetFileType
	target?: string
}

type SkillConfig = {
	name: string
	sources: Source[]
}

// prettier-ignore
const svelteSkillsSources: Source[] = [
	{ kind: "reference", source: path.join("docs", "catalog", "patterns-and-anti-patterns.md") },
	{ kind: "reference", source: path.join("docs", "catalog", "svelte-implementation-rules.md") },
	{ kind: "reference", source: path.join("docs", "catalog", "svelte-review-rubric.md") },
	{ kind: "asset", source: path.join("templates", "ui-components", "Primitive.svelte") },
	{ kind: "asset", source: path.join("templates", "ui-components", "Composite.svelte") },
	{ kind: "asset", source: path.join("templates", "ui-components", "HeadlessPrimitive.svelte") },
	{ kind: "asset", source: path.join("src", "lib", "ui", "utils.ts") }
]

const skills: SkillConfig[] = [
	{ name: "svelte-authoring", sources: svelteSkillsSources },
	{ name: "svelte-review", sources: svelteSkillsSources },
	{
		name: "shadcn-svelte",
		sources: [{ kind: "reference", source: path.join("agent-snippets", "shadcn-svelte-component-index-llms.md") }]
	}
]

/* async function exists(targetPath: string): Promise<boolean> {
	try {
		await access(targetPath)
		return true
	} catch {
		return false
	}
} */

async function ensureDir(dir: string): Promise<void> {
	await mkdir(dir, { recursive: true })
}

async function resetDir(dir: string): Promise<void> {
	await rm(dir, { recursive: true, force: true })
	await mkdir(dir, { recursive: true })
}

async function copyFile(src: string, dest: string): Promise<void> {
	await ensureDir(path.dirname(dest))
	await cp(src, dest)
}

async function copyDir(src: string, dest: string): Promise<void> {
	await ensureDir(path.dirname(dest))
	await cp(src, dest, { recursive: true })
}

async function exists(targetPath: string): Promise<boolean> {
	try {
		await access(targetPath)
		return true
	} catch {
		return false
	}
}

async function buildSkill(skill: SkillConfig): Promise<void> {
	const outDir = path.join(distDir, skill.name)
	const kindDirMap = {
		reference: path.join(outDir, "references"),
		asset: path.join(outDir, "assets")
	}

	await resetDir(outDir)

	const specFile = "SKILL.md"
	await copyFile(path.join(srcDir, skill.name, specFile), path.join(outDir, specFile))

	for (const entry of skill.sources) {
		const src = path.join(repoRootDir, entry.source)
		const fileName = entry.target ?? path.basename(entry.source)
		await copyFile(src, path.join(kindDirMap[entry.kind], fileName))
	}
}

async function buildSkills(): Promise<void> {
	await ensureDir(distDir)

	for (const skill of skills) {
		await buildSkill(skill)
	}

	const builtSkills = await readdir(distDir)

	console.log("\n✨ Built skills\n")
	for (const skillName of builtSkills) {
		console.log(`  • ${path.relative(skillsRootDir, path.join(distDir, skillName))}`)
	}
	console.log("")
}

/**
 * Installs the agent skills into `$HOME/.agents/skills`
 */
async function installHome() {
	const homeDir = os.homedir()
	if (!homeDir) {
		throw new Error("Cannot install skills locally because $HOME is not set")
	}

	const localSkillsRootDir = path.join(homeDir, ".agents", "skills")
	await ensureDir(localSkillsRootDir)

	for (const skill of skills) {
		const sourceDir = path.join(distDir, skill.name)
		const targetDir = path.join(localSkillsRootDir, skill.name)

		if (!(await exists(sourceDir))) {
			throw new Error(`Built skill directory is missing: ${sourceDir}`)
		}

		await rm(targetDir, { recursive: true, force: true })
		await copyDir(sourceDir, targetDir)
	}

	console.log(`\n📦 Installed skills into ${localSkillsRootDir}\n`)
	const installedSkills = await readdir(localSkillsRootDir)
	for (const skillName of installedSkills) {
		console.log(`  • ${skillName}`)
	}
	console.log("")
}

async function clean() {
	for (const skillName of skills) {
		await rm(path.join(distDir, skillName.name), { recursive: true, force: true })
	}
}

async function main() {
	const args = process.argv.slice(2)
	const command = args[0]?.toLowerCase()

	if (command === "build") {
		await buildSkills()
	} else if (command === "install-home") {
		await installHome()
	} else if (command === "clean") {
		await clean()
	} else {
		console.error(`\n✖ Invalid command: '${command}'\n`)
		console.error("Available commands:")
		console.error("  • build")
		console.error("  • install-local")
		console.error("  • clean\n")
		process.exit(1)
	}
}

main().catch((error: unknown) => {
	console.error(`\n✖ ${error instanceof Error ? error.message : String(error)}\n`)
	process.exit(1)
})
