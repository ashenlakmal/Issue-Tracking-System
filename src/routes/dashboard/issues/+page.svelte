<!-- src/routes/dashboard/issues/+page.svelte -->
<script lang="ts">
    // Receive data from the server load function
    let { data } = $props();
    
    // Ensure reactivity for the issues array
    let issues = $derived(data.issues || []);
    
    // Format dates cleanly
    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'No Date';
        return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    // Helper functions for CSS class mapping
    const getStatusClass = (status: string) => status.toLowerCase().replace('_', '-');
    const formatStatus = (status: string) => status.replace('_', ' ');
</script>

<div class="app-layout">
    <!-- Premium Sidebar -->
    <aside class="sidebar">
        <div class="brand">
            <svg class="brand-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
            <span class="brand-text">Tracker<span>Pro</span></span>
        </div>
        
        <nav class="nav-menu">
            <a href="/dashboard" class="nav-item">
                <svg class="nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                Dashboard
            </a>
            <!-- Active State -->
            <a href="/dashboard/issues" class="nav-item active">
                <svg class="nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
                All Issues
            </a>
        </nav>
    </aside>

    <!-- Main Workspace -->
    <main class="main-area">
        <header class="top-header">
            <h1>All Issues</h1>
        </header>

        <div class="content-scroll">
            <div class="toolbar">
                <h2>Issue Directory</h2>
                <button class="btn-filter">
                    <svg class="filter-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
                    Filter views
                </button>
            </div>

            <!-- Ultra-Clean Data Table Container -->
            <div class="table-card">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th class="pl-wide">Issue Name</th>
                            <th>Status</th>
                            <th>Priority</th>
                            <th>Assignee</th>
                            <th>Due Date</th>
                            <th class="text-right pr-wide">Action</th>
                        </tr>
                    </thead>
                    
                    <tbody>
                        {#if issues.length === 0}
                            <tr>
                                <td colspan="6" class="empty-state">
                                    <div class="empty-icon">
                                        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
                                    </div>
                                    <h3>No issues found</h3>
                                    <p>Your project is clean. When bugs or tasks arise, they will be listed here.</p>
                                </td>
                            </tr>
                        {:else}
                            {#each issues as issue}
                                <tr>
                                    <!-- Title & Icon -->
                                    <td class="pl-wide">
                                        <div class="issue-cell">
                                            <div class="type-icon {issue.type.toLowerCase()}">
                                                {#if issue.type === 'BUG'}
                                                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                                {:else}
                                                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
                                                {/if}
                                            </div>
                                            <div class="issue-text">
                                                <p class="title" title={issue.title}>{issue.title}</p>
                                                <p class="desc" title={issue.description}>{issue.description}</p>
                                            </div>
                                        </div>
                                    </td>

                                    <!-- Status Badge -->
                                    <td>
                                        <span class="badge {getStatusClass(issue.status)}">
                                            <span class="dot"></span>
                                            {formatStatus(issue.status)}
                                        </span>
                                    </td>

                                    <!-- Priority -->
                                    <td>
                                        <div class="priority {issue.priority.toLowerCase()}">
                                            {#if issue.priority === 'HIGH'}
                                                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg> High
                                            {:else if issue.priority === 'MEDIUM'}
                                                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 6h16M4 12h16M4 18h16" /></svg> Medium
                                            {:else}
                                                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg> Low
                                            {/if}
                                        </div>
                                    </td>

                                    <!-- Assignee -->
                                    <td>
                                        {#if issue.assignee}
                                            <div class="user-cell">
                                                <div class="avatar">{issue.assignee.name.charAt(0).toUpperCase()}</div>
                                                <div class="user-info">
                                                    <p class="user-name">{issue.assignee.name}</p>
                                                    <p class="user-role">{issue.assignee.jobTitle || 'Team Member'}</p>
                                                </div>
                                            </div>
                                        {:else}
                                            <span class="unassigned">Unassigned</span>
                                        {/if}
                                    </td>

                                    <!-- Due Date -->
                                    <td>
                                        <span class="date-text">{formatDate(issue.dueDate)}</span>
                                    </td>

                                    <!-- Clean Action Button -->
                                    <td class="text-right pr-wide">
                                        <a href={`/dashboard/issues/${issue.id}`} class="btn-open">
                                            Open
                                            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                        </a>
                                    </td>
                                </tr>
                            {/each}
                        {/if}
                    </tbody>
                </table>
            </div>
        </div>
    </main>
</div>

<!-- 100% Reliable Pure CSS (No Tailwind Needed for this file) -->
<style>
    /* Reset & Base Layout */
    .app-layout {
        display: flex;
        height: 100vh;
        width: 100%;
        overflow: hidden;
        font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        background-color: #f8fafc;
        color: #0f172a;
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    *, *::before, *::after {
        box-sizing: border-box;
    }

    /* Sidebar */
    .sidebar {
        width: 260px;
        background-color: #0f172a;
        border-right: 1px solid #1e293b;
        display: flex;
        flex-direction: column;
        flex-shrink: 0;
        z-index: 20;
        box-shadow: 4px 0 24px rgba(0,0,0,0.1);
    }

    .brand {
        height: 80px;
        display: flex;
        align-items: center;
        padding: 0 32px;
    }

    .brand-icon {
        width: 32px;
        height: 32px;
        color: #ff3e00;
        margin-right: 12px;
    }

    .brand-text {
        font-size: 20px;
        font-weight: 900;
        color: white;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        margin-top: 4px;
    }

    .brand-text span {
        color: #ff3e00;
    }

    .nav-menu {
        flex: 1;
        padding: 32px 16px;
        display: flex;
        flex-direction: column;
        gap: 8px;
        overflow-y: auto;
    }

    .nav-item {
        display: flex;
        align-items: center;
        padding: 12px 16px;
        border-radius: 12px;
        font-size: 14px;
        font-weight: 600;
        color: #94a3b8;
        text-decoration: none;
        transition: all 0.2s ease;
    }

    .nav-item:hover {
        background-color: rgba(30, 41, 59, 0.5);
        color: white;
    }

    .nav-icon {
        width: 20px;
        height: 20px;
        margin-right: 14px;
        opacity: 0.7;
    }

    .nav-item.active {
        background: linear-gradient(90deg, rgba(255, 62, 0, 0.1) 0%, transparent 100%);
        color: #ff3e00;
        box-shadow: inset 3px 0 0 0 #ff3e00;
    }

    .nav-item.active .nav-icon {
        opacity: 1;
    }

    /* Main Area */
    .main-area {
        flex: 1;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        background-color: #f8fafc;
    }

    .top-header {
        height: 80px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 40px;
        background-color: rgba(255, 255, 255, 0.8);
        border-bottom: 1px solid #f1f5f9;
        z-index: 10;
    }

    .top-header h1 {
        margin: 0;
        font-size: 20px;
        font-weight: 800;
        letter-spacing: -0.025em;
        color: #1e293b;
    }

    .content-scroll {
        flex: 1;
        overflow-y: auto;
        padding: 40px;
    }

    .toolbar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 24px;
    }

    .toolbar h2 {
        margin: 0;
        font-size: 24px;
        font-weight: 800;
        color: #0f172a;
    }

    .btn-filter {
        display: flex;
        align-items: center;
        gap: 8px;
        background: white;
        border: 1px solid #e2e8f0;
        padding: 8px 16px;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 700;
        color: #475569;
        cursor: pointer;
        box-shadow: 0 1px 2px rgba(0,0,0,0.05);
        transition: all 0.2s;
    }

    .btn-filter:hover {
        background: #f8fafc;
        border-color: #cbd5e1;
        color: #0f172a;
    }

    .filter-icon {
        width: 16px;
        height: 16px;
        color: #94a3b8;
    }

    /* Data Table */
    .table-card {
        background: white;
        border-radius: 16px;
        border: 1px solid #e2e8f0;
        box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        overflow: hidden;
    }

    .data-table {
        width: 100%;
        border-collapse: collapse;
        text-align: left;
    }

    .data-table th {
        padding: 20px 24px;
        background-color: #f8fafc;
        border-bottom: 1px solid #e2e8f0;
        font-size: 11px;
        font-weight: 800;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        color: #64748b;
    }

    .data-table td {
        padding: 20px 24px;
        border-bottom: 1px solid #f1f5f9;
        vertical-align: middle;
        transition: background-color 0.2s;
    }

    .data-table tbody tr:hover td {
        background-color: #f8fafc;
    }

    .data-table tbody tr:last-child td {
        border-bottom: none;
    }

    .pl-wide { padding-left: 32px !important; }
    .pr-wide { padding-right: 32px !important; }
    .text-right { text-align: right; }

    /* Issue Cell Details */
    .issue-cell {
        display: flex;
        align-items: center;
        gap: 16px;
    }

    .type-icon {
        width: 40px;
        height: 40px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        box-shadow: 0 1px 2px rgba(0,0,0,0.05);
    }

    .type-icon svg { width: 20px; height: 20px; }

    .type-icon.bug {
        background-color: #fef2f2;
        color: #dc2626;
        border: 1px solid #fee2e2;
    }

    .type-icon.task {
        background-color: #eff6ff;
        color: #2563eb;
        border: 1px solid #dbeafe;
    }

    .issue-text {
        display: flex;
        flex-direction: column;
        gap: 4px;
        max-width: 300px;
    }

    .issue-text .title {
        margin: 0;
        font-size: 15px;
        font-weight: 700;
        color: #0f172a;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .issue-text .desc {
        margin: 0;
        font-size: 13px;
        font-weight: 500;
        color: #64748b;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    /* Badges */
    .badge {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 6px 12px;
        border-radius: 9999px;
        font-size: 11px;
        font-weight: 800;
        letter-spacing: 0.05em;
        text-transform: uppercase;
    }

    .badge .dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
    }

    .badge.open { background: #fef2f2; color: #b91c1c; border: 1px solid #fecaca; }
    .badge.open .dot { background: #ef4444; }

    .badge.in-progress { background: #eff6ff; color: #1d4ed8; border: 1px solid #bfdbfe; }
    .badge.in-progress .dot { background: #3b82f6; }

    .badge.resolved { background: #f0fdf4; color: #15803d; border: 1px solid #bbf7d0; }
    .badge.resolved .dot { background: #22c55e; }

    .badge.closed { background: #f1f5f9; color: #334155; border: 1px solid #e2e8f0; }
    .badge.closed .dot { background: #64748b; }

    /* Priority */
    .priority {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        font-size: 13px;
        font-weight: 700;
    }
    
    .priority svg { width: 16px; height: 16px; }

    .priority.high { color: #1e293b; }
    .priority.high svg { color: #ef4444; }

    .priority.medium { color: #1e293b; }
    .priority.medium svg { color: #f97316; }

    .priority.low { color: #1e293b; }
    .priority.low svg { color: #3b82f6; }

    /* Assignee */
    .user-cell {
        display: flex;
        align-items: center;
        gap: 12px;
    }

    .avatar {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background: linear-gradient(135deg, #e2e8f0, #cbd5e1);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 13px;
        font-weight: 800;
        color: #334155;
        border: 1px solid white;
        box-shadow: 0 1px 2px rgba(0,0,0,0.1);
        flex-shrink: 0;
    }

    .user-info p { margin: 0; }
    .user-name { font-size: 13px; font-weight: 800; color: #1e293b; }
    .user-role { font-size: 10px; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em; margin-top: 2px; }
    .unassigned { display: inline-flex; padding: 4px 10px; background: #f1f5f9; border-radius: 6px; font-size: 11px; font-weight: 700; color: #64748b; }

    /* Due Date */
    .date-text { font-size: 13px; font-weight: 700; color: #334155; }

    /* Action Button */
    .btn-open {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        background: white;
        border: 1px solid #e2e8f0;
        padding: 8px 16px;
        border-radius: 8px;
        font-size: 13px;
        font-weight: 800;
        color: #334155;
        text-decoration: none;
        box-shadow: 0 1px 2px rgba(0,0,0,0.05);
        transition: all 0.2s;
    }

    .btn-open svg {
        width: 16px;
        height: 16px;
        opacity: 0.5;
    }

    .btn-open:hover {
        border-color: #ff3e00;
        background-color: #fff5f2;
        color: #ff3e00;
    }

    .btn-open:hover svg { opacity: 1; }

    /* Empty State */
    .empty-state { text-align: center; padding: 80px 20px; }
    .empty-icon { width: 64px; height: 64px; margin: 0 auto 24px; background: #f1f5f9; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
    .empty-icon svg { width: 32px; height: 32px; color: #94a3b8; }
    .empty-state h3 { margin: 0; font-size: 18px; font-weight: 800; color: #0f172a; }
    .empty-state p { margin: 8px 0 0; font-size: 14px; color: #64748b; line-height: 1.5; }
</style>