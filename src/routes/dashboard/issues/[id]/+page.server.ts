// src/routes/dashboard/issues/[id]/+page.server.ts
import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { prisma } from '$lib/prisma';

export const load: PageServerLoad = async ({ params, cookies }) => {
    const sessionId = cookies.get('session');

    if (!sessionId) {
        throw redirect(303, '/login');
    }

    try {
        const user = await prisma.user.findUnique({
            where: { id: sessionId },
            select: { id: true, name: true, role: true }
        });

        if (!user) throw redirect(303, '/login');

        // Fetch the specific issue with its assignee and comments
        const issue = await prisma.issue.findUnique({
            where: { id: params.id },
            include: {
                assignee: {
                    select: { id: true, name: true, jobTitle: true }
                },
                comments: {
                    include: {
                        author: { select: { name: true, jobTitle: true } }
                    },
                    orderBy: { createdAt: 'desc' }
                }
            }
        });

        if (!issue) {
            throw redirect(303, '/dashboard/issues');
        }

        const allUsers = await prisma.user.findMany({
            select: { id: true, name: true, jobTitle: true }
        });

        return { user, issue, allUsers };

    } catch (error) {
        console.error('Failed to load issue details:', error);
        throw redirect(303, '/dashboard/issues');
    }
};

export const actions = {
    // Action to update issue properties (Status, Priority, Assignee)
    updateIssue: async ({ request, params }) => {
        const formData = await request.formData();
        const status = formData.get('status')?.toString();
        const priority = formData.get('priority')?.toString();
        const assigneeId = formData.get('assigneeId')?.toString();

        try {
            await prisma.issue.update({
                where: { id: params.id },
                data: {
                    ...(status && { status }),
                    ...(priority && { priority }),
                    ...(assigneeId !== undefined && { assigneeId: assigneeId || null })
                }
            });
            return { success: true, message: 'Issue updated successfully.' };
        } catch (error) {
            return fail(500, { error: 'Failed to update issue.' });
        }
    },

    // Action to delete the issue entirely
    deleteIssue: async ({ params }) => {
        try {
            await prisma.issue.delete({
                where: { id: params.id }
            });
        } catch (error) {
            return fail(500, { error: 'Failed to delete issue.' });
        }
        // Redirect back to directory after deletion
        throw redirect(303, '/dashboard/issues');
    },

    // Action to post a new comment
    addComment: async ({ request, params, cookies }) => {
        const sessionId = cookies.get('session');
        const formData = await request.formData();
        const text = formData.get('text')?.toString();

        if (!text || text.trim() === '') {
            return fail(400, { error: 'Comment cannot be empty.' });
        }

        try {
            await prisma.comment.create({
                data: {
                    text,
                    issueId: params.id,
                    authorId: sessionId as string
                }
            });
            return { success: true };
        } catch (error) {
            return fail(500, { error: 'Failed to add comment.' });
        }
    }
} satisfies Actions;