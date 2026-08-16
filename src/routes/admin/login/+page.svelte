<!-- src/routes/admin/login/+page.svelte -->
<script lang="ts">
    import { enhance } from '$app/forms';
    import { toast } from 'svelte-sonner';

    let email = $state('');
    let password = $state('');
    let isLoading = $state(false);
</script>

<!-- Completely isolated, dark and strict UI for Admins -->
<div class="flex min-h-screen flex-col items-center justify-center bg-slate-950 font-sans text-slate-300 relative overflow-hidden">
    
    <!-- Background subtle gradient -->
    <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 to-slate-950"></div>

    <div class="relative z-10 w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/80 p-10 shadow-2xl backdrop-blur-sm">
        
        <!-- Minimal Admin Branding -->
        <div class="mb-10 text-center">
            <svg class="mx-auto mb-4 h-12 w-12 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <h1 class="mb-2 text-2xl font-bold uppercase tracking-widest text-white">System Admin</h1>
            <div class="mx-auto h-1 w-12 rounded-full bg-red-600"></div>
        </div>

        <form 
            method="POST" 
            class="space-y-6"
            use:enhance={() => {
                isLoading = true;
                return async ({ result, update }) => {
                    isLoading = false;
                    if (result.type === 'success') {
                        toast.success((result.data as any)?.message || 'Admin Authenticated');
                    } else if (result.type === 'failure') {
                        toast.error((result.data as any)?.error || 'Access Denied');
                    }
                    update(); 
                };
            }}
        >
            <div>
                <label for="email" class="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400">Admin Email</label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    bind:value={email}
                    class="block w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white transition focus:border-red-600 focus:ring-1 focus:ring-red-600 focus:outline-none"
                    placeholder="admin@system.local"
                    required
                />
            </div>

            <div>
                <label for="password" class="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400">Passcode</label>
                <input
                    id="password"
                    name="password"
                    type="password"
                    bind:value={password}
                    class="block w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white transition focus:border-red-600 focus:ring-1 focus:ring-red-600 focus:outline-none"
                    placeholder="••••••••"
                    required
                />
            </div>

            <button
                type="submit"
                disabled={isLoading}
                class="mt-4 flex w-full transform justify-center rounded-lg bg-red-600 px-4 py-3 text-sm font-bold tracking-wide text-white transition-all hover:bg-red-700 focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-slate-900 focus:outline-none disabled:opacity-70"
            >
                {#if isLoading}
                    Verifying...
                {:else}
                    Authorize Access
                {/if}
            </button>
        </form>
    </div>
</div>