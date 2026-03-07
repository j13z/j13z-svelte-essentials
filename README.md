# j13z-svelte-essentials

A collection of code snippets, patterns, agent instructions, and workflows I use to bootstrap Svelte / SvelteKit projects _(work in progress)_.

## Highlights

### 🛠️ Component Blueprints / Templates

Inspired by [Bits UI](https://github.com/huntabyte/bits-ui) and [shadcn-svelte](https://github.com/huntabyte/shadcn-svelte), [`templates/ui-components/`](templates/ui-components):

- [`Primitive.svelte`](./templates/ui-components/Composite.svelte): low-level composable primitive
- [`Composite.svelte`](./templates/ui-components/Primitive.svelte): composed higher-level component
- [`HeadlessPrimitive.svelte`](./templates/ui-components/HeadlessPrimitive.svelte): unstyled / headless primitive for advanced use cases

### 🤖 Agent Instructions

- Goal: Teach agents how to write _good_ Svelte 5 components
- [`UI Components.md`](<./templates/agent-snippets/UI Components.md>): Guidance for writing well-structured and composable Svelte 5 UI components

<!--
### 🧩 Code Snippets

[`src/`](./src):

- [`lib/ui/utils.ts`](./src/lib/ui/utils.ts): UI component utilities adapted from `shadcn-svelte` and `bits-ui`
 -->
