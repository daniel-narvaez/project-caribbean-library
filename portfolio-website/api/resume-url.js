import { list } from '@vercel/blob';

export default async function handler(req, res) {
    try {
        console.log('API: Starting request...');
        
        if (!process.env.BLOB_READ_WRITE_TOKEN) {
            throw new Error('BLOB_READ_WRITE_TOKEN is not configured');
        }
        
        console.log('API: Token exists, attempting to list blobs...');
        
        const { type = 'docx' } = req.query;
        const { blobs } = await list({ prefix: 'DanielNarvaez_Resume' });
        
        console.log('API: Blobs found:', blobs);
        
        if (!blobs || blobs.length === 0) {
            throw new Error('No blobs found with the specified prefix');
        }

        const typeFiles = blobs.filter(blob => blob.pathname.endsWith(`.${type}`));
        
        if (typeFiles.length === 0) {
            throw new Error(`No ${type} files found`);
        }

        const latestResume = blobs.sort((a, b) => 
            new Date(b.uploadedAt) - new Date(a.uploadedAt)
        )[0];

        res.json({ 
            url: latestResume.url, 
            uploadedAt: latestResume.uploadedAt,
            filename: latestResume.pathname 
        });
    } catch (error) {
        console.error('API Error Details:', error);
        res.status(500).json({ 
            error: `Failed to fetch resume URL: ${error.message}`,
            details: error.stack
        });
    }
}