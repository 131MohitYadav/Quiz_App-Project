let questions = [
    {
        prompt: `Q.1. What does HTML stand for?`,
        options: [
            "Hyper Text Markup Language",
            "Hyperlinks and Text Markup Language",
            "Home Tool Markup Language",
            "Hyper Transfer Markup Language"
        ],
        answer: "Hyper Text Markup Language",
    },
    {
        prompt: `Q.2. What is the correct HTML element for inserting a line break?`,
        options: ["<br>", "<lb>", "<break>", "<newline>"],
        answer: "<br>",
    },
    {
        prompt: `Q.3. What will be the output of the following HTML code?\n
<!DOCTYPE html>
<html>
<body>
    <p id="demo">Hello World!</p>
</body>
</html>`,
        options: ["Hello World!", "demo", "Paragraph", "Error"],
        answer: "Hello World!",
    },
    {
        prompt: `Q.4. Which HTML tag is used to define an unordered list?`,
        options: ["<ol>", "<ul>", "<list>", "<li>"],
        answer: "<ul>",
    },
    {
        prompt: `Q.5. What does the "alt" attribute in an <img> tag do?`,
        options: [
            "Specifies an alternate text for an image",
            "Changes the image size",
            "Defines the image alignment",
            "Links the image to another page"
        ],
        answer: "Specifies an alternate text for an image",
    },
    {
        prompt: `Q.6. Which HTML tag is used to create a hyperlink?`,
        options: ["<a>", "<link>", "<href>", "<url>"],
        answer: "<a>",
    },
    {
        prompt: `Q.7. How do you create a checkbox in HTML?`,
        options: [
            '<input type="checkbox">',
            '<checkbox>',
            '<input checkbox="true">',
            '<check>'
        ],
        answer: '<input type="checkbox">',
    },
    {
        prompt: `Q.8. Which tag is used to define a table row?`,
        options: ["<td>", "<tr>", "<th>", "<row>"],
        answer: "<tr>",
    },
    {
        prompt: `Q.9. Which tag is used to define the metadata of an HTML document?`,
        options: ["<meta>", "<data>", "<head>", "<info>"],
        answer: "<meta>",
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

// Loop through questions and display properly formatted HTML code
function getQuestion() {
    let currentQuestion = questions[currentQuestionIndex];
    let promptEl = document.getElementById("question-words");

    // Format the HTML code properly
    let formattedPrompt = currentQuestion.prompt.replace(/\n/g, "<br>");

    // Use <pre> and <code> to display properly formatted HTML code
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
