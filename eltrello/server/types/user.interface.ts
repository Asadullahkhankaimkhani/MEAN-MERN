export interface User {
  id?: string;
  email: string;
  username: string;
  password: string;
  createdAt: Date;
}

export interface UserDocument extends User, Document {
  comparePassword: (password: string) => Promise<boolean>;
}
