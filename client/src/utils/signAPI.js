const API_URL = 'http://localhost:8000';

export const getSignatures = async (token) => {
  const response = await fetch(`${API_URL}/signatures`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch signatures');
  }
  const data = await response.json();
  console.log(data);
  return data;
};

export const uploadSignature = async (file, token) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_URL}/signatures`, {
    method: 'POST',
    headers: {
        'Authorization': `Bearer ${token}`,
      },
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to upload signature');
  }

  return await response.json();
};

export const updateSignature = async (id, file, token) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_URL}/signatures/${id}`, {
    method: 'PUT',
    headers: {
        'Authorization': `Bearer ${token}`,
      },
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to update signature');
  }

  return await response.json();
};

export const deleteSignature = async (id, token) => {
  const response = await fetch(`${API_URL}/signatures/${id}`, {
    method: 'DELETE',
    headers: {
        'Authorization': `Bearer ${token}`,
      },
  });

  if (!response.ok) {
    throw new Error('Failed to delete signature');
  }

  return response.status === 204 ? {} : await response.json();
};

// export const addWatermark = async (id, file) => {
//     const formData = new FormData();
//     formData.append('watermark', file);
  
//     const response = await fetch(`${API_URL}/signatures/${id}/watermark`, {
//       method: 'POST',
//       body: formData,
//     });
  
//     if (!response.ok) {
//       throw new Error('Failed to apply watermark');
//     }
  
//     return await response.json();
//   };

export const addWatermark = async (path, file, text) => {
  const formData = new FormData();
  formData.append('signature_path', path);
  formData.append('data', text);
  formData.append('image_file', file);

  const token = localStorage.getItem('token');

  const response = await fetch(`${API_URL}/watermarks/embed`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to apply watermark');
  }

  return await response.json();
};