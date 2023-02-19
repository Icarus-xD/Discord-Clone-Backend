import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt, { Secret } from 'jsonwebtoken';

const User = require('../../models/user');

const postLogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      email: email.toLowerCase(),
    });

    if (user && await bcrypt.compare(password, user.password)) {
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

      return res.status(200).json({
        userDetails: {
          _id: user._id,
          email: user.email,
          token,
          username: user.username,
        }
      });
    }

    return res.status(400).send('Invalid credentials. Please try again.')
  } catch (error) {
    return res.status(500).send('Something went wrong. Please try again.')
  }
};

module.exports = postLogin;