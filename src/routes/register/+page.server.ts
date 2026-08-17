// src/routes/register/+page.server.ts
import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import { prisma } from '$lib/prisma';
import bcrypt from 'bcryptjs';

export const actions = {
    default: async ({ request }) => {
        const formData = await request.formData();
        const name = formData.get('name')?.toString();
        const email = formData.get('email')?.toString();
        const company = formData.get('company')?.toString();
        const jobTitle = formData.get('jobTitle')?.toString();
        const password = formData.get('password')?.toString();
        const confirmPassword = formData.get('confirmPassword')?.toString();

        // 1. Basic Validation
        if (!name || !email || !password || !confirmPassword || !company || !jobTitle) {
            return fail(400, { error: 'All fields are required.' });
        }

        // 2. Enterprise Security: Domain Restriction
        // Only allow users with a specific company email domain to register
        const allowedDomain = '@company.com';
        if (!email.endsWith(allowedDomain)) {
            return fail(403, { error: `Access Denied: Only ${allowedDomain} emails are allowed to register.` });
        }

        // 3. Password Validation
        if (password !== confirmPassword) {
            return fail(400, { error: 'Passwords do not match.' });
        }

        if (password.length < 6) {
            return fail(400, { error: 'Password must be at least 6 characters long.' });
        }

        try {
            // 4. Check for existing users
            const existingUser = await prisma.user.findUnique({
                where: { email }
            });

            if (existingUser) {
                return fail(400, { error: 'An account with this email already exists.' });
            }

            // 5. Hash password and save
            const hashedPassword = await bcrypt.hash(password, 10);

            await prisma.user.create({
                data: {
                    name,
                    email,
                    password: hashedPassword,
                    role: 'USER',
                    company,
                    jobTitle
                }
            });

            return { success: true, message: 'Account created successfully! Redirecting...' };

        } catch (error) {
            console.error('Registration error:', error);
            return fail(500, { error: 'Failed to create account. Please try again.' });
        }
    }
} satisfies Actions;