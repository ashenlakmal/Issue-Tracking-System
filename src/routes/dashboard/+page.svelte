<!-- src/routes/dashboard/+page.svelte -->
<script lang="ts">
    import { enhance } from '$app/forms';
    import { toast } from 'svelte-sonner';

    let { data } = $props();
    let user = data.user;
    let stats = data.stats;
    let allUsers = data.allUsers;

    let initials = user.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase();
    
    // State to control the visibility of the slide-over panel
    let isCreateModalOpen = $state(false);
    let isSubmitting = $state(false);
</script>

<div class="flex h-screen overflow-hidden bg-slate-50 font-sans text-slate-900 relative">
    
    <!-- Sidebar (Same as before) -->
    <aside class="flex w-64 flex-col bg-slate-950 text-slate-300 transition-all duration-300">
        <div class="z-20 flex h-16 items-center border-b border-slate-800 bg-slate-950 px-6">
            <svg class="mr-2 h-8 w-8 text-[#ff3e00]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
            <span class="text-xl font-extrabold uppercase tracking-wide text-white">Tracker<span class="text-[#ff3e00]">Pro</span></span>
        </div>
        <nav class="flex-1 space-y-1 overflow-y-auto px-3 py-6">
            <a href="/dashboard" class="group flex items-center rounded-lg bg-[#ff3e00]/10 px-3 py-2.5 font-semibold text-[#ff3e00] transition-all">
                <svg class="mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                Dashboard
            </a>
            <a href="/dashboard/issues" class="flex items-center rounded-lg px-3 py-2.5 font-medium text-slate-400 transition-all hover:bg-slate-900 hover:text-white">
                <svg class="mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
                All Issues
            </a>
        </nav>
        <div class="border-t border-slate-800 p-4">
            <form action="/logout" method="POST" use:enhance>
                <button type="submit" class="flex w-full items-center rounded-lg px-3 py-2 font-medium text-slate-400 transition-all hover:bg-slate-900 hover:text-red-400">
                    <svg class="mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                    Sign Out
                </button>
            </form>
        </div>
    </aside>

    <!-- Main Content -->
    <main class="flex h-screen flex-1 flex-col overflow-hidden bg-slate-50">
        <header class="z-10 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-8">
            <h1 class="text-xl font-bold text-slate-800">Overview</h1>
            <div class="flex items-center space-x-4">
                <div class="hidden text-right sm:block">
                    <p class="text-sm font-bold text-slate-900">{user.name}</p>
                    <p class="text-xs font-medium text-slate-500">{user.jobTitle}</p>
                </div>
                <div class="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-gradient-to-tr from-[#ff3e00] to-orange-400 font-bold text-white shadow-md">
                    {initials}
                </div>
            </div>
        </header>

        <div class="flex-1 overflow-y-auto p-8">
            <div class="mb-8 flex flex-col justify-between sm:flex-row sm:items-center">
                <div>
                    <h2 class="text-2xl font-bold text-slate-900">Welcome back, {user.name.split(' ')[0]}!</h2>
                    <p class="mt-1 text-slate-500">Here is what's happening with your projects today.</p>
                </div>
                <!-- Trigger Button for Slide-over -->
                <button onclick={() => isCreateModalOpen = true} class="mt-4 flex transform items-center rounded-xl bg-[#ff3e00] px-5 py-2.5 font-bold text-white shadow-sm shadow-[#ff3e00]/20 transition-all hover:-translate-y-0.5 hover:bg-[#eb3900] sm:mt-0">
                    <svg class="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
                    Create New Issue
                </button>
            </div>

            <div class="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <div class="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                    <p class="text-sm font-semibold tracking-wider text-slate-500 uppercase">Total Issues</p>
                    <p class="mt-4 text-3xl font-extrabold text-slate-900">{stats.total}</p>
                </div>
            </div>
        </div>
    </main>

    <!-- Slide-over Panel for Creating Issues -->
    {#if isCreateModalOpen}
        <div class="fixed inset-0 z-50 overflow-hidden bg-slate-900/50 backdrop-blur-sm transition-opacity">
            <div class="absolute inset-y-0 right-0 flex max-w-full pl-10">
                <div class="w-screen max-w-md transform transition-transform duration-300 ease-in-out">
                    <div class="flex h-full flex-col overflow-y-scroll bg-white shadow-2xl">
                        
                        <!-- Panel Header -->
                        <div class="flex items-center justify-between bg-slate-950 px-6 py-5 text-white">
                            <h2 class="text-xl font-bold">Create New Issue</h2>
                            <button onclick={() => isCreateModalOpen = false} class="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition">
                                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        <!-- Panel Form -->
                        <div class="flex-1 px-6 py-6">
                            <form 
                                action="?/createIssue" 
                                method="POST" 
                                class="space-y-5"
                                use:enhance={() => {
                                    isSubmitting = true;
                                    return async ({ result, update }) => {
                                        isSubmitting = false;
                                        if (result.type === 'success') {
                                            toast.success('Issue created successfully!');
                                            isCreateModalOpen = false; // Close panel on success
                                        } else {
                                            toast.error('Failed to create issue.');
                                        }
                                        update();
                                    };
                                }}
                            >
                                <div>
                                    <label for="title" class="mb-1 block text-sm font-semibold text-slate-700">Issue Title</label>
                                    <input id="title" name="title" type="text" required class="block w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm transition focus:border-[#ff3e00] focus:ring-1 focus:ring-[#ff3e00] focus:outline-none" placeholder="e.g., Fix login page crashing" />
                                </div>

                                <div>
                                    <label for="description" class="mb-1 block text-sm font-semibold text-slate-700">Description</label>
                                    <textarea id="description" name="description" rows="4" required class="block w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm transition focus:border-[#ff3e00] focus:ring-1 focus:ring-[#ff3e00] focus:outline-none" placeholder="Provide detailed information..."></textarea>
                                </div>

                                <div class="grid grid-cols-2 gap-4">
                                    <div>
                                        <label for="type" class="mb-1 block text-sm font-semibold text-slate-700">Issue Type</label>
                                        <select id="type" name="type" class="block w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm transition focus:border-[#ff3e00] focus:ring-1 focus:ring-[#ff3e00] focus:outline-none">
                                            <option value="BUG">Bug</option>
                                            <option value="TASK">Task</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label for="priority" class="mb-1 block text-sm font-semibold text-slate-700">Priority</label>
                                        <select id="priority" name="priority" class="block w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm transition focus:border-[#ff3e00] focus:ring-1 focus:ring-[#ff3e00] focus:outline-none">
                                            <option value="LOW">Low</option>
                                            <option value="MEDIUM" selected>Medium</option>
                                            <option value="HIGH">High</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label for="assigneeId" class="mb-1 block text-sm font-semibold text-slate-700">Assign To</label>
                                    <select id="assigneeId" name="assigneeId" class="block w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm transition focus:border-[#ff3e00] focus:ring-1 focus:ring-[#ff3e00] focus:outline-none">
                                        <option value="">Unassigned</option>
                                        {#each allUsers as appUser}
                                            <option value={appUser.id}>{appUser.name} ({appUser.jobTitle})</option>
                                        {/each}
                                    </select>
                                </div>

                                <div>
                                    <label for="dueDate" class="mb-1 block text-sm font-semibold text-slate-700">Due Date</label>
                                    <input id="dueDate" name="dueDate" type="date" class="block w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm transition focus:border-[#ff3e00] focus:ring-1 focus:ring-[#ff3e00] focus:outline-none" />
                                </div>

                                <div class="mt-8 border-t border-slate-100 pt-5">
                                    <button type="submit" disabled={isSubmitting} class="flex w-full justify-center rounded-lg bg-[#ff3e00] px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#eb3900] disabled:opacity-70">
                                        {#if isSubmitting}
                                            Creating...
                                        {:else}
                                            Create Issue
                                        {/if}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    {/if}
</div>