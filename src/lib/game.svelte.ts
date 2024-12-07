import type { Deck, PlayingCard } from "./deck.svelte";
import type { Player } from "./player.svelte";


export interface Trick{
    // TODO: SWAP FROM TRICK to SET
    // TODO: USE TRICK INSTEAD OF ROUND
    cards: Array<PlayingCard>;
}

export class Game {

    // Primary Game Data
    id: number = 0;
    players: Array<Player> = []
    deck: Deck;

    // Game State
    gameInProgress: boolean = $state(false);
    roundHistory: Array<any> = $state([]);
    finishedPlayers: Array<Player> = $derived( this.players.filter((p)=>p.isFinished) );
    warlord: Player | false = $state(false);
    scumbag: Player | false = $state(false);

    // Round State Mgmt
    lastRoundWinner: Player | false = $state(false);
    roundInProgress: boolean = $state(false);
    currentRoundTricks: Array<PlayingCard[]> = $state([]);

    constructor(players: Array<Player>, deck:Deck){
        this.players = players;
        this.deck = deck;
    }

    // LOBBY FUNCTIONS
    public addPlayer(player: Player){
        this.players.push(player);
    }

    public kickPlayer(player: Player){
        let playerIndex = this.players.map(e => e.id).indexOf(player.id)
        if (playerIndex !== -1){
            this.players.splice(playerIndex, 1);
        }
    }

    public startGame(startingPlayer: Player = this.players[0]){
        
        if(this.players.length < 2){
            console.error('Start Game Failed: Not Enough Players');
            // Cannot start - need at least 2 players
            return;
        }

        if(this.warlord && this.scumbag){
            // TODO: Card Swap Logic
        }

        this.players.forEach((p) => p.resetPlayerState().resetHand());

        this.deck.shuffle();
        this.dealAllCards();

        this.gameInProgress = true;
        this.startRound(startingPlayer);

    }

    public endGame(){

        this.players.forEach((p) => p.resetPlayerState().resetHand());

        this.gameInProgress = false;
        this.roundHistory = [];
        this.currentRoundTricks = [];
        this.roundInProgress = false;
        this.lastRoundWinner = false;

        this.deck.reset();
        this.deck.shuffle();
        this.players.forEach((player) => {
            player.resetHand();
        });
    }

    public dealAllCards(){
        this.deck.cards.forEach((card, i, deck) => {
            let dealt = 0;
            let deckLength = this.deck.cards.length;
            for (dealt = 0; dealt < deckLength;){
                this.players.forEach((player)=>{
                    this.deck.dealCard(player);
                    dealt++
                })
            }
        })
        this.players.forEach((player)=>{
            player.sortHand();
        });
    }

    /**
     * Starts a new round of play. 
     * @param startingPlayer The player who will start the round
     */
    startRound(startingPlayer: Player = this.players[0]){
        
        if (this.lastRoundWinner){
            this.roundHistory.push(this.currentRoundTricks);
        }
        this.currentRoundTricks = [];
        this.players.forEach((p) => p.resetPlayerState());
        this.onStartTurn(startingPlayer, false);
    }

    /**
     * Handles a player running out of cards
     * @param player The player that has run out of cards.
     */
    onPlayerFinished(player: Player){
        player.isRoundWinner = false;
        if(this.finishedPlayers.length == 1){
            this.onPlayerWinsGame(player);
        } 
        if (this.finishedPlayers.length == this.players.length-1){
            this.endGame();
        }
    }
    
    /**
     * Handles a player winning the round.
     * @param player The player that has won the round.
     */
    onPlayerWinsRound(player: Player){
        this.lastRoundWinner = player;
        player.isRoundWinner = true;
        this.roundInProgress = false;
    }

    /**
     * Handles a player winning the game.
     * @param player The player that has won the game.
     */
    onPlayerWinsGame(player: Player){
        // warlord locked in.
        this.warlord = player;
    }

    /**
     * Handles starting the players turn. 
     * @param player 
     * @param skipMe 
     */
    private onStartTurn(player: Player, skipped: Boolean){
        console.log($state.snapshot(player.name)+"'s Turn Start.");

        if(player.isFinished){
            this.onStartTurn(this.getNextPlayer(player), skipped)
        }

        if(skipped){
            this.skipPlayerTurn(player, true);
            return;
        }
        player.deselectAllCards();
        console.log($state.snapshot(player.selectedCards.cards.map(card=>card.getValue).join(', ')));

        player.isMyTurn = true;
        player.isSkipped = false;

        if(this.isPlayerLastUnskipped(player)){ 
            this.onPlayerWinsRound(player);
        }
    }

    /**
     * Handles ending a players turn.
     * @param player The player whose turn is ending.
     * @param skipNext True if the next players turn will be skipped.
     */
    private onEndTurn(player: Player, skipNext: Boolean){
        console.log($state.snapshot(player.name)+"'s Turn End.");

        if(player.isFinished){
            this.onPlayerFinished(player);
        }

        // Change to next players turn
        player.isMyTurn = false;

        player.deselectAllCards();
        this.onStartTurn(this.getNextPlayer(player), skipNext);
    }

    /**
     * Skips a players turn.
     * @param player The player to be skipped.
     * @param forced True if skipped by another players actions.
     */
    skipPlayerTurn(player: Player, forced: Boolean){

        console.debug((forced)? "[FORCED SKIP]" : "[PLAYER SKIPPED]", $state.snapshot(player.name) + "'s Turn Got Skipped");
        if(!player.isMyTurn && !forced){
            console.error("Not your turn, pls wait");
            return;
        }
        player.isSkipped = true;

        this.onEndTurn(player, false);
    }

