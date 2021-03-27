const jStartButton = $('#start-button');
const jLeaderButton = $('#leader-button');
const jQuestionBox = $('#question-box');
const jTime = $('#time');
const startTime = 75;
const penaltyTime = 15;

let questions = [];
let currentQuestionIndex = -1;
let timer = 0;
let tickInterval = null;
let jNameInput = null;

let leaderboardEntries = [];
if (JSON.parse(localStorage.getItem('leaderboardEntries')) != null) {
    leaderboardEntries = JSON.parse(localStorage.getItem('leaderboardEntries'));
}

jLeaderButton.on('click', showLeaderboard);

$.getJSON('questions.json', function(json) {
    questions = json['questions'];
    readyGame();
    jStartButton.on('click', startGame);
})

function readyGame() {
    jQuestionBox.empty();
    jStartButton.attr('disabled', false);
    jStartButton.fadeTo(0,1);
    jLeaderButton.attr('disabled', false);
    jLeaderButton.fadeTo(0,1);
    currentQuestionIndex = -1;
    timer = startTime;
    jTime.text(timer);
}

function startGame() {
    jStartButton.attr('disabled', true);
    jStartButton.fadeTo(0,0);
    jLeaderButton.attr('disabled', true);
    jLeaderButton.fadeTo(0,0);
    tickInterval = setInterval(tick, 1000);
    displayNewQuestion();
    jTime.parent().parent().removeClass('bg-success bg-danger');
    jTime.parent().parent().addClass('bg-info');
}

function tick() {
    timer--;
    jTime.text(timer);
    if(timer == 0){
        endGame();
    }
}

function displayNewQuestion() {
    const totalQuestions = 5;
    currentQuestionIndex++;
    if (currentQuestionIndex == totalQuestions) {
        endGame();
        return;
    }
    jQuestionBox.empty();
    const questionObject = questions[currentQuestionIndex];
    const jQuestion = $('<h2>').text(questionObject.questionText);
    jQuestionBox.append(jQuestion);
    const numOptions = 4;
    for (let i = 1; i < numOptions + 1; i++) {
        const jOption = $('<button>').text(i + ') ' + questionObject['option' + i]);
        jOption.css('display', 'block');
        jOption.addClass('btn-lg btn-primary m-3 text-left');
        jOption.on('click', optionSelected)
        jQuestionBox.append(jOption);
    }
}

function optionSelected() {
    if (optionIsCorrect(this)) {
        jTime.parent().parent().removeClass('bg-info bg-danger');
        jTime.parent().parent().addClass('bg-success');
        displayNewQuestion();
        return;
    }
    timer -= penaltyTime;
    jTime.text(timer);
    if(timer <= 0) {
        endGame();
        return;
    }
    jTime.parent().parent().removeClass('bg-info bg-success');
    jTime.parent().parent().addClass('bg-danger');
    displayNewQuestion();
}

function optionIsCorrect(option) {
    return option.textContent.startsWith(questions[currentQuestionIndex].correct);
}

function endGame() {
    clearInterval(tickInterval);
    jTime.parent().parent().removeClass('bg-danger bg-success');
    jTime.parent().parent().addClass('bg-info');
    displayNameInput();
}

function displayNameInput() {
    jQuestionBox.empty();
    const jLabel = $('<label>Enter your name :  </label>');
    jNameInput = $('<input>');
    const jSubmit = $('<button class="btn btn-secondary ml-5">Submit</button>');
    jSubmit.on('click', saveLeaderboardEntry);
    jQuestionBox.append(jLabel, jNameInput, jSubmit);
}

function saveLeaderboardEntry() {
    const entry = {
        name: jNameInput.val(),
        score: jTime.text()
    }
    leaderboardEntries.push(entry);
    localStorage.setItem('leaderboardEntries', JSON.stringify(leaderboardEntries));
    showLeaderboard();
}

function showLeaderboard() {
    jStartButton.attr('disabled', true);
    jStartButton.fadeTo(0,0);
    jLeaderButton.attr('disabled', true);
    jLeaderButton.fadeTo(0,0);
    jQuestionBox.empty();
    const jBackButton = $('<button id="back" class="btn btn-secondary ml-5">Back</button>');
    jBackButton.on('click', back);
    const jResetButton = $('<button id="back" class="btn btn-secondary ml-5">Reset</button>');
    jResetButton.on('click', reset);
    jQuestionBox.append(jBackButton, jResetButton);
    if(leaderboardEntries.length == 0) {
        jQuestionBox.append($('<h3>No entries</h3>'));
        return;
    }
    leaderboardEntries.sort((a, b) => b.score - a.score).forEach(entry => {
        const jEntryName = $('<h3>').text(entry.name);
        const jEntryScore = $('<p>').text(entry.score);
        jQuestionBox.append(jEntryName, jEntryScore);
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