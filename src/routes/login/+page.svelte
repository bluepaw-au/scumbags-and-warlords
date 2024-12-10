<script lang="ts">
    import type { PageData } from './$types';
    import { Auth  } from '@supabase/auth-ui-svelte';
    import { ThemeSupa } from '@supabase/auth-ui-shared';
	import { SupabaseClient } from '@supabase/supabase-js';
    let { data }: { data: PageData } = $props();

    let {supabase, session} = $state(data);

</script>

<div class="w-full min-h-screen bg-background text-foreground flex flex-col justify-center">
    <div class="container mx-auto text-center">
        
        <div class="flex flex-col max-w-96">
            <p>Create an account or login.</p>

            <Auth supabaseClient={supabase} theme="dark" appearance={{theme: ThemeSupa}} />

        </div>

    </div>
</div>