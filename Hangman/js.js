/*	Set Up Canvas for Hangman	*/

var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");
ctx.lineWidth = 3;
        
// creates a blank canvas
function blankCanvas() {
	ctx.clearRect(0, 0, 200, 150);
};   

// sets up the gallows 
function gallows() {
	ctx.moveTo(30, 0);
    ctx.lineTo(100, 0);
    ctx.moveTo(100, 0);
    ctx.lineTo(100, 14);
    ctx.moveTo(30, 0);
    ctx.lineTo(30, 100);
    ctx.stroke();
};
 
// sets up the hangman body parts for each incorrect guess 
function head() {
    ctx.beginPath();
    ctx.arc(100, 25, 12, 0, 2 * Math.PI);
    ctx.stroke();
};

function body() {
    ctx.moveTo(100, 35);
    ctx.lineTo(100, 70);
    ctx.stroke();
};

function leftArm() {
    ctx.moveTo(100, 55);
    ctx.lineTo(75, 40);
    ctx.stroke();
};

function rightArm() {
    ctx.moveTo(100, 55);
    ctx.lineTo(125, 40);
    ctx.stroke();
};
 
function leftLeg() {
    ctx.moveTo(100, 70);
    ctx.lineTo(75, 85);
    ctx.stroke();
};

function rightLeg() {
    ctx.moveTo(100, 70);
    ctx.lineTo(125, 85);
    ctx.stroke();
};

// creates the blank spaces for each letter of the gameword 
function letterBlanks(x, y){
    ctx.moveTo(x, 130);
    ctx.lineTo(y, 130);
    ctx.stroke();
};
   
//writes the correct letter of the gameword in the appropriate blank space 
function fillLetters(letter, x) {
    ctx.font = "20px Comic Sans";
    ctx.fillText(letter, x, 125);
} 

/*	START GAME	*/

// gamewords for each level        
var levelOne = ["sura", "iman", "eid", "jinn"];
var levelTwo = ["salah", "sabr", "sunnah", "zakah", "zakir", "quran", "taqwa"];
var levelThree = ["taqwa", "sahaba", "ummah", "hudud", "sakina", "taqwa", "jihad", "falah", "deen", "falah", "iman"];
var levelFour = [ "fitnah", "sadaqah", "halal", "haram", "taubah", "sunnah", "ummah", "niyyah", "akhira", "hijab", "sahaba"];
var levelFive = ["mujahid", "tajweed", "istighfar", "ijtihad", "shahada", "barakah",  "akhirah","tawakkul", "sadaqah"];

// determine gameword
var level = new URLSearchParams(window.location.search).get('level');
var levels = [levelOne, levelTwo, levelThree, levelFour, levelFive];
var wordChoices = levels[level - 1];
var gameWord = wordChoices[Math.floor(Math.random() * wordChoices.length)];
        
// starts game 
function startGame() {
        var startButton = document.createElement("button");
        startButton.innerHTML = "Start Game";
        startButton.onclick = function() {
            document.getElementById("idResult").innerHTML = "Let's play! Pick a level to start with!";
            gallows();
            createLetterBlanks();
            generateLetterButtons();
            startButton.style.display = "none"; // Hide the start button after clicking
        };
        document.getElementById("idResult").innerHTML = "Do you want to play?";
        document.getElementById("idResult").appendChild(startButton);
    }
    

// shows what the word is, for debugging
function showGameword() {
    document.getElementById("idShowGameword").innerHTML = gameWord;
}

/*	draws and fills in blank array for word in gamespace	*/
function createLetterBlanks() {
    var lettersLength = gameWord.length * 15;
    for (i = 5; i < lettersLength; i += 15) {
        letterBlanks(i, i + 10);
    }
}

function fillLetterBlanks(count) {
    var xValue = (count * 15) + 5;
    var letterValue = gameWord[count];
    fillLetters(letterValue, xValue);
}

function fillInWholeWord() {
    for (i = 0; i < gameWord.length; i++) {
        fillLetterBlanks(i);
    }
}

