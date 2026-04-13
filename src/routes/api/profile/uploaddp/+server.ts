// src/routes/api/upload-profile-image/+server.ts
import { json, error } from '@sveltejs/kit';
import cloudinary from '$lib/server/cloudinary';
import { db } from '$lib/server/db';
import { userProfiles } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export async function POST({ request, locals }) {
  if (!locals.user) throw error(401, 'Unauthorized');
  
  const formData = await request.formData();
  const file = formData.get('file') as File;
  const type = formData.get('type') as string;
  const userId = locals.user.id;
  
  if (!file) throw error(400, 'No file provided');
  
  try {
    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: `users/${userId}/${type}s`,
          transformation: type === 'avatar' 
            ? [{ width: 500, height: 500, crop: 'fill', gravity: 'face' }]
            : [{ width: 1200, height: 400, crop: 'cover' }]
        },
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      );
      uploadStream.end(buffer);
    });
    
    // Update database
    const updateData = type === 'avatar' 
      ? { avatarPublicId: result.public_id, avatarUrl: result.secure_url }
      : { coverPhotoPublicId: result.public_id, coverPhotoUrl: result.secure_url };
    
    await db.update(userProfiles).set(updateData).where(eq(userProfiles.userId, userId));
    
    return json({ success: true, publicId: result.public_id });
  } catch (err) {
    console.error('Upload error:', err);
    throw error(500, 'Upload failed');
  }
}