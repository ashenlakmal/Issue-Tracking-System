<!-- src/routes/login/+page.svelte -->
<script lang="ts">
	// State variables to store user input
	let email = '';
	let password = '';

	// Function to handle the login form submission
	const handleLogin = () => {
		// We will connect this to our backend/Prisma later
		console.log('Login attempt with:', email);
	};
</script>

<!-- Main container: Full screen height, centered content, light gray background -->
<div class="flex min-h-screen flex-col justify-center bg-gray-50 py-12 font-sans sm:px-6 lg:px-8">
	<!-- Header Section -->
	<div class="sm:mx-auto sm:w-full sm:max-w-md">
		<h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">Welcome Back</h2>
		<p class="mt-2 text-center text-sm text-gray-600">Sign in to access your Issue Tracker</p>
	</div>

	<!-- Login Card Section -->
	<div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
		<div class="border border-gray-100 bg-white px-4 py-8 shadow-xl sm:rounded-2xl sm:px-10">
			<!-- Login Form -->
			<form class="space-y-6" on:submit|preventDefault={handleLogin}>
				<!-- Email Input Field -->
				<div>
					<label for="email" class="block text-sm font-medium text-gray-700"> Email address </label>
					<div class="mt-1">
						<input
							id="email"
							name="email"
							type="email"
							autocomplete="email"
							required
							bind:value={email}
							class="block w-full appearance-none rounded-lg border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm transition duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none sm:text-sm"
							placeholder="you@example.com"
						/>
					</div>
				</div>

				<!-- Password Input Field -->
				<div>
					<label for="password" class="block text-sm font-medium text-gray-700"> Password </label>
					<div class="mt-1">
						<input
							id="password"
							name="password"
							type="password"
							autocomplete="current-password"
							required
							bind:value={password}
							class="block w-full appearance-none rounded-lg border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm transition duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none sm:text-sm"
							placeholder="••••••••"
						/>
					</div>
				</div>

				<!-- Submit Button -->
				<div>
					<button
						type="submit"
						class="flex w-full justify-center rounded-lg border border-transparent bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition duration-200 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
					>
						Sign in
					</button>
				</div>
			</form>

			<!-- Registration Link -->
			<div class="mt-6 text-center">
				<p class="text-sm text-gray-600">
					Don't have an account?
					<!-- We will create the /register route next -->
					<a
						href="/register"
						class="font-medium text-blue-600 transition duration-150 hover:text-blue-500"
					>
						Sign up here
					</a>
				</p>
			</div>
		</div>
	</div>
</div>
