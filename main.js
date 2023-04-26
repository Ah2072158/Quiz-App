// select elements
let countSpan = document.querySelector(".quiz-info .count span");
let bullets = document.querySelector(".bullets")
let bulletsSpanContainer = document.querySelector(".bullets .spans")
let quizArea = document.querySelector(".quiz-area");
let answersArea = document.querySelector(".answers-area");
let submitButton = document.querySelector(".submit-button");
let resultsContainer = document.querySelector(".results");
let quizApp = document.querySelector("quiz-app")
let countdownElement = document.querySelector(".countdown");





// set options
let currentIndex = 0;
let rightAnswers = 0;
let maxQuestions = 10; // maximum number of questions
let countdownInterval;

function shuffle(array) {
    let currentIndex = array.length;
    let temporaryValue, randomIndex;

    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}


function getQuestions() {

    let myRequest = new XMLHttpRequest();

    myRequest.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            let questionsObject = JSON.parse(this.responseText)
            let questionsCount = questionsObject.length;

            // shuffle questions
            questionsObject = shuffle(questionsObject);

            // set maximum number of questions
            if (questionsCount > maxQuestions) {
                questionsCount = maxQuestions;
            }

            //create Bullets + set questions count
            createBullets(questionsCount);

            // add question data
            addQuestionData(questionsObject[currentIndex], questionsCount);

            // click on submit button
            // count down
            countdown(165, questionsCount);

            submitButton.onclick = function() {

                // get right answer
                let theRightAnswer = questionsObject[currentIndex].correct_answer;

                // increase index
                currentIndex++;

                //check the answer
                checkAnswer(theRightAnswer, questionsCount);

                // remove previous questions
                quizArea.innerHTML = "";
                answersArea.innerHTML = "";

                // add question data
                addQuestionData(questionsObject[currentIndex], questionsCount);

                // handel bullets class
                handelBullets();

                // count down
                clearInterval(countdownInterval);
                countdown(165, questionsCount);

                // show results
                showResults(questionsCount);
            }

        }
    };

    myRequest.open("GET", "questions.json", true);
    myRequest.send();
}
getQuestions();

function endQuiz() {
    // show result
    result.innerHTML = `Your score is ${rightAnswers} out of ${maxQuestions}`;

    // hide submit button
    submitButton.style.display = "none";
}

function createBullets(num) {
    countSpan.innerHTML = num;
    // create spans
    for (let i = 0; i < num; i++) {

        //create span
        let theBullet = document.createElement("span");

        if (i === 0) {
            theBullet.className = "on";

        }

        // append bullets to main bullet container
        bulletsSpanContainer.appendChild(theBullet);
    }

}

function addQuestionData(obj, count) {
    if (currentIndex < count) {
        //create h2 question title
        let questionTitle = document.createElement("h2");

        // create question text
        let questionText = document.createTextNode(obj['question']);

        // append text to h2
        questionTitle.appendChild(questionText);

        //append the h2 to the quiz area
        quizArea.appendChild(questionTitle);

        // create the answers
        let answers = [...obj['incorrect_answers'], obj['correct_answer']];
        answers = answers.sort(() => Math.random() - 0.5); // shuffle answers

        for (let i = 0; i < answers.length; i++) {
            //create main answer div
            let mainDiv = document.createElement("div");

            //add class to main div 
            mainDiv.className = "answer";

            // create radio input
            let radioInput = document.createElement("input");

            //add type + name + id + data attribute
            radioInput.name = "question";
            radioInput.type = "radio";
            radioInput.id = `answer_${i}`;
            radioInput.dataset.answer = answers[i];

            // create labels
            let theLabel = document.createElement("label");
            //add for attribute
            theLabel.htmlFor = `answer_${i}`;

            //create label text
            let theLabelText = document.createTextNode(answers[i]);
            // add the text to label
            theLabel.appendChild(theLabelText);

            //add input + label to main div
            mainDiv.appendChild(radioInput);
            mainDiv.appendChild(theLabel);

            // append all divs to answers area
            answersArea.appendChild(mainDiv)
        }
    }
}

function checkAnswer(theRightAnswer, count) {


    let answers = document.getElementsByName("question")
    let theChosenAnswer;

    for (let i = 0; i < answers.length; i++) {

        if (answers[i].checked) {
            theChosenAnswer = answers[i].dataset.answer;
        }
    }

    if (theRightAnswer === theChosenAnswer) {
        rightAnswers++;
    }
}

function handelBullets() {
    let bulletsSpans = document.querySelectorAll(".bullets .spans span");
    let arrayOfSpans = Array.from(bulletsSpans);
    arrayOfSpans.forEach((span, index) => {
        if (currentIndex === index) {
            span.className = "on"
        }
    });
}

function showResults(count) {
    let theResults;
    if (currentIndex === count) {
        quizArea.remove();
        answersArea.remove();
        submitButton.remove();
        bullets.remove();

        if (rightAnswers > count / 2 && rightAnswers < count) {
            theResults = `<span class="good">Good</span>, ${rightAnswers} From ${count}`;
        } else if (rightAnswers === count) {
            theResults = `<span class="perfect">Perfect</span>, All Answers Is Good`;
        } else {
            theResults = `<span class="bad">Bad</span>, ${rightAnswers} From ${count}`;
        }

        resultsContainer.innerHTML = theResults;
        resultsContainer.style.padding = "10px";
        resultsContainer.style.backgroundColor = "#0075ff";
        resultsContainer.style.marginTop = "10px";
    }
}

function countdown(duraion, count) {
    if (currentIndex < count) {
        let minutes, seconds;
        countdownInterval = setInterval(function() {
            minutes = parseInt(duraion / 60);
            seconds = parseInt(duraion % 60);



            minutes = minutes < 10 ? `0${minutes}` : minutes;
            seconds = seconds < 10 ? `0${seconds}` : seconds;
            countdownElement.innerHTML = `${minutes}:${seconds}`;

            if (--duraion < 0) {
                clearInterval(countdownInterval);
                submitButton.click();
            }

        }, 1000)
    }

}