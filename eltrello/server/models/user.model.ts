import { Schema, model } from 'mongoose';
import { UserDocument } from '../types/user.interface';
import validator from 'validator';
import bcrypt from 'bcryptjs';

const userSchema = new Schema<UserDocument>(
  {
    email: {
      type: String,
      required: [true, 'Please provide an email address'],
      validate: [validator.isEmail, 'Please provide a valid email address'],
      createIndexes: {
        unique: true,
      },
    },
    username: {
      type: String,
      required: [true, 'Please provide a username'],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      select: false,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

userSchema.methods.comparePassword = async function (password: string) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    throw new Error('Error while comparing password. Please try again later.');
  }
};

export default model<UserDocument>('User', userSchema);