    /**
     * 
     * @param player 
     * @param trick 
     * @returns 
     */
    playTrick(player:Player, trick:Trick){
        

        if(!player.isMyTurn){
            console.error("Not your turn, pls wait");
            return;
        }

        let trickValue = this.isTrickValid(trick);

        if(trickValue === 0){
            return;
        } else {
            this.roundInProgress = true;
            let playedCards: PlayingCard[] = [];
            trick.cards.forEach((card, i)=>{
                playedCards.push(player.playCard(card));
            });
            this.currentRoundTricks.unshift(playedCards);
            console.debug($state.snapshot(player.name) + " played cards:", $state.snapshot(this.currentRoundTricks[0][0].valueLabel + ' ('+ this.currentRoundTricks[0].length + ')') );


            if (trickValue == 1){
                // Standard Trick 
                this.onEndTurn(player, false);

            } else if (trickValue == 2){
                // Copycat Trick
                this.onEndTurn(player, true);

            } else if (trickValue == 3){
                // Trump Trick
                this.onPlayerWinsRound(player);                
            }
        }

    }

    // GETS AND CHECKS
    getHostPlayer() {
        let host = this.players.find((p)=> p.isHost);
        if (host != undefined){
            return host;
        } else {
            return this.players[0];
        }
    }

    getPlayer(player: Player) {
        let current = this.players.find((p)=> p = player);
        if (current != undefined){
            return current;
        } else {
            // Could not find player
            return false;
        }
    }

    getCurrentPlayer() {
        let current = this.players.find((p)=> p.isMyTurn);
        if (current != undefined){
            return current;
        } else {
            return this.getHostPlayer()
        }
    }

    getNextPlayer(currentPlayer: Player) {
        if (this.players.indexOf(currentPlayer) == this.players.length-1){
            return this.players[0];
        } else {
            return this.players[this.players.indexOf(currentPlayer) + 1];
        }
    }

    isPlayerLastUnfinished(player: Player){
        // Have all other players finished?
        if (this.players.filter((p)=> p.isFinished).length >= this.players.length - 1){
            return true;
        } else {
            return false;
        }
    }

    isPlayerLastUnskipped(player:Player){

        // Have all other players skipped or been skipped?
        if (this.players.filter((p)=> p.isSkipped).length >= this.players.filter(p=>!p.isFinished).length - 1){
            return true;
        } else {
            return false;
        }

    }

    isTrickValid(trick:Trick){
        
        console.groupCollapsed("IS TRICK VALID?: ", $state.snapshot(trick.cards));

        // Invalid Trick
        if (trick.cards == undefined || trick.cards.length < 1){
            console.groupEnd();
            console.error("[INVALID] ", "Trick undefined or empty");
            return 0;
        }
        console.debug("CONTINUE: ", "Trick is not empty.");

        // ------------------------------------------------------------
        // MANDATORY: All tricks must consist of cards with equal value
        // ------------------------------------------------------------

        let mismatches: PlayingCard[];
        mismatches = trick.cards.filter((card, i, cards) => card.value != cards[0].value);
        if (mismatches.length != 0){
            console.groupEnd();
            console.error("[INVALID] ", "Trick consists of more than one value. ", $state.snapshot(trick.cards.map((p)=>p.valueLabel).join(', ')));
            return 0;
        }
        console.debug("CONTINUE: ", "Trick conists of a single value: " + $state.snapshot(trick.cards[0].getValueLabel()));

        // -------------------- //
        // SPECIAL TRICK CHECKS //
        // -------------------- //

        // ----------------------------------------------- //
        // 1. TRUMP
        // Trick contains a joker - beats all other tricks
        // ----------------------------------------------- //
        if (trick.cards[0].valueLabel == "Joker"){
            console.groupEnd();
            console.log("%c[JOKER] Instawin. WOW! WOW! WOW!", "color: gold");
            return 3;
        }
        console.debug("CONTINUE: Trick is NOT a trump.");

        if (this.currentRoundTricks.length){

            if (this.currentRoundTricks[0].length == trick.cards.length){
                // -------------------------------------------- //
                // 2. COPYCAT
                // Trick is identical to current trick
                // -------------------------------------------- //
                mismatches = [];
                mismatches = trick.cards.filter((card, i) => card.value != this.currentRoundTricks[0][i].value);
                if (mismatches.length == 0){
                    console.groupEnd();
                    console.log("%c[COPYCAT] Skip the next players turn.", "color: orange");
                    return 2;
                }

                console.debug("CONTINUE: Trick is NOT a copycat.");
            }
        
            if (this.currentRoundTricks[0].length > 0){
                // --------------------- //
                // STANDARD TRICK CHECKS //
                // --------------------- //

                // -------------------------------------------------------
                // 1. HIGHER VALUE
                // Standard tricks must be a higher value than current trick
                // -------------------------------------------------------
                if (trick.cards[0].value <= this.currentRoundTricks[0][0].value) {
                    console.groupEnd();
                    console.error("[INVALID] Trick value is lower than current trick", $state.snapshot(trick.cards[0].value) + ' < ' + $state.snapshot(this.currentRoundTricks[0][0].value) );
                    return 0;
                }
                console.debug("CONTINUE: Trick value is higher than current trick.");

                // ----------------------------------------------------------------
                // 2. EQUAL OR HIGHER CARD COUNT
                // Standard tricks must have equal or greater number of cards than current trick
                // -----------------------------------------------------------------
                if (trick.cards.length < this.currentRoundTricks[0].length){
                    console.groupEnd();
                    console.error("[INVALID] Trick has less cards than current trick.");
                    return 0;
                }
            }

        } else {
            console.debug("CONTINUE: Trick is the first trick of round.");
        }
        console.groupEnd();

        console.log("%c[VALID] Trick is a valid standard trick.", "color: lightgreen");
        return 1;

    }


}