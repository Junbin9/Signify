const API_URL = 'http://localhost:8000';

export const getDocuments = async (token) => {
  const response = await fetch(`${API_URL}/documents`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch documents');
  }
  const data = await response.json();
  return data;
};

export const uploadDocument = async (file, token) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_URL}/documents`, {
    method: 'POST',
    headers: {
        'Authorization': `Bearer ${token}`,
      },
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to upload document');
  }

  return await response.json();
};

export const updateDocument = async (id, file, token) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_URL}/documents/${id}`, {
    method: 'PUT',
    headers: {
        'Authorization': `Bearer ${token}`,
      },
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to update document');
  }

  return await response.json();
};

export const deleteDocument = async (id, token) => {
  const response = await fetch(`${API_URL}/documents/${id}`, {
    method: 'DELETE',
    headers: {
        'Authorization': `Bearer ${token}`,
      },
  });

  if (!response.ok) {
    throw new Error('Failed to delete document');
  }

  return response.status === 204 ? {} : await response.json();
};