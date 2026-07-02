import type { Page } from '@/payload-types'

/**
 * Discriminated union of every block in the Pages builder.
 *
 * Payload's generated `payload-types.ts` inlines the blocks union directly on
 * `Page['blocks']` and does not emit a named `PageBlock` export, so we derive
 * one here. Block components narrow with `Extract<PageBlock, { blockType: 'x' }>`.
 */
export type PageBlock = NonNullable<Page['blocks']>[number]

/** Union of all block `blockType` discriminants. */
export type PageBlockType = PageBlock['blockType']
