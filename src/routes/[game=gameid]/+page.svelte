<script lang="ts">
	import Card from "$lib/card.svelte";
	import Button from "$lib/button.svelte";
    import { Deck } from "$lib/deck.svelte";
    import { Player } from "$lib/player.svelte";
	import { Game, type Trick } from "$lib/game.svelte";
	import PlayerHand from "./player-hand.svelte";

    let deck = new Deck();
    let showDeck = $state(false);

    let player = new Player(0, "Sam", true);
    let player2 = new Player(1, "Cat", false);
    let player3 = new Player(2, "Friend", false);
    let player4 = new Player(3, "Buddy", false);

    

    let game = new Game([player, player2, player3, player4], deck);

    function handlePlayTrick(player:Player, trick: Trick){
        game.playTrick(player, trick);
    }

    function handleSkipTurn(player:Player){
        game.skipPlayerTurn(player);
    }

    function handlenextRound(){
        game.startNextRound();
    }


    // Which player's hand the UI is showing - Not for turn management
    let playingAs = $state(player);

    function switchToPlayer(player:Player){
        playingAs = player;
    }

</script>


<!-- CARD-VIEW -->
<div class={(showDeck ? '' : 'hidden') + " deck-container absolute bottom-0 left-0 right-0 top-20 overflow-y-auto bg-slate-800 bg-opacity-50 p-12 max-w-full"}>
    <div class="deck flex flex-row justify-center flex-wrap gap-4 max-w-6xl">
    {#each deck.cards as card, i}
        <Card selected cardIndex={i} {card} ></Card>
    {/each}
    </div>
</div>


<!-- TABLE -->
<div class="table-container flex-initial absolute left-96 right-96 bottom-0 top-[15vh]">
    <div class="game-table flex flex-col items-center gap-4 p-4 bg-felt-800 h-full rounded-t-3xl">

        {#if game.roundWinner == playingAs}
            <div class="action-bar p-2 flex flex-col text-center justify-center gap-2">
                <h3 class="text-xl text-white">You win the Hand</h3>
                <Button onAction={() => { handlenextRound() } }>  Start the Next Round </Button>
            </div>
        {/if}

        <div class="table-card-container flex flex-row justify-center gap-2">
            {#each game.latestTrick.cards as card, i}
                <Card cardIndex={i} {card} selected={false}></Card>
            {/each}
        </div>
    </div>
</div>

<!-- GAME CONTROLS -->
<div class:hidden={!playingAs.host} class="game-control bg-gray-950/25 rounded-lg right-8 top-[4vh] absolute p-4">
    <h3 class="font-sans font-bold text-lg min-w-60 text-gray-300 mb-2">Host Controls</h3>
    <div class="controls flex flex-col gap-3 min-w-60">
        <Button onAction={() => { game.startGame();} } disabled={game.gameInProgress}> Start Game </Button>
        <Button onAction={() => { game.endGame(); }} disabled={!game.gameInProgress}> End Game </Button>
    </div>
    <p class="font-sans font-normal text-md min-w-60 text-gray-300 mt-2">Cards in Deck: {deck.cards.length}</p>

    <!-- TODO: Work out how to send selected cards to the playTrick function... -->
</div>

<!-- PLAYER LIST -->
<div class="player-list bg-gray-950/25 rounded-lg left-8 top-[4vh] absolute p-4">
    <h3 class="font-sans prose-lg min-w-60 text-white mb-2">Players</h3>

    <div class="players flex flex-col gap-3 font-serif">
        {#each game.players as player, i}
            <button onclick={() => switchToPlayer(player)} class="group relative flex flex-row rounded justify-between px-4 py-2 {(playingAs == player ? 'is-active bg-sun-500' : 'bg-felt-800/25 hover:bg-felt-500/25')}" id={player.id.toString()}>
                
                <span class="text-lg text-gray-300 group-hover:text-white group-[.is-active]:text-sun-950">{#if player.host}<span class="mr-2">👑</span>{/if}{player.name}</span>
                <span class="text-lg text-gray-300 group-hover:text-white group-[.is-active]:text-sun-950">{player.hand.length}</span>

                {#if player == game.currentTurnPlayer}<span class="absolute w-full translate-x-full text-white text-left text-lg"> MY TURN </span>{/if}
                {#if player != game.currentTurnPlayer && player.skipped}<span class="absolute w-full translate-x-full text-white text-left text-lg"> SKIPPED </span>{/if}
            </button>
        {/each}
    </div>
</div>


<PlayerHand player={playingAs} myTurn={playingAs == game.currentTurnPlayer} playTrick={handlePlayTrick} skipTurn={handleSkipTurn}></PlayerHand>
