<script lang="ts">
	import Card from "../components/card.svelte";
	import Button from "../components/button.svelte";
    import { Deck } from "$lib/deck.svelte";
    import { Player } from "$lib/player.svelte";
	import { Game } from "$lib/game.svelte";

    let deck = new Deck();
    let showDeck = $state(false);

    let player = new Player(0, "Sam");
    let player2 = new Player(1, "Cat");
    let player3 = new Player(2, "Friend");
    let player4 = new Player(3, "Buddy");

    let game = new Game([player, player2, player3, player4], deck);

</script>

<div class="p-4 absolute w-full bg-slate-800 h-20 flex flex-row align-middle items-center gap-4 z-50">
    <Button cls="" action={() => showDeck = showDeck ? false : true}> {showDeck ? "Hide" : "Show"} Deck </Button>
    <Button cls="" action={() => deck.dealHand(player, 8)}> Draw Hand </Button>
    <Button cls="" action={() => { game.endGame(); }}> End Game </Button>
    <Button cls="" action={() => { game.startGame();} }> Start Game </Button>
    <p class="text-white">Cards in Deck: {deck.cards.length}</p>

    <!-- TODO: Work out how to send selected cards to the playTrick function... -->
    <Button cls="" action={() => { game.playTrick(player, player.hand.selected);} }> Play Trick </Button>
</div>

<div class={(showDeck ? '' : 'hidden') + " deck-container absolute bottom-0 left-0 right-0 top-20 overflow-y-auto bg-slate-800 bg-opacity-50 p-12 max-w-full"}>
    <div class="deck flex flex-row justify-center flex-wrap gap-4 max-w-6xl">
    {#each deck.cards as card, i}
        <Card cardIndex={i} {card} selectable={false} isSelected></Card>
    {/each}
    </div>
</div>

<div class="playerList bg-slate-700">
    <h3 class="font-semibold prose-lg min-w-60 text-white mb-2">Players</h3>
    <div class="players flex flex-col gap-3">
        {#each game.players as player, i}
            <div class="player bg-slate-600 flex flex-row justify-between px-4 py-2 text-white" id={player.id.toString()}>
                <h5>{player.name}</h5>
                <h5>{player.hand.length}</h5>
            </div>
        {/each}
    </div>
</div>

<div class="hand-container fixed bottom-0 w-full h-1/2 overflow-x-scroll">
    <div class="hand flex flex-row gap-2 p-8 absolute bottom-0 w-full text-center">
        {#each player.hand as card, i}
            <Card cardIndex={i} {card} selectable={true}></Card>
        {/each}

    </div>
</div>

<style>
    .playerList{
        position: absolute;
        right: 0;
        top: 5rem;
        padding: 1rem;
    }
    .hand-container{
        max-width: 100%;
        z-index: 0;
    }
    .hand{
        max-width: 100%;
    }

</style>