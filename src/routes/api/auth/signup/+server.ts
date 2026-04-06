import { json } from '@sveltejs/kit';
// ... your auth logic (e.g., database insert, password hashing)

export async function POST({ request }) {
  try {
    const data = await request.json();
    // Perform signup logic here...
    // Example: validate, hash password, save user, etc.

    return json({ success: true, message: 'Account created' }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Pragma': 'no-cache'
      }
    });
  } catch (error: any) {
    console.error('Signup error:', error);
    return json(
      { error: error.message || 'Signup failed' },
      { status: 400, headers: { 'Cache-Control': 'no-store' } }
    );
  }
}