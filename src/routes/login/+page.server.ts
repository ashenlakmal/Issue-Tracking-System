// src/routes/login/+page.server.ts
import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions = {
    // The default action triggered when the login form is submitted
    default: async ({ request }) => {
        // 1. Get the data from the form
        const formData = await request.formData();
        const email = formData.get('email');
        const password = formData.get('password');

        // 2. Validate inputs
        if (!email || !password) {
            return fail(400, { error: 'Email and password are required.' });
        }

        // 3. Mock Authentication
        if (email === 'admin@company.com' && password === '123456') {
            return { success: true, message: 'Welcome back to TrackerPro!' };
        }

        // 4. Return error if login fails
        return fail(401, { error: 'Invalid email or password.' });
    }
} satisfies Actions;