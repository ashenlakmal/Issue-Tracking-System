<!-- src/routes/dashboard/issues/[id]/+page.svelte -->
<script lang="ts">
    import { enhance } from '$app/forms';
    import { toast } from 'svelte-sonner';

    let { data } = $props();
    
    // FIXED: Added $derived to all variables that depend on 'data' to remove Svelte warnings
    let issue = $derived(data.issue);
    let allUsers = $derived(data.allUsers || []);
    let currentUser = $derived(data.user);

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
                            <div class={`type-badge ${issue?.type?.toLowerCase() || 'task'}`}>
                                {#if issue?.type === 'BUG'}
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg> Bug
                                {:else}
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg> Task
                                {/if}
                            </div>
                            <h1 class="issue-title">{issue?.title}</h1>
                            <p class="issue-meta">Reported on {formatDate(issue?.createdAt)}</p>
                        </div>
                        
                        <div class="issue-description">
                            <h3>Description</h3>
                            <p>{issue?.description}</p>
                        </div>
                    </div>

                    <!-- Comments Section -->
                    <div class="comments-section">
                        <h3>Activity & Comments</h3>
                        
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
                            <label for="comment-text" class="visually-hidden">Add a comment</label>
                            <textarea id="comment-text" name="text" rows="3" placeholder="Add a comment..." required></textarea>
                            <div class="form-actions">
                                <button type="submit" class="btn-primary" disabled={isSubmittingComment}>
                                    {isSubmittingComment ? 'Posting...' : 'Comment'}
                                </button>
                            </div>
                        </form>

                        <div class="comments-list">
                            {#if !issue?.comments || issue.comments.length === 0}
                                <p class="no-comments">No comments yet. Be the first to start the conversation.</p>
                            {:else}
                                {#each issue.comments as comment}
                                    <div class="comment-card">
                                        <div class="comment-avatar">{comment.user.name.charAt(0)}</div>
                                        <div class="comment-content">
                                            <div class="comment-header">
                                                <span class="author-name">{comment.user.name}</span>
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
                                <label for="status-select">Status</label>
                                <select id="status-select" name="status" value={issue?.status} onchange={(e: any) => e.target.form.requestSubmit()}>
                                    <option value="OPEN">Open</option>
                                    <option value="IN_PROGRESS">In Progress</option>
                                    <option value="RESOLVED">Resolved</option>
                                    <option value="CLOSED">Closed</option>
                                </select>
                            </div>

                            <div class="property-group">
                                <label for="priority-select">Priority</label>
                                <select id="priority-select" name="priority" value={issue?.priority} onchange={(e: any) => e.target.form.requestSubmit()}>
                                    <option value="HIGH">High</option>
                                    <option value="MEDIUM">Medium</option>
                                    <option value="LOW">Low</option>
                                </select>
                            </div>

                            <div class="property-group">
                                <label for="assignee-select">Assignee</label>
                                <select id="assignee-select" name="assigneeId" value={issue?.assigneeId || ''} onchange={(e: any) => e.target.form.requestSubmit()}>
                                    <option value="">Unassigned</option>
                                    {#each allUsers as appUser}
                                        <option value={appUser.id}>{appUser.name}</option>
                                    {/each}
                                </select>
                            </div>
                        </form>
                    </div>

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
                            <button type="submit" class="btn-danger" onclick={(e: any) => !confirm('Are you sure you want to delete this issue?') && e.preventDefault()}>
                                Delete Issue
                            </button>
                        </form>
                    </div>
                </div>

            </div>
        </div>
    </main>
</div>

<style>
    /* Reset & Base Layout - Matching the Pure CSS Theme */
    .app-layout { display: flex; height: 100vh; width: 100%; overflow: hidden; font-family: system-ui, -apple-system, sans-serif; background-color: #f8fafc; color: #0f172a; margin: 0; }
    *, *::before, *::after { box-sizing: border-box; }
    
    .visually-hidden { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border-width: 0; }

    /* Sidebar */
    .sidebar { width: 260px; background-color: #020617; border-right: 1px solid #1e293b; display: flex; flex-direction: column; flex-shrink: 0; z-index: 20; }
    .brand { height: 64px; display: flex; align-items: center; padding: 0 24px; border-bottom: 1px solid #1e293b; }
    .brand-icon { width: 32px; height: 32px; color: #ff3e00; margin-right: 8px; }
    .brand-text { font-size: 20px; font-weight: 800; color: white; text-transform: uppercase; letter-spacing: 0.05em; }
    .brand-text span { color: #ff3e00; }
    .nav-menu { flex: 1; padding: 24px 12px; display: flex; flex-direction: column; gap: 4px; overflow-y: auto; }
    .nav-item { display: flex; align-items: center; padding: 10px 12px; border-radius: 8px; font-size: 14px; font-weight: 600; color: #94a3b8; text-decoration: none; transition: all 0.2s ease; }
    .nav-item:hover { background-color: #0f172a; color: white; }
    .nav-icon { width: 20px; height: 20px; margin-right: 12px; }
    .nav-item.active { background-color: rgba(255, 62, 0, 0.1); color: #ff3e00; }
    .sidebar-footer { padding: 16px; border-top: 1px solid #1e293b; }
    .btn-logout { width: 100%; display: flex; align-items: center; padding: 8px 12px; border-radius: 8px; font-size: 14px; font-weight: 500; color: #94a3b8; background: transparent; border: none; cursor: pointer; transition: all 0.2s ease; }
    .btn-logout:hover { background-color: #0f172a; color: #f87171; }

    /* Main Area & Header */
    .main-area { flex: 1; display: flex; flex-direction: column; overflow: hidden; background-color: #f8fafc; }
    .top-header { height: 64px; display: flex; align-items: center; padding: 0 32px; background-color: white; border-bottom: 1px solid #e2e8f0; z-index: 10; }
    .breadcrumb { display: flex; align-items: center; font-size: 14px; font-weight: 600; }
    .breadcrumb a { color: #64748b; text-decoration: none; transition: color 0.2s; }
    .breadcrumb a:hover { color: #0f172a; }
    .breadcrumb .separator { color: #cbd5e1; margin: 0 12px; }
    .breadcrumb .current { color: #0f172a; }

    /* Layout Split */
    .content-scroll { flex: 1; overflow-y: auto; padding: 32px; }
    .split-layout { display: flex; gap: 24px; max-width: 1200px; margin: 0 auto; align-items: flex-start; }
    .main-content { flex: 1; display: flex; flex-direction: column; gap: 24px; min-width: 0; }
    .side-panel { width: 320px; flex-shrink: 0; display: flex; flex-direction: column; gap: 24px; }

    /* Left Column Elements */
    .issue-header-card { background: white; border-radius: 16px; border: 1px solid #e2e8f0; padding: 32px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
    .type-badge { display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; border-radius: 6px; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 16px; }
    .type-badge svg { width: 14px; height: 14px; }
    .type-badge.bug { background: #fef2f2; color: #dc2626; }
    .type-badge.task { background: #eff6ff; color: #2563eb; }
    .issue-title { margin: 0 0 8px 0; font-size: 28px; font-weight: 800; color: #0f172a; line-height: 1.3; }
    .issue-meta { margin: 0 0 24px 0; font-size: 13px; color: #64748b; }
    .issue-description h3 { font-size: 16px; font-weight: 700; color: #1e293b; margin: 0 0 12px 0; padding-top: 24px; border-top: 1px solid #f1f5f9; }
    .issue-description p { margin: 0; font-size: 15px; color: #334155; line-height: 1.6; white-space: pre-wrap; }

    .comments-section { background: white; border-radius: 16px; border: 1px solid #e2e8f0; padding: 32px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
    .comments-section h3 { margin: 0 0 24px 0; font-size: 18px; font-weight: 800; color: #0f172a; }
    .comment-form textarea { width: 100%; padding: 16px; border-radius: 12px; border: 1px solid #cbd5e1; font-family: inherit; font-size: 14px; resize: vertical; outline: none; transition: all 0.2s; background: #f8fafc; }
    .comment-form textarea:focus { border-color: #ff3e00; background: white; box-shadow: 0 0 0 4px rgba(255, 62, 0, 0.1); }
    .form-actions { display: flex; justify-content: flex-end; margin-top: 12px; }
    .btn-primary { background: #ff3e00; color: white; border: none; padding: 10px 24px; border-radius: 8px; font-size: 14px; font-weight: 700; cursor: pointer; transition: all 0.2s; box-shadow: 0 2px 4px rgba(255, 62, 0, 0.2); }
    .btn-primary:hover:not(:disabled) { background: #eb3900; transform: translateY(-1px); }
    .btn-primary:disabled { opacity: 0.7; cursor: not-allowed; }

    .comments-list { margin-top: 32px; display: flex; flex-direction: column; gap: 20px; }
    .no-comments { text-align: center; color: #94a3b8; font-size: 14px; font-style: italic; padding: 20px 0; }
    .comment-card { display: flex; gap: 16px; }
    .comment-avatar { width: 40px; height: 40px; border-radius: 50%; background: #e2e8f0; display: flex; align-items: center; justify-content: center; font-weight: 800; color: #475569; flex-shrink: 0; }
    .comment-content { flex: 1; background: #f8fafc; border: 1px solid #f1f5f9; border-radius: 12px; padding: 16px; }
    .comment-header { display: flex; justify-content: space-between; margin-bottom: 8px; align-items: center; }
    .author-name { font-weight: 700; font-size: 14px; color: #1e293b; }
    .comment-date { font-size: 12px; color: #94a3b8; }
    .comment-text { margin: 0; font-size: 14px; color: #334155; line-height: 1.5; white-space: pre-wrap; }

    /* Right Column Elements */
    .properties-card { background: white; border-radius: 16px; border: 1px solid #e2e8f0; padding: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
    .properties-card h3 { margin: 0 0 20px 0; font-size: 16px; font-weight: 800; color: #0f172a; }
    .property-group { margin-bottom: 16px; }
    .property-group:last-child { margin-bottom: 0; }
    .property-group label { display: block; font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase; margin-bottom: 8px; }
    .property-group select { width: 100%; padding: 10px; border-radius: 8px; border: 1px solid #cbd5e1; font-size: 14px; font-weight: 600; color: #0f172a; outline: none; background: #f8fafc; cursor: pointer; transition: all 0.2s; }
    .property-group select:hover { border-color: #94a3b8; }
    .property-group select:focus { border-color: #ff3e00; box-shadow: 0 0 0 2px rgba(255, 62, 0, 0.1); }

    .danger-card { background: #fff1f2; border-radius: 16px; border: 1px solid #fecdd3; padding: 24px; margin-top: 24px;}
    .danger-card h3 { margin: 0 0 8px 0; font-size: 16px; font-weight: 800; color: #be123c; }
    .danger-card p { margin: 0 0 20px 0; font-size: 13px; color: #9f1239; line-height: 1.5; }
    .btn-danger { width: 100%; background: white; border: 1px solid #fda4af; color: #e11d48; padding: 10px; border-radius: 8px; font-size: 14px; font-weight: 700; cursor: pointer; transition: all 0.2s; }
    .btn-danger:hover { background: #e11d48; color: white; border-color: #e11d48; }

    /* Responsive adjustments */
    @media (max-width: 1024px) {
        .split-layout { flex-direction: column; }
        .side-panel { width: 100%; }
    }
</style>