const totalQuestions = 5;
const optionsPerQuestion = 4;
const startingTime = 75;
const penaltyTime = 15;

let questions = [];
let currentQuestionIndex = -1;
let timer = 0;
let tickInterval = null;

init();

function init() {
    $('#leaderboard-button').on('click', showLeaderboard);
    $('#back-button').on('click', readyGame);
    $('#reset-button').on('click', () => {
        localStorage.setItem('leaderboard', null);
        showLeaderboard();
    })
    $('.option').on('click', optionSelected);
    $('#submit-entry-button').on('click', storeEntry);
    $.getJSON('./assets/JSON/questions.json', json => {
        questions = json['questions'];
        readyGame();
        $('main').removeClass('d-none');
        $('#start-button').on('click', startGame);
    });
}

function readyGame() {
    hideAllSections();
    $('#start-leader-section').show();
    timer = startingTime;
    $('#time-span').text(timer);
    currentQuestionIndex = -1;
}

function startGame() {
    hideAllSections();
    $('#question-section').show();
    $('#time-section').show();
    setTimeSectionBootstrapClass('bg-info');
    tickInterval = setInterval(tick, 1000);
    displayNextQuestion();
}

function setTimeSectionBootstrapClass(bootstrapClass) {
    $('#time-section').removeClass('bg-danger bg-success bg-info');
    $('#time-section').addClass(bootstrapClass);
}

function tick() {
    timer--;
    $('#time-span').text(timer);
    if(timer == 0){
        endGame();
    }
}

function displayNextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex == totalQuestions) {
        endGame();
        return;
    }
    const question = questions[currentQuestionIndex];
    $('#question').text(question.text);
    displayOptions();

    function displayOptions() {
        question.options.forEach((option, index) => {
            const optionNumber = index + 1;
            $(`#option${optionNumber}`).text(`${optionNumber}) ${option}`);
        });
    }
}

function optionSelected() {
    if (optionIsCorrect(this)) {
        setTimeSectionBootstrapClass('bg-success');
        displayNextQuestion();
        return;
    }
    timer -= penaltyTime;
    $('#time-span').text(timer);
    if(timer <= 0) {
        endGame();
        return;
    }
    setTimeSectionBootstrapClass('bg-danger');
    displayNextQuestion();
}

function optionIsCorrect(option) {
    return option.textContent.startsWith(questions[currentQuestionIndex].answer);
}

function endGame() {
    clearInterval(tickInterval);
    setTimeSectionBootstrapClass('bg-info');
    hideAllSections();
    $('#time-section').show();
    $('#entry-input-section').show();
}

function storeEntry() {
    const entry = {
        name: $('#entry-input').val(),
        score: $('#time-span').text()
    }
    let leaderboard = JSON.parse(localStorage.getItem('leaderboard'));
    if (!leaderboard) {
        leaderboard = [];
    }
    leaderboard.push(entry);
    localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
    showLeaderboard();
}

function showLeaderboard() {
    hideAllSections();
    $('#back-reset-section').show();
    $('#leaderboard-section').show();
    $('#leaderboard-section').empty();
    const leaderboard = JSON.parse(localStorage.getItem('leaderboard'));
    if (!leaderboard) {
        $('#leaderboard-section').append($('<h3>No entries</h3>'));
        return;
    }
    leaderboard.sort((a, b) => b.score - a.score).forEach(entry => {
        const $entryName = $('<h3>').text(entry.name);
        const $entryScore = $('<p>').text(entry.score);
        $('#leaderboard-section').append($entryName, $entryScore);
    })
}

function hideAllSections() {
    $('#start-leader-section').hide();
    $('#back-reset-section').hide();
    $('#question-section').hide();
    $('#entry-input-section').hide();
    $('#leaderboard-section').hide();
    $('#time-section').hide();
}