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
    const response = await fetch(apiURL + "question");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw error;
  }
}

export const createPost = async (question) => {
  try {
    const response = await fetch(apiURL + "question", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(question),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error creating post:", error);
    throw error;
  }
} 

export const updatePost = async (id, updatedPost) => {
  try {
    const response = await fetch(apiURL + "question/" + id, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify(updatedPost)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, ${errorText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error updating post:", error);
    throw error;
  }
}

export const deletePost = async (id) => {
  try {
    const response = await fetch(apiURL + "question/" + id, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error deleting post:", error);
    throw error;
  }
}

export const saveToLocalStorage = (key, obj) => {
  try {
    localStorage.setItem(key, JSON.stringify(obj));
    return true;
  } catch (error) {
    console.error("Erro ao salvar no localStorage:", error);
    return false;
  }
};

export const loadFromLocalStorage = (key) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("Erro ao carregar do localStorage:", error);
    return null;
  }
};