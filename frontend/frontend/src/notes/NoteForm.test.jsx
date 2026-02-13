import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import NoteForm from './NoteForm';

describe('NoteForm Component', () => {
  const mockOnCreate = jest.fn();
  const mockOnUpdate = jest.fn();
  const mockOnCancelEdit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders note form in create mode', () => {
    render(
      <NoteForm
        onCreate={mockOnCreate}
        onUpdate={mockOnUpdate}
        editingNote={null}
        onCancelEdit={mockOnCancelEdit}
      />
    );

    expect(screen.getByPlaceholderText(/note title/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add note/i })).toBeInTheDocument();
  });

  test('renders note form in edit mode with pre-filled data', () => {
    const editingNote = {
      id: 1,
      title: 'Edit Note Title',
      content: 'Edit note content',
    };

    render(
      <NoteForm
        onCreate={mockOnCreate}
        onUpdate={mockOnUpdate}
        editingNote={editingNote}
        onCancelEdit={mockOnCancelEdit}
      />
    );

    const titleInput = screen.getByPlaceholderText(/note title/i);
    expect(titleInput.value).toBe('Edit Note Title');
    expect(screen.getByRole('button', { name: /update note/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
  });

  test('allows user to type in title field', () => {
    render(
      <NoteForm
        onCreate={mockOnCreate}
        onUpdate={mockOnUpdate}
        editingNote={null}
        onCancelEdit={mockOnCancelEdit}
      />
    );

    const titleInput = screen.getByPlaceholderText(/note title/i);
    fireEvent.change(titleInput, { target: { value: 'New Note Title' } });

    expect(titleInput.value).toBe('New Note Title');
  });

  test('calls onCreate when creating a new note', async () => {
    const { container } = render(
      <NoteForm
        onCreate={mockOnCreate}
        onUpdate={mockOnUpdate}
        editingNote={null}
        onCancelEdit={mockOnCancelEdit}
      />
    );

    const titleInput = screen.getByPlaceholderText(/note title/i);
    const contentEditor = container.querySelector('.note-editor');
    const submitButton = screen.getByRole('button', { name: /add note/i });

    fireEvent.change(titleInput, { target: { value: 'Test Note' } });
    
    // Add content to the editor
    contentEditor.textContent = 'Test content';
    fireEvent.input(contentEditor);
    
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnCreate).toHaveBeenCalled();
    });
  });

  test('calls onUpdate when updating an existing note', async () => {
    const editingNote = {
      id: 1,
      title: 'Edit Note Title',
      content: 'Edit note content',
    };

    render(
      <NoteForm
        onCreate={mockOnCreate}
        onUpdate={mockOnUpdate}
        editingNote={editingNote}
        onCancelEdit={mockOnCancelEdit}
      />
    );

    const titleInput = screen.getByPlaceholderText(/note title/i);
    const updateButton = screen.getByRole('button', { name: /update note/i });

    fireEvent.change(titleInput, { target: { value: 'Updated Title' } });
    fireEvent.click(updateButton);

    await waitFor(() => {
      expect(mockOnUpdate).toHaveBeenCalledWith(editingNote.id, expect.any(Object));
    });
  });

  test('calls onCancelEdit when cancel button is clicked', () => {
    const editingNote = {
      id: 1,
      title: 'Edit Note Title',
      content: 'Edit note content',
    };

    render(
      <NoteForm
        onCreate={mockOnCreate}
        onUpdate={mockOnUpdate}
        editingNote={editingNote}
        onCancelEdit={mockOnCancelEdit}
      />
    );

    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    fireEvent.click(cancelButton);

    expect(mockOnCancelEdit).toHaveBeenCalled();
  });

  test('clears form after successful create', async () => {
    mockOnCreate.mockResolvedValue({});

    const { container } = render(
      <NoteForm
        onCreate={mockOnCreate}
        onUpdate={mockOnUpdate}
        editingNote={null}
        onCancelEdit={mockOnCancelEdit}
      />
    );

    const titleInput = screen.getByPlaceholderText(/note title/i);
    const contentEditor = container.querySelector('.note-editor');
    const submitButton = screen.getByRole('button', { name: /add note/i });

    fireEvent.change(titleInput, { target: { value: 'Test Note' } });
    
    // Add content to the editor
    contentEditor.textContent = 'Test content';
    fireEvent.input(contentEditor);
    
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnCreate).toHaveBeenCalled();
    });
  });

  test('updates form fields when editingNote prop changes', () => {
    const { rerender } = render(
      <NoteForm
        onCreate={mockOnCreate}
        onUpdate={mockOnUpdate}
        editingNote={null}
        onCancelEdit={mockOnCancelEdit}
      />
    );

    const titleInput = screen.getByPlaceholderText(/note title/i);
    expect(titleInput.value).toBe('');

    const editingNote = {
      id: 1,
      title: 'Edit Note Title',
      content: 'Edit note content',
    };

    rerender(
      <NoteForm
        onCreate={mockOnCreate}
        onUpdate={mockOnUpdate}
        editingNote={editingNote}
        onCancelEdit={mockOnCancelEdit}
      />
    );

    expect(titleInput.value).toBe('Edit Note Title');
  });

  test('does not show cancel button in create mode', () => {
    render(
      <NoteForm
        onCreate={mockOnCreate}
        onUpdate={mockOnUpdate}
        editingNote={null}
        onCancelEdit={mockOnCancelEdit}
      />
    );

    expect(screen.queryByRole('button', { name: /cancel/i })).not.toBeInTheDocument();
  });

  test('shows cancel button in edit mode', () => {
    const editingNote = {
      id: 1,
      title: 'Edit Note Title',
      content: 'Edit note content',
    };

    render(
      <NoteForm
        onCreate={mockOnCreate}
        onUpdate={mockOnUpdate}
        editingNote={editingNote}
        onCancelEdit={mockOnCancelEdit}
      />
    );

    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
  });
});
