let questions = [
    {
        prompt: `Q.1. What is the size of an \`int\` data type in C?`,
        options: ["2 bytes", "4 bytes", "8 bytes", "Depends on the compiler"],
        answer: "Depends on the compiler",
    },
    {
        prompt: `Q.2. What is the correct format specifier for printing a float value in C?`,
        options: ["%d", "%c", "%f", "%lf"],
        answer: "%f",
    },
    {
        prompt: `Q.3. Which of the following is a valid variable name in C?`,
        options: ["1var", "_var", "var-name", "var name"],
        answer: "_var",
    },
    {
        prompt: `Q.4. What will be the output of the following code:\n
#include <stdio.h>
int main() {
    int x = 10;
    printf("%d", x++);
    return 0;
}`,
        options: ["10", "11", "Garbage value", "Compile error"],
        answer: "10",
    },
    {
        prompt: `Q.5. What does the \`sizeof\` operator return in C?`,
        options: ["Memory address", "Size in bits", "Size in bytes", "Number of elements"],
        answer: "Size in bytes",
    },
    {
        prompt: `Q.6. Which of the following loops in C is an entry-controlled loop?`,
        options: ["while", "do-while", "both while and for", "none"],
        answer: "both while and for",
    },
    {
        prompt: `Q.7. What is the output of the following C program?\n
#include <stdio.h>
int main() {
    int arr[] = {1, 2, 3, 4, 5};
    printf("%d", arr[2]);
    return 0;
}`,
        options: ["1", "2", "3", "4"],
        answer: "3",
    },
    {
        prompt: `Q.8. What is the default return type of a function in C if not specified?`,
        options: ["void", "int", "float", "double"],
        answer: "int",
    },
    {
        prompt: `Q.9. Which of the following statements is true about pointers in C?`,
        options: [
            "Pointers store memory addresses",
            "Pointers can only point to integers",
            "Pointers cannot be NULL",
            "Pointers always store values",
        ],
        answer: "Pointers store memory addresses",
    },
    {
        prompt: `Q.10. What is the purpose of the \`break\` statement in C?`,
        options: ["Stop program execution", "Exit loop or switch statement", "Skip next iteration", "None of the above"],
        answer: "Exit loop or switch statement",
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

// Start quiz and hide frontpage
function quizStart() {
    timerId = setInterval(clockTick, 1000);
    timerEl.textContent = time;
    let landingScreenEl = document.getElementById("start-screen");
    landingScreenEl.setAttribute("class", "hide");
    questionsEl.removeAttribute("class");
    getQuestion();
}

// Loop through questions and display properly formatted pseudocode
function getQuestion() {
    let currentQuestion = questions[currentQuestionIndex];
    let promptEl = document.getElementById("question-words");

    // Format the pseudocode properly
    let formattedPrompt = currentQuestion.prompt.replace(/\n/g, "<br>");

    // Use <pre> and <code> to display properly formatted pseudocode
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
