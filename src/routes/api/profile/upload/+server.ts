// src/routes/api/profile/upload/+server.ts
//
// Handles avatar and cover photo uploads via Cloudinary.
// Flow: client sends file → uploads to Cloudinary → updates DB → returns URL.

import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { userProfiles } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import cloudinary from '$lib/server/cloudinary';

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
    return json({ error: 'No file provided' }, { status: 400 });
  if (!['avatar', 'cover'].includes(type))
    return json({ error: 'Invalid upload type' }, { status: 400 });
  if (file.size > 5 * 1024 * 1024)
    return json({ error: 'File must be under 5MB' }, { status: 400 });
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

    // Upload new image via stream
    const buffer   = Buffer.from(await file.arrayBuffer());
    const folder   = `lezie/${type}s`;
    const publicId = `${folder}/${userId}_${type}`;

    const result = await new Promise<any>((resolve, reject) => {
      const timestamp = Math.round(Date.now() / 1000);

      // Build params to sign — must match exactly what you send to the API
      const paramsToSign: Record<string, any> = {
        folder,
        overwrite:     true,
        public_id:     publicId,
        resource_type: 'image',
        timestamp,
        transformation: type === 'avatar'
          ? 'w_400,h_400,c_fill,g_face'
          : 'w_1200,h_400,c_fill',
      };

      // Generate signature using Cloudinary's built-in utility
      const signature = cloudinary.utils.api_sign_request(
        paramsToSign,
        env.CLOUDINARY_API_SECRET
      );

      const stream = cloudinary.uploader.upload_stream(
        {
          ...paramsToSign,
          api_key:   env.CLOUDINARY_API_KEY,
          signature,
        },
        (error, result) => error ? reject(error) : resolve(result)
      );

      stream.end(buffer);
    });

    // Persist URL + public_id to DB
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
