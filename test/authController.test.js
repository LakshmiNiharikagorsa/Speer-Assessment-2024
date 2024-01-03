const sinon = require('sinon');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/user'); // Update the path based on your project structure
const authController = require('../controllers/authController');

describe('authController', () => {
  describe('signup', () => {
    it('should create a new user successfully', async () => {
      const req = {
        body: {
          username: 'test14',
          password: 'test123',
        },
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };

      //sinon.stub(validationResult, 'isEmpty').returns(true);
      sinon.stub(User, 'findOne').resolves(null);
      sinon.stub(User.prototype, 'save').resolves();

      await authController.signup(req, res);

      sinon.assert.calledWith(res.status, 201);
      sinon.assert.calledWith(res.json, { message: 'User created successfully' });

      //validationResult.isEmpty.restore();
      User.findOne.restore();
      User.prototype.save.restore();
    });

    it('should handle username already taken', async () => {
      const req = {
        body: {
          username: 'test13',
          password: 'test123',
        },
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };

      //sinon.stub(validationResult, 'isEmpty').returns(true);
      sinon.stub(User, 'findOne').resolves({});

      await authController.signup(req, res);

      sinon.assert.calledWith(res.status, 400);
      sinon.assert.calledWith(res.json, { message: 'Username is already taken' });

      //validationResult.isEmpty.restore();
      User.findOne.restore();
    });

    it('should handle internal server error', async function ()  {
      this.timeout(0);
      const req = {
        body: {
          username: 'testuser',
          password: 'testpassword',
        },
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };

      //sinon.stub(validationResult, 'isEmpty').throws(new Error('Some error'));

      await authController.signup(req, res);

      sinon.assert.calledWith(res.status, 500);
      sinon.assert.calledWith(res.json, { message: 'Internal Server Error' });

     // validationResult.isEmpty.restore();
    });
  });

  describe('login', () => {
    it('should log in a user successfully', async () => {
      const req = {
        body: {
          username: 'test13',
          password: 'test123',
        },
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };

      sinon.stub(User, 'findOne').resolves({
        username: 'testuser',
        password: await bcrypt.hash('testpassword', 10),
      });
      sinon.stub(bcrypt, 'compare').resolves(true);
      sinon.stub(jwt, 'sign').returns('testtoken');

      await authController.login(req, res);

      sinon.assert.calledWith(res.status, 200);
      sinon.assert.calledWith(res.json, { token: 'testtoken' });

      User.findOne.restore();
      bcrypt.compare.restore();
      jwt.sign.restore();
    });

    it('should handle invalid username or password', async () => {
      const req = {
        body: {
          username: 'test13',
          password: 'test134',
        },
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };

      sinon.stub(User, 'findOne').resolves({
        username: 'testuser',
        password: await bcrypt.hash('testpassword', 10),
      });
      sinon.stub(bcrypt, 'compare').resolves(false);

      await authController.login(req, res);

      sinon.assert.calledWith(res.status, 401);
      sinon.assert.calledWith(res.json, { message: 'Invalid username or password' });

      User.findOne.restore();
      bcrypt.compare.restore();
    });

    it('should handle user not found', async () => {
      const req = {
        body: {
          username: 'nonexistentuser',
          password: 'testpassword',
        },
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };

      sinon.stub(User, 'findOne').resolves(null);

      await authController.login(req, res);

      sinon.assert.calledWith(res.status, 401);
      sinon.assert.calledWith(res.json, { message: 'Invalid username or password' });

      User.findOne.restore();
    });

    it('should handle internal server error', async () => {
      const req = {
        body: {
          username: 'testuser',
          password: 'testpassword',
        },
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };

      sinon.stub(User, 'findOne').throws(new Error('Some error'));

      await authController.login(req, res);

      sinon.assert.calledWith(res.status, 500);
      sinon.assert.calledWith(res.json, { message: 'Internal Server Error' });

      User.findOne.restore();
    });
  });
});
