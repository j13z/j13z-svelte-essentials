# Svelte 5 implementation rules

Use these rules when creating or refactoring Svelte 5 / SvelteKit frontend code.

They are intentionally opinionated and optimized for maintainability, clean architecture, and low cleanup cost.

## Hard rules

- Use modern Svelte 5 syntax and conventions consistently
- Use `$props()` for props
- Use snippets and `{@render ...}` for composition
- Do not use `export let`
- Do not use legacy slots in new code unless compatibility explicitly requires them
- Prefer Svelte 5 attachments over actions in new code
- Treat `$effect(...)` as an escape hatch for real side effects and external systems
- Do not create render-relevant state inside `$effect(...)`
- Prefer native HTML semantics first
- Prefer explicit structure over clever shortcuts

## State and ownership

### Prefer

- Keep state as local as possible
- Keep one clear source of truth per concern
- Derive values instead of duplicating them
- Separate:
  - props
  - local mutable state
  - derived state
  - external/shared state
- Move reusable or shared stateful logic into dedicated modules

### Avoid

- Mirroring props into local state without strong reason
- Multiple writable versions of the same fact
- Large components with many unrelated `$state(...)` declarations
- Shared state logic duplicated across components
- Using component scripts as unstructured state buckets

### Review for

- Can ownership of each state value be explained in one sentence?
- Is any state duplicated unnecessarily?
- Could any writable state be derived instead?
- Does any state clearly belong in a reusable module?

## Reactivity decision path

When code needs to react to something, choose in this order:

1. Pure computed value → `$derived`
2. Local mutable state owned here → `$state`
3. Upward action → callback or explicit mutation path
4. Element-bound DOM behavior → attachment
5. External runtime / timer / observer / listener / async synchronization → `$effect`

If none of these fit cleanly, reconsider the component boundary before adding more reactive glue.

## Reactivity

### Prefer

- Simple, traceable reactive logic
- Derived computations over imperative synchronization
- `$effect(...)` only for real side effects
- Minimal reactive surface area
- Computing render-relevant values during render
- Callbacks or explicit mutation paths for upward actions
- Attachments for element-bound DOM behavior

### Avoid

- Using `$effect(...)` to synchronize values that could be derived
- Chains of effects updating other reactive values
- Effects that coordinate multiple unrelated concerns
- Ad hoc reactive glue spread across a component
- Creating render-relevant state inside `$effect(...)`
- Emitting state upward from `$effect(...)` when the action belongs in the mutation path

### Review for

- Does every `$effect(...)` have a clear side-effectful purpose?
- Is any effect compensating for poor state modeling?
- Would derivation be simpler than synchronization?
- Would this still behave correctly during SSR?

## Logic extraction and modularization

### Prefer

- Cohesive `.svelte.ts` controller/state modules when reactive concerns start to dominate a component
- Extract logic that is not inherently tied to markup
- Move reusable stateful behavior into coherent modules
- Extract repeated transformations, handlers, orchestration, or state transitions
- Keep rendering concerns separate from reusable behavior

### Avoid

- Keeping reusable logic trapped inside a `.svelte` file
- Repeating helper logic with small variations
- Giant components mixing UI, orchestration, data shaping, and interaction logic
- Copy-paste reuse

### Review for

- Is any non-visual logic duplicated?
- Should this logic be testable or reusable outside the component?
- Is a module a better home than the component script?
- Has this component become large enough that a cohesive `.svelte.ts` controller/module would simplify it?

## Component boundaries

### Prefer

- Components with one coherent responsibility
- Clear boundaries between rendering, behavior, and composition
- Splitting components once they contain multiple independent concerns
- Abstractions at the level where reuse actually happens

### Avoid

- Components with unrelated state, effects, handlers, and markup mixed together
- Components that are both low-level primitive and high-level feature wrapper
- Bags of concerns
- Splitting only visually while keeping all logic tangled together

### Review for

- Can the component’s responsibility be described in one sentence?
- Does the file mix unrelated interaction models?
- Should this be split into subcomponents or modules?
- Does the component contain multiple distinct reactive concern groups?
- Is non-visual logic starting to dominate the component script?
- Would parts of this logic still exist even if the UI were rendered differently?

