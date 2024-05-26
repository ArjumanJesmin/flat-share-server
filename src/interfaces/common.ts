import { UserRole } from "@prisma/client";
import { IGenericErrorMessage } from "./error";
import { JwtPayload } from "jsonwebtoken";

export type IGenericErrorResponse = {
  statusCode: number;
  message: string;
  errorMessages: IGenericErrorMessage[];
};

export type IAuthUser =
  | {
      id: string;
      email: string;
      role: UserRole;
    }
  | JwtPayload
  | null;
