const players = ["player1", "player2", "dealer"]
let dealerHand = []
let playerOneHand = []
let playerTwoHand = []
let activePlayerHand =[]
let activePlayer = ''
let pCounter = 0
const playerCount = players.length
let activeHandValue = 0
let dealerHandValue = 0
let playerOneHandValue = 0
let playerTwoHandValue = 0
let turnCounter = 0
let playerOneResult =''
let playerTwoResult =''
let myDeck


// Class to create a deck
class Deck {
    constructor() {
      this.suits = ["Diamonds", "Spades", "Hearts", "Clubs"]
      this.faces = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "Jack", "Queen", "King", "Ace"]
      this.faces = {"2": "2", "3": "3", "4": "4", "5": "5", "6": "6", "7": "7", "8": "8", "9": "9", "10": "10", "Jack": "10", "Queen": "10", "King": "10", "Ace": "11"}
      this.deck = []
      for (const [face, value] of Object.entries(this.faces)) {
        this.suits.forEach(suit => {
          this.deck.push({card: `${face} of ${suit} value: ${("0" + value).slice(-2)}`})
        })
      }
    }
  }

// Starts game by showing a prompt and if 'y' is entered then it starts, if anything is entered it quits the game
function playGame(){
    let playAgain = window.prompt('Play BlackJack? Y/N')
    if(playAgain.toLowerCase() == 'y'){roundStart()}
    else{console.log('Quitting game...')}
}

// at the start of each round we create a new deck of 52 cards, then deal 1 card to the dealer and update the value of his hand, then run changePlayerTurn
function roundStart(){
    // Instantiate new deck
    myDeck = new Deck()

    // this will deal two cards to each player one by one, but currently it won't store hand values properly if you use this
    // for(let i=0; i<=playerCount*2; i++){
    //     draw()
    //     changePlayerTurn()
    // }

    activePlayerHand = dealerHand
    draw()
    dealerHandValue = valueOfPlayerHand(dealerHand)

    changePlayerTurn()
}

// Draws a card - should probably add an argument for number of cards to draw
function draw(){
    let randomCard = Math.floor(Math.random() * myDeck.deck.length)
    let drawnCard = myDeck.deck.splice(randomCard, 1)
    activePlayerHand.push(drawnCard)
}

// sets the current player to the player in the players array, then if the player name matches the case then it logs who's turn it is and sets their hand to the active hand
function changePlayerTurn(){
    activePlayer = players[pCounter]
    
    switch(activePlayer){
        case 'player1':
        console.log('Player1 turn');
        activePlayerHand = playerOneHand
        break

        case 'player2':
        console.log(`Player2 turn`);
        activePlayerHand = playerTwoHand
        break
        
        case 'dealer':
            console.log('Dealer turn');
            activePlayerHand = dealerHand
            break
        }
    
    // if it is not already the dealer turn then this will move to the next player in the array, and if it is the dealer turn then it ends the round
    if(pCounter <= 2){
        pCounter++
    }else{
        
        // use this if you want to deal 1 card at a time to each player at game start
        // turnCounter++
        // pCounter = 0
        
        // remove this if you use the code above and you will need a different way to check for end of round
        endRound()
    }

    // checks to see if it is a player turn or dealer turn, then starts that turn
    if(pCounter <= 2){
        playerTurn()
    }else{dealerTurn()}

}

// takes in a hand that contains cards and then gets the value of those cards
const valueOfPlayerHand = (playersHand) => {
    let total = 0
    let isAceInHandFlag = false
    playersHand.forEach( card => {
        for (const [key, value] of Object.entries(card[0])) {
        if (value.includes("Ace")) {
            isAceInHandFlag = true
        }
        total += parseInt(value.slice(-2))
        // checks for an ace and sets value to either 1 or 11 based on whether your hand value is more or less than 21 
        if (total > 21 && isAceInHandFlag) {
            total -= 10 // reduces from 11 to 1
            isAceInHandFlag = false
        } 
        }
    });
    return total
}


