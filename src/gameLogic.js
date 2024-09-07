
let gameTimeRemaining = 0;
let defaultGameDuration = 120;
let gameCountdownInterval = null;
let startGameButton = document.getElementById("startGameButton");
let stopGameButton = document.getElementById("stopGameButton");
let gameUpdateInterval = null;
let currentGameScore = 0;
let highestGameScore = 0;
let scoreDisplayText = document.getElementById("currentGameScore");
let highScoreDisplayText = document.getElementById("highScoreDisplay");
let timerDisplayText = document.getElementById("currentTimeRemaining");
let gameRunningInfoContainer = document.getElementById("gameRunningInfo");
let gamePlayContainer = document.getElementById("gamePlayArea");
let spawnableAreas = document.getElementsByClassName("whackamoleSpawnArea");
let spawningInterval = null;

// because of function hoisting, we can call these functions before they are declared.
// THese are called as soon as the page loads
toggleGameControlButtons();
toggleGamePlayContent();
updateHighScore();
Array.from(spawnableAreas).forEach(area => {
    area.addEventListener("click", (event) => {
        whackamoleHandleClick(event);
    });
});

function toggleCursor(){
    let bodyElement = document.getElementsByTagName("body")[0];
    if (gameTimeRemaining > 0) {
        bodyElement.style.cursor = "url(./assets/hammer.gif), auto";
    } else {
        bodyElement.style.cursor= "";
    }
}



// Game Score and Timer
function gameTimeStep(){
    // update score displayed
    scoreDisplayText.innerText = "Score: " + currentGameScore;

    // update time remianing displayed
    timerDisplayText.innerText = "Time Remaining: " + gameTimeRemaining;

    // update the highscore based on score ASAP
    updateHighScore();
}


async function spawnMole(){
    // pick a random spawnable area
    let randomNumberWithinArrayRange = Math.floor(Math.random() * spawnableAreas.length);
    let chosenSpawnArea = spawnableAreas[randomNumberWithinArrayRange];

    // grab a image from pokeAPI
    let randomPokemonNumber = Math.floor(Math.random() * 1025) + 1;
    let apiResponse = await fetch("https://pokeapi.co/api/v2/pokemon/" + randomPokemonNumber);
    let apiData = await apiResponse.json();

    // create img with src form pokeAPI
    // let whackamoleImage = document.getElementById("img");
    // whackamoleImage.src = apiData.sprites.other.home.front_default;
    chosenSpawnArea.src = apiData.sprites.other.home.front_default;

    // put img into spawnable area
    // chosenSpawnArea.appendChild(whackamoleImage);
}


function wipeImagesFromSpawningAreas(){
    // loop through spawnableAreas
    // set the src property of each thing to ""
    // console.log(spawnableAreas);
    // spawnable areas is a HTML Collection not strictly an array therefore the array.from
    Array.from(spawnableAreas).forEach(area => {
        area.src = "";
    });
}

function whackamoleHandleClick(event){
    if (event.target.src != ""){
        currentGameScore++;
        event.target.src= "";
        console.log("Clicked on a mole! Score increased, it's now: " + currentGameScore);
    }
}





function toggleGamePlayContent(){
    // toggle the score, timer text, and game area elements
    if (gameTimeRemaining > 0){
        gameRunningInfoContainer.style.display = "inherit";
        gamePlayContainer.style.display = "inherit";
    } else {
        gameRunningInfoContainer.style.display = "none";
        gamePlayContainer.style.display = "none";
    }

}

function updateHighScore(){
    // check local storage for a high score
    highestGameScore = localStorage.getItem("highScore") || 0;

    // compare high score to currnet score
    // if current score is higher than high score
    if (currentGameScore > highestGameScore){
        // write to local storage
        localStorage.setItem("highScore", currentGameScore);
        // update high score text
        highestGameScore = currentGameScore;
    }
    
    // make sure the text is always reflecting the value
    // even if the value didnt change, becuase HTML has placeholder value that is not valid
    highScoreDisplayText.innerText = "High Score: " + highestGameScore;
}


function toggleGameControlButtons(){
    // check gameTimeRemaining

    if (gameTimeRemaining > 0) {
        // game has started
        startGameButton.style.display = "none";
        stopGameButton.style.display = "inherit";
    } else {
        // game has finished
        startGameButton.style.display = "inherit";
        stopGameButton.style.display = "none";
    }
    // reveal or hise startGameButton

    // hide or reveal stopGameButton
}


function startGame(desiredGameTime = defaultGameDuration){
    gameTimeRemaining = desiredGameTime;
    console.log("Started the game. Game time remaining is now: " + gameTimeRemaining);

    currentGameScore = 0;
    wipeImagesFromSpawningAreas();

    // toggle game controls
    toggleGameControlButtons();

    // toggle game play content
    toggleGamePlayContent();

    toggleCursor();


    gameCountdownInterval = setInterval(() => {
        gameTimeRemaining -= 1;
        console.log("Game time remaining is counting done it is now: " + gameTimeRemaining);

        if (gameTimeRemaining <= 0){
            // if game time remaining, stop subtracting
        
            console.log("Game has finished!");
            stopGame();
        }

    }, 1000);

    gameUpdateInterval = setInterval(gameTimeStep, 100)

    // TODO: Refactor for multiple spawningINtervals or find a way to make it
    // a differnet duration on each repetition
    spawningInterval = setInterval(() => {
        spawnMole();
    }, 1000);

}


// startGame(); // gameTimeRemaining becomes 120
// startGame(60); // gameTimeRemaining becomes 60

function stopGame() {
    gameTimeRemaining = 0;

    
    // stop all intervals
    clearInterval(gameCountdownInterval);
    clearInterval(gameUpdateInterval);
    clearInterval(spawningInterval);

    // add another step so time remaining gets to 0
    gameTimeStep();

    // toggle game controls
    toggleGameControlButtons();

    // toggle game play content
    // toggleGamePlayContent();

    wipeImagesFromSpawningAreas();

    toggleCursor();

    console.log("Stopped the game. Game time remaining is now: " + gameTimeRemaining)
}


startGameButton.addEventListener("click", () => {
    startGame(10);
});


stopGameButton.addEventListener("click", () => {
    stopGame();
});




// let isGameRunning = false;

// if (isGameRunning) {
//     // make moles appear to be whacked
// }
// if (isGameRunning) {
//     // decrease the time remaining
// }
// if (isGameRunning) {
//     // hide the Sart button
// }