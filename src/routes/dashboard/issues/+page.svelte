<!-- src/routes/dashboard/issues/+page.svelte -->
<script lang="ts">
    // Receive data from the server load function
    let { data } = $props();
    
    // Ensure reactivity for the issues array
    let issues = $derived(data.issues);
    
    // Format dates cleanly without clutter
    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'No Date';
        return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };
</script>

<div class="flex h-screen overflow-hidden bg-[#f8fafc] font-sans text-slate-900">
    
    <!-- Premium Dark Sidebar -->
    <aside class="z-20 flex w-[260px] flex-col bg-[#0f172a] text-slate-300 shadow-2xl transition-all duration-300 border-r border-slate-800">
        <div class="flex h-20 items-center px-8">
            <svg class="mr-3 h-8 w-8 text-[#ff3e00]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
            <span class="text-xl font-extrabold tracking-widest text-white uppercase mt-1">Tracker<span class="text-[#ff3e00]">Pro</span></span>
        </div>
        
        <nav class="flex-1 space-y-2 overflow-y-auto px-4 py-8">
            <a href="/dashboard" class="flex items-center rounded-xl px-4 py-3 text-sm font-semibold text-slate-400 transition-all hover:bg-slate-800/50 hover:text-white">
                <svg class="mr-3.5 h-5 w-5 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                Dashboard
            </a>
            <!-- Active State -->
            <a href="/dashboard/issues" class="flex items-center rounded-xl bg-gradient-to-r from-[#ff3e00]/10 to-transparent px-4 py-3 text-sm font-semibold text-[#ff3e00] shadow-[inset_2px_0_0_0_#ff3e00] transition-all">
                <svg class="mr-3.5 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
                All Issues
            </a>
        </nav>
    </aside>

    <!-- Main Workspace -->
    <main class="flex h-screen flex-1 flex-col overflow-hidden bg-[#f8fafc]">
        
        <!-- Minimalist Top Header -->
        <header class="z-10 flex h-20 items-center justify-between border-b border-slate-200/60 bg-white/80 px-10 backdrop-blur-md">
            <h1 class="text-xl font-extrabold tracking-tight text-slate-800">Issue Directory</h1>
            
            <div class="flex items-center gap-4">
                <button class="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm transition-all hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-200">
                    <svg class="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
                    Filter views
                </button>
            </div>
        </header>

        <!-- Spacious Content Area -->
        <div class="flex-1 overflow-y-auto px-10 py-10">

            <!-- Ultra-Clean Data Table -->
            <div class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <table class="w-full text-left text-sm whitespace-nowrap">
                    
                    <!-- Table Header with more breathing room -->
                    <thead class="border-b border-slate-200 bg-slate-50/50">
                        <tr>
                            <th scope="col" class="py-5 pl-8 pr-4 text-[11px] font-bold tracking-widest text-slate-400 uppercase">Issue Name</th>
                            <th scope="col" class="py-5 px-6 text-[11px] font-bold tracking-widest text-slate-400 uppercase">Status</th>
                            <th scope="col" class="py-5 px-6 text-[11px] font-bold tracking-widest text-slate-400 uppercase">Priority</th>
                            <th scope="col" class="py-5 px-6 text-[11px] font-bold tracking-widest text-slate-400 uppercase">Assignee</th>
                            <th scope="col" class="py-5 px-6 text-[11px] font-bold tracking-widest text-slate-400 uppercase">Due Date</th>
                            <th scope="col" class="py-5 pl-4 pr-8 text-right text-[11px] font-bold tracking-widest text-slate-400 uppercase">Action</th>
                        </tr>
                    </thead>
                    
                    <tbody class="divide-y divide-slate-100">
                        {#if issues.length === 0}
                            <tr>
                                <td colspan="6" class="py-24 text-center">
                                    <div class="mx-auto max-w-sm">
                                        <div class="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-slate-50">
                                            <svg class="h-8 w-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
                                        </div>
                                        <h3 class="text-lg font-bold text-slate-900">No issues found</h3>
                                        <p class="mt-2 text-sm text-slate-500 leading-relaxed">Your project is clean. When bugs or tasks arise, they will be listed here.</p>
                                    </div>
                                </td>
                            </tr>
                        {:else}
                            {#each issues as issue}
                                <tr class="group transition-colors hover:bg-slate-50/60">
                                    
                                    <!-- Title & Icon: Improved spacing and smaller, refined icons -->
                                    <td class="py-5 pl-8 pr-4">
                                        <div class="flex items-center gap-4">
                                            {#if issue.type === 'BUG'}
                                                <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600 ring-1 ring-inset ring-red-600/10 transition-transform group-hover:scale-105">
                                                    <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                                </div>
                                            {:else}
                                                <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 ring-1 ring-inset ring-blue-600/10 transition-transform group-hover:scale-105">
                                                    <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
                                                </div>
                                            {/if}
                                            <div class="flex flex-col gap-1 max-w-[300px]">
                                                <p class="truncate text-[15px] font-bold text-slate-900 tracking-tight">{issue.title}</p>
                                                <p class="truncate text-[13px] font-medium text-slate-500">{issue.description}</p>
                                            </div>
                                        </div>
                                    </td>

                                    <!-- Status Badge with Premium Glowing Dot -->
                                    <td class="px-6 py-5">
                                        {#if issue.status === 'OPEN'}
                                            <span class="inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1.5 text-[11px] font-bold tracking-wide text-red-700 ring-1 ring-inset ring-red-600/20">
                                                <svg class="h-1.5 w-1.5 fill-red-500" viewBox="0 0 6 6"><circle cx="3" cy="3" r="3" /></svg>
                                                OPEN
                                            </span>
                                        {:else if issue.status === 'IN_PROGRESS'}
                                            <span class="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-[11px] font-bold tracking-wide text-blue-700 ring-1 ring-inset ring-blue-700/20">
                                                <svg class="h-1.5 w-1.5 fill-blue-500" viewBox="0 0 6 6"><circle cx="3" cy="3" r="3" /></svg>
                                                IN PROGRESS
                                            </span>
                                        {:else if issue.status === 'RESOLVED'}
                                            <span class="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-[11px] font-bold tracking-wide text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                                                <svg class="h-1.5 w-1.5 fill-emerald-500" viewBox="0 0 6 6"><circle cx="3" cy="3" r="3" /></svg>
                                                RESOLVED
                                            </span>
                                        {:else}
                                            <span class="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-[11px] font-bold tracking-wide text-slate-700 ring-1 ring-inset ring-slate-500/20">
                                                <svg class="h-1.5 w-1.5 fill-slate-400" viewBox="0 0 6 6"><circle cx="3" cy="3" r="3" /></svg>
                                                {issue.status}
                                            </span>
                                        {/if}
                                    </td>

                                    <!-- Priority -->
                                    <td class="px-6 py-5">
                                        {#if issue.priority === 'HIGH'}
                                            <div class="flex items-center gap-2 text-[13px] font-bold text-slate-800">
                                                <svg class="h-4 w-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg> 
                                                High
                                            </div>
                                        {:else if issue.priority === 'MEDIUM'}
                                            <div class="flex items-center gap-2 text-[13px] font-bold text-slate-800">
                                                <svg class="h-4 w-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 6h16M4 12h16M4 18h16" /></svg> 
                                                Medium
                                            </div>
                                        {:else}
                                            <div class="flex items-center gap-2 text-[13px] font-bold text-slate-800">
                                                <svg class="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg> 
                                                Low
                                            </div>
                                        {/if}
                                    </td>

                                    <!-- Assignee -->
                                    <td class="px-6 py-5">
                                        {#if issue.assignee}
                                            <div class="flex items-center gap-3">
                                                <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600 ring-1 ring-inset ring-slate-200">
                                                    {issue.assignee.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div class="flex flex-col">
                                                    <span class="text-[13px] font-bold text-slate-900">{issue.assignee.name}</span>
                                                    <span class="text-[11px] font-medium text-slate-400">{issue.assignee.jobTitle || 'Team Member'}</span>
                                                </div>
                                            </div>
                                        {:else}
                                            <span class="inline-flex items-center rounded-md bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-500">Unassigned</span>
                                        {/if}
                                    </td>

                                    <!-- Due Date -->
                                    <td class="px-6 py-5">
                                        <div class="flex flex-col">
                                            <span class="text-[13px] font-bold text-slate-700">{formatDate(issue.dueDate)}</span>
                                        </div>
                                    </td>

                                    <!-- Clean Action Button -->
                                    <td class="py-5 pl-4 pr-8 text-right">
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
    </main>
</div>