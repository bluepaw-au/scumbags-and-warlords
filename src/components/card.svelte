<script lang="ts">
	import type { PlayingCard } from "$lib/deck.svelte";
	import type { MouseEventHandler } from "svelte/elements";

    // ♠♥♦♣♤♡♢♧
    interface Props {
        cardIndex: number,
        card: PlayingCard,
        selected: boolean,
        onSelect?: any,
        style?: string,
    }
    let { 
        cardIndex, 
        card,
        selected,
        onSelect,
        style
    }: Props = $props();

    function selectCard(){
        onSelect(card);
    }

</script>
<div class="card-container" {style}>
    <button class:selected class={card.getSuit() + (onSelect ? " selectable hover:bg-amber-100 hover:shadow-lg hover:border-amber-400 hover:shadow-amber-500" : "") + " card border-slate-300 border-2  bg-slate-50 rounded-lg mx-0"} onclick={selectCard} tabindex="{cardIndex}">

        <div class="face p-3 flex flex-col">

            <div class="badge-top flex-1 text-left">
                <h4 class="badge-value text-3xl font-bold leading-none">{(card.getValueLabel())}</h4>
                <div class="badge-suit text-2xl font-bold">{card.getSuitLabel()}</div>
            </div>

            <div class="badge-center text-6xl font-bold text-center">
                {card.getSuitLabel()}
            </div>

            <div class="badge-bottom flex-1 text-left rotate-180">
                <h4 class="badge-value text-3xl font-bold leading-none">{card.getValueLabel()}</h4>
                <div class="badge-suit text-2xl font-bold">{card.getSuitLabel()}</div>
            </div>

        </div>

        <div class="back p-4">

        </div>
    </button>
</div>

<style>
    .card{
        aspect-ratio: 2.5/3.5 auto;
        height: 250px;
        width: 180px;
        user-select: none;
        transition: transform 35ms cubic-bezier(0.165, 0.84, 0.44, 1);
        position: relative;
        cursor: default; 
    }
    .heart, .diamond{
        color: red
    }
    .card.selectable.selected, .card.selectable.selected:hover{
        transform: translateY(-30%);
    }
    .card.selectable:hover{
        background-color: rgb(254 243 199 / var(--tw-bg-opacity));
        transform: translateY(-5%);
        cursor: pointer;
    }
    .face,
    .back{
        position: absolute;
        top:0;
        left:0;
        right:0;
        bottom:0;
    }
</style>