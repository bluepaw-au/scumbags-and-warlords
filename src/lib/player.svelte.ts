import type { PlayingCard } from "./deck.svelte";

export class Player {
    id: number = 0;
    name: string = 'Player';
    hand: Array<PlayingCard> = $state([]);

    constructor(id:number, name:string){
        this.id = id;
        this.name = name;
    }
    playCard(card: PlayingCard){
        let cardIndex = this.hand.findIndex((playerCard)=> playerCard.id == card.id);
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