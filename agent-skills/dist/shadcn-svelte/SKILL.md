---
name: shadcn-svelte
description: Use this skill when the project uses shadcn-svelte and the task involves implementing or refactoring UI with that library.
metadata:
  author: j13z
---

# `shadcn-svelte` Agent Skill

## Preparation

1. Projects may customize locations. Therefore read `components.json` completely and inspect its fields:
   - `aliases.ui`: hint to where components are located (replace `$lib`, likely with `src/lib`)
   - `aliases.utils`: hint where `utils.ts` is located (same logic)
   - `tailwind.css`: The main stylesheet with token and color definitions
2. Read `references/shadcn-svelte-component-index-llms.md`.

- Defer following specific component docs until you actually use a component or when you need more detailed information in advance for a specific task

`shadcn-svelte` does not come as regular `node_modules` dependency, but instead components are installed embedded into `src/lib` (resolve `aliases.ui` value) on demand.

- That means (important!): If you think that a useful `shadcn-svelte` component listed in `shadcn-svelte-component-index-llms.md` is missing, stop an ask the user to install it.
- Or – if you have the ability – install it yourself using the `shadcn-svelte` CLI: `pnpm dlx shadcn-svelte@latest add button`

## Background

You need to understand these characteristics of `shadcn-svelte`:

- It's components are "open code", their source code is pulled into the application like "starter kit". This gives the project full control. But: Never modify the component sources.

- It's components compose very nicely because primitives forward the underlying element's attributes, especially the `class` attribute, so they remain full customizable and stylable.
  - You should however accept the default styles and only override them, if there's a clear reason.

- `shadcn-svelte` provides a basic design system and theme configuration based on Tailwind.

Before you use a component for the first time, consult its linked documentation: **Read the usage instructions and code example** (load references component docs lazily / on demand).

## Component selection

Strongly prefer existing `shadcn-svelte` components when they already cover the intended UI pattern.
Do not rebuild common UI primitives with raw HTML + Tailwind just because it seems faster in the moment.

Only build custom low-level UI when:

- the catalog clearly does not fit the use case
- the custom structure is truly simpler

## Instructions

## Specific Tailwind Classes

`shadcn-svelte` defines custom CSS variables for colors such as:

```
--background
--foreground
--card
--card-foreground
--primary
--primary-foreground
--muted
--muted-foreground
--accent
--accent-foreground
--border
--input
--ring
…
```

From these, Tailwind constructs classes like the following - these are just examples:

```
bg-primary
bg-background
bg-card
text-primary-foreground
text-foreground
text-muted-foreground
text-warning-foreground
…
```

## Do

- If your component renders a primitive, expose a `class` prop an pass it on to maintain the an "openness" and composability properties. Use the `cn(…)` class composition helper function to pass on `class` / `className` props. Examples:
  ```svelte
  <!-- With a `shadcn-svelte` Button -->
  <Button class={cn("<provided classes>", className)}>
    {@render children?.()}
  <Button>
  ```
  or the same with a simple DOM element:
  ```svelte
  <button class={cn("<provided classes>", className)}>
    {@render children?.()}
  <button>
  ```

## Avoid

- For basic component use you well rarely have to write complex Tailwind class expressions with values, examples:
  - Avoid: `px-[13.5px]`, use: `px-2` (standard design token value)
  - Avoid: `shadow-[0_35px_35px_rgba(0,0,0,0.25)]`, use: `shadow-xl` (simple pre-defined value from the design system)

## Hard Rules

Notations:

- Never use string interpolation to pass on classes, never: `class="p-4 {className}"` (instead: `class={cn("p-4", className)}"`). Reason: `cn` uses `tailwind-merge` to de-duplicate classes, so you don't end up e.g. with `p-4 p2`
- Never use Svelte's `class:foo="value"` syntax
- Avoid using the `style`
  - Exception: _complex_ programmatic CSS transforms (or if instructed so); for simple ones prefer Tailwind
- Never hard-code specific color values like `bg-slate-500`. Always use semantic color _roles_ like `bg-background`.
- Avoid using component-scoped stylesheeets (`<style>` element)
- Avoid manually set border, hover styles, or other low-level skill, unless your task requires deviating from the default stylig

## Resources

- `references/shadcn-svelte-component-index-llms.md`
