import { put } from "@vercel/blob"

import type { StoragePort } from "@/modules/documents/ports/storage-port"

export class VercelBlobStorage implements StoragePort {
  async upload(key: string, data: Buffer, contentType: string): Promise<string> {
    const blob = await put(key, data, {
      access: "public",
      contentType,
      addRandomSuffix: false,
    })
    return blob.url
  }
}
