import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import { requireAdmin } from '@/lib/auth';

export const config = {
  api: { bodyParser: { sizeLimit: '10mb' } },
};

// Magic-byte signatures for the file types we allow. Checking these (in
// addition to the client-supplied mime type) stops disguised uploads.
function detectMimeType(buf: Buffer, clientType?: string): string | null {
  if (buf.length < 4) return null;
  // JPEG: FF D8 FF
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return 'image/jpeg';
  // PNG: 89 50 4E 47
  if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) return 'image/png';
  // GIF: 47 49 46 38
  if (buf[0] === 0x47 && buf[1] === 0x49 && buf[2] === 0x46 && buf[3] === 0x38) return 'image/gif';
  // WebP: "RIFF....WEBP"
  if (
    buf.length >= 12 &&
    buf[0] === 0x52 && buf[1] === 0x49 && buf[2] === 0x46 && buf[3] === 0x46 &&
    buf[8] === 0x57 && buf[9] === 0x45 && buf[10] === 0x42 && buf[11] === 0x50
  ) return 'image/webp';
  // SVG is XML text — detect by presence of "<svg" or "<?xml" anywhere in head.
  const head = buf.slice(0, 500).toString('utf8').toLowerCase();
  if (head.includes('<svg') || head.includes('<?xml')) return 'image/svg+xml';

  const normalizedClient = clientType ? clientType.toLowerCase() : '';
  if (['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'].includes(normalizedClient)) {
    return normalizedClient;
  }

  return null;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  // Only authenticated admins can upload files.
  const admin = requireAdmin(req, res);
  if (!admin) {
    // requireAdmin already sent a 401 — also log for debugging
    console.error('[upload] Rejected: no valid admin session cookie');
    return;
  }

  const { fileName, data, fileType } = req.body;

  if (!fileName || !data) {
    return res.status(400).json({ message: 'fileName and data are required' });
  }

  // Strip base64 prefix if present (e.g. "data:image/png;base64,...")
  const base64Data = data.replace(/^data:[^;]+;base64,/, '');
  const buffer = Buffer.from(base64Data, 'base64');

  // Enforce a hard 10MB cap on the decoded payload.
  if (buffer.length > 10 * 1024 * 1024) {
    return res.status(413).json({ message: 'File too large (max 10MB)' });
  }

  // Verify the actual file type from its bytes, not the client's claim.
  const detected = detectMimeType(buffer, fileType);
  const allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
  if (!detected || !allowed.includes(detected)) {
    return res.status(400).json({ message: 'File type not allowed or unrecognized' });
  }

  try {
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Sanitize file name and prevent path traversal.
    const safeName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
    const extension = detected === 'image/svg+xml' ? 'svg' : detected.split('/')[1];
    const finalName = safeName.includes('.') ? safeName : `${safeName}.${extension}`;
    const filePath = path.join(uploadDir, path.basename(finalName));
    // Final guard against any "../" style sequences.
    if (!filePath.startsWith(uploadDir)) {
      return res.status(400).json({ message: 'Invalid file name' });
    }
    fs.writeFileSync(filePath, buffer);

    return res.status(200).json({
      url: `/uploads/${path.basename(finalName)}`,
      message: 'File uploaded successfully',
    });
  } catch (e) {
    console.error('Upload error:', e);
    return res.status(500).json({ message: 'File upload failed' });
  }
}
