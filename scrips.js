// ==========================
// Theme Toggle Functionality
// ==========================
const themeToggleButton = document.getElementById('theme-toggle');

themeToggleButton.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    themeToggleButton.textContent = document.body.classList.contains('dark-mode') ? 'Light Mode' : 'Dark Mode';
});

// ==========================
// DOM Elements
// ==========================
const questionForm = document.getElementById("question-form");
const questionContainer = document.querySelector(".questions");
const searchInput = document.querySelector('.search-box input');

// ==========================
// Search Functionality
// ==========================
searchInput.addEventListener('input', function (event) {
    const searchTerm = event.target.value.toLowerCase();
    const questions = getQuestionsFromLocalStorage();
    const filteredQuestions = questions.filter(q => 
        q.question.toLowerCase().includes(searchTerm) || 
        q.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    );
    renderQuestions(filteredQuestions);
});

// ==========================
// Fetch Questions from data.json
// ==========================
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

// ==========================
// LocalStorage Functions
// ==========================
function saveQuestionsToLocalStorage(questions) {
    localStorage.setItem("questions", JSON.stringify(questions));
}

function getQuestionsFromLocalStorage() {
    const storedQuestions = localStorage.getItem("questions");
    return storedQuestions ? JSON.parse(storedQuestions) : [];
}

// ==========================
// Render Questions
// ==========================
function renderQuestions(questions) {
    questionContainer.innerHTML = ""; 

    questions.forEach((q, index) => {
        const questionDiv = document.createElement("div");
        questionDiv.classList.add("question");
        questionDiv.innerHTML = `
            <h3>${q.question}</h3>
            <p>Tags: ${q.tags.map(tag => `<span class="tag">${tag}</span>`).join(", ")}</p>
            <p>Description: ${q.description}</p>
            <p>Asked by: <span class="user">${q.user}</span></p>
            <p>Answers: ${q.answers.length}</p>
            <p>Votes: ${q.votes}</p>
            <button class="vote-btn" onclick="voteQuestion(${index}, 'upvote')">Upvote</button>
            <button class="vote-btn" onclick="voteQuestion(${index}, 'downvote')">Downvote</button>
        `;
        questionContainer.appendChild(questionDiv);
    });
}

// ==========================
// Add New Question
// ==========================
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

// ==========================
// Handle Form Submission
// ==========================
function handleFormSubmit(event) {
    event.preventDefault();

    const title = document.getElementById("question-title").value;
    const tags = Array.from(document.querySelectorAll("#question-tags input:checked")).map(checkbox => checkbox.value);
    const description = document.getElementById("question-details").value.trim();

    addQuestion(title, tags, description);

    questionForm.reset();
}

// ==========================
// Voting Functionality
// ==========================
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

// ==========================
// Initialize App
// ==========================
function initializeApp() {
    const storedQuestions = getQuestionsFromLocalStorage();
    if (storedQuestions.length > 0) {
        renderQuestions(storedQuestions);
    } else {
        fetchQuestions(); 
    }
}

// ==========================
// Event Listeners
// ==========================
questionForm.addEventListener("submit", handleFormSubmit);
initializeApp();