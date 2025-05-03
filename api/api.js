const apiURL = "https://67f588ef913986b16fa4ea3f.mockapi.io/question/";

// Function to fetch local JSON data
async function fetchLocalQuestions() {
  try {
    const response = await fetch('./data.json');
    const data = await response.json();
    return data.questions || [];
  } catch (error) {
    console.error("Error loading local questions:", error);
    return [];
  }
}

export const getPosts = async () => {
  try {
    const [apiQuestions, localQuestions] = await Promise.all([
      fetch(apiURL + "question").then(res => res.json()).catch(() => []),
      fetchLocalQuestions()
    ]);
    
    const combinedQuestions = [
      ...apiQuestions.map(q => ({ ...q, source: 'api' })),
      ...localQuestions.map(q => ({ ...q, source: 'local' }))
    ];
    
    return combinedQuestions;
  } catch (error) {
    console.error("Error fetching questions:", error);
    return fetchLocalQuestions();
  }
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

export const updatePost = async (postId, updatedFields) => {
  try {
    const response = await fetch(`${apiURL}question/${postId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedFields),
    });

    return await response.json();
  } catch (error) {
    console.error("Error updating post:", error);
    throw error;
  }
};

export const deletePost = async (id) => {
  const response = await fetch(apiURL + "question/" + id, {
    method: "DELETE",
  });
  const data = await response.json();
  return data;
}