# Svelte 5 patterns and anti-patterns

This document captures the patterns, constraints, and anti-patterns I want in Svelte 5 / SvelteKit projects.

It is intentionally opinionated and grounded in real implementation and refactoring work, especially in situations where generated code was technically functional but structurally weak, noisy, hard to extend, or expensive to clean up later.

This document is meant to be useful for both humans and agents.

Use it as:

- a reference for implementation
- a source for `AGENTS.md` rules
- a source for future skills
- a review checklist for generated code
- a distillation of recurring failure modes

---

## 1. Core goal

The goal is not merely working code.

The goal is code that is:

- easy to reason about
- easy to refactor
- modular and coherent
- reusable at the right level
- structurally clean from the start
- aligned with modern Svelte 5 patterns

Generated code often fails not because it is broken, but because it is:

- too local
- too noisy
- too duplicated
- too hacky
- too eager to patch instead of model correctly

This document is meant to counter exactly that.

---

## 2. General engineering principles

### Prefer

- Explicit structure over clever shortcuts
- One clear source of truth per concern
- Composition over duplication
- Reuse through coherent abstractions, not copy-paste
- Small APIs with clear ownership
- Modules and helpers when logic is not inherently component-local
- Components with one clear responsibility
- Refactoring once a pattern is clearly recurring

### Avoid

- Local glue code that grows unchecked
- “Works for now” code that creates cleanup work later
- Incremental hacks that accumulate into structural mess
- Copy-paste with tiny differences
- Broad abstractions introduced before a stable pattern exists
- Internal code written as if it were a generic public framework
- Over-engineering in the name of reuse

### Why

Most bad generated frontend code is not wrong in isolation. It is wrong in shape. It solves the immediate task while making the next task harder.

### Evaluatable signals

Good code should make it easy to answer:

- Where does this state live, and why?
- What is the public API of this unit?
- What is reused, and at what level?
- What can be changed safely?
- What would I extract next if this grew?

If those answers are unclear, the structure is probably weak.

---

# Part A — Core frontend engineering

## 3. State ownership

### Prefer

- State owned as close as possible to where it is truly controlled
- Local UI state kept local
- Shared or reusable state moved into modules when appropriate
- Derived values computed from canonical state
- Clear distinction between:
  - props
  - local mutable state
  - derived state
  - external/shared state

### Avoid

- State living in components only because it was convenient
- Shared logic duplicated across multiple components
- State copied into multiple places
- “Loose” component-local state that keeps growing without boundaries
- Large components with many unrelated `$state(...)` declarations

### Why

Weak state ownership is one of the biggest sources of messy frontend code.

### Evaluatable signals

- For each state value, ownership can be explained in one sentence
- There is one obvious source of truth
- Shared behavior is not reimplemented in multiple components
- The component script is not acting as an unstructured state bucket

### Refactoring triggers

Refactor when:

- multiple components contain nearly identical state logic
- one component contains unrelated pieces of state that evolve independently
- state is hard to test because it is trapped inside markup-heavy components
- stateful behavior is reused by copy-paste

---

## 4. State structure

### Prefer

- Minimal state
- Derived state over duplicated state
- Canonical data models
- State shape that matches the conceptual model of the feature
- Simple transformations close to usage when they are local

### Avoid

- Mirroring props into local state without strong reason
- Storing values that can be derived cheaply
- Multiple writable versions of the same fact
- Manual synchronization between related values
- State that encodes presentation artifacts instead of actual domain/UI meaning

### Why

A large share of “weird but working” code comes from poor state structure.

### Evaluatable signals

- If one value changes, there is no fragile manual sync chain
- Removing one state field does not break hidden coupling
- Derived values are not stored as mutable state without reason
- There are no duplicated writable representations of the same concept

### Anti-pattern examples

- keeping both `items` and `filteredItems` as writable state
- storing a local `value` copied from a prop without real local ownership
- keeping separate booleans that are really one state machine

---

## 5. Reactivity

### Prefer

- Reactivity that is simple and traceable
- Derived computations instead of imperative synchronization
- Effects only when there is an actual side effect
- Minimal reactive surface area
- Code where dependencies are conceptually obvious

### Avoid

- Using `$effect(...)` to keep state in sync when derivation would work
- Chains of effects that update other reactive values
- Effects doing too many things at once
- Reactive code that hides ownership or data flow
- Components full of ad hoc reactive glue

### Why

Effects are powerful, but overuse quickly leads to fragile code.

### Evaluatable signals

- Every `$effect(...)` has a clear external or side-effectful purpose
- Effects are not used as a substitute for modeling state properly
- Reactive logic can be explained without hand-waving
- There is no “why does this need to be an effect?” uncertainty

