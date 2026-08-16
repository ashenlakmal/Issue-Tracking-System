<script lang="ts">
    import '../app.css';
    import { Toaster } from 'svelte-sonner';
    let { children } = $props();
</script>

<Toaster position="top-right" toastOptions={{ style: 'background: #020617; border: 1px solid #ff3e00; color: #f1f5f9;' }} />

{@render children()}