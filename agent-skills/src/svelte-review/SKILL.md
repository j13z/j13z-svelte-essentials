---
name: svelte-review
description: Use this skill when reviewing, diagnosing, restructuring, or rewriting Svelte 5 / SvelteKit frontend code, especially when bugs or complexity stem from weak architecture, poor state ownership, reactivity problems, bad component boundaries, or accumulated technical debt. This skill is diagnosis-first, skeptical, and findings-first. It should question the current solution shape before fixing it, and it may recommend or drive a parallel clean rewrite when the status quo is no longer a good foundation.
metadata:
  author: j13z
---

# Svelte Review Agent Skill

Use this skill when reviewing, diagnosing, restructuring, or fixing non-trivial Svelte 5 frontend problems.

This skill is not limited to passive review. It should be used when the current implementation may be structurally wrong and the first step is to question the existing solution shape before implementing changes.

The primary goal is to detect and correct code that is technically functional but structurally weak, noisy, duplicated, awkward, fragile, or expensive to maintain.

## Required reference loading

Before reviewing or changing code, read these files:

- `references/svelte-review-rubric.md`
- `references/svelte-implementation-rules.md`

Read this file as well when the task touches architecture, state ownership, reactivity, extraction, composition, or reusable abstractions:

- `references/patterns-and-anti-patterns.md`

Use these files actively. Do not treat them as optional background material.

## Primary objectives

Review or fix code for:

- state ownership
- state structure
- reactivity quality
- logic extraction and modularization
- component boundaries
- correct component type selection
- API quality
- Tailwind duplication and composition quality
- markup discipline
- accessibility and semantics
- maintainability over time

This skill is intentionally skeptical, but it should accept existing solutions when they are already structurally sound.

## Use when

Use this skill for tasks like:

- reviewing agent-generated Svelte code
- auditing frontend architecture in a change set
- identifying refactoring opportunities
- checking whether a component should be split or extracted
- reviewing Tailwind composition quality
- checking whether effects/state are modeled correctly
- evaluating whether an implementation is “good enough” or needs cleanup
- fixing bugs that likely stem from technical debt, weak state modeling, synchronization issues, or poor architecture
- deciding whether a local fix is valid or whether the implementation needs restructuring first
- deciding whether a legacy area should still be improved in place or replaced with a cleaner parallel path
- designing and implementing a targeted rewrite when the current structure is no longer a good foundation

Do not use this skill as the primary skill for:

- greenfield visual design ideation
- brand/style exploration
- backend/domain reviews
- broad non-frontend architecture reviews
- simple generation tasks where no diagnosis or structural judgment is needed

## Review mode

Operate in diagnosis-first, findings-first mode.

Do not simply restate what the code does.
Do not assume that the current solution shape is correct.
Identify what is structurally wrong, weak, noisy, risky, or likely to cause cleanup work later.

Prefer concrete critique over generic praise.

**Take a position.**

Do not stop at “possible improvements”. State clearly when a pattern, boundary, bridge, state model, or integration approach should no longer be extended.

## Core requirement: propose a target architecture

Do not stop at critique alone.

When the current solution shape is weak, explicitly propose a target architecture.

That target architecture should:

- define the intended ownership model
- define the main component/module boundaries
- state which existing structures should be kept, replaced, or removed
- name the preferred path forward, not just multiple vague options
- make clear whether the right path is:
  - a local fix
  - a targeted refactor
  - an architectural reshape
  - a partial or parallel rewrite

If multiple paths are possible, recommend one preferred path and explain briefly why it is the best tradeoff.

Do not end with only generic improvement ideas when a clearer architectural target can be stated.

## Review workflow

For each component/module under review:

1. Read the required references first.
2. Review against `references/svelte-review-rubric.md`.
3. Use `references/svelte-implementation-rules.md` to judge whether the implementation follows the intended conventions.
4. Read `references/patterns-and-anti-patterns.md` as needed when the review touches non-trivial architecture or state questions.
5. Decide whether the issue is:
   - a local implementation bug
   - a weak but locally fixable design
   - a structural problem that requires reshaping the solution
   - a legacy area that should no longer be improved in place and should instead be replaced through a clean rewrite
6. Define the target architecture before proposing implementation steps.
7. Produce findings in a structured format.
8. If fixing is requested, implement the smallest clean fix that addresses the actual cause, not just the visible symptom.
9. If the current structure is not a good foundation anymore, say so explicitly and recommend a replacement path instead of incremental repair.

## Review priorities

Prioritize issues in roughly this order:

1. broken or weak state ownership
2. duplicated or badly structured state
3. unnecessary or misused effects
4. wrong component boundaries
5. reusable logic trapped in components
6. wrong component type (primitive/composite/headless)
7. leaky or awkward public APIs
8. duplicated Tailwind structure
9. noisy markup / unnecessary wrappers
10. semantics / accessibility gaps
11. visual/UI noise

## Hard-fix posture

When fixing a non-trivial bug, assume a structural issue first if the problem involves:

- synchronization
- feedback loops
- commands
- editor state
- external updates vs local updates
- competing write paths
- repeated guards or suppression logic
- state that is hard to explain clearly

In those cases:

1. identify the current ownership model
2. identify why it is failing
3. decide whether the bug is a symptom of a broader design problem
4. prefer reshaping the solution over adding another band-aid

Do not begin with the most obvious local fix. Start by diagnosing the ownership and synchronization model, then decide whether the visible bug is the true problem or only its symptom.

