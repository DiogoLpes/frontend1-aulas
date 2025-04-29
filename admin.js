import { getPosts, deletePost } from "./api/api.js";

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
                <div class="question">
                    <h3>${question.title}</h3>
                    <p>${question.description}</p>
                    <p><strong>User:</strong> ${question.user}</p>
                    <button class="delete-button" data-id="${question.id}">Delete</button>
                </div>
            
            `;
            postList.appendChild(questionItem);
        });

        // Add event listeners to all delete buttons
        document.getElementById("questions-list").addEventListener("click", async function (e) {
            if (e.target.classList.contains("delete-button")) {
                const questionId = e.target.getAttribute("data-id");
                try {
                    if (confirm("Are you sure you want to delete this question?")) {
                        await deletePost(questionId);
                        await displayPosts(); // Refresh the list after deletion
                    }
                } catch (error) {
                    console.error("Error deleting question:", error);
                    alert("Failed to delete question");
                }
            }
        });
    }
    catch (error) {
        console.error("Error fetching questions:", error);
        const postList = document.getElementById("questions-list");
        postList.innerHTML = `<p class="error">Failed to load questions. Please try again later.</p>`;
    }
}
// Initialize the display
displayPosts();


