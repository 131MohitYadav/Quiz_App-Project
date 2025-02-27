let questions = [
    {
        prompt: `Q.1. Which type of JavaScript language is ___?`,
        options: ["Object-Oriented", "Object-Based", "Assembly-language", "High-level"],
        answer: "Object-Based",
    },
    {
        prompt: `Q.2. Which one of the following also known as Conditional Expression?`,
        options: ["Alternative to if-else", "Switch statement", "If-then-else statement", "Immediate if"],
        answer: "Immediate if",
    },
    {
        prompt: `Q.3. In JavaScript, what is a block of statement?`,
        options: ["Conditional block", "Block that combines a number of statements into a single compound statement", "Both conditional block and a single statement", "Block that contains a single statement"],
        answer: "Block that combines a number of statements into a single compound statement",
    },
    {
        prompt: `Q.4. The "function" and " var" are known as?`,
        options: ["Keywords", "Data types", "Declaration statements", "Prototypes"],
        answer: "Declaration statements",
    },
    {
        prompt: `Q.5. Which of the following variables takes precedence over the others if the names are the same?`,
        options: ["Global variable", "Local variable", "Both of the above", "None of the above"],
        answer: "Local variable",
    },
    {
        prompt: `Q.6. Which of the following is not a JavaScript data type?`,
        options: ["Null", "Undefined", "Float", "Number"],
        answer: "Float",
    },
    {
        prompt: `Q.7. In JavaScript, what is used for handling errors?`,
        options: ["Catch", "Throw", "Try-catch-finally", "Error-handling"],
        answer: "Try-catch-finally",
    },
    {
        prompt: `Q.8. Which built-in method sorts the elements of an array?`,
        options: ["order()", "sort()", "arrange()", "None of the above"],
        answer: "sort()",
    },
    {
        prompt: `Q.9. What keyword is used to define an asynchronous function in JavaScript?`,
        options: ["async", "await", "setTimeout", "setInterval"],
        answer: "async",
    },
    {
        prompt: `Q.10. How do you write "Hello World" in an alert box?`,
        options: ["msg('Hello World');", "alertBox('Hello World');", "alert('Hello World');", "msgBox('Hello World');"],
        answer: "alert('Hello World');",
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
let time = questions.length * 60;
let timerId;
let score = 0;

// Start quiz and hide front page
function quizStart() {
    timerId = setInterval(clockTick, 1000);
    timerEl.textContent = time;
    let landingScreenEl = document.getElementById("start-screen");
    landingScreenEl.setAttribute("class", "hide");
    questionsEl.removeAttribute("class");
    getQuestion();
}

// Loop through questions and display properly
function getQuestion() {
    let currentQuestion = questions[currentQuestionIndex];
    let promptEl = document.getElementById("question-words");

    // Display the question
    promptEl.innerHTML = `<pre><code>${currentQuestion.prompt}</code></pre>`;

    choicesEl.innerHTML = "";
    currentQuestion.options.forEach(function (choice, i) {
        let choiceBtn = document.createElement("button");
        choiceBtn.setAttribute("value", choice);
        choiceBtn.innerHTML = `${i + 1}. ${choice}`;
        
        choiceBtn.onclick = questionClick;
        choicesEl.appendChild(choiceBtn);
    });
}

// Check for right answer and handle wrong answer (deduct time)
function questionClick() {
    if (this.value !== questions[currentQuestionIndex].answer) {
        // Deduct time for wrong answers
        time -= 10;
        if (time < 0) {
            time = 0;
        }
        timerEl.textContent = time;
        feedbackEl.textContent = `Wrong! The correct answer was ${questions[currentQuestionIndex].answer}.`;
        feedbackEl.style.color = "red";
    } else {
        score += 5;
        feedbackEl.textContent = "Correct!";
        feedbackEl.style.color = "green";
    }
    feedbackEl.setAttribute("class", "feedback");
    setTimeout(function () {
        feedbackEl.setAttribute("class", "feedback hide");
    }, 2000);
    currentQuestionIndex++;
    if (currentQuestionIndex === questions.length) {
        quizEnd();
    } else {
        getQuestion();
    }
}

// End quiz by hiding questions and showing final score
function quizEnd() {
    clearInterval(timerId);
    let endScreenEl = document.getElementById("quiz-end");
    endScreenEl.removeAttribute("class");

    let finalScoreEl = document.getElementById("score-final");
    finalScoreEl.textContent = ` ${score}`;

    let passFailMessageEl = document.getElementById("pass-fail-message");

    // Determine pass or fail message
    if (score >= 25) { // Adjust passing score if needed
        passFailMessageEl.textContent = "🎉 You Passed the Exam!";
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
}

// End quiz if timer reaches 0
function clockTick() {
    time--;
    timerEl.textContent = time;
    if (time <= 0) {
        quizEnd();
    }
}

// Save score in local storage
function saveHighscore() {
    let name = nameEl.value.trim();
    if (name !== "") {
        let highscores = JSON.parse(window.localStorage.getItem("highscores")) || [];
        let newScore = { score: score, name: name };
        highscores.push(newScore);
        window.localStorage.setItem("highscores", JSON.stringify(highscores));
        alert("Your Score has been Submitted");
    }
}

// Save score after pressing enter
function checkForEnter(event) {
    if (event.key === "Enter") {
        saveHighscore();
        alert("Your Score has been Submitted");
    }
}
nameEl.onkeyup = checkForEnter;

// Save score after clicking submit
submitBtn.onclick = saveHighscore;

// Start quiz after clicking start
startBtn.onclick = quizStart;
