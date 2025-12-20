// Edge-compatible Cloudinary upload using REST API
export async function uploadImage(file: File | string, folder: string = '100afro'): Promise<string> {
  try {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      throw new Error('Cloudinary credentials not configured');
    }

    const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
    const timestamp = Math.floor(Date.now() / 1000).toString();
    
    // Build parameters for signature (must be sorted)
    const params: Record<string, string> = {
      folder,
      timestamp,
    };
    
    // Sort parameters and build signature string
    const sortedParams = Object.keys(params)
      .sort()
      .map(key => `${key}=${params[key]}`)
      .join('&');
    
    const signatureString = sortedParams + apiSecret;
    
    // Generate SHA-1 signature using Web Crypto API (Edge-compatible)
    const encoder = new TextEncoder();
    const data = encoder.encode(signatureString);
    const hashBuffer = await crypto.subtle.digest('SHA-1', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const signature = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    
    const formData = new FormData();
    
    if (typeof file === 'string') {
      // If it's a URL
      formData.append('file', file);
    } else {
      // If it's a File object
      formData.append('file', file);
    }
    
    formData.append('folder', folder);
    formData.append('api_key', apiKey);
    formData.append('timestamp', timestamp);
    formData.append('signature', signature);
    
    const response = await fetch(uploadUrl, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Cloudinary upload failed: ${errorText}`);
    }

    const result = await response.json();
    return result.secure_url;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
}

export function getCloudinaryUrl(publicId: string, transformations?: Record<string, any>): string {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME || '';
  const baseUrl = `https://res.cloudinary.com/${cloudName}/image/upload`;
  
  if (transformations && Object.keys(transformations).length > 0) {
    const transString = Object.entries(transformations)
      .map(([key, value]) => `${key}_${value}`)
      .join(',');
    return `${baseUrl}/${transString}/${publicId}`;
  }
  
  return `${baseUrl}/${publicId}`;
}

