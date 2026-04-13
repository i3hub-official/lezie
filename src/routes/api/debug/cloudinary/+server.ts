// src/routes/api/debug/cloudinary/+server.ts
// TEMPORARY diagnostic endpoint — delete after fixing the upload issue.
// Visit /api/debug/cloudinary to see what's wrong.

import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { env } from '$env/dynamic/private';
import { v2 as cloudinary } from 'cloudinary';

export const GET: RequestHandler = async ({ locals }) => {
  if (!locals.user) return json({ error: 'Unauthorised' }, { status: 401 });

  const cloudName  = env.CLOUDINARY_CLOUD_NAME;
  const apiKey     = env.CLOUDINARY_API_KEY;
  const apiSecret  = env.CLOUDINARY_API_SECRET;

  // 1. Check env vars are present and non-empty
  const envCheck = {
    cloud_name_present:  !!cloudName  && cloudName.trim()  !== '',
    api_key_present:     !!apiKey     && apiKey.trim()     !== '',
    api_secret_present:  !!apiSecret  && apiSecret.trim()  !== '',
    cloud_name_value:    cloudName    ?? '(missing)',
    api_key_prefix:      apiKey       ? apiKey.slice(0, 6) + '...' : '(missing)',
    api_secret_prefix:   apiSecret    ? apiSecret.slice(0, 4) + '...' : '(missing)',
  };

  // 2. Try a ping — use cloudinary.api.ping() which is a lightweight auth check
  cloudinary.config({
    cloud_name: cloudName,
    api_key:    apiKey,
    api_secret: apiSecret,
    secure:     true,
  });

  let pingResult: any = null;
  let pingError:  any = null;

  try {
    pingResult = await cloudinary.api.ping();
  } catch (err: any) {
    pingError = {
      message:   err.message,
      http_code: err.http_code,
      name:      err.name,
    };
  }

  // 3. Try uploading a tiny 1x1 pixel PNG to isolate upload-specific 403s
  let uploadResult: any = null;
  let uploadError:  any = null;

  const tinyPng = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
    'base64'
  );

  try {
    uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { public_id: 'lezie_test_ping', overwrite: true, resource_type: 'image' },
        (err, res) => err ? reject(err) : resolve(res)
      );
      stream.end(tinyPng);
    });
  } catch (err: any) {
    uploadError = {
      message:   err.message,
      http_code: err.http_code,
      name:      err.name,
    };
  }

  return json({
    env:          envCheck,
    ping:         pingError  ? { ok: false, error: pingError   } : { ok: true,  result: pingResult  },
    upload_test:  uploadError? { ok: false, error: uploadError  } : { ok: true,  result: { public_id: (uploadResult as any)?.public_id, url: (uploadResult as any)?.secure_url } },
  });
};
