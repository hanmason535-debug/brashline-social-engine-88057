/**
 * User controller
 * Handles user sync from Clerk webhooks and user operations
 */
import { Request, Response } from "express";
import { getSql } from "../config/database.js";
import { asyncHandler, ApiError } from "../middleware/error.js";
import { logger } from "../utils/logger.js";

interface ClerkUser {
  id: string;
  email_addresses: Array<{ email_address: string }>;
  first_name: string | null;
  last_name: string | null;
  image_url: string | null;
  public_metadata?: Record<string, unknown>;
}

/**
 * Sync user from Clerk to database
 */
export const syncUser = async (clerkUser: ClerkUser): Promise<void> => {
  const sql = getSql();
  const email = clerkUser.email_addresses[0]?.email_address;
  if (!email) throw new Error("User has no email address");
  
  const existing = await sql`SELECT id FROM users WHERE clerk_id = ${clerkUser.id}`;
  
  if (existing.length > 0) {
    await sql`UPDATE users SET email = ${email}, first_name = ${clerkUser.first_name}, last_name = ${clerkUser.last_name},
      image_url = ${clerkUser.image_url}, metadata = ${JSON.stringify(clerkUser.public_metadata || {})}, updated_at = NOW()
      WHERE clerk_id = ${clerkUser.id}`;
    logger.info("User updated from Clerk", { clerkId: clerkUser.id });
  } else {
    await sql`INSERT INTO users (clerk_id, email, first_name, last_name, image_url, metadata)
      VALUES (${clerkUser.id}, ${email}, ${clerkUser.first_name}, ${clerkUser.last_name}, ${clerkUser.image_url}, ${JSON.stringify(clerkUser.public_metadata || {})})`;
    logger.info("User created from Clerk", { clerkId: clerkUser.id, email });
  }
};

/**
 * Delete user from database
 */
export const deleteUser = async (clerkId: string): Promise<void> => {
  const sql = getSql();
  const result = await sql`DELETE FROM users WHERE clerk_id = ${clerkId} RETURNING id`;
  if (result.length > 0) logger.info("User deleted from database", { clerkId });
};

/**
 * Get current user profile
 * GET /api/users/me
 */
export const getCurrentUser = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.auth?.userId) throw ApiError.unauthorized("Authentication required");
    const sql = getSql();
    
    const result = await sql`SELECT u.*, up.theme, up.language, up.email_notifications
      FROM users u LEFT JOIN user_preferences up ON u.id = up.user_id WHERE u.clerk_id = ${req.auth.userId}`;
    
    if (result.length === 0) throw ApiError.notFound("User not found");
    const user = result[0];
    
    res.json({
      success: true,
      data: {
        id: user.id, clerkId: user.clerk_id, email: user.email, firstName: user.first_name, lastName: user.last_name,
        imageUrl: user.image_url, metadata: user.metadata,
        preferences: { theme: user.theme || "system", language: user.language || "en", emailNotifications: user.email_notifications ?? true },
        createdAt: user.created_at, updatedAt: user.updated_at,
      },
    });
  }
);

/**
 * Update user preferences
 * PATCH /api/users/me/preferences
 */
export const updatePreferences = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.auth?.userId) throw ApiError.unauthorized("Authentication required");
    const sql = getSql();
    const { theme, language, emailNotifications } = req.body;
    
    const userResult = await sql`SELECT id FROM users WHERE clerk_id = ${req.auth.userId}`;
    if (userResult.length === 0) throw ApiError.notFound("User not found");
    const userId = userResult[0].id;
    
    const result = await sql`
      INSERT INTO user_preferences (user_id, theme, language, email_notifications)
      VALUES (${userId}, ${theme || 'system'}, ${language || 'en'}, ${emailNotifications ?? true})
      ON CONFLICT (user_id) DO UPDATE SET
        theme = COALESCE(${theme}, user_preferences.theme),
        language = COALESCE(${language}, user_preferences.language),
        email_notifications = COALESCE(${emailNotifications}, user_preferences.email_notifications),
        updated_at = NOW()
      RETURNING *
    `;
    
    logger.info("User preferences updated", { userId, theme, language });
    res.json({ success: true, data: { theme: result[0].theme, language: result[0].language, emailNotifications: result[0].email_notifications } });
  }
);

/**
 * Get all users (admin)
 * GET /api/users
 */
export const getAllUsers = asyncHandler(
  async (req: Request, res: Response) => {
    const sql = getSql();
    const page = Number(req.query.page) || 1;
    const limit = Math.min(Number(req.query.limit) || 20, 100);
    const offset = (page - 1) * limit;
    
    const users = await sql`SELECT u.id, u.clerk_id, u.email, u.first_name, u.last_name, u.image_url, u.created_at, up.theme, up.language
      FROM users u LEFT JOIN user_preferences up ON u.id = up.user_id ORDER BY u.created_at DESC LIMIT ${limit} OFFSET ${offset}`;
    const countResult = await sql`SELECT COUNT(*) as count FROM users`;
    const total = Number(countResult[0].count);
    
    res.json({
      success: true,
      data: {
        users: users.map((u: Record<string, unknown>) => ({
          id: u.id, clerkId: u.clerk_id, email: u.email, firstName: u.first_name, lastName: u.last_name,
          imageUrl: u.image_url, createdAt: u.created_at, preferences: { theme: u.theme || "system", language: u.language || "en" },
        })),
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
      },
    });
  }
);
