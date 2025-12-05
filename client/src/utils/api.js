const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const apiCall = async (method, endpoint, data = null, token = null) => {
  const config = {
    method,
    headers: {
      'Content-Type': 'application/json',
    }
  };

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (data && (method === 'POST' || method === 'PUT')) {
    config.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, config);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Грешка при заявката');
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const registerUser = (email, password, username, school_code) =>
  apiCall('POST', '/auth/register', { email, password, username, school_code });

export const loginUser = (email, password) =>
  apiCall('POST', '/auth/login', { email, password });

export const getVotes = () => apiCall('GET', '/votes');

export const createVote = (title, description, userId) =>
  apiCall('POST', '/votes/create', { title, description, userId });

export const voteOnPoll = (voteId, choice, userId) =>
  apiCall('POST', `/votes/${voteId}/vote`, { choice, userId });

export const getIdeas = () => apiCall('GET', '/ideas');

export const createIdea = (title, description, userId) =>
  apiCall('POST', '/ideas/create', { title, description, userId });

export const upvoteIdea = (ideaId, userId) =>
  apiCall('POST', `/ideas/${ideaId}/upvote`, { userId });
