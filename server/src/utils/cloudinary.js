const { cloudinary, configureCloudinary } = require('../config/cloudinaryConfig');

configureCloudinary();

const uploadImage = async file => {
  if (!file) {
    throw new Error('No file provided for upload');
  }

  if (file.buffer) {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'campusbook', resource_type: 'image' },
        (error, result) => {
          if (error) return reject(error);
          resolve({ url: result.secure_url, publicId: result.public_id });
        }
      );

      uploadStream.end(file.buffer);
    });
  }

  const uploadResponse = await cloudinary.uploader.upload(file, {
    folder: 'campusbook',
    resource_type: 'image',
  });

  return {
    url: uploadResponse.secure_url,
    publicId: uploadResponse.public_id,
  };
};

const deleteImage = async publicId => {
  if (!publicId) return;
  await cloudinary.uploader.destroy(publicId);
};

module.exports = { uploadImage, deleteImage };
