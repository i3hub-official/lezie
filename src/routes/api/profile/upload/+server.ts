// src/routes/api/profile/upload/+server.ts
// Uses base64 upload via cloudinary.uploader.upload() —
// same pattern as your working projects.

import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { userProfiles } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { v2 as cloudinary } from 'cloudinary';

// Configure inline using process.env — same pattern as your working projects
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure:     true,
});

export const POST: RequestHandler = async ({ request, locals }) => {
  if (!locals.user) return json({ error: 'Unauthorized' }, { status: 401 });

  const userId = locals.user.id;

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return json({ error: 'Invalid form data' }, { status: 400 });
  }

  const file = form.get('file') as File | null;
  const type = form.get('type') as string;

  if (!file)
    return json({ error: 'No file provided' },        { status: 400 });
  if (!['avatar', 'cover'].includes(type))
    return json({ error: 'Invalid upload type' },      { status: 400 });
  if (file.size > 5 * 1024 * 1024)
    return json({ error: 'File must be under 5MB' },   { status: 400 });
  if (!file.type.startsWith('image/'))
    return json({ error: 'Only image files allowed' }, { status: 400 });

  try {
    // Delete old Cloudinary asset if one exists
    const current = await db.query.userProfiles.findFirst({
      where: eq(userProfiles.userId, userId),
    });

    const oldPublicId = type === 'avatar'
      ? current?.avatarPublicId
      : current?.coverPublicId;

    if (oldPublicId) {
      await cloudinary.uploader.destroy(oldPublicId).catch(() => {});
    }

    // Convert file to base64 — same approach as your working project
    const arrayBuffer = await file.arrayBuffer();
    const buffer      = Buffer.from(arrayBuffer);
    const base64      = `data:${file.type};base64,${buffer.toString('base64')}`;

    const publicId = `lezie/${type}s/${userId}_${type}`;

    // Upload using .upload() not upload_stream — this is what works in your projects
    const result = await cloudinary.uploader.upload(base64, {
      upload_preset:  'lz_default',
      public_id:      publicId,
      overwrite:      true,
      resource_type:  'image',
      transformation: type === 'avatar'
        ? [{ width: 400, height: 400, crop: 'fill', gravity: 'face' }]
        : [{ width: 1200, height: 400, crop: 'fill' }],
    });

    // Update DB
    const urlField      = type === 'avatar' ? 'avatarUrl'      : 'coverUrl';
    const publicIdField = type === 'avatar' ? 'avatarPublicId' : 'coverPublicId';

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
