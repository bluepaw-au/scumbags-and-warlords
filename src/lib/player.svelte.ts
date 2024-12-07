import type { PlayingCard } from "./deck.svelte";
import type { Trick } from "./game.svelte";



/**
 * Creates a new player to let them join a 'game', draw cards and play them.
 * @class Player
 */
export class Player {
    id: number = 0;
    name: string = 'Player';

    hand: Array<PlayingCard> = $state([]);
    selectedCards: Trick = $state({cards:[]});

    isHost: boolean = false;
    
    isRoundWinner: boolean = $state(false);
    isMyTurn: boolean = $state(false);
    isSkipped: boolean = $state(false);

    isFinished: boolean = $derived( this.hand.length === 0 );

    constructor(id:number, name:string, isHost:boolean){
        this.id = id;
        this.name = name;
        this.hand = [];
        this.selectedCards = {cards:[]};
        this.isHost = isHost;

        this.isRoundWinner = false;
        this.isMyTurn = false;
        this.isSkipped = false;
    }

    resetPlayerState(){
        this.isRoundWinner = false;
        this.isMyTurn = false;
        this.isSkipped = false;
        return this;
    }

    skipTurn(forced: Boolean){
        if(!forced && this.isMyTurn == false){
            console.error("Not your turn, can't skip");
            return;
        } else {
            this.isSkipped = true;
            this.isMyTurn = false;
        }
    }


    selectCard(card: PlayingCard){ 
        if(this.selectedCards.cards.includes(card)){
            this.selectedCards.cards.splice(this.selectedCards.cards.indexOf(card), 1);
        } else {
            this.selectedCards.cards.push(card);
        }
    }
    deselectAllCards(){ 
        this.selectedCards.cards = [];
    }
    
    /**
     * Removes a card from the players hand and returns it.
     * @param card The card to be played.
     * @returns The card that was played.
     */
    playCard(card: PlayingCard){
        this.hand.splice(this.hand.indexOf(card), 1);
        return card;
    }

    hasCard(card: PlayingCard){
        if(this.hand.includes(card)){
            return true;
        } else {
            return false;
        }
    }


    sortHand(){
        this.hand.sort((a, b) => a.value - b.value);
    }

    resetHand(){
        this.hand = [];
        return this;
    }

    getID(){
        return this.id;
    }

    getName(){
        return this.name;
    }

    getHand(){
        return this.hand;
    }
}