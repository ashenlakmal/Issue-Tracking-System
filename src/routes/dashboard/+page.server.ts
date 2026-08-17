// src/routes/dashboard/+page.server.ts
import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { prisma } from '$lib/prisma';

export const load: PageServerLoad = async ({ cookies }) => {
    const sessionId = cookies.get('session');

    if (!sessionId) {
        throw redirect(303, '/login');
    }

    try {
        const user = await prisma.user.findUnique({
            where: { id: sessionId },
            select: { id: true, name: true, email: true, role: true, company: true, jobTitle: true }
        });

        if (!user) {
            cookies.delete('session', { path: '/' });
            throw redirect(303, '/login');
        }

        const totalIssues = await prisma.issue.count();

        // Fetch all users to populate the "Assignee" dropdown
        const allUsers = await prisma.user.findMany({
            select: { id: true, name: true, jobTitle: true }
        });

        return {
            user,
            stats: { total: totalIssues, open: 0, inProgress: 0, resolved: 0 },
            allUsers
        };

    } catch (error) {
        console.error('Dashboard load error:', error);
        throw redirect(303, '/login');
    }
};

export const actions = {
    // Action to handle the creation of a new issue
    createIssue: async ({ request, cookies }) => {
        const sessionId = cookies.get('session');
        if (!sessionId) return fail(401, { error: 'Unauthorized access.' });

        const formData = await request.formData();
        const title = formData.get('title')?.toString();
        const description = formData.get('description')?.toString();
        const type = formData.get('type')?.toString();
        const priority = formData.get('priority')?.toString();
        const assigneeId = formData.get('assigneeId')?.toString();
        const dueDateString = formData.get('dueDate')?.toString();

        if (!title || !description) {
            return fail(400, { error: 'Title and description are strictly required.' });
        }

        try {
            let dueDate = null;
            if (dueDateString) {
                dueDate = new Date(dueDateString);
            }

            // Save the new issue to the database
            await prisma.issue.create({
                data: {
                    title,
                    description,
                    type: type || 'TASK',
                    priority: priority || 'MEDIUM',
                    status: 'OPEN',
                    assigneeId: assigneeId || null,
                    dueDate
                }
            });

            return { success: true, message: 'Issue created successfully!' };
        } catch (error) {
            console.error('Create issue error:', error);
            return fail(500, { error: 'Failed to create issue. Please try again.' });
        }
    }
} satisfies Actions;