# Database Schema Documentation

## Overview

Anointed Trinity uses PostgreSQL with Prisma ORM. This document describes the data model.

## Entity Relationship Diagram

```
User (ADMIN, PARENT, STAFF)
├── Parent
│   ├── Child
│   │   ├── Application
│   │   │   ├── Document
│   │   │   └── Branch
│   │   └── Attendance
│   ├── Message
│   ├── Payment
│   │   └── Invoice
│   └── Session
### Invoice (removed)

The `Invoice` and `Payment` tables were removed from the public-facing API — this website is informational only and does not expose billing functionality. The Prisma models may still exist in the schema for legacy purposes.
| Column | Type | Description |
|--------|------|-------------|
| id | String | Primary key (UUID) |
| email | String | Unique email address |
| password | String | Hashed password |
| firstName | String | First name |
| lastName | String | Last name |
| phoneNumber | String | Contact phone |
| profileImage | String | Avatar URL |
| role | Enum | ADMIN, PARENT, STAFF |
| verified | Boolean | Email verification status |
| createdAt | DateTime | Creation timestamp |
| updatedAt | DateTime | Last update timestamp |

### Parent
Extends User with parent-specific information.

| Column | Type | Description |
|--------|------|-------------|
| id | String | Primary key (UUID) |
| userId | String | Foreign key to User |
| occupation | String | Parent's job title |
| company | String | Employer name |
| address | String | Physical address |
| city | String | City |
| province | String | Province |
| postalCode | String | Postal code |
| emergencyName | String | Emergency contact name |
| emergencyPhone | String | Emergency contact phone |
| emergencyEmail | String | Emergency contact email |

### Child
Represents students.

| Column | Type | Description |
|--------|------|-------------|
| id | String | Primary key (UUID) |
| parentId | String | Foreign key to Parent |
| firstName | String | First name |
| lastName | String | Last name |
| dateOfBirth | DateTime | Date of birth |
| gender | String | Male / Female / Other |
| allergies | String | Allergy information |
| medicalNotes | String | Medical history |
| enrollmentDate | DateTime | When enrolled |
| createdAt | DateTime | Creation timestamp |

### Application
Admission applications.

| Column | Type | Description |
|--------|------|-------------|
| id | String | Primary key (UUID) |
| referenceNumber | String | Unique application ID |
| parentId | String | Foreign key to Parent |
| childId | String | Foreign key to Child |
| branchId | String | Foreign key to Branch |
| status | Enum | PENDING, REVIEWING, APPROVED, REJECTED, ENROLLED |
| classPreference | String | Preferred class/grade |
| startDate | DateTime | Intended start date |
| rejectionReason | String | Reason if rejected |
| reviewedBy | String | Admin who reviewed |
| reviewedAt | DateTime | Review timestamp |
| createdAt | DateTime | Submission timestamp |

### Document
Files uploaded with applications.

| Column | Type | Description |
|--------|------|-------------|
| id | String | Primary key (UUID) |
| applicationId | String | Foreign key to Application |
| type | Enum | BIRTH_CERT, ID_COPY, PROOF_OF_ADDRESS |
| fileName | String | Original file name |
| fileUrl | String | Cloudinary URL |
| uploadedAt | DateTime | Upload timestamp |

### Branch
School locations.

| Column | Type | Description |
|--------|------|-------------|
| id | String | Primary key (UUID) |
| name | String | Branch name |
| address | String | Street address |
| city | String | City |
| province | String | Province |
| postalCode | String | Postal code |
| country | String | Country |
| phoneNumber | String | Contact phone |
| email | String | Contact email |
| branchManager | String | Manager name |
| numberOfClasses | Integer | Class count |
| description | String | Branch description |
| createdAt | DateTime | Creation timestamp |

### Class
Class/Grade information.

| Column | Type | Description |
|--------|------|-------------|
| id | String | Primary key (UUID) |
| branchId | String | Foreign key to Branch |
| name | String | Class name (Nursery, Toddler, etc.) |
| ageGroup | String | Age range |
| capacity | Integer | Max students |
| staffRatio | String | Staff to student ratio |
| description | String | Class description |

### Event
School events.

| Column | Type | Description |
|--------|------|-------------|
| id | String | Primary key (UUID) |
| title | String | Event name |
| description | String | Event details |
| startDate | DateTime | Start date/time |
| endDate | DateTime | End date/time |
| location | String | Event location |
| category | Enum | SPORTS_DAY, CULTURAL, PARENT_MEETING |
| capacity | Integer | Max attendees |
| rsvpCount | Integer | Current RSVPs |
| createdAt | DateTime | Creation timestamp |

### EventRsvp
Event attendance tracking.

| Column | Type | Description |
|--------|------|-------------|
| id | String | Primary key (UUID) |
| eventId | String | Foreign key to Event |
| parentId | String | Foreign key to Parent |
| numberOfAttendees | Integer | People attending |
| responseDate | DateTime | RSVP timestamp |

### Announcement
School news and updates.

| Column | Type | Description |
|--------|------|-------------|
| id | String | Primary key (UUID) |
| title | String | Announcement title |
| content | String | Full content |
| priority | Enum | LOW, NORMAL, HIGH, URGENT |
| published | Boolean | Published status |
| createdAt | DateTime | Creation timestamp |

### Gallery
Photo gallery items.

| Column | Type | Description |
|--------|------|-------------|
| id | String | Primary key (UUID) |
| title | String | Image title |
| description | String | Image description |
| imageUrl | String | Image URL |
| category | Enum | CLASSES, EVENTS, SPORTS, LEARNING_ACTIVITIES |
| uploadedBy | String | Admin ID |
| createdAt | DateTime | Upload timestamp |

### Invoice
Billing invoices.

| Column | Type | Description |
|--------|------|-------------|
| id | String | Primary key (UUID) |
| parentId | String | Foreign key to Parent |
| invoiceNumber | String | Unique invoice number |
| amount | Decimal | Total amount |
| dueDate | DateTime | Due date |
| status | Enum | PENDING, PAID, OVERDUE |
| description | String | Invoice details |
| createdAt | DateTime | Creation timestamp |

### Payment
Payment records.

| Column | Type | Description |
|--------|------|-------------|
| id | String | Primary key (UUID) |
| invoiceId | String | Foreign key to Invoice |
| amount | Decimal | Payment amount |
| method | Enum | BANK_TRANSFER, CARD, CASH, CHEQUE |
| reference | String | Payment reference |
| status | Enum | PENDING, COMPLETED, FAILED |
| createdAt | DateTime | Payment timestamp |

### Attendance
Student attendance tracking.

| Column | Type | Description |
|--------|------|-------------|
| id | String | Primary key (UUID) |
| childId | String | Foreign key to Child |
| date | DateTime | Attendance date |
| status | Enum | PRESENT, ABSENT, LATE, EXCUSED |
| notes | String | Additional notes |

### Message
Parent-Admin communication.

| Column | Type | Description |
|--------|------|-------------|
| id | String | Primary key (UUID) |
| senderId | String | Foreign key to User |
| recipientId | String | Foreign key to User |
| subject | String | Message subject |
| body | String | Message content |
| read | Boolean | Read status |
| createdAt | DateTime | Send timestamp |

### Notification
System notifications.

| Column | Type | Description |
|--------|------|-------------|
| id | String | Primary key (UUID) |
| userId | String | Foreign key to User |
| type | Enum | APP_STATUS, ANNOUNCEMENT, PAYMENT, EVENT |
| title | String | Notification title |
| message | String | Notification content |
| read | Boolean | Read status |
| createdAt | DateTime | Creation timestamp |

### Session
JWT session tokens.

| Column | Type | Description |
|--------|------|-------------|
| id | String | Primary key (UUID) |
| userId | String | Foreign key to User |
| token | String | JWT token |
| expiresAt | DateTime | Token expiry |
| createdAt | DateTime | Creation timestamp |

### NewsletterSubscription
Email newsletter subscribers.

| Column | Type | Description |
|--------|------|-------------|
| id | String | Primary key (UUID) |
| email | String | Subscriber email |
| subscribedAt | DateTime | Subscription date |
| unsubscribedAt | DateTime | Unsubscription date |

## Enums

### UserRole
- ADMIN
- PARENT
- STAFF

### ApplicationStatus
- PENDING
- REVIEWING
- APPROVED
- REJECTED
- ENROLLED

### DocumentType
- BIRTH_CERT
- ID_COPY
- PROOF_OF_ADDRESS

### EventCategory
- SPORTS_DAY
- CULTURAL_PROGRAM
- PARENT_MEETING
- CELEBRATION

### GalleryCategory
- CLASSES
- EVENTS
- SPORTS
- LEARNING_ACTIVITIES

### Priority
- LOW
- NORMAL
- HIGH
- URGENT

### PaymentMethod
- BANK_TRANSFER
- CARD
- CASH
- CHEQUE

### PaymentStatus
- PENDING
- COMPLETED
- FAILED

### AttendanceStatus
- PRESENT
- ABSENT
- LATE
- EXCUSED

### NotificationType
- APP_STATUS
- ANNOUNCEMENT
- PAYMENT
- EVENT

## Indices & Performance

Key indices for performance:

```sql
-- Authentication
CREATE INDEX idx_user_email ON "User"(email);
CREATE INDEX idx_session_userId ON "Session"(userId);

