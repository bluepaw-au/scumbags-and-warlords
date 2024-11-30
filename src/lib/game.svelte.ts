import type { Deck, PlayingCard } from "./deck.svelte";
import type { Player } from "./player.svelte";

export interface Trick{
    cards: Array<PlayingCard>;
}

export class Game {

    // Game Data
    id: number = 0;
    players: Array<Player> = []
    deck: Deck;

    // Game State
    gameWinner: Player | false = $state(false);
    gameInProgress: boolean = $state(false);
    roundHistory: Array<any> = $state([]);

    // Round State
    roundWinner: Player | false = $state(false);
    roundInProgress: boolean = $state(false);
    currentRoundTricks: Array<Trick> = $state([]);
    latestTrick: Trick = $state({cards:[]});
    currentTurnPlayer: Player = $state(this.players[0]);

    constructor(players: Array<Player>, deck:Deck){
        this.players = players;
        this.deck = deck;
    }

    addPlayer(player: Player){
        this.players.push(player);
    }

    kickPlayer(player: Player){
        let playerIndex = this.players.map(e => e.id).indexOf(player.id)
        if (playerIndex  !== -1){
            this.players.splice(playerIndex, 1);
        }
    }

    startGame(){
        this.gameInProgress = true;
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
        this.currentTurnPlayer = this.players[0];
    }

    declareGameWinner(player: Player = this.currentTurnPlayer){
        this.gameWinner = player;
        this.gameInProgress = false;
    }

    endGame(){
        this.gameInProgress = false;
        this.deck.reset();
        this.deck.shuffle();
        this.latestTrick.cards = [];
        this.players.forEach((player) => {
            player.resetHand();
        });
    }

    startNextRound(){

        if (this.roundWinner){
            this.currentTurnPlayer = this.roundWinner;
            this.roundHistory.push(this.currentRoundTricks);
            this.roundWinner = false;
        } else {
            this.currentTurnPlayer = this.players[0];
        }

        this.latestTrick.cards = [];
        this.currentRoundTricks = [];
        this.players.forEach((player) => player.skipped = false);
        
    }

    declareRoundWinner(player: Player = this.currentTurnPlayer){
        this.roundWinner = player;
        this.roundInProgress = false;
    }

    nextPlayerTurn() {

        let nextPlayer:Player;

        if (this.players.indexOf(this.currentTurnPlayer) == this.players.length-1){
            nextPlayer = this.players[0];
        } else {
            nextPlayer = this.players[this.players.indexOf(this.currentTurnPlayer) + 1];
        }

        // END CURRENT PLAYER TURN
        this.currentTurnPlayer = nextPlayer;

        // START NEXT PLAYER TURN
        if (this.players.filter((p)=> p.skipped).length >= this.players.length - 1){
            this.declareRoundWinner(this.currentTurnPlayer);
        }
        
    }

    skipPlayerTurn(player: Player){

        if(player != this.currentTurnPlayer){
            console.error("Not your turn, pls wait");
            return;
        }

        this.players[this.players.indexOf(player)].skipped = true;

        this.nextPlayerTurn();
    }


    playTrick(player:Player, trick:Trick){
        
        if(player != this.currentTurnPlayer){
            console.error("Not your turn, pls wait");
            return;
        }

        if(this.isTrickValid(trick)){
            console.groupEnd();
            this.currentRoundTricks.push(this.latestTrick);
            this.latestTrick.cards = [];
            trick.cards.forEach((card)=>{
                this.latestTrick.cards.push(player.playCard(card));
            })
            console.log("Cards Played: ", this.latestTrick.cards);
            this.nextPlayerTurn();
        }

    }

    isTrickValid(trick:Trick){
        
        console.group("IS TRICK VALID?: ", trick);

        // Invalid Trick
        if (trick.cards == undefined || trick.cards.length < 1){
            console.error("INVALID: ", "Trick undefined or empty");
            return false;
        }
        console.debug("CONTINUE: ", "Trick is not empty.");


        // ------------------------------------------------------------
        // MANDATORY: All tricks must consist of cards with equal value
        // ------------------------------------------------------------

        let mismatches: PlayingCard[];
        mismatches = trick.cards.filter((card, i, cards) => card.value != cards[0].value);
        if (mismatches.length != 0){
            console.error("INVALID: ", "Trick consists of more than one value.");
            return false;
        }
        console.debug("CONTINUE: ", "Trick conists of a single value.");

        // -------------------- //
        // SPECIAL TRICK CHECKS //
        // -------------------- //

        // ----------------------------------------------- //
        // 1. TRUMP
        // Trick contains a joker - beats all other tricks
        // ----------------------------------------------- //
        if (trick.cards[0].valueLabel == "Joker"){
            console.log("VALID: ", "Trick is a Joker! WOW! WOW! WOW!");
            return true;
        }
        console.debug("CONTINUE: ", "Trick is NOT a trump.");


        if (this.latestTrick.cards.length == trick.cards.length){
            // -------------------------------------------- //
            // 2. COPYCAT
            // Trick is identical to current trick
            // -------------------------------------------- //
            mismatches = trick.cards.filter((card, i) => card.value != this.latestTrick.cards[i].value);
            if (mismatches.length == 0){
                console.log("VALID: ", "Trick is identical to last trick. Skip the next players turn.");
                return true;
            }
            console.debug("CONTINUE: ", "Trick is NOT a copycat.");
        }
        
        if (this.latestTrick.cards.length > 0){
            // --------------------- //
            // STANDARD TRICK CHECKS //
            // --------------------- //

            // -------------------------------------------------------
            // 1. HIGHER VALUE
            // Standard tricks must be a higher value than current trick
            // -------------------------------------------------------
            if (trick.cards[0].value <= this.latestTrick.cards[0].value) {
                console.error("INVALID: ", "Trick value is lower than current trick");
                return false;
            }
            console.debug("CONTINUE: ", "Trick value is higher than current trick.");

            // ----------------------------------------------------------------
            // 2. EQUAL OR HIGHER CARD COUNT
            // Standard tricks must have equal or greater number of cards than current trick
            // -----------------------------------------------------------------
            if (trick.cards.length < this.latestTrick.cards.length){
                console.error("INVALID: ", "Trick has less cards than current trick.");
                return false;
            }

        } else {
            console.debug("CONTINUE: ", "Trick is the first trick of round.");
        }

        console.log("VALID: ", "Trick is a valid standard trick.");
        return true;

    }


}