## Component type selection

Choose explicitly:

- **Primitive**: one DOM root, low-level, mostly element + styling + small API
- **Composite**: built from other components, structured API, curated surface
- **Headless primitive**: reusable behavior/semantics with little or no styling

### Avoid

- Components that try to be primitive, composite, and headless at once
- Wrapper components that add no real architectural value
- Headless abstractions introduced “just in case”

### Review for

- Is the chosen type obvious from the implementation?
- Does the public API match the chosen type?

## Primitive rules

### Prefer

- One DOM root element
- Support for `class`
- Support for `ref`
- Forward native element props where appropriate
- Support for `children`
- Small semantic variant surfaces when genuinely needed

### Avoid

- Large custom APIs on thin wrappers
- Unnecessary internal state
- Blocking normal platform behavior

## Composite rules

### Prefer

- Build composites from primitives/components
- Use explicit, curated APIs
- Use named snippets when structure matters
- Forward intentionally, not blindly
- Expose internal styling hooks only where realistically useful

### Avoid

- Blind passthrough of the full underlying API
- Wrappers that only add indirection
- Structure without architectural value

## Headless primitive rules

### Prefer

- Use headless primitives only when flexibility or reuse justifies them
- Keep behavior/semantics explicit
- Leave styling to the consumer
- Use render delegation only when truly needed
- Semantic attributes and `data-*` hooks as extension points

### Avoid

- Premature headless abstractions
- Library-grade flexibility for app-local problems
- Mixing strong styling opinions into headless primitives

## Snippets and composition

### Prefer

- `children` as the default composition path
- Named snippets when structure matters
- Composition APIs that reflect real structure

### Avoid

- Too many snippet entry points
- Generic composition surfaces without clear purpose
- Using composition to avoid making architectural decisions

## Open and composable APIs

### Prefer

- Support `class` where relevant
- Support `ref` on DOM-root primitives
- Forward native props where appropriate
- Keep APIs explicit but open enough for real integration
- Props down and callbacks up by default; use `$bindable` sparingly

### Avoid

- Closed components that require internal edits for common use cases
- Magic APIs that hide normal platform behavior
- Styling APIs that block normal composition

## Tailwind rules

### Prefer

- Tailwind through composition, not copy-paste
- Extract repeated structure into components, helpers, or semantic variants
- Use `cn(...)` for composition and merge safety
- Keep class lists readable and intentional

### Avoid

- Copy-paste utility blobs
- Repeating large utility groups across siblings or files
- Huge class strings mixing too many concerns
- Treating docs-style inline examples as production architecture

### Review for

- Is there obvious utility duplication nearby?
- Should this repetition become a component or variant instead?
- Are class lists communicating intent or just accumulated noise?

## Tailwind variants

### Prefer

- Use `tailwind-variants` only when there is a real semantic variant surface
- Keep variant names semantic
- Keep the variant matrix small

### Avoid

- Adding `tv()` to every component by default
- Variants that encode CSS trivia
- Boolean-heavy styling APIs
- Variants used to compensate for poor component boundaries

### Review for

- Would removing `tv()` make this component meaningfully worse?
- Are variants truly semantic and coherent?

## Markup and structure

### Prefer

- Minimal markup
- Clear hierarchy
- Wrappers only when they add layout, semantic, or compositional value
- DOM shape that reflects the mental model of the component

### Avoid

- Wrapper-on-wrapper-on-wrapper markup
- Containers added only to patch spacing problems
- Decorative structure without purpose

### Review for

- Can each wrapper be justified?
- Is the DOM tree easy to scan?
- Does the structure match the conceptual layout?

## Accessibility and semantics

### Prefer

- Correct native elements first
- HTML semantics as baseline
- ARIA only when needed
- Keyboard and focus behavior treated as part of correctness

### Avoid

- Replacing native controls with generic elements without reason
- Accessibility as a late patch
- Semantic gaps hidden behind abstractions

## Styling restraint

### Prefer

- Calm defaults
- Clear hierarchy
- Whitespace and typography before decoration
- One strong surface instead of many nested ones

### Avoid

- Too many borders
- Too many surfaces
- Visually dense UI without purpose
- Decoration used to compensate for weak hierarchy
