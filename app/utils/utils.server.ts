import { json, writeAsyncIterableToWritable } from "@remix-run/node";
import cloudinary from "cloudinary";

// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// Function to upload an image to Cloudinary
export async function uploadImage(data) {
  try {
    const byteArrayBuffer = Buffer.isBuffer(data) ? data : Buffer.from(data);
    const uploadResult = await new Promise(async (resolve, reject) => {
      cloudinary.v2.uploader.upload_stream((error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }).end(byteArrayBuffer);

    });

    console.log(uploadResult);
    const uploadResultPublicId = uploadResult.public_id;
    return json({ uploadResultPublicId });
  } catch (error) {
    console.error("Error uploading image:", error);
    return json({ error: "Failed to upload image" }, { status: 500 });
  }
}

// Function to create an image tag with transformations
export async function createImageTag(publicId, ...colors) {
  const [effectColor, backgroundColor] = colors;
  const transformation = [
    { width: 250, height: 250, gravity: 'faces', crop: 'thumb' },
    { radius: 'max' },
    { effect: 'outline:10', color: effectColor },
    { background: backgroundColor },
  ];

  const imageTag = cloudinary.image(publicId, { transformation });
  return json({ imageTag });
}

// Function to retrieve asset information from Cloudinary
export async function getAssetInfo(publicId) {
  const options = { colors: true };

  try {
    const result = await cloudinary.api.resource(publicId, options);
    console.log(result);
    return json({ colors: result.colors });
  } catch (error) {
    console.error("Error retrieving asset information:", error);
    return json({ error: "Failed to retrieve asset information" }, { status: 500 });
  }
}
