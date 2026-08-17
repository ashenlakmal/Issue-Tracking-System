<script lang="ts">
    import { enhance } from '$app/forms';
    import { toast } from 'svelte-sonner';

    let name = $state('');
    let email = $state('');
    let company = $state('');
    let jobTitle = $state('');
    let password = $state('');
    let confirmPassword = $state('');
    let isLoading = $state(false);
</script>

<div class="flex min-h-screen bg-white font-sans">
    
    <div class="relative hidden items-center justify-center overflow-hidden bg-slate-950 lg:flex lg:w-1/2">
        <div class="absolute inset-0 opacity-20" style="background-image: radial-gradient(#ff3e00 1px, transparent 1px); background-size: 32px 32px;"></div>
        
        <div class="absolute top-1/4 left-1/4 h-96 w-96 animate-pulse rounded-full bg-[#ff3e00] opacity-20 mix-blend-screen blur-[128px] filter"></div>
        <div class="absolute right-1/4 bottom-1/4 h-96 w-96 rounded-full bg-orange-500 opacity-10 mix-blend-screen blur-[128px] filter"></div>

        <div class="relative z-10 max-w-xl p-12 text-white">
            <div class="mb-8 flex items-center space-x-3">
                <svg style="width: 2.5rem; height: 2.5rem;" class="text-[#ff3e00]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path>
                </svg>
                <h1 class="text-3xl font-extrabold tracking-wider text-slate-100 uppercase">
                    Tracker<span class="text-[#ff3e00]">Pro</span>
                </h1>
            </div>

            <h2 class="mb-6 text-5xl leading-tight font-bold tracking-tight text-slate-100">
                Join the <span class="bg-gradient-to-r from-[#ff3e00] to-orange-400 bg-clip-text text-transparent">elite.</span>
            </h2>
            <p class="mb-8 text-lg leading-relaxed font-medium text-slate-400">
                Create your enterprise account to start tracking, managing, and resolving issues with absolute clarity and precision.
            </p>

            <div class="flex space-x-6 text-sm font-semibold text-slate-300">
                <div class="flex items-center">
                    <span class="mr-2 h-2 w-2 rounded-full bg-[#ff3e00] shadow-[0_0_8px_#ff3e00]"></span> Collaborate
                </div>
                <div class="flex items-center">
                    <span class="mr-2 h-2 w-2 rounded-full bg-[#ff3e00] shadow-[0_0_8px_#ff3e00]"></span> Track
                </div>
                <div class="flex items-center">
                    <span class="mr-2 h-2 w-2 rounded-full bg-[#ff3e00] shadow-[0_0_8px_#ff3e00]"></span> Resolve
                </div>
            </div>
        </div>
    </div>

    <div class="relative flex w-full flex-col justify-center bg-white px-8 sm:px-16 lg:w-1/2 lg:px-24 xl:px-32">
        <div class="mx-auto w-full max-w-lg lg:mx-0 py-12">
            <h3 class="mb-2 text-3xl font-bold tracking-tight text-gray-900">Create an account</h3>
            <p class="mb-10 text-sm font-medium text-gray-500">Please fill in your professional details to continue.</p>

            <form 
                method="POST" 
                class="space-y-5"
                use:enhance={() => {
                    if (password !== confirmPassword) {
                        toast.error('Passwords do not match!');
                        return ({ update }) => update();
                    }
                    
                    isLoading = true;
                    return async ({ result, update }) => {
                        isLoading = false;
                        if (result.type === 'success') {
                            toast.success((result.data as any)?.message || 'Registration Successful!');
                            setTimeout(() => {
                                window.location.href = '/login';
                            }, 1500);
                        } else if (result.type === 'failure') {
                            toast.error((result.data as any)?.error || 'Registration failed.');
                        }
                        update(); 
                    };
                }}
            >
                <div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div>
                        <label for="name" class="mb-2 block text-sm font-semibold text-gray-700">Full Name</label>
                        <input id="name" name="name" type="text" bind:value={name} class="block w-full rounded-xl border border-gray-200 bg-gray-50 py-3 px-4 text-gray-900 transition-all focus:border-transparent focus:bg-white focus:ring-2 focus:ring-[#ff3e00] focus:outline-none sm:text-sm" placeholder="John Doe" required />
                    </div>
                    <div>
                        <label for="email" class="mb-2 block text-sm font-semibold text-gray-700">Email Address</label>
                        <input id="email" name="email" type="email" bind:value={email} class="block w-full rounded-xl border border-gray-200 bg-gray-50 py-3 px-4 text-gray-900 transition-all focus:border-transparent focus:bg-white focus:ring-2 focus:ring-[#ff3e00] focus:outline-none sm:text-sm" placeholder="name@company.com" required />
                    </div>
                </div>

                <div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div>
                        <label for="company" class="mb-2 block text-sm font-semibold text-gray-700">Company</label>
                        <input id="company" name="company" type="text" bind:value={company} class="block w-full rounded-xl border border-gray-200 bg-gray-50 py-3 px-4 text-gray-900 transition-all focus:border-transparent focus:bg-white focus:ring-2 focus:ring-[#ff3e00] focus:outline-none sm:text-sm" placeholder="Acme Corp" required />
                    </div>
                    <div>
                        <label for="jobTitle" class="mb-2 block text-sm font-semibold text-gray-700">Job Title</label>
                        <input id="jobTitle" name="jobTitle" type="text" bind:value={jobTitle} class="block w-full rounded-xl border border-gray-200 bg-gray-50 py-3 px-4 text-gray-900 transition-all focus:border-transparent focus:bg-white focus:ring-2 focus:ring-[#ff3e00] focus:outline-none sm:text-sm" placeholder="Software Engineer" required />
                    </div>
                </div>

                <div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div>
                        <label for="password" class="mb-2 block text-sm font-semibold text-gray-700">Password</label>
                        <input id="password" name="password" type="password" bind:value={password} class="block w-full rounded-xl border border-gray-200 bg-gray-50 py-3 px-4 text-gray-900 transition-all focus:border-transparent focus:bg-white focus:ring-2 focus:ring-[#ff3e00] focus:outline-none sm:text-sm" placeholder="Minimum 6 characters" minlength="6" required />
                    </div>
                    <div>
                        <label for="confirmPassword" class="mb-2 block text-sm font-semibold text-gray-700">Confirm Password</label>
                        <input id="confirmPassword" name="confirmPassword" type="password" bind:value={confirmPassword} class="block w-full rounded-xl border border-gray-200 bg-gray-50 py-3 px-4 text-gray-900 transition-all focus:border-transparent focus:bg-white focus:ring-2 focus:ring-[#ff3e00] focus:outline-none sm:text-sm" placeholder="Confirm password" required />
                    </div>
                </div>

                <button type="submit" disabled={isLoading} class="mt-4 flex w-full transform justify-center rounded-xl border border-transparent bg-[#ff3e00] px-4 py-3.5 text-sm font-bold text-white shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#eb3900] focus:ring-2 focus:ring-[#ff3e00] focus:ring-offset-2 focus:outline-none disabled:opacity-70 disabled:cursor-not-allowed">
                    {#if isLoading}
                        Creating Account...
                    {:else}
                        Create Account
                    {/if}
                </button>
            </form>

            <p class="mt-8 text-center text-sm font-medium text-gray-600">
                Already have an account?
                <a href="/login" class="font-bold text-[#ff3e00] transition duration-150 hover:text-[#cc3100]">Sign in here</a>
            </p>
        </div>
    </div>
</div>