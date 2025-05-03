import { getPosts, createPost, updatePost } from "./api/api.js";

// Constants
const techAPI = "https://dev.to/api/articles?top=1&per_page=5";

// DOM Elements
const questionForm = document.getElementById("question-form");
const postList = document.getElementById("post-list");
const themeToggleButton = document.getElementById("theme-toggle");
const newsContainer = document.getElementById("news-container");
const refreshBtn = document.getElementById("refresh-btn");

// Theme Toggle
function setupThemeToggle() {
    if (!themeToggleButton) return;

    themeToggleButton.addEventListener("click", () => {
        const isDarkMode = document.body.classList.toggle("dark-mode");
        themeToggleButton.textContent = isDarkMode ? "Light Mode" : "Dark Mode";
        localStorage.setItem("dark-mode", isDarkMode);
    });
}

// Initialize Splide Carousel
async function setupCarousel() {
    const splideList = document.getElementById("splide-list");
    if (!splideList) return;

    try {
        const questions = await getPosts();
        splideList.innerHTML = ""; // Clear existing slides

        questions.forEach((question) => {
            const slide = document.createElement("li");
            slide.className = "splide__slide";
            slide.innerHTML = `
                <div class="question-slide">
                    <h3>${question.question}</h3>
                    <p>${question.description}</p>
                    <p><strong>User:</strong> ${question.user}</p>
                    <p><strong>Votes:</strong> ${question.votes}</p>
                </div>
            `;
            splideList.appendChild(slide);
        });

        new Splide("#splide", {
            type: "loop",
            perPage: 1,
            perMove: 1,
            pagination: true,
            arrows: true,
        }).mount();
    } catch (error) {
        console.error("Error fetching questions for Splide:", error);
    }
}

// Fetch and Display Tech News
async function fetchAndDisplayTechNews() {
    if (!newsContainer) return;

    try {
        newsContainer.innerHTML = `<div class="loading">Loading latest tech news...</div>`;
        const response = await fetch(techAPI);
        if (!response.ok) throw new Error(`Failed to fetch tech news: ${response.status}`);

        const articles = await response.json();
        newsContainer.innerHTML = articles.map(article => `
            <div class="news-item">
                <h3><a href="${article.url}" target="_blank">${article.title}</a></h3>
                <p>${article.description || "No description available"}</p>
                <div class="news-meta">
                    <span class="news-author">By ${article.user?.name || "Unknown author"}</span>
                    <span class="news-date">${new Date(article.published_at).toLocaleDateString()}</span>
                </div>
            </div>
        `).join("");
    } catch (error) {
        console.error("Error fetching tech news:", error);
        newsContainer.innerHTML = `<div class="error">Failed to load tech news. Please try again later.</div>`;
    }
}

// Handle Like Button Click
async function handleLike(event) {
    const button = event.target;
    const questionId = button.dataset.id;

    if (!questionId) return;

    button.disabled = true;

    try {
        const questions = await getPosts();
        const question = questions.find(q => q.id === questionId);

        if (question) {
            question.votes += 1; // Increment the vote count
            await updatePost(questionId, { votes: question.votes }); // Update the question on the server
            await fetchAndDisplayQuestions(); // Refresh the questions list
        }
    } catch (error) {
        console.error("Failed to like the question:", error);
        alert("Failed to like the question. Please try again.");
    } finally {
        button.disabled = false;
    }
}

