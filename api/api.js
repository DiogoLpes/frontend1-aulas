const apiURL = "https://67f588ef913986b16fa4ea3f.mockapi.io/question/";

export const getPosts = async () => {
  const response = await fetch(apiURL + "question");
  const data = await response.json();
  console.log(data);
  return data;
}

export const createPost = async (question) => {
  const response = await fetch(apiURL + "question", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(question),
  });
  const data = await response.json();
  return data;
} 

export async function updatePost(updatedPost) {
    const response = await fetch(apiURL + "question", {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedPost)
    });
    return await response.json();
}



