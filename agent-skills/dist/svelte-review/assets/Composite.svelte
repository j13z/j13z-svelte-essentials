<!--

This is a "golden path" template / blueprint outlining how to create a "composite" component.
A composite builds on top of other primitives / components and provides a more curated, opinionated API.

This setup is useful when a component should do more than "render one element".

For wrappers around other components, prefer exposing a small, explicit API instead of blindly leaking the full
API surface of the underlying component.

Comment structure:

- "👉" points to areas that you should change
- "📖" comments provide additional explanations
- Remove both types of comments in the output

-->

<!-- 📖 Module-script -->
<script lang="ts" module>
	import type { Snippet } from "svelte"
	import { tv, type VariantProps } from "tailwind-variants"
	import { cn, type WithoutChildrenOrChild } from "$lib/ui/utils"

	/**
	 * 👉 Replace this import with the actual underlying building block.
	 *
	 * Examples:
	 * - a local primitive like `Surface.svelte`
	 * - a Bits UI primitive / root part
	 * - another internal base component
	 */
	import Root, { type Props as RootProps } from "./Primitive.svelte"

	// 📖 Use of `tailwind-variants` is *optional* → omit and just use `cn`
	//    if this component does not expose a meaningful variant surface
	const compositeVariants = tv({
		// 👉 Update / remove things here as needed
		base: "",
		variants: {
			inset: {
				false: "",
				true: "p-4"
			}
		},
		defaultVariants: {
			inset: true
		}
	})

	// 📖 Excludes `children` / `child` from the wrapped component's public API,
	//    because this component defines its own snippet API
	type RootPassthroughProps = WithoutChildrenOrChild<RootProps>

	export type Props = RootPassthroughProps &
		VariantProps<typeof compositeVariants> & {
			// 👉 Add props as needed

			// 📖 Named snippets are useful when the component provides structure
			header?: Snippet
			children?: Snippet
			footer?: Snippet

			// 📖 Optionally, expose class props for nested elements / primitives if callers
			//    should be able to override specific internal styling hooks
			classHeader?: string
			classFooter?: string
		}
</script>

<!-- 📖 Instance-script -->
<script lang="ts">
	let {
		// 👉 Destructure all of your props here.
		//    `restProps` should only contain the wrapped root component's passthrough props.

		// 📖 Variant props (`tailwind-variants`):
		inset,

		// 👉 Custom snippet props:
		header,
		children,
		footer,

		// 👉 Optional nested styling hooks:
		classHeader,
		classFooter,

		class: className,
		...restProps
	}: Props = $props()
</script>

<!-- 📖 The root is another component, not a raw DOM element -->
<Root {...restProps} class={cn(compositeVariants({ inset }), className)}>
	{#if header}
		<div class={cn("mb-4", classHeader)}>
			{@render header()}
		</div>
	{/if}

	{@render children?.()}

	{#if footer}
		<div class={cn("mt-4", classFooter)}>
			{@render footer()}
		</div>
	{/if}
</Root>
