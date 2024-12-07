<script lang="ts">
	import type { PlayingCard } from "$lib/deck.svelte";
    import { Game, type Trick } from "$lib/game.svelte";
	import type { Player } from "$lib/player.svelte";

	import Button from "$lib//button.svelte";
	import Card from "$lib//card.svelte";

    // ♠♥♦♣♤♡♢♧
    interface Props {
        player: Player,
        playTrick: any,
        skipTurn: any,
        roundInProgress: boolean
    }
    let { player, playTrick, skipTurn, roundInProgress }: Props = $props();

    function tryTrick(player: Player, trick:Trick){
        playTrick(player, trick);
        clearSelection();
    }

    function handleSelect(card: PlayingCard){
        player.selectCard(card);
    }

    function clearSelection(){
        player.deselectAllCards();
    }

    let cardStyle = $state((i:number) => {
        let totalCardGap = (player.hand.length - 1) * 8;
        let totalCardWidth = player.hand.length * 180 + totalCardGap;
        let diff = totalCardWidth - document.body.scrollWidth;
        if (i+1 < player.hand.length ){
            if (diff > 0){
                return "width: "+ (100 / player.hand.length - 1) +"%";
            } else {
                return "width: 180px";
            }
        } else {
            return "width: 180px";
        }
    });
    

</script>

<div class="hand-container fixed bottom-0 left-0 right-0 h-auto flex flex-col justify-end flex-1">
    
    <div class:hidden={player.hand.length == 0 || player.isMyTurn == false || player.isRoundWinner} class="action-bar p-4 flex justify-center gap-2">
        <Button onAction={() => { tryTrick(player, player.selectedCards) } } disabled={player.selectedCards.cards.length < 1 || !player.isMyTurn}> Play Trick </Button>
        <Button onAction={() => { skipTurn(player) } } disabled={!player.isMyTurn || !roundInProgress}> Skip Turn </Button>
    </div>

    <div class="scroll-container w-full flex-1 pt-20 pb-8 px-8 h-auto">
        <div class="hand flex flex-row gap-2 justify-center">
            {#each player.hand as card, i}
                <Card style={cardStyle(i)} cardIndex={i} {card} onSelect={handleSelect} selected={player.selectedCards.cards.includes(card)}></Card>
            {/each}
        </div>
    </div>
</div>