### Refactoring triggers

Refactor when:

- effects start writing values that could be derived
- one effect coordinates multiple concerns
- removing an effect feels dangerous because behavior is implicit
- reactive logic is duplicated across components

---

## 6. Logic extraction and modularization

### Prefer

- Extract logic that is not inherently tied to markup
- Move reusable stateful behavior into dedicated modules
- Keep modules coherent and single-purpose
- Extract repeated transformations, orchestration, or state transitions
- Separate rendering concerns from reusable behavior

### Avoid

- Keeping reusable logic trapped inside a component
- Repeating similar helper logic with tiny deviations
- Duplicating state transitions across features
- Giant components that combine rendering, orchestration, data shaping, and interaction logic
- Extracting too late, after duplication already spread

### Why

A lot of generated code stays local by default even when the logic clearly wants to become a reusable unit.

### Evaluatable signals

- Non-visual logic can be tested or reasoned about separately from markup
- Similar behavior across components is implemented once
- Reuse happens through modules, not repetition
- Component files are mostly about UI composition, not unrelated business/state orchestration

### Notes

“State hooks” / state modules / extracted controllers are often a better home for reusable behavior than keeping everything inside a `.svelte` file.

---

## 7. Component boundaries

### Prefer

- Components with one coherent purpose
- Clear boundaries between rendering, behavior, and composition
- Splitting once a component contains multiple independent responsibilities
- Abstractions at the level where reuse actually happens
- Clear distinction between primitive, composite, and headless primitive

### Avoid

- 3k-line components full of unrelated `$state(...)`, `$effect(...)`, handlers, and markup
- Components that are both low-level building block and high-level feature wrapper
- Splitting only by visual area while keeping all logic tangled in one file
- Over-splitting tiny details with no real architectural benefit
- Components that become “bags of concerns”

### Why

Poor component boundaries create the illusion of progress while burying long-term complexity.

### Evaluatable signals

- The component’s responsibility can be described in one sentence
- Removing one sub-concern would not require rewriting everything
- The file does not mix too many unrelated interaction models
- The component boundary matches the conceptual boundary

### Refactoring triggers

Refactor when:

- a component has multiple distinct UI regions with separate logic
- local state and handlers clearly belong to different conceptual units
- new feature work keeps adding more conditionals and effects into the same file
- similar internal sections could be extracted into meaningful subcomponents

---

## 8. Generalization without over-engineering

### Prefer

- Generalize when there is a stable recurring pattern
- Extract the shared core, not every incidental difference
- Keep abstractions narrow and evidence-based
- Reuse at the level that matches the actual repetition

### Avoid

- Solving hypothetical future reuse
- Premature generic abstractions
- Copy-paste forever because abstraction feels scary
- Extracting bloated “universal” helpers for weakly related cases

### Why

The right level of generalization is one of the hardest judgment calls in frontend architecture.

### Evaluatable signals

- The abstraction removes real duplication
- Its API is still easy to explain
- It fits multiple real use cases cleanly
- It does not introduce more branching complexity than it removes

---

## 9. Refactoring signals

Refactor when you see:

- repeated Tailwind groups
- repeated DOM structure
- repeated state transitions
- repeated handlers with small variations
- effects that mostly synchronize values
- growing local state soup
- multiple concerns in one component
- helpers duplicated across files
- components becoming hard to scan
- a component that gets harder to change with every feature

These are not cosmetic issues. They usually indicate a structural problem.

---

## 10. Common agent failure modes

### Watch for

- Functionally correct but structurally noisy code
- Too much local state
- Too many effects
- Weak state ownership
- Duplicated Tailwind groups
- Unnecessary wrappers
- Components that grew instead of being split
- Repeated logic with tiny deviations
- Props mirrored into local state
- Derived values stored as mutable state
- Internal code written as if it were a public framework
- Over-generalization in one place, under-extraction in another
- “Good enough” hacks that will obviously need cleanup

### Response

- Simplify first
- Re-check state ownership
- Re-check whether values should be derived
- Re-check whether logic belongs in a module
- Re-check component boundaries
- Re-check whether duplication should become a helper, component, or state module
- Re-check whether markup reflects actual structure
- Re-check whether the abstraction level is too high or too low

---

# Part B — Svelte-specific implementation

## 11. Svelte 5 only

### Prefer

- Svelte 5 syntax and runes-era conventions only
- `$props()` for props
- snippets and `{@render ...}` for composition
- modern Svelte 5 patterns consistently across the codebase

### Avoid

