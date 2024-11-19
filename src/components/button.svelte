<script lang="ts">
	import type { Snippet } from "svelte";


    interface Props {
        cls: string,
        children: Snippet,
        action: Function
    }

    let {children, action, cls = "" }: Props = $props();

    let buttonAction = () => {
        action();
    }

</script>

<button class="bg-white border-2 rounded-md text-slate-800 px-4 py-2" onclick={buttonAction}>{@render children()}</button>
