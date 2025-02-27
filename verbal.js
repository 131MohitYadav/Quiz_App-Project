let questions = [
    {
        prompt: `Q.1. Choose the correct synonym for the word "Abundant".`,
        options: ["Scarce", "Plentiful", "Little", "Sparse"],
        answer: "Plentiful",
    },
    {
        prompt: `Q.2. Identify the correct antonym of "Eloquent".`,
        options: ["Fluent", "Persuasive", "Unclear", "Articulate"],
        answer: "Unclear",
    },
    {
        prompt: `Q.3. Choose the correct spelling.`,
        options: ["Accommodate", "Acomodate", "Accomodate", "Acommadate"],
        answer: "Accommodate",
    },
    {
        prompt: `Q.4. What is the meaning of the idiom "A blessing in disguise"?`,
        options: [
            "A bad situation that turned out to be good",
            "A clear advantage",
            "Something that brings bad luck",
            "An unfortunate event"
        ],
        answer: "A bad situation that turned out to be good",
    },
    {
        prompt: `Q.5. Identify the sentence with correct grammar.`,
        options: [
            "He go to school everyday.",
            "She enjoys reading books.",
            "They was late for the meeting.",
            "I has a new laptop."
        ],
        answer: "She enjoys reading books.",
    },
    {
        prompt: `Q.6. Choose the correct synonym for the word "Ambiguous".`,
        options: ["Clear", "Uncertain", "Definite", "Exact"],
        answer: "Uncertain",
    },
    {
        prompt: `Q.7. What does the phrase "Break the ice" mean?`,
        options: [
            "To start a conversation",
            "To break something",
            "To cool down",
            "To create a problem"
        ],
        answer: "To start a conversation",
    },
    {
        prompt: `Q.8. Identify the correct antonym of "Hostile".`,
        options: ["Aggressive", "Friendly", "Angry", "Rude"],
        answer: "Friendly",
    },
    {
        prompt: `Q.9. Fill in the blank: "She ____ to the market yesterday."`,
        options: ["go", "gone", "went", "going"],
        answer: "went",
    },
    {
        prompt: `Q.10. What is the correct plural form of "Analysis"?`,
        options: ["Analysises", "Analys", "Analyses", "Analysis"],
        answer: "Analyses",
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
