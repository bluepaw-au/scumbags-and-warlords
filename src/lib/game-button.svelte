<script lang="ts">
	import type { Snippet } from "svelte";

    interface Props {
        children: Snippet,
        onAction: Function,
        classes?: string,
        variant?: string,
        disabled?: boolean,
        visible?: boolean }

    let {
        children,
        onAction,
        variant = "",
        classes = "",
        disabled = false,
        visible = true }: Props = $props();

    variant = 'king'; // 'king', 'lord', 'peasant', 'scum', 'table'
    
    let buttonAction = () => {
        onAction();
    }

</script>

{#if variant == 'king'}
    <button class:hidden={!visible} class="group transition-colors border-4 p-1 border-yellow-500/25 enabled:hover:border-yellow-500 rounded-lg disabled:opacity-50" onclick={buttonAction} {disabled}>
        <div class="transition-colors btn-inner rounded py-3 px-4 bg-yellow-500 group-enabled:group-hover:bg-yellow-400">
            <span class="transition-colors text-xl text-yellow-950 group-enabled:group-hover:text-yellow-800 font-serif font-bold">
                {@render children()}
            </span>
        </div>
    </button>
{/if}


<style>

</style>