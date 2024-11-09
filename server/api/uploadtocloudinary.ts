import { defineEventHandler } from 'h3';
import { v2 as cloudinary } from 'cloudinary';
const config = useRuntimeConfig();


cloudinary.config({
  cloud_name: config.keys.CLOUDINARY_CLOUD_NAME,
  api_key: config.keys.CLOUDINARY_API_KEY,
  api_secret: config.keys.CLOUDINARY_API_SECRET,
});

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { image, type } = body;

    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload(
        `data:${type};base64,${image}`,
        { resource_type: 'image', format: 'jpg' },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
    });

    return {
      statusCode: 200,
      body: { url: result.url }
    };
  } catch (error) {
    console.error('API error:', error);
    return {
      statusCode: 500,
      body: { error: 'Internal server error' }
    };
  }
});
