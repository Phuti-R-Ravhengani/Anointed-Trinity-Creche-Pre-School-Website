# Anointed Trinity Pre-School - Full Stack Website

A modern, production-ready website for **Anointed Trinity Pre-School** built with **Next.js 15**, **React 19**, **TypeScript**, **Tailwind CSS**, and **PostgreSQL**.

## 🎯 Overview

This is a comprehensive full-stack application designed to serve as a complete digital platform for a South African pre-school. It includes public-facing pages, an admission system, parent portal, and an admin dashboard.

## ✨ Features

### Public Website
- **Home Page**: Hero section, features, and call-to-action
- **About Us**: School mission, vision, values, and leadership team
- **Branches**: Location information for all school branches
- **Admissions**: Complete online admission form with multi-step process
- **Gallery**: Photo gallery with category filtering
- **Events**: Event listings with RSVP functionality
- **Contact**: Contact form and location information
- **Announcements**: News and school announcements

### Parent Portal
- View child's profile and attendance
 - Track application status
 - Receive notifications and updates
- Access school announcements

### Admin Dashboard
- **Dashboard**: Overview statistics and quick actions
- **Applications Management**: Review, approve, or reject applications
- **Gallery Management**: Upload and manage school photos
- **Events Management**: Create and manage school events
- **Announcements**: Publish school news
- **Parent Management**: Manage parent accounts
- **Reports**: View statistics and reports

### Technical Features
- **JWT Authentication**: Secure user authentication
- **Role-Based Access Control**: Admin, Parent, and Staff roles
- **Email Notifications**: Automated email confirmations
- **File Management**: Support for document uploads
- **Responsive Design**: Mobile-first approach
- **Dark Mode**: Light/dark theme support
- **SEO Optimized**: Meta tags and structured data
- **Database**: PostgreSQL with Prisma ORM

## 🛠️ Tech Stack

### Frontend
- **Next.js 15**: React framework with server components
- **React 19**: Latest React version
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Smooth animations and transitions
- **React Hot Toast**: Toast notifications
- **React Icons**: Icon library
- **React Hook Form**: Form state management

### Backend
- **Next.js API Routes**: Serverless backend
- **Node.js**: JavaScript runtime
- **Express.js**: Web framework (optional, can use Next.js routes)
- **PostgreSQL**: Relational database
- **Prisma ORM**: Database access
- **JWT**: Authentication tokens
- **bcryptjs**: Password hashing
- **Nodemailer**: Email service

### DevOps & Tools
- **Docker**: Containerization
- **GitHub Actions**: CI/CD
- **ESLint**: Code linting
- **Prettier**: Code formatting

## 📋 Project Structure

```
anointed-trinity-preschool/
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── api/               # API routes
│   │   │   ├── auth/          # Authentication endpoints
│   │   │   ├── applications/  # Application management
│   │   │   ├── branches/      # Branch information
│   │   │   ├── events/        # Events endpoints
│   │   │   ├── gallery/       # Gallery endpoints
│   │   │   ├── announcements/ # Announcements endpoints
│   │   │   ├── admin/         # Admin endpoints
│   │   │   ├── upload/        # File upload
│   │   │   └── email/         # Email service
│   │   ├── (pages)/           # Public pages
│   │   │   ├── page.tsx       # Home page
│   │   │   ├── about/         # About page
│   │   │   ├── branches/      # Branches page
│   │   │   ├── admissions/    # Admissions page
│   │   │   ├── gallery/       # Gallery page
│   │   │   ├── events/        # Events page
│   │   │   ├── contact/       # Contact page
│   │   │   ├── auth/          # Auth pages
│   │   │   └── admin/         # Admin pages
│   │   ├── layout.tsx         # Root layout
│   │   └── globals.css        # Global styles
│   ├── components/            # React components
│   │   ├── ui/               # UI components
│   │   ├── layout/           # Layout components
│   │   ├── sections/         # Page sections
│   │   └── admin/            # Admin components
│   ├── lib/                   # Utility functions
│   │   ├── prisma.ts         # Database client
│   │   ├── auth.ts           # Auth utilities
│   │   ├── email.ts          # Email service
│   │   └── middleware.ts     # Request middleware
│   ├── types/                # TypeScript types
│   └── utils/                # Helper functions
├── prisma/
│   ├── schema.prisma         # Database schema
│   └── seed.ts               # Seed data
├── public/                    # Static assets
├── .env.example              # Environment variables template
├── package.json              # Dependencies
├── tsconfig.json             # TypeScript config
├── next.config.ts            # Next.js config
├── tailwind.config.ts        # Tailwind config
└── README.md                 # This file
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL 12+
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd anointed-trinity-preschool
```

