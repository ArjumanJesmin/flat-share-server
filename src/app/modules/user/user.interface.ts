export type IUser = {
  id: string;
  email: string;
  role: string;
  needPasswordChange: boolean;
  createdAt: Date;
  updatedAt: Date;
};
