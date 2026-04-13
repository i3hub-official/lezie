// src/lib/server/cloudinary.ts
// Single source of truth for Cloudinary config.
// Imported by any server-side endpoint that needs to upload or manage assets.

import { v2 as cloudinary } from 'cloudinary';
import { env } from '$env/dynamic/private';

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key:    env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
  secure:     true,
  timeout:    60000,
});

export default cloudinary;
