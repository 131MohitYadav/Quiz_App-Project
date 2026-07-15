let questions = [
    {
        prompt: `What is the correct syntax to print "Hello, World!" in Python?`,
        options: [
            `print("Hello, World!")`,
            `System.out.println("Hello, World!")`,
            `console.log("Hello, World!")`,
            `echo "Hello, World!";`
        ],
        answer: `print("Hello, World!")`,
    },
    {
        prompt: `Which data type is used to store a whole number in Python?`,
        options: ["int", "float", "string", "boolean"],
        answer: "int",
    },
    {
        prompt: `What will be the output of the following Python code?\n
x = 5
y = 2
print(x // y)`,
        options: ["2.5", "2", "2.0", "Error"],
        answer: "2",
    },
    {
        prompt: ` What is the purpose of the \`len()\` function in Python?`,
        options: [
            "To find the length of a list, string, or tuple",
            "To count the number of loops",
            "To initialize an array",
            "To define a new function"
        ],
        answer: "To find the length of a list, string, or tuple",
    },
    {
        prompt: ` Which of the following is NOT a valid Python loop?`,
        options: ["for", "while", "do-while", "None"],
        answer: "do-while",
    },
    {
        prompt: ` What will be the output of the following Python code?\n
arr = [10, 20, 30, 40]
print(arr[2])`,
        options: ["10", "20", "30", "40"],
        answer: "30",
    },
    {
        prompt: ` Which keyword is used to define a function in Python?`,
        options: ["func", "define", "def", "function"],
        answer: "def",
    },
    {
        prompt: ` What is the default return value of a function in Python if no return statement is used?`,
        options: ["0", "None", "False", "Undefined"],
        answer: "None",
    },
    {
        prompt: ` What will be the output of the following code?\n
x = 5
print(x + 1)`,
        options: ["4", "5", "6", "Undefined"],
        answer: "6",
    },
    {
        prompt: ` What is the purpose of the \`del\` keyword in Python?`,
        options: [
            "To delete files",
            "To delete an object or variable",
            "To remove an element from a list",
            "To destroy a function"
        ],
        answer: "To delete an object or variable",
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

// STEP 10 -> GET QUESTION - DISPLAY PROGRESS & TIMER
// shows question number, progress, and question timer

function getQuestion() { 
	isWaitingForNext = false;

	let currentQuestion = shuffledQuestions(currentQuestionIndex);
	let promptEl = document.getElementById("question-words");

	let questionNumber = currentQuestionIndex + 1;
	let totalQuestions = shuffledQuestions.length;

	let formattedPrompt = currentQuestion.prompt.replace(/\n/g, "<br");

	// display with progress and question timer ( removed labels)
	promptEl.innerHTML =`
	<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom:15px;">
	<span style="background: #3498db; color: white; padding: 5px 15px; border-radius: 20px; font-size: 14px;">
	${questionNumber}/$(totalQuestions)
	</span>
	</div>
	
	<pre><code style = "font-size: 16px; line-height: 1.6;">${formattedPrompt}</code></pre>
	
	`;

	choicesEl.innerHTML = "";
	currentQuestion.options.forEach(function (choice, i) {
		let choiceBtn = document.createElement("button");
		choiceBtn.setAttribute("value", choice);
		choiceBtn.innerHTML = `${String.fromCharCode(65 + i)}. ${choice}`;
		choiceBtn.onclick = questionClick;
		choiceBtn.onclick = questionClick;
		choicesEl.appendChild(choiceBtn);
	});
	
}

// STEP 11 -> QUESTION CLICK  - AUTO NEXT
// Stops timer , shows feedback, auto-moves to next question in 1 second

function questionClick(){
	if (quizEnded || isWaitingForNext) return;

	isWaitingForNext = true;

	// questions timer when user answers 
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

	if(this.value != shuffledQuestions[currentQuestionIndex].answer){
		time -= 10;
		if (time < 0){
			time = 0;
		}
		updateTimerDisplay();
		feedbackEl.textContent = `Wrong! Correct: ${shuffledQuestions[currentQuestionIndex].answer}`;
		feedbackEl.style.color = "red";

	}
	else{
		score += 5;
		feedbackEl.textContent = "Correct!";
		feedbackEl.style.color = "green";
	}
	feedbackEl.setAttribute("class", "feedback");

	//Auto-move to next question after 1 second (reduced from 1.5s)
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
	}, 1000)
}


// STEP 12 ->  QUIZ END - PREVENT MULTIPLE CALLS
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
		passFailMessageEl.textContent = "You are Passed in Exam";
		passFailMessageEl.style.color = "green";
		passFailMessageEl.style.fontWeight = "bold";
		passFailMessageEl.style.fontSize = "22px";

	}
	else{
		passFailMessageEl.textContent = "You did not pass the exam.";
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

// STEP 13 -> Redirect To Home
// New functions to reset and go back to home page
function redirectToHome(){
	let endScreenEl = document.getElementById("quiz-end");
	endScreenEl.setAttribute("class", "hide");

	let landingScreenEl = document.getElementById("star-screen");
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

// STEP 14 -> CLOCK TICK - TIMER ENDS
//Shows "00:00" when timer ends and auto-ends quiz
function clockTick(){
	time--;
	updateTimerDisplay();

	if(time <= 0){
		timerEl.textContent = "00:00" // show formatted zero
		if(!quizEnded){
			feedbackEl.textContent = "Time's Up!";
			feedbackEl.style.color = "red";
			feedbackEl.setAttribute("class", "feedback");
			setTimeout(function(){
				feedbackEl.setAttribute("class", "feedback hide");
			}, 2000);
			quizEnd();
		}
	}
}

// STEP 15 -> SAVE SCORE - VALIDATION
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
		alert("Please enter your name before submitting!")
	}
}


// STEP 16 -> RESTART BUTTON
// New functionality to go back to home page
function checkForEnter(event){
	if (event.key === "Enter"){
		saveHighscore();
	}
}

nameEl.onkeyup = checkForEnter;
submitBtn.onclick = saveHighscore;
startBtn.onclick  = quizStart;

// Restat button handler
if (reStartBtn){
	reStartBtn.onclick = function(){
		redirectToHome();
	}
}