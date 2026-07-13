let questions = [
    {
        prompt: `Number of primitive data types in Java are?`,
        options: ["6", "7", "8", "9"],
        answer: "8",
    },
    {
        prompt: `What is the size of float and double in Java?`,
        options: ["32 and 64", "32 and 32", "64 and 32", "64 and 64"],
        answer: "32 and 64",
    },
    {
        prompt: `Automatic type conversion is possible in which of the possible cases?`,
        options: ["Byte to int", "Int to long", "Long to int", "Short to int"],
        answer: "Int to long",
    },
    {
        prompt: `Find the output of the following code:\n
int Integer = 24;
char String = 'I';
System.out.print(Integer);
System.out.print(String);`,
        options: ["I", "Compile error", "Throws exception", "24 I"],
        answer: "24 I",
    },
    {
        prompt: `Find the output of the following program:\n
public class Solution {
    public static void main(String[] args) {
        short x = 10;
        x = x * 5;
        System.out.print(x);
    }
}`,
        options: ["50", "10", "Compile error", "Exception"],
        answer: "Compile error",
    },
    {
        prompt: `Find the output of the following program:\n
public class Solution {
    public static void main(String[] args) {
        byte x = 127;
        x++;
        x++;
        System.out.print(x);
    }
}`,
        options: ["-127", "127", "129", "2"],
        answer: "-127",
    },
    {
        prompt: `Find the output of the following program:\n
public class Solution {
    public static void main(String[] args) {
        int[] x = {120, 200, 016};
        for (int i = 0; i < x.length; i++) {
            System.out.print(x[i] + " ");
        }
    }
}`,
        options: ["120 200 016", "120 200 14", "120 200 16", "None"],
        answer: "120 200 016",
    },
    {
        prompt: `When an array is passed to a method, what does the method receive?`,
        options: [
            "The reference of the array",
            "A copy of the array",
            "Length of the array",
            "Copy of first element",
        ],
        answer: "The reference of the array",
    },
    {
        prompt: `Select the valid statement to declare and initialize an array.`,
        options: [
            "int[] A = {}",
            "int[] A = {1,2,3}",
            "int[] A = (1,2,3)",
            "int[][] A = {1,2,3}",
        ],
        answer: "int[] A = {1,2,3}",
    },
    {
        prompt: `Arrays in Java are-`,
        options: ["Object references", "Objects", "Primitive data type", "None"],
        answer: "Objects",
    }
];

// Get DOM Elements
let questionsEl = document.querySelector("#questions");
let timerEl = document.querySelector("#timer");
let choicesEl = document.querySelector("#options");
let submitBtn = document.querySelector("#submit-score");
let startBtn = document.querySelector("#start");
let nameEl = document.querySelector("#name");
let feedbackEl = document.querySelector("#feedback");
let reStartBtn = document.querySelector("#restart");

// Quiz's initial state
let currentQuestionIndex = 0;
let totalTime = 600;
let time = totalTime;
let timerId;
let score = 0;
let quizEnded = false;
let shuffledQuestions = [];
let isWaitingForNext = false;

// 🔥🔥🔥 NEW: Question timer variables
let questionTimerId = null;
let questionTimeLeft = 60; // 1 minute per question
const MAX_QUESTION_TIME = 60;

// 🔥🔥🔥 NEW: Function to update question timer display
function updateQuestionTimerDisplay() {
    let questionTimerEl = document.getElementById("question-timer");
    if (questionTimerEl) {
        questionTimerEl.textContent = formatTime(questionTimeLeft);
        // Change color when time is low
        if (questionTimeLeft <= 10) {
            questionTimerEl.style.color = "red";
        } else {
            questionTimerEl.style.color = "#2c3e50";
        }
    }
}

