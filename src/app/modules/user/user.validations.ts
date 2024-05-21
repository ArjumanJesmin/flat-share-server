import { z } from "zod";

// Define a schema for the UserRole enum
const UserRole = z.enum(["APPLICANT", "ADMIN", "MANAGER", "USER"]);
// Admin schema
const AdminSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  user: UserRole,
  password: z.string(),
  profilePhoto: z.string().optional(),
});

// Manager schema
const ManagerSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  user: UserRole,
  password: z.string(),
  profilePhoto: z.string().optional(),
});
// Define the Applicant schema
const ApplicantSchema = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  email: z.string().email().optional(),
  password: z.string().optional(),
  role: UserRole,
  profilePhoto: z.string().optional(),
});

export const UserValidation = {
  AdminSchema,
  ApplicantSchema,
  ManagerSchema,
};
