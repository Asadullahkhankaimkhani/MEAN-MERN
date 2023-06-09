import { Request, Response, NextFunction } from 'express';
import User from '../models/user.model';
import { UserDocument } from '../types/user.interface';
import { Error } from 'mongoose';
import jwt from 'jsonwebtoken';
import { secret } from '../config';

const normalizeUsername = (user: UserDocument) => {
  const token = jwt.sign({ id: user.id }, secret, {
    expiresIn: '1d',
  });

  return {
    email: user.email,
    username: user.username,
    id: user.id,
    token,
  };
};

export const userRegister = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, username, password } = req.body;
    const user = new User({
      email,
      username,
      password,
    });
    const savedUser = await user.save();
    res.status(201).json(normalizeUsername(savedUser));
  } catch (error) {
    if (error instanceof Error.ValidationError) {
      const messages = Object.values(error.errors).map((err) => err.message);
      res.status(400).json(messages);
    }
    next(error as Error);
  }
};

export const userLogin = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select('+password');
    const error = { emailOrPassword: 'Incorrect email or password' };

    if (!user) {
      return res.status(400).json(error);
    }

    const isSamePassword = await user.comparePassword(password);

    if (!isSamePassword) {
      return res.status(400).json(error);
    }

    res.send(normalizeUsername(user));
  } catch (error) {
    next(error as Error);
  }
};
