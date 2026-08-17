<!-- src/routes/dashboard/+page.svelte -->
<script lang="ts">
    import { enhance } from '$app/forms';
    import { toast } from 'svelte-sonner';

    // Receive data from the server load function (Svelte 5 syntax)
    let { data } = $props();
    let user = data.user;
    let stats = data.stats;

    // Generate initials for the user avatar (e.g., John Doe -> JD)
    let initials = user.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase();
</script>

<div class="flex h-screen overflow-hidden bg-slate-50 font-sans text-slate-900">
    
    <!-- Left Sidebar (Enterprise Navigation) -->
    <aside class="flex w-64 flex-col bg-slate-950 text-slate-300 transition-all duration-300">
        <!-- Brand Area -->
        <div class="z-20 flex h-16 items-center border-b border-slate-800 bg-slate-950 px-6">
            <svg class="mr-2 h-8 w-8 text-[#ff3e00]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
            <span class="text-xl font-extrabold uppercase tracking-wide text-white">Tracker<span class="text-[#ff3e00]">Pro</span></span>
        </div>

        <!-- Navigation Links -->
        <nav class="flex-1 space-y-1 overflow-y-auto px-3 py-6">
            <!-- Active Navigation Link -->
            <a href="/dashboard" class="group flex items-center rounded-lg bg-[#ff3e00]/10 px-3 py-2.5 font-semibold text-[#ff3e00] transition-all">
                <svg class="mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                Dashboard
            </a>
            
            <!-- Inactive Navigation Link (To be built next) -->
            <a href="/dashboard/issues" class="flex items-center rounded-lg px-3 py-2.5 font-medium text-slate-400 transition-all hover:bg-slate-900 hover:text-white">
                <svg class="mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
                All Issues
            </a>
        </nav>

        <!-- Sidebar Footer for Authentication Actions -->
        <div class="border-t border-slate-800 p-4">
            <!-- Secure Logout Form -->
            <form action="/logout" method="POST" use:enhance>
                <button type="submit" class="flex w-full items-center rounded-lg px-3 py-2 font-medium text-slate-400 transition-all hover:bg-slate-900 hover:text-red-400">
                    <svg class="mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                    Sign Out
                </button>
            </form>
        </div>
    </aside>

    <!-- Main Content Layout -->
    <main class="flex h-screen flex-1 flex-col overflow-hidden bg-slate-50">
        
        <!-- Top Application Header -->
        <header class="z-10 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-8">
            <h1 class="text-xl font-bold text-slate-800">Overview</h1>
            
            <!-- User Profile Details -->
            <div class="flex items-center space-x-4">
                <div class="hidden text-right sm:block">
                    <p class="text-sm font-bold text-slate-900">{user.name}</p>
                    <p class="text-xs font-medium text-slate-500">{user.jobTitle} at {user.company}</p>
                </div>
                <div class="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-gradient-to-tr from-[#ff3e00] to-orange-400 font-bold text-white shadow-md">
                    {initials}
                </div>
            </div>
        </header>

        <!-- Scrollable Dashboard Content -->
        <div class="flex-1 overflow-y-auto p-8">
            
            <!-- Welcome Header and Action Area -->
            <div class="mb-8 flex flex-col justify-between sm:flex-row sm:items-center">
                <div>
                    <h2 class="text-2xl font-bold text-slate-900">Welcome back, {user.name.split(' ')[0]}!</h2>
                    <p class="mt-1 text-slate-500">Here is what's happening with your projects today.</p>
                </div>
                
                <!-- Primary Action Button (To be wired in the next step) -->
                <button class="mt-4 flex transform items-center rounded-xl bg-[#ff3e00] px-5 py-2.5 font-bold text-white shadow-sm shadow-[#ff3e00]/20 transition-all hover:-translate-y-0.5 hover:bg-[#eb3900] sm:mt-0">
                    <svg class="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
                    Create New Issue
                </button>
            </div>

            <!-- Key Metrics and Statistics Grid -->
            <div class="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <!-- Total Issues Metric -->
                <div class="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                    <div class="flex items-center justify-between">
                        <p class="text-sm font-semibold tracking-wider text-slate-500 uppercase">Total Issues</p>
                        <div class="rounded-lg bg-slate-50 p-2 text-slate-400">
                            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
                        </div>
                    </div>
                    <p class="mt-4 text-3xl font-extrabold text-slate-900">{stats.total}</p>
                </div>

                <!-- Open Issues Metric -->
                <div class="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                    <div class="flex items-center justify-between">
                        <p class="text-sm font-semibold tracking-wider text-slate-500 uppercase">Open</p>
                        <div class="rounded-lg bg-red-50 p-2 text-red-500">
                            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                        </div>
                    </div>
                    <p class="mt-4 text-3xl font-extrabold text-slate-900">{stats.open}</p>
                </div>

                <!-- In Progress Metric -->
                <div class="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                    <div class="flex items-center justify-between">
                        <p class="text-sm font-semibold tracking-wider text-slate-500 uppercase">In Progress</p>
                        <div class="rounded-lg bg-blue-50 p-2 text-blue-500">
                            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        </div>
                    </div>
                    <p class="mt-4 text-3xl font-extrabold text-slate-900">{stats.inProgress}</p>
                </div>

                <!-- Resolved Metric -->
                <div class="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                    <div class="flex items-center justify-between">
                        <p class="text-sm font-semibold tracking-wider text-slate-500 uppercase">Resolved</p>
                        <div class="rounded-lg bg-green-50 p-2 text-green-500">
                            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                    </div>
                    <p class="mt-4 text-3xl font-extrabold text-slate-900">{stats.resolved}</p>
                </div>
            </div>

            <!-- Empty State Display (Rendered when there are no issues in the database) -->
            <div class="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center">
                <div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-50">
                    <svg class="h-8 w-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
                </div>
                <h3 class="text-lg font-bold text-slate-900">No issues found</h3>
                <p class="mx-auto mt-1 max-w-sm text-slate-500">Get started by creating a new issue to track bugs, tasks, or improvements.</p>
            </div>

        </div>
    </main>
</div>