import { extname } from "path";

export function getMimeType(filename: string) {
    const ext = extname(filename).toLowerCase();
    const types: Record<string, string> = {
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.pdf': 'application/pdf'
    };
    return types[ext] || 'application/octet-stream';
  }
  