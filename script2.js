
let questions = [
	{
		prompt: `  Q.1. Find the Odd one out?`,
		options: [
			"BEK",
			"CFL",
			"MPS",
			"GJP",
		],
		answer: "MPS",
	},

	{
		prompt: `Q.2. In certain code "CODE" is written as "DPEF". How is "DEFENCE" is written in that code?`,
		options: [
			"KWMCJFL",
			"ELDFSAP",
			"EFGFODF",
			"HRAOSCV",
		],
		answer: "EFGFODF",
	},

	{
		prompt: `Q.3. If the letters of the word "PRODUCT" are arranged alphabetically, then which letter would be farthest from the second letter of word?`,
		options: [
			"T",
			"R",
			"U",
			"P",
		],
		answer: "U",
	},

	{
		prompt: `Q.4. BFNM: EIQP :: RBGJ: ?`,
		options: ["GHJK", "WXYZ", "UEJM", "ABCD"],
		answer: "4",
	},

	{
		prompt: `Q.5. Hardworking: Determined :: Hapyy:?`,
		options: [
			"Sad",
			"Upbeat",
			"Lovely",
			"Hilarious",
		],
		answer: "Upbeat",
	},
	{
		prompt: `Q.6. Good: Ample :: Droll:?`,
		options: [
			"Corpulent",
			"Quiet",
			"Recede",
			"Humorous",
		],
		answer: "Humorous",
	},
	{
		prompt: `Q.7. Find the next numbers in the series : 61,52,63,94,46,....?`,
		options: [
			"81",
			"18",
			"49",
			"35",
		],
		answer: "18",
	},
	{
		prompt: ` Q.8.In a row of 26 girls, when Sakshi shifted four places towards the left, she become 10th from the left end. What wa her earlier position form the right end of the row?`,
		options: [
			"10th",
			"11th",
			"13th",
			"12th",
		],
		answer: "13th",
	},
	{
		prompt: `Q.9. Identify the wrong number in the series. 0,1,1,2,3,5,8,13,20,34?`,
		options: [
			"8",
			"20",
			"13",
			"34",
		],
		answer: "20",
	},
	{
		prompt: `Q.10. A box had 17 bulbs. All but five are fused How many are actually fused?`,
		options: [
			"9",
			"8",
			"12",
			"5",
		],
		answer: "12",
	}
];

// Get Dom Elements

let questionsEl =
	document.querySelector(
		"#questions"
	);
let timerEl =
	document.querySelector("#timer");
let choicesEl =
	document.querySelector("#options");
let submitBtn = document.querySelector(
	"#submit-score"
);
let startBtn =
	document.querySelector("#start");
let nameEl =
	document.querySelector("#name");
let feedbackEl = document.querySelector(
	"#feedback"
);
let reStartBtn =
	document.querySelector("#restart");

// Quiz's initial state
let currentQuestionIndex = 0;
let time = questions.length * 60;
let timerId;
let score = 0;

// Start quiz and hide frontpage

function quizStart() {
	timerId = setInterval(
		clockTick,
		1000
	);
	timerEl.textContent = time;
	let landingScreenEl =
		document.getElementById(
			"start-screen"
		);
	landingScreenEl.setAttribute(
		"class",
		"hide"
	);
	questionsEl.removeAttribute(
		"class"
	);
	getQuestion();
}

// Loop through array of questions and
// Answers and create list with buttons
function getQuestion() {
	let currentQuestion =
		questions[currentQuestionIndex];
	let promptEl =
		document.getElementById(
			"question-words"
		);
	promptEl.textContent =
		currentQuestion.prompt;
	choicesEl.innerHTML = "";
	currentQuestion.options.forEach(
		function (choice, i) {
			let choiceBtn =
				document.createElement(
					"button"
				);
			choiceBtn.setAttribute(
				"value",
				choice
			);
			choiceBtn.textContent =
				i + 1 + ". " + choice;
			choiceBtn.onclick =
				questionClick;
			choicesEl.appendChild(
				choiceBtn
			);
		}
	);
}

// Check for right answers and deduct
// Time for wrong answer, go to next question

function questionClick() {
	if (
		this.value !==
		questions[currentQuestionIndex]
			.answer
	) {
		//time -= 10;
		if (time < 0) {
			time = 0;
		}
		timerEl.textContent = time;
		feedbackEl.textContent = `Wrong! The correct answer was 
		${questions[currentQuestionIndex].answer}.`;
		feedbackEl.style.color = "red";
	} else {
		score += 5;
		feedbackEl.textContent =
			"Correct!";
		feedbackEl.style.color =
			"green";
	}
	feedbackEl.setAttribute(
		"class",
		"feedback"
	);
	setTimeout(function () {
		feedbackEl.setAttribute(
			"class",
			"feedback hide"
		);
	}, 2000);
	currentQuestionIndex++;
	if (
		currentQuestionIndex ===
		questions.length
	) {
		quizEnd();
	} else {
		getQuestion();
	}
}

// End quiz by hiding questions,
// Stop timer and show final score

function quizEnd() {
	clearInterval(timerId);
	let endScreenEl =
		document.getElementById(
			"quiz-end"
		);
	endScreenEl.removeAttribute(
		"class"
	);
	let finalScoreEl =
		document.getElementById(
			"score-final"
		);
	finalScoreEl.textContent = score;
	questionsEl.setAttribute(
		"class",
		"hide"
	);
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
// Along with users' name

function saveHighscore() {
	let name = nameEl.value.trim();
	if (name !== "") {
		let highscores =
			JSON.parse(
				window.localStorage.getItem(
					"highscores"
				)
			) || [];
		let newScore = {
			score: score,
			name: name,
		};
		highscores.push(newScore);
		window.localStorage.setItem(
			"highscores",
			JSON.stringify(highscores)
		);
		alert(
			"Your Score has been Submitted"
		);
	}
}

// Save users' score after pressing enter

function checkForEnter(event) {
	if (event.key === "Enter") {
		saveHighscore();
		alert(
			"Your Score has been Submitted"
		);
	}
}
nameEl.onkeyup = checkForEnter;

// Save users' score after clicking submit

submitBtn.onclick = saveHighscore;

// Start quiz after clicking start quiz

startBtn.onclick = quizStart;
