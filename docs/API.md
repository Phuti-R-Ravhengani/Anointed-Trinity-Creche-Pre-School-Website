# Anointed Trinity Pre-School - API Documentation

## Overview
Complete REST API for the Anointed Trinity Pre-School management system.

## Base URL
```
http://localhost:3000/api
```

## Authentication
All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## Endpoints

### Authentication
- `POST /auth/register` - Register new parent account
- `POST /auth/login` - Login and get JWT token
- `GET /auth/me` - Get current user profile

### Applications
- `POST /applications` - Submit new admission application
- `GET /applications` - List all applications (paginated)
- `GET /applications/[id]` - Get application details
- `PATCH /applications/[id]` - Update application status

### Branches
- `GET /branches` - List all branches
- `POST /branches` - Create new branch (admin only)
- `PATCH /branches/[id]` - Update branch (admin only)
- `DELETE /branches/[id]` - Delete branch (admin only)

### Events
- `GET /events` - List events (paginated)
- `POST /events` - Create event (admin only)
- `POST /events/[id]/rsvp` - RSVP to event
- `PATCH /events/[id]` - Update event (admin only)
- `DELETE /events/[id]` - Delete event (admin only)

### Announcements
- `GET /announcements` - List announcements
- `POST /announcements` - Create announcement (admin only)
- `DELETE /announcements/[id]` - Delete announcement (admin only)

### Gallery
- `GET /gallery` - List gallery images (with category filter)
- `POST /gallery` - Upload image (admin only)
- `DELETE /gallery/[id]` - Delete image (admin only)

### Payments & Invoices
This project no longer exposes payments or invoices — the website is informational only.

### Attendance
- `GET /attendance` - Get attendance records
- `POST /attendance` - Record attendance (admin only)

### Messages
- `GET /messages` - Get messages
- `POST /messages` - Send message

### Notifications
- `GET /notifications` - Get notifications
- `PATCH /notifications` - Mark notification as read

### Admin
- `GET /admin/dashboard` - Dashboard statistics (admin only)
- `POST /admin/auth/create-account` - Create admin account

## Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { /* response data */ }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "statusCode": 400
}
```

## Status Codes
- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `500` - Server Error

## Pagination
List endpoints support pagination via query parameters:
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `offset` - Skip N records (alternative to page)

## Example Requests

### Register
```bash
POST /api/auth/register
Content-Type: application/json

{
  "email": "parent@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "+27123456789"
}
```

### Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "parent@example.com",
  "password": "SecurePass123!"
}
```

### Submit Application
```bash
POST /api/applications
Content-Type: application/json
Authorization: Bearer <token>

{
  "childFirstName": "Emma",
  "childLastName": "Doe",
  "childDOB": "2021-03-15",
  "childGender": "female",
  "branchId": "branch-id",
  "classPreference": "NURSERY",
  "emergencyName": "Jane Doe",
  "emergencyPhone": "+27987654321",
  "emergencyEmail": "jane@example.com"
}
```

### RSVP to Event
```bash
POST /api/events/event-id/rsvp
Content-Type: application/json
Authorization: Bearer <token>

{
  "numberOfAttendees": 2
}
```

## Rate Limiting
Currently no rate limiting implemented. Production deployment should include:
- 100 requests per minute per IP
- 1000 requests per hour per authenticated user

## Error Handling
All errors follow the standard error response format with appropriate HTTP status codes.

## Security Notes
- All passwords are hashed with bcryptjs (12-salt rounds)
- JWT tokens expire after 7 days
- Admin endpoints require ADMIN role
- Database queries protected against SQL injection via Prisma
- CORS headers configured for authorized domains

## Webhooks (Planned)
- Application status updates
- Payment confirmations
- Event reminders
- New announcements

## Versioning
Current API version: v1 (no version prefix in URLs)
Future versions will use `/api/v2/...` pattern
