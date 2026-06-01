# Setup Admin Account and Add Branches

Once your Vercel deployment is live, use these commands to set up your admin account and add branches.

## Step 1: Create Admin Account

Replace `YOUR_SITE_URL` with your Vercel deployment URL (e.g., `https://anointed-trinity-creche-pre-school-website-m5p4bz3wa.vercel.app`)

### Using PowerShell:

```powershell
$baseUrl = "YOUR_SITE_URL"  # Replace with your Vercel URL

$adminData = @{
  firstName = "Admin"
  lastName = "User"
  email = "admin@anointedtrinity.co.za"
  password = "AdminPassword123!"
  adminSecret = "test-admin-secret"
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri "$baseUrl/api/admin/auth/create-account" `
  -Method POST `
  -ContentType "application/json" `
  -Body $adminData

$response.Content | ConvertFrom-Json | ConvertTo-Json
```

### Using cURL:

```bash
curl -X POST https://YOUR_SITE_URL/api/admin/auth/create-account \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Admin",
    "lastName": "User",
    "email": "admin@anointedtrinity.co.za",
    "password": "AdminPassword123!",
    "adminSecret": "test-admin-secret"
  }'
```

## Step 2: Login to Admin Panel

1. Go to: `YOUR_SITE_URL/admin/login`
2. Email: `admin@anointedtrinity.co.za`
3. Password: `AdminPassword123!`

## Step 3: Add Branches via Admin Panel

1. After login, go to **Admin Dashboard** → **Branches**
2. Click **Add Branch** button
3. Fill in the following information for each branch:

### Sample Branch 1 - Polokwane Central

- **Name:** Anointed Trinity Pre-school
- **Address:** 84 Dorp St, Polokwane Central, Polokwane, 0700
- **City:** Polokwane Central
- **Province:** Limpopo
- **Postal Code:** 0700
- **Country:** South Africa
- **Phone Number:** 0152970755
- **Email:** polokwane@anointedtrinity.co.za
- **Manager Name:** Ms. Grace Makhura
- **Opening Hours:** Mon–Fri, 06:30 – 17:30
- **Number of Classes:** 10
- **Description:** Central Polokwane preschool with warm care, interactive classrooms and aftercare support.
- **Latitude:** -23.9045
- **Longitude:** 29.4689

### Sample Branch 2 - Mankweng

- **Name:** Anointed Trinity Creche And Pre-School
- **Address:** Stand No 610, Mankweng, Polokwane, Limpopo, South Africa
- **City:** Mankweng
- **Province:** Limpopo
- **Postal Code:** 0500
- **Country:** South Africa
- **Phone Number:** 0152970755
- **Email:** mankweng@anointedtrinity.co.za
- **Manager Name:** Ms. Naledi Mothabane
- **Opening Hours:** Mon–Fri, 06:00 – 18:00
- **Number of Classes:** 8
- **Description:** Mankweng branch offering quality early childhood education with experienced staff and modern facilities.
- **Latitude:** -23.9156
- **Longitude:** 29.3889

## Step 4: Add Sample Branches via API (Optional)

You can also add branches directly using the API:

### Using PowerShell:

```powershell
# First login and get the session/token
$loginData = @{
  email = "admin@anointedtrinity.co.za"
  password = "AdminPassword123!"
} | ConvertTo-Json

# Create branch
$branchData = @{
  name = "Anointed Trinity Pre-school"
  address = "84 Dorp St, Polokwane Central, Polokwane, 0700"
  city = "Polokwane Central"
  province = "Limpopo"
  postalCode = "0700"
  country = "South Africa"
  phoneNumber = "0152970755"
  email = "polokwane@anointedtrinity.co.za"
  managerName = "Ms. Grace Makhura"
  openingHours = "Mon–Fri, 06:30 – 17:30"
  numberOfClasses = 10
  description = "Central Polokwane preschool with warm care, interactive classrooms and aftercare support."
  latitude = -23.9045
  longitude = 29.4689
  images = @()
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri "https://YOUR_SITE_URL/api/branches" `
  -Method POST `
  -ContentType "application/json" `
  -Body $branchData `
  -SessionVariable "session"

$response.Content | ConvertFrom-Json | ConvertTo-Json
```

## Verification

Once branches are added, verify them:

1. Go to: `YOUR_SITE_URL` (home page)
2. Scroll to "Our Branches" section
3. Should show the branches you added
4. Click on each branch to see details

## Environment Variables (for reference)

- `ADMIN_SECRET`: "test-admin-secret" (used for creating first admin account)
- Database: Supabase PostgreSQL
- Authentication: NextAuth with JWT

## Troubleshooting

- If login doesn't work, clear browser cookies and try again
- If branches don't appear, refresh the page
- Check browser console (F12) for any errors
- Verify database connection in Supabase dashboard
