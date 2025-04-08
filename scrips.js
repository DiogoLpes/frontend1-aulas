
import { getPosts, createPost, updatePost, deletePost } from "./api/api.js";

// ==========================
// DOM Elements
// ==========================
const questionForm = document.getElementById("question-form");
const questionContainer = document.querySelector(".questions");
const searchInput = document.querySelector('.search-box input');

// ==========================
// Theme Toggle Functionality
// ==========================
const themeToggleButton = document.getElementById('theme-toggle');

themeToggleButton.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    themeToggleButton.textContent = document.body.classList.contains('dark-mode') ? 'Light Mode' : 'Dark Mode';
});

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
// Fetch and Render Questions
// ==========================
async function fetchQuestions() {
    try {
        const questions = await getPosts();
        renderQuestions(questions);
    } catch (error) {
        console.error("Error fetching questions:", error);
    }
}

// ==========================
// Render Questions
// ==========================
function renderQuestions(questions) {
    questionContainer.innerHTML = "";

    questions.forEach((q) => {
        const questionDiv = document.createElement("div");
        questionDiv.classList.add("question");
        questionDiv.innerHTML = `
            <h3>${q.question}</h3>
            <p>Tags: ${q.tags.map(tag => `<span class="tag">${tag}</span>`).join(", ")}</p>
            <p>Description: ${q.description}</p>
            <p>Asked by: <span class="user">${q.user}</span></p>
            <p>Answers: ${q.answers.length}</p>
            <p>Votes: ${q.votes}</p>
            <button class="vote-btn" onclick="voteQuestion(${q.id}, 'upvote')">Upvote</button>
            <button class="vote-btn" onclick="voteQuestion(${q.id}, 'downvote')">Downvote</button>
        `;
        questionContainer.appendChild(questionDiv);
    });
}

// ==========================
// Add New Question
// ==========================
document.getElementById("add-question-btn").addEventListener("click", function () {
    const title = document.getElementById("question-title").value.trim();
    const tags = Array.from(document.querySelectorAll("#question-tags input:checked")).map(checkbox => checkbox.value);
    const description = document.getElementById("question-details").value.trim();

    if (!title || tags.length === 0 || !description) {
        alert("Please fill out all fields and select at least one tag.");
        return;
    }

    addQuestion(title, tags, description);
}
);
// ==========================
// Add Question Function
// ==========================
async function addQuestion(title, tags, description) {
    const newQuestion = {
        question: title,
        tags: tags,
        description: description,
        user: "Anonymous",
        answers: [],
        votes: 0,
    };

    try {
        await createPost(newQuestion);
        fetchQuestions(); // Refresh the questions list
    } catch (error) {
        console.error("Error adding question:", error);
    }
}

// ==========================
// Handle Form Submission
// ==========================
function handleFormSubmit(event) {
    event.preventDefault();
    const title = document.getElementById("question-title").value.trim();
    const tags = Array.from(document.querySelectorAll("#question-tags input:checked")).map(checkbox => checkbox.value);
    const description = document.getElementById("question-details").value.trim();
    if (!title || tags.length === 0 || !description) {
        alert("Please fill out all fields and select at least one tag.");
        return;
    }
    addQuestion(title, tags, description);
    questionForm.reset();
}

// ==========================
// Voting Functionality
// ==========================
async function voteQuestion(questionId, type) {
    try {
        const question = await getPost(questionId);
        const updatedVotes = type === "upvote" ? question.votes + 1 : question.votes - 1;

        await updatePost(questionId, { votes: updatedVotes });
        fetchQuestions(); // Refresh the questions list
    } catch (error) {
        console.error("Error updating votes:", error);
    }
}
voteQuestion();

// ==========================
// Initialize App
// ==========================
function initializeApp() {
    fetchQuestions();
}

// ==========================
// Event Listeners
// ==========================
questionForm.addEventListener("submit", handleFormSubmit);
initializeApp();