<!-- src/routes/dashboard/issues/+page.svelte -->
<script lang="ts">
    // Receive data from the server load function
    let { data } = $props();
    
    // Ensure reactivity for the issues array
    let issues = $derived(data.issues);
    
    // Format dates beautifully (e.g., Aug 17, 2026)
    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'No due date';
        return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };
</script>

<div class="flex h-screen overflow-hidden bg-slate-50 font-sans text-slate-900">
    
    <!-- Enterprise Sidebar -->
    <aside class="z-20 flex w-64 flex-col bg-slate-950 text-slate-300 shadow-xl transition-all duration-300">
        <div class="flex h-16 items-center border-b border-slate-800 bg-slate-950 px-6">
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
            <!-- Active State -->
            <a href="/dashboard/issues" class="group flex items-center rounded-lg bg-[#ff3e00]/10 px-3 py-2.5 font-semibold text-[#ff3e00] transition-all">
                <svg class="mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
                All Issues
            </a>
        </nav>
    </aside>

    <!-- Main Content Area -->
    <main class="flex h-screen flex-1 flex-col overflow-hidden bg-slate-50">
        
        <header class="z-10 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-8 shadow-sm">
            <h1 class="text-xl font-bold text-slate-800">All Issues</h1>
        </header>

        <div class="flex-1 overflow-y-auto p-8">
            <div class="mb-6 flex items-center justify-between">
                <h2 class="text-2xl font-bold text-slate-900">Issue Directory</h2>
                
                <button class="flex items-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-700 shadow-sm transition-all hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#ff3e00]">
                    <svg class="mr-2 h-4 w-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
                    Filter Issues
                </button>
            </div>

            <!-- Premium Data Table Container -->
            <div class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                <div class="overflow-x-auto">
                    <table class="w-full text-left text-sm text-slate-600">
                        <thead class="border-b border-slate-200 bg-slate-50 text-xs font-bold tracking-wider text-slate-500 uppercase">
                            <tr>
                                <th scope="col" class="px-6 py-4">Issue Details</th>
                                <th scope="col" class="px-6 py-4">Status</th>
                                <th scope="col" class="px-6 py-4">Priority</th>
                                <th scope="col" class="px-6 py-4">Assignee</th>
                                <th scope="col" class="px-6 py-4">Due Date</th>
                                <th scope="col" class="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-100">
                            {#if issues.length === 0}
                                <tr>
                                    <td colspan="6" class="px-6 py-16 text-center">
                                        <div class="flex flex-col items-center justify-center">
                                            <div class="mb-4 rounded-full bg-slate-100 p-4">
                                                <svg class="h-8 w-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
                                            </div>
                                            <p class="text-lg font-bold text-slate-900">No issues found.</p>
                                        </div>
                                    </td>
                                </tr>
                            {:else}
                                {#each issues as issue}
                                    <tr class="transition-colors hover:bg-slate-50/80">
                                        
                                        <!-- Title & Type -->
                                        <td class="px-6 py-4">
                                            <div class="flex items-center">
                                                {#if issue.type === 'BUG'}
                                                    <span class="mr-4 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600 shadow-sm"><svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg></span>
                                                {:else}
                                                    <span class="mr-4 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600 shadow-sm"><svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg></span>
                                                {/if}
                                                <div class="min-w-0">
                                                    <p class="text-base font-bold text-slate-900">{issue.title}</p>
                                                    <p class="mt-1 max-w-xs truncate text-xs font-medium text-slate-500">{issue.description}</p>
                                                </div>
                                            </div>
                                        </td>

                                        <!-- Status Badge (Inlined for 100% Tailwind reliability) -->
                                        <td class="whitespace-nowrap px-6 py-4">
                                            {#if issue.status === 'OPEN'}
                                                <span class="inline-flex items-center rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-700">OPEN</span>
                                            {:else if issue.status === 'IN_PROGRESS'}
                                                <span class="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">IN PROGRESS</span>
                                            {:else if issue.status === 'RESOLVED'}
                                                <span class="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">RESOLVED</span>
                                            {:else}
                                                <span class="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">{issue.status}</span>
                                            {/if}
                                        </td>

                                        <!-- Priority (Inlined) -->
                                        <td class="whitespace-nowrap px-6 py-4">
                                            {#if issue.priority === 'HIGH'}
                                                <div class="flex items-center font-bold text-red-600">
                                                    <svg class="mr-1.5 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg> High
                                                </div>
                                            {:else if issue.priority === 'MEDIUM'}
                                                <div class="flex items-center font-bold text-orange-500">
                                                    <svg class="mr-1.5 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 6h16M4 12h16M4 18h16" /></svg> Medium
                                                </div>
                                            {:else}
                                                <div class="flex items-center font-bold text-blue-500">
                                                    <svg class="mr-1.5 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg> Low
                                                </div>
                                            {/if}
                                        </td>

                                        <!-- Assignee -->
                                        <td class="whitespace-nowrap px-6 py-4">
                                            {#if issue.assignee}
                                                <div class="flex items-center">
                                                    <div class="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-slate-200 to-slate-300 text-sm font-bold text-slate-700 shadow-sm border border-white">
                                                        {issue.assignee.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p class="font-bold text-slate-800">{issue.assignee.name}</p>
                                                        <p class="text-[10px] font-bold tracking-wider text-slate-400 uppercase">{issue.assignee.jobTitle}</p>
                                                    </div>
                                                </div>
                                            {:else}
                                                <span class="inline-flex items-center rounded-md bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-500">Unassigned</span>
                                            {/if}
                                        </td>

                                        <!-- Due Date -->
                                        <td class="whitespace-nowrap px-6 py-4 font-semibold text-slate-700">
                                            {formatDate(issue.dueDate)}
                                        </td>

                                        <!-- Actions -->
                                        <td class="whitespace-nowrap px-6 py-4 text-right">
                                            <a href={`/dashboard/issues/${issue.id}`} class="inline-flex items-center justify-center rounded-lg bg-[#ff3e00]/10 px-4 py-2 text-sm font-bold text-[#ff3e00] transition-colors hover:bg-[#ff3e00] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#ff3e00]">
                                                Manage
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