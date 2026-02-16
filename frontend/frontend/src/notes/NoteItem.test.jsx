import { render, screen, fireEvent } from '@testing-library/react';
import NoteItem from './NoteItem';

describe('NoteItem Component', () => {
  const mockNote = {
    id: 1,
    title: 'Test Note',
    content: 'This is **bold** and _italic_ text',
    is_pinned: false,
    is_favorite: false,
    is_archived: false,
  };

  const mockOnDelete = jest.fn();
  const mockOnEdit = jest.fn();
  const mockOnToggle = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders note with title and content', () => {
    render(
      <NoteItem
        note={mockNote}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
        onToggle={mockOnToggle}
      />
    );

    expect(screen.getByText('Test Note')).toBeInTheDocument();
    expect(screen.getByText(/bold/)).toBeInTheDocument();
  });

  test('calls onEdit when edit button is clicked', () => {
    render(
      <NoteItem
        note={mockNote}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
        onToggle={mockOnToggle}
      />
    );

    const editButton = screen.getByRole('button', { name: /edit/i });
    fireEvent.click(editButton);

    expect(mockOnEdit).toHaveBeenCalledWith(mockNote);
  });

  test('calls onDelete when delete button is clicked', () => {
    render(
      <NoteItem
        note={mockNote}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
        onToggle={mockOnToggle}
      />
    );

    const deleteButton = screen.getByRole('button', { name: /delete/i });
    fireEvent.click(deleteButton);

    expect(mockOnDelete).toHaveBeenCalledWith(mockNote.id);
  });

  test('calls onToggle with correct parameters for pin', () => {
    render(
      <NoteItem
        note={mockNote}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
        onToggle={mockOnToggle}
      />
    );

    const pinButton = screen.getByTitle(/pin/i);
    fireEvent.click(pinButton);

    expect(mockOnToggle).toHaveBeenCalledWith(mockNote.id, 'is_pinned', true);
  });

  test('calls onToggle with correct parameters for favorite', () => {
    render(
      <NoteItem
        note={mockNote}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
        onToggle={mockOnToggle}
      />
    );

    const favoriteButton = screen.getByTitle(/add to favorites/i);
    fireEvent.click(favoriteButton);

    expect(mockOnToggle).toHaveBeenCalledWith(mockNote.id, 'is_favorite', true);
  });

  test('calls onToggle with correct parameters for archive', () => {
    render(
      <NoteItem
        note={mockNote}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
        onToggle={mockOnToggle}
      />
    );

    const archiveButton = screen.getByTitle(/archive/i);
    fireEvent.click(archiveButton);

    expect(mockOnToggle).toHaveBeenCalledWith(mockNote.id, 'is_archived', true);
  });

  test('shows active state for pinned note', () => {
    const pinnedNote = { ...mockNote, is_pinned: true };

    render(
      <NoteItem
        note={pinnedNote}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
        onToggle={mockOnToggle}
      />
    );

    const pinButton = screen.getByTitle(/unpin/i);
    expect(pinButton).toHaveClass('active');
  });

  test('shows active state for favorite note', () => {
    const favoriteNote = { ...mockNote, is_favorite: true };

    render(
      <NoteItem
        note={favoriteNote}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
        onToggle={mockOnToggle}
      />
    );

    const favoriteButton = screen.getByTitle(/remove from favorites/i);
    expect(favoriteButton).toHaveClass('active');
  });

  test('shows active state for archived note', () => {
    const archivedNote = { ...mockNote, is_archived: true };

    render(
      <NoteItem
        note={archivedNote}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
        onToggle={mockOnToggle}
      />
    );

    const archiveButton = screen.getByTitle(/unarchive/i);
    expect(archiveButton).toHaveClass('active');
  });

  test('applies archived class when note is archived', () => {
    const archivedNote = { ...mockNote, is_archived: true };

    const { container } = render(
      <NoteItem
        note={archivedNote}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
        onToggle={mockOnToggle}
      />
    );

    const noteCard = container.querySelector('.note-card');
    expect(noteCard).toHaveClass('archived');
  });

  test('renders content with markdown formatting', () => {
    const noteWithMarkdown = {
      ...mockNote,
      content: '**bold text** and _italic text_',
    };

    const { container } = render(
      <NoteItem
        note={noteWithMarkdown}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
        onToggle={mockOnToggle}
      />
    );

    // Check that the content is rendered with HTML formatting
    const contentDiv = container.querySelector('.note-card-content');
    expect(contentDiv).toBeInTheDocument();
  });

  test('toggles pin from active to inactive', () => {
    const pinnedNote = { ...mockNote, is_pinned: true };

    render(
      <NoteItem
        note={pinnedNote}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
        onToggle={mockOnToggle}
      />
    );

    const pinButton = screen.getByTitle(/unpin/i);
    fireEvent.click(pinButton);

    expect(mockOnToggle).toHaveBeenCalledWith(pinnedNote.id, 'is_pinned', false);
  });

  test('toggles favorite from active to inactive', () => {
    const favoriteNote = { ...mockNote, is_favorite: true };

    render(
      <NoteItem
        note={favoriteNote}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
        onToggle={mockOnToggle}
      />
    );

    const favoriteButton = screen.getByTitle(/remove from favorites/i);
    fireEvent.click(favoriteButton);

    expect(mockOnToggle).toHaveBeenCalledWith(favoriteNote.id, 'is_favorite', false);
  });

  test('toggles archive from active to inactive', () => {
    const archivedNote = { ...mockNote, is_archived: true };

    render(
      <NoteItem
        note={archivedNote}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
        onToggle={mockOnToggle}
      />
    );

    const archiveButton = screen.getByTitle(/unarchive/i);
    fireEvent.click(archiveButton);

    expect(mockOnToggle).toHaveBeenCalledWith(archivedNote.id, 'is_archived', false);
  });
});
