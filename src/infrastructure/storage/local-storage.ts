import { mkdir, writeFile } from "node:fs/promises"
import path from "node:path"

import type { StoragePort } from "@/modules/documents/ports/storage-port"

const PUBLIC_DIR = path.join(process.cwd(), "public", "generated-pdfs")

/** Storage local para desenvolvimento — grava em public/generated-pdfs e
 * serve via o próprio Next.js. Em produção, use VercelBlobStorage. */
export class LocalStorage implements StoragePort {
  async upload(key: string, data: Buffer): Promise<string> {
    const filePath = path.join(PUBLIC_DIR, key)
    await mkdir(path.dirname(filePath), { recursive: true })
    await writeFile(filePath, data)
    return `/generated-pdfs/${key.replace(/\\/g, "/")}`
  }
}
