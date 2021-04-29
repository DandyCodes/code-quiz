const startingTime = 75;
const penaltyTime = 15;
let timer = startingTime;
let currentQuestionIndex;
let questions;
let tickInterval;
let timeout;

init();

function init() {
    $('#leader-board-button').click(showLeaderBoard);
    $('#back-button').click(ready);
    $('#reset-button').click(resetLeaderBoard);
    $('.option').click(optionSelected);
    $('#submit-entry-button').click(storeEntry);
    $.getJSON('./assets/JSON/questions.json', result => {
        questions = result;
        ready();
        $('main').removeClass('d-none');
        $('#start-button').click(startGame);
    });
}

function resetLeaderBoard() {
    localStorage.setItem('leaderBoard', null);
    showLeaderBoard();
}

function ready() {
    hideAllSections();
    $('#start-leader-section').show();
    timer = startingTime;
    $('#time-span').text(timer);
}

function startGame() {
    currentQuestionIndex = -1;
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
    if (bootstrapClass != "bg-info") {
        clearTimeout(timeout);
        timeout = setTimeout(_ => {setTimeSectionBootstrapClass("bg-info")}, 1250);
    }
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
    if (currentQuestionIndex == questions.length) {
        endGame();
        return;
    }
    const question = questions[currentQuestionIndex];
    $('#question').text(question.text);
    question.options.forEach((option, index) => {
        $(`#option${index}`).text(option);
    });
}

function optionSelected() {
    if (this.textContent === questions[currentQuestionIndex].answer) {
        setTimeSectionBootstrapClass('bg-success');
        displayNextQuestion();
        return;
    }
    timer -= penaltyTime;
    $('#time-span').text(timer);
    if (timer <= 0) {
        endGame();
        return;
    }
    setTimeSectionBootstrapClass('bg-danger');
    displayNextQuestion();
}

function endGame() {
    clearInterval(tickInterval);
    hideAllSections();
    $('#entry-input-section').show();
    $('#time-section').show();
}

function storeEntry() {
    if(!$('#entry-input').val()) {
        alert('Please enter your initials');
        return;
    }
    const entry = {
        initials: $('#entry-input').val(),
        score: $('#time-span').text()
    }
    let leaderBoard = JSON.parse(localStorage.getItem('leaderBoard'));
    if (!leaderBoard) {
        leaderBoard = [];
    }
    leaderBoard.push(entry);
    localStorage.setItem('leaderBoard', JSON.stringify(leaderBoard));
    showLeaderBoard();
}

function showLeaderBoard() {
    hideAllSections();
    $('#back-reset-section').show();
    $('#leader-board-section').show();
    $('#leader-board-section').empty();
    const leaderBoard = JSON.parse(localStorage.getItem('leaderBoard'));
    if (!leaderBoard) {
        $('#leader-board-section').append($('<h3>No entries</h3>'));
        return;
    }
    leaderBoard.sort((a, b) => b.score - a.score);
    leaderBoard.forEach(entry => {
        const $entryInitials = $('<h3>');
        $entryInitials.text(entry.initials);
        const $entryScore = $('<p>');
        $entryScore.text(entry.score);
        $('#leader-board-section').append($entryInitials, $entryScore);
    })
}

function hideAllSections() {
    $('#start-leader-section').hide();
    $('#back-reset-section').hide();
    $('#question-section').hide();
    $('#entry-input-section').hide();
    $('#leader-board-section').hide();
    $('#time-section').hide();
}