- `export let`
- legacy slot-based patterns in new code
- mixed Svelte 4 / Svelte 5 styles
- old patterns carried forward out of habit

### Why

Mixed eras of Svelte make generated code inconsistent and harder to review.

### Evaluatable signals

- No `export let`
- No legacy slots unless explicitly required
- New code matches the rest of a Svelte 5 codebase

---

## 12. Primitive, composite, headless

### Prefer

Use this rough model:

- **Primitive**: low-level, one DOM root, mostly element + styling + small API
- **Composite**: built from other components, structured and curated API
- **Headless primitive**: reusable behavior/semantics with little or no styling, usually more library-like

### Avoid

- Components that try to be all three at once
- Headless abstractions introduced “just in case”
- Using a primitive template for something that is clearly a composite
- Wrapper components that do not intentionally curate anything

### Why

Correct component classification prevents a lot of API and architecture drift.

### Evaluatable signals

- The chosen component type is obvious from its implementation
- Public API matches the chosen role
- The component does not expose more flexibility than its use case justifies

---

## 13. Primitive components

### Prefer

- A single DOM root element
- Support for:
  - `class`
  - `ref`
  - underlying element props
  - `children`
- Minimal internal behavior
- Small semantic variant surface when genuinely useful
- Native-feeling ergonomics

### Avoid

- Primitive components that block normal platform behavior
- Large custom APIs on thin wrappers
- Style wrappers pretending to be higher-level abstractions
- Unnecessary internal state
- Primitive components with muddy responsibilities

### Why

Primitives should be boring, predictable, and easy to compose.

### Evaluatable signals

- Feels like a native element with better ergonomics
- Public API is small
- No surprising hidden behavior
- One clear DOM root

---

## 14. Composite components

### Prefer

- Composites built from primitives/components
- Explicit, curated APIs
- Named snippets when structure matters
- Optional internal styling hooks only where truly useful
- Wrappers that add real architectural value

### Avoid

- Blind passthrough of the full underlying API
- Wrapper components that only add indirection
- Composites exposing too many internals
- Structure without intent
- Internal sections that are impossible to restyle without rewrites

### Why

Composites should remove repetition and encode structure, not hide accidental complexity.

### Evaluatable signals

- The composite provides a clearer API than raw markup would
- Forwarding is intentional, not accidental
- Structure is meaningful
- Reuse exists at the right level

---

## 15. Headless primitives

### Prefer

- Headless primitives only when flexibility or cross-project reuse justifies them
- Clear semantic / behavioral contracts
- Optional render delegation only when actually needed
- Styling left to the consumer
- `data-*` and semantic attributes as extension hooks

### Avoid

- Premature headless abstractions
- Library-grade flexibility for app-local problems
- Mixing strong styling opinions into “headless” primitives
- Render delegation used as default rather than as advanced escape hatch

### Why

Headless abstractions are powerful, but more expensive to design and maintain.

### Evaluatable signals

- The need for headless behavior is real, not hypothetical
- Styling is not coupled to behavior
- Render delegation solves an actual integration problem

---

## 16. Snippets and composition

### Prefer

- Snippets for meaningful composition points
- `children` for the default path
- Named snippets when structure matters
- Composition APIs that mirror real structure

### Avoid

- Snippet APIs that are too generic
- Too many composition points without clear need
- Composition used to avoid making architectural decisions
- Legacy slot patterns in new code

### Why

Composition should clarify a component, not make it more abstract than necessary.

### Evaluatable signals

- Each snippet exists for a real structural reason
- The API is still easy to understand
- The composition model does not leak internal confusion

---

## 17. Open and composable APIs

### Prefer

- Components that integrate naturally with the platform
- Support for `class` where relevant
- Support for `ref` on DOM-root primitives
- Native props forwarded where appropriate
- Public APIs that are explicit but not closed off

### Avoid

- Components that require internal edits for common extension cases
- Styling APIs that block normal composition
- Unnecessarily closed abstractions
- “Magic” APIs that hide normal platform behavior

### Why

Components should cooperate with application code, not fight it.

### Evaluatable signals

- Common integrations do not require hacks
- Consumers can style/compose without rewriting internals
- Public API is open enough for real use, but not sloppy

---

# Part C — UI / Tailwind / markup

## 18. Tailwind usage

### Prefer

- Tailwind through composition, not copy-paste
- Shared repeated structure extracted into components or helpers
- Repeated styling grouped behind semantics where appropriate
- `cn(...)` for composition and conflict-safe merging
- Small, readable class lists

### Avoid

- Copy-paste utility blobs
- Repeating the same utility groups across siblings/files
- Huge class strings mixing layout, visual style, and conditional state indiscriminately
- Local duplication that should become a component or variant
- Treating docs-style inline examples as production architecture

