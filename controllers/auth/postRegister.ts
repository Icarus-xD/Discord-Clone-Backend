import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt, { Secret } from 'jsonwebtoken';

const User = require('../../models/user');

const postRegister = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    const emailInUse = await User.exists({ email: email.toLowerCase() });
    const usernameInUse = await User.exists({ username });

    if (emailInUse && usernameInUse) {
      return res.status(400).send('Email and username already in use.');
    } else if (emailInUse) {
      return res.status(400).send('Email already in use.');
    } else if (usernameInUse) {
      return res.status(400).send('Username already in use.');
    }

    const encryptedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email: email.toLowerCase(),
      password: encryptedPassword,
    });

    const token = jwt.sign(
      {
        userId: user._id,
        email,
      },
      process.env.TOKEN_KEY as Secret,
      {
        expiresIn: '24h',
      }
    );

    return res.status(201).json({
      userDetails: {
        email: user.email,
        token,
        username: user.username,
      },
    });
  } catch (error) {
    return res.status(500).send('Error occured. Please try again.');
  }
};

module.exports = postRegister;