2. **Install dependencies**
```bash
npm install
```

3. **Setup environment variables**
```bash
cp .env.example .env.local
```

Edit `.env.local` and fill in your:
- Database URL
- JWT secret
- Email service credentials
- Cloudinary credentials (for image uploads)

4. **Setup database**
```bash
npx prisma db push
npx prisma db seed
```

5. **Run development server**
```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

## 📖 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register new parent
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Applications
- `POST /api/applications` - Submit application
- `GET /api/applications` - Get all applications (admin)
- `GET /api/applications/[id]` - Get application details
- `PATCH /api/applications/[id]` - Update application status

### Branches
- `GET /api/branches` - Get all branches
- `POST /api/branches` - Create branch (admin)
- `PATCH /api/branches/[id]` - Update branch
- `DELETE /api/branches/[id]` - Delete branch

### Events
- `GET /api/events` - Get events
- `POST /api/events` - Create event (admin)
- `POST /api/events/[id]/rsvp` - RSVP to event

### Gallery
- `GET /api/gallery` - Get gallery images
- `POST /api/gallery` - Upload image (admin)

### Announcements
- `GET /api/announcements` - Get announcements
- `POST /api/announcements` - Create announcement (admin)

### Admin
- `GET /api/admin/dashboard` - Dashboard statistics
- `POST /api/admin/auth/create-account` - Create admin account

## 🗄️ Database Schema

The application uses Prisma with PostgreSQL. Key models:

- **User**: Login accounts (Admin, Parent, Staff)
- **Parent**: Parent information
- **Child**: Student information
- **Branch**: School locations
- **Application**: Admission applications
- **Event**: School events
- **Announcement**: News and updates
- **Gallery**: Photo gallery
 - **Invoice**: (Removed — billing not part of public site)
- **Attendance**: Student attendance

See `prisma/schema.prisma` for complete schema.

## 🔐 Security Features

- Password hashing with bcryptjs
- JWT-based authentication
- Role-based access control (RBAC)
- SQL injection prevention (Prisma)
- XSS protection with React
- CSRF protection
- Secure headers configuration
- Environment variable validation

## 📱 Responsive Design

The application is fully responsive and tested on:
- Mobile devices (iOS, Android)
- Tablets (iPad, Android tablets)
- Desktop (1024px and above)

## 🎨 Customization

### Colors
Edit `tailwind.config.ts` to customize the color scheme. Default colors:
- **Primary**: Blue (#0b8eff)
- **Secondary**: Red (#eb5757)
- **Accent**: Amber (#f59e0b)

### Content
Update school information in:
- `.env.local` - Site configuration
- `src/components/sections/` - Home page sections
- `src/app/about/` - About page content

## 📧 Email Configuration

The application supports email notifications via Nodemailer. Configure in `.env.local`:

```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM=noreply@anointedtrinity.co.za
```

## 🚢 Deployment

### Vercel (Recommended)
```bash
vercel
```

### Docker
```bash
docker build -t anointed-trinity .
docker run -p 3000:3000 anointed-trinity
```

### Traditional Server
```bash
npm run build
npm start
```

## 📝 Environment Variables

See `.env.example` for all required environment variables:

```
DATABASE_URL=...
JWT_SECRET=...
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=...
SMTP_HOST=...
SMTP_PORT=...
SMTP_USER=...
SMTP_PASSWORD=...
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is proprietary to Anointed Trinity Pre-School.

## 📞 Support

For support, contact: support@anointedtrinity.co.za

## 🎓 Educational Use

This project demonstrates:
- Next.js 15 with App Router
- TypeScript best practices
- Database design with Prisma
- Authentication and authorization
- File uploads and email services
- Responsive UI design
- Form handling and validation

## 🔄 Updates & Maintenance

- Regular security updates
- Feature additions based on feedback
- Performance optimizations
- Database backups
- Monitoring and logging

---

**Built with ❤️ for Anointed Trinity Pre-School**
