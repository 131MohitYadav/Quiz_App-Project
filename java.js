let questions = [
    {
        prompt: `Q.1. Number of primitive data types in Java are?`,
        options: ["6", "7", "8", "9"],
        answer: "8",
    },
    {
        prompt: `Q.2. What is the size of float and double in Java?`,
        options: ["32 and 64", "32 and 32", "64 and 32", "64 and 64"],
        answer: "32 and 64",
    },
    {
        prompt: `Q.3. Automatic type conversion is possible in which of the possible cases?`,
        options: ["Byte to int", "Int to long", "Long to int", "Short to int"],
        answer: "Int to long",
    },
    {
        prompt: `Q.4. Find the output of the following code:\n
int Integer = 24;
char String = 'I';
System.out.print(Integer);
System.out.print(String);`,
        options: ["I", "Compile error", "Throws exception", "24 I"],
        answer: "24 I",
    },
    {
        prompt: `Q.5. Find the output of the following program:\n
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
        prompt: `Q.6. Find the output of the following program:\n
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
        prompt: `Q.7. Find the output of the following program:\n
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
        prompt: `Q.8. When an array is passed to a method, what does the method receive?`,
        options: [
            "The reference of the array",
            "A copy of the array",
            "Length of the array",
            "Copy of first element",
        ],
        answer: "The reference of the array",
    },
    {
        prompt: `Q.9. Select the valid statement to declare and initialize an array.`,
        options: [
            "int[] A = {}",
            "int[] A = {1,2,3}",
            "int[] A = (1,2,3)",
            "int[][] A = {1,2,3}",
        ],
        answer: "int[] A = {1,2,3}",
    },
    {
        prompt: `Q.10. Arrays in Java are-`,
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
		passFailMessageEl.style.fontWeight = "bold"
		passFailMessageEl.style.fontSize = "22px"
    } else {
        passFailMessageEl.textContent = "❌ You did not pass the exam.";
        passFailMessageEl.style.color = "red";
		passFailMessageEl.style.fontWeight = "bold"
		passFailMessageEl.style.fontSize = "22px"
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
