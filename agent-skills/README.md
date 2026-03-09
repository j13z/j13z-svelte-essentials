# j13z-svelte-ui-skills

Agent skills (Codex, Claude Code, etc) for Svelte 5 / SvelteKit frontend authoring and review.

_Status:_ Work in progress / experimental / evaluating ⚗️🧪

## Included skills

Pre-built bundles are available in [`dist/`](./dist/) as two separate skills:

- [`svelte-ui-authoring`](./dist/svelte-ui-authoring/): the implementation-focused skill
  - A strong frontend engineer who gets the job done cleanly, follows the rules, and aims for maintainable code without constantly re-litigating the architecture.
- [`svelte-ui-review`](./dist/svelte-ui-review/): the architecture- and diagnosis-focused skill
  - A skeptical, experienced engineer who challenges the status quo, takes positions, and pushes for structural changes or rewrites when the current solution is no longer a good foundation.

The outcome still depends heavily on the prompt, especially when deeper refactoring or rewrite pressure is needed.


## Building

- Lives inside `j13z-svelte-essentials/agent-skills/` and uses the parent repo as the canonical source for shared "catalog" docs and templates.
- This package only adds the skill-specific sources needed to build the final skills, see [`skill-sources/`](./skill-sources/).

Run `pnpm skills` to build the skills into `dist/`.

Optionally, run `skills:install:local` to build and copy the skills into `$HOME/.agents/skills` subdirs.
