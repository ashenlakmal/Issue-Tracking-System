// src/routes/dashboard/+page.server.ts
import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { prisma } from '$lib/prisma';

export const load: PageServerLoad = async ({ cookies }) => {
    const sessionId = cookies.get('session');
    if (!sessionId) throw redirect(303, '/login');

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
        const openIssues = await prisma.issue.count({ where: { status: 'OPEN' } });
        const inProgressIssues = await prisma.issue.count({ where: { status: 'IN_PROGRESS' } });
        const resolvedIssues = await prisma.issue.count({ where: { status: 'RESOLVED' } });

        const myTasks = await prisma.issue.findMany({
            where: {
                assigneeId: sessionId,
                status: { notIn: ['RESOLVED', 'CLOSED'] }
            },
            orderBy: { createdAt: 'desc' },
            take: 4
        });

        const recentIssues = await prisma.issue.findMany({
            orderBy: { createdAt: 'desc' },
            take: 4,
            include: { assignee: { select: { name: true } } }
        });

        const allUsers = await prisma.user.findMany({
            select: { id: true, name: true, jobTitle: true }
        });

        return { user, stats: { total: totalIssues, open: openIssues, inProgress: inProgressIssues, resolved: resolvedIssues }, myTasks, recentIssues, allUsers };
    } catch (error) {
        throw redirect(303, '/login');
    }
};

export const actions = {
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

        if (!title || !description) return fail(400, { error: 'Title and description are strictly required.' });

        try {
            let dueDate = null;
            if (dueDateString) dueDate = new Date(dueDateString);

            await prisma.issue.create({
                data: {
                    title,
                    description,
                    type: type || 'TASK',
                    priority: priority || 'MEDIUM',
                    status: 'OPEN',
                    assigneeId: assigneeId || null,
                    creatorId: sessionId, // FIXED: Now we save WHO created the issue!
                    dueDate
                }
            });
            return { success: true, message: 'Issue created successfully!' };
        } catch (error) {
            return fail(500, { error: 'Failed to create issue.' });
        }
    }
} satisfies Actions;