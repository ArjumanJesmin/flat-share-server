export type IUser = {
  id: string;
  username: string;
  email: string;
  password: string;
  needPasswordChange: boolean;
  createdAt: Date;
  updatedAt: Date;
};
