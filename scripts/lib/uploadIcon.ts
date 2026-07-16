/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from 'fs'
import path from 'path'
import sharp from 'sharp'

/**
 * Idempotently ensure an icon exists in the media collection as `<name>.webp`.
 * Reuses the existing doc when present (restoring the file on disk if it went
 * missing) so repeat runs never create `filename-1` duplicates. Returns the id.
 */
export async function uploadIconWebp(
  payload: any,
  publicDir: string,
  pngName: string,
  alt: string,
): Promise<string> {
  const mediaDir = path.join(publicDir, 'media')
  const webpName = pngName.replace(/\.png$/, '.webp')
  const onDisk = (filename?: string | null) =>
    !!filename && fs.existsSync(path.join(mediaDir, filename))

  const found = await payload.find({
    collection: 'media',
    where: { filename: { equals: webpName } },
    limit: 1,
  })
  if (found.docs.length) {
    const existing = found.docs[0]
    if (!onDisk(existing.filename)) {
      const buf = await sharp(path.join(publicDir, pngName)).webp().toBuffer()
      fs.writeFileSync(path.join(mediaDir, existing.filename), new Uint8Array(buf))
    }
    return existing.id
  }

  const data = await sharp(path.join(publicDir, pngName)).webp().toBuffer()
  const doc = await payload.create({
    collection: 'media',
    data: { alt },
    file: { data, mimetype: 'image/webp', name: webpName, size: data.length },
  })
  return doc.id
}
