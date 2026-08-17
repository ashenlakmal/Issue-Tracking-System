// src/routes/dashboard/issues/+page.server.ts
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { prisma } from '$lib/prisma';

export const load: PageServerLoad = async ({ cookies }) => {
    // 1. Verify Authentication
    const sessionId = cookies.get('session');

    if (!sessionId) {
        throw redirect(303, '/login');
    }

    try {
        // 2. Verify User exists
        const user = await prisma.user.findUnique({
            where: { id: sessionId },
            select: { id: true, name: true, role: true }
        });

        if (!user) {
            cookies.delete('session', { path: '/' });
            throw redirect(303, '/login');
        }

        // 3. Fetch all issues from the database
        // We use 'include' to join the User table and get the assignee's name
        const issues = await prisma.issue.findMany({
            orderBy: { createdAt: 'desc' }, // Newest issues first
            include: {
                assignee: {
                    select: { name: true, jobTitle: true }
                }
            }
        });

        return {
            user,
            issues
        };

    } catch (error) {
        console.error('Failed to load issues:', error);
        throw redirect(303, '/dashboard');
    }
};