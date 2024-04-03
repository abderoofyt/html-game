let computer_score = 0;
let user_score = 0;

function chooseWeapon(userChoice) {
    // Hide weapon buttons
    document.getElementById("weapon_buttons").classList.add("hidden");
    document.getElementById("result").classList.add("hidden");
    

    // Delay displaying battle elements and determining the winner
    setTimeout(() => {
        // Display battle elements
        document.querySelector(".battle").classList.remove("hidden");
        document.querySelector(".details").classList.remove("hidden");
        document.getElementById("result").classList.remove("hidden");

        // Display user and computer choices
        const choices = ['rock', 'paper', 'scissor'];
        const computerChoice = choices[Math.floor(Math.random() * choices.length)];

        document.getElementById("user_choice").innerText = userChoice.toUpperCase();
        document.getElementById("computer_choice").innerText = computerChoice.toUpperCase();

        // Determine the winner after a delay
        determineWinner(userChoice, computerChoice);
    }, 2000); // Adjusted to 5 seconds
}

function determineWinner(userChoice, computerChoice) {
    const resultElement = document.getElementById("result");
    let message, bgColor, textColor;

    if (userChoice === computerChoice) {
        message = 'Draw!';
        bgColor = '#e5e5e5';
        textColor = '#808080';
    } else if (
        (userChoice === 'rock' && computerChoice === 'scissor') ||
        (userChoice === 'paper' && computerChoice === 'rock') ||
        (userChoice === 'scissor' && computerChoice === 'paper')
    ) {
        message = 'You win!';
        bgColor = '#cefdce';
        textColor = '#689f38';
        user_score++;
    } else {
        message = 'Computer wins!';
        bgColor = '#ffdde0';
        textColor = '#d32f2f';
        computer_score++;
    }

    resultElement.innerText = message;
    resultElement.style.backgroundColor = bgColor;
    resultElement.style.color = textColor;

    // Update scores after a delay
    setTimeout(updateScores, 2000); // Adjusted to 3 seconds

    // Show weapon buttons after a delay
    setTimeout(() => {
        document.getElementById("weapon_buttons").classList.remove("hidden");
        document.querySelector(".battle").classList.add("hidden");
    }, 2000); // Adjusted to 2 seconds
}

function updateScores() {
    document.getElementById("user_score").innerText = user_score;
    document.getElementById("computer_score").innerText = computer_score;
}
