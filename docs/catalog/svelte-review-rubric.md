# Svelte UI review rubric

Use this rubric to review generated or refactored Svelte 5 code.

## 1. Svelte 5 conventions

- [ ] Uses Svelte 5 syntax only, does not use the following Svelte 4 syntax:
    - Uses correct Svelte 5 rune syntax, including valid forms of `$derived` (expression form `$derived` vs function form `$derived.by`)
    - No `export let`,  uses `$props()` for props
    - No `$:` reactive statements (instead: Svelte 5 runes)
    - No `<slot>`, uses snippets / `children` / `{@render children?.()}` instead where composition is needed (additional snippet props possible)
    - No `createEventDispatcher`, instead: callback props (e.g. `onFoo?: (value: number) => void`)
    - No `on:click` (instead: `onclick`), and similar
    - No uses of Svelte 4 event modifies, e.g. `onclick|preventDefault`, uses explicit code or existing project helper functions instead
- [ ] Prefers Svelte 5 attachments (`{@attach …}`) over actions in new code, uses attachment factory functions where useful
- [ ] If `{@const …}` is used, respects the rule: `{@const …}` is only allowed as an immediate child of a block
- [ ] If `each` blocks are used (`{#each expression as name, index (key)}...{/each}`), provides a `key` for each blocks where a stable key exists
- [ ] Uses script module only for module-level logic that should run once per module, or for module exports such as exported types (regular instance `<script>` blocks cannot export them). Otherwise prefers a regular instance `<script>`.

## 2. Component responsibility

- [ ] The responsibility of the component/module is clear
- [ ] The unit size is reasonable
- [ ] The file does not mix too many unrelated concerns
- [ ] The component boundary matches the conceptual boundary
- [ ] The code would still be understandable in three months
- [ ] The component does not contain multiple distinct reactive concern groups that want separate units
- [ ] Non-visual logic does not dominate the component script
- [ ] Logic that would still exist with a different UI has been extracted or isolated appropriately

## 3. Component type

- [ ] The chosen type is correct: primitive, composite, or headless
- [ ] The implementation matches the chosen type
- [ ] The public API matches the chosen type
- [ ] The component is not trying to be multiple types at once

## 4. State ownership

- [ ] Each state value has clear ownership
- [ ] There is one obvious source of truth per concern
- [ ] Shared or reusable stateful logic is not duplicated across components
- [ ] The component script is not acting as an unstructured state bucket

## 5. State structure

- [ ] Writable state is minimal
- [ ] Derived values are not stored as mutable state without reason
- [ ] Props are not mirrored into local state without strong reason
- [ ] There are no duplicated writable representations of the same concept
- [ ] The state shape matches the conceptual model of the feature

## 6. Reactivity

- [ ] `$effect(...)` is only used for real side effects
- [ ] Effects are not used to synchronize values that could be derived
- [ ] There are no effect chains coordinating internal state
- [ ] Reactive logic is simple and traceable
- [ ] The code does not rely on ad hoc reactive glue
- [ ] Render-relevant values are not created inside `$effect(...)`
- [ ] Upward notifications are not emitted from `$effect(...)` when they belong in the mutation path
- [ ] The implementation would still behave correctly during SSR
- [ ] For non-trivial bugs such as issues involving synchronization, feedback loops, commands, or competing write paths, the implementation was diagnosed structurally before applying a local fix
- [ ] Local guards, suppression logic, or conditionals are not used as band-aids where the underlying ownership or synchronization model should be corrected instead

## 7. Modularity and extraction

- [ ] Reusable non-visual logic is extracted from components when appropriate
- [ ] Similar stateful behavior is not duplicated locally
- [ ] A cohesive `.svelte.ts` controller/state module has been extracted when reactive concerns started to dominate the component
- [ ] Helpers/modules are coherent and single-purpose
- [ ] Rendering concerns are kept separate from reusable logic
- [ ] The current abstraction level is justified by actual repetition

