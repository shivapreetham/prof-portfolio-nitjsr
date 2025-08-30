// uploadMedia.js
const defaultConfig = {
  bucketName: 'media',
  maxFileSize: 50 * 1024 * 1024, // 50MB for videos, 5MB for images
  imageTypes: ["image/jpeg", "image/jpg", "image/png", "image/webp"],
  videoTypes: ["video/mp4", "video/webm", "video/ogg", "video/avi", "video/mov"],
};

export const uploadMedia = async (file, config = {}) => {
  try {
    // Merge default config with provided config
    const finalConfig = { ...defaultConfig, ...config };
    const { folderPath, imageTypes, videoTypes } = finalConfig;

    // Determine if file is image or video
    const isImage = imageTypes.includes(file.type);
    const isVideo = videoTypes.includes(file.type);
    
    if (!isImage && !isVideo) {
      return {
        success: false,
        error: `Invalid file type. Accepted types: ${[...imageTypes, ...videoTypes].join(', ')}`,
      };
    }

    // Set appropriate file size limit
    const maxFileSize = isImage ? 5 * 1024 * 1024 : 50 * 1024 * 1024; // 5MB for images, 50MB for videos
    
    // Validate file size
    if (file.size > maxFileSize) {
      return {
        success: false,
        error: `File too large. Maximum size: ${maxFileSize / (1024 * 1024)}MB`,
      };
    }

    // Extract only the base file name (remove any folder paths)
    const baseName = file.name.split('/').pop();
    const fileExt = baseName.split('.').pop();
    const fileName = `${folderPath ? `${folderPath}/` : ''}${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

    // Request a presigned URL from your Cloudflare R2 API
    const res = await fetch('/api/cloudFlare/cloudFlareUpload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filename: fileName, contentType: file.type }),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error);

    // Upload file to Cloudflare R2 using the presigned URL
    const uploadRes = await fetch(data.presignedUrl, {
      method: 'PUT',
      headers: { 'Content-Type': file.type },
      body: file,
    });
    if (!uploadRes.ok) throw new Error('Upload failed');

    return {
      success: true,
      url: data.publicUrl,
      type: isImage ? 'image' : 'video',
      filename: baseName,
      size: file.size,
      mimeType: file.type
    };
  } catch (error) {
    console.error('Upload failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed',
    };
  }
};