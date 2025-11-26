/**
 * Contact form controller
 * Handles contact form submissions and retrieval
 */
import { Request, Response } from "express";
import { getSql } from "../config/database.js";
import { asyncHandler, ApiError } from "../middleware/error.js";
import { ContactFormInput, ContactListInput } from "../middleware/validation.js";
import { logger } from "../utils/logger.js";

/**
 * Submit a contact form
 * POST /api/contact
 */
export const submitContact = asyncHandler(
  async (req: Request, res: Response) => {
    const { name, email, company, phone, serviceType, message, source, metadata } = req.body as ContactFormInput;
    const sql = getSql();
    
    // Get user ID if authenticated
    let userId: string | null = null;
    if (req.auth?.userId) {
      const userResult = await sql`SELECT id FROM users WHERE clerk_id = ${req.auth.userId}`;
      if (userResult.length > 0) {
        userId = userResult[0].id as string;
      }
    }
    
    // Insert contact submission with all fields
    const result = await sql`
      INSERT INTO contact_submissions (name, email, company, phone, service_type, message, user_id, status, source, metadata)
      VALUES (${name}, ${email}, ${company || null}, ${phone || null}, ${serviceType || null}, ${message}, ${userId}, 'new', ${source || 'website'}, ${metadata ? JSON.stringify(metadata) : null}::jsonb)
      RETURNING id, created_at
    `;
    
    logger.info("Contact form submitted", { id: result[0].id, email, hasUser: !!userId, serviceType });
    
    res.status(201).json({
      success: true,
      data: {
        id: result[0].id,
        createdAt: result[0].created_at,
        message: "Thank you for your message. We'll get back to you soon!",
      },
    });
  }
);

/**
 * Get all contact submissions (admin)
 * GET /api/contact
 */
export const getContactSubmissions = asyncHandler(
  async (req: Request, res: Response) => {
    const { page = 1, limit = 20, status, sortOrder = "desc" } = req.query as unknown as ContactListInput;
    const sql = getSql();
    const offset = (page - 1) * limit;
    
    let submissions;
    let countResult;
    
    if (status) {
      submissions = sortOrder === "asc"
        ? await sql`SELECT cs.id, cs.name, cs.email, cs.company, cs.message, cs.status, cs.created_at, cs.user_id,
            u.first_name as user_first_name, u.last_name as user_last_name, u.image_url as user_image_url
          FROM contact_submissions cs LEFT JOIN users u ON cs.user_id = u.id
          WHERE cs.status = ${status} ORDER BY cs.created_at ASC LIMIT ${limit} OFFSET ${offset}`
        : await sql`SELECT cs.id, cs.name, cs.email, cs.company, cs.message, cs.status, cs.created_at, cs.user_id,
            u.first_name as user_first_name, u.last_name as user_last_name, u.image_url as user_image_url
          FROM contact_submissions cs LEFT JOIN users u ON cs.user_id = u.id
          WHERE cs.status = ${status} ORDER BY cs.created_at DESC LIMIT ${limit} OFFSET ${offset}`;
      countResult = await sql`SELECT COUNT(*) as count FROM contact_submissions WHERE status = ${status}`;
    } else {
      submissions = sortOrder === "asc"
        ? await sql`SELECT cs.id, cs.name, cs.email, cs.company, cs.message, cs.status, cs.created_at, cs.user_id,
            u.first_name as user_first_name, u.last_name as user_last_name, u.image_url as user_image_url
          FROM contact_submissions cs LEFT JOIN users u ON cs.user_id = u.id ORDER BY cs.created_at ASC LIMIT ${limit} OFFSET ${offset}`
        : await sql`SELECT cs.id, cs.name, cs.email, cs.company, cs.message, cs.status, cs.created_at, cs.user_id,
            u.first_name as user_first_name, u.last_name as user_last_name, u.image_url as user_image_url
          FROM contact_submissions cs LEFT JOIN users u ON cs.user_id = u.id ORDER BY cs.created_at DESC LIMIT ${limit} OFFSET ${offset}`;
      countResult = await sql`SELECT COUNT(*) as count FROM contact_submissions`;
    }
    
    const total = Number(countResult[0].count);
    
    res.json({
      success: true,
      data: {
        submissions: submissions.map((s: Record<string, unknown>) => ({
          id: s.id, name: s.name, email: s.email, company: s.company, message: s.message, status: s.status, createdAt: s.created_at,
          user: s.user_id ? { id: s.user_id, firstName: s.user_first_name, lastName: s.user_last_name, imageUrl: s.user_image_url } : null,
        })),
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
      },
    });
  }
);

/**
 * Update contact submission status
 * PATCH /api/contact/:id
 */
export const updateContactStatus = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;
    const sql = getSql();
    
    if (!["new", "read", "replied", "archived"].includes(status)) {
      throw ApiError.badRequest("Invalid status value");
    }
    
    const result = await sql`UPDATE contact_submissions SET status = ${status} WHERE id = ${id} RETURNING id, status`;
    if (result.length === 0) throw ApiError.notFound("Contact submission not found");
    
    logger.info("Contact status updated", { id, status });
    res.json({ success: true, data: { id: result[0].id, status: result[0].status } });
  }
);

/**
 * Get single contact submission
 * GET /api/contact/:id
 */
export const getContactById = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const sql = getSql();
    
    const result = await sql`SELECT cs.*, u.first_name as user_first_name, u.last_name as user_last_name, 
      u.email as user_email, u.image_url as user_image_url
      FROM contact_submissions cs LEFT JOIN users u ON cs.user_id = u.id WHERE cs.id = ${id}`;
    
    if (result.length === 0) throw ApiError.notFound("Contact submission not found");
    const s = result[0];
    
    res.json({
      success: true,
      data: {
        id: s.id, name: s.name, email: s.email, company: s.company, message: s.message, status: s.status, createdAt: s.created_at,
        user: s.user_id ? { id: s.user_id, firstName: s.user_first_name, lastName: s.user_last_name, email: s.user_email, imageUrl: s.user_image_url } : null,
      },
    });
  }
);
