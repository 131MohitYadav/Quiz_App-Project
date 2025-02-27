let questions = [
    {
        prompt: `Q.1. Which SQL statement is used to retrieve all data from a table named "employees"?`,
        options: [
            `SELECT * FROM employees;`,
            `GET * FROM employees;`,
            `SHOW * FROM employees;`,
            `FETCH * FROM employees;`
        ],
        answer: `SELECT * FROM employees;`,
    },
    {
        prompt: `Q.2. What is the primary purpose of the SQL "WHERE" clause?`,
        options: [
            "To filter records based on a condition",
            "To group results by a specific column",
            "To sort the data in ascending order",
            "To rename columns in a result set"
        ],
        answer: "To filter records based on a condition",
    },
    {
        prompt: `Q.3. What will be the result of the following SQL query?\n
SELECT COUNT(*) FROM customers WHERE age > 30;`,
        options: ["Counts all customers", "Counts customers older than 30", "Returns all customers", "Throws an error"],
        answer: "Counts customers older than 30",
    },
    {
        prompt: `Q.4. Which SQL keyword is used to remove duplicate records from a query result?`,
        options: ["UNIQUE", "DISTINCT", "REMOVE DUPLICATES", "FILTER"],
        answer: "DISTINCT",
    },
    {
        prompt: `Q.5. What is the default sorting order when using ORDER BY in SQL?`,
        options: ["Ascending", "Descending", "Random", "None"],
        answer: "Ascending",
    },
    {
        prompt: `Q.6. What will be the result of the following SQL query?\n
SELECT name FROM employees WHERE salary > 50000 AND department = 'HR';`,
        options: [
            "Selects all employees",
            "Selects employees earning more than 50,000 in HR",
            "Throws an error",
            "Returns department names"
        ],
        answer: "Selects employees earning more than 50,000 in HR",
    },
    {
        prompt: `Q.7. Which SQL clause is used to group records that have the same values?`,
        options: ["ORDER BY", "GROUP BY", "FILTER", "SORT"],
        answer: "GROUP BY",
    },
    {
        prompt: `Q.8. What is the purpose of the SQL JOIN statement?`,
        options: [
            "To combine rows from two or more tables",
            "To delete records from multiple tables",
            "To copy data from one table to another",
            "To create a new database"
        ],
        answer: "To combine rows from two or more tables",
    },
    {
        prompt: `Q.9. Which SQL function is used to find the highest value in a column?`,
        options: ["MAX()", "TOP()", "HIGHEST()", "UPPER()"],
        answer: "MAX()",
    },
    {
        prompt: `Q.10. What is the purpose of the SQL "HAVING" clause?`,
        options: [
            "To filter grouped records",
            "To sort the records",
            "To remove duplicates",
            "To modify table structure"
        ],
        answer: "To filter grouped records",
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

// Loop through questions and display properly formatted SQL code
function getQuestion() {
    let currentQuestion = questions[currentQuestionIndex];
    let promptEl = document.getElementById("question-words");

    // Format the SQL query properly
    let formattedPrompt = currentQuestion.prompt.replace(/\n/g, "<br>");

    // Use <pre> and <code> to display properly formatted SQL queries
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
