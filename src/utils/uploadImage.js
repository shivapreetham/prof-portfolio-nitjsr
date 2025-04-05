// uploadImage.js
const defaultConfig = {
  bucketName: 'images',
  maxFileSize: 5 * 1024 * 1024, // 5MB
  acceptedFileTypes: ["image/jpeg", "image/jpg", "image/png", "image/webp"],
};

export const uploadImage = async (file, config = {}) => {
  try {
    // Merge default config with provided config
    const finalConfig = { ...defaultConfig, ...config };
    const { folderPath, maxFileSize, acceptedFileTypes } = finalConfig;

    // Validate file type
    if (!acceptedFileTypes.includes(file.type)) {
      return {
        success: false,
        error: `Invalid file type. Accepted types: ${acceptedFileTypes.join(', ')}`,
      };
    }

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
    };
  } catch (error) {
    console.error('Upload failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed',
    };
  }
};
