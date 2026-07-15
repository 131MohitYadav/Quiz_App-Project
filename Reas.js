
let questions = [
	{
		prompt: `   Find the Odd one out?`,
		options: [
			"BEK",
			"CFL",
			"MPS",
			"GJP",
		],
		answer: "MPS",
	},

	{
		prompt: `In certain code "CODE" is written as "DPEF".
         How is "DEFENCE" is written in that code?`,
		options: [
			"KWMCJFL",
			"ELDFSAP",
			"EFGFODF",
			"HRAOSCV",
		],
		answer: "EFGFODF",
	},

	{
		prompt: ` If the letters of the word "PRODUCT" are arrange\n alphabetically, then which letter would be farthest from the second letter of word?`,
		options: [
			"T",
			"R",
			"U",
			"P",
		],
		answer: "U",
	},

	{
		prompt: ` BFNM: EIQP :: RBGJ: ?`,
		options: ["GHJK", "WXYZ", "UEJM", "ABCD"],
		answer: "4",
	},

	{
		prompt: ` Hardworking: Determined :: Hapyy:?`,
		options: [
			"Sad",
			"Upbeat",
			"Lovely",
			"Hilarious",
		],
		answer: "Upbeat",
	},
	{
		prompt: ` Good: Ample :: Droll:?`,
		options: [
			"Corpulent",
			"Quiet",
			"Recede",
			"Humorous",
		],
		answer: "Humorous",
	},
	{
		prompt: ` Find the next numbers in the series : 61,52,63,94,46,....?`,
		options: [
			"81",
			"18",
			"49",
			"35",
		],
		answer: "18",
	},
	{
		prompt: ` In a row of 26 girls, when Sakshi shifted four places towards the left, she \n become 10th from the left end. What wa her earlier position form the right end \n of the row?`,
		options: [
			"10th",
			"11th",
			"13th",
			"12th",
		],
		answer: "13th",
	},
	{
		prompt: ` Identify the wrong number in the series. 0,1,1,2,3,5,8,13,20,34?`,
		options: [
			"8",
			"20",
			"13",
			"34",
		],
		answer: "20",
	},
	{
		prompt: ` A box had 17 bulbs. All but five are fused How many are actually fused?`,
		options: [
			"9",
			"8",
			"12",
			"5",
		],
		answer: "12",
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


// STEP 1 - > QUIZ STATE VARIABLES // 
// Fixed 10 minutes (600 seconds) and quizEnded flag

let currentQuestionIndex = 0;
let totalTime = 600; 
let time = totalTime;
let timerId;
let score = 0;
let quizEnded = false; // prevent multiple quiz endings


// STEP 2 -> RANDOM QUESTIONS SYSTEM
// Shuffle functionality to randomize question order

let shuffledQuestions = [];
let isWaitingForNext = false;


// STEP 3 -> QUESTION TIMER ( 1 MINUTE PER QUESTION)
// Each questions gets 60 seconds, auto-moves when time expire

let questionTimerId = null;
let questionTimeLeft = 60;
const MAX_QUESTION_TIME = 60; // maximum time per question


// STEP 4 -> SHUFFLE FUNCTION
// Fisher-Yates algorithm to randomize questions

function shuffleArray(array){
	for ( let i = array.length - 1; i > 0; i--){
		const j = Math.floor(Math.random() * ( i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
	return array;
}


// STEP 5 -> GET RANDOM QUESTIONS
// Creates a shuffled copy of questions array

function getRandomQuestions(){
	let availableQuestions = [...questions];
	shuffledQuestions = shuffleArray(availableQuestions);
	currentQuestionIndex = 0;
	return shuffledQuestions;
}

// STEP 6 -> FORMAT TIME (MM : SS)
// show minutes and seconds only

function formatTime(seconds) {
	const minutes = Math.floor(seconds / 60);
	const secs = seconds % 60;
	const formattedMinutes = String(minutes).padStart(2,'0');
	const formattedSeconds = String(secs).padStart(2,'0');
	return `${formattedMinutes}:${formattedSeconds}`;
}

function updateTimerDisplay(){
	timerEl.textContent = formatTime(time);
}


// STEP 7 -> START QUESTION TIMER
// Starts 60 second countdown, auto-moves to next question when time expire

function startQuestionTimer(){
	// clear existing timer
	if(questionTimerId){
		clearInterval(questionTimerId);
		questionTimerId = null;
	}
	questionTimeLeft = MAX_QUESTION_TIME;

	questionTimerId = setInterval(function() {
		questionTimeLeft--;

		// Auto- move when 1 minute expire
		if ( questionTimeLeft <= 0){
			if (!quizEnded && !isWaitingForNext){
				feedbackEl.textContent = "⏰ Time's up for this question!";
				feedbackEl.style.color = "orange";
				feedbackEl.setAttribute("class", "feedback");

				isWaitingForNext = true;

				// disable buttons
				let allButtons = choicesEl.querySelectorAll('button');
				allButtons.forEach(btn => {
					btn.disabled = true;
					btn.style.cursor = 'not-allowed';
					btn.style.opacity = '0.6';
				});

				// No points for unanswered question
				setTimeout(function(){
					feedbackEl.setAttribute("class", "feedback hide");

					currentQuestionIndex++;
					if(currentQuestionIndex === shuffledQuestions.length){
						quizEnd();
					}
					else{
						getQuestion();
						startQuestionTimer(); // Restart timer for next question
					}
				}, 1500);
			}
		}
	}, 1000);
}


// STEP 8 -> QUIZ START - RESET STATE
// Reset all variables and hides previous end screen

function quizStart(){
	// reset all state
	currentQuestionIndex = 0;
	time = totalTime;
	score = 0;
	quizEnded = false;
	isWaitingForNext = false;

	getRandomQuestions(); // shuffle questions

	timerId = setInterval(clockTick, 1000);
	updateTimerDisplay();

	let landingScreenEl = document.getElementById("start-screen");
	landingScreenEl.setAttribute("class", "hide");
	questionsEl.removeAttribute("class");

	//Hide any previous end screen
	let endScreenEl = document.getElementById("quiz-end");
	endScreenEl.setAttribute("class", "hide");

	getQuestion();
	startQuestionTimer(); // start 1-minute timer for first question
}

// STEP 9 -> GET QUESTION - DISPLAY PROGRESS
// shows question number and progress

function getQuestion() { 
	isWaitingForNext = false;

	let currentQuestion = shuffledQuestions[currentQuestionIndex];
	let promptEl = document.getElementById("question-words");

	let questionNumber = currentQuestionIndex + 1;
	let totalQuestions = shuffledQuestions.length;

	let formattedPrompt = currentQuestion.prompt.replace(/\n/g, "<br>");

	// 🔥 REMOVED: Question timer display
	promptEl.innerHTML = `
	<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom:15px;">
		<span style="background: #3498db; color: white; padding: 5px 15px; border-radius: 20px; font-size: 14px;">
			${questionNumber}/${totalQuestions}
		</span>
	</div>
	<pre><code style="font-size: 16px; line-height: 1.6;">${formattedPrompt}</code></pre>
	`;

	choicesEl.innerHTML = "";
	currentQuestion.options.forEach(function (choice, i) {
		let choiceBtn = document.createElement("button");
		choiceBtn.setAttribute("value", choice);
		choiceBtn.innerHTML = `${String.fromCharCode(65 + i)}. ${choice}`;
		choiceBtn.onclick = questionClick;
		choicesEl.appendChild(choiceBtn);
	});
}

// STEP 10 -> QUESTION CLICK - AUTO NEXT
// Stops timer, shows feedback, auto-moves to next question in 1 second

function questionClick(){
	if (quizEnded || isWaitingForNext) return;

	isWaitingForNext = true;

	// question timer when user answers 
	if(questionTimerId){
		clearInterval(questionTimerId);
		questionTimerId = null;
	}

	let allButtons = choicesEl.querySelectorAll('button');
	allButtons.forEach(btn => {
		btn.disabled = true;
		btn.style.cursor = 'not-allowed';
		btn.style.opacity = '0.6';
	});

	if(this.value !== shuffledQuestions[currentQuestionIndex].answer){
		time -= 10;
		if (time < 0){
			time = 0;
		}
		updateTimerDisplay();
		feedbackEl.textContent = `❌ Wrong! Correct: ${shuffledQuestions[currentQuestionIndex].answer}`;
		feedbackEl.style.color = "red";
	}
	else{
		score += 5;
		feedbackEl.textContent = "✅ Correct!";
		feedbackEl.style.color = "green";
	}
	feedbackEl.setAttribute("class", "feedback");

	//Auto-move to next question after 1 second
	setTimeout(function () {
		feedbackEl.setAttribute("class", "feedback hide");

		currentQuestionIndex++;
		if(currentQuestionIndex === shuffledQuestions.length){
			quizEnd();
		}
		else{
			getQuestion();
			startQuestionTimer(); // restart timer for next question
		}
	}, 1000);
}


// STEP 11 -> QUIZ END - PREVENT MULTIPLE CALLS
// Prevents multiple endings, clears all timer, auto-redirects

function quizEnd(){
	if (quizEnded) return; // Prevent multiple calls
	quizEnded = true;
	isWaitingForNext = false;

	// clear both timers
	if (questionTimerId){
		clearInterval(questionTimerId);
		questionTimerId = null;
	}
	clearInterval(timerId);

	let endScreenEl = document.getElementById("quiz-end");
	endScreenEl.removeAttribute("class");

	let finalScoreEl = document.getElementById("score-final");
	finalScoreEl.textContent = `${score}`;

	let passFailMessageEl = document.getElementById("pass-fail-message");

	if (score >= 25){
		passFailMessageEl.textContent = "🎉 You are Passed in Exam!";
		passFailMessageEl.style.color = "green";
		passFailMessageEl.style.fontWeight = "bold";
		passFailMessageEl.style.fontSize = "22px";
	}
	else{
		passFailMessageEl.textContent = "❌ You did not pass the exam.";
		passFailMessageEl.style.color = "red";
		passFailMessageEl.style.fontWeight = "bold";
		passFailMessageEl.style.fontSize = "22px";
	}
	questionsEl.setAttribute("class", "hide");

	// Auto-redirect to home after 5 seconds
	setTimeout(function() {
		redirectToHome();
	}, 5000);
}

// STEP 12 -> Redirect To Home
// New functions to reset and go back to home page
function redirectToHome(){
	let endScreenEl = document.getElementById("quiz-end");
	endScreenEl.setAttribute("class", "hide");

	let landingScreenEl = document.getElementById("start-screen");
	landingScreenEl.removeAttribute("class");

	time = totalTime;
	updateTimerDisplay();

	feedbackEl.setAttribute("class", "feedback hide");
	quizEnded = false;
	isWaitingForNext = false;

	// clear question timer
	if (questionTimerId){
		clearInterval(questionTimerId);
		questionTimerId = null;
	}
}

// STEP 13 -> CLOCK TICK - TIMER ENDS
//Shows "00:00" when timer ends and auto-ends quiz
function clockTick(){
	time--;
	updateTimerDisplay();

	if(time <= 0){
		timerEl.textContent = "00:00"; // show formatted zero
		if(!quizEnded){
			feedbackEl.textContent = "⏰ Time's Up!";
			feedbackEl.style.color = "red";
			feedbackEl.setAttribute("class", "feedback");
			setTimeout(function(){
				feedbackEl.setAttribute("class", "feedback hide");
			}, 2000);
			quizEnd();
		}
	}
}

// STEP 14 -> SAVE SCORE - VALIDATION
// Added validation for empty name
function saveHighscore(){
	let name = nameEl.value.trim();
	if (name !== ""){
		let highscores = JSON.parse(window.localStorage.getItem("highscores")) || [];
		let newScore = {score: score, name: name};
		highscores.push(newScore);
		window.localStorage.setItem("highscores", JSON.stringify(highscores));
		alert("Your Score has been Submitted");
	} else{
		alert("Please enter your name before submitting!");
	}
}


// STEP 15 -> RESTART BUTTON
// New functionality to go back to home page
function checkForEnter(event){
	if (event.key === "Enter"){
		saveHighscore();
	}
}

nameEl.onkeyup = checkForEnter;
submitBtn.onclick = saveHighscore;
startBtn.onclick = quizStart;

// Restart button handler
if (reStartBtn){
	reStartBtn.onclick = function(){
		redirectToHome();
	};
}