const jStartButton = $('#start');
const jLeaderboardButton = $('#leaderboard');
const jQuestionBox = $('#question');
const jTime = $('#time');

let questions = [];
let currentQuestion = 0;
let timer = 0;

$.getJSON('questions.json', function(json) {
    if (!json) {
        alert('could not load questions.json');
        return;
    }
    questions = json['questions'];
    readyGame();
    jStartButton.on('click', startGame);
})

function readyGame() {
    timer = 0;
    jTime.text(timer);
}

function displayNewQuestion() {
    jQuestionBox.empty();
    const questionObject = getNextQuestion();
    const jQuestion = $('<h2>').text(questionObject.questionText);
    jQuestionBox.append(jQuestion);
    const numOptions = 4;
    for (let i = 1; i < numOptions + 1; i++) {
        const jAnswer = $('<button>').text(i + ') ' + questionObject['option' + i]);
        jAnswer.css('display', 'block');
        jAnswer.addClass('btn-lg btn-primary m-3 text-left')
        jQuestionBox.append(jAnswer);
    }
}

function startGame() {
    jStartButton.attr('disabled', true);
    jStartButton.animate({ opacity: 0 });
    displayNewQuestion();
}

function getNextQuestion() {
    const totalQuestions = 5;
    if (currentQuestion == totalQuestions) {
        endGame();
        return;
    }
    const nextQuestion = questions[currentQuestion];
    currentQuestion++;
    return nextQuestion;
}

function endGame() {

}