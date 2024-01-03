const Note = require('../models/note'); // Update the path based on your project structure

const getAllNotes = async (req, res) => {
  const ownerId = req.user.userId;

  try {
    // Retrieve all notes for the authenticated user
    const notes = await Note.find({ owner: ownerId });
    res.status(200).json({ notes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const getNoteById = async (req, res) => {
  const { id } = req.params;
  const ownerId = req.user.userId;

  try {
    // Retrieve a specific note by ID for the authenticated user
    const note = await Note.findOne({ _id: id, owner: ownerId });
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    res.status(200).json({ note });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const createNote = async (req, res) => {
  const { title, content } = req.body;
  const ownerId = req.user.userId;

  try {
    // Create a new note for the authenticated user
    const newNote = new Note({
      title,
      content,
      owner: ownerId,
    });

    // Save the note to the database
    await newNote.save();

    res.status(201).json({ message: 'Note created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const updateNote = async (req, res) => {
  const { id } = req.params;
  const ownerId = req.user.userId;
  const { title, content } = req.body;

  try {
    // Update an existing note by ID for the authenticated user
    const updatedNote = await Note.findOneAndUpdate(
      { _id: id, owner: ownerId },
      { $set: { title, content } },
      { new: true }
    );

    if (!updatedNote) {
      return res.status(404).json({ message: 'Note not found' });
    }

    res.status(200).json({ message: 'Note updated successfully', note: updatedNote });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const deleteNote = async (req, res) => {
  const { id } = req.params;
  const ownerId = req.user.userId;

  try {
    // Delete a note by ID for the authenticated user
    const deletedNote = await Note.findOneAndDelete({ _id: id, owner: ownerId });

    if (!deletedNote) {
      return res.status(404).json({ message: 'Note not found' });
    }

    res.status(200).json({ message: 'Note deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const shareNote = async (req, res) => {
  const { id } = req.params;
  const ownerId = req.user.userId;
  const { sharedWith } = req.body;

  try {
    // Check if the note exists and belongs to the authenticated user
    const note = await Note.findOne({ _id: id, owner: ownerId });
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }


    // For demonstration purposes, we'll assume a "sharedWith" field in the Note model
    note.sharedWith = note.sharedWith || [];
    note.sharedWith.push(sharedWith);
    await note.save();

    res.status(200).json({ message: 'Note shared successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const searchNotes = async (req, res) => {
  const { q } = req.query;
  const ownerId = req.user.userId;

  try {

    // For demonstration purposes, we'll use a simple regex search on title and content fields

    const results = await Note.find({
      owner: ownerId,
      $or: [
        { title: { $regex: new RegExp(q, 'i') } }, // Case-insensitive search on title
        { content: { $regex: new RegExp(q, 'i') } }, // Case-insensitive search on content
      ],
    });

    res.status(200).json({ results });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
;

module.exports = {
  getAllNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
  shareNote,
  searchNotes,
};
