import express from 'express';
import Joi from 'joi';
import Validator from 'express-joi-validation';

const auth = require('../middleware/auth');
const authControllers = require('../controllers/auth/authControllers');

const router = express.Router();
const validator = Validator.createValidator({});

const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  username: Joi.string().min(3).max(24).required(),
  password: Joi.string().min(6).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

router.post(
  '/register', 
  validator.body(registerSchema), 
  authControllers.controllers.postRegister
);

router.post(
  '/login', 
  validator.body(loginSchema), 
  authControllers.controllers.postLogin
);

// test route to verify middleware is working
router.get('/test', auth, (req, res) => {
  res.send('request passes');
});

export default router;