import { NextFunction, Request, Response } from 'express';
import jwt, { Secret } from 'jsonwebtoken';

const config = process.env;

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  let token = req.body.token || req.query.token || req.headers.authorization;

  if (!token) {
    return res.status(403).send('A token is required for authentication.');
  }

  try { 
    token = token.replace(/^Bearer\s+/, '');

    const decoded = jwt.verify(token, config.TOKEN_KEY as Secret);

    req.body.user = decoded;
  } catch (error) {
    return res.status(401).send('Invalid token.')
  }

  return next();
};

module.exports = verifyToken;