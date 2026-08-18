// src/routes/dashboard/issues/+page.server.ts
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { prisma } from '$lib/prisma';

export const load: PageServerLoad = async ({ cookies }) => {
    const sessionId = cookies.get('session');

    if (!sessionId) throw redirect(303, '/login');

    try {
        const user = await prisma.user.findUnique({
            where: { id: sessionId },
            select: { id: true, name: true, role: true }
        });

        if (!user) {
            cookies.delete('session', { path: '/' });
            throw redirect(303, '/login');
        }

        // Fetch all issues to display in the table
        const issues = await prisma.issue.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                assignee: {
                    select: { name: true, jobTitle: true }
                }
            }
        });

        return { user, issues };

    } catch (error) {
        console.error('Failed to load issues:', error);
        return { user: null, issues: [] };
    }
};