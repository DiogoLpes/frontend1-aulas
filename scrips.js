import { getPosts, createPost, updatePost } from "./api/api.js";
const techAPI = "https://dev.to/api/articles?top=1&per_page=1";    

// DOM Elements
const questionForm = document.getElementById("question-form");
const postList = document.getElementById("post-list");
const themeToggleButton = document.getElementById('theme-toggle');
const searchInput = document.getElementById("search-box");

// Theme Toggle
themeToggleButton.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    themeToggleButton.textContent = document.body.classList.contains('dark-mode') ? 'Light Mode' : 'Dark Mode';
});

// Fetch and Display Tech Articles

fetch(techAPI)
    .then(response => response.json())
    .then(data => {
        const articleList = document.getElementById('article-list');
        data.forEach(article => {
            const articleItem = document.createElement('li');
            articleItem.innerHTML = `
                <h3>${article.title}</h3>
                <p>${article.description}</p>
                <a href="${article.url}" target="_blank">Read more</a>
            `;
            articleList.appendChild(articleItem);
        });
    }
    )
    .catch(error => console.error('Error fetching articles:', error));



// Fetch and Display Questions
async function fetchQuestions() {
    try {
        const questions = await getPosts();
        displayPosts(questions);
    } catch (error) {
        console.error("Error fetching questions:", error);
    }
}

function displayPosts(questions) {
    postList.innerHTML = "";
    questions.forEach((question) => {
        const postItem = document.createElement("div");
        postItem.classList.add("post-item", "question");
        postItem.innerHTML = `
            <h3>${question.question}</h3>
            <p>${question.description}</p>
            <p><strong>User:</strong> ${question.user}</p>
            <p><strong>Votes:</strong> ${question.votes}</p>
            <button class="vote-btn like" data-id="${question.id}">Like</button>
            <button class="vote-btn dislike" data-id="${question.id}">Dislike</button>
        `;
        postList.appendChild(postItem);
    });
}



// Add search functionality
searchInput.addEventListener("input", () => {
    returnedQuestions = questions.filter(question =>
        question.question.toLowerCase().includes(searchInput.value.toLowerCase())
    );
});

// Handle Voting
async function handleVote(event) {
    const questionId = event.target.dataset.id;
    const isLike = event.target.classList.contains('like');

    try {
        const questions = await getPosts();
        const question = questions.find(q => q.id == questionId);
        question.votes += isLike ? 1 : -1;
        await updatePost(questionId, question);
        fetchQuestions(); // Refresh the list
    } catch (error) {
        console.error("Error voting:", error);
    }
}

// Add New Question
async function addQuestion(title, description) {
    const newQuestion = {
        question: title,
        description: description,
        user: "Anonymous",
        votes: 0,
        answers: []
    };

    try {
        await createPost(newQuestion);
        fetchQuestions(); // Refresh the list
    } catch (error) {
        console.error("Error adding question:", error);
    }
}

// Handle Form Submission
function handleFormSubmit(event) {
    event.preventDefault();
    const title = document.getElementById("question-title").value.trim();
    const description = document.getElementById("question-details").value.trim();
    if (!title || !description) {
        alert("Please fill out all fields.");
        return;
    }
    addQuestion(title, description);
    questionForm.reset();
}

// Initialize the app
// Initialize App
function initializeApp() {
    fetchQuestions();
    questionForm.addEventListener("submit", handleFormSubmit);
}
initializeApp();