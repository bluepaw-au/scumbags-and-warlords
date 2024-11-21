<script lang="ts">
	import Card from "../components/card.svelte";
	import Button from "../components/button.svelte";
    import { Deck } from "$lib/deck.svelte";
    import { Player } from "$lib/player.svelte";
	import { Game, type Trick } from "$lib/game.svelte";
	import PlayerHand from "../components/player-hand.svelte";

    let deck = new Deck();
    let showDeck = $state(false);

    let player = new Player(0, "Sam");
    let player2 = new Player(1, "Cat");
    let player3 = new Player(2, "Friend");
    let player4 = new Player(3, "Buddy");

    let currentPlayer = $state(player);

    let game = new Game([player, player2, player3, player4], deck);

    function handlePlayTrick(player:Player, trick: Trick){
        game.playTrick(player, trick);
    }
    function handleEndRound(){
        game.endRound();
    }
    function setCurrentPlayer(player:Player){
        currentPlayer = player;
    }

</script>

<div class="p-4 w-full bg-slate-800 h-20 flex flex-row align-middle items-center gap-4 z-50">
    <Button onAction={() => { game.endGame(); }}> End Game </Button>
    <Button onAction={() => { game.startGame();} }> Start Game </Button>
    <p class="text-white">Cards in Deck: {deck.cards.length}</p>

    <!-- TODO: Work out how to send selected cards to the playTrick function... -->
</div>

<!-- DECK CONTAINER -->
<div class={(showDeck ? '' : 'hidden') + " deck-container absolute bottom-0 left-0 right-0 top-20 overflow-y-auto bg-slate-800 bg-opacity-50 p-12 max-w-full"}>
    <div class="deck flex flex-row justify-center flex-wrap gap-4 max-w-6xl">
    {#each deck.cards as card, i}
        <Card selected cardIndex={i} {card} ></Card>
    {/each}
    </div>
</div>

<!-- PLAYER LIST -->
<div class="playerList bg-slate-700">
    <h3 class="font-semibold prose-lg min-w-60 text-white mb-2">Players</h3>
    <div class="players flex flex-col gap-3">
        {#each game.players as player, i}
            <button onclick={() => setCurrentPlayer(player)} class={"player flex flex-row justify-between px-4 py-2 text-white" + (currentPlayer == player ? ' bg-yellow-700' : ' bg-slate-600')} id={player.id.toString()}>
                <h5>{player.name}</h5>
                <h5>{player.hand.length}</h5>
            </button>
        {/each}
    </div>
</div>

<!-- TABLE -->
<div class="table-container flex-initial">
    <div class="game-table flex flex-col justify-center items-center gap-4 p-4 bg-green-800 min-w-[80%] min-h-96">

        <div class={"action-bar p-2 flex justify-center gap-2" + (game.latestTrick.cards.length == 0 ? " hidden" : "")}>
            <Button onAction={() => { handleEndRound() } }> End Round </Button>
        </div>

        <div class="table-card-container flex flex-row justify-center gap-2">
            {#each game.latestTrick.cards as card, i}
                <Card cardIndex={i} {card} selected={false}></Card>
            {/each}
        </div>
    </div>
</div>


<PlayerHand player={currentPlayer} playTrick={handlePlayTrick}></PlayerHand>

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