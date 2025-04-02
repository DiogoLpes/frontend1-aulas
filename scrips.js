const questions = [
    {
        question: "How do I get my JavaScript cash machine simulator to work in my Node.js terminal?",
        tags: ["html", "css", "javascript"],
        user: "John Doe",
        answers: ["You can debug it using console.log statements.", "Check your Node.js version."],
        votes: 0
    }
];

function addQuestion(newQuestion, newTags, newUser) {
    questions.push({
        question: newQuestion,
        tags: newTags,
        user: newUser,
        answers: [],
        votes: 0
    });
    console.log("New question added!");
}
    