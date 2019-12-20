// let deck = [
//     {suit:"d", face:"2"},
//     {suit:"d", face:"3"},
//     {suit:"d", face:"4"},
//     {suit:"d", face:"5"},
//     {suit:"d", face:"6"},
//     {suit:"d", face:"7"},
//     {suit:"d", face:"8"},
//     {suit:"d", face:"9"},
//     {suit:"d", face:"10"},
//     {suit:"d", face:"j"},
//     {suit:"d", face:"q"},
//     {suit:"d", face:"k"},
//     {suit:"d", face:"a"},
//     {suit:"s", face:"2"},
//     {suit:"s", face:"3"},
//     {suit:"s", face:"4"},
//     {suit:"s", face:"5"},
//     {suit:"s", face:"6"},
//     {suit:"s", face:"7"},
//     {suit:"s", face:"8"},
//     {suit:"s", face:"9"},
//     {suit:"s", face:"10"},
//     {suit:"s", face:"j"},
//     {suit:"s", face:"q"},
//     {suit:"s", face:"k"},
//     {suit:"s", face:"a"},
//     {suit:"c", face:"2"},
//     {suit:"c", face:"3"},
//     {suit:"c", face:"4"},
//     {suit:"c", face:"5"},
//     {suit:"c", face:"6"},
//     {suit:"c", face:"7"},
//     {suit:"c", face:"8"},
//     {suit:"c", face:"9"},
//     {suit:"c", face:"10"},
//     {suit:"c", face:"j"},
//     {suit:"c", face:"q"},
//     {suit:"c", face:"k"},
//     {suit:"c", face:"a"},
//     {suit:"h", face:"2"},
//     {suit:"h", face:"3"},
//     {suit:"h", face:"4"},
//     {suit:"h", face:"5"},
//     {suit:"h", face:"6"},
//     {suit:"h", face:"7"},
//     {suit:"h", face:"8"},
//     {suit:"h", face:"9"},
//     {suit:"h", face:"10"},
//     {suit:"h", face:"j"},
//     {suit:"h", face:"q"},
//     {suit:"h", face:"k"},
//     {suit:"h", face:"a"},
// ]

class Deck {
    constructor() {
      this.suits = ["Diamonds", "Spades", "Hearts", "Clubs"]
      this.faces = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "Jack", "Queen", "King", "Ace"]
      this.faces = {"2": "2", "3": "3", "4": "4", "5": "5", "6": "6", "7": "7", "8": "8", "9": "9", "10": "10", "Jack": "10", "Queen": "10", "King": "10", "Ace": "11"}
      this.deck = []
      // this.faces.forEach(face => {
      for (const [face, value] of Object.entries(this.faces)) {
        this.suits.forEach(suit => {
          this.deck.push({card: `${face} of ${suit} value: ${("0" + value).slice(-2)}`})
        })
      }
      // console.log({card:`${this.deck.length} ${this.deck}`})
      // console.log(this.deck)
    }
  }

const myDeck = new Deck()

let dealerHand = []
let playerOneHand = []
let playerTwoHand = []
let activePlayerHand =[]
const players = ["player1", "player2", "dealer"]
let activePlayer = ''
let pCounter = 0
const playerCount = players.length
let activeHandValue = 0
let dealerHandValue = 0
let result = ''


function changePlayerTurn(){
    if(players[pCounter] != 'dealer'){
        activePlayer = players[pCounter]

        switch(activePlayer){
            case 'player1':
                activePlayerHand = playerOneHand
                break
            case 'player2':
                activePlayerHand = playerTwoHand
                break
            case 'dealer':
                activePlayerHand = dealerHand
                break
        }
    }else{
        dealerHandValue = activeHandValue
        endRound()
    }
    
}

function draw(){
    randomCard = Math.floor(Math.random() * myDeck.deck.length)
    drawnCard = myDeck.deck.splice(randomCard, 1)
    activePlayerHand.push(drawnCard)
}

function roundStart(){
    for(i=0; i<=playerCount*2; i++){
        draw()
        changePlayerTurn()
        if(pCounter < 2){
            pCounter++
        }else{
            pCounter = 0
        }
    }
    // playerTurn()
}

const valueOfPlayerHand = (playersHand) => {
    let total = 0
    let isAceInHandFlag = false
    playersHand.forEach( card => {
      for (const [key, value] of Object.entries(card[0])) {
        if (value.includes("Ace")) {
          isAceInHandFlag = true
        }
        total += parseInt(value.slice(-2))
        if (total > 21 && isAceInHandFlag) {
          total -= 10 // reduces from 11 to 1
          isAceInHandFlag = false
        } 
      }
    });
    return total
  }


function playerTurn(){
    activeHandValue = valueOfPlayerHand(activePlayerHand)
    // let choice = prompt('H to hit, S to stay')
    // if(choice.toLowerCase === "h"){
    //     draw()
    //     playerTurn()
    // }else if(choice.toLowerCase === "s"){
    //     changePlayerTurn()
    // }else{
    //     playerTurn()
    // }

    while(activePlayerHandValue < 21){
        draw()
        console.log(activeHandValue);
        console.log(activePlayerHand);
    }
}

function endRound(){
    if(activeHandValue > 21){
        result = 'win'
    }else if(dealerHandValue > 21){
        result = 'lose'
    }else if(activeHandValue > dealerHandValue){
        result = 'win'
    }else{
        result = 'lose'
    }
}




roundStart()
console.log(playerOneHand);
console.log(playerTwoHand);
console.log(dealerHand);