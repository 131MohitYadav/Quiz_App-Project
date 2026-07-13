

let questions = [
	{
		prompt: `  Which of the following is a prime number?`,
		options: [
			"517",
			"559",
			"571",
			"533",
		],
		answer: "571",
	},

	{
		prompt: ` Find the sum of first 90 even natural numbers?`,
		options: [
			"8180",
			"8190",
			"8100",
			"8110",
		],
		answer: "8190",
	},

	{
		prompt: ` Find the sum two numbers, whose product is 200 and difference is minimum?`,
		options: [
			"30",
			"27",
			"35",
			"33",
		],
		answer: "30",
	},

	{
		prompt: ` How many distinct prime factors are there in 9900?`,
		options: ["7", "4", "27", "54"],
		answer: "4",
	},

	{
		prompt: ` Find the value of 5358*54?`,
		options: [
			"283932",
			"298332",
			"289322",
			"289332",
		],
		answer: "289332",
	},
	{
		prompt: ` Find the HCF of 405, 585, 765 and 900?`,
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
		prompt: ` If a-b = 16 and a2.b2 = 544 , find the value of 2ab?`,
		options: [
			"450",
			"500",
			"550",
			"350",
		],
		answer: "450",
	},
	{
		prompt: ` Find the square root of 44521?`,
		options: [
			"221",
			"219",
			"211",
			"229",
		],
		answer: "211",
	},
	{
		prompt: ` The speed of a boat upstream in 20 kmph find the speed of the boat downstream \n if the speed of the stream in 3 kmph?`,
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


// STEP 1 - > QUIZ TATE VARIABLES // 
// Fixed 10 minutes (600 seconds) and quizEnded flag

let currentQuestionIndex = 0;
let totalTime = 600; 
let time = totalTime;
let timerId;
let score = 0;
let quizEnded = false // prevent multiple quiz endings


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


// STEP 5 -> GET RANDOM QUESTIONSS
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


// STEP 7 -> QUESTIONS TIMER DISPLAY
// Show 1 - minutes countdown for each question with coloer change

function updateQuestionTimerDisplay(){
	let questionTimerEl = document.getElementById("question-timer");
	if(questionTimerEl){
		questionTimerEl.textContent = formatTime(questionTimeLeft);
		// changes color to red when 10 seconds left
		if(questionTimeLeft <= 10){
			questionTimerEl.style.color = "red";
		}
		else{
			questionTimerEl.style.color = "#2c3e50";
		}
	}
}


// STEP 8 -> START QUESTION TIMER
// Starts 60 second countdown, auto-moves to next question when time expire

function startQuestionTimer(){
	// clear existing timer
	if(questionTimerId){
		clearInterval(questionTimerId);
		questionTimerId = null;
	}
	questionTimeLeft = MAX_QUESTION_TIME;
	updateQuestionTimerDisplay();

	questionTimerId = setInterval(function() {
		questionTimeLeft--;
		updateQuestionTimerDisplay();

		// Auto- move when 1 minute expire
		if ( questionTimeLeft <= 0){
			if (!quizEnded && !isWaitingForNext){
				feedbackEl.textContent = "Time's up for this question!";
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
					if(currentQuestionIndex == shuffledQuestions.length){
						

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


// STEP 9 -> QUIZ START - RESET STATE
// Reset all variabls and hides previous end screen

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