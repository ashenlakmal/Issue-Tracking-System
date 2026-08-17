// src/routes/dashboard/+page.server.ts
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { prisma } from '$lib/prisma';

export const load: PageServerLoad = async ({ cookies }) => {
    // Retrieve session ID from cookies
    const sessionId = cookies.get('session');

    // Redirect to login if not authenticated to protect the route
    if (!sessionId) {
        throw redirect(303, '/login');
    }

    try {
        // Fetch specific user details from the database using the session ID
        const user = await prisma.user.findUnique({
            where: { id: sessionId },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                company: true,
                jobTitle: true
            }
        });

        // If the user no longer exists in the database, clear the cookie and redirect
        if (!user) {
            cookies.delete('session', { path: '/' });
            throw redirect(303, '/login');
        }

        // Count total issues for the dashboard statistics
        const totalIssues = await prisma.issue.count();

        // Return the user data and initial statistics to the frontend
        return {
            user,
            stats: {
                total: totalIssues,
                open: 0,
                inProgress: 0,
                resolved: 0
            }
        };

    } catch (error) {
        console.error('Dashboard load error:', error);
        throw redirect(303, '/login');
    }
};