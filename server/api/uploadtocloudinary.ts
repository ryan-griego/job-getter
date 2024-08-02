import { defineEventHandler } from 'h3';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: 'dm7y3yvjp',
  api_key: '278544775966237',
  api_secret: 'OcaP4U2KlEgvEuh4wIp136kGEG4',
});

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { image, type } = body;

    console.log('log the image---', image);

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

    console.log("log the result", result);
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
