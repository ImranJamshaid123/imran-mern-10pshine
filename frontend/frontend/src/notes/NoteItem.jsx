export default function NoteItem({ note, onDelete, onEdit }) {
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
    <div className="note-card">
      <div className="note-card-header">
        <h4>{note.title}</h4>
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
