import api from './axios';

export const getNotes = () => api.get('/notes');
export const createNote = (data) => api.post('/notes', data);
export const updateNote = (id, data) => api.put(`/notes/${id}`, data);
export const deleteNote = (id) => api.delete(`/notes/${id}`);

export const togglePin = (id, value) =>
  api.patch(`/notes/${id}/state`, { is_pinned: value });

export const toggleFavorite = (id, value) =>
  api.patch(`/notes/${id}/state`, { is_favorite: value });

export const toggleArchive = (id, value) =>
  api.patch(`/notes/${id}/state`, { is_archived: value });
