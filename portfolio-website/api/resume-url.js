import { list } from '@vercel/blob';

export default async function handler(req, res) {
  try {
    const { blobs } = await list({prefix: '_Resume'});

    const latestResume = blobs.sort((a, b) => 
      new Date(b.uploadedAt) - new Date(a.uploadedAt)
    ) [0];

    res.json({
      url: latestResume.url,
      uploadedAt: latestResume.uploadedAt,
      filename: latestResume.pathname
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch resume URL' });
  }
}