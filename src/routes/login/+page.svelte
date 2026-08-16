<!-- src/routes/login/+page.svelte -->
<script lang="ts">
	// State variables for enterprise login form
	let email = '';
	let password = '';
	let rememberMe = false;

	const handleLogin = () => {
		// Authentication logic will be added here later
		console.log('Enterprise Login attempt:', { email, password, rememberMe });
	};
</script>

<!-- Main Container: Full screen, Split layout for Large screens -->
<div class="flex min-h-screen bg-white font-sans">
	<!-- Left Side: Branding / Marketing (Visible only on Desktop) -->
	<!-- Using Svelte's official orange brand color: #ff3e00 -->
	<div
		class="relative hidden items-center justify-center overflow-hidden bg-[#ff3e00] lg:flex lg:w-1/2"
	>
		<!-- Abstract Background Gradient overlay -->
		<div class="absolute inset-0 bg-gradient-to-br from-[#ff3e00] to-[#c73100] opacity-95"></div>

		<!-- Branding Content -->
		<div class="relative z-10 max-w-xl p-12 text-white">
			<div class="mb-8 flex items-center space-x-3">
				<!-- A simple clean SVG Logo -->
				<svg
					class="h-10 w-10 text-white"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
					></path>
				</svg>
				<h1 class="text-3xl font-extrabold tracking-wider uppercase opacity-90">
					Tracker<span class="text-orange-200">Pro</span>
				</h1>
			</div>

			<h2 class="mb-6 text-5xl leading-tight font-bold tracking-tight">
				Manage your <br /> issues with clarity.
			</h2>
			<p class="mb-8 text-lg font-medium text-orange-100">
				The enterprise-grade issue tracking system designed for high-performing software engineering
				teams.
			</p>

			<!-- Feature highlights -->
			<div class="flex space-x-6 text-sm font-semibold text-orange-50">
				<div class="flex items-center">
					<span class="mr-2 h-2 w-2 rounded-full bg-white"></span> Fast
				</div>
				<div class="flex items-center">
					<span class="mr-2 h-2 w-2 rounded-full bg-white"></span> Secure
				</div>
				<div class="flex items-center">
					<span class="mr-2 h-2 w-2 rounded-full bg-white"></span> Reliable
				</div>
			</div>
		</div>
	</div>

	<!-- Right Side: Login Form -->
	<div
		class="relative flex w-full flex-col justify-center px-8 sm:px-16 lg:w-1/2 lg:px-24 xl:px-32"
	>
		<!-- Mobile Logo (Visible only on small screens) -->
		<div class="mb-10 flex items-center space-x-2 lg:hidden">
			<svg
				class="h-8 w-8 text-[#ff3e00]"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
				></path>
			</svg>
			<span class="text-2xl font-extrabold text-gray-900 uppercase"
				>Tracker<span class="text-[#ff3e00]">Pro</span></span
			>
		</div>

		<div class="mx-auto w-full max-w-md lg:mx-0">
			<h3 class="mb-2 text-3xl font-bold tracking-tight text-gray-900">Welcome back</h3>
			<p class="mb-10 text-sm font-medium text-gray-500">
				Please enter your details to access your dashboard.
			</p>

			<form class="space-y-6" on:submit|preventDefault={handleLogin}>
				<!-- Email Input -->
				<div>
					<label for="email" class="mb-2 block text-sm font-semibold text-gray-700"
						>Email Address</label
					>
					<div class="relative">
						<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
							<!-- Mail Icon -->
							<svg
								class="h-5 w-5 text-gray-400"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
								/>
							</svg>
						</div>
						<input
							id="email"
							type="email"
							bind:value={email}
							class="block w-full rounded-xl border border-gray-200 bg-gray-50 py-3.5 pr-4 pl-11 text-gray-900 transition-all duration-200 focus:border-transparent focus:bg-white focus:ring-2 focus:ring-[#ff3e00] focus:outline-none sm:text-sm"
							placeholder="name@company.com"
							required
						/>
					</div>
				</div>

				<!-- Password Input -->
				<div>
					<label for="password" class="mb-2 block text-sm font-semibold text-gray-700"
						>Password</label
					>
					<div class="relative">
						<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
							<!-- Lock Icon -->
							<svg
								class="h-5 w-5 text-gray-400"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
								/>
							</svg>
						</div>
						<input
							id="password"
							type="password"
							bind:value={password}
							class="block w-full rounded-xl border border-gray-200 bg-gray-50 py-3.5 pr-4 pl-11 text-gray-900 transition-all duration-200 focus:border-transparent focus:bg-white focus:ring-2 focus:ring-[#ff3e00] focus:outline-none sm:text-sm"
							placeholder="••••••••"
							required
						/>
					</div>
				</div>

				<!-- Extra Actions (Remember me & Forgot password) -->
				<div class="flex items-center justify-between">
					<div class="flex items-center">
						<input
							id="remember-me"
							name="remember-me"
							type="checkbox"
							bind:checked={rememberMe}
							class="h-4 w-4 cursor-pointer rounded border-gray-300 text-[#ff3e00] transition duration-150 focus:ring-[#ff3e00]"
						/>
						<label for="remember-me" class="ml-2 block cursor-pointer text-sm text-gray-700">
							Remember me
						</label>
					</div>

					<div class="text-sm">
						<a
							href="#"
							class="font-semibold text-[#ff3e00] transition duration-150 hover:text-[#cc3100]"
						>
							Forgot password?
						</a>
					</div>
				</div>

				<!-- Login Button -->
				<div>
					<button
						type="submit"
						class="flex w-full transform justify-center rounded-xl border border-transparent bg-[#ff3e00] px-4 py-3.5 text-sm font-bold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#eb3900] focus:ring-2 focus:ring-[#ff3e00] focus:ring-offset-2 focus:outline-none"
					>
						Sign in to Dashboard
					</button>
				</div>
			</form>

			<!-- Registration Link for user registration functionality -->
			<p class="mt-8 text-center text-sm font-medium text-gray-600">
				Don't have an enterprise account?
				<a
					href="/register"
					class="font-bold text-[#ff3e00] transition duration-150 hover:text-[#cc3100]"
				>
					Create an account
				</a>
			</p>
		</div>
	</div>
</div>
