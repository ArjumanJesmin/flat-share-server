import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import config from "../config";

const generateToken = (payload: any, secret: Secret, expiresIn: string) => {
  const token = jwt.sign(payload, secret, {
    algorithm: "HS256",
    expiresIn: config.jwt.expires_in,
  });
  return token;
};

const verifyToken = (token: string, secret: Secret): JwtPayload => {
  return jwt.verify(token, secret) as JwtPayload;
};

const createPasswordResetToken = (payload: object) => {
  return jwt.sign(payload, config.jwt.jwt_secret as Secret, {
    algorithm: "HS256",
    expiresIn: config.jwt.expires_in,
  });
};

export const jwtHelpers = {
  generateToken,
  verifyToken,
  createPasswordResetToken,
};
