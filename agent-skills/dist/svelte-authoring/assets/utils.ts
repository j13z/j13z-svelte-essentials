import { clsx, type ClassValue } from "clsx"
import type { Snippet } from "svelte"
import { twMerge } from "tailwind-merge"

/**
 * Helper for class attribute composition.
 *
 * - Combines / produces class names, allowing flexible `clsx` syntax
 * - "De-duplicates" Tailwind classes using `twMerge` to prevent e.g. `p-2 p-4` duplication
 */
export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChild<T> = T extends { child?: any } ? Omit<T, "child"> : T

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChildren<T> = T extends { children?: any } ? Omit<T, "children"> : T

export type WithoutChildrenOrChild<T> = WithoutChildren<WithoutChild<T>>

export type WithElementRef<T, U extends HTMLElement = HTMLElement> = T & { ref?: U | null }

export type WithChildren<Props = {}> = Props & {
	children?: Snippet | undefined
}
