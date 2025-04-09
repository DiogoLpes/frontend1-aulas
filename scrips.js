
import { getPosts } from "./api/api.js";

// ==========================
// DOM Elements
// ==========================
const questionForm = document.getElementById("question-form");

// ==========================
// Theme Toggle Functionality
// ==========================
const themeToggleButton = document.getElementById('theme-toggle');

themeToggleButton.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    themeToggleButton.textContent = document.body.classList.contains('dark-mode') ? 'Light Mode' : 'Dark Mode';
});

// ==========================
// Fetch and Display Questions
// ==========================
async function fetchQuestions() {
    try {
        const questions = await getPosts();
        displayPosts(questions);
    } catch (error) {
        console.error("Error fetching questions:", error);
    }
}

function displayPosts(questions) {
    const postList = document.getElementById("post-list");
    postList.innerHTML = "";
    questions.forEach((question) => {
        const postItem = document.createElement("div");
        postItem.classList.add("post-item");
        postItem.classList.add("question");
        postItem.innerHTML = `
            
            <h3>${question.question}</h3>
            <p>${question.description}</p>
            <p><strong>User:</strong> ${question.user}</p>
            <p><strong>Votes:</strong> ${question.votes}</p>
            <button class="vote-btn" data-id="${question.id}">Like</button>
            <button class="vote-btn" data-id="${question.id}">Dislike</button>
        `;
        postList.appendChild(postItem);
    });
}


    // ==========================
    // Add New Question
    // ==========================
    document.getElementById("add-question-btn").addEventListener("click", function () {
        const title = document.getElementById("question-title").value.trim();
        const description = document.getElementById("question-details").value.trim();
        if (!title || !description) {
            alert("Please fill out all fields.");
            return;
        }
    }
    );

    // ==========================
    // Add Question Function
    // ==========================
    async function addQuestion(title, description) {
        const newQuestion = {
            question: title,
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
        const description = document.getElementById("question-details").value.trim();
        if (!title || !description) {
            alert("Please fill out all fields and select at least one tag.");
            return;
        }
        addQuestion(title, description);
        questionForm.reset();
    }

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