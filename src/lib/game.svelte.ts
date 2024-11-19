import type { Deck, PlayingCard } from "./deck.svelte";
import type { Player } from "./player.svelte";

export interface Trick{
    cards: Array<PlayingCard>;
}

export class Game {
    id: number = 0;
    players: Array<Player> = []
    deck: Deck;
    inProgress: boolean = false;

    latestTrick: Trick = {cards:[]};
    round: Array<Trick> = [];

    constructor(players: Array<Player>, deck:Deck){
        this.players = players;
        this.deck = deck;
    }

    playTrick(player:Player, trick:Trick){
        if(this.isTrickValid(trick)){
            this.latestTrick.cards = [];
            trick.cards.forEach((card)=>{
                this.latestTrick.cards.push(player.playCard(card));
            })
        }
    }

    isTrickValid(trick:Trick){
        
        // Invalid Trick
        if (trick.cards == undefined || trick.cards.length < 1){
            return false;
        }

        // -------------------------------------------------------
        // Trick must be a joker
        if (trick.cards[0].getValueLabel() == "Joker"){
            return true;
        }
        
        // -------------------------------------------------------
        // OR Trick must be identical to current trick
        let isIdentical = true;
        this.latestTrick.cards.forEach((card, i)=>{
            if (trick.cards[i].getValue() != card.getValue()){
                isIdentical = false;
            }
        });
        if (isIdentical){ 
            return true;
        }

        // -------------------------------------------------------
        // OR Trick must only consist of cards with the same value
        trick.cards.forEach((card)=>{
            if (card.getValue() != trick.cards[0].getValue()){
                return false;
            }
        });

        // +++
        // AND Trick must be higher than current trick
        let isHigherValue = false;
        if(this.latestTrick.cards[0].getValue() == undefined){
            isHigherValue = true;
        } else if (trick.cards[0].getValue() > this.latestTrick.cards[0].getValue()) {
            isHigherValue = true;
        }
        if (!isHigherValue){ return false; }

        // +++
        // AND Trick must have equal or greater number of cards than current
        let isEqualOrMoreCards = false;
        if (trick.cards.length >= this.latestTrick.cards.length){
            isEqualOrMoreCards = true;
        }
        return isEqualOrMoreCards;
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

    endGame(){
        this.inProgress = false;
        this.deck.reset();
        this.deck.shuffle();
        this.players.forEach((player) => {
            player.resetHand();
        })
    }

    startGame(){
        this.inProgress = true;
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
        })
    }
}