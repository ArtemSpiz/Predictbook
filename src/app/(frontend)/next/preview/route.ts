import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import { NextRequest } from 'next/server'

/**
 * Enable Next draft mode, then redirect to the target path so drafts render.
 * Called by Payload's admin preview button / live-preview iframe. Guarded by
 * `PREVIEW_SECRET`.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const secret = searchParams.get('secret')
  const pathParam = searchParams.get('path') || '/'

  if (!process.env.PREVIEW_SECRET || secret !== process.env.PREVIEW_SECRET) {
    return new Response('Invalid preview secret', { status: 401 })
  }

  // Only allow same-site relative paths.
  const path = pathParam.startsWith('/') ? pathParam : `/${pathParam}`

  const draft = await draftMode()
  draft.enable()
  redirect(path)
}
