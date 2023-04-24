export interface User {
  email: string;
  username: string;
  password: string;
  createdAt: Date;
}

export interface UserDocument extends User, Document {
  comparePassword: (password: string) => Promise<boolean>;
}