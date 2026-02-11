export default function NoteItem({ note, onDelete, onEdit, onToggle }) {
  const parseContent = (text) => {
    if (!text) return '';
    
    let result = text;
    
    // Handle combined bold+italic (***text*** or **_text_** or _**text**_)
    result = result.replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>');
    result = result.replace(/\*\*_(.*?)_\*\*/g, '<strong><em>$1</em></strong>');
    result = result.replace(/_\*\*(.*?)\*\*_/g, '<strong><em>$1</em></strong>');
    
    // Replace **text** with <strong>text</strong> (non-greedy)
    result = result.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    
    // Replace _text_ with <em>text</em> (non-greedy)
    result = result.replace(/_(.+?)_/g, '<em>$1</em>');
    
    // Replace <u>text</u> (already in HTML format)
    result = result.replace(/<u>(.+?)<\/u>/g, '<u>$1</u>');
    
    // Replace line breaks
    result = result.replace(/\n/g, '<br/>');
    
    return result;
  };

  return (
    <div className={`note-card ${note.is_archived ? 'archived' : ''}`}>
      <div className="note-card-header">
        <h4>{note.title}</h4>
        <div className="note-icons">
          <button 
            onClick={() => onToggle(note.id, 'is_pinned', !note.is_pinned)} 
            title={note.is_pinned ? 'Unpin' : 'Pin'}
            className={note.is_pinned ? 'active' : ''}
          >
            <i className={note.is_pinned ? 'bi bi-pin-fill' : 'bi bi-pin'}></i>
          </button>
          <button 
            onClick={() => onToggle(note.id, 'is_favorite', !note.is_favorite)} 
            title={note.is_favorite ? 'Remove from favorites' : 'Add to favorites'}
            className={note.is_favorite ? 'active' : ''}
          >
            <i className={note.is_favorite ? 'bi bi-star-fill' : 'bi bi-star'}></i>
          </button>
          <button 
            onClick={() => onToggle(note.id, 'is_archived', !note.is_archived)} 
            title={note.is_archived ? 'Unarchive' : 'Archive'}
            className={note.is_archived ? 'active' : ''}
          >
            <i className={note.is_archived ? 'bi bi-archive-fill' : 'bi bi-archive'}></i>
          </button>
        </div>
      </div>

      <div
        className="note-card-content"
        dangerouslySetInnerHTML={{ __html: parseContent(note.content) }}
      />

      <div className="note-card-footer">
        <button className="btn btn-secondary" onClick={() => onEdit(note)}>Edit</button>
        <button className="btn btn-danger" onClick={() => onDelete(note.id)}>Delete</button>
      </div>
    </div>
  );
}
