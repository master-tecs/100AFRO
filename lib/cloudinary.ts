import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export { cloudinary }

export async function uploadImage(file: File | string, folder: string = '100afro'): Promise<string> {
  try {
    if (typeof file === 'string') {
      // If it's a URL, upload it
      const result = await cloudinary.uploader.upload(file, {
        folder,
        resource_type: 'image',
      })
      return result.secure_url
    } else {
      // If it's a File object, convert to buffer
      const arrayBuffer = await file.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)
      
      return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            folder,
            resource_type: 'image',
          },
          (error, result) => {
            if (error) reject(error)
            else resolve(result!.secure_url)
          }
        ).end(buffer)
      })
    }
  } catch (error) {
    console.error('Cloudinary upload error:', error)
    throw error
  }
}

export function getCloudinaryUrl(publicId: string, transformations?: Record<string, any>): string {
  return cloudinary.url(publicId, {
    secure: true,
    ...transformations,
  })
}

