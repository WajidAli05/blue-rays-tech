import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';

/**
 * Upload file buffer to Cloudinary
 * @param {Buffer} fileBuffer - File buffer from multer
 * @param {String} folder - Cloudinary folder name
 * @param {String} resourceType - 'image', 'video', 'raw', or 'auto'
 * @returns {Promise<Object>} - Cloudinary upload response
 */
export const uploadToCloudinary = (fileBuffer, folder = 'products', resourceType = 'auto') => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folder,
        resource_type: resourceType,
        transformation: resourceType === 'image' ? [
          { quality: 'auto', fetch_format: 'auto' }
        ] : undefined
      },
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          reject(error);
        } else {
          resolve(result);
        }
      }
    );

    streamifier.createReadStream(fileBuffer).pipe(uploadStream);
  });
};

/**
 * Delete file from Cloudinary
 * @param {String} publicId - Cloudinary public_id
 * @param {String} resourceType - 'image', 'video', 'raw'
 * @returns {Promise<Object>} - Cloudinary delete response
 */
export const deleteFromCloudinary = async (publicId, resourceType = 'image') => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });
    return result;
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    throw error;
  }
};

/**
 * Extract public_id from Cloudinary URL
 * @param {String} url - Cloudinary URL
 * @returns {String} - Public ID
 */
export const extractPublicId = (url) => {
  if (!url) return null;
  
  // Cloudinary URL format: https://res.cloudinary.com/{cloud_name}/{resource_type}/upload/v{version}/{public_id}.{format}
  const parts = url.split('/');
  const uploadIndex = parts.indexOf('upload');
  
  if (uploadIndex === -1) return null;
  
  // Get everything after 'upload/v{version}/'
  const publicIdWithExtension = parts.slice(uploadIndex + 2).join('/');
  
  // Remove file extension
  const lastDotIndex = publicIdWithExtension.lastIndexOf('.');
  const publicId = lastDotIndex !== -1 
    ? publicIdWithExtension.substring(0, lastDotIndex)
    : publicIdWithExtension;
  
  return publicId;
};

/**
 * Determine resource type from mimetype
 * @param {String} mimetype - File mimetype
 * @returns {String} - Cloudinary resource type
 */
export const getResourceType = (mimetype) => {
  if (mimetype.startsWith('image/')) return 'image';
  if (mimetype.startsWith('video/')) return 'video';
  return 'raw'; // For documents, PDFs, etc.
};