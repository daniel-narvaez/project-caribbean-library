/**
 * resume-url.js
 * ============
 * 
 * API handler for fetching the latest resume URL from Vercel Blob storage.
 * Supports multiple file types and returns the most recently uploaded version.
 * 
 * @endpoint GET /api/resume-url
 * @query {string} type - File type to fetch (default: 'docx')
 * @returns {Object} Latest resume file information
 */

import { list } from '@vercel/blob';

// Configuration
const CONFIG = {
    PREFIX: 'DanielNarvaez_Resume',
    ALLOWED_TYPES: ['docx', 'pdf']
};

/**
 * Validates request parameters
 * @param {string} type - File type requested
 * @throws {Error} If type is invalid
 */
function validateRequest(type) {
    if (!CONFIG.ALLOWED_TYPES.includes(type)) {
        throw new Error(`Invalid file type. Allowed types: ${CONFIG.ALLOWED_TYPES.join(', ')}`);
    }
}

/**
 * Finds the latest resume file of specified type
 * @param {Array} blobs - List of blobs from storage
 * @param {string} type - File type to filter
 * @returns {Object} Latest matching file
 * @throws {Error} If no matching files found
 */
function findLatestFile(blobs, type) {
    const typeFiles = blobs.filter(blob => blob.pathname.endsWith(`.${type}`));
    
    if (!typeFiles.length) {
        throw new Error(`No ${type} files found in storage`);
    }

    return typeFiles.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt))[0];
}

/**
 * Main API handler
 */
export default async function handler(req, res) {
    try {
        // Environment check
        if (!process.env.BLOB_READ_WRITE_TOKEN) {
            throw new Error('Storage access token not configured');
        }

        // Get and validate file type
        const { type = 'docx' } = req.query;
        validateRequest(type);

        // Fetch blob list
        const { blobs } = await list({ prefix: CONFIG.PREFIX });
        
        if (!blobs?.length) {
            throw new Error('No resume files found in storage');
        }

        // Find latest file and return info
        const latestFile = findLatestFile(blobs, type);
        
        res.json({
            url: latestFile.url,
            uploadedAt: latestFile.uploadedAt,
            filename: latestFile.pathname
        });

    } catch (error) {
        console.error('Resume URL API Error:', {
            message: error.message,
            stack: error.stack
        });

        res.status(500).json({
            error: 'Failed to fetch resume URL',
            message: error.message
        });
    }
}