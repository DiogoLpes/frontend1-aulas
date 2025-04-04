
const questionForm = document.getElementById("question-form");
const questionContainer = document.querySelector(".questions");

// Fetch questions from data.json
async function fetchQuestions() {
    try {
        const response = await fetch("data.json");
        if (!response.ok) throw new Error("Failed to fetch questions");

        const data = await response.json();
        saveQuestionsToLocalStorage(data.questions); 
        renderQuestions(data.questions); 
    } catch (error) {
        console.error("Error fetching questions:", error);
    }
}

function saveQuestionsToLocalStorage(questions) {
    localStorage.setItem("questions", JSON.stringify(questions));
}


function getQuestionsFromLocalStorage() {
    const storedQuestions = localStorage.getItem("questions");
    return storedQuestions ? JSON.parse(storedQuestions) : [];
}


function renderQuestions(questions) {
    questionContainer.innerHTML = ""; 

    questions.forEach((q, form) => {
        const questionDiv = document.createElement("div");
        questionDiv.classList.add("question");
        questionDiv.innerHTML = `
            <h3>${q.question}</h3>
            <p>Tags: ${q.tags.map(tag => `<span class="tag">${tag}</span>`).join(", ")}</p>
            <p>Description: ${q.description}</p>
            <p>Asked by: <span class="user">${q.user}</span></p>
            <p>Answers: ${q.answers.length}</p>
            <p>Votes: ${q.votes}</p>
            <button class="vote-btn" onclick="voteQuestion(${form}, 'upvote')">Upvote</button>
            <button class="vote-btn" onclick="voteQuestion(${form}, 'downvote')">Downvote</button>
        `;
        questionContainer.appendChild(questionDiv);
    });
}


function addQuestion(title, tags, description) {
    const newQuestion = {
        question: title,
        tags: tags,
        description: description,
        user: "Anonymous", 
        answers: [],
        votes: 0,
    };

    const questions = getQuestionsFromLocalStorage();
    questions.push(newQuestion);
    saveQuestionsToLocalStorage(questions);
    renderQuestions(questions);
}


function handleFormSubmit(event) {
    event.preventDefault();

    const title = document.getElementById("question-title").value;
    const tags = Array.from(document.getElementById("question-tags").selectedOptions).map(option => option.value);
    const description = document.getElementById("question-details").value;


    addQuestion(title, tags, description);
    questionForm.reset();
}
questionForm.addEventListener("submit", handleFormSubmit);


function voteQuestion(index, type) {
    const questions = getQuestionsFromLocalStorage();

    if (type === "upvote") {
        questions[index].votes++;
    } else if (type === "downvote") {
        questions[index].votes--;
    }

    saveQuestionsToLocalStorage(questions);
    renderQuestions(questions);
}


function initializeApp() {
    const storedQuestions = getQuestionsFromLocalStorage();
    if (storedQuestions.length > 0) {
        renderQuestions(storedQuestions);
    } else {
        fetchQuestions(); 
    }
}

initializeApp();