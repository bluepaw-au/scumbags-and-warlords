<script lang="ts">
	import type { Snippet } from "svelte";


    interface Props {
        children: Snippet,
        classes?: string,
        onAction: Function,
        disabled?: boolean,
        visible?: boolean,
    }

    let {children, onAction, classes, disabled = false, visible = true }: Props = $props();

    let buttonAction = () => {
        onAction();
    }

</script>

<button class:hidden={!visible} class={(classes ? " " + classes : "")} onclick={buttonAction} {disabled}>{@render children()}</button>

<style>
    button{
        background-color: #ffffff;
        border-radius: 0.25rem;
        padding: 0.5rem 1rem;
    }

    button.hidden{
        opacity: 0;
    }

    button:disabled{
        opacity: 0.5;
        pointer-events: none;
    }
</style>