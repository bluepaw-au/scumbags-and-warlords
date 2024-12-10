<script lang="ts">
	import { invalidate, goto } from '$app/navigation';
	import { onMount } from 'svelte';

	import Button from '$lib/components/ui/button/button.svelte';
	import '../app.css';

	let { data, children } = $props();
	let { session, supabase } = $derived(data);

	onMount(() => {
		const { data } = supabase.auth.onAuthStateChange((_, newSession) => {
			if (newSession?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});
		return () => data.subscription.unsubscribe();
	});
</script>

<div class="dark">
	<!-- Navbar -->
	<header class="fixed left-0 right-0 top-0 justify-between text-primary-foreground">
		<div class="mx-auto flex max-w-3xl flex-row items-center justify-between p-4">
			<!-- BRAND -->
			<a href="/" class="text-lg font-semibold text-foreground"> Scumbags </a>

			<div>
				<Button variant="secondary" onclick={() => goto('/login')}>Login</Button>
			</div>
		</div>
	</header>

	{@render children()}
</div>
