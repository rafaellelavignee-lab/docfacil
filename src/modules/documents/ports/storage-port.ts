export interface StoragePort {
  upload(key: string, data: Buffer, contentType: string): Promise<string>
}
