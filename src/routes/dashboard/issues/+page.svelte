<!-- src/routes/dashboard/issues/+page.svelte -->
<script lang="ts">
    // Retrieve data passed from the server
    let { data } = $props();
    let issues = data.issues;
    
    // Simple function to format dates beautifully (e.g., Aug 17, 2026)
    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'No due date';
        return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    // Helper functions for dynamic badge styling based on issue properties
    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'OPEN': return 'bg-red-100 text-red-700 border-red-200';
            case 'IN_PROGRESS': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'RESOLVED': return 'bg-green-100 text-green-700 border-green-200';
            case 'CLOSED': return 'bg-slate-100 text-slate-700 border-slate-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const getPriorityIcon = (priority: string) => {
        switch (priority) {
            case 'HIGH': return '<svg class="w-4 h-4 text-red-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>';
            case 'MEDIUM': return '<svg class="w-4 h-4 text-orange-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" /></svg>';
            case 'LOW': return '<svg class="w-4 h-4 text-blue-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>';
            default: return '';
        }
    };
</script>

<div class="flex h-screen overflow-hidden bg-slate-50 font-sans text-slate-900">
    
    <!-- Sidebar -->
    <aside class="flex w-64 flex-col bg-slate-950 text-slate-300 transition-all duration-300">
        <div class="z-20 flex h-16 items-center border-b border-slate-800 bg-slate-950 px-6">
            <svg class="mr-2 h-8 w-8 text-[#ff3e00]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
            <span class="text-xl font-extrabold uppercase tracking-wide text-white">Tracker<span class="text-[#ff3e00]">Pro</span></span>
        </div>
        <nav class="flex-1 space-y-1 overflow-y-auto px-3 py-6">
            <a href="/dashboard" class="flex items-center rounded-lg px-3 py-2.5 font-medium text-slate-400 transition-all hover:bg-slate-900 hover:text-white">
                <svg class="mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                Dashboard
            </a>
            <!-- Active State for All Issues -->
            <a href="/dashboard/issues" class="group flex items-center rounded-lg bg-[#ff3e00]/10 px-3 py-2.5 font-semibold text-[#ff3e00] transition-all">
                <svg class="mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
                All Issues
            </a>
        </nav>
    </aside>

    <!-- Main Content -->
    <main class="flex h-screen flex-1 flex-col overflow-hidden bg-slate-50">
        <header class="z-10 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-8">
            <h1 class="text-xl font-bold text-slate-800">All Issues</h1>
        </header>

        <div class="flex-1 overflow-y-auto p-8">
            
            <div class="mb-6 flex items-center justify-between">
                <h2 class="text-2xl font-bold text-slate-900">Issue Directory</h2>
                <!-- Filter Placeholder (To be implemented later) -->
                <div class="flex space-x-2">
                    <button class="flex items-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50">
                        <svg class="mr-2 h-4 w-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
                        Filter
                    </button>
                </div>
            </div>

            <!-- Modern Data Table -->
            <div class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div class="overflow-x-auto">
                    <table class="w-full text-left text-sm text-slate-600">
                        <thead class="border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-500 uppercase">
                            <tr>
                                <th scope="col" class="px-6 py-4">Issue Details</th>
                                <th scope="col" class="px-6 py-4">Status</th>
                                <th scope="col" class="px-6 py-4">Priority</th>
                                <th scope="col" class="px-6 py-4">Assignee</th>
                                <th scope="col" class="px-6 py-4">Due Date</th>
                                <th scope="col" class="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-200">
                            {#if issues.length === 0}
                                <tr>
                                    <td colspan="6" class="px-6 py-12 text-center text-slate-500">
                                        No issues found. Go to the Dashboard to create one!
                                    </td>
                                </tr>
                            {:else}
                                {#each issues as issue}
                                    <tr class="transition-colors hover:bg-slate-50">
                                        
                                        <!-- Title & Type -->
                                        <td class="px-6 py-4">
                                            <div class="flex items-center">
                                                {#if issue.type === 'BUG'}
                                                    <span class="mr-3 flex h-6 w-6 items-center justify-center rounded-md bg-red-100 text-red-600"><svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg></span>
                                                {:else}
                                                    <span class="mr-3 flex h-6 w-6 items-center justify-center rounded-md bg-blue-100 text-blue-600"><svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg></span>
                                                {/if}
                                                <div>
                                                    <p class="font-bold text-slate-900">{issue.title}</p>
                                                    <p class="mt-0.5 truncate text-xs text-slate-500 max-w-xs">{issue.description}</p>
                                                </div>
                                            </div>
                                        </td>

                                        <!-- Status Badge -->
                                        <td class="px-6 py-4">
                                            <span class={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-bold uppercase tracking-wider ${getStatusStyle(issue.status)}`}>
                                                {issue.status.replace('_', ' ')}
                                            </span>
                                        </td>

                                        <!-- Priority -->
                                        <td class="px-6 py-4">
                                            <div class="flex items-center font-medium text-slate-700">
                                                {@html getPriorityIcon(issue.priority)}
                                                {issue.priority}
                                            </div>
                                        </td>

                                        <!-- Assignee -->
                                        <td class="px-6 py-4">
                                            {#if issue.assignee}
                                                <div class="flex items-center">
                                                    <div class="mr-2 flex h-7 w-7 items-center justify-center rounded-full bg-slate-200 text-xs font-bold text-slate-700">
                                                        {issue.assignee.name.charAt(0)}
                                                    </div>
                                                    <span class="font-medium text-slate-700">{issue.assignee.name}</span>
                                                </div>
                                            {:else}
                                                <span class="text-slate-400 italic">Unassigned</span>
                                            {/if}
                                        </td>

                                        <!-- Due Date -->
                                        <td class="px-6 py-4 whitespace-nowrap">
                                            <span class="text-slate-600 font-medium">{formatDate(issue.dueDate)}</span>
                                        </td>

                                        <!-- Actions -->
                                        <td class="px-6 py-4 text-right">
                                            <button class="text-sm font-bold text-[#ff3e00] hover:text-[#cc3100] transition">
                                                View / Edit
                                            </button>
                                        </td>
                                    </tr>
                                {/each}
                            {/if}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    </main>
</div>