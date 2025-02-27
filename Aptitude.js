

let questions = [
	{
		prompt: `  Q.1. Which of the following is a prime number?`,
		options: [
			"517",
			"559",
			"571",
			"533",
		],
		answer: "571",
	},

	{
		prompt: `Q.2. Find the sum of first 90 even natural numbers?`,
		options: [
			"8180",
			"8190",
			"8100",
			"8110",
		],
		answer: "8190",
	},

	{
		prompt: `Q.3. Find the sum two numbers, whose product is 200 and difference is minimum?`,
		options: [
			"30",
			"27",
			"35",
			"33",
		],
		answer: "30",
	},

	{
		prompt: `Q.4. How many distinct prime factors are there in 9900?`,
		options: ["7", "4", "27", "54"],
		answer: "4",
	},

	{
		prompt: `Q.5. Find the value of 5358*54?`,
		options: [
			"283932",
			"298332",
			"289322",
			"289332",
		],
		answer: "289332",
	},
	{
		prompt: `Q.6. Find the HCF of 405, 585, 765 and 900?`,
		options: [
			"35",
			"15",
			"45",
			"90",
		],
		answer: "45",
	},
	{
		prompt: `Q.7. Two numbers are in the ration 4:5 Their LCM is 240. Find the sum of numbers?`,
		options: [
			"108",
			"120",
			"132",
			"98",
		],
		answer: "108",
	},
	{
		prompt: ` Q.8.If a-b = 16 and a2.b2 = 544 , find the value of 2ab?`,
		options: [
			"450",
			"500",
			"550",
			"350",
		],
		answer: "450",
	},
	{
		prompt: `Q.9. Find the square root of 44521?`,
		options: [
			"221",
			"219",
			"211",
			"229",
		],
		answer: "211",
	},
	{
		prompt: `Q.10. The speed of a boat upstream in 20 kmph find the speed of the boat downstream \n if the speed of the stream in 3 kmph?`,
		options: [
			"26 kmph",
			"25 kmph",
			"23 kmph",
			"22 kmph",
		],
		answer: "26 kmph",
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

