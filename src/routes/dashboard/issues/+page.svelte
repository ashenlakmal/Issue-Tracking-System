<!-- src/routes/dashboard/issues/+page.svelte -->
<script lang="ts">
    import { enhance } from '$app/forms';

    // Receive data from the server load function
    let { data } = $props();
    
    // Ensure reactivity for the issues array
    let issues = $derived(data.issues || []);
    
    // Filter State Management (Svelte 5)
    let isFilterMenuOpen = $state(false);
    let selectedStatus = $state('ALL');
    let selectedPriority = $state('ALL');

    // Derived filtered issues based on selected dropdowns
    let filteredIssues = $derived(issues.filter(issue => {
        const matchStatus = selectedStatus === 'ALL' || issue.status === selectedStatus;
        const matchPriority = selectedPriority === 'ALL' || issue.priority === selectedPriority;
        return matchStatus && matchPriority;
    }));
    
    // Format dates cleanly
    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'No Date';
        return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    // Helper to format enum strings (e.g., IN_PROGRESS -> In Progress)
    const formatEnum = (str: string) => {
        return str.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
    };
</script>

<div class="flex h-screen overflow-hidden bg-slate-50 font-sans text-slate-900">
    
    <!-- Exact Match Sidebar from Dashboard (Dark Slate & Orange Theme) -->
    <aside class="flex w-64 flex-col bg-slate-950 text-slate-300 transition-all duration-300">
        <!-- Brand -->
        <div class="z-20 flex h-16 items-center border-b border-slate-800 bg-slate-950 px-6">
            <svg class="mr-2 h-8 w-8 text-[#ff3e00]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
            <span class="text-xl font-extrabold uppercase tracking-wide text-white">Tracker<span class="text-[#ff3e00]">Pro</span></span>
        </div>

        <!-- Navigation Links -->
        <nav class="flex-1 space-y-1 overflow-y-auto px-3 py-6">
            <a href="/dashboard" class="flex items-center rounded-lg px-3 py-2.5 font-medium text-slate-400 transition-all hover:bg-slate-900 hover:text-white">
                <svg class="mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                Dashboard
            </a>
            
            <!-- Active State matching Dashboard style -->
            <a href="/dashboard/issues" class="group flex items-center rounded-lg bg-[#ff3e00]/10 px-3 py-2.5 font-semibold text-[#ff3e00] transition-all">
                <svg class="mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
                All Issues
            </a>
        </nav>

        <!-- Sidebar Footer (Logout) -->
        <div class="border-t border-slate-800 p-4">
            <form action="/logout" method="POST" use:enhance>
                <button type="submit" class="flex w-full items-center rounded-lg px-3 py-2 font-medium text-slate-400 transition-all hover:bg-slate-900 hover:text-red-400">
                    <svg class="mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                    Sign Out
                </button>
            </form>
        </div>
    </aside>

    <!-- Main Workspace -->
    <main class="flex h-screen flex-1 flex-col overflow-hidden bg-slate-50">
        
        <!-- Header -->
        <header class="z-10 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-8">
            <h1 class="text-xl font-bold text-slate-800">All Issues</h1>
        </header>

        <div class="flex-1 overflow-y-auto p-8">
            
            <div class="mb-6 flex items-center justify-between">
                <h2 class="text-2xl font-bold text-slate-900">Issue Directory</h2>
                
                <!-- Filter Dropdown System -->
                <div class="relative">
                    <button 
                        onclick={() => isFilterMenuOpen = !isFilterMenuOpen}
                        class="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-700 shadow-sm transition-all hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#ff3e00]"
                    >
                        <svg class="h-4 w-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
                        Filter Issues
                        {#if selectedStatus !== 'ALL' || selectedPriority !== 'ALL'}
                            <span class="ml-1 flex h-2 w-2 rounded-full bg-[#ff3e00]"></span>
                        {/if}
                    </button>

                    <!-- Filter Dropdown Menu -->
                    {#if isFilterMenuOpen}
                        <div class="absolute right-0 mt-2 w-64 rounded-xl border border-slate-200 bg-white p-4 shadow-xl z-30">
                            
                            <div class="mb-4">
                                <label class="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500">Status</label>
                                <select bind:value={selectedStatus} class="block w-full rounded-lg border border-slate-300 bg-slate-50 p-2.5 text-sm font-medium text-slate-900 focus:border-[#ff3e00] focus:ring-1 focus:ring-[#ff3e00] focus:outline-none">
                                    <option value="ALL">All Statuses</option>
                                    <option value="OPEN">Open</option>
                                    <option value="IN_PROGRESS">In Progress</option>
                                    <option value="RESOLVED">Resolved</option>
                                    <option value="CLOSED">Closed</option>
                                </select>
                            </div>

                            <div class="mb-4">
                                <label class="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500">Priority</label>
                                <select bind:value={selectedPriority} class="block w-full rounded-lg border border-slate-300 bg-slate-50 p-2.5 text-sm font-medium text-slate-900 focus:border-[#ff3e00] focus:ring-1 focus:ring-[#ff3e00] focus:outline-none">
                                    <option value="ALL">All Priorities</option>
                                    <option value="HIGH">High</option>
                                    <option value="MEDIUM">Medium</option>
                                    <option value="LOW">Low</option>
                                </select>
                            </div>

                            <button 
                                onclick={() => {
                                    selectedStatus = 'ALL';
                                    selectedPriority = 'ALL';
                                }}
                                class="w-full rounded-lg border border-slate-200 bg-white py-2 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
                            >
                                Clear Filters
                            </button>
                        </div>
                    {/if}
                </div>
            </div>

            <!-- Premium Data Table Container -->
            <div class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div class="overflow-x-auto">
                    <table class="w-full text-left text-sm text-slate-600 whitespace-nowrap">
                        <thead class="border-b border-slate-200 bg-slate-50/80 text-[11px] font-bold tracking-widest text-slate-400 uppercase">
                            <tr>
                                <th scope="col" class="px-8 py-5">Issue Name</th>
                                <th scope="col" class="px-6 py-5">Status</th>
                                <th scope="col" class="px-6 py-5">Priority</th>
                                <th scope="col" class="px-6 py-5">Assignee</th>
                                <th scope="col" class="px-6 py-5">Due Date</th>
                                <th scope="col" class="px-8 py-5 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-100">
                            {#if filteredIssues.length === 0}
                                <tr>
                                    <td colspan="6" class="py-24 text-center">
                                        <div class="mx-auto flex flex-col items-center justify-center">
                                            <div class="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
                                                <svg class="h-8 w-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
                                            </div>
                                            <p class="text-lg font-bold text-slate-900">No issues found</p>
                                            <p class="mt-1 text-slate-500">Try adjusting your filters or create a new issue.</p>
                                        </div>
                                    </td>
                                </tr>
                            {:else}
                                {#each filteredIssues as issue}
                                    <tr class="group transition-colors hover:bg-slate-50/80">
                                        
                                        <!-- Title & Icon -->
                                        <td class="px-8 py-5">
                                            <div class="flex items-center gap-4">
                                                {#if issue.type === 'BUG'}
                                                    <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600 ring-1 ring-inset ring-red-600/20 transition-transform group-hover:scale-105">
                                                        <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                                    </div>
                                                {:else}
                                                    <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 ring-1 ring-inset ring-blue-600/20 transition-transform group-hover:scale-105">
                                                        <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
                                                    </div>
                                                {/if}
                                                <div class="flex max-w-[280px] flex-col">
                                                    <p class="truncate text-[15px] font-bold text-slate-900 tracking-tight">{issue.title}</p>
                                                    <p class="truncate text-[13px] font-medium text-slate-500 mt-0.5">{issue.description}</p>
                                                </div>
                                            </div>
                                        </td>

                                        <!-- Safely Sized SVG Status Badge -->
                                        <td class="px-6 py-5">
                                            {#if issue.status === 'OPEN'}
                                                <span class="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1 text-[11px] font-bold tracking-wider text-red-700 ring-1 ring-inset ring-red-600/20">
                                                    <svg class="h-1.5 w-1.5 fill-red-500" viewBox="0 0 6 6"><circle cx="3" cy="3" r="3" /></svg> OPEN
                                                </span>
                                            {:else if issue.status === 'IN_PROGRESS'}
                                                <span class="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-[11px] font-bold tracking-wider text-blue-700 ring-1 ring-inset ring-blue-700/20">
                                                    <svg class="h-1.5 w-1.5 fill-blue-500" viewBox="0 0 6 6"><circle cx="3" cy="3" r="3" /></svg> IN PROGRESS
                                                </span>
                                            {:else if issue.status === 'RESOLVED'}
                                                <span class="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-bold tracking-wider text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                                                    <svg class="h-1.5 w-1.5 fill-emerald-500" viewBox="0 0 6 6"><circle cx="3" cy="3" r="3" /></svg> RESOLVED
                                                </span>
                                            {:else}
                                                <span class="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-[11px] font-bold tracking-wider text-slate-700 ring-1 ring-inset ring-slate-500/20">
                                                    <svg class="h-1.5 w-1.5 fill-slate-400" viewBox="0 0 6 6"><circle cx="3" cy="3" r="3" /></svg> {formatEnum(issue.status)}
                                                </span>
                                            {/if}
                                        </td>

                                        <!-- Priority -->
                                        <td class="px-6 py-5">
                                            <div class="flex items-center gap-1.5 text-[13px] font-bold text-slate-800">
                                                {#if issue.priority === 'HIGH'}
                                                    <svg class="h-4 w-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg> High
                                                {:else if issue.priority === 'MEDIUM'}
                                                    <svg class="h-4 w-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 6h16M4 12h16M4 18h16" /></svg> Medium
                                                {:else}
                                                    <svg class="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg> Low
                                                {/if}
                                            </div>
                                        </td>

                                        <!-- Assignee -->
                                        <td class="px-6 py-5">
                                            {#if issue.assignee}
                                                <div class="flex items-center gap-3">
                                                    <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[13px] font-bold text-slate-600 ring-1 ring-inset ring-slate-200">
                                                        {issue.assignee.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div class="flex flex-col">
                                                        <span class="text-[13px] font-bold text-slate-900">{issue.assignee.name}</span>
                                                        <span class="text-[10px] font-bold tracking-wider text-slate-400 uppercase mt-0.5">{issue.assignee.jobTitle || 'Member'}</span>
                                                    </div>
                                                </div>
                                            {:else}
                                                <span class="inline-flex rounded-md bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-500">Unassigned</span>
                                            {/if}
                                        </td>

                                        <!-- Due Date -->
                                        <td class="px-6 py-5 font-semibold text-slate-700">
                                            {formatDate(issue.dueDate)}
                                        </td>

                                        <!-- Action Button -->
                                        <td class="px-8 py-5 text-right">
                                            <a href={`/dashboard/issues/${issue.id}`} class="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-4 py-2 text-[13px] font-bold text-slate-700 shadow-sm ring-1 ring-inset ring-slate-200 transition-all hover:bg-slate-50 hover:text-[#ff3e00] hover:ring-[#ff3e00]/30 focus:outline-none focus:ring-2 focus:ring-[#ff3e00]">
                                                Open
                                                <svg class="h-4 w-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                            </a>
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