/*	Guessing the whole word 	*/
function guessWord() {
        var guessInput = document.createElement("input");
        guessInput.setAttribute("type", "text");
        guessInput.setAttribute("placeholder", "Enter your guess");
    
        var submitButton = document.createElement("button");
        submitButton.innerHTML = "Submit";
        submitButton.onclick = function() {
            var guess = guessInput.value;
            if (guess === gameWord) {
                document.getElementById("idResult").innerHTML = "That's correct!"; 
                gameOver("won");
            } else {
                document.getElementById("idResult").innerHTML = "That's not it, keep guessing!";
                addBodyPart();
            }
            guessInput.parentNode.removeChild(guessInput); // Remove the input field after submitting
            submitButton.parentNode.removeChild(submitButton); // Remove the submit button after submitting
        };
    
        document.getElementById("idResult").innerHTML = ""; // Clear previous content
        document.getElementById("idResult").appendChild(guessInput);
        document.getElementById("idResult").appendChild(submitButton);
    }

/*	Guessing individual letters of the gameword	*/
var length = gameWord.length; 
var wrongGuesses = [];
var numberOfMissedGuesses = -1;
var hangmanArray = [head, body, leftArm, rightArm, leftLeg, rightLeg];
var guessedWordCount = 0;
        
function guessLetter(letter) {
    var letters = [];
    for (var i = 0; i < gameWord.length; i++) {
        if (letter === gameWord[i]) {
            letters.push(i);
        }
    }

    if (letters.length > 0) {
        document.getElementById("idResult").innerHTML = "That's correct!";
        for (var j = 0; j < letters.length; j++) {
            fillLetterBlanks(letters[j]);
            guessedWordCount++;
        }
        if (guessedWordCount === gameWord.length) {
            gameOver("won");
        }
    } else {
        document.getElementById("idResult").innerHTML = "That's not a correct letter, keep guessing!";
        wrongGuesses.push(letter);
        document.getElementById("idArrayOfWrongGuesses").innerHTML = wrongGuesses.join(', ');
        addBodyPart();
    }
}

function addBodyPart() {
    numberOfMissedGuesses++;
    if (numberOfMissedGuesses === hangmanArray.length) {
        gameOver("lost");
    }
    var bodyPart = hangmanArray[numberOfMissedGuesses];                                                                    
    bodyPart();
}

/*	game over	*/
        
function gameOver(status) {
        fillInWholeWord();
        var ending = "You " + status + "! What would you like to do?";
        
        var gameOverOptions = document.createElement("div");
        gameOverOptions.setAttribute("id", "gameOverOptions");
    
        var playAgainBtn = document.createElement("button");
        playAgainBtn.innerHTML = "Play Again";
        playAgainBtn.onclick = function() {
            location.reload(); // Reload the page to start a new game
        };
        gameOverOptions.appendChild(playAgainBtn);
    
        var changeLevelBtn = document.createElement("button");
        changeLevelBtn.innerHTML = "Choose Another Level";
        changeLevelBtn.onclick = function() {
            window.location.href = "index.html"; // Redirect to the difficulty selection page
        };
        gameOverOptions.appendChild(changeLevelBtn);
    
        var cancelBtn = document.createElement("button");
        cancelBtn.innerHTML = "Cancel";
        cancelBtn.onclick = function() {
            document.getElementById("idResult").innerHTML = "Okay, see you next time!";
            blankCanvas();
            // Optionally add any additional actions you want to perform on cancel
        };
        gameOverOptions.appendChild(cancelBtn);
    
        document.getElementById("idResult").innerHTML = ending;
        document.getElementById("idResult").appendChild(gameOverOptions);
    }

// Function to generate buttons for all letters
function generateLetterButtons() {
        var letters = 'abcdefghijklmnopqrstuvwxyz';
        var buttonsDiv = document.getElementById("letterButtons");
        for (var i = 0; i < letters.length; i++) {
            var letter = letters.charAt(i);
            var button = document.createElement("button");
            button.textContent = letter.toUpperCase();
            button.setAttribute("onclick", "guessLetter('" + letter + "')");
            buttonsDiv.appendChild(button);
        }
    }
