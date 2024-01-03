const sinon = require('sinon');

const Note = require('../models/note');
const noteController = require('../controllers/noteController');

describe('noteController', () => {
  describe('getAllNotes', () => {
    it('should return all notes for the authenticated user', async () => {
      const req = {
        user: {
          userId: 'test13',
        },
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };

      sinon.stub(Note, 'find').resolves([{ title: 'Note 1', content: 'Content 1' }, { title: 'Note 2', content: 'Content 2' }]);

      await noteController.getAllNotes(req, res);

      sinon.assert.calledWith(res.status, 200);
      sinon.assert.calledWith(res.json, { notes: sinon.match.array });

      Note.find.restore();
    });

    it('should handle internal server error', async () => {
      const req = {
        user: {
          userId: 'test123',
        },
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };

      sinon.stub(Note, 'find').rejects(new Error('Some error'));

      await noteController.getAllNotes(req, res);

      sinon.assert.calledWith(res.status, 500);
      sinon.assert.calledWith(res.json, { message: 'Internal Server Error' });

      Note.find.restore();
    });
  });

  // Similar tests can be written for other functions like getNoteById, createNote, updateNote, deleteNote, shareNote, and searchNotes
});