-- Applications
CREATE INDEX idx_application_parentId ON "Application"(parentId);
CREATE INDEX idx_application_status ON "Application"(status);
CREATE INDEX idx_document_applicationId ON "Document"(applicationId);

-- Content Management
CREATE INDEX idx_announcement_published ON "Announcement"(published);
CREATE INDEX idx_gallery_category ON "Gallery"(category);

-- Notifications
CREATE INDEX idx_notification_userId ON "Notification"(userId);
CREATE INDEX idx_notification_read ON "Notification"(read);

-- Financial
CREATE INDEX idx_invoice_parentId ON "Invoice"(parentId);
CREATE INDEX idx_payment_invoiceId ON "Payment"(invoiceId);
```

## Full-Text Search Indices

```prisma
/// Searchable by title, description
Event

/// Searchable by firstName, lastName
Child

/// Searchable by name, city
Branch

/// Searchable by title, content
Announcement

/// Searchable by title, description
Gallery
```

## Data Constraints

- Email addresses must be unique
- Phone numbers validated for South Africa (+27 prefix or local formats)
- Passwords minimum 8 characters with complexity requirements
- Application reference numbers auto-generated (ATK-[TIMESTAMP]-[RANDOM])
- JWT tokens expire after 7 days
- File uploads limited to 10MB
- Database backups retained for 30 days

## Migration Strategy

For schema updates:

```bash
# Create migration
npx prisma migrate dev --name description_of_change

# Apply to production
npx prisma migrate deploy

# Reset database (development only)
npx prisma migrate reset
```

## Backup & Recovery

```bash
# Daily automated backups to cloud storage
# Recovery point objective (RPO): 24 hours
# Recovery time objective (RTO): 4 hours
```
