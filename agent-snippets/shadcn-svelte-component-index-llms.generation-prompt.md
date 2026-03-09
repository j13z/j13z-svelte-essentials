# Generation prompt for `shadcn-svelte-component-index-llms.md`

> Execute e.g. with ChatGTP GTP-5.4 Thinking.
>
> Note: Check the generated version, it sometimes gets this wrong; or just add it manually.
>
> Grouping of components left up the the model, but GPT-5.4 usually does this well.

## Prompt

Create a very short, LLM-friendly index as a Markdown file from the Markdown docs for the `shadcn-svelte` component library in https://github.com/huntabyte/shadcn-svelte/blob/main/docs/content/components (GitHub repo), in the style of an `LLMs.txt` document. The goal is to enable coding agents, via progressive disclosure, both to recognize the available documents and to look up more detailed documentation when needed. It should be structured so that the resulting index file can be cleanly embedded into a `SKILL.md` using progressive disclosure, allowing the agent to determine when to use which `shadcn-svelte` components, which ones it should prefer, and what purpose they serve.

If there is a suitable `shadcn-svelte` component for a given purpose, the agent should always prefer it over other components or native DOM elements, unless it has been given different instructions. The goal is to remove that decision burden from the agent.

A very short bullet list of all components is sufficient. Explanations are only needed when a component’s purpose is not obvious.

- For example, a `Button` component is self-explanatory, as are most other components.
- But for something like a `Toggle Group`, a _short_ explanation may be helpful.

The text should be clear and compact, without unnecessary filler, introductions, or closing remarks.

## Output format

Preparation: Retrieve the last release version of `shadcn-svelte` from https://github.com/huntabyte/shadcn-svelte/releases

Start the outputted document with the following content, replacing values within `{{…}}` accordingly:

```markdown
<!-- Generated using the prompt `shadcn-svelte-component-index-llms.generation-prompt.md` -->

# shadcn-svelte Component Index / LLM docs

_Last updated: {{isoDate}}, refers to `shadcn-svelte` version {{version}}; AI-generated from https://github.com/huntabyte/shadcn-svelte/tree/main/docs/content/components_

This document lists all UI components provided by the `shadcn-svelte` library.

Use `shadcn-svelte` components by default instead of raw HTML element when an equivalent exists. Prefer higher-level primitives, if applicable.

Before using a component for the first time, refer to the linked documentation and **read the usage instructions and code example** (load references component docs lazily / on demand).
```

- Each component should be listed in the following form (using `Button` only as an example here):
    ```markdown
    - [`Button`](https://raw.githubusercontent.com/huntabyte/shadcn-svelte/refs/heads/main/docs/content/components/button.md){{: optional description}}
    ```
    - Replace the `{{ … }}` parts
    - Make sure to use a "raw" GitHub link

- Split the listing into meaningful groups (by usage classification), keeping each individual list alphabetically sorted.

Output the result as a Markdown document in a code block.
