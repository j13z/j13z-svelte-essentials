---
name: svelte-authoring
description: Use this skill when creating or refactoring Svelte 5 / SvelteKit frontend code, especially UI components, local feature UIs, component APIs, and Tailwind-based styling. This skill improves code quality by enforcing modern Svelte 5 conventions, strong component boundaries, clear state ownership, reusable modular logic, and disciplined Tailwind usage. Not intended for visual design exploration or branding work.
metadata:
  author: j13z
---

# Svelte Authoring Skill

Use this skill when implementing or refactoring Svelte 5 frontend code.

The goal is not merely working code.

The goal is code that:
- has a clean structure
- is easy to reason about
- is easy to refactor
- has clear encapsulation and consists of small, coherent units where possible
- remains maintainable as requirements evolve, without accumulating brittle structure, excessive complexity, or high regression risk

## Required reference loading

Before writing or changing code, read these files:

- `references/svelte-implementation-rules.md`
- `references/svelte-review-rubric.md`

Read this file as well when the task is non-trivial, especially if it involves component architecture, state ownership, reactivity, extraction, composition, or reusable abstractions:

- `references/patterns-and-anti-patterns.md`

Use these files actively. Do not treat them as optional background material.

## Working mode

Use this skill for tasks like:

- implementing new Svelte 5 UI components
- refactoring existing Svelte components
- extracting repeated UI patterns into primitives or composites
- improving component APIs
- cleaning up noisy local state / `$effect(...)` usage
- removing duplicated Tailwind class groups
- modularizing reusable interaction/state logic
- turning awkward feature code into maintainable frontend structure

Do not use this skill as the primary skill for:

- visual design ideation
- branding or art direction
- polished aesthetic exploration
- graphic design tasks
- framework-agnostic backend or domain architecture
- tasks unrelated to Svelte frontend implementation
- bugfixes that are clearly caused by architectural drift, broken state ownership, synchronization problems, or accumulated technical debt

## Execution mode

Optimize for short, high-quality interactive runs, not long autonomous recovery attempts, unless the task explicitly requires broader autonomous problem-solving.

When using this skill:

1. Read the required references first.
2. Determine the correct architectural shape.
3. Choose the smallest coherent implementation.
4. Implement using modern Svelte 5 syntax and conventions.
5. Simplify aggressively.
6. Before finalizing, run a mandatory self-review against `references/svelte-review-rubric.md`.

Do not jump directly into code generation without first reading the required references and choosing the correct structure.

## Bugfix posture

When working on a bugfix, do not assume that the correct fix is a local patch.

Before applying a fix, explicitly check whether the bug is caused by:

- broken state ownership
- duplicated writable state
- invalid synchronization
- effect misuse
- competing write paths
- wrong component boundaries
- accumulated local glue code

If the bug appears structural, say so explicitly before implementing.

If the bug is non-trivial and involves synchronization, feedback loops, commands, editor state, or competing write paths, diagnose the current ownership and synchronization model first instead of patching the most visible symptom.

Prefer root-cause fixes over local guards, conditionals, and suppression logic when the bug involves synchronization, event feedback loops, editor state, commands, or competing update paths.

If a local patch is still the right fix, it should be chosen deliberately and justified briefly.

## Blockers and missing prerequisites

Prefer early reporting over speculative workarounds.

Do not silently work around missing project context, missing utilities, missing dependencies, or missing files.

If a required prerequisite is missing, explicitly report it and stop unless the task explicitly allows a temporary fallback.

Examples of blockers:

- missing dependencies
- missing project utilities or helper modules
- missing required template or context files
- unresolved import paths required by the intended implementation

Do not reimplement project-local helpers or dependencies or invent substitute local infrastructure unless the task explicitly asks for that.

## Final reporting requirements

Before finalizing, explicitly report:

- blockers encountered
- missing prerequisites
- fallbacks used, if any
- important deviations from the intended implementation
- whether the final self-review against `references/svelte-review-rubric.md` found any remaining issues
- for bugfixes: whether the final change is a local patch or a root-cause fix
- explicitly state when none of the above apply

## Output expectations

When responding to a task with this skill:

- choose the correct architectural shape first
- implement the smallest clean solution
- keep explanations short
- prefer code quality over shortcuts that merely make the task appear solved
- avoid speculative abstraction
- avoid noise
- avoid hacks that would obviously need cleanup

If refactoring existing code:

- simplify first
- remove duplication
- fix state ownership
- reduce effects
- improve boundaries
- extract coherent reusable logic

## Resources

Use these resources as canonical references when needed:

- `references/patterns-and-anti-patterns.md`
- `references/svelte-implementation-rules.md`
- `references/svelte-review-rubric.md`
- `assets/Primitive.svelte`
- `assets/Composite.svelte`
- `assets/HeadlessPrimitive.svelte`
- `assets/utils.ts`
