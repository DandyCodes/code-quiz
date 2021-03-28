const $startButton = $('#start-button');
const $leaderButton = $('#leader-button');
const $questionBox = $('#question-box');
const $time = $('#time');
const startTime = 75;
const penaltyTime = 15;
const totalQuestions = 5;
const numOptions = 4;

let questions = [];
let currentQuestionIndex = -1;
let timer = 0;
let tickInterval = null;

let leaderboardEntries = [];
if (JSON.parse(localStorage.getItem('leaderboardEntries')) != null) {
    leaderboardEntries = JSON.parse(localStorage.getItem('leaderboardEntries'));
}

$leaderButton.on('click', showLeaderboard);

$.getJSON('questions.json', function(json) {
    questions = json['questions'];
    readyGame();
    $startButton.on('click', startGame);
})

function readyGame() {
    $questionBox.empty();
    $questionBox.text('Click start to begin!');
    $startButton.attr('disabled', false);
    $startButton.fadeTo(0,1);
    $leaderButton.attr('disabled', false);
    $leaderButton.fadeTo(0,1);
    currentQuestionIndex = -1;
    timer = startTime;
    $time.text(timer);
}

function startGame() {
    $startButton.attr('disabled', true);
    $startButton.fadeTo(0,0);
    $leaderButton.attr('disabled', true);
    $leaderButton.fadeTo(0,0);
    tickInterval = setInterval(tick, 1000);
    displayNewQuestion();
    $time.parent().parent().removeClass('bg-danger');
    $time.parent().parent().addClass('bg-info');
}

function tick() {
    timer--;
    $time.text(timer);
    if(timer == 0){
        endGame();
    }
}

function displayNewQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex == totalQuestions) {
        endGame();
        return;
    }
    $questionBox.empty();
    const questionObject = questions[currentQuestionIndex];
    const $question = $('<h2>').text(questionObject.questionText);
    $questionBox.append($question);
    for (let i = 1; i < numOptions + 1; i++) {
        const $option = $('<button>').text(i + ') ' + questionObject['option' + i]);
        $option.css('display', 'block');
        $option.addClass('btn-lg btn-primary m-3 text-left');
        $option.on('click', optionSelected)
        $questionBox.append($option);
    }
}

function optionSelected() {
    if (optionIsCorrect(this)) {
        $time.parent().parent().removeClass('bg-danger');
        $time.parent().parent().addClass('bg-info');
        displayNewQuestion();
        return;
    }
    timer -= penaltyTime;
    $time.text(timer);
    if(timer <= 0) {
        endGame();
        return;
    }
    $time.parent().parent().removeClass('bg-info');
    $time.parent().parent().addClass('bg-danger');
    displayNewQuestion();
}

function optionIsCorrect(option) {
    return option.textContent.startsWith(questions[currentQuestionIndex].correct);
}

function endGame() {
    clearInterval(tickInterval);
    $time.parent().parent().removeClass('bg-danger');
    $time.parent().parent().addClass('bg-info');
    displayNameInput();
}

function displayNameInput() {
    $questionBox.empty();
    const $label = $('<label>Enter your name :  </label>');
    const $nameInput = $('<input>');
    const $submit = $('<button class="btn btn-secondary ml-5">Submit</button>');
    $questionBox.append($label, $nameInput, $submit);
    $submit.on('click', function() {
        const entry = {
            name: $nameInput.val(),
            score: $time.text()
        }
        leaderboardEntries.push(entry);
        localStorage.setItem('leaderboardEntries', JSON.stringify(leaderboardEntries));
        showLeaderboard();
    })
}

function showLeaderboard() {
    $startButton.attr('disabled', true);
    $startButton.fadeTo(0,0);
    $leaderButton.attr('disabled', true);
    $leaderButton.fadeTo(0,0);
    $questionBox.empty();
    const $backButton = $('<button id="back" class="btn btn-secondary ml-5">Back</button>');
    $backButton.on('click', back);
    const $resetButton = $('<button id="back" class="btn btn-secondary ml-5">Reset</button>');
    $resetButton.on('click', reset);
    $questionBox.append($backButton, $resetButton);
    if(leaderboardEntries.length == 0) {
        $questionBox.append($('<h3>No entries</h3>'));
        return;
    }
    leaderboardEntries.sort((a, b) => b.score - a.score).forEach(entry => {
        const $entryName = $('<h3>').text(entry.name);
        const $entryScore = $('<p>').text(entry.score);
        $questionBox.append($entryName, $entryScore);
    })
}

function back() {
    $('#back').remove();
    readyGame();
}

function reset() {
    localStorage.setItem('leaderboardEntries', null);
    leaderboardEntries = [];
    showLeaderboard();
}