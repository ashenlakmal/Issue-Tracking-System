<!-- src/routes/dashboard/issues/[id]/+page.svelte -->
<script lang="ts">
    import { enhance } from '$app/forms';
    import { toast } from 'svelte-sonner';

    let { data } = $props();
    let issue = $derived(data.issue);
    let allUsers = data.allUsers;
    let currentUser = data.user;

    const formatDate = (dateString: string | null | Date) => {
        if (!dateString) return 'No Date';
        return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    };

    let isSubmittingComment = $state(false);
</script>

<div class="app-layout">
    <!-- Sidebar -->
    <aside class="sidebar">
        <div class="brand">
            <svg class="brand-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
            <span class="brand-text">Tracker<span>Pro</span></span>
        </div>
        <nav class="nav-menu">
            <a href="/dashboard" class="nav-item">
                <svg class="nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                Dashboard
            </a>
            <a href="/dashboard/issues" class="nav-item active">
                <svg class="nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
                All Issues
            </a>
        </nav>
        <div class="sidebar-footer">
            <form action="/logout" method="POST" use:enhance>
                <button type="submit" class="btn-logout">
                    <svg class="nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                    Sign Out
                </button>
            </form>
        </div>
    </aside>

    <!-- Main Workspace -->
    <main class="main-area">
        <header class="top-header">
            <div class="breadcrumb">
                <a href="/dashboard/issues">Issues</a>
                <span class="separator">/</span>
                <span class="current">Issue Details</span>
            </div>
        </header>

        <div class="content-scroll">
            <div class="split-layout">
                
                <!-- Left Column: Details & Comments -->
                <div class="main-content">
                    
                    <div class="issue-header-card">
                        <div class="issue-title-area">
                            <div class={`type-badge ${issue.type.toLowerCase()}`}>
                                {#if issue.type === 'BUG'}
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg> Bug
                                {:else}
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg> Task
                                {/if}
                            </div>
                            <h1 class="issue-title">{issue.title}</h1>
                            <p class="issue-meta">Reported on {formatDate(issue.createdAt)}</p>
                        </div>
                        
                        <div class="issue-description">
                            <h3>Description</h3>
                            <p>{issue.description}</p>
                        </div>
                    </div>

                    <!-- Comments Section -->
                    <div class="comments-section">
                        <h3>Activity & Comments</h3>
                        
                        <!-- Add Comment Form -->
                        <form 
                            action="?/addComment" 
                            method="POST" 
                            class="comment-form"
                            use:enhance={() => {
                                isSubmittingComment = true;
                                return async ({ result, update }) => {
                                    isSubmittingComment = false;
                                    if (result.type === 'success') {
                                        toast.success('Comment added!');
                                    } else {
                                        toast.error('Failed to add comment.');
                                    }
                                    update({ reset: true });
                                };
                            }}
                        >
                            <textarea name="text" rows="3" placeholder="Add a comment..." required></textarea>
                            <div class="form-actions">
                                <button type="submit" class="btn-primary" disabled={isSubmittingComment}>
                                    {isSubmittingComment ? 'Posting...' : 'Comment'}
                                </button>
                            </div>
                        </form>

                        <!-- Comments List -->
                        <div class="comments-list">
                            {#if issue.comments.length === 0}
                                <p class="no-comments">No comments yet. Be the first to start the conversation.</p>
                            {:else}
                                {#each issue.comments as comment}
                                    <div class="comment-card">
                                        <div class="comment-avatar">{comment.author.name.charAt(0)}</div>
                                        <div class="comment-content">
                                            <div class="comment-header">
                                                <span class="author-name">{comment.author.name}</span>
                                                <span class="comment-date">{formatDate(comment.createdAt)}</span>
                                            </div>
                                            <p class="comment-text">{comment.text}</p>
                                        </div>
                                    </div>
                                {/each}
                            {/if}
                        </div>
                    </div>
                </div>

                <!-- Right Column: Properties & Actions -->
                <div class="side-panel">
                    <div class="properties-card">
                        <h3>Properties</h3>
                        
                        <form 
                            action="?/updateIssue" 
                            method="POST"
                            use:enhance={() => {
                                return async ({ result, update }) => {
                                    if (result.type === 'success') toast.success('Issue updated!');
                                    update({ reset: false });
                                };
                            }}
                        >
                            <div class="property-group">
                                <label>Status</label>
                                <select name="status" value={issue.status} onchange={(e) => e.target.form.requestSubmit()}>
                                    <option value="OPEN">Open</option>
                                    <option value="IN_PROGRESS">In Progress</option>
                                    <option value="RESOLVED">Resolved</option>
                                    <option value="CLOSED">Closed</option>
                                </select>
                            </div>

                            <div class="property-group">
                                <label>Priority</label>
                                <select name="priority" value={issue.priority} onchange={(e) => e.target.form.requestSubmit()}>
                                    <option value="HIGH">High</option>
                                    <option value="MEDIUM">Medium</option>
                                    <option value="LOW">Low</option>
                                </select>
                            </div>

                            <div class="property-group">
                                <label>Assignee</label>
                                <select name="assigneeId" value={issue.assigneeId || ''} onchange={(e) => e.target.form.requestSubmit()}>
                                    <option value="">Unassigned</option>
                                    {#each allUsers as appUser}
                                        <option value={appUser.id}>{appUser.name}</option>
                                    {/each}
                                </select>
                            </div>
                        </form>
                    </div>

                    <!-- Danger Zone (Delete) -->
                    <div class="danger-card">
                        <h3>Danger Zone</h3>
                        <p>Once you delete an issue, there is no going back. Please be certain.</p>
                        <form 
                            action="?/deleteIssue" 
                            method="POST"
                            use:enhance={() => {
                                return async ({ update }) => {
                                    toast.success('Issue deleted!');
                                    update();
                                };
                            }}
                        >
                            <button type="submit" class="btn-danger" onclick={(e) => !confirm('Are you sure you want to delete this issue?') && e.preventDefault()}>
                                Delete Issue
                            </button>
                        </form>
                    </div>
                </div>

            </div>
        </div>
    </main>
</div>

