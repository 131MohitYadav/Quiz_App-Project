let questions = [
    {
        prompt: `Q.1. What is the correct syntax to print "Hello, World!" in C++?`,
        options: [
            `printf("Hello, World!");`,
            `cout << "Hello, World!";`,
            `Console.WriteLine("Hello, World!");`,
            `print("Hello, World!");`
        ],
        answer: `cout << "Hello, World!";`,
    },
    {
        prompt: `Q.2. Which data type is used to store a single character in C++?`,
        options: ["char", "string", "int", "double"],
        answer: "char",
    },
    {
        prompt: `Q.3. What is the output of the following C++ code?\n
#include <iostream>
using namespace std;
int main() {
    int a = 5, b = 2;
    cout << a / b;
    return 0;
}`,
        options: ["2.5", "2", "2.0", "Error"],
        answer: "2",
    },
    {
        prompt: `Q.4. What is the purpose of the \`new\` operator in C++?`,
        options: [
            "To declare a new variable",
            "To allocate memory dynamically",
            "To create a new function",
            "To initialize an array"
        ],
        answer: "To allocate memory dynamically",
    },
    {
        prompt: `Q.5. Which of the following is NOT a valid C++ loop?`,
        options: ["for", "while", "repeat", "do-while"],
        answer: "repeat",
    },
    {
        prompt: `Q.6. What will be the output of the following C++ program?\n
#include <iostream>
using namespace std;
int main() {
    int arr[] = {10, 20, 30, 40};
    cout << arr[2];
    return 0;
}`,
        options: ["10", "20", "30", "40"],
        answer: "30",
    },
    {
        prompt: `Q.7. Which header file is required for using \`cout\` and \`cin\` in C++?`,
        options: ["<stdio.h>", "<iostream>", "<string>", "<cstdlib>"],
        answer: "<iostream>",
    },
    {
        prompt: `Q.8. What is the default access modifier for class members in C++?`,
        options: ["private", "public", "protected", "None"],
        answer: "private",
    },
    {
        prompt: `Q.9. What will be the output of the following code?\n
#include <iostream>
using namespace std;
int main() {
    int x = 5;
    cout << ++x;
    return 0;
}`,
        options: ["4", "5", "6", "Undefined"],
        answer: "6",
    },
    {
        prompt: `Q.10. What is the purpose of the \`delete\` operator in C++?`,
        options: [
            "To delete files",
            "To free dynamically allocated memory",
            "To remove an element from an array",
            "To destroy an object"
        ],
        answer: "To free dynamically allocated memory",
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

// Loop through questions and display properly formatted C++ code
function getQuestion() {
    let currentQuestion = questions[currentQuestionIndex];
    let promptEl = document.getElementById("question-words");

    // Format the C++ code properly
    let formattedPrompt = currentQuestion.prompt.replace(/\n/g, "<br>");

    // Use <pre> and <code> to display properly formatted C++ code
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
