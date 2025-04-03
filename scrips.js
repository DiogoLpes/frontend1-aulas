
const questions = [
    {
        question: "How do I get my JavaScript cash machine simulator to work in my Node.js terminal?",
        tags: ["html", "css", "javascript"],
        description: "I have a cash machine simulator that I want to run in my Node.js terminal. How can I do this?",
        user: "John Doe",
        answers: ["You can debug it using console.log statements.", "Check your Node.js version."],
        votes: 0
    }
];

const questionForm = document.getElementById("question-form");
const questionContainer = document.querySelector(".questions");


async function fetchQuestions() {
    try {
        const response = await fetch("data.json");
        if (!response.ok) throw new Error("Failed to fetch questions");

        const data = await response.json();
        renderQuestions(data.questions);
    } catch (error) {
        console.error("Error fetching questions:", error);
    }
}


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
            <button class="vote-btn">Upvote</button>
            <button class="vote-btn">Downvote</button>
        `;
        questionContainer.appendChild(questionDiv);
    });
}


function addQuestion(title, tags, description) {
    const newQuestion = {
        question: title,
        tags: tags,
        description: description,
        user: "Anonymous", 
        answers: [],
        votes: 0,
    };
}


function handleFormSubmit(event) {
    event.preventDefault();
    const title = document.getElementById("question-title").value;
    const tags = Array.from(document.getElementById("question-tags").selectedOptions).map(option => option.value);
    const description = document.getElementById("question-details").value;
    addQuestion(title, tags, description);
    questionForm.reset();
}


questionForm.addEventListener("submit", handleFormSubmit);
fetchQuestions();