## 8. Primitive quality

Apply if the unit is a primitive.

- [ ] Has a single DOM root
- [ ] Supports `class`
- [ ] Supports `ref`
- [ ] Forwards native props where appropriate
- [ ] Supports `children`
- [ ] Keeps internal behavior minimal
- [ ] Does not introduce unnecessary state or complexity

## 9. Composite quality

Apply if the unit is a composite.

- [ ] Builds on top of primitives/components
- [ ] Provides a curated and explicit public API
- [ ] Uses snippets only where structure actually matters
- [ ] Forwarding is intentional, not blind
- [ ] Internal styling hooks are exposed only where truly useful
- [ ] Adds real architectural value beyond extra markup

## 10. Headless primitive quality

Apply if the unit is a headless primitive.

- [ ] Headless behavior is justified by real flexibility/reuse needs
- [ ] Styling is not coupled to behavior
- [ ] Behavior and semantics are explicit
- [ ] Render delegation is used only as an advanced need
- [ ] The API remains ergonomic despite flexibility

## 11. Open and composable API

- [ ] The component integrates naturally with normal platform behavior
- [ ] Consumers can style/compose without hacks
- [ ] The API is explicit but not unnecessarily closed
- [ ] Native platform capabilities are not blocked without reason
- [ ] Forwarding and extension points feel intentional
- [ ] `$bindable` is used only where two-way control is clearly intentional

## 12. Tailwind usage

- [ ] Tailwind classes are structured rather than copy-pasted
- [ ] Large utility groups are not duplicated across siblings/files
- [ ] Repeated visual patterns have a home
- [ ] Class lists are readable and intentional
- [ ] Duplication that should become a component/helper/variant has been extracted

## 13. Tailwind variants

- [ ] `tailwind-variants` is only used where a real semantic variant surface exists
- [ ] Variant names describe intent rather than CSS trivia
- [ ] The variant matrix is reasonably small
- [ ] Variants are not compensating for poor component boundaries

## 14. Markup and structure

- [ ] Markup is minimal
- [ ] The DOM hierarchy is easy to scan
- [ ] Each wrapper has a clear semantic, layout, or compositional reason
- [ ] The DOM shape reflects the mental model of the component
- [ ] The structure does not feel incrementally patched together

## 15. Accessibility and semantics

- [ ] Native elements are used where possible
- [ ] HTML semantics are correct
- [ ] ARIA is used only when needed
- [ ] Semantic attributes and `data-*` hooks are exposed where they form part of the component contract
- [ ] Keyboard and focus behavior are not accidental
- [ ] Accessibility is part of the implementation, not a late patch

## 16. Styling restraint and UI noise

- [ ] The UI is visually restrained rather than noisy
- [ ] Borders, surfaces, and decorative framing are used sparingly
- [ ] Hierarchy is achieved primarily through spacing/typography/layout
- [ ] The result does not feel boxed-in or cluttered
- [ ] Decoration is intentional rather than compensatory

## 17. Maintainability

- [ ] Another developer could quickly understand where to change this
- [ ] The code would be easy to extend in a later feature
- [ ] The current structure reduces future cleanup work
- [ ] Repetition has been addressed at the right level
- [ ] The implementation feels deliberate rather than merely “good enough”
- [ ] Non-trivial bugfixes address the root cause rather than only suppressing the visible symptom

## 18. Common failure modes

Check whether any of these are present:

- [ ] Functionally correct but structurally noisy code
- [ ] Too much local state
- [ ] Too many effects
- [ ] Weak state ownership
- [ ] Repeated logic with small deviations
- [ ] Duplicated Tailwind groups
- [ ] Unnecessary wrappers
- [ ] Props mirrored into local state
- [ ] Derived values stored as mutable state
- [ ] Over-generalization in one place, under-extraction in another

## 19. Overall decision

- [ ] Ready as-is
- [ ] Needs targeted refactoring
- [ ] Needs architectural restructuring
