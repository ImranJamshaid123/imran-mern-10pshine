import NoteItem from './NoteItem';

export default function NoteList({ notes, onDelete, onEdit }) {
  if (!notes.length) {
    return (
      <div className="notes-empty">
        <h4>No notes yet</h4>
        <p>Start by creating your first note from the panel above.</p>
      </div>
    );
  }

  return (
    <div className="notes-grid">
      {notes.map(note => (
        <NoteItem key={note.id} note={note} onDelete={onDelete} onEdit={onEdit} />
      ))}
    </div>
  );
}
