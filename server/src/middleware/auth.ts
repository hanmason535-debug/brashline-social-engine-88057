/**
 * Authentication middleware using Clerk
 * Verifies JWT tokens and extracts user info
 */
import { Request, Response, NextFunction } from "express";
import { verifyToken as clerkVerifyToken } from "@clerk/backend";
import { ApiError, asyncHandler } from "./error.js";
import { logger } from "../utils/logger.js";

// Extend Express Request to include auth info
declare global {
  namespace Express {
    interface Request {
      auth?: {
        userId: string;
        sessionId: string;
        claims?: Record<string, unknown>;
      };
    }
  }
}

// Get Clerk secret key
const getSecretKey = (): string => {
  const secretKey = process.env.CLERK_SECRET_KEY;
  if (!secretKey) {
    throw new Error("CLERK_SECRET_KEY environment variable is required");
  }
  return secretKey;
};

// Extract and verify bearer token
const extractToken = (req: Request): string | null => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return null;
  }
  return authHeader.substring(7);
};

// Verify token and get session claims
const verifyToken = async (token: string): Promise<{
  userId: string;
  sessionId: string;
  claims: Record<string, unknown>;
} | null> => {
  try {
    const secretKey = getSecretKey();
    const verified = await clerkVerifyToken(token, {
      secretKey,
    });
    
    if (!verified) {
      return null;
    }
    
    return {
      userId: verified.sub,
      sessionId: verified.sid || "",
      claims: verified as unknown as Record<string, unknown>,
    };
  } catch (error) {
    logger.error("Token verification failed", { error });
    return null;
  }
};

/**
 * Require authentication middleware
 * Throws 401 if no valid token is present
 */
export const requireAuth = asyncHandler(
  async (req: Request, _res: Response, next: NextFunction) => {
    const token = extractToken(req);
    
    if (!token) {
      throw ApiError.unauthorized("Authentication token required");
    }
    
    const auth = await verifyToken(token);
    
    if (!auth) {
      throw ApiError.unauthorized("Invalid or expired token");
    }
    
    req.auth = auth;
    logger.debug("User authenticated", { userId: auth.userId });
    next();
  }
);

/**
 * Optional authentication middleware
 * Sets req.auth if valid token is present, but doesn't require it
 */
export const optionalAuth = asyncHandler(
  async (req: Request, _res: Response, next: NextFunction) => {
    const token = extractToken(req);
    
    if (token) {
      const auth = await verifyToken(token);
      if (auth) {
        req.auth = auth;
        logger.debug("User authenticated (optional)", { userId: auth.userId });
      }
    }
    
    next();
  }
);

/**
 * Admin check middleware
 * Must be used after requireAuth
 */
export const requireAdmin = asyncHandler(
  async (req: Request, _res: Response, next: NextFunction) => {
    if (!req.auth) {
      throw ApiError.unauthorized("Authentication required");
    }
    
    // Check admin claim or role
    const isAdmin = req.auth.claims?.admin === true || 
                    req.auth.claims?.role === "admin" ||
                    req.auth.claims?.org_role === "admin";
    
    if (!isAdmin) {
      // For development, allow any authenticated user
      if (process.env.NODE_ENV === "development") {
        logger.warn("Admin check bypassed in development", { userId: req.auth.userId });
        next();
        return;
      }
      throw ApiError.forbidden("Admin access required");
    }
    
    next();
  }
);
