import { getPosts, deletePost } from ".api/api.js";

// Function to display all posts
async function displayPosts() {
    try {
        const questions = await getPosts();
        const postList = document.getElementById("questions-list");
        postList.innerHTML = ""; 

        questions.forEach((question) => {
            const questionItem = document.createElement("div");
            questionItem.className = "question-item";
            questionItem.innerHTML = `
                <h3>${question.title}</h3>
                <p>${question.description}</p>
                <button class="delete-button" data-id="${question.id}">Delete</button>
            `;
            postList.appendChild(questionItem);
        });
    }
    catch (error) {
        console.error("Error fetching questions:", error);
        const postList = document.getElementById("questions-list");
        postList.innerHTML = `<p class="error">Failed to load questions. Please try again later.</p>`;
    }
}
displayPosts();




