import { useState, useEffect, useRef } from 'react';

export default function NoteForm({ onCreate, onUpdate, editingNote, onCancelEdit }) {
  const [title, setTitle] = useState('');
  const [contentText, setContentText] = useState('');
  const contentRef = useRef(null);

  useEffect(() => {
    if (editingNote) {
      setTitle(editingNote.title);
      setContentText(editingNote.content);
      if (contentRef.current) {
        contentRef.current.innerHTML = parseMarkdownToHTML(editingNote.content);
      }
    } else {
      setTitle('');
      setContentText('');
      if (contentRef.current) {
        contentRef.current.innerHTML = '';
      }
    }
  }, [editingNote]);

  const parseMarkdownToHTML = (text) => {
    if (!text) return '';
    
    let result = text;
    
    // Handle combined bold+italic (***text*** or **_text_** or _**text**_)
    result = result.replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>');
    result = result.replace(/\*\*_(.*?)_\*\*/g, '<strong><em>$1</em></strong>');
    result = result.replace(/_\*\*(.*?)\*\*_/g, '<strong><em>$1</em></strong>');
    
    // Replace **text** with <strong>text</strong>
    result = result.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Replace _text_ with <em>text</em>
    result = result.replace(/_(.*?)_/g, '<em>$1</em>');
    
    // Replace <u>text</u> (already in HTML format)
    result = result.replace(/<u>(.*?)<\/u>/g, '<u>$1</u>');
    
    // Replace line breaks
    result = result.replace(/\n/g, '<br/>');
    
    return result;
  };

  const parseHTMLToMarkdown = (html) => {
    if (!html) return '';
    
    let result = html;
    
    // Handle nested formatting: <strong><em>text</em></strong> or similar combinations
    // First, we'll handle the most complex cases (nested tags)
    result = result.replace(/<strong><em>(.*?)<\/em><\/strong>/g, '***$1***');
    result = result.replace(/<strong><u>(.*?)<\/u><\/strong>/g, '**$1**<u></u>');
    result = result.replace(/<em><u>(.*?)<\/u><\/em>/g, '_$1_<u></u>');
    result = result.replace(/<strong><em><u>(.*?)<\/u><\/em><\/strong>/g, '***$1***<u></u>');
    
    result = result.replace(/<em><strong>(.*?)<\/strong><\/em>/g, '***$1***');
    result = result.replace(/<u><strong>(.*?)<\/strong><\/u>/g, '**$1**<u></u>');
    result = result.replace(/<u><em>(.*?)<\/em><\/u>/g, '_$1_<u></u>');
    
    // Then handle individual tags
    // Bold
    result = result.replace(/<strong>(.*?)<\/strong>/g, '**$1**');
    result = result.replace(/<b>(.*?)<\/b>/g, '**$1**');
    
    // Italic
    result = result.replace(/<em>(.*?)<\/em>/g, '_$1_');
    result = result.replace(/<i>(.*?)<\/i>/g, '_$1_');
    
    // Underline - keep as is
    // Already handled above in nested cases
    result = result.replace(/<u>(.*?)<\/u>/g, '<u>$1</u>');
    
    // Handle line breaks and divs
    result = result.replace(/<br\s*\/?>/g, '\n');
    result = result.replace(/<div>/g, '');
    result = result.replace(/<\/div>/g, '\n');
    result = result.replace(/&nbsp;/g, ' ');
    
    return result.trim();
  };

  const submit = (e) => {
    e.preventDefault();
    if (!title || !contentRef.current?.textContent.trim()) return;
    
    const htmlContent = contentRef.current.innerHTML;
    const markdownContent = parseHTMLToMarkdown(htmlContent);
    
    if (editingNote) {
      onUpdate(editingNote.id, { title, content: markdownContent });
    } else {
      onCreate({ title, content: markdownContent });
    }
    
    setTitle('');
    setContentText('');
    if (contentRef.current) {
      contentRef.current.innerHTML = '';
    }
  };

  const handleCancel = () => {
    setTitle('');
    setContentText('');
    if (contentRef.current) {
      contentRef.current.innerHTML = '';
    }
    onCancelEdit();
  };

  const handleContentChange = () => {
    if (contentRef.current) {
      setContentText(contentRef.current.textContent);
    }
  };

  const applyFormatting = (format) => {
    const selection = window.getSelection();
    
    if (!selection.toString()) {
      // No text selected, just focus
      contentRef.current?.focus();
      return;
    }

    // Use execCommand to apply formatting
    switch (format) {
      case 'bold':
        document.execCommand('bold', false, null);
        break;
      case 'italic':
        document.execCommand('italic', false, null);
        break;
      case 'underline':
        document.execCommand('underline', false, null);
        break;
      default:
        return;
    }

    contentRef.current?.focus();
  };

  const isDisabled = !title.trim() || !contentText.trim();

  return (
    <form className="note-form" onSubmit={submit}>
      <div className="note-form-header">
        <h3>{editingNote ? 'Edit note' : 'Create a new note'}</h3>
        <span className="note-form-hint">
          {editingNote ? 'Update your note below.' : 'Add a title and details to save.'}
        </span>
      </div>
      <div className="note-form-fields">
        <input
          className="note-input"
          placeholder="Note title"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        <div className="textarea-wrapper">
          <div className="formatting-toolbar">
            <button 
              type="button" 
              className="format-btn" 
              onClick={() => applyFormatting('bold')}
              title="Bold (Ctrl+B)"
            >
              <strong>B</strong>
            </button>
            <button 
              type="button" 
              className="format-btn" 
              onClick={() => applyFormatting('italic')}
              title="Italic (Ctrl+I)"
            >
              <em>I</em>
            </button>
            <button 
              type="button" 
              className="format-btn" 
              onClick={() => applyFormatting('underline')}
              title="Underline (Ctrl+U)"
            >
              <u>U</u>
            </button>
          </div>
          <div
            ref={contentRef}
            className="note-editor"
            contentEditable
            suppressContentEditableWarning
            placeholder="Write your note here..."
            onInput={handleContentChange}
          />
        </div>
      </div>
      <div className="note-form-actions">
        <button className="btn btn-primary" type="submit" disabled={isDisabled}>
          {editingNote ? 'Update Note' : 'Add Note'}
        </button>
        {editingNote && (
          <button className="btn btn-secondary" type="button" onClick={handleCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
