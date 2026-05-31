# Setup Guide - Anointed Trinity Pre-School

## Quick Start (5 minutes)

### 1. Clone Repository
```bash
git clone https://github.com/your-username/anointed-trinity-preschool.git
cd anointed-trinity-preschool
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables
```bash
cp .env.example .env.local
```

Edit `.env.local` and fill in:
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Random secret key
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` - Your Cloudinary account
- Email SMTP credentials
- (Optional) Google Maps API key

### 4. Setup Database
```bash
# Create database schema
npm run db:push

# Populate with sample data
npm run db:seed
```

### 5. Start Development Server
```bash
npm run dev
```

Visit http://localhost:3000

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── auth/              # Login/Register pages
│   ├── admin/             # Admin dashboard
│   ├── portal/            # Parent portal
│   └── [pages]/           # Public pages
├── components/            # Reusable React components
│   ├── ui/               # UI component library
│   ├── layout/           # Layout components
│   └── sections/         # Page section components
├── lib/                  # Core utilities
├── types/                # TypeScript definitions
└── utils/                # Helper functions

prisma/
├── schema.prisma         # Database schema
└── seed.ts              # Seed data script

public/                   # Static assets
docs/                    # Documentation
```

## Development Workflow

### Common Commands

```bash
# Development
npm run dev              # Start dev server
npm run build           # Production build
npm run start           # Start production server
npm run lint            # Run ESLint
npm run type-check      # Run TypeScript check
npm run format          # Format code with Prettier

# Database
npm run db:push         # Sync schema to database
npm run db:generate     # Generate Prisma client
npm run db:seed         # Populate with test data
npm run db:studio       # Open database UI

# Testing
npm run test            # Run Jest tests
npm run test:watch      # Watch mode tests
```

### Code Style

- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS
- **Formatting**: Prettier
- **Linting**: ESLint
- **Animations**: Framer Motion

### Before Committing

```bash
npm run format          # Auto-fix formatting
npm run lint            # Check for errors
npm run type-check      # Verify types
npm test                # Run tests
```

## Database Setup

### Local Development

```bash
# PostgreSQL must be running
# Option 1: Docker
docker-compose up -d

# Option 2: Local PostgreSQL
psql -U postgres -c "CREATE DATABASE anointed_trinity_db;"
psql -U postgres -c "CREATE USER anointed WITH PASSWORD 'trinity_password';"

# Then run migrations
npm run db:push
npm run db:seed
```

### Test Data Accounts

After seeding, login with:

**Admin Account**
- Email: admin@anointedtrinity.co.za
- Password: AdminPass123! (change immediately)

**Parent Account**
- Email: parent@anointedtrinity.co.za
- Password: ParentPass123!

## Testing

### Manual Testing

1. **Parent Registration**
   - Visit /auth/register
   - Fill form and submit
   - Verify email sent

2. **Admission Application**
   - Login as parent
   - Go to /admissions
   - Complete multi-step form
   - Check admin dashboard for new application

3. **Admin Functions**
   - Login as admin at /admin/login
   - View applications
   - Approve/Reject applications
   - Manage gallery, events, announcements

### Automated Testing

```bash
# Run all tests
npm test

# Watch mode
npm test -- --watch

# Coverage report
npm test -- --coverage
```

## Troubleshooting

### Database Connection Error
```bash
# Check DATABASE_URL in .env.local
# Verify PostgreSQL is running
psql $DATABASE_URL -c "SELECT 1"
```

### Port Already In Use
```bash
# Change port
npm run dev -- -p 3001
```

### Prisma Client Error
```bash
# Regenerate Prisma client
npm run db:generate
```

### Build Fails
```bash
# Clear cache and rebuild
rm -rf .next
npm run build
```

### Email Not Sending
- Verify SMTP credentials in .env.local
- Check email service (Gmail, SendGrid) settings
- Test email: Visit Contact page and submit form
- Check console output for errors

## Environment Variables Explained

```env
# Database connection string
# Format: postgresql://username:password@host:port/database
DATABASE_URL="postgresql://anointed:trinity@localhost:5432/anointed_trinity_db"

# JWT secret - use strong random string
JWT_SECRET="your-random-secret-key-min-32-chars"

# Site URL for email links
NEXT_PUBLIC_SITE_URL="http://localhost:3000"

# Cloudinary image hosting (optional)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-account"
CLOUDINARY_API_KEY="your-key"
CLOUDINARY_API_SECRET="your-secret"

# Email service
SMTP_HOST="smtp.gmail.com"           # Gmail or your provider
SMTP_PORT=587                        # Usually 587 or 465
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="app-password"         # Gmail: use App Password
SMTP_FROM="noreply@anointedtrinity.co.za"

# Admin creation secret
ADMIN_SECRET="strong-secret"

# Environment
NODE_ENV="development"               # development or production
```

## Customization

### Branding
- Logo: Replace in `public/logo.png`
- Colors: Update `tailwind.config.ts`
- Fonts: Modify `src/app/globals.css`
- School info: Edit components and environment variables

### Content
- Home page: `src/app/page.tsx`
- About page: `src/app/about/page.tsx`
- Footer: `src/components/layout/Footer.tsx`
- Navigation: `src/components/layout/Header.tsx`

### Features
- Add new pages in `src/app/`
- Create API routes in `src/app/api/`
- Add components in `src/components/`
- Define types in `src/types/`

## Performance Tips

1. **Images**
   - Use Cloudinary for image hosting
   - Optimize before upload
   - Use WebP format when possible

2. **Database**
   - Monitor slow queries
   - Add indices for frequently searched fields
   - Regular backups

3. **Caching**
   - Enable browser caching
   - Use CDN for static assets
   - Cache API responses

4. **Monitoring**
   - Track error rates
   - Monitor page load times
   - Alert on failures

## Security Checklist

- [ ] Change JWT_SECRET to unique value
- [ ] Update admin credentials
- [ ] Enable HTTPS in production
- [ ] Configure CORS properly
- [ ] Use environment variables for secrets
- [ ] Enable rate limiting
- [ ] Regular security updates
- [ ] SQL injection prevention (Prisma)
- [ ] XSS protection (React)
- [ ] CSRF protection enabled

## Getting Help

- **Documentation**: Check `docs/` folder
- **API Reference**: See `docs/API.md`
- **Database Schema**: See `docs/DATABASE.md`
- **Deployment**: See `docs/DEPLOYMENT.md`
- **Issues**: Create GitHub issue with details
- **Support Email**: support@anointedtrinity.co.za

## Next Steps

1. ✅ Clone and setup locally
2. ✅ Explore admin dashboard
3. ✅ Test parent portal flow
4. ✅ Review API documentation
5. 📝 Customize branding
6. 🧪 Run automated tests
7. 📊 Setup monitoring
8. 🚀 Deploy to production

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs)

---

**Happy developing! 🎉**
