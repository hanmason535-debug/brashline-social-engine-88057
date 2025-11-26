/**
 * Validation middleware using Zod
 * Request body, query, and params validation
 */
import { Request, Response, NextFunction } from "express";
import { z, ZodSchema } from "zod";
import { ApiError } from "./error.js";

// Validation schemas for common patterns
export const schemas = {
  email: z.string().email("Invalid email address"),
  uuid: z.string().uuid("Invalid UUID format"),
  name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name must be less than 100 characters"),
  message: z.string().min(10, "Message must be at least 10 characters").max(1000, "Message must be less than 1000 characters"),
  company: z.string().max(100, "Company name must be less than 100 characters").optional(),
};

// Contact form validation schema
export const contactFormSchema = z.object({
  name: schemas.name,
  email: schemas.email,
  company: schemas.company,
  phone: z.string().max(20, "Phone must be less than 20 characters").optional(),
  serviceType: z.string().max(50, "Service type must be less than 50 characters").optional(),
  message: schemas.message,
  source: z.string().max(50, "Source must be less than 50 characters").optional(),
  metadata: z.record(z.unknown()).optional(),
});

// Newsletter subscription schema
export const newsletterSchema = z.object({
  email: schemas.email,
  name: z.string().max(100, "Name must be less than 100 characters").optional(),
  source: z.string().max(50, "Source must be less than 50 characters").optional(),
  metadata: z.record(z.unknown()).optional(),
});

// User sync schema (from Clerk webhook)
export const userSyncSchema = z.object({
  id: z.string(),
  email_addresses: z.array(z.object({
    email_address: z.string().email(),
    id: z.string(),
  })).min(1),
  first_name: z.string().nullable(),
  last_name: z.string().nullable(),
  image_url: z.string().nullable(),
  public_metadata: z.record(z.unknown()).optional(),
});

// Generic validation middleware factory
export const validate = <T extends ZodSchema>(schema: T, source: "body" | "query" | "params" = "body") => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      const data = req[source];
      const validated = schema.parse(data);
      
      // Replace the source with validated data
      if (source === "body") {
        req.body = validated;
      } else if (source === "query") {
        (req as unknown as { query: z.infer<T> }).query = validated;
      } else {
        (req as unknown as { params: z.infer<T> }).params = validated;
      }
      
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const details = error.errors.map((e) => ({
          field: e.path.join("."),
          message: e.message,
          code: e.code,
        }));
        
        throw ApiError.badRequest("Validation failed", details);
      }
      throw error;
    }
  };
};

// Pagination query schema
export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

// Contact list query schema
export const contactListSchema = paginationSchema.extend({
  status: z.enum(["new", "read", "replied", "archived"]).optional(),
});

// Type exports
export type ContactFormInput = z.infer<typeof contactFormSchema>;
export type NewsletterInput = z.infer<typeof newsletterSchema>;
export type UserSyncInput = z.infer<typeof userSyncSchema>;
export type PaginationInput = z.infer<typeof paginationSchema>;
export type ContactListInput = z.infer<typeof contactListSchema>;
