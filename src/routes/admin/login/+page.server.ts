// src/routes/admin/login/+page.server.ts
import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { prisma } from '$lib/prisma';
import bcrypt from 'bcryptjs';

export const actions = {
    default: async ({ request, cookies }) => {
        const formData = await request.formData();
        const email = formData.get('email')?.toString();
        const password = formData.get('password')?.toString();

        if (!email || !password) {
            return fail(400, { error: 'Credentials are required.' });
        }

        try {
            const user = await prisma.user.findUnique({
                where: { email }
            });

            // 1. if user not found, return an error (Access Denied)
            if (!user) {
                return fail(401, { error: 'Access Denied.' });
            }

            // 2. Check if the user has the 'ADMIN' role
            if (user.role !== 'ADMIN') {
                return fail(403, { error: 'Unauthorized area. Admin privileges required.' });
            }

            // 3. Password Check 
            const isPasswordValid = await bcrypt.compare(password, user.password);

            if (!isPasswordValid) {
                return fail(401, { error: 'Access Denied.' });
            }

            // 4. Admin Cookie 
            cookies.set('session', user.id, {
                path: '/',
                httpOnly: true,
                sameSite: 'strict',
                maxAge: 60 * 60 * 24 // Admin session valid for 1 day
            });

            return { success: true, message: 'Admin Access Granted.' };

        } catch (error) {
            console.error('Admin Login error:', error);
            return fail(500, { error: 'System error.' });
        }
    }
} satisfies Actions;