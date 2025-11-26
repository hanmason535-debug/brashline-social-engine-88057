# Brashline Backend API Documentation

## Overview

The Brashline backend API provides endpoints for contact form submissions, newsletter subscriptions, and user management. The API is deployed as Vercel Serverless Functions and uses Neon PostgreSQL for data persistence.

## Base URL

- **Development**: `http://localhost:3001`
- **Production**: `https://brashline.com/api`

## Authentication

Some endpoints require authentication via Clerk JWT tokens. Include the token in the Authorization header:

```
Authorization: Bearer <clerk_jwt_token>
```

## Endpoints

### Health Check

**GET** `/api/health`

Check API and database health.

**Response**:
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "database": "connected",
    "timestamp": "2024-01-15T10:30:00Z",
    "latency": 45
  }
}
```

---

### Contact Form

#### Submit Contact Form

**POST** `/api/contact`

Submit a contact form. Saves to database and can optionally trigger WhatsApp notification.

**Request Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",           // optional
  "company": "Acme Inc",            // optional
  "serviceType": "social",          // optional: social, content, ads, consulting, other
  "message": "I'm interested in your services...",
  "source": "website",              // optional
  "metadata": {                     // optional
    "lang": "en",
    "userAgent": "Mozilla/5.0..."
  }
}
```

**Response** (201 Created):
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "createdAt": "2024-01-15T10:30:00Z",
    "message": "Thank you for your message. We'll get back to you soon!"
  }
}
```

**Rate Limit**: 5 submissions per hour per IP

---

### Newsletter

#### Subscribe to Newsletter

**POST** `/api/newsletter/subscribe`

Subscribe an email to the newsletter.

**Request Body**:
```json
{
  "email": "john@example.com",
  "name": "John",                   // optional
  "source": "footer",               // optional
  "metadata": {                     // optional
    "lang": "en"
  }
}
```

**Response** (201 Created for new, 200 OK for existing):
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "message": "Thank you for subscribing to our newsletter!",
    "status": "subscribed",         // subscribed | reactivated | existing
    "subscribedAt": "2024-01-15T10:30:00Z"
  }
}
```

#### Unsubscribe from Newsletter

**POST** `/api/newsletter/unsubscribe`

Unsubscribe an email from the newsletter.

**Request Body**:
```json
{
  "email": "john@example.com"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "message": "You've been unsubscribed from our newsletter.",
    "status": "unsubscribed"        // unsubscribed | already_unsubscribed
  }
}
```

**Rate Limit**: 3 requests per hour per IP

---

### User Profile (Authenticated)

#### Get Current User

**GET** `/api/auth/me`

Get the current authenticated user's profile.

**Headers**: Requires `Authorization: Bearer <token>`

**Response**:
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "clerkId": "user_xxx",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "imageUrl": "https://...",
    "preferences": {
      "theme": "dark",
      "language": "en",
      "emailNotifications": true
    },
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

#### Update User Preferences

**PATCH** `/api/auth/me/preferences`

Update user preferences.

**Headers**: Requires `Authorization: Bearer <token>`

**Request Body**:
```json
{
  "theme": "dark",                  // optional: light | dark | system
  "language": "es",                 // optional: en | es
  "emailNotifications": false       // optional
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "theme": "dark",
    "language": "es",
    "emailNotifications": false
  }
}
```

---

## Error Responses

All endpoints return errors in a consistent format:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request data",
    "details": [
      { "field": "email", "message": "Invalid email address" }
    ]
  }
}
```

### Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `VALIDATION_ERROR` | 400 | Invalid request body |
| `UNAUTHORIZED` | 401 | Missing or invalid auth token |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `RATE_LIMITED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Server error |

---

## Database Schema

### Tables

1. **users**: Synced from Clerk authentication
   - `id`, `clerk_id`, `email`, `first_name`, `last_name`, `image_url`, `metadata`, `created_at`, `updated_at`

2. **contact_submissions**: Contact form entries
   - `id`, `user_id`, `name`, `email`, `company`, `phone`, `service_type`, `message`, `status`, `source`, `metadata`, `created_at`

3. **newsletter_subscribers**: Newsletter list
   - `id`, `email`, `name`, `status`, `source`, `metadata`, `subscribed_at`, `unsubscribed_at`

4. **user_preferences**: User settings
   - `id`, `user_id`, `theme`, `language`, `email_notifications`, `created_at`, `updated_at`

---

## Local Development

### Prerequisites

- Node.js 18+
- npm or bun
- Neon PostgreSQL database

### Setup

1. Install dependencies:
   ```bash
   cd server
   npm install
   ```

2. Configure environment variables in `.env`:
   ```
   DATABASE_URL=postgresql://...
   CLERK_SECRET_KEY=sk_test_...
   PORT=3001
   NODE_ENV=development
   ```

3. Run migrations:
   ```bash
   npm run migrate
   ```

4. Start development server:
   ```bash
   npm run dev
   ```

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Compile TypeScript
- `npm run start` - Start production server
- `npm run migrate` - Run database migrations
- `npm run db:query` - Run ad-hoc database queries

---

## Deployment

### Vercel

The API is deployed as Vercel Serverless Functions. Environment variables must be configured in the Vercel dashboard:

- `DATABASE_URL` - Neon PostgreSQL connection string
- `CLERK_SECRET_KEY` - Clerk backend secret key
- `CLERK_WEBHOOK_SECRET` - (Optional) For Clerk webhook verification

### Required Vercel Configuration

See `vercel.json` for the complete configuration including:
- Function runtime settings
- API route rewrites
- CORS headers

---

## Security

- All endpoints use rate limiting to prevent abuse
- Authentication uses Clerk JWT verification
- Database connections use SSL encryption
- CORS is configured for allowed origins only
- Request validation using Zod schemas
- SQL injection prevention via parameterized queries
