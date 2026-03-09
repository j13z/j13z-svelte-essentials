<!--

This is a "golden path" template / blueprint outlining how to create a "headless primitive" component.
A headless primitive is a low-level reusable building block that provides behavior / semantics but does not prescribe
styling.

This setup is useful when a component should be reusable across projects and therefore stay maximally open because it:

- Does not ship opinionated styling
- Has the same characteristics as `Primitive.svelte`:
    - Exposes a `class` attribute for optional caller styling
    - Exposes all other underlying element's props
    - Exposes a bindable `ref` attribute
    - Optionally supports `child` render delegation for advanced composition

These conventions are inspired by [Bits UI](https://bits-ui.com/docs), [LLM docs](https://bits-ui.com/llms.txt).

The [optional `child` snippet](https://bits-ui.com/docs/child-snippet/llms.txt) is an advanced pattern. It allows the
caller to render their own element while still receiving props that must be forwarded to preserve behavior / semantics.

- Prefer a regular primitive first.
- Reach for `child` only when the extra flexibility is actually needed.

Comment structure:

- "👉" points to areas that you should change
- "📖" comments provide additional explanations
- Remove both types of comments in the output

-->

<!-- 📖 Module-script -->
<script lang="ts" module>
	import type { Snippet } from "svelte"
	import type { HTMLButtonAttributes } from "svelte/elements"
	import { type WithElementRef } from "$lib/ui/utils"

	type RootElementType = HTMLButtonElement // 👉 Update if you use a different element
	type RootAttributes = HTMLButtonAttributes
	type ChildSnippetProps = {
		props: RootAttributes
		ref: RootElementType | null
	}

	type BaseProps = WithElementRef<RootAttributes, RootElementType> & {
		children?: Snippet
		child?: Snippet<[ChildSnippetProps]>
	}

	export type Props = BaseProps & {
		// 👉 Your behavioral / semantic props go here …
		disabled?: boolean
		pressed?: boolean
	}
</script>

<!-- 📖 Instance-script -->
<script lang="ts">
	let {
		// 👉 Destructure all of your props here.
		//    `restProps` should only contain the underlying element's props.

		// 👉 Example behavioral props:
		disabled = false,
		pressed = false,

		ref = $bindable(null),
		class: className,
		children,
		child,
		...restProps
	}: Props = $props()

	// 📖 These are the props that must always reach the rendered element,
	//    whether it is the default root element or a caller-provided `child`.
	const forwardedProps: RootAttributes = $derived({
		...restProps,
		class: className,
		disabled,
		"aria-pressed": pressed ? "true" : "false",
		"data-disabled": disabled ? "" : undefined,
		"data-pressed": pressed ? "" : undefined
	})
</script>

{#if child}
	<!-- 📖 Render delegation: caller renders the actual element -->
	{@render child({ props: forwardedProps, ref })}
{:else}
	<!-- 📖 Default fallback root element -->
	<button bind:this={ref} {...forwardedProps}>
		{@render children?.()}
	</button>
{/if}
