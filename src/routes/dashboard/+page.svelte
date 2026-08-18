<!-- src/routes/dashboard/+page.svelte -->
<script lang="ts">
    import { enhance } from '$app/forms';
    import { toast } from 'svelte-sonner';

    let { data } = $props();
    let user = $derived(data.user);
    let stats = $derived(data.stats);
    let myTasks = $derived(data.myTasks);
    let recentIssues = $derived(data.recentIssues);
    let allUsers = $derived(data.allUsers);

    let initials = $derived(user.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase());
    
    // State controls
    let isCreateModalOpen = $state(false);
    let isSubmitting = $state(false);

    // Helpers
    const formatDate = (dateString: string | null | Date) => {
        if (!dateString) return 'No Date';
        return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };
    
    const getStatusClass = (status: string) => status.toLowerCase().replace('_', '-');
    const formatStatus = (status: string) => status.replace('_', ' ');
</script>

<div class="app-layout">
    
    <!-- Premium Dark Sidebar -->
    <aside class="sidebar">
        <div class="brand">
            <svg class="brand-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
            <span class="brand-text">Tracker<span>Pro</span></span>
        </div>
        
        <nav class="nav-menu">
            <!-- Active State -->
            <a href="/dashboard" class="nav-item active">
                <svg class="nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                Dashboard
            </a>
            <a href="/dashboard/issues" class="nav-item">
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
        <!-- Top Header with User Profile -->
        <header class="top-header">
            <h1>Overview</h1>
            <div class="user-profile">
                <div class="user-info">
                    <p class="name">{user.name}</p>
                    <p class="role">{user.jobTitle}</p>
                </div>
                <div class="avatar">{initials}</div>
            </div>
        </header>

        <div class="content-scroll">
            
            <!-- Welcome Area & Create Button -->
            <div class="welcome-section">
                <div>
                    <h2 class="welcome-title">Welcome back, {user.name.split(' ')[0]}! 👋</h2>
                    <p class="welcome-subtitle">Here is what's happening with your projects today.</p>
                </div>
                <button class="btn-create" onclick={() => isCreateModalOpen = true}>
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
                    Create New Issue
                </button>
            </div>

            <!-- Stats Grid -->
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-icon total"><svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg></div>
                    <div class="stat-info">
                        <p class="stat-label">Total Issues</p>
                        <p class="stat-value">{stats.total}</p>
                    </div>
                </div>

                <div class="stat-card">
                    <div class="stat-icon open"><svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg></div>
                    <div class="stat-info">
                        <p class="stat-label">Open Issues</p>
                        <p class="stat-value">{stats.open}</p>
                    </div>
                </div>

                <div class="stat-card">
                    <div class="stat-icon in-progress"><svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg></div>
                    <div class="stat-info">
                        <p class="stat-label">In Progress</p>
                        <p class="stat-value">{stats.inProgress}</p>
                    </div>
                </div>

                <div class="stat-card">
                    <div class="stat-icon resolved"><svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div>
                    <div class="stat-info">
                        <p class="stat-label">Resolved</p>
                        <p class="stat-value">{stats.resolved}</p>
                    </div>
                </div>
            </div>

            <!-- Dashboard Split Layout -->
            <div class="dashboard-split">
                
                <!-- Left: My Active Tasks -->
                <div class="dashboard-panel">
                    <div class="panel-header">
                        <h3>My Active Tasks</h3>
                        <a href="/dashboard/issues" class="view-all">View All</a>
                    </div>
                    <div class="panel-content">
                        {#if myTasks.length === 0}
                            <div class="empty-state">
                                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5 13l4 4L19 7" /></svg>
                                <p>You have no active tasks right now. Great job!</p>
                            </div>
                        {:else}
                            <div class="task-list">
                                {#each myTasks as task}
                                    <a href="/dashboard/issues/{task.id}" class="task-item">
                                        <div class="task-icon {task.type.toLowerCase()}">
                                            {#if task.type === 'BUG'}
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                            {:else}
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
                                            {/if}
                                        </div>
                                        <div class="task-details">
                                            <p class="task-title">{task.title}</p>
                                            <div class="task-meta">
                                                <span class="badge mini {getStatusClass(task.status)}">{formatStatus(task.status)}</span>
                                                <span class="date">Due: {formatDate(task.dueDate)}</span>
                                            </div>
                                        </div>
                                        <div class="task-arrow">
                                            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
                                        </div>
                                    </a>
                                {/each}
                            </div>
                        {/if}
                    </div>
                </div>

                <!-- Right: Recent Activity -->
                <div class="dashboard-panel">
                    <div class="panel-header">
                        <h3>Recently Created</h3>
                    </div>
                    <div class="panel-content">
                        {#if recentIssues.length === 0}
                            <div class="empty-state">
                                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
                                <p>No issues have been created yet.</p>
                            </div>
                        {:else}
                            <div class="recent-list">
                                {#each recentIssues as issue}
                                    <div class="recent-item">
                                        <div class="recent-avatar">
                                            {issue.assignee ? issue.assignee.name.charAt(0) : '?'}
                                        </div>
                                        <div class="recent-details">
                                            <p class="recent-title"><a href="/dashboard/issues/{issue.id}">{issue.title}</a></p>
                                            <p class="recent-meta">
                                                {#if issue.assignee}
                                                    Assigned to <strong>{issue.assignee.name}</strong>
                                                {:else}
                                                    Unassigned
                                                {/if}
                                                · {formatDate(issue.createdAt)}
                                            </p>
                                        </div>
                                    </div>
                                {/each}
                            </div>
                        {/if}
                    </div>
                </div>

            </div>
        </div>
    </main>

    <!-- Slide-over Panel for Creating Issues -->
    {#if isCreateModalOpen}
        <div class="slide-overlay">
            <div class="slide-panel">
                
                <div class="slide-header">
                    <h2>Create New Issue</h2>
                    <button class="btn-close" onclick={() => isCreateModalOpen = false}>
                        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                <div class="slide-content">
                    <form 
                        action="?/createIssue" 
                        method="POST" 
                        class="create-form"
                        use:enhance={() => {
                            isSubmitting = true;
                            return async ({ result, update }) => {
                                isSubmitting = false;
                                if (result.type === 'success') {
                                    toast.success('Issue created successfully!');
                                    isCreateModalOpen = false; 
                                } else {
                                    toast.error('Failed to create issue.');
                                }
                                update();
                            };
                        }}
                    >
                        <div class="form-group">
                            <label for="title">Issue Title</label>
                            <input id="title" name="title" type="text" required placeholder="e.g., Fix login page crashing" />
                        </div>

                        <div class="form-group">
                            <label for="description">Description</label>
                            <textarea id="description" name="description" rows="5" required placeholder="Provide detailed information..."></textarea>
                        </div>

                        <div class="form-row">
                            <div class="form-group half">
                                <label for="type">Issue Type</label>
                                <select id="type" name="type">
                                    <option value="BUG">Bug</option>
                                    <option value="TASK">Task</option>
                                </select>
                            </div>
                            <div class="form-group half">
                                <label for="priority">Priority</label>
                                <select id="priority" name="priority">
                                    <option value="LOW">Low</option>
                                    <option value="MEDIUM" selected>Medium</option>
                                    <option value="HIGH">High</option>
                                </select>
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="assigneeId">Assign To</label>
                            <select id="assigneeId" name="assigneeId">
                                <option value="">Unassigned</option>
                                {#each allUsers as appUser}
                                    <option value={appUser.id}>{appUser.name} ({appUser.jobTitle})</option>
                                {/each}
                            </select>
                        </div>

                        <div class="form-group">
                            <label for="dueDate">Due Date</label>
                            <input id="dueDate" name="dueDate" type="date" />
                        </div>

                        <div class="form-footer">
                            <button type="submit" class="btn-submit" disabled={isSubmitting}>
                                {isSubmitting ? 'Creating...' : 'Create Issue'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    {/if}
</div>

<style>
    /* Reset & Base Layout - Master Theme */
    .app-layout { display: flex; height: 100vh; width: 100%; overflow: hidden; font-family: system-ui, -apple-system, sans-serif; background-color: #f8fafc; color: #0f172a; margin: 0; }
    *, *::before, *::after { box-sizing: border-box; }

    /* Sidebar (Consistent across app) */
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
    .top-header { height: 64px; display: flex; align-items: center; justify-content: space-between; padding: 0 32px; background-color: white; border-bottom: 1px solid #e2e8f0; z-index: 10; }
    .top-header h1 { margin: 0; font-size: 20px; font-weight: 700; color: #1e293b; }
    
    .user-profile { display: flex; align-items: center; gap: 12px; }
    .user-info { text-align: right; }
    .user-info .name { margin: 0; font-size: 14px; font-weight: 800; color: #0f172a; }
    .user-info .role { margin: 0; font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em; }
    .avatar { width: 36px; height: 36px; border-radius: 50%; background: linear-gradient(135deg, #ff3e00, #f97316); display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 800; color: white; border: 2px solid white; box-shadow: 0 2px 4px rgba(255, 62, 0, 0.2); }

    /* Dashboard Layout */
    .content-scroll { flex: 1; overflow-y: auto; padding: 40px; }
    
    .welcome-section { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 32px; }
    .welcome-title { margin: 0 0 8px 0; font-size: 28px; font-weight: 800; color: #0f172a; letter-spacing: -0.025em; }
    .welcome-subtitle { margin: 0; font-size: 15px; color: #64748b; }
    
    .btn-create { display: flex; align-items: center; gap: 8px; background: #ff3e00; color: white; border: none; padding: 12px 20px; border-radius: 10px; font-size: 14px; font-weight: 800; cursor: pointer; transition: all 0.2s; box-shadow: 0 4px 6px -1px rgba(255, 62, 0, 0.2); }
    .btn-create:hover { background: #eb3900; transform: translateY(-2px); box-shadow: 0 6px 8px -1px rgba(255, 62, 0, 0.3); }
    .btn-create svg { width: 20px; height: 20px; }

    /* Stats Grid */
    .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; margin-bottom: 32px; }
    .stat-card { background: white; padding: 24px; border-radius: 16px; border: 1px solid #e2e8f0; display: flex; align-items: center; gap: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); transition: transform 0.2s; }
    .stat-card:hover { transform: translateY(-2px); box-shadow: 0 10px 15px -3px rgba(0,0,0,0.05); }
    
    .stat-icon { width: 56px; height: 56px; border-radius: 16px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .stat-icon svg { width: 28px; height: 28px; }
    .stat-icon.total { background: #f1f5f9; color: #475569; }
    .stat-icon.open { background: #fef2f2; color: #dc2626; }
    .stat-icon.in-progress { background: #eff6ff; color: #2563eb; }
    .stat-icon.resolved { background: #f0fdf4; color: #16a34a; }

    .stat-info { display: flex; flex-direction: column; gap: 4px; }
    .stat-label { margin: 0; font-size: 13px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; }
    .stat-value { margin: 0; font-size: 32px; font-weight: 900; color: #0f172a; line-height: 1; }

    /* Split Dashboard Panels */
    .dashboard-split { display: grid; grid-template-columns: 2fr 1fr; gap: 24px; }
    
    .dashboard-panel { background: white; border-radius: 16px; border: 1px solid #e2e8f0; display: flex; flex-direction: column; box-shadow: 0 1px 3px rgba(0,0,0,0.05); overflow: hidden; }
    .panel-header { padding: 20px 24px; border-bottom: 1px solid #f1f5f9; display: flex; justify-content: space-between; align-items: center; background: #f8fafc; }
    .panel-header h3 { margin: 0; font-size: 16px; font-weight: 800; color: #0f172a; }
    .view-all { font-size: 13px; font-weight: 700; color: #ff3e00; text-decoration: none; }
    .view-all:hover { text-decoration: underline; }
    .panel-content { padding: 0; flex: 1; }

    .empty-state { padding: 48px 24px; text-align: center; color: #94a3b8; }
    .empty-state svg { width: 48px; height: 48px; margin: 0 auto 16px; opacity: 0.5; }
    .empty-state p { margin: 0; font-size: 14px; font-weight: 500; }

    /* Task List (Left Panel) */
    .task-list { display: flex; flex-direction: column; }
    .task-item { display: flex; align-items: center; gap: 16px; padding: 20px 24px; border-bottom: 1px solid #f1f5f9; text-decoration: none; transition: background 0.2s; }
    .task-item:last-child { border-bottom: none; }
    .task-item:hover { background: #f8fafc; }
    
    .task-icon { width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .task-icon svg { width: 20px; height: 20px; }
    .task-icon.bug { background: #fef2f2; color: #dc2626; border: 1px solid #fee2e2; }
    .task-icon.task { background: #eff6ff; color: #2563eb; border: 1px solid #dbeafe; }

    .task-details { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 6px; }
    .task-title { margin: 0; font-size: 15px; font-weight: 700; color: #0f172a; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .task-meta { display: flex; align-items: center; gap: 12px; }
    .task-meta .date { font-size: 12px; font-weight: 600; color: #64748b; }

    .task-arrow { color: #cbd5e1; }
    .task-arrow svg { width: 20px; height: 20px; }
    .task-item:hover .task-arrow { color: #ff3e00; transform: translateX(2px); transition: transform 0.2s; }

    /* Recent List (Right Panel) */
    .recent-list { display: flex; flex-direction: column; padding: 12px 0; }
    .recent-item { display: flex; align-items: flex-start; gap: 12px; padding: 12px 24px; }
    .recent-avatar { width: 32px; height: 32px; border-radius: 50%; background: #f1f5f9; border: 1px solid #e2e8f0; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 800; color: #475569; flex-shrink: 0; margin-top: 2px; }
    .recent-details { flex: 1; min-width: 0; }
    .recent-title { margin: 0 0 4px 0; font-size: 14px; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .recent-title a { color: #1e293b; text-decoration: none; transition: color 0.2s; }
    .recent-title a:hover { color: #ff3e00; }
    .recent-meta { margin: 0; font-size: 12px; color: #64748b; line-height: 1.5; }
    .recent-meta strong { color: #334155; }

    /* Mini Status Badges */
    .badge.mini { display: inline-flex; align-items: center; padding: 2px 8px; border-radius: 9999px; font-size: 10px; font-weight: 800; letter-spacing: 0.05em; text-transform: uppercase; }
    .badge.mini.open { background: #fef2f2; color: #b91c1c; border: 1px solid #fecaca; }
    .badge.mini.in-progress { background: #eff6ff; color: #1d4ed8; border: 1px solid #bfdbfe; }
    .badge.mini.resolved { background: #f0fdf4; color: #15803d; border: 1px solid #bbf7d0; }
    .badge.mini.closed { background: #f1f5f9; color: #334155; border: 1px solid #e2e8f0; }

    /* Slide-over Modal for Create Form */
    @keyframes slideInRight { from { transform: translateX(100%); } to { transform: translateX(0); } }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

    .slide-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(15,23,42,0.6); backdrop-filter: blur(4px); z-index: 9999; display: flex; justify-content: flex-end; animation: fadeIn 0.2s ease-out; }
    .slide-panel { width: 100%; max-width: 480px; background: white; height: 100%; display: flex; flex-direction: column; box-shadow: -10px 0 40px rgba(0,0,0,0.1); animation: slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
    
    .slide-header { padding: 24px 32px; border-bottom: 1px solid #f1f5f9; display: flex; justify-content: space-between; align-items: center; background: #020617; color: white; }
    .slide-header h2 { margin: 0; font-size: 20px; font-weight: 800; }
    .btn-close { background: transparent; border: none; color: #94a3b8; cursor: pointer; padding: 4px; border-radius: 6px; transition: all 0.2s; }
    .btn-close:hover { background: rgba(255,255,255,0.1); color: white; }
    .btn-close svg { width: 24px; height: 24px; }

    .slide-content { flex: 1; overflow-y: auto; padding: 32px; }
    
    .create-form { display: flex; flex-direction: column; gap: 20px; }
    .form-group { display: flex; flex-direction: column; gap: 8px; }
    .form-row { display: flex; gap: 16px; }
    .form-group.half { flex: 1; }
    
    .form-group label { font-size: 13px; font-weight: 800; color: #334155; }
    .form-group input, .form-group textarea, .form-group select { width: 100%; padding: 12px 16px; border-radius: 8px; border: 1px solid #cbd5e1; font-family: inherit; font-size: 14px; color: #0f172a; outline: none; transition: all 0.2s; background: #f8fafc; }
    .form-group input:focus, .form-group textarea:focus, .form-group select:focus { border-color: #ff3e00; background: white; box-shadow: 0 0 0 3px rgba(255, 62, 0, 0.1); }
    .form-group textarea { resize: vertical; }

    .form-footer { margin-top: 12px; padding-top: 24px; border-top: 1px solid #f1f5f9; }
    .btn-submit { width: 100%; background: #ff3e00; color: white; border: none; padding: 14px; border-radius: 8px; font-size: 15px; font-weight: 800; cursor: pointer; transition: all 0.2s; box-shadow: 0 4px 6px -1px rgba(255, 62, 0, 0.2); }
    .btn-submit:hover:not(:disabled) { background: #eb3900; transform: translateY(-1px); }
    .btn-submit:disabled { opacity: 0.7; cursor: not-allowed; }

    @media (max-width: 1200px) {
        .stats-grid { grid-template-columns: repeat(2, 1fr); }
        .dashboard-split { grid-template-columns: 1fr; }
    }
</style>