import { UploadClient } from '@uploadcare/upload-client';

const PUBLIC_KEY = 'df808a7002c53f365c09';

const client = new UploadClient({ publicKey: PUBLIC_KEY });

export const uploadFile = async (file: File): Promise<string> => {
    try {
        const result = await client.uploadFile(file);
        // We add a CDN transformation for optimization
        return `${result.cdnUrl}-/preview/1024x1024/-/format/auto/-/quality/smart/`;
    } catch (error) {
        console.error("Uploadcare error:", error);
        throw new Error("Failed to upload file to server.");
    }
};
