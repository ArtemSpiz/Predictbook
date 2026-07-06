import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import { NextRequest } from 'next/server'

/** Disable draft mode and return to the given path (or home). */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const pathParam = searchParams.get('path') || '/'
  const path = pathParam.startsWith('/') ? pathParam : `/${pathParam}`

  const draft = await draftMode()
  draft.disable()
  redirect(path)
}
