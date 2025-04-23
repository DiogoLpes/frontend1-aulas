import { getPosts, createPost, updatePost } from "./api/api.js";
const techAPI = "https://dev.to/api/articles?top=1&per_page=5";    

// DOM Elements
const questionForm = document.getElementById("question-form");
const postList = document.getElementById("post-list");
const themeToggleButton = document.getElementById('theme-toggle');
const newsContainer = document.getElementById("news-container");
const refreshBtn = document.getElementById("refresh-btn");

// Theme Toggle
if (themeToggleButton) {
    themeToggleButton.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        themeToggleButton.textContent = document.body.classList.contains('dark-mode') ? 'Light Mode' : 'Dark Mode';
    });
}

// Fetch and Display Tech News
async function fetchTechNews() {
    if (!newsContainer) return;
    
    try {
        newsContainer.innerHTML = `<div class="loading">Loading latest tech news...</div>`;
        const response = await fetch(techAPI);
        if (!response.ok) {
            throw new Error(`Failed to fetch tech news: ${response.status}`);
        }
        const articles = await response.json();
        displayTechNews(articles);
    } catch (error) {
        console.error("Error fetching tech news:", error);
        if (newsContainer) {
            newsContainer.innerHTML = `
                <div class="error">
                    <p>Failed to load tech news. Please try again later.</p>
                    <p>${error.message}</p>
                </div>
            `;
        }
    }
}

function displayTechNews(articles) {
    if (!newsContainer) return;
    
    newsContainer.innerHTML = articles.map(article => {
        const publishDate = new Date(article.published_at).toLocaleDateString();
        return `
            <div class="news-item">
                <h3><a href="${article.url}" target="_blank">${article.title}</a></h3>
                <p>${article.description || 'No description available'}</p>
                <div class="news-meta">
                    <span class="news-author">By ${article.user?.name || 'Unknown author'}</span>
                    <span class="news-date">${publishDate}</span>
                </div>
            </div>
        `;
    }).join('');
}

// Fetch and Display Questions
async function fetchQuestions() {
    if (!postList) return;
    
    try {
        const questions = await getPosts();
        displayPosts(questions);
    } catch (error) {
        console.error("Error fetching questions:", error);
        if (postList) {
            postList.innerHTML = `<p class="error">Failed to load questions. Please try again later.</p>`;
        }
    }
}

function displayPosts(questions) {
    if (!postList) return;
    
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
            <div class="comments-section">
                <h4>Comments:</h4>
                <ul class="comments-list">
                    ${question.comments?.map(comment => `<li>${comment}</li>`).join("") || ""}
                </ul>
                <input type="text" class="comment-input" placeholder="Add a comment..." />
                <button class="comment-btn" data-id="${question.id}">Comment</button>
            </div>
        `;
        postList.appendChild(postItem);
    });

    // Add event listeners for comment buttons
    document.querySelectorAll(".comment-btn").forEach(button => {
        button.addEventListener("click", handleComment);
    });
}

// Handle Commenting
async function handleComment(event) {
    const questionId = event.target.dataset.id;
    const commentInput = event.target.previousElementSibling;
    const commentText = commentInput.value.trim();

    if (!commentText) {
        alert("Please enter a comment.");
        return;
    }

    try {
        const questions = await getPosts();
        const question = questions.find(q => q.id == questionId);
        question.comments = question.comments || [];
        question.comments.push(commentText);

        await updatePost(question);
        fetchQuestions(); // Refresh the list
    } catch (error) {
        console.error("Error adding comment:", error);
    }
}

// Add New Question
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

function initializeApp() {
    // Only run these if the elements exist on the page
    if (questionForm) {
        questionForm.addEventListener("submit", handleFormSubmit);
        fetchQuestions();
    }
    
    if (newsContainer) {
        fetchTechNews();
    }
    
    if (refreshBtn) {
        refreshBtn.addEventListener('click', fetchTechNews);
    }
}

initializeApp();