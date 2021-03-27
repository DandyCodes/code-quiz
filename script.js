const jStartButton = $('#start');
const jLeaderboardButton = $('#leaderboard');
const jQuestion = $('#question');
const jTime = $('#time');

let questions = [];
let timer = 0;

$.getJSON('questions.json', function(json) {
    questions = json['questions'];
    jStartButton.on('click', startGame);
    readyGame();
})

function readyGame() {
    timer = 0;
    jTime.text(timer);
    const question = getRandomQuestion();
    console.log(question);
    const questionText = question[0];
    console.log(questionText);
    const jNewQuestion = $('<h2>').text(questionText);
    jQuestion.append(jNewQuestion);
}

function startGame() {
    
}

function getRandomQuestion() {
    return questions[Math.floor(Math.random() * questions.length)];
}