// Fetch and Display Questions
async function fetchAndDisplayQuestions() {
    if (!postList) return;

    try {
        const questions = await getPosts();
        postList.innerHTML = questions.map(question => `
            <div class="post-item question">
                <h3>${question.question}</h3>
                <p>${question.description}</p>
                <p><strong>Tags:</strong> ${question.tags?.join(", ") || "No tags"}</p>
                <p><strong>User:</strong> ${question.user}</p>
                <p><strong>Votes:</strong> ${question.votes}</p>
                <button class="vote-btn like" data-id="${question.id}">Like</button>
                <div class="comments-section">
                    <h4>Comments (${question.comments?.length || 0})</h4>
                    <ul class="comments-list">
                        ${question.comments?.map(comment => `
                            <li class="comment-item">
                                <p>${comment.text}</p>
                                <small>By ${comment.user || "Anonymous"} on ${new Date(comment.timestamp).toLocaleString()}</small>
                            </li>
                        `).join("") || "<li>No comments yet</li>"}
                    </ul>
                    <textarea class="comment-input" placeholder="Write your comment..."></textarea>
                    <button class="comment-btn" data-id="${question.id}">Post Comment</button>
                </div>
            </div>
        `).join("");

        // Add event listeners for Like buttons
        document.querySelectorAll(".vote-btn.like").forEach(button => {
            button.addEventListener("click", handleLike);
        });

        // Add event listeners for Comment buttons
        document.querySelectorAll(".comment-btn").forEach(button => {
            button.addEventListener("click", handleComment);
        });
    } catch (error) {
        console.error("Error fetching questions:", error);
        postList.innerHTML = `<p class="error">Failed to load questions. Please try again later.</p>`;
    }
}

// Handle Comment Submission
async function handleComment(event) {
    const button = event.target;
    const questionId = button.dataset.id;
    const commentInput = button.previousElementSibling;
    const commentText = commentInput.value.trim();

    if (!commentText) {
        alert("Please enter a comment before submitting.");
        return;
    }

    button.disabled = true;
    button.textContent = "Posting...";

    try {
        await updatePost(questionId, commentText);
        commentInput.value = "";
        await fetchAndDisplayQuestions();
    } catch (error) {
        console.error("Failed to post comment:", error);
        alert("Failed to post comment. Please try again.");
    } finally {
        button.disabled = false;
        button.textContent = "Post Comment";
    }
}

// Add New Question
async function addQuestion(title, description, tags) {
    const newQuestion = { question: title, description, tags, user: "Anonymous", votes: 0, comments: [] };

    try {
        await createPost(newQuestion);
        await fetchAndDisplayQuestions();
    } catch (error) {
        console.error("Error adding question:", error);
    }
}

// Handle Form Submission
function handleFormSubmit(event) {
    event.preventDefault();

    const title = document.getElementById("question-title").value.trim();
    const description = document.getElementById("question-details").value.trim();
    const tags = Array.from(document.getElementById("question-tags").selectedOptions).map(option => option.value);

    if (!title || !description || tags.length === 0) {
        alert("Please fill out all fields and select at least one tag.");
        return;
    }

    addQuestion(title, description, tags);
    questionForm.reset();
}

// Search Questions
function setupSearch() {
    const searchBox = document.getElementById("search-box");

    if (!searchBox) return;

    searchBox.addEventListener("input", (event) => {
        const searchTerm = event.target.value.toLowerCase();

        // Filter questions based on the search term
        const questions = document.querySelectorAll(".post-item.question");
        questions.forEach((question) => {
            const title = question.querySelector("h3").textContent.toLowerCase();
            const description = question.querySelector("p").textContent.toLowerCase();

            if (title.includes(searchTerm) || description.includes(searchTerm)) {
                question.style.display = "block"; // Show matching questions
            } else {
                question.style.display = "none"; // Hide non-matching questions
            }
        });
    });
}

// Initialize App
function initializeApp() {
    setupThemeToggle();
    setupCarousel();

    if (questionForm) {
        questionForm.addEventListener("submit", handleFormSubmit);
        fetchAndDisplayQuestions();
    }

    if (newsContainer) {
        fetchAndDisplayTechNews();
    }

    if (refreshBtn) {
        refreshBtn.addEventListener("click", fetchAndDisplayTechNews);
    }

    setupSearch(); // Initialize the search functionality
}

initializeApp();