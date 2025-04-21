import { getPosts, createPost, updatePost } from "./api/api.js";
const techAPI = "https://dev.to/api/articles?top=1&per_page=1";    

// DOM Elements
const questionForm = document.getElementById("question-form");
const postList = document.getElementById("post-list");
const themeToggleButton = document.getElementById('theme-toggle');


// Theme Toggle
themeToggleButton.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    themeToggleButton.textContent = document.body.classList.contains('dark-mode') ? 'Light Mode' : 'Dark Mode';
});



// Fetch and Display Tech News
async function fetchTechNews() {
    try {
        const response = await fetch("https://67f588ef913986b16fa4ea40.mockapi.io/news");
        const news = await response.json();
        const articleList = document.querySelectorAll("#article-list");
        articleList.forEach((article, index) => {
            if (news[index]) {
                article.textContent = news[index].title;
            }
        });
    } catch (error) {
        console.error("Error fetching tech news:", error);
    }
}
fetchTechNews();

function displayArticle(article) {
    const Date = new Date(article.published_at).toLocaleDateString();
    document.getElementById("news-container").innerHTML = `
        <h2>${article.title}</h2>
        <p>${article.description}</p>
        <p><strong>Published on:</strong> ${Date}</p>
        <p><strong>Author:</strong> ${article.author}</p>
        <a href="${article.url}" target="_blank">Read more</a>
    `;
}
displayArticle();





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
    fetchQuestions();
    questionForm.addEventListener("submit", handleFormSubmit);
}
initializeApp();