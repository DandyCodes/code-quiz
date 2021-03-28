const $startButton = $('#start-button');
const $leaderboardButton = $('#leaderboard-button');
const $questionSection = $('#question-section');
const $timeSection = $('#time-section');
const $timeSpan = $('#time-span');
const startTime = 75;
const penaltyTime = 15;
const totalQuestions = 5;
const optionsPerQuestion = 4;

let questions = [];
let currentQuestionIndex = -1;
let timer = 0;
let tickInterval = null;
let leaderboard = [];

init();

function init() {
    const savedLeaderboard = JSON.parse(localStorage.getItem('leaderboard'));
    if (savedLeaderboard) {
        leaderboard = savedLeaderboard;
    }
    $leaderboardButton.on('click', showLeaderboard);
    $.getJSON('questions.json', json => {
        questions = json['questions'];
        readyGame();
        $startButton.on('click', startGame);
    });
}

function readyGame() {
    $questionSection.empty();
    $questionSection.text('Click start to begin!');
    showStartAndLeaderboardButtons();
    resetTimer();
    currentQuestionIndex = -1;
}

function showStartAndLeaderboardButtons() {
    $startButton.attr('disabled', false);
    $startButton.fadeTo(0, 1);
    $leaderboardButton.attr('disabled', false);
    $leaderboardButton.fadeTo(0, 1);
}

function resetTimer() {
    timer = startTime;
    $timeSpan.text(timer);
}

function startGame() {
    hideStartAndLeaderboardButtons();
    setTimeSectionBootstrapClass('bg-info');
    tickInterval = setInterval(tick, 1000);
    nextQuestion();
}

function hideStartAndLeaderboardButtons() {
    $startButton.attr('disabled', true);
    $startButton.fadeTo(0, 0);
    $leaderboardButton.attr('disabled', true);
    $leaderboardButton.fadeTo(0, 0);
}

function setTimeSectionBootstrapClass(bootstrapClass) {
    $timeSection.removeClass('bg-danger bg-success bg-info');
    $timeSection.addClass(bootstrapClass);
}

function tick() {
    timer--;
    $timeSpan.text(timer);
    if(timer == 0){
        endGame();
    }
}

function nextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex == totalQuestions) {
        endGame();
        return;
    }
    displayQuestion(questions[currentQuestionIndex]);
}

function displayQuestion(question) {
    $questionSection.empty();
    const $questionText = $('<h2>');
    $questionText.text(question.text);
    $questionSection.append($questionText);
    displayOptions(question.options);
}

function displayOptions(options) {
    options.forEach((option, index) => {
        const optionNumber = index + 1;
        const formattedOptionText = `${optionNumber}) ${option}`;
        const $option = $('<button>');
        $option.text(formattedOptionText);
        $option.css('display', 'block');
        $option.addClass('btn-lg btn-primary m-3 text-left');
        $option.on('click', optionSelected);
        $questionSection.append($option);
    });
}

function optionSelected() {
    if (optionIsCorrect(this)) {
        setTimeSectionBootstrapClass('bg-success');
        nextQuestion();
        return;
    }
    timer -= penaltyTime;
    $timeSpan.text(timer);
    if(timer <= 0) {
        endGame();
        return;
    }
    setTimeSectionBootstrapClass('bg-danger');
    nextQuestion();
}

function optionIsCorrect(option) {
    return option.textContent.startsWith(questions[currentQuestionIndex].answer);
}

function endGame() {
    clearInterval(tickInterval);
    setTimeSectionBootstrapClass('bg-info');
    displayNameInput();
}

function displayNameInput() {
    $questionSection.empty();
    const $label = $('<label>');
    $label.text('Enter your name : ');
    const $nameInput = $('<input>');
    const $submit = $('<button>');
    $submit.text('Submit');
    $submit.addClass('btn btn-secondary ml-5');
    $questionSection.append($label, $nameInput, $submit);
    $submit.on('click', () => {
        const entry = {
            name: $nameInput.val(),
            score: $timeSpan.text()
        }
        leaderboard.push(entry);
        localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
        showLeaderboard();
    })
}

function showLeaderboard() {
    hideStartAndLeaderboardButtons();
    $questionSection.empty();
    $questionSection.append(createBackButton(), createResetButton());
    if(leaderboard.length == 0) {
        $questionSection.append($('<h3>No entries</h3>'));
        return;
    }
    leaderboard.sort((a, b) => b.score - a.score).forEach(entry => {
        const $entryName = $('<h3>').text(entry.name);
        const $entryScore = $('<p>').text(entry.score);
        $questionSection.append($entryName, $entryScore);
    })
}

function createBackButton() {
    const $backButton = $('<button>');
    $backButton.attr('id', 'back');
    $backButton.addClass('btn btn-secondary ml-5');
    $backButton.text('Back');
    $backButton.on('click', readyGame);
    return $backButton;
}

function createResetButton() {
    const $resetButton = $('<button>');
    $resetButton.addClass('btn btn-secondary ml-5');
    $resetButton.text('Reset');
    $resetButton.on('click', () => {
        localStorage.setItem('leaderboard', null);
        leaderboard = [];
        showLeaderboard();
    });
    return $resetButton;
}