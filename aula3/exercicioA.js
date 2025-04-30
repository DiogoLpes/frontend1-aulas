const person = {
    name: "Alice",
    age: 25,
    hobbies: ["reading", "gaming", "coding"]
};

// Converter para JSON
const jsonString = JSON.stringify(person);
console.log("JSON String:", jsonString);

// Converter de volta para Objeto JavaScript
const parsedObject = JSON.parse(jsonString);
console.log("Parsed Object:", parsedObject);