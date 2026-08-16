// src/routes/login/+page.server.ts
import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { prisma } from '$lib/prisma';
import bcrypt from 'bcryptjs';

export const actions = {
    default: async ({ request, cookies }) => {
        // 1. Get the form data from the request
        const formData = await request.formData();
        const email = formData.get('email')?.toString();
        const password = formData.get('password')?.toString();

        // 2. Input Validation 
        if (!email || !password) {
            return fail(400, { error: 'Email and password are required.' });
        }

        try {
            // 3. Database query to find the user by email
            const user = await prisma.user.findUnique({
                where: { email }
            });

            // User not found, return an error
            if (!user) {
                return fail(401, { error: 'Invalid email or password.' });
            }

            // 4. Password Verification using bcrypt
            const isPasswordValid = await bcrypt.compare(password, user.password);

            if (!isPasswordValid) {
                return fail(401, { error: 'Invalid email or password.' });
            }

            // 5. Authentication Cookie 
            cookies.set('session', user.id, {
                path: '/',
                httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
                sameSite: 'strict',
                maxAge: 60 * 60 * 24 * 7 // 1 week
            });

            // 6. Redirect to the dashboard after successful login
            return { success: true, message: 'Welcome back to TrackerPro!' };

        } catch (error) {
            console.error('Login error:', error);
            return fail(500, { error: 'Internal server error. Please try again later.' });
        }
    }
} satisfies Actions;