// 🔥🔥🔥 NEW: Function to start question timer
function startQuestionTimer() {
    // Clear any existing question timer
    if (questionTimerId) {
        clearInterval(questionTimerId);
        questionTimerId = null;
    }
    
    // Reset question time to 60 seconds
    questionTimeLeft = MAX_QUESTION_TIME;
    updateQuestionTimerDisplay();
    
    // Start the question timer
    questionTimerId = setInterval(function() {
        questionTimeLeft--;
        updateQuestionTimerDisplay();
        
        // If time is up for this question
        if (questionTimeLeft <= 0) {
            // Auto move to next question
            if (!quizEnded && !isWaitingForNext) {
                // Show time's up for this question
                feedbackEl.textContent = "⏰ Time's up for this question!";
                feedbackEl.style.color = "orange";
                feedbackEl.setAttribute("class", "feedback");
                
                // Auto move to next question
                isWaitingForNext = true;
                
                // Disable all buttons
                let allButtons = choicesEl.querySelectorAll('button');
                allButtons.forEach(btn => {
                    btn.disabled = true;
                    btn.style.cursor = 'not-allowed';
                    btn.style.opacity = '0.6';
                });
                
                // No points for unanswered question
                setTimeout(function() {
                    feedbackEl.setAttribute("class", "feedback hide");
                    
                    currentQuestionIndex++;
                    if (currentQuestionIndex === shuffledQuestions.length) {
                        quizEnd();
                    } else {
                        getQuestion();
                        // Restart question timer for next question
                        startQuestionTimer();
                    }
                }, 1500);
            }
        }
    }, 1000);
}

// Shuffle array function
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Get random questions
function getRandomQuestions() {
    let availableQuestions = [...questions];
    shuffledQuestions = shuffleArray(availableQuestions);
    currentQuestionIndex = 0;
    return shuffledQuestions;
}

// Format time as MM:SS
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(secs).padStart(2, '0');
    return `${formattedMinutes}:${formattedSeconds}`;
}

// Update timer display
function updateTimerDisplay() {
    timerEl.textContent = formatTime(time);
}

// Start quiz
function quizStart() {
    currentQuestionIndex = 0;
    time = totalTime;
    score = 0;
    quizEnded = false;
    isWaitingForNext = false;
    
    getRandomQuestions();
    
    timerId = setInterval(clockTick, 1000);
    updateTimerDisplay();
    
    let landingScreenEl = document.getElementById("start-screen");
    landingScreenEl.setAttribute("class", "hide");
    questionsEl.removeAttribute("class");
    
    let endScreenEl = document.getElementById("quiz-end");
    endScreenEl.setAttribute("class", "hide");
    
    getQuestion();
    
    // 🔥🔥🔥 NEW: Start question timer for first question
    startQuestionTimer();
}

