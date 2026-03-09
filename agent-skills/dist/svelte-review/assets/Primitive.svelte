<!--

This is a "golden path" template / blueprint outlining how to create a "primitive" component.
A primitive is a low-level "leaf" component with exactly one DOM element as its root.

This setup adds a bit of boilerplate code but provides a primitive that is open for extension / integration and
composes well because it:

- Exposes a `class` attribute for class-based styling
- Exposes all other underlying element props
- Exposes a bindable `ref` attribute

These conventions are inspired by [Bits UI](https://bits-ui.com/docs), [LLM docs](https://bits-ui.com/llms.txt).

- This template intentionally omits the advanced
  [`child` render delegation pattern](https://bits-ui.com/docs/child-snippet/llms.txt)
  as used by Bits UI. Prefer a regular primitive first.

- Consider adding it for more complex use cases, but then you will probably want to make the component a _headless_
  primitive instead (see `./HeadlessPrimitive.svelte`).

Comment structure:

- "👉" points to areas that you should change
- "📖" comments provide additional explanations
- Remove both types of comments in the output

-->

<!-- 📖 Module-script -->
<script lang="ts" module>
	import type { HTMLAttributes } from "svelte/elements"
	import { tv, type VariantProps } from "tailwind-variants"
	import { cn, type WithChildren, type WithElementRef } from "$lib/ui/utils"

	// 📖 Use of `tailwind-variants` is *optional* → omit and just use `cn`
	//    if this component does not expose a meaningful variant surface
	const primitiveVariants = tv({
		// 👉 Update / remove things here as needed
		base: "block",
		variants: {
			tone: {
				default: null,
				muted: "text-muted-foreground"
			},
			density: {
				default: null,
				compact: "px-2 py-1",
				comfy: "px-3 py-2"
			}
		},
		defaultVariants: {
			tone: "default",
			density: "default"
		}
	})

	type RootElementType = HTMLDivElement // 👉 Update if you use a different element
	type BaseProps = WithChildren<WithElementRef<HTMLAttributes<RootElementType>, RootElementType>> // 📖 Adds `ref` and `children` props

	export type Props = BaseProps &
		VariantProps<typeof primitiveVariants> & {
			// 👉 Your props go here …
		}
</script>

<!-- 📖 Instance-script -->
<script lang="ts">
	let {
		// 👉 Destructure all of your props here.
		//    `restProps` should only contain the underlying element's props.

		// 📖 Variant props (`tailwind-variants`):
		tone,
		density,

		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: Props = $props()
</script>

<!-- 👉 Replace `example-component` here and adopt as need -->
<!-- 📖 `div` as the root can be changed for any other element (also change the typing then) -->
<div bind:this={ref} {...restProps} class={cn(primitiveVariants({ tone, density }), className)}>
	{@render children?.()}
</div>
