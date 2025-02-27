let questions = [
    {
        prompt: `Q.1. What does CSS stand for?`,
        options: [
            "Creative Style Sheets",
            "Cascading Style Sheets",
            "Computer Style Sheets",
            "Colorful Style Sheets"
        ],
        answer: "Cascading Style Sheets",
    },
    {
        prompt: `Q.2. Which property is used to change the text color of an element?`,
        options: ["color", "text-color", "fgcolor", "font-color"],
        answer: "color",
    },
    {
        prompt: `Q.3. What will be the background color of the following CSS code?\n
body {
    background-color: #ff0000;
}`,
        options: ["Black", "Red", "White", "Blue"],
        answer: "Red",
    },
    {
        prompt: `Q.4. Which CSS property is used to set the background image of an element?`,
        options: ["background-image", "bg-image", "background", "image"],
        answer: "background-image",
    },
    {
        prompt: `Q.5. How do you make text bold using CSS?`,
        options: [
            "font-style: bold;",
            "text-weight: bold;",
            "font-weight: bold;",
            "bold: true;"
        ],
        answer: "font-weight: bold;",
    },
    {
        prompt: `Q.6. Which CSS property controls the text size?`,
        options: ["text-style", "font-size", "font-weight", "text-size"],
        answer: "font-size",
    },
    {
        prompt: `Q.7. How do you apply a style to multiple elements with the same class?`,
        options: [
            ".classname { }",
            "#classname { }",
            "element.classname { }",
            "*classname { }"
        ],
        answer: ".classname { }",
    },
    {
        prompt: `Q.8. Which CSS property is used to make the text italic?`,
        options: ["text-style", "font-style", "italic", "text-italic"],
        answer: "font-style",
    },
    {
        prompt: `Q.9. What is the correct CSS syntax to center an element horizontally?`,
        options: [
            "margin: auto;",
            "align: center;",
            "padding: center;",
            "text-align: center;"
        ],
        answer: "margin: auto;",
    },
    {
        prompt: `Q.10. Which CSS property is used to create space around elements?`,
        options: ["margin", "padding", "spacing", "border"],
        answer: "margin",
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

// Loop through questions and display properly formatted CSS code
function getQuestion() {
    let currentQuestion = questions[currentQuestionIndex];
    let promptEl = document.getElementById("question-words");

    // Format the CSS code properly
    let formattedPrompt = currentQuestion.prompt.replace(/\n/g, "<br>");

    // Use <pre> and <code> to display properly formatted CSS code
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