function playerTurn(){

    // if it is the first turn then the player will have no cards, so this will see if the hand is empty and if it is then it deals 2 cards
    if(activePlayerHand.length == 0){
        draw()
        draw()
    }

    // set the current player hand value to the value of the current player hand
    activeHandValue = valueOfPlayerHand(activePlayerHand)

    // updates each players hand value based on the cards they now have
    playerOneHandValue = valueOfPlayerHand(playerOneHand)
    playerTwoHandValue = valueOfPlayerHand(playerTwoHand)
    dealerHandValue = valueOfPlayerHand(dealerHand)

    console.log(`Dealer has :${dealerHandValue}`);
    
    console.log(`your hand value is: ${activeHandValue}`)

    // logic for hit and stay - it will stop running if you bust, otherwise it will do a prompt and ask what you want, then update your hand value with the new card
    if(activeHandValue < 21){
        let choice = window.prompt('H to hit, S to stay')
        if(choice.toLowerCase() === "h"){
            console.log("HIT!")
            draw()
            activeHandValue = valueOfPlayerHand(activePlayerHand)
            // console.log(`hand value is: ${activeHandValue}`);
            playerTurn()
        }else if(choice.toLowerCase() === "s"){
            console.log(`hand value is: ${activeHandValue}`);
            changePlayerTurn()
        }else{
            console.log('Wrong input');
            playerTurn()
        }
    }else if(activeHandValue == 21){
        console.log('21!');
        changePlayerTurn()
    }else{
        console.log('You Busted!');
        changePlayerTurn()
    }
}

// dealer logic - dealer will hit automatically as long as their handvalue is under 17, they will stay at 17. then it will update their hand value after each hit
function dealerTurn(){

    while(dealerHandValue < 17){
        console.log('Dealer hits!');
        draw()
        dealerHandValue = valueOfPlayerHand(activePlayerHand)
        console.log(`Dealer has ${dealerHandValue}`);
    }
    endRound()
}

// round is over, now check and see who wins and loses based on their hand values
function endRound(){
    if(playerOneHandValue > 21){
        playerOneResult = 'lose'
    }else if(dealerHandValue > 21 && playerOneHandValue <= 21){
        playerOneResult = 'win'
    }else if(playerOneHandValue > dealerHandValue && playerOneHandValue <= 21){
        playerOneResult = 'win'
    }else if(playerOneHandValue == dealerHandValue && playerOneHandValue <= 21){
        playerOneResult = 'tie'
    }else{
        playerOneResult = 'lose'
    }

    if(playerTwoHandValue > 21){
        playerTwoResult = 'lose'
    }else if(dealerHandValue > 21 && playerTwoHandValue <= 21){
        playerTwoResult = 'win'
    }else if(playerTwoHandValue > dealerHandValue && playerTwoHandValue <= 21){
        playerTwoResult = 'win'
    }else if(playerTwoHandValue == dealerHandValue && playerTwoHandValue <= 21){
        playerTwoResult = 'tie'
    }else{
        playerTwoResult = 'lose'
    }

    console.log(`player 1 had: ${playerOneHandValue}`);
    console.log(`player 2 had: ${playerTwoHandValue}`)
    console.log(`dealer had: ${dealerHandValue}`)
    console.log(`player one you ${playerOneResult}, player two you ${playerTwoResult}`)
    resetGame()
}

// when we start a new game, this will clear all hands and values then go start a new game
function resetGame(){
    dealerHand = []
    playerOneHand = []
    playerTwoHand = []
    activePlayerHand =[]
    activePlayer = ''
    pCounter = 0
    activeHandValue = 0
    dealerHandValue = 0
    playerOneHandValue = 0
    playerTwoHandValue = 0
    turnCounter = 0
    playerOneResult =''
    playerTwoResult =''

    playGame()
}

// starts the game and runs the loop through all the functions
playGame()  