import type { Player } from "./player.svelte";

type Suit = "heart" | "diamond" | "spade" | "club";
type SuitLabel = "♥" | "♦" | "♠" | "♣";

const validValueLabels = ["3","4","5","6","7","8","9","10","J","Q","K","A","2","Joker"] as const;


export interface PlayingCard {
    id: number;
    value: number;
    suit: Suit;
}

export class PlayingCard {
    id: number;
    value: number = -1;
    valueLabel: string;
    suit: Suit;
    suitLabel: string;
    faceUp: boolean = false;

    constructor(id:number, value:number, suit:Suit){
        this.id = id;
        this.value = value;
        this.suit = suit;

        this.valueLabel = this.getValueLabel();
        this.suitLabel = this.getSuitLabel();
    }
    getValue(){
        return this.value
    }
    getSuit(){
        return this.suit;
    }

    getValueLabel () {
        if (this.value >= 3 && this.value <= 10) return this.value.toString();
        else if (this.value == 11) return "J";
        else if (this.value == 12) return "Q";
        else if (this.value == 13) return "K";
        else if (this.value == 14) return "A";
        else if (this.value == 15) return "2";
        else if (this.value == 16) return "Joker";
        return "3"
    }

    getSuitLabel (){
        if (this.suit == "heart"){
            return "♥";
        } else if (this.suit == "diamond"){
            return "♦";
        } else if (this.suit == "spade"){
            return "♠";
        } else if (this.suit == "club"){
            return "♣";
        } else {
            return "●"
        }
    }
}

export class Deck {
    cards: Array<PlayingCard> = $state([]);
    constructor(){
        this.reset();
    }
    reset() {
        this.cards = [];

        let i: number;
        let count = 0;
        for (i = 3; i < 17; i++ ) {
            this.cards.push(new PlayingCard(count, i, "heart"));
            this.cards.push(new PlayingCard(count+14, i, "diamond"));
            this.cards.push(new PlayingCard(count+28, i, "spade"));
            this.cards.push(new PlayingCard(count+42, i, "club"));
            count++;
        }
        this.cards.sort((a, b) => a.id - b.id);
        this.cards.reverse()
        console.log(this.cards);
    }
    shuffle(){
        let array = this.cards;
        // Fisher-Yates (Knuth) Shuffle
        for (let i = array.length - 1; i >= 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
    dealCard(player:Player){
        if (this.cards.length > 0) {
            const nextCard = this.cards.splice(0, 1);
            player.hand.push(nextCard[0]);
        }
    }
    dealHand(player:Player, number:number){
        let numToDraw:number = number;
        if (this.cards.length > 0 && this.cards.length < numToDraw){
            numToDraw = this.cards.length;
        } else if (this.cards.length > 0){
            const nextCards = this.cards.splice(0, numToDraw);
            if(nextCards.length > 0){
                player.hand.push(...nextCards);
            }
        }
    }
}

