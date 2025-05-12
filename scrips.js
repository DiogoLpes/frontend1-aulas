import { getPosts, createPost, updatePost } from "./api/api.js";
const techAPI = "https://dev.to/api/articles?top=1&per_page=5";

// DOM Elements
const questionForm = document.getElementById("question-form");
const postList = document.getElementById("post-list");
const themeToggleButton = document.getElementById('theme-toggle');
const newsContainer = document.getElementById("news-container");
const refreshBtn = document.getElementById("refresh-btn");
const searchInput = document.getElementById("search-box");

// Theme Toggle
if (themeToggleButton) {
    themeToggleButton.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        themeToggleButton.textContent = document.body.classList.contains('dark-mode') ? 'Light Mode' : 'Dark Mode';
        localStorage.setItem('dark-mode', document.body.classList.contains('dark-mode'));
    });
}

// Check for dark mode preference
if (localStorage.getItem('dark-mode') === 'true') {
    document.body.classList.add('dark-mode');
    themeToggleButton.textContent = 'Light Mode';
} else {
    document.body.classList.remove('dark-mode');
    themeToggleButton.textContent = 'Dark Mode';
}

// ========== QUESTION FUNCTIONS ========== //

// Fetch and display questions
async function fetchAndDisplayQuestions() {
    if (!postList) return;

    try {
        postList.innerHTML = '<div class="loading">Loading questions...</div>';
        const questions = await getPosts();
        displayPosts(questions);
    } catch (error) {
        console.error("Error fetching questions:", error);
        postList.innerHTML = `<div class="error">Failed to load questions. Please try again later.</div>`;
    }
}

// Display posts in the UI
function displayPosts(questions) {
    if (!postList) return;

    postList.innerHTML = "";
    
    // Filter questions if search term exists
    const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
    const filteredQuestions = searchTerm 
        ? questions.filter(q => 
            q.question.toLowerCase().includes(searchTerm) || 
            q.description.toLowerCase().includes(searchTerm))
        : questions;

    if (filteredQuestions.length === 0) {
        postList.innerHTML = '<div class="no-results">No questions found</div>';
        return;
    }

    filteredQuestions.forEach((question) => {
        const postItem = document.createElement("div");
        postItem.classList.add("post-item", "question");
        postItem.innerHTML = `
            <div class="question-header">
                <h3>${question.question}</h3>
                <div class="vote-buttons">
                    <button class="vote-btn like" data-id="${question.id}">▲</button>
                    <span class="vote-count">${question.votes}</span>
                    <button class="vote-btn dislike" data-id="${question.id}">▼</button>
                </div>
            </div>
            <p class="question-body">${question.description}</p>
            <p class="question-user"><strong>Asked by:</strong> ${question.user}</p>
            <div class="comments-section">
                <h4>Comments (${question.comments?.length || 0}):</h4>
                <ul class="comments-list">
                    ${question.comments?.map(comment => `
                        <li class="comment">
                            <span class="comment-text">${comment}</span>
                        </li>
                    `).join("") || '<li>No comments yet</li>'}
                </ul>
                <div class="add-comment">
                    <input type="text" class="comment-input" placeholder="Add a comment..." />
                    <button class="comment-btn" data-id="${question.id}">Post Comment</button>
                </div>
            </div>
        `;
        postList.appendChild(postItem);
    });

    // Add event listeners
    addEventListeners();
}

// Add all event listeners
function addEventListeners() {
    // Comment buttons
    document.querySelectorAll(".comment-btn").forEach(button => {
        button.addEventListener("click", handleComment);
    });

    // Vote buttons
    document.querySelectorAll(".vote-btn").forEach(button => {
        button.addEventListener("click", handleVote);
    });

    // Search input
    if (searchInput) {
        searchInput.addEventListener("input", fetchAndDisplayQuestions);
    }
}

// Handle voting
async function handleVote(event) {
    const button = event.target;
    const questionId = button.dataset.id;
    const isUpvote = button.classList.contains('like');

    try {
        const questions = await getPosts();
        const question = questions.find(q => q.id == questionId);
        
        if (!question) throw new Error("Question not found");
        
        // Update vote count
        question.votes += isUpvote ? 1 : -1;
        
        // Send update to API
        await updatePost(questionId, question);
        
        // Refresh display
        fetchAndDisplayQuestions();
    } catch (error) {
        console.error("Error voting:", error);
        alert("Failed to register vote. Please try again.");
    }
}

// Handle commenting
async function handleComment(event) {
    const button = event.target;
    const questionId = button.dataset.id;
    const commentInput = button.previousElementSibling;
    const commentText = commentInput.value.trim();

    if (!commentText) {
        alert("Please enter a comment before posting.");
        return;
    }

    try {
        const questions = await getPosts();
        const question = questions.find(q => q.id == questionId);
        
        if (!question) throw new Error("Question not found");
        
        // Initialize comments array if it doesn't exist
        question.comments = question.comments || [];
        
        // Add new comment
        question.comments.push(commentText);
        
        // Send update to API
        await updatePost(questionId, question);
        
        // Clear input and refresh
        commentInput.value = "";
        fetchAndDisplayQuestions();
    } catch (error) {
        console.error("Error adding comment:", error);
        alert("Failed to post comment. Please try again.");
    }
}

// Add new question
async function addQuestion(title, description) {
    const newQuestion = {
        question: title,
        description: description,
        user: "Anonymous",
        votes: 0,
        comments: []
    };

    try {
        await createPost(newQuestion);
        fetchAndDisplayQuestions();
    } catch (error) {
        console.error("Error adding question:", error);
        alert("Failed to post question. Please try again.");
    }
}

// Handle form submission
function handleFormSubmit(event) {
    event.preventDefault();
    const title = document.getElementById("question-title").value.trim();
    const description = document.getElementById("question-details").value.trim();

    if (!title || !description) {
        alert("Please fill out both title and description fields.");
        return;
    }

    addQuestion(title, description);
    event.target.reset();
}

// ========== TECH NEWS FUNCTIONS ========== //

// Fetch tech news
async function fetchTechNews() {
    if (!newsContainer) return;

    try {
        newsContainer.innerHTML = '<div class="loading">Loading tech news...</div>';
        const response = await fetch(techAPI);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const articles = await response.json();
        displayTechNews(articles);
    } catch (error) {
        console.error("Error fetching tech news:", error);
        newsContainer.innerHTML = `
            <div class="error">
                <p>Failed to load tech news.</p>
                <p>${error.message}</p>
            </div>
        `;
    }
}

// Display tech news
function displayTechNews(articles) {
    if (!newsContainer) return;

    newsContainer.innerHTML = `
        <div class="news-container">
            ${articles.map(article => `
                <div class="news-item">
                    <h3><a href="${article.url}" target="_blank">${article.title}</a></h3>
                    <p>${article.description || 'No description available'}</p>
                    <div class="news-meta">
                        <span>By ${article.user?.name || 'Unknown'}</span>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

// ========== INITIALIZATION ========== //

function initializeApp() {
    // Initialize question functionality
    if (questionForm) {
        questionForm.addEventListener("submit", handleFormSubmit);
        fetchAndDisplayQuestions();
    }

    // Initialize news functionality
    if (newsContainer) {
        fetchTechNews();
    }

    // Initialize refresh button
    if (refreshBtn) {
        refreshBtn.addEventListener('click', fetchTechNews);
    }
}

// Start the app
initializeApp();