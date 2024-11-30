import type { PlayingCard } from "./deck.svelte";

export class Player {
    id: number = 0;
    name: string = 'Player';
    hand: Array<PlayingCard> = $state([]);
    selectedCards: Array<PlayingCard> = $state([]);
    host: boolean = false;
    skipped: boolean = false;

    constructor(id:number, name:string, host:boolean){
        this.id = id;
        this.name = name;
        this.host = host;
    }

    playCard(card: PlayingCard){
        let cardIndex = this.hand.findIndex((cardInHand)=> cardInHand.id == card.id);
        if (cardIndex != -1){
            this.hand.splice(cardIndex, 1);    
        }
        return card;
    }
    sortHand(){
        this.hand.sort((a, b) => a.value - b.value);
    }
    resetHand(){
        this.hand = [];
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