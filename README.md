# j13z-svelte-essentials

A collection of code snippets, patterns, agent instructions, and workflows I use to bootstrap Svelte / SvelteKit projects.

## Highlights

- 🛠️ [`templates/ui-components`](templates/ui-components): Component blueprints (inspired by Bits UI and `shadcn-svelte`)
  - [`Primitive.svelte`](./templates/ui-components/Composite.svelte): low-level composable primitive
  - [`Composite.svelte`](./templates/ui-components/Primitive.svelte): composed higher-level component
  - [`HeadlessPrimitive.svelte`](./templates/ui-components/HeadlessPrimitive.svelte): unstyled / headless primitive for advanced use cases

- 🧩 [`src`](./src): Code snippets
  - [`lib/ui/utils.ts`](./src/lib/ui/utils.ts): UI component utilities adapted from `shadcn-svelte` and `bits-ui`

- 🤖 Agent instructions
  - [`UI Components.md`](<./templates/agent-snippets/UI Components.md>): Guidance for writing well-structured and composable Svelte 5 UI components
