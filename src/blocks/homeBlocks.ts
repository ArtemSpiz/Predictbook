export interface RenderableBlock {
  blockType: string
  hidden?: boolean | null
}

export type RegionSegment<B extends RenderableBlock> =
  | { kind: 'group'; blocks: B[] }
  | { kind: 'single'; block: B }

/** Split a region's blocks into render segments: consecutive `groupType`
 *  blocks collapse into one `group` segment; everything else is a `single`.
 *  Hidden blocks are removed first. Order is preserved. */
export function planRegion<B extends RenderableBlock>(
  blocks: B[] | null | undefined,
  groupType: string,
): RegionSegment<B>[] {
  const visible = (blocks ?? []).filter((block) => !block.hidden)
  const segments: RegionSegment<B>[] = []
  let i = 0
  while (i < visible.length) {
    if (visible[i].blockType === groupType) {
      const group: B[] = []
      while (i < visible.length && visible[i].blockType === groupType) {
        group.push(visible[i])
        i++
      }
      segments.push({ kind: 'group', blocks: group })
    } else {
      segments.push({ kind: 'single', block: visible[i] })
      i++
    }
  }
  return segments
}
