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
let playerOneChipCount = 100
let playerTwoChipCount = 100
let playerOneBet = 0
let playerTwoBet = 0
let activePlayerChipCount
let activePlayerBet


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
    else{window.alert('Quitting game...')}
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

// sets the current player to the player in the players array, then if the player name matches the case then it alerts who's turn it is and sets their hand to the active hand
function changePlayerTurn(){
    activePlayer = players[pCounter]
    activePlayerBet = 0
    
    switch(activePlayer){
        case 'player1':
            window.alert("Player 1 Turn")
            activePlayerHand = playerOneHand
            activePlayerChipCount = playerOneChipCount
            break

        case 'player2':
            window.alert("Player 2 Turn")
            activePlayerHand = playerTwoHand
            activePlayerChipCount = playerTwoChipCount
            break
        
        case 'dealer':
            window.alert('Dealer turn');
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
    // Check to see if the active player has any chips left, if not it will skip their turn
    if(activePlayerChipCount > 0){
        // if player hasn't bet yet then go to betting phase
        if(activePlayerBet <= 0){
            bettingPhase()
        }

        // if it is the first turn then the player will have no cards, so this will see if the hand is empty and if it is then it deals 2 cards
        if(activePlayerHand.length == 0){
            draw()
            draw()
            // set the current player hand value to the value of the current player hand
            activeHandValue = valueOfPlayerHand(activePlayerHand)
            bettingPhase()
        }

        // updates each players hand value based on the cards they now have
        playerOneHandValue = valueOfPlayerHand(playerOneHand)
        playerTwoHandValue = valueOfPlayerHand(playerTwoHand)
        dealerHandValue = valueOfPlayerHand(dealerHand)

        // logic for hit and stay - it will stop running if you bust, otherwise it will do a prompt and ask what you want, then update your hand value with the new card
        if(activeHandValue < 21){
            let choice = window.prompt(`Dealer has: ${dealerHandValue}, your hand value is: ${activeHandValue}... press H to hit, S to stay`)
            if(choice.toLowerCase() === "h"){
                draw()
                activeHandValue = valueOfPlayerHand(activePlayerHand)
                // console.log(`hand value is: ${activeHandValue}`);
                playerTurn()
            }else if(choice.toLowerCase() === "s"){
                changePlayerTurn()
            }else{
                window.alert('Wrong input');
                playerTurn()
            }
        }else if(activeHandValue == 21){
            window.alert('21!');
            changePlayerTurn()
        }else{
            window.alert('You Busted!');
            changePlayerTurn()
        }
    }else{
        playerOutOfMoney()
    }
}

function bettingPhase(){
    if(activeHandValue > 0){
        activePlayerBet = parseInt(window.prompt(`Dealer has: ${dealerHandValue}, you have ${activeHandValue}. Your current chip count is ${activePlayerChipCount}, enter your bet amount ($5 minimum): `))
    }else{
        activePlayerBet = parseInt(window.prompt(`Your current chip count is ${activePlayerChipCount}, enter your bet amount ($5 minimum): `))
    }

    if(activePlayerBet <= activePlayerChipCount && activePlayerBet >= 5){
        activePlayerChipCount -= activePlayerBet
        switch(activePlayer){
            case 'player1':
                playerOneBet = activePlayerBet
                playerOneChipCount = activePlayerChipCount
                break
            case 'player2':
                playerTwoBet = activePlayerBet
                playerTwoChipCount = activePlayerChipCount
                break
            case 'dealer':
                break
        }
    }else if(activePlayerBet < 5){
        window.alert('minimum bet must be at least $5')
        bettingPhase()
    }
    
    playerTurn()
}



// dealer logic - dealer will hit automatically as long as their handvalue is under 17, they will stay at 17. then it will update their hand value after each hit
function dealerTurn(){
    draw()
    dealerHandValue = valueOfPlayerHand(activePlayerHand)
    window.alert(`Dealer has ${dealerHandValue}`)

    if(dealerHandValue < 17){
        while(dealerHandValue < 17){
            window.alert('Dealer hits!');
            draw()
            dealerHandValue = valueOfPlayerHand(activePlayerHand)
            window.alert(`Dealer has ${dealerHandValue}`);
        }
    }
    
    if(dealerHandValue >= 17 && dealerHandValue <= 21){
        window.alert('Dealer will stay')
    }else if(dealerHandValue > 21){
        window.alert('Dealer Busted')
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

    window.alert(`Player 1 had: ${playerOneHandValue}, player 2 had: ${playerTwoHandValue}, dealer had: ${dealerHandValue}... player 1 you ${playerOneResult}, player 2 you ${playerTwoResult}`)

    if(playerOneResult == 'win'){
        playerOneChipCount += playerOneBet * 2
    }else if (playerOneResult == 'tie'){
        playerOneChipCount += playerOneBet
    }

    if(playerTwoResult == 'win'){
        playerTwoChipCount += playerTwoBet * 2
    }else if (playerTwoResult == 'tie'){
        playerTwoChipCount += playerTwoBet
    }

    window.alert(`player 1 you now have ${playerOneChipCount}, player 2 you have ${playerTwoChipCount}`)

    // This was to start the trivia round, disregard if you just want blackjack
    // if(playerOneResult == 'win' && playerTwoResult == 'win'){
        // startTrivia()
    // }else{
        resetGame()
    // }
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

function playerOutOfMoney(){
    if(playerOneChipCount <= 0){
        window.alert('Player 1 is out of money')
    }else if(playerTwoChipCount <= 0){
        window.alert('Player 2 is out of money')
    }

    let startOver = window.prompt('reset chip counts and start new game? Y/N:')
    if(startOver.toLowerCase() == 'y'){
        playerOneChipCount = 100
        playerTwoChipCount = 100

        resetGame()
    }else{
        window.alert('Quitting game...')
    }
}

// Christmas Trivia Game
let answer = ''
let questions = ['1','2','3','4','5','6','7','8','9','10', '11', '12', '13', '14', '15']
let correctQuestions = []
let qString = ''
let wrongAnswers = 0

function startTrivia(){
    pickRandomQuestion(questions)
}

function pickRandomQuestion(arr){
    let randomNum = Math.floor(Math.random() * arr.length)
    console.log(`questions array: ${questions}`);
    qString = questions[randomNum]
    console.log(`questionNum = ${qString}`);
    askQuestion(qString)
}

function removeCorrect(questionNum){
    questionNum = questions.indexOf(questionNum)
    let correctQuestion = questions.splice(questionNum, 1)
    correctQuestions.push(correctQuestion)
    pickRandomQuestion(questions)
}

function askQuestion(questionNum){
    console.log(`questions array: ${questions}`);
    switch(questionNum){
        case '1':
            answer = window.prompt('Where was Jesus born?')
            if(answer.toLowerCase() == 'bethlehem'){
                window.alert('Correct!')
                removeCorrect(questionNum)
            }else{
                window.alert('Nope!')
                wrongAnswers +=1
            }
            break
        case '2':
            answer = window.prompt('What did Jesus and his disciples eat at the last supper?')
            if(answer.toLowerCase() == 'bread'){
                window.alert('Correct!')
                removeCorrect(questionNum)
            }else{
                window.alert('Nope!')
                wrongAnswers +=1
            }
            break
        case '3':
        answer = window.prompt('How old was Jesus when he was baptized?')
            if(answer == '30'){
                window.alert('Correct!')
                removeCorrect(questionNum)
            }else{
                window.alert('Nope!')
                wrongAnswers +=1
            }
            break
        case '4':
            answer = window.prompt('What does the word Noel mean in Latin?')
            if(answer.toLowerCase() == 'birth'){
                window.alert('Correct!')
                removeCorrect(questionNum)
            }else{
                window.alert('Nope!')
                wrongAnswers +=1
            }
            break
        case '5':
            answer = window.prompt('Who did the German Nazi Regime replace Santa Claus with?')
            if(answer.toLowerCase() == 'odin'){
                window.alert('Correct!')
                removeCorrect(questionNum)
            }else{
                window.alert('Nope!')
                wrongAnswers +=1
            }
            break
        case '6':
            answer = window.prompt('What year did NORAD start tracking Santa on Christmas Eve?')
            if(answer.toLowerCase() == '1955'){
                window.alert('Correct!')
                removeCorrect(questionNum)
            }else{
                window.alert('Nope!')
                wrongAnswers +=1
            }
            break
        case '7':
            answer = window.prompt('What is given on the 11th day of Christmas?')
            if(answer.toLowerCase() == '11 pipers piping'){
                window.alert('Correct!')
                removeCorrect(questionNum)
            }else{
                window.alert('Nope!')
                wrongAnswers +=1
            }
            break
        case '8':
            answer = window.prompt('In what country did the custom of putting up a christmas tree originate?')
            if(answer.toLowerCase() == 'germany'){
                window.alert('Correct!')
                removeCorrect(questionNum)
            }else{
                window.alert('Nope!')
                wrongAnswers +=1
            }
            break
        case '9':
            answer = window.prompt('What was the first year that the Rockelfeller Christmas tree was put up?')
            if(answer.toLowerCase() == '1933'){
                window.alert('Correct!')
                removeCorrect(questionNum)
            }else{
                window.alert('Nope!')
                wrongAnswers +=1
            }
            break
        case '10':
            answer = window.prompt('What state holds the world record for largest snowman?')
            if(answer.toLowerCase() == 'maine'){
                window.alert('Correct!')
                removeCorrect(questionNum)
            }else{
                window.alert('Nope!')
                wrongAnswers +=1
            }
            break
            case '11':
            answer = window.prompt('How many elves are on the christmas tree?')
            if(answer.toLowerCase() == '3'){
                window.alert('Correct!')
                removeCorrect(questionNum)
            }else{
                window.alert('Nope!')
                wrongAnswers +=1
            }
            break
            case '12':
            answer = window.prompt('Where is jinglebell today?')
            if(answer.toLowerCase() == 'train'){
                window.alert('Correct!')
                removeCorrect(questionNum)
            }else{
                window.alert('Nope!')
                wrongAnswers +=1
            }
            break
            case '13':
            answer = window.prompt('Finish the quote: "Every time a bell rings..."')
            if(answer.toLowerCase() == "an angel gets it's wings"){
                window.alert('Correct!')
                removeCorrect(questionNum)
            }else{
                window.alert('Nope!')
                wrongAnswers +=1
            }
            break
            case '14':
            answer = window.prompt("Finish the quote: Why don't you just say it? I'm the worst toy maker in the world. I'm a..." )
            if(answer.toLowerCase() == 'cotton headed ninny muggins'){
                window.alert('Correct!')
                removeCorrect(questionNum)
            }else{
                window.alert('Nope!')
                wrongAnswers +=1
            }
            break
            case '15':
            answer = window.prompt('Finish the quote: "Look, if it bothers you, you can dye it, and you..."')
            if(answer.toLowerCase() == 'should diet'){
                window.alert('Correct!')
                removeCorrect(questionNum)
            }else{
                window.alert('Nope!')
                wrongAnswers +=1
            }
            break
    }

    console.log(questions);

    if(questions.length != 0){
        pickRandomQuestion(questions)
    }else{
        window.alert(`Finally! You had ${wrongAnswers} wrong answers...`)
        startMap()
    }
}

function startMap(){
    window.alert('Congratulations, you have reached the final test')
    window.alert('Your ornaments have been hidden and the only clue we have is on the next page... But be careful, because once you close the next window, you cannot get it back unless you complete the whole test again')
    window.alert(`Magical Infants Chased Random Orphans While America Vanished Everyday`)
}

// starts the game and runs the loop through all the functions
playGame()
// startTrivia()  
// startMap()
