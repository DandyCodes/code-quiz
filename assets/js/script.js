const startingTime = 75;
const penaltyTime = 15;
let timer = startingTime;
let questions = [];
let currentQuestionIndex = -1;
let tickInterval = null;

init();

function init() {
    $('#leader-board-button').on('click', showLeaderBoard);
    $('#back-button').on('click', readyGame);
    $('#reset-button').on('click', resetLeaderBoard)
    $('.option').on('click', optionSelected);
    $('#submit-entry-button').on('click', storeEntry);
    $.getJSON('./assets/JSON/questions.json', json => {
        questions = json['questions'];
        readyGame();
        $('main').removeClass('d-none');
        $('#start-button').on('click', startGame);
    });
}

function resetLeaderBoard() {
    localStorage.setItem('leaderBoard', null);
    showLeaderBoard();
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
    if (currentQuestionIndex == questions.length) {
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
    $('#entry-input-section').show();
    $('#time-section').show();
}

function storeEntry() {
    const entry = {
        name: $('#entry-input').val(),
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
        const $entryName = $('<h3>').text(entry.name);
        const $entryScore = $('<p>').text(entry.score);
        $('#leader-board-section').append($entryName, $entryScore);
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