Do not default to guards, conditionals, or suppression logic unless they are clearly the correct final fix.

## Rewrite posture

When the status quo is no longer a good foundation, do not force the solution to stay inside the legacy structure.

If the current area has accumulated enough architectural debt that incremental cleanup would mostly preserve the wrong boundaries, say so clearly.

In such cases, prefer one of these paths:

1. a targeted architectural reshape in place, if the current structure is still salvageable
2. a parallel clean rewrite in a new code path, if the legacy structure would otherwise keep dictating bad decisions

A rewrite recommendation should be concrete, not dramatic. Explain:

- why the current structure is not a good base anymore
- which responsibilities or boundaries should be redesigned
- what the new target shape should be
- whether the rewrite should be incremental or parallel

Do not recommend a rewrite lightly, but do not avoid recommending it when it is the cleaner and safer path.

## Report format

Do not produce a report that is dominated by findings alone.

The report should make the target shape clearly visible and should not reduce it to a short appendix.

Use this structure when possible:

### Overall assessment

Start with a clear conclusion:

- **Ready as-is**
- **Needs targeted refactoring**
- **Needs architectural restructuring**
- **Needs partial or parallel rewrite**

Then state, in 2–5 sentences:

- what the real problem is
- whether the current structure is still a good foundation
- what kind of change is actually needed

### Target architecture

This section is mandatory whenever the current structure is not already good enough.

Include:

- the intended ownership model
- the intended component/module boundaries
- which existing structures should be kept
- which structures should be removed or no longer extended
- the preferred path forward
- a lean target shape, not a feature-by-feature restatement of the current system

This section should be a major part of the report, not a small afterthought.

### Findings

For each important finding:

- **Severity**: high / medium / low
- **Category**: state / reactivity / modularity / boundary / API / Tailwind / markup / a11y / maintainability
- **Issue**: what is wrong
- **Why it matters**: why it creates risk, noise, or cleanup cost
- **Recommended fix**: the smallest clean corrective action

Prefer fewer, high-signal findings over long lists of minor observations.

### Preferred plan

Conclude with a concrete path forward:

- what to do first
- what to defer or drop
- whether to refactor in place or rewrite in parallel
- where the main boundaries of the first implementation step should be

## Reporting requirements after changes

If you made code changes, do not end with a minimal changelog-style summary.

You must give a structured post-change report that evaluates the result against the intended target architecture and the requested goal.

Use this structure:

### 1. What changed

Briefly state:

- which main files or modules changed
- which old structures or patterns were removed
- which new boundaries or ownership rules were introduced

### 2. Goal alignment

Evaluate the result explicitly against the intended goal or target architecture.

State:

- which parts of the target shape are now in place
- which parts are only partially achieved
- which goals are still not achieved yet

Do not summarize only the implementation steps. Explicitly judge whether the current result actually matches the intended architecture.

### 3. Remaining gaps and risks

List what is still open, weak, or uncertain.

Include things like:

- legacy patterns still present
- temporary compromises
- areas that still need restructuring
- correctness risks
- missing validation or QA
- compile/type/runtime issues
- places where the implementation may still be too complex

Do not hide unresolved issues behind a positive summary.

### 4. Confidence level

State your confidence carefully.

Use one of:

- high confidence
- moderate confidence
- low confidence

If tests, typechecks, manual verification, or build checks were not run, do not claim high confidence.

### 5. Recommended next step

State the smallest sensible next step:

- review the current architecture
- fix compile/type/runtime issues
- do manual QA
- continue with the next rewrite slice
- clean up remaining legacy structures

## Review of execution discipline

Flag as issues when the implementation:

- silently worked around missing dependencies or project prerequisites
- reimplemented local project helpers without explicit instruction
- continued despite clear blockers without reporting them
- used unreported fallbacks that changed the implementation contract
- applied a local patch where the real problem was structural
- suppressed symptoms without fixing ownership or synchronization problems
- kept extending a legacy structure that should have been challenged or replaced

## Preferred review posture

- be direct
- be concrete
- focus on structural quality
- prefer high-signal findings
- avoid generic positivity
- avoid style-only nitpicks unless they indicate a structural issue
- propose the smallest clean refactor that fixes the real problem
- accept existing solutions when they are already structurally sound
- when necessary, push for structural change instead of preserving a bad status quo
- define the intended target shape, not only the current problems
- after code changes, report against the target shape, not only against the diff

## If asked to fix after review

When moving from review to fix:

1. address state ownership first
2. remove duplicated writable state
3. reduce or eliminate unnecessary effects
4. extract reusable non-visual logic
5. fix component boundaries
6. simplify API shape
7. deduplicate Tailwind structure
8. reduce markup noise
9. only then apply smaller local fixes if they are still needed

If the correct answer is a rewrite or a parallel replacement path, do not fall back to in-place patching just because it seems shorter.

## If asked to rewrite

When asked to rewrite a problematic area:

1. identify the minimal replacement scope
2. define the new ownership model and boundaries first
3. keep the new path isolated from the legacy path
4. avoid carrying over legacy bridges, guards, and workaround layers unless they are still justified
5. prefer a lean target architecture over feature-for-feature structural imitation
6. make the migration path explicit

## Resources

Use these resources as canonical references when needed:

- `references/patterns-and-anti-patterns.md`
- `references/svelte-implementation-rules.md`
- `references/svelte-review-rubric.md`
- `assets/Primitive.svelte`
- `assets/Composite.svelte`
- `assets/HeadlessPrimitive.svelte`
- `assets/utils.ts`
