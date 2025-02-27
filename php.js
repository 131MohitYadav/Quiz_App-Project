let questions = [
    {
        prompt: `Q.1. What does PHP stand for?`,
        options: [
            "Personal Home Page",
            "PHP: Hypertext Preprocessor",
            "Private Hosting Protocol",
            "Programming Home Page"
        ],
        answer: "PHP: Hypertext Preprocessor",
    },
    {
        prompt: `Q.2. Which symbol is used to declare a variable in PHP?`,
        options: ["$", "@", "#", "&"],
        answer: "$",
    },
    {
        prompt: `Q.3. What will be the output of the following PHP code?\n
<?php
$x = 5;
echo $x + 10;
?>`,
        options: ["5", "10", "15", "Error"],
        answer: "15",
    },
    {
        prompt: `Q.4. Which function is used to output text in PHP?`,
        options: ["print()", "echo", "display()", "show()"],
        answer: "echo",
    },
    {
        prompt: `Q.5. What is the correct way to start a PHP script?`,
        options: [
            "<?php",
            "<php>",
            "<script>",
            "<!DOCTYPE php>"
        ],
        answer: "<?php",
    },
    {
        prompt: `Q.6. What will be the output of the following PHP code?\n
<?php
$txt = "Hello World!";
echo strlen($txt);
?>`,
        options: ["12", "11", "10", "Error"],
        answer: "12",
    },
    {
        prompt: `Q.7. Which of the following is NOT a valid PHP variable name?`,
        options: [
            "$1variable",
            "$variable1",
            "$_variable",
            "$varName"
        ],
        answer: "$1variable",
    },
    {
        prompt: `Q.8. How do you write a single-line comment in PHP?`,
        options: [
            "// Comment",
            "/* Comment */",
            "# Comment",
            "Both // and #"
        ],
        answer: "Both // and #",
    },
    {
        prompt: `Q.9. What does the "isset()" function do in PHP?`,
        options: [
            "Checks if a variable is set and not null",
            "Checks if a variable is empty",
            "Deletes a variable",
            "Creates a variable"
        ],
        answer: "Checks if a variable is set and not null",
    },
    {
        prompt: `Q.10. Which superglobal array is used to collect form data in PHP?`,
        options: ["$_POST", "$GLOBALS", "$_SESSION", "$_CONFIG"],
        answer: "$_POST",
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

// Loop through questions and display properly formatted PHP code
function getQuestion() {
    let currentQuestion = questions[currentQuestionIndex];
    let promptEl = document.getElementById("question-words");

    // Format the PHP code properly
    let formattedPrompt = currentQuestion.prompt.replace(/\n/g, "<br>");

    // Use <pre> and <code> to display properly formatted PHP code
    promptEl.innerHTML = `<pre><code>${formattedPrompt}</code></pre>`;

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