// Display question
function getQuestion() {
    isWaitingForNext = false;
    
    let currentQuestion = shuffledQuestions[currentQuestionIndex];
    let promptEl = document.getElementById("question-words");

    let questionNumber = currentQuestionIndex + 1;
    let totalQuestions = shuffledQuestions.length;

    let formattedPrompt = currentQuestion.prompt.replace(/\n/g, "<br>");
    
    // 🔥🔥🔥 NEW: Added question timer display
    promptEl.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
            <span style="background: #3498db; color: white; padding: 5px 15px; border-radius: 20px; font-size: 14px;">
                📝 ${questionNumber}/${totalQuestions}
            </span>
           
        </div>
        <pre><code style="font-size: 16px; line-height: 1.6;">${formattedPrompt}</code></pre>
    `;

    choicesEl.innerHTML = "";
    currentQuestion.options.forEach(function (choice, i) {
        let choiceBtn = document.createElement("button");
        choiceBtn.setAttribute("value", choice);
        choiceBtn.innerHTML = `${String.fromCharCode(65 + i)}. ${choice}`;
        choiceBtn.onclick = questionClick;
        choicesEl.appendChild(choiceBtn);
    });
}

// Question click handler
function questionClick() {
    if (quizEnded || isWaitingForNext) return;
    
    isWaitingForNext = true;
    
    // 🔥🔥🔥 NEW: Stop question timer when user answers
    if (questionTimerId) {
        clearInterval(questionTimerId);
        questionTimerId = null;
    }
    
    let allButtons = choicesEl.querySelectorAll('button');
    allButtons.forEach(btn => {
        btn.disabled = true;
        btn.style.cursor = 'not-allowed';
        btn.style.opacity = '0.6';
    });
    
    if (this.value !== shuffledQuestions[currentQuestionIndex].answer) {
        time -= 10;
        if (time < 0) {
            time = 0;
        }
        updateTimerDisplay();
        feedbackEl.textContent = `❌ Wrong! Correct: ${shuffledQuestions[currentQuestionIndex].answer}`;
        feedbackEl.style.color = "red";
    } else {
        score += 5;
        feedbackEl.textContent = "✅ Correct!";
        feedbackEl.style.color = "green";
    }
    feedbackEl.setAttribute("class", "feedback");
    
    setTimeout(function () {
        feedbackEl.setAttribute("class", "feedback hide");
        
        currentQuestionIndex++;
        if (currentQuestionIndex === shuffledQuestions.length) {
            quizEnd();
        } else {
            getQuestion();
            // 🔥🔥🔥 NEW: Restart question timer for next question
            startQuestionTimer();
        }
    }, 1000);
}

// End quiz
function quizEnd() {
    if (quizEnded) return;
    quizEnded = true;
    isWaitingForNext = false;
    
    // 🔥🔥🔥 NEW: Clear question timer
    if (questionTimerId) {
        clearInterval(questionTimerId);
        questionTimerId = null;
    }
    
    clearInterval(timerId);
    
    let endScreenEl = document.getElementById("quiz-end");
    endScreenEl.removeAttribute("class");

    let finalScoreEl = document.getElementById("score-final");
    finalScoreEl.textContent = ` ${score}`;

    let passFailMessageEl = document.getElementById("pass-fail-message");

    if (score >= 25) {
        passFailMessageEl.textContent = "🎉 You are Passed in Exam!";
        passFailMessageEl.style.color = "green";
        passFailMessageEl.style.fontWeight = "bold";
        passFailMessageEl.style.fontSize = "22px";
    } else {
        passFailMessageEl.textContent = "❌ You did not pass the exam.";
        passFailMessageEl.style.color = "red";
        passFailMessageEl.style.fontWeight = "bold";
        passFailMessageEl.style.fontSize = "22px";
    }

    questionsEl.setAttribute("class", "hide");
    
    setTimeout(function() {
        redirectToHome();
    }, 5000);
}

// Redirect to home
function redirectToHome() {
    let endScreenEl = document.getElementById("quiz-end");
    endScreenEl.setAttribute("class", "hide");
    
    let landingScreenEl = document.getElementById("start-screen");
    landingScreenEl.removeAttribute("class");
    
    time = totalTime;
    updateTimerDisplay();
    
    feedbackEl.setAttribute("class", "feedback hide");
    quizEnded = false;
    isWaitingForNext = false;
    
    // 🔥🔥🔥 NEW: Clear question timer
    if (questionTimerId) {
        clearInterval(questionTimerId);
        questionTimerId = null;
    }
}

// Timer tick
function clockTick() {
    time--;
    updateTimerDisplay();
    
    if (time <= 0) {
        timerEl.textContent = "00:00";
        if (!quizEnded) {
            feedbackEl.textContent = "⏰ Time's Up!";
            feedbackEl.style.color = "red";
            feedbackEl.setAttribute("class", "feedback");
            setTimeout(function() {
                feedbackEl.setAttribute("class", "feedback hide");
            }, 2000);
            quizEnd();
        }
    }
}

// Save score
function saveHighscore() {
    let name = nameEl.value.trim();
    if (name !== "") {
        let highscores = JSON.parse(window.localStorage.getItem("highscores")) || [];
        let newScore = { score: score, name: name };
        highscores.push(newScore);
        window.localStorage.setItem("highscores", JSON.stringify(highscores));
        alert("Your Score has been Submitted");
    } else {
        alert("Please enter your name before submitting!");
    }
}

function checkForEnter(event) {
    if (event.key === "Enter") {
        saveHighscore();
    }
}
nameEl.onkeyup = checkForEnter;
submitBtn.onclick = saveHighscore;
startBtn.onclick = quizStart;

if (reStartBtn) {
    reStartBtn.onclick = function() {
        redirectToHome();
    };
}