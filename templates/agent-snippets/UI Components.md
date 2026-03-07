## UI components

When creating or refactoring Svelte UI components:

1. Use `src/lib/ui/templates/Primitive.svelte` for low-level components with exactly one DOM root element.
2. Use `src/lib/ui/templates/Composite.svelte` for wrappers/composed components built on top of other components.
3. Always use Svelte 5 syntax:
   - `$props()`
   - snippets / `children`
   - `{@render …}`
   - no Svelte 4 `export let`
   - no legacy slots unless required for compatibility
   - Prefer Svelte 5's `attachment` feature (`{@attach …}`) over actions in new code
4. Prefer open, composable APIs:
   - forward native props where appropriate
   - support `class`
   - support `ref` on DOM-root primitives
   - keep variant APIs small and semantic
5. Use `tailwind-variants` only when it adds real value.
6. For wrapper components, do not leak the full child/root API unintentionally; curate the public props.