### Why

Tailwind does not cause duplication by itself. Weak component structure does.

### Evaluatable signals

- Repeated class groups are rare and intentional
- Shared visual patterns have a home
- Class lists communicate intent instead of accumulated noise
- There is no obvious utility duplication across nearby components

### Refactoring triggers

Refactor when:

- you copy the same utility group twice
- siblings share large parts of the same class list
- tiny visual differences are implemented by duplicating entire blocks
- multiple files repeat the same presentational structure

---

## 19. Tailwind variants

### Prefer

- `tailwind-variants` only when there is a real semantic variant surface
- Variant names that describe intent
- Small variant matrices
- Defaults that match common use

### Avoid

- Adding `tv()` to every component by default
- Variants that encode raw CSS trivia
- Large combinations that are hard to reason about
- Boolean-heavy styling APIs
- Variants used to compensate for poor boundaries

### Why

Variants help when they clarify a component API. Otherwise they become abstraction noise.

### Evaluatable signals

- Removing `tv()` would make the component meaningfully worse
- Variants describe semantic choices
- The variant surface is small and coherent

---

## 20. Markup and structure

### Prefer

- Minimal markup
- Clear hierarchy
- Wrappers only when they add semantic, compositional, or layout value
- DOM shape that reflects the mental model of the component

### Avoid

- Wrapper-on-wrapper-on-wrapper markup
- Containers introduced only to patch spacing problems
- Decorative structure without purpose
- Large markup trees built incrementally without simplification

### Why

Generated UI often accumulates unnecessary structure very quickly.

### Evaluatable signals

- Each wrapper can be justified
- The DOM tree is easy to scan
- Removing one wrapper would not mysteriously break everything
- The structure matches the conceptual layout

---

## 21. Accessibility and semantics

### Prefer

- Correct native elements first
- HTML semantics as the baseline
- ARIA only when needed
- Keyboard/focus behavior treated as part of correctness
- Semantics reflected in both API and markup

### Avoid

- Replacing native controls with generic elements without reason
- Accessibility as a late patch
- Semantic gaps hidden behind abstractions
- Components that shift semantic burden unnecessarily to consumers

### Why

Accessibility is part of the architecture, not a finishing step.

### Evaluatable signals

- Native controls are used where possible
- Focus and keyboard behavior are not accidental
- Semantics are obvious from the markup

---

## 22. Styling restraint and UI noise

### Prefer

- Calm defaults
- Clear hierarchy
- Whitespace and typography before decoration
- One strong surface instead of many nested ones
- Restraint in borders, backgrounds, and visual framing

### Avoid

- Too many surfaces
- Too many borders
- Boxed-in layouts everywhere
- Utility soup used to force “designed” appearance
- Visually dense UI without purpose

### Why

Generated UIs often over-decorate because decoration is easier than hierarchy.

### Evaluatable signals

- The UI remains readable without visual clutter
- Decoration is sparse and intentional
- Surfaces are not stacked by default
- Layout breathes without requiring extra wrappers

### Notes

This area may later deserve its own dedicated design / taste skill.

---

## 23. Review checklist

Use this when reviewing generated Svelte code.

### Architecture

- Is the responsibility of this component/module clear?
- Is the chosen unit size reasonable?
- Is the component type correct: primitive, composite, or headless?
- Are concerns separated cleanly?

### State

- Is state ownership clear?
- Is there a single source of truth?
- Is any state duplicated unnecessarily?
- Are derived values kept derived?
- Are effects used only where they are truly needed?

### Modularity

- Should any logic be extracted into a helper or module?
- Is reusable behavior duplicated locally?
- Is the current abstraction level justified by actual repetition?

### Component API

- Is the public API explicit and reasonably small?
- Is forwarding intentional?
- Is the component open enough for integration without being leaky?

### Tailwind / styling

- Are classes structured rather than copy-pasted?
- Is `tailwind-variants` actually justified?
- Is styling organized around semantics and reuse?

### Markup / UI

- Is the markup minimal and meaningful?
- Are wrappers justified?
- Is the UI visually restrained rather than noisy?

### Maintainability

- Would this be easy to extend in three months?
- Would another developer understand where to make changes?
- Does this reduce or increase future cleanup work?

---

## 24. Scope and intent

This document does not try to define universal best practices for all frontend codebases.

It defines the patterns and constraints I want in my own Svelte 5 / SvelteKit projects, based on real implementation work and repeated cleanup of generated code.

Its purpose is to make good structure explicit, evaluatable, and reusable.