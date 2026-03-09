# j13z-svelte-ui-skills

Agent skills (Codex, Claude Code, etc) for Svelte 5 / SvelteKit.

This builds agent skill directories in `agent-skills/dist` based on reusable documentation files from the repo (placed into `references` or `assets` directories of the skills).

## Building

- `pnpm install`
- `pnpm build`
- Optionally: `pnpm install:home` to copy all skills to `~/.agents/skills` subdirs

