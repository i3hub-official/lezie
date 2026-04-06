import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
  try {
    const body = await request.json();
    const { firstName, lastName, dateOfBirth, phone, email, password } = body;
    
    // Add your actual signup logic here
    // For now, return success for testing
    
    return json({ success: true, message: 'User created successfully' });
  } catch (error) {
    return json({ error: 'Signup failed' }, { status: 500 });
  }
};