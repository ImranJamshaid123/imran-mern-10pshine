import { useEffect, useState } from 'react';
import { getNotes, createNote, updateNote, deleteNote } from '../api/notes';
import NoteForm from './NoteForm';
import NoteList from './NoteList';
import { logout, getUser } from '../utils/auth';
import { useNavigate } from 'react-router-dom';
import './Notes.css';

export default function Notes() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [editingNote, setEditingNote] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const fetchNotes = async () => {
    try {
      const res = await getNotes();
      setNotes(res.data.notes || res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
    const userData = getUser();
    setUser(userData);
  }, []);

  const handleCreate = async (data) => {
    await createNote(data);
    fetchNotes();
  };

  const handleUpdate = async (id, data) => {
    await updateNote(id, data);
    setEditingNote(null);
    fetchNotes();
  };

  const handleEdit = (note) => {
    setEditingNote(note);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingNote(null);
  };

  const handleDelete = async (id) => {
    await deleteNote(id);
    setNotes(notes.filter(n => n.id !== id));
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const filteredNotes = notes.filter(note => {
    const query = searchQuery.toLowerCase();
    return note.title.toLowerCase().includes(query) || 
           note.content.toLowerCase().includes(query);
  });

  return (
    <div className="notes-page">
      <div className="notes-shell">
        <header className="notes-header">
          <div className="notes-title">
            <h2>Notes Dashboard</h2>
            <p>Welcome back, <strong>{user?.name || 'User'}</strong>! Capture, organize, and revisit your thoughts.</p>
          </div>
          <div className="notes-actions">
            <button className="btn btn-logout" onClick={handleLogout}>Logout</button>
          </div>
        </header>

        <section className="notes-panel">
          <NoteForm 
            onCreate={handleCreate} 
            onUpdate={handleUpdate}
            editingNote={editingNote}
            onCancelEdit={handleCancelEdit}
          />
        </section>

        <section className="notes-search">
          <div className="search-bar">
            <svg className="search-icon" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16zM18 18l-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <input
              type="text"
              className="search-input"
              placeholder="Search notes by title or content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button className="search-clear" onClick={() => setSearchQuery('')}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            )}
          </div>
          {searchQuery && (
            <p className="search-results-count">
              Found {filteredNotes.length} note{filteredNotes.length !== 1 ? 's' : ''}
            </p>
          )}
        </section>

        <section className="notes-content">
          {loading ? (
            <div className="notes-loading">Loading notes...</div>
          ) : (
            <NoteList notes={filteredNotes} onDelete={handleDelete} onEdit={handleEdit} />
          )}
        </section>
      </div>
    </div>
  );
}
