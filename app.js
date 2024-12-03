let userScore = 0;
let compScore = 0;

const videoElement = document.getElementById('webcam');
let user = document.querySelector("#user");
let comp = document.querySelector("#comp");
let msg = document.querySelector("#msg");
const nextGameBtn = document.getElementById('nextGameBtn'); // Updated to reference the button with the added id

let lastDetectionTime = 0; // To control the speed of detection
const detectionInterval = 1500; // Increased to 1.5 seconds between each detection (adjust this value for speed)
const resultDisplayDelay = 1500; // Delay before showing the result message (1.5 seconds)

const genComputerChoice = () => {
    const options = ["rock", "paper", "scissors"];
    const randomIdx = Math.floor(Math.random() * 3);
    return options[randomIdx];
};

const showWinner = (userWin, userChoice, compChoice) => {
    // Delay the output display
    setTimeout(() => {
        if (userWin) {
            ++userScore;
            msg.innerText = `You Win! Your ${userChoice} beats ${compChoice}`;
            user.innerText = userScore;
            msg.style.backgroundColor = "green";
        } else {
            ++compScore;
            msg.innerText = `You Lose! ${compChoice} beats your ${userChoice}`;
            comp.innerText = compScore;
            msg.style.backgroundColor = "red";
        }
        nextGameBtn.style.display = "block"; // Show Next Game button
    }, resultDisplayDelay); // Show result after the specified delay
};

const playGame = (userChoice) => {
    const compChoice = genComputerChoice();

    if (userChoice === compChoice) {
        // Delay the output display
        setTimeout(() => {
            msg.innerText = "Game Draw! Play Again.";
            msg.style.backgroundColor = "rgb(0, 0, 92)";
            nextGameBtn.style.display = "block"; // Show Next Game button
        }, resultDisplayDelay); // Show result after the specified delay
    } else {
        let userWin = true;
        if (userChoice === "rock") {
            userWin = compChoice === "paper" ? false : true;
        } else if (userChoice === "paper") {
            userWin = compChoice === "rock" ? true : false;
        } else {
            userWin = compChoice === "rock" ? false : true;
        }
        showWinner(userWin, userChoice, compChoice);
    }
};

// MediaPipe Hand Gesture Recognition
const hands = new Hands({
    locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
});

hands.setOptions({
    maxNumHands: 1,
    modelComplexity: 1,
    minDetectionConfidence: 0.7,
    minTrackingConfidence: 0.7
});

// Set up the camera to use for input
const camera = new Camera(videoElement, {
    onFrame: async () => {
        await hands.send({ image: videoElement });
    },
    width: 640,
    height: 480
});
camera.start();

// Detect gestures based on hand landmarks
hands.onResults((results) => {
    const now = Date.now();
    if (now - lastDetectionTime > detectionInterval) {
        lastDetectionTime = now;

        if (results.multiHandLandmarks.length > 0) {
            const landmarks = results.multiHandLandmarks[0];

            let userChoice = detectGesture(landmarks);
            if (userChoice) {
                playGame(userChoice);
            }
        }
    }
});

// Dummy gesture detection functions (basic rules for now)
const detectGesture = (landmarks) => {
    if (isFist(landmarks)) {
        return "rock";
    } else if (isOpenPalm(landmarks)) {
        return "paper";
    } else if (isVictorySign(landmarks)) {
        return "scissors";
    }
    return null;
};

const isFist = (landmarks) => {
    // Simplified logic for detecting a fist
    return landmarks[8].y > landmarks[6].y && landmarks[12].y > landmarks[10].y;
};

const isOpenPalm = (landmarks) => {
    // Simplified logic for detecting an open palm
    return landmarks[8].y < landmarks[6].y && landmarks[12].y < landmarks[10].y;
};

const isVictorySign = (landmarks) => {
    // Simplified logic for detecting a victory sign (scissors)
    return landmarks[8].y < landmarks[6].y && landmarks[12].y < landmarks[10].y && landmarks[16].y > landmarks[14].y;
};

// Reset the game when the Next Game button is clicked
document.getElementById('nextGameBtn').addEventListener('click', function () {
    location.reload(); // Refresh the page
});
document.getElementById('nextGameBtn').style.display = 'block'; // Show the button


// Select the "Next Game" button
nextGameBtn.addEventListener("click", function () {
  location.reload(); // Reload the current page
});
function showNextGameButton() {
    nextGameBtn.style.display = "block"; // Make the button visible
  }
  
  // Call this function when a round ends or conditions are met
  // For example:
  // showNextGameButton();
  
