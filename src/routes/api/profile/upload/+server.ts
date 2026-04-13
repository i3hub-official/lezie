// src/routes/api/profile/upload/+server.ts
//
// Handles avatar and cover photo uploads via Cloudinary.
// Flow: client sends file → this endpoint uploads to Cloudinary → updates DB → returns URL.

import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { userProfiles } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { env } from '$env/dynamic/private';
import { v2 as cloudinary } from 'cloudinary';
import cloudinary from '$lib/server/cloudinary';

export const POST: RequestHandler = async ({ request, locals }) => {
  if (!locals.user) return json({ error: 'Unauthorized' }, { status: 401 });

  const userId  = locals.user.id;
  const form    = await request.formData();
  const file    = form.get('file') as File | null;
  const type    = form.get('type') as string; // 'avatar' | 'cover'

  if (!file)             return json({ error: 'No file provided' },          { status: 400 });
  if (!['avatar', 'cover'].includes(type))
                         return json({ error: 'Invalid upload type' },        { status: 400 });
  if (file.size > 5 * 1024 * 1024)
                         return json({ error: 'File must be under 5MB' },     { status: 400 });
  if (!file.type.startsWith('image/'))
                         return json({ error: 'Only image files allowed' },   { status: 400 });

  try {
    // Get current profile to delete old Cloudinary asset
    const current = await db.query.userProfiles.findFirst({
      where: eq(userProfiles.userId, userId),
    });

    const oldPublicId = type === 'avatar' ? current?.avatarPublicId : current?.coverPublicId;
    if (oldPublicId) {
      await cloudinary.uploader.destroy(oldPublicId).catch(() => {});
    }

    // Upload new image
    const arrayBuffer = await file.arrayBuffer();
    const buffer      = Buffer.from(arrayBuffer);
    const folder      = `lezie/${type}s`;
    const publicId    = `${folder}/${userId}_${type}`;

    const result = await new Promise<any>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          public_id:      publicId,
          folder,
          overwrite:      true,
          resource_type:  'image',
          transformation: type === 'avatar'
            ? [{ width: 400, height: 400, crop: 'fill', gravity: 'face' }]
            : [{ width: 1200, height: 400, crop: 'fill' }],
        },
        (error, result) => error ? reject(error) : resolve(result)
      );
      stream.end(buffer);
    });

    // Update DB
    const urlField       = type === 'avatar' ? 'avatarUrl'       : 'coverUrl';
    const publicIdField  = type === 'avatar' ? 'avatarPublicId'  : 'coverPublicId';

    await db
      .update(userProfiles)
      .set({
        [urlField]:      result.secure_url,
        [publicIdField]: result.public_id,
        updatedAt:       new Date(),
      })
      .where(eq(userProfiles.userId, userId));

    return json({ url: result.secure_url, publicId: result.public_id });

  } catch (err: any) {
    console.error('[PROFILE UPLOAD]', err);
    return json({ error: 'Upload failed. Please try again.' }, { status: 